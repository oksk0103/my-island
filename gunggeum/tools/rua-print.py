#!/usr/bin/env python3
# 루아 신문 아침 자동 인쇄 (폴드4 · Termux) — v185
#
#   python rua-print.py probe   집 와이파이에서 프린터를 찾아 기억하고, 프린터가 받는 파일 종류를 보여 준다
#   python rua-print.py test    오늘 날짜와 상관없이 가장 최근 종이판을 지금 뽑는다(설치 확인용)
#   python rua-print.py         (매일 아침 cron이 부름) 오늘 신문이 있고 아직 안 뽑았으면 뽑는다
#
# 프린터에는 인터넷이 아니라 집 와이파이 안에서 IPP(631번)로 바로 보낸다. 안드로이드 인쇄 창을 거치지 않는다.
# 바깥 라이브러리는 쓰지 않는다. 프린터가 JPEG·PDF를 못 받고 PWG 래스터만 받을 때만 Pillow가 필요하다
# (pkg install python-pillow).
import json, os, socket, struct, sys, time, urllib.request, http.client, datetime, concurrent.futures

BASE = os.environ.get('RUA_BASE', 'https://raw.githubusercontent.com/oksk0103/my-island/paper/')
HOME = os.environ.get('RUA_HOME', os.path.expanduser('~'))
CONF = os.path.join(HOME, '.rua-print.json')
LOG = os.path.join(HOME, 'rua-print.log')
KST = datetime.timezone(datetime.timedelta(hours=9))
PATHS = ['/ipp/print', '/ipp', '/ipp/printer', '/printers/ipp', '/']


def log(*a):
    line = datetime.datetime.now(KST).strftime('%m-%d %H:%M:%S ') + ' '.join(str(x) for x in a)
    print(line)
    try:
        with open(LOG, 'a', encoding='utf-8') as f:
            f.write(line + '\n')
        with open(LOG, encoding='utf-8') as f:
            lines = f.readlines()
        if len(lines) > 400:
            with open(LOG, 'w', encoding='utf-8') as f:
                f.writelines(lines[-300:])
    except OSError:
        pass


def load(path, default):
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    except (OSError, ValueError):
        return default


def save(path, obj):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)


# ---------- IPP ----------
def attr(tag, name, value):
    v = value if isinstance(value, bytes) else (struct.pack('>i', value) if isinstance(value, int) else value.encode('utf-8'))
    n = name.encode()
    return bytes([tag]) + struct.pack('>H', len(n)) + n + struct.pack('>H', len(v)) + v


def ipp_request(op, uri, extra_op=b'', job=b'', req_id=1):
    body = struct.pack('>HHI', 0x0200, op, req_id) + b'\x01'
    body += attr(0x47, 'attributes-charset', 'utf-8') + attr(0x48, 'attributes-natural-language', 'en')
    body += attr(0x45, 'printer-uri', uri) + attr(0x42, 'requesting-user-name', 'rua') + extra_op
    if job:
        body += b'\x02' + job
    return body + b'\x03'


def ipp_parse(data):
    status = struct.unpack('>H', data[2:4])[0]
    out, i, last = {}, 8, None
    while i < len(data):
        tag = data[i]; i += 1
        if tag == 0x03:
            break
        if tag < 0x10:
            continue
        nl = struct.unpack('>H', data[i:i + 2])[0]; i += 2
        name = data[i:i + nl].decode('utf-8', 'replace'); i += nl
        vl = struct.unpack('>H', data[i:i + 2])[0]; i += 2
        raw = data[i:i + vl]; i += vl
        if tag in (0x21, 0x23) and vl == 4:
            val = struct.unpack('>i', raw)[0]
        elif tag == 0x22:
            val = bool(raw[0]) if raw else False
        elif tag == 0x32 and vl == 9:
            val = struct.unpack('>iib', raw)[:2]
        elif tag >= 0x40:
            val = raw.decode('utf-8', 'replace')
        else:
            val = raw.hex()
        if name:
            last = name
            out.setdefault(name, []).append(val)
        elif last:
            out[last].append(val)
    return status, out


def ipp_post(host, path, body, timeout=60):
    c = http.client.HTTPConnection(host, 631, timeout=timeout)
    c.request('POST', path, body, {'Content-Type': 'application/ipp'})
    r = c.getresponse()
    data = r.read()
    c.close()
    if r.status != 200:
        raise IOError('HTTP %d' % r.status)
    return ipp_parse(data)


def printer_attrs(host, path):
    uri = 'ipp://%s:631%s' % (host, path)
    st, a = ipp_post(host, path, ipp_request(0x000B, uri), timeout=8)
    if st >= 0x0100:
        raise IOError('IPP 상태 0x%04x' % st)
    return a


# ---------- 프린터 찾기 ----------
def my_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        return s.getsockname()[0]
    finally:
        s.close()


def open631(ip):
    try:
        with socket.create_connection((ip, 631), timeout=0.6):
            return ip
    except OSError:
        return None


def discover():
    me = my_ip()
    net = me.rsplit('.', 1)[0]
    log('내 주소', me, '→', net + '.0/24 에서 프린터를 찾는 중')
    with concurrent.futures.ThreadPoolExecutor(64) as ex:
        hosts = [h for h in ex.map(open631, ['%s.%d' % (net, n) for n in range(1, 255)]) if h and h != me]
    found = []
    for h in hosts:
        for p in PATHS:
            try:
                a = printer_attrs(h, p)
                found.append((h, p, a))
                break
            except Exception:
                continue
    return found


def get_printer(force=False):
    c = load(CONF, {})
    if c.get('host') and not force:
        try:
            return c['host'], c['path'], printer_attrs(c['host'], c['path'])
        except Exception as e:
            log('기억해 둔 프린터', c['host'], '응답 없음(', e, ') → 다시 찾음')
    found = discover()
    if not found:
        raise SystemExit('프린터를 못 찾았어요. 폴드와 프린터가 같은 와이파이에 있는지, 프린터가 켜져 있는지 봐 주세요.')
    samsung = [f for f in found if 'samsung' in ' '.join(f[2].get('printer-make-and-model', [''])).lower()]
    h, p, a = (samsung or found)[0]
    c.update(host=h, path=p, model=a.get('printer-make-and-model', ['?'])[0])
    save(CONF, c)
    log('프린터 기억함:', c['model'], h + p)
    return h, p, a


# ---------- PWG 래스터 (프린터가 JPEG·PDF를 못 받을 때만) ----------
def pwg_page(img, dpi, total):
    w, h = img.size
    hdr = bytearray(1796)
    hdr[0:9] = b'PwgRaster'
    hdr[1732:1732 + 16] = b'iso_a4_210x297mm'
    def u32(off, v):
        struct.pack_into('>I', hdr, off, v)
    u32(276, dpi); u32(280, dpi)
    u32(340, 1)                       # NumCopies
    u32(352, 595); u32(356, 842)      # PageSize (pt)
    u32(372, w); u32(376, h)
    u32(384, 8); u32(388, 8); u32(392, w)
    u32(396, 0); u32(400, 18)         # chunky, sgray
    u32(420, 1); u32(452, total); u32(456, 1); u32(460, 1)
    out = bytearray(hdr)
    px = img.tobytes()
    white = b'\xff' * w
    y = 0
    while y < h:
        line = px[y * w:(y + 1) * w]
        rep = 0
        while y + rep + 1 < h and rep < 255 and px[(y + rep + 1) * w:(y + rep + 2) * w] == line:
            rep += 1
        out.append(rep)
        if line == white:
            out.append(0x80)          # 줄 나머지를 흰색으로
        else:
            x = 0
            while x < w:
                run = 1
                while x + run < w and run < 128 and line[x + run] == line[x]:
                    run += 1
                if run > 1:
                    out.append(run - 1); out.append(line[x]); x += run
                else:
                    s = x
                    while x < w and x - s < 128 and (x + 1 >= w or line[x + 1] != line[x]):
                        x += 1
                    if x == s:
                        x += 1
                    n = x - s
                    out.append(257 - n if n > 1 else 0); out += line[s:x]
        y += rep + 1
    return bytes(out)


def to_pwg(jpgs, dpi):
    from PIL import Image  # pkg install python-pillow
    data = bytearray(b'RaS2')
    for f in jpgs:
        im = Image.open(f).convert('L')
        im = im.resize((round(8.2677 * dpi), round(11.6929 * dpi)))
        data += pwg_page(im, dpi, len(jpgs))
    return bytes(data)


# ---------- 인쇄 ----------
def fetch(name, dest):
    with urllib.request.urlopen(BASE + name + '?t=%d' % time.time(), timeout=60) as r, open(dest, 'wb') as f:
        f.write(r.read())
    return dest


def print_job(host, path, attrs, fmt, payload, name):
    uri = 'ipp://%s:631%s' % (host, path)
    job = b''
    sup = lambda k, v: v in attrs.get(k, [])
    if sup('media-supported', 'iso_a4_210x297mm'):
        job += attr(0x44, 'media', 'iso_a4_210x297mm')
    if sup('print-color-mode-supported', 'monochrome'):
        job += attr(0x44, 'print-color-mode', 'monochrome')
    if sup('print-scaling-supported', 'fit'):
        job += attr(0x44, 'print-scaling', 'fit')
    op = attr(0x42, 'job-name', name) + attr(0x49, 'document-format', fmt)
    st, a = ipp_post(host, path, ipp_request(0x0002, uri, op, job) + payload, timeout=180)
    if st >= 0x0100:
        raise IOError('프린터가 거절함 (IPP 0x%04x) %s' % (st, a.get('status-message', [''])[0]))
    return a.get('job-id', ['?'])[0]


def run(force=False):
    state = load(os.path.join(HOME, '.rua-print-state.json'), {})
    man = json.loads(urllib.request.urlopen(BASE + 'latest.json?t=%d' % time.time(), timeout=30).read())
    today = datetime.datetime.now(KST).strftime('%Y-%m-%d')
    if not force:
        if man['date'] != today:
            return log('오늘(%s) 종이판이 아직 없음 (최근 %s) → 건너뜀' % (today, man['date']))
        if state.get('printed') == man['date']:
            return log('오늘 것은 이미 뽑았음 → 건너뜀')
    host, path, a = get_printer()
    fmts = a.get('document-format-supported', [])
    tmp = os.path.join(HOME, '.rua-paper'); os.makedirs(tmp, exist_ok=True)
    jpgs = [fetch(p, os.path.join(tmp, p)) for p in man['pages']]
    title = '루아 신문 제%s호' % man.get('no', '')
    if 'image/jpeg' in fmts:
        ids = [print_job(host, path, a, 'image/jpeg', open(f, 'rb').read(), '%s %d면' % (title, i + 1)) for i, f in enumerate(jpgs)]
        how = 'JPEG'
    elif 'application/pdf' in fmts:
        pdf = fetch(man['pdf'], os.path.join(tmp, man['pdf']))
        ids = [print_job(host, path, a, 'application/pdf', open(pdf, 'rb').read(), title)]
        how = 'PDF'
    elif 'image/pwg-raster' in fmts:
        res = a.get('pwg-raster-document-resolution-supported', [(300, 300)])
        dpi = 300 if any(r[0] == 300 for r in res if isinstance(r, tuple)) else (res[0][0] if isinstance(res[0], tuple) else 300)
        ids = [print_job(host, path, a, 'image/pwg-raster', to_pwg(jpgs, dpi), title)]
        how = 'PWG %ddpi' % dpi
    else:
        raise SystemExit('이 프린터가 받는 파일 종류를 몰라요: %s' % ', '.join(fmts))
    state['printed'] = man['date']
    save(os.path.join(HOME, '.rua-print-state.json'), state)
    log('뽑음:', title, man['date'], how, '작업', ids)


def probe():
    host, path, a = get_printer(force=True)
    show = ['printer-make-and-model', 'printer-state', 'document-format-supported', 'media-supported',
            'print-color-mode-supported', 'sides-supported', 'pwg-raster-document-type-supported',
            'pwg-raster-document-resolution-supported', 'print-scaling-supported']
    print('\n프린터: ipp://%s:631%s' % (host, path))
    for k in show:
        if k in a:
            print(' ', k, '=', ', '.join(str(v) for v in a[k][:14]))


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    try:
        if cmd == 'probe':
            probe()
        elif cmd == 'test':
            run(force=True)
        else:
            run()
    except SystemExit as e:
        log('멈춤:', e)
        sys.exit(1)
    except Exception as e:
        log('오류:', type(e).__name__, e)
        sys.exit(1)

#!/usr/bin/env python3
# 쓰는 법: python3 tools/mksky.py  (numpy · Pillow 필요) → gunggeum/bg/wx-*.webp 를 다시 만든다. 어떤 코드가 어떤 그림을 쓰는지는 index.html 의 renderWx() 참고
# 날씨 화면의 하늘 그림을 직접 만든다(바깥 그림·사진 없음): numpy 잡음 구름 + PIL 흐림 → app/bg/aa-*.webp (1600×820, 각 120KB 이하)
# 구도: 가운데 넓은 띠는 밝은 하늘빛, 작은 글자가 놓이는 위 띠(~110)와 아래 띠(590~)는 넓은 기울기로 깊어진다. 왼쪽(큰 기온 자리)은 조금 깊게.
# 구름은 덩어리 하나가 아니라 가로로 긴 얇은 조각 여러 겹이 흩어진다.
import numpy as np, pathlib, os
from PIL import Image, ImageFilter
W, H = 1600, 820; OUT = pathlib.Path(__file__).parent.parent / 'bg'
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); X = xx / W; Y = yy / H
def sstep(a, b, v): t = np.clip((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
def fbm(seed, gx, gy, octaves=6, gain=.55):
    r = np.random.default_rng(seed); out = np.zeros((H, W), np.float32); amp = 1.0; tot = 0
    for o in range(octaves):
        g = Image.fromarray((r.random((int(gy * 2 ** o) + 2, int(gx * 2 ** o) + 2)) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
        out += np.asarray(g, np.float32) / 255 * amp; tot += amp; amp *= gain
    out /= tot; return (out - out.min()) / (out.max() - out.min())
def blur(a, r): return np.asarray(Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r)), np.float32) / 255
def wisps(seed, cover=.5, soft=3):  # 가로로 긴 얇은 구름 조각: 세로가 촘촘한 잡음 × 듬성듬성한 큰 얼룩
    fine = fbm(seed, 2.2, 7, 6); patch = fbm(seed + 1, 2.5, 2.2, 3); puff = fbm(seed + 2, 5, 6, 5)
    m = sstep(1 - cover, 1 - cover + .22, fine * .62 + puff * .38) * sstep(.42, .68, patch)
    return blur(m, soft)
BAND = np.maximum(np.maximum((1 - sstep(56, 200, yy)), sstep(310, 500, yy) ** .9), .96 * (1 - sstep(.56, .90, X + (Y - .3) * .25)))  # 깊은 자리: 윗줄 · 아래 두 층 · 왼쪽(큰 기온과 날씨 말). 빛은 오른쪽 위에서 든다          # 위·아래 띠(작은 글자 자리): 0=가운데, 1=띠
LEFT = np.zeros((H, W), np.float32)                              # 왼쪽 가운데(큰 기온 자리)
def lerp(a, b, t): return np.array(a, np.float32) + (np.array(b, np.float32) - np.array(a, np.float32)) * t[..., None]
def save(name, img, q=97):   # 기울기의 잡티가 뭉개지지 않게 품질 90 이상. 장당 60~120KB
    im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)); p = OUT / f'wx-{name}.webp'
    while True:
        im.save(p, 'WEBP', quality=q, method=6)
        if os.path.getsize(p) <= 120_000 or q <= 90: break
        q -= 1
    back = np.asarray(Image.open(p).convert('L'), np.float32)[700:800, 200:1400]; flat = np.asarray(Image.open(p).convert('L').filter(ImageFilter.GaussianBlur(5)), np.float32)[700:800, 200:1400]
    print(name, os.path.getsize(p), 'q', q, '깊은 띠 잡티 std %.2f' % (back - flat).std(), flush=True)
grain = np.random.default_rng(1).normal(0, 1.6, (H, W, 1)).astype(np.float32)
def compose(mid_l, mid_r, deep, left, cloud_col, seed, cover, calpha):
    sky = lerp(mid_l, mid_r, sstep(.05, .95, X) * .85 + Y * .15)          # 가운데 띠: 왼쪽에서 오른쪽으로 밝아진다
    sky = sky + (np.array(left, np.float32) - sky) * (LEFT * .9)[..., None]
    sky = sky + (np.array(deep, np.float32) - sky) * BAND[..., None]
    c = np.clip(wisps(seed, cover) + .7 * wisps(seed + 7, cover * .8, 5) + .5 * wisps(seed + 13, cover * .7, 1.6), 0, 1)
    a = c * calpha * (1 - .93 * BAND)                  # 글자 자리에서는 구름을 옅게
    shade = blur(np.roll(c, 14, axis=0), 9) * .10 * (1 - BAND)           # 구름 아랫면의 옅은 그늘
    sky = sky * (1 - shade[..., None])
    return sky * (1 - a[..., None]) + np.array(cloud_col, np.float32) * a[..., None]
# AE — 맑음·흐림: 위는 밝은 하늘, 아래로 340px에 걸쳐 깊어지고 띠 안에서도 계속 조금씩 깊어진다(판·지평선으로 읽히지 않게)
YW = yy + 60 * blur(fbm(77, 3, 1.2, 3), 30)          # 깊어지는 자리를 느린 잡음으로 흔든다
G = sstep(340, 680, YW + 80 * sstep(.5, .9, X)) ** .62   # 오른쪽 밝은 쪽은 y260부터 천천히
DEEPT = sstep(540, 820, yy)
NUM = 1 - sstep(.58, .84, X - (Y - .3) * .9)   # 빛은 오른쪽 위에서 쐐기로 든다: 윗줄은 x≈640부터, 한마디 줄(y≈330)은 x≈1070부터 밝아진다        # 큰 기온 뒤 왼쪽 위만 한 단 푸르게. x≈480부터 밝아진다
def compose2(left, right, deep0, deep1, cloud_col, seed, cover, calpha):
    sky = lerp(right, left, NUM)
    c = np.clip(wisps(seed, cover) + .7 * wisps(seed + 7, cover * .8, 5) + .55 * wisps(seed + 13, cover * .7, 1.6), 0, 1)
    a = c * calpha * (1 - .92 * NUM) * (1 - G) ** 1.5
    shade = blur(np.roll(c, 14, axis=0), 9) * .08 * (1 - G)
    sky = sky * (1 - shade[..., None]); sky = sky * (1 - a[..., None]) + np.array(cloud_col, np.float32) * a[..., None]
    return sky + (lerp(deep0, deep1, DEEPT) - sky) * G[..., None]
# ================= AH: 바탕 하늘 아홉 장(시간대 × 구름 정도) + 움직이는 겹의 조각 그림 =================
# 바탕에는 먼 구름만 조금 굽고, 흐르는 구름·비·눈·안개는 따로 겹으로 얹는다(CSS transform).
from PIL import ImageDraw
def night_base():
    sky = compose((22, 30, 84), (34, 44, 104), (8, 12, 42), (18, 24, 72), (96, 108, 170), 41, .42, .32)
    r = np.random.default_rng(9); stars = np.zeros((H, W), np.float32); big = np.zeros((H, W), np.float32)
    for _ in range(420):
        x, y = r.integers(3, W - 3), int(r.beta(1.1, 1.9) * (H - 6)) + 3; b = r.uniform(.2, 1) ** 2.2; k = r.random()
        if k < .78: stars[y, x] = max(stars[y, x], b)
        elif k < .96: stars[y - 1:y + 1, x - 1:x + 1] = np.maximum(stars[y - 1:y + 1, x - 1:x + 1], b)
        else: big[y - 1:y + 2, x - 1:x + 2] = 1
    stars = np.clip(blur(stars, .6) * 2.2 + blur(big, 1.3) * 1.6 + blur(big, 5) * .9, 0, 1)
    return sky + 240 * (stars * (1 - .6 * BAND))[..., None]
save('day-clear', compose2((60, 140, 220), (158, 212, 244), (20, 96, 172), (10, 64, 130), (252, 254, 255), 11, .40, .22) + grain)   # 맑음: 구운 구름은 거의 없다
save('day-part', compose2((62, 138, 214), (170, 212, 240), (24, 96, 166), (12, 66, 128), (252, 254, 255), 17, .66, .7) + grain)
save('day-cloud', compose2((126, 138, 156), (176, 186, 198), (76, 88, 106), (60, 72, 90), (226, 230, 236), 23, .8, .6) + grain)
save('day-rain', compose2((64, 74, 88), (84, 94, 108), (46, 54, 66), (38, 46, 58), (124, 134, 148), 37, .8, .5) + grain)
save('day-snow', compose2((118, 134, 158), (186, 196, 210), (72, 86, 108), (54, 66, 86), (238, 242, 248), 29, .8, .55) + grain)
save('dusk-clear', compose2((112, 88, 150), (240, 162, 128), (52, 40, 98), (34, 28, 72), (255, 212, 176), 53, .5, .7) + grain)
save('dusk-cloud', compose2((104, 96, 124), (188, 160, 160), (58, 52, 80), (44, 40, 64), (214, 190, 186), 59, .8, .55) + grain)
save('night-clear', night_base() + grain * .8)
save('night-cloud', compose2((30, 36, 64), (58, 64, 96), (14, 18, 40), (10, 12, 30), (112, 120, 152), 61, .8, .5) + grain * .8)

# ---- 겹 조각 그림(투명 바탕) ----
def fbm2(seed, w, h, gx, gy, octaves=5, gain=.55):
    r = np.random.default_rng(seed); out = np.zeros((h, w), np.float32); amp = 1.0; tot = 0
    for o in range(octaves):
        g = Image.fromarray((r.random((int(gy * 2 ** o) + 2, int(gx * 2 ** o) + 2)) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        out += np.asarray(g, np.float32) / 255 * amp; tot += amp; amp *= gain
    out /= tot; return (out - out.min()) / (out.max() - out.min())
def tile_x(a):  # 가로로 이어 붙여도 이음매가 없게: 반 바퀴 민 것과 가장자리에서 섞는다
    w = a.shape[1]; x = np.arange(w, dtype=np.float32); d = np.minimum(x, w - 1 - x) / (w * .25); k = 1 - np.clip(d, 0, 1); k = k * k * (3 - 2 * k)
    return a * (1 - k)[None, :] + np.roll(a, w // 2, axis=1) * k[None, :]
def gblur(a, r): return np.asarray(Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r)), np.float32) / 255
def save_rgba(name, alpha, col=(255, 255, 255), lossless=False, q=82):
    h, w = alpha.shape; im = np.zeros((h, w, 4), np.uint8); im[..., :3] = col; im[..., 3] = np.clip(alpha * 255, 0, 255)
    p = OUT / f'wx-{name}.webp'; Image.fromarray(im, 'RGBA').save(p, 'WEBP', lossless=lossless, quality=q, method=6, exact=True); print(name, os.path.getsize(p), flush=True)
def cloud_strip(seed, cover, soft, w=2400, h=460):
    fine = tile_x(fbm2(seed, w, h, 3.4, 6, 6)); patch = tile_x(fbm2(seed + 1, w, h, 4, 2, 3)); puff = tile_x(fbm2(seed + 2, w, h, 8, 5, 5))
    m = sstep(1 - cover, 1 - cover + .22, fine * .62 + puff * .38) * sstep(.42, .68, patch)
    vy = np.linspace(0, 1, h, dtype=np.float32)[:, None]; m = m * sstep(0, .12, vy) * (1 - sstep(.62, 1, vy))      # 위아래 끝은 사라지게
    return gblur(m, soft)
save_rgba('cloud-a', cloud_strip(101, .50, 3) * .85)                       # 얇은 흰 구름
save_rgba('cloud-b', cloud_strip(131, .72, 5) * .8, col=(226, 230, 238))   # 두꺼운 회색 구름(흐림·비·눈·밤)
fog = tile_x(fbm2(171, 2400, 300, 5, 1.6, 4)); vy = np.linspace(0, 1, 300, dtype=np.float32)[:, None]
save_rgba('fog', gblur(sstep(.35, .8, fog) * sstep(0, .35, vy) * (1 - sstep(.6, 1, vy)), 8) * .8, col=(236, 240, 244))
def rain_tile(seed, n, lmin, lmax, amax, tw=256, th=512, slant=.25):
    r = np.random.default_rng(seed); im = Image.new('L', (tw * 3, th * 3), 0); d = ImageDraw.Draw(im)
    for _ in range(n):
        x0, y0 = r.uniform(0, tw), r.uniform(0, th); L = r.uniform(lmin, lmax); a = int(r.uniform(.45, 1) * amax * 255); wd = 2 if r.random() < .25 else 1
        for ox in (0, tw, 2 * tw):
            for oy in (0, th, 2 * th): d.line([(x0 + ox, y0 + oy), (x0 + ox - L * slant, y0 + oy + L)], fill=a, width=wd)
    a = np.asarray(im.filter(ImageFilter.GaussianBlur(.6)), np.float32)[th:2 * th, tw:2 * tw] / 255
    return a
save_rgba('rain-1', rain_tile(5, 9, 12, 26, .30), lossless=True)     # 이슬비: 드물고 짧게
save_rgba('rain-2', rain_tile(6, 18, 24, 56, .36), lossless=True)    # 비
save_rgba('rain-3', rain_tile(7, 30, 40, 90, .42), lossless=True)    # 소나기·많은 비
def snow_tile(seed, n, rmin, rmax, tw=256, th=256):
    r = np.random.default_rng(seed); im = Image.new('L', (tw * 3, th * 3), 0); d = ImageDraw.Draw(im)
    for _ in range(n):
        x0, y0, rad, a = r.uniform(0, tw), r.uniform(0, th), r.uniform(rmin, rmax), int(r.uniform(.5, 1) * 255)
        for ox in (0, tw, 2 * tw):
            for oy in (0, th, 2 * th): d.ellipse([x0 + ox - rad, y0 + oy - rad, x0 + ox + rad, y0 + oy + rad], fill=a)
    return np.asarray(im.filter(ImageFilter.GaussianBlur(.9)), np.float32)[th:2 * th, tw:2 * tw] / 255
def snow_tile2(seed, n, rmin, rmax, soft, amin, amax, t):   # 크기·밝기·흐림이 불규칙한 눈송이를 잡음으로 흩는다(큰 조각이라 반복이 눈에 안 띈다)
    r = np.random.default_rng(seed); out = np.zeros((t, t), np.float32)
    for _ in range(n):
        x0, y0, rad, a, sf = r.uniform(0, t), r.uniform(0, t), r.uniform(rmin, rmax), r.uniform(amin, amax), soft * r.uniform(.7, 1.4)
        im = Image.new('L', (t * 3, t * 3), 0); d = ImageDraw.Draw(im)
        for ox in (0, t, 2 * t):
            for oy in (0, t, 2 * t): d.ellipse([x0 + ox - rad, y0 + oy - rad * r.uniform(.85, 1.15), x0 + ox + rad, y0 + oy + rad], fill=int(a * 255))
        out = np.maximum(out, np.asarray(im.filter(ImageFilter.GaussianBlur(sf)), np.float32)[t:2 * t, t:2 * t] / 255)
    return out
save_rgba('snow-1', snow_tile2(3, 13, 2.4, 3.6, 1.7, .5, .8, 768), lossless=True)    # 가까운 눈: 크고 흐릿하게(지름 5~7)
save_rgba('snow-2', snow_tile2(4, 20, 1.5, 2.3, .9, .55, .9, 640), lossless=True)    # 가운데(지름 3~5)
save_rgba('snow-3', snow_tile2(8, 30, 1.0, 1.4, .45, .5, .85, 512), lossless=True)   # 먼 눈: 작고 또렷하게(지름 2~3)
def puff_strip(seed, thr, w=2400, h=460):   # 뭉게구름 덩이: 굵은 잡음을 잘라 덩이를 만들고 잔 잡음으로 가장자리를 푼다
    big = tile_x(fbm2(seed, w, h, 6, 2.4, 3)); fine = tile_x(fbm2(seed + 1, w, h, 22, 9, 4))
    vy = np.linspace(0, 1, h, dtype=np.float32)[:, None]; m = sstep(thr, thr + .20, big * .8 + fine * .2) * sstep(0, .14, vy) * (1 - sstep(.66, 1, vy))   # 가장자리가 넓게 풀리는 뭉게구름
    return np.clip(gblur(m, 11) * .75 + gblur(m, 3) * .3, 0, 1)
save_rgba('cloud-s', puff_strip(211, .58) * .92)   # 대체로 맑음: 작은 구름 두세 조각
save_rgba('cloud-p', puff_strip(233, .44) * .95)   # 구름 조금: 뭉게구름 여러 덩이

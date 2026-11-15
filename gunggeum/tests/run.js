// 궁금칸 자동 점검 — 배포 전에 모두 통과해야 한다.
//   cd gunggeum && node tests/run.js        (Playwright + Chromium 필요, 바깥 인터넷은 쓰지 않음)
// 한 번 났던 버그는 여기에 점검을 붙여 둔다. NOTES.md 참고.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), PORT = 8791, URL = `http://localhost:${PORT}/index.html`;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); } }); });
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' };
let fails = 0, passes = 0; const errs = [];
const ok = (name, cond, info) => { if (process.env.V) console.log('   · ' + name); if (cond) passes++; else { fails++; console.log('  ✗ ' + name + (info !== undefined ? '  → ' + JSON.stringify(info) : '')); } };
const ANSWER = '달은 스스로 빛을 내지 못해. 《햇빛을 반사》해서 밝게 보이는 거야.\n@@ 달 | 🌙 | 왜 달은 안 떨어져?; 달에도 바다가 있어?; 보름달은 왜 둥글어?; 달에서 뛰면 어떻게 돼?';

async function open(b, { time, settings = {}, read, offline, noSky, w = 1600, h = 820, pre, sw } = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, timezoneId: 'Asia/Seoul', serviceWorkers: sw || 'allow' }); const p = await ctx.newPage(); p.api = 0;
  p.on('pageerror', e => { errs.push(e.message); if (process.env.V) console.log('ERR', e.message); });
  const day = (time || '2026-11-14T10:00').slice(0, 10), H = [...Array(48)].map((_, i) => `${day}T${String(i % 24).padStart(2, '0')}:00`);
  await p.route(/open-meteo/, r => offline ? r.abort() : r.request().url().includes('air-quality') ? r.fulfill({ json: { current: { pm10: 28, pm2_5: 12 } }, headers: CORS }) : r.fulfill({ headers: CORS, json: { current: { temperature_2m: 7.2, apparent_temperature: 4, weather_code: 0, precipitation: 0 }, hourly: { time: H, temperature_2m: H.map(() => 8), weather_code: H.map(() => 0), precipitation_probability: H.map(() => 0), is_day: H.map(() => 1) }, daily: { temperature_2m_max: [13, 13], temperature_2m_min: [4, 4], precipitation_probability_max: [0, 10], weather_code: [0, 1], sunrise: [day + 'T07:11', 'x'], sunset: [day + 'T17:22', 'x'] } } }));
  await p.route(/api\.anthropic\.com/, r => { if (r.request().method() === 'OPTIONS') return r.fulfill({ status: 204, headers: CORS }); if (offline) return r.abort(); p.api++; p.lastBody = JSON.parse(r.request().postData()); r.fulfill({ headers: CORS, json: { content: [{ type: 'text', text: ANSWER }], stop_reason: 'end_turn' } }); });
  p.wiki = 0; await p.route(/wttr|googleapis|gstatic|wikidata|wikimedia|wikipedia|tts\.speech/, r => { if (/wikidata|wikimedia|wikipedia/.test(r.request().url())) p.wiki++; return r.abort(); });
  if (noSky) await p.route(/vendor\/sky/, r => r.abort());
  await p.addInitScript(([day, st, read]) => { localStorage.setItem('gk-settings', JSON.stringify(Object.assign({ apiKey: 'sk-test', hFrom: 0, hTo: 24, wxName: '영등포구' }, st))); if (read) { localStorage.setItem('gk-news-read2', JSON.stringify(read)); localStorage.setItem('gk-news-done2', JSON.stringify([read])); } }, [day, settings, read]);
  if (pre) await pre(p);
  if (time) await p.clock.install({ time: new Date(time + ':00+09:00') });
  await p.goto(URL);
  p.adv = async (ms = 2000) => { if (time) await p.clock.runFor(ms); await p.waitForTimeout(time ? 350 : Math.min(ms, 1500)); };
  p.jump = async ms => { await p.clock.fastForward(ms); await p.adv(1500); }; // 긴 시간은 건너뛰기 (타이머를 하나하나 돌리지 않음)
  await p.adv(2500); await p.addStyleTag({ content: '.sv-inner{animation:none!important}' });
  p.go = async k => { await p.evaluate(k => { document.getElementById('log').hidden = false; document.querySelector(`[data-go="${k}"]`).click(); }, k); }; // 부모님 화면의 바로가기(구역이 접혀 있어도 누른다)
  p.say = async (text, wait = 1200) => { await p.evaluate(t => { const q = document.getElementById('q'); q.readOnly = false; q.value = t; }, text); await p.press('#q', 'Enter'); await p.adv(wait); };
  p.st = () => p.evaluate(() => ({ saver: document.getElementById('saver').hidden ? '' : document.getElementById('saver').className.replace('saver', '').trim(), paper: !document.getElementById('paper').hidden, log: !document.getElementById('log').hidden, home: !!document.getElementById('app').dataset.home, sheet: document.getElementById('sheet').textContent, chips: [...document.querySelectorAll('#chips button')].map(b => b.textContent.replace(/^\d/, '')), todo: (JSON.parse(localStorage.getItem('gk-todo') || '{"items":[]}').items || []).map(x => [x.text, x.due, !!x.done]), count: +document.querySelector('#count b').textContent }));
  p.saver = async () => { await p.keyboard.press('F3'); await p.adv(3000); await p.adv(16000); };
  return p;
}
const newsDate = JSON.parse(fs.readFileSync(path.join(ROOT, 'news/latest.json'), 'utf8')).date;
const plus = (d, n) => { const x = new Date(d + 'T12:00:00+09:00'); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };

// ---------- 10. 루아 신문 지면 (v121): 1면 · 기사 · 그림 안전 규칙 ----------
// 가짜 신문 JSON 과 tests/fix/pic.jpg 로만 확인한다 (news/img 에는 아무것도 두지 않는다).
const PIC = fs.readFileSync(path.join(__dirname, 'fix/pic.jpg')), PIC_HASH = require('crypto').createHash('sha256').update(PIC).digest('hex');
// 지면 점검은 고정해 둔 제3호(tests/fix/news.json)로 한다. 그날 신문에 기대면 호가 바뀔 때마다 점검이 깨진다(제4호 때 겪음).
const BASE_NEWS = JSON.parse(fs.readFileSync(path.join(__dirname, 'fix/news.json'), 'utf8'));
const TODAY_NEWS = JSON.parse(fs.readFileSync(path.join(ROOT, 'news/latest.json'), 'utf8'));
const LONG_BODY = ' 굴 껍데기는 해마다 30만 톤쯤 나오는데, 그동안은 쓸 곳이 마땅치 않아 바닷가에 쌓아 두는 일이 많았다. 냄새가 나고 보기에도 좋지 않아 어민들의 걱정거리였다. 정부는 앞으로 굴 껍데기를 비료나 건축 재료로도 쓸 수 있게 돕기로 했다. 굴 껍데기는 석회석과 성분이 거의 같아서 여러 곳에 쓸 수 있다.';
function fakeNews(o = {}) { // o.img / o.hash: 첫 기사 그림 필드를 바꿔 본다. o.old: 옛 형식(img·num 없음). o.long: 본문 450자쯤
  const j = JSON.parse(JSON.stringify(BASE_NEWS)); j.articles.forEach(a => { delete a.img; delete a.imgHash; delete a.num; });
  if (o.old) return j;
  j.articles.forEach((a, i) => { a.img = `news/img/${j.date}-${i + 1}.jpg`; a.imgHash = PIC_HASH; a.cap = '시험 그림'; });
  if ('img' in o) j.articles[0].img = o.img; if ('hash' in o) j.articles[0].imgHash = o.hash;
  j.articles[0].num = { n: '2만 톤', t: '발전소에 보내기로 한 굴 껍데기 탈황제' }; if (o.long) j.articles.forEach(a => { a.body += LONG_BODY; });
  return j;
}
async function openNews(b, o = {}) {
  const day = BASE_NEWS.date, p = await open(b, Object.assign({ time: day + 'T07:42', sw: 'block', pre: async p => {
    p.reqs = []; p.on('request', r => p.reqs.push([r.resourceType(), r.url()]));
    await p.route(/news\/latest\.json/, r => r.fulfill({ json: o.news || fakeNews() }));
    await p.route(/\/news\/img\//, r => /-[1-3]\.jpg(\?|$)/.test(r.request().url()) ? r.fulfill({ body: PIC, contentType: 'image/jpeg' }) : r.fulfill({ status: 404, body: '' }));
    await p.route(/evil\.example/, r => r.fulfill({ body: PIC, contentType: 'image/jpeg', headers: CORS }));
  } }, o));
  p.tap = async sel => { const bx = await p.locator(sel).first().boundingBox(); await p.mouse.click(bx.x + Math.min(80, bx.width / 2), bx.y + Math.min(50, bx.height / 2)); await p.adv(1800); };
  p.front = async () => { await p.saver(); await p.tap('#svFace [data-tile="news"]'); await p.adv(2500); };
  p.pics = () => p.evaluate(() => ({ front: [...document.querySelectorAll('#rnFront .rn-fig img')].map(i => i.src.slice(0, 5) + (i.naturalWidth > 0 ? '+' : '-')), art: [...document.querySelectorAll('#ppPhoto img')].map(i => i.src.slice(0, 5) + (i.naturalWidth > 0 ? '+' : '-')), nopicF: !!document.querySelector('#rnFront .rn-lead.nopic'), nopicA: document.getElementById('ppArt').classList.contains('nopic'), cap: (document.querySelector('#rnFront .rn-cap') || {}).textContent || '' }));
  p.imgReq = () => p.reqs.filter(x => /\/news\/img\//.test(x[1])).length;
  p.outImg = () => p.reqs.filter(x => (x[0] === 'image' || /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(x[1])) && !x[1].startsWith('http://localhost:' + PORT + '/') && !/^(data|blob):/.test(x[1])).map(x => x[1]);
  return p;
}
// 지면 점검: 넘침 · 글자 크기 · 누르는 곳
const SHEET_AUDIT = () => { const root = document.getElementById('saver').hidden ? document.getElementById('paper') : document.getElementById('rnFront'), sheet = root.querySelector('.rn-sheet').getBoundingClientRect(), out = { ovf: [], small: [], tap: [] };
  const vis = el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const c = getComputedStyle(e); if (c.display === 'none' || c.visibility === 'hidden' || e.hidden) return false; } return true; };
  root.querySelectorAll('#rnText, .rn-side, .rn-cols, #ppBody, .rn-art, .rn-body, .rn-w, .rn-date, .rn-phead, .rn-pnav').forEach(el => { if (!vis(el) || getComputedStyle(el).display === 'contents') return; if (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2) out.ovf.push([el.id || el.className, el.scrollWidth + 'x' + el.scrollHeight, el.clientWidth + 'x' + el.clientHeight]); });
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
  while ((n = tw.nextNode())) { const t = n.textContent.trim(), el = n.parentElement; if (!t || !vis(el)) continue; const fs = parseFloat(getComputedStyle(el).fontSize); if (fs < 22) out.small.push([t.slice(0, 10), fs]);
    const rg = document.createRange(); rg.selectNodeContents(n); for (const r of rg.getClientRects()) { if (r.width < 1) continue; if (r.right > sheet.right + 1 || r.bottom > sheet.bottom + 1 || r.left < sheet.left - 1 || r.top < sheet.top - 1) { out.ovf.push(['글자 밖', t.slice(0, 10)]); break; } } }
  root.querySelectorAll('button, .rn-home, [data-rn="art"]').forEach(el => { if (!vis(el)) return; const r = el.getBoundingClientRect(); if (r.height < 59.5 || r.width < 59.5) out.tap.push([(el.textContent || el.id).trim().slice(0, 8), Math.round(r.width) + 'x' + Math.round(r.height)]); });
  return out; };
async function newsTests(b) {
  let p, s; const day = BASE_NEWS.date, clean = a => !a.ovf.length && !a.small.length && !a.tap.length;
  console.log('10. 루아 신문 지면');
  p = await openNews(b); await p.front(); s = await p.st();
  ok('표지의 신문 → 신문 1면', s.saver.includes('rnp') && !s.paper, s.saver);
  ok('1면에 대기화면 머리줄(시각)이 없음', await p.evaluate(() => getComputedStyle(document.querySelector('#saver .sv-inner')).display === 'none' && !document.getElementById('rnFront').hidden));
  ok('1면에 표어·지역이 없음', await p.evaluate(() => !/읽기 좋게|영등포/.test(document.getElementById('rnFront').textContent)));
  ok('1면 오른쪽 귀에 날씨', await p.evaluate(() => /7°/.test((document.querySelector('#rnFront .rn-ear') || {}).textContent || '')));
  await p.tap('#rnFront .rn-home'); s = await p.st(); ok('1면의 홈 단추 → 홈(위젯 면)', s.saver === 'face' && !s.paper, s);
  ok('홈으로 가도 읽음 처리되지 않음(1면만 봄)', await p.evaluate(() => !JSON.parse(localStorage.getItem('gk-news-read2') || '""')));
  await p.tap('#svFace [data-tile="news"]'); await p.adv(2000); await p.tap('#rnFront [data-rn="art"][data-i="0"]'); s = await p.st(); ok('1면의 머리기사 → 기사 화면', !s.saver && s.paper, s);
  ok('기사를 펴면 읽음 처리', await p.evaluate(d => JSON.parse(localStorage.getItem('gk-news-read2') || '""') === d, day));
  ok('신문 닫기 단추가 없음', await p.evaluate(() => !document.getElementById('ppClose') && !/신문 닫기/.test(document.getElementById('paper').textContent)));
  ok('본문 낱말은 굵은 글자(mark)', await p.evaluate(() => { const m = document.querySelector('#ppBody mark'); return !!m && +getComputedStyle(m).fontWeight >= 700 && getComputedStyle(m).backgroundColor === 'rgba(0, 0, 0, 0)'; }));
  ok('낱말 상자에 한자', await p.evaluate(() => document.querySelectorAll('#ppWord .rn-w span i').length >= 2));
  ok('어절이 쪼개지지 않게 묶임', await p.evaluate(() => [...document.querySelectorAll('#ppBody .w')].some(w => /\(황산화물\)을/.test(w.textContent)) && [...document.querySelectorAll('#ppBody .w')].every(w => getComputedStyle(w).whiteSpace === 'nowrap' && new Set([...w.getClientRects()].map(r => Math.round(r.top))).size === 1)));
  await p.click('#ppHome'); await p.adv(1800); s = await p.st(); ok('기사의 홈 단추 → 홈(위젯 면)', s.saver === 'face' && !s.paper, s);
  ok('다 읽은 뒤 표지는 낱말', await p.evaluate(() => document.getElementById('fcFeat').classList.contains('word')));
  await p.context().close();

  p = await openNews(b); await p.front(); await p.tap('#rnFront [data-rn="art"][data-i="0"]');
  const nav = () => p.evaluate(() => [document.getElementById('ppNo').textContent, document.getElementById('ppDots').textContent, document.getElementById('ppNext').textContent.replace(/\s+/g, ' ').trim(), document.getElementById('ppPrev').hidden]);
  let v = await nav(); ok('기사 1: 1 / 3, 앞 단추 없음', v[1] === '1 / 3' && v[3] && /2면/.test(v[2]), v);
  await p.click('#ppNext'); await p.adv(1200); v = await nav(); ok('다음 → 기사 2', v[0] === '2면' && v[1] === '2 / 3' && !v[3], v);
  await p.click('#ppPrev'); await p.adv(1200); v = await nav(); ok('앞 → 기사 1', v[0] === '1면', v);
  await p.click('#ppNext'); await p.adv(800); await p.click('#ppNext'); await p.adv(1200); v = await nav(); ok('기사 3에서는 "첫 면으로"', v[1] === '3 / 3' && /첫 면으로/.test(v[2]), v);
  await p.click('#ppNext'); await p.adv(2500); s = await p.st(); ok('"첫 면으로" → 신문 1면', s.saver.includes('rnp') && !s.paper, s);
  await p.context().close();

  // 그림 안전 규칙
  p = await openNews(b); await p.front(); let g = await p.pics();
  ok('규칙에 맞고 해시가 맞으면 1면에 그림(blob)', g.front.length === 1 && g.front[0] === 'blob:+' && !g.nopicF, g); ok('캡션은 "그림 · "으로 시작', /^그림 · /.test(g.cap), g.cap);
  await p.tap('#rnFront [data-rn="art"][data-i="0"]'); g = await p.pics(); ok('기사 화면에도 그림(blob)', g.art.length === 1 && g.art[0] === 'blob:+' && !g.nopicA, g);
  ok('신문 화면에서 다른 출처로 나간 그림 요청 0', p.outImg().length === 0, p.outImg()); ok('신문이 바깥(위키) 사진을 부르지 않음(그림 있는 날)', p.wiki === 0, p.wiki);
  await p.context().close();
  for (const [name, o, noReq] of [['바깥 주소', { img: 'https://evil.example/2026-11-15-1.jpg' }, true], ['상위 경로', { img: 'news/img/../../tests/fix/pic.jpg' }, true], ['다른 이름', { img: 'news/img/pic.jpg' }, true], ['4번 그림', { img: `news/img/${day}-4.jpg` }, true],
    ['해시 다름', { hash: PIC_HASH.replace(/^./, c => c === '0' ? '1' : '0') }, false], ['해시 없음', { hash: undefined }, true]]) {
    p = await openNews(b, { news: fakeNews(o) }); await p.front(); g = await p.pics(); const first = p.reqs.filter(x => /evil\.example|tests\/fix|img\/pic\.jpg|-4\.jpg|-1\.jpg/.test(x[1])).length;
    ok(`그림 ${name} → 1면에 그림 없음`, g.front.length === 0 && g.nopicF, g); if (noReq) ok(`그림 ${name} → 요청도 나가지 않음`, first === 0, first);
    await p.tap('#rnFront [data-rn="art"][data-i="0"]'); g = await p.pics(); ok(`그림 ${name} → 기사에도 그림 없음`, g.art.length === 0 && g.nopicA, g);
    ok(`그림 ${name} → 바깥 그림 요청 0`, p.outImg().length === 0, p.outImg()); await p.context().close(); }
  p = await openNews(b, { settings: { picOn: 'off' } }); await p.front(); g = await p.pics(); ok('부모 설정 그림 끔 → 그림 없음', g.front.length === 0 && g.nopicF, g);
  await p.tap('#rnFront [data-rn="art"][data-i="0"]'); g = await p.pics(); ok('그림 끔 → 기사에도 없음 · 그림 요청 0', g.art.length === 0 && p.imgReq() === 0, [g, p.imgReq()]); await p.context().close();
  p = await openNews(b); const csp = await p.evaluate(() => (document.querySelector('meta[http-equiv="Content-Security-Policy"]') || {}).content || '');
  ok('CSP: 그림은 같은 출처만', /img-src 'self' data: blob:/.test(csp) && !/https?:|\*/.test(csp), csp);
  ok('CSP: 바깥 그림은 브라우저가 막음', await p.evaluate(() => new Promise(res => { const im = new Image(); im.onload = () => res(false); im.onerror = () => res(true); im.src = 'https://evil.example/x.jpg'; setTimeout(() => res('timeout'), 4000); })) === true);
  await p.context().close();
  { const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'), i0 = html.indexOf('function renderNpFront'), i1 = html.indexOf('function renderPaper'), i2 = html.indexOf('function openPaper');
    ok('신문 지면 코드에 safePic·pic 필드가 없음', i0 > 0 && i1 > 0 && !/safePic|\.pic\b|wikiImage/.test(html.slice(i0, html.indexOf('function npFit')) + html.slice(i1, i2)) && !/safePic/.test(html)); 
    ok('바깥 사진 스위치는 꺼진 채 그대로', /const WIKI_PICS = false;/.test(html)); }

  // 옛 형식(img · num 없음)
  p = await openNews(b, { news: fakeNews({ old: true }) }); await p.front(); g = await p.pics();
  ok('옛 형식: 1면이 그림 없는 조판으로', g.nopicF && await p.evaluate(() => { const r = document.getElementById('rnFront'); return r.querySelector('h2').textContent.length > 5 && r.querySelectorAll('#rnText p').length >= 2 && !r.querySelector('.rn-num') && !!r.querySelector('.rn-word') && r.querySelectorAll('.rn-it').length === 2; }), g);
  let a = await p.evaluate(SHEET_AUDIT); ok('옛 형식: 1면 넘침·작은 글자 없음', clean(a), a);
  await p.tap('#rnFront [data-rn="art"][data-i="1"]'); s = await p.st(); ok('옛 형식: 옆 기사 → 2면 기사', s.paper && await p.evaluate(() => document.getElementById('ppNo').textContent === '2면' && document.querySelectorAll('#ppBody p').length >= 2), s);
  a = await p.evaluate(SHEET_AUDIT); ok('옛 형식: 기사 넘침·작은 글자 없음', clean(a), a); await p.context().close();

  p = await openNews(b, { news: fakeNews({ long: 1 }) }); await p.front(); a = await p.evaluate(SHEET_AUDIT);
  ok('긴 본문: 1면은 문장 끝에서 덜어 내 넘치지 않음', clean(a) && await p.evaluate(() => { const ps = document.querySelectorAll('#rnText p'), t = ps[ps.length - 1].textContent.trim(); return /[.!?]$/.test(t) && document.getElementById('rnText').textContent.length < 400; }), a); await p.context().close();
  // 오늘 실제로 나갈 신문(news/latest.json)이 지면에 들어가는가 — 낱말 줄(한자 훈·음이 길면 넘친다)과 본문
  for (const h of [820, 760]) { const tn = JSON.parse(JSON.stringify(TODAY_NEWS)); tn.articles.forEach(x => { if (x.img) x.imgHash = PIC_HASH; });
    p = await openNews(b, { news: tn, time: tn.date + 'T07:42', w: 1600, h }); await p.front(); a = await p.evaluate(SHEET_AUDIT); ok(`오늘 신문 1600×${h}: 1면 넘침 없음`, clean(a), a);
    for (let i = 0; i < tn.articles.length; i++) { if (i === 0) await p.tap('#rnFront [data-rn="art"][data-i="0"]'); else await p.tap('#ppNext'); a = await p.evaluate(SHEET_AUDIT); ok(`오늘 신문 1600×${h}: 기사 ${i + 1} 넘침 없음`, clean(a), a); }
    await p.context().close(); }
  if (process.env.QUICK) return; // (점검을 고칠 때만) 크기별 점검 건너뛰기
  // 화면 크기 × 그림/본문 길이
  for (const [w, h] of [[1600, 820], [1600, 760], [1920, 1000]]) for (const [nm, o] of [['그림', {}], ['긴 본문', { long: 1 }], ['옛 형식', { old: true }]]) {
    p = await openNews(b, { w, h, news: fakeNews(o) }); await p.front(); a = await p.evaluate(SHEET_AUDIT); ok(`${w}×${h} ${nm}: 1면 넘침 없음 · 22px 미만 없음 · 누르는 곳 60 이상`, clean(a), a);
    for (let i = 0; i < 3; i++) { if (i === 0) await p.tap('#rnFront [data-rn="art"][data-i="0"]'); else { await p.click('#ppNext'); await p.adv(1500); }
      a = await p.evaluate(SHEET_AUDIT); const f = await p.evaluate(() => [parseFloat(getComputedStyle(document.querySelector('#ppBody p')).fontSize), document.getElementById('ppArt').className]);
      ok(`${w}×${h} ${nm}: 기사 ${i + 1} 넘침 없음 · 본문 24px 이상`, clean(a) && f[0] >= 24 && !/scroll/.test(f[1]), [a, f]); }
    await p.context().close(); }
}

(async () => {
  await new Promise(r => server.listen(PORT, r));
  const b = await chromium.launch(); let p, s;
  if (process.env.ONLY === 'news') { await newsTests(b); ok('페이지 오류 없음', errs.length === 0, errs.slice(0, 3)); await b.close(); server.close(); console.log(`\n통과 ${passes} · 실패 ${fails}`); process.exit(fails ? 1 : 0); }

  console.log('1. 버전 네 군데');
  { const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'), sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
    const v = (html.match(/APP_V = '(v\d+)'/) || [])[1];
    ok('APP_V 있음', !!v); ok('머리 표시 버전', html.includes(`<span style="opacity:.6">${v}</span>`)); ok('부모님 화면 버전', html.includes(`font-weight:400">${v}</small>`)); ok('sw.js 캐시 이름', sw.includes(`gk-${v}'`) || sw.includes(`gk-${v}"`), v); }

  console.log('2. 대기화면 상태 (시간대별)');
  for (const [t, read, want] of [[newsDate + 'T07:42', false, 'face morn news'], [newsDate + 'T08:15', true, 'face morn word'], [newsDate + 'T17:59', true, 'face day word'], [newsDate + 'T18:01', true, 'face eve moon'], [newsDate + 'T19:00', false, 'face eve news'], [newsDate + 'T22:01', true, 'face eve moon'], [plus(newsDate, 1) + 'T05:59', true, 'face morn word'], [plus(newsDate, 1) + 'T06:01', true, 'face morn word'], [plus(newsDate, 6) + 'T15:20', false, 'face day moon']]) {
    p = await open(b, { time: t, read: read ? newsDate : null }); await p.saver(); s = await p.st(); const got = s.saver === 'face' ? await p.evaluate(() => 'face ' + document.getElementById('saver').dataset.tone + ' ' + document.getElementById('fcFeat').className.replace('fc-t fc-feat', '').replace('pic', '').trim()) : s.saver; ok(`${t} ${read ? '읽음' : '안 읽음'} → ${want}`, got === want, got); await p.context().close(); }
  p = await open(b, { time: newsDate + 'T19:30', read: newsDate, noSky: true }); await p.saver(); s = await p.st(); ok('밤하늘 파일을 못 받으면 기본 화면', s.saver === 'face' && await p.evaluate(() => document.getElementById('fcFeat').classList.contains('word')), s.saver); await p.context().close();

  console.log('3. 미리 보기는 10분 뒤 풀림 (v102 버그)');
  p = await open(b, { time: newsDate + 'T16:00' });
  await p.go("sky"); await p.adv(4000); s = await p.st(); ok('미리 보기 → sky', s.saver === 'sky', s.saver);
  await p.adv(12 * 60e3); s = await p.st(); ok('12분 뒤 원래 화면', s.saver !== 'sky' && s.saver !== '', s.saver);
  await p.jump(7 * 3600e3); await p.adv(16000); s = await p.st(); ok('밤 11시에도 검은 밤 화면 없이 위젯 면 (v122)', s.saver.startsWith('face') && await p.evaluate(() => document.getElementById('saver').dataset.tone === 'eve'), s.saver);
  await p.jump(3 * 3600e3); await p.adv(16000); s = await p.st(); ok('새벽 2시에도 위젯 면, 저녁 하늘 (아침 하늘 아님)', s.saver.startsWith('face') && await p.evaluate(() => document.getElementById('saver').dataset.tone === 'eve'), s.saver); await p.context().close();

  console.log('4. 대기화면 넘기기·누르기');
  p = await open(b, { time: newsDate + 'T19:30' }); await p.saver();
  const swipe = async dir => { const x = dir > 0 ? 1100 : 500; await p.mouse.move(x, 400); await p.mouse.down(); await p.mouse.move(x - dir * 150, 405, { steps: 4 }); await p.mouse.move(x - dir * 300, 410, { steps: 4 }); await p.mouse.up(); await p.adv(1500); };
  s = await p.st(); ok('처음: 위젯 면', s.saver === 'face', s.saver);
  await swipe(1); s = await p.st(); ok('밀기 → 달력', s.saver === 'cal', s.saver);
  ok('달력에 오늘 표시와 큰 날짜', await p.evaluate(() => { const t = document.querySelectorAll('#calGrid .t'), n = String(new Date().getDate()); return t.length === 1 && t[0].textContent === n && document.getElementById('calBig').textContent === n && document.querySelectorAll('#calGrid span').length % 7 === 0; }));
  await swipe(1); s = await p.st(); ok('밀기 → 신문 1면', s.saver === 'has-paper paper-hero rnp', s.saver);
  await swipe(1); s = await p.st(); ok('밀기 → 밤하늘', s.saver === 'sky', s.saver);
  await swipe(1); s = await p.st(); ok('밤하늘에서도 밀림 (v105 버그)', s.saver === 'face', s.saver);
  await swipe(1); await swipe(1); await p.mouse.click(800, 520); await p.adv(1500); s = await p.st(); ok('신문을 누르면 신문이 열림', !s.saver && s.paper, s);
  await p.saver(); await p.mouse.click(20, 20); await p.adv(1000); s = await p.st(); ok('빈 곳을 톡 누르면 깨어남', !s.saver, s.saver);
  ok('강제 상태가 남지 않음', await p.evaluate(() => window.__gkForce === undefined));
  const tile = async n => { const bx = await p.locator(`#svFace [data-tile="${n}"]:visible, #svFace [data-cv="${n.replace('cv-', '')}"]:visible`).first().boundingBox(); await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.adv(1500); };
  await p.saver(); await tile('cal'); s = await p.st(); ok('시계를 누르면 달력', s.saver === 'cal', s.saver); ok('다음 달 날짜는 숨김', await p.evaluate(() => [...document.querySelectorAll('#calGrid .o')].every(x => getComputedStyle(x).visibility === 'hidden')));
  await p.mouse.click(800, 400); await p.adv(1000); s = await p.st(); ok('달력을 누르면 위젯 면으로', s.saver === 'face', s.saver);
  await tile('cal'); await p.adv(100e3); s = await p.st(); ok('달력은 90초 뒤 위젯 면으로', s.saver === 'face', s.saver);
  await p.adv(3 * 60e3); s = await p.st(); ok('3분 손대지 않으면 쉬는 막', s.saver === 'face rest', s.saver);
  await p.mouse.move(700, 300); await p.mouse.down(); ok('손대면 바로 밝아짐', !(await p.st()).saver.includes('rest')); await p.mouse.move(700, 380); await p.mouse.up(); await p.adv(500);
  await tile('sky'); s = await p.st(); ok('밤하늘 타일 → 밤하늘 장', s.saver === 'sky', s.saver);
  await p.adv(11 * 60e3); s = await p.st(); ok('밤하늘 장은 10분 뒤 위젯 면으로', s.saver === 'face rest', s.saver);
  const feat = () => p.evaluate(() => document.getElementById('fcFeat').className.replace('fc-t fc-feat', '').replace('pic', '').trim());
  ok('저녁 기본 표지는 달', await feat() === 'moon', await feat());
  { const bx = await p.locator('#svFace [data-cv="word"]').boundingBox(); ok('표지 갈래는 60px 이상', bx.height >= 60, bx.height); await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.adv(1500); }
  s = await p.st(); ok('낱말 갈래 → 낱말 표지 (깨어나지 않음)', s.saver.startsWith('face') && await feat() === 'word', [s.saver, await feat()]);
  await p.adv(150e3); ok('갈래는 2분 뒤 풀림', await feat() === 'moon', await feat());
  { const bx = await p.locator('#svFace [data-cv="news"]').boundingBox(); await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.adv(1500); } ok('신문 갈래 → 신문 표지', await feat() === 'news', await feat());
  await tile('news'); s = await p.st(); ok('신문 표지 → 신문 1면', s.saver.includes('rnp') && !s.paper, s);
  { const bx = await p.locator('#rnFront [data-rn="art"][data-i="0"]').boundingBox(); await p.mouse.click(bx.x + 80, bx.y + 60); await p.adv(1500); } s = await p.st(); ok('1면의 머리기사 → 기사 열림', !s.saver && s.paper, s);
  ok('깨어나면 갈래 강제가 지워짐', await p.evaluate(() => window.__gkCover === undefined));
  await p.saver(); await tile('todo'); s = await p.st(); ok('할 일 빈 곳 → 깨어남', !s.saver && !s.paper, s);
  ok('타일이 화면 밖으로 넘치지 않음', await p.evaluate(() => { document.getElementById('saver').hidden = false; const r = [...document.querySelectorAll('#svFace .fc-t')].every(t => { const b = t.getBoundingClientRect(); return b.left >= 0 && b.top >= 0 && b.right <= innerWidth && b.bottom <= innerHeight && (t.classList.contains('fc-feat') || t.scrollHeight <= t.clientHeight + 1); }); document.getElementById('saver').hidden = true; return r; }));
  await p.saver(); await tile('study'); s = await p.st(); ok('공부 모드 → 표지가 조용해짐 (깨어나지 않음)', s.saver.startsWith('face') && await feat() === 'study' && await p.evaluate(() => document.getElementById('fcStudyL').textContent === '공부 끝'), [s.saver, await feat()]);
  await tile('study'); ok('한 번 더 누르면 공부 모드 끝', await feat() !== 'study' && await p.evaluate(() => document.getElementById('fcStudyL').textContent === '공부 모드' && !localStorage.getItem('gk-study')), await feat());
  await tile('study'); await p.adv(95 * 60e3); ok('공부 모드는 90분 뒤 스스로 꺼짐', await feat() !== 'study', await feat());
  await p.context().close();
  for (const [w, h] of [[1600, 820], [1920, 1000]]) { p = await open(b, { time: newsDate + 'T12:48', w, h }); await p.saver();
    ok(`네 자리 시각이 시계 타일 안에 들어감 ${w}×${h}`, await p.evaluate(() => { const t = document.getElementById('fcTime'), r = document.createRange(); r.selectNodeContents(t); const a = r.getBoundingClientRect(), c = t.parentElement.getBoundingClientRect(); return a.left >= c.left + 8 && a.right <= c.right - 8; })); await p.context().close(); }

  console.log('5. 부모님 화면 바로가기');
  p = await open(b, {});
  for (const [g, want] of [['face', 'face'], ['cal', 'cal'], ['hero', 'paper-hero'], ['sky', 'sky'], ['night', 'night']]) {
    await p.go(g); await p.waitForTimeout(g === 'sky' ? 2500 : 700); s = await p.st(); ok(`바로가기 ${g}`, s.saver.includes(want) && !s.log, s.saver);
    await p.waitForTimeout(1600); await p.mouse.click(60, 60); await p.waitForTimeout(400); }
  await p.go("paper"); await p.waitForTimeout(700); s = await p.st(); await p.adv(4000); ok('신문이 바깥(위키) 사진을 부르지 않음', p.wiki === 0, p.wiki); ok('바로가기 신문', s.paper, s);
  await p.go("home"); await p.waitForTimeout(700); s = await p.st(); ok('바로가기 홈', s.home && !s.paper && !s.saver, s); await p.context().close();

  console.log('6. 밤하늘 계산 (달)');
  p = await open(b, { time: '2026-11-14T12:00' }); await p.waitForFunction(() => window.GKSky, null, { timeout: 8000 }).catch(() => {});
  const moon = t => p.evaluate(t => { const s = window.GKSky.build({ lat: 37.526, lon: 126.896, now: new Date(t + ':00+09:00'), W: 916, H: 512 }); return [s.moon.name, s.moon.lines.join(' '), s.moon.phase > 180, s.pick && s.pick.name, s.next.map(x => x[1]).join(',')]; }, t);
  s = await moon('2026-11-14T20:04'); ok('11/14 초승달·남서쪽으로 짐·토성', s[0] === '초승달' && /남서쪽으로 져/.test(s[1]) && s[3] === '토성' && s[4] === '반달,보름달', s);
  s = await moon('2026-03-04T19:30'); ok('막 뜬 보름달을 "안 떠"라고 하지 않음 (v102 버그)', /떠올라|에서 떠/.test(s[1]), s);
  s = await moon('2026-12-04T21:20'); ok('기우는 달은 그믐달·새벽에 뜸', s[0] === '그믐달' && s[2] === true && /에서 떠/.test(s[1]), s);
  s = await moon('2026-11-27T21:30'); ok('다음 달 모양은 반달과 보름달 하나씩 (v99 버그)', s[4].split(',').sort().join() === '반달,보름달', s); await p.context().close();

  console.log('7. 질문 흐름');
  p = await open(b, {}); s = await p.st(); ok('홈에서 시작', s.home, s);
  await p.say('달은 왜 모양이 바뀌어?', 9000); s = await p.st(); ok('답이 보임', /햇빛을 반사/.test(s.sheet) && p.api >= 1, s.sheet); await p.adv(6000); ok('답 화면이 바깥(위키) 사진을 부르지 않음', p.wiki === 0, p.wiki); ok('이어서 칩 4개', s.chips.length === 4, s.chips); ok('질문 수 1', s.count === 1, s.count);
  ok('지시문이 캐시 블록으로 감', Array.isArray(p.lastBody.system) && p.lastBody.system[0].cache_control && !/지금은 (오전|오후)/.test(p.lastBody.system[0].text));
  ok('질문 앞에 오늘 날짜·시각', /^\(오늘은 \d+년/.test(p.lastBody.messages.at(-1).content), p.lastBody.messages.at(-1).content.slice(0, 40));
  const n0 = p.api; await p.click('#chips button'); await p.adv(9000); ok('칩을 누르면 다시 물음', p.api > n0); await p.context().close();

  console.log('8. 루아의 할 일');
  p = await open(b, { time: '2026-11-16T16:00' }); // 월요일
  await p.say('내일 수학 숙제 있어'); s = await p.st();
  ok('기준1 바로 적힘', s.todo.length === 1 && s.todo[0][0] === '수학 숙제' && s.todo[0][1] === '2026-11-17' && /적어 뒀어/.test(s.sheet) && /내일 · 수학 숙제/.test(s.sheet), s);
  ok('기준1 AI를 부르지 않음', p.api === 0 && s.count === 0, [p.api, s.count]);
  { const api0 = p.api; for (const [said, want] of [['오늘 할 일에 수학 문제 추가', '수학 문제'], ['할 일에 리코더 연습 넣어', '리코더 연습'], ['숙제에 독서록 쓰기 추가해', '독서록 쓰기'], ['할 일에다가 줄넘기 적어 줘', '줄넘기']]) { await p.say(said, 3000); s = await p.st(); ok(`끝말 없이도 적힘: ${said}`, s.todo.some(x => x[0] === want) && p.api === api0, s.todo.map(x => x[0])); }
    await p.evaluate(() => { const d = JSON.parse(localStorage.getItem('gk-todo')); d.items = d.items.slice(-1).filter(x => x.text === '수학 숙제').concat(d.items.filter(x => x.text === '수학 숙제')).slice(0, 1); localStorage.setItem('gk-todo', JSON.stringify(d)); }); }
  { const api0 = p.api; for (const [said, want] of [['할 일에 밥 맛있게 먹게 추가해 줘', '밥 맛있게 먹기'], ['할 일에 양치하자 추가해 줘', '양치하기'], ['할 일에 책 읽도록 넣어 줘', '책 읽기'], ['할 일에 문구점 가게 추가해 줘', '문구점 가게'], ['할 일에 방 청소 해 추가', '방 청소 하기']]) { await p.say(said, 3000); s = await p.st(); ok(`"~기"로 다듬음: ${said}`, s.todo.some(x => x[0] === want) && p.api === api0, s.todo.map(x => x[0])); }
    await p.evaluate(() => { const d = JSON.parse(localStorage.getItem('gk-todo')); d.items = d.items.filter(x => x.text === '수학 숙제').slice(0, 1); localStorage.setItem('gk-todo', JSON.stringify(d)); }); }
  await p.say('사람은 왜 자야 돼', 9000); s = await p.st(); ok('기준2 질문은 평소처럼', p.api === 1 && s.todo.length === 1 && /햇빛/.test(s.sheet), s);
  await p.say('받아쓰기 연습해야 돼'); s = await p.st(); ok('사전에 있는 말은 바로 적힘', s.todo.length === 2 && s.todo[1][0] === '받아쓰기 연습', s.todo);
  await p.say('실내화 빨아야 돼'); s = await p.st(); ok('사전+끝말 → 적힘', s.todo.some(x => x[0] === '실내화 빨기'), s.todo);
  await p.say('화분에 물 줘야 돼', 9000); s = await p.st(); ok('모르는 끝말은 질문으로', s.todo.length === 3 && p.api === 2, [s.todo.length, p.api]);
  await p.say('친구 생일 선물 사야 돼'); s = await p.st(); ok('기준3 한쪽만 맞으면 되물음', s.todo.length === 3 && /할 일에 적을까/.test(s.sheet) && s.chips[0] === '적어 줘', s);
  await p.say('응'); s = await p.st(); ok('기준3 "응" 하면 적힘', s.todo.length === 4 && s.todo[3][0] === '친구 생일 선물 사기', s.todo);
  await p.say('아니야, 지워 줘'); s = await p.st(); ok('기준4 되돌리기', s.todo.length === 3 && /지웠어/.test(s.sheet), s);
  await p.say('우리 집에 강아지 있어', 9000); s = await p.st(); ok('"있어"만으로는 안 적힘', s.todo.length === 3, s.todo);
  await p.say('숙제 추가해 줘'); s = await p.st(); ok('내용 없이 명령만 → 되물음', /뭐라고 적을까/.test(s.sheet) && s.todo.length === 3, s.sheet);
  await p.say('금요일까지 독서록'); s = await p.st(); ok('다음 말이 내용이 됨 (금요일)', s.todo.length === 4 && s.todo[3][0] === '독서록' && s.todo[3][1] === '2026-11-20', s.todo);
  await p.say('수학 숙제 다 했어'); s = await p.st(); ok('말로 끝내기', s.todo.find(x => x[0] === '수학 숙제')[2] === true && /수학 숙제, 끝/.test(s.sheet), s);
  await p.say('할 일 뭐 있어'); s = await p.st(); ok('읽어 주기', /남은 건 3개/.test(s.sheet), s.sheet);
  const api8 = p.api; await p.say('지금 몇 시야'); s = await p.st(); ok('시각은 기기가 답함', /오후 4시/.test(s.sheet) && p.api === api8, s.sheet);
  await p.say('오늘 무슨 요일이야'); s = await p.st(); ok('요일은 기기가 답함', /11월 16일 월요일/.test(s.sheet) && p.api === api8, s.sheet);
  await p.say('신문 보여 줘'); s = await p.st(); ok('"신문 보여 줘" → 신문', s.paper || /아직 안 왔어/.test(s.sheet), s);
  await p.say('옛날 사람들은 몇 시인지 어떻게 알았어', 9000); ok('긴 질문은 AI로', p.api === api8 + 1);
  // 홈 칸에서 눌러 줄 긋기
  await p.go("home"); await p.adv(1000);
  await p.adv(3 * 60e3); await p.go("home"); await p.adv(800); // 말로 끝낸 줄이 뒤로 물러난 뒤
  const row = p.locator('#tdTodoL [data-todo]:not(.done)').first(); ok('홈에 할 일 칸', await row.count() === 1); const firstText = await row.locator('.tx').textContent();
  await row.click(); await p.adv(500); s = await p.st(); ok('기준5 홈에서 눌러 줄 긋기', s.todo.find(x => x[0] === firstText)[2] === true && s.home, s.todo);
  await p.locator('#tdTodoL [data-todo].done', { hasText: firstText }).first().click(); await p.adv(500); s = await p.st(); ok('기준5 다시 누르면 되살아남', s.todo.find(x => x[0] === firstText)[2] === false, s.todo);
  // 대기화면 시계 장
  await p.go("face"); await p.adv(2500); s = await p.st(); ok('대기화면 할 일 타일', s.saver === 'face' && await p.evaluate(() => document.querySelectorAll('#fcTodoL [data-todo]').length > 0 && +document.getElementById('fcTodoN').textContent > 0), s.saver);
  await p.screenshot({ path: path.join(__dirname, 'out-saver-todo.png') });
  const sr = p.locator('#fcTodoL [data-todo]:not(.done)').first(), srText = await sr.locator('.tx').textContent(), bb = await sr.boundingBox();
  for (let i = 0; i < 2; i++) { await p.mouse.click(bb.x + 80, bb.y + bb.height / 2); await p.adv(400); }
  s = await p.st(); ok('기준5 대기화면에서 눌러도 깨어나지 않음', s.saver === 'face' && !s.log, s);
  ok('기준5 두 번 누르면 원래대로', s.todo.find(x => x[0] === srText)[2] === false, s.todo);
  await p.mouse.click(bb.x + 80, bb.y + bb.height / 2); await p.adv(400); s = await p.st(); ok('기준5 대기화면에서 줄 긋기', s.todo.find(x => x[0] === srText)[2] === true, s.todo);
  for (let i = 0; i < 6; i++) { await p.mouse.click(bb.x + 80, bb.y + bb.height / 2); await p.adv(150); } s = await p.st(); ok('여러 번 눌러도 부모님 화면이 안 열림', !s.log && s.saver === 'face', s);
  ok('재촉하는 문구 없음', !/밀렸|어제까지|째|늦었/.test(await p.evaluate(() => document.getElementById('saver').textContent + document.getElementById('today').textContent)));
  await p.mouse.click(60, 60); await p.adv(800);
  // 기준7: 날이 지나면
  await p.jump(24 * 3600e3); await p.go("home"); await p.adv(800); s = await p.st();
  ok('기준7 다 한 줄은 다음 날 사라짐', !s.todo.some(x => x[2]), s.todo); const left = s.todo.length; ok('기준7 안 한 줄은 남음', left >= 1, s.todo);
  ok('기준7 기한 지난 줄에 표시 없음', !/밀렸|어제|지난/.test(await p.evaluate(() => document.getElementById('today').textContent)));
  await p.jump(9 * 24 * 3600e3); await p.go("home"); await p.adv(800); s = await p.st(); ok('기준7 묵은 줄은 사라짐', s.todo.length === 0, s.todo);
  await p.context().close();

  console.log('9. 인터넷이 안 될 때·질문 상한');
  p = await open(b, { time: '2026-11-16T16:00', offline: true }); await p.say('내일 준비물 색종이 가져가야 돼'); s = await p.st(); ok('기준6 인터넷 없이 적힘', s.todo.length === 1 && s.todo[0][1] === '2026-11-17', s); await p.context().close();
  p = await open(b, { time: '2026-11-16T16:00', settings: { cap: 10 } }); await p.evaluate(() => localStorage.setItem('gk-count-2026-11-16', '10'));
  await p.say('일기 써야 돼'); s = await p.st(); ok('기준6 상한 뒤에도 적힘', s.todo.length === 1 && s.todo[0][0] === '일기 쓰기' && !s.saver, s);
  await p.say('달은 왜 모양이 바뀌어?', 3000); s = await p.st(); ok('상한 뒤 질문은 막힘', p.api === 0 && !!s.saver, s); await p.context().close();
  p = await open(b, { time: '2026-11-16T23:30', settings: { hFrom: 7, hTo: 21 } }); await p.say('일기 써야 돼'); s = await p.st(); ok('쉬는 시간에는 할 일도 막힘', s.todo.length === 0, s); await p.context().close();

  await newsTests(b);
  ok('페이지 오류 없음', errs.length === 0, errs.slice(0, 3));
  await b.close(); server.close();
  console.log(`\n통과 ${passes} · 실패 ${fails}`); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });

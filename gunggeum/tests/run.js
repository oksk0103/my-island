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

async function open(b, { time, settings = {}, read, offline, apiErr, noSky, w = 1600, h = 820, pre, sw, wx = {}, sr = !pre } = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, timezoneId: 'Asia/Seoul', serviceWorkers: sw || 'allow' }); const p = await ctx.newPage(); p.api = 0;
  p.on('pageerror', e => { errs.push(e.message); if (process.env.V) console.log('ERR', e.message); });
  p.cerr = []; p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text())) p.cerr.push(m.text().slice(0, 120)); });
  p.ext = []; p.on('request', q => { const u = q.url(); if (!/^(http:\/\/localhost|data:|blob:)/.test(u) && !/open-meteo|api\.anthropic\.com|wttr|tts\.speech|fonts\.(googleapis|gstatic)/.test(u)) p.ext.push(u.slice(0, 80)); }); // 날씨·답·목소리·글꼴(전부터 있던 것) 말고 바깥으로 나가는 요청
  const day = (time || '2026-11-14T10:00').slice(0, 10), H = [...Array(48)].map((_, i) => `${day}T${String(i % 24).padStart(2, '0')}:00`);
  await p.route(/open-meteo/, r => offline ? r.abort() : r.request().url().includes('air-quality') ? r.fulfill({ json: { current: { pm10: 28, pm2_5: 12 } }, headers: CORS }) : r.fulfill({ headers: CORS, json: { current: { temperature_2m: wx.t ?? 7.2, apparent_temperature: 4, weather_code: wx.code ?? 0, precipitation: 0 }, hourly: { time: H, temperature_2m: H.map(() => 8), weather_code: H.map(() => 0), precipitation_probability: H.map(() => 0), is_day: H.map(() => 1) }, daily: { temperature_2m_max: [13, 13], temperature_2m_min: [4, 4], precipitation_probability_max: [0, 10], weather_code: [0, 1], sunrise: [day + 'T07:11', 'x'], sunset: [day + 'T17:22', 'x'] } } }));
  await p.route(/api\.anthropic\.com/, r => { if (r.request().method() === 'OPTIONS') return r.fulfill({ status: 204, headers: CORS }); if (offline) return r.abort(); if (apiErr) return r.fulfill({ status: apiErr.status, headers: CORS, json: { type: 'error', error: { type: 'invalid_request_error', message: apiErr.msg } } }); const bd = JSON.parse(r.request().postData()); if (/시계 화면에 쓸 문장/.test(JSON.stringify(bd.messages || ''))) { p.quotes = (p.quotes || 0) + 1; } else if (/순우리말이면/.test(JSON.stringify(bd.messages || ''))) { p.gloss = (p.gloss || 0) + 1; } else { p.api++; p.lastBody = bd; (p.bodies = p.bodies || []).push(JSON.stringify(bd.messages || '').slice(-160)); } r.fulfill({ headers: CORS, json: { content: [{ type: 'text', text: ANSWER }], stop_reason: 'end_turn' } }); });
  p.wiki = 0; await p.route(/wttr|googleapis|gstatic|wikidata|wikimedia|wikipedia|tts\.speech/, r => { if (/wikidata|wikimedia|wikipedia/.test(r.request().url())) p.wiki++; return r.abort(); });
  if (noSky) await p.route(/vendor\/sky/, r => r.abort());
  await p.addInitScript(([day, st, read]) => { localStorage.setItem('gk-settings', JSON.stringify(Object.assign({ apiKey: 'sk-test', hFrom: 0, hTo: 24, wxName: '영등포구', nightScr: 'off' }, st))); if (read) { localStorage.setItem('gk-news-read2', JSON.stringify(read)); localStorage.setItem('gk-news-done2', JSON.stringify([read])); } }, [day, settings, read]);
  if (pre) await pre(p);
  if (sr) await p.addInitScript(() => { window.SpeechRecognition = window.webkitSpeechRecognition = class { start() { window.__rec = this; setTimeout(() => this.onstart && this.onstart(), 0); } stop() { setTimeout(() => this.onend && this.onend(), 0); } abort() { this.stop(); } }; });
  if (time) await p.clock.install({ time: new Date(time + ':00+09:00') });
  await p.goto(URL);
  p.adv = async (ms = 2000) => { if (time) await p.clock.runFor(ms); await p.waitForTimeout(time ? 350 : Math.min(ms, 1500)); };
  p.jump = async ms => { await p.clock.fastForward(ms); await p.adv(1500); }; // 긴 시간은 건너뛰기 (타이머를 하나하나 돌리지 않음)
  await p.adv(2500); await p.addStyleTag({ content: '.sv-inner{animation:none!important}' });
  p.go = async k => { await p.evaluate(k => { document.getElementById('log').hidden = false; document.querySelector(`[data-go="${k}"]`).click(); }, k); }; // 부모님 화면의 바로가기(구역이 접혀 있어도 누른다)
  // sr: 가짜 음성 인식(v153 연속 듣기, pre 가 없으면 기본). 헤드리스 크롬의 진짜 인식은 연속 듣기에서 권한 오류로 바로 끝난다. p.speak = 마이크가 켜진 뒤 아이가 말한 것처럼 최종 결과를 보내고, 말 끝 기다림이 지나 듣기가 끝나게 둔다
  p.speak = async (text, wait = 5000) => { await p.evaluate(t => window.__rec.onresult({ resultIndex: 0, results: [Object.assign([{ transcript: t }], { isFinal: true })] }), text); await p.adv(wait); };
  // 듣는 중(가짜 인식)이면 말로 들어가게, 아니면 글자로 친 것처럼
  p.say = async (text, wait = 1200) => { if (await p.evaluate(() => !!window.__rec && document.getElementById('app').dataset.state === 'listen')) return p.speak(text, wait); await p.evaluate(t => { const q = document.getElementById('q'); q.readOnly = false; q.value = t; }, text); await p.press('#q', 'Enter'); await p.adv(wait); };
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
  ok('1면: 날씨는 날짜 줄에, 오른쪽 끝에는 시계 (v136)', await p.evaluate(() => /7°/.test((document.querySelector('#rnFront .rn-date') || {}).textContent || '') && /\d:\d\d/.test((document.querySelector('#rnFront .rn-ear') || {}).textContent || '')));
  await p.tap('#rnFront .rn-home'); s = await p.st(); ok('1면의 홈 단추 → 홈(위젯 면)', s.saver === 'face' && !s.paper, s);
  ok('홈으로 가도 읽음 처리되지 않음(1면만 봄)', await p.evaluate(() => !JSON.parse(localStorage.getItem('gk-news-read2') || '""')));
  await p.tap('#svFace [data-tile="news"]'); await p.adv(2000);
  { const q = await p.evaluate(() => { const bw = (e, sd) => { if (!e) return -1; const c = getComputedStyle(e); return c['border' + sd + 'Style'] === 'none' ? 0 : parseFloat(c['border' + sd + 'Width']); }, $ = x => document.querySelector('#rnFront ' + x) || document.querySelector(x), it = document.querySelectorAll('.rn-side .rn-it');
      return { box: bw($('.rn-box'), 'Top'), rule2: bw($('.rn-rule2'), 'Top') + bw($('.rn-rule2'), 'Bottom'), date: bw($('.rn-date'), 'Bottom'), first: bw(it[0], 'Bottom'), last: bw(it[it.length - 1], 'Bottom'), n: it.length }; });
    ok('v177 신문 1면: 날짜 아래 괘선과 오른쪽 꼭지 사이 한 줄만, 낱말·숫자 상자 위 선 없음', q.box === 0 && q.rule2 === 0 && q.date > 0 && q.first === 1 && (q.n < 2 || q.last === 0), q); }
  await p.tap('#rnFront [data-rn="art"][data-i="0"]'); s = await p.st(); ok('1면의 머리기사 → 기사 화면', !s.saver && s.paper, s);
  ok('기사를 펴면 읽음 처리', await p.evaluate(d => JSON.parse(localStorage.getItem('gk-news-read2') || '""') === d, day));
  ok('신문 닫기 단추가 없음', await p.evaluate(() => !document.getElementById('ppClose') && !/신문 닫기/.test(document.getElementById('paper').textContent)));
  ok('본문 낱말은 굵은 글자(mark)', await p.evaluate(() => { const m = document.querySelector('#ppBody mark'); return !!m && +getComputedStyle(m).fontWeight >= 700 && getComputedStyle(m).backgroundColor === 'rgba(0, 0, 0, 0)'; }));
  ok('낱말 상자에 한자', await p.evaluate(() => document.querySelectorAll('#ppWord .rn-w span i').length >= 2));
  { const q = await p.evaluate(() => { const R = e => e.getBoundingClientRect(), w = document.querySelector('#ppWord .rn-w'), b = R(w.querySelector('b')), i = R(w.querySelector('span i')), sm = R(w.querySelector('span small')), m = R(document.getElementById('ppM')), hb = getComputedStyle(document.getElementById('ppHome')), nm = getComputedStyle(document.querySelector('.rn-phead .rn-name')), ph = R(document.querySelector('.rn-phead')), nr = R(document.querySelector('.rn-phead .rn-name'));
      return { rows: b.bottom <= i.top + 2 && i.bottom <= m.top + 2, side: sm.left >= i.right, pill: hb.backgroundColor, name: parseFloat(nm.fontSize), gap: Math.round(ph.bottom - nr.bottom) }; });
    ok('v168 낱말 칸: 낱말 → 한자(훈·음은 글자 옆) → 뜻 세 줄, 겹치지 않음', q.rows && q.side, q);
    ok('v168 신문 지면: 홈 단추에 흰 채움 없음, 제호 40이 괘선 가까이(16 이하)', q.pill === 'rgba(0, 0, 0, 0)' && q.name === 40 && q.gap <= 16, q); }
  { const n = await p.evaluate(() => { let k = 0; for (const e of document.querySelectorAll('#paper *')) { const c = getComputedStyle(e); if (c.display === 'none' || c.visibility === 'hidden' || !e.getBoundingClientRect().width) continue; for (const sd of ['Top', 'Right', 'Bottom', 'Left']) if (parseFloat(c['border' + sd + 'Width']) > 0 && c['border' + sd + 'Style'] !== 'none' && c['border' + sd + 'Color'] !== 'rgba(0, 0, 0, 0)') k++; if (c.columnRuleStyle && c.columnRuleStyle !== 'none' && parseFloat(c.columnRuleWidth) > 0) k++; for (const ps of ['::before', '::after']) { const q = getComputedStyle(e, ps); if (q.content !== 'none' && q.display !== 'none' && ((parseFloat(q.width) <= 4 && parseFloat(q.height) > 40) || (parseFloat(q.height) <= 6 && parseFloat(q.width) > 40)) && q.backgroundColor !== 'rgba(0, 0, 0, 0)') k++; } } return k; });
    ok('v177 신문 기사 지면: 선은 머리줄 아래 한 줄뿐(선이 많아 피곤하다는 피드백)', n === 1, n); }
  ok('어절이 쪼개지지 않게 묶임', await p.evaluate(() => [...document.querySelectorAll('#ppBody .w')].some(w => /\(황산화물\)을/.test(w.textContent)) && [...document.querySelectorAll('#ppBody .w')].every(w => getComputedStyle(w).whiteSpace === 'nowrap' && new Set([...w.getClientRects()].map(r => Math.round(r.top))).size === 1)));
  await p.click('#ppHome'); await p.adv(1800); s = await p.st(); ok('기사의 홈 단추 → 홈(위젯 면)', s.saver === 'face' && !s.paper, s);
  ok('다 읽은 뒤 낮 표지는 이야기 (v147)', await p.evaluate(() => { const c = document.getElementById('fcFeat').classList; return c.contains('piece') && !c.contains('sci') && !c.contains('word'); }));
  await p.context().close();

  p = await openNews(b); await p.front(); await p.tap('#rnFront [data-rn="art"][data-i="0"]');
  const nav = () => p.evaluate(() => [(document.getElementById('ppTag').textContent.match(/\d+면/) || [''])[0], document.getElementById('ppDots').textContent, document.getElementById('ppNext').textContent.replace(/\s+/g, ' ').trim(), document.getElementById('ppPrev').hidden]);
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
  await p.tap('#rnFront [data-rn="art"][data-i="1"]'); s = await p.st(); ok('옛 형식: 옆 기사 → 2면 기사', s.paper && await p.evaluate(() => /2면/.test(document.getElementById('ppTag').textContent) && document.querySelectorAll('#ppBody p').length >= 2), s);
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
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); let p, s;
  if (process.env.ONLY === 'news') { await newsTests(b); ok('페이지 오류 없음', errs.length === 0, errs.slice(0, 3)); await b.close(); server.close(); console.log(`\n통과 ${passes} · 실패 ${fails}`); process.exit(fails ? 1 : 0); }

  console.log('1. 버전 네 군데');
  { const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'), sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
    const v = (html.match(/APP_V = '(v\d+)'/) || [])[1];
    ok('APP_V 있음', !!v); ok('머리 표시 버전', html.includes(`<span style="opacity:.6">${v}</span>`)); ok('부모님 화면 버전', html.includes(`font-weight:400">${v}</small>`)); ok('sw.js 캐시 이름', sw.includes(`gk-${v}'`) || sw.includes(`gk-${v}"`), v); }

  console.log('2. 대기화면 상태 (시간대별)');
  for (const [t, read, want] of [[newsDate + 'T07:42', false, 'face morn news'], [newsDate + 'T08:15', true, 'face morn piece'], [newsDate + 'T17:59', true, 'face day piece'], [newsDate + 'T18:01', true, 'face eve SCI'], [newsDate + 'T19:00', false, 'face eve news'], [newsDate + 'T22:01', true, 'face eve SCI'], [plus(newsDate, 1) + 'T05:59', true, 'face morn piece'], [plus(newsDate, 1) + 'T06:01', true, 'face morn piece'], [plus(newsDate, 6) + 'T15:20', false, 'face day piece']]) { // v147: 저녁은 과학(달이 볼 만한 날엔 달)
    p = await open(b, { time: t, read: read ? newsDate : null }); await p.saver(); s = await p.st(); const got = s.saver === 'face' ? await p.evaluate(() => 'face ' + document.getElementById('saver').dataset.tone + ' ' + document.getElementById('fcFeat').className.replace('fc-t fc-feat', '').replace('pic', '').trim()) : s.saver; ok(`${t} ${read ? '읽음' : '안 읽음'} → ${want}`, want.endsWith('SCI') ? (got === want.replace('SCI', 'piece sci') || got === want.replace('SCI', 'moon')) : got === want, got); await p.context().close(); }
  p = await open(b, { time: newsDate + 'T19:30', read: newsDate, noSky: true }); await p.saver(); s = await p.st(); ok('밤하늘 파일을 못 받으면 기본 화면(과학 편)', s.saver === 'face' && await p.evaluate(() => document.getElementById('fcFeat').classList.contains('sci')), s.saver); await p.context().close();

  console.log('3. 미리 보기는 10분 뒤 풀림 (v102 버그)');
  p = await open(b, { time: newsDate + 'T16:00' });
  await p.go("sky"); await p.adv(4000); s = await p.st(); ok('미리 보기 → sky', s.saver === 'sky', s.saver);
  await p.adv(12 * 60e3); s = await p.st(); ok('12분 뒤 원래 화면', s.saver !== 'sky' && s.saver !== '', s.saver);
  await p.jump(7 * 3600e3); await p.adv(16000); s = await p.st(); ok('밤 11시에도 검은 밤 화면 없이 위젯 면 (v122)', s.saver.startsWith('face') && await p.evaluate(() => document.getElementById('saver').dataset.tone === 'eve'), s.saver);
  await p.jump(3 * 3600e3); await p.adv(16000); s = await p.st(); ok('새벽 2시에도 위젯 면, 저녁 하늘 (아침 하늘 아님)', s.saver.startsWith('face') && await p.evaluate(() => document.getElementById('saver').dataset.tone === 'eve'), s.saver); await p.context().close();

  console.log('4. 대기화면 넘기기·누르기');
  p = await open(b, { time: newsDate + 'T19:30', sr: 1, settings: { nsky: 'off' } }); await p.saver(); // v178: 저녁 밤하늘을 끄고 넘기기만 본다
  const swipe = async dir => { const x = dir > 0 ? 1100 : 500; await p.mouse.move(x, 400); await p.mouse.down(); await p.mouse.move(x - dir * 150, 405, { steps: 4 }); await p.mouse.move(x - dir * 300, 410, { steps: 4 }); await p.mouse.up(); await p.adv(1500); };
  s = await p.st(); ok('처음: 위젯 면', s.saver === 'face', s.saver);
  await swipe(1); s = await p.st(); ok('밀기 → 달력', /\bcal\b/.test(s.saver), s.saver);
  ok('달력에 오늘 표시와 큰 날짜', await p.evaluate(() => { const t = document.querySelectorAll('#cqGrid span.t'), n = String(new Date().getDate()); return t.length === 1 && t[0].textContent.trim() === n && document.querySelector('#agTtl b').textContent === n && document.querySelectorAll('#cqGrid > span').length % 7 === 0; }));
  await swipe(1); s = await p.st(); ok('밀기 → 신문 1면', s.saver === 'has-paper paper-hero rnp', s.saver);
  await swipe(1); s = await p.st(); ok('밀기 → 다시 위젯 면 (예전 밤하늘은 넘기기에서 뺌, v178)', s.saver === 'face', s.saver);
  await swipe(1); await swipe(1); await p.mouse.click(800, 520); await p.adv(1500); s = await p.st(); ok('신문을 누르면 신문이 열림', !s.saver && s.paper, s);
  await p.saver(); await p.mouse.click(20, 20); await p.adv(1000); s = await p.st(); ok('빈 곳을 톡 누르면 깨어남', !s.saver, s.saver);
  ok('강제 상태가 남지 않음', await p.evaluate(() => window.__gkForce === undefined));
  const tile = async n => { const bx = await p.locator(`#svFace [data-tile="${n}"]:visible, #svFace [data-cv="${n.replace('cv-', '')}"]:visible`).first().boundingBox(); await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.adv(1500); };
  await p.saver(); await tile('cal'); s = await p.st(); ok('시계를 누르면 달력', /\bcal\b/.test(s.saver), s.saver); ok('다음 달 날짜는 흐리게, 일요일은 빨강', await p.evaluate(() => { const g = e => getComputedStyle(e.querySelector('b')).color, x = document.querySelector('#cqGrid span.x'), su = document.querySelector('#cqGrid span.su:not(.x):not(.t)'), d = document.querySelector('#cqGrid span:not(.x):not(.t):not(.su):not(.sa)'); return (!x || g(x) !== g(d)) && su && g(su) !== g(d); }));
  await p.mouse.click(1250, 700); await p.adv(1000); s = await p.st(); ok('달력의 빈 곳을 눌러도 달력 그대로 (v122)', /\bcal\b/.test(s.saver), s.saver);
  await p.click('#gkHome'); await p.adv(1000); s = await p.st(); ok('달력의 홈 단추 → 위젯 면', s.saver === 'face', s.saver);
  await tile('cal'); await p.adv(100e3); s = await p.st(); const calStill = /\bcal\b/.test(s.saver); await p.adv(100e3); s = await p.st(); ok('달력은 마지막으로 만진 뒤 3분이 지나면 위젯 면으로 (v122: 90초 → 3분)', calStill && /^face/.test(s.saver), s.saver);
  await p.adv(3 * 60e3); s = await p.st(); ok('3분 손대지 않으면 쉬는 막', s.saver === 'face rest', s.saver);
  await p.mouse.move(700, 300); await p.mouse.down(); ok('손대면 바로 밝아짐', !(await p.st()).saver.includes('rest')); await p.mouse.move(700, 380); await p.mouse.up(); await p.adv(500);
  await p.evaluate(() => { window.__gkCover = { k: 'moon', day: new Date().toLocaleDateString('sv') }; }); await p.adv(1500); await tile('sky'); s = await p.st(); ok('달 표지 → 밤하늘 장', s.saver === 'sky', s.saver);
  await p.adv(11 * 60e3); s = await p.st(); ok('밤하늘 장은 10분 뒤 위젯 면으로', s.saver === 'face rest', s.saver);
  const feat = () => p.evaluate(() => document.getElementById('fcFeat').className.replace('fc-t fc-feat', '').replace('pic', '').trim());
  const eve = await feat(); ok('저녁 기본 표지는 과학 (달이 볼 만한 날엔 달) (v147)', eve === 'piece sci' || eve === 'moon', eve);
  ok('표지 갈래 셋: 신문·이야기·과학 (v147·v174)', await p.evaluate(() => [...document.querySelectorAll('#fcFeat .cc-tabs span')].map(x => x.textContent).join('|') === '신문|이야기|과학'));
  { const bx = await p.locator('#svFace [data-cv="piece"]').boundingBox(); ok('표지 갈래는 60px 이상', bx.height >= 60, bx.height); await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.adv(1500); }
  s = await p.st(); ok('이야기 갈래 → 이야기 표지 (깨어나지 않음)', s.saver.startsWith('face') && await feat() === 'piece', [s.saver, await feat()]);
  await p.adv(150e3); ok('고른 갈래는 2분이 지나도 그대로 (v161)', await feat() === 'piece', await feat());
  { const bx = await p.locator('#svFace [data-cv="news"]').boundingBox(); await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.adv(1500); } ok('신문 갈래 → 신문 표지', await feat() === 'news', await feat());
  await tile('news'); s = await p.st(); ok('신문 표지 → 신문 1면', s.saver.includes('rnp') && !s.paper, s);
  { const bx = await p.locator('#rnFront [data-rn="art"][data-i="0"]').boundingBox(); await p.mouse.click(bx.x + 80, bx.y + 60); await p.adv(1500); } s = await p.st(); ok('1면의 머리기사 → 기사 열림', !s.saver && s.paper, s);
  await p.saver(); ok('깨어났다 돌아와도 고른 갈래 그대로 (v161)', await feat() === 'news', await feat()); await p.evaluate(() => { delete window.__gkCover; localStorage.setItem('gk-cover', JSON.stringify({ k: 'piece', day: '2026-01-01' })); }); await p.saver(); ok('다른 날에 고른 갈래는 쓰지 않음 (v161)', await feat() !== 'piece', await feat());
  await p.saver(); await tile('todo'); s = await p.st(); ok('할 일 빈 곳 → 할 일 화면 (v135)', s.saver === 'pgx' && await p.evaluate(() => document.getElementById('saver').dataset.pg === 'todo'), s);
  { const a0 = p.api; await p.click('[data-act="tdadd"]'); await p.adv(800); await p.speak('수학 익힘책', 3000); await p.adv(1500); s = await p.st();
    const td = await p.evaluate(() => (JSON.parse(localStorage.getItem('gk-todo') || '{"items":[]}').items || []).map(x => x.text));
    ok("할 일 말하기 → 그 말은 질문이 아니라 할 일로 적히고 할 일 화면으로 (v140)", td.includes('수학 익힘책') && s.saver === 'pgx' && await p.evaluate(() => document.getElementById('saver').dataset.pg === 'todo') && p.api === a0, [td, s.saver, p.api - a0]);
  }
  await p.click('#gkHome'); await p.adv(1500);
  ok('타일이 화면 밖으로 넘치지 않음', await p.evaluate(() => { document.getElementById('saver').hidden = false; const r = [...document.querySelectorAll('#svFace .fc-t')].every(t => { const b = t.getBoundingClientRect(); return b.left >= 0 && b.top >= 0 && b.right <= innerWidth && b.bottom <= innerHeight && (t.classList.contains('fc-feat') || t.scrollHeight <= t.clientHeight + 1); }); document.getElementById('saver').hidden = true; return r; }));
  await p.saver(); await tile('study'); s = await p.st(); ok('공부칸 타일 → 공부칸 앱이 크게 열림 (v138, 깨어나지 않음)', s.saver === 'pgx' && await p.evaluate(() => document.getElementById('saver').dataset.pg === 'study' && document.getElementById('fcStudyL').textContent === '공부칸' && !localStorage.getItem('gk-study')), s);
  await p.click('#gkHome'); await p.adv(1500); ok('공부칸의 홈 단추 → 위젯 면 (공부 중 표지는 없음)', /^face/.test((await p.st()).saver) && await feat() !== 'study', await feat());
  { await p.mouse.click(20, 20); await p.adv(1000); await p.saver(); await tile('cv-sci');
    const moonNow = await feat() === 'moon';
    if (!moonNow) { await tile('sci'); const src = await p.evaluate(() => (document.getElementById('pcFrame') || {}).src || ''); ok('과학 표지를 누르면 그날 과학 편이 열림 (v147)', /pieces\/piece\.html\?ep=(1[5-9]|2[01])/.test(src), src);
      await p.adv(2500); await p.evaluate(() => { const f = document.getElementById('pcFrame'); const l = f && f.contentDocument && f.contentDocument.getElementById('logo'); if (l) l.click(); }); await p.adv(1500);
      ok('과학 편을 닫으면 위젯 면으로', !(await p.evaluate(() => !!document.getElementById('pcFrame'))) && (await p.st()).saver.startsWith('face')); }
    else ok('과학 갈래: 달이 볼 만한 날이라 달 카드 (v147)', true);
    await p.mouse.click(20, 20); await p.adv(1000); }
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
  const n0 = p.api; await p.click('#chips button'); await p.adv(9000); ok('칩을 누르면 다시 물음', p.api > n0);
  { const lastQ = () => p.lastBody.messages.at(-1).content.split('\n').at(-1);
    await p.say('보름달', 9000); ok('칩 낱말만 말하면 그 칩으로 물음 ("보름달" → 보름달은 왜 둥글어?)', /보름달은 왜 둥글어/.test(lastQ()), lastQ());
    await p.say('누구야', 9000); ok('"누구야"만 말하면 칩으로 바꾸지 않음', !/둥글어|떨어져|바다|뛰면/.test(lastQ()), lastQ());
    await p.say('달에서 뛰면', 9000); await p.say('보름달은 언제 떠', 9000); ok('낱말 하나 겹친 새 질문은 칩으로 바꾸지 않음 (v136 버그)', /보름달은 언제 떠/.test(lastQ()) && !/둥글어/.test(lastQ()), lastQ()); }
  await p.context().close();

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
  // v122: 궁금칸(깨어난 첫 화면)의 아래 네 칸이 없어졌다 → 할 일은 대기화면 타일에서만 누른다(아래 '대기화면에서 줄 긋기'가 같은 기준5를 본다)
  ok('궁금칸에 아래 네 칸 없음 (v122)', await p.evaluate(() => { const t = document.querySelector('.today'); return !t || getComputedStyle(t).display === 'none'; }));
  ok('궁금칸: 뭐가 궁금해? + 묻기 줄', await p.evaluate(() => document.getElementById('sheet').textContent === '뭐가 궁금해?' && document.querySelector('.qbox').getBoundingClientRect().width > 600));
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
  p = await open(b, { time: '2026-11-16T16:00', apiErr: { status: 400, msg: 'You have reached your specified API usage limits. You will regain access on 2026-12-01 at 00:00 UTC.' } }); await p.say('하늘은 왜 파래', 2500);
  s = await p.evaluate(() => ({ t: document.body.innerText.includes('엄마 아빠한테 말해 줘'), d: JSON.stringify(JSON.parse(localStorage.getItem('gk-diag') || '[]')).includes('월 사용 한도') }));
  ok('월 사용 한도에 걸리면 부모에게 알리라는 말 + 진단 기록 (v178)', s.t && s.d, s); await p.context().close();
  p = await open(b, { time: '2026-11-16T16:00', offline: true }); await p.say('내일 준비물 색종이 가져가야 돼'); s = await p.st(); ok('기준6 인터넷 없이 적힘', s.todo.length === 1 && s.todo[0][1] === '2026-11-17', s); await p.context().close();
  p = await open(b, { time: '2026-11-16T16:00', settings: { cap: 10 } }); await p.evaluate(() => localStorage.setItem('gk-count-2026-11-16', '10'));
  await p.say('일기 써야 돼'); s = await p.st(); ok('기준6 상한 뒤에도 적힘', s.todo.length === 1 && s.todo[0][0] === '일기 쓰기' && !s.saver, s);
  await p.say('달은 왜 모양이 바뀌어?', 3000); s = await p.st(); ok('상한 뒤 질문은 막힘', p.api === 0 && !!s.saver, s); await p.context().close();
  p = await open(b, { time: '2026-11-16T23:30', settings: { hFrom: 7, hTo: 21 } }); await p.say('일기 써야 돼'); s = await p.st(); ok('쉬는 시간에는 할 일도 막힘', s.todo.length === 0, s); await p.context().close();

  // ---------- v122 새 화면 ----------
  console.log('v122. 새 화면 (조각 장 · 궁금칸 · 답 · 달력 · 날씨 · 부모님 화면)');
  { const LONG = '달은 스스로 빛을 내지 못하고 햇빛을 받아서 빛나. 달은 공처럼 둥글어서 언제나 절반은 햇빛을 받고 절반은 그늘이야. 달이 지구 둘레를 한 달에 한 바퀴 도는 동안, 지구에서 보이는 《밝은 쪽의 넓이》가 날마다 조금씩 달라져. 해와 같은 쪽에 있으면 밝은 면이 안 보여서 그믐이 되고, 해 반대쪽에 있으면 밝은 면이 다 보여서 보름달이 돼. 그 사이에는 초승달과 반달로 보여. 그래서 달 모양이 날마다 바뀌는 것처럼 보이는 거야.\n@@ 달 | 🌙 | 왜 달은 안 떨어져?; 달에도 바다가 있어?; 보름달은 왜 둥글어?';
    const box = async sel => { const bx = await p.locator(sel).first().boundingBox(); await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.adv(1500); };
    let p = await open(b, { time: newsDate + 'T16:10', read: newsDate }), s;
    ok('캐릭터(궁금이) 요소 없음', await p.evaluate(() => !document.querySelector('svg.gk, #loBuddy, .lo-buddy, .lo-glow, .wordmark .eye')));
    // 조각 장 → 궁금칸 → 답 → 아까 물은 것
    await p.evaluate(() => { window.__gkPieceNoPage = true; }); await p.saver(); await box('#svFace [data-cv="sci"]'); await box('#svFace [data-cv="piece"]'); ok('표지 갈래 셋: 신문·이야기·과학 (v147·v174)', await p.evaluate(() => [...document.querySelectorAll('#fcFeat .cc-tabs span')].map(x => x.textContent).join('') === '신문이야기과학' && document.getElementById('fcFeat').classList.contains('piece')));
    await box('#fcFeat .cc-h'); s = await p.st(); ok('조각 장 본문 → 궁금칸(조각과 이어 묻기 딸려 옴)', s.home && !s.saver && s.sheet === '뭐가 궁금해?' && await p.evaluate(() => !!document.querySelector('#zUnder .zu-pc') && !!document.querySelector('#zUnder .zu-chip')), s);
    const R = () => p.evaluate(() => { const r = document.querySelector('.qbox').getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map(Math.round).join(','); });
    const r0 = await R(); await p.evaluate(() => { document.getElementById('app').dataset.state = 'listen'; }); await p.adv(400); const r1 = await R(); await p.evaluate(() => { document.getElementById('app').dataset.state = 'think'; }); await p.adv(400); const r2 = await R(); await p.evaluate(() => { document.getElementById('app').dataset.state = 'idle'; });
    ok('묻기 줄이 궁금칸·듣는 중·생각하는 중에서 같은 자리', r0 === r1 && r1 === r2 && r0 === '136,407,1016,511', [r0, r1, r2]);
    const a0 = p.api; await p.click('#zUnder .zu-chip'); await p.adv(9000); s = await p.st(); ok('궁금칸의 이어 묻기 → 답', p.api === a0 + 1 && !s.home && /햇빛/.test(s.sheet), [s, (p.bodies || []).slice(a0)]);
    ok('답 화면에 소리 글리프(60px 이상)', await p.evaluate(() => { const r = document.getElementById('soundBtn').getBoundingClientRect(); return r.width >= 60 && r.height >= 60 && getComputedStyle(document.getElementById('soundBtn')).display !== 'none'; }));
    const cnt = (await p.st()).count; await p.click('#gkHome'); await p.adv(1500); s = await p.st(); ok('답의 홈 단추 → 위젯 면', /^face/.test(s.saver), s.saver);
    await p.mouse.click(20, 20); await p.adv(1500); ok('궁금칸에 아까 물은 것 한 줄', await p.evaluate(() => !!document.querySelector('#zUnder .zu-prev')));
    await p.click('#zUnder .zu-prev'); await p.adv(1500); s = await p.st(); ok('아까 물은 것 → 그 답을 다시 엶 (다시 묻지 않음, 질문 수 그대로)', p.api === a0 + 1 && !s.home && /햇빛/.test(s.sheet) && s.count === cnt, [p.api, s.count, cnt]);
    await p.click('#gkHome'); await p.adv(1500); await box('#svFace [data-cv="sci"]'); await box('#svFace [data-cv="piece"]'); await box('#fcFeat .cc-foot'); await p.adv(8000); s = await p.st(); ok('조각 장의 이어 묻기 칩 → 궁금칸을 거치지 않고 바로 답', p.api > a0 + 1 && !s.home && !s.saver && s.count === cnt + 1, [p.api - a0, s.count, cnt]);
    // 긴 답: 문장 끝에서만 쪽 나눔
    await p.route(/api\.anthropic\.com/, r => { if (r.request().method() === 'OPTIONS') return r.fulfill({ status: 204, headers: CORS }); p.api++; r.fulfill({ headers: CORS, json: { content: [{ type: 'text', text: LONG }], stop_reason: 'end_turn' } }); });
    await p.say('달은 왜 모양이 바뀌어?', 12000);
    const pg = await p.evaluate(() => { const n = document.querySelector('#ansPg .pn'), br = [...document.querySelectorAll('#sheet .pgbrk')]; return { shown: !document.getElementById('ansPg').hidden, n: n && n.textContent, ends: br.map(b => (b.previousElementSibling.textContent || '').trim().slice(-1)), fs: getComputedStyle(document.getElementById('sheet')).fontSize }; });
    ok('긴 답: 쪽 표시 "1 / N", 쪽은 문장 끝에서만', pg.shown && /^1 \/ [2-9]$/.test(pg.n) && pg.ends.length >= 1 && pg.ends.every(c => /[.!?]/.test(c)), pg);
    await p.click('#ansPg button'); await p.adv(600); ok('쪽 화살 → 2쪽', await p.evaluate(() => /^2 \//.test(document.querySelector('#ansPg .pn').textContent) && document.getElementById('sheet').scrollTop > 0));
    ok('이 흐름에서 바깥 요청 0 · 콘솔 오류 0', p.ext.length === 0 && p.cerr.length === 0, [p.ext.slice(0, 3), p.cerr.slice(0, 3)]); await p.context().close();
    // 달력: 일정 말하기 (기기 규칙 — AI를 부르지 않고, 질문 수에 세지 않는다)
    p = await open(b, { time: newsDate + 'T16:10', read: newsDate, sr: 1 }); const cal = () => p.evaluate(() => (JSON.parse(localStorage.getItem('gk-cal') || '{"items":[]}').items || []).map(x => x.date.slice(8) + ' ' + x.text));
    await p.say('27일에 치과 가', 5000); let c = await cal(); ok('평소에 한 말은 일정으로 들어가지 않음', c.length === 0, c);
    const a1 = p.api, n1 = (await p.st()).count; await p.go('cal'); await p.adv(2500); ok('일정이 없을 때: 조용한 한 줄', await p.evaluate(() => /일정이 없어/.test(document.getElementById('agList').textContent)));
    await box('[data-act="evadd"]'); await p.speak('27일에 치과 가', 5000); await p.adv(3000); c = await cal(); s = await p.st();
    ok('일정 말하기 → 기기가 바로 저장, 달력으로 돌아와 들은 대로 보여 줌', c.length === 1 && /^27 치과/.test(c[0]) && /\bcal\b/.test(s.saver) && p.api === a1 && s.count === n1 && await p.evaluate(() => !!document.querySelector('#agFoot [data-act="evdate"]') && !!document.querySelector('#agFoot [data-act="evundo"]') && /치과/.test(document.getElementById('agList').textContent)), [c, s.saver, p.api - a1]);
    await box('#agFoot [data-act="evundo"]'); c = await cal(); ok('삭제(방금 적은 것) → 되돌림', c.length === 0, c);
    await box('[data-act="evadd"]'); await p.speak('치과 가', 5000); c = await cal(); s = await p.st(); ok('날짜를 못 알아들으면 저장하지 않고 되물음', c.length === 0 && /며칠/.test(s.sheet), [c, s.sheet]);
    await p.evaluate(() => { const t = new Date(), f = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; /* 오늘부터 7일 — 날짜를 17~23일로 박아 두면 20일 이후에는 남은 일정이 줄어 실패한다 */ localStorage.setItem('gk-cal', JSON.stringify({ v: 1, last: null, items: [0, 1, 2, 3, 4, 5, 6].map(i => ({ id: 'x' + i, date: f(new Date(t.getFullYear(), t.getMonth(), t.getDate() + i)), text: '일정 ' + i, raw: '', at: i })) })); });
    await p.click('#gkHome'); await p.adv(1200); // 되묻기(며칠이야?)가 떠 있던 것을 홈 단추로 닫는다
    await p.go('cal'); await p.adv(2500); ok('일정이 많을 때: "더 보기"(개수를 세지 않음), 넘침 없음', await p.evaluate(() => /더 보기/.test(document.getElementById('agList').textContent) && document.getElementById('agFoot').getBoundingClientRect().bottom <= innerHeight));
    await box('.cq-nav [data-d="1"]'); { const m = await p.evaluate(() => [document.getElementById('cqMon').textContent, document.getElementById('cqNow').hidden, document.querySelectorAll('#cqGrid > span').length]); ok('달 넘기기 → 2026년 12월, "이번 달" 단추, 칸 수는 7의 배수', m[0] === '2026년 12월' && !m[1] && m[2] % 7 === 0, m); }
    await p.context().close();
    // 날씨: 코드마다 제 하늘, 한마디는 지금 상태
    const SKY = ['day-clear', 'day-part', 'day-cloud', 'day-rain', 'day-snow', 'dusk-clear', 'dusk-cloud', 'night-clear', 'night-cloud'], LAYER = ['cloud-a', 'cloud-b', 'cloud-s', 'cloud-p', 'fog', 'rain-1', 'rain-2', 'rain-3', 'snow-1', 'snow-2', 'snow-3'];
    ok('하늘 그림 파일이 모두 있음', SKY.concat(LAYER).every(n => fs.existsSync(path.join(ROOT, 'bg', `wx-${n}.webp`))));
    for (const [code, t, time, sky, fx, tip] of [[0, 7.2, 'T13:30', 'day-clear', 'ca1', ''], [2, 7.2, 'T13:30', 'day-part', 'ca3', ''], [45, 7.2, 'T13:30', 'day-cloud', 'cb fog', '안개가 꼈어. 앞을 잘 보고 걸어.'], [61, 7.2, 'T13:30', 'day-rain', 'cb r2', '비가 와. 우산 챙겨!'], [95, 7.2, 'T13:30', 'day-rain', 'cb r3 fl', '비가 많이 와. 우산 꼭 챙겨!'], [73, -3, 'T13:30', 'day-snow', 'cb s1', '눈이 와. 따뜻하게 입자.'], [0, 7.2, 'T17:30', 'dusk-clear', 'ca1', ''], [63, 7.2, 'T21:30', 'night-cloud', 'cb r2', '비가 와. 우산 챙겨!']]) {
      p = await open(b, { time: newsDate + time, read: newsDate, wx: { code, t } }); await p.saver(); await box('#fcWx');
      const g = await p.evaluate(() => { const sv = document.getElementById('saver'), k = document.getElementById('wxSky'); return { pg: sv.dataset.pg, sky: sv.dataset.sky, fx: k && k.dataset.fx, tip: (document.querySelector('.wx-b p') || {}).textContent, one: getComputedStyle(document.querySelector('.wx-b p')).whiteSpace === 'nowrap', bottom: Math.max(...[...document.querySelectorAll('.wx-foot b')].map(e => e.getBoundingClientRect().bottom)), anim: document.getAnimations().filter(a => a.effect && a.effect.target && a.effect.target.closest && a.effect.target.closest('#wxSky')).length }; });
      ok(`날씨 코드 ${code} ${time.slice(1)} → ${sky} · ${fx}`, g.pg === 'wx' && g.sky === sky && g.fx === fx && (!tip || g.tip === tip) && g.one && g.bottom <= 820 && g.anim > 0, g);
      if (code === 61) { await p.click('#gkHome'); await p.adv(1500); ok('날씨 화면을 닫으면 움직임이 멈춤', await p.evaluate(() => getComputedStyle(document.getElementById('wxSky')).display === 'none' && document.getAnimations().filter(a => a.effect && a.effect.target && a.effect.target.closest && a.effect.target.closest('#wxSky')).length === 0)); }
      await p.context().close(); }
    p = await open(b, { time: newsDate + 'T13:30', read: newsDate, wx: { code: 61 }, settings: { wxStill: 'on' } }); await p.saver(); await box('#fcWx');
    ok('부모 설정 "날씨 하늘 멈춤"이면 움직이지 않음', await p.evaluate(() => document.getAnimations().filter(a => a.effect && a.effect.target && a.effect.target.closest && a.effect.target.closest('#wxSky')).length === 0)); await p.context().close();
    for (const [w, h] of [[1600, 760], [1920, 1000]]) { p = await open(b, { time: newsDate + 'T13:30', read: newsDate, w, h, wx: { code: 73, t: -12 } }); await p.saver(); await box('#fcWx');
      const o1 = await p.evaluate(() => Math.max(...[...document.querySelectorAll('.wx-foot b, .wx-foot small, .wx-b p')].map(e => e.getBoundingClientRect().bottom)) <= innerHeight && Math.max(...[...document.querySelectorAll('.wx-foot div, .wx-b p')].map(e => e.getBoundingClientRect().right)) <= innerWidth);
      await p.click('#gkHome'); await p.adv(1200); await p.go('cal'); await p.adv(2500); const o2 = await p.evaluate(() => document.getElementById('agFoot').getBoundingClientRect().bottom <= innerHeight && document.getElementById('cqGrid').getBoundingClientRect().bottom <= innerHeight);
      await p.click('#gkHome'); await p.adv(1200); await p.mouse.click(20, 20); await p.adv(1500); const o3 = await p.evaluate(() => { const r = document.querySelector('.qbox').getBoundingClientRect(); return r.right <= innerWidth && r.bottom <= innerHeight && document.documentElement.scrollWidth <= innerWidth; });
      ok(`${w}×${h}: 날씨(−12°)·달력·궁금칸 넘침 없음`, o1 && o2 && o3, [o1, o2, o3]); await p.context().close(); }
    // 부모님 화면: 삭제한 것 · 새 설정 · 옛 저장값
    p = await open(b, { time: newsDate + 'T23:30', read: newsDate, settings: { scaryNight: 'off', oldKey: 1 } }); await p.saver(); s = await p.st(); ok('밤 화면 끔 → 밤 11시 반에도 위젯 면', /^face/.test(s.saver), s.saver);
    await p.mouse.move(30, 30); await p.mouse.down(); await p.adv(2400); await p.mouse.up(); await p.adv(500);
    ok('밤 화면이 꺼져 있으면 바로가기 "밤 화면"은 감춤', await p.evaluate(() => !document.getElementById('log').hidden && document.querySelector('#log [data-go="night"]').hidden));
    ok('부모님 화면: 삭제한 항목 없음, 새 설정 둘, 옛 저장값으로도 오류 없음', await p.evaluate(() => !document.querySelector('[data-k="scaryNight"]') && !document.getElementById('linesDbg') && !!document.querySelector('.seg[data-k="nightScr"]') && !!document.querySelector('.seg[data-k="wxStill"]') && !!document.querySelector('.pr-nav')) && p.cerr.length === 0 && errs.length === 0, [p.cerr, errs]);
    ok('부모님 화면: 글자 24px 이상 · 누르는 곳 56px 이상', await p.evaluate(() => { const bad = []; document.querySelectorAll('.pr-nav button').forEach(nb => { nb.click(); document.querySelectorAll('.pr-sec.on *').forEach(e => { if (!e.getClientRects().length) return; const cs = getComputedStyle(e); if ([...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && parseFloat(cs.fontSize) < 24) bad.push(e.textContent.trim().slice(0, 8) + cs.fontSize); if (/^(BUTTON|SELECT|INPUT)$/.test(e.tagName) && e.getBoundingClientRect().height < 56) bad.push((e.textContent || e.id).trim().slice(0, 8) + Math.round(e.getBoundingClientRect().height)); }); }); return bad; }).then(x => x.length === 0 || (console.log('   ', x.slice(0, 6)), false)));
    await p.context().close();
    p = await open(b, { time: newsDate + 'T23:30', read: newsDate, settings: { nightScr: 'on' } }); await p.saver(); s = await p.st(); ok('밤 화면 켬 → 밤 화면', /night/.test(s.saver), s.saver);
    await p.mouse.move(30, 30); await p.mouse.down(); await p.adv(2400); await p.mouse.up(); await p.adv(500); ok('밤 화면을 켰을 때는 바로가기 "밤 화면"이 보임 (2초 누르기로 부모님 화면)', await p.evaluate(() => !document.getElementById('log').hidden && !document.querySelector('#log [data-go="night"]').hidden)); await p.context().close();
  }

  { // v178 저녁 밤하늘 대기화면: 어두워진 뒤~잠자기 30분 전 전체판, 그 뒤 30분은 글 없이 어둡게, 잠자는 시각부터 밤 화면
    console.log('v178. 저녁 밤하늘 대기화면');
    const nsSt = p => p.evaluate(() => { const sv = document.getElementById('saver'), ch = document.querySelector('#nsChart svg'); return { c: [...sv.classList].filter(x => x !== 'saver').join(' '), one: getComputedStyle(document.getElementById('nsOne')).display !== 'none' && !document.getElementById('nsOne').hidden, h: document.getElementById('nsH').textContent, t: document.getElementById('nsTime').textContent, dots: ch ? ch.querySelectorAll('circle').length : 0, lines: ch ? ch.querySelectorAll('path[stroke], text').length : -1, home: !document.getElementById('gkHome').hidden }; });
    const nsOpen = async (t, settings) => { const p = await open(b, { time: newsDate + t, read: newsDate, settings: Object.assign({ nightScr: 'on' }, settings) }); await p.saver(); await p.adv(4000); await p.waitForTimeout(1500); await p.adv(1000); return p; };
    let p = await nsOpen('T20:30'); let q = await nsSt(p);
    ok('20:30: 밤하늘 대기화면, 시계·찾아볼 것 한 줄, 별은 점만(선·이름표 없음), 홈 단추 없음', q.c === 'nsky' && q.t === '8:30' && q.one && q.h.length > 3 && q.dots > 20 && q.lines === 0 && !q.home, q);
    await p.mouse.click(800, 400); await p.adv(1200); ok('밤하늘 대기화면을 누르면 깨어남', await p.evaluate(() => document.getElementById('saver').hidden)); await p.context().close();
    p = await nsOpen('T21:45'); q = await nsSt(p); ok('21:45(잠자기 15분 전): 글은 끄고 하늘만 어둡게', q.c === 'nsky quiet' && !q.one, q); await p.context().close();
    p = await nsOpen('T17:20'); q = await nsSt(p); ok('17:20(아직 밝음): 위젯 면 그대로', /^face/.test(q.c), q); await p.context().close();
    p = await nsOpen('T22:15', { bed: '22:30' }); q = await nsSt(p); ok('잠자는 시각 22:30이면 22:15는 아직 밤하늘(어둡게)', q.c === 'nsky quiet', q); await p.context().close();
    p = await nsOpen('T20:30', { nsky: 'off' }); q = await nsSt(p); ok('저녁 밤하늘을 끄면 위젯 면', /^face/.test(q.c), q); await p.context().close();
    p = await nsOpen('T22:30'); q = await p.evaluate(() => { const c = getComputedStyle(document.getElementById('svTime')).color.match(/\d+/g).map(Number); return { night: document.getElementById('saver').classList.contains('night'), max: Math.max(...c) }; });
    ok('22:30: 밤 화면, 시계 색은 아주 어둡게', q.night && q.max < 90, q); await p.context().close();
  }
  { // v152 밤 화면: 기본 켬, 밤 11시 반~아침 7시. 6시 반부터 새벽빛. 경계 앞뒤로 본다
    console.log('v152. 밤 화면 (23:30~07:00, 새벽빛)');
    ok('밤 화면은 기본으로 켬', /DEFAULTS = \{[^}]*nightScr: 'on'/.test(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')));
    for (const [t, want] of [['T21:59', 'face'], ['T22:01', 'night'], ['T06:29', 'night'], ['T06:59', 'night dawn'], ['T07:01', 'face']]) { // v178: 잠자는 시각(기본 22:00)부터
      const day = t < 'T12' ? plus(newsDate, 1) : newsDate;
      const p = await open(b, { time: day + t, read: day, settings: { nightScr: 'on', nsky: 'off' } }); await p.saver(); const s = await p.st();
      const dawn = await p.evaluate(() => document.getElementById('saver').classList.contains('dawn'));
      const got = /night/.test(s.saver) ? 'night' + (dawn ? ' dawn' : '') : /^face/.test(s.saver) ? 'face' : s.saver;
      ok(`밤 화면: ${t.slice(1)} → ${want}`, got === want, got);
      if (want === 'night') ok(`밤 화면 ${t.slice(1)}: 흰 글자 없음, 날씨 한 줄, 할 일 수는 없음(v178)`, await p.evaluate(() => { const c = getComputedStyle(document.getElementById('svTime')).color.match(/\d+/g).map(Number); return Math.max(...c) < 120 && !!document.querySelector('#svNight .nt-seg') && !/할 일/.test(document.getElementById('svNight').textContent); }));
      await p.context().close();
    }
  }
  // ---------- v122 검토에서 나온 결함의 되풀이 점검 ----------
  console.log('v122-검토. 누른 뒤 최종 상태 · 달력 되묻기 · 없는 날짜 · 쉬는 시간');
  { const D0 = '2026-11-16'; // 월요일
    const fakeSR = fail => async p => { await p.addInitScript(fail => { window.SpeechRecognition = window.webkitSpeechRecognition = class { start() { if (fail) throw new Error('no mic'); setTimeout(() => this.onstart && this.onstart(), 0); } stop() { setTimeout(() => this.onend && this.onend(), 0); } abort() { this.stop(); } }; }, fail); };
    const box = async sel => { const bx = await p.locator(sel).first().boundingBox(); await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.adv(1500); };
    const cal = () => p.evaluate(() => (JSON.parse(localStorage.getItem('gk-cal') || '{"items":[]}').items || []).map(x => x.date + ' ' + x.text));
    const ask = () => p.evaluate(() => { const a = document.getElementById('agAsk'); return a.hidden ? '' : a.textContent; });
    const st8 = () => p.evaluate(() => document.getElementById('app').dataset.state);
    let s, c;
    // A1. 묻기 줄을 누르면 듣는 중이 되고 그대로 있다(처리기가 둘이면 켜자마자 꺼진다)
    let p = await open(b, { time: D0 + 'T16:10', read: D0, pre: fakeSR(false) });
    await box('.qbox'); const l1 = await st8(); await p.adv(2000); const l2 = await st8(); ok('궁금칸: 묻기 줄 가운데를 누르면 듣는 중, 2초 뒤에도 듣는 중', l1 === 'listen' && l2 === 'listen', [l1, l2]);
    await box('.qbox'); ok('듣는 중에 다시 누르면 멈춤', await st8() !== 'listen', await st8());
    await p.say('달은 왜 모양이 바뀌어?', 9000); await box('.qbox'); const l3 = await st8(); await p.adv(2000); const l4 = await st8(); ok('답 화면: "더 물어 봐" 줄을 누르면 듣는 중, 2초 뒤에도 듣는 중', l3 === 'listen' && l4 === 'listen', [l3, l4]);
    await box('.qbox'); ok('답 화면: 듣는 중에 다시 누르면 멈춤', await st8() !== 'listen', await st8());
    // 5. 일정 말하기를 누르고 말없이 끝나면 일정 받기 상태가 풀린다
    await p.go('cal'); await p.adv(2500); await box('[data-act="evadd"]'); const l5 = await st8(); await box('.qbox'); await p.adv(1500); s = await p.st();
    ok('일정 말하기 → 듣는 중 → 말없이 끝나면 달력으로 돌아옴', l5 === 'listen' && /\bcal\b/.test(s.saver), [l5, s.saver]);
    await p.click('#gkHome'); await p.adv(1200); await p.mouse.click(20, 20); await p.adv(1500); await p.say('27일에 치과 가', 5000); c = await cal(); ok('말없이 끝난 뒤의 다음 말은 일정으로 가지 않음', c.length === 0, c);
    // 11. 밤하늘 화면에도 홈 캡슐
    await p.go('sky'); await p.adv(4000); s = await p.st(); const hb = await p.evaluate(() => { const h = document.getElementById('gkHome'), r = h.getBoundingClientRect(); return [!h.hidden, Math.round(r.left), Math.round(r.top), Math.round(r.height)]; });
    await p.click('#gkHome'); await p.adv(1500); const s2 = await p.st(); ok('밤하늘 화면: 홈 캡슐이 같은 자리에 있고 누르면 위젯 면(깨어나지 않음)', s.saver === 'sky' && hb[0] && Math.abs(hb[1] - 48) <= 4 && Math.abs(hb[2] - 40) <= 4 && hb[3] >= 60 && await p.evaluate(() => { const h = document.getElementById('gkHome').getBoundingClientRect(), o = (a, b) => !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top); return true; }) && /^face/.test(s2.saver), [s.saver, hb, s2.saver]);
    ok('지운 진단 줄(linesDbg)을 참조하는 코드가 없음', !fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').includes('linesDbg')); await p.context().close();
    // 7. 마이크를 못 켜면 묻기 줄 아래에 한 줄
    p = await open(b, { time: D0 + 'T16:10', read: D0, pre: fakeSR(true) }); await box('.qbox');
    ok('마이크를 켜지 못하면 묻기 줄 아래에 28px 한 줄', await p.evaluate(() => { const n = document.getElementById('micNote'), q = document.querySelector('.qbox').getBoundingClientRect(), r = n.getBoundingClientRect(); return /마이크를 켜지 못했어/.test(n.textContent) && getComputedStyle(n).fontSize === '28px' && r.height > 0 && r.top >= q.bottom; })); await p.context().close();
    // 2·9·4. 달력 되묻기는 화면에 글과 단추로, 없는 날짜는 저장하지 않는다
    p = await open(b, { time: D0 + 'T16:10', read: D0 }); await p.go('cal'); await p.adv(2500);
    await box('[data-act="evadd"]'); await p.say('12월 3일에 할머니 생신', 3000); await p.adv(2500); c = await cal(); let q = await ask();
    ok('다른 달 일정은 되묻는다: 화면에 문장과 단추 둘(60px 이상)', c.length === 0 && /12월 3일 목 · 할머니 생신.*달력에 적을까/.test(q) && await p.evaluate(() => { const bs = [...document.querySelectorAll('#agAsk .pc')]; return bs.length === 2 && bs[0].textContent === '응, 적어 줘' && bs[1].textContent === '아니' && bs.every(x => x.getBoundingClientRect().height >= 60 && x.getBoundingClientRect().right <= innerWidth); }), [c, q]);
    await box('#agAsk [data-act="evyes"]'); c = await cal(); ok('"응, 적어 줘" → 저장', c.length === 1 && c[0] === '2026-12-03 할머니 생신' && await ask() === '', c);
    await box('[data-act="evadd"]'); await p.say('11월 3일 소풍', 3000); await p.adv(2500); c = await cal(); q = await ask(); ok('지난 날짜는 내년으로 넘기기 전에 되묻는다', c.length === 1 && /내년 11월 3일.*소풍.*내년 11월 3일에 적을까/.test(q), [c, q]);
    await box('[data-act="evadd"]'); await p.say('아니', 3000); await p.adv(2500); c = await cal(); ok('되묻기에 "일정 말하기"로 "아니"라고 말하면 적지 않음', c.length === 1 && await ask() === '', [c, await ask()]);
    await box('[data-act="evadd"]'); await p.say('11월 3일 소풍', 3000); await p.adv(2500); await box('[data-act="evadd"]'); await p.say('응', 3000); await p.adv(2500); c = await cal(); ok('되묻기에 "응"이라고 말하면 적음', c.includes('2027-11-03 소풍'), c);
    await box('[data-act="evadd"]'); await p.say('31일에 치과', 3000); await p.adv(2500); c = await cal(); q = await ask(); ok('없는 날짜(11월 31일)는 저장하지 않고 되묻는다', c.length === 2 && /11월에는 31일이 없어/.test(q), [c, q]);
    await box('[data-act="evadd"]'); await p.say('2월 30일 여행', 3000); await p.adv(2500); c = await cal(); q = await ask(); ok('없는 날짜(2월 30일)는 저장하지 않고 되묻는다', c.length === 2 && /2월에는 30일이 없어/.test(q), [c, q]);
    await box('[data-act="evadd"]'); await p.say('이십칠 일에 치과', 3000); await p.adv(2500); c = await cal(); ok('한글 숫자 "이십칠 일에 치과"', c.includes('2026-11-27 치과'), c);
    await box('[data-act="evadd"]'); await p.say('금요일까지 독서록 내야 돼', 3000); await p.adv(2500); c = await cal(); ok('"금요일까지 독서록 내야 돼" → 이번 주 금요일', c.includes('2026-11-20 독서록'), c);
    await box('[data-act="evadd"]'); await p.say('십이월 삼일 발표회', 3000); await p.adv(2500); q = await ask(); ok('한글 숫자 "십이월 삼일" → 12월 3일로 알아듣고 되묻는다', /12월 3일 목 · 발표회/.test(q), q); await box('#agAsk [data-act="evno"]'); ok('"아니" 단추 → 되묻기 사라짐, 저장 안 함', await ask() === '' && !(await cal()).some(x => /발표회/.test(x)));
    await box('#cqGrid [data-k$="-19"]'); await box('[data-act="evadd"]'); await p.say('25일에 수영', 3000); await p.adv(2500); c = await cal(); ok('날짜 칸을 골랐어도 말 속 날짜를 따른다', c.includes('2026-11-25 수영') && !c.some(x => /-19 /.test(x)), c);
    // 3. 긴 일정 이름
    const LONG30 = '가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나';
    await box('[data-act="evadd"]'); await p.say('28일에 ' + LONG30, 3000); await p.adv(2500); c = await cal(); const lt = (c.find(x => x.startsWith('2026-11-28')) || '').slice(11);
    ok('긴 이름은 24자 안으로 잘라 저장, 줄·단추가 화면 밖으로 나가지 않음', lt.length >= 2 && lt.length <= 24 && await p.evaluate(() => [...document.querySelectorAll('.ag-row, #agFoot > *')].every(e => e.getBoundingClientRect().right <= innerWidth - 40)), [lt, lt.length]);
    await p.evaluate(L => { const d = JSON.parse(localStorage.getItem('gk-cal')); d.items = [{ id: 'L', date: '2026-11-17', text: L, raw: '', at: 1 }]; d.last = null; localStorage.setItem('gk-cal', JSON.stringify(d)); }, LONG30); await p.go('cal'); await p.adv(2500);
    ok('옛 저장값의 띄어쓰기 없는 30자: 한 줄 말줄임, "일정 말하기"가 화면 안', await p.evaluate(() => { const r = document.querySelector('.ag-row'), z = document.querySelector('#agFoot .zbar').getBoundingClientRect(), tx = r.querySelector('.tx'); return r.getBoundingClientRect().right <= innerWidth - 40 && z.right <= innerWidth - 40 && tx.scrollWidth > tx.clientWidth && r.getBoundingClientRect().height < 100; }));
    // 12. 평소 말: "달력에 … 적어 줘"
    await p.click('#gkHome'); await p.adv(1200); await p.mouse.click(20, 20); await p.adv(1500); const a2 = p.api, n2 = (await p.st()).count;
    await p.say('달력에 27일 치과 적어 줘', 3000); c = await cal(); s = await p.st(); ok('"달력에 27일 치과 적어 줘" → 일정으로, AI 안 부름, 질문 수 그대로, "삭제" 칩', c.includes('2026-11-27 치과') && p.api === a2 && s.count === n2 && /달력에 적었어.*27일 금 · 치과/.test(s.sheet) && s.chips.includes('삭제') && s.todo.length === 0, [c, s.sheet, s.chips]);
    await p.say('삭제', 3000); c = await cal(); ok('"삭제" → 되돌림', !c.includes('2026-11-27 치과'), c); await p.context().close();
    // v175: 전체 점검에서 나온 것 — 폰 세로 달력 제목 한 줄, 폰 세로 할 일 단추가 화면 안, 스크롤해도 로고 뒤에 띠, 밤 달력 일요일이 보임
    { const D = '2026-11-18', seed = p => p.evaluate(D => { const now = Date.now(); localStorage.setItem('gk-todo', JSON.stringify({ items: ['받아쓰기', '미니 수학', '일기', '리코더', '체육복', '독서록', '준비물'].map((t, i) => ({ id: 't' + i, text: t, due: i < 3 ? D : '2026-11-2' + i, at: now - (10 - i) * 1000, done: 0 })), last: null })); }, D);
      let pm = await open(b, { time: D + 'T16:20', read: D, w: 360, h: 780 }); await seed(pm); await pm.go('cal'); await pm.adv(2500);
      let q = await pm.evaluate(() => { const R = e => e.getBoundingClientRect(), m = R(document.getElementById('cqMon')), d = R(document.querySelector('.cq-dow')); return [document.getElementById('cqMon').textContent, Math.round(m.height), m.bottom <= d.top + 1]; });
      ok('v175 폰 세로 달력: 제목 "2026년 11월"이 한 줄이고 요일 줄을 덮지 않음', q[0] === '2026년 11월' && q[1] <= 40 && q[2], q);
      await pm.go('todo'); await pm.adv(2500); q = await pm.evaluate(() => { const z = document.querySelector('#saver .td-foot .zbar').getBoundingClientRect(), sc = [...document.querySelectorAll('#saver, #saver *')].find(e => e.scrollHeight > e.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(e).overflowY)); if (sc) sc.scrollTop = 160; const bf = getComputedStyle(document.getElementById('saver'), '::before'); return { zin: z.bottom <= innerHeight + 1 && z.top >= 0, scroll: !!sc, band: bf.position + '|' + bf.height, bg: bf.backgroundColor }; });
      ok('v175 폰 세로 할 일: "할 일 말하기"가 화면 안에 있고, 스크롤되는 화면에는 로고 뒤 바탕 띠(88)가 있음', q.zin && q.band === 'fixed|88px' && q.bg !== 'rgba(0, 0, 0, 0)', q);
      await pm.context().close();
      pm = await open(b, { time: D + 'T22:10', read: D }); await pm.go('cal'); await pm.adv(2500);
      q = await pm.evaluate(() => { const lum = s => { const m = s.match(/[\d.]+/g).map(Number); return (0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2]) * (m[3] === undefined ? 1 : m[3]); }; const su = getComputedStyle(document.querySelector('#cqGrid > span.su:not(.o) b')).color, dw = getComputedStyle(document.querySelector('.cq-dow span')).color; return [document.body.hasAttribute('data-night') || document.body.dataset.theme, su, dw, lum(su) > 90, lum(dw) > 90]; });
      ok('v175 밤 달력: 일요일 숫자와 요일 글자가 어두운 바탕에서 보임(밝은 색)', q[3] && q[4], q);
      await pm.context().close(); }
    // v171: 달력과 할 일을 한 벌로 — 탭, 하루 보기의 할 일(줄 긋기), 할 일 있는 날 점, 홈의 오늘 일정 줄
    { const D = '2026-11-18', p2 = await open(b, { time: D + 'T16:20', read: D }); const tapS = async sel => { const bx = await p2.locator(sel).first().boundingBox(); await p2.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await p2.adv(1500); };
      await p2.evaluate(D => { const now = Date.now(); localStorage.setItem('gk-todo', JSON.stringify({ items: [['미니 수학 두 장', D], ['일기 쓰기', D], ['리코더 연습', '2026-11-19'], ['독서록 쓰기', '2026-11-21']].map(([t, due], i) => ({ id: 't' + i, text: t, due, at: now - (10 - i) * 1000, done: 0 })), last: null }));
        localStorage.setItem('gk-cal', JSON.stringify({ v: 1, items: [{ id: 'e1', date: D, text: '치과', raw: '', at: 1 }], last: null })); }, D);
      await p2.saver(); let q = await p2.evaluate(() => { const r = [...document.querySelectorAll('#fcTodoL .fc-row')]; return { first: r[0].className + '|' + r[0].querySelector('.tx').textContent, n: r.length, du: r.map(x => x.querySelector('.du').textContent).join(','), cnt: /\d+개/.test(document.querySelector('.fc-todo').innerText) }; });
      ok('v171 홈 할 일 칸: 맨 위에 오늘 일정(살구 점 줄), 오늘 할 일에는 "오늘" 표시 없음, 다섯 줄 이내', /\bev\b.*\|치과/.test(q.first) && q.n <= 5 && !/오늘/.test(q.du) && /내일/.test(q.du) && !q.cnt, q);
      await p2.go('cal'); await p2.adv(2500);
      q = await p2.evaluate(() => { const R = e => e.getBoundingClientRect(), tb = document.getElementById('pgTabs'), h = R(document.querySelector('.cq-head')), g = R(document.getElementById('cqGrid')), nv = R(document.querySelector('.cq-nav'));
        return { tabs: !tb.hidden && tb.querySelector('.on').dataset.t, mon: document.getElementById('cqMon').textContent, headIn: h.top >= 120 && h.bottom <= g.top && nv.right <= g.right + 2 && nv.left > g.left + 400, td: [...document.querySelectorAll('#agTd .agt-row[data-todo] .tx')].map(x => x.textContent).join(','), dots: ['19', '21', '20'].map(d => !!document.querySelector('#cqGrid [data-k="2026-11-' + d + '"] i')).join(), foot: R(document.querySelector('#agTd')).bottom <= R(document.querySelector('#agFoot .zbar')).top };
      });
      ok('v171 달력: "할 일 | 달력" 탭(달력 켜짐), 제목 "2026년 11월"과 화살표가 달력 위 한 줄', q.tabs === 'cal' && q.mon === '2026년 11월' && q.headIn, q);
      ok('v171 달력 하루 보기: 오늘 할 일 두 줄, 할 일 있는 날(19·21)에 점, 없는 날(20)엔 없음, 단추와 겹치지 않음', q.td === '미니 수학 두 장,일기 쓰기' && q.dots === 'true,true,false' && q.foot, q);
      await tapS('#agTd .agt-row[data-todo="t0"]'); q = await p2.evaluate(() => [document.querySelector('#agTd .agt-row[data-todo="t0"]').classList.contains('done'), JSON.parse(localStorage.getItem('gk-todo')).items.filter(x => x.done).map(x => x.id).join(), document.getElementById('saver').dataset.pg]);
      ok('v171 달력에서 할 일 줄을 누르면 그 자리에서 줄이 그어지고 저장, 화면은 달력 그대로', q[0] && q[1] === 't0' && q[2] === 'cal', q);
      await tapS('#cqGrid [data-k="2026-11-19"]'); q = await p2.evaluate(() => [...document.querySelectorAll('#agTd .agt-row[data-todo] .tx')].map(x => x.textContent).join(',')); ok('v171 다른 날(19일)을 고르면 그날 할 일만', q === '리코더 연습', q);
      q = await p2.evaluate(() => { const z = document.querySelector('#agFoot .zbar'); return [z.textContent.trim(), z.scrollWidth <= z.clientWidth + 1]; }); ok('v171 날짜를 골라도 단추 글은 "일정 말하기" 그대로, 단추 밖으로 넘치지 않음', q[0] === '일정 말하기' && q[1], q);
      await tapS('.cq-nav [data-d="1"]'); await tapS('#cqGrid [data-k="2026-12-25"]'); q = await p2.evaluate(() => { const c = document.querySelector('#cqGrid [data-k="2026-12-25"]'), n = document.querySelector('#cqGrid [data-k="2026-12-24"]'); return [document.getElementById('cqMon').textContent, c.classList.contains('hd'), (c.querySelector('em') || {}).textContent, getComputedStyle(c.querySelector('em')).display, n.classList.contains('hd'), document.getElementById('agTtl').textContent]; });
      ok('v172 공휴일: 12월 25일 숫자에 색(칸 안 이름은 안 보임), 24일은 아님, 누르면 하루 보기 제목에 "성탄절"', q[0] === '2026년 12월' && q[1] && q[2] === '성탄절' && q[3] === 'none' && !q[4] && /성탄절/.test(q[5]), q);
      await tapS('.cq-nav [data-d="1"]'); await tapS('.cq-nav [data-d="1"]'); q = await p2.evaluate(() => [document.getElementById('cqMon').textContent, ['06', '07', '08', '09'].map(d => (document.querySelector('#cqGrid [data-k="2027-02-' + d + '"] em') || {}).textContent).join()]); ok('v171 공휴일: 2027년 2월 설 연휴(6~8일)와 대체공휴일(9일)', q[0] === '2027년 2월' && q[1] === '설날 연휴,설날,설날 연휴,대체공휴일', q);
      await tapS('.cq-nav [data-d="1"]'); await tapS('.cq-nav [data-d="1"]'); await tapS('.cq-nav [data-d="1"]'); await tapS('#cqGrid [data-k="2027-05-13"]');
      await p2.evaluate(() => { const d = JSON.parse(localStorage.getItem('gk-cal')); d.items.push({ id: 'e9', date: '2027-05-05', text: '놀이공원', raw: '', at: 9 }); localStorage.setItem('gk-cal', JSON.stringify(d)); }); await tapS('#cqGrid [data-k="2027-05-13"]'); await tapS('#cqGrid [data-k="2027-05-13"]');
      q = await p2.evaluate(() => { const R = e => e.getBoundingClientRect(), C = d => document.querySelector('#cqGrid [data-k="2027-05-' + d + '"]'), c = C('13'), cr = R(c), br = R(c.querySelector('b')), c5 = C('05'), dot = R(c5.querySelector('i')), b5 = R(c5.querySelector('b')), r5 = R(c5);
        return { mon: document.getElementById('cqMon').textContent, n: document.querySelectorAll('#cqGrid > span').length, row: Math.round(cr.height), circ: [Math.round(br.width), Math.round(br.height)], top: Math.round(br.top - cr.top), ring: /inset/.test(getComputedStyle(c.querySelector('b')).boxShadow), sameTop: Math.round(R(C('05').querySelector('b')).top) === Math.round(R(C('06').querySelector('b')).top), dot: [Math.round(dot.width), Math.round(dot.height), Math.round(dot.top - b5.bottom), Math.round(r5.bottom - dot.bottom)], hdCol: getComputedStyle(C('05').querySelector('b')).color, ttl: document.getElementById('agTtl').textContent }; });
      ok('v172 날짜 칸: 여섯 줄인 달(2027년 5월)에서 고른 날 고리 60이 위 구분선과 8px 이상, 공휴일 숫자도 옆 칸과 같은 높이', q.mon === '2027년 5월' && q.n === 42 && q.circ.join() === '60,60' && q.top >= 8 && q.ring && q.sameTop, q);
      ok('v172 날짜 칸: 일정 있는 날은 원 아래 점(8px), 원·아래 구분선과 떨어져 있음, 공휴일은 숫자 색, 이름은 제목에', q.dot[0] === 8 && q.dot[1] === 8 && q.dot[2] >= 4 && q.dot[3] >= 5 && q.hdCol === 'rgb(184, 101, 31)' && /부처님오신날/.test(q.ttl), q);
      await tapS('#cqNow');
      await tapS('#pgTabs [data-t="todo"]'); q = await p2.evaluate(() => [document.getElementById('saver').dataset.pg, document.querySelector('#pgTabs .on').dataset.t, document.querySelectorAll('#pgTodo .td-row').length]); ok('v171 탭 "할 일" → 할 일 화면(탭 켜짐 바뀜)', q[0] === 'todo' && q[1] === 'todo' && q[2] >= 3, q);
      await tapS('#pgTabs [data-t="cal"]'); q = await p2.evaluate(() => document.getElementById('saver').dataset.pg); ok('v171 탭 "달력" → 달력으로 돌아옴', q === 'cal', q);
      await p2.context().close(); }
    // 8. 오늘이 토요일·일요일이어도 파란 원 안 숫자는 흰색
    for (const [d, n] of [['2026-11-21', '토'], ['2026-11-22', '일']]) { p = await open(b, { time: d + 'T16:10', read: d }); await p.go('cal'); await p.adv(2500);
      { const tc = await p.evaluate(() => { const c = getComputedStyle(document.querySelector('#cqGrid span.t b')); return [c.color, c.fontWeight, c.backgroundColor]; }); ok(`오늘이 ${n}요일: 오늘은 진한 남색 채운 원 + 흰 굵은 숫자(v172)`, tc[0] === 'rgb(255, 255, 255)' && +tc[1] >= 700 && tc[2] === 'rgb(44, 66, 135)', tc); } { const ln = await p.evaluate(() => { const g = document.getElementById('cqGrid'), c = g.children[0], r = c.getBoundingClientRect(), r2 = g.children[7].getBoundingClientRect(); return [getComputedStyle(g).backgroundImage, getComputedStyle(c).boxShadow !== 'none', Math.abs(r.bottom - r2.top) < 1]; }); ok(`달력(${n}): 주 구분 줄은 칸 아랫변에(바탕 무늬 아님) — 줄 높이와 어긋나지 않음`, ln[0] === 'none' && ln[1] && ln[2], ln); } await p.context().close(); }
    // 6. 질문 상한이어도 일정 넣기는 된다, 쉬는 시간에는 조용한 한 줄
    p = await open(b, { time: D0 + 'T16:00', read: D0, settings: { cap: 10 } }); await p.evaluate(() => localStorage.setItem('gk-count-2026-11-16', '10')); await p.go('cal'); await p.adv(2500);
    await box('[data-act="evadd"]'); s = await p.st(); await p.say('27일에 치과 가', 3000); await p.adv(2500); c = await cal(); ok('질문 상한에 걸려도 일정 말하기는 된다 (AI 안 부름)', !s.saver && c.includes('2026-11-27 치과') && p.api === 0, [s.saver, c]); await p.context().close();
    p = await open(b, { time: D0 + 'T23:30', read: D0, settings: { hFrom: 7, hTo: 21 } }); await p.go('cal'); await p.adv(2500); await box('[data-act="evadd"]'); s = await p.st(); q = await ask();
    ok('쉬는 시간: 일정 말하기는 막고 조용한 한 줄', /\bcal\b/.test(s.saver) && /^지금은 쉬는 시간이야/.test(q), [s.saver, q]); await p.context().close();
  }

  { // 13. 좁은 화면(전화 390×780, v123): 먹색이 남지 않고, 글이 옆으로 넘치지 않는다
    console.log('13. 좁은 화면(전화)');
    const light = () => p.evaluate(() => { const c = getComputedStyle(document.getElementById('saver')), m = [...c.backgroundImage.matchAll(/rgb\((\d+), (\d+), (\d+)\)/g)].slice(-2); return c.backgroundColor === 'rgba(0, 0, 0, 0)' && m.length === 2 && m.every(x => +x[1] + +x[2] + +x[3] > 640); }); // 밝은 지면(바탕 기울기의 두 색이 밝다)
    const wide = () => p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => { if (!e.offsetParent && getComputedStyle(e).position !== 'fixed') return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.right > innerWidth + 1 || r.left < -1) && !e.closest('.pr-nav, .sv-face, .pg, #rnFront, #log[hidden]'); }).map(e => (e.id || e.className || e.tagName).toString().slice(0, 20)).slice(0, 5));
    let p = await open(b, { time: newsDate + 'T12:19', read: newsDate, w: 390, h: 780 }); let x = await wide(); ok('전화 궁금칸: 옆으로 넘치는 것 없음', !x.length, x);
    await p.say('달은 왜 빛나?', 2500); x = await wide(); ok('전화 답: 옆으로 넘치는 것 없음, 쪽 나누기 없음', !x.length && await p.evaluate(() => document.getElementById('ansPg').hidden), x);
    ok('전화 답: "더 물어 봐"가 화면 아래 안쪽', await p.evaluate(() => { const r = document.getElementById('form').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight; })); await p.context().close();
  }

  { // 14. 전화 홈(v124): 모니터와 같은 표지 · 날씨 · 달력을 쓴다
    console.log('14. 전화 홈');
    const tapAt = async (p, sel) => { const bx = await p.locator(sel).first().boundingBox(); await p.mouse.click(bx.x + Math.min(40, bx.width / 2), bx.y + Math.min(30, bx.height / 2)); await p.adv(2500); };
    const side = () => p.evaluate(() => [...document.querySelectorAll('#saver *')].filter(e => { const r = e.getBoundingClientRect(), c = getComputedStyle(e); return r.width > 0 && r.height > 0 && c.visibility !== 'hidden' && (r.right > innerWidth + 6 || r.left < -6) && !e.closest('canvas.big, .cc-moon, .wx-sky, [hidden], svg'); }).map(e => (e.id || e.className || e.tagName).toString().slice(0, 24)).slice(0, 5));
    let p = await open(b, { time: newsDate + 'T12:19', w: 390, h: 780 }); await p.saver();
    let s = await p.st(); ok('전화 대기화면 = 표지(위젯 면)', /\bface\b/.test(s.saver), s.saver);
    let x = await side(); ok('전화 표지: 옆으로 넘치는 것 없음', !x.length, x);
    ok('전화 표지: 시계·표지·묻기·할 일이 위에서 아래로', await p.evaluate(() => { const y = s => document.querySelector(s).getBoundingClientRect().top; return y('.fc-clock') < y('.fc-feat') && y('.fc-feat') < y('.fc-app[data-tile="ask"]') && y('.fc-app[data-tile="ask"]') < y('.fc-todo'); }));
    ok('전화 표지는 위아래로 밀 수 있다(touch-action pan-y)', await p.evaluate(() => getComputedStyle(document.getElementById('saver')).touchAction === 'pan-y' && document.getElementById('saver').scrollHeight > innerHeight));
    await tapAt(p, '#fcWx'); s = await p.st(); ok('전화: 날씨 줄 → 날씨 화면', /pgx/.test(s.saver) && await p.evaluate(() => document.getElementById('saver').dataset.pg === 'wx'), s.saver);
    x = await side(); ok('전화 날씨 화면: 옆으로 넘치는 것 없음', !x.length, x);
    await tapAt(p, '#gkHome'); await tapAt(p, '.fc-clock'); ok('전화: 시계 → 달력', await p.evaluate(() => document.getElementById('saver').dataset.pg === 'cal'));
    x = await side(); ok('전화 달력: 옆으로 넘치는 것 없음', !x.length, x);
    await tapAt(p, '#gkHome'); await p.evaluate(() => { document.getElementById('saver').scrollTop = 600; }); await p.go('sky'); await p.adv(2500);
    ok('전화 밤하늘: 새 배치(맨 위부터, 제목·하늘 그림·달이 위에서 아래로)', await p.evaluate(() => { const sv = document.getElementById('saver'), y = q => document.querySelector(q).getBoundingClientRect().top; return sv.classList.contains('sky') && sv.scrollTop === 0 && y('.sky-name') > 60 && y('.sky-name') < y('#skyChart svg') && y('#skyChart svg') < y('#skyMoon') && getComputedStyle(document.querySelector('.sky-name')).writingMode === 'horizontal-tb'; }));
    x = await side(); ok('전화 밤하늘: 옆으로 넘치는 것 없음', !x.length, x);
    await tapAt(p, '#gkHome'); await tapAt(p, '#fcFeat .cc-h'); s = await p.st(); ok('전화: 표지의 신문 → 기사 화면 바로(1면을 거치지 않음)', s.paper && !s.saver, s);
    ok('전화: 기사 화면이 실제로 맨 위에 보인다(숨긴 표지가 덮지 않음)', await p.evaluate(() => getComputedStyle(document.getElementById('saver')).display === 'none' && [[160, 200], [160, 500]].every(([x, y]) => { const e = document.elementFromPoint(x, y); return e && !e.closest('#saver'); }))); await p.context().close();
    p = await open(b, { time: newsDate + 'T12:19', w: 390, h: 780, settings: { hFrom: 15, hTo: 21, restDark: 'off' } }); await p.saver(); await tapAt(p, '.fc-app[data-tile="ask"]');
    ok('전화 쉬는 시간: 묻기를 누르면 막히고 안내가 화면 안에 보인다', await p.evaluate(() => { const m = document.getElementById('fcMsg'), r = m.getBoundingClientRect(); return !m.hidden && /쉬는 시간/.test(m.textContent) && r.top >= 0 && r.bottom <= innerHeight && !document.getElementById('saver').hidden; }));
    await tapAt(p, '#fcFeat .cc-h'); s = await p.st(); ok('쉬는 시간에도 신문 기사는 열린다', s.paper && !s.saver, s); await p.context().close();
    p = await open(b, { time: newsDate + 'T12:19', w: 390, h: 780 }); await p.saver();
    await p.evaluate(() => { const el = document.querySelector('#fcFeat .cc-h'), r = el.getBoundingClientRect(), o = { bubbles: true, cancelable: true, clientX: r.x + 20, clientY: r.y + 10, pointerId: 7, pointerType: 'touch', isPrimary: true }; el.dispatchEvent(new PointerEvent('pointerdown', o)); el.dispatchEvent(new PointerEvent('pointercancel', o)); el.dispatchEvent(new MouseEvent('click', o)); }); await p.adv(2500);
    s = await p.st(); ok('전화: 톡 누름이 pointercancel 로 끝나도 click 으로 기사 화면이 열린다', s.paper && !s.saver, s); await p.context().close();
    p = await open(b, { time: newsDate + 'T12:19', w: 390, h: 780 }); await p.saver(); await tapAt(p, '#fcFeat .cc-tabs [data-cv="news"]'); s = await p.st(); ok('전화: 켜진 "신문" 탭을 누르면 기사 화면으로', s.paper && !s.saver, s);
    await p.context().close(); p = await open(b, { time: newsDate + 'T12:19', w: 390, h: 780 }); await p.saver(); await tapAt(p, '#fcFeat .cc-tabs [data-cv="sci"]'); s = await p.st(); ok('전화: 다른 탭("과학")을 누르면 표지만 바뀐다', /\bface\b/.test(s.saver) && await p.evaluate(() => { const c = document.getElementById('fcFeat').classList; return c.contains('sci') || c.contains('moon'); }), s.saver); await p.context().close();
  }

  { // 16. 답 화면의 낱말 카드: 밝은 흰 카드, 글·칩과 겹치지 않음 (v133)
    console.log('16. 낱말 카드');
    const WA = '"뷰티풀"은 영어 《beautiful》 말하는 거지? 영어로는 beautiful이라고 쓰고, "아름다운, 예쁜"이라는 뜻이야. 사람, 풍경, 노래처럼 보기 좋거나 듣기 좋은 것에 두루 쓰고, beautiful day처럼 "멋진 하루"라고 말할 때도 써.\n@@  | | beautiful 반대말은 뭐야?; beautiful을 넣은 문장 만들어 줘; 영어로 handsome은 어떤 뜻이야?; pretty는 뭐야? | BEAU·ti·ful:형용사 · 아름다운';
    for (const [w, h] of [[1600, 820], [1920, 1000]]) {
      const p = await open(b, { time: newsDate + 'T12:19', w, h });
      await p.route(/api\.anthropic\.com/, r => { if (r.request().method() === 'OPTIONS') return r.fulfill({ status: 204, headers: CORS }); r.fulfill({ headers: CORS, json: { content: [{ type: 'text', text: WA }], stop_reason: 'end_turn' } }); });
      await p.say('뷰티풀을 어떻게 써 영어로?', 30000);
      const g = await p.evaluate(() => {
        const R = e => e.getBoundingClientRect(), fb = document.getElementById('figBox'), f = R(fb), cs = getComputedStyle(fb);
        const lum = c => { const m = c.match(/[\d.]+/g).map(Number); return (m[0] * 299 + m[1] * 587 + m[2] * 114) / 1000; };
        const hit = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
        const word = fb.querySelector('.vc-g'), chips = [...document.querySelectorAll('#chips button')].filter(x => x.offsetParent).map(R);
        return { shown: f.width > 0, bg: lum(cs.backgroundColor), ink: word ? lum(getComputedStyle(word).color) : 999, inView: f.left >= 0 && f.right <= innerWidth + 1,
          chipHit: chips.some(c => hit(c, f)), sheetHit: innerWidth >= 900 && hit(R(document.getElementById('sheet')), f), chipsOut: chips.some(c => c.right > innerWidth + 1) };
      });
      ok(`낱말 카드 ${w}: 밝은 바탕에 진한 글자, 화면 안`, g.shown && g.bg > 200 && g.ink < 120 && g.inView, g);
      ok(`낱말 카드 ${w}: 글·칩과 겹치지 않고 칩이 화면 밖으로 안 나감`, !g.chipHit && !g.sheetHit && !g.chipsOut, g);
      await p.context().close();
    }
  }

  { // v162. 디자인 가이드 1단계 — 홈 색·재질
    console.log('v162. 디자인 가이드 1단계 (홈 색·재질)');
    const want = { 'T07:40': ['am', 'rgb(59, 82, 161)'], 'T12:19': ['day', 'rgb(44, 66, 135)'], 'T18:40': ['eve', 'rgb(31, 47, 112)'], 'T21:10': ['night', 'rgb(14, 24, 57)'] };
    for (const [tm, [ds, bg]] of Object.entries(want)) { const p = await open(b, { time: newsDate + tm, read: newsDate }); await p.saver();
      const q = await p.evaluate(() => { const cs = s => getComputedStyle(document.querySelector(s)); return { ds: document.documentElement.dataset.ds, bg: getComputedStyle(document.getElementById('saver')).backgroundColor, blur: [...document.querySelectorAll('#saver .fc-t')].some(e => { const c = getComputedStyle(e); return (c.backdropFilter && c.backdropFilter !== 'none') || (c.webkitBackdropFilter && c.webkitBackdropFilter !== 'none'); }), wxBg: cs('#saver .fc-wx').backgroundImage + cs('#saver .fc-wx').backgroundColor, wxSh: cs('#saver .fc-wx').boxShadow, ln: (() => { const c = getComputedStyle(document.querySelector('#saver .fc-wx'), '::before'); return [c.height, c.paddingTop, c.webkitMaskImage || c.maskImage, c.borderRadius].join('|'); })() }; });
      ok(`홈 ${ds}: 시간대 벌과 바탕색(달밤 남색)`, q.ds === ds && q.bg === bg, q);
      ok(`홈 ${ds}: 판에 흐림 효과 없음, 날씨 줄은 판 모양 없이 시계 판 안에(두 겹으로 안 보임)`, !q.blur && /none/.test(q.wxBg) && /rgba\(0, 0, 0, 0\)/.test(q.wxBg) && q.wxSh === 'none', q);
      ok(`홈 ${ds}: 시계·날씨 사이 줄은 1px 한 줄(속 빈 고리 아님)`, q.ln === '1px|0px|none|0px', q.ln);
      await p.context().close(); }
    ok('앱 아이콘·manifest가 새 남색', /icon4-192\.png/.test(fs.readFileSync(path.join(ROOT, 'manifest.webmanifest'), 'utf8')) && /#2C4287/.test(fs.readFileSync(path.join(ROOT, 'manifest.webmanifest'), 'utf8')) && fs.existsSync(path.join(ROOT, 'icon4-512-maskable.png')));
  }

  { // v163. 디자인 가이드 2단계 — 서체
    console.log('v163. 디자인 가이드 2단계 (서체)');
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    ok('서체 파일: 마루 부리 잘라 넣은 것 3 + 전체 3 + 라이선스, 안 쓰는 NanumSquare 없음', ['Regular', 'SemiBold', 'Bold'].every(w => fs.existsSync(path.join(ROOT, 'fonts', `MaruBuri-${w}.sub.woff2`)) && fs.existsSync(path.join(ROOT, 'fonts', `MaruBuri-${w}.woff2`))) && fs.existsSync(path.join(ROOT, 'fonts', 'OFL-MaruBuri.txt')) && !fs.existsSync(path.join(ROOT, 'fonts', 'NanumSquareNeo-Variable.woff2')) && !/NanumSquareNeo-Variable/.test(html));
    ok('잘라 넣은 마루 부리는 굵기당 300KB 아래', ['Regular', 'SemiBold', 'Bold'].every(w => fs.statSync(path.join(ROOT, 'fonts', `MaruBuri-${w}.sub.woff2`)).size < 300e3));
    ok('바깥 서체는 한자용 Noto Serif KR 하나뿐 (Do Hyeon·Noto Sans KR 없음)', /family=Noto\+Serif\+KR/.test(html) && !/Do\+Hyeon|Noto\+Sans\+KR/.test(html));
    const p = await open(b, { time: newsDate + 'T16:20', read: newsDate }); await p.saver();
    const ff = sel => p.evaluate(sel => { const e = document.querySelector(sel); if (!e) return null; const c = getComputedStyle(e); return [c.fontFamily.split(',')[0].replace(/"/g, '').trim(), c.fontWeight, c.fontVariantNumeric]; }, sel);
    let q = await ff('#saver .fc-time'); ok('홈 시계 숫자: 마루 부리 600, 같은 폭 숫자', q && q[0] === 'MaruBuri' && q[1] === '600' && /tabular-nums/.test(q[2]), q);
    q = await ff('#saver .cc-h'); ok('홈 표지 제목: 마루 부리 700', q && q[0] === 'MaruBuri' && q[1] === '700', q);
    q = await ff('#saver .fc-row .tx, #saver .fc-empty, #saver .fc-lab'); ok('홈의 훑는 글(할 일·꼬리표)은 Pretendard 그대로', q && q[0] === 'Pretendard', q);
    await p.say('달은 왜 빛나', 9000); q = await ff('#sheet'); ok('답 문장: 마루 부리 600', q && q[0] === 'MaruBuri' && q[1] === '600', q);
    ok('마루 부리가 실제로 받아져 쓰임(잘라 넣은 파일)', await p.evaluate(async () => { await document.fonts.load('600 40px "MaruBuri"', '달'); return [...document.fonts].some(f => /MaruBuri$/.test(f.family.replace(/"/g, '')) && f.status === 'loaded'); }));
    ok('이 흐름에서 페이지 오류 없음', p.cerr.length === 0, p.cerr.slice(0, 3)); await p.context().close();
  }

  { // v164. 디자인 가이드 3단계 — 홈 구성
    console.log('v164. 디자인 가이드 3단계 (홈 구성)');
    for (const [tm, rd] of [['T07:40', null], ['T12:19', newsDate]]) { const p = await open(b, { time: newsDate + tm, read: rd }); await p.saver();
      const q = await p.evaluate(() => { const g = s => document.querySelector(s), cs = e => getComputedStyle(e), r = e => e.getBoundingClientRect(); const h = g('#saver .cc-h'), t = g('#saver .fc-time'), f = g('#fcFeat'), ck = g('#saver .fc-clock'), wx = g('#saver .fc-wx'), bt = g('#saver .cc-foot.rd');
        const kids = [...f.querySelectorAll('.cc-h, .cc-s2, .cc-foot, .cc-r .it')].filter(e => r(e).height > 0);
        return { title: parseFloat(cs(h).fontSize), clock: parseFloat(cs(t).fontSize), ckBg: cs(ck).backgroundColor, ckSh: cs(ck).boxShadow, wxH: Math.round(r(wx).height), inside: kids.every(e => r(e).bottom <= r(f).bottom - 8 && r(e).right <= r(f).right - 8), btnH: bt ? Math.round(r(bt).height) : 0, topEq: Math.abs(r(ck).top - r(f).top) < 1, wxIn: r(wx).bottom <= r(ck).bottom && r(wx).right <= r(ck).right + 1 && r(wx).left >= r(g('#saver .fc-time')).right, btnBg: bt ? cs(bt).backgroundColor : '', lines: Math.round(r(h).height / parseFloat(cs(h).lineHeight)) }; });
      ok(`홈 ${tm}: 표지 제목 72가 주인공(시계 60, 부모 요청), 세 줄 안`, q.title === 72 && q.clock === 60 && q.lines <= 3, q);
      ok(`홈 ${tm}: 시계·날씨는 판 안에(눌리는 곳으로 보임), 판 윗변이 표지와 같은 줄, 날씨 줄 60px 이상이 판 안`, !/rgba\(0, 0, 0, 0\)/.test(q.ckBg) && q.ckSh !== 'none' && q.wxH >= 60 && q.topEq && q.wxIn, q);
      ok(`홈 ${tm}: 표지 안 글·단추·기사 목록이 판 밖으로 안 나감, 단추 60px 이상·흰 덩어리 아님`, q.inside && q.btnH >= 60 && !/rgb\(255, 255, 255\)/.test(q.btnBg), q);
      await p.context().close(); }
  }

  { // 17. 달 카드: 오늘 이름과 같은 "다음 달"을 내지 않음 (오늘 반달인데 "반달은 내일" 금지)
    console.log('17. 달 카드 다음 모양');
    const p = await open(b, { time: '2026-11-24T19:30', read: '2026-11-24' }); await p.saver(); // v147부터 달 카드는 보름·초승 무렵 저녁에만 — 보름 무렵(11/24)으로 본다
    const m = await p.evaluate(() => { const sk = window.Sky && window.Sky.compute ? null : null; const big = [...document.querySelectorAll('#fcFeat .cc-big')].map(x => x.textContent.trim()); const all = document.getElementById('fcFeat').innerText; return { big, all }; });
    const nm = m.big.find(x => /달/.test(x)) || '';
    ok('달 카드: "' + nm + '" 아래에 "' + nm + '은 …"이 없다', !!nm && !new RegExp(nm + '은 ').test(m.all), m);
    await p.context().close();
  }

  { // 18. 에이전트 검토(v135)에서 나온 것들
    console.log('18. 검토 반영 (v135)');
    const answer = async (p, text, status = 200) => { await p.unroute(/api\.anthropic\.com/); await p.route(/api\.anthropic\.com/, r => { if (r.request().method() === 'OPTIONS') return r.fulfill({ status: 204, headers: CORS }); const t = typeof text === 'function' ? text(JSON.parse(r.request().postData())) : text; if (t == null) return; r.fulfill({ status, headers: CORS, json: status === 200 ? { content: [{ type: 'text', text: t }], stop_reason: 'end_turn' } : { error: { message: 'x' } } }); }); };
    const card = p => p.evaluate(() => { const f = document.getElementById('fig'), b = document.getElementById('figBox'); if (f.hidden) return { shown: false }; const r = b.getBoundingClientRect(); const over = [...b.querySelectorAll('.vc-g, .vc-l, .vc-word')].some(e => { const q = e.getBoundingClientRect(); return q.right > r.right + 1 || q.bottom > r.bottom + 1; }); return { shown: true, text: b.innerText.trim(), over }; });
    let p = await open(b, { time: newsDate + 'T12:19' });
    // 카드 줄이 안 오고, 따로 요청한 카드도 형식이 틀리면 빈 카드가 남지 않는다
    await answer(p, body => /낱말 카드'만/.test(JSON.stringify(body)) ? '잘 모르겠어' : '"인터내셔널"은 영어 《international》이야.\n@@  | | 반대말은 뭐야?; 문장 만들어 줘');
    await p.say('인터내셔널 뜻이 뭐야', 15000); let c = await card(p); ok('카드를 못 받으면 빈 흰 카드를 치운다', !c.shown, c);
    // 긴 영어 낱말은 카드 안에 들어온다 (가운뎃점 빼고 20자까지 받음)
    await answer(p, '"인터내셔널"은 영어 《international》이야.\n@@  | | 반대말은 뭐야? | in·ter·NA·tion·al:형용사 · 여러 나라 사이의');
    await p.say('인터내셔널 뜻이 뭐야', 15000); c = await card(p); ok('긴 영어 낱말 카드: 보이고 카드 밖으로 안 나감', c.shown && /tion/.test(c.text) && !c.over, c);
    await answer(p, '일석이조는 한 번에 두 가지를 얻는다는 뜻이야. 《일석이조》라고 해.\n@@  | | 비슷한 말은 뭐야? | 一:한 일;石:돌 석;二:두 이;鳥:새 조;뜻:한 번에 두 가지 이득');
    await p.say('일석이조가 뭐야', 15000); c = await card(p); ok('한자 4글자 카드: 마지막 글자까지 카드 안', c.shown && /鳥/.test(c.text) && !c.over, c);
    // 퀴즈 모드 없음, '?'는 묻는 말에만
    await answer(p, '와, 다 풀었구나. 문제를 끝까지 푼 건 대단한 일이야.\n@@  | | 어떤 문제였어?; 수학은 왜 배워?; 계산을 빨리 하려면?');
    await p.say('이 문제 내가 다 풀었어', 9000); let q = await p.evaluate(() => ({ chips: [...document.querySelectorAll('#chips button')].map(x => x.textContent), eb: document.querySelector('.eyebrow .askq')?.textContent, st: document.getElementById('app').dataset.state }));
    ok('"문제"라는 말에 퀴즈 칩이 안 나옴', !q.chips.some(x => /힌트|정답/.test(x)) && q.st !== 'quiz', q);
    ok('평범한 말 끝에 "?"를 붙이지 않음', q.eb === '이 문제 내가 다 풀었어', q.eb);
    // 오류 문구는 아이 말로 한 가지
    await answer(p, '', 401); await p.say('달은 왜 빛나', 6000); q = await p.evaluate(() => document.getElementById('sheet').textContent);
    ok('API 키 오류: 아이에게는 "엄마 아빠한테 말해 줘"만', /엄마 아빠한테 말해 줘/.test(q) && !/API|키|모델|충전/.test(q), q);
    // 응답이 멈추면 30초 뒤 '생각하는 중'에서 빠져나온다
    await answer(p, () => null); await p.say('달은 왜 빛나', 2000); await p.adv(31000); await p.adv(2000);
    q = await p.evaluate(() => ({ st: document.getElementById('app').dataset.state, t: document.getElementById('sheet').textContent }));
    ok('응답이 30초 넘게 없으면 "연결이 안 됐어"로', q.st !== 'think' && /연결이 안 됐어/.test(q.t), q);
    await p.context().close();
    // 할 일: '색종이'가 '색종'으로 잘리지 않음
    p = await open(b, { time: newsDate + 'T16:00', offline: true }); await p.say('준비물 색종이 적어 줘');
    const td = await p.evaluate(() => JSON.stringify(localStorage.getItem('gk-todo') || '') + document.body.innerText.slice(0, 0)); ok('할 일 "색종이"가 그대로 적힘', /색종이/.test(td), td.slice(0, 160)); await p.context().close();
    p = await open(b, { time: newsDate + 'T16:20' }); await p.say('달은 왜 빛나', 9000);
    q = await p.evaluate(() => { const x = document.querySelector('#app .qbar .qbox'), c = getComputedStyle(x), r = x.getBoundingClientRect(); return [c.backgroundColor, Math.round(r.height), getComputedStyle(document.querySelector('#app .qbox .micico')).stroke]; });
    ok("v169 답 화면 '물어보기': 남색 채움 72, 마이크 흰색", q[0] === 'rgb(44, 66, 135)' && q[1] === 72 && q[2] === 'rgb(255, 255, 255)', q); await p.context().close();
    // 밤 9시~아침 6시: 답 화면도 어둡게 (v167: 22시 → 21시)
    p = await open(b, { time: newsDate + 'T21:10' }); await p.say('달은 왜 빛나', 9000);
    q = await p.evaluate(() => { const L = c => { const m = c.match(/[\d.]+/g).map(Number); return (m[0] * 299 + m[1] * 587 + m[2] * 114) / 1000; }; return { night: document.body.hasAttribute('data-night'), ink: L(getComputedStyle(document.getElementById('sheet')).color), bg: L(getComputedStyle(document.body).backgroundColor), app: getComputedStyle(document.getElementById('app')).backgroundImage.slice(0, 60) }; });
    ok('밤 답 화면: 어두운 바탕에 밝은 글씨', q.night && q.ink > 180 && /rgb\(14, 24, 57\)/.test(q.app), q); await p.context().close();
    p = await open(b, { time: newsDate + 'T20:50' }); await p.say('달은 왜 빛나', 9000); q = await p.evaluate(() => document.body.hasAttribute('data-night')); ok('밤 8시 50분 답 화면은 아직 밝음', !q); await p.context().close();
    // 쉬는 시간: 언제 다시 되는지 아이 말로, 묻기 타일도 알려 줌
    p = await open(b, { time: newsDate + 'T21:30', settings: { hFrom: 7, hTo: 21, restDark: 'off', nsky: 'off' } }); await p.saver();
    q = await p.evaluate(() => document.querySelector('.fc-app[data-tile="ask"] .fc-lab').textContent); ok('쉬는 시간 묻기 타일: "내일 아침 7시에 만나"', q === '내일 아침 7시에 만나', q);
    const bx = await p.locator('.fc-app[data-tile="ask"]').boundingBox(); await p.mouse.click(bx.x + 60, bx.y + 60); await p.adv(1200);
    q = await p.evaluate(() => { const m = document.getElementById('fcMsg'), r = m.getBoundingClientRect(), a = document.querySelector('.fc-app[data-tile="ask"]').getBoundingClientRect(); return { t: m.textContent, hid: m.hidden, hit: r.right > a.left && r.left < a.right && r.bottom > a.top && r.top < a.bottom }; });
    ok('쉬는 시간 안내: "내일 아침 7시"를 말하고 타일을 안 가림', /내일 아침 7시/.test(q.t) && !q.hid && !q.hit, q);
    await p.adv(5000); q = await p.evaluate(() => !document.getElementById('fcMsg').hidden); ok('안내는 6초 뒤에도 보임(8초) — 가짜 시계에 실제 시간이 더해져 여유를 둠', q); await p.context().close();
    // 한자어 풀이: 글자에서 뜻이 나온 까닭 + 실제 쓰는 모양 예문(추호도 ~없다) — 지시문에 들어 있는지
    p = await open(b, { time: newsDate + 'T12:19' }); await p.say('추호가 뭐야', 6000); q = JSON.stringify(p.lastBody && p.lastBody.system || '');
    ok('지시문: 한자어는 글자 뜻에서 풀고, 추호도는 "없다"와 함께', /털갈이/.test(q) && /추호도 거짓이 없어/.test(q), q.length); await p.context().close();
    // 할 일(아내 요청): 대기화면 타일에 다섯 줄, 타일을 누르면 할 일 화면, 줄을 누르면 했다 표시
    p = await open(b, { time: newsDate + 'T19:40', read: newsDate });
    await p.evaluate(nd => { const T = ['미니 수학 두 장', '학습지 하나', '받아쓰기 연습', '일기 쓰기', '리코더 연습', '독서록 쓰기', '색종이 챙기기']; const now = Date.now(); localStorage.setItem('gk-todo', JSON.stringify({ items: T.map((t, i) => ({ id: 't' + i, text: t, due: nd, at: now - (10 - i) * 1000, done: 0 })), last: null })); }, newsDate);
    await p.saver(); q = await p.evaluate(() => { const t = document.querySelector('.fc-todo'), r = t.getBoundingClientRect(); const rows = [...t.querySelectorAll('.fc-row')].filter(x => { const q = x.getBoundingClientRect(); return q.bottom <= r.bottom && q.height > 30; }); const m = t.querySelector('.fc-more'), mr = m && m.getBoundingClientRect(), tx = t.querySelector('.fc-row .tx').getBoundingClientRect(); return { n: rows.length, h: rows.map(x => Math.round(x.getBoundingClientRect().height)), more: (m || {}).textContent, moreIn: !!mr && mr.bottom <= r.bottom, moreX: mr && Math.round(parseFloat(getComputedStyle(m).paddingLeft) + mr.left - tx.left), cnt: /\d+개/.test(t.textContent) }; });
    ok('홈 할 일 판: 네 줄(각 60px 이상) + "더 보기"가 판 안에, 글자 시작선이 같고 개수를 세지 않음 (v162)', q.n === 4 && q.h.every(h => h >= 60) && q.more === '더 보기' && q.moreIn && q.moreX === 0 && !q.cnt, q);
    { const bx = await p.locator('.fc-todo').boundingBox(); await p.mouse.click(bx.x + bx.width - 24, bx.y + bx.height - 16); await p.adv(1500); }
    q = await p.evaluate(() => ({ pg: document.getElementById('saver').dataset.pg, rows: document.querySelectorAll('#pgTodo .td-row').length, t: document.getElementById('pgTtl').textContent }));
    ok('할 일 타일을 누르면 할 일 화면(큼직한 다섯 줄 + 다음 쪽)', q.pg === 'todo' && q.rows === 5 && !/\d+개/.test(q.t) && await p.evaluate(() => /다음 쪽/.test(document.querySelector('#pgTodo .td-foot').textContent) && parseFloat(getComputedStyle(document.querySelector('#pgTodo .td-row .tx')).fontSize) >= 50), q);
    { const r = await p.locator('#pgTodo .td-row').nth(2).boundingBox(); await p.mouse.click(r.x + 200, r.y + r.height / 2); await p.adv(1200); }
    q = await p.evaluate(() => ({ done: JSON.parse(localStorage.getItem('gk-todo')).items.filter(x => x.done).length, t: document.getElementById('pgTtl').textContent }));
    ok('할 일 화면에서 줄을 누르면 했다로 바뀜', q.done === 1 && !/\d+개/.test(q.t), q);
    await p.click('#gkHome'); await p.adv(1500); q = await p.evaluate(() => document.getElementById('saver').className); ok('할 일 화면 → 홈 단추 → 위젯 면', /\bface\b/.test(q), q); await p.context().close();
    // 밤 12시대 표기
    p = await open(b, { time: newsDate + 'T00:20' }); q = await p.evaluate(() => document.getElementById('tbClock').textContent); ok('0시 20분 시계: "밤 12:20"', /^밤\s*12:20$/.test(q.trim()), q); await p.context().close();
  }

  { // 19. v136 부품 통일 — 자리 규격과 밤 색
    console.log('19. 부품 통일 (v136)');
    const D = newsDate; let p, q;
    const fake = async pg => pg.addInitScript(() => { window.SpeechRecognition = window.webkitSpeechRecognition = class { start() { window.__rec = this; setTimeout(() => this.onstart && this.onstart(), 0); } stop() { setTimeout(() => this.onend && this.onend(), 0); } abort() { this.stop(); } }; });
    const R = (pg, sel) => pg.evaluate(sel => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map(Math.round).join(','); }, sel);
    // 앱 머리줄: 홈 단추는 어느 앱에서나 (48,40) — 자국 방지 이동으로 달력·날씨에서만 4px 어긋나던 것
    for (const [g, t] of [['cal', 'T16:20'], ['wx', 'T16:20']]) { p = await open(b, { time: D + t, read: D }); await p.go(g); await p.adv(2500); q = await R(p, '#gkHome'); ok(`${g} 홈 단추 자리 48,40`, q === '48,40,112,104', q); await p.context().close(); }
    // 밤 달력: 오늘 동그라미 글자가 보임(크림 바탕 + 흰 글자 금지)
    p = await open(b, { time: D + 'T22:30', read: D }); await p.go('cal'); await p.adv(2500);
    q = await p.evaluate(() => { const e = [...document.querySelectorAll('.cq-grid span.t b')][0]; const cs = getComputedStyle(e); return [cs.color, cs.backgroundColor]; });
    ok('밤 달력 오늘 숫자가 바탕과 다른 색', q[0] !== 'rgb(255, 255, 255)' || !/23\d, 2[23]\d, 21\d/.test(q[1]), q); await p.context().close();
    // 답 화면에서 다시 묻기: 듣는 중·생각 중이 오른쪽 아래 마이크 자리에서 바뀐다
    p = await open(b, { time: D + 'T16:20', read: D, pre: fake }); await p.say('달은 왜 모양이 바뀌어?', 9000);
    const f0 = await R(p, '#form .qbox'); await p.click('#micBtn'); await p.adv(600);
    const st = await p.evaluate(() => [document.getElementById('app').dataset.state, document.getElementById('app').dataset.from]); const f1 = await R(p, '#form .qbox');
    ok('답 화면에서 마이크 → 듣는 중이 같은 자리(오른쪽 아래)', st[0] === 'listen' && st[1] === 'ans' && f0 === f1 && f0 === '1316,708,1552,780', [st, f0, f1]);
    await p.evaluate(() => window.__rec.onresult({ resultIndex: 0, results: [Object.assign([{ transcript: '보름달은 언제 떠' }], { isFinal: true })] })); await p.adv(2500);
    q = await p.evaluate(() => document.getElementById('app').dataset.state); ok('말이 끝나면 생각 중 → 답', q === 'answer' || q === 'think', q); await p.context().close();
    // 알약 가운데(입력칸)를 눌러도 — 초점이 먼저 가 '입력 중'을 거쳐도 — 듣는 중은 제자리
    p = await open(b, { time: D + 'T16:20', read: D, pre: fake }); await p.say('달은 왜 모양이 바뀌어?', 9000);
    await p.click('#q'); await p.adv(600);
    q = await p.evaluate(() => [document.getElementById('app').dataset.state, document.getElementById('app').dataset.from]); const fq2 = await R(p, '#form .qbox');
    ok('답 화면 알약 가운데를 눌러도 듣는 중이 오른쪽 아래', q[1] === 'ans' && fq2 === '1316,708,1552,780', [q, fq2]); await p.context().close();
    // 첫 화면에서 글자로 물어도 생각 중은 가운데 묻기 줄 그대로(구석으로 튀지 않음)
    p = await open(b, { time: D + 'T16:20', read: D }); await p.unroute(/api\.anthropic\.com/); await p.route(/api\.anthropic\.com/, () => {});
    await p.evaluate(() => { const q = document.getElementById('q'); q.readOnly = false; q.focus(); q.value = '하늘은 왜 파래'; }); await p.press('#q', 'Enter'); await p.adv(800);
    q = await p.evaluate(() => [document.getElementById('app').dataset.state, document.getElementById('app').dataset.from]); const fq = await R(p, '#form .qbox');
    ok('첫 화면 글자 묻기 → 생각 중이 가운데 줄(136,407)', q[0] === 'think' && q[1] === 'home' && /^136,407,/.test(fq), [q, fq]); await p.context().close();
    // 신문에서 물어보기 → 답 → 맨 아랫줄 '신문으로' 알약 → 그 면으로
    p = await open(b, { time: D + 'T07:40', pre: fake }); await p.go('hero'); await p.adv(2500); await p.go('paper'); await p.adv(2500); await p.click('#ppNext'); await p.adv(1200);
    await p.click('#ppAsk'); await p.adv(600); q = await p.evaluate(() => !document.getElementById('gkHome').hidden); ok('신문에서 듣는 중에도 홈 단추가 보임', q, q);
    await p.evaluate(() => window.__rec.onresult({ resultIndex: 0, results: [Object.assign([{ transcript: '무인기는 뭐야' }], { isFinal: true })] })); await p.adv(9000);
    q = await R(p, '#backPaper'); ok("신문에서 물은 답: 맨 아랫줄 맨 앞 '신문으로' 알약(136,716)", q === '136,716,336,780', q);
    await p.click('#backPaper'); await p.adv(1500); q = await p.evaluate(() => document.getElementById('ppTag').textContent); ok('신문으로 → 물었던 2면', /2면/.test(q), q);
    await p.click('#ppAsk'); await p.adv(600); await p.click('#micBtn').catch(() => {}); await p.adv(2500); q = await p.evaluate(() => [!document.getElementById('paper').hidden, document.getElementById('ppTag').textContent]);
    ok('신문에서 물어보기를 눌렀다가 말없이 끝나면 그 면으로 돌아옴', q[0] && /2면/.test(q[1]), q); await p.context().close();
    // v137: 달력 일정 줄을 누르면 '삭제' → 지워지고 '되돌리기'로 살릴 수 있다
    p = await open(b, { time: D + 'T16:20', read: D }); await p.evaluate(D => localStorage.setItem('gk-cal', JSON.stringify({ v: 1, last: null, items: [{ id: 'a', date: D, text: '치과 가는 날', raw: '', at: 1 }, { id: 'b', date: D, text: '체육복', raw: '', at: 2 }] })), D);
    await p.go('cal'); await p.adv(2500); await p.click('#agList [data-id="a"]'); await p.adv(500);
    q = await p.evaluate(() => [!!document.querySelector('#agList [data-id="a"].sel'), (document.querySelector('#agFoot [data-act="evdel"]') || {}).textContent]);
    ok('달력: 일정 줄을 누르면 골라지고 아래에 "삭제"', q[0] && q[1] === '삭제', q);
    await p.click('#agFoot [data-act="evdel"]'); await p.adv(500); q = await p.evaluate(() => [JSON.parse(localStorage.getItem('gk-cal')).items.map(x => x.id).join(), document.getElementById('agAsk').textContent]);
    ok('삭제 → 그 일정만 지워지고 "지웠어" + 되돌리기', q[0] === 'b' && /치과 가는 날.*지웠어/.test(q[1]) && /되돌리기/.test(q[1]), q);
    await p.click('#agAsk [data-act="evundo"]'); await p.adv(500); q = await p.evaluate(() => JSON.parse(localStorage.getItem('gk-cal')).items.map(x => x.id).sort().join());
    ok('되돌리기 → 다시 살아남', q === 'a,b', q); await p.context().close();
    // 신문 기사: 면 표시는 왼쪽 곁말, 소리 단추는 기본 끔(빗금)
    p = await open(b, { time: D + 'T07:40' }); await p.go('hero'); await p.adv(2500); await p.go('paper'); await p.adv(2500);
    q = await p.evaluate(() => [document.getElementById('ppTag').textContent, document.getElementById('ppListen').getAttribute('aria-pressed'), getComputedStyle(document.querySelector('#ppListen .slash')).display]);
    ok('신문 기사: "분야 · 1면", 소리 기본 끔(빗금 보임)', /· 1면$/.test(q[0]) && q[1] === 'false' && q[2] !== 'none', q); await p.context().close();
  }

  { // 20. v138 공부칸: 낱말 카드·신문 낱말이 모이고, 공부칸에서 다시 본다(퀴즈·개수 없이)
    console.log('20. 공부칸 (v138)');
    const R = (pg, sel) => pg.evaluate(sel => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map(Math.round).join(','); }, sel);
    const D = newsDate, WA = '"뷰티풀"은 영어 《beautiful》 말하는 거지? 영어로는 beautiful이라고 쓰고, "아름다운, 예쁜"이라는 뜻이야.\n@@  | | beautiful 반대말은 뭐야?; pretty는 뭐야? | BEAU·ti·ful:형용사 · 아름다운';
    const p = await open(b, { time: D + 'T16:20', read: D }); let q;
    await p.route(/api\.anthropic\.com/, r => { if (r.request().method() === 'OPTIONS') return r.fulfill({ status: 204, headers: CORS }); p.api++; r.fulfill({ headers: CORS, json: { content: [{ type: 'text', text: WA }], stop_reason: 'end_turn' } }); });
    await p.say('뷰티풀 뜻?', 9000);
    q = await p.evaluate(() => [window.__gkWords.load().items.map(x => [x.k, x.mean, x.q, x.line].join('|')), (document.querySelector('.vcard .vc-note') || {}).textContent]);
    ok('낱말 카드가 나오면 공부칸에 모임(뜻·물은 말·풀이 문장) + 카드 아래 "공부칸에 모았어"', q[0].length === 1 && q[0][0] === 'en:beautiful|아름다운|뷰티풀 뜻?|영어로는 beautiful이라고 쓰고, "아름다운, 예쁜"이라는 뜻이야.' && q[1] === '공부칸에 모았어', q);
    await p.adv(65e3); await p.say('beautiful 뜻 다시', 9000); q = await p.evaluate(() => window.__gkWords.load().items.map(x => x.k + ':' + x.n)); ok('같은 낱말을 또 물으면 한 줄로 합쳐짐', q.join() === 'en:beautiful:2', q);
    await p.go('hero'); await p.adv(2500); await p.go('paper'); await p.adv(2500);
    q = await p.evaluate(() => { const W = window.__gkWords.load().items[0]; return [W.k, W.from, W.kind]; }); const nw = JSON.parse(fs.readFileSync(path.join(ROOT, 'news/latest.json'), 'utf8')).articles[0].word;
    ok('신문 기사를 펴면 그 기사의 오늘의 낱말이 모임', q[0] === 'hz:' + nw.w && q[1] === 'news', q);
    await p.click('#ppHome'); await p.adv(1500);
    { const bx = await p.locator('#svFace .fc-app[data-tile="study"]').boundingBox(); await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.adv(1500); }
    q = await p.evaluate(() => [document.getElementById('saver').dataset.pg, document.querySelector('.st-big').textContent, document.querySelectorAll('.st-srow[data-k]').length, document.getElementById('pgTtl').textContent]);
    ok('공부칸: 가장 최근에 만난 말이 크게, 오른쪽에 오늘 모인 말', q[0] === 'study' && q[1] === nw.w && q[2] === 2 && q[3] === '공부칸', q);
    await p.click('.st-srow[data-k="en:beautiful"]'); await p.adv(600);
    q = await p.evaluate(() => [document.querySelector('.st-big').textContent, document.querySelector('.st-src').textContent, document.querySelector('.st-line').textContent]);
    ok('오른쪽 줄을 누르면 그 낱말: 음절·물은 말·"또 물어봤어"·처음 만난 문장', q[0] === 'beau·ti·ful' && /"뷰티풀 뜻\?" 물어봤을 때 · 또 물어봤어/.test(q[1]) && /영어로는 beautiful/.test(q[2]), q);
    q = await p.evaluate(() => document.querySelector('.st-hero').innerText); ok('공부칸에 퀴즈·점수·개수 문구 없음', !/퀴즈|정답|점수|[0-9]+개|맞혀/.test(q), q.slice(0, 80));
    await p.click('[data-act=stlist]'); await p.adv(600);
    q = await p.evaluate(() => [[...document.querySelectorAll('.st-tabs span')].map(x => x.textContent).join(''), document.querySelectorAll('.st-row').length]);
    ok('모은 말 보기: 갈래 넷(오늘·영어·한자·우리말), 오늘 모인 말 두 줄', q[0] === '오늘영어한자우리말' && q[1] === 2, q);
    await p.click('[data-act=sttab][data-t=en]'); await p.adv(500); q = await p.evaluate(() => [...document.querySelectorAll('.st-row')].map(x => x.dataset.k).join()); ok('영어 갈래에는 영어 낱말만', q === 'en:beautiful', q);
    await p.click('[data-act=stback]'); await p.adv(500); q = await R(p, '.st-foot .st-lb'); ok("공부칸 맨 아랫줄 왼쪽 알약(136,716), 오른쪽 '물어보기'(주 단추 72)", /^136,716,/.test(q) && await R(p, '#pgStudy .zbar') === '1316,708,1552,780', [q, await R(p, '#pgStudy .zbar')]);
    await p.mouse.move(1200, 420); await p.mouse.down(); await p.mouse.move(700, 430, { steps: 6 }); await p.mouse.up(); await p.adv(800); q = await p.evaluate(() => document.getElementById('saver').dataset.pg); ok('공부칸에서 옆으로 밀어도 다른 장으로 안 넘어감', q === 'study', q);
    await p.evaluate(() => { const d = JSON.parse(localStorage.getItem('gk-words')); d.items.push({ k: 'en:bad', w: 'bad', kind: 'en', syl: 5, hz: 'x' }, { k: 7 }, null); localStorage.setItem('gk-words', JSON.stringify(d)); }); await p.click('.st-srow[data-k]'); await p.adv(16000);
    q = await p.evaluate(() => [!!document.querySelector('.st-big'), document.querySelector('.st-hero') ? !/NaN/.test(document.querySelector('.st-hero').innerText) : false]); ok('저장값이 일부 깨져도 공부칸이 그려짐', q[0] && q[1], q);
    await p.adv(11 * 60e3); q = (await p.st()).saver; ok('공부칸도 10분 손대지 않으면 위젯 면으로', /^face/.test(q), q);
    await p.context().close();
  }

  { // 21. v139 넘겨 보는 조각 장(음력)
    console.log('21. 조각 장 (v141: 14편, 하루 한 편)');
    const p = await open(b, { time: '2026-11-17T16:20' }); let q;
    await p.saver(); { const bx = await p.locator('#svFace [data-cv="piece"]').boundingBox(); await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.adv(1500); }
    q = await p.evaluate(() => [document.querySelector('#fcFeat .cc-h').textContent, document.querySelector('#fcFeat .cc-foot').textContent.trim()]); ok('조각 갈래: 음력 조각 장 표지(보기 →)', q[0] === '설날은 왜 해마다 날짜가 바뀔까?' && /^보기/.test(q[1]), q);
    { const bx = await p.locator('#fcFeat .cc-h').boundingBox(); await p.mouse.click(bx.x + 40, bx.y + 20); await p.adv(2500); }
    q = await p.evaluate(() => { const f = document.getElementById('pcFrame'); return f && f.contentDocument ? [f.contentDocument.querySelector('#cover h2').textContent, !document.getElementById('saver').hidden] : null; });
    ok('조각 표지를 누르면 조각 장이 화면 전체로 열림(대기화면은 뒤에 그대로)', q && /설날은\s*왜\s*해마다/.test(q[0]) && q[1], q); // v155 새 틀은 제목을 줄바꿈으로 나눔
    const fr = p.frameLocator('#pcFrame'); for (let i = 0; i < 40; i++) { if (await p.evaluate(() => document.getElementById('pcFrame').contentDocument.getElementById('next').textContent.trim()) === '다 봤어') break; await fr.locator('#next').click(); await p.adv(900); }
    q = await p.evaluate(() => document.getElementById('pcFrame').contentDocument.getElementById('next').textContent.trim()); ok('마지막 장의 단추는 "다 봤어"', q === '다 봤어', q);
    await fr.locator('#next').click(); await p.adv(1500); q = await p.evaluate(() => [!!document.getElementById('pcFrame'), !document.getElementById('saver').hidden]); ok('"다 봤어" → 조각 장 닫히고 홈', !q[0] && q[1], q);
    { const bx = await p.locator('#fcFeat .cc-h').boundingBox(); await p.mouse.click(bx.x + 40, bx.y + 20); await p.adv(2500); } { const lg = await p.evaluate(() => { const l = document.getElementById('pcFrame').contentDocument.getElementById('logo'), r = l.getBoundingClientRect(), f = document.getElementById('pcFrame').getBoundingClientRect(), k = f.width / document.getElementById('pcFrame').contentWindow.innerWidth; return { disp: getComputedStyle(l).display, w: Math.round(r.width), x: Math.round(r.left), y: Math.round(r.top) }; }); ok('이야기·과학 편에도 홈 단추(루아 로고) 64px, 다른 화면과 같은 자리(48,40) (v165)', lg.disp !== 'none' && lg.w >= 60 && Math.abs(lg.x - 48) <= 2 && Math.abs(lg.y - 40) <= 2, lg); }
    await fr.locator('#logo').click(); await p.adv(1500); // v165: 로고 홈 단추
    ok('조각 장의 홈 단추 → 닫힘', await p.evaluate(() => !document.getElementById('pcFrame')));
    { const bx = await p.locator('#fcFeat .cc-h').boundingBox(); await p.mouse.click(bx.x + 40, bx.y + 20); await p.adv(2500); } await p.jump(11 * 60e3);
    ok('조각 장도 10분 손대지 않으면 닫힘', await p.evaluate(() => !document.getElementById('pcFrame')));
    await p.context().close();
    { const p3 = await open(b, { time: '2026-11-30T16:20' }); await p3.saver(); { const bx = await p3.locator('#svFace [data-cv="piece"]').boundingBox(); await p3.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await p3.adv(1500); }
      q = await p3.evaluate(() => document.querySelector('#fcFeat .cc-h').textContent); ok('14일째(11/30)는 마지막 편 "며칠"', /며칠/.test(q), q);
      { const bx = await p3.locator('#fcFeat .cc-h').boundingBox(); await p3.mouse.click(bx.x + 40, bx.y + 20); await p3.adv(2500); }
      q = await p3.evaluate(() => { const f = document.getElementById('pcFrame'); return f && f.contentWindow.__piece ? f.contentWindow.__piece.id : null; }); ok('그날 편(14편)이 열림', q === 14, q); await p3.context().close(); }
    const p2 = await open(b, { time: '2026-12-01T16:20' }); await p2.saver(); { const bx = await p2.locator('#svFace [data-cv="piece"]').boundingBox(); await p2.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await p2.adv(1500); }
    q = await p2.evaluate(() => document.querySelector('#fcFeat .cc-h').textContent); ok('14편이 끝나면 평소 조각으로 돌아감', !/며칠|설날/.test(q), q); await p2.context().close();
  }

  { // 22. v145 모의 체험 반영
    console.log('22. 모의 체험 반영 (v145)');
    const p = await open(b, { time: newsDate + 'T16:20', read: newsDate }); let q;
    q = await p.evaluate(() => JSON.parse(localStorage.getItem('gk-settings') || '{}').level || 'e3'); ok('기본 수준은 초등 3학년', q === 'e3', q);
    await p.say('할 일에 수학 숙제 추가해 줘', 2000); q = await p.evaluate(() => (JSON.parse(localStorage.getItem('gk-todo') || '{"items":[]}').items || []).map(x => x.text)); ok("'할 일에 수학 숙제 추가해 줘' → '수학 숙제'", q.includes('수학 숙제'), q);
    await p.say('숙제 추가해 줘, 국어 받아쓰기', 2000); q = await p.evaluate(() => (JSON.parse(localStorage.getItem('gk-todo') || '{"items":[]}').items || []).map(x => x.text)); ok("'숙제 추가해 줘, 국어 받아쓰기' → '국어 받아쓰기'", q.includes('국어 받아쓰기'), q);
    await p.say('달은 왜 빛나', 9000); q = await p.evaluate(() => { const r = document.getElementById('replayBtn').getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }); ok('답 화면에 다시 듣기 단추(64)', q[0] >= 60 && q[1] >= 60, q);
    await p.context().close();
    const p2 = await open(b, { time: newsDate + 'T16:20', settings: { level: 'm1' } }); await p2.adv(1500);
    q = await p2.evaluate(() => [JSON.parse(localStorage.getItem('gk-settings')).level, localStorage.getItem('gk-mig-e3')]); ok('예전 기기의 중학생 수준은 한 번만 3학년으로 옮김', q[0] === 'e3' && q[1] === '1', q);
    await p2.reload(); await p2.adv(1500); q = await p2.evaluate(() => JSON.parse(localStorage.getItem('gk-settings')).level); ok('그 뒤 부모가 중학생으로 바꾸면 그대로', q === 'm1', q); await p2.context().close();
  }

  { // 23. v146 쉬는 시간엔 화면도 어둡게 · 막힘 안내를 소리로
    console.log('23. 쉬는 시간 화면 (v146)');
    let p = await open(b, { time: newsDate + 'T21:30', read: newsDate, settings: { hFrom: 7, hTo: 21 } }); await p.saver(); let s = await p.st();
    ok('쓸 수 있는 시간 밖(21:30): 홈이 어두운 밤 화면', /night/.test(s.saver), s.saver);
    await p.evaluate(() => { window.__said = []; const o = window.speechSynthesis; if (o) o.speak = u => window.__said.push(u.text); });
    await p.mouse.click(800, 400); await p.adv(1200); s = await p.st();
    const q = await p.evaluate(() => [!document.getElementById('saver').hidden, document.getElementById('svMsg').textContent, (window.__said || []).join('|')]);
    ok('누르면 깨어나지 않고 "내일 아침 7시" 안내가 보임', q[0] && /내일 아침 7시/.test(q[1]), q);
    await p.context().close();
    p = await open(b, { time: newsDate + 'T21:30', read: newsDate, settings: { hFrom: 7, hTo: 21, restDark: 'off' } }); await p.saver(); s = await p.st();
    ok("'그대로'로 두면 쉬는 시간에도 밝은 홈", !/night/.test(s.saver), s.saver); await p.context().close();
  }

  { // 24. v173 오늘의 단어 — 홈 넷째 갈래, 뿌리선 펼침면(데이터만), 공부칸에 짝으로
    console.log('24. 오늘의 단어 (v173)');
    const W = path.join(ROOT, 'pieces', 'w'), eps = fs.readdirSync(W).filter(f => /^\d+\.json$/.test(f)).map(f => JSON.parse(fs.readFileSync(path.join(W, f), 'utf8')));
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'), pages = [...html.matchAll(/\{ from: '([\d-]+)', n: (\d+), f: '([^']+)', page: 'pieces\/word\.html\?w=(\d+)'/g)];
    ok('단어 편 데이터: 다섯 편 이상, 쪽 글·짝·근거 모두 있음', eps.length >= 5 && eps.every(e => e.cover && e.cover.h && ['en', 'hz', 'pair'].every(k => e.pages[k] && e.pages[k].h && e.pages[k].b) && ['same', 'near', 'diff'].includes(e.kind) && (e.kind === 'diff' || e.core) && e.en.parts.some(x => x.link) && e.hz.ch.some(x => x.link) && Array.isArray(e.src) && e.src.length >= 2 && e.src.every(s => /^https:\/\//.test(s.url) && s.claim)), eps.map(e => e.n));
    ok('표지에서 답(공통 뜻·짝 판정)을 말하지 않음', eps.every(e => !(e.core && e.cover.h.includes(e.core)) && !/같은 생각|다른 생각|정답|답 보기/.test(e.cover.h + e.cover.b)));
    ok('날짜표가 파일·표지 제목과 맞음', pages.length === eps.length && pages.every(m => { const e = eps.find(x => x.n === +m[2]); return e && e.from === m[1] && e.cover.h.replace(/<br>/g, ' ') === m[3] && m[2] === m[4]; }), pages.map(m => m[2]));
    ok('단어 편 화면에 그림 코드·퀴즈 단추 없음', !/답 보기|정답|점수/.test(fs.readFileSync(path.join(ROOT, 'pieces', 'word.html'), 'utf8')));
    // v174: 루아 피드백(재미없음)으로 홈에서 내림 — 갈래 셋, 15~18시 자동 없음, 예전에 고른 '단어'도 무시
    let p = await open(b, { time: '2026-11-18T16:20', read: newsDate }), q; await p.saver();
    q = await p.evaluate(() => [document.getElementById('fcFeat').className, [...document.querySelectorAll('#fcFeat .cc-tabs span')].map(x => x.textContent).join('|')]);
    ok('평일 16:20 표지는 단어가 아님, 갈래에 단어 없음', !/pair/.test(q[0]) && q[1] === '신문|이야기|과학', q); await p.context().close();
    p = await open(b, { time: '2026-11-18T16:20', read: newsDate, pre: async pg => { await pg.addInitScript(() => localStorage.setItem('gk-cover', JSON.stringify({ k: 'pair', day: '2026-11-18' }))); } }); await p.saver();
    q = await p.evaluate(() => document.getElementById('fcFeat').className); ok('예전에 단어를 골라 둔 기기도 단어 표지가 안 뜸', !/pair/.test(q), q); await p.context().close();
    // v176: 3일차(정오와 자정) 시간 띠 — 子시는 양 끝에 반 칸씩. 0시·24시 끝선이 둘 다 있고, 반 칸 둘 다 '子'
    { const pg = await (await b.newContext({ viewport: { width: 1600, height: 820 }, reducedMotion: 'reduce' })).newPage(); await pg.goto(`http://localhost:${PORT}/pieces/piece.html?ep=3&v=2`); await pg.waitForTimeout(1200);
      for (let i = 0; i < 8; i++) { if (await pg.evaluate(() => [...document.querySelectorAll('.scr.on text')].some(e => e.textContent === '오전 午前'))) break; await pg.keyboard.press('ArrowRight'); await pg.waitForTimeout(600); }
      const q = await pg.evaluate(() => { const sc = document.querySelector('.scr.on'); const V = [...sc.querySelectorAll('line')].filter(l => l.getAttribute('x1') === l.getAttribute('x2') && Math.abs(+l.getAttribute('y2') - +l.getAttribute('y1') - 60) < 1).map(l => Math.round(+l.getAttribute('x1'))); const zi = [...sc.querySelectorAll('text')].filter(e => e.textContent === '子').map(e => Math.round(+e.getAttribute('x'))); return { ends: [V.includes(680), V.includes(1480)], n: V.length, zi }; });
      ok('v176 3일차 시간 띠: 0시·24시 양 끝선이 다 있고(14줄), 子 반 칸이 양 끝에 둘', q.ends.join() === 'true,true' && q.n === 14 && q.zi.length === 2 && q.zi[0] < 700 && q.zi[1] > 1460, q); await pg.context().close(); }
    // 모든 편·모든 쪽: 글자 겹침 없음, 오류 없음 (1600×820, 전화 세로)
    for (const [w, h] of [[1600, 820], [390, 780]]) { const pg = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); const er = []; pg.on('pageerror', e => er.push(e.message)); const bad = [];
      for (const e of eps) { await pg.goto(`http://localhost:${PORT}/pieces/word.html?w=${e.n}`); await pg.waitForFunction(() => document.body.dataset.ready, null, { timeout: 8000 });
        bad.push(...await pg.evaluate(async n => { const out = []; for (let i = 0; i < window.__word.order.length; i++) { window.__word.go(i); await new Promise(r => setTimeout(r, 30));
          const L = document.getElementById('L').getBoundingClientRect(), ts = [...document.querySelectorAll('#fig text')].filter(t => getComputedStyle(t).opacity !== '0' && !t.classList.contains('fade')).map(t => t.getBoundingClientRect());
          ts.forEach(t => { if (t.left < L.right && t.right > L.left && t.top < L.bottom && t.bottom > L.top) out.push(n + ':' + i + ':L'); });
          for (let a = 0; a < ts.length; a++) for (let c = a + 1; c < ts.length; c++) { const x = ts[a], y = ts[c]; if (x.left < y.right - 6 && x.right > y.left + 6 && x.top < y.bottom - 2 && x.bottom > y.top + 2) out.push(n + ':' + i + ':' + a + '/' + c); }
          if (L.bottom > document.querySelector('.rootline').getBoundingClientRect().top + 1) out.push(n + ':' + i + ':line'); } return out; }, e.n)); }
      ok(`단어 편 모든 쪽 글자 겹침 없음 (${w}×${h})`, bad.length === 0 && er.length === 0, [bad.slice(0, 5), er.slice(0, 2)]); await pg.context().close(); }
  }

  await newsTests(b);
  ok('페이지 오류 없음', errs.length === 0, errs.slice(0, 3));
  await b.close(); server.close();
  console.log(`\n통과 ${passes} · 실패 ${fails}`); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });

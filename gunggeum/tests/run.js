// 궁금칸 자동 점검 — 배포 전에 모두 통과해야 한다.
//   cd gunggeum && node tests/run.js        (Playwright + Chromium 필요, 바깥 인터넷은 쓰지 않음)
// 한 번 났던 버그는 여기에 점검을 붙여 둔다. NOTES.md 참고.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), PORT = 8791, URL = `http://localhost:${PORT}/index.html`;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); } }); });
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' };
let fails = 0, passes = 0; const errs = [];
const ok = (name, cond, info) => { if (process.env.V) console.log('   · ' + name); if (cond) passes++; else { fails++; console.log('  ✗ ' + name + (info !== undefined ? '  → ' + JSON.stringify(info) : '')); } };
const ANSWER = '달은 스스로 빛을 내지 못해. 《햇빛을 반사》해서 밝게 보이는 거야.\n@@ 달 | 🌙 | 왜 달은 안 떨어져?; 달에도 바다가 있어?; 보름달은 왜 둥글어?; 달에서 뛰면 어떻게 돼?';

async function open(b, { time, settings = {}, read, offline, noSky, w = 1600, h = 820 } = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, timezoneId: 'Asia/Seoul' }); const p = await ctx.newPage(); p.api = 0;
  p.on('pageerror', e => errs.push(e.message));
  const day = (time || '2026-11-14T10:00').slice(0, 10), H = [...Array(48)].map((_, i) => `${day}T${String(i % 24).padStart(2, '0')}:00`);
  await p.route(/open-meteo/, r => offline ? r.abort() : r.request().url().includes('air-quality') ? r.fulfill({ json: { current: { pm10: 28, pm2_5: 12 } }, headers: CORS }) : r.fulfill({ headers: CORS, json: { current: { temperature_2m: 7.2, apparent_temperature: 4, weather_code: 0, precipitation: 0 }, hourly: { time: H, temperature_2m: H.map(() => 8), weather_code: H.map(() => 0), precipitation_probability: H.map(() => 0), is_day: H.map(() => 1) }, daily: { temperature_2m_max: [13, 13], temperature_2m_min: [4, 4], precipitation_probability_max: [0, 10], weather_code: [0, 1], sunrise: [day + 'T07:11', 'x'], sunset: [day + 'T17:22', 'x'] } } }));
  await p.route(/api\.anthropic\.com/, r => { if (r.request().method() === 'OPTIONS') return r.fulfill({ status: 204, headers: CORS }); if (offline) return r.abort(); p.api++; p.lastBody = JSON.parse(r.request().postData()); r.fulfill({ headers: CORS, json: { content: [{ type: 'text', text: ANSWER }], stop_reason: 'end_turn' } }); });
  await p.route(/wttr|googleapis|gstatic|wikidata|wikimedia|wikipedia|tts\.speech/, r => r.abort());
  if (noSky) await p.route(/vendor\/sky/, r => r.abort());
  await p.addInitScript(([day, st, read]) => { localStorage.setItem('gk-settings', JSON.stringify(Object.assign({ apiKey: 'sk-test', hFrom: 0, hTo: 24, wxName: '영등포구' }, st))); if (read) { localStorage.setItem('gk-news-read2', JSON.stringify(read)); localStorage.setItem('gk-news-done2', JSON.stringify([read])); } }, [day, settings, read]);
  if (time) await p.clock.install({ time: new Date(time + ':00+09:00') });
  await p.goto(URL);
  p.adv = async (ms = 2000) => { if (time) await p.clock.runFor(ms); await p.waitForTimeout(time ? 350 : Math.min(ms, 1500)); };
  p.jump = async ms => { await p.clock.fastForward(ms); await p.adv(1500); }; // 긴 시간은 건너뛰기 (타이머를 하나하나 돌리지 않음)
  await p.adv(2500); await p.addStyleTag({ content: '.sv-inner{animation:none!important}' });
  p.say = async (text, wait = 1200) => { await p.evaluate(t => { const q = document.getElementById('q'); q.readOnly = false; q.value = t; }, text); await p.press('#q', 'Enter'); await p.adv(wait); };
  p.st = () => p.evaluate(() => ({ saver: document.getElementById('saver').hidden ? '' : document.getElementById('saver').className.replace('saver', '').trim(), paper: !document.getElementById('paper').hidden, log: !document.getElementById('log').hidden, home: !!document.getElementById('app').dataset.home, sheet: document.getElementById('sheet').textContent, chips: [...document.querySelectorAll('#chips button')].map(b => b.textContent.replace(/^\d/, '')), todo: (JSON.parse(localStorage.getItem('gk-todo') || '{"items":[]}').items || []).map(x => [x.text, x.due, !!x.done]), count: +document.querySelector('#count b').textContent }));
  p.saver = async () => { await p.keyboard.press('F3'); await p.adv(3000); await p.adv(16000); };
  return p;
}
const newsDate = JSON.parse(fs.readFileSync(path.join(ROOT, 'news/latest.json'), 'utf8')).date;
const plus = (d, n) => { const x = new Date(d + 'T12:00:00+09:00'); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };

(async () => {
  await new Promise(r => server.listen(PORT, r));
  const b = await chromium.launch(); let p, s;

  console.log('1. 버전 네 군데');
  { const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'), sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
    const v = (html.match(/APP_V = '(v\d+)'/) || [])[1];
    ok('APP_V 있음', !!v); ok('머리 표시 버전', html.includes(`<span style="opacity:.6">${v}</span>`)); ok('부모님 화면 버전', html.includes(`font-weight:400">${v}</small>`)); ok('sw.js 캐시 이름', sw.includes(`gk-${v}'`) || sw.includes(`gk-${v}"`), v); }

  console.log('2. 대기화면 상태 (시간대별)');
  for (const [t, read, want] of [[newsDate + 'T07:42', false, 'face morn news'], [newsDate + 'T08:15', true, 'face morn line'], [newsDate + 'T17:59', true, 'face day line'], [newsDate + 'T18:01', true, 'face eve moon'], [newsDate + 'T19:00', false, 'face eve news'], [newsDate + 'T22:01', true, 'night'], [plus(newsDate, 1) + 'T05:59', true, 'night'], [plus(newsDate, 1) + 'T06:01', true, 'face morn line'], [plus(newsDate, 6) + 'T15:20', false, 'face day line']]) {
    p = await open(b, { time: t, read: read ? newsDate : null }); await p.saver(); s = await p.st(); const got = s.saver === 'face' ? await p.evaluate(() => 'face ' + document.getElementById('saver').dataset.tone + ' ' + document.getElementById('fcFeat').className.replace('fc-t fc-feat', '').replace('pic', '').trim()) : s.saver; ok(`${t} ${read ? '읽음' : '안 읽음'} → ${want}`, got === want, got); await p.context().close(); }
  p = await open(b, { time: newsDate + 'T19:30', read: newsDate, noSky: true }); await p.saver(); s = await p.st(); ok('밤하늘 파일을 못 받으면 기본 화면', s.saver === 'face' && await p.evaluate(() => document.getElementById('fcFeat').classList.contains('line')), s.saver); await p.context().close();

  console.log('3. 미리 보기는 10분 뒤 풀림 (v102 버그)');
  p = await open(b, { time: newsDate + 'T16:00' });
  await p.evaluate(() => { document.getElementById('log').hidden = false; }); await p.click('[data-go="sky"]'); await p.adv(4000); s = await p.st(); ok('미리 보기 → sky', s.saver === 'sky', s.saver);
  await p.adv(12 * 60e3); s = await p.st(); ok('12분 뒤 원래 화면', s.saver !== 'sky' && s.saver !== '', s.saver);
  await p.jump(7 * 3600e3); await p.adv(16000); s = await p.st(); ok('밤에는 밤 화면', s.saver === 'night', s.saver); await p.context().close();

  console.log('4. 대기화면 넘기기·누르기');
  p = await open(b, { time: newsDate + 'T19:30' }); await p.saver();
  const swipe = async dir => { const x = dir > 0 ? 1100 : 500; await p.mouse.move(x, 400); await p.mouse.down(); await p.mouse.move(x - dir * 150, 405, { steps: 4 }); await p.mouse.move(x - dir * 300, 410, { steps: 4 }); await p.mouse.up(); await p.adv(1500); };
  s = await p.st(); ok('처음: 위젯 면', s.saver === 'face', s.saver);
  await swipe(1); s = await p.st(); ok('밀기 → 달력', s.saver === 'cal', s.saver);
  ok('달력에 오늘 표시와 큰 날짜', await p.evaluate(() => { const t = document.querySelectorAll('#calGrid .t'), n = String(new Date().getDate()); return t.length === 1 && t[0].textContent === n && document.getElementById('calBig').textContent === n && document.querySelectorAll('#calGrid span').length % 7 === 0; }));
  await swipe(1); s = await p.st(); ok('밀기 → 신문 1면', s.saver === 'has-paper paper-hero', s.saver);
  await swipe(1); s = await p.st(); ok('밀기 → 밤하늘', s.saver === 'sky', s.saver);
  await swipe(1); s = await p.st(); ok('밤하늘에서도 밀림 (v105 버그)', s.saver === 'face', s.saver);
  await swipe(1); await swipe(1); await p.mouse.click(800, 520); await p.adv(1500); s = await p.st(); ok('신문을 누르면 신문이 열림', !s.saver && s.paper, s);
  await p.saver(); await p.mouse.click(60, 60); await p.adv(1000); s = await p.st(); ok('톡 누르면 깨어남', !s.saver, s.saver);
  ok('강제 상태가 남지 않음', await p.evaluate(() => window.__gkForce === undefined));
  const tile = async n => { const bx = await p.locator(`#svFace [data-tile="${n}"]`).last().boundingBox(); await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.adv(1500); };
  await p.saver(); await tile('cal'); s = await p.st(); ok('날짜를 누르면 달력', s.saver === 'cal', s.saver); await p.mouse.click(800, 400); await p.adv(1000); s = await p.st(); ok('달력을 톡 누르면 깨어남', !s.saver, s.saver);
  await p.saver(); await tile('sky'); s = await p.st(); ok('밤하늘 타일 → 밤하늘 장', s.saver === 'sky', s.saver);
  await p.adv(11 * 60e3); s = await p.st(); ok('밤하늘 장은 10분 뒤 위젯 면으로', s.saver === 'face', s.saver);
  await tile('news'); s = await p.st(); ok('신문 타일 → 신문 열림', !s.saver && s.paper, s);
  await p.saver(); await tile('wx'); s = await p.st(); ok('날씨 타일 → 깨어남', !s.saver && !s.paper, s);
  ok('타일이 화면 밖으로 넘치지 않음', await p.evaluate(() => { document.getElementById('saver').hidden = false; const r = [...document.querySelectorAll('#svFace .fc-t')].every(t => { const b = t.getBoundingClientRect(); return b.left >= 0 && b.top >= 0 && b.right <= innerWidth && b.bottom <= innerHeight && t.scrollHeight <= t.clientHeight + 1; }); document.getElementById('saver').hidden = true; return r; }));
  await p.context().close();
  for (const [w, h] of [[1600, 820], [1920, 1000]]) { p = await open(b, { time: newsDate + 'T12:48', w, h }); await p.saver();
    ok(`네 자리 시각이 시계 타일 안에 들어감 ${w}×${h}`, await p.evaluate(() => { const t = document.getElementById('fcTime'), r = document.createRange(); r.selectNodeContents(t); const a = r.getBoundingClientRect(), c = t.parentElement.getBoundingClientRect(); return a.left >= c.left + 8 && a.right <= c.right - 8; })); await p.context().close(); }

  console.log('5. 부모님 화면 바로가기');
  p = await open(b, {});
  for (const [g, want] of [['face', 'face'], ['cal', 'cal'], ['hero', 'paper-hero'], ['sky', 'sky'], ['night', 'night']]) {
    await p.evaluate(() => { document.getElementById('log').hidden = false; }); await p.click(`[data-go="${g}"]`); await p.waitForTimeout(g === 'sky' ? 2500 : 700); s = await p.st(); ok(`바로가기 ${g}`, s.saver.includes(want) && !s.log, s.saver);
    await p.waitForTimeout(1600); await p.mouse.click(60, 60); await p.waitForTimeout(400); }
  await p.evaluate(() => { document.getElementById('log').hidden = false; }); await p.click('[data-go="paper"]'); await p.waitForTimeout(700); s = await p.st(); ok('바로가기 신문', s.paper, s);
  await p.evaluate(() => { document.getElementById('log').hidden = false; }); await p.click('[data-go="home"]'); await p.waitForTimeout(700); s = await p.st(); ok('바로가기 홈', s.home && !s.paper && !s.saver, s); await p.context().close();

  console.log('6. 밤하늘 계산 (달)');
  p = await open(b, { time: '2026-11-14T12:00' }); await p.waitForFunction(() => window.GKSky, null, { timeout: 8000 }).catch(() => {});
  const moon = t => p.evaluate(t => { const s = window.GKSky.build({ lat: 37.526, lon: 126.896, now: new Date(t + ':00+09:00'), W: 916, H: 512 }); return [s.moon.name, s.moon.lines.join(' '), s.moon.phase > 180, s.pick && s.pick.name, s.next.map(x => x[1]).join(',')]; }, t);
  s = await moon('2026-11-14T20:04'); ok('11/14 초승달·남서쪽으로 짐·토성', s[0] === '초승달' && /남서쪽으로 져/.test(s[1]) && s[3] === '토성' && s[4] === '반달,보름달', s);
  s = await moon('2026-03-04T19:30'); ok('막 뜬 보름달을 "안 떠"라고 하지 않음 (v102 버그)', /떠올라|에서 떠/.test(s[1]), s);
  s = await moon('2026-12-04T21:20'); ok('기우는 달은 그믐달·새벽에 뜸', s[0] === '그믐달' && s[2] === true && /에서 떠/.test(s[1]), s);
  s = await moon('2026-11-27T21:30'); ok('다음 달 모양은 반달과 보름달 하나씩 (v99 버그)', s[4].split(',').sort().join() === '반달,보름달', s); await p.context().close();

  console.log('7. 질문 흐름');
  p = await open(b, {}); s = await p.st(); ok('홈에서 시작', s.home, s);
  await p.say('달은 왜 모양이 바뀌어?', 9000); s = await p.st(); ok('답이 보임', /햇빛을 반사/.test(s.sheet) && p.api >= 1, s.sheet); ok('이어서 칩 4개', s.chips.length === 4, s.chips); ok('질문 수 1', s.count === 1, s.count);
  ok('지시문이 캐시 블록으로 감', Array.isArray(p.lastBody.system) && p.lastBody.system[0].cache_control && !/지금은 (오전|오후)/.test(p.lastBody.system[0].text));
  ok('질문 앞에 오늘 날짜·시각', /^\(오늘은 \d+년/.test(p.lastBody.messages.at(-1).content), p.lastBody.messages.at(-1).content.slice(0, 40));
  const n0 = p.api; await p.click('#chips button'); await p.adv(9000); ok('칩을 누르면 다시 물음', p.api > n0); await p.context().close();

  console.log('8. 루아의 할 일');
  p = await open(b, { time: '2026-11-16T16:00' }); // 월요일
  await p.say('내일 수학 숙제 있어'); s = await p.st();
  ok('기준1 바로 적힘', s.todo.length === 1 && s.todo[0][0] === '수학 숙제' && s.todo[0][1] === '2026-11-17' && /적어 뒀어/.test(s.sheet) && /내일 · 수학 숙제/.test(s.sheet), s);
  ok('기준1 AI를 부르지 않음', p.api === 0 && s.count === 0, [p.api, s.count]);
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
  await p.evaluate(() => { document.getElementById('log').hidden = false; }); await p.click('[data-go="home"]'); await p.adv(1000);
  await p.adv(3 * 60e3); await p.evaluate(() => { document.getElementById('log').hidden = false; }); await p.click('[data-go="home"]'); await p.adv(800); // 말로 끝낸 줄이 뒤로 물러난 뒤
  const row = p.locator('#tdTodoL [data-todo]:not(.done)').first(); ok('홈에 할 일 칸', await row.count() === 1); const firstText = await row.locator('.tx').textContent();
  await row.click(); await p.adv(500); s = await p.st(); ok('기준5 홈에서 눌러 줄 긋기', s.todo.find(x => x[0] === firstText)[2] === true && s.home, s.todo);
  await p.locator('#tdTodoL [data-todo].done', { hasText: firstText }).first().click(); await p.adv(500); s = await p.st(); ok('기준5 다시 누르면 되살아남', s.todo.find(x => x[0] === firstText)[2] === false, s.todo);
  // 대기화면 시계 장
  await p.evaluate(() => { document.getElementById('log').hidden = false; }); await p.click('[data-go="face"]'); await p.adv(2500); s = await p.st(); ok('대기화면 할 일 타일', s.saver === 'face' && await p.evaluate(() => document.querySelectorAll('#fcTodoL [data-todo]').length > 0 && +document.getElementById('fcTodoN').textContent > 0), s.saver);
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
  await p.jump(24 * 3600e3); await p.evaluate(() => { document.getElementById('log').hidden = false; }); await p.click('[data-go="home"]'); await p.adv(800); s = await p.st();
  ok('기준7 다 한 줄은 다음 날 사라짐', !s.todo.some(x => x[2]), s.todo); const left = s.todo.length; ok('기준7 안 한 줄은 남음', left >= 1, s.todo);
  ok('기준7 기한 지난 줄에 표시 없음', !/밀렸|어제|지난/.test(await p.evaluate(() => document.getElementById('today').textContent)));
  await p.jump(9 * 24 * 3600e3); await p.evaluate(() => { document.getElementById('log').hidden = false; }); await p.click('[data-go="home"]'); await p.adv(800); s = await p.st(); ok('기준7 묵은 줄은 사라짐', s.todo.length === 0, s.todo);
  await p.context().close();

  console.log('9. 인터넷이 안 될 때·질문 상한');
  p = await open(b, { time: '2026-11-16T16:00', offline: true }); await p.say('내일 준비물 색종이 가져가야 돼'); s = await p.st(); ok('기준6 인터넷 없이 적힘', s.todo.length === 1 && s.todo[0][1] === '2026-11-17', s); await p.context().close();
  p = await open(b, { time: '2026-11-16T16:00', settings: { cap: 10 } }); await p.evaluate(() => localStorage.setItem('gk-count-2026-11-16', '10'));
  await p.say('일기 써야 돼'); s = await p.st(); ok('기준6 상한 뒤에도 적힘', s.todo.length === 1 && s.todo[0][0] === '일기 쓰기' && !s.saver, s);
  await p.say('달은 왜 모양이 바뀌어?', 3000); s = await p.st(); ok('상한 뒤 질문은 막힘', p.api === 0 && !!s.saver, s); await p.context().close();
  p = await open(b, { time: '2026-11-16T23:30', settings: { hFrom: 7, hTo: 21 } }); await p.say('일기 써야 돼'); s = await p.st(); ok('쉬는 시간에는 할 일도 막힘', s.todo.length === 0, s); await p.context().close();

  ok('페이지 오류 없음', errs.length === 0, errs.slice(0, 3));
  await b.close(); server.close();
  console.log(`\n통과 ${passes} · 실패 ${fails}`); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });

// 루아 신문 종이판 → 인쇄용 파일 (v185)
// 쓰임: node tools/paper-render.js [YYYY-MM-DD]   (날짜를 빼면 news/latest.json)
// 결과: news/paper/<날짜>-1.jpg, -2.jpg (A4 300dpi 컬러), <날짜>.pdf, latest.json(폴드4 자동 인쇄가 읽는 목록)
// 깃허브 Actions(.github/workflows/rua-paper.yml)가 새 신문이 올라올 때마다 돌린다. 14일 지난 파일은 지운다.
const { chromium } = require('playwright');
const fs = require('fs'), http = require('http'), path = require('path');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'news', 'paper');
const TYPES = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png', '.js': 'text/javascript' };
const want = process.argv[2] || '';
(async () => {
  const news = JSON.parse(fs.readFileSync(path.join(ROOT, 'news', (want || 'latest') + '.json'), 'utf8'));
  const date = news.date; if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('날짜가 이상함: ' + date);
  const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(ROOT)) { r.statusCode = 403; return r.end(); } fs.readFile(f, (e, d) => { if (e) { r.statusCode = 404; return r.end(); } r.setHeader('content-type', TYPES[path.extname(f)] || 'application/octet-stream'); r.end(d); }); });
  await new Promise(z => srv.listen(0, z)); const port = srv.address().port;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 900, height: 1200 }, deviceScaleFactor: 300 / 96 });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('requestfailed', q => errs.push('못 받음 ' + q.url()));
  await p.goto(`http://localhost:${port}/paper.html?d=${date}`);
  await p.waitForFunction(() => document.body.dataset.ready === '1', null, { timeout: 30000 });
  if (errs.length) throw new Error(errs.join(' / '));
  const over = await p.evaluate(() => document.body.dataset.over || ''); if (over.split(',').some(v => +v > 0)) throw new Error('지면이 넘침(쪽별 px): ' + over);
  fs.mkdirSync(OUT, { recursive: true });
  const pages = await p.$$('.page'); const files = [];
  for (let i = 0; i < pages.length; i++) { const f = `${date}-${i + 1}.jpg`; await pages[i].screenshot({ path: path.join(OUT, f), type: 'jpeg', quality: 88 }); files.push(f); }
  await p.emulateMedia({ media: 'print' }); await p.pdf({ path: path.join(OUT, date + '.pdf'), preferCSSPageSize: true, printBackground: true });
  await b.close(); srv.close();
  fs.writeFileSync(path.join(OUT, 'latest.json'), JSON.stringify({ date, no: news.no, pages: files, pdf: date + '.pdf', size: 'A4', dpi: 300 }, null, 1) + '\n');
  const keep = new Date(date + 'T12:00'); keep.setDate(keep.getDate() - 14); const cut = keep.toISOString().slice(0, 10);
  for (const f of fs.readdirSync(OUT)) { const m = /^(\d{4}-\d{2}-\d{2})/.exec(f); if (m && m[1] < cut) fs.unlinkSync(path.join(OUT, f)); }
  console.log('종이판', date, files.join(', '));
})().catch(e => { console.error(e); process.exit(1); });

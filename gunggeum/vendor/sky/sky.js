// 궁금칸 저녁 대기화면 "오늘 밤하늘" — 별 위치 계산(astronomy-engine) + 남쪽 하늘 그림 + 달 그리기
(function () {
  'use strict';
  var RAD = Math.PI / 180, f1 = function (n) { return (+n).toFixed(1); };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var DIR8 = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
  var dir8 = function (az) { return DIR8[Math.round(((az % 360) + 360) % 360 / 45) % 8]; };
  var NUM = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉'];
  function clock(d) { // 저녁 8:59
    var h = d.getHours(), m = pad(d.getMinutes());
    var part = h < 5 ? '새벽' : h < 12 ? '오전' : h < 18 ? '오후' : h < 21 ? '저녁' : '밤';
    return part + ' ' + (h % 12 || 12) + ':' + m;
  }
  function fists(alt) { // 팔을 쭉 뻗은 주먹 하나 ≈ 10°
    if (alt < 8) return '땅 가까이 아주 낮게';
    if (alt > 76) return '머리 바로 위쯤';
    return '팔을 쭉 뻗고 주먹 ' + NUM[Math.max(1, Math.round(alt / 10))] + ' 개를 쌓은 높이';
  }
  var howHigh = function (alt) { return alt < 20 ? '하늘 낮게' : alt < 40 ? '하늘에' : '하늘 높이'; };

  var PLANETS = [
    ['Venus', '금성', '가장 밝게 빛나는 점'], ['Jupiter', '목성', '아주 밝고 반짝이지 않는 점'],
    ['Mars', '화성', '붉은빛이 도는 점'], ['Saturn', '토성', '반짝이지 않는 노란 점']
  ];
  var STAR_NOTE = { '시리우스': '밤하늘에서 가장 밝은 별', '아르크투루스': '주황빛으로 빛나는 별', '직녀성': '푸른 흰빛으로 빛나는 별', '카펠라': '노란빛이 도는 밝은 별',
    '리겔': '오리온의 푸른 흰빛 별', '프로키온': '작은개자리의 밝은 별', '베텔게우스': '오리온의 붉은 별', '견우성': '직녀성과 짝을 이루는 별', '알데바란': '황소의 붉은 눈',
    '스피카': '봄 밤의 푸른 흰빛 별', '안타레스': '전갈의 붉은 심장', '폴룩스': '쌍둥이자리의 밝은 별', '포말하우트': '남쪽 하늘에 홀로 빛나는 별', '데네브': '백조의 꼬리에 있는 별',
    '레굴루스': '사자의 심장', '카스토르': '쌍둥이자리의 흰 별', '북극성': '언제나 북쪽에 있는 별' };

  function moonName(ph) { // ph: 0 삭 → 180 보름 → 360
    if (ph < 20 || ph > 340) return ['숨은 달', '오늘은 안 보여'];
    if (ph < 75) return ['초승달', '손톱 모양 달'];
    if (ph < 105) return ['반달', '오른쪽 반이 밝은 달'];
    if (ph < 165) return ['커지는 달', '보름달이 되어 가'];
    if (ph < 195) return ['보름달', '둥글고 환한 달'];
    if (ph < 255) return ['기우는 달', '조금씩 작아져'];
    if (ph < 285) return ['반달', '왼쪽 반이 밝은 달'];
    return ['그믐달', '새벽에 뜨는 가는 달'];
  }

  function build(o) {
    var A = window.Astronomy, D = window.GK_SKY, now = o.now || new Date();
    var obs = new A.Observer(+o.lat, +o.lon, 30);
    // 오늘 저녁 해 지는 때 (오늘 낮 12시부터 찾음; 새벽이면 어제 저녁)
    var noon = new Date(now); noon.setHours(12, 0, 0, 0); if (now.getHours() < 6) noon.setDate(noon.getDate() - 1);
    var ss = A.SearchRiseSet(A.Body.Sun, obs, -1, noon, 1), sunset = ss ? ss.date : null;
    var dark = sunset ? new Date(sunset.getTime() + 50 * 60e3) : now;
    var live = now >= dark, date = live ? now : dark; // 아직 밝으면 '어두워진 뒤'의 하늘을 미리 보여 줌

    var W = 968, H = Math.max(380, Math.min(760, Math.round(o.H / o.W * 968))) || 528;
    var AZ0 = 180, ALT0 = 8, S = 4.6, CX = W / 2, CY = H - 52 - ALT0 * S;
    function proj(alt, az) {
      var a = alt * RAD, a0 = ALT0 * RAD, d = (az - AZ0) * RAD;
      var cosd = Math.sin(a0) * Math.sin(a) + Math.cos(a0) * Math.cos(a) * Math.cos(d);
      var dist = Math.acos(Math.max(-1, Math.min(1, cosd))) / RAD;
      var pa = Math.atan2(Math.cos(a) * Math.sin(d), Math.cos(a0) * Math.sin(a) - Math.sin(a0) * Math.cos(a) * Math.cos(d));
      return { x: CX + S * dist * Math.sin(pa), y: CY - S * dist * Math.cos(pa), dist: dist };
    }
    var inView = function (p) { return p.x > -20 && p.x < W + 20 && p.y > -20 && p.y < H + 20 && p.dist < 125; };
    var rot = A.Rotation_EQJ_HOR(date, obs);
    function horJ2000(ra, dec) {
      var h = A.HorizonFromVector(A.RotateVector(rot, A.VectorFromSphere(new A.Spherical(dec, ra, 1), date)), 'normal');
      return { alt: h.lat, az: h.lon };
    }
    function body(b) {
      var eq = A.Equator(A.Body[b], date, obs, true, true), h = A.Horizon(date, obs, eq.ra, eq.dec, 'normal');
      return { alt: h.altitude, az: h.azimuth };
    }

    // ---- 별 ----
    var stars = [], named = [];
    D.stars.forEach(function (s) {
      var h = horJ2000(s[0], s[1]); if (h.alt < 0.4) return;
      var p = proj(h.alt, h.az); if (!inView(p)) return;
      var st = { mag: s[2], bv: s[3], x: p.x, y: p.y, alt: h.alt, az: h.az, name: s[4] };
      stars.push(st); if (s[4]) named.push(st);
    });
    stars.sort(function (a, b) { return b.mag - a.mag; });
    var rOf = function (m) { return Math.max(0.55, 5.0 - 0.98 * Math.max(m, -0.5)); };
    var col = function (bv) { return bv < 0.1 ? '#F6F1E6' : bv < 0.7 ? '#F0E6D2' : bv < 1.2 ? '#EDD3A4' : '#E8BC84'; };
    var starSvg = '', glowSvg = '';
    stars.forEach(function (s) {
      var r = rOf(s.mag), c = col(s.bv), op = s.mag > 3.4 ? 0.4 : s.mag > 2.4 ? 0.62 : s.mag > 1.6 ? 0.85 : 1; // 도시 하늘: 어두운 별은 흐리게
      if (s.alt < 8) op *= 0.45 + s.alt / 15;
      if (s.mag < 2.6) glowSvg += '<circle cx="' + f1(s.x) + '" cy="' + f1(s.y) + '" r="' + f1(r * 4.2) + '" fill="url(#gkSg)" opacity="' + (s.mag < 1.6 ? .5 : .28) + '"/>';
      if (s.mag < 1.7) { var L = r * 3.6;
        glowSvg += '<g transform="translate(' + f1(s.x) + ' ' + f1(s.y) + ')" stroke="' + c + '" stroke-linecap="round"><path d="M' + f1(-L) + ',0H' + f1(L) + 'M0,' + f1(-L) + 'V' + f1(L) + '" stroke-width=".7" opacity=".55"/></g>'; }
      starSvg += '<circle cx="' + f1(s.x) + '" cy="' + f1(s.y) + '" r="' + r.toFixed(2) + '" fill="' + c + '" opacity="' + op.toFixed(2) + '"/>';
    });

    // ---- 별자리 선 (잘 알려진 별자리만, 별에 닿지 않게 살짝 띄움) ----
    var lineSvg = '';
    Object.keys(D.lines).forEach(function (id) {
      D.lines[id].forEach(function (seg) {
        var pts = seg.map(function (q) { var h = horJ2000(q[0], q[1]), p = proj(h.alt, h.az); p.alt = h.alt; return p; });
        for (var i = 0; i < pts.length - 1; i++) {
          var a = pts[i], b = pts[i + 1]; if (a.alt < 1 || b.alt < 1 || !inView(a) || !inView(b)) continue;
          var dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy); if (len < 13) continue;
          var g = 5.5, ux = dx / len, uy = dy / len;
          lineSvg += 'M' + f1(a.x + ux * g) + ',' + f1(a.y + uy * g) + 'L' + f1(b.x - ux * g) + ',' + f1(b.y - uy * g);
        }
      });
    });

    // ---- 지평선 ----
    function pathOf(fn, t0, t1, step) {
      var d = '', pen = false;
      for (var t = t0; t <= t1 + 1e-6; t += step) { var q = fn(t), p = proj(q[0], q[1]); if (p.dist > 122) { pen = false; continue; } d += (pen ? 'L' : 'M') + f1(p.x) + ',' + f1(p.y); pen = true; }
      return d;
    }
    var horizon = pathOf(function (t) { return [0, t]; }, AZ0 - 125, AZ0 + 125, 1);
    var horizon2 = pathOf(function (t) { return [-0.9, t]; }, AZ0 - 125, AZ0 + 125, 1);
    var ticks = '', dirs = '', DIR = { 90: '동', 135: '남동', 180: '남', 225: '남서', 270: '서' };
    for (var az = 75; az <= 285; az += 15) {
      var ta = proj(-0.9, az); if (ta.x < 4 || ta.x > W - 4) continue;
      var major = az % 45 === 0, tb = proj(major ? -4.2 : -2.4, az);
      ticks += '<path d="M' + f1(ta.x) + ',' + f1(ta.y) + 'L' + f1(tb.x) + ',' + f1(tb.y) + '" stroke-width="' + (major ? 1.4 : .8) + '" opacity="' + (major ? .9 : .5) + '"/>';
      if (major && DIR[az]) { var tt = proj(-8.3, az); if (tt.x > 16 && tt.x < W - 16) dirs += '<text class="dir' + (az === 180 ? ' s' : '') + '" x="' + f1(tt.x) + '" y="' + f1(tt.y + 7) + '">' + DIR[az] + '</text>'; }
    }
    var ground = horizon + 'L' + (W + 40) + ',' + (H + 40) + 'L-40,' + (H + 40) + 'Z';

    // ---- 달 ----
    var moon = body('Moon'), sun = body('Sun'), ph = A.MoonPhase(date);
    var dA = (sun.az - moon.az) * RAD;
    var limb = Math.atan2(Math.sin(dA) * Math.cos(sun.alt * RAD), Math.cos(moon.alt * RAD) * Math.sin(sun.alt * RAD) - Math.sin(moon.alt * RAD) * Math.cos(sun.alt * RAD) * Math.cos(dA)) / RAD;
    var moonUp = moon.alt > 2, fold = ph > 180 ? 360 - ph : ph; // drawMoon 은 0(삭)…180(보름)
    if (!moonUp) limb = ph > 180 ? 270 : 90; // 안 떠 있으면 똑바로 세운 모습으로
    var nm = moonName(ph), mLines = [];
    if (nm[0] === '숨은 달') mLines = ['달빛이 없어', '별이 더 잘 보여'];
    else if (moonUp) {
      var ms = A.SearchRiseSet(A.Body.Moon, obs, -1, date, 1), morning = new Date(date); morning.setHours(30, 0, 0, 0);
      if (ms && ms.date < morning) { var hz = A.Horizon(ms.date, obs, A.Equator(A.Body.Moon, ms.date, obs, true, true).ra, A.Equator(A.Body.Moon, ms.date, obs, true, true).dec, 'normal'); mLines = [clock(ms.date), dir8(hz.azimuth) + '쪽으로 져']; }
      else mLines = ['밤새', '하늘에 떠 있어'];
    } else {
      var mr = A.SearchRiseSet(A.Body.Moon, obs, +1, new Date(date.getTime() - 40 * 60e3), 1), lim = new Date(date); lim.setHours(29, 0, 0, 0);
      if (mr && mr.date < lim) { var eq2 = A.Equator(A.Body.Moon, mr.date, obs, true, true), hz2 = A.Horizon(mr.date, obs, eq2.ra, eq2.dec, 'normal'); mLines = mr.date <= date ? ['지금 막', dir8(hz2.azimuth) + '쪽에서 떠올라'] : [clock(mr.date), dir8(hz2.azimuth) + '쪽에서 떠']; }
      else mLines = ['오늘 밤엔', ph < 180 ? '벌써 졌어' : '안 떠'];
    }
    // 다음 반달·보름달
    var next = [], mq = A.SearchMoonQuarter(date), today = new Date(now), seen = {}; today.setHours(0, 0, 0, 0);
    for (var qi = 0; qi < 8 && next.length < 2; qi++) { // 다음 반달 하나, 다음 보름달 하나 (가까운 순서로)
      var kind = mq.quarter === 2 ? '보름달' : mq.quarter === 0 ? '' : '반달';
      if (kind && !seen[kind]) { seen[kind] = 1; var qd = mq.time.date, dd = Math.round((new Date(qd.getFullYear(), qd.getMonth(), qd.getDate()) - today) / 864e5);
        next.push([dd === 0 ? '오늘' : dd === 1 ? '내일' : (qd.getMonth() !== today.getMonth() ? (qd.getMonth() + 1) + '월 ' : '') + qd.getDate() + '일', kind]); }
      mq = A.NextMoonQuarter(mq);
    }

    // ---- 행성 + 오늘 밤 하나 ----
    var planets = [];
    PLANETS.forEach(function (P) {
      var h = body(P[0]); if (h.alt < 6) return;
      var mag = 0; try { mag = A.Illumination(A.Body[P[0]], date).mag; } catch (e) {}
      var p = proj(h.alt, h.az); planets.push({ name: P[1], note: P[2], alt: h.alt, az: h.az, mag: mag, x: p.x, y: p.y, vis: inView(p) && p.y < H - 60 });
    });
    planets.sort(function (a, b) { return a.mag - b.mag; });
    var pk = planets.filter(function (p) { return p.alt >= 10; })[0], pick;
    if (pk) pick = { name: pk.name, alt: pk.alt, az: pk.az, note: pk.note, planet: true };
    else {
      var bs = named.filter(function (s) { return s.alt >= 15 && s.mag < 1.6; }).sort(function (a, b) { return a.mag - b.mag; })[0];
      if (bs) pick = { name: bs.name, alt: bs.alt, az: bs.az, note: STAR_NOTE[bs.name] || '오늘 밤 가장 밝은 별' };
      else if (moonUp && nm[0] !== '숨은 달') pick = { name: '달', alt: moon.alt, az: moon.az, note: nm[1] };
    }

    // ---- 이름표: 겹치지 않게 최대 6개 ----
    var boxes = [], labelSvg = '', count = 0;
    function place(x, y, txt, size, cls, r) {
      var w = txt.length * size * 0.98 + 6, h = size * 1.15;
      var tries = [[r + 13, size * .35, 'start'], [-(r + 13), size * .35, 'end'], [r + 6, -(r + 9), 'start'], [-(r + 6), -(r + 9), 'end'], [r + 6, size * .8 + r + 6, 'start'], [-(r + 6), size * .8 + r + 6, 'end']];
      for (var i = 0; i < tries.length; i++) {
        var t = tries[i], x0 = t[2] === 'start' ? x + t[0] : x + t[0] - w, y0 = y + t[1] - size * .9, bx = [x0, y0, x0 + w, y0 + h];
        if (bx[0] < 14 || bx[2] > W - 14 || bx[1] < 30 || bx[3] > H - 56) continue;
        if (boxes.some(function (b) { return bx[0] < b[2] + 3 && bx[2] > b[0] - 3 && bx[1] < b[3] + 2 && bx[3] > b[1] - 2; })) continue;
        boxes.push(bx); labelSvg += '<text class="lb' + (cls ? ' ' + cls : '') + '" x="' + f1(x + t[0]) + '" y="' + f1(y + t[1]) + '" text-anchor="' + t[2] + '">' + txt + '</text>'; count++; return true;
      }
      return false;
    }
    var bodySvg = '', pm = proj(moon.alt, moon.az), moonVis = moonUp && inView(pm) && pm.y < H - 58 && nm[0] !== '숨은 달';
    // 이름표가 별·행성·달을 덮지 않게 자리를 먼저 잡아 둠
    planets.forEach(function (p) { if (p.vis) boxes.push([p.x - 10, p.y - 10, p.x + 10, p.y + 10]); });
    if (moonVis) boxes.push([pm.x - 13, pm.y - 13, pm.x + 13, pm.y + 13]);
    named.forEach(function (s) { if (s.mag < 1.6) boxes.push([s.x - 6, s.y - 6, s.x + 6, s.y + 6]); });
    planets.forEach(function (p) {
      if (!p.vis) return; var hi = pick && pick.name === p.name;
      bodySvg += '<g transform="translate(' + f1(p.x) + ' ' + f1(p.y) + ')">' + (hi ? '<circle r="74" fill="url(#gkAg)" opacity=".55"/><circle r="30" fill="url(#gkAg)" opacity=".9"/><path d="M-46,0H46M0,-46V46" stroke="#F0C374" stroke-width="1" opacity=".55" stroke-linecap="round"/><path d="M-15,-15L15,15M-15,15L15,-15" stroke="#F0C374" stroke-width=".7" opacity=".3" stroke-linecap="round"/><circle r="6.5" fill="#F6D08A"/><circle r="3" fill="#FFF3D6"/>'
        : '<circle r="34" fill="url(#gkAg)" opacity=".6"/><circle r="4.8" fill="#F6D08A"/><circle r="2.2" fill="#FFF3D6"/>') + '</g>';
    });
    if (moonVis) {
      var pm2 = proj(moon.alt + 1, moon.az), up = Math.atan2(pm2.x - pm.x, -(pm2.y - pm.y)) / RAD, k = Math.cos(fold * RAD), rm = 12;
      bodySvg += '<g transform="translate(' + f1(pm.x) + ' ' + f1(pm.y) + ')"><circle r="46" fill="url(#gkMg)" opacity=".55"/><g transform="rotate(' + f1(limb - 90 + up) + ')"><circle r="' + rm + '" fill="#2B251F"/><circle r="' + rm + '" fill="none" stroke="#6E6252" stroke-width=".6"/>' +
        '<path d="M0,' + -rm + 'A' + rm + ',' + rm + ' 0 0 1 0,' + rm + 'A' + f1(Math.abs(k) * rm) + ',' + rm + ' 0 0 ' + (k > 0 ? 0 : 1) + ' 0,' + -rm + 'Z" fill="#F3E8D0"/></g></g>';
    }
    planets.forEach(function (p) { if (p.vis && pick && pick.name === p.name) place(p.x, p.y, p.name, 38, 'hi', 18); });
    if (moonVis) place(pm.x, pm.y, '달', 26, pick && pick.name === '달' ? 'hi2' : '', 18);
    planets.forEach(function (p) { if (p.vis && !(pick && pick.name === p.name)) place(p.x, p.y, p.name, 26, 'pl', 6); });
    named.filter(function (s) { return s.alt > 9 && s.y < H - 70; }).sort(function (a, b) { return a.mag - b.mag; }).forEach(function (s) {
      if (count >= 6) return; var hi = pick && pick.name === s.name; place(s.x, s.y, s.name, hi ? 34 : 26, hi ? 'hi' : '', rOf(s.mag));
    });

    var svg = '<svg class="sky-svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs>' +
      '<radialGradient id="gkSky" cx="50%" cy="100%" r="95%"><stop offset="0" stop-color="#1D1711"/><stop offset=".55" stop-color="#15110D"/><stop offset="1" stop-color="#100D0A"/></radialGradient>' +
      '<radialGradient id="gkSg"><stop offset="0" stop-color="#F3E8D0" stop-opacity=".55"/><stop offset=".35" stop-color="#F3E8D0" stop-opacity=".12"/><stop offset="1" stop-color="#F3E8D0" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="gkMg"><stop offset="0" stop-color="#F3E8D0" stop-opacity=".4"/><stop offset=".4" stop-color="#F3E8D0" stop-opacity=".1"/><stop offset="1" stop-color="#F3E8D0" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="gkAg"><stop offset="0" stop-color="#E2AA55" stop-opacity=".5"/><stop offset=".5" stop-color="#E2AA55" stop-opacity=".1"/><stop offset="1" stop-color="#E2AA55" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="gkGr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A0806"/><stop offset="1" stop-color="#100D0A"/></linearGradient>' +
      '<linearGradient id="gkHz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2AA55" stop-opacity="0"/><stop offset="1" stop-color="#E2AA55" stop-opacity=".2"/></linearGradient>' +
      '<clipPath id="gkCc"><rect width="' + W + '" height="' + H + '"/></clipPath><clipPath id="gkSc"><path d="' + horizon + 'L' + (W + 40) + ',-40L-40,-40Z"/></clipPath>' +
      '<linearGradient id="gkFl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#100D0A"/><stop offset="1" stop-color="#100D0A" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="gkFr" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#100D0A"/><stop offset="1" stop-color="#100D0A" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="gkFt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#100D0A"/><stop offset="1" stop-color="#100D0A" stop-opacity="0"/></linearGradient></defs>' +
      '<g clip-path="url(#gkCc)"><rect width="' + W + '" height="' + H + '" fill="url(#gkSky)"/><g clip-path="url(#gkSc)"><rect y="' + (H - 260) + '" width="' + W + '" height="260" fill="url(#gkHz)"/>' +
      '<path d="' + lineSvg + '" fill="none" stroke="#D8CBB4" stroke-width=".9" opacity=".3"/>' + glowSvg + starSvg + bodySvg + labelSvg + '</g>' +
      '<path d="' + ground + '" fill="url(#gkGr)"/><path d="' + horizon + '" fill="none" stroke="#CFC3AD" stroke-width="1.6"/><path d="' + horizon2 + '" fill="none" stroke="#CFC3AD" stroke-width=".6" opacity=".7"/>' +
      '<g stroke="#CFC3AD" fill="none">' + ticks + '</g><rect width="70" height="' + H + '" fill="url(#gkFl)"/><rect x="' + (W - 70) + '" width="70" height="' + H + '" fill="url(#gkFr)"/><rect width="' + W + '" height="36" fill="url(#gkFt)"/>' + dirs + '</g></svg>';

    var when = live ? '지금' : (function () { var h = date.getHours(), m = Math.round(date.getMinutes() / 10) * 10; if (m === 60) { h++; m = 0; } return (h < 21 ? '저녁 ' : '밤 ') + (h % 12 || 12) + '시' + (m ? ' ' + m + '분' : '') + '쯤'; })();
    return {
      svg: svg, when: when, live: live, sunset: sunset ? clock(sunset) : '',
      moon: { phase: ph, limb: limb, long: nm[0].length > 3, name: nm[0], sub: nm[1], lines: mLines, up: moonUp }, next: next,
      pick: pick ? { name: pick.name, head: dir8(pick.az) + '쪽 ' + howHigh(pick.alt) + ',', sub: fists(pick.alt), note: pick.note } : null
    };
  }

  // ---------- 달 그리기: 빛 받은 공처럼 (부드러운 경계, 지구빛, 바다, 크레이터) ----------
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var P = new Float32Array(4096), r0 = rng(7); for (var i = 0; i < 4096; i++) P[i] = r0();
  function vn(x, y) { var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi; xf = xf * xf * (3 - 2 * xf); yf = yf * yf * (3 - 2 * yf);
    function h(a, b) { return P[((a * 73 + b * 151) & 4095 + 4096) & 4095]; }
    var a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1); return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf; }
  function fbm(x, y, o) { var s = 0, a = .5, f = 1; for (var i = 0; i < o; i++) { s += a * vn(x * f, y * f); f *= 2.03; a *= .5; } return s; }
  var MARIA = [[.70, .30, .105, .085, .34], [.70, -.07, .11, .15, .26], [.42, .15, .2, .15, .3], [.22, .44, .15, .15, .3], [.50, -.27, .08, .08, .26],
    [-.22, .52, .27, .25, .3], [-.6, .2, .24, .42, .28], [-.2, -.38, .18, .15, .24], [-.52, -.42, .1, .1, .26], [0, .82, .36, .05, .18], [.05, .2, .1, .08, .2], [.84, .05, .04, .12, .16]];
  var rc = rng(41), CR = [];
  for (var k = 0; k < 420; k++) { var ang = rc() * 6.283, rd = Math.sqrt(rc()) * .98, s = rc(); CR.push([Math.cos(ang) * rd, Math.sin(ang) * rd, .007 + s * s * s * s * .05, .35 + rc() * .65]); }
  CR.push([.84, -.3, .042, .8], [.74, .55, .036, .7], [.6, -.6, .045, .8], [.77, -.5, .032, .8], [-.1, -.68, .04, .8]);
  var HM = null, HN = 0;
  function heightmap(N) {
    if (HM && HN === N) return HM; HN = N; HM = new Float32Array(N * N);
    for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) { var u = (i + .5) / N * 2 - 1, v = 1 - (j + .5) / N * 2; HM[j * N + i] = fbm(u * 9 + 20, v * 9 + 20, 5) * .05; }
    CR.forEach(function (c) {
      var z = Math.sqrt(Math.max(.02, 1 - c[0] * c[0] - c[1] * c[1])), ext = c[2] * 1.5;
      var i0 = Math.max(0, Math.floor((c[0] - ext + 1) / 2 * N)), i1 = Math.min(N - 1, Math.ceil((c[0] + ext + 1) / 2 * N));
      var j0 = Math.max(0, Math.floor((1 - c[1] - ext) / 2 * N)), j1 = Math.min(N - 1, Math.ceil((1 - c[1] + ext) / 2 * N));
      var dl = Math.hypot(c[0], c[1]) || 1, rx = c[0] / dl, ry = c[1] / dl;
      for (var j = j0; j <= j1; j++) for (var i = i0; i <= i1; i++) {
        var du = (i + .5) / N * 2 - 1 - c[0], dv = 1 - (j + .5) / N * 2 - c[1];
        var pr = (du * rx + dv * ry) / z, pt = -du * ry + dv * rx, t = Math.hypot(pr, pt) / c[2];
        if (t < 1.5) { var w = 1 - t * t; HM[j * N + i] += c[2] * c[3] * ((t < 1 ? -w * w * .5 : 0) + Math.exp(-Math.pow((t - 1.02) / .3, 2)) * .16); }
      }
    });
    return HM;
  }
  function hs(H, N, u, v) {
    var x = Math.min(N - 1.001, Math.max(0, (u + 1) / 2 * N - .5)), y = Math.min(N - 1.001, Math.max(0, (1 - v) / 2 * N - .5)), xi = x | 0, yi = y | 0, xf = x - xi, yf = y - yi, o = yi * N + xi;
    return (H[o] * (1 - xf) + H[o + 1] * xf) * (1 - yf) + (H[o + N] * (1 - xf) + H[o + N + 1] * xf) * yf;
  }
  // phase: 0 삭 … 180 보름 … 360, limb: 밝은 쪽 방향(위에서 시계 방향, 도)
  function drawMoon(cv, cssSize, phase, limb) {
    var N = Math.min(640, Math.round(cssSize * Math.min(2, Math.max(1.5, window.devicePixelRatio || 1))));
    cv.width = cv.height = N;
    var ctx = cv.getContext('2d'), img = ctx.createImageData(N, N), d = img.data;
    var wane = phase > 180, ph = (wane ? 360 - phase : phase) * RAD, sx = Math.sin(ph) * (wane ? -1 : 1), sz = -Math.cos(ph); // 기우는 달은 왼쪽이 밝음 (달 무늬는 그대로)
    var rot = (limb - (wane ? 270 : 90)) * RAD, cr = Math.cos(rot), sr = Math.sin(rot);
    var H = heightmap(N), rad = N / 2 - 1.5, bump = 17;
    for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) {
      var X = (i + .5 - N / 2) / rad, Y = -(j + .5 - N / 2) / rad, rr = X * X + Y * Y, o = (j * N + i) * 4;
      if (rr > 1.02) continue;
      var u = X * cr - Y * sr, v = X * sr + Y * cr;
      var z = Math.sqrt(Math.max(0, 1 - rr)), nx = u, ny = v, nz = z;
      var alb = .93, m = 0, lam0 = u * sx + z * sz;
      for (var q = 0; q < MARIA.length; q++) { var M = MARIA[q], a = (u - M[0]) / M[2], b = (v - M[1]) / M[3], e = a * a + b * b; if (e < 4) m += M[4] * Math.exp(-e * e * .9); }
      var nz1 = fbm(u * 5 + 3, v * 5 + 9, 4);
      alb -= Math.min(.42, m) * (.75 + nz1 * .5); alb += (nz1 - .5) * .12 + (fbm(u * 26, v * 26, 3) - .47) * .09;
      var e2 = 1.5 / N, gx = (hs(H, N, u + e2, v) - hs(H, N, u - e2, v)) / (2 * e2), gy = (hs(H, N, u, v + e2) - hs(H, N, u, v - e2)) / (2 * e2);
      var bk = bump * .04 * Math.min(1, z * 1.35 + .12) * (1 - .45 * Math.max(0, lam0)); nx -= gx * bk; ny -= gy * bk; var l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
      var lam = nx * sx + nz * sz, lit = 0;
      if (lam > 0) lit = Math.pow(lam, .55) * (.84 + .16 * z);
      lit *= Math.max(0, Math.min(1, (u * sx + z * sz + .05) / .1));
      var es = .03 * alb * (.55 + .45 * z);
      var R = 270 * alb * lit + 150 * es, G = 254 * alb * lit + 141 * es, B = 222 * alb * lit + 128 * es;
      var aa = Math.max(0, Math.min(1, (1 - Math.sqrt(rr)) * rad + .5));
      d[o] = Math.min(255, R + 13); d[o + 1] = Math.min(255, G + 10.5); d[o + 2] = Math.min(255, B + 8); d[o + 3] = 255 * aa;
    }
    ctx.putImageData(img, 0, 0);
  }

  window.GKSky = { build: build, drawMoon: drawMoon };
})();

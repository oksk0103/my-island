(()=>{ /* 44. 자석 — 새 틀(v2): 관측 노트 */
const BG='#1B1745';
const cl=v=>Math.max(0,Math.min(1,v));
// 막대자석: 가운데(cx,cy), 가로 w 세로 h. left/right = 'N'|'S'. N 쪽 = 크림 면, S 쪽 = 보조색 면
function bar(p,cx,cy,w,h,left='S',right='N',big=true){const g=el('g',{transform:`translate(${cx},${cy})`},p);
 const half=(x,k)=>{const n=k==='N';el('rect',{x,y:-h/2,width:w/2,height:h,fill:n?W0:WA},g);tx(g,x+w/4,big?21:10,k,big?'v60':'v28','middle',{style:`fill:${n?BG:W0}`});};
 half(-w/2,left);half(0,right);el('rect',{x:-w/2,y:-h/2,width:w,height:h,fill:'none',stroke:W0,'stroke-width':2},g);return g;}
// 쇠 클립(선 그림, 세로)
function clip(p,x,y,s=1,col=W0){const g=el('g',{transform:`translate(${x},${y}) scale(${s})`},p);
 el('path',{d:'M-8,-20V24A8,8 0 0 0 8,24V-30A13,13 0 0 0 -18,-30V30A18,18 0 0 0 18,30V-16',fill:'none',stroke:col,'stroke-width':2/s*1.4,'stroke-linecap':'round'},g);return g;}
// 쇠 못(면)
function nail(p,x,y,col=W0){const g=el('g',{transform:`translate(${x},${y})`},p);el('rect',{x:-16,y:-40,width:32,height:6,fill:col},g);el('rect',{x:-4,y:-34,width:8,height:62,fill:col},g);el('path',{d:'M-4,28L0,42L4,28Z',fill:col},g);return g;}
// 나무 막대(선 + 결)
function wood(p,x,y){const g=el('g',{transform:`translate(${x},${y})`},p);el('rect',{x:-50,y:-14,width:100,height:28,fill:'none',stroke:W0,'stroke-width':2},g);
 [[-36,-4,10,-4],[-20,5,30,5],[-8,-6,22,-6]].forEach(([a,b,c,d])=>wl(g,a,b,c,d,W0m));return g;}
// 작은 화살표(가운데 기준, 길이 L)
function arrow(p,x,y,L,deg,col=W0){const g=el('g',{transform:`translate(${x},${y}) rotate(${deg})`},p);wl(g,-L/2,0,L/2,0,col);el('path',{d:`M${L/2-12},-8L${L/2},0L${L/2-12},8`,fill:'none',stroke:col,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'},g);return g;}
const mv=(g,x,y,r=0)=>g.setAttribute('transform',`translate(${x},${y})${r?` rotate(${r})`:''}`);

EPX[44]={day:'과학 13',topic:'자석',cat:'끌어당기는 힘',field:'과학',frame:'v2',
 cover:{h:'자석은 왜<br>쇠에<br>붙을까?',draw(S){
   const cx=1090,cy=360,w=480,h=100;
   // 자석 둘레의 힘 줄(보조색 점선)
   const fg=el('g',{fill:'none',stroke:WA,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},S);
   [60,120,190,260].forEach(k=>{el('path',{d:`M${cx-w/2+20},${cy-h/2}C${cx-w/2+20-k*.3},${cy-h/2-k} ${cx+w/2-20+k*.3},${cy-h/2-k} ${cx+w/2-20},${cy-h/2}`},fg);
     if(k<240)el('path',{d:`M${cx-w/2+20},${cy+h/2}C${cx-w/2+20-k*.3},${cy+h/2+k} ${cx+w/2-20+k*.3},${cy+h/2+k} ${cx+w/2-20},${cy+h/2}`},fg);});
   bar(S,cx,cy,w,h,'S','N');
   const GY=640;wl(S,648,GY,1504,GY,W0m);tx(S,648,GY+38,'관측 · 막대자석과 쇠 클립','v22m');
   // 클립: 바닥에서 자석 양 끝으로 붙음(N 쪽 한 개만 산호)
   const C=[[cx-w/2+30,-1],[cx-w/2+80,1],[cx+w/2-80,1],[cx+w/2-30,-1]].map(([x,d],k)=>{const g=clip(S,x+d*120,GY-36,1,k===3?WO:W0);return {g,x0:x+d*120,y0:GY-36,x1:x,y1:cy+h/2+34};});
   el('path',{d:`M${cx+w/2-6},${cy+h/2+34}H1504`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,1504,cy+h/2+18,'쇠 클립','v28','end');
   const set=e=>C.forEach((c,k)=>{const s=cl(e*1.3-k*.1);const q=EO(s);mv(c.g,c.x0+(c.x1-c.x0)*q,c.y0+(c.y1-c.y0)*q);});
   let on=false;
   return ()=>{if(on||calm()){set(1);return;}on=true;loop(S,t=>{const c=t%5;set(c<1.2?c/1.2:c<4.2?1:1-(c-4.2)/.8);});};}},
 scenes:[
  {k:'붙는 것',h:'자석은 쇠를<br>끌어당긴다',b:'자석은 <em>쇠</em>로 된 클립이나 못을 끌어당겨. 나무 막대는 자석을 대 봐도 꼼짝 안 해.',steps:['자석 내리기'],
   draw(S){const GY=600;wl(S,660,GY,1504,GY,W0);
    // 높이 눈금(오른쪽)
    wl(S,1490,GY,1490,140,W0m);for(let y=GY,i=0;y>=140;y-=40,i++)wl(S,1490,y,1490-(i%4===0?16:9),y,i%4===0?W0:W0m);
    const X=[820,1040,1260],mg=bar(S,1040,170,560,80,'S','N',false);
    // 자석 아래로 내려오는 길(보조색 점선)
    const gd=el('g',{stroke:WA,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},S);X.forEach(x=>wl(gd,x,230,x,GY-60,WA,{'stroke-dasharray':'2 10'}));S.insertBefore(gd,S.firstChild);
    const O=[clip(S,X[0],GY-38,1.1),nail(S,X[1],GY-44),wood(S,X[2],GY-16)];
    ['쇠 클립','쇠 못','나무 막대'].forEach((s,k)=>tx(S,X[k],GY+48,s,'v28','middle'));
    const yes=grp(S,0);el('path',{d:`M${X[0]-40},${GY-150}V${GY-166}H${X[1]+40}V${GY-150}`,fill:'none',stroke:WO,'stroke-width':2},yes);tx(yes,(X[0]+X[1])/2,GY-184,'붙어','v60','middle',{style:`fill:${WO}`});
    const no=grp(S,0);tx(no,X[2],GY-120,'꼼짝 안 해','v28','middle');
    return ()=>{const MY=330;play(900,e=>mv(mg,1040,170+(MY-170)*e),()=>{
      play(600,e=>{mv(O[0],X[0],GY-38+(MY+40+38-GY+38)*e);O[0].setAttribute('transform',`translate(${X[0]},${GY-38+((MY+40+38)-(GY-38))*e}) scale(1.1)`);mv(O[1],X[1],GY-44+((MY+40+44)-(GY-44))*e);},()=>{show(no);
        // 붙은 뒤 표지: 자석 쪽 위로 옮긴 괄호
        yes.setAttribute('transform',`translate(0,${-(GY-166)+(MY+200)})`);show(yes);});});};}},
  {k:'쇠 속 작은 자석',h:'쇠 속 작은 자석들이<br>한 줄로 선다',b:'쇠 속에는 아주 작은 자석들이 <em>제멋대로</em> 놓여 있어. 자석이 다가오면 모두 <em>한 방향</em>으로 돌아서 끌려가.',steps:['자석 다가가기'],
   draw(S){const cx=1250,cy=390,R=230;wLens(S,cx,cy,R);tx(S,cx,130,'쇠 속을 크게','v22m','middle');
    // 쇠 조각(왼쪽 작게) → 돋보기 선
    const px=900,py=540;el('rect',{x:px-60,y:py-22,width:120,height:44,fill:'none',stroke:W0,'stroke-width':2},S);tx(S,px,py+76,'쇠 조각','v28','middle');
    el('circle',{cx:px+30,cy:py,r:14,fill:'none',stroke:W0,'stroke-width':2},S);{const dx=cx-(px+30),dy=cy-py,L=Math.hypot(dx,dy);wl(S,px+30+dx/L*14,py+dy/L*14,cx-dx/L*(R+12),cy-dy/L*(R+12),W0m);}
    const q=rnd(44),A=[];for(let gx=-3;gx<=3;gx++)for(let gy=-3;gy<=3;gy++){const x=cx+gx*58,y=cy+gy*58;if(Math.hypot(x-cx,y-cy)>R-36)continue;const d=Math.floor(q()*360);A.push({g:arrow(S,x,y,40,d,A.length===16?WO:W0),x,y,d});}
    const mg=bar(S,760,250,220,64,'N','S',false);const lab=tx(S,cx,690,'제멋대로','v28','middle');
    return ()=>{const st=A.map(a=>{let t=180;let d=((t-a.d)%360+540)%360-180;return d;});
     play(900,e=>mv(mg,760+80*e,250),()=>play(1100,e=>A.forEach((a,k)=>{const s=cl(e*1.5-(a.x-cx+R)/(2*R)*.5);mv(a.g,a.x,a.y,a.d+st[k]*EO(s));}),()=>{lab.textContent='모두 한 방향';}));};}},
  {k:'N극과 S극',h:'다른 극은 당기고<br>같은 극은 민다',b:'자석의 두 끝은 <em>N극</em>과 <em>S극</em>이야. N과 S는 서로 당기고, N과 N은 서로 밀어내.',steps:['N과 S','N과 N'],
   draw(S){wl(S,660,410,1504,410,W0m);
    const rows=[{y:260,lab:'N과 S',a:['S','N'],b:['S','N'],b0:1240,b1:1040+0},{y:560,lab:'N과 N',a:['S','N'],b:['N','S'],b0:1120,b1:1300}];
    const W=260,H=70,A0=800;
    rows.forEach((r,j)=>{tx(S,660,r.y-80,r.lab,'v28');bar(S,A0,r.y,W,H,r.a[0],r.a[1],false);r.g=bar(S,r.b0,r.y,W,H,r.b[0],r.b[1],false);
     // 거리 눈금
     for(let x=A0+W/2,i=0;x<=1504;x+=24,i++)wl(S,x,r.y+H/2+18,x,r.y+H/2+(i%5===0?36:28),i%5===0?W0:W0m);});
    rows[0].b1=A0+W;
    const c0=grp(S,0);tx(c0,A0+W/2,rows[0].y-60,'착!','v28','middle');el('circle',{cx:A0+W/2,cy:rows[0].y-H/2-14,r:9,fill:WO},c0);
    const c1=grp(S,0);arrow(c1,1060,rows[1].y-70,90,0);tx(c1,1040,rows[1].y-100,'밀어내','v28','middle');
    return i=>{const r=rows[i];play(900,e=>mv(r.g,r.b0+(r.b1-r.b0)*e,r.y),()=>show(i?c1:c0));};}}],
 sum:{lines:['자석은 쇠를 끌어당긴다.','자석이 다가오면 쇠 속 작은<br>자석들이 한 방향으로 선다.','다른 극은 당기고<br>같은 극은 밀어낸다.'],
  words:[['자석','쇠를 끌어당기는 물체'],['극','자석의 두 끝. N극과 S극'],['나침반','빙글 도는 바늘 자석으로<br>방향을 찾는 도구']]},
 end:{q:'나침반 바늘은 왜 늘 북쪽을 가리킬까?',a:'지구가 커다란 자석이라서 바늘 자석이 그쪽으로 돌아서.',h:'냉장고 자석을 숟가락,<br>냄비, 문손잡이에<br>대 봐.',btn:'바늘 놓기',
  draw(S){const cx=1160,cy=400,R=250;el('circle',{cx,cy,r:R,fill:'none',stroke:W0,'stroke-width':2},S);el('circle',{cx,cy,r:R+14,fill:'none',stroke:W0m,'stroke-width':2},S);
   for(let i=0;i<72;i++){const a=i*5*Math.PI/180,L=i%18===0?26:i%2?10:16;wl(S,cx+Math.sin(a)*R,cy-Math.cos(a)*R,cx+Math.sin(a)*(R-L),cy-Math.cos(a)*(R-L),i%18===0?W0:W0m);}
   [['북',0],['동',90],['남',180],['서',270]].forEach(([s,d])=>{const a=d*Math.PI/180;tx(S,cx+Math.sin(a)*(R-70),cy-Math.cos(a)*(R-70)+(d===0?20:d===180?0:10),s,d===0?'v60':'v28','middle');});
   const nd=el('g',{transform:`translate(${cx},${cy}) rotate(110)`},S);el('path',{d:'M-14,0L0,-170L14,0Z',fill:WO},nd);el('path',{d:'M-14,0L0,170L14,0Z',fill:W0},nd);el('circle',{r:12,fill:BG,stroke:W0,'stroke-width':2},nd);
   tx(S,660,700,'관측 · 나침반','v22m');
   const lab=grp(S,0);el('path',{d:`M${cx+40},${cy-150}H1490V${cy-200}`,fill:'none',stroke:W0m,'stroke-width':2},lab);tx(lab,1490,cy-216,'바늘 N극','v22','end');
   return ()=>play(1600,e=>{const d=110*(1-e)+Math.sin(e*Math.PI*3)*18*(1-e);nd.setAttribute('transform',`translate(${cx},${cy}) rotate(${d})`);},()=>show(lab));}}};
})();

(()=>{ // 20. 정전기 — 새 틀(v2): 관측 노트
// 잉크: 크림 W0(글·선·모인 전기 점), 산호 WO(화면당 한 곳: 찌릿·딸려 오는 종이 등), 보조 WA(공기 속 물기)
const zz=(x1,x2,y,n=6,a=20)=>{let d=`M${x1},${y}`;for(let i=1;i<n;i++)d+=`L${(x1+(x2-x1)*i/n).toFixed(1)},${y+(i%2?-a:a)}`;return d+`L${x2},${y}`;};
// 문고리(옆에서 본 도식): 문 가장자리 선 + 둥근 손잡이 + 목
function knob(p,cx,cy,dx=1440,r=80){const g=el('g',{},p);wl(g,dx,110,dx,690,W0);wl(g,dx+18,110,dx+18,690,W0m);
 el('rect',{x:cx+r-6,y:cy-14,width:dx-cx-r+6,height:28,fill:'none',stroke:W0,'stroke-width':2},g);el('circle',{cx,cy,r,fill:W0},g);return g;}
// v188: 모인 전기는 점 대신 '−' 표시(전기를 그릴 때 흔히 쓰는 기호). 원(circle)처럼 cx·cy·r·opacity를 바꾸면 '−'가 따라간다.
const ELC='#F3D27A',WTR='#7FB4E2';
function chg(p,x,y,r,col=ELC){const c=el('circle',{cx:x,cy:y,r,fill:'none'},p),m=el('line',{stroke:col,'stroke-width':4.5,'stroke-linecap':'round'},p);
 const sync=()=>{const cx=+c.getAttribute('cx'),cy=+c.getAttribute('cy'),rr=+c.getAttribute('r'),o=c.getAttribute('opacity');const h=rr>0?Math.max(6,rr*1.5):0;
  m.setAttribute('x1',cx-h);m.setAttribute('x2',cx+h);m.setAttribute('y1',cy);m.setAttribute('y2',cy);m.setAttribute('opacity',o==null?1:o);};
 const sa=c.setAttribute.bind(c);c.setAttribute=(k,v)=>{sa(k,v);sync();};const rm=c.remove.bind(c);c.remove=()=>{rm();m.remove();};sync();return c;}
// 손(손가락 끝이 오른쪽, 끝 = (0,0))과 둘레에 모인 전기
function handQ(p,x,y,n,seed,col=ELC){const g=el('g',{},p);const f=finger(g,0,0);f.setAttribute('transform','translate(0,0) scale(.6)');const q=rnd(seed),D=[];
 for(let i=0;i<n;i++){const a=q()*Math.PI*2,r=1+q()*.3;D.push(chg(g,-90+Math.cos(a)*130*r,Math.sin(a)*62*r,5,col));}return {g,D};}

EPX[20]={day:'과학 6',topic:'정전기',cat:'전기',field:'과학',frame:'v2',
 cover:{h:'겨울엔 왜<br>문고리가<br>따끔할까?',draw(S){
   const kx=1320,ky=380;knob(S,kx,ky);tx(S,kx,ky+140,'쇠 문고리','v28','middle');
   const H=handQ(S,0,0,16,3);const hx0=900,hx1=1150;H.g.setAttribute('transform',`translate(${hx1},${ky})`);
   const Z=el('path',{d:zz(hx1+18,kx-84,ky,4,14),fill:'none',stroke:ELC,'stroke-width':4,'stroke-linejoin':'round'},S);
   const lab=tx(S,(hx1+kx)/2,ky-90,'찌릿!','v60','middle');
   hRuler(S,760,1274,600,33,'멀리','가까이');
   wl(S,680,646,1504,646,W0m);tx(S,680,684,'관측 · 겨울, 메마른 방','v22m');
   const set=c=>{const m=Math.min(1,c/1.6),x=hx0+(hx1-hx0)*EO(m),sp=c>1.6&&c<3.8;H.g.setAttribute('transform',`translate(${x.toFixed(1)},${ky})`);
    Z.setAttribute('opacity',sp?1:0);lab.setAttribute('opacity',sp?1:0);H.D.forEach(d=>d.setAttribute('opacity',c>1.6&&c<4.6?0:1));};
   let on=false;return ()=>{if(on||calm())return;on=true;loop(S,t=>set(t%5));};}},
 scenes:[
  {k:'문지르면 생겨',h:'문지르면<br>전기가 모인다',b:'풍선을 옷에 <em>문지르면</em> 풍선에 전기가 모여. 그 풍선은 가벼운 <em>종이 조각</em>을 끌어당겨.',steps:['문지르기','종이에 가까이'],
   draw(S){const GY=640;wl(S,640,GY,1504,GY,W0);
    // 옷(천): 테두리 + 세로 올
    sweaterF(S,760,400,1.05);tx(S,760,240,'옷','v60','middle');
    // 높이 눈금(오른쪽)
    
    const B=el('g',{},S),bx=980,by=330;el('ellipse',{cx:bx,cy:by,rx:110,ry:140,fill:'#D9604C'},B);el('ellipse',{cx:bx-42,cy:by-62,rx:16,ry:34,fill:'rgba(255,255,255,.35)',transform:`rotate(24 ${bx-42} ${by-62})`},B);el('path',{d:`M${bx-12},${by+154}L${bx},${by+138}L${bx+12},${by+154}Z`,fill:'#B84A3A'},B);
    el('path',{d:`M${bx},${by+154}Q${bx+20},${by+200} ${bx},${by+240}`,fill:'none',stroke:W0m,'stroke-width':2},B);tx(B,bx,by-170,'풍선','v60','middle');
    const q=rnd(8),D=[];for(let i=0;i<16;i++){const a=q()*Math.PI*2,r=Math.sqrt(q())*.8;D.push(chg(B,bx+Math.cos(a)*r*110,by+Math.sin(a)*r*140,0,W0));}
    const P=[...Array(10)].map((_,i)=>{const x=1240+i*22+(q()-.5)*8,c=el('path',{d:`M-10,-6L-2,-8L4,-5L11,-7L9,1L11,7L2,6L-6,8L-11,4Z`,fill:W0,transform:`translate(${x},${GY-7}) rotate(${((q()-.5)*30).toFixed(1)})`},S);return {c,x,y:GY-7,tx:1260+(i%5)*40+(q()-.5)*10,ty:by+150+Math.floor(i/5)*16};});
    tx(S,1240,GY+40,'종이 조각','v22m');
    const cap=tx(S,680,604,'','v28');
    return i=>{if(i===0){cap.textContent='';play(1500,(e,x)=>{const s=Math.abs(Math.sin(x*Math.PI*3));B.setAttribute('transform',`translate(${(-60*s).toFixed(1)},0)`);D.forEach((d,k)=>d.setAttribute('r',x>k/D.length*.9?5:0));},()=>{B.setAttribute('transform','translate(0,0)');D.forEach(d=>d.setAttribute('r',5));cap.textContent='풍선에 전기가 모였어';});}
     else{cap.textContent='';play(1500,e=>{const m=Math.min(1,e*1.6);B.setAttribute('transform',`translate(${(340*m).toFixed(1)},0)`);
       P.forEach((p,k)=>{const s=Math.max(0,Math.min(1,(e-.45-k*.025)/.4)),X=p.x+(p.tx+340-1260+1260-1260-p.x+(p.tx-p.tx))*0;const x=p.x+(p.tx-p.x)*s,y=p.y+(p.ty-p.y)*s;p.c.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)})`);});},()=>{cap.textContent='종이 조각이 딸려 올라와';});}};}},
  {k:'찌릿',h:'모인 전기가<br>한꺼번에 건너간다',b:'몸에 전기가 모인 채 <em>쇠 문고리</em>에 손을 가까이 대면, 전기가 한꺼번에 건너가. 그게 <em>찌릿</em>이야.',steps:['손 가까이 대기'],
   draw(S){const kx=1320,ky=380;knob(S,kx,ky);tx(S,kx,ky+140,'쇠 문고리','v28','middle');
    const hx0=900,hx1=1150,H=handQ(S,0,0,16,5);H.g.setAttribute('transform',`translate(${hx0},${ky})`);
    tx(S,hx0-90,ky+120,'전기가 모인 손','v22m','middle');
    const zd=zz(hx1+18,kx-84,ky,4,14),Z=el('path',{d:zd,fill:'none',stroke:ELC,'stroke-width':4,'stroke-linejoin':'round',opacity:0},S);
    const lab=grp(S,0);tx(lab,(hx1+kx)/2,ky-90,'찌릿!','v60','middle');
    hRuler(S,760,1274,600,33,'멀리','가까이');
    return ()=>play(700,e=>H.g.setAttribute('transform',`translate(${(hx0+(hx1-hx0)*e).toFixed(1)},${ky})`),()=>{
      Z.setAttribute('opacity',1);const L=Z.getTotalLength(),st=H.D.map(d=>[+d.getAttribute('cx')+hx1,+d.getAttribute('cy')+ky]);
      const F=H.D.map(d=>{d.setAttribute('opacity',0);return chg(S,0,0,5,W0);});
      play(500,e=>F.forEach((c,k)=>{const s=Math.max(0,Math.min(1,e*1.5-k/F.length*.5));const pt=Z.getPointAtLength(L*s),a=Math.min(1,s*3);c.setAttribute('cx',(st[k][0]+(pt.x-st[k][0])*a).toFixed(1));c.setAttribute('cy',(st[k][1]+(pt.y-st[k][1])*a).toFixed(1));c.setAttribute('r',s>=1?0:5);}),()=>show(lab));});}},
  {k:'겨울에 많은 까닭',h:'겨울엔 공기가<br>메말라서 그렇다',b:'공기 속 <em>물기</em>는 몸에 모인 전기를 조금씩 데려가. 겨울엔 공기가 메말라 전기가 그대로 <em>모여</em>.',steps:['여름','겨울'],
   draw(S){wl(S,1072,110,1072,660,W0m);const C=[];
    [[640,'여름',44,.82],[1100,'겨울',8,.2]].forEach(([x0,t,nw,hum],j)=>{tx(S,x0,180,t,'v60');const cx=x0+200,cy=390;
     const W=vapor(S,30+j,nw,x0+10,230,x0+390,540,WTR,5).filter(d=>{if(((d.x-cx)/140)**2+((d.y-cy)/105)**2<1){d.c.remove();return false;}return true;});
     el('ellipse',{cx,cy,rx:120,ry:86,fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'6 8'},S);
     const q=rnd(50+j),D=[];for(let i=0;i<12;i++){const a=q()*Math.PI*2,r=Math.sqrt(q())*.8;D.push({c:chg(S,cx+Math.cos(a)*r*120,cy+Math.sin(a)*r*86,6,W0),x:cx+Math.cos(a)*r*120,y:cy+Math.sin(a)*r*86});}
     tx(S,cx,cy+130,'몸에 모인 전기','v22m','middle');
     // 공기 속 물기 막대
     tx(S,x0+10,604,'공기 속 물기','v22m');el('rect',{x:x0+10,y:620,width:380,height:24,fill:'none',stroke:W0m,'stroke-width':2},S);el('rect',{x:x0+10,y:620,width:380*hum,height:24,fill:WTR},S);
     tx(S,x0+390,604,hum>.5?'많음':'적음','v22','end');
     const cap=tx(S,x0+390,180,'','v28','end');C.push({cx,cy,W,D,cap,x0});});
    return i=>{const c=C[i];
     if(i===0){const pick=c.W.slice().sort((a,b)=>Math.hypot(a.x-c.cx,a.y-c.cy)-Math.hypot(b.x-c.cx,b.y-c.cy)).slice(0,9),tg=c.D.slice(0,9),st=pick.map(d=>[d.x,d.y]);
       play(1600,e=>{const a=Math.min(1,e/.5),b=Math.max(0,(e-.5)/.5);pick.forEach((d,k)=>{const [tx_,ty]=[tg[k].x,tg[k].y],ox=tx_+(tx_-c.cx)*1.6,oy=ty+(ty-c.cy)*1.6;
         const X=b?tx_+(ox-tx_)*b:st[k][0]+(tx_-st[k][0])*a,Y=b?ty+(oy-ty)*b:st[k][1]+(ty-st[k][1])*a;d.c.setAttribute('cx',X.toFixed(1));d.c.setAttribute('cy',Y.toFixed(1));
         if(b){tg[k].c.setAttribute('cx',X.toFixed(1));tg[k].c.setAttribute('cy',Y.toFixed(1));tg[k].c.setAttribute('opacity',(1-b).toFixed(2));d.c.setAttribute('opacity',(1-b).toFixed(2));}});},()=>{c.cap.textContent='전기가 줄었어';});}
     else{const q=rnd(77),N=[...Array(14)].map(()=>{const a=q()*Math.PI*2,r=Math.sqrt(q())*.85;return {c:chg(S,c.cx,c.cy,0,ELC),x:c.cx+Math.cos(a)*r*120,y:c.cy+Math.sin(a)*r*86,sx:c.x0+40+q()*320,sy:250};});
       play(1400,e=>N.forEach((d,k)=>{const s=Math.max(0,Math.min(1,e*1.4-k/N.length*.4)),m=EO(s);d.c.setAttribute('r',s>0?6:0);d.c.setAttribute('cx',(c.cx+(d.x-c.cx)*m).toFixed(1));d.c.setAttribute('cy',(c.cy+(d.y-c.cy)*m).toFixed(1));}),()=>{c.cap.textContent='전기가 그대로 모여';});}};}}],
 sum:{lines:['물건끼리 문지르면<br>전기가 모인다.','모인 전기는 쇠에 가까이 가면<br>한꺼번에 건너가 찌릿하다.','겨울엔 공기가 메말라<br>전기가 잘 모인다.'],
  words:[['정전기','한곳에 모여 머물러 있는 전기'],['문지르다','맞대고 밀었다 당겼다 하다'],['메마르다','물기가 없이 바싹 마르다']]},
 end:{q:'찌릿을 덜 하려면 어떻게 할까?',a:'열쇠 같은 쇠붙이로 문고리를 먼저 건드려 봐. 전기가 손 대신 열쇠로 건너가.',h:'풍선을 옷에 문질러<br>종이 조각에<br>대 봐.',btn:'답 보기',
  draw(S){const kx=1320,ky=400;knob(S,kx,ky);tx(S,kx,ky+140,'쇠 문고리','v28','middle');
   const K=el('g',{},S);finger(K,0,0).setAttribute('transform','translate(0,0) scale(.6)');const kg=el('g',{transform:'translate(34,0)'},K);
   el('circle',{cx:28,cy:0,r:26,fill:'none',stroke:W0,'stroke-width':2},kg);el('rect',{x:54,y:-8,width:120,height:16,fill:W0},kg);el('rect',{x:140,y:8,width:10,height:14,fill:W0},kg);el('rect',{x:120,y:8,width:10,height:10,fill:W0},kg);
   tx(K,100,-40,'열쇠','v28','middle');const x0=880,x1=1000;K.setAttribute('transform',`translate(${x0},${ky})`);
   const Z=el('path',{d:zz(x1+184,kx-84,ky,4,16),fill:'none',stroke:ELC,'stroke-width':4,'stroke-linejoin':'round',opacity:0},S);
   const lab=grp(S,0);tx(lab,(x1+184+kx-84)/2,ky-90,'열쇠로 건너가','v28','middle');
   hRuler(S,680,1274,646,33,'','');
   return ()=>play(1000,e=>K.setAttribute('transform',`translate(${(x0+(x1-x0)*e).toFixed(1)},${ky})`),()=>{Z.setAttribute('opacity',1);show(lab);});}}};
})();

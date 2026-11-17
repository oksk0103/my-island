(()=>{ /* 47. 나무는 겨울을 어떻게 날까 — 겨울눈. 새 틀(v2): 관측 노트 */
const BG='#1B1745';
const cl=v=>Math.max(0,Math.min(1,v));
// 겨울눈(위를 향함): 바닥 (x,y), 높이 h. 비늘 조각을 겹겹이(크림 면 + 바탕색 선으로 겹침 표시)
function bud(p,x,y,h,o={}){const g=el('g',{transform:`translate(${x},${y})`},p),w=h*.42,sc=[];
 const D=(k)=>`M0,${-h*k}C${w*.9*k},${-h*k*.55} ${w*k},${-h*.12} 0,0C${-w*k},${-h*.12} ${-w*.9*k},${-h*k*.55} 0,${-h*k}Z`;
 el('path',{d:D(1),fill:o.col||W0},g);
 if(!o.plain)[[.86,-1],[.86,1],[.62,-1],[.62,1]].forEach(([k,s])=>sc.push(el('path',{d:`M0,0C${s*w*.95},${-h*.2} ${s*w*.6},${-h*k*.75} ${s*w*.08},${-h*k}`,fill:'none',stroke:BG,'stroke-width':2},g)));
 return {g,sc};}
// 가지: 점들을 잇는 굵은 선(크림)
const twig=(p,P,w=10,c=W0)=>el('path',{d:'M'+P.map(q=>q.join(',')).join('L'),fill:'none',stroke:c,'stroke-width':w,'stroke-linecap':'round','stroke-linejoin':'round'},p);
const leafD=(L)=>`M0,0C${L*.35},${-L*.3} ${L*.75},${-L*.25} ${L},0C${L*.75},${L*.25} ${L*.35},${L*.3} 0,0Z`;

EPX[47]={day:'과학 16',topic:'겨울눈',cat:'나무의 겨울',field:'과학',frame:'v2',
 cover:{h:'나무는<br>겨울을 어떻게<br>날까?',draw(S){
   const GY=640;wl(S,648,GY,1504,GY,W0m);
   // 잎 진 나무 가지(선) — 가지 끝마다 겨울눈
   const T=[[[1060,GY],[1060,470],[1000,380],[930,300],[880,200]],[[1060,470],[1150,360],[1240,250],[1290,160]],[[1000,380],[860,330],[760,300]],[[1150,360],[1300,340],[1420,300]],[[930,300],[980,200],[1000,140]],[[1240,250],[1200,170]]];
   twig(S,T[0],18);twig(S,T[1],12);T.slice(2).forEach(P=>twig(S,P,7));
   const tips=T.map(P=>P[P.length-1]);const B=tips.map(([x,y],k)=>{const g=bud(S,x,y,0,{plain:true});return g;});
   const BB=tips.map(([x,y],k)=>({x,y,b:bud(S,x,y-2,34,{col:k===1?WO:W0,plain:true})}));
   el('path',{d:`M${tips[1][0]+14},${tips[1][1]-20}H1490V${tips[1][1]+40}`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,1490,tips[1][1]+76,'겨울눈','v28','end');
   tx(S,648,GY+38,'관측 · 12월 잎 진 나무','v22m');
   // 땅의 낙엽(크림 작은 잎)
   const q=rnd(47);for(let i=0;i<14;i++)el('path',{d:leafD(30),fill:W0,transform:`translate(${700+q()*780},${GY-6-q()*8}) rotate(${(q()-.5)*40})`},S);
   let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,t=>{const c=t%5,e=c<1?EO(c):c<4?1:1-(c-4);BB.forEach(o=>o.b.g.setAttribute('transform',`translate(${o.x},${o.y-2}) scale(${.75+.25*e})`));});};}},
 scenes:[
  {k:'잎 떨구기',h:'나무는 겨울 전에<br>잎을 떨군다',b:'잎을 달고 있으면 몸속 물이 자꾸 빠져나가. 그래서 나무는 잎을 떨궈 <em>물을 아껴</em>.',steps:['잎 떨구기'],
   draw(S){const GY=640;wl(S,640,GY,1504,GY,W0);
    const T=[[[1000,GY],[1000,460],[920,340],[860,220]],[[1000,460],[1100,330],[1180,200]],[[920,340],[780,300]],[[1100,330],[1240,320]]];
    twig(S,T[0],18);T.slice(1).forEach(P=>twig(S,P,9));
    // 가지를 따라 잎 22장(하나만 산호) + 잎에서 빠져나가는 물(보조색 점)
    const L=[],q=rnd(4);T.forEach(P=>{for(let i=1;i<P.length;i++){const [a,b]=P[i-1],[c,d]=P[i];for(let t=.25;t<1;t+=.3){L.push({x:a+(c-a)*t,y:b+(d-b)*t,r:(q()-.5)*120});}}});
    const LV=L.map((o,k)=>{const e=el('path',{d:leafD(46),fill:k===5?WO:W0,transform:`translate(${o.x},${o.y}) rotate(${o.r-90})`},S);return {...o,e,gx:700+q()*760,gr:(q()-.5)*60};});
    const W=LV.map(o=>({c:wdot(S,o.x,o.y-30,4.5,WA),x:o.x,y:o.y-30}));
    // 물 나가는 양(오른쪽 눈금 막대)
    const RX=1420,Y0=600,Y1=200;wl(S,RX,Y0,RX,Y1,W0m);for(let y=Y0,i=0;y>=Y1;y-=40,i++)wl(S,RX,y,RX-(i%5===0?20:10),y,i%5===0?W0:W0m);
    tx(S,RX,170,'빠져나가는 물','v22m','middle');const lvl=el('rect',{x:RX+8,y:Y1+40,width:14,height:Y0-Y1-40,fill:WA},S);const cap=tx(S,RX-30,Y1+60,'많아','v28','end');
    return ()=>play(1800,e=>{LV.forEach((o,k)=>{const s=cl(e*1.5-k/LV.length*.5),k2=EO(s);const x=o.x+(o.gx-o.x)*k2,y=o.y+(GY-8-o.y)*s*s;o.e.setAttribute('transform',`translate(${x},${y}) rotate(${o.r-90+(o.gr-o.r+90)*s})`);});
      W.forEach((w,k)=>{w.c.setAttribute('r',e>.5?0:4.5);});const h=(Y0-Y1-40)*(1-e*.85);lvl.setAttribute('y',Y0-h);lvl.setAttribute('height',h);},()=>{cap.textContent='조금';cap.setAttribute('y',Y0-20);});}},
  {k:'겨울눈',h:'가지 끝에는<br>겨울눈이 있다',b:'겨울눈은 <em>지난여름</em>에 미리 만들어 둔 봉오리야. 속에는 봄에 펼칠 작은 <em>잎과 꽃</em>이 접혀 있어.',steps:['속 들여다보기'],
   draw(S){// 왼쪽: 가지 하나 + 끝눈 + 잎자국
    twig(S,[[760,640],[760,300]],14);const b=bud(S,760,296,70);tx(S,700,210,'끝눈','v28','end');wl(S,708,204,738,250,W0m);
    el('path',{d:'M767,470C790,462 796,486 767,490Z',fill:'none',stroke:W0,'stroke-width':2},S);bud(S,776,470,34,{plain:false});
    el('path',{d:'M753,560C730,552 726,578 753,582',fill:'none',stroke:W0,'stroke-width':2},S);wl(S,744,580,700,664,W0m);tx(S,640,694,'잎이 붙었던 자리','v22');
    // 오른쪽: 겨울눈 단면 크게(돋보기)
    const cx=1200,cy=400,R=250;wLens(S,cx,cy,R);wl(S,790,262,cx-R*.9,cy-R*.43,W0m);el('circle',{cx:770,cy:260,r:44,fill:'none',stroke:W0,'stroke-width':2},S);
    const big=el('g',{transform:`translate(${cx},${cy+190})`},S);const H=360,w=150;
    const out=el('path',{d:`M0,${-H}C${w*1.1},${-H*.55} ${w},${-H*.12} 0,0C${-w},${-H*.12} ${-w*1.1},${-H*.55} 0,${-H}Z`,fill:'none',stroke:W0,'stroke-width':2},big);
    const scales=[];[[-1,.9],[1,.9],[-1,.7],[1,.7],[-1,.5],[1,.5]].forEach(([s,k])=>scales.push(el('path',{d:`M0,0C${s*w*1.05},${-H*.2} ${s*w*.75},${-H*k*.8} ${s*12},${-H*k}`,fill:W0,stroke:BG,'stroke-width':2},big)));
    // 안쪽: 접힌 잎 둘 + 꽃 하나(산호)
    const inner=grp(big,0);[[-1],[1]].forEach(([s])=>el('path',{d:`M0,-30C${s*80},-110 ${s*70},-210 ${s*14},-260C${s*30},-190 ${s*20},-90 0,-30Z`,fill:W0},inner));
    el('circle',{cx:0,cy:-200,r:26,fill:WO},inner);wl(inner,0,-30,0,-174,WO);
    const labs=grp(S,0);el('path',{d:`M${cx+40},${cy-60}H1490V${cy-120}`,fill:'none',stroke:W0m,'stroke-width':2},labs);tx(labs,1490,cy-136,'꽃','v28','end');
    el('path',{d:`M${cx-50},${cy+40}H${cx-R-10}`,fill:'none',stroke:W0m,'stroke-width':2},labs);tx(labs,cx-R-20,cy+48,'잎','v28','end');
    tx(S,cx,700,'관측 · 겨울눈을 세로로 자른 모양','v22m','middle');
    return ()=>play(1400,e=>{scales.forEach((s,k)=>{const sg=k%2?1:-1;s.setAttribute('transform',`translate(${sg*e*(40+k*8)},${e*10}) rotate(${sg*e*18})`);s.setAttribute('opacity',1-e*.999);});inner.setAttribute('opacity',e);},()=>show(labs));}},
  {k:'겨울눈의 옷',h:'겨울눈은<br>옷을 입었다',b:'많은 겨울눈은 <em>비늘</em> 조각이 겹겹이 덮어서 안을 지켜. 어떤 나무 눈은 보송한 <em>털</em>로 덮여 있어.',steps:['비늘','털'],
   draw(S){wl(S,1072,130,1072,620,W0m);tx(S,660,180,'비늘','v60');tx(S,1110,180,'털','v60');
    const H=350,w=140;
    const mk=(cx)=>{const g=el('g',{transform:`translate(${cx},610)`},S);el('rect',{x:-9,y:0,width:18,height:40,fill:W0},g);
      el('path',{d:`M0,${-H}C${w*1.1},${-H*.55} ${w},${-H*.12} 0,0C${-w},${-H*.12} ${-w*1.1},${-H*.55} 0,${-H}Z`,fill:'none',stroke:W0,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},g);
      // 안쪽: 접힌 여린 잎 둘(선) — 옷을 입기 전 맨 속
      const inn=el('g',{},g);[-1,1].forEach(s=>el('path',{d:`M0,-24C${s*66},-92 ${s*58},-176 ${s*12},-218C${s*26},-158 ${s*16},-74 0,-24Z`,fill:'none',stroke:W0,'stroke-width':2},inn));wl(inn,0,-24,0,-150,W0m);g.inn=inn;return g;};
    const A=mk(870),B=mk(1290);
    // 비늘 조각: 바깥에서 날아와 겹쳐 붙음
    const SC=[];[[-1,.95],[1,.95],[-1,.75],[1,.75],[-1,.55],[1,.55],[-1,.35],[1,.35]].forEach(([s,k],i)=>{const e=el('path',{d:`M0,0C${s*w*1.05},${-H*.2} ${s*w*.75},${-H*k*.8} ${s*10},${-H*k}`,fill:i===0?WO:W0,stroke:BG,'stroke-width':2,opacity:0},A);SC.push({e,s,i});});
    // 털: 짧은 선 촘촘히
    const q=rnd(47),HR=[];for(let i=0;i<160;i++){const t=q(),yy=-H*t,half=(w*.95)*Math.sin(Math.PI*Math.min(1,.15+t*.85))*(t<.2?t/.2*.9+.1:1),xx=(q()*2-1)*half*.9;const a=(q()-.5)*1.4-Math.PI/2+(xx/w)*.9;
      HR.push({e:wl(B,xx,yy,xx,yy,W0),x:xx,y:yy,dx:Math.cos(a)*16,dy:Math.sin(a)*16});}
    const c0=tx(S,870,700,'여린 속','v28','middle');const c1=tx(S,1290,700,'여린 속','v28','middle');
    return i=>{if(i===0){play(1200,e=>SC.forEach(o=>{const s=cl(e*1.6-o.i/SC.length*.6),k=EO(s);o.e.setAttribute('opacity',s>0?1:0);o.e.setAttribute('transform',`translate(${o.s*(1-k)*160},${-(1-k)*60})`);}),()=>{c0.textContent='겹겹이 덮어';});}
     else play(1200,e=>{HR.forEach((h,k)=>{const s=cl(e*1.5-k/HR.length*.5);h.e.setAttribute('x2',h.x+h.dx*s);h.e.setAttribute('y2',h.y+h.dy*s);});B.inn.setAttribute('opacity',1-e);},()=>{c1.textContent='보송보송';});};}}],
 sum:{lines:['나무는 겨울 전에 잎을 떨궈<br>몸속 물을 아낀다.','가지 끝 겨울눈 속에는<br>봄에 펼칠 잎과 꽃이 있다.','겨울눈은 비늘이나 털로<br>안을 지킨다.'],
  words:[['겨울눈','겨울을 나는<br>나무의 작은 봉오리'],['비늘','겨울눈을 겹겹이<br>덮은 조각'],['낙엽','나무에서<br>떨어진 잎']]},
 end:{q:'봄이 오면 겨울눈은 어떻게 될까?',a:'눈이 열리면서 속에 접혀 있던 잎과 꽃이 나와.',h:'어른과 산책할 때<br>나뭇가지 끝에서<br>겨울눈을 찾아 봐.',btn:'봄이 되면',
  draw(S){const GY=660;wl(S,640,GY,1504,GY,W0m);
   twig(S,[[1080,GY],[1080,420]],16);twig(S,[[1080,540],[1240,430]],10);twig(S,[[1080,600],[900,520]],10);
   const P=[[1080,416,90],[1244,426,56],[896,516,56]];const T=P.map(([x,y,h],k)=>{const g=el('g',{transform:`translate(${x},${y})`},S);const b=bud(g,0,0,h);
     const lv=el('g',{opacity:0},g);el('path',{d:leafD(h*2),fill:W0,transform:'rotate(-120)'},lv);el('path',{d:leafD(h*2),fill:W0,transform:'rotate(-60)'},lv);if(k===0){el('circle',{cx:0,cy:-h*1.6,r:h*.28,fill:WO},lv);wl(lv,0,0,0,-h*1.3,WO);}
     return {b,lv,h};});
   const m0=tx(S,640,180,'12월','v28');const mon=tx(S,640,240,'겨울눈','v60');tx(S,640,700,'관측 · 같은 가지','v22m');
   return ()=>play(1600,e=>T.forEach(t=>{t.b.g.setAttribute('opacity',1-e);t.lv.setAttribute('opacity',e);t.lv.setAttribute('transform',`scale(${.3+.7*EO(e)})`);}),()=>{mon.textContent='잎과 꽃';m0.textContent='봄';});}}};
})();

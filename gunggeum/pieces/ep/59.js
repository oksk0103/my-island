(()=>{ /* 59. 눈 깜빡임 — v2. 사람 얼굴 없이 눈 하나(앞에서 본 도식)만. */
// 눈 도식: 아몬드 모양 테두리 + 검은자(크림 선) + 눈동자(크림 면) + 윗눈꺼풀(보조색 면, 크림 가장자리 선).
// t=0 뜬 눈, t=1 감은 눈. edgeY(x,t) = 그 순간 윗눈꺼풀 가장자리 높이.
let uid=0;
function eye(p,cx,cy,w,h,o={}){const x0=cx-w,x1=cx+w,g=el('g',{},p),id='e59'+(uid++);
 const ctrl=t=>cy-2*h+4*h*t,curve=t=>`M${x0},${cy}Q${cx},${ctrl(t)} ${x1},${cy}`;
 el('path',{d:`${curve(0)}Q${cx},${cy+2*h} ${x0},${cy}Z`},el('clipPath',{id},g));
 const inner=el('g',{'clip-path':`url(#${id})`},g);
 const ir=h*.82;el('circle',{cx,cy,r:ir,fill:'none',stroke:W0,'stroke-width':2},inner);
 el('circle',{cx,cy,r:ir*.42,fill:W0},inner);
 const layer=el('g',{},inner);                        // 눈물·먼지 자리(눈꺼풀 밑)
 const lid=el('path',{fill:WA},inner);
 el('path',{d:`${curve(0)}Q${cx},${cy+2*h} ${x0},${cy}Z`,fill:'none',stroke:W0,'stroke-width':2},g);
 const edge=el('path',{fill:'none',stroke:W0,'stroke-width':2,'stroke-linecap':'round'},g);
 const lash=el('g',{stroke:W0,'stroke-width':2,'stroke-linecap':'round'},g);const LS=o.lash===false?[]:[.2,.32,.44,.56,.68,.8].map(s=>el('line',{},lash));
 const edgeY=(x,t)=>{const s=(x-x0)/(2*w);return cy+2*s*(1-s)*(ctrl(t)-cy);};
 const set=t=>{lid.setAttribute('d',`${curve(t)}L${x1},${cy-h*2.2}L${x0},${cy-h*2.2}Z`);edge.setAttribute('d',curve(t));
  LS.forEach((l,i)=>{const s=[.2,.32,.44,.56,.68,.8][i],x=x0+s*2*w,y=edgeY(x,t),dx=(s-.5)*.9,L=h*.16;l.setAttribute('x1',x);l.setAttribute('y1',y);l.setAttribute('x2',x+dx*L);l.setAttribute('y2',y-L*(t<.5?1:-1)*Math.max(.2,Math.abs(1-2*t)));});};
 set(0);return {g,layer,set,edgeY,x0,x1,cx,cy,w,h};}
const tri=x=>x<.5?x*2:2-x*2,sm=x=>x*x*(3-2*x);
// 한 번 깜빡: 감기(앞 45%) → 뜨기
const blink=(E,ms,fn,end)=>anim(ms,x=>{const t=sm(x<.45?x/.45:Math.max(0,1-(x-.45)/.55));E.set(t);if(fn)fn(t,x);},end);
const lead=(p,pts,lab,cls='v22',anc='start')=>{el('path',{d:'M'+pts.map(q=>q.join(',')).join('L'),fill:'none',stroke:W0m,'stroke-width':2},p);const [lx,ly]=pts[pts.length-1];return tx(p,lx+(anc==='end'?-10:anc==='middle'?0:10),ly+8,lab,cls,anc);};

EPX[59]={day:'12월 14일',topic:'눈 깜빡임',cat:'우리 몸',field:'과학',frame:'v2',
 cover:{h:'눈은 왜<br>깜빡일까?',draw(S){
   const E=eye(S,1040,430,330,150);
   lead(S,[[900,305],[860,226],[840,226]],'눈꺼풀','v22','end');
   // 1분 깜빡 횟수(큰 숫자) — 오른쪽 위
   tx(S,1504,190,'15','v96','end');tx(S,1504,236,'1분에 깜빡이는 횟수','v22m','end');
   // 아래: 60초 눈금, 4초마다 한 번(산호 점 = 지금)
   const RY=650;wl(S,700,RY,1380,RY,W0m);for(let i=0;i<=15;i++){const x=700+i*680/15;wl(S,x,RY,x,RY+(i%5===0?18:10),i%5===0?W0:W0m);}
   tx(S,700,RY+48,'0초','v22m');tx(S,1380,RY+48,'60초','v22m','end');tx(S,1504,RY+8,'어른 · 보통','v22m','end');
   const now=wdot(S,700,RY,8,WO);
   let on=false;return ()=>{if(calm()){E.set(0);return;}if(on)return;on=true;let last=-1;
    loop(S,t=>{const c=t%60;now.setAttribute('cx',700+c/60*680);const k=Math.floor(c/4);const ph=c-k*4;
     E.set(ph<.36?sm(tri(ph/.36)):0);if(k!==last)last=k;});};}},
 scenes:[
  {k:'눈물 이불',h:'깜빡이면 눈물이<br>눈을 덮는다',b:'눈을 한 번 감았다 뜨면 <em>눈물</em>이 눈 앞을 얇게 덮어. 그래서 눈이 마르지 않고 촉촉해.',steps:['깜빡'],
   draw(S){const E=eye(S,1060,400,360,170);
    lead(S,[[1250,282],[1330,190],[1380,190]],'눈꺼풀');
    const lab=grp(S,0);lead(lab,[[1360,470],[1420,560],[1440,560]],'눈물','v28');
    // 눈물 점: 처음엔 눈꺼풀 가장자리에 줄지어 있다가, 눈꺼풀을 따라 내려가며 제자리에 깔림
    const q=rnd(59),T=[];let g=0;while(T.length<170&&g++<5000){const x=E.x0+20+q()*(2*E.w-40),y=E.cy-E.h+q()*2*E.h;const top=E.edgeY(x,0)+6,bot=2*E.cy-E.edgeY(x,0)-6;if(y>top&&y<bot)T.push([x,y]);}
    const D=T.map(([x,y])=>({c:wdot(E.layer,x,E.edgeY(x,0)+4,3.2,WO),x,ty:y}));
    // 아래: 눈물 막 두께 눈금(없음 → 덮임)
    tx(S,700,690,'마른 눈','v22m');tx(S,1420,690,'촉촉한 눈','v22m','end');const bar=el('line',{x1:820,y1:682,x2:820,y2:682,stroke:W0,'stroke-width':2},S);wl(S,820,682,1290,682,W0m,{'stroke-dasharray':'2 8'});
    return ()=>{let low=0;blink(E,1500,(t,x)=>{D.forEach(d=>{const ey=E.edgeY(d.x,t)+4;if(x<.45)d.c.setAttribute('cy',Math.min(ey,d.ty));});bar.setAttribute('x2',820+470*Math.min(1,x*1.2));},()=>{show(lab);});};}},
  {k:'와이퍼',h:'눈꺼풀이<br>먼지를 쓸어 낸다',b:'눈에 작은 <em>먼지</em>가 들어와도 깜빡일 때 눈꺼풀이 자동차 와이퍼처럼 쓸어 내.',steps:['깜빡'],
   draw(S){const E=eye(S,1060,400,360,170);
    lead(S,[[1250,282],[1330,190],[1380,190]],'눈꺼풀');
    const DU=[[940,360],[1010,470],[1130,330],[1180,450],[1270,390],[880,440],[1060,520]];
    const D=DU.map(([x,y])=>({c:el('rect',{x:x-6,y:y-6,width:12,height:12,fill:WO,transform:`rotate(${(x*7)%40} ${x} ${y})`},E.layer),x,y}));
    const pre=grp(S,1);lead(pre,[[1270,390],[1420,500],[1440,500]],'먼지','v28');
    // 쓸려 간 먼지가 모이는 곳: 왼쪽 눈 구석
    const post=grp(S,0);lead(post,[[E.x0+30,E.cy+14],[E.x0+30,600],[E.x0+60,600]],'쓸려 나간 먼지','v28');
    // 아래: 쓸어 내린 길(위 → 아래)
    tx(S,1060,680,'깜빡 한 번에 위에서 아래로 한 번 쓸어','v22m','middle');
    return ()=>{pre.setAttribute('opacity',0);const st=D.map(d=>[d.x,d.y]);
     blink(E,1300,(t,x)=>{D.forEach((d,k)=>{const ey=E.edgeY(d.x,t);if(x<.45){if(ey>d.y-6){d.y=Math.min(ey,2*E.cy-E.edgeY(d.x,0)-8);}}
       else{const s=Math.min(1,(x-.45)/.4),e=EO(s),tx_=E.x0+34+(k%3)*8,ty=E.cy+4+Math.floor(k/3)*8;if(!d.sx){d.sx=d.x;d.sy=d.y;}d.x=d.sx+(tx_-d.sx)*e;d.y=d.sy+(ty-d.sy)*e;}
       d.c.setAttribute('transform',`translate(${d.x-st[k][0]},${d.y-st[k][1]}) rotate(${(st[k][0]*7)%40} ${st[k][0]} ${st[k][1]})`);});},()=>show(post));};}},
  {k:'몇 번?',h:'1분에<br>15번쯤 깜빡인다',b:'어른은 보통 <em>1분에 15번</em>쯤 깜빡여. 한 시간이면 900번이야. 너무 빨라서 깜빡이는 줄도 몰라.',steps:['1분 재기','한 시간이면'],
   draw(S){const X0=700,X1=1440,Y=520,px=s=>X0+s/60*(X1-X0);
    wl(S,X0,Y,X1,Y,W0);for(let s=0;s<=60;s+=2){const big=s%10===0;wl(S,px(s),Y,px(s),Y+(big?20:10),big?W0:W0m);if(big)tx(S,px(s),Y+56,s+'초','v22m','middle');}
    // 깜빡일 때마다 눈금 위에 자국(크림 막대)
    const M=[...Array(15)].map((_,k)=>el('line',{x1:px(2+k*4),x2:px(2+k*4),y1:Y-6,y2:Y-6,stroke:W0,'stroke-width':2,'stroke-linecap':'round'},S));
    const E=eye(S,880,300,170,78,{lash:false});
    const n=tx(S,1440,330,'0','v96','end');tx(S,1440,376,'번 깜빡','v22m','end');
    const head=wdot(S,X0,Y,8,W0m);
    const hr=grp(S,0);wl(hr,700,640,1440,640,W0m);tx(hr,700,690,'한 시간 = 1분 × 60','v22m');tx(hr,1440,690,'900번','v60','end');
    return i=>{if(i===0){M.forEach(m=>m.setAttribute('y1',Y-6));n.textContent='0';
      anim(1400,x=>{const s=x*60;head.setAttribute('cx',px(s));let c=0;M.forEach((m,k)=>{const at=2+k*4;if(s>=at){c++;m.setAttribute('y1',Y-90);}});n.textContent=String(c);
       const ph=(s-2)%4;E.set(s>=2&&ph<.6?sm(tri(ph/.6)):0);},()=>{n.textContent='15';n.style.fill=WO;E.set(0);});}
     else{show(hr);}};}}],
 sum:{lines:['깜빡이면 눈물이<br>눈 앞을 덮어 촉촉해진다.','눈꺼풀은 먼지를<br>쓸어 내는 와이퍼다.','어른은 1분에<br>15번쯤 깜빡인다.'],
  words:[['눈꺼풀','눈을 덮었다 열었다 하는 살갗'],['눈물','눈을 적시고 씻어 주는 물'],['깜빡이다','눈을 짧게 감았다 뜨다']]},
 end:{q:'눈을 오래 안 깜빡이면 어떻게 될까?',a:'눈물이 말라서 눈이 따갑고 뻑뻑해져.',h:'가족이 1분 동안<br>몇 번 깜빡이는지<br>세어 봐.',btn:'세어 보기',
  draw(S){const cx=1000,cy=400,R=230;
   el('circle',{cx,cy,r:R,fill:'none',stroke:W0,'stroke-width':2},S);
   for(let s=0;s<60;s++){const a=(s/60)*Math.PI*2-Math.PI/2,big=s%5===0,r2=R-(big?22:11);wl(S,cx+Math.cos(a)*R,cy+Math.sin(a)*R,cx+Math.cos(a)*r2,cy+Math.sin(a)*r2,big?W0:W0m);}
   tx(S,cx,cy-R-20,'60초','v22m','middle');tx(S,cx,cy+96,'1분','v28','middle');
   const hand=el('line',{x1:cx,y1:cy,x2:cx,y2:cy-R+40,stroke:W0,'stroke-width':2,'stroke-linecap':'round'},S);wdot(S,cx,cy,7,W0);
   // 오른쪽: 바를 정(正)이 아니라 다섯 개씩 묶은 막대 자국
   const TX=1300,TY=230,ticks=[];for(let k=0;k<15;k++){const gI=Math.floor(k/5),j=k%5,y=TY+gI*130;
     const l=j<4?el('line',{x1:TX+j*28,y1:y,x2:TX+j*28,y2:y+80,stroke:W0,'stroke-width':2,'stroke-linecap':'round',opacity:0},S):el('line',{x1:TX-14,y1:y+66,x2:TX+98,y2:y+14,stroke:W0,'stroke-width':2,'stroke-linecap':'round',opacity:0},S);ticks.push(l);}
   wl(S,TX-20,TY-40,1504,TY-40,W0m);tx(S,TX-20,TY-60,'깜빡 자국','v22m');
   const n=tx(S,1504,640,'?','v60','end');tx(S,TX-20,640,'모두','v22m');
   return ()=>anim(1300,x=>{const a=x*Math.PI*2-Math.PI/2;hand.setAttribute('x2',cx+Math.cos(a)*(R-40));hand.setAttribute('y2',cy+Math.sin(a)*(R-40));const c=Math.min(15,Math.floor(x*15+.02));ticks.forEach((t,k)=>t.setAttribute('opacity',k<c?1:0));n.textContent=c+'번';},
    ()=>{ticks.forEach(t=>t.setAttribute('opacity',1));n.textContent='15번쯤';n.style.fill=WO;});}}};
})();

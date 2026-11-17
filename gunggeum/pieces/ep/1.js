(()=>{
/* 이야기 v2 공용(이 편 안에서만): 크림 W0 · 앰버 SA(화면당 한 곳) · 보조 SB */
const SA='#E9B872',SB='#2C4A80',CM='rgba(243,233,210,.45)';
const lerp=(a,b,t)=>a+(b-a)*t;
// 글자를 (x0,y0)→(x1,y1)로 옮김
const glide=(n,x0,y0,x1,y1,D,end)=>{if(calm()){n.setAttribute('x',x1);n.setAttribute('y',y1);if(end)end();return;}play(D,e=>{n.setAttribute('x',lerp(x0,x1,e).toFixed(1));n.setAttribute('y',lerp(y0,y1,e).toFixed(1));},end);};
const fadeIn=(g,D=500)=>{if(calm()){g.setAttribute('opacity',1);return;}g.style.transition='none';play(D,e=>g.setAttribute('opacity',e.toFixed(3)));};
const fadeOut=(g,D=400)=>{if(calm()){g.setAttribute('opacity',0);return;}g.style.transition='none';play(D,e=>g.setAttribute('opacity',(1-e).toFixed(3)));};
// 선 그리기(길이만큼 자라남)
const drawLine=(n,D=600,end)=>{const L=n.getTotalLength?n.getTotalLength():400;n.style.strokeDasharray=L;n.style.strokeDashoffset=calm()?0:L;if(calm()){if(end)end();return;}play(D,e=>n.style.strokeDashoffset=(L*(1-e)).toFixed(1),end);};
const hidLine=n=>{const L=n.getTotalLength?n.getTotalLength():400;n.style.strokeDasharray=L;n.style.strokeDashoffset=L;};
// 글자 폭 어림(한글 1em, 기호·숫자 .6em)
const tw=(s,size)=>[...s].reduce((a,c)=>a+(/[가-힣ㄱ-ㅎㅏ-ㅣ一-龥]/.test(c)?size*.98:c===' '?size*.3:size*.6),0);
// 1. 음력과 윤달 — 달 모양 · 날 띠 · 설날 날짜 띠
const MSYN=29.530588853;
// 달: 어두운 면 SB, 밝은 면 크림, 테두리 크림(원 온전히)
function lmoon(p,cx,cy,r,day){const g=el('g',{transform:`translate(${cx},${cy})`},p);el('circle',{r,fill:SB},g);const lit=el('path',{fill:W0},g);el('circle',{r,fill:'none',stroke:W0,'stroke-width':2},g);
 const set=d=>{lit.setAttribute('d',d<1.3||d>29.7?'':moonPath((d-1+.5)/MSYN,r));};set(day);return {g,set};}
EPX[1]={day:'1일차',topic:'음력과 윤달',cat:'국어 상식',field:'국어',frame:'v2',
 cover:{h:'설날은 왜<br>해마다 날짜가<br>바뀔까?',draw(S){
   const M=lmoon(S,1160,330,170,15);
   // 음력 날 띠 1~30
   const X0=720,X1=1480,Y=600,dx=(X1-X0)/29;wl(S,X0,Y,X1,Y,CM);
   for(let d=1;d<=30;d++){const x=X0+(d-1)*dx,big=d===1||d===15||d===30;wl(S,x,Y,x,Y+(big?18:9),big?W0:CM);if(big)tx(S,x,Y+50,d+'일','v22m','middle');}
   const mk=wdot(S,X0+14*dx,Y,9,SA);const lab=tx(S,1160,560,'음력 15일','v28','middle');
   tx(S,720,140,'달 모양','v22m');tx(S,1480,140,'음력 날짜','v22m','end');
   let on=false;return ()=>{if(on||calm())return;on=true;loop(S,t=>{const c=(t%8)/8,d=1+c*29;M.set(d);mk.setAttribute('cx',(X0+(d-1)*dx).toFixed(1));lab.textContent=`음력 ${Math.floor(d)}일`;});};}},
 scenes:[
  {k:'하늘이 달력',h:'옛날엔 달 모양이<br>달력이었다',b:'달은 날마다 모양이 바뀌어. 다시 같은 모양이 되기까지 <em>29.5일쯤</em> 걸려. 그래서 달 한 바퀴를 한 달로 셌어.',steps:['한 달 돌려 보기'],
   draw(S){const D=[1,4,8,15,22,27],X0=720,X1=1440,Y=340;
    D.forEach((d,i)=>{const x=X0+i*(X1-X0)/5;lmoon(S,x,Y,60,d);tx(S,x,Y+110,d+'일','v28','middle');});
    // 날 띠
    const RX0=720,RX1=1440,RY=560,dx=(RX1-RX0)/29.5;wl(S,RX0,RY,RX1,RY,CM);for(let d=0;d<=29;d++){const x=RX0+d*dx,big=d%5===0;wl(S,x,RY,x,RY+(big?16:8),big?W0:CM);}
    tx(S,RX0,RY+52,'1일','v22m');tx(S,RX1,RY+52,'다시 1일','v22m','end');
    const arc=el('path',{d:`M${RX0},${RY-30}Q${(RX0+RX1)/2},${RY-110} ${RX1},${RY-30}`,fill:'none',stroke:SA,'stroke-width':2},S);hidLine(arc);
    const dot=wdot(S,RX0,RY,9,SA);dot.setAttribute('opacity',0);
    const big=tx(S,1440,200,'?','v96','end');tx(S,720,200,'다시 같은 모양까지','v28');
    return ()=>{dot.setAttribute('opacity',1);drawLine(arc,1400);if(calm()){dot.setAttribute('cx',RX1);big.textContent='29.5일';return;}
     play(1400,e=>{dot.setAttribute('cx',(RX0+e*(RX1-RX0)).toFixed(1));big.textContent=(e*29.5).toFixed(e<1?0:1)+'일';},()=>big.textContent='29.5일');};}},
  {k:'양력과 음력',h:'달로 한 해를 세면<br>11일이 모자라',b:'계절이 한 바퀴 도는 데 <em>365일</em>. 달 모양이 12번 바뀌면 <em>354일</em>. 해마다 11일쯤 차이가 나.',steps:['달 12번 채우기'],
   draw(S){const X0=700,X1=1480,PX=(X1-X0)/365;
    tx(S,X0,240,'양력 한 해','v28');tx(S,X1,246,'365일','v60','end');el('rect',{x:X0,y:270,width:X1-X0,height:64,fill:W0},S);
    tx(S,X0,450,'음력 한 해','v28');const tot=tx(S,X1,456,'0일','v60','end');
    el('rect',{x:X0+1,y:481,width:X1-X0-2,height:62,fill:'none',stroke:CM,'stroke-width':2},S);
    // 날 눈금(한 달마다)
    const segs=[];for(let i=0;i<12;i++){const x=X0+i*29.5*PX,w=29.5*PX-6;const g=grp(S,0);el('rect',{x:x+3,y:484,width:w,height:56,fill:W0},g);tx(g,x+3+w/2,524,String(i+1),'v28','middle',{style:'fill:#0C1630'});segs.push({g,x});}
    for(let i=0;i<=12;i++){const x=X0+Math.min(i*29.5,365)*PX;wl(S,x,570,x,586,CM);}
    const gap=grp(S,0),gx=X0+354*PX;el('rect',{x:gx+2,y:481,width:X1-gx-3,height:62,fill:SA},gap);el('path',{d:`M${gx+16},600V650H${X1-260}`,fill:'none',stroke:SA,'stroke-width':2},gap);tx(gap,X1-270,660,'11일 모자라','v28','end',{style:`fill:${SA}`});
    tx(S,X0,660,'달 모양 12번','v22m');
    return ()=>{let i=0;const n=()=>{if(i<12){const s=segs[i];s.g.setAttribute('opacity',1);if(!calm()){s.g.setAttribute('transform','translate(-60,0)');play(260,e=>s.g.setAttribute('transform',`translate(${(-60*(1-e)).toFixed(1)},0)`));}i++;tot.textContent=(i===12?354:Math.round(i*29.5))+'일';calm()?n():setTimeout(n,90);}else{show(gap);}};n();};}},
  {k:'윤달',h:'모자란 날이 쌓이면<br>한 달을 끼워 넣는다',b:'설날은 해마다 <em>11일쯤</em> 빨라져. 그래서 두세 해에 한 번 <em>윤달</em>을 넣어. 그다음 해 설날은 다시 늦어져.',steps:['2025년','2026년','2027년'],
   draw(S){const SEOL=[[2024,41,'2월 10일'],[2025,29,'1월 29일'],[2026,48,'2월 17일'],[2027,38,'2월 7일']],NOTE=['','12일 빨라짐','19일 늦어짐','10일 빨라짐'];
    const A0=25,A1=51,X0=820,X1=1480,dx=d=>X0+(d-A0)*(X1-X0)/(A1-A0),RY=i=>250+i*110;
    wl(S,X0,150,X1,150,W0);for(let d=A0;d<=A1;d++){const big=d===A0||d===32||d===A1;wl(S,dx(d),150,dx(d),150-(big?18:9),big?W0:CM);}
    tx(S,dx(25),122-8,'1월 25일','v22m','middle');tx(S,dx(32),122-8,'2월 1일','v22m','middle');tx(S,dx(51),122-8,'2월 20일','v22m','middle');
    const rows=SEOL.map(([y,d,lb],i)=>{const cy=RY(i);tx(S,680,cy+10,String(y),'v28');wl(S,X0,cy,X1,cy,CM,{'stroke-dasharray':'2 10'});
     const g=grp(S,i?0:1);const dot=wdot(g,dx(d),cy,12,W0);const lab=tx(g,dx(d),cy-26,lb,'v28','middle');const note=tx(g,X1,cy+44,NOTE[i],'v22m','end');return {g,dot,lab,x:dx(d),cy};});
    // 2025년 윤6월(앰버, 한 곳)
    const leap=grp(S,0);tx(leap,680,RY(1)+44,'윤6월 넣음','v22',undefined,{style:`fill:${SA}`});
    return i=>{const a=rows[i],b=rows[i+1];const m=wdot(S,a.x,a.cy,12,CM);b.g.setAttribute('opacity',1);b.dot.setAttribute('opacity',0);b.lab.setAttribute('opacity',0);
     const ln=wl(S,a.x,a.cy,b.x,b.cy,CM);hidLine(ln);drawLine(ln,900);
     const go=()=>{if(calm()){m.setAttribute('cx',b.x);m.setAttribute('cy',b.cy);fin();return;}play(900,e=>{m.setAttribute('cx',lerp(a.x,b.x,e).toFixed(1));m.setAttribute('cy',lerp(a.cy,b.cy,e).toFixed(1));},fin);};
     const fin=()=>{m.remove();b.dot.setAttribute('opacity',1);b.lab.setAttribute('opacity',1);if(i===0)fadeIn(leap);};go();};}}],
 sum:{lines:['양력은 해, 음력은 달을<br>기준으로 날을 센다.','음력 한 해는 11일쯤 짧아서<br>가끔 윤달을 넣는다.','그래서 설날 날짜가<br>해마다 달라진다.'],
  words:[['음력','달 모양이 바뀌는 것으로<br>날을 세는 달력'],['양력','지구가 해를 한 바퀴<br>도는 것으로 세는 달력'],['윤달','계절과 맞추려고<br>끼워 넣는 한 달']]},
 end:{q:'달 모양이 다시 같아지려면 며칠쯤 걸릴까?',a:'29.5일쯤. 그래서 음력 한 달을 달 모양 한 바퀴로 셌어.',h:'오늘 밤 창밖으로<br>달 모양을 봐.',btn:'오늘 달 보기',
  draw(S){// 오늘 달 모양은 평균 주기로 어림한 것이라 날짜(음력 며칠)는 보여 주지 않는다
   const age=((Date.now()-Date.UTC(2000,0,6,18,14))/864e5)%MSYN,today=Math.floor(age)+1;
   const cx=1100,cy=420,R=230;const ring=el('circle',{cx,cy,r:R,fill:'none',stroke:CM,'stroke-width':2,'stroke-dasharray':'4 10'},S);
   const q=tx(S,cx,cy+34,'?','v96','middle');const M=lmoon(S,cx,cy,R,today);M.g.setAttribute('opacity',0);
   wl(S,700,140,1500,140,CM);const lab=tx(S,700,120,'오늘 밤 달','v28');const lab2=tx(S,1500,120,'','v22m','end');
   return ()=>{q.remove();ring.remove();fadeIn(M.g,600);lab2.textContent='이런 모양쯤 · 창밖 달과 견줘 봐';};}}};
})();

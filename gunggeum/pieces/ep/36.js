(()=>{ /* 36. 절기 이름 대설·동지 — 새 틀(v2) 이야기 */
const C='#F3E9D2',CM='rgba(243,233,210,.45)',AM='#E9B872',AX='#2C4A80';
const go=(D,fn,end)=>{if(calm()){fn(1,1);if(end)end();}else play(D,fn,end);};
const ink=(t,c)=>{t.style.fill=c;return t;};
const lerp=(a,b,e)=>a+(b-a)*e;
// 12월 날짜 띠: 1~31일. 반환 dx(날)
function decBand(S,x1,x2,y,lab=true){const dx=d=>x1+(x2-x1)*(d-1)/30;wl(S,x1,y,x2,y,C);
 for(let d=1;d<=31;d++){const big=d===1||d%5===0;wl(S,dx(d),y,dx(d),y+(big?16:8),big?C:CM);if(lab&&big)tx(S,dx(d),y+48,String(d),'v22m','middle');}
 if(lab)tx(S,x2+16,y+48,'일','v22m');return dx;}
// 눈 점(크림) 떨어뜨리기
function snowDots(S,seed,n,x1,x2,y1,y2){const q=rnd(seed);return [...Array(n)].map(()=>{const x=x1+q()*(x2-x1),y=y1+q()*(y2-y1);return {x,y,d:q()*.5,c:wdot(S,x,y1-40,0,C)};});}

EPX[36]={day:'12월 15일',topic:'대설과 동지',cat:'절기',field:'국어',frame:'v2',
 cover:{h:'절기 이름엔<br>무슨 뜻이<br>있을까?',draw(S){
   tx(S,648,150,'2026년 12월','v22m');
   const dx=decBand(S,680,1480,520);const a=dx(7),b=dx(22);
   tx(S,a,330,'大雪','vs96','middle');tx(S,b,330,'冬至','vs96','middle');
   tx(S,a,390,'대설 · 12월 7일','v28','middle');tx(S,b,390,'동지 · 12월 22일','v28','middle');
   wl(S,a,412,a,510,CM);wl(S,b,412,b,510,CM);
   el('path',{d:`M${a},620Q${(a+b)/2},680 ${b},620`,fill:'none',stroke:AX,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},S);
   tx(S,(a+b)/2,640,'15일','v28','middle');
   const dot=wdot(S,a,520,10,AM);
   let on=false;return ()=>{if(on||calm()){dot.setAttribute('cx',b);return;}on=true;loop(S,t=>{const c=t%5,e=c<2.4?EO(c/2.4):1;dot.setAttribute('cx',lerp(a,b,e).toFixed(1));dot.setAttribute('opacity',c>4.5?1-(c-4.5)/.5:1);});};}},
 scenes:[
  {k:'24절기',h:'절기는 해를 보고<br>나눈 날이다',b:'해의 움직임에 따라 한 해를 <em>24칸</em>으로 나눈 게 <em>절기</em>야. 칸과 칸 사이는 <em>15일</em>쯤이야.',steps:['한 바퀴 돌기'],
   draw(S){const cx=1110,cy=420,R=232,pt=(a,r)=>[cx+r*Math.sin(a*Math.PI/180),cy-r*Math.cos(a*Math.PI/180)];
    el('circle',{cx,cy,r:R,fill:'none',stroke:CM,'stroke-width':2},S);
    const T=[...Array(24)].map((_,i)=>{const a=i*15,[x1,y1]=pt(a,R-14),[x2,y2]=pt(a,R+14);return wl(S,x1,y1,x2,y2,CM,{'stroke-width':i%6===0?4:2});});
    [['겨울',0],['봄',90],['여름',180],['가을',270]].forEach(([s,a])=>{const [x,y]=pt(a,R-80);tx(S,x,y+10,s,'v28','middle');});
    // 겨울 세 절기 이름표 (동지 = 맨 위)
    [['동지',0],['대설',-15],['소설',-30]].forEach(([s,a])=>{const [x,y]=pt(a,R+46);tx(S,x,y+8,s,'v22','middle');});
    const n=tx(S,cx,cy+30,'24','v96','middle'),u=tx(S,cx+60,cy+30,'칸','v28');u.setAttribute('x',cx+64);
    tx(S,648,690,'칸 사이 15일쯤 · 24칸이면 한 해','v22m');
    const [sx,sy]=pt(0,R);const sun=wdot(S,sx,sy,12,AM);
    return ()=>{T.forEach(t=>t.setAttribute('stroke',CM));go(2000,e=>{const a=e*360;const [x,y]=pt(a,R);sun.setAttribute('cx',x.toFixed(1));sun.setAttribute('cy',y.toFixed(1));
      const k=Math.min(24,Math.floor(a/15+1e-6)+1);T.forEach((t,i)=>{if(i<k)t.setAttribute('stroke',C);});n.textContent=String(k);},()=>{n.textContent='24';});};}},
  {k:'대설',h:'대설은 눈이 많이<br>온다는 뜻이다',b:'<em>大雪(대설)</em>은 큰 눈이라는 뜻이야. 첫눈이 온다는 <em>소설</em> 다음 절기야. 올해 대설은 12월 7일이야.',steps:['소설','대설'],
   draw(S){wl(S,1072,120,1072,660,CM);wl(S,648,660,1504,660,C);
    tx(S,860,230,'소설','vs96','middle');tx(S,860,290,'11월 22일 · 첫눈','v28','middle');
    tx(S,1288,230,'大雪','vs96','middle');tx(S,1288,290,'대설 · 12월 7일 · 큰 눈','v28','middle');
    tx(S,648,700,'15일 뒤','v22m');el('path',{d:'M760,690H1380M1364,676L1380,690L1364,704',fill:'none',stroke:CM,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'},S);
    for(let y=350;y<=630;y+=28)for(let x=690;x<=1490;x+=28)if(Math.abs(x-1072)>20)wdot(S,x,y,2.5,AX);
    const A=snowDots(S,3,14,680,1040,340,640),B=snowDots(S,8,150,1104,1490,340,640);const lab=grp(S,0);const big=tx(lab,1288,230,'大','vs96','middle');big.setAttribute('x',1240);ink(big,AM);
    const fall=(L,end)=>go(1600,e=>L.forEach(p=>{const k=Math.max(0,Math.min(1,(e-p.d)/.5));p.c.setAttribute('cy',lerp(p.y-120,p.y,EO(k)).toFixed(1));p.c.setAttribute('r',k>0?4:0);}),end);
    return i=>i===0?fall(A):fall(B,()=>show(lab));}},
  {k:'동지',h:'동지는 밤이<br>가장 긴 날이다',b:'<em>冬至(동지)</em>는 겨울에 이르렀다는 뜻이야. 밤이 가장 긴 이날을 옛사람들은 <em>작은설</em>이라고도 했어.',steps:['한자 풀기','다른 이름'],
   draw(S){const H=[[780,'冬','겨울 동'],[1000,'至','이를 지']],L=[];
    H.forEach(([x,h,m])=>{tx(S,x,300,h,'vs160','middle');wl(S,x,330,x,372,CM);const q=tx(S,x,420,'?','v28','middle');ink(q,CM);L.push({q,m});});
    const mean=grp(S,0);tx(mean,890,500,'겨울에 이르다','v60','middle');
    wl(S,1150,120,1150,660,CM);
    tx(S,1330,190,'다른 이름','v22m','middle');const q2=tx(S,1330,340,'?','vs96','middle');ink(q2,CM);
    const other=grp(S,0);const sm=tx(other,1330,340,'작은설','vs96','middle');sm.style.fontSize='72px';ink(sm,AM);tx(other,1330,400,'설 다음 큰 명절','v28','middle');tx(other,1330,440,'팥죽을 쑤어 먹는 날','v22m','middle');
    wl(S,648,620,1504,620,CM);tx(S,648,670,'올해 동지 · 12월 22일 · 한 해 중 밤이 가장 긴 날','v22m');
    const fl=tx(S,890,500,'동지','v60','middle');fl.setAttribute('opacity',0);
    return i=>{if(i===0){L.forEach(l=>{l.q.textContent=l.m;});show(mean);}
     else{fl.setAttribute('opacity',1);go(1200,e=>{fl.setAttribute('x',lerp(890,1330,e).toFixed(1));fl.setAttribute('y',(lerp(500,340,e)-Math.sin(e*Math.PI)*60).toFixed(1));fl.setAttribute('opacity',e>.85?0:1);},()=>{q2.remove();show(other);});}};}}],
 sum:{lines:['절기는 해의 움직임에 따라<br>한 해를 24칸으로 나눈 날이다.','대설은 눈이 많이 온다는 뜻.<br>올해는 12월 7일.','동지는 밤이 가장 긴 날.<br>올해는 12월 22일.'],
  words:[['절기','해에 맞춰 한 해를<br>24칸으로 나눈 때'],['소설','첫눈이 온다는 절기.<br>올해는 11월 22일'],['작은설','동지를 달리<br>부르던 말']]},
 end:{q:'올해 동지는 12월 며칠일까?',a:'12월 22일. 대설에서 15일 뒤, 밤이 가장 긴 날이야.',h:'동지 저녁에<br>창밖 하늘을 봐.',btn:'달력 보기',
  draw(S){tx(S,700,180,'2026년 12월','v22m');const dx=decBand(S,700,1460,420);
   const a=dx(7),b=dx(22);tx(S,a,330,'대설','v28','middle');wdot(S,a,420,8,C);
   const q=tx(S,b,330,'?','vs96','middle');ink(q,CM);
   wl(S,700,560,1480,560,CM);
   const g=grp(S,0);tx(g,b,330,'冬至','vs96','middle');wdot(g,b,420,12,AM);
   el('path',{d:`M${a},470Q${(a+b)/2},540 ${b},470`,fill:'none',stroke:AX,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},g);
   tx(g,b,620,'12월 22일','v60','middle');
   return ()=>{q.remove();show(g);};}}};
})();

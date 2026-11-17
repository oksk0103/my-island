(()=>{ // 51. 겨울 철새는 왜 우리나라에 올까 — 두루미·기러기, v2 관측 노트
// 북쪽 번식지 ↔ 우리나라를 잇는 도식 지도. 실루엣은 화면당 하나(나는 두루미).
const N=[960,200],K=[1110,540],ROUTE=`M${N[0]},${N[1]}C1260,260 1280,440 ${K[0]},${K[1]}`;
function grid(S){const g=el('g',{stroke:W0m,'stroke-width':2,'stroke-dasharray':'2 14','stroke-linecap':'round'},S);for(let y=140;y<=600;y+=66)el('line',{x1:660,y1:y,x2:1440,y2:y},g);
 const X=1480;wl(S,X,130,X,600,W0m);for(let y=130,i=0;y<=600;y+=20,i++)wl(S,X,y,X-(i%5===0?18:10),y,i%5===0?W0:W0m);tx(S,X,112,'북쪽','v22','end');tx(S,X,630,'남쪽','v22m','end');}
function site(S,[x,y],a,b,big){el('circle',{cx:x,cy:y,r:16,fill:'none',stroke:W0,'stroke-width':2},S);wdot(S,x,y,6,W0);
 tx(S,x-34,y+(big?20:10),a,big?'v60':'v28','end');tx(S,x-34,y+(big?56:44),b,'v22m','end');}
function routeLine(S){return el('path',{d:ROUTE,fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'8 10'},S);}
function crane(p,s=1){// 나는 두루미 옆모습: 앞으로 곧게 뻗은 목, 뒤로 뻗은 긴 다리, 위로 든 날개 하나 (+x가 나는 쪽)
 const g=el('g',{},p),k=el('g',{transform:`scale(${s})`},g);g.k=k;
 el('ellipse',{cx:0,cy:0,rx:40,ry:13,fill:W0},k);
 el('path',{d:'M30,-4L108,-12',fill:'none',stroke:W0,'stroke-width':7,'stroke-linecap':'round'},k);
 el('circle',{cx:110,cy:-12,r:9,fill:W0},k);el('path',{d:'M116,-12L142,-8',fill:'none',stroke:W0,'stroke-width':4,'stroke-linecap':'round'},k);
 el('path',{d:'M-36,2L-124,10M-34,6L-120,18',fill:'none',stroke:W0,'stroke-width':3,'stroke-linecap':'round'},k);
 el('path',{d:'M-24,-8C-14,-40 -30,-70 -66,-96C-30,-84 6,-52 24,-8Z',fill:W0},k);return g;}
function seasons(S,y=670){const L=['봄','여름','가을','겨울'],x0=700,w=190;const marks=L.map((t,i)=>{wl(S,x0+i*w,y-30,x0+i*w,y+10,W0m);tx(S,x0+i*w+w/2,y,t,'v28','middle');
  return el('rect',{x:x0+i*w+20,y:y+16,width:w-40,height:6,fill:W0,opacity:0},S);});wl(S,x0+4*w,y-30,x0+4*w,y+10,W0m);return marks;}
const along=(path,t)=>{const L=path.getTotalLength(),p=path.getPointAtLength(L*t),q=path.getPointAtLength(Math.min(L,L*t+2)),r=path.getPointAtLength(Math.max(0,L*t-2));return [p.x,p.y,Math.atan2(q.y-r.y,q.x-r.x)*180/Math.PI];};
EPX[51]={day:'12월 6일',topic:'겨울 철새',cat:'두루미 · 기러기',field:'과학',frame:'v2',
 cover:{h:'겨울 철새는 왜<br>우리나라에 올까?',draw(S){grid(S);const r=routeLine(S);
   site(S,N,'아무르강 습지','러시아 · 중국');site(S,K,'우리나라','철원 · 논과 강');
   tx(S,700,420,'130만','v96');tx(S,700,466,'해마다 우리나라를 찾는 겨울 물새','v22');tx(S,700,498,'최근 10년 평균 · 국립생물자원관','v22m');
   const d=wdot(S,N[0],N[1],8,WO);let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,t=>{const c=(t%4)/4,[x,y]=along(r,Math.min(1,c*1.15));d.setAttribute('cx',x.toFixed(1));d.setAttribute('cy',y.toFixed(1));});};}},
 scenes:[
  {k:'여름 집',h:'여름엔 북쪽에서<br>새끼를 키운다',b:'두루미는 러시아와 중국 사이 <em>아무르강</em> 습지에서 새끼를 키워. 기러기도 먼 북쪽에서 여름을 나.',steps:['여름 보기'],
   draw(S){grid(S);routeLine(S);site(S,N,'아무르강 습지','러시아 · 중국',true);site(S,K,'우리나라','',false);
    const M=seasons(S);const nest=grp(S,0);[[0,0],[26,8],[-22,10]].forEach(([dx,dy],i)=>wdot(nest,N[0]+60+dx,N[1]+60+dy,i?6:9,i?W0:WO));
    el('path',{d:`M${N[0]+90},${N[1]+70}L1160,330H1240`,fill:'none',stroke:W0m,'stroke-width':2},nest);tx(nest,1250,338,'알 · 새끼','v28');
    return ()=>{M[1].setAttribute('opacity',1);M[1].setAttribute('fill',W0);show(nest);};}},
  {k:'먹이가 줄면',h:'겨울이 오면<br>남쪽으로 날아온다',b:'추워져서 먹을 것이 줄면 새들은 <em>남쪽</em>으로 내려가. 두루미와 기러기가 오는 곳이 우리나라야.',steps:['겨울 오기','날아가기'],
   draw(S){grid(S);const r=routeLine(S);site(S,N,'아무르강 습지','러시아 · 중국');site(S,K,'우리나라','철원 · 논과 강');const M=seasons(S);M[2].setAttribute('opacity',1);
    // 먹이 막대(북쪽): 가득 → 조금
    const FX=700,FY=300;tx(S,FX,FY-20,'북쪽 먹이','v28');wl(S,FX,FY+30,FX+200,FY+30,W0m);for(let i=0;i<=10;i++)wl(S,FX+i*20,FY+30,FX+i*20,FY+30+(i%5===0?16:9),i%5===0?W0:W0m);
    const bar=el('rect',{x:FX,y:FY,width:200,height:22,fill:W0},S);const fl=tx(S,FX,FY+86,'많아','v22m');
    const path=el('path',{d:ROUTE,fill:'none',stroke:W0,'stroke-width':2},S);const PL=path.getTotalLength();path.style.strokeDasharray=PL;path.style.strokeDashoffset=PL;
    const bird=crane(S,.9);bird.setAttribute('opacity',0);
    return i=>{if(i===0){M[2].setAttribute('opacity',0);M[3].setAttribute('opacity',1);play(1200,e=>bar.setAttribute('width',(200-170*e).toFixed(1)),()=>{fl.textContent='줄어들어';bar.setAttribute('fill',WO);});}
     else{bird.setAttribute('opacity',1);play(2000,e=>{const [x,y,a]=along(r,e*.62);bird.setAttribute('transform',`translate(${x.toFixed(1)},${(y-30).toFixed(1)}) scale(-1,1) rotate(14)`);path.style.strokeDashoffset=PL*(1-e);});}};}},
  {k:'논과 강',h:'논의 낟알을 먹고<br>흐르는 물에서 잔다',b:'추수가 끝난 논에는 <em>떨어진 낟알</em>이 남아 있어. 밤에는 얕게 흐르는 물에 서서 쉬어.',steps:['낮','밤'],
   draw(S){const GY=560;wl(S,640,GY,1504,GY,W0);
    // 논(왼쪽): 벼 그루터기 줄 + 낟알 점
    const RX0=660,RX1=1150;for(let x=RX0;x<=RX1;x+=35)for(let k=0;k<3;k++){const y=GY-8-k*0;wl(S,x+k*6-6,GY,x+k*6-10+k*4,GY-26,W0m);}
    tx(S,RX0,GY+60,'논','v60');tx(S,RX0+90,GY+56,'추수 끝난 뒤','v22m');
    const q=rnd(8),G=[...Array(26)].map(()=>{const x=RX0+10+q()*(RX1-RX0-20),y=GY-36-q()*120;return {c:wdot(S,x,y,5,W0),x,y};});tx(S,RX0,GY-170,'떨어진 낟알','v28');
    // 강(오른쪽): 물결선(보조색) + 흐름 화살
    const WX0=1200,WX1=1504;for(let i=0;i<5;i++){const y=GY+14+i*22;el('path',{d:`M${WX0},${y}`+[...Array(8)].map((_,k)=>`q19,${k%2?8:-8} 38,0`).join(''),fill:'none',stroke:WA,'stroke-width':2},S);}
    tx(S,WX1,GY-170,'흐르는 물','v28','end');wl(S,1300,GY-150,1440,GY-150,W0m);el('path',{d:`M1428,${GY-160}L1440,${GY-150}L1428,${GY-140}`,fill:'none',stroke:W0m,'stroke-width':2},S);
    tx(S,WX1,GY+150,'강','v60','end');
    // 발자국(세 갈래)
    const foot=(x,y,a)=>{const g=el('g',{transform:`translate(${x},${y}) rotate(${a})`,opacity:0},S);
     el('path',{d:'M0,9L0,-20M0,0L-15,-13M0,0L15,-13',fill:'none',stroke:W0,'stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round'},g);return g;};
    const T1=[...Array(10)].map((_,i)=>foot(700+i*46,GY-70-Math.sin(i*.9)*40+(i%2?10:-10),0));const T2=[...Array(6)].map((_,i)=>foot(1170+i*44,GY-44+i*10+(i%2?8:-8),0));
    const rest=grp(S,0);el('circle',{cx:1440,cy:GY+40,r:30,fill:'none',stroke:WO,'stroke-width':3},rest);tx(rest,1440,GY-24,'자는 곳','v22','middle');
    hRuler(S,660,1480,250,41,'아침','밤');const big=tx(S,660,180,'철원의 하루','v60');const mk=wdot(S,660,250,9,W0);
    return i=>{if(i===0){big.textContent='낮 · 논에서';play(1800,e=>{mk.setAttribute('cx',660+e*400);T1.forEach((f,k)=>{if(e>k/10)f.setAttribute('opacity',1);});G.forEach((g,k)=>{const nearest=Math.abs(g.x-(700+e*460))<40;if(nearest)g.c.setAttribute('r',0);});},()=>G.forEach((g,k)=>{if(k%3)g.c.setAttribute('r',0);}));}
     else{big.textContent='밤 · 물가에서';play(1400,e=>{mk.setAttribute('cx',1060+e*420);},()=>0);play(1400,e=>T2.forEach((f,k)=>{if(e>k/6)f.setAttribute('opacity',1);}),()=>show(rest));}};}}],
 sum:{lines:['두루미와 기러기는 여름에<br>먼 북쪽에서 새끼를 키운다.','겨울이 와 먹이가 줄면<br>남쪽 우리나라로 날아온다.','논의 낟알을 먹고<br>흐르는 물에서 쉬며 겨울을 난다.'],
  words:[['철새','철 따라 사는 곳을 옮기는 새'],['낟알','곡식의 알 하나하나'],['습지','물이 고여 축축한 땅']]},
 end:{q:'봄이 오면 두루미는 어디로 갈까?',a:'다시 북쪽으로 가. 새끼를 키우러.',h:'창밖 겨울 하늘에서<br>줄지어 나는 새를<br>찾아봐.',btn:'봄 보기',
  draw(S){grid(S);const r=routeLine(S);site(S,N,'아무르강 습지','러시아 · 중국');site(S,K,'우리나라','철원 · 논과 강');const M=seasons(S);M[3].setAttribute('opacity',1);
   const d=wdot(S,K[0],K[1],9,WO);const lab=tx(S,700,420,'겨울','v96');
   return ()=>{M[3].setAttribute('opacity',0);M[0].setAttribute('opacity',1);lab.textContent='봄';play(1800,e=>{const [x,y]=along(r,1-e);d.setAttribute('cx',x.toFixed(1));d.setAttribute('cy',y.toFixed(1));});};}}};
})();

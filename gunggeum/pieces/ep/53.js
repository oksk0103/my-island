(()=>{ // 53. 별은 왜 반짝일까 — v2 관측 노트
// 별 = 크림 점(+짧은 십자), 공기 = 흐린 크림 물결선, 산호 = 화면당 한 곳(눈에 닿는 빛)
function star(p,x,y,r=6,c=W0){const g=el('g',{},p);wdot(g,x,y,r,c);[[0,1],[1,0]].forEach(([a,b])=>wl(g,x-a*r*3,y-b*r*3,x+a*r*3,y+b*r*3,c));return g;}
function airWaves(S,y1,y2,x1=660,x2=1490,n=5,seed=1){const g=el('g',{fill:'none',stroke:W0m,'stroke-width':2},S),L=[];for(let i=0;i<n;i++){const y=y1+(y2-y1)*i/(n-1);const pth=el('path',{},g);L.push({pth,y,ph:i*1.7});}
 const set=t=>L.forEach(l=>{let d=`M${x1},${l.y}`;for(let x=x1;x<=x2;x+=24)d+=`L${x},${(l.y+Math.sin(x/46+l.ph+t)*7).toFixed(1)}`;l.pth.setAttribute('d',d);});set(0);return set;}
function observer(S,x,y,lab){el('path',{d:`M${x-16},${y+20}L${x},${y-6}L${x+16},${y+20}Z`,fill:W0},S);if(lab)tx(S,x,y+60,lab,'v22m','middle');}
// 밝기 기록 그래프
function chart(S,x,y,w,h,lab){wl(S,x,y,x,y+h,W0m);wl(S,x,y+h,x+w,y+h,W0m);for(let i=0;i<=10;i++)wl(S,x+i*w/10,y+h,x+i*w/10,y+h+(i%5===0?14:8),i%5===0?W0:W0m);tx(S,x,y-18,lab,'v22m');
 const pl=el('polyline',{points:'',fill:'none',stroke:W0,'stroke-width':2,'stroke-linejoin':'round'},S);return {pl,set:(vals)=>pl.setAttribute('points',vals.map((v,i)=>`${(x+i*w/(vals.length-1||1)).toFixed(1)},${(y+h-v*h).toFixed(1)}`).join(' '))};}
const wob=(t,k)=>Math.sin(t*7.1+k)*.55+Math.sin(t*12.7+k*2.3)*.3+Math.sin(t*3.3+k*.7)*.15;
EPX[53]={day:'12월 8일',topic:'별의 반짝임',cat:'밤하늘',field:'과학',frame:'v2',
 cover:{h:'별은 왜<br>반짝일까?',draw(S){const GY=640;wl(S,640,GY,1504,GY,W0);tx(S,640,GY+44,'관측 · 겨울밤 하늘','v22m');
   const setA=airWaves(S,440,600);tx(S,1504,420,'공기','v22m','end');
   const q=rnd(53);for(let i=0;i<34;i++){const x=680+q()*800,y=120+q()*280;if(Math.abs(x-1080)<80&&Math.abs(y-230)<80)continue;wdot(S,x,y,q()<.2?4:2.5,q()<.5?W0:W0m);}
   const big=star(S,1080,230,9);const tip=wdot(S,1080,230,9,WO);
   el('path',{d:'M1120,250L1200,330H1300',fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,1310,340,'반짝반짝','v28');
   let on=false;return ()=>{if(on||calm())return;on=true;loop(S,t=>{setA(t*1.5);const b=Math.max(0,.5+.5*wob(t,1));tip.setAttribute('r',(3+9*b).toFixed(1));big.setAttribute('opacity',(.35+.65*b).toFixed(2));});};}},
 scenes:[
  {k:'점 하나',h:'별은 너무 멀어서<br>점 하나로 보인다',b:'별은 아주아주 멀리 있어서 작은 <em>점 하나</em>로 보여. 그 작은 빛이 가는 줄기로 우리에게 와.',steps:['빛 보내기'],
   draw(S){const SX=1300,SY=150,OX=1000,OY=630;star(S,SX,SY,8);tx(S,SX+44,SY+14,'별','v60');
    wl(S,640,OY+24,1504,OY+24,W0);observer(S,OX,OY,'땅에서 보는 곳');
    el('line',{x1:SX,y1:SY,x2:OX,y2:OY-10,stroke:W0m,'stroke-width':2,'stroke-dasharray':'8 10'},S);
    // 거리 눈금(끊김 표시 = 아주 멀다)
    const RX=1460;wl(S,RX,SY,RX,300,W0m);wl(S,RX,360,RX,OY+20,W0m);el('path',{d:`M${RX-14},296L${RX+14},310M${RX-14},350L${RX+14},364`,fill:'none',stroke:W0,'stroke-width':2},S);
    for(let y=380;y<=OY+20;y+=20)wl(S,RX,y,RX-((y-380)%100===0?16:9),y,W0m);tx(S,RX-24,340,'아주 멀리','v22','end');
    tx(S,660,300,'점','v96');tx(S,660,350,'아주 멀어서 작은 점','v22m');
    const ray=el('line',{x1:SX,y1:SY,x2:SX,y2:SY,stroke:W0,'stroke-width':2},S);const d=wdot(S,SX,SY,0,WO);
    const lab=grp(S,0);el('path',{d:`M${(SX+OX)/2-14},${(SY+OY)/2}H880`,fill:'none',stroke:W0m,'stroke-width':2},lab);tx(lab,870,(SY+OY)/2+8,'빛 줄기 하나','v28','end');
    return ()=>play(1600,e=>{const x=SX+(OX-SX)*e,y=SY+(OY-10-SY)*e;ray.setAttribute('x2',x.toFixed(1));ray.setAttribute('y2',y.toFixed(1));d.setAttribute('cx',x.toFixed(1));d.setAttribute('cy',y.toFixed(1));d.setAttribute('r',9);},()=>show(lab));}},
  {k:'흔들리는 공기',h:'공기가 흔들려서<br>별빛이 흔들린다',b:'공기는 따뜻한 곳과 찬 곳이 뒤섞여 늘 흔들려. 그 사이를 지나는 별빛이 <em>이리저리 꺾여</em> 눈에 들어왔다 말았다 해.',steps:['공기 흔들기'],
   draw(S){const SX=960,SY=130,OX=960,OY=630,A1=330,A2=590;star(S,SX,SY,8);tx(S,SX+40,SY+14,'별','v60');
    wl(S,640,OY+24,1240,OY+24,W0);observer(S,OX,OY,'땅에서 보는 곳');
    const setA=airWaves(S,A1,A2,660,1240,5);tx(S,660,A1-24,'따뜻한 공기 · 찬 공기','v22m');
    const LAY=[A1,A1+65,A1+130,A1+195,A2];const ray=el('polyline',{points:'',fill:'none',stroke:W0,'stroke-width':2,'stroke-linejoin':'round'},S);const end=wdot(S,OX,OY-10,9,WO);
    const setRay=t=>{let x=SX;const P=[[SX,SY],[SX,A1]];for(let i=1;i<LAY.length;i++){x+=wob(t,i*1.9)*28;P.push([x,LAY[i]]);}const ex=x+wob(t,9)*30;P.push([ex,OY-10]);ray.setAttribute('points',P.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' '));end.setAttribute('cx',ex.toFixed(1));return Math.max(0,1-Math.abs(ex-OX)/70);};
    setRay(0);ray.setAttribute('points',`${SX},${SY} ${SX},${OY-10}`);end.setAttribute('cx',OX);
    const C=chart(S,1280,220,220,200,'눈에 닿는 밝기');tx(S,1280,486,'시간 →','v22m');const big=tx(S,1280,580,'','v60');
    return ()=>{const V=[];play(2000,(e,x)=>{const t=x*3;setA(t*2);const b=setRay(t);V.push(b);C.set(V);},()=>big.textContent='반짝반짝');};}},
  {k:'낮은 하늘',h:'낮은 하늘의 별은<br>더 많이 반짝인다',b:'땅 가까이 낮게 뜬 별의 빛은 공기 속을 <em>더 길게</em> 지나와. 그래서 더 많이 흔들려 반짝여.',steps:['높은 별','낮은 별'],
   draw(S){const OX=1000,OY=620,G=OY+24,RX=360,RY=240;wl(S,640,G,1504,G,W0);observer(S,OX,OY);
    // 공기층: 보는 곳을 가운데 둔 납작한 반원(위로는 얇고 옆으로는 두꺼움)
    el('path',{d:`M${OX-RX},${G}A${RX},${RY} 0 0 1 ${OX+RX},${G}`,fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'8 10'},S);
    tx(S,OX-RX+30,G-30,'공기','v28');
    const HI=[OX,150],LO=[1460,540],EYE=[OX,OY-10];star(S,...HI,7);star(S,...LO,7);tx(S,HI[0]-34,HI[1]+12,'높은 별','v28','end');tx(S,LO[0],LO[1]-36,'낮은 별','v28','end');
    // 별빛이 공기층(반원)에 들어가는 점: 별 → 눈 직선이 반원과 만나는 곳
    const inside=([x,y])=>((x-OX)/RX)**2+((y-G)/RY)**2<=1;
    const entry=a=>{for(let t=0;t<=1;t+=.001){const q=[a[0]+(EYE[0]-a[0])*t,a[1]+(EYE[1]-a[1])*t];if(inside(q))return q;}return EYE;};
    const inHi=entry(HI),inLo=entry(LO);
    [inHi,inLo].forEach(q=>wdot(S,q[0],q[1],5,W0));
    const r1=el('line',{x1:HI[0],y1:HI[1],x2:HI[0],y2:HI[1],stroke:W0,'stroke-width':2},S),r2=el('line',{x1:LO[0],y1:LO[1],x2:LO[0],y2:LO[1],stroke:W0,'stroke-width':2},S);
    const s1=el('line',{x1:inHi[0],y1:inHi[1],x2:inHi[0],y2:inHi[1],stroke:W0,'stroke-width':8,opacity:0},S),s2=el('line',{x1:inLo[0],y1:inLo[1],x2:inLo[0],y2:inLo[1],stroke:WO,'stroke-width':8,opacity:0},S);
    // 오른쪽 위: 공기 속 길이 막대
    const BX=1100,bar=(y,lab)=>{tx(S,BX,y-18,lab,'v22m');wl(S,BX,y+28,1480,y+28,W0m);for(let i=0;i<=19;i++)wl(S,BX+i*20,y+28,BX+i*20,y+28+(i%5===0?14:8),i%5===0?W0:W0m);return el('rect',{x:BX,y:y,width:0,height:20,fill:W0},S);};
    const b1=bar(170,'높은 별빛이 공기 속을 지난 길이'),b2=bar(300,'낮은 별빛이 공기 속을 지난 길이');b2.setAttribute('fill',WO);
    const len=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);const L1=len(inHi,EYE),L2=len(inLo,EYE);const k=360/L2;
    const go=(r,s,b,from,inn,L)=>{s.setAttribute('opacity',1);const T=len(from,EYE),A=len(from,inn);play(1500,e=>{const x=from[0]+(EYE[0]-from[0])*e,y=from[1]+(EYE[1]-from[1])*e;r.setAttribute('x2',x.toFixed(1));r.setAttribute('y2',y.toFixed(1));
      const f=Math.max(0,Math.min(1,(e*T-A)/L));s.setAttribute('x2',(inn[0]+(EYE[0]-inn[0])*f).toFixed(1));s.setAttribute('y2',(inn[1]+(EYE[1]-inn[1])*f).toFixed(1));b.setAttribute('width',(L*k*f).toFixed(1));});};
    return i=>i?go(r2,s2,b2,LO,inLo,L2):go(r1,s1,b1,HI,inHi,L1);}}],
 sum:{lines:['별은 아주 멀어서<br>점 하나로 보인다.','흔들리는 공기가 별빛을 이리저리<br>꺾어 반짝이는 것처럼 보인다.','낮은 하늘의 별은 공기를 길게<br>지나와 더 많이 반짝인다.'],
  words:[['반짝임','빛이 켜졌다 꺼졌다 하는 듯 보이는 것'],['공기층','지구를 둘러싼 공기'],['행성','해 둘레를 도는 큰 둥근 천체. 지구도 그중 하나']]},
 end:{q:'행성은 별보다 덜 반짝여. 왜 그럴까?',a:'가까워서 점이 아니라 작은 원으로 보이거든.',h:'창밖 높은 별과<br>낮은 별의 반짝임을<br>견줘 봐.',btn:'견줘 보기',
  draw(S){const X0=760,X1=1460,Y0=110,Y1=600;el('rect',{x:X0,y:Y0,width:X1-X0,height:Y1-Y0,fill:'none',stroke:W0,'stroke-width':2},S);el('rect',{x:X0-14,y:Y0-14,width:X1-X0+28,height:Y1-Y0+28,fill:'none',stroke:W0m,'stroke-width':2},S);
   wl(S,X0,Y1-90,X1,Y1-90,W0m);tx(S,X1-20,Y1-40,'땅 · 지붕들','v22m','end');tx(S,X0,Y1+74,'방 안에서 보기','v22m');
   const HI=[880,190],LO=[900,470];star(S,...HI,7);const lo=star(S,...LO,7);tx(S,HI[0]+36,HI[1]+10,'높은 별','v28');tx(S,LO[0]+36,LO[1]+10,'낮은 별','v28');
   const C1=chart(S,1100,150,320,110,''),C2=chart(S,1100,370,320,110,'');C2.pl.setAttribute('stroke',WO);
   return ()=>{const V1=[],V2=[];play(2000,(e,x)=>{const t=x*3;V1.push(.65+.12*wob(t,2));V2.push(Math.max(0,Math.min(1,.5+.5*wob(t,5))));C1.set(V1);C2.set(V2);});};}}};
})();

(()=>{ // 50. 펭귄은 왜 발이 안 얼까 — v2 관측 노트 (실루엣은 화면당 하나, 발·혈관 도식 중심)
// 크림 = 따뜻한 피·주 그림, 보조색 = 식은 피, 산호 = 화면당 한 곳
function penguin(p,x,gy,s=1){const g=el('g',{transform:`translate(${x},${gy}) scale(${s})`},p);   /* v191: 크림 실루엣 → 실제 펭귄 빛깔(검은 등, 흰 배, 주황 부리·발) */
 const BK='#262B36',LN='rgba(243,233,210,.55)',OR='#F0A23C';
 el('path',{d:'M-30,-12L-30,0L66,0Q74,-6 64,-12Z',fill:OR},g);
 el('ellipse',{cx:0,cy:-170,rx:84,ry:160,fill:BK,stroke:LN,'stroke-width':2},g);el('ellipse',{cx:22,cy:-150,rx:56,ry:130,fill:'#F4EEE2'},g);
 el('path',{d:'M-78,-60L-118,-2L-56,-14Z',fill:BK,stroke:LN,'stroke-width':2},g);
 el('circle',{cx:14,cy:-318,r:50,fill:BK,stroke:LN,'stroke-width':2},g);el('path',{d:'M40,-292Q58,-270 48,-246Q30,-262 30,-286Z',fill:'#F2C14E'},g);
 el('path',{d:'M56,-330L100,-318L56,-306Z',fill:OR},g);
 el('circle',{cx:30,cy:-326,r:8,fill:'#F4EEE2'},g);el('circle',{cx:32,cy:-326,r:4,fill:BK},g);return g;}
function iceSlab(S,y,x1=640,x2=1504){el('rect',{x:x1,y,width:x2-x1,height:30,fill:W0},S);for(let x=x1+30;x<x2;x+=60)wl(S,x,y+30,x-18,y+52,W0m);}
const arrowHead=(p,x,y,dir,c=W0)=>el('path',{d:dir==='down'?`M${x-9},${y-12}L${x},${y}L${x+9},${y-12}`:dir==='up'?`M${x-9},${y+12}L${x},${y}L${x+9},${y+12}`:`M${x-12},${y-9}L${x},${y}L${x-12},${y+9}`,fill:'none',stroke:c,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'},p);
EPX[50]={day:'12월 5일',topic:'펭귄의 발',cat:'추위 버티기',field:'과학',frame:'v2',
 cover:{h:'펭귄은 왜<br>발이 안 얼까?',draw(S){
   iceSlab(S,620);penguin(S,820,620,1.4);tx(S,640,700,'관측 · 남극 얼음 위','v22m');
   // 오른쪽: 높이별 온도 이름표
   const X=1100;wl(S,X,130,X,600,W0m);for(let y=130,i=0;y<=600;y+=20,i++)wl(S,X,y,X+(i%5===0?18:10),y,i%5===0?W0:W0m);
   [[220,'몸 속','따뜻해'],[540,'발','얼기 직전']].forEach(([y,a,b],i)=>{wl(S,X-6,y,X+40,y,W0);tx(S,X+56,y+20,a,'v60');tx(S,X+56,y+60,b,'v28');});tx(S,1504,700,'얼음 · 0도 아래','v22m','end');
   // 피 한 방울이 다리로 내려갔다 올라옴(표지만 반복)
   const d=wdot(S,850,400,8,WO);let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,t=>{const c=(t%3.2)/3.2,k=c<.5?c*2:2-c*2;d.setAttribute('cy',(380+k*228).toFixed(1));});};}},
 scenes:[
  {k:'맨발',h:'펭귄은 얼음 위에<br>맨발로 서 있다',b:'몸은 <em>깃털</em>과 두꺼운 기름층이 덮어 줘. 그런데 발에는 깃털이 없고 기름살도 거의 없어.',steps:['덮개 보기'],
   draw(S){const CX=900,CY=290,R=130;
    el('circle',{cx:CX,cy:CY,r:R,fill:'none',stroke:W0,'stroke-width':2},S);tx(S,CX,CY+10,'몸 속','v28','middle');
    const fat=el('circle',{cx:CX,cy:CY,r:R-18,fill:'none',stroke:WA,'stroke-width':0},S);
    const q=rnd(5),F=[];for(let i=0;i<72;i++){const a=i/72*Math.PI*2;F.push(wl(S,CX+Math.cos(a)*(R+4),CY+Math.sin(a)*(R+4),CX+Math.cos(a)*(R+4),CY+Math.sin(a)*(R+4),W0,{'stroke-width':3}));F[i].a=a;}
    // 다리 + 발 (맨살 = 선만)
    [CX-50,CX+50].forEach(x=>{wl(S,x,CY+R-6,x,580);el('path',{d:`M${x-46},612L${x},580L${x+46},612M${x},580V614`,fill:'none',stroke:W0,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'},S);});
    iceSlab(S,620);
    // 이름표
    const L1=grp(S,0),L2=grp(S,0);el('path',{d:`M${CX+R+30},${CY-80}H1190`,fill:'none',stroke:W0m,'stroke-width':2},L1);tx(L1,1200,CY-70,'깃털','v60');
    el('path',{d:`M${CX+R-14},${CY+40}L${CX+R+30},${CY+40}H1190`,fill:'none',stroke:W0m,'stroke-width':2},L2);tx(L2,1200,CY+50,'기름층','v60');
    el('path',{d:`M${CX+96},596L1150,500H1190`,fill:'none',stroke:W0m,'stroke-width':2},S);const bare=tx(S,1200,520,'맨발','v60');tx(S,1200,562,'깃털 없음 · 기름살 거의 없음','v22m');
    el('path',{d:`M${CX-R-34},${CY}H720`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,706,CY+20,'몸','v60','end');el('path',{d:`M${CX-60},500H760`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,750,520,'다리','v60','end');
    return ()=>play(1400,e=>{F.forEach((l,i)=>{const s=Math.max(0,Math.min(1,e*1.5-i/72*.5));l.setAttribute('x2',(CX+Math.cos(l.a)*(R+4+22*s)).toFixed(1));l.setAttribute('y2',(CY+Math.sin(l.a)*(R+4+22*s)).toFixed(1));});
      fat.setAttribute('stroke-width',(28*e).toFixed(1));},()=>{show(L1);show(L2);bare.setAttribute('fill',WO);});}},
  {k:'열 건네기',h:'가는 피와 오는 피가<br>열을 주고받는다',b:'발로 내려가는 따뜻한 피가 옆에서 올라오는 찬 피에게 <em>열을 건네</em>. 그래서 열을 덜 잃어.',steps:['피 내려보내기','피 올려보내기'],
   draw(S){const A=900,V=980,T=150,B=580;
    // 두 핏줄(나란히) + 발에서 U자로 이어짐
    el('path',{d:`M${A},${T}V${B}Q${A},${B+40} ${(A+V)/2},${B+40}Q${V},${B+40} ${V},${B}V${T}`,fill:'none',stroke:W0,'stroke-width':2},S);
    el('path',{d:`M${A+18},${T}V${B}Q${A+18},${B+22} ${(A+V)/2},${B+22}Q${V-18},${B+22} ${V-18},${B}V${T}`,fill:'none',stroke:W0m,'stroke-width':2},S);
    iceSlab(S,650);tx(S,(A+V)/2,T-24,'몸 속','v28','middle');tx(S,1040,B+50,'발','v28');
    // 왼쪽 온도 눈금
    const X=760;wl(S,X,T,X,B+40,W0m);for(let y=T,i=0;y<=B+40;y+=20,i++)wl(S,X,y,X+(i%5===0?18:10),y,i%5===0?W0:W0m);tx(S,X-14,T+8,'따뜻','v22','end');tx(S,X-14,B+48,'차가움','v22m','end');
    // 이름표
    tx(S,A-24,330,'가는 피','v28','end');arrowHead(S,A-60,380,'down');wl(S,A-60,350,A-60,380);
    tx(S,1060,330,'오는 피','v28');arrowHead(S,1100,350,'up');wl(S,1100,350,1100,380);
    // 열 건네는 화살(산호, 한 곳)
    const H=grp(S,0);[230,300,370,440,510].forEach(y=>{wl(H,A+14,y,V-24,y,WO);arrowHead(H,V-22,y,'right',WO);});
    const res=[tx(S,1200,240,'','v60'),tx(S,1200,280,'','v22m'),tx(S,1200,440,'','v60'),tx(S,1200,480,'','v22m')];
    const run=(down)=>{const N=10,D=[...Array(N)].map((_,i)=>({c:wdot(S,down?A+9:V-9,down?T:B+30,0,W0),o:i/N}));
     play(1800,e=>D.forEach(d=>{const s=Math.max(0,Math.min(1,e*1.6-d.o*.6));let y,x;
       if(down){x=A+9;y=T+s*(B+30-T);}else{x=V-9;y=B+30-s*(B+30-T);}
       const cold=down?y>T+(B-T)*.55:y>T+(B-T)*.45;d.c.setAttribute('cx',x);d.c.setAttribute('cy',y.toFixed(1));d.c.setAttribute('r',s>0&&s<1?7:0);d.c.setAttribute('fill',cold?WA:W0);d.c.setAttribute('stroke',cold?W0m:'none');}),()=>D.forEach(d=>d.c.remove()));};
    return i=>{show(H);if(i===0){run(true);res[0].textContent='식어서 내려가';res[1].textContent='발에 닿을 땐 차가운 피';}
     else{run(false);res[2].textContent='데워져서 올라가';res[3].textContent='몸에 들어갈 땐 따뜻한 피';}};}},
  {k:'발꿈치로 버티기',h:'발꿈치로 버티며<br>발가락을 든다',b:'펭귄은 발꿈치와 꼬리로 버티고 발가락을 얼음에서 들기도 해. 그러면 얼음에 <em>닿는 곳</em>이 줄어.',steps:['발가락 들기'],
   draw(S){const GX=900,GY=600;iceSlab(S,GY);
    const pg=grp(S,1);const pn=penguin(pg,0,0,1.25);pg.setAttribute('transform',`translate(${GX},${GY})`);
    // 얼음에 닿는 자리(산호 선) + 아래 눈금
    const touch=el('line',{x1:GX-38,y1:GY-2,x2:GX+84,y2:GY-2,stroke:WO,'stroke-width':6,'stroke-linecap':'round'},S);
    const RY=GY+80;wl(S,700,RY,1300,RY,W0m);for(let i=0;i<=30;i++){const x=700+i*20;wl(S,x,RY,x,RY+(i%5===0?16:9),i%5===0?W0:W0m);}tx(S,700,RY+44,'얼음에 닿는 길이','v22m');
    const big=tx(S,1300,300,'발 전체','v60');tx(S,1300,346,'얼음에 닿아 있어','v22m');
    const tail=el('line',{x1:GX-130,y1:GY-2,x2:GX-130,y2:GY-2,stroke:WO,'stroke-width':6,'stroke-linecap':'round'},S);
    return ()=>play(1400,e=>{pg.setAttribute('transform',`translate(${GX},${GY}) rotate(${(-9*e).toFixed(2)},-20,0)`);touch.setAttribute('x2',(GX+84-104*e).toFixed(1));tail.setAttribute('x2',(GX-130+30*e).toFixed(1));},()=>{big.textContent='발꿈치·꼬리';big.nextSibling.textContent='만 얼음에 닿아';});}}],
 sum:{lines:['펭귄 발에는 깃털도<br>기름살도 거의 없다.','발로 가는 피와 돌아오는 피가<br>열을 주고받아 열을 덜 잃는다.','발꿈치와 꼬리로 버티며<br>발가락을 얼음에서 들기도 한다.'],
  words:[['맨발','아무것도 덮지 않은 발'],['핏줄','피가 지나가는 길'],['기름층','살갗 밑에서 추위를 막는 기름 살']]},
 end:{q:'얼음 위 펭귄 발은 얼마나 차가울까?',a:'얼기 직전까지 식지만 얼지는 않아.',h:'한 손은 주머니에,<br>한 손은 찬 컵에 댄 뒤<br>두 손을 맞잡아 봐.',btn:'열이 가는 길',
  draw(S){// 두 온도계(따뜻한 손 / 찬 손) — 맞잡으면 열이 건너감
   const bars=[[860,'주머니 속 손',420],[1260,'찬 컵에 댄 손',180]];const B=600,T=160;
   const lv=bars.map(([x,lab,h])=>{el('rect',{x:x-30,y:T,width:60,height:B-T,fill:'none',stroke:W0,'stroke-width':2},S);
     for(let y=T,i=0;y<=B;y+=22,i++)wl(S,x+30,y,x+30+(i%5===0?18:10),y,i%5===0?W0:W0m);tx(S,x,B+50,lab,'v28','middle');
     return el('rect',{x:x-24,y:B-h,width:48,height:h,fill:W0},S);});
   tx(S,640,T+8,'따뜻','v22');tx(S,640,B,'차가움','v22m');
   const H=[...Array(12)].map((_,i)=>wdot(S,900,0,0,WO));const lab=grp(S,0);tx(lab,1060,240,'열이 건너가','v28','middle');
   return ()=>{const st=[420,180];play(1600,e=>{const h0=420-120*e,h1=180+120*e;lv[0].setAttribute('y',B-h0);lv[0].setAttribute('height',h0);lv[1].setAttribute('y',B-h1);lv[1].setAttribute('height',h1);
     H.forEach((c,i)=>{const s=Math.max(0,Math.min(1,e*1.6-i/12*.6));const x=900+s*320,y=330-Math.sin(s*Math.PI)*60;c.setAttribute('cx',x.toFixed(1));c.setAttribute('cy',y.toFixed(1));c.setAttribute('r',s>0&&s<1?7:0);});},()=>show(lab));};}}};
})();

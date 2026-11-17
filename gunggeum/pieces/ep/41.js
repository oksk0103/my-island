(()=>{ // 41. 무지개는 어떻게 생길까 — 새 틀(v2) 관측 노트
// 잉크: 크림 W0 · 산호 WO(화면당 한 곳) · 보조 WA. 무지개 일곱 색은 색 자체가 내용 → 단색 띠 허용(그라데이션 없음).
const SW=[['빨강','#E2614F'],['주황','#EE9A4D'],['노랑','#EBD27A'],['초록','#7DBB8C'],['파랑','#5B8FD6'],['남색','#5F6CC8'],['보라','#9A76C8']];
const sun=(p,cx,cy,r)=>{const g=el('g',{},p);el('circle',{cx,cy,r,fill:W0},g);for(let i=0;i<8;i++){const a=i*Math.PI/4;wl(g,cx+Math.cos(a)*(r+12),cy+Math.sin(a)*(r+12),cx+Math.cos(a)*(r+26),cy+Math.sin(a)*(r+26));}return g;};
const mv=(c,x,y)=>{c.setAttribute('cx',x.toFixed(1));c.setAttribute('cy',y.toFixed(1));};
const tri=(p,x,y,c)=>el('path',{d:`M${x},${y-30}L${x+18},${y}H${x-18}Z`,fill:c},p);
const lerp=(a,b,t)=>a+(b-a)*t;
// 반원 띠(왼쪽 끝에서 th만큼 돌아간 부채 띠). th=π면 온 반원.
const bandD=(cx,cy,r1,r2,th)=>{const P=(r,a)=>`${(cx+Math.cos(a)*r).toFixed(1)},${(cy+Math.sin(a)*r).toFixed(1)}`;const a1=Math.PI+Math.max(.001,th);
  return `M${P(r2,Math.PI)}A${r2},${r2} 0 0 1 ${P(r2,a1)}L${P(r1,a1)}A${r1},${r1} 0 0 0 ${P(r1,Math.PI)}Z`;};
const bow=(p,cx,cy,R,w,th=Math.PI,o={})=>SW.map(([n,c],i)=>el('path',Object.assign({d:bandD(cx,cy,R-(i+1)*w,R-i*w,th),fill:c},o),p));
const rain=(p,seed,n,x1,y1,x2,y2,col=WA)=>{const q=rnd(seed),L=[];for(let i=0;i<n;i++){const x=x1+q()*(x2-x1),y=y1+q()*(y2-y1-24);L.push(wl(p,x,y,x-4,y+20,col));}return L;};

EPX[41]={day:'과학',topic:'무지개',cat:'빛과 색',field:'과학',frame:'v2',
 cover:{h:'무지개는<br>어떻게<br>생길까?',draw(S){
   const GY=620,CX=1080;rain(S,2,70,660,140,1500,600);wl(S,648,GY,1504,GY,W0);tx(S,648,GY+44,'관측 · 비 갠 오후','v22m');
   const B=bow(S,CX,GY,400,22);tri(S,CX,GY,WO);tx(S,CX,GY+44,'여기서 봐','v22','middle');
   el('path',{d:`M${CX+300},${GY-262}L${CX+340},${GY-400}H1504`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,1504,GY-414,'무지개','v28','end');
   const set=th=>B.forEach((b,i)=>b.setAttribute('d',bandD(CX,GY,400-(i+1)*22,400-i*22,th)));let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,t=>{const c=t%6;set(c<1.6?Math.PI*EO(c/1.6):c<5.4?Math.PI:Math.PI*(1-(c-5.4)/.6));});};}},
 scenes:[
  {k:'해를 등지고',h:'무지개는<br>해를 등져야 보인다',b:'해는 <em>내 뒤</em>에, 빗방울은 내 앞에 있어야 해. 해가 너무 높이 뜨면 잘 안 보여.',steps:['햇빛 비추기','빗방울 보기'],
   draw(S){const GY=620,OX=980;wl(S,640,GY,1504,GY,W0);
    sun(S,720,300,36);tx(S,720,390,'해 — 내 뒤','v28','middle');
    tri(S,OX,GY,WO);tx(S,OX,GY+44,'나','v22','middle');
    wl(S,1180,150,1180,600,W0m,{'stroke-dasharray':'2 10'});tx(S,1200,140,'빗방울','v28');const R=rain(S,7,60,1196,170,1500,600);
    const L1=[wl(S,770,300,770,300,W0,{'stroke-dasharray':'2 10'}),wl(S,770,320,770,320,W0,{'stroke-dasharray':'2 10'})];
    const ends=[[1360,300],[1360,470]];
    const sight=wl(S,OX,GY-36,OX,GY-36,W0m);const chips=grp(S,0);bow(chips,1350,GY,150,9);tx(chips,1350,GY-170,'무지개','v28','middle');
    return i=>{if(i===0)play(1000,e=>L1.forEach((l,k)=>{const sx=770,sy=k?320:300,[ex,ey]=ends[k];l.setAttribute('x2',lerp(sx,ex,e));l.setAttribute('y2',lerp(sy,ey,e));}));
     else{play(500,e=>R.forEach(l=>l.setAttribute('stroke',e>.5?W0:WA)),()=>play(800,e=>{sight.setAttribute('x2',lerp(OX,1240,e));sight.setAttribute('y2',lerp(GY-36,GY-120,e));},()=>show(chips)));}};}},
  {k:'빗방울 속 길',h:'빗방울이<br>햇빛을 색깔별로 나눈다',b:'햇빛이 빗방울에 들어가면 꺾이고, 안쪽 벽에 튕겨 나와. 나올 때 색마다 <em>꺾이는 정도</em>가 달라서 갈라져.',steps:['햇빛 넣기'],
   draw(S){const CX=1180,CY=390,R=210;el('circle',{cx:CX,cy:CY,r:R,fill:'none',stroke:W0,'stroke-width':2},S);
    tx(S,CX+R,CY-R-20,'빗방울 하나 — 크게','v22m','end');
    const A=[CX-Math.sqrt(R*R-130*130),CY-130],Bp=[CX+R*Math.cos(.18),CY+R*Math.sin(.18)],C=[CX-120,CY+Math.sqrt(R*R-120*120)];
    wl(S,640,A[1],A[0],A[1],W0);tx(S,640,A[1]-20,'햇빛','v28');
    const p1=wl(S,A[0],A[1],A[0],A[1],W0),p2=wl(S,Bp[0],Bp[1],Bp[0],Bp[1],W0);const hd=wdot(S,A[0],A[1],0,W0);
    const ring=el('circle',{cx:Bp[0],cy:Bp[1],r:20,fill:'none',stroke:WO,'stroke-width':2,opacity:0},S);const rl=grp(S,0);tx(rl,Bp[0]-30,Bp[1]+70,'안쪽 벽에서 튕겨','v22','end');
    const F=SW.map(([n,c],i)=>({l:wl(S,C[0],C[1],C[0],C[1],c,{'stroke-width':3}),x:700,y:600+i*14,c}));const cap=grp(S,0);tx(cap,640,580,'일곱 색','v28');
    return ()=>play(600,e=>{p1.setAttribute('x2',lerp(A[0],Bp[0],e));p1.setAttribute('y2',lerp(A[1],Bp[1],e));mv(hd,lerp(A[0],Bp[0],e),lerp(A[1],Bp[1],e));hd.setAttribute('r',6);},()=>{ring.setAttribute('opacity',1);show(rl);
      play(600,e=>{p2.setAttribute('x2',lerp(Bp[0],C[0],e));p2.setAttribute('y2',lerp(Bp[1],C[1],e));mv(hd,lerp(Bp[0],C[0],e),lerp(Bp[1],C[1],e));},()=>{hd.remove();
       play(800,e=>F.forEach(f=>{f.l.setAttribute('x2',lerp(C[0],f.x,e));f.l.setAttribute('y2',lerp(C[1],f.y,e));}),()=>show(cap));});});}},
  {k:'일곱 색 차례',h:'바깥은 빨강,<br>안쪽은 보라다',b:'무지개 색은 늘 같은 차례야. 맨 바깥이 <em>빨강</em>, 맨 안쪽이 <em>보라</em>. 흔히 일곱 색으로 나눠 불러.',steps:['한 색씩 칠하기'],
   draw(S){const GY=620,CX=1180,R=330,w=26;wl(S,860,GY,1504,GY,W0);
    for(let i=0;i<=7;i++)el('path',{d:`M${CX-(R-i*w)},${GY}A${R-i*w},${R-i*w} 0 0 1 ${CX+(R-i*w)},${GY}`,fill:'none',stroke:W0m,'stroke-width':2},S);
    const B=bow(S,CX,GY,R,w,Math.PI,{opacity:0});
    const lg=SW.map(([n,c],i)=>{const y=150+i*52;const sq=el('rect',{x:640,y:y-24,width:30,height:30,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,686,y,n,'v28');return sq;});
    tx(S,640,GY+70,'7','v96').setAttribute('fill',WO);tx(S,700,GY+70,'가지 색','v28');
    const o=grp(S,0);tx(o,CX,GY-R-24,'바깥 — 빨강','v28','middle');tx(o,CX,GY-R+7*w+52,'안쪽 — 보라','v28','middle');
    return ()=>play(1600,e=>B.forEach((b,i)=>{const on=e*7.4>i;b.setAttribute('opacity',on?1:0);if(on){lg[i].setAttribute('fill',SW[i][1]);lg[i].setAttribute('stroke',SW[i][1]);}}),()=>show(o));}}],
 sum:{lines:['해를 등지고 앞에 빗방울이<br>있으면 무지개가 보인다.','빗방울이 햇빛을<br>색깔별로 나눈다.','바깥은 빨강, 안쪽은 보라<br>— 흔히 일곱 색.'],
  words:[['빗방울','비가 되어 떨어지는 물 알갱이'],['빨주노초파남보','무지개 일곱 색을 줄여 부르는 말'],['등지다','뒤에 두다']]},
 end:{q:'해가 머리 위 높이 뜬 한낮엔 무지개가 잘 보일까?',a:'잘 안 보여. 무지개는 해가 낮게 떠 있을 때 잘 보여.',h:'어른과 함께<br>해를 등지고<br>분무기를 뿌려 봐.',btn:'분무기 칙',
  draw(S){const GY=620;wl(S,640,GY,1504,GY,W0);
   sun(S,700,200,30);tx(S,770,210,'해 — 등 뒤','v28');
   const NX=880,NY=460;tri(S,NX-60,GY,WO);tx(S,NX-60,GY+44,'나','v22','middle');
   wl(S,NX-60,GY-40,NX,NY,W0m);tx(S,NX,NY-24,'분무기','v28','middle');breathGuides(S,NX+10,NY,1490,[-70,-35,0,35,70],30);
   const P=[],q=rnd(4);while(P.length<300){const t=q(),x=NX+30+t*580,sp=20+t*170,y=NY-t*30+(q()-.5)*2*sp;if(y<GY-10&&y>260)P.push([x,y,t]);}
   const F=flowOut(S,NX+10,NY,P,W0,3.2);
   const B=bow(S,1250,GY,210,10,Math.PI,{opacity:0});const lab=grp(S,0);el('path',{d:'M1410,450L1450,220H1504',fill:'none',stroke:W0m,'stroke-width':2},lab);tx(lab,1504,200,'작은 무지개','v28','end');
   return ()=>F.run(1000,()=>play(700,e=>B.forEach((b,i)=>b.setAttribute('opacity',e*7.5>i?1:0)),()=>show(lab)));}}};
})();

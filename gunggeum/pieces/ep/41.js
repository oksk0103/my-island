(()=>{ // 41. 무지개는 어떻게 생길까 — 새 틀(v2) 관측 노트
// 잉크: 크림 W0 · 산호 WO(화면당 한 곳) · 보조 WA. 무지개 일곱 색은 색 자체가 내용 → 단색 띠 허용(그라데이션 없음).
// 무지개는 색 자체가 내용이라 일곱 띠만 단색으로 칠한다(바탕 보라남에 맞춰 채도를 낮춘 색, 그라데이션 없음). 나머지는 잉크 3색.
const SW=[['빨강','#E2614F'],['주황','#EE9A4D'],['노랑','#EBD27A'],['초록','#7DBB8C'],['파랑','#5B8FD6'],['남색','#5F6CC8'],['보라','#9A76C8']];   // v188: 39·40편과 같은 색
const sun=(p,cx,cy,r)=>{const g=el('g',{},p);el('circle',{cx,cy,r,fill:W0},g);for(let i=0;i<8;i++){const a=i*Math.PI/4;wl(g,cx+Math.cos(a)*(r+12),cy+Math.sin(a)*(r+12),cx+Math.cos(a)*(r+26),cy+Math.sin(a)*(r+26));}return g;};
const mv=(c,x,y)=>{c.setAttribute('cx',x.toFixed(1));c.setAttribute('cy',y.toFixed(1));};
const tri=(p,x,y,c)=>el('path',{d:`M${x},${y-30}L${x+18},${y}H${x-18}Z`,fill:c},p);
const lerp=(a,b,t)=>a+(b-a)*t;
// 반원 띠(왼쪽 끝에서 th만큼 돌아간 부채 띠). th=π면 온 반원.
const bandD=(cx,cy,r1,r2,th)=>{const P=(r,a)=>`${(cx+Math.cos(a)*r).toFixed(1)},${(cy+Math.sin(a)*r).toFixed(1)}`;const a1=Math.PI+Math.max(.001,th);
  return `M${P(r2,Math.PI)}A${r2},${r2} 0 0 1 ${P(r2,a1)}L${P(r1,a1)}A${r1},${r1} 0 0 0 ${P(r1,Math.PI)}Z`;};
const bow=(p,cx,cy,R,w,th=Math.PI,o={})=>SW.map(([n,c],i)=>el('path',Object.assign({d:bandD(cx,cy,R-(i+1)*w,R-i*w,th),fill:c},o),p));
const rain=(p,seed,n,x1,y1,x2,y2,col=WA)=>{const q=rnd(seed),L=[];for(let i=0;i<n;i++){const x=x1+q()*(x2-x1),y=y1+q()*(y2-y1-24);L.push(wl(p,x,y,x-4,y+20,col));}return L;};

const fea41=(S,id,x,y,w,h,b=28)=>{const d=el('defs',{},S),f=el('filter',{id:id+'f',x:'-20%',y:'-20%',width:'140%',height:'140%'},d);el('feGaussianBlur',{stdDeviation:b},f);const m=el('mask',{id,maskUnits:'userSpaceOnUse',x:x-60,y:y-60,width:w+120,height:h+120},d);el('rect',{x:x+b*1.3,y:y+b*1.3,width:w-b*2.6,height:h-b*2.6,fill:'#fff',filter:`url(#${id}f)`},m);return `url(#${id})`;};
const pic41=(S,src,x,y,w,h,id,op=.3)=>el('image',{href:src,x,y,width:w,height:h,opacity:op,mask:fea41(S,id,x,y,w,h)},S);
const up41=(im,done)=>play(1200,e=>im.setAttribute('opacity',(.3+.7*e).toFixed(2)),done);
EPX[41]={day:'과학',topic:'무지개',cat:'빛과 색',field:'과학',frame:'v2',
 cover:{h:'무지개는<br>어떻게<br>생길까?',draw(S){
   /* v206: 생성 일러스트(비 갠 들판의 무지개) */
   const P=el('g',{},S);el('image',{href:'art/41-rainbow.webp',x:860,y:150,width:500,height:500},P);
   el('circle',{cx:1110,cy:400,r:253,fill:'none',stroke:W0,'stroke-width':6},P);
   tx(S,1110,712,'비 갠 오후','v22m','middle');
   let on=false;return ()=>{if(on||calm())return;on=true;loop(S,t=>P.setAttribute('transform',`translate(0,${(4*Math.sin(t*.6)).toFixed(1)})`));};}},
 scenes:[
  /* v209: 매 수준 — 장면마다 생성 일러스트 한 장, 설명은 한 줄 */
  {k:'해를 등지고',h:'무지개는<br>해를 등져야 보인다',b:'해는 <em>내 뒤</em>에, 비는 내 앞에 있어야 해.',steps:['해와 비 보기'],
   draw(S){const X=640,Y=230,W=864,H=W*580/1376,k=W/1376,im=pic41(S,'art/41-sun.webp',X,Y,W,H,'m41a');
    const g=grp(S,0);tx(g,X+183*k,Y+H+44,'해는 뒤','v28','middle');tx(g,X+1010*k,Y-20,'비는 앞','v28','middle');
    return ()=>up41(im,()=>show(g));}},
  {k:'빗방울 속 길',h:'빗방울이<br>햇빛을 색깔별로 나눈다',b:'빗방울 속에서 꺾이고 튕기며 <em>색이 갈라져.</em>',steps:['햇빛 넣기'],
   draw(S){const X=640,Y=176,W=864,H=W*768/1376,k=W/1376,im=pic41(S,'art/41-drop.webp',X,Y,W,H,'m41b');
    const g=grp(S,0);tx(g,X+690*k,Y+H-20,'빗방울 하나','v28','middle');tx(g,X+20,Y+H+44,'색이 갈라져 나와','v28');
    return ()=>up41(im,()=>show(g));}},
  {k:'일곱 색 차례',h:'바깥은 빨강,<br>안쪽은 보라다',b:'무지개 색은 늘 같은 차례야.',steps:['무지개 보기'],
   draw(S){const X=640,Y=190,W=864,H=W*610/1093,k=W/1093,im=pic41(S,'art/41-pano.webp',X,Y,W,H,'m41c');
    const g=grp(S,0);tx(g,X+548*k,Y-18,'바깥은 빨강 · 안쪽은 보라','v28','middle');
    return ()=>up41(im,()=>show(g));}}],
 sum:{lines:['해를 등지고 앞에 빗방울이<br>있으면 무지개가 보인다.','빗방울이 햇빛을<br>색깔별로 나눈다.','바깥은 빨강, 안쪽은 보라<br>— 흔히 일곱 색.'],
  words:[['빗방울','비가 되어 떨어지는 물 알갱이'],['빨주노초파남보','무지개 일곱 색을 줄여 부르는 말'],['등지다','뒤에 두다']]},
 end:{q:'해가 머리 위 높이 뜬 한낮엔 무지개가 잘 보일까?',a:'잘 안 보여. 무지개는 해가 낮게 떠 있을 때 잘 보여.',h:'어른과 함께<br>해를 등지고<br>분무기를 뿌려 봐.',btn:'분무기 칙',
  draw(S){const W=363,H=520,X=1080,Y=150,im=pic41(S,'art/41-spray.webp',X,Y,W,H,'m41d');
   return ()=>up41(im);}}};
})();

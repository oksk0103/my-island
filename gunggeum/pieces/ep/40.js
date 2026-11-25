(()=>{ // 40. 노을은 왜 빨갈까 — 새 틀(v2) 관측 노트
// 잉크: 크림 W0 · 산호 WO(화면당 한 곳) · 보조 WA. 색 자체가 내용인 곳(햇빛 속 색, 노을 띠)만 단색 면 허용(그라데이션 없음).
// v188: 색이 주제인 편이라 빛과 노을은 실제 색으로 칠한다(부모가 2026-11-22 허락).
const SW=[['빨강','#E2614F'],['주황','#EE9A4D'],['노랑','#EBD27A'],['초록','#7DBB8C'],['파랑','#5B8FD6'],['남색','#5F6CC8'],['보라','#9A76C8']],DUSK='#E8774F';
const sun=(p,cx,cy,r,fill=W0,rays=true)=>{const g=el('g',{},p);el('circle',{cx,cy,r,fill},g);if(rays)for(let i=0;i<8;i++){const a=i*Math.PI/4;wl(g,cx+Math.cos(a)*(r+12),cy+Math.sin(a)*(r+12),cx+Math.cos(a)*(r+26),cy+Math.sin(a)*(r+26),W0);}return g;};
const mv=(c,x,y)=>{c.setAttribute('cx',x.toFixed(1));c.setAttribute('cy',y.toFixed(1));};
const tri=(p,x,y,c)=>el('path',{d:`M${x},${y-30}L${x+18},${y}H${x-18}Z`,fill:c},p);
const lerp=(a,b,t)=>a+(b-a)*t;
/* v209: 그림 네 귀를 바탕에 스며들게(상자처럼 안 보이게) */
const fea=(S,id,x,y,w,h,b=28)=>{const d=el('defs',{},S),f=el('filter',{id:id+'f',x:'-20%',y:'-20%',width:'140%',height:'140%'},d);el('feGaussianBlur',{stdDeviation:b},f);const m=el('mask',{id,maskUnits:'userSpaceOnUse',x:x-60,y:y-60,width:w+120,height:h+120},d);el('rect',{x:x+b*1.3,y:y+b*1.3,width:w-b*2.6,height:h-b*2.6,fill:'#fff',filter:`url(#${id}f)`},m);return `url(#${id})`;};

EPX[40]={day:'과학',topic:'노을',cat:'빛과 색',field:'과학',frame:'v2',
 cover:{h:'노을은 왜<br>빨갈까?',draw(S){
   /* v206: 생성 일러스트(해 질 녘 하늘). 아래에서 위로 빨강·주황·노랑·보라 순서(실제 노을 순서) */
   const P=el('g',{},S);el('image',{href:'art/40-sunset.webp',x:860,y:150,width:500,height:500},P);
   tx(S,1110,712,'해 질 녘 하늘','v22m','middle');
   let on=false;return ()=>{if(on||calm())return;on=true;loop(S,t=>P.setAttribute('transform',`translate(0,${(4*Math.sin(t*.6)).toFixed(1)})`));};}},
 scenes:[
  /* v209: 매 수준 그림(생성 일러스트 집·노을)으로 다시 그리고, 설명 문장은 한 줄로 */
  {k:'낮과 저녁',h:'저녁 햇빛은<br>공기를 길게 지난다',b:'해가 낮을수록 빛이 지나는 <em>공기 길</em>이 길어.',steps:['낮 해','저녁 해'],
   draw(S){const X=640,Y=176,W=864,H=482,k=W/1376,P=(x,y)=>[X+x*k,Y+y*k]; /* v209: 생성 일러스트 한 장(둥근 지구·공기층·두 해) 위에 이름표만 */
    el('image',{href:'art/40-atmo.webp',x:X,y:Y,width:W,height:H,mask:fea(S,'m40a',X,Y,W,H)},S);
    const g1=grp(S,0),g2=grp(S,0);let p=P(688,110);tx(g1,p[0]+44,p[1]+10,'낮 해','v28');p=P(688,250);tx(g1,p[0]+20,p[1],'짧게','v28');
    p=P(97,517);tx(g2,p[0],p[1]+64,'저녁 해','v28','middle');p=P(380,420);tx(g2,p[0],p[1]-36,'길게','v60','middle');
    return i=>show(i?g2:g1);}},
  {k:'파랑은 흩어져',h:'긴 길에서<br>파란빛은 흩어진다',b:'파란빛은 공기에 잘 튕겨서 <em>가는 길에 흩어져.</em>',steps:['햇빛 보내기'],
   draw(S){const X=640,Y=236,W=864,H=W*420/1110,k=W/1110,id='c40s1';
    const cp=el('clipPath',{id},el('defs',{},S)),cr=el('rect',{x:X,y:Y-40,width:W*.14,height:H+80},cp);
    el('g',{'clip-path':`url(#${id})`},S).appendChild(el('image',{href:'art/40-scatter.webp',x:X,y:Y,width:W,height:H,mask:fea(S,'m40b',X,Y,W,H,22)},S));
    const cap=grp(S,0);tx(cap,X+560*k,Y-24,'파랑은 흩어져','v28','middle');tx(cap,X+W,Y+H+48,'빨강·주황은 끝까지','v28','end');
    return ()=>play(1800,e=>cr.setAttribute('width',(W*(.14+.86*e)).toFixed(1)),()=>show(cap));}},
  {k:'남은 빛의 색',h:'남은 빨강·노랑이<br>노을을 칠한다',b:'그래서 저녁 하늘과 해가 <em>붉게</em> 보여.',steps:['저녁 하늘 보기'],
   draw(S){const X=640,Y=170,W=864,H=482;
    const im=el('image',{href:'art/40-dusk.webp',x:X,y:Y,width:W,height:H,preserveAspectRatio:'xMidYMid slice',opacity:.18,mask:fea(S,'m40c',X,Y,W,H)},S);
    const cap=grp(S,0);tx(cap,X+W,Y+H+56,'해 질 녘 하늘','v28','end');
    return ()=>play(1400,e=>im.setAttribute('opacity',(.18+.82*e).toFixed(2)),()=>show(cap));}}],
 sum:{lines:['저녁 햇빛은 공기를<br>길게 지나온다.','긴 길에서 파란빛은<br>거의 다 흩어진다.','남은 빨강·노랑이<br>노을을 만든다.'],
  words:[['노을','해 뜰 때나 질 때 하늘이 붉게 물드는 것'],['해 질 녘','해가 지려고 하는 무렵'],['흩어지다','여러 쪽으로 퍼져 나가다']]},
 end:{q:'해가 막 뜨는 아침에도 해는 낮게 있어. 그때 하늘은 어떨까?',a:'빛이 공기를 길게 지나와서, 아침에도 하늘이 붉게 물들 때가 있어.',h:'오늘 저녁<br>창밖 노을 색을<br>세어 봐.',btn:'창밖 보기',
  draw(S){const im=el('image',{href:'art/40-window.webp',x:930,y:150,width:520,height:501,opacity:.35},S); /* 창 그림은 사각형으로만 오려 둘레 벽이 남지 않게 */
   return ()=>play(1200,e=>im.setAttribute('opacity',(.35+.65*e).toFixed(2)));}}};
})();

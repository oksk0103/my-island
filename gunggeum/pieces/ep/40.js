(()=>{ // 40. 노을은 왜 빨갈까 — 새 틀(v2) 관측 노트
// 잉크: 크림 W0 · 산호 WO(화면당 한 곳) · 보조 WA. 색 자체가 내용인 곳(햇빛 속 색, 노을 띠)만 단색 면 허용(그라데이션 없음).
// v188: 색이 주제인 편이라 빛과 노을은 실제 색으로 칠한다(부모가 2026-11-22 허락).
const SW=[['빨강','#E2614F'],['주황','#EE9A4D'],['노랑','#EBD27A'],['초록','#7DBB8C'],['파랑','#5B8FD6'],['남색','#5F6CC8'],['보라','#9A76C8']],DUSK='#E8774F';
const sun=(p,cx,cy,r,fill=W0,rays=true)=>{const g=el('g',{},p);el('circle',{cx,cy,r,fill},g);if(rays)for(let i=0;i<8;i++){const a=i*Math.PI/4;wl(g,cx+Math.cos(a)*(r+12),cy+Math.sin(a)*(r+12),cx+Math.cos(a)*(r+26),cy+Math.sin(a)*(r+26),W0);}return g;};
const mv=(c,x,y)=>{c.setAttribute('cx',x.toFixed(1));c.setAttribute('cy',y.toFixed(1));};
const tri=(p,x,y,c)=>el('path',{d:`M${x},${y-30}L${x+18},${y}H${x-18}Z`,fill:c},p);
const lerp=(a,b,t)=>a+(b-a)*t;

EPX[40]={day:'과학',topic:'노을',cat:'빛과 색',field:'과학',frame:'v2',
 cover:{h:'노을은 왜<br>빨갈까?',draw(S){
   /* v206: 생성 일러스트(해 질 녘 하늘). 아래에서 위로 빨강·주황·노랑·보라 순서(실제 노을 순서) */
   const P=el('g',{},S);el('image',{href:'art/40-sunset.webp',x:860,y:150,width:500,height:500},P);
   tx(S,1110,712,'해 질 녘 하늘','v22m','middle');
   let on=false;return ()=>{if(on||calm())return;on=true;loop(S,t=>P.setAttribute('transform',`translate(0,${(4*Math.sin(t*.6)).toFixed(1)})`));};}},
 scenes:[
  /* v209: 매 수준 그림(생성 일러스트 집·노을)으로 다시 그리고, 설명 문장은 한 줄로 */
  {k:'낮과 저녁',h:'저녁 햇빛은<br>공기를 길게 지난다',b:'해가 낮을수록 빛이 지나는 <em>공기 길</em>이 길어.',steps:['낮 해','저녁 해'],
   draw(S){const GY=640,TOP=330,OX=1330,OY=GY-96;
    el('rect',{x:640,y:TOP,width:864,height:GY-TOP,fill:'#5B8FD6',opacity:.13},S);wl(S,640,TOP,1504,TOP,W0m,{'stroke-dasharray':'2 10'});tx(S,1504,TOP-18,'공기','v28','end');
    el('image',{href:'art/40-house.webp',x:OX-140,y:GY-146,width:280,height:146},S);
    const N={sx:OX,sy:190,ix:OX,iy:TOP},E={sx:700,sy:270};E.ix=E.sx+(TOP-E.sy)*(OX-E.sx)/(OY-E.sy);E.iy=TOP;
    sun(S,N.sx,N.sy,30);tx(S,N.sx-60,N.sy+10,'낮 해','v28','end');sun(S,E.sx,E.sy,30,DUSK);tx(S,E.sx+60,E.sy-24,'저녁 해','v28');
    const mk=(o,lab,lx,ly,cls)=>{const out=wl(S,o.sx,o.sy,o.sx,o.sy,W0m,{'stroke-dasharray':'2 10'}),inn=wl(S,o.ix,o.iy,o.ix,o.iy,o===N?W0:DUSK,{'stroke-width':5,'stroke-linecap':'round'}),g=grp(S,0);tx(g,lx,ly,lab,cls);return {o,out,inn,g};};
    const Ls=[mk(N,'짧게',OX+24,TOP+110,'v28'),mk(E,'길게',930,TOP+150,'v60')];
    return i=>{const l=Ls[i],o=l.o;
     play(500,e=>{l.out.setAttribute('x2',lerp(o.sx,o.ix,e));l.out.setAttribute('y2',lerp(o.sy,o.iy,e));},()=>
      play(900,e=>{l.inn.setAttribute('x2',lerp(o.ix,OX,e));l.inn.setAttribute('y2',lerp(o.iy,OY,e));},()=>show(l.g)));};}},
  {k:'파랑은 흩어져',h:'긴 길에서<br>파란빛은 흩어진다',b:'파란빛은 공기에 잘 튕겨서 <em>가는 길에 흩어져.</em>',steps:['햇빛 보내기'],
   draw(S){const GY=640,TOP=300,SX=720,SY=400,OX=1360,OY=GY-96;
    el('rect',{x:640,y:TOP,width:864,height:GY-TOP,fill:'#5B8FD6',opacity:.13},S);
    sun(S,SX,SY,36,DUSK);el('image',{href:'art/40-house.webp',x:OX-140,y:GY-146,width:280,height:146},S);
    const B=[[SW[0][1],-10,1],[SW[2][1],0,1],[SW[4][1],10,0]].map(([c,dy,go])=>({c,go,y0:SY+dy,l:wl(S,SX+40,SY+dy,SX+40,SY+dy,c,{'stroke-width':5,'stroke-linecap':'round'})}));
    const blue=B[2],SC=[[-40,-90],[30,-110],[70,-60],[-60,40],[50,70],[90,10]].map(([dx,dy])=>({dx,dy,l:wl(S,0,0,0,0,SW[4][1],{'stroke-width':4,'stroke-linecap':'round',opacity:0}),d:el('circle',{cx:0,cy:0,r:6,fill:SW[4][1],opacity:0},S)}));
    const cap1=grp(S,0);tx(cap1,1010,TOP-20,'파랑은 흩어져','v28','middle');const cap2=grp(S,0);tx(cap2,OX,GY+44,'빨강·노랑만 도착','v28','middle');
    const MX=1010;
    return ()=>play(1600,e=>{B.forEach(b=>{const tx2=b.go?lerp(SX+40,OX-30,e):lerp(SX+40,MX,Math.min(1,e*1.7)),ty2=b.go?lerp(b.y0,OY+(b.y0-SY)*.6,e):lerp(b.y0,b.y0+(MX-SX)*.25*(OY-SY)/(OX-SX)*0,Math.min(1,e*1.7));b.l.setAttribute('x2',tx2);b.l.setAttribute('y2',ty2);});
      const f=Math.max(0,(e-.6)/.4);SC.forEach(s=>{const x2=MX+s.dx*f,y2=blue.y0+s.dy*f;s.l.setAttribute('x1',MX);s.l.setAttribute('y1',blue.y0);s.l.setAttribute('x2',x2);s.l.setAttribute('y2',y2);s.l.setAttribute('opacity',f?1:0);s.d.setAttribute('cx',x2);s.d.setAttribute('cy',y2);s.d.setAttribute('opacity',f?1:0);});},
     ()=>{show(cap1);show(cap2);});}},
  {k:'남은 빛의 색',h:'남은 빨강·노랑이<br>노을을 칠한다',b:'그래서 저녁 하늘과 해가 <em>붉게</em> 보여.',steps:['저녁 하늘 보기'],
   draw(S){const X=640,Y=170,W=864,H=482;
    const im=el('image',{href:'art/40-dusk.webp',x:X,y:Y,width:W,height:H,preserveAspectRatio:'xMidYMid slice',opacity:.18},S);
    el('rect',{x:X,y:Y,width:W,height:H,fill:'none',stroke:W0m,'stroke-width':2},S);
    const cap=grp(S,0);tx(cap,X+W,Y+H+56,'해 질 녘 하늘','v28','end');
    return ()=>play(1400,e=>im.setAttribute('opacity',(.18+.82*e).toFixed(2)),()=>show(cap));}}],
 sum:{lines:['저녁 햇빛은 공기를<br>길게 지나온다.','긴 길에서 파란빛은<br>거의 다 흩어진다.','남은 빨강·노랑이<br>노을을 만든다.'],
  words:[['노을','해 뜰 때나 질 때 하늘이 붉게 물드는 것'],['해 질 녘','해가 지려고 하는 무렵'],['흩어지다','여러 쪽으로 퍼져 나가다']]},
 end:{q:'해가 막 뜨는 아침에도 해는 낮게 있어. 그때 하늘은 어떨까?',a:'빛이 공기를 길게 지나와서, 아침에도 하늘이 붉게 물들 때가 있어.',h:'오늘 저녁<br>창밖 노을 색을<br>세어 봐.',btn:'창밖 보기',
  draw(S){const im=el('image',{href:'art/40-window.webp',x:920,y:150,width:530,height:533,opacity:.35},S);
   return ()=>play(1200,e=>im.setAttribute('opacity',(.35+.65*e).toFixed(2)));}}};
})();

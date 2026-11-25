(()=>{ // 43. 그림자는 왜 생길까 — 새 틀(v2) 관측 노트
// 잉크: 크림 W0(빛줄기·물건) · 산호 WO(화면당 한 곳 — 빛이 나오는 곳) · 보조 WA(그림자 면). 사람 형체 없음 — 막대·장난감 블록.
const lerp=(a,b,t)=>a+(b-a)*t;
const mv=(c,x,y)=>{c.setAttribute('cx',x.toFixed(1));c.setAttribute('cy',y.toFixed(1));};
const rays=(p,s=W0m)=>el('g',{fill:'none',stroke:s,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},p);
// 막대 끝을 지나는 빛이 땅에 닿는 곳
const tipX=(sx,sy,bx,ty,gy)=>sx+(bx-sx)*(gy-sy)/(ty-sy);

const fea43=(S,id,x,y,w,h,b=28)=>{const d=el('defs',{},S),f=el('filter',{id:id+'f',x:'-20%',y:'-20%',width:'140%',height:'140%'},d);el('feGaussianBlur',{stdDeviation:b},f);const m=el('mask',{id,maskUnits:'userSpaceOnUse',x:x-60,y:y-60,width:w+120,height:h+120},d);el('rect',{x:x+b*1.3,y:y+b*1.3,width:w-b*2.6,height:h-b*2.6,fill:'#fff',filter:`url(#${id}f)`},m);return `url(#${id})`;};
const pic43=(S,src,x,y,w,h,id,op=1)=>el('image',{href:src,x,y,width:w,height:h,opacity:op,mask:fea43(S,id,x,y,w,h)},S);
const eq43=(p,x,y,pre,res,cls='v60',anc='start')=>{const t=tx(p,x,y,pre,cls,anc);const s=el('tspan',{fill:'#E9B872'},t);s.textContent=res;return t;};
const up43=(im,done)=>play(1200,e=>im.setAttribute('opacity',(.35+.65*e).toFixed(2)),done);
EPX[43]={day:'과학',topic:'그림자',cat:'빛과 그림자',field:'과학',frame:'v2',
 cover:{h:'그림자는<br>왜 생길까?',draw(S){
   /* v206: 생성 일러스트 */
   const P=el('g',{},S);el('image',{href:'art/43-shadow.webp',x:860,y:150,width:500,height:500},P);
   tx(S,1110,712,'해가 낮은 오후','v22m','middle');
   let on=false;return ()=>{if(on||calm())return;on=true;loop(S,t=>P.setAttribute('transform',`translate(0,${(4*Math.sin(t*.6)).toFixed(1)})`));};}},
 scenes:[
  /* v212: 매 수준 — 장면마다 생성 일러스트 한 장, 설명은 한 줄 */
  {k:'곧게 가는 빛',h:'빛은<br>곧게 나아간다',b:'빛은 휘지 않고 <em>곧은 길</em>로 쭉 가.',steps:['불 켜기'],
   draw(S){const LX=720,LY=400,WX=1460;el('circle',{cx:LX,cy:LY,r:28,fill:WO},S);tx(S,LX,LY+80,'전등','v28','middle');
    wl(S,WX,140,WX,660,W0);tx(S,WX,120,'벽','v28','middle');
    const g=rays(S);const Y=[];for(let i=0;i<9;i++)Y.push(170+i*57.5);Y.forEach(y=>el('path',{d:`M${LX+36},${LY+(y-LY)*36/(WX-LX)}L${WX},${y}`},g));
    const LT='#F3D27A',D=Y.map(y=>({y,c:wl(S,LX+36,LY+(y-LY)*36/(WX-LX),LX+36,LY+(y-LY)*36/(WX-LX),LT,{'stroke-width':3})}));   /* v188: 점 대신 자라나는 빛줄기 */
    const hit=Y.map(y=>wl(S,WX-16,y,WX,y,W0,{opacity:0}));
    const cap=grp(S,0);tx(cap,1100,700,'곧은 길로 쭉','v28','middle');
    return ()=>play(1400,e=>D.forEach((d,k)=>{d.c.setAttribute('x2',lerp(LX+36,WX,e).toFixed(1));d.c.setAttribute('y2',lerp(LY+(d.y-LY)*36/(WX-LX),d.y,e).toFixed(1));if(e>=1)hit[k].setAttribute('opacity',1);}),()=>{hit.forEach(h=>h.setAttribute('opacity',1));show(cap);});}},
  {k:'막힌 자리',h:'빛이 막힌 자리에<br>그림자가 생긴다',b:'빛이 못 지나가는 물건 <em>뒤쪽</em>이 그림자야.',steps:['손전등 켜기'],
   draw(S){const X=640,Y=176,W=864,H=482,k=W/1376,im=pic43(S,'art/43-toy.webp',X,Y,W,H,'m43b',.5);
    const g=grp(S,0);tx(g,X+1060*k,Y+H+44,'빛이 못 간 자리','v28','middle');
    return ()=>up43(im,()=>show(g));}},
  {k:'해 높이와 길이',h:'해가 낮으면<br>그림자가 길다',b:'한낮엔 그림자가 <em>짧고</em>, 아침·저녁엔 <em>길어</em>.',steps:['아침','한낮','저녁'],
   draw(S){const X=640,W=864,H=W*608/1495,Y=190,k=W/1495;pic43(S,'art/43-sun.webp',X,Y,W,H,'m43c');
    const P=[[8,468,'아침 · 길다'],[510,985,'한낮 · 짧다'],[1026,1485,'저녁 · 길다']].map(([a,b,t])=>{const r=el('rect',{x:X+a*k,y:Y,width:(b-a)*k,height:H,fill:'#13224A',opacity:.8},S);
      const g=grp(S,0);tx(g,X+(a+b)/2*k,Y+H+56,t,'v28','middle');return {r,g};});
    return i=>{const p=P[i];play(600,e=>p.r.setAttribute('opacity',(.8*(1-e)).toFixed(2)),()=>show(p.g));};}}],
 sum:{lines:['빛은 곧게 나아간다.','빛이 막힌 뒤쪽에<br>그림자가 생긴다.','해가 낮으면 그림자가 길고,<br>높으면 짧다.'],
  words:[['그림자','물건이 빛을 가려서 생긴 어두운 자리'],['한낮','낮의 한가운데'],['손전등','손에 들고 다니는 작은 전등']]},
 end:{q:'해가 내 등 뒤에 있으면 내 그림자는 어느 쪽에 생길까?',a:'내 앞쪽에 생겨. 내가 빛을 막아서 해 반대쪽에 그림자가 생기니까.',h:'어두운 방에서<br>손전등으로 장난감<br>그림자를 만들어 봐.',btn:'손전등 켜기',
  draw(S){const im=el('image',{href:'art/43-shadow.webp',x:1060,y:150,width:440,height:440,opacity:.35},S);
   return ()=>up43(im);}}};
})();

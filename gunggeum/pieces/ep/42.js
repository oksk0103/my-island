(()=>{ // 42. 소리는 어떻게 들릴까 — 떨림 · 새 틀(v2) 관측 노트
// 잉크: 크림 W0 · 산호 WO(화면당 한 곳 — 떨리는 것) · 보조 WA. 사람 형체 없음(귀는 길 도식만).
const lerp=(a,b,t)=>a+(b-a)*t;
const mv=(c,x,y)=>{c.setAttribute('cx',x.toFixed(1));c.setAttribute('cy',y.toFixed(1));};
// 양 끝이 묶인 줄: 가운데가 a만큼 휨
const strD=(x1,x2,y,a)=>`M${x1},${y}Q${(x1+x2)/2},${(y+a*2).toFixed(1)} ${x2},${y}`;
const peg=(p,x,y)=>el('rect',{x:x-8,y:y-40,width:16,height:80,fill:W0},p);
const arc=(p,x,y,r,c=W0)=>el('path',{d:`M${x},${y-r}A${r*1.6},${r*1.6} 0 0 1 ${x},${y+r}`,fill:'none',stroke:c,'stroke-width':2},p);
const arcD=(x,y,r)=>`M${x.toFixed(1)},${(y-r).toFixed(1)}A${(r*1.6).toFixed(1)},${(r*1.6).toFixed(1)} 0 0 1 ${x.toFixed(1)},${(y+r).toFixed(1)}`;

const fea42=(S,id,x,y,w,h,b=28)=>{const d=el('defs',{},S),f=el('filter',{id:id+'f',x:'-20%',y:'-20%',width:'140%',height:'140%'},d);el('feGaussianBlur',{stdDeviation:b},f);const m=el('mask',{id,maskUnits:'userSpaceOnUse',x:x-60,y:y-60,width:w+120,height:h+120},d);el('rect',{x:x+b*1.3,y:y+b*1.3,width:w-b*2.6,height:h-b*2.6,fill:'#fff',filter:`url(#${id}f)`},m);return `url(#${id})`;};
const pic42=(S,src,x,y,w,h,id,op=1)=>el('image',{href:src,x,y,width:w,height:h,opacity:op,mask:fea42(S,id,x,y,w,h)},S);
const eq42=(p,x,y,pre,res,cls='v60',anc='start')=>{const t=tx(p,x,y,pre,cls,anc);const s=el('tspan',{fill:'#E9B872'},t);s.textContent=res;return t;};
const up42=(im,done)=>play(1200,e=>im.setAttribute('opacity',(.35+.65*e).toFixed(2)),done);
EPX[42]={day:'과학',topic:'소리와 떨림',cat:'소리',field:'과학',frame:'v2',
 cover:{h:'소리는<br>어떻게<br>들릴까?',draw(S){
   /* v206: 생성 일러스트 */
   const P=el('g',{},S);el('image',{href:'art/42-drum.webp',x:860,y:150,width:500,height:500},P);
   tx(S,1110,712,'둥 — 북이 떨린다','v22m','middle');
   let on=false;return ()=>{if(on||calm())return;on=true;loop(S,t=>P.setAttribute('transform',`translate(0,${(4*Math.sin(t*.6)).toFixed(1)})`));};}},
 scenes:[
  /* v211: 매 수준 — 장면마다 생성 일러스트 한 장, 설명은 한 줄 */
  {k:'떨리는 물건',h:'소리는<br>떨림에서 시작된다',b:'북을 치면 북 가죽이 빠르게 <em>떨려</em>.',steps:['둥 치기'],
   draw(S){const X=640,Y=176,W=864,H=482,k=W/1376,im=pic42(S,'art/42-beat.webp',X,Y,W,H,'m42a',.5);
    const g=grp(S,0);tx(g,X+690*k,Y+H-10,'북 가죽이 떨려','v28','middle');
    return ()=>up42(im,()=>show(g));}},
  {k:'공기를 타고',h:'떨림은<br>공기를 타고 퍼진다',b:'떨림이 옆 공기를 <em>차례로</em> 밀며 퍼져.',steps:['종 울리기'],
   draw(S){const X=640,Y=176,W=864,H=482,k=W/1376,d=el('defs',{},S),cp=el('clipPath',{id:'c42b'},d),cr=el('rect',{x:X,y:Y-20,width:W*.3,height:H+40},cp);
    const g0=el('g',{'clip-path':'url(#c42b)'},S);g0.appendChild(pic42(S,'art/42-air.webp',X,Y,W,H,'m42b'));
    const g=grp(S,0);tx(g,X+W-20,Y+H+44,'공기가 차례로 떨려','v28','end');
    return ()=>play(1800,e=>cr.setAttribute('width',(W*(.3+.7*e)).toFixed(1)),()=>show(g));}},
  {k:'귀에 닿으면',h:'고막이 떨리면<br>소리가 들린다',b:'귀 안쪽 <em>고막</em>이 떨리면 소리로 들려.',steps:['귀 기울이기'],
   draw(S){const X=640,Y=176,W=864,H=482,k=W/1376,im=pic42(S,'art/42-ear.webp',X,Y,W,H,'m42c',.5);
    const g=grp(S,0);tx(g,X+1150*k,Y+H+44,'귀 안쪽 고막이 떨려','v28','middle');
    return ()=>up42(im,()=>show(g));}}],
 sum:{lines:['물건이 떨리면<br>소리가 난다.','떨림은 공기를 타고<br>차례로 퍼진다.','고막이 떨리고 뇌에 전해지면<br>소리가 들린다.'],
  words:[['떨림','빠르게 이리저리 흔들리는 것'],['귓구멍','소리가 들어가는 귀의 좁은 길'],['고막','귓구멍 끝에서 소리에 떨리는 곳']]},
 end:{q:'공기가 없는 우주에서도 소리가 들릴까?',a:'안 들려. 떨림을 옮겨 줄 공기가 없으니까.',h:'목에 손을 살짝 대고<br>"아—" 소리를 내 봐.',btn:'아— 소리 내기',
  draw(S){const W=440,H=499,X=1060,Y=150,im=pic42(S,'art/42-fork.webp',X,Y,W,H,'m42d',.35);
   return ()=>up42(im);}}};
})();

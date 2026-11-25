(()=>{
const C='#F3E9D2',A='#E9B872',B='#2C4A80',Cm='rgba(243,233,210,.45)';
const T=(p,x,y,s,cls,anc='start',fill)=>{const e=tx(p,x,y,s,cls,anc);if(fill)e.style.fill=fill;return e;};
const L=(p,x1,y1,x2,y2,c=Cm,o={})=>wl(p,x1,y1,x2,y2,c,o);
const run=(ms,fn,end)=>{if(calm()){fn(1);if(end)end();}else play(ms,fn,end);};
const op=(e,v)=>e.setAttribute('opacity',v);
const at=(e,x,y)=>e.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)})`);
const arc=(x0,y0,x1,y1,lift,t)=>{const mx=(x0+x1)/2,my=Math.min(y0,y1)-lift,u=1-t;return [u*u*x0+2*u*t*mx+t*t*x1,u*u*y0+2*u*t*my+t*t*y1];};
// 가로 눈금 띠
function band(p,x1,x2,y,n,maj,c=Cm){L(p,x1,y,x2,y,C);for(let i=0;i<=n;i++){const x=x1+(x2-x1)*i/n,m=maj&&i%maj===0;L(p,x,y,x,y+(m?18:9),m?C:c);}}
// 글자 하나를 경로 따라 옮기기(g는 translate 그룹)
function fly(g,x0,y0,x1,y1,lift,ms,end){run(ms,e=>{const [x,y]=arc(x0,y0,x1,y1,lift,e);at(g,x,y);},end);}
// 낱말 합치기: [a][drop] + 짐승 → [r]짐승. add가 있으면 'ㄹ'이 날아와 붙음
const CW=92;
function joinW(S,a,drop,add,r,mean,sub='두루 이르는 말',ex=null,y1=250,y2=520){const x0=640;
 const A=T(S,x0,y1,a,'v96'),D=T(S,x0+CW,y1,drop,'v96'),n=drop?2:1,P=T(S,x0+n*CW+60,y1,'+','v96','middle',Cm),Bz=T(S,x0+n*CW+120,y1,'짐승','v96');
 L(S,640,380,1504,380,Cm);T(S,640,420,'합치면','v22m');
 if(ex){L(S,640,590,1504,590,Cm);T(S,640,626,ex[0],'v22m');ex[1].forEach((w,i)=>T(S,640+i*260,690,w,'v60'));}L(S,640,y2+16,1000,y2+16,B,{'stroke-dasharray':'2 10'});
 const R=grp(S,0),r1=T(R,x0,y2,r,'v96','start',A_),r2=T(R,x0+CW,y2,'짐승','v96');const M=grp(S,0);T(M,1504,y2,mean,'v60','end');T(M,1504,y2+46,sub,'v22m','end');
 let G=null;if(add){G=el('g',{},S);T(G,0,0,add,'v96','start',A_);at(G,1380,170);op(G,0);T(S,1504,140,'+ ㄹ','v28','end');}
 const bx=x0+(drop?2:1)*CW+120;
 return ()=>{const wR=r1.getComputedTextLength()||CW;r2.setAttribute('x',x0+wR);const wA=A.getComputedTextLength()||CW;run(700,e=>{D.setAttribute('y',(y1+60*e).toFixed(1));op(D,1-e);op(P,1-e);if(G){op(G,1);const [x,y]=arc(1380,170,x0+wA,y1,40,e);at(G,x,y);}},
  ()=>run(900,e=>{A.setAttribute('y',(y1+(y2-y1)*e).toFixed(1));if(G)at(G,x0+wA,y1+(y2-y1)*e);Bz.setAttribute('x',(bx+(x0+wR-bx)*e).toFixed(1));Bz.setAttribute('y',(y1+(y2-y1)*e).toFixed(1));},
   ()=>{A.remove();if(G)G.remove();Bz.remove();show(R);show(M);T(S,x0,y1,a+(drop||'')+' + 짐승','v96','start',B);}));};}
const A_=A;

const fea10=(S,id,x,y,w,h,b=28)=>{const d=el('defs',{},S),f=el('filter',{id:id+'f',x:'-20%',y:'-20%',width:'140%',height:'140%'},d);el('feGaussianBlur',{stdDeviation:b},f);const m=el('mask',{id,maskUnits:'userSpaceOnUse',x:x-60,y:y-60,width:w+120,height:h+120},d);el('rect',{x:x+b*1.3,y:y+b*1.3,width:w-b*2.6,height:h-b*2.6,fill:'#fff',filter:`url(#${id}f)`},m);return `url(#${id})`;};
const pic10=(S,src,x,y,w,h,id)=>el('image',{href:src,x,y,width:w,height:h,mask:fea10(S,id,x,y,w,h)},S);
const eq10=(p,x,y,pre,res,cls='v60',anc='start')=>{const t=tx(p,x,y,pre,cls,anc);const s=el('tspan',{fill:A},t);s.textContent=res;return t;};
EPX[10]={day:'10일차',topic:'날짐승과 길짐승',cat:'말의 뜻',field:'국어',frame:'v2',
 cover:{h:'날짐승과<br>길짐승,<br>뭐가 다를까?',draw(S){
   /* v206: 생성 일러스트 까치(날짐승)·거북(길짐승) */
   T(S,640,300,'날짐승','v96');T(S,640,590,'길짐승','v96');L(S,640,430,1504,430,C);T(S,1504,400,'하늘','v22m','end');T(S,1504,470,'땅','v22m','end');
   const M=el('g',{},S);el('image',{href:'art/10-magpie.webp',x:-170,y:-109,width:340,height:218},M);
   const G=el('g',{},S);el('image',{href:'art/10-turtle.webp',x:-140,y:-140,width:280,height:140},G);
   const pm=t=>at(M,1150+20*Math.sin(t*.5),255+14*Math.sin(t*1.1)),pg=t=>at(G,1210+30*Math.sin(t*.25),600);
   pm(0);pg(0);let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,t=>{pm(t);pg(t);});};}},
 scenes:[
  /* v209: 매 수준 — 장면마다 생성 일러스트 한 장, 낱말 셈은 그림 위에 한 줄 */
  {k:'날짐승',h:'날아다니면<br>날짐승이다',b:'‘날다’의 ‘날’ + 짐승 = <em>나는 짐승</em>.',steps:['날다 + 짐승'],
   draw(S){const X=640,Y=160,W=864,H=482,k=W/1376;pic10(S,'art/10-sky.webp',X,Y,W,H,'m10a');
    const g=grp(S,0);eq10(g,X,Y+H+64,'날다 + 짐승 → ','날짐승');[[270,290,'까치'],[840,380,'독수리'],[960,600,'참새']].forEach(([x,y,n])=>tx(g,X+x*k,Y+y*k,n,'v28','middle'));
    return ()=>show(g);}},
  {k:'길짐승',h:'기어 다니면<br>길짐승이다',b:'‘기다’에 ㄹ이 붙어 ‘길’ + 짐승 = <em>기는 짐승</em>.',steps:['기다 + 짐승'],
   draw(S){const X=640,Y=176,W=864,H=482,k=W/1376;pic10(S,'art/10-ground.webp',X,Y,W,H,'m10b');
    const g=grp(S,0);eq10(g,X+40,Y+90,'기다 + 짐승 → ','길짐승');[[450,690,'거북'],[700,300,'뱀'],[1050,670,'도마뱀']].forEach(([x,y,n])=>tx(g,X+x*k,Y+y*k,n,'v28','middle'));
    return ()=>show(g);}},
  {k:'나눠 보기',h:'하늘이냐 땅이냐로<br>나눈다',b:'하늘은 날짐승, 땅은 길짐승.',steps:['나눠 보기'],
   draw(S){const X=640,Y=176,W=864,H=482,k=W/1376;pic10(S,'art/10-split.webp',X,Y,W,H,'m10c');
    const g=grp(S,0);tx(g,X+W-36,Y+70,'날짐승','v60','end').style.fill=A;tx(g,X+W-36,Y+H-36,'길짐승','v60','end').style.fill=A;
    return ()=>show(g);}}],
 sum:{lines:['날아다니는 짐승을<br>날짐승이라고 한다.','기어 다니는 짐승을<br>길짐승이라고 한다.','사는 곳에 따라 산짐승,<br>들짐승이라고도 한다.'],
  words:[['날짐승','날아다니는 짐승'],['길짐승','기어 다니는 짐승'],['산짐승','산에 사는 짐승']]},
 end:{q:'산에 사는 짐승은 뭐라고 할까?',a:'산짐승. 들에 사는 짐승은 들짐승이야.',h:'동네에서 본<br>날짐승을 말해 봐.',btn:'합쳐 보기',
  draw(S){const W=347,H=500,X=1110,Y=140,im=el('image',{href:'art/10-mountain.webp',x:X,y:Y,width:W,height:H,opacity:.35,mask:fea10(S,'m10d',X,Y,W,H)},S);
   const g=grp(S,0);eq10(g,X+W/2,Y+H+56,'산 + 짐승 → ','산짐승','v28','middle');
   return ()=>play(1200,e=>im.setAttribute('opacity',(.35+.65*e).toFixed(2)),()=>show(g));}}};
})();

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

EPX[10]={day:'10일차',topic:'날짐승과 길짐승',cat:'말의 뜻',field:'국어',frame:'v2',
 cover:{h:'날짐승과<br>길짐승,<br>뭐가 다를까?',draw(S){
   T(S,640,300,'날짐승','v96');T(S,640,590,'길짐승','v96');L(S,640,430,1504,430,C);T(S,1504,400,'하늘','v22m','end');T(S,1504,470,'땅','v22m','end');
   const up=el('path',{d:'M1000,370Q1200,330 1460,160',fill:'none',stroke:Cm,'stroke-width':2,'stroke-dasharray':'2 10'},S);
   const dn=el('path',{d:'M1000,600C1080,570 1120,630 1200,600S1320,570 1460,600',fill:'none',stroke:Cm,'stroke-width':2,'stroke-dasharray':'2 10'},S);
   const a=wdot(S,1000,370,10,A),b=wdot(S,1000,600,10,C);const LU=up.getTotalLength(),LD=dn.getTotalLength();let on=false;
   const put=(d,p,L,e)=>{const q=p.getPointAtLength(L*e);d.setAttribute('cx',q.x.toFixed(1));d.setAttribute('cy',q.y.toFixed(1));};
   return ()=>{if(on||calm())return;on=true;loop(S,t=>{const c=t%5,e=c<2.5?EO(c/2.5):1;put(a,up,LU,e);put(b,dn,LD,Math.min(1,c/4));});};}},
 scenes:[
  {k:'날짐승',h:'날아다니면<br>날짐승이다',b:'‘날다’가 ‘날’로 바뀌어 ‘짐승’ 앞에 붙었어. <em>나는 짐승</em>, 날아다니는 짐승을 두루 이르는 말이야.',steps:['날다 + 짐승'],
   draw(S){return joinW(S,'날','다',null,'날','나는 짐승',undefined,['날짐승 — 예',['참새','까치','독수리']]);}},
  {k:'길짐승',h:'기어 다니면<br>길짐승이다',b:'‘기다’에 ‘ㄹ’이 붙어 ‘길’이 됐어. <em>기는 짐승</em>, 기어 다니는 짐승을 두루 이르는 말이야.',steps:['기다 + 짐승'],
   draw(S){return joinW(S,'기','다','ㄹ','길','기는 짐승',undefined,['길짐승 — 예',['뱀','거북','도마뱀']]);}},
  {k:'나눠 보기',h:'하늘이냐 땅이냐로<br>나눈다',b:'하늘을 날아다니면 날짐승, 땅에서 기어 다니면 길짐승이야.',steps:['나눠 보기'],
   draw(S){L(S,640,440,1504,440,C);T(S,1504,190,'날짐승','v60','end',A);T(S,1504,226,'하늘','v22m','end');T(S,1504,640,'길짐승','v60','end');T(S,1504,676,'땅','v22m','end');
    const W=[['참새',1],['뱀',0],['독수리',1],['거북',0],['까치',1],['도마뱀',0]],k=[0,0];
    [0,1].forEach(s=>[0,1,2].forEach(j=>L(S,660+j*230,(s?300:580)+16,820+j*230,(s?300:580)+16,B,{'stroke-dasharray':'2 10'})));
    const G=W.map(([w,s],i)=>{const g=el('g',{},S);T(g,0,0,w,'v60','middle');const j=k[s]++;const o={g,x0:700+i*130,y0:420,x1:740+j*230,y1:s?300:580,s0:28/60};
     const set=(x,y,sc)=>g.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(3)})`);o.set=set;set(o.x0,o.y0,o.s0);return o;});
    return ()=>G.forEach((o,i)=>setTimeout(()=>run(900,e=>{const [x,y]=arc(o.x0,o.y0,o.x1,o.y1,o.y1<400?60:-10,e);o.set(x,y,o.s0+(1-o.s0)*e);}),calm()?0:i*150));}}],
 sum:{lines:['날아다니는 짐승을<br>날짐승이라고 한다.','기어 다니는 짐승을<br>길짐승이라고 한다.','사는 곳에 따라 산짐승,<br>들짐승이라고도 한다.'],
  words:[['날짐승','날아다니는 짐승'],['길짐승','기어 다니는 짐승'],['산짐승','산에 사는 짐승']]},
 end:{q:'산에 사는 짐승은 뭐라고 할까?',a:'산짐승. 들에 사는 짐승은 들짐승이야.',h:'동네에서 본<br>날짐승을 말해 봐.',btn:'합쳐 보기',
  draw(S){const go=joinW(S,'산','',null,'산','산에 사는 짐승','들에 살면 들짐승',['짐승을 나눠 부르는 말',['날짐승','길짐승','들짐승']]);return go;}}};
})();

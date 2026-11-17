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
// 세기 띠 15~21세기
function centBand(S,x1,x2,y){band(S,x1,x2,y,6,1);const X=c=>x1+(x2-x1)*(c-15)/6;for(let c=15;c<=21;c++)T(S,X(c),y+50,c+'세기','v22m','middle');return X;}

EPX[9]={day:'9일차',topic:'어린이',cat:'말의 유래',field:'국어',frame:'v2',
 cover:{h:'‘어리다’는<br>원래 무슨<br>뜻이었을까?',draw(S){
   L(S,640,150,1504,150,Cm);T(S,640,128,'낱말의 뜻도 바뀐다','v22m');
   T(S,1000,360,'어리다','v96','middle');T(S,1250,360,'=','v96','middle');T(S,1400,360,'?','v96','middle',A);
   const X=centBand(S,700,1460,560);wdot(S,X(15),560,9,C);wdot(S,X(21),560,9,C);T(S,X(15),520,'옛날','v28','middle');T(S,X(21),520,'지금','v28','middle');
   return ()=>{};}},
 scenes:[
  {k:'옛날 뜻',h:'옛날 ‘어리다’는<br>어리석다는 뜻이다',b:'15세기, 지금부터 500년도 더 전에는 ‘어리다’가 <em>어리석다</em>는 뜻이었어. 나이가 적다는 뜻은 없었어.',steps:['옛날로 가 보기'],
   draw(S){const X=centBand(S,700,1460,580);
    T(S,1460,200,'21세기 · 지금','v22m','end');T(S,1460,290,'어리다','v60','end');T(S,1460,400,'나이가 적다','v60','end');
    T(S,700,200,'15세기','v22m');const q=T(S,700,400,'?','v60','start',B);L(S,700,330,1460,330,Cm);
    const past=grp(S,0);T(past,700,400,'어리석다','v60','start',A);
    const g=el('g',{},S);T(g,0,0,'어리다','v60','start');at(g,1280,290);op(g,0);el('path',{d:'M1440,470Q1080,400 720,470',fill:'none',stroke:B,'stroke-width':2,'stroke-dasharray':'2 10'},S);T(S,1080,500,'500년도 더 전으로','v22m','middle');
    const dot=wdot(S,X(21),580,9,C);
    return ()=>{op(g,1);run(1200,e=>{const [x,y]=arc(1280,290,700,290,60,e);at(g,x,y);dot.setAttribute('cx',(X(21)+(X(15)-X(21))*e).toFixed(1));},()=>{q.remove();show(past);});};}},
  {k:'젊다',h:'아기도 옛날엔<br>‘젊다’고 했다',b:'15~16세기에는 아기도 젊은이도 모두 <em>젊다</em>고 했어. 16세기 말부터 ‘어리다’가 나이가 적다는 뜻으로도 쓰였어.',steps:['옛날','지금'],
   draw(S){T(S,950,220,'아기','v60','middle');T(S,1310,220,'젊은이','v60','middle');L(S,640,260,1504,260,C);L(S,640,450,1504,450,Cm);L(S,640,640,1504,640,Cm);
    T(S,640,370,'옛날','v28');T(S,640,400,'15~16세기','v22m');T(S,640,560,'지금','v28');
    [412,592].forEach(y=>{L(S,800,y,1100,y,B,{'stroke-dasharray':'2 10'});L(S,1160,y,1460,y,B,{'stroke-dasharray':'2 10'});});
    const old=grp(S,0),bar=L(old,800,330,800,330,C);L(old,800,318,800,342,C);const end=L(old,1460,318,1460,342,C);op(end,0);
    const ow=grp(old,0);T(ow,1130,400,'젊다','v60','middle');T(ow,1130,436,'옛말 ‘졈다’','v22m','middle');
    const now=grp(S,0);T(now,950,580,'어리다','v60','middle',A);T(now,1310,580,'젊다','v60','middle');now.setAttribute('transform','translate(0,30)');
    return i=>{if(i===0){show(old);run(1000,e=>bar.setAttribute('x2',(800+660*e).toFixed(1)),()=>{op(end,1);show(ow);});}
     else{show(now);run(700,e=>now.setAttribute('transform',`translate(0,${(30*(1-e)).toFixed(1)})`));}};}},
  {k:'어린이',h:'그래서 어린이,<br>젊은이, 늙은이',b:'‘어린이’라는 말은 17세기에도 쓰였어. 1923년 <em>방정환</em> 선생님과 친구들이 첫 어린이날을 열었어.',steps:['나이 순서로','어린이날'],
   draw(S){const W=['어린이','젊은이','늙은이'].map((w,i)=>T(S,750+i*290,280,w,'v60','middle',B));
    [0,1].forEach(i=>{const x=865+i*290;L(S,x,262,x+60,262,Cm);L(S,x+46,252,x+60,262,Cm);L(S,x+46,272,x+60,262,Cm);});
    T(S,640,180,'나이 순서','v22m');L(S,640,340,1504,340,Cm);
    const x1=700,x2=1460,y=560;band(S,x1,x2,y,8,0);
    const P=[[x1,'17세기','‘어린이’가 쓰임'],[1180,'1923년 5월 1일','첫 어린이날'],[x2,'지금','어린이날 5월 5일']];
    P.forEach(([x,a,b],i)=>{wdot(S,x,y,7,C);T(S,x,y+50,a,'v22m',i===0?'start':i===2?'end':'middle');if(i!==1)T(S,x,y-30,b,'v22',i===0?'start':'end');});
    const lab=grp(S,0);T(lab,1180,y-70,'첫 어린이날','v60','middle');T(lab,1180,y-30,'방정환과 색동회','v22','middle');
    const dot=wdot(S,x1,y,10,A);op(dot,0);
    return i=>{if(i===0)W.forEach((w,k)=>setTimeout(()=>{w.style.transition='fill .5s';w.style.fill=C;},calm()?0:k*350));
     else{op(dot,1);run(1200,e=>dot.setAttribute('cx',(x1+(1180-x1)*e).toFixed(1)),()=>show(lab));}};}}],
 sum:{lines:['15세기에 ‘어리다’는<br>어리석다는 뜻이었다.','그때는 아기도 젊은이도<br>‘젊다’고 했다.','지금은 어린이, 젊은이,<br>늙은이로 나눠 부른다.'],
  words:[['어리석다','슬기롭지 못하고 둔하다'],['세기','100년을 한 묶음으로 세는 말'],['방정환','첫 어린이날을 함께 연 사람']]},
 end:{q:'15세기에는 아기를 보고 뭐라고 했을까?',a:'젊다. 그때는 아기도 젊은이도 모두 젊다고 했어.',h:'가족에게 ‘어리다’의<br>옛날 뜻을<br>알려 줘.',btn:'옛말로 보기',
  draw(S){L(S,700,150,1504,150,Cm);const lab=T(S,700,200,'지금 말로','v22m');
   T(S,700,380,'아기는','v96');const w=T(S,1060,380,'어리다','v96');const n=T(S,1060,380,'젊다','v96','start',A);op(n,0);
   L(S,700,480,1504,480,Cm);T(S,700,560,'15세기','v28');T(S,700,600,'어리다 = 어리석다','v22m');T(S,1504,560,'지금','v28','end');T(S,1504,600,'어리다 = 나이가 적다','v22m','end');
   return ()=>{lab.textContent='15세기 말로';run(900,e=>{w.setAttribute('y',(380+60*e).toFixed(1));op(w,1-e);n.setAttribute('y',(320+60*e).toFixed(1));op(n,e);});};}}};
})();

(()=>{ // 11. 이따가와 있다가 — 새 틀(v2) 이야기: 시간 띠 · 낱말 분해
const C='#F3E9D2',A='#E9B872',B='#2C4A80',Cm='rgba(243,233,210,.45)';
const T=(p,x,y,s,cls,anc,col)=>tx(p,x,y,s,cls,anc||'start',col?{style:'fill:'+col}:{});
const R=(p,x,y,parts,anc='start')=>{const t=el('text',{x,y,'text-anchor':anc},p);t.sp=parts.map(([s,cls,col])=>{const sp=el('tspan',{class:cls},t);if(col)sp.setAttribute('style','fill:'+col);sp.textContent=s.replace(/ /g,' ');return sp;});return t;};
const go=(ms,fn,end)=>{if(calm()){fn(1,1);if(end)end();}else play(ms,fn,end);};
// 시간 띠: x1~x2, n칸, 다섯 칸마다 긴 눈금
function ribbon(p,x1,x2,y,n,big=5){wl(p,x1,y,x2,y,C);for(let i=0;i<=n;i++){const x=x1+(x2-x1)*i/n;wl(p,x,y,x,y+(i%big===0?18:10),i%big===0?C:Cm);}}
const mv=(c,x,y)=>{c.setAttribute('cx',x.toFixed(1));c.setAttribute('cy',y.toFixed(1));};

const fea11=(S,id,x,y,w,h,b=28)=>{const d=el('defs',{},S),f=el('filter',{id:id+'f',x:'-20%',y:'-20%',width:'140%',height:'140%'},d);el('feGaussianBlur',{stdDeviation:b},f);const m=el('mask',{id,maskUnits:'userSpaceOnUse',x:x-60,y:y-60,width:w+120,height:h+120},d);el('rect',{x:x+b*1.3,y:y+b*1.3,width:w-b*2.6,height:h-b*2.6,fill:'#fff',filter:`url(#${id}f)`},m);return `url(#${id})`;};
const pic11=(S,src,x,y,w,h,id,op=1)=>el('image',{href:src,x,y,width:w,height:h,opacity:op,mask:fea11(S,id,x,y,w,h)},S);
const eq11=(p,x,y,pre,res,cls='v60',anc='start')=>{const t=tx(p,x,y,pre,cls,anc);const s=el('tspan',{fill:'#E9B872'},t);s.textContent=res;return t;};
const up11=(im,done)=>play(1200,e=>im.setAttribute('opacity',(.35+.65*e).toFixed(2)),done);
EPX[11]={day:'11일차',topic:'이따가와 있다가',cat:'맞춤법',field:'국어',frame:'v2',
 cover:{h:'이따가 만나?<br>있다가 만나?',draw(S){
   // 활자 판: 두 낱말을 글자 칸으로 나눠 위아래로
   const X=[900,1090,1280],Y=[330,560];
   X.forEach((x,i)=>{if(i)wl(S,x-95,140,x-95,620,Cm);});wl(S,805,140,805,620,Cm);wl(S,1375,140,1375,620,Cm);
   wl(S,805,400,1375,400,Cm);
   ['이따가','있다가'].forEach((w,j)=>[...w].forEach((ch,i)=>T(S,X[i],Y[j],ch,'vs160','middle')));
   T(S,660,Y[0]-50,'하나','v22m');T(S,660,Y[1]-50,'둘','v22m');
   wl(S,640,660,1504,660,Cm);T(S,640,700,'두 낱말 · 앞의 두 글자가 달라','v22m');
   const u=[0,1].map(j=>wl(S,X[0]-80,Y[j]+28,X[0]-80,Y[j]+28,A,{'stroke-width':4,'stroke-linecap':'butt'}));
   return ()=>{const L=X[1]+80;go(900,e=>u.forEach(l=>l.setAttribute('x2',(X[0]-80+(L-X[0]+80)*e).toFixed(1))));};}},
 scenes:[
  /* v211: 매 수준 — 장면마다 생성 일러스트 한 장, 설명은 한 줄 */
  {k:'이따가',h:'이따가는<br>‘조금 뒤에’다',b:'<em>이따가</em>는 ‘조금 지난 뒤에’라는 한 낱말이야.',steps:['이따가 보기'],
   draw(S){const X=640,Y=176,W=864,H=482;pic11(S,'art/11-clock.webp',X,Y,W,H,'m11a');
    const g=grp(S,0);eq11(g,X,Y+H+64,'이따가 = ','조금 뒤에');
    return ()=>show(g);}},
  {k:'있다가',h:'있다가는<br>‘있다’에서 왔다',b:'‘집에 <em>있다가</em> 나갈게’처럼 머물다가 다른 걸 할 때 써.',steps:['있다 + 가'],
   draw(S){const X=640,Y=176,W=864,H=482;pic11(S,'art/11-stay.webp',X,Y,W,H,'m11b');
    const g=grp(S,0);eq11(g,X,Y+H+64,'있다 + 가 → ','있다가');
    return ()=>show(g);}},
  {k:'시간 말',h:'앞에 시간 말이<br>오면 있다가',b:'‘10분 <em>있다가</em>’처럼 시간 말 뒤엔 있다가.',steps:['10분 있다가'],
   draw(S){const X=640,W=864,H=W*580/1016,Y=170;pic11(S,'art/11-hourglass.webp',X,Y,W,H,'m11c');
    const g=grp(S,0);eq11(g,X,Y+H+56,'10분 ','있다가');
    return ()=>show(g);}}],
 sum:{lines:['이따가는 ‘조금 지난 뒤에’라는<br>한 낱말이다.','있다가는 ‘있다’가<br>모양을 바꾼 말이다.','‘10분 있다가’처럼 시간 말이<br>앞에 오면 있다가.'],
  words:[['이따','‘이따가’를 줄인 말'],['머무르다','가지 않고 한곳에 그대로 있다'],['시간 말','10분, 조금처럼 때를 나타내는 말']]},
 end:{q:'‘이따 봐’는 맞는 말일까?',a:'맞아. ‘이따’는 ‘이따가’를 줄인 말이야.',h:'오늘 ‘이따가’를<br>몇 번 말하는지<br>세어 봐.',btn:'세어 보기',
  draw(S){const X=680,W=824,H=W*768/1376,Y=220,im=pic11(S,'art/11-clock.webp',X,Y,W,H,'m11d',.35);
   return ()=>up11(im);}}};
})();

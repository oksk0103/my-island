(()=>{ // 11. 이따가와 있다가 — 새 틀(v2) 이야기: 시간 띠 · 낱말 분해
const C='#F3E9D2',A='#E9B872',B='#2C4A80',Cm='rgba(243,233,210,.45)';
const T=(p,x,y,s,cls,anc,col)=>tx(p,x,y,s,cls,anc||'start',col?{style:'fill:'+col}:{});
const R=(p,x,y,parts,anc='start')=>{const t=el('text',{x,y,'text-anchor':anc},p);t.sp=parts.map(([s,cls,col])=>{const sp=el('tspan',{class:cls},t);if(col)sp.setAttribute('style','fill:'+col);sp.textContent=s.replace(/ /g,' ');return sp;});return t;};
const go=(ms,fn,end)=>{if(calm()){fn(1,1);if(end)end();}else play(ms,fn,end);};
// 시간 띠: x1~x2, n칸, 다섯 칸마다 긴 눈금
function ribbon(p,x1,x2,y,n,big=5){wl(p,x1,y,x2,y,C);for(let i=0;i<=n;i++){const x=x1+(x2-x1)*i/n;wl(p,x,y,x,y+(i%big===0?18:10),i%big===0?C:Cm);}}
const mv=(c,x,y)=>{c.setAttribute('cx',x.toFixed(1));c.setAttribute('cy',y.toFixed(1));};

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
  {k:'이따가',h:'이따가는<br>‘조금 뒤에’다',b:'<em>이따가</em>는 한 낱말이야. ‘조금 지난 뒤에’라는 뜻이고, 줄여서 ‘이따’라고도 해.',steps:['바꿔 보기'],
   draw(S){R(S,660,230,[['이따가','vs96'],[' 전화할게.','v60']]);
    const eq=grp(S,0),gh=grp(S,1);R(gh,660,350,[['= ','v60',Cm],['…… 전화할게.','v60',Cm]]);R(eq,660,350,[['= ','v60',Cm],['조금 뒤에','v60'],[' 전화할게.','v60']]);
    const y=520,x1=680,x2=1480;ribbon(S,x1,x2,y,20);T(S,x1,y+60,'지금','v28');T(S,x2,y+60,'한참 뒤','v28','end');
    const tx_=x1+(x2-x1)*7/20,mark=grp(S,0);wl(mark,tx_,y-22,tx_,y,C);T(mark,tx_,y+60,'조금 뒤','v28','middle');
    const w=T(S,x1,y-30,'이따가','v28','middle');const d=wdot(S,x1,y,10,A);
    wl(S,640,650,1504,650,Cm);T(S,640,690,'이따가 = 조금 지난 뒤에 · 줄이면 ‘이따’','v22m');
    return ()=>go(1100,e=>{const x=x1+(tx_-x1)*e;mv(d,x,y);w.setAttribute('x',x.toFixed(1));},()=>{show(mark);gh.setAttribute('opacity',0);show(eq);});}},
  {k:'있다가',h:'있다가는<br>‘있다’에서 왔다',b:'<em>있다가</em>는 ‘있다’가 모양을 바꾼 말이야. ‘집에 있다가 나갈게’처럼 어디에 머무르다가 다른 걸 할 때 써.',steps:['따라가 보기'],
   draw(S){R(S,660,220,[['있다','vs96'],['  →  ','v60',Cm],['있다가','vs96']]);
    wl(S,664,250,850,250,C);wl(S,664,250,664,238,C);wl(S,850,250,850,238,C);T(S,664,290,'머무르다 · 그대로 있다','v22m');
    R(S,660,410,[['집에 ','v60'],['있다가','v60'],[' 나갈게.','v60']]);
    const y=540,x1=680,x2=1480,door=1120;wl(S,x1,y,x2,y,C);wl(S,door,y-40,door,y+40,C);
    T(S,(x1+door)/2,y-30,'집','v60','middle');T(S,(door+x2)/2,y-30,'밖','v60','middle');
    for(let x=x1;x<=door;x+=40)wl(S,x,y,x,y+10,Cm);
    const c1=grp(S,0),c2=grp(S,0);T(c1,(x1+door)/2,y+62,'머무르다가','v28','middle');T(c2,(door+x2)/2,y+62,'나가','v28','middle');
    const d=wdot(S,x1+40,y,10,A);
    wl(S,640,660,1504,660,Cm);T(S,640,700,'‘가지 말고 거기 있어’의 있다 = 머무르다','v22m');
    return ()=>go(700,e=>mv(d,x1+40+(door-60-x1-40)*e,y),()=>{show(c1);go(600,e=>mv(d,door-60+(1340-door+60)*e,y-Math.sin(Math.PI*Math.min(1,e*1.2))*40),()=>show(c2));});}},
  {k:'시간 말',h:'앞에 시간 말이<br>오면 있다가',b:'‘10분 <em>있다가</em>’처럼 앞에 시간을 나타내는 말이 오면 있다가야. 그냥 조금 뒤면 이따가.',steps:['이따가','10분 있다가'],
   draw(S){const x1=680,x2=1480;
    R(S,660,180,[['이따가','v60'],[' 전화할게.','v60']]);const ya=280;ribbon(S,x1,x2,ya,20);T(S,x1,ya+52,'지금','v28');
    R(S,660,440,[['10분 ','v60'],['있다가','v60'],[' 전화할게.','v60']]);const yb=540;ribbon(S,x1,x2,yb,10,10);
    [0,5,10].forEach(i=>T(S,x1+(x2-x1)*i/10,yb+56,i+'분','v28','middle'));
    const da=wdot(S,x1,ya,9,C),db=wdot(S,x1,yb,9,C);
    const la=grp(S,0);T(la,x1+(x2-x1)*.35,ya-26,'조금 뒤','v28','middle');
    const lb=grp(S,0);T(lb,x2,yb-26,'딱 10분 뒤','v28','end',A);
    wl(S,640,650,1504,650,Cm);T(S,640,690,'‘10분 있다가’ · ‘조금 있다가’ — 시간 말 + 있다가','v22m');
    return i=>{if(i===0)go(900,e=>mv(da,x1+(x2-x1)*.35*e,ya),()=>show(la));
     else{db.setAttribute('fill',A);go(1100,e=>{const k=Math.min(10,Math.floor(e*10+1e-6));mv(db,x1+(x2-x1)*(k/10+(e*10-k>0&&k<10?0:0)),yb);},()=>show(lb));}};}}],
 sum:{lines:['이따가는 ‘조금 지난 뒤에’라는<br>한 낱말이다.','있다가는 ‘있다’가<br>모양을 바꾼 말이다.','‘10분 있다가’처럼 시간 말이<br>앞에 오면 있다가.'],
  words:[['이따','‘이따가’를 줄인 말'],['머무르다','가지 않고 한곳에 그대로 있다'],['시간 말','10분, 조금처럼 때를 나타내는 말']]},
 end:{q:'‘이따 봐’는 맞는 말일까?',a:'맞아. ‘이따’는 ‘이따가’를 줄인 말이야.',h:'오늘 ‘이따가’를<br>몇 번 말하는지<br>세어 봐.',btn:'세어 보기',
  draw(S){const x1=680,x2=1480,y=520;T(S,660,230,'이따가','vs96');T(S,1000,230,'몇 번?','v60',Cm);
   wl(S,x1,y,x2,y,C);for(let i=0;i<=24;i++){const x=x1+(x2-x1)*i/24;wl(S,x,y,x,y+(i%6===0?18:10),i%6===0?C:Cm);}
   [['아침',0],['점심',.5],['저녁',1]].forEach(([s,t],i)=>T(S,x1+(x2-x1)*t,y+60,s,'v28',i===0?'start':i===2?'end':'middle'));
   const P=[.12,.3,.46,.63,.86],L=P.map((t,i)=>wl(S,x1+(x2-x1)*t,y,x1+(x2-x1)*t,y,i===P.length-1?A:C,{'stroke-width':4,'stroke-linecap':'butt'}));
   const n=T(S,1504,380,'0번','v96','end');T(S,640,690,'예) 말할 때마다 띠 위에 한 줄','v22m');wl(S,640,650,1504,650,Cm);
   return ()=>{let k=0;const step=()=>{const l=L[k];go(200,e=>l.setAttribute('y2',(y-100*e).toFixed(1)),()=>{k++;n.textContent=k+'번';if(k<L.length)setTimeout(step,calm()?0:40);});};step();};}}};
})();

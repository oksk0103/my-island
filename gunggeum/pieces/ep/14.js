(()=>{ // 14. 며칠 — 새 틀(v2) 이야기: 달력 표 · 소리 줄기 표 · 뿌리 도식
const C='#F3E9D2',A='#E9B872',B='#2C4A80',Cm='rgba(243,233,210,.45)';
const T=(p,x,y,s,cls,anc,col)=>tx(p,x,y,s,cls,anc||'start',col?{style:'fill:'+col}:{});
const R=(p,x,y,parts,anc='start')=>{const t=el('text',{x,y,'text-anchor':anc},p);t.sp=parts.map(([s,cls,col])=>{const sp=el('tspan',{class:cls},t);if(col)sp.setAttribute('style','fill:'+col);sp.textContent=s.replace(/ /g,' ');return sp;});return t;};
const go=(ms,fn,end)=>{if(calm()){fn(1,1);if(end)end();}else play(ms,fn,end);};
const mv=(c,x,y)=>{c.setAttribute('cx',x.toFixed(1));c.setAttribute('cy',y.toFixed(1));};
// 달력 표: (x,y) 왼쪽 위, 칸 너비 cw, 줄 높이 rh. 그 달 날짜 칸 중심을 돌려준다
function cal(p,x,y,cw,rh,yr,mo,cls='v28'){const W=['일','월','화','수','목','금','토'];W.forEach((w,i)=>T(p,x+cw*(i+.5),y,w,'v22m','middle'));
 wl(p,x,y+18,x+cw*7,y+18,Cm);const f=new Date(yr,mo,1).getDay(),n=new Date(yr,mo+1,0).getDate(),P={};
 for(let d=1;d<=n;d++){const k=f+d-1,cx=x+cw*(k%7+.5),cy=y+18+rh*(Math.floor(k/7)+.5);P[d]=[cx,cy];T(p,cx,cy+10,d+'',cls,'middle');}return P;}

EPX[14]={day:'14일차',topic:'며칠',cat:'맞춤법',field:'국어',frame:'v2',
 cover:{h:'왜 ‘몇일’이<br>아니라<br>‘며칠’일까?',draw(S){
   T(S,660,280,'몇일','vs96',null,Cm);const st=wl(S,650,246,650,246,C,{'stroke-width':4,'stroke-linecap':'butt'});
   T(S,750,370,'↓','v60','middle',Cm);const ok=grp(S,0);T(ok,660,520,'며칠','vs96');
   T(S,1000,170,'2026년 11월','v28');const P=cal(S,1000,230,70,72,2026,10);
   const [cx,cy]=P[30];el('circle',{cx,cy,r:30,fill:'none',stroke:A,'stroke-width':2},S);
   wl(S,640,640,1504,640,Cm);T(S,640,680,'오늘은 몇 월 며칠?','v22m');
   return ()=>{st.setAttribute('x2',650);ok.setAttribute('opacity',0);go(700,e=>st.setAttribute('x2',(650+214*e).toFixed(1)),()=>setTimeout(()=>show(ok),calm()?0:250));};}},
 scenes:[
  {k:'며칠',h:'날짜를 물을 땐<br>며칠',b:'‘오늘이 몇 월 <em>며칠</em>이야?’ 그달의 몇째 날을 물을 때도, 몇 날인지 셀 때도 며칠이라고 써.',steps:['고쳐 보기','두 가지 뜻'],
   draw(S){const l1=R(S,660,190,[['오늘이 몇 월 ','v60',Cm],['몇일','v60',Cm],['이야?','v60',Cm]]);
    const gh=grp(S,1);R(gh,660,300,[['오늘이 몇 월 ……이야?','v60',Cm]]);T(gh,660,350,'바르게 고치면?','v22m');const fix=grp(S,0);R(fix,660,300,[['오늘이 몇 월 ','v60'],['며칠','v60',A],['이야?','v60']]);
    const st=wl(S,0,0,0,0,C,{'stroke-width':4,'stroke-linecap':'butt',opacity:0});
    // 한 주 띠: 24~30일
    const y=470,x0=700,dx=120;wl(S,660,y,1500,y,C);for(let i=0;i<7;i++){const x=x0+i*dx;wl(S,x,y,x,y+14,C);T(S,x,y+56,(24+i)+'일','v28','middle');}
    const a=grp(S,0);wl(a,x0+6*dx,y-90,x0+6*dx,y-8,C);T(a,x0+6*dx,y-104,'몇째 날 → 며칠','v28','end');
    const b=grp(S,0);el('path',{d:`M${x0+2*dx},${y+80}V${y+96}H${x0+6*dx}V${y+80}`,fill:'none',stroke:C,'stroke-width':2},b);T(b,x0+4*dx,y+140,'몇 날 동안 → 며칠 동안','v28','middle');
    return i=>{if(i===0){const sp=l1.sp[1],x=sp.getStartPositionOfChar(0).x,w=sp.getComputedTextLength();st.setAttribute('x1',x);st.setAttribute('x2',x);st.setAttribute('y1',170);st.setAttribute('y2',170);st.setAttribute('opacity',1);
      go(600,e=>st.setAttribute('x2',(x+w*e).toFixed(1)),()=>{gh.setAttribute('opacity',0);show(fix);});}
     else{show(a);setTimeout(()=>show(b),calm()?0:500);}};}},
  {k:'소리',h:'‘몇 일’이었다면<br>[며딜]이었을 것',b:'‘몇 월’은 [며둴], ‘몇 억’은 [며덕]으로 소리 나. ‘몇 일’이면 [며딜]이어야 하는데 우리는 [며칠]이라고 해.',steps:['몇 월','몇 억','며칠은?'],
   draw(S){T(S,680,150,'쓰는 글','v22m');T(S,1120,150,'나는 소리','v22m');wl(S,660,170,1500,170,Cm);
    const rows=[['몇 월','[며둴]',260],['몇 억','[며덕]',390],['몇 일?','[며딜]',520]];
    const G=rows.map(([w,s,y],k)=>{T(S,680,y,w,'v60');wl(S,900,y-20,1080,y-20,Cm,{'stroke-dasharray':'2 10'});const d=wdot(S,900,y-20,0,C);const g=grp(S,0);T(g,1120,y,s,'v60',null,k===2?Cm:C);return {d,g,y};});
    const sx=grp(S,0);wl(sx,1116,500,1290,500,C,{'stroke-width':4,'stroke-linecap':'butt'});
    const real=grp(S,0);T(real,1330,520,'[며칠]','v60',null,A);T(real,1330,580,'실제 소리','v22m');
    T(S,680,640,'몇 뒤에 다른 낱말이 오면 ㅊ이 ㄷ 소리로','v22m');
    return i=>{const r=G[i];go(800,e=>{mv(r.d,900+180*e,r.y-20);r.d.setAttribute('r',8);},()=>{r.d.setAttribute('r',0);show(r.g);if(i===2)setTimeout(()=>{show(sx);show(real);},calm()?0:500);});};}},
  {k:'규칙',h:'그래서 소리<br>나는 대로 며칠',b:'뿌리가 분명하지 않은 말은 <em>소리 나는 대로</em> 적기로 했어. 골탕, 골병도 그래.',steps:['같은 규칙의 말'],
   draw(S){T(S,660,170,'한글 맞춤법 제27항','v28');T(S,1504,170,'어원이 분명하지 않은 말','v22m','end');wl(S,660,195,1504,195,Cm);
    const X=[790,1080,1370],W=['며칠','골탕','골병'];
    const G=W.map((w,i)=>{const t=T(S,X[i],370,w,'vs96','middle',i===0?null:Cm);
      const r=el('g',{fill:'none',stroke:Cm,'stroke-width':2,'stroke-dasharray':'3 7'},S);[-60,0,60].forEach(o=>el('path',{d:`M${X[i]},400C${X[i]},450 ${X[i]+o},470 ${X[i]+o*1.2},530`},r));
      const q=T(S,X[i],600,'?','v60','middle',Cm);return {t,q};});
    G[0].t.setAttribute('style','fill:'+A);
    T(S,640,680,'뿌리를 모르니까 → 들리는 소리대로 적어','v22m');
    return ()=>G.forEach((g,i)=>setTimeout(()=>{if(i)g.t.setAttribute('style','fill:'+C);g.q.setAttribute('style','fill:'+C);},calm()?0:i*450));}}],
 sum:{lines:['날을 물을 땐<br>며칠이라고 쓴다.','‘몇 일’이었다면<br>[며딜]로 소리 나야 한다.','뿌리가 분명하지 않아서<br>소리 나는 대로 며칠.'],
  words:[['며칠','그달의 몇째 날, 또는 몇 날'],['어원','말이 처음 생겨난 뿌리'],['맞춤법','글을 바르게 쓰는 규칙']]},
 end:{q:'‘몇 월 며칠’에서 소리 나는 대로 적는 말은?',a:'며칠. ‘몇 월’은 ‘몇’과 ‘월’을 띄어 써.',h:'달력을 보고<br>오늘이 몇 월<br>며칠인지 말해 봐.',btn:'달력 보기',
  draw(S){const d=new Date(),yr=d.getFullYear(),mo=d.getMonth(),dd=d.getDate();
   T(S,660,200,'오늘은','v28');const big=grp(S,0);T(big,660,330,`${mo+1}월`,'v96');T(big,660,450,`${dd}일`,'v96');T(big,660,500,'몇 월 며칠','v22m');
   T(S,1000,170,`${yr}년 ${mo+1}월`,'v28');const P=cal(S,1000,230,70,64,yr,mo);
   const [cx,cy]=P[dd],c=el('circle',{cx,cy,r:30,fill:'none',stroke:A,'stroke-width':2,opacity:0},S);const dot=wdot(S,P[1][0],P[1][1],0,A);
   wl(S,640,640,1504,640,Cm);
   return ()=>go(1100,e=>{const k=Math.max(1,Math.round(1+(dd-1)*e)),[x,y]=P[k];mv(dot,x,y);dot.setAttribute('r',e<1?7:0);},()=>{c.setAttribute('opacity',1);show(big);});}}};
})();

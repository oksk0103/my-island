(()=>{
/* 이야기 v2 공용(이 편 안에서만): 크림 W0 · 앰버 SA(화면당 한 곳) · 보조 SB */
const SA='#E9B872',SB='#2C4A80',CM='rgba(243,233,210,.45)';
const lerp=(a,b,t)=>a+(b-a)*t;
// 글자를 (x0,y0)→(x1,y1)로 옮김
const glide=(n,x0,y0,x1,y1,D,end)=>{if(calm()){n.setAttribute('x',x1);n.setAttribute('y',y1);if(end)end();return;}play(D,e=>{n.setAttribute('x',lerp(x0,x1,e).toFixed(1));n.setAttribute('y',lerp(y0,y1,e).toFixed(1));},end);};
const fadeIn=(g,D=500)=>{if(calm()){g.setAttribute('opacity',1);return;}g.style.transition='none';play(D,e=>g.setAttribute('opacity',e.toFixed(3)));};
const fadeOut=(g,D=400)=>{if(calm()){g.setAttribute('opacity',0);return;}g.style.transition='none';play(D,e=>g.setAttribute('opacity',(1-e).toFixed(3)));};
// 선 그리기(길이만큼 자라남)
const drawLine=(n,D=600,end)=>{const L=n.getTotalLength?n.getTotalLength():400;n.style.strokeDasharray=L;n.style.strokeDashoffset=calm()?0:L;if(calm()){if(end)end();return;}play(D,e=>n.style.strokeDashoffset=(L*(1-e)).toFixed(1),end);};
const hidLine=n=>{const L=n.getTotalLength?n.getTotalLength():400;n.style.strokeDasharray=L;n.style.strokeDashoffset=L;};
// 글자 폭 어림(한글 1em, 기호·숫자 .6em)
const tw=(s,size)=>[...s].reduce((a,c)=>a+(/[가-힣ㄱ-ㅎㅏ-ㅣ一-龥]/.test(c)?size*.98:c===' '?size*.3:size*.6),0);
// 한 줄 글자에 부분 색: parts=[[글자,색|null],…]
const tsp=(p,x,y,cls,parts,anc='start')=>{const t=el('text',{x,y,class:cls,'text-anchor':anc},p);parts.forEach(([s,c])=>{const sp=el('tspan',c?{style:`fill:${c}`}:{},t);sp.textContent=s;});return t;};
// 2. 이에요와 예요 — 낱말 분해(첫소리·가운뎃소리·받침 칸), 두 갈래 나누기
// 글자 칸: 받침 자리를 점선 밑줄로 보여 줌
function slots(S,cx,y,parts,{acc=-1}={}){const L=['첫소리','가운뎃소리','받침'],X=[-150,0,150],out=[];
 X.forEach((dx,i)=>{const x=cx+dx;wl(S,x-50,y+26,x+50,y+26,CM,{'stroke-dasharray':i===2?'4 8':'none'});tx(S,x,y+64,L[i],'v22m','middle');});
 parts.forEach((p,i)=>{const t=tx(S,cx+X[i],y,p||'',p?'v60':'v28','middle');t.setAttribute('opacity',0);if(i===acc)t.style.fill=SA;out.push(t);});return out;}
EPX[2]={day:'2일차',topic:'이에요와 예요',cat:'맞춤법',field:'국어',frame:'v2',
 cover:{h:'이에요와<br>예요,<br>뭐가 다를까?',draw(S){
   const rows=[[700,300,'연필','이에요'],[700,540,'지우개','예요']];const U=[];
   rows.forEach(([x,y,w,e])=>{const t=tsp(S,x,y,'v96',[[w,CM],[e,null]]);const ww=tw(w,96)*.93;
    const u=wl(S,x+ww,y+30,x+ww+tw(e,96)*.93,y+30,W0);U.push(u);});
   // 끝 글자 위 받침 표시
   tx(S,700+89+44,150,'받침 ㄹ','v28','middle',{style:`fill:${SA}`});el('path',{d:`M${700+89+44},170V214`,fill:'none',stroke:SA,'stroke-width':2},S);
   tx(S,700+178+44,390,'받침 없음','v28','middle',{style:`fill:${CM}`});
   wl(S,700,640,1500,640,CM);tx(S,700,680,'끝 글자의 받침을 봐','v22m');
   return ()=>{U.forEach(u=>{hidLine(u);drawLine(u,900);});};}},
 scenes:[
  {k:'받침',h:'받침이 있으면 이에요,<br>없으면 예요',b:'끝 글자 아래를 봐. <em>연필</em>의 ‘필’에는 받침 ㄹ이 있어. <em>지우개</em>의 ‘개’에는 받침이 없어.',steps:['연필 보기','지우개 보기'],
   draw(S){wl(S,1080,120,1080,680,CM);
    const C=[{cx:860,w:'연필',last:'필',p:['ㅍ','ㅣ','ㄹ'],e:'연필이에요',acc:2},{cx:1300,w:'지우개',last:'개',p:['ㄱ','ㅐ','없음'],e:'지우개예요',acc:-1}];
    C.forEach(c=>{const ww=c.w.length*89;c.x0=c.cx-ww/2;tsp(S,c.x0,230,'v96',[[c.w.slice(0,-1),CM],[c.last,null]]);
     c.J=slots(S,c.cx,400,c.p,{acc:c.acc});if(c.p[2]==='없음')c.J[2].style.fill=CM;
     c.E=tx(S,c.cx,600,c.e,'v60','middle');c.E.setAttribute('opacity',0);});
    return i=>{const c=C[i];const lx=c.x0+(c.w.length-1)*89+44;
     c.J.forEach((t,k)=>{t.setAttribute('opacity',1);const tx1=+t.getAttribute('x'),ty1=400;glide(t,lx,200,tx1,ty1,900+k*150);});
     setTimeout(()=>fadeIn(c.E,500),calm()?0:1100);};}},
  {k:'나눠 보기',h:'받침을 보면<br>바로 고를 수 있다',b:'끝 글자에 받침이 있으면 <em>이에요</em>, 없으면 <em>예요</em>. 낱말을 받침에 따라 나눠 봐.',steps:['나눠 보기'],
   draw(S){const LX=700,RX=1120;tx(S,LX,170,'이에요','v60');tx(S,RX,170,'예요','v60');wl(S,LX,196,LX+360,196,W0);wl(S,RX,196,RX+360,196,W0);
    tx(S,LX+360,170,'받침 있음','v22m','end');tx(S,RX+360,170,'받침 없음','v22m','end');
    const W=[['수박',1,'이에요'],['사과',0,'예요'],['책',1,'이에요'],['나무',0,'예요'],['선생님',1,'이에요'],['루아',0,'예요']];
    const G=[[720,330],[960,330],[1200,330],[720,470],[960,470],[1200,470]];let a=0,b=0;
    const T=W.map(([w,h,e],i)=>{const t=tx(S,G[i][0],G[i][1],w,'v60');const k=h?a++:b++;return {t,w,e,h,x1:h?LX:RX,y1:300+k*120};});
    const hint=tx(S,720,600,'끝 글자 받침을 찾아서 나눠','v28',undefined,{style:`fill:${CM}`});
    return ()=>{hint.setAttribute('opacity',0);T.forEach((o,i)=>{const [x0,y0]=G[i];setTimeout(()=>glide(o.t,x0,y0,o.x1,o.y1,800,()=>{o.t.textContent=o.w+o.e;if(o.w==='선생님')o.t.style.fill=SA;}),calm()?0:i*120);});};}},
  {k:'아니에요',h:'‘아니예요’가 아니라<br>늘 ‘아니에요’',b:'‘아니에요’는 ‘아니다’에 ‘에요’가 붙은 말이야. ‘아니다’ 안에 ‘이다’가 이미 들어 있어서 늘 <em>아니에요</em>라고 써.',steps:['바른 말 보기'],
   draw(S){const x=720;const bad=tx(S,x,250,'아니예요','v96',undefined,{style:`fill:${CM}`});const st=wl(S,x-10,218,x+4*89+10,218,W0,{'stroke-width':3});hidLine(st);
    tsp(S,x,400,'v60',[['아니다',null],['  +  ',CM],['에요',null]]);
    tx(S,x,450,'‘아니다’ 안에 ‘이다’가 이미 들어 있어','v22m');wl(S,x,600,1500,600,CM);
    const res=grp(S,0);tsp(res,x,580,'v96',[['아니',null],['에요',SA]]);
    return ()=>{drawLine(st,600,()=>{fadeIn(res,700);});};}}],
 sum:{lines:['받침이 있으면 이에요.<br>연필이에요, 책이에요.','받침이 없으면 예요.<br>지우개예요, 루아예요.','‘아니다’는 늘<br>아니에요라고 쓴다.'],
  words:[['받침','글자 아래에 받치는<br>자음. ‘필’의 ㄹ'],['예요','‘이에요’가 줄어든 말.<br>받침 없는 말 뒤에'],['아니에요','‘아니예요’는<br>틀린 말']]},
 end:{q:'‘선생님’ 뒤에는 이에요? 예요?',a:'선생님이에요. ‘님’에 받침 ㅁ이 있으니까.',h:'물건 이름 뒤에<br>무엇이 올지<br>말해 봐.',btn:'답 보기',
  draw(S){const x=720;const T=tsp(S,x,330,'v96',[['선생',CM],['님',null]]);const q=tx(S,x+3*89+16,330,'?','v96',undefined,{style:`fill:${CM}`});
   const J=slots(S,1100,500,['ㄴ','ㅣ','ㅁ'],{acc:2});
   return ()=>{q.remove();const E=el('tspan',{'fill-opacity':0},T);E.textContent='이에요';const lx=x+2*89+44;J.forEach((t,k)=>{t.setAttribute('opacity',1);glide(t,lx,330,+t.getAttribute('x'),500,900+k*150);});
    const sh=()=>{if(calm()){E.setAttribute('fill-opacity',1);return;}play(500,e=>E.setAttribute('fill-opacity',e.toFixed(3)));};setTimeout(sh,calm()?0:900);};}}};
})();

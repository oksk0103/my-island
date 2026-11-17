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
// 3. 정오와 자정 — 하루 둥근 시계(낮 12시 위, 밤 12시 아래), 시간 띠
const ZH=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
// 각도: h=12 위, h=0 아래, 오전은 왼쪽
function zdial(S,cx=1160,cy=400,R=230){const A=h=>(h/24*360+90)*Math.PI/180,P=(h,r)=>[cx+r*Math.cos(A(h)),cy+r*Math.sin(A(h))];
 const sect=i=>{const h0=i*2-1,h1=i*2+1,[x0,y0]=P(h0,R),[x1,y1]=P(h1,R),[a0,b0]=P(h0,R*.42),[a1,b1]=P(h1,R*.42);return `M${a0},${b0}L${x0},${y0}A${R},${R} 0 0 1 ${x1},${y1}L${a1},${b1}A${R*.42},${R*.42} 0 0 0 ${a0},${b0}Z`;};
 const fills=ZH.map((_,i)=>el('path',{d:sect(i),fill:SB,opacity:0},S));
 el('circle',{cx,cy,r:R,fill:'none',stroke:W0,'stroke-width':2},S);el('circle',{cx,cy,r:R*.42,fill:'none',stroke:CM,'stroke-width':2},S);
 for(let i=0;i<12;i++){const [x0,y0]=P(i*2+1,R*.42),[x1,y1]=P(i*2+1,R);wl(S,x0,y0,x1,y1,CM);}
 for(let h=0;h<24;h++){const [x0,y0]=P(h,R),[x1,y1]=P(h,R+(h%6===0?18:9));wl(S,x0,y0,x1,y1,h%6===0?W0:CM);}
 const labs=ZH.map((z,i)=>{const [x,y]=P(i*2,R*.71);return tx(S,x,y+20,z,'vs60','middle');});
 [[12,'낮 12시'],[0,'밤 12시'],[6,'아침 6시'],[18,'저녁 6시']].forEach(([h,s])=>{const [x,y]=P(h,R+(h%12?30:50));tx(S,x,y+8,s,'v22m',h===6?'end':h===18?'start':'middle');});
 const hand=wl(S,cx,cy,cx,cy-R*.9,W0,{'stroke-width':3});const hub=wdot(S,cx,cy,8,W0);
 const setH=h=>{const [x,y]=P(h,R*.36);hand.setAttribute('x2',x.toFixed(1));hand.setAttribute('y2',y.toFixed(1));};
 return {fills,labs,setH,hand,hub,P,cx,cy,R};}
const hm=h=>{h=((h%24)+24)%24;const H=Math.floor(h);if(H===0)return '밤 12시';if(H===12)return '낮 12시';return `${H<12?'오전':'오후'} ${H%12===0?12:H%12}시`;};
EPX[3]={day:'3일차',topic:'정오와 자정',cat:'말의 유래',field:'국어',frame:'v2',
 cover:{h:'낮 12시를<br>왜 ‘정오’라<br>부를까?',draw(S){const d=zdial(S);d.setH(8);d.hand.setAttribute('x2',d.cx);
   const hl=d.labs[6];hl.style.fill=SA;d.setH(8);
   tx(S,1504,150,'正午','vs96','end');tx(S,1504,190,'정오','v28','end');
   return ()=>{if(calm()){d.setH(12);return;}play(1600,e=>d.setH(8+4*e));};}},
 scenes:[
  {k:'열두 칸 하루',h:'옛날엔 하루를<br>열두 칸으로 나눴다',b:'하루 24시간을 <em>두 시간씩</em> 열두 칸으로 나눴어. 칸마다 열두 띠를 나타내는 글자로 이름을 붙였어.',steps:['하루 돌려 보기'],
   draw(S){const d=zdial(S);d.setH(0);const lab=tx(S,1504,150,'밤 12시','v60','end');const sub=tx(S,1504,190,'子 칸','v28','end');d.fills[0].setAttribute('opacity',1);
    const tip=wdot(S,d.cx,d.cy,10,SA);
    return ()=>{const f=h=>{d.setH(h);const i=Math.floor(((h+1)%24)/2);d.fills.forEach((p,k)=>p.setAttribute('opacity',k===i?1:0));lab.textContent=hm(h);sub.textContent=ZH[i]+' 칸';const [x,y]=d.P(h,d.R*.36);tip.setAttribute('cx',x);tip.setAttribute('cy',y);};
     if(calm()){f(24);return;}play(2000,e=>f(e*24),()=>{lab.textContent='12칸';sub.textContent='한 칸에 두 시간씩';});};}},
  {k:'정오',h:'낮 12시는<br>오시의 한가운데',b:'오시(午時)는 오전 11시부터 오후 1시까지야. 그 한가운데인 낮 12시가 <em>정오(正午)</em>. 정오 앞은 오전, 뒤는 오후야.',steps:['오시 보기','오전·오후 나누기'],
   draw(S){const X0=680,X1=1480,Y=470,hx=h=>X0+h*(X1-X0)/24;
    // 시간 띠: 12칸
    wl(S,X0,Y,X1,Y,W0);wl(S,X0,Y+60,X1,Y+60,W0);for(let i=0;i<=12;i++){const x=hx(Math.min(24,Math.max(0,i*2-1)));wl(S,x,Y,x,Y+60,CM);}
    for(let h=0;h<=24;h++)wl(S,hx(h),Y+60,hx(h),Y+60+(h%6===0?16:8),h%6===0?W0:CM);
    [[0,'0시'],[6,'6시'],[12,'12시'],[18,'18시'],[24,'24시']].forEach(([h,s])=>tx(S,hx(h),Y+106,s,'v22m','middle'));
    ZH.forEach((z,i)=>{const c=i===0?hx(.5):hx(i*2);tx(S,c,Y+44,z,'vs28','middle');});
    const fill=el('rect',{x:hx(11),y:Y+2,width:hx(13)-hx(11),height:56,fill:SA,opacity:0},S);
    const big=tx(S,hx(12),300,'午','vs160','middle',{style:`fill:${CM}`});const zheng=tx(S,hx(12)-90,300,'正','vs160','end');zheng.setAttribute('opacity',0);
    const cap=tx(S,hx(12),360,'오시 · 오전 11시~오후 1시','v28','middle');cap.setAttribute('opacity',0);
    const mid=wl(S,hx(12),Y-40,hx(12),Y+60,W0,{'stroke-width':3});hidLine(mid);
    const am=grp(S,0),pm=grp(S,0);tx(am,hx(6),Y-30,'오전 午前','v28','middle');tx(pm,hx(18),Y-30,'오후 午後','v28','middle');
    const aL=wl(am,hx(11),Y-20,hx(1),Y-20,W0),pL=wl(pm,hx(13),Y-20,hx(23),Y-20,W0);
    return i=>{if(i===0){fill.setAttribute('opacity',1);if(!calm()){fill.setAttribute('width',0);play(800,e=>{fill.setAttribute('x',(hx(12)-e*(hx(13)-hx(11))/2).toFixed(1));fill.setAttribute('width',(e*(hx(13)-hx(11))).toFixed(1));});}
      big.style.fill=W0;big.setAttribute('x',hx(12)+80);zheng.setAttribute('x',hx(12)+0);fadeIn(zheng,700);fadeIn(cap,700);drawLine(mid,700);}
     else{show(am);show(pm);hidLine(aL);hidLine(pL);drawLine(aL,900);drawLine(pL,900);}};}},
  {k:'자정',h:'밤 12시는<br>자시의 한가운데',b:'자시(子時)의 한가운데가 밤 12시야. 그래서 밤 12시를 <em>자정(子正)</em>이라고 불러.',steps:['밤 12시로 돌리기'],
   draw(S){const d=zdial(S,1225);d.setH(12);d.fills[6].setAttribute('opacity',1);
    const t1=tx(S,700,300,'子正','vs96');const t2=tx(S,700,350,'자정 · 밤 12시','v28');t1.setAttribute('opacity',0);t2.setAttribute('opacity',0);
    const t0=tx(S,700,300,'正午','vs96',undefined,{style:`fill:${CM}`});tx(S,700,350,'정오 · 낮 12시','v28',undefined,{style:`fill:${CM}`}).classList.add('o');
    return ()=>{const end=()=>{d.fills.forEach((p,k)=>p.setAttribute('opacity',k===0?1:0));d.labs[0].style.fill=SA;t0.setAttribute('y',560);S.querySelector('.o').setAttribute('y',610);fadeIn(t1,600);fadeIn(t2,600);};
     if(calm()){d.setH(24);end();return;}play(1600,e=>{d.setH(12+12*e);const i=Math.floor(((12+12*e+1)%24)/2);d.fills.forEach((p,k)=>p.setAttribute('opacity',k===i?1:0));},end);};}}],
 sum:{lines:['옛날엔 하루를 두 시간씩<br>열두 칸으로 나눴다.','낮 12시는 오시의 한가운데라 정오,<br>밤 12시는 자시의 한가운데라 자정.','오전은 정오 앞,<br>오후는 정오 뒤.'],
  words:[['정오','낮 12시.<br>오시의 한가운데'],['자정','밤 12시.<br>자시의 한가운데'],['午(오)','낮, 그리고<br>띠 동물 말을 뜻하는 글자']]},
 end:{q:'오전의 ‘오’는 무슨 동물을 뜻할까?',a:'말. 午는 낮과 함께 띠 동물 말을 뜻하는 글자야.',h:'낮 12시가 되면<br>‘정오’라고<br>말해 봐.',btn:'답 보기',
  draw(S){const cx=1120;tx(S,cx,420,'午','vs160','middle');const q=tx(S,cx+200,400,'= ?','v96',undefined,{style:`fill:${CM}`});
   tsp(S,700,600,'v60',[['午',null],['前',CM]]);tx(S,700,640,'오전','v22m');tsp(S,1504,600,'v60',[['午',null],['後',CM]],'end');tx(S,1504,640,'오후','v22m','end');wl(S,700,670,1504,670,CM);
   const a=grp(S,0);tx(a,cx+200,400,'= 말','v96',undefined,{style:`fill:${SA}`});tx(a,cx+200,450,'일곱째 띠','v28');
   return ()=>{q.remove();fadeIn(a,600);};}}};
})();

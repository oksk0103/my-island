(()=>{ // 33. '설거지'의 말 뿌리 — 이야기 v2: 낱말 분해·시간 띠
const C='#F3E9D2',A='#E9B872',B='#2C4A80',Cm='rgba(243,233,210,.45)';
const line=(p,x1,y1,x2,y2,c=C,o={})=>el('line',Object.assign({x1,y1,x2,y2,stroke:c,'stroke-width':2,'stroke-linecap':'round'},o),p);
const fade=(g,ms=500,to=1)=>{if(calm()){g.setAttribute('opacity',to);return;}const f=+g.getAttribute('opacity')||0;play(ms,e=>g.setAttribute('opacity',f+(to-f)*e));};
const slide=(n,dx,dy,ms=900,end)=>{if(calm()){n.setAttribute('transform',`translate(${dx},${dy})`);if(end)end();return;}play(ms,e=>n.setAttribute('transform',`translate(${dx*e},${dy*e})`),end);};
const strike=(l,x1,x2,ms=600,end)=>{if(calm()){l.setAttribute('x2',x2);if(end)end();return;}play(ms,e=>l.setAttribute('x2',x1+(x2-x1)*e),end);};
// 시간 띠: 옛날 → 지금
function band(p,y,x1=640,x2=1504){line(p,x1,y,x2,y,Cm);for(let i=0;i<=24;i++){const x=x1+(x2-x1)*i/24,b=i%6===0;line(p,x,y,x,y+(b?18:9),b?C:Cm);}tx(p,x1,y+52,'옛날','v22m');tx(p,x2,y+52,'지금','v22m','end');}

EPX[33]={day:'12월 12일',topic:'설거지',cat:'말의 뿌리',field:'국어',frame:'v2',
 cover:{h:'‘설거지’는<br>어디서 온<br>말일까?',draw(S){
   band(S,620);
   tx(S,700,300,'설겆다','v60',undefined,{opacity:.5});tx(S,700,350,'옛말','v22m');
   tx(S,1504,470,'설거지','v96','end');tx(S,1504,520,'지금 쓰는 말','v22m','end');
   el('path',{d:'M920,282C1080,282 1120,440 1190,440',fill:'none',stroke:C,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},S);
   const d=el('circle',{cx:640,cy:620,r:12,fill:A},S);
   let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,t=>{const c=(Math.max(0,t)%4)/3;d.setAttribute('cx',640+864*Math.min(1,EO(Math.min(1,c))));});};}},
 scenes:[
  {k:'옛말 설겆다',h:'옛날엔<br>‘설겆다’가 있었다',b:'‘설겆다’는 먹고 난 그릇을 씻어 <em>정리한다</em>는 뜻이야. 여기에 ‘-이’가 붙어 ‘설겆이’가 됐어.',steps:['붙여 보기'],
   draw(S){line(S,640,170,1504,170,C);tx(S,640,145,'낱말 나누기','v22m');
    tx(S,700,330,'설겆','v96');tx(S,700,390,'설겆다의 앞부분','v22m');
    const plus=tx(S,960,320,'+','v60',undefined,{style:'fill:rgba(243,233,210,.45)'});
    const i=el('g',{},S);tx(i,1300,330,'이','v96',undefined,{style:`fill:${A}`});tx(i,1300,390,'붙는 말','v22m');
    line(S,640,450,1504,450,B);
    const res=grp(S,0);tx(res,700,580,'설겆이','v96');tx(res,1504,570,'= 그릇 씻어 정리하는 일','v28','end');
    return ()=>{plus.setAttribute('opacity',0);slide(i,-400,0,900,()=>fade(res,600));};}},
  {k:'사라진 말',h:'‘설겆다’는<br>이제 안 쓴다',b:'‘설겆어라, 설겆으니’처럼 쓰는 일이 없어졌어. 쓰이지 않게 된 말을 <em>사어</em>라고 해.',steps:['지워 보기'],
   draw(S){const W=['설겆어라','설겆으니','설겆더니'],L=[];
    tx(S,640,150,'옛날에 쓰던 꼴','v22m');line(S,640,170,1504,170,C);
    W.forEach((w,k)=>{const y=280+k*130;tx(S,700,y,w,'v96');line(S,640,y+40,1504,y+40,B);
      L.push(line(S,690,y-30,690,y-30,k===0?A:C));});
    const lab=grp(S,0);tx(lab,1504,660,'이제 안 써서 사어가 됐어','v28','end');
    return ()=>{L.forEach((l,k)=>setTimeout(()=>strike(l,690,1110,450,k===2?()=>fade(lab,400):null),calm()?0:k*250));};}},
  {k:'표준어 규정',h:'그래서 ‘설거지’로<br>적는다',b:'1988년에 정한 표준어 규정은 널리 쓰는 <em>설거지</em>를 표준어로 삼았어. ‘설겆이’는 이제 바른 말이 아니야.',steps:['1988년으로'],
   draw(S){band(S,640);
    const tick=1072;line(S,tick,200,tick,640,B);tx(S,tick,180,'1988년','v28','middle');
    const old=el('g',{},S);tx(old,760,400,'설겆이','v96','middle');
    const neu=grp(S,0);tx(neu,1300,400,'설거지','v96','middle',{style:`fill:${A}`});tx(neu,1300,470,'설거지하다','v28','middle');
    const d=el('circle',{cx:760,cy:640,r:12,fill:C},S);const q=tx(S,1300,400,'?','v96','middle',{opacity:.35});
    return ()=>{if(calm()){q.remove();old.setAttribute('opacity',.3);d.setAttribute('cx',1300);neu.setAttribute('opacity',1);return;}
      q.remove();play(900,e=>{d.setAttribute('cx',760+540*e);old.setAttribute('opacity',1-.7*e);},()=>fade(neu,400));};}}],
 sum:{lines:['옛날엔 그릇을 씻어 정리한다는<br>‘설겆다’가 있었다.','‘설겆다’를 안 쓰게 되어<br>사어가 되었다.','그래서 지금은<br>‘설거지’로 적는다.'],
  words:[['설겆다','먹고 난 그릇을 씻어 정리하다. 지금은 안 쓰는 말'],['사어','이제 쓰이지 않게 된 말'],['설거지','먹고 난 그릇을 씻어 정리하는 일']]},
 end:{q:'‘설겆이’와 ‘설거지’, 어느 쪽이 맞을까?',a:'설거지. ‘설겆다’를 이제 안 쓰니까.',h:'저녁 먹고 숟가락을<br>개수대로 날라 봐.',btn:'바르게 쓰기',
  draw(S){line(S,640,170,1504,170,C);tx(S,640,145,'어느 쪽?','v22m');
   const a=el('g',{},S);tx(a,860,360,'설겆이','v96','middle');const sl=line(S,720,330,720,330,A);
   const b=el('g',{},S);tx(b,1290,360,'설거지','v96','middle');
   line(S,640,450,1504,450,B);
   const ok=grp(S,0);tx(ok,1290,540,'바른 말','v28','middle');el('path',{d:'M1150,410H1430',fill:'none',stroke:C,'stroke-width':2},ok);
   const no=grp(S,0);tx(no,860,540,'옛 꼴','v28','middle',{style:'fill:rgba(243,233,210,.45)'});
   const qs=[860,1290].map(x=>tx(S,x,560,'?','v60','middle',{opacity:.35}));line(S,640,640,1504,640,B);
   return ()=>{qs.forEach(q=>q.remove());strike(sl,720,1000,600,()=>{fade(a,400,.4);fade(ok);fade(no);});};}}};
})();

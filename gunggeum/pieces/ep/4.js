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
// 4. 햅쌀의 ㅂ — 옛 글자 분해, 합치기 줄(ㅂ이 앞 글자 받침으로 이동)
const OLD="font-family:'Noto Sans CJK KR','Noto Serif CJK KR',sans-serif";
// 합치기 줄: a + b → res. run()이 ㅂ(앰버)을 b에서 a 아래로 옮기고 결과를 보여 줌
function joinV2(S,y,a,b,res,note,{size=60,x0=700}={}){const cls=size===96?'v96':'v60',k=size*.93,g={};
 const ax=x0,px=ax+a.length*k+size*.35,bx=px+size*.85,ar=bx+b.length*k+size*.35,rx=ar+size*1.2;
 tx(S,ax,y,a,cls);tx(S,px,y,'+',cls,undefined,{style:`fill:${CM}`});tx(S,bx,y,b,cls);tx(S,ar,y,'→',cls,undefined,{style:`fill:${CM}`});
 const slot=wl(S,rx,y+size*.25,rx+res.length*k,y+size*.25,CM,{'stroke-dasharray':'4 10'});
 const R=tx(S,rx,y,res,cls);R.setAttribute('opacity',0);let N=null;if(note){N=tx(S,1504,y,note,'v22m','end');N.setAttribute('opacity',0);}
 const run=()=>{const j=tx(S,bx+k*.5,y-size*.9,'ㅂ',cls,'middle',{style:`fill:${SA}`});const tx1=ax+(a.length-.5)*k,ty1=y-size*.1;
  glide(j,bx+k*.5,y-size*.9,tx1,ty1,900,()=>{R.setAttribute('opacity',1);slot.setAttribute('opacity',0);if(N)fadeIn(N,500);
   const x2=rx+(a.length-.5)*k;glide(j,tx1,ty1,x2,ty1,500,()=>fadeOut(j,400));});};
 return {run,g};}
EPX[4]={day:'4일차',topic:'햅쌀의 ㅂ',cat:'말의 유래',field:'국어',frame:'v2',
 cover:{h:'햅쌀은 왜<br>‘해쌀’이<br>아닐까?',draw(S){
   tsp(S,700,300,'v96',[['해',null],['  +  ',CM],['쌀',null]]);tx(S,700,560,'햅쌀','v96');wl(S,700,620,1500,620,CM);tx(S,700,660,'해 = 그해에 난','v22m');
   const big=tx(S,1330,470,'ㅂ','vs160','middle',{style:`fill:${SA}`});tx(S,1330,560,'어디서 왔을까?','v28','middle');
   const lead=el('path',{d:'M1250,420C1050,400 830,415 766,468',fill:'none',stroke:SA,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},S);
   return ()=>{hidLine(lead);drawLine(lead,1200);};}},
 scenes:[
  {k:'옛 글자',h:'옛날 ‘쌀’에는<br>ㅂ 소리가 있었다',b:'500년도 더 된 옛 책에는 쌀을 <em>ㅂ과 ㅅ</em>을 나란히 쓴 글자로 적었어. 소리도 ㅂ을 붙여 냈어.',steps:['옛 글자 나누기'],
   draw(S){const gx=820,gy=420;tx(S,gx,gy,'ᄡᆞᆯ','vs160','middle',{style:OLD});tx(S,gx,gy+80,'옛 책의 ‘쌀’','v28','middle');tx(S,gx,gy+116,'1400년대','v22m','middle');
    const J=[['ㅂ','ㅂ 소리',SA],['ㅅ','ㅅ 소리',null],['ㆍ','아래아',null],['ㄹ','받침 ㄹ',null]];const X=i=>1100+i*125;
    J.forEach(([c,l],i)=>{wl(S,X(i)-44,gy+30,X(i)+44,gy+30,CM);tx(S,X(i),gy+70,l,'v22m','middle');});
    const T=J.map(([c,l,col],i)=>{const t=tx(S,X(i),gy,c,'v96','middle',{style:`${col?`fill:${col};`:''}${OLD}`});t.setAttribute('opacity',0);return t;});
    tx(S,1100-44,200,'지금은','v22m');tsp(S,1100-44,280,'v60',[['쌀',null],['  ㅂ이 사라졌어',CM]]);
    return ()=>T.forEach((t,i)=>{t.setAttribute('opacity',1);glide(t,gx,gy-40,X(i),gy,800+i*150);});}},
  {k:'숨은 ㅂ',h:'어떤 말 뒤에서는<br>숨은 ㅂ이 나타난다',b:'쌀이 어떤 말 뒤에 붙으면 숨어 있던 <em>ㅂ</em>이 앞 글자 받침으로 들어가. 햅쌀, 멥쌀, 좁쌀, 찹쌀이 그래.',steps:['해 + 쌀','메 + 쌀','조 + 쌀','찰 + 쌀'],
   draw(S){const R=[['해','쌀','햅쌀','해 = 그해에 난'],['메','쌀','멥쌀',''],['조','쌀','좁쌀',''],['찰','쌀','찹쌀','ㄹ은 빠졌어']].map(([a,b,r,n],i)=>joinV2(S,230+i*130,a,b,r,n,{size:96}));
    return i=>R[i].run();}},
  {k:'볍씨',h:'씨에도<br>ㅂ이 숨어 있었다',b:'씨도 옛날엔 ㅂ이 붙은 글자였어. 그래서 벼의 씨는 <em>볍씨</em>라고 해.',steps:['벼 + 씨'],
   draw(S){tx(S,800,330,'ᄡᅵ','vs160','middle',{style:OLD});tx(S,800,400,'옛 글자의 ‘씨’','v28','middle');
    tsp(S,1090,300,'v96',[['ㅂ',null],[' + ',CM],['ㅅ',null]]);tx(S,1090,360,'옛 ‘씨’의 첫소리','v22m');el('path',{d:'M920,270H1060',fill:'none',stroke:CM,'stroke-width':2,'stroke-dasharray':'2 8'},S);
    wl(S,700,460,1500,460,CM);const J=joinV2(S,600,'벼','씨','볍씨','벼의 씨',{size:96});return ()=>J.run();}}],
 sum:{lines:['옛날 ‘쌀’에는<br>ㅂ 소리가 붙어 있었다.','혼자 쓸 땐 사라졌지만<br>어떤 말 뒤에선 나타난다.','그래서 햅쌀, 멥쌀,<br>좁쌀, 찹쌀, 볍씨.'],
  words:[['햅쌀','그해에 난 쌀.<br>해 + 쌀'],['볍씨','벼의 씨.<br>벼 + 씨'],['받침','글자 아래에<br>받치는 자음']]},
 end:{q:'‘좁쌀’은 무엇과 무엇이 합쳐진 말일까?',a:'조 + 쌀. 숨어 있던 ㅂ이 ‘조’의 받침으로 들어갔어.',h:'쌀 봉지 글자에서<br>‘쌀’을 찾아봐.',btn:'답 보기',
  draw(S){const big=tx(S,1100,420,'좁쌀','vs160','middle');const q=tx(S,1100,560,'?','v96','middle',{style:`fill:${CM}`});wl(S,700,620,1500,620,CM);
   const a=grp(S,0);tsp(a,1100,560,'v60',[['조',null],['  +  ',CM],['쌀',null]],'middle');tx(a,1100,680,'숨은 ㅂ → ‘조’의 받침','v28','middle',{style:`fill:${SA}`});
   return ()=>{q.remove();fadeIn(a,600);};}}};
})();

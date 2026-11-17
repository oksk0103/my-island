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
// 5. 숟가락과 젓가락 — 합치기 줄(받침이 바뀌거나 끼어듦)
// mode 'swap': a의 받침 ㄹ이 빠지고 ㄷ이 들어감 / 'add': a와 b 사이에서 ㅅ이 내려와 a의 받침이 됨
function join5(S,y,a,b,res,{size=96,x0=700,mode='swap',jam='ㄷ',note='',keep=false}={}){const cls=size===96?'v96':'v60',k=size*.93;
 const ax=x0,px=ax+a.length*k+size*.35,bx=px+size*.85,ar=bx+b.length*k+size*.35,rx=ar+size*1.2;
 tx(S,ax,y,a,cls);tx(S,px,y,'+',cls,undefined,{style:`fill:${CM}`});tx(S,bx,y,b,cls);tx(S,ar,y,'→',cls,undefined,{style:`fill:${CM}`});
 const slot=wl(S,rx,y+size*.25,rx+res.length*k,y+size*.25,CM,{'stroke-dasharray':'4 10'});
 const R=tx(S,rx,y,res,cls);R.setAttribute('opacity',0);let N=null;if(note){N=tx(S,1504,y,note,'v22m','end');N.setAttribute('opacity',0);}
 const tx1=ax+(a.length-.5)*k,ty1=y+size*.42,cs=size===96?'v60':'v28';
 const run=()=>{const fin=()=>{R.setAttribute('opacity',1);slot.setAttribute('opacity',0);if(N)fadeIn(N,500);};
  const j=tx(S,0,0,jam,cs,'middle',{style:`fill:${SA}`});
  if(mode==='swap'){const l=tx(S,tx1,ty1+size*.3,'ㄹ',cs,'middle',{style:`fill:${CM}`});glide(l,tx1,ty1+size*.3,tx1,ty1+size*1.0,700,()=>fadeOut(l,300));
   glide(j,tx1+size*.9,ty1+size*1.0,tx1,ty1+size*.3,900,()=>{fin();glide(j,tx1,ty1+size*.3,rx+(a.length-.5)*k,ty1+size*.3,600,()=>{if(!keep)fadeOut(j,500);});});}
  else{const sx=px+size*.3;glide(j,sx,y-size*1.1,sx,y-size*.2,800,()=>{fin();glide(j,sx,y-size*.2,rx+(a.length-.5)*k,ty1+size*.3,700,()=>{if(!keep)fadeOut(j,500);});});}};
 return {run,R};}
EPX[5]={day:'5일차',topic:'숟가락과 젓가락',cat:'맞춤법',field:'국어',frame:'v2',
 cover:{h:'숟가락은 ㄷ,<br>젓가락은 ㅅ.<br>왜?',draw(S){
   tsp(S,700,300,'v96',[['숟',null],['가락',CM]]);tsp(S,700,540,'v96',[['젓',null],['가락',CM]]);
   const d=tx(S,1380,320,'ㄷ','vs160','middle',{style:`fill:${SA}`}),s=tx(S,1380,560,'ㅅ','vs160','middle');
   const l1=el('path',{d:'M760,330C820,380 1100,300 1290,270',fill:'none',stroke:SA,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},S);
   const l2=el('path',{d:'M760,570C820,620 1100,540 1290,510',fill:'none',stroke:W0,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},S);
   wl(S,700,640,1500,640,CM);tx(S,700,680,'받침이 다른 두 낱말','v22m');
   return ()=>{};}},
 scenes:[
  {k:'숟가락',h:'숟가락은<br>‘술’에서 왔다',b:'밥 한 술, 두 술 할 때의 <em>술</em>이야. 술과 가락이 만나 ㄹ이 ㄷ 소리로 나서 <em>숟가락</em>으로 적어.',steps:['술 + 가락'],
   draw(S){tsp(S,700,210,'v60',[['밥 한 ',CM],['술',null],[', 두 ',CM],['술',null]]).style.whiteSpace='pre';tx(S,700,256,'술 = 숟가락으로 한 번 뜬 양','v22m');
    wl(S,700,300,1500,300,CM);const J=join5(S,480,'술','가락','숟가락',{keep:true});
    tx(S,700,670,'옛 사전에는 ‘술가락’도 실려 있었어','v22m');return ()=>J.run();}},
  {k:'ㄹ이 ㄷ으로',h:'ㄹ이 ㄷ으로 바뀐<br>말이 또 있다',b:'끝소리 ㄹ이 다른 말과 만나 <em>ㄷ 소리</em>가 나면 ㄷ으로 적자고 맞춤법에서 정했어.',steps:['이틀 + 날','사흘 + 날'],
   draw(S){const r0=tsp(S,700,200,'v60',[['술',null],[' + ',CM],['가락',null],['  →  ',CM],['숟가락',null]]);tx(S,1504,200,'한글 맞춤법 제29항','v22m','end');wl(S,700,250,1500,250,CM);
    const R=[join5(S,400,'이틀','날','이튿날'),join5(S,580,'사흘','날','사흗날')];return i=>R[i].run();}},
  {k:'젓가락',h:'젓가락은<br>‘저’에서 왔다',b:'‘저’는 젓가락을 뜻하는 한자 <em>箸(저)</em>야. 저와 가락 사이에 <em>ㅅ</em>이 끼어들어 젓가락.',steps:['저 + 가락'],
   draw(S){tx(S,780,300,'箸','vs160','middle');tx(S,780,370,'젓가락 저','v28','middle');
    tx(S,1000,230,'한자','v22m');tx(S,1000,280,'저','v60');el('path',{d:'M880,250H980',fill:'none',stroke:CM,'stroke-width':2,'stroke-dasharray':'2 8'},S);
    tsp(S,1504,330,'v60',[['저',null],[' + ㅅ + ',CM],['가락',null]],'end');tx(S,1504,370,'젓가락의 짜임','v22m','end');wl(S,700,430,1500,430,CM);const J=join5(S,600,'저','가락','젓가락',{mode:'add',jam:'ㅅ',keep:true});return ()=>J.run();}}],
 sum:{lines:['숟가락은 술 + 가락,<br>ㄹ이 ㄷ으로 바뀌었다.','젓가락은 저 + ㅅ + 가락,<br>사이에 ㅅ이 들어갔다.','그래서 둘의 받침이<br>서로 다르다.'],
  words:[['술','숟가락으로<br>한 번 뜬 양'],['箸(저)','젓가락을 뜻하는<br>한자'],['이튿날','이틀 + 날.<br>ㄹ이 ㄷ으로']]},
 end:{q:'‘사흘 + 날’은 어떻게 쓸까?',a:'사흗날. ㄹ이 ㄷ 소리로 나니까 ㄷ으로 써.',h:'저녁 먹을 때<br>가족에게 숟가락<br>받침을 물어봐.',btn:'답 보기',
  draw(S){tsp(S,1100,330,'v96',[['사흘',null],[' + ',CM],['날',null]],'middle');const q=tx(S,1100,520,'?','v96','middle',{style:`fill:${CM}`});wl(S,700,600,1500,600,CM);
   const a=grp(S,0);tsp(a,1100,520,'vs160',[['사',null],['흗',SA],['날',null]],'middle');
   return ()=>{q.remove();fadeIn(a,600);};}}};
})();

(()=>{ // 24. 낫다·낳다·났다 — 새 틀(v2) 이야기: 받침 비교
const C='#F3E9D2',A='#E9B872',B='#2C4A80',M='rgba(243,233,210,.45)';
const EM={v22:22,v22m:22,v28:28,v60:60,v96:96,vs28:28,vs60:60,vs96:96,vs160:160};
const cw=ch=>/[가-힣]/.test(ch)?1:ch===' '?.3:/[.,!?’‘·]/.test(ch)?.32:/[0-9a-zA-Z\-]/.test(ch)?.6:1;
const tw=(s,k)=>[...s].reduce((a,ch)=>a+cw(ch),0)*EM[k];
const T=(p,x,y,s,k,anc='start',f)=>tx(p,x,y,s,k,anc,f?{style:'fill:'+f}:{});
// 한 줄 문장: 하나의 <text> 안에 조각(tspan). parts=[[글,{hide,fill}]] — 위치는 실제 글꼴로 잼
function sent(p,x,y,parts,k='v60'){const t=el('text',{x,y,class:k,'xml:space':'preserve',style:'white-space:pre'},p);let i=0;
 const seg=parts.map(([s,o={}])=>{const ts=el('tspan',{},t);ts.textContent=s;if(o.fill)ts.style.fill=o.fill;if(o.hide)ts.setAttribute('fill-opacity',0);const r={ts,start:i,len:s.length,s};i+=s.length;return r;});
 const pos=j=>{const g=seg[j];let a=0,w=0;try{a=g.start?t.getSubStringLength(0,g.start):0;w=t.getSubStringLength(g.start,g.len);}catch(e){}return {x:x+a,w};};
 return {t,seg,pos,x,y};}
const fontsOk=fn=>{(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>requestAnimationFrame(fn));};
// 숨긴 조각 자리에 점선 빈칸
function slot(p,R,j){const l=wl(p,0,R.y+12,0,R.y+12,C,{'stroke-dasharray':'8 8'});fontsOk(()=>{const q=R.pos(j);l.setAttribute('x1',q.x+4);l.setAttribute('x2',q.x+q.w-4);});return l;}
// 글자가 (x0,y0)에서 R의 j번 조각 자리로 날아가 앉음
function land(p,R,j,x0,y0,k='v60',D=1000,end){const q=R.pos(j),m=T(p,x0,y0,R.seg[j].s,k,'start',A);
 glide(m,x0,y0,q.x,R.y,D,40,()=>{m.remove();R.seg[j].ts.setAttribute('fill-opacity',1);R.seg[j].ts.style.fill=A;end&&end();});return m;}
const rule=(p,y,x1=640,x2=1504)=>wl(p,x1,y,x2,y,M);
function glide(n,x0,y0,x1,y1,D=1000,lift=70,end){const set=e=>{n.setAttribute('x',(x0+(x1-x0)*e).toFixed(1));n.setAttribute('y',(y0+(y1-y0)*e-Math.sin(Math.PI*e)*lift).toFixed(1));};
 if(calm()){set(1);end&&end();return;}play(D,set,end);}
function arrow(p,x1,y1,x2,y2,c=C){const g=el('g',{},p);wl(g,x1,y1,x2,y2,c);const a=Math.atan2(y2-y1,x2-x1),L=14;
 [-1,1].forEach(s=>wl(g,x2,y2,x2-L*Math.cos(a+s*.5),y2-L*Math.sin(a+s*.5),c));return g;}
// R의 j번 조각 밑에 밑줄이 왼쪽에서 오른쪽으로 그어짐
function under(p,R,j,dy=20,c=A){const l=wl(p,0,R.y+dy,0,R.y+dy,c,{'stroke-width':4,opacity:0});
 return {l,run:(D=700,end)=>{const q=R.pos(j);l.setAttribute('x1',q.x);l.setAttribute('opacity',1);const set=e=>l.setAttribute('x2',(q.x+q.w*e).toFixed(1));if(calm()){set(1);end&&end();return;}play(D,set,end);}};}
// 빈칸(밑줄 자리)
const blank=(p,x,y,w)=>wl(p,x+6,y+10,x+w-6,y+10,C,{'stroke-dasharray':'8 8'});

const fade=(n,a,b,D=500,end)=>{if(calm()){n.setAttribute('opacity',b);end&&end();return;}play(D,e=>n.setAttribute('opacity',a+(b-a)*e),end);};
EPX[24]={day:'12월 3일',topic:'낫다·낳다·났다',cat:'맞춤법',field:'국어',frame:'v2',
 cover:{h:'낫다, 낳다,<br>났다는<br>어떻게 달라?',draw(S){
   T(S,660,150,'받침만 다른 세 낱말','v22m');wl(S,660,170,1504,170,M);
   const W=[['낫다','아프던 게?'],['낳다','알이?'],['났다','새 이가?']];
   W.forEach(([w,h],i)=>{const y=310+i*150;rule(S,y+22);T(S,660,y,w,'vs96');T(S,1504,y,h,'v28','end');});
   const col=wl(S,648,200,648,650,A,{'stroke-dasharray':'2 10',opacity:0});T(S,660,690,'모두 ‘나’로 시작','v22m');
   return ()=>fade(col,0,1,1200);}},
 scenes:[
  {k:'낫다',h:'아프던 게 고쳐지면<br>‘낫다’',b:'감기나 상처가 고쳐져 원래대로 되는 건 <em>낫다</em>야. ‘아’를 만나면 ㅅ이 빠져서 ‘나아’가 돼.',steps:['ㅅ 빼 보기'],
   draw(S){
    T(S,660,240,'낫다','vs96');T(S,1504,240,'병·상처가 고쳐짐','v22m','end');wl(S,640,290,1504,290,M);
    // 모양 바뀌는 띠
    const F=[['낫고',660],['낫지',900]];F.forEach(([w,x])=>T(S,x,400,w,'v60'));
    const nX=1100,big=T(S,nX,400,'낫','v60');T(S,nX+66,394,'+','v28');T(S,nX+96,400,'아','v60');
    const sj=T(S,nX+30,446,'ㅅ','v60','start',A);sj.setAttribute('opacity',0);
    const res=grp(S,0);T(res,1504,400,'= 나아','v60','end');
    T(S,660,450,'ㅅ이 그대로','v22m');T(S,nX,450,'‘아’를 만나면?','v22m');rule(S,420);
    rule(S,600);sent(S,660,580,[['감기가 다 '],['나았어'],['.']]);T(S,1504,580,'집','v22m','end');
    return ()=>{big.textContent='나';sj.setAttribute('opacity',1);glide(sj,nX+30,400,nX+30,540,900,-10,()=>{fade(sj,1,0,400);fade(res,0,1,400);});};}},
  {k:'낳다',h:'아기나 알이 나오면<br>‘낳다’',b:'배 속의 아기, 새끼, 알을 몸 밖으로 내보내는 건 <em>낳다</em>야. 받침에 ‘ㅎ’이 숨어 있어서 소리가 달라져.',steps:['소리 내 보기'],
   draw(S){
    T(S,660,200,'쓸 때','v22m');T(S,1100,200,'소리 낼 때','v22m');wl(S,640,222,1504,222,M);wl(S,1060,180,1060,470,M);
    const R=[['낳다','[나타]',320],['낳아','[나아]',450]];
    const P=R.map(([w,s,y])=>{T(S,660,y,w,'vs96');const t=T(S,1100,y,s,'vs96');t.setAttribute('opacity',0);const ln=arrow(S,900,y-34,1040,y-34,M);return t;});
    const note=grp(S,0);T(note,1100,500,'ㅎ은 쓰지만 소리는 숨어','v28','start',A);
    rule(S,620);sent(S,660,600,[['닭이 알을 '],['낳았어'],['.']]);T(S,1504,600,'학교 닭장','v22m','end');
    return ()=>{P.forEach((t,i)=>{setTimeout(()=>{t.setAttribute('opacity',1);glide(t,900,(i?450:320),1100,(i?450:320),700,20);},calm()?0:i*500);});setTimeout(()=>show(note),calm()?0:1300);};}},
  {k:'났다',h:'‘났다’는<br>‘나다’가 지난 일이 된 말',b:'이가 돋고, 싹이 트고, 구멍이 생기는 건 <em>나다</em>야. 벌써 그랬으면 ‘났다’라고 써.',steps:['학교에서','집에서','친구랑'],
   draw(S){
    T(S,660,220,'나다','vs96');arrow(S,880,186,990,186);T(S,1020,220,'났다','vs96');T(S,1504,220,'지난 일','v22m','end');
    wl(S,640,266,1504,266,M);
    const R=[{y:380,tag:'학교',parts:[['화분에 새싹이 '],['났',{hide:1}],['어.']]},
             {y:500,tag:'집',parts:[['동생 이가 새로 '],['났',{hide:1}],['어.']]},
             {y:620,tag:'친구',parts:[['친구 양말에 구멍이 '],['났',{hide:1}],['어.']]}];
    R.forEach(r=>{rule(S,r.y+18);r.R=sent(S,660,r.y,r.parts);r.bl=slot(S,r.R,1);T(S,1504,r.y,r.tag,'v22m','end');});
    return i=>{const r=R[i];R.forEach((q,j)=>{if(j<i)q.R.seg[1].ts.style.fill=C;});land(S,r.R,1,1030,220,'v60',1000,()=>r.bl.setAttribute('opacity',0));};}}],
 sum:{lines:['아프던 게 고쳐지면<br>낫다 → 나았다.','아기·알이 나오면<br>낳다 → 낳았다.','이·싹이 돋으면<br>나다 → 났다.'],
  words:[['낫다','병이나 상처가 고쳐져 본래대로 되다'],['낳다','배 속의 아이, 새끼, 알을 몸 밖으로 내보내다'],['나다','피부 표면이나 땅 위로 솟다']]},
 end:{q:'‘감기가 다 ○○어’에는 무엇이 들어갈까?',a:'나았어. ‘낫다’가 바뀐 말이야. ‘났어’는 ‘나다’가 바뀐 말이야.',h:'오늘 새로 난 것과<br>다 나은 것을<br>하나씩 찾아 봐.',btn:'찾아보기',
  draw(S){
   T(S,700,200,'난 것','vs60');T(S,1110,200,'나은 것','vs60');wl(S,640,232,1504,232,M);wl(S,1080,160,1080,500,M);
   const L=[['새 이가 났다',700,330],['구멍이 났다',700,460],['감기가 나았다',1110,330],['상처가 나았다',1110,460]];
   const G=L.map(([w,x,y])=>{rule(S,y+18,x-20,x<1000?1060:1504);const g=grp(S,0);T(g,x,y,w,'v60');return g;});
   const cap=grp(S,0);T(cap,700,580,'났다 ≠ 나았다','v60','start',A);
   return ()=>{G.forEach((g,i)=>setTimeout(()=>show(g),calm()?0:i*250));setTimeout(()=>show(cap),calm()?0:1100);};}}};
})();

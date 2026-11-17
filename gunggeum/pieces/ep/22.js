(()=>{ // 22. '안'과 '않' — 새 틀(v2) 이야기: 공책 줄 위의 활자
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

EPX[22]={day:'12월 1일',topic:'안과 않',cat:'맞춤법',field:'국어',frame:'v2',
 cover:{h:'‘안’과 ‘않’,<br>뭐가<br>다를까?',draw(S){
   T(S,660,170,'같은 뜻, 다른 글자','v22m');wl(S,660,190,1504,190,M);
   rule(S,356);rule(S,566);
   const r1=sent(S,660,330,[['안'],[' 먹어.']],'v96'),r2=sent(S,660,540,[['먹지 '],['않',{fill:A}],['아.']],'v96');
   const arc=el('path',{fill:'none',stroke:C,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round',opacity:0},S);
   fontsOk(()=>{const a=r1.pos(0),b=r2.pos(1),ax=a.x+a.w/2,bx=b.x+b.w/2;arc.setAttribute('d',`M${ax},376C${ax},430 ${bx},400 ${bx},450`);});
   T(S,1504,540,'?','vs160','end');
   T(S,660,640,'받침 하나 차이','v22m');
   return ()=>{if(calm()){arc.setAttribute('opacity',1);return;}play(1200,e=>arc.setAttribute('opacity',e));};}},
 scenes:[
  {k:'안',h:'‘안’은<br>‘아니’를 줄인 말이다',b:'<em>안</em>은 ‘아니’를 짧게 줄인 말이야. ‘먹을래’ 같은 말 바로 앞에 띄어서 써.',steps:['‘아니’ 넣어 보기'],
   draw(S){
    T(S,660,240,'아니','vs96');arrow(S,890,206,1010,206);T(S,950,176,'줄이면','v22m','middle');T(S,1040,240,'안','vs96');
    T(S,1504,240,'본래 말 → 줄인 말','v22m','end');
    rule(S,420);rule(S,560);
    sent(S,660,400,[['당근을 '],['안'],[' 먹을래.']]);T(S,1504,400,'줄인 말','v22m','end');
    const R2=sent(S,660,540,[['당근을 '],['아니',{hide:1}],[' 먹을래.']]);const bl=slot(S,R2,1);T(S,1504,540,'본래 말','v22m','end');
    const cap=grp(S,0);T(cap,660,630,'‘아니’를 넣어도 뜻이 똑같아','v28');
    return ()=>land(S,R2,1,660,240,'v60',1100,()=>{bl.setAttribute('opacity',0);show(cap);});}},
  {k:'않',h:'‘않’은<br>‘아니하’를 줄인 말이다',b:'<em>않</em>은 ‘아니하’를 줄인 말이야. 그래서 받침에 ‘ㅎ’이 들어 있어. ‘먹지’처럼 ‘-지’ 뒤에 와.',steps:['‘아니하’ 넣어 보기'],
   draw(S){
    T(S,660,240,'아니하다','vs96');arrow(S,1060,206,1170,206);T(S,1115,176,'줄이면','v22m','middle');T(S,1200,240,'않다','vs96');
    rule(S,420);rule(S,560);
    sent(S,660,400,[['당근을 먹지 '],['않'],['을래.']]);T(S,1504,400,'줄인 말','v22m','end');
    const R2=sent(S,660,540,[['당근을 먹지 '],['아니할',{hide:1}],['래.']]);const bl=slot(S,R2,1);T(S,1504,540,'본래 말','v22m','end');
    const cap=grp(S,0);T(cap,660,630,'‘아니할래’라고 해도 뜻이 똑같아','v28');
    return ()=>land(S,R2,1,660,240,'v60',1100,()=>{bl.setAttribute('opacity',0);show(cap);});}},
  {k:'자리',h:'‘안’은 앞에,<br>‘않’은 ‘-지’ 뒤에 온다',b:'<em>안</em>은 하는 말 바로 앞에 띄어 써. <em>않</em>은 ‘-지’ 뒤에 와서 ‘-지 않다’가 돼.',steps:['학교에서','집에서','친구랑'],
   draw(S){
    T(S,700,230,'안','vs96','middle');T(S,700,272,'하는 말 앞','v22m','middle');
    T(S,1000,230,'않','vs96','middle');T(S,1000,272,'‘-지’ 뒤','v22m','middle');
    wl(S,640,300,1504,300,M);
    const R=[{y:400,tag:'학교',parts:[['우산을 '],['안',{hide:1}],[' 가져왔어.']],x0:670},
             {y:510,tag:'집',parts:[['방이 깨끗하지 '],['않',{hide:1}],['아.']],x0:970},
             {y:620,tag:'친구',parts:[['친구가 아직 '],['안',{hide:1}],[' 왔어.']],x0:670}];
    R.forEach(r=>{rule(S,r.y+18);r.R=sent(S,660,r.y,r.parts);r.bl=slot(S,r.R,1);T(S,1504,r.y,r.tag,'v22m','end');});
    return i=>{const r=R[i];R.forEach((q,j)=>{if(j<i)q.R.seg[1].ts.style.fill=C;});land(S,r.R,1,r.x0,230,'v60',1000,()=>r.bl.setAttribute('opacity',0));};}}],
 sum:{lines:['‘안’은 ‘아니’를<br>줄인 말이다.','‘않’은 ‘아니하’를<br>줄인 말이다.','‘-지’ 뒤에는 ‘않’,<br>하는 말 앞에는 ‘안’.'],
  words:[['안','‘아니’를 줄인 말. 뒷말과 띄어 쓴다'],['않다','‘아니하다’를 줄인 말'],['준말','긴 말을 짧게 줄인 말']]},
 end:{q:'‘숙제를 하지 ○았어’의 ○에는 무엇이 들어갈까?',a:'않. ‘-지’ 뒤라서 ‘하지 않았어’라고 써.',h:'오늘 일기에서<br>‘안’과 ‘않’을 찾아<br>밑줄을 쳐 봐.',btn:'밑줄 긋기',
  draw(S){T(S,700,170,'일기','v28');wl(S,640,196,1504,196,M);
   const R=[[260,[['비가 와서 '],['안'],[' 나갔어.']],1],[380,[['그래도 심심하지 '],['않'],['았어.']],1],[500,[['동생이랑 블록 놀이를 했어.']],-1]];
   const U=[];R.forEach(([y,parts,j])=>{rule(S,y+20);const o=sent(S,700,y,parts);if(j>=0)U.push(under(S,o,j,20));});
   const cap=grp(S,0);T(cap,700,600,'안 → 띄어 쓰기 · 않 → ‘-지’ 뒤','v28');
   return ()=>{U[0].run(600,()=>U[1].run(600,()=>show(cap)));};}}};
})();

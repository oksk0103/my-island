(()=>{ // 25. 가르치다와 가리키다 — 새 틀(v2) 이야기: 시계 바늘·낱말 전하기
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
EPX[25]={day:'12월 4일',topic:'가르치다와 가리키다',cat:'헷갈리는 말',field:'국어',frame:'v2',
 cover:{h:'가르치다,<br>가리키다,<br>같은 말일까?',draw(S){
   T(S,660,170,'두 글자만 다른 두 낱말','v22m');wl(S,660,190,1504,190,M);
   rule(S,356);rule(S,566);
   sent(S,660,330,[['가'],['르치'],['다']],'vs96');sent(S,660,540,[['가'],['리키',{fill:A}],['다']],'vs96');
   T(S,1504,330,'배우게 하기?','v28','end');T(S,1504,540,'손으로 짚기?','v28','end');
   const q=T(S,1504,680,'?','vs96','end');q.setAttribute('opacity',0);
   return ()=>fade(q,0,1,900);}},
 scenes:[
  {k:'가르치다',h:'알게 하고 익히게 하면<br>‘가르치다’',b:'지식이나 방법을 설명해서 익히게 하는 건 <em>가르치다</em>야. 선생님이 덧셈을 가르쳐 주시는 것처럼.',steps:['전해 보기'],
   draw(S){
    T(S,660,240,'선생님','vs60');T(S,1504,240,'우리 반','vs60','end');
    const y=210;el('path',{d:`M880,${y}H1240`,fill:'none',stroke:M,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},S);arrow(S,1250,y,1270,y);
    const w=T(S,880,y-34,'덧셈','v60','start',A);const got=T(S,1504,300,'덧셈을 익혔어','v22m','end');got.setAttribute('opacity',0);
    wl(S,640,340,1504,340,M);
    rule(S,470);sent(S,660,450,[['선생님이 덧셈을 '],['가르쳐'],[' 주셨어.']]);T(S,1504,450,'학교','v22m','end');
    rule(S,610);sent(S,660,590,[['언니가 줄넘기를 '],['가르쳐'],[' 줬어.']]);T(S,1504,590,'집','v22m','end');
    return ()=>glide(w,880,y-34,1110,y-34,1200,30,()=>fade(got,0,1,400));}},
  {k:'가리키다',h:'손으로 짚어 보이면<br>‘가리키다’',b:'손가락을 어느 쪽으로 향하게 해서 알려 주는 건 <em>가리키다</em>야. 시계 바늘이 시각을 알려 주는 것도 ‘가리킨다’고 해.',steps:['바늘 돌리기'],
   draw(S){
    const cx=860,cy=380,R=200;el('circle',{cx,cy,r:R,fill:'none',stroke:C,'stroke-width':2},S);
    for(let i=0;i<60;i++){const a=i/60*Math.PI*2,big=i%5===0,r1=R-(big?22:10);wl(S,cx+Math.sin(a)*r1,cy-Math.cos(a)*r1,cx+Math.sin(a)*R,cy-Math.cos(a)*R,big?C:M);}
    [12,3,6,9].forEach(n=>{const a=n/12*Math.PI*2;T(S,cx+Math.sin(a)*(R-56),cy-Math.cos(a)*(R-56)+10,String(n),'v28','middle');});
    wl(S,cx,cy,cx,cy-R+84,C,{'stroke-width':3});
    const hand=wl(S,cx,cy,cx,cy-R+80,A,{'stroke-width':6});const set=h=>{const a=h/12*Math.PI*2,L=R-80;hand.setAttribute('x2',cx+Math.sin(a)*L);hand.setAttribute('y2',cy-Math.cos(a)*L);};set(3);
    el('circle',{cx,cy,r:8,fill:C},S);
    T(S,1150,300,'짧은 바늘이','v22m');const big=T(S,1150,400,'3시','v96');T(S,1150,450,'를 가리켜','v28');
    rule(S,640,1120,1504);const R2=sent(S,1150,620,[['3'],['시를 가리켜.']]);
    return ()=>{const st=3;const f=e=>{set(st+5*e);big.textContent=Math.round(st+5*e)+'시';};const done=()=>{R2.seg[0].ts.textContent='8';};if(calm()){f(1);done();}else play(1400,f,done);};}},
  {k:'가려 쓰기',h:'짚으면 가리키다,<br>배우게 하면 가르치다',b:'헷갈리면 <em>손가락</em>을 떠올려 봐. 손가락으로 짚는 거면 ‘가리키다’, 배우게 하는 거면 ‘가르치다’야.',steps:['학교에서','집에서','친구랑'],
   draw(S){
    T(S,660,220,'가리키다','vs60');T(S,660,256,'짚어 보이기','v22m');T(S,1100,220,'가르치다','vs60');T(S,1100,256,'익히게 하기','v22m');
    wl(S,640,286,1504,286,M);
    const R=[{y:390,tag:'학교',parts:[['선생님이 칠판을 '],['가리켰',{hide:1}],['어.']],x0:660},
             {y:510,tag:'집',parts:[['아빠가 수영을 '],['가르쳐',{hide:1}],[' 줬어.']],x0:1100},
             {y:630,tag:'친구',parts:[['친구가 창밖을 '],['가리켰',{hide:1}],['어.']],x0:660}];
    R.forEach(r=>{rule(S,r.y+18);r.R=sent(S,660,r.y,r.parts);r.bl=slot(S,r.R,1);T(S,1504,r.y,r.tag,'v22m','end');});
    return i=>{const r=R[i];R.forEach((q,j)=>{if(j<i)q.R.seg[1].ts.style.fill=C;});land(S,r.R,1,r.x0,220,'v60',1000,()=>r.bl.setAttribute('opacity',0));};}}],
 sum:{lines:['배우고 익히게 하면<br>가르치다.','손가락이나 바늘로 짚어<br>알려 주면 가리키다.','헷갈리면 손가락을<br>떠올린다.'],
  words:[['가르치다','지식이나 기술을 설명해서 익히게 하다'],['가리키다','손가락이나 물건을 어떤 쪽으로 향하게 해 알게 하다'],['가르키다','없는 말. ‘가르치다’나 ‘가리키다’로 써야 해']]},
 end:{q:'그림책에서 모르는 글자를 손가락으로 짚는 건 어느 말일까?',a:'가리키다. 손가락으로 짚어 보이니까.',h:'오늘 아는 것<br>하나를 가족에게<br>가르쳐 줘 봐.',btn:'짝 지어 보기',
  draw(S){
   T(S,700,200,'가르치다','vs60');T(S,1110,200,'가리키다','vs60');wl(S,640,232,1504,232,M);wl(S,1080,160,1080,500,M);
   const L=[['덧셈을',700,330],['수영을',700,460],['칠판을',1110,330],['8시를',1110,460]];
   const G=L.map(([w,x,y])=>{rule(S,y+18,x-20,x<1000?1060:1504);const g=grp(S,.2);T(g,x,y,w,'v60');return g;});
   const cap=grp(S,0);T(cap,700,600,'짚으면 가리키다','v60','start',A);
   return ()=>{G.forEach((g,i)=>setTimeout(()=>show(g),calm()?0:i*250));setTimeout(()=>show(cap),calm()?0:1100);};}}};
})();

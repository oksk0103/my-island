(()=>{ // 23. '되'와 '돼' — 새 틀(v2) 이야기: 글자 합치기
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
EPX[23]={day:'12월 2일',topic:'되와 돼',cat:'맞춤법',field:'국어',frame:'v2',
 cover:{h:'‘되’일까<br>‘돼’일까?',draw(S){
   T(S,660,170,'소리는 비슷, 글자는 둘','v22m');wl(S,660,190,1504,190,M);
   rule(S,356);rule(S,566);
   const r1=sent(S,660,330,[['놀아도 '],['돼',{fill:A}],['?']],'v96'),r2=sent(S,660,540,[['화가가 '],['될'],['래.']],'v96');
   const arc=el('path',{fill:'none',stroke:C,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round',opacity:0},S);
   fontsOk(()=>{const a=r1.pos(1),b=r2.pos(1),ax=a.x+a.w/2,bx=b.x+b.w/2;arc.setAttribute('d',`M${ax},376C${ax},430 ${bx},400 ${bx},450`);});
   T(S,1504,540,'?','vs160','end');T(S,660,640,'모음 하나 차이','v22m');
   return ()=>fade(arc,0,1,1200);}},
 scenes:[
  {k:'돼',h:'‘돼’는<br>‘되어’를 줄인 말이다',b:'<em>돼</em>는 ‘되어’를 줄여 쓴 말이야. ‘되’와 ‘어’가 만나서 한 글자로 합쳐졌어.',steps:['합쳐 보기'],
   draw(S){
    const a=T(S,660,250,'되','vs96'),pl=T(S,790,236,'+','v60'),b=T(S,850,250,'어','vs96');arrow(S,990,216,1110,216);
    const c=T(S,1150,250,'돼','vs96','start',A);c.setAttribute('opacity',0);
    T(S,708,330,'ㅚ','v60','middle');T(S,898,330,'ㅓ','v60','middle');const cj=T(S,1198,330,'ㅙ','v60','middle');cj.setAttribute('opacity',0);
    T(S,1504,250,'두 글자 → 한 글자','v22m','end');
    rule(S,520);sent(S,660,500,[['다 하면 놀아도 '],['돼'],['.']]);T(S,1504,500,'줄인 말','v22m','end');
    rule(S,640);const R2=sent(S,660,620,[['다 하면 놀아도 '],['되어',{hide:1}],['.']]);const bl=slot(S,R2,1);T(S,1504,620,'본래 말','v22m','end');
    return ()=>{const a2=T(S,660,250,'되','vs96'),b2=T(S,850,250,'어','vs96');glide(a2,660,250,1150,250,900,30);glide(b2,850,250,1150,250,900,30,()=>{a2.remove();b2.remove();fade(c,0,1,300);fade(cj,0,1,300);
      land(S,R2,1,1150,330,'v60',900,()=>{bl.setAttribute('opacity',0);R2.seg[1].ts.style.fill=C;});});};}},
  {k:'되',h:'‘어’가 아닌 말이 붙으면<br>‘되’로 쓴다',b:'‘되고’, ‘되니까’, ‘될래’처럼 ‘되’ 뒤에 ‘어’가 아닌 다른 말이 붙을 때는 <em>되</em>를 그대로 써.',steps:['이어 보기'],
   draw(S){
    const cx=760,cy=420;T(S,cx,cy+34,'되','vs96','start',A).setAttribute('text-anchor','middle');T(S,cx,cy+80,'줄기','v22m','middle');
    const B=[['되고','화가가 되고 싶어'],['되니까','2학년이 되니까'],['될래','반장이 될래'],['된','얼음이 된 물']];
    const N=B.map(([w,ex],i)=>{const y=190+i*140;const ln=el('path',{d:`M${cx+70},${cy}C${cx+150},${cy} ${cx+150},${y-20} 1000,${y-20}`,fill:'none',stroke:M,'stroke-width':2},S);
      const t=T(S,1020,y,w,'v60');t.setAttribute('opacity',.2);const e=T(S,1020,y+40,ex,'v22m');e.setAttribute('opacity',.2);rule(S,y+58,1020,1504);return {t,e,y};});
    return ()=>N.forEach((n,i)=>setTimeout(()=>{n.t.setAttribute('opacity',1);glide(n.t,cx-30,cy+34,1020,n.y,800,0,()=>fade(n.e,.2,1,300));},calm()?0:i*260));}},
  {k:'되어 넣기',h:'‘되어’가 어울리면<br>‘돼’를 쓴다',b:'헷갈리면 그 자리에 <em>되어</em>를 넣어 봐. 말이 되면 ‘돼’, 어색하면 ‘되’야.',steps:['학교에서','집에서','친구랑'],
   draw(S){
    T(S,660,220,'되어','vs96');T(S,900,186,'말이 되면 → 돼','v28');T(S,900,230,'어색하면 → 되','v28');
    wl(S,640,266,1504,266,M);
    const R=[{y:360,tag:'학교',parts:[['교실에 들어가도 '],['돼',{hide:1}],['?']],test:'들어가도 되어? → 말이 돼'},
             {y:485,tag:'집',parts:[['나는 화가가 '],['되',{hide:1}],['고 싶어.']],test:'화가가 되어고? → 어색해'},
             {y:610,tag:'친구',parts:[['우리 이제 단짝이 '],['됐',{hide:1}],['어.']],test:'단짝이 되었어 → 말이 돼'}];
    R.forEach(r=>{rule(S,r.y+18);r.R=sent(S,660,r.y,r.parts);r.bl=slot(S,r.R,1);T(S,1504,r.y,r.tag,'v22m','end');r.t=T(S,660,r.y+52,r.test,'v22m');r.t.setAttribute('opacity',0);});
    return i=>{const r=R[i];R.forEach((q,j)=>{if(j<i)q.R.seg[1].ts.style.fill=C;});fade(r.t,0,1,300);land(S,r.R,1,680,220,'v60',1000,()=>r.bl.setAttribute('opacity',0));};}}],
 sum:{lines:['‘돼’는 ‘되어’를<br>줄인 말이다.','‘되고’, ‘될래’처럼 ‘어’가<br>안 붙으면 ‘되’.','헷갈리면 ‘되어’를<br>넣어 본다.'],
  words:[['돼','‘되어’를 줄인 말'],['됐다','‘되었다’를 줄인 말'],['준말','긴 말을 짧게 줄인 말']]},
 end:{q:'‘그러면 안 ○요’에는 ‘되’와 ‘돼’ 중 무엇이 맞을까?',a:'돼. ‘안 되어요’라고 해도 말이 되니까 ‘안 돼요’라고 써.',h:'오늘 ‘돼’라고<br>말할 때 ‘되어’로<br>바꿔 말해 봐.',btn:'바꿔 말하기',
  draw(S){T(S,700,170,'말해 보기','v28');wl(S,640,196,1504,196,M);
   rule(S,320);const R1=sent(S,700,300,[['엄마, 나가 놀아도 '],['돼'],['?']]);T(S,1504,300,'줄인 말','v22m','end');
   rule(S,460);const R2=sent(S,700,440,[['엄마, 나가 놀아도 '],['되어',{hide:1}],['?']]);const bl=slot(S,R2,1);T(S,1504,440,'본래 말','v22m','end');
   const cap=grp(S,0);T(cap,700,560,'돼 = 되어','v60');
   return ()=>{fontsOk(()=>{const q=R1.pos(1);land(S,R2,1,q.x,300,'v60',1000,()=>{bl.setAttribute('opacity',0);show(cap);});});};}}};
})();

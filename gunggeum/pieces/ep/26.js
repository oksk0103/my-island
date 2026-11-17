(()=>{ // 26. 다르다와 틀리다 — 새 틀(v2) 이야기: 견주기 표·셈·글자 판
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
EPX[26]={day:'12월 5일',topic:'다르다와 틀리다',cat:'헷갈리는 말',field:'국어',frame:'v2',
 cover:{h:'‘달라’일까<br>‘틀려’일까?',draw(S){
   T(S,660,170,'자주 섞어 쓰는 두 낱말','v22m');wl(S,660,190,1504,190,M);
   rule(S,356);rule(S,566);
   T(S,660,330,'다르다','vs96');T(S,660,540,'틀리다','vs96');
   const h1=T(S,1504,330,'= 같지 않다','v60','end'),h2=T(S,1504,540,'= 어긋나다','v60','end',A);[h1,h2].forEach(h=>h.setAttribute('opacity',.15));
   T(S,660,640,'나랑 너는 달라? 틀려?','v28');
   return ()=>{fade(h1,.15,1,700);setTimeout(()=>fade(h2,.15,1,700),calm()?0:500);};}},
 scenes:[
  {k:'다르다',h:'같지 않으면<br>‘다르다’',b:'둘을 나란히 놓고 볼 때 서로 같지 않은 건 <em>다르다</em>야. 맞고 틀린 게 아니라 그냥 같지 않은 거야.',steps:['나란히 보기'],
   draw(S){
    T(S,1000,200,'나','vs60','middle');T(S,1360,200,'친구','vs60','middle');wl(S,640,230,1504,230,M);
    const Rw=[['좋아하는 색','파랑','노랑',310],['좋아하는 과일','사과','귤',410],['사는 층','3층','5층',510]];
    const N=Rw.map(([k,a,b,y])=>{T(S,660,y,k,'v28');T(S,1000,y+6,a,'v60','middle');T(S,1360,y+6,b,'v60','middle');rule(S,y+36);const ne=T(S,1180,y+6,'≠','v60','middle',A);ne.setAttribute('opacity',0);return ne;});
    [[170,268],[324,368],[424,468],[524,546]].forEach(([a,b])=>wl(S,1180,a,1180,b,M,{'stroke-dasharray':'2 10'}));
    rule(S,640);const R=sent(S,660,620,[['좋아하는 색이 서로 '],['달라',{hide:1}],['.']]);const bl=slot(S,R,1);T(S,1504,620,'친구','v22m','end');
    return ()=>{N.forEach((n,i)=>setTimeout(()=>fade(n,0,1,400),calm()?0:i*300));setTimeout(()=>{R.seg[1].ts.setAttribute('fill-opacity',1);bl.setAttribute('opacity',0);},calm()?0:1200);};}},
  {k:'틀리다',h:'셈이나 답이 어긋나면<br>‘틀리다’',b:'셈이나 사실이 맞지 않고 어긋난 건 <em>틀리다</em>야. 3 더하기 4를 8이라고 하면 틀린 거야.',steps:['고쳐 보기'],
   draw(S){
    T(S,660,300,'3 + 4 =','v96');const w=T(S,1100,300,'8','v96');const strike=wl(S,1090,270,1170,270,C,{'stroke-width':4,opacity:0});
    const ok=T(S,1260,300,'7','v96','start',A);ok.setAttribute('opacity',0);
    const lab=T(S,1100,360,'틀렸어','v28');const lab2=T(S,1260,360,'바른 답','v28');lab2.setAttribute('opacity',0);
    rule(S,330);
    rule(S,520);sent(S,660,500,[['받아쓰기에서 하나 '],['틀렸'],['어.']]);T(S,1504,500,'학교','v22m','end');
    rule(S,640);sent(S,660,620,[['3 더하기 4는 '],['8이 아니라 7'],['이야.']]);T(S,1504,620,'셈','v22m','end');
    return ()=>{fade(strike,0,1,300,()=>{w.setAttribute('opacity',.4);fade(ok,0,1,300);glide(ok,1100,300,1260,300,900,40,()=>fade(lab2,0,1,300));});};}},
  {k:'가려 쓰기',h:'같지 않으면 다르다,<br>어긋나면 틀리다',b:'서로 같지 않은 걸 찾을 땐 <em>다르다</em>를 써. 셈이나 답이 맞지 않을 때만 ‘틀리다’야.',steps:['학교에서','집에서','친구랑'],
   draw(S){
    T(S,660,220,'다르다','vs60');T(S,660,256,'같지 않다','v22m');T(S,1100,220,'틀리다','vs60');T(S,1100,256,'어긋나다','v22m');
    wl(S,640,286,1504,286,M);
    const R=[{y:390,tag:'학교',parts:[['두 그림에서 '],['다른',{hide:1}],[' 곳을 찾았어.']],x0:660},
             {y:510,tag:'집',parts:[['언니랑 나는 키가 '],['달라',{hide:1}],['.']],x0:660},
             {y:630,tag:'친구',parts:[['친구가 덧셈을 '],['틀렸',{hide:1}],['어.']],x0:1100}];
    R.forEach(r=>{rule(S,r.y+18);r.R=sent(S,660,r.y,r.parts);r.bl=slot(S,r.R,1);T(S,1504,r.y,r.tag,'v22m','end');});
    return i=>{const r=R[i];R.forEach((q,j)=>{if(j<i)q.R.seg[1].ts.style.fill=C;});land(S,r.R,1,r.x0,220,'v60',1000,()=>r.bl.setAttribute('opacity',0));};}}],
 sum:{lines:['서로 같지 않으면<br>다르다.','셈이나 답이 어긋나면<br>틀리다.','‘틀린 그림 찾기’보다<br>‘다른 그림 찾기’가 맞다.'],
  words:[['다르다','비교가 되는 두 대상이 서로 같지 아니하다'],['틀리다','셈이나 사실 따위가 그르게 되거나 어긋나다'],['다른 그림 찾기','두 그림에서 서로 다른 곳을 찾는 놀이']]},
 end:{q:'친구와 내가 좋아하는 음식이 같지 않으면 뭐라고 말할까?',a:'“우리는 좋아하는 음식이 달라.” 틀린 게 아니라 다른 거야.',h:'가족과 좋아하는<br>음식이 어떻게<br>다른지 말해 봐.',btn:'다른 곳 찾기',
  draw(S){
   T(S,680,170,'다른 그림 찾기','v28');wl(S,640,196,1504,196,M);
   const L='가나다라마바사아자'.split(''),Rr=L.slice();Rr[4]='머';const cs=110,y0=250;
   const grid=(x0,arr)=>{arr.forEach((c,i)=>{const x=x0+(i%3)*cs+cs/2,y=y0+Math.floor(i/3)*cs+cs/2;T(S,x,y+22,c,'v60','middle');});
     for(let k=0;k<=3;k++){wl(S,x0,y0+k*cs,x0+3*cs,y0+k*cs,M);wl(S,x0+k*cs,y0,x0+k*cs,y0+3*cs,M);}};
   grid(680,L);grid(1120,Rr);
   const rings=[680,1120].map(x0=>{const c=el('circle',{cx:x0+1.5*cs,cy:y0+1.5*cs,r:48,fill:'none',stroke:A,'stroke-width':3,opacity:0},S);return c;});
   const cap=grp(S,0);T(cap,680,640,'다른 곳 1개 — 마와 머','v28');
   return ()=>{rings.forEach(r=>fade(r,0,1,600));setTimeout(()=>show(cap),calm()?0:600);};}}};
})();

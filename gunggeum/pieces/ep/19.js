(()=>{ // 19. 달의 모양 — 새 틀(v2): 관측 노트
// 잉크: 크림 W0(글·선·밝은 쪽), 산호 WO(화면당 한 곳), 보조 WA(달의 어두운 쪽·안내선)
const SYN=29.5,D2X=(x1,x2)=>d=>x1+d/SYN*(x2-x1);
const sunG=(p,cx,cy,r)=>{const g=el('g',{},p);el('circle',{cx,cy,r,fill:W0},g);for(let i=0;i<8;i++){const a=i*Math.PI/4;wl(g,cx+Math.cos(a)*(r+12),cy+Math.sin(a)*(r+12),cx+Math.cos(a)*(r+30),cy+Math.sin(a)*(r+30));}return g;};
// 지구에서 본 달: 어두운 면(보조색) 위에 밝은 쪽(크림). day 0 = 안 보임, 14.75 = 보름
function moonV(p,cx,cy,r,day=0,dash=false){const g=el('g',{transform:`translate(${cx},${cy})`},p);
 el('circle',{r,fill:WA},g);const lit=el('path',{fill:W0},g);el('circle',{r,fill:'none',stroke:W0,'stroke-width':2,'stroke-dasharray':dash?'6 8':'none'},g);
 const set=d=>{const f=((d/SYN)%1+1)%1;lit.setAttribute('d',f<.025||f>.975?'':moonPath(f,r));};set(day);return {g,set,lit};}
// 위(우주)에서 본 달: 해 쪽(왼쪽) 절반만 밝음
function moonTop(p,cx,cy,r){const g=el('g',{transform:`translate(${cx},${cy})`},p);el('circle',{r,fill:WA},g);
 const lit=el('path',{d:`M0,${-r}A${r},${r} 0 0 0 0,${r}Z`,fill:W0},g);el('circle',{r,fill:'none',stroke:W0,'stroke-width':2},g);return {g,lit};}
function dayRuler(p,x1,x2,y){wl(p,x1,y,x2,y,W0m);const X=D2X(x1,x2);for(let d=0;d<=29;d++)wl(p,X(d),y,X(d),y+(d%7===0?16:9),d%7===0?W0:W0m);wl(p,x2,y,x2,y+16,W0);return X;}

EPX[19]={day:'과학 5',topic:'달의 모양',cat:'하늘',field:'과학',frame:'v2',
 cover:{h:'달은 왜<br>모양이<br>바뀔까?',draw(S){
   const M=moonV(S,1250,320,170,10);
   const big=tx(S,680,360,'10일째','v96'),sub=tx(S,684,410,'달이 안 보이던 날부터','v22m');
   const X=dayRuler(S,680,1500,560);
   [[3,'초승달'],[7.4,'반달'],[14.8,'보름달'],[22.1,'반달'],[27,'그믐달']].forEach(([d,n])=>tx(S,X(d),610,n,'v22m','middle'));
   tx(S,680,540,'0일','v22m');tx(S,1500,540,'29.5일','v22m','end');
   wl(S,680,670,1500,670,W0m);tx(S,680,706,'관측 · 밤하늘, 날마다 같은 시각','v22m');
   const mk=wdot(S,X(10),560,9,WO);
   const set=d=>{M.set(d);mk.setAttribute('cx',X(d).toFixed(1));big.textContent=Math.floor(d)+'일째';};
   let on=false;return ()=>{if(on||calm())return;on=true;loop(S,t=>set((10+t*2.6)%SYN));};}},
 scenes:[
  {k:'빌려 온 빛',h:'달은 햇빛을 받아<br>빛난다',b:'달은 스스로 빛을 내지 못해. 해를 바라보는 쪽 <em>절반</em>만 늘 밝아.',steps:['해 비추기'],
   draw(S){const sx=730,sy=400,cx=1260,cy=400,R=170;sunG(S,sx,sy,56);tx(S,sx,sy+150,'해','v60','middle');
    tx(S,cx,cy-R-34,'달','v60','middle');
    const Y=[-140,-84,-28,28,84,140],G=el('g',{},S);
    Y.forEach(o=>wl(G,sx+100,sy+o,cx-Math.sqrt(R*R-o*o)-8,sy+o,WA,{'stroke-dasharray':'2 10'}));
    const M=moonTop(S,cx,cy,R);M.lit.setAttribute('opacity',0);
    const div=wl(S,cx,cy-R-14,cx,cy+R+14,WO,{opacity:0});
    const pre=grp(S,1);tx(pre,cx,cy+R+60,'혼자서는 깜깜해','v28','middle');
    const post=grp(S,0);tx(post,cx-R/2,cy+R+60,'밝은 쪽','v28','middle');tx(post,cx+R/2,cy+R+60,'어두운 쪽','v22m','middle');
    hRuler(S,640,1504,646,48,'해 쪽','반대쪽');
    const P=[];Y.forEach((o,j)=>{for(let k=0;k<4;k++)P.push({c:wdot(S,sx+100,sy+o,0,W0),y:sy+o,x2:cx-Math.sqrt(R*R-o*o)-6,t:k*.12+j*.02});});
    return ()=>{pre.setAttribute('opacity',0);
     play(1300,e=>{P.forEach(d=>{const s=Math.max(0,Math.min(1,(e-d.t)/.55));d.c.setAttribute('r',s>0&&s<1?5:0);d.c.setAttribute('cx',(sx+100+(d.x2-sx-100)*s).toFixed(1));});M.lit.setAttribute('opacity',Math.max(0,(e-.55)/.45).toFixed(2));},
      ()=>{P.forEach(d=>d.c.setAttribute('r',0));M.lit.setAttribute('opacity',1);div.setAttribute('opacity',1);show(post);});};}},
  {k:'도는 달',h:'달이 지구를 돌면<br>모양이 바뀐다',b:'달은 지구 둘레를 돌아. 달이 어디에 있느냐에 따라 밝은 쪽이 <em>보이는 만큼</em>이 달라져.',steps:['한 칸 돌리기','한 칸 돌리기','한 칸 돌리기','한 칸 돌리기'],
   draw(S){const ex=950,ey=400,R=210;
    tx(S,644,150,'햇빛','v28');[0,1,2,3,4,5].forEach(i=>{const y=210+i*76;wl(S,644,y,700,y);el('path',{d:`M690,${y-7}L702,${y}L690,${y+7}`,fill:'none',stroke:W0,'stroke-width':2,'stroke-linejoin':'round'},S);});
    el('circle',{cx:ex,cy:ey,r:R,fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'3 9'},S);
    el('circle',{cx:ex,cy:ey,r:34,fill:W0},S);tx(S,ex,ey+72,'지구','v22','middle');
    const trail=el('path',{fill:'none',stroke:WO,'stroke-width':2,d:''},S),sight=wl(S,ex,ey,ex,ey,W0m),mg=el('g',{},S);const mt=moonTop(mg,0,0,26);
    tx(S,1350,170,'지구에서 보면','v22m','middle');const V=moonV(S,1350,350,130,0);
    const nm=tx(S,1350,566,'안 보여','v60','middle'),dy=tx(S,1350,612,'0일','v22m','middle');
    const pos=t=>{const a=Math.PI+t*2*Math.PI;return [ex+R*Math.cos(a),ey-R*Math.sin(a)];};
    const place=t=>{const [x,y]=pos(t);mt.g.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)})`);sight.setAttribute('x2',x+(ex-x)*.0);sight.setAttribute('y2',y);{const L=Math.hypot(x-ex,y-ey)||1,ux=(x-ex)/L,uy=(y-ey)/L;let r=36;for(let k=0;k<L;k++)if(Math.abs(ux*k)<=28&&uy*k>=48&&uy*k<=82)r=Math.max(r,k+1);sight.setAttribute('x1',(ex+ux*r).toFixed(1));sight.setAttribute('y1',(ey+uy*r).toFixed(1));}V.set(t*SYN);
     let d=`M${pos(0).map(v=>v.toFixed(1)).join(',')}`;for(let k=1;k<=40;k++)d+=`L${pos(t*k/40).map(v=>v.toFixed(1)).join(',')}`;trail.setAttribute('d',t>0?d:'');};
    place(0);const N=[['반달','7일쯤'],['보름달','15일쯤'],['반달','22일쯤'],['다시 처음','29.5일쯤']];
    return i=>{nm.textContent='';dy.textContent='';play(1300,e=>place((i+e)/4),()=>{nm.textContent=N[i][0];dy.textContent=N[i][1];});};}},
  {k:'이름',h:'모양마다<br>이름이 있다',b:'초승달, 반달, <em>보름달</em>, 반달, 그믐달. 다시 초승달이 되기까지 <em>29.5일</em>쯤 걸려.',steps:['차례로 보기'],
   draw(S){const K=[[3,'초승달'],[7.4,'반달'],[14.8,'보름달'],[22.1,'반달'],[27,'그믐달']];
    const X=dayRuler(S,680,1480,560);tx(S,680,604,'0일','v22m');
    const M=K.map(([d,n],i)=>{const x=740+i*172,m=moonV(S,x,290,62,0);tx(S,x,404,n,'v28','middle');wl(S,x,424,X(d),548,W0m);return m;});
    const mk=wdot(S,X(0),560,0,WO),fin=grp(S,0);tx(fin,1480,690,'다시 처음까지 29.5일쯤','v60','end');
    return ()=>play(1300,e=>{const d=e*SYN;mk.setAttribute('cx',X(d).toFixed(1));mk.setAttribute('r',9);K.forEach(([k],i)=>{if(d>=k)M[i].set(k);});},()=>show(fin));}}],
 sum:{lines:['달은 햇빛을 받아<br>해 쪽 절반만 밝다.','달이 지구를 돌면 밝은 쪽이<br>보이는 만큼이 바뀐다.','초승달에서 다시 초승달까지<br>29.5일쯤 걸린다.'],
  words:[['보름달','밝은 쪽이 다 보이는 둥근 달'],['반달','절반만 밝게 보이는 달'],['초승달','밝은 쪽이 절반보다 적은 가는 달']]},
 end:{q:'보름달일 때 달은 어디에 있을까?',a:'지구에서 볼 때 해의 반대쪽에 있어. 그래서 밝은 쪽이 다 보여.',h:'오늘 밤 창밖의<br>달 모양을<br>그려 봐.',btn:'답 보기',
  draw(S){const sx=760,ex=1130,mx=1410,y=400;sunG(S,sx,y,60);tx(S,sx,y+160,'해','v60','middle');
   el('circle',{cx:ex,cy:y,r:30,fill:W0},S);tx(S,ex,y+160,'지구','v60','middle');
   wl(S,sx+100,y,mx-70,y,W0m,{'stroke-dasharray':'2 10'});
   const q=grp(S,1);el('circle',{cx:mx,cy:y,r:60,fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'6 8'},q);tx(q,mx,y+34,'?','v96','middle');
   const a=grp(S,0);moonTop(a,mx,y,60);tx(a,mx,y+160,'달','v60','middle');
   const eye=grp(S,0);el('path',{d:`M${ex+40},${y-90}Q${(ex+mx)/2},${y-150} ${mx-20},${y-80}`,fill:'none',stroke:WO,'stroke-width':2},eye);el('path',{d:`M${mx-34},${y-92}L${mx-20},${y-80}L${mx-38},${y-74}`,fill:'none',stroke:WO,'stroke-width':2,'stroke-linejoin':'round'},eye);
   tx(eye,(ex+mx)/2,y-170,'지구에서 보면 보름달','v28','middle');
   hRuler(S,640,1504,646,48,'해 쪽','해의 반대쪽');
   const P=[-30,0,30].map((o,j)=>({c:wdot(S,sx+90,y-120+o,0,W0),o,t:j*.15}));
   return ()=>{q.setAttribute('opacity',0);show(a);play(1200,e=>P.forEach(d=>{const s=Math.max(0,Math.min(1,(e-d.t)/.7));d.c.setAttribute('r',s>0&&s<1?5:0);d.c.setAttribute('cx',(sx+90+(mx-60-sx-90)*s).toFixed(1));d.c.setAttribute('cy',(y-120+d.o+(120-d.o)*s*s).toFixed(1));}),()=>show(eye));};}}};
})();

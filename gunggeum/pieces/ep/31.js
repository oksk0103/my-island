(()=>{ // 31. 동음이의어 '배' — 이야기 v2: 낱말 분해·사전 표·문장 도식
const C='#F3E9D2',A='#E9B872',B='#2C4A80',Cm='rgba(243,233,210,.45)',BG='#13213F';
const line=(p,x1,y1,x2,y2,c=C,o={})=>el('line',Object.assign({x1,y1,x2,y2,stroke:c,'stroke-width':2,'stroke-linecap':'round'},o),p);
const path=(p,d,c=C,o={})=>el('path',Object.assign({d,fill:'none',stroke:c,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'},o),p);
const drawIn=(pth,ms,end)=>{const L=pth.getTotalLength();pth.style.strokeDasharray=L;pth.style.strokeDashoffset=L;if(calm()){pth.style.strokeDashoffset=0;if(end)end();return;}play(ms,e=>{pth.style.strokeDashoffset=L*(1-e);},end);};
const fade=(g,ms=500)=>{if(calm()){g.setAttribute('opacity',1);return;}play(ms,e=>g.setAttribute('opacity',e));};
// 사전 줄(머리카락선) 바탕: 화면이 비어 보이지 않게
const rules=(p,x1,x2,ys)=>ys.forEach(y=>line(p,x1,y,x2,y,B));
const MEAN=[['1','몸','가슴 아래, 다리 위'],['2','물 위','사람·물건을 싣고 다녀'],['3','과일','가을에 나는 둥근 과일']];

EPX[31]={day:'12월 10일',topic:'배',cat:'소리가 같은 말',field:'국어',frame:'v2',
 cover:{h:'‘배’는 뜻이<br>몇 가지일까?',draw(S){
   rules(S,640,1504,[180,620]);
   const cx=830,cy=400;tx(S,cx,cy+56,'배','vs160','middle');
   tx(S,cx,cy+150,'소리 하나','v22m','middle');
   const ys=[230,400,570],labs=[];
   ys.forEach((y,i)=>{path(S,`M${cx+110},${cy}C${cx+230},${cy} ${cx+230},${y} ${cx+360},${y}`,i===1?A:Cm);
     line(S,1200,y+26,1504,y+26,Cm);const q=tx(S,1210,y+18,'?','v60');labs.push(q);
     tx(S,1504,y-30,'배'+MEAN[i][0],'v22m','end');});
   tx(S,1504,660,'그중 셋','v22m','end');
   let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,t=>{const c=Math.floor(Math.max(0,t)/1.6)%4;labs.forEach((q,i)=>{q.textContent=c>i?MEAN[i][1]:'?';});});};}},
 scenes:[
  {k:'소리가 같은 말',h:'‘배’ 하나에<br>뜻이 여럿 있다',b:'몸의 배, 물 위를 다니는 배, 가을에 먹는 배. 글자도 소리도 같은데 <em>뜻이 달라</em>.',steps:['뜻 펼치기'],
   draw(S){rules(S,640,1504,[150,650]);
    const cx=760,cy=400;tx(S,cx,cy+34,'배','v96','middle');
    const ys=[250,400,550],rows=[],ps=[];
    ys.forEach((y,i)=>{const p=path(S,`M${cx+70},${cy}C${cx+170},${cy} ${cx+170},${y} ${cx+280},${y}`,i===0?A:C);p.style.opacity=0;ps.push(p);
      line(S,1060,y+40,1504,y+40,B);
      const g=grp(S,0);tx(g,1060,y+20,MEAN[i][1],'v60');tx(g,1504,y+16,MEAN[i][2],'v22','end');tx(g,1060,y-44,'배'+MEAN[i][0],'v22m');rows.push(g);
      const q=tx(S,1060,y+20,'?','v60',undefined,{opacity:.35});rows[i].q=q;});
    return ()=>{ps.forEach((p,i)=>setTimeout(()=>{p.style.opacity=1;drawIn(p,700,()=>{rows[i].q.remove();fade(rows[i]);});},calm()?0:i*350));};}},
  {k:'사전 속 번호',h:'사전은 번호를<br>붙여 나눈다',b:'사전에는 배1, 배2, 배3처럼 따로 실려 있어. 소리는 같고 뜻이 다른 말을 <em>동음이의어</em>라고 해.',steps:['번호 붙이기'],
   draw(S){// 사전 표: 낱말 | 번호 | 뜻
    const X0=640,X1=1504,top=170,RH=130;
    tx(S,X0,top-24,'낱말','v22m');tx(S,860,top-24,'번호','v22m');tx(S,1000,top-24,'뜻','v22m');
    line(S,X0,top,X1,top,C);
    const nums=[];
    MEAN.forEach(([n,w,d],i)=>{const y=top+RH*(i+1);line(S,X0,y,X1,y,i===2?C:B);
      tx(S,X0,y-40,'배','v60');tx(S,1000,y-62,w,'v28');tx(S,1000,y-26,d,'v22m');
      const t=tx(S,1480,y-40,n,'v60','middle',{opacity:0});nums.push({t,y,x0:1480,x1:880});});
    line(S,840,top,840,top+RH*3,B);line(S,980,top,980,top+RH*3,B);
    // 아래: 같은 소리 띠
    const by=top+RH*3+70;tx(S,X0,by,'소리','v22m');path(S,`M${X0+70},${by-8}H${X0+280}`,Cm,{'stroke-dasharray':'2 10'});
    const hl=grp(S,0);el('rect',{x:X0-8,y:top+14,width:120,height:RH*3-28,fill:'none',stroke:A,'stroke-width':2},hl);tx(hl,X0+300,by+10,'모두 [배]로 소리 나','v28');
    return ()=>{nums.forEach((o,i)=>{o.t.setAttribute('opacity',1);if(calm()){o.t.setAttribute('x',o.x1);return;}setTimeout(()=>play(800,e=>o.t.setAttribute('x',o.x0+(o.x1-o.x0)*e)),i*250);});setTimeout(()=>fade(hl),calm()?0:1200);};}},
  {k:'옆 낱말 보기',h:'옆 낱말을 보면<br>어떤 배인지 안다',b:'‘타다’ 옆이면 물 위의 배, ‘먹다’ 옆이면 과일, ‘아프다’ 옆이면 몸의 배야. <em>옆 낱말</em>이 알려 줘.',steps:['배를 타요','배를 먹어요','배가 아파요'],
   draw(S){const SN=[['배를','타요',1],['배를','먹어요',2],['배가','아파요',0]];
    const X0=640,rows=[];tx(S,X0,140,'배 + 옆 낱말','v22m');tx(S,1504,140,'어떤 배?','v22m','end');line(S,X0,160,1504,160,C);
    SN.forEach(([a,b,m],i)=>{const y=270+i*150;line(S,X0,y+44,1504,y+44,B);
      tx(S,X0,y,a,'v60');const vb=tx(S,X0+170,y,b,'v60');
      const g=grp(S,0.0);// 연결선 → 뜻 이름표
      const p=path(g,`M${X0+170+b.length*62+20},${y-20}H1300`,C);
      tx(g,1504,y,MEAN[m][1],'v60','end');tx(g,1504,y+34,'배'+MEAN[m][0],'v22m','end');
      const u=line(S,X0+170,y+16,X0+170+b.length*62,y+16,A,{opacity:0});
      rows.push({g,p,u,vb});});
    return i=>{rows.forEach((r,j)=>r.u.setAttribute('opacity',j===i?1:0));const r=rows[i];r.g.setAttribute('opacity',1);drawIn(r.p,800);};}}],
 sum:{lines:['소리가 같고 뜻이 다른 말을<br>동음이의어라고 한다.','사전은 배1, 배2, 배3처럼<br>번호를 붙여 나눈다.','옆 낱말을 보면<br>어떤 배인지 안다.'],
  words:[['배1','몸에서 가슴 아래, 다리 위'],['배2','사람이나 물건을 싣고 물 위를 다니는 것'],['배3','가을에 나는 둥글고 단 과일']]},
 end:{q:'“배를 타고 배를 먹었더니 배가 불렀다.” 여기 배는 몇 가지일까?',a:'세 가지야. 타는 배, 먹는 배, 몸의 배.',h:'같은 소리, 다른 뜻.<br>하나 더 찾아 봐.',btn:'배 나누기',
  draw(S){const X0=660;
   tx(S,X0,300,'배를 타고','v60');tx(S,X0,420,'배를 먹었더니','v60');tx(S,X0,540,'배가 불렀다.','v60');
   [300,420,540].forEach(y=>line(S,X0,y+40,1504,y+40,B));
   const T=[[300,'물 위','2',330],[420,'과일','3',450],[540,'몸','1',410]],tags=[];
   T.forEach(([y,w,n,sx],i)=>{const g=grp(S,0);path(g,`M${X0+sx},${y-20}H1300`,i===2?A:Cm,{'stroke-dasharray':'2 10'});tx(g,1504,y,w,'v60','end');tx(g,1504,y+34,'배'+n,'v22m','end');tags.push(g);});
   tx(S,X0,170,'‘배’ 세 번','v22m');
   return ()=>tags.forEach((g,i)=>setTimeout(()=>fade(g,600),calm()?0:i*400));}}};
})();

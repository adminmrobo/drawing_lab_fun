/* ===================== 2부 리액션과 올려다보기(모아) ===================== */
/* 올려다보는 머리: 구 + ∩ 눈선 + 턱. st 0(실사)~1(동그라미), a 고개 든 각도 */
function lookupHead(s,o){var cx=o.cx,cy=o.cy,R=o.R,a=o.a==null?30:o.a,st=o.st||0,who=o.who||'moa',g=el('g',{},s),hc=HAIR[who];
  var bend=R*Math.sin(rad(a))*0.55,y0=cy+R*0.18;var jaw=R*0.55*(1-st);
  /* 목 */pathD(g,'M'+(cx-R*0.28)+','+(cy+R*0.75)+' L'+(cx-R*0.3)+','+(cy+R*1.5)+' M'+(cx+R*0.28)+','+(cy+R*0.75)+' L'+(cx+R*0.3)+','+(cy+R*1.5),{w:2});
  /* 턱 방패(아래에서 본 밑면) */
  if(jaw>2){pathD(g,'M'+(cx-R*0.92)+','+(cy+R*0.25)+' Q'+(cx-R*0.75)+','+(cy+R*0.75+jaw*0.6)+' '+cx+','+(cy+R*0.85+jaw)+' Q'+(cx+R*0.75)+','+(cy+R*0.75+jaw*0.6)+' '+(cx+R*0.92)+','+(cy+R*0.25),{fill:SK,w:2.2});
    pathD(g,'M'+(cx-R*0.55)+','+(cy+R*0.72+jaw*0.4)+' Q'+cx+','+(cy+R*0.95+jaw*0.7)+' '+(cx+R*0.55)+','+(cy+R*0.72+jaw*0.4),{fill:'rgba(201,140,120,.25)',w:0});}
  circ(g,cx,cy,R,{fill:SK,w:2.4});
  pathD(g,'M'+(cx-R*1.02)+','+(cy-R*0.05)+' C'+(cx-R*1.05)+','+(cy-R*1.3)+' '+(cx+R*1.05)+','+(cy-R*1.3)+' '+(cx+R*1.02)+','+(cy-R*0.05)+' Q'+(cx+R*0.5)+','+(cy-R*0.75)+' '+cx+','+(cy-R*0.62)+' Q'+(cx-R*0.5)+','+(cy-R*0.75)+' '+(cx-R*1.02)+','+(cy-R*0.05)+'Z',{fill:hc[0],w:2});
  if(who==='moa'){var bx=cx+R*0.98,by=cy-R*0.25;pathD(g,'M'+bx+','+by+' l'+(R*0.18)+','+(-R*0.13)+' l0,'+(R*0.26)+'Z M'+bx+','+by+' l'+(-R*0.18)+','+(-R*0.13)+' l0,'+(R*0.26)+'Z',{fill:'#fff',w:1.6});}
  /* 귀: 눈선 양 끝 */var ey=y0;[-1,1].forEach(function(sd){ell(g,cx+sd*R*0.98,ey+R*0.08,R*0.1,R*0.16,{fill:SK,w:2});});
  /* 눈 */var es=lerp(0.55,1.7,st),er=R*0.11*es;[-1,1].forEach(function(sd){var t=0.42,x=cx+sd*R*t,y=y0-bend*Math.sqrt(1-t*t);
    if(st>0.85){circ(g,x,y,Math.max(2.5,er*0.45),{fill:INK,w:0});}else{ell(g,x,y,er,er*0.75,{fill:'#fff',w:1.8});circ(g,x,y,er*0.5,{fill:'#c88a2a',w:0});}});
  /* 코·입 */if(st<0.6){pathD(g,'M'+(cx-R*0.06)+','+(y0-bend*0.6+R*0.28)+' q'+(R*0.06)+','+(R*0.05)+' '+(R*0.12)+',0',{w:1.6,op:1-st});}
  pathD(g,'M'+(cx-R*0.12)+','+(y0-bend*0.45+R*0.5)+' h'+(R*0.24),{w:2});
  if(o.guide){var pts=[];for(var i=0;i<=24;i++){var th=Math.PI*i/24;pts.push((cx+R*Math.cos(th)).toFixed(1)+','+(y0-bend*Math.sin(th)).toFixed(1));}
    el('polyline',{points:pts.join(' '),fill:'none',stroke:'#e0337f','stroke-width':2,'stroke-dasharray':'6 4'},g);
    pathD(g,'M'+cx+','+(cy-R)+' Q'+(cx)+','+(cy)+' '+cx+','+(cy+R*0.85+jaw),{stroke:'#e0337f',w:1.6,dash:'4 4'});}
  return {bend:bend};}
P.p2_style=function(h){var W=520,H=380;
  function draw(){var st=rv(h,'st')/100,gd=rv(h,'guide');var s=svgOf(h,W,H);bg(s,W,H);lookupHead(s,{cx:260,cy:175,R:105,a:30,st:st,guide:gd});
    var nm=st<0.33?'실사풍 쪽':st<0.7?'애니풍':'동그라미 화풍';
    out(h).innerHTML='화풍: <b>'+nm+'</b> · 바뀐 것: 눈 크기 '+f2(lerp(0.55,1.7,st),2)+'배, 턱 길이 '+f2(1-st,2)+'배 · '+verdict(true,'그대로인 것: 고개 30°, ∩ 눈선, 귀는 눈 아래');}
  allIn(h,draw);draw();};
P.p2_tilt=function(h){var W=520,H=380;
  function draw(){var a=rv(h,'a');var s=svgOf(h,W,H);bg(s,W,H);var cx=260,cy=185,R=120;
    circ(s,cx,cy,R,{fill:'#fbf3ee',stroke:'#b8c2cc',w:2});
    var b=R*Math.sin(rad(a));var front=[],back=[];for(var i=0;i<=36;i++){var th=Math.PI*i/36;front.push((cx+R*Math.cos(th)).toFixed(1)+','+(cy-b*Math.sin(th)).toFixed(1));back.push((cx+R*Math.cos(th)).toFixed(1)+','+(cy+b*Math.sin(th)).toFixed(1));}
    el('polyline',{points:back.join(' '),fill:'none',stroke:'#e0337f','stroke-width':1.4,'stroke-dasharray':'3 5',opacity:0.5},s);
    el('polyline',{points:front.join(' '),fill:'none',stroke:'#e0337f','stroke-width':3},s);
    var cl=[];for(var j=0;j<=36;j++){var ph=-Math.PI/2+Math.PI*j/36;cl.push((cx+R*0.0).toFixed(1)+','+(cy+R*Math.sin(ph)*Math.cos(rad(a))-0).toFixed(1));}
    pathD(s,'M'+cx+','+(cy-R)+' L'+cx+','+(cy+R),{stroke:'#9aa5b1',w:1.4,dash:'5 4'});
    [-1,1].forEach(function(sd){var t=0.42,x=cx+sd*R*t,y=cy-b*Math.sqrt(1-t*t);ell(s,x,y,14,10,{fill:'#fff',w:2});circ(s,x,y,6,{fill:'#c88a2a',w:0});});
    [-1,1].forEach(function(sd){ell(s,cx+sd*R*0.99,cy+6,10,18,{fill:'#f8e3d3',w:2});});
    if(a>0){pathD(s,'M'+(cx-R*0.6)+','+(cy+R*0.8)+' Q'+cx+','+(cy+R*(0.8+a/90))+' '+(cx+R*0.6)+','+(cy+R*0.8),{stroke:C.orange,w:2.4});ktxt(s,cx,cy+R+26,'턱 밑면이 보임',{size:12.5,fill:C.orange,anchor:'middle'});}
    el('line',{x1:cx+R+14,y1:cy,x2:cx+R+14,y2:cy-b,stroke:C.teal,'stroke-width':3},s);ktxt(s,cx+R+20,cy-b/2+4,'휨 '+f2(Math.abs(b)/R*100,0),{size:12.5,fill:C.teal,weight:'bold'});
    var bend=100*Math.sin(rad(a));var shape=a>2?'∩ 모양 — 귀가 눈보다 아래':a<-2?'∪ 모양 — 내려다보기, 귀가 눈보다 위':'거의 일자 — 정면';
    out(h).innerHTML='눈선 휨 = 100 × sin('+a+'°) = <b>'+num(bend,1)+'</b> · '+verdict(a>=20,shape+(a>=20?'':' (올려다보기가 약함)'));}
  allIn(h,draw);draw();};
P.p2_chibi=function(h){var W=560,H=360;
  function draw(){var a=rv(h,'a');var s=svgOf(h,W,H);bg(s,W,H);
    lookupHead(s,{cx:150,cy:160,R:95,a:a,st:0,guide:false});lookupHead(s,{cx:410,cy:170,R:95,a:a,st:1,guide:false});
    ktxt(s,150,335,'실사풍 얼굴',{size:13,anchor:'middle',fill:C.ink});ktxt(s,410,335,'동그라미 얼굴',{size:13,anchor:'middle',fill:C.ink});
    var n1=a>0?5:0,n2=a>0?1:0;
    if(a>0){[[150,250],[150,190],[120,160],[60,175],[150,140]].forEach(function(p){circ(s,p[0],p[1],7,{fill:'rgba(201,48,44,.85)',w:0});});circ(s,410,175,8,{fill:'rgba(201,48,44,.85)',w:0});}
    out(h).innerHTML='고개 '+a+'°에서 다시 잡을 곳 — 실사풍 <b>'+n1+'곳</b>(턱·코·광대·귀·눈선), 동그라미 <b>'+n2+'곳</b>(눈·입 자리) · '+verdict(true,'단순할수록 각도에 강합니다');}
  allIn(h,draw);draw();};
function gapType(sit,face){var g=Math.abs(sit-face);if(g>=6)return [sit>face?'데드팬 개그 — 큰일 앞의 무표정':'과잉 반응 개그 — 사소한 일에 큰 반응',true];if(g>=3)return ['약한 어긋남 — 살짝 웃김',false];return ['자연스러운 반응 — 웃음보다 공감',false];}
P.p2_deadpan=function(h){var W=520,H=360;
  function draw(){var sit=rv(h,'sit'),face=rv(h,'face');var s=svgOf(h,W,H);bg(s,W,H);var cx=260,cy=215,r=100;
    /* 상황: 떨어지는 페인트 */var n=Math.round(sit);el('rect',{x:cx-60,y:20,width:120,height:22,rx:6,fill:'#d9e1ea',stroke:INK,'stroke-width':2},s);
    for(var i=0;i<n;i++){var x=cx-70+((i*37)%140),y=55+(i%3)*18;pathD(s,'M'+x+','+y+' q6,10 0,16 q-6,-6 0,-16Z',{fill:'#f6b6c8',stroke:'#d0708c',w:1.4});}
    if(sit>=6)pathD(s,'M'+(cx-r*0.95)+','+(cy-r*0.6)+' Q'+cx+','+(cy-r*1.6)+' '+(cx+r*0.95)+','+(cy-r*0.6),{fill:'rgba(246,182,200,.75)',w:0});
    var mood=face<=2?'blank':face>=7?'surp':'calm';sdHead(s,{who:'moa',cx:cx,cy:cy,r:r,mood:mood,eye:face>=7?1+(face-6)*0.18:1,mouth:face>=7?1+(face-6)*0.35:1});
    var g=Math.abs(sit-face),t=gapType(sit,face);
    out(h).innerHTML='갭 = |'+sit+' − '+face+'| = <b>'+g+'</b> · '+verdict(t[1],t[0]);}
  allIn(h,draw);draw();};

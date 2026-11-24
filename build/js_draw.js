/* ===================== 공용 그리기 도구: SD 캐릭터·재생 ===================== */
var SK='#F8E3D3',INK='#2a2230';
var HAIR={haru:['#f2a0b8','#2b3a7a'],moa:['#d8c09a','#ffffff'],sia:['#2c2c36','#2c2c36'],doc:['#3a3a44','#f2f2f2'],gen:['#9aa5b1','#9aa5b1']};
function circ(s,x,y,r,a){a=a||{};return el('circle',{cx:x,cy:y,r:r,fill:a.fill||'none',stroke:a.stroke||INK,'stroke-width':a.w==null?2.2:a.w,opacity:a.op==null?null:a.op,'stroke-dasharray':a.dash||null},s);}
function pathD(s,d,a){a=a||{};return el('path',{d:d,fill:a.fill||'none',stroke:a.stroke||INK,'stroke-width':a.w==null?2.2:a.w,'stroke-linecap':'round','stroke-linejoin':'round','stroke-dasharray':a.dash||null,opacity:a.op==null?null:a.op},s);}
function ell(s,x,y,rx,ry,a){a=a||{};return el('ellipse',{cx:x,cy:y,rx:rx,ry:ry,fill:a.fill||'none',stroke:a.stroke||INK,'stroke-width':a.w==null?2:a.w,opacity:a.op==null?null:a.op},s);}
/* SD 머리. o: who, cx, cy, r, eye(배율), mouth(배율), mood('calm','surp','hot','blank','smile'), noFace */
function sdHead(s,o){var cx=o.cx,cy=o.cy,r=o.r,who=o.who||'haru',hc=HAIR[who]||HAIR.gen,g=el('g',{},s);
  circ(g,cx,cy,r,{fill:SK,w:2.4});
  /* 머리카락 덮개 */
  pathD(g,'M'+(cx-r*1.02)+','+(cy+r*0.15)+' C'+(cx-r*1.1)+','+(cy-r*1.25)+' '+(cx+r*1.1)+','+(cy-r*1.25)+' '+(cx+r*1.02)+','+(cy+r*0.15)+' Q'+(cx+r*0.6)+','+(cy-r*0.55)+' '+(cx+r*0.1)+','+(cy-r*0.42)+' Q'+(cx-r*0.4)+','+(cy-r*0.6)+' '+(cx-r*1.02)+','+(cy+r*0.15)+'Z',{fill:hc[0],w:2.2});
  if(who==='haru'){circ(g,cx-r*0.62,cy-r*0.92,r*0.26,{fill:hc[0]});circ(g,cx+r*0.62,cy-r*0.92,r*0.26,{fill:hc[0]});pathD(g,'M'+cx+','+(cy-r*0.98)+' L'+(cx+r*0.04)+','+(cy-r*0.45),{stroke:hc[1],w:Math.max(3,r*0.09)});}
  if(who==='moa'){pathD(g,'M'+(cx-r*0.85)+','+(cy-r*0.55)+' Q'+cx+','+(cy-r*1.2)+' '+(cx+r*0.85)+','+(cy-r*0.55),{stroke:'#fff',w:Math.max(4,r*0.12)});pathD(g,'M'+(cx-r*0.85)+','+(cy-r*0.55)+' Q'+cx+','+(cy-r*1.2)+' '+(cx+r*0.85)+','+(cy-r*0.55),{stroke:'#c9b79a',w:1});
    /* 리본: 인물의 왼쪽 귀 = 화면 오른쪽 */var bx=cx+r*0.95,by=cy-r*0.15;pathD(g,'M'+bx+','+by+' l'+(r*0.2)+','+(-r*0.14)+' l0,'+(r*0.28)+'Z M'+bx+','+by+' l'+(-r*0.2)+','+(-r*0.14)+' l0,'+(r*0.28)+'Z',{fill:'#fff',w:1.6});}
  if(who==='doc'){pathD(g,'M'+(cx-r*0.1)+','+(cy-r*0.95)+' L'+(cx+r*0.15)+','+(cy-r*0.45),{stroke:hc[1],w:Math.max(3,r*0.1)});}
  if(o.noFace)return g;
  var es=(o.eye||1),ms=(o.mouth||1),ey=cy+r*0.12,ex=r*0.38,er=r*0.14*es,mood=o.mood||'calm';
  if(mood==='blank'){pathD(g,'M'+(cx-ex-er)+','+ey+' h'+(2*er),{w:2.6});pathD(g,'M'+(cx+ex-er)+','+ey+' h'+(2*er),{w:2.6});circ(g,cx,cy+r*0.52,1.8,{fill:INK});}
  else{[-1,1].forEach(function(sd){ell(g,cx+sd*ex,ey,er*0.85,er*1.1,{fill:'#fff',w:2});ell(g,cx+sd*ex,ey+er*0.1,er*0.5,er*0.7,{fill:who==='moa'?'#c88a2a':who==='sia'?'#6c6f80':who==='doc'?'#3c3c46':'#3a64c8',w:0});circ(g,cx+sd*ex-er*0.2,ey-er*0.25,Math.max(1.2,er*0.18),{fill:'#fff',w:0});});
    var my=cy+r*0.55,mw=r*0.16*ms;
    if(mood==='surp'||mood==='hot')ell(g,cx,my,mw*0.75,mw*(mood==='hot'?0.9:1),{fill:'#b8464f',w:2});
    else if(mood==='smile')pathD(g,'M'+(cx-mw)+','+my+' Q'+cx+','+(my+mw*0.9)+' '+(cx+mw)+','+my,{w:2.2});
    else pathD(g,'M'+(cx-mw*0.6)+','+my+' h'+(mw*1.2),{w:2.2});}
  if(who==='doc'){[-1,1].forEach(function(sd){el('rect',{x:cx+sd*ex-er*1.25,y:ey-er*1.1,width:er*2.5,height:er*2.1,rx:3,fill:'none',stroke:'#1aa39a','stroke-width':2.4},g);});pathD(g,'M'+(cx-ex+er*1.25)+','+ey+' H'+(cx+ex-er*1.25),{stroke:'#1aa39a',w:2});}
  return g;}
/* 몸통: 키 H, 머리 높이 hh, 발 y=foot */
function sdBody(s,cx,foot,H,hh,col,squat){squat=squat||0;var g=el('g',{},s);var bodyH=(H-hh)*(1-squat*0.35);var top=foot-bodyH,w=Math.max(hh*0.55,H*0.13);
  var legH=bodyH*0.45,torso=bodyH-legH;
  pathD(g,'M'+(cx-w*0.5)+','+(top+torso)+' L'+(cx-w*0.45-squat*w*0.4)+','+(foot-legH*0.5)+' L'+(cx-w*0.3)+','+foot,{w:Math.max(3,w*0.22),stroke:'#4b4f5c'});
  pathD(g,'M'+(cx+w*0.5)+','+(top+torso)+' L'+(cx+w*0.45+squat*w*0.4)+','+(foot-legH*0.5)+' L'+(cx+w*0.3)+','+foot,{w:Math.max(3,w*0.22),stroke:'#4b4f5c'});
  el('rect',{x:cx-w*0.6,y:top,width:w*1.2,height:torso+2,rx:Math.min(14,w*0.3),fill:col||'#c8c0e8',stroke:INK,'stroke-width':2},g);
  return {g:g,top:top};}
/* 애니메이션 재생기: dur(초), f(t 0~1) 매 프레임 호출 */
function player(h,dur,f){var raf=0;function stop(){if(raf)cancelAnimationFrame(raf);raf=0;}
  return function(){stop();if(RM){f(1);return;}var t0=null;function step(ts){if(t0==null)t0=ts;var t=(ts-t0)/1000/dur;if(t>=1){f(1);raf=0;return;}f(t);raf=requestAnimationFrame(step);}raf=requestAnimationFrame(step);};}
function btn(h,act){return ctl(h).querySelector('[data-act='+act+']');}
function filmbox(s,x,y,w,hgt,on){return el('rect',{x:x,y:y,width:w,height:hgt,rx:6,fill:on?'#fff4e8':'#fff',stroke:on?C.orange:'#d0d6de','stroke-width':on?2:1},s);}

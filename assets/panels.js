/* 구조 먼저 그리기 연구실 · 웃음 편 — 실험 패널 모음 (외부 라이브러리 없음) */
(function(){
'use strict';

/* ---- js_common.js ---- */
var NS='http://www.w3.org/2000/svg';
var C={teal:'#0f8f84',orange:'#e8731a',navy:'#1e2f6e',blue:'#2458d6',green:'#13733a',red:'#c9302c',purple:'#6b4fb0',grid:'#e3e8ee',muted:'#5b6874',ink:'#16212b'};
var KFONT='"IBM Plex Sans KR","Malgun Gothic","Noto Sans KR",sans-serif';
var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var P={};

/* ---------- 공용 도구 ---------- */
function el(tag,a,parent){var e=document.createElementNS(NS,tag);for(var k in a){if(a[k]!=null)e.setAttribute(k,a[k]);}if(parent)parent.appendChild(e);return e;}
function ktxt(p,x,y,s,a){a=a||{};var t=el('text',{x:x,y:y,'font-size':a.size||13,fill:a.fill||C.muted,'font-family':KFONT,'text-anchor':a.anchor||'start','font-weight':a.weight||'normal'},p);t.textContent=s;return t;}
function svgOf(h,W,H,label){h.innerHTML='';return el('svg',{viewBox:'0 0 '+W+' '+H,role:'img','aria-label':'실험 그림: '+(label||noteOf(h))},h);}
function noteOf(h){var n=h.parentNode&&h.parentNode.querySelector('.ph small');return n?n.textContent:'';}
function canvasOf(h,W,H,mw){h.innerHTML='';var c=document.createElement('canvas');c.width=W;c.height=H;c.style.width='100%';c.style.maxWidth=(mw||W*1.2)+'px';c.style.margin='0 auto';c.style.height='auto';c.style.display='block';c.style.borderRadius='10px';c.setAttribute('role','img');c.setAttribute('aria-label','실험 그림: '+noteOf(h));h.appendChild(c);return c;}
function out(h){return h.parentNode.querySelector('.readout');}
function ctl(h){return h.parentNode.querySelector('.ctrl');}
function f2(v,d){d=d==null?2:d;if(d===0)return String(Math.round(v));var m=Math.pow(10,d);var s=(Math.round(v*m)/m).toFixed(d);s=s.replace(/\.?0+$/,'');if(s==='-0')s='0';return s;}
function num(v,d){return v<0?'−'+f2(-v,d):f2(v,d);}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function lerp(a,b,t){return a+(b-a)*t;}
function hex(c){c=c.replace('#','');return[parseInt(c.substr(0,2),16),parseInt(c.substr(2,2),16),parseInt(c.substr(4,2),16)];}
function rgb(a){return 'rgb('+a.map(function(v){return Math.round(clamp(v,0,255));}).join(',')+')';}
function mix(c1,c2,t){var a=hex(c1),b=hex(c2);return rgb([lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)]);}
function shade(c,k){var a=hex(c);return rgb([a[0]*k,a[1]*k,a[2]*k]);}
function rad(d){return d*Math.PI/180;}
function seg(h,sel,cb){var bs=ctl(h).querySelectorAll(sel);bs.forEach(function(b){b.addEventListener('click',function(){bs.forEach(function(x){x.classList.remove('on');});b.classList.add('on');cb(b);});});}
function rng(seed){var s=seed>>>0||1;return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function onIn(inp,f){inp.addEventListener('input',f);}
function svgPt(s,e){var m=s.getScreenCTM().inverse();var q=s.createSVGPoint();q.x=e.clientX;q.y=e.clientY;return q.matrixTransform(m);}

function board(el_,items){el_.innerHTML=items.map(function(it){return '<div class="'+(it[2]?'good':'bad')+'"><span>'+it[0]+'</span><b>'+it[1]+'</b></div>';}).join('');}
function say(el_,lines){el_.innerHTML=lines.map(function(l){return '<div class="line"><img src="../assets/chars/'+l[0]+'_'+l[1]+'.webp" alt="" width="48" height="48"><div class="bub"><b>'+l[2]+'</b>'+l[3]+'</div></div>';}).join('');}
function missions(el_,state,touched){el_.querySelectorAll('li').forEach(function(li,i){if(touched&&state[i])li.classList.add('done');});}
var DONE={};
function pick(h,sel){return ctl(h).querySelector(sel);}
function rv(h,name){var e=pick(h,'[name='+name+']');return e?(e.type==='checkbox'?e.checked:+e.value):null;}
function allIn(h,f){ctl(h).querySelectorAll('input,select').forEach(function(i){i.addEventListener(i.tagName==='SELECT'||i.type==='checkbox'?'change':'input',f);});}
function bg(s,W,H){el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);}
function seg2(h,cb){var bs=ctl(h).querySelectorAll('button[data-v]');bs.forEach(function(b){b.addEventListener('click',function(){bs.forEach(function(x){x.classList.remove('on');});b.classList.add('on');cb(b.dataset.v);});});}
function verdict(ok,txt){return '<span style="color:'+(ok?C.green:C.red)+';font-weight:700">'+(ok?'✔ ':'⚠ ')+txt+'</span>';}

/* ---- js_draw.js ---- */
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

/* ---- js_p0.js ---- */
/* ===================== 프롤로그: 위상 전환기 ===================== */
/* [그림, 위상, 고정값이 남았나, 설명] — 사이트에 실제로 들어간 그림만 */
var PHASEIMG={
  haru:[['ph_lineup_haru','픽셀·SD·애니·반실사 네 위상',true,'같은 자세 네 모습 모두 번 2개·앞머리 남색 줄·라벤더 후드'],['cover_01','픽셀 위상',true,'큰 탈을 들었지만 번 2개와 남색 줄이 그대로'],['p1_haru_sd_compare','애니 위상 + SD 위상',true,'한 장에 7등신과 SD가 함께. 둘 다 번 2개'],['p1_haru_exag_eyes','SD 위상(상반신)',true,'얼굴이 과장돼도 앞머리 남색 줄은 그대로'],['d1_haru_hot','애니 위상(상반신)',true,'혀를 내밀어도 라벤더 후드와 번 그대로'],['p4_comic_cake','SD 위상(4컷)',true,'네 컷 모두 같은 하루']],
  sia:[['ph_lineup_sia','픽셀·SD·애니·반실사 네 위상',true,'네 모습 모두 장식 없는 흑발과 은 귀걸이'],['cover_03','픽셀 위상',true,'검은 생머리와 메이드복 그대로'],['p3_sia_jump_keys','SD 위상',true,'네 동작 모두 장식 없는 흑발'],['f3_fail','애니 위상(7등신)',true,'바나나를 밟아도 은 귀걸이 그대로'],['d2_sia_lookup','SD 위상',true,'고개를 젖혀도 흑발·메이드복 그대로'],['p4_comic_three','SD 위상(3컷)',true,'세 장면 모두 같은 시아']],
  moa:[['ph_lineup_moa','픽셀·SD·애니·반실사 네 위상',true,'쟁반을 든 네 모습 모두 흰 프릴 머리띠와 리본'],['ph_collapse','위상 붕괴(거울 속)',false,'거울 속 모아는 금발에 초록 눈 — 고정값이 바뀌어 다른 사람'],['cover_02','픽셀 위상',true,'흰 프릴 머리띠와 리본 그대로'],['p2_moa_lookup_styles','반실사 + 애니 + SD 위상',true,'한 장에서 세 번 바뀌었지만 머리띠·리본 그대로'],['p2_moa_deadpan','SD 위상',true,'페인트를 뒤집어써도 리본은 왼쪽 귀 위'],['d4_lab_zoomout','애니 위상',true,'클로즈업과 줌 아웃 모두 같은 모아'],['f8_fail','위상 붕괴',false,'머리색·눈 색까지 바뀌어 다른 사람이 됨']],
  doc:[['ph_lineup_doc','픽셀·SD·애니·반실사 네 위상',true,'네 모습 모두 흰 앞머리 줄·굵은 눈썹·청록 안경'],['ph_collapse','위상 붕괴(거울 속)',false,'거울 속 박사는 갈색 머리에 둥근 안경 — 다른 사람'],['cover_06','픽셀 위상',true,'흰 앞머리 줄과 청록 안경 그대로'],['p3_doctor_bounce_keys','SD 위상',true,'공을 맞아도 굵은 눈썹 그대로'],['d5_doctor_sticker','스티커 위상',true,'흰 테두리가 생겨도 안경·눈썹 그대로'],['p6_f7_fixed','SD 위상(3컷)',true,'안경이 튀어도 다시 같은 박사'],['p5_lab_reaction_sheet_b','위상 붕괴',false,'갈색 머리에 검은 안경 — 다른 사람이 됨']]};
var WHO0={haru:'하루',sia:'시아',moa:'모아',doc:'박사'};
P.p0_phase=function(h){var root=document.body.getAttribute('data-root')||'',last={},n=0;
  function show(i){var who=pick(h,'[name=who]').value,L=PHASEIMG[who],it=L[i];last[who]=i;
    h.innerHTML='<figure class="art" style="margin:0"><img src="'+root+'assets/img/'+it[0]+'.webp" alt="'+WHO0[who]+' — '+it[1]+'" loading="lazy" style="width:100%;border-radius:8px"></figure>';
    out(h).innerHTML='전환 '+n+'회 · '+WHO0[who]+' → <b>'+it[1]+'</b> · '+verdict(it[2],(it[2]?'고정값 남음 — 같은 사람: ':'고정값 사라짐 — ')+it[3]);}
  function zap(){var who=pick(h,'[name=who]').value,L=PHASEIMG[who],i;do{i=Math.floor(Math.random()*L.length);}while(L.length>1&&i===last[who]);n++;show(i);}
  pick(h,'[name=who]').addEventListener('change',function(){show(0);});
  ctl(h).querySelector('[data-act=zap]').addEventListener('click',zap);show(0);};

/* ---- js_p1.js ---- */
/* ===================== 1부 과장과 데포르메(하루) ===================== */
var GAPSCN=['하루가 커피를 들고 걷는다(그냥 일상)','컵이 살짝 흔들린다','커피 한 방울이 튄다','하루가 휘청하다 버틴다','컵이 손에서 미끄러진다','컵이 날아가 머리 위 번에 거꾸로 얹힌다','커피가 천장까지 솟구친다','연구실 바닥이 커피 바다가 된다','쏟아진 커피에 주판봇이 미끄러져 굴러간다','화재 경보가 울린다','연구실이 폭발한다'];
function laugh(d,c){return c/10*d*(10-d)/2.5;}
P.p1_gap=function(h){var W=520,H=300;
  function draw(){var d=rv(h,'d'),c=rv(h,'c');var s=svgOf(h,W,H);bg(s,W,H);var x0=60,x1=480,y0=250,y1=40;
    el('line',{x1:x0,y1:y0,x2:x1,y2:y0,stroke:'#b8c2cc'},s);el('line',{x1:x0,y1:y0,x2:x0,y2:y1,stroke:'#b8c2cc'},s);
    el('rect',{x:x0+(x1-x0)*0.3,y:y1,width:(x1-x0)*0.4,height:y0-y1,fill:'rgba(15,143,132,.07)'},s);
    ktxt(s,(x0+x1)/2,y1+14,'웃음 구간',{size:12,fill:C.teal,anchor:'middle'});
    var pts=[],pts10=[];for(var i=0;i<=50;i++){var dd=i/5;pts.push((x0+(x1-x0)*dd/10).toFixed(1)+','+(y0-(y0-y1)*laugh(dd,c)/10).toFixed(1));pts10.push((x0+(x1-x0)*dd/10).toFixed(1)+','+(y0-(y0-y1)*laugh(dd,10)/10).toFixed(1));}
    el('polyline',{points:pts10.join(' '),fill:'none',stroke:'#d0d6de','stroke-dasharray':'4 4','stroke-width':1.5},s);
    el('polyline',{points:pts.join(' '),fill:'none',stroke:C.orange,'stroke-width':3},s);
    var sc=laugh(d,c),px=x0+(x1-x0)*d/10,py=y0-(y0-y1)*sc/10;el('circle',{cx:px,cy:py,r:8,fill:C.orange,stroke:'#fff','stroke-width':2},s);
    for(var k=0;k<=10;k+=2){ktxt(s,x0+(x1-x0)*k/10,y0+18,String(k),{size:12,anchor:'middle'});}
    ktxt(s,(x0+x1)/2,y0+38,'어긋남',{size:12.5,anchor:'middle'});ktxt(s,x0-8,y1+4,'10점',{size:12,anchor:'end'});ktxt(s,x0-8,y0,'0',{size:12,anchor:'end'});
    var zone=d<=2?'심심함 — 그냥 일상으로 보입니다':d>=8?'놀람·사고 — 웃기 전에 놀랍니다':'웃음 구간';
    out(h).innerHTML='기대: 하루가 커피를 조심조심 들고 간다 → 결과: <b>'+GAPSCN[d]+'</b><br>웃음 점수 = '+c+' ÷ 10 × '+d+' × '+(10-d)+' ÷ 2.5 = <b>'+f2(sc,1)+'점</b> · '+verdict(d>=3&&d<=7&&c>=7,zone+(c<7?' · 알아보기 쉬움이 낮아 점수가 깎입니다':''));}
  allIn(h,draw);draw();};
function headZone(n){return n<=3?['개그 그림체(SD)',true]:n<=5?['어중간한 구간 — 귀여움도 멋도 약해지기 쉬움',false]:['진지한 그림체',true];}
function figureN(s,cx,n,top,H,who,col){var hh=H/n,foot=top+H;var b=sdBody(s,cx,foot,H,hh,col);sdHead(s,{who:who,cx:cx,cy:top+hh*0.5,r:hh*0.5,mood:'calm'});return hh;}
P.p1_heads=function(h){var W=520,H=430;
  function draw(){var n=rv(h,'n');var s=svgOf(h,W,H);bg(s,W,H);var top=30,TH=360;
    for(var i=0;i<=Math.ceil(n);i++){var y=top+TH/n*i;if(y>top+TH+0.1)break;el('line',{x1:70,y1:y,x2:450,y2:y,stroke:'#e3e8ee','stroke-dasharray':'3 4'},s);if(i<n)ktxt(s,62,y+TH/n/2+4,String(i+1),{size:12,anchor:'end',fill:C.teal});}
    el('line',{x1:470,y1:top,x2:470,y2:top+TH,stroke:C.navy,'stroke-width':2},s);ktxt(s,476,top+TH/2,'키 360',{size:12,fill:C.navy});
    var hh=figureN(s,260,n,top,TH,'haru','#c8c0e8');var z=headZone(n);
    out(h).innerHTML='머리 높이 = 360 ÷ '+f2(n,1)+' = <b>'+f2(hh,1)+'</b> (키의 1/'+f2(n,1)+') · '+verdict(z[1],z[0]);}
  allIn(h,draw);draw();};
function focusOf(k,all){return all?1/3:k/(k+2);}
P.p1_exag=function(h){var W=520,H=360;
  function draw(){var part=pick(h,'[name=part]').value,k=rv(h,'k'),all=rv(h,'all');var s=svgOf(h,W,H);bg(s,W,H);
    var ke=all||part==='eye'?k:1,km=all||part==='mouth'?k:1,ks=all||part==='sweat'?k:1;
    var r=all?Math.min(150,110*(1+(k-1)*0.15)):110;
    sdHead(s,{who:'haru',cx:250,cy:200,r:r,eye:ke,mouth:km,mood:km>1.05?'hot':ke>1.05?'surp':'calm'});
    var dx=250+r*0.95,dy=200-r*0.55,ds=14*ks;pathD(s,'M'+dx+','+(dy-ds*1.4)+' Q'+(dx+ds)+','+dy+' '+dx+','+(dy+ds*0.6)+' Q'+(dx-ds)+','+dy+' '+dx+','+(dy-ds*1.4)+'Z',{fill:'#bfe3ff',stroke:'#3a7bd5',w:2});
    if(all){for(var i=0;i<6;i++){var a=i/6*Math.PI*2;pathD(s,'M'+(250+Math.cos(a)*(r+18))+','+(200+Math.sin(a)*(r+18))+' l'+(Math.cos(a)*16)+','+(Math.sin(a)*16),{stroke:'#e0a020',w:3});}}
    var fo=focusOf(k,all);var nm={eye:'눈',mouth:'입',sweat:'땀방울'}[part];
    out(h).innerHTML=(all?'모든 부위를 '+f2(k,1)+'배로 키움 → 집중도 = '+f2(k,1)+' ÷ ('+f2(k,1)+' × 3) ≈ <b>0.33</b>':nm+'만 '+f2(k,1)+'배 → 집중도 = '+f2(k,1)+' ÷ ('+f2(k,1)+' + 2) = <b>'+f2(fo,2)+'</b>')+' · '+
      verdict(!all&&k>=1.5&&k<=2.5,all?'과장이 퍼져 어디를 볼지 모릅니다':k<1.5?'과장이 약합니다':k>2.5?'형태가 깨지기 시작합니다':'한 곳에 시선이 모입니다');}
  allIn(h,draw);draw();};
var SYMN={sweat:'당황',vein:'짜증',gloom:'우울',spark:'신남',q:'어리둥절'};
function symRead(on){var k=Object.keys(SYMN).filter(function(x){return on[x];});
  if(!k.length)return ['기호 없음 — 표정만으로 읽어야 해 작게 보면 감정이 흐립니다',false];
  if(k.length>2)return ['감정이 부딪힘 — 기호 '+k.length+'개가 서로 다른 감정을 말합니다',false];
  if(k.length===1)return [SYMN[k[0]]+'(으)로 또렷하게 읽힙니다',true];
  var j=k.sort().join('+');var M={'gloom+sweat':'"망했다…"(당황 + 우울)','q+sweat':'당황한 어리둥절','sweat+vein':'짜증 섞인 당황','gloom+q':'멍한 우울','q+vein':'"뭐라고?" 짜증','gloom+vein':'끓어오르는 우울','q+spark':'신기함'};
  if(M[j])return [M[j]+'으로 읽힙니다',true];return ['반대 감정이 함께 있어 읽는 데 오래 걸립니다('+k.map(function(x){return SYMN[x];}).join(' + ')+')',false];}
P.p1_sym=function(h){var W=520,H=340;
  function draw(){var on={};Object.keys(SYMN).forEach(function(x){on[x]=rv(h,x);});var s=svgOf(h,W,H);bg(s,W,H);var cx=250,cy=190,r=105;
    sdHead(s,{who:'haru',cx:cx,cy:cy,r:r,mood:on.spark?'smile':'calm'});
    if(on.sweat){var dx=cx+r*1.0,dy=cy-r*0.6;pathD(s,'M'+dx+','+(dy-22)+' Q'+(dx+15)+','+dy+' '+dx+','+(dy+9)+' Q'+(dx-15)+','+dy+' '+dx+','+(dy-22)+'Z',{fill:'#bfe3ff',stroke:'#3a7bd5',w:2});}
    if(on.vein){var vx=cx-r*0.95,vy=cy-r*0.95;['M-14,-4 Q-4,-4 -4,-14','M4,-14 Q4,-4 14,-4','M14,4 Q4,4 4,14','M-4,14 Q-4,4 -14,4'].forEach(function(d){el('path',{d:d,transform:'translate('+vx+','+vy+')',fill:'none',stroke:C.red,'stroke-width':3.2,'stroke-linecap':'round'},s);});}
    if(on.gloom){for(var i=0;i<5;i++)pathD(s,'M'+(cx-r*0.6+i*r*0.3)+','+(cy-r*1.35)+' v'+(r*0.55),{stroke:'#6b4fb0',w:2.4,op:0.7});}
    if(on.spark){[[cx-r*1.25,cy-r*0.3],[cx+r*1.3,cy+r*0.1],[cx-r*1.0,cy+r*0.8]].forEach(function(p){pathD(s,'M'+p[0]+','+(p[1]-12)+' L'+(p[0]+3)+','+(p[1]-3)+' L'+(p[0]+12)+','+p[1]+' L'+(p[0]+3)+','+(p[1]+3)+' L'+p[0]+','+(p[1]+12)+' L'+(p[0]-3)+','+(p[1]+3)+' L'+(p[0]-12)+','+p[1]+' L'+(p[0]-3)+','+(p[1]-3)+'Z',{fill:'#ffd84a',stroke:'#c99a00',w:1.4});});}
    if(on.q)ktxt(s,cx+r*1.05,cy-r*1.0,'?',{size:44,fill:C.navy,weight:'bold'});
    var rd=symRead(on);out(h).innerHTML='읽히는 감정: '+verdict(rd[1],rd[0]);}
  allIn(h,draw);draw();};

/* ---- js_p2.js ---- */
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

/* ---- js_p3.js ---- */
/* ===================== 3부 움직임과 타이밍(시아·박사) ===================== */
function sdPerson(s,cx,foot,H,who,col,squat,lift,mood){var hh=H/2.5;var f=foot-(lift||0);sdBody(s,cx,f,H*(1-(squat||0)*0.25),hh,col,squat||0);var top=f-H*(1-(squat||0)*0.25);sdHead(s,{who:who,cx:cx,cy:top+hh*0.5,r:hh*0.5,mood:mood||'calm'});}
/* 점프 프레임 목록: 예비 a장 + 상승 4 + 하강 4 + 착지 2 */
function jumpFrames(a){var F=[];for(var i=1;i<=a;i++)F.push({sq:0.7*i/a,lift:0,k:'예비'});for(i=1;i<=4;i++)F.push({sq:0,lift:110*Math.sin(Math.PI/2*i/4),k:'상승'});for(i=3;i>=0;i--)F.push({sq:0,lift:110*Math.sin(Math.PI/2*i/4),k:'하강'});F.push({sq:0.4,lift:0,k:'착지'});F.push({sq:0,lift:0,k:'마무리'});F.unshift({sq:0,lift:0,k:'서기'});return F;}
function anticVerdict(a){return a===0?['예비동작 없음 — 갑자기 떠오릅니다',false]:a<=2?['짧음 — 준비가 잘 안 보입니다',false]:a<=5?['알맞음 — 준비가 보이고 늘어지지 않습니다',true]:['김 — "언제 뛰나" 기다리게 됩니다',false];}
P.p3_antic=function(h){var W=560,H=380,cur=-1;
  function draw(){var a=rv(h,'a');var F=jumpFrames(a);var s=svgOf(h,W,H);bg(s,W,H);var i0=cur<0?0:cur;var fr=F[Math.min(i0,F.length-1)];
    el('line',{x1:30,y1:250,x2:530,y2:250,stroke:'#c9d1da','stroke-width':2},s);
    sdPerson(s,280,250,150,'sia','#3d3d52',fr.sq,fr.lift,fr.k==='예비'?'calm':fr.k==='상승'?'surp':'calm');
    var n=F.length,bw=Math.min(36,500/n-3);for(var i=0;i<n;i++){var x=30+i*(bw+3);filmbox(s,x,290,bw,56,i===i0);var f=F[i];var hgt=36*(1-f.sq*0.35);el('rect',{x:x+bw/2-5,y:340-f.lift*0.18-hgt,width:10,height:hgt,rx:4,fill:f.k==='예비'?C.orange:'#6c7a89'},s);}
    ktxt(s,30,282,'필름(그림 한 장 = 1/12초) · 주황 = 예비동작',{size:12});
    var v=anticVerdict(a);out(h).innerHTML='예비동작 '+a+'프레임 = '+a+' ÷ 12 = <b>'+f2(a/12,2)+'초</b> · '+verdict(v[1],v[0]);}
  allIn(h,function(){cur=-1;draw();});draw();
  var go=player(h,1,function(){});btn(h,'play').addEventListener('click',function(){var F=jumpFrames(rv(h,'a'));var n=F.length;if(RM){cur=n-1;draw();return;}var i=0;cur=0;draw();var iv=setInterval(function(){i++;if(i>=n){clearInterval(iv);cur=-1;draw();return;}cur=i;draw();},1000/12);});};
function ballShape(s,cx,by,r,sx,sy,col){el('ellipse',{cx:cx,cy:by-r*sy,rx:r*sx,ry:r*sy,fill:col||'#f58fb0',stroke:INK,'stroke-width':2.2},s);}
P.p3_squash=function(h){var W=560,H=380,t=-1;
  function vals(){var sv=rv(h,'s'),keep=rv(h,'keep');return {s:sv,keep:keep,ws:keep?1/sv:1,ss:1/sv,wsq:keep?sv:1};}
  function draw(){var v=vals();var s=svgOf(h,W,H);bg(s,W,H);var floorY=330;
    /* 박사 머리 받침 */sdHead(s,{who:'doc',cx:420,cy:floorY-40,r:40,mood:'blank'});
    var r=32;
    ballShape(s,80,floorY,r,1,1);ktxt(s,80,floorY+24,'보통',{size:12,anchor:'middle'});
    ballShape(s,200,floorY-60,r,v.ws,v.s);ktxt(s,200,floorY+24,'떨어질 때',{size:12,anchor:'middle'});
    ballShape(s,310,floorY,r,v.wsq,v.ss);ktxt(s,310,floorY+24,'부딪힐 때',{size:12,anchor:'middle'});
    if(t>=0){var p=t<0.5?t/0.5:1-(t-0.5)/0.5;var y=floorY-80-(1-p)*180;var near=p>0.85;ballShape(s,420,near?floorY-80:y,22,near?v.wsq:v.ws,near?v.ss:v.s,'#f58fb0');}
    var A1=v.ws*v.s,A2=v.wsq*v.ss;
    out(h).innerHTML='떨어질 때 가로 '+f2(v.ws,2)+' × 세로 '+f2(v.s,2)+' = 넓이 <b>'+f2(A1,2)+'</b> · 부딪힐 때 가로 '+f2(v.wsq,2)+' × 세로 '+f2(v.ss,2)+' = 넓이 <b>'+f2(A2,2)+'</b> · '+verdict(Math.abs(A1-1)<0.02&&Math.abs(A2-1)<0.02,Math.abs(A1-1)<0.02?'부피가 지켜져 같은 공으로 보입니다':'넓이가 바뀌어 공이 부풀었다 줄었다 합니다');}
  allIn(h,function(){t=-1;draw();});draw();
  var go=player(h,1.2,function(x){t=x>=1?-1:x;draw();});btn(h,'play').addEventListener('click',go);};
var EASE={lin:function(t){return t;},in:function(t){return t*t;},out:function(t){return 1-(1-t)*(1-t);},io:function(t){return t<0.5?2*t*t:1-2*(1-t)*(1-t);}};
var EASEN={lin:'일정하게',in:'천천히 출발',out:'빠르게 출발, 천천히 멈춤',io:'천천히 출발, 천천히 멈춤'};
P.p3_timing=function(h){var W=560,H=300,cur=-1;
  function draw(){var n=rv(h,'f'),e=pick(h,'[name=ease]').value;var s=svgOf(h,W,H);bg(s,W,H);var x0=60,x1=500,y=200;
    el('line',{x1:x0,y1:y,x2:x1,y2:y,stroke:'#c9d1da','stroke-width':2},s);
    for(var i=0;i<n;i++){var tt=n===1?1:i/(n-1),x=x0+(x1-x0)*EASE[e](tt);circ(s,x,y,i===cur?9:6,{fill:i===cur?C.orange:C.navy,w:0});}
    var pc=cur<0?0:EASE[e](n===1?1:cur/(n-1));sdHead(s,{who:'sia',cx:x0+(x1-x0)*pc,cy:110,r:44,mood:'calm'});
    ktxt(s,x0,y+30,'출발',{size:12});ktxt(s,x1,y+30,'도착',{size:12,anchor:'end'});ktxt(s,(x0+x1)/2,y+30,'점이 몰린 곳은 느리게, 벌어진 곳은 빠르게',{size:12,anchor:'middle'});
    var sec=n/12;var mid=EASE[e](0.5);
    out(h).innerHTML='프레임 '+n+'장 ÷ 12 = <b>'+f2(sec,2)+'초</b> · '+EASEN[e]+'(절반 시간에 '+f2(mid*100,0)+'% 이동) · '+
      verdict(n>=6&&n<=14&&e!=='lin',n<4?'너무 짧아 동작이 안 보입니다':n>18?'느려서 늘어집니다':e==='lin'?'일정한 속도라 기계처럼 보입니다':'시간과 속도 변화가 알맞습니다');}
  allIn(h,function(){cur=-1;draw();});draw();
  btn(h,'play').addEventListener('click',function(){var n=rv(h,'f');if(RM){cur=n-1;draw();return;}var i=0;cur=0;draw();var iv=setInterval(function(){i++;if(i>=n){clearInterval(iv);return;}cur=i;draw();},1000/12);});};
function holdVerdict(x){return x<0.5?['짧음 — 반응이 사고에 붙어 웃음이 묻힙니다',false]:x<=1.2?['알맞음 — 상황을 따라잡은 뒤 반응이 터집니다',true]:x<=1.5?['조금 김 — 멈춘 건가 싶어집니다',false]:['늘어짐 — 영상이 멈춘 것처럼 보입니다',false];}
P.p3_hold=function(h){var W=560,H=360,ph=null;
  function draw(t){var hd=rv(h,'h');var s=svgOf(h,W,H);bg(s,W,H);var T=0.4+hd+0.6;var cx=280,cy=200,r=70;
    var now=t==null?T:t*T;var hit=now>=0.4,react=now>=0.4+hd;
    sdHead(s,{who:'doc',cx:cx,cy:cy,r:r,mood:react?'surp':hit?'blank':'calm'});
    var by=hit?cy-r-14:60+now/0.4*(cy-r-74);ballShape(s,cx,by+16,18,hit&&!react?1.4:1,hit&&!react?0.7:1);
    if(react){[-1,1].forEach(function(sd){el('rect',{x:cx+sd*r*0.38-16,y:cy-r*0.9-Math.min(40,(now-0.4-hd)*120),width:32,height:22,rx:4,fill:'none',stroke:'#1aa39a','stroke-width':3},s);});}
    /* 시간 막대 */var x0=40,x1=520,ty=330;function X(v){return x0+(x1-x0)*v/T;}
    el('rect',{x:X(0),y:ty-10,width:X(0.4)-X(0),height:20,fill:'#cfd8e3'},s);el('rect',{x:X(0.4),y:ty-10,width:X(0.4+hd)-X(0.4),height:20,fill:'#ffe2c4'},s);el('rect',{x:X(0.4+hd),y:ty-10,width:X(T)-X(0.4+hd),height:20,fill:'#cdeee9'},s);
    ktxt(s,X(0.2),ty+4,'사고',{size:11.5,anchor:'middle',fill:C.ink});if(hd>=0.3)ktxt(s,X(0.4+hd/2),ty+4,'정지',{size:11.5,anchor:'middle',fill:C.orange});ktxt(s,X(0.4+hd+0.3),ty+4,'반응',{size:11.5,anchor:'middle',fill:C.teal});
    if(t!=null)el('line',{x1:X(now),y1:ty-16,x2:X(now),y2:ty+16,stroke:C.red,'stroke-width':2},s);
    var v=holdVerdict(hd);out(h).innerHTML='사고 0.4초 → 정지 <b>'+f2(hd,1)+'초</b> → 반응 0.6초 · '+verdict(v[1],v[0]);}
  allIn(h,function(){draw();});draw();
  btn(h,'play').addEventListener('click',function(){var T=0.4+rv(h,'h')+0.6;player(h,T,function(x){draw(x>=1?null:x);})();});};

/* ---- js_p4.js ---- */
/* ===================== 4부 컷과 이야기 ===================== */
var CARDS4={A:['A','케이크 완성','하루가 뿌듯해함'],B:['B','조심조심 운반','복도를 걷는 하루'],C:['C','전선에 걸림','케이크가 날아감'],D:['D','머리에 착지','주판봇 머리 위 케이크']};
function miniPanel(s,x,y,w,hh,key,idx){el('rect',{x:x,y:y,width:w,height:hh,rx:8,fill:'#fff',stroke:INK,'stroke-width':2},s);var c=CARDS4[key];
  ktxt(s,x+8,y+18,(idx+1)+'컷',{size:12,fill:C.orange,weight:'bold'});
  if(key==='D'){el('rect',{x:x+w/2-22,y:y+hh-58,width:44,height:36,rx:5,fill:'#e8dcc4',stroke:INK,'stroke-width':1.8},s);el('rect',{x:x+w/2-15,y:y+hh-52,width:30,height:20,rx:3,fill:'#2f4f3f'},s);el('rect',{x:x+w/2-16,y:y+hh-80,width:32,height:20,rx:4,fill:'#fde2e8',stroke:INK,'stroke-width':1.6},s);circ(s,x+w/2,y+hh-84,4,{fill:C.red,w:0});}
  else{sdHead(s,{who:'haru',cx:x+w/2,cy:y+hh*0.55,r:hh*0.2,mood:key==='C'?'surp':'smile'});if(key!=='C'){el('rect',{x:x+w/2+hh*0.18,y:y+hh*0.62,width:26,height:18,rx:3,fill:'#fde2e8',stroke:INK,'stroke-width':1.5},s);}else{el('rect',{x:x+w/2+20,y:y+22,width:26,height:18,rx:3,fill:'#fde2e8',stroke:INK,'stroke-width':1.5,transform:'rotate(25 '+(x+w/2+33)+' '+(y+31)+')'},s);}}
  ktxt(s,x+w/2,y+hh-8,c[0]+' · '+c[1],{size:11.5,anchor:'middle',fill:C.ink});}
P.p4_order=function(h){var W=560,H=230;
  function draw(){var o=['c1','c2','c3','c4'].map(function(k){return pick(h,'[name='+k+']').value;});var s=svgOf(h,W,H);bg(s,W,H);
    o.forEach(function(k,i){miniPanel(s,12+i*137,20,128,180,k,i);});
    var dup=o.filter(function(k,i){return o.indexOf(k)!==i;}).length>0;var ok=o.join('')==='ABCD';var posC=o.indexOf('C')+1,posD=o.indexOf('D')+1;
    out(h).innerHTML=dup?verdict(false,'같은 카드가 두 번 들어갔습니다. 네 카드를 한 번씩 쓰세요'):'반전(C 넘어짐) '+posC+'컷째 · 결과(D 착지) '+posD+'컷째 · '+
      verdict(ok,ok?'기승전결 — 기대가 쌓인 뒤 3컷째에 뒤집힙니다':posD===1?'결과가 첫 컷에 있어 나머지가 설명이 됩니다':posC<3?'반전이 너무 일찍 옵니다':'순서가 꼬였습니다 — 기(A)·승(B)부터');}
  allIn(h,draw);draw();};
var THREE_SC=[0,3,10,7,4,2];
P.p4_three=function(h){var W=560,H=230;
  function draw(){var n=rv(h,'n');var s=svgOf(h,W,H);bg(s,W,H);var tot=n+1,bw=Math.min(120,(540-tot*6)/tot);
    for(var i=0;i<tot;i++){var x=10+i*(bw+6),last=i===tot-1;el('rect',{x:x,y:30,width:bw,height:150,rx:8,fill:'#fff',stroke:last?C.orange:INK,'stroke-width':last?3:2},s);
      el('rect',{x:x+bw*0.55,y:55,width:bw*0.3,height:110,fill:'#e8dcc4',stroke:INK,'stroke-width':1.5},s);sdHead(s,{who:'sia',cx:x+bw*0.3,cy:120,r:Math.min(24,bw*0.2),mood:last?'blank':'calm'});
      if(last){el('rect',{x:x+bw*0.58,y:85,width:bw*0.24,height:30,rx:4,fill:'#e8dcc4',stroke:INK,'stroke-width':1.6},s);el('rect',{x:x+bw*0.62,y:90,width:bw*0.16,height:18,fill:'#2f4f3f'},s);}
      ktxt(s,x+bw/2,200,last?'어긋남':'반복 '+(i+1),{size:12,anchor:'middle',fill:last?C.orange:C.muted});}
    var sc=THREE_SC[n];var v=n===1?'패턴이 없음 — 한 번은 우연입니다':n===2?'셋의 법칙 — 패턴과 어긋남이 함께 또렷합니다':n===3?'조금 김 — 어긋남 전에 힘이 빠집니다':'지루함 — 어긋남이 오기 전에 흥미가 떨어집니다';
    out(h).innerHTML='반복 '+n+'번 + 어긋남 1번 · 웃음 점수(예시) <b>'+sc+'</b> / 10 · '+verdict(n===2,v);}
  allIn(h,draw);draw();};
P.p4_reveal=function(h){var W=560,H=300;
  function draw(){var z=rv(h,'z')/100;var s=svgOf(h,W,H);bg(s,W,H);var mx=200,my=170;
    /* 장면 전체: 모아 + 오른쪽에 주판봇 북 */
    sdHead(s,{who:'moa',cx:mx,cy:my-30,r:42,mood:'smile'});el('rect',{x:mx-40,y:my+12,width:80,height:60,rx:10,fill:'#c8a57a',stroke:INK,'stroke-width':2},s);el('rect',{x:mx-30,y:my+18,width:60,height:30,fill:'#fff',stroke:INK,'stroke-width':1.5},s);
    var bx=470;el('rect',{x:bx-30,y:120,width:60,height:50,rx:6,fill:'#e8dcc4',stroke:INK,'stroke-width':2},s);el('rect',{x:bx-22,y:127,width:44,height:30,fill:'#2f4f3f'},s);circ(s,bx-8,140,3,{fill:'#7fffd4',w:0});circ(s,bx+8,140,3,{fill:'#7fffd4',w:0});
    ell(s,bx-10,215,34,18,{fill:'#f0c060',w:2});pathD(s,'M'+(bx+30)+',170 l30,-30 M'+(bx-40)+',170 l-25,-30',{w:3});for(var i=0;i<3;i++)pathD(s,'M'+(bx+40+i*8)+','+(120-i*6)+' q8,-6 0,-12',{stroke:C.red,w:2});
    /* 프레임 창 */var fw=W*z,fh=H*z,fx=Math.max(0,Math.min(W-fw,mx-fw/2)),fy=Math.max(0,Math.min(H-fh,my-fh/2));
    var m=el('path',{d:'M0,0 H'+W+' V'+H+' H0Z M'+fx+','+fy+' v'+fh+' h'+fw+' v'+(-fh)+'Z','fill-rule':'evenodd',fill:'rgba(255,255,255,.93)'},s);
    el('rect',{x:fx,y:fy,width:fw,height:fh,fill:'none',stroke:C.navy,'stroke-width':3},s);
    var seen=fx+fw>=bx-30;var area=z*z;
    out(h).innerHTML='보이는 넓이 = '+f2(z,2)+'² = <b>'+f2(area*100,0)+'%</b> · '+verdict(true,seen?'반전이 보입니다 — 마지막 컷에서만 이렇게 넓힙니다':'반전이 숨어 있습니다 — 조용한 독서로 보입니다');}
  allIn(h,draw);draw();};
P.p4_bubble=function(h){var W=560,H=260;
  function draw(){var a=pick(h,'[name=a]').value,b=pick(h,'[name=b]').value,dir=pick(h,'[name=dir]').value;var s=svgOf(h,W,H);bg(s,W,H);
    el('rect',{x:10,y:10,width:540,height:240,rx:10,fill:'#fff',stroke:INK,'stroke-width':2},s);
    sdHead(s,{who:'haru',cx:150,cy:180,r:44,mood:'calm'});sdHead(s,{who:'doc',cx:410,cy:180,r:44,mood:'smile'});
    function bub(pos,txt,col){var x=pos==='l'?40:300;el('rect',{x:x,y:30,width:220,height:64,rx:30,fill:'#fff',stroke:col,'stroke-width':2.4},s);ktxt(s,x+110,68,txt,{size:13,anchor:'middle',fill:C.ink});}
    if(a===b){bub(a,'(두 말풍선이 겹침)',C.red);}else{bub(a,'하루: "이 실험 안전하죠?"',C.teal);bub(b,'박사: "물론이지."',C.orange);}
    var first=dir==='ltr'?'l':'r';var ok=a!==b&&a===first;
    out(h).innerHTML=(a===b?verdict(false,'두 말풍선이 같은 자리에 있습니다'):'먼저 읽히는 말: <b>'+(a===first?'하루의 질문(셋업)':'박사의 대답(펀치라인)')+'</b> · '+verdict(ok,ok?'셋업 → 펀치라인 순서로 읽힙니다':'대답이 먼저 읽혀 박자가 깨집니다'))+' <span class="hint">('+(dir==='ltr'?'왼쪽부터':'오른쪽부터')+' 읽기)</span>';}
  allIn(h,draw);draw();};

/* ---- js_p5.js ---- */
/* ===================== 5부 AI로 웃긴 그림 ===================== */
var JQ={who:[['','— 누가 —'],['haru','Haru (adult lab assistant, pink hair with two hair buns and a navy streak in the bangs)','하루'],['sia','Sia (adult maid intern, long straight black hair)','시아'],['moa','Moa (adult maid intern, ash-beige wavy hair, white ribbon over her LEFT ear)','모아'],['doc','the Professor (adult man in his thirties, teal rectangular glasses)','박사']],
  exp:[['','— 기대(평소) —'],['coffee','carefully carrying a full cup of coffee','커피를 조심조심 들고 간다'],['read','quietly reading a book','조용히 책을 읽는다'],['door','opening the lab door as usual','평소처럼 문을 연다']],
  twist:[['','— 어긋남(결과) —'],['head','but the cup has landed upside down on top of the head, and nobody has noticed','컵이 머리 위에 거꾸로 얹힘'],['band','but right next to them a robot is wildly playing drums','바로 옆에서 로봇이 북을 침'],['robot','but a boxy robot is standing right in the doorway, waving','문 앞에 로봇이 서 있음']],
  exag:[['','— 과장할 곳 —'],['eyes','only the eyes exaggerated to about twice the normal size','눈만 2배'],['mouth','only the mouth exaggerated to about twice the normal size','입만 2배'],['blank','completely blank deadpan face, flat line eyes, tiny dot mouth','무표정(데드팬)'],['all','everything exaggerated: huge eyes, huge mouth, sweat, sparkles','전부 과장']],
  style:[['','— 화풍·등신 —'],['sd','cute super-deformed comedy style about 2.5 heads tall, flat cel colors, plain white background','SD 2.5등신'],['anime','anime illustration with natural proportions about 7 heads tall, plain white background','애니풍 7등신']],
  keep:[['','— 지킬 것 —'],['full','adult in their twenties drawn in comedy style (not a child), no text, not resembling any existing character or real person','성인 표기 + 글자 없음 + 닮지 않기'],['notext','no text','글자 없음만']]};
var JQN={who:'누가',exp:'기대',twist:'어긋남',exag:'과장할 곳',style:'화풍·등신',keep:'지킬 것'};
function jokeForm(host,onchange){var form=document.createElement('div');form.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px 14px;width:100%';host.appendChild(form);
  Object.keys(JQ).forEach(function(k){var lab=document.createElement('label');lab.textContent=JQN[k]+' ';var se=document.createElement('select');se.style.maxWidth='100%';se.name='j_'+k;JQ[k].forEach(function(o){var op=document.createElement('option');op.value=o[0];op.textContent=o[0]?o[2]:o[1];se.appendChild(op);});se.addEventListener('change',onchange);lab.appendChild(se);form.appendChild(lab);});
  return function(){var v={};Object.keys(JQ).forEach(function(k){v[k]=form.querySelector('[name=j_'+k+']').value;});return v;};}
function jokePrompt(v){var t=[],n=0,warn=[];function full(k){return JQ[k].filter(function(o){return o[0]===v[k];})[0][1];}
  Object.keys(JQ).forEach(function(k){if(v[k])n++;});
  if(v.who)t.push(full('who'));if(v.exp)t.push(full('exp'));if(v.twist)t.push(full('twist'));if(v.exag)t.push(full('exag'));if(v.style)t.push('Art style: '+full('style'));if(v.keep)t.push(full('keep'));
  if(!v.twist)warn.push('어긋남이 없어 "웃는 캐릭터" 그림이 됩니다');if(v.exag==='all')warn.push('전부 과장 — 1부 3단계');if(v.style==='sd'&&v.keep!=='full')warn.push('SD인데 성인 표기가 없어 어려 보일 수 있습니다');
  if(v.twist&&v.exp&&((v.exp==='coffee')!==(v.twist==='head')||(v.exp==='read')!==(v.twist==='band')))warn.push('기대와 어긋남이 서로 다른 이야기입니다');
  return {text:t.length?'Illustration. '+t.join('. ')+'.':'(조각을 고르면 문장이 생깁니다)',n:n,warn:warn};}
P.p5_prompt=function(h){var host=ctl(h).querySelector('.pw');var get=jokeForm(host,draw);
  function draw(){var r=jokePrompt(get());h.innerHTML='<div class="promptbox"><b>조립된 웃음 문장</b><pre aria-live="polite"></pre></div>';h.querySelector('pre').textContent=r.text;
    out(h).innerHTML='점검표 <b>'+r.n+' / 6</b> · '+(r.warn.length?verdict(false,r.warn.join(' · ')):verdict(r.n===6,r.n===6?'여섯 조각이 모두 들어갔습니다':'조각을 더 채우세요'));}
  draw();};
function consistP(ref,fix,one){return Math.min(0.99,0.6+(ref?0.15:0)+(fix?0.1:0)+(one?0.05:0));}
P.p5_consist=function(h){var W=560,H=300;
  function draw(){var n=rv(h,'n'),p=consistP(rv(h,'ref'),rv(h,'fix'),rv(h,'one'));var s=svgOf(h,W,H);bg(s,W,H);var x0=60,y0=250,hh=200,bw=50;
    el('line',{x1:x0,y1:y0,x2:x0+8*(bw+6),y2:y0,stroke:'#b8c2cc'},s);
    for(var k=1;k<=8;k++){var v=Math.pow(p,k),x=x0+(k-1)*(bw+6);el('rect',{x:x,y:y0-hh*v,width:bw,height:hh*v,rx:4,fill:k===n?C.orange:'#c9d6e6'},s);ktxt(s,x+bw/2,y0+16,k+'컷',{size:11.5,anchor:'middle'});ktxt(s,x+bw/2,y0-hh*v-6,f2(v*100,0)+'%',{size:11.5,anchor:'middle',fill:k===n?C.orange:C.muted});}
    var tot=Math.pow(p,n);out(h).innerHTML='한 컷 '+f2(p*100,0)+'% → '+n+'컷 모두 같을 확률 = '+f2(p,2)+'^'+n+' ≈ <b>'+f2(tot*100,0)+'%</b> · '+verdict(tot>=0.6,tot>=0.6?'대부분 같은 캐릭터로 나옵니다':'틀린 컷을 고치는 단계가 꼭 필요합니다');}
  allIn(h,draw);draw();};
function loopState(n,L){var stepA=L/(n-1),seam=360-L;var ideal=360/n;var smooth=Math.abs(seam-stepA)<=stepA*0.25;return {stepA:stepA,seam:seam,ideal:ideal,smooth:smooth,type:seam<1?'same':seam>stepA*1.25?'jump':smooth?'ok':'short'};}
P.p5_loop=function(h){var W=560,H=320,ph=0,iv=null;
  function draw(){var n=rv(h,'n'),L=rv(h,'last');var st=loopState(n,L);var s=svgOf(h,W,H);bg(s,W,H);var cx=150,cy=160,R=110;
    circ(s,cx,cy,R,{stroke:'#d0d6de',w:2});
    for(var i=0;i<n;i++){var ang=st.stepA*i,x=cx+R*Math.sin(rad(ang)),y=cy-R*Math.cos(rad(ang));circ(s,x,y,i===ph?9:6,{fill:i===0?C.teal:i===n-1?C.orange:C.navy,w:0});}
    var a0=-90,a1=-90+L;var big=360-L>180?1:0;pathD(s,'M'+(cx+R*Math.cos(rad(a1)))+','+(cy+R*Math.sin(rad(a1)))+' A'+R+','+R+' 0 '+big+' 1 '+(cx+R*Math.cos(rad(a0)))+','+(cy+R*Math.sin(rad(a0))),{stroke:st.smooth?C.green:C.red,w:5,op:0.6});
    ktxt(s,cx,cy+R+28,'이음매(마지막 → 처음)',{size:12,anchor:'middle',fill:st.smooth?C.green:C.red});
    var th=st.stepA*ph;sdHead(s,{who:'haru',cx:410,cy:170,r:70,mood:'smile'});var g=s.lastChild;g.setAttribute('transform','rotate('+(15*Math.sin(rad(th)))+' 410 240)');
    var msg=st.type==='same'?'마지막이 첫 그림과 같아 멈칫합니다(같은 그림 두 번)':st.type==='jump'?'이음매가 한 걸음보다 커서 툭 튑니다':st.type==='short'?'이음매가 한 걸음보다 조금 작아 살짝 걸립니다':'이음매가 한 걸음과 같아 매끄럽게 이어집니다';
    out(h).innerHTML='한 걸음 = '+f2(L,0)+' ÷ '+(n-1)+' ≈ <b>'+f2(st.stepA,1)+'°</b> · 이음매 = 360 − '+L+' = <b>'+st.seam+'°</b> · 이상적인 마지막 = 360 − 360 ÷ '+n+' = '+f2(360-st.ideal,1)+'° · '+verdict(st.smooth,msg);}
  allIn(h,function(){ph=0;draw();});draw();
  if(!RM)iv=setInterval(function(){if(!document.body.contains(h)){clearInterval(iv);return;}var n=rv(h,'n');ph=(ph+1)%n;draw();},1000/8);};
function memeJudge(v){var red=[];if(v.orig)red.push('원작 그림을 가져옴');if(v.real)red.push('실존 인물 얼굴');if(v.mock)red.push('깎아내리는 내용');if(red.length)return ['red','올리지 않기 — '+red.join(', ')];
  var miss=[];if(!v.form)miss.push('형식만 빌리기');if(!v.own)miss.push('내 캐릭터');if(!v.credit)miss.push('출처 밝히기');if(miss.length)return ['yellow','조금 더 — '+miss.join(', ')+' 빠짐'];return ['green','참여해도 좋음'];}
P.p5_meme=function(h){var W=560,H=150;
  function draw(){var v={};['form','own','credit','orig','real','mock'].forEach(function(k){v[k]=rv(h,k);});var j=memeJudge(v);var s=svgOf(h,W,H);bg(s,W,H);
    var cols={red:C.red,yellow:'#e0a020',green:C.green};['red','yellow','green'].forEach(function(c,i){circ(s,90+i*90,75,32,{fill:j[0]===c?cols[c]:'#eef1f4',stroke:'#b8c2cc',w:2});});
    ktxt(s,340,80,j[0]==='green'?'좋음':j[0]==='yellow'?'보완':'멈춤',{size:22,fill:cols[j[0]],weight:'bold'});
    out(h).innerHTML='판정: '+verdict(j[0]==='green',j[1]);}
  allIn(h,draw);draw();};

/* ---- js_p6.js ---- */
/* ===================== 6부 진단 ===================== */
var CHECK6=['① 어긋남(무엇이 웃긴가)','② 형태(등신·과장·기호)','③ 움직임(예비동작·찌그러짐)','④ 박자와 순서(정지·컷 순서)','⑤ 일관성(캐릭터·컷)'];
var FAIL6=[0,1,1,2,2,3,3,4];
var FAILWHY6=['그림 안에 기대와 결과가 없습니다.','과장이 모든 부위에 퍼졌습니다.','4.5등신이라 개그 그림체가 되지 못했습니다.','웅크리는 예비동작이 빠졌습니다.','늘어날 때 폭을 줄이지 않아 부피가 바뀌었습니다.','반전(결과)이 첫 컷에 있습니다.','사고와 반응 사이에 정지가 없습니다.','컷마다 머리색·리본 위치가 다릅니다.'];
var FAILSYM6=['캐릭터가 서 있을 뿐인데, 설명을 들어야 웃긴 그림','놀란 얼굴인데 눈·입·땀·머리카락이 다 커서 시끄러운 그림','개그 장면인데 팔다리가 애매하게 길어 귀엽지도 멋지지도 않은 그림','서 있다가 갑자기 공중에 떠 있는 점프','떨어지며 길어질 때 커 보이는 고무공','4컷 중 첫 컷에 결과가 나와 나머지가 설명이 된 만화','공이 닿는 순간 이미 안경이 날아가 무슨 일인지 놓치는 장면','컷마다 머리색과 리본 위치가 달라 다른 사람 같은 리액션 짤'];
P.p6_check=function(h){var sel=pick(h,'[name=f]');var box=document.createElement('div');box.style.cssText='display:flex;flex-direction:column;gap:6px;margin:6px 0';h.appendChild(box);
  function draw(){var f=+sel.value;box.innerHTML='<p style="margin:0 0 4px"><b>증상</b> — '+FAILSYM6[f]+'</p>'+CHECK6.map(function(c,i){return '<button type="button" class="btn" data-i="'+i+'" style="text-align:left">'+c+'</button>';}).join('');out(h).innerHTML='점검 항목을 위에서부터 눌러 보세요.';
    box.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){var i=+b.dataset.i,first=FAIL6[f];
      if(i<first){b.style.borderColor=C.green;out(h).innerHTML=verdict(true,c(i)+' 통과 — 다음 항목으로');}
      else if(i===first){b.style.borderColor=C.red;b.style.background='#fdeceb';out(h).innerHTML=verdict(false,'여기서 처음 걸림: '+FAILWHY6[f]);}
      else{out(h).innerHTML='<span class="hint">먼저 위 항목부터 확인하세요. 큰 것부터 봅니다.</span>';}});});}
  function c(i){return CHECK6[i];}
  sel.addEventListener('change',draw);draw();};

/* ---- js_practice.js ---- */
/* ===================== 실전 연습장 ===================== */
function practice(){var root=document.getElementById('practice');if(!root)return;var tabs=root.querySelectorAll('.tabs button'),scenes=root.querySelectorAll('.scene');
  function show(id){tabs.forEach(function(b){b.classList.toggle('on',b.dataset.t===id);});scenes.forEach(function(s){s.classList.toggle('on',s.id===id);});if(history.replaceState)history.replaceState(null,'','#'+id);}
  tabs.forEach(function(b){b.addEventListener('click',function(){show(b.dataset.t);});});var hsh=(location.hash||'').slice(1);show([].some.call(scenes,function(s){return s.id===hsh;})?hsh:'bench');
  bench();bounce();comic();desk();}
function wire(S,f){S.querySelectorAll('.ctrl input,.ctrl select').forEach(function(i){i.addEventListener(i.tagName==='SELECT'||i.type==='checkbox'?'change':'input',f);});}
function mark(S,i){var li=S.querySelectorAll('.missions li')[i];if(li)li.classList.add('done');}
function svgIn(host,W,H){host.innerHTML='';return el('svg',{viewBox:'0 0 '+W+' '+H,role:'img','aria-label':'연습장 그림'},host);}
function bench(){var S=document.getElementById('bench');if(!S)return;var q=function(n){return S.querySelector('[name='+n+']');};var touched=false;
  function upd(){var job=q('job').value,n=+q('n').value,k=+q('k').value,part=q('part').value,all=q('all').checked;var fo=focusOf(k,all);
    var okN=job==='poster'?n>=6:n>=2&&n<=3,okK=job==='poster'?k<=1.2:job==='react'?!all&&k>=2:!all&&k>=1.5&&k<=2.5;
    board(S.querySelector('.board'),[['머리 높이(키 360)',f2(360/n,0),okN],['집중도',f2(fo,2),job==='poster'?true:fo>0.45],['등신 판정',okN?'맞음':'다름',okN],['과장 판정',okK?'맞음':'다름',okK]]);
    var s1=svgIn(S.querySelector('.g1'),300,330);bg(s1,300,330);figureN(s1,150,n,15,300,'haru','#c8c0e8');
    var s2=svgIn(S.querySelector('.g2'),300,330);bg(s2,300,330);sdHead(s2,{who:'haru',cx:150,cy:175,r:all?100*(1+(k-1)*0.12):100,eye:all||part==='eye'?k:1,mouth:all||part==='mouth'?k:1,mood:(all||part==='mouth')&&k>1.05?'hot':k>1.05?'surp':'calm'});
    say(S.querySelector('.talk'),[['doctor','e07','박사',okN&&okK?'용도와 몸·과장이 맞았다. 이 조합을 프롬프트 조각으로 옮겨 보자.':'용도부터 다시 보자. 이 그림은 어디에 쓰나?'],['haru','e10','조수 하루','머리 높이 '+f2(360/n,0)+', 집중도 '+f2(fo,2)+'입니다.'],['fruitfly','e09','초파리 연구원',all?'전부 키우면 집중도는 0.33 그대로야.':'한 곳만 키운 건 좋아.'],['jupanbot','e16','주판봇',n>5&&job!=='poster'?'설정 등신 그대로가 최고입니다!':'다음엔 두 배로!']]);
    if(touched){if(job==='comic'&&okN&&okK)mark(S,0);if(job==='react'&&okN&&okK)mark(S,1);if(job==='poster'&&okN&&okK)mark(S,2);}}
  wire(S,function(){touched=true;upd();});upd();}
var MAT={rubber:['고무공',function(v){return v.s>=1.3&&v.s<=1.6&&v.keep&&v.h>=0.5&&v.h<=1.2;}],bowl:['볼링공',function(v){return v.s<=1.1&&v.keep;}],water:['물풍선',function(v){return v.s>=1.7&&v.keep;}]};
function bounce(){var S=document.getElementById('bounce');if(!S)return;var q=function(n){return S.querySelector('[name='+n+']');};var touched=false,t=-1;
  function vals(){return {mat:q('mat').value,s:+q('s').value,keep:q('keep').checked,h:+q('h').value};}
  function upd(){var v=vals(),ws=v.keep?1/v.s:1,wsq=v.keep?v.s:1,ss=1/v.s,A=ws*v.s;var ok=MAT[v.mat][1](v);var hv=holdVerdict(v.h);
    board(S.querySelector('.board'),[['늘어남',f2(v.s,2)+'배',v.mat==='bowl'?v.s<=1.1:v.mat==='water'?v.s>=1.7:v.s>=1.3&&v.s<=1.6],['넓이(떨어질 때)',f2(A,2),Math.abs(A-1)<0.02],['정지',f2(v.h,1)+'초',v.mat!=='rubber'||hv[1]],['재질다움',ok?'맞음':'다름',ok]]);
    var s1=svgIn(S.querySelector('.g1'),300,300);bg(s1,300,300);ballShape(s1,70,270,30,1,1);ballShape(s1,150,200,30,ws,v.s);ballShape(s1,235,270,30,wsq,ss);
    ktxt(s1,70,292,'보통',{size:11.5,anchor:'middle'});ktxt(s1,150,292,'떨어질 때',{size:11.5,anchor:'middle'});ktxt(s1,235,292,'부딪힐 때',{size:11.5,anchor:'middle'});
    var s2=svgIn(S.querySelector('.g2'),300,300);bg(s2,300,300);sdHead(s2,{who:'doc',cx:150,cy:230,r:50,mood:t>0.55&&t<0.55+v.h/(1.2+v.h)?'blank':'calm'});
    if(t>=0){var T=1.2+v.h,now=t*T;var y=now<0.5?30+now/0.5*120:now<0.5+v.h?150:150-(now-0.5-v.h)/0.7*130;var near=now>=0.5&&now<0.5+v.h;ballShape(s2,150,y+30,22,near?wsq:ws,near?ss:v.s);}
    say(S.querySelector('.talk'),[['doctor','e07','박사',ok?MAT[v.mat][0]+'답다. 재질이 보이는구나.':MAT[v.mat][0]+'라면 얼마나 말랑할까?'],['haru','e10','조수 하루','넓이 '+f2(A,2)+', 정지 '+f2(v.h,1)+'초입니다.'],['fruitfly','e09','초파리 연구원',v.keep?'부피는 지켰어.':'부피 유지를 켜 봐. 공이 부풀어.'],['jupanbot','e19','주판봇','더 많이 늘리면 더 웃깁니다!']]);
    if(touched){if(v.mat==='rubber'&&ok)mark(S,0);if(v.mat==='bowl'&&ok)mark(S,1);if(v.mat==='water'&&ok)mark(S,2);}}
  wire(S,function(){touched=true;t=-1;upd();});upd();
  var pb=S.querySelector('[data-act=play]');pb.addEventListener('click',function(){touched=true;var v=vals();player(S,1.2+v.h,function(x){t=x>=1?-1:x;upd();})();});}
var SETS={A:{cards:[['A','케이크 완성'],['B','조심조심 운반'],['C','전선에 걸림'],['D','머리에 착지']],ok:'ABCD'},B:{cards:[['P','문 열기 — 빈 방'],['Q','다시 문 열기 — 빈 방'],['R','세 번째 문 열기'],['S','문 앞에 주판봇']],ok:'PQRS'}};
function comic(){var S=document.getElementById('comic');if(!S)return;var q=function(n){return S.querySelector('[name='+n+']');};var touched=false,done={A:false,B:false},lastSet=null;
  function fill(){var st=q('set').value;if(st===lastSet)return;lastSet=st;var c=SETS[st].cards;var init=[3,0,1,2];['c1','c2','c3','c4'].forEach(function(k,i){var se=q(k);se.innerHTML=c.map(function(x){return '<option value="'+x[0]+'">'+x[0]+' · '+x[1]+'</option>';}).join('');se.value=c[init[i]][0];});}
  function upd(){fill();var st=q('set').value,o=['c1','c2','c3','c4'].map(function(k){return q(k).value;}).join(''),z=+q('z').value,face=q('face').value;var okO=o===SETS[st].ok,okZ=z>=80,okF=face==='dead';
    board(S.querySelector('.board'),[['순서',o,okO],['반전 위치',(o.indexOf(SETS[st].ok[2])+1)+'컷째',o.indexOf(SETS[st].ok[2])===2],['4컷 프레임 폭',z+'% (넓이 '+f2(z*z/100,0)+'%)',okZ],['4컷 표정',okF?'데드팬':'크게 놀람',okF]]);
    var s1=svgIn(S.querySelector('.g1'),300,220);bg(s1,300,220);o.split('').forEach(function(k,i){var x=8+i*73;el('rect',{x:x,y:20,width:66,height:150,rx:6,fill:'#fff',stroke:i===2?C.orange:INK,'stroke-width':i===2?3:1.6},s1);ktxt(s1,x+33,100,k,{size:30,anchor:'middle',fill:C.navy,weight:'bold'});ktxt(s1,x+33,190,(i+1)+'컷',{size:11.5,anchor:'middle'});});
    var s2=svgIn(S.querySelector('.g2'),300,220);bg(s2,300,220);sdHead(s2,{who:st==='A'?'haru':'sia',cx:110,cy:120,r:46,mood:okF?'blank':'surp'});if(z>=60){el('rect',{x:200,y:90,width:60,height:50,rx:6,fill:'#e8dcc4',stroke:INK,'stroke-width':2},s2);el('rect',{x:208,y:97,width:44,height:30,fill:'#2f4f3f'},s2);}
    el('rect',{x:150-150*z/100,y:110-110*z/100,width:300*z/100,height:220*z/100,fill:'none',stroke:C.navy,'stroke-width':3},s2);
    say(S.querySelector('.talk'),[['doctor','e07','박사',okO&&okZ&&okF?'기대를 쌓고, 넓혀 보여 주고, 무표정으로 끝냈다. 완벽하다.':'반전은 몇 컷째에 있지?'],['haru','e10','조수 하루','순서 '+o+', 4컷 폭 '+z+'%입니다.'],['fruitfly','e09','초파리 연구원',okZ?'마지막만 넓게 연 건 좋아.':'마지막 컷을 넓혀야 숨긴 게 보여.'],['jupanbot','e16','주판봇',o[0]===SETS[st].ok[3]?'결과부터 보여 주면 빠르죠!':'제 머리 위 케이크는 언제 나오나요?']]);
    if(touched){if(st==='A'&&okO)mark(S,0);if(st==='A'&&okO&&okZ&&okF){mark(S,1);done.A=true;}if(st==='B'&&okO&&okZ&&okF){done.B=true;mark(S,2);}}}
  wire(S,function(){touched=true;upd();});upd();}
var DESK_SYM=FAILSYM6,DESK_CA=FAIL6;
function desk(){var S=document.getElementById('desk');if(!S)return;var sym=S.querySelector('.sym'),opts=S.querySelector('.deskopts');var cur=0,streak=0,clean=0,wrongEver=false,hit={},r=rng(7);
  function next(){cur=Math.floor(r()*DESK_SYM.length);sym.textContent='증상: '+DESK_SYM[cur];}
  opts.innerHTML=CHECK6.map(function(c,i){return '<button type="button" data-i="'+i+'">'+c+'</button>';}).join('');
  function upd(msg){board(S.querySelector('.board'),[['연속 정답',streak,streak>=3],['맞힌 항목',Object.keys(hit).length+' / 5',Object.keys(hit).length===5],['틀리지 않고',clean,clean>=5],['최근',msg||'—',msg?msg.indexOf('정답')===0:true]]);}
  opts.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){var i=+b.dataset.i,ok=i===DESK_CA[cur];
    if(ok){streak++;hit[i]=true;if(!wrongEver)clean++;}else{streak=0;wrongEver=true;clean=0;}
    say(S.querySelector('.talk'),[['doctor','e07','박사',ok?'정답. 처음 걸리는 곳을 잘 짚었다.':'점검표를 위에서부터 다시 짚어 보자.'],['haru','e10','조수 하루','정답 항목: '+CHECK6[DESK_CA[cur]]],['fruitfly','e09','초파리 연구원',FAILWHY6[cur]],['jupanbot','e20','주판봇',ok?'제 그림이 또 재료로…':'표정이 문제인 줄 알았는데요!']]);
    upd((ok?'정답':'오답')+' · '+CHECK6[DESK_CA[cur]].slice(0,1));
    if(streak>=3)mark(S,0);if(Object.keys(hit).length===5)mark(S,1);if(clean>=5)mark(S,2);
    if(!wrongEver&&clean<5){}if(!ok&&clean===0)wrongEver=false;next();});});
  next();upd();}

/* ---- js_tail.js ---- */
/* 프롬프트 복사 버튼(직접 만들기 실습) */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.promptbox .copy');if(!b||b.closest('#workshop'))return;var pre=b.parentNode.querySelector('pre');if(!pre)return;var t=pre.textContent;
  if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){b.textContent='복사했습니다';},function(){b.textContent='직접 선택해 복사하세요';});else b.textContent='직접 선택해 복사하세요';});
/* ===================== 퀴즈·지식 색인·꾸러미 ===================== */
function quiz(q){var ans=+q.getAttribute('data-ans');var fb=q.querySelector('.fb');var OK=q.querySelector('.qok'),NO=q.querySelector('.qno');q.querySelectorAll('.opts button').forEach(function(b,i){b.addEventListener('click',function(){q.querySelectorAll('.opts button').forEach(function(x){x.classList.remove('ok','no');});b.classList.add(i===ans?'ok':'no');fb.innerHTML=i===ans?'⭕ '+OK.innerHTML:'❌ '+NO.innerHTML;});});}
function kg(){var raw=document.getElementById('kg-raw');var mount=document.getElementById('kg-mount');if(!raw||!mount)return;var K=JSON.parse(raw.textContent);
  mount.innerHTML='<input class="kg-search" type="search"><div class="kg-list"></div>';var list=mount.querySelector('.kg-list'),inp=mount.querySelector('input');inp.placeholder='개념 찾기 (예: 그림자, 주름, 강도)';inp.setAttribute('aria-label','지식 색인 검색');
  var TY={Concept:'개념',Method:'방법',Analogy:'비유',Application:'쓰임',OpenQuestion:'열린 질문'};var pre=document.body.getAttribute('data-root')||'';
  function render(){var qv=inp.value.trim().toLowerCase();list.innerHTML=K.nodes.filter(function(n){return !qv||(n.label.ko+' '+n.label.en+' '+n.definition.ko).toLowerCase().indexOf(qv)>=0;}).map(function(n){
    var nb=K.edges.filter(function(e){return e.s===n.id||e.o===n.id;}).map(function(e){var o=e.s===n.id?e.o:e.s;var m=K.nodes.filter(function(x){return x.id===o;})[0];return m?m.label.ko:'';}).filter(Boolean);
    return '<div class="kg-item"><span class="t">'+(TY[n.type]||n.type)+'</span><b>'+n.label.ko+'</b><span class="muted">'+n.label.en+'</span><div>'+n.definition.ko+'</div>'+(nb.length?'<div class="muted" style="font-size:12.5px">이웃: '+nb.join(', ')+'</div>':'')+'<a href="'+pre+n.page+n.anchor+'">설명 보러 가기 →</a></div>';}).join('');}
  inp.addEventListener('input',render);render();var ex=document.getElementById('export-mount');if(!ex)return;
  ex.innerHTML='<div class="exp-btns"><button class="btn" data-x="json">kg.json</button><button class="btn" data-x="ld">JSON-LD</button><button class="btn" data-x="ttl">Turtle (Protégé)</button><button class="btn" data-x="csv">CSV (Neo4j·Gephi)</button><button class="btn" data-x="bib">BibTeX</button><button class="btn" data-x="ris">RIS</button></div>';
  function dl(name,text,type){var b=new Blob([text],{type:type||'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},500);}
  var base=K.page;var refs=JSON.parse((document.getElementById('refs-csl')||{textContent:'[]'}).textContent);
  ex.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){var x=b.getAttribute('data-x');
    if(x==='json')dl(base+'.kg.json',JSON.stringify(K,null,2),'application/json');
    if(x==='ld')dl(base+'.jsonld',document.getElementById('kg-ld').textContent,'application/ld+json');
    if(x==='ttl'){var t='@prefix lab: <urn:lab:> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix skos: <http://www.w3.org/2004/02/skos/core#> .\n\n';K.nodes.forEach(function(n){t+='<urn:'+n.id+'> a lab:'+n.type+' ;\n  skos:prefLabel "'+n.label.ko+'"@ko , "'+n.label.en+'"@en ;\n  rdfs:comment "'+n.definition.ko.replace(/"/g,'\\"')+'"@ko .\n\n';});K.edges.forEach(function(e){t+='<urn:'+e.s+'> lab:'+e.p+' <urn:'+e.o+'> .\n';});dl(base+'.ttl',t,'text/turtle');}
    if(x==='csv'){var c='id,type,label_ko,label_en,anchor\n'+K.nodes.map(function(n){return [n.id,n.type,n.label.ko,n.label.en,n.page+n.anchor].map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(',');}).join('\n');c+='\n\nsource,relation,target\n'+K.edges.map(function(e){return [e.s,e.p,e.o].join(',');}).join('\n');dl(base+'.csv',c,'text/csv');}
    if(x==='bib')dl(base+'.bib',refs.map(function(r){return '@misc{'+r.id+',\n  title = {'+r.title+'},\n  author = {'+r.author+'},\n  note = {'+(r.note||'')+'},\n  year = {'+r.year+'}\n}';}).join('\n\n'));
    if(x==='ris')dl(base+'.ris',refs.map(function(r){return 'TY  - GEN\nTI  - '+r.title+'\nAU  - '+r.author+'\nPY  - '+r.year+'\nN1  - '+(r.note||'')+'\nER  - ';}).join('\n'));});});}

function boot(){document.querySelectorAll('[data-panel]').forEach(function(h){var k=h.getAttribute('data-panel');if(P[k]){try{P[k](h);}catch(e){h.textContent='실험을 불러오지 못했습니다.';if(window.console)console.warn(k,e);}}});
  document.querySelectorAll('.quiz').forEach(quiz);kg();practice();
  var pr=document.getElementById('prog');if(pr)window.addEventListener('scroll',function(){var d=document.documentElement;pr.style.width=(100*d.scrollTop/Math.max(1,d.scrollHeight-d.clientHeight))+'%';},{passive:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();

})();

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

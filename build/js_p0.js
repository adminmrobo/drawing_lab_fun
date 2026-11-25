/* ===================== 프롤로그: 위상 전환기 ===================== */
/* [그림, 위상, 고정값이 남았나, 설명] — 사이트에 실제로 들어간 그림만 */
var PHASEIMG={
  haru:[['cover_01','픽셀 위상',true,'큰 탈을 들었지만 번 2개와 남색 줄이 그대로'],['p1_haru_sd_compare','애니 위상 + SD 위상',true,'한 장에 7등신과 SD가 함께. 둘 다 번 2개'],['p1_haru_exag_eyes','SD 위상(상반신)',true,'얼굴이 과장돼도 앞머리 남색 줄은 그대로'],['d1_haru_hot','애니 위상(상반신)',true,'혀를 내밀어도 라벤더 후드와 번 그대로'],['p4_comic_cake','SD 위상(4컷)',true,'네 컷 모두 같은 하루']],
  sia:[['cover_03','픽셀 위상',true,'검은 생머리와 메이드복 그대로'],['p3_sia_jump_keys','SD 위상',true,'네 동작 모두 장식 없는 흑발'],['f3_fail','애니 위상(7등신)',true,'바나나를 밟아도 은 귀걸이 그대로'],['d2_sia_lookup','SD 위상',true,'고개를 젖혀도 흑발·메이드복 그대로'],['p4_comic_three','SD 위상(3컷)',true,'세 장면 모두 같은 시아']],
  moa:[['cover_02','픽셀 위상',true,'흰 프릴 머리띠와 리본 그대로'],['p2_moa_lookup_styles','반실사 + 애니 + SD 위상',true,'한 장에서 세 번 바뀌었지만 머리띠·리본 그대로'],['p2_moa_deadpan','SD 위상',true,'페인트를 뒤집어써도 리본은 왼쪽 귀 위'],['d4_lab_zoomout','애니 위상',true,'클로즈업과 줌 아웃 모두 같은 모아'],['f8_fail','위상 붕괴',false,'머리색·눈 색까지 바뀌어 다른 사람이 됨']],
  doc:[['cover_06','픽셀 위상',true,'흰 앞머리 줄과 청록 안경 그대로'],['p3_doctor_bounce_keys','SD 위상',true,'공을 맞아도 굵은 눈썹 그대로'],['d5_doctor_sticker','스티커 위상',true,'흰 테두리가 생겨도 안경·눈썹 그대로'],['p6_f7_fixed','SD 위상(3컷)',true,'안경이 튀어도 다시 같은 박사'],['p5_lab_reaction_sheet_b','위상 붕괴',false,'갈색 머리에 검은 안경 — 다른 사람이 됨']]};
var WHO0={haru:'하루',sia:'시아',moa:'모아',doc:'박사'};
P.p0_phase=function(h){var root=document.body.getAttribute('data-root')||'',last={},n=0;
  function show(i){var who=pick(h,'[name=who]').value,L=PHASEIMG[who],it=L[i];last[who]=i;
    h.innerHTML='<figure class="art" style="margin:0"><img src="'+root+'assets/img/'+it[0]+'.webp" alt="'+WHO0[who]+' — '+it[1]+'" loading="lazy" style="width:100%;border-radius:8px"></figure>';
    out(h).innerHTML='전환 '+n+'회 · '+WHO0[who]+' → <b>'+it[1]+'</b> · '+verdict(it[2],(it[2]?'고정값 남음 — 같은 사람: ':'고정값 사라짐 — ')+it[3]);}
  function zap(){var who=pick(h,'[name=who]').value,L=PHASEIMG[who],i;do{i=Math.floor(Math.random()*L.length);}while(L.length>1&&i===last[who]);n++;show(i);}
  pick(h,'[name=who]').addEventListener('change',function(){show(0);});
  ctl(h).querySelector('[data-act=zap]').addEventListener('click',zap);show(0);};

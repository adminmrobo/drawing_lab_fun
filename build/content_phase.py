# -*- coding: utf-8 -*-
"""프롤로그 — 연구실 위상 전환 사고.
받은 그림마다 캐릭터의 그림 형태(픽셀·SD·애니·반실사·스티커)가 제각각인 것을
'박사의 위상 전환기가 무작위로 위상을 바꿨다'는 설정으로 목차 맨 앞에서 소개한다.
새 일러스트 7장의 프롬프트도 여기에 둔다(make_requests.py가 꾸러미로 만든다)."""

from make_requests import HARU, SIA, MOA, DOC, FLY, BOT, SD, END

# 위상 종류 — 사이트에 실제로 나온 그림 형태
PHASES = [
    ('픽셀 위상', '16비트 게임 화면처럼 네모 점으로 그린 모습', '모든 표지', 'cover_01'),
    ('SD 위상', '머리가 몸만 한 2.5~3.5등신 개그 모습', '1~6부 본문 그림 대부분', 'p3_sia_jump_keys'),
    ('애니 위상', '7등신 안팎의 보통 애니 그림 비율', '1부 등신 비교, 연습 과제', 'p1_haru_sd_compare'),
    ('반실사 위상', '턱이 길고 눈이 작은 사실에 가까운 모습', '2부 화풍 비교', 'p2_moa_lookup_styles'),
    ('스티커 위상', '흰 테두리를 두른 정사각형 이모티콘 모습', '5부 연습 과제', 'd5_doctor_sticker'),
]

# 위상이 바뀌어도 바뀌지 않는 값(고정값)
INVARIANTS = [
    ('하루', 'haru_e01', '분홍 머리에 남색 줄 · 정수리 번 2개 · 앞머리 가운데 남색 줄 · 라벤더 후드'),
    ('시아', 'sia_e13', '검은 생머리 · 머리 장식 없음 · 은 귀걸이 · 검은 메이드복'),
    ('모아', 'moa_e01', '회갈색 웨이브 · 흰 프릴 머리띠 · 왼쪽 귀 위 흰 리본 · 체크 나비넥타이'),
    ('박사', 'doctor_e08', '흰 줄 있는 짙은 머리 · 굵은 눈썹 · 청록 사각 안경 · 흰 가운과 검은 조끼'),
]

# 새 일러스트 7장 (16:9). ph_key만 표지처럼 맨 앞에 크게 쓴다.
PH_STYLE = ('Art style: each character is drawn in a DIFFERENT drawing style inside the same picture, as if a machine randomly changed their style. '
            'Clean lineart, bright colors.\nMatch the attached reference images exactly for each character\'s fixed features (hair, accessories, outfit colors). '
            'All characters are adults in their twenties (the Professor is an adult man in his thirties): adult faces with longer eyes, adult outfits, not children.')
PH_PROMPTS = {
    'ph_key': ('위상 전환 사고 — 주판봇이 큰 버튼을 누르자 연구실 식구들의 그림 형태가 제각각 바뀐 장면',
               ['haru_sheet', 'sia_sheet', 'moa_sheet', 'doctor_sheet', 'jupanbot_ref_genspark_v0', 'fruitfly_sprites_6'],
               'Illustration, wide 16:9.\n' + PH_STYLE + '\nScene: a bright lab. In the center a large retro machine with a big round red button and a dial with four simple icons (a square pixel, a round head, a star, a sticker shape), sparkles and swirly light bursting out. '
               + BOT + ' has just pressed the button, looking guilty with one sweat drop. Around the machine: ' + HARU + ', turned into a 16-bit pixel-art sprite with visible square pixels; '
               + SIA + ', turned into a super-deformed chibi about 2.5 heads tall with a calm blank face; ' + MOA + ', turned into a semi-realistic painted style with natural proportions, looking at her own hands in surprise; '
               + DOC + ', turned into a flat sticker-style drawing with a thick white outline, holding his glasses in shock. ' + FLY + ' hovering above, holding a tiny notebook. Everyone keeps their fixed features exactly.\nLight background.\n' + END),
    'ph_lineup_haru': ('하루의 네 위상 — 같은 자세의 픽셀·SD·애니·반실사 하루',
                       ['haru_anime_base', 'haru_sheet'],
                       'Illustration, wide 16:9, four panels side by side separated by white gutters.\nAll four panels show ' + HARU + ' in exactly the same pose (standing, waving with her right hand, smiling), same size and same ground line, '
                       'each in a different drawing style: 1) 16-bit pixel-art sprite with visible square pixels, 2) super-deformed chibi about 2.5 heads tall, 3) standard anime illustration about 7 heads tall, 4) semi-realistic painted style. '
                       'In all four, keep the two hair buns, the navy streak in the bangs and the lavender hoodie. She is an adult woman in every panel, not a child.\nPlain white background.\n' + END),
    'ph_lineup_sia': ('시아의 네 위상 — 같은 자세의 픽셀·SD·애니·반실사 시아',
                      ['sia_anime_base', 'sia_sheet'],
                      'Illustration, wide 16:9, four panels side by side separated by white gutters.\nAll four panels show ' + SIA + ' in exactly the same pose (standing straight, hands folded in front, calm blank face), same size and same ground line, '
                      'each in a different drawing style: 1) 16-bit pixel-art sprite with visible square pixels, 2) super-deformed chibi about 2.5 heads tall, 3) standard anime illustration about 7 heads tall, 4) semi-realistic painted style. '
                      'In all four, keep the long straight jet-black hair with no headdress and the small silver earrings. She is an adult woman in every panel, not a child.\nPlain white background.\n' + END),
    'ph_lineup_moa': ('모아의 네 위상 — 같은 자세의 픽셀·SD·애니·반실사 모아',
                      ['moa_anime_base', 'moa_sheet'],
                      'Illustration, wide 16:9, four panels side by side separated by white gutters.\nAll four panels show ' + MOA + ' in exactly the same pose (standing, both hands holding a small tea tray, gentle smile), same size and same ground line, '
                      'each in a different drawing style: 1) 16-bit pixel-art sprite with visible square pixels, 2) super-deformed chibi about 2.5 heads tall, 3) standard anime illustration about 7 heads tall, 4) semi-realistic painted style. '
                      'In all four, keep the ash-beige wavy hair, the white frilled headband and the white ribbon over her LEFT ear (right side of the picture). She is an adult woman in every panel, not a child.\nPlain white background.\n' + END),
    'ph_lineup_doc': ('박사의 네 위상 — 같은 자세의 픽셀·SD·애니·반실사 박사',
                      ['doctor_sheet'],
                      'Illustration, wide 16:9, four panels side by side separated by white gutters.\nAll four panels show ' + DOC + ' in exactly the same pose (standing, one hand pushing up his glasses, confident grin), same size and same ground line, '
                      'each in a different drawing style: 1) 16-bit pixel-art sprite with visible square pixels, 2) super-deformed chibi about 2.5 heads tall, 3) standard anime illustration about 7 heads tall, 4) semi-realistic painted style. '
                      'In all four, keep the white streak in his dark spiky hair, the very thick eyebrows and the teal rectangular glasses. He is an adult man in every panel.\nPlain white background.\n' + END),
    'ph_collapse': ('위상 붕괴 — 거울 속 자기 모습이 고정값까지 바뀐 모아와 박사',
                    ['moa_anime_base', 'moa_sheet', 'doctor_sheet'],
                    'Illustration, wide 16:9.\n' + SD + '\nTwo big wall mirrors side by side. LEFT: ' + MOA + ' stands in front of a mirror, but her reflection has blonde hair, green eyes and the ribbon on the wrong side; real Moa stares at it with a blank shocked face. '
                    'RIGHT: ' + DOC + ' stands in front of a mirror, but his reflection has neat brown hair, thin eyebrows and black round glasses, like a stranger; the real Professor points at it, mouth open. Small question marks float above both.\nPlain white background.\n' + END),
    'ph_restore': ('고정값 되돌리기 — 각자 고정값을 붙잡고 원래 모습을 지키는 연구실 식구들',
                   ['haru_sheet', 'sia_sheet', 'moa_sheet', 'doctor_sheet', 'jupanbot_ref_genspark_v0'],
                   'Illustration, wide 16:9.\n' + SD + '\nThe four lab members stand in a row, each proudly touching their own fixed feature while soft sparkles settle around them: '
                   + HARU + ' holds both hair buns; ' + SIA + ' tucks her long black hair behind her ear to show the silver earring; ' + MOA + ' straightens the white ribbon over her LEFT ear; '
                   + DOC + ' pushes up his teal rectangular glasses. Behind them ' + BOT + ' sits in front of the machine with a big bandage on the red button, sheepish.\nPlain white background.\n' + END),
}
# 받은 그림(2026-11-26)을 직접 보고 적은 그림 설명 — 요청과 다른 곳은 있는 그대로
PH_ACTUAL = {
    'ph_key': '위상 전환 사고 — 주판봇이 빨간 버튼을 누르자 기계에서 무지개빛 연기가 솟고, 모습이 제각각 바뀐 연구실 식구들이 놀라는 장면. 박사는 흰 테두리 스티커처럼, 시아는 SD로 바뀜(하루가 픽셀, 모아가 반실사로 바뀌라는 요청은 약하게 나와 둘 다 애니풍에 가까움)',
    'ph_lineup_haru': '하루의 네 위상 — 손을 흔드는 같은 자세의 픽셀·SD·애니·반실사 하루. 네 모습 모두 번 2개·앞머리 남색 줄·라벤더 후드',
    'ph_lineup_sia': '시아의 네 위상 — 손을 모은 같은 자세의 픽셀·SD·애니·반실사 시아. 네 모습 모두 장식 없는 흑발',
    'ph_lineup_moa': '모아의 네 위상 — 찻잔 쟁반을 든 같은 자세의 픽셀·SD·애니·반실사 모아. 머리띠와 리본은 그대로지만, 무릎 위 치마에 흰 양말·로퍼라 학생복 느낌이 조금 남',
    'ph_lineup_doc': '박사의 네 위상 — 안경을 올리는 같은 자세의 픽셀·SD·애니·반실사 박사. 네 모습 모두 흰 앞머리 줄·굵은 눈썹·청록 안경',
    'ph_collapse': '위상 붕괴 — 거울 속 모아는 금발에 초록 눈, 거울 속 박사는 단정한 갈색 머리에 둥근 검은 안경. 진짜 두 사람이 물음표를 띄우고 거울을 봄',
    'ph_restore': '고정값 되돌리기 — 하루는 번을, 시아는 귀걸이를, 모아는 리본을, 박사는 안경을 만지며 원래 모습으로 돌아온 단체 장면. 옆의 주판봇 버튼에는 반창고가 붙어 있음',
}
PH_ORDER = ['ph_key', 'ph_lineup_haru', 'ph_lineup_sia', 'ph_lineup_moa', 'ph_lineup_doc', 'ph_collapse', 'ph_restore']


def prologue_html(figure, talk):
    h = ['<section class="room" id="phase"><div class="wrap"><div class="roomno">프롤로그 · 읽기 전에 꼭</div>',
         '<h2>긴급 공지 — 연구실 위상 전환 사고</h2>',
         '<p class="muted">이 사이트 그림을 넘기다 보면 같은 하루가 표지에서는 게임 속 점 그림, 본문에서는 머리가 큰 꼬마 체형, 어떤 곳에서는 7등신으로 나옵니다. 잘못 그린 것이 아닙니다. 사고가 있었습니다.</p>']
    h.append(figure('ph_key', PH_ACTUAL['ph_key']))
    h.append(talk([('robo', 'e19', '박사님, 이 "위상 전환기"의 빨간 버튼… 한 번만 눌러 봐도 되나요?'),
                   ('doc', 'e15', '안 돼! 그건 아직 다이얼이 고정되지 않아서 무작위로—'),
                   ('robo', 'e20', '…이미 눌렀습니다. 그것도 연타로.'),
                   ('haru', 'e04', '제, 제 몸이 네모 점이 됐어요! 표지에서는 16비트 게임 캐릭터예요!'),
                   ('sia', 'e13', '…저는 2.5등신이 됐습니다. 키는 줄었지만 마음은 그대로입니다.'),
                   ('moa', 'e20', '저는 2부 한 장 안에서 반실사, 애니, 동그라미 얼굴로 세 번이나 바뀌었어요.'),
                   ('fly', 'e09', '전환기가 그림마다 위상을 무작위로 골라. 그래서 페이지마다 우리 모습이 다른 거야.'),
                   ('doc', 'e08', '침착해라. 위상수학에서는 도넛과 손잡이 달린 머그컵을 같은 모양으로 본다. 늘이고 구부려도 구멍 개수는 바뀌지 않으니까. 우리에게도 위상이 바뀌어도 바뀌지 않는 값이 있다. 그게 고정값이다.')]))
    rows = ''.join('<tr><td><b>%s</b></td><td>%s</td><td>%s</td></tr>' % (n, d, w) for n, d, w, _ in PHASES)
    h.append('<h3>위상 도감 — 지금까지 발견된 다섯 가지 모습</h3><div class="tbl"><table><thead><tr><th>위상</th><th>모습</th><th>나오는 곳</th></tr></thead><tbody>%s</tbody></table></div>' % rows)
    inv = ''.join('<tr><td><img src="assets/chars/%s.webp" alt="" width="48" height="48" style="vertical-align:middle;margin-right:6px">%s</td><td>%s</td></tr>' % (c, n, t) for n, c, t in INVARIANTS)
    h.append('<h3>바뀌지 않는 값 — 캐릭터별 고정값</h3><p>위상이 무엇으로 바뀌든 아래 특징이 남아 있으면 같은 사람입니다. 그림을 볼 때마다 이 목록으로 "아직 그 사람인가?"를 확인해 보세요.</p>'
             '<div class="tbl"><table><thead><tr><th>캐릭터</th><th>고정값</th></tr></thead><tbody>%s</tbody></table></div>' % inv)
    h.append('<div class="panel"><div class="ph"><b>실험 0</b><small>위상 전환기를 직접 눌러 보세요 · 이 사이트에 실제로 나온 그림 중 하나가 무작위로 나옵니다</small></div>'
             '<div id="pp-p0_phase" data-panel="p0_phase"></div><div class="ctrl"><label>누구를 바꿀까 <select name="who"><option value="haru" selected>하루</option><option value="sia">시아</option><option value="moa">모아</option><option value="doc">박사</option></select></label>'
             '<button type="button" class="btn" data-act="zap">빨간 버튼 누르기</button></div><div class="readout" aria-live="polite"></div></div>')
    h.append('<h3>사고 기록 — 이 사람, 같은 사람인가요?</h3><p>전환기 다이얼에 하루·시아·모아·박사의 네 가지 위상을 나란히 걸어 보았습니다. 모습은 넷이지만 고정값은 그대로라 모두 같은 사람으로 보여야 합니다.</p>')
    h.append('<div class="pair">%s%s</div><div class="pair">%s%s</div>' % tuple(figure(k, PH_ACTUAL[k]) for k in ('ph_lineup_haru', 'ph_lineup_sia', 'ph_lineup_moa', 'ph_lineup_doc')))
    h.append('<p style="background:#fff7ec;border-left:4px solid var(--orange);padding:8px 12px;border-radius:6px">실제 결과: 네 위상 나란히 네 장은 픽셀·SD·애니·반실사가 분명히 나뉘고, 넷 모두 고정값이 지켜져 같은 사람으로 읽힙니다. 한 그림 안에 패널을 나란히 요청한 방식이 이번에도 가장 잘 통했습니다. 맨 위 대표 그림은 하루의 픽셀풍이 가장자리만 살짝 깨진 정도이고 모아는 반실사가 아니라 보통 애니풍으로 나왔습니다 — 한 장 안에 그림체를 섞으면 도구가 가운데 그림체로 끌어당기는 경향이 있습니다. 위상 붕괴 그림은 거울 속 모습만 고정값이 바뀌어 의도대로 다른 사람이 되었습니다.</p>')
    h.append('<h3>위상 붕괴 — 고정값까지 바뀌어 버린 날</h3>'
             '<p>버튼을 너무 세게 누른 날에는 고정값까지 바뀌었습니다. 이때는 위상이 바뀐 것이 아니라 <b>다른 사람</b>이 된 것입니다. 실제로 이 사이트에도 그런 그림이 두 장 있습니다: '
             '<a href="05_ai_fun.html#make1">5부 리액션 짤 B</a>(참고 그림 없이 만들었더니 네 명 모두 다른 사람)와 <a href="06_failure_lab.html#f8">6부 f8 컷마다 다른 얼굴</a>(모아의 머리색·눈 색이 컷마다 바뀜).</p>')
    h.append('<div class="pair">%s%s</div>' % (figure('ph_collapse', PH_ACTUAL['ph_collapse']), figure('ph_restore', PH_ACTUAL['ph_restore'])))
    h.append(talk([('doc', 'e07', '그래서 이 편의 모든 프롬프트에는 고정값 문장과 기준 그림이 붙어 있다. 위상은 바뀌어도 괜찮지만, 고정값이 바뀌면 다른 사람이다.'),
                   ('fly', 'e10', '읽으면서 그림마다 고정값 찾기를 해 봐. 웃음 편의 숨은 놀이야.'),
                   ('robo', 'e16', '그럼 저는 다음 편에서 또 눌러도…'),
                   ('haru', 'e15', '안 돼요!')]))
    h.append('<div class="limit"><b>주의할 점</b> — "위상 전환기"는 이야기 속 설정입니다. 실제로는 그림 생성 AI가 요청할 때마다 그림체·등신을 조금씩 다르게 그리기 때문에 생긴 차이이고, 이를 줄이는 방법은 <a href="05_ai_fun.html#s2">5부 2단계 일관성</a>에서 다룹니다. 위상수학 비유는 "늘이고 구부려도 남는 성질"을 떠올리기 위한 것입니다.</div>')
    h.append('</div></section>\n')
    return '\n'.join(h)


NOTICE = ('<div class="wrap" style="margin-top:10px"><p class="hint" style="background:#fff7ec;border-left:4px solid var(--orange);padding:8px 12px;border-radius:6px">'
          '그림 속 캐릭터 모습이 페이지마다 달라 보이나요? 연구실에 <a href="%sindex.html#phase">위상 전환 사고</a>가 있었습니다. 고정값이 남아 있으면 같은 사람입니다.</p></div>\n')

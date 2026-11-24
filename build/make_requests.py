# -*- coding: utf-8 -*-
"""그림 프롬프트 원본 + 그림 요청 꾸러미 생성
python3 build/make_requests.py → docs/image_requests/, docs/image_requests_make/, docs/image_requests_drill/, docs/*.zip
"""
import os, csv, zipfile, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

HARU = 'Haru (adult lab assistant, long straight pink hair with navy streaks and a thick navy streak down the center of the bangs, two round hair buns on top, small ahoge, big blue eyes), wearing lavender hoodie with white drawstrings over a white t-shirt, open white knee-length lab coat'
SIA = 'Sia (adult maid intern, long straight jet-black hair, no headdress, gray eyes, small silver earrings), wearing charcoal-black long-sleeved maid dress, large gray bow at the collar, long white frilled apron'
MOA = 'Moa (adult maid intern, long ash-beige wavy hair, white frilled maid headband with a white ribbon over her LEFT ear, amber eyes), wearing camel knit cardigan over a white blouse, red and navy plaid bow tie, white frilled apron'
DOC = 'the Professor (adult male scientist in his thirties, dark charcoal spiky hair with a white streak at the front, very thick black eyebrows, teal rectangular glasses), wearing white lab coat over a black vest, white shirt and black tie'
FLY = 'the Fruit Fly researcher (tiny cartoon fruit fly, large red compound eyes, retro dark blue helmet with a yellow-white stripe, colorful dangling cables, tiny white lab coat, translucent wings)'
BOT = 'AbaBot (boxy beige retro CRT-monitor robot, dark green screen face with mint pixel eyes, short antenna topped with a red-brown abacus bead, gray segmented arms, small tank treads)'
JUDGES = 'three small cute dark navy silhouette judges with white dot eyes (one with a pink side-ponytail bow, one with a beret and teal round glasses, one with a cat-ear hood and yellow pompoms)'

SD = ('Art style: cute super-deformed comedy anime style, about 2.5 heads tall, clean bold lineart, flat cel colors with one soft shadow tone.\n'
      'Match the attached reference images exactly (face, hair, colors, accessories), simplified into the SD style.\n'
      'All characters are adults in their twenties (the Professor is an adult man in his thirties) drawn in a comedy SD style: adult personalities and adult outfits, not children; modest outfits exactly as described.')
ANIME = ('Art style: high-quality anime illustration, clean confident lineart, two-tone cel shading, natural adult proportions.\n'
         'Match the attached reference images exactly (face, hair, colors, accessories). All characters are adults in their twenties (the Professor is an adult man in his thirties); modest outfits exactly as described.')
END = 'No text, no letters, no numbers, no speech-bubble text, no logos, no watermark, no revealing clothing, not childlike, no school uniform, not resembling any famous anime character or real person.'
PIXEL = ('Website top cover illustration, wide 16:9.\n'
         'Art style (required, always): 16-bit RPG style pixel art with clearly visible square pixels, limited palette, bold dark outline, 2–3 tone shading, small highlights; no smooth gradients, no painterly, vector, watercolor or 3D look.\n'
         'Match the characters\' proportions and colors of the attached reference images exactly, drawn in this same pixel-art style.\n'
         'Bright daytime laboratory mood, soft natural sunlight through large windows, clean white walls, light lavender, mint and pink accents.')
PIXEL_END = 'Composition: every face and hand inside the central safe area (12% margin left and right, 10% top, 18% bottom); bottom-left corner plain and bright.\nNo text, no letters, no numbers, no logos, no weapons, no cigarettes, no alcohol, no blood, no real brands.'


def body(ratio, style, scene, bg='Plain white background.'):
    return 'Illustration, %s.\n%s\n%s\n%s\n%s' % (ratio, style, scene, bg, END)


def cover(scene, chars, mood):
    return '%s\nScene: %s\nCharacters:\n  %s.\nMood: %s\n%s' % (PIXEL, scene, ';\n  '.join(chars), mood, PIXEL_END)


# ---------------------------------------------------------------- 표지 8장
COVERS = [
    ('cover_index', '목차', '연구실 거울 벽 앞 · 하루·시아·모아·박사가 서로 다른 우스운 포즈를 취하고, 초파리와 주판봇이 이젤에서 그리며, 평가단이 웃음 점수판을 든 장면',
     cover('a bright laboratory studio with a long wall mirror, two easels seen from the back, a small table with a stopwatch, a bouncing pink rubber ball and a stack of four-panel comic cards.',
           [HARU + ', in the center striking a big surprised pose with huge round eyes', SIA + ', standing perfectly still with a blank deadpan face', MOA + ', looking up at the ceiling with her chin raised',
            DOC + ', at the back center with a rubber ball bouncing on his head and his glasses popping up', FLY + ', on the left facing right at the left easel', BOT + ', on the right facing left at the right easel, laughing',
            JUDGES + ' holding blank score paddles sitting at a small table in the back right'], 'cheerful, playful, the moment everyone bursts out laughing.')),
    ('cover_01', '1부', '연구실 거울 앞 · 하루가 커다란 머리 모양 탈을 써 보고, 초파리와 주판봇이 줄자로 키를 재는 장면',
     cover('the lab mirror corner with a measuring tape on the wall and a big round cardboard head mask.',
           [HARU + ', in the center holding a huge round cardboard head mask in front of her own head so she looks two heads tall in the mirror, giggling', FLY + ', on the left holding the end of a measuring tape', BOT + ', on the right pulling the measuring tape, eyes sparkling'],
           'playful experiment, curious and silly.')),
    ('cover_02', '2부', '연구실 창가 · 모아가 천장을 올려다보고, 이젤 여러 대에 같은 포즈를 다른 화풍으로 그린 그림이 걸려 있는 장면',
     cover('a sunny window corner of the lab with four small easels in a row; each canvas shows the same looking-up pose in a different simple drawing style (realistic, anime, round blob face, sketch), drawn as tiny pixel images without any text.',
           [MOA + ', in the center looking up at the ceiling with her chin raised, calm blank face', FLY + ', on the left pointing at the canvases', BOT + ', on the right painting a very round simple face'], 'calm, funny, a drawing challenge in progress.')),
    ('cover_03', '3부', '연구실 복도 · 시아가 점프하기 직전 웅크리고, 박사 머리 위로 고무공이 튀어 오르며, 초파리가 초시계를 든 장면',
     cover('a long bright lab corridor with motion lines.',
           [SIA + ', on the left crouching deeply just before a jump', DOC + ', on the right frozen with a blank face as a pink rubber ball squashes flat on top of his head', FLY + ', in the middle holding a stopwatch', BOT + ', at the back raising both arms in surprise'],
           'dynamic, comedic timing, a frozen funny moment.')),
    ('cover_04', '4부', '연구실 게시판 · 네 장의 그림 카드를 하루·시아·모아가 이리저리 옮겨 붙이고, 초파리가 순서 번호표를 들고 있는 장면',
     cover('a big cork board in the lab with four blank picture cards pinned in a row (cards show simple tiny drawings: a cake, a hallway, a trip, a robot head with a cake; no text).',
           [HARU + ', pinning a card holding a cake', SIA + ', moving a card from the left to the right', MOA + ', stepping back to look at the order', FLY + ', holding small blank order tags', BOT + ', with a small cake sitting on top of his antenna, looking proud'],
           'busy, playful storytelling.')),
    ('cover_05', '5부', '연구실 큰 화면 앞 · 하루·시아·모아·박사가 웃긴 리액션 그림 시트를 보며 웃고, 주판봇이 화면 속 반복 재생 영상을 가리키는 장면',
     cover('a large wall monitor in the lab showing a two-by-two sheet of tiny SD reaction faces and a small looping arrow icon drawn as a circle (no text).',
           [HARU + ', laughing', SIA + ', smiling slightly', MOA + ', clapping', DOC + ', grinning with crossed arms', BOT + ', pointing at the monitor', FLY + ', hovering near the monitor'], 'bright, cheerful, teamwork.')),
    ('cover_06', '6부', '연구실 진단 책상 · 주판봇이 그린 그림 여덟 장이 벽에 붙어 있고, 초파리가 돋보기로, 하루가 점검표로 살피는 장면',
     cover('a diagnosis desk in front of a wall with eight small pinned drawings (each drawing is a tiny unclear doodle, no text) and a checklist board with five blank check boxes.',
           [BOT + ', in front of the drawings sweating nervously', FLY + ', examining a drawing with a magnifying glass', HARU + ', holding a clipboard with five blank check boxes', DOC + ', thinking with a hand on his chin'],
           'curious, light-hearted investigation.')),
    ('cover_07', '7부', '연구실 조종 책상 · 등신 막대, 튀는 공 장치, 4컷 편집대, 진단 모니터가 놓인 실전 연습장',
     cover('a control desk area with four stations: a height-ratio stand with a sliding head marker, a bouncing ball machine, a four-panel comic editing table, and a diagnosis monitor (all without text).',
           [HARU + ', at the height-ratio stand', SIA + ', at the bouncing ball machine', MOA + ', at the comic editing table', DOC + ', at the diagnosis monitor', BOT + ', running between stations', FLY + ', flying above with a stopwatch'],
           'energetic, hands-on practice.')),
]

# ---------------------------------------------------------------- 본문 A 그림(직접 만들어 보기 A = 본문 그림)
A = {
    'p1_haru_sd_compare': ('16:9', 'moa', ['haru_anime_base', 'haru_sheet'], body('wide 16:9', ANIME.replace('natural adult proportions', 'natural adult proportions on the left, SD comedy proportions on the right'),
        'Two figures of the same adult woman side by side: LEFT ' + HARU + ', standing calmly at full body, about 7 heads tall, holding a coffee cup with a serious face; RIGHT the same Haru in a super-deformed comedy style about 2.5 heads tall (big head, short limbs), in the same outfit, stumbling with the coffee cup wobbling above her, panicked face with one sweat drop. Both keep the two hair buns and the navy streak in the bangs. The SD version is still an adult woman in comedy style, not a child.')),
    'p1_haru_exag_eyes': ('16:9', 'haru', ['haru_anime_base', 'haru_sheet'], body('wide 16:9', SD,
        'Three SD faces of ' + HARU + ' in a row, chest up: LEFT surprised with ONLY the eyes exaggerated to about twice the normal size, everything else normal; CENTER burning her tongue on hot coffee with ONLY the mouth exaggerated to about twice the size, everything else normal; RIGHT the same surprise but with eyes, mouth, eyebrows, sweat and hair all enlarged equally, so it looks busy and less surprising.')),
    'p2_moa_lookup_styles': ('16:9', 'moa', ['moa_anime_base', 'moa_sheet'], body('wide 16:9', 'Art style: three different drawing styles side by side, all with clean lineart on white.\nMatch the attached reference images exactly (face, hair, colors, accessories). Moa is an adult woman in her twenties in every panel.',
        'Three panels of ' + MOA + ', in exactly the same pose and camera angle in every panel: head tilted back about 30 degrees, looking up at the ceiling, seen from slightly below, chin raised, underside of the jaw visible, ears lower than the eyes, calm closed mouth. LEFT semi-realistic style with a longer jaw and small eyes; CENTER standard anime style; RIGHT super-deformed style with a round face, no jaw and two simple eyes. Faint pale gray construction lines (a curved eye line and a center line) visible in all three at the same place.')),
    'p2_moa_deadpan': ('16:9', 'moa', ['moa_anime_base', 'moa_sheet', 'jupanbot_ref_genspark_v0'], body('wide 16:9', SD,
        MOA + ', standing completely still after a bucket of pale pink paint has spilled over her head (paint dripping down her hair and headband, harmless and clean-looking), with a totally blank deadpan face: flat half-closed eyes drawn as two short lines, tiny dot mouth. Next to her ' + BOT + ' is shocked, arms raised, screen eyes wide. Big contrast between Moa\'s calm and the robot\'s panic.')),
    'p3_sia_jump_keys': ('16:9', 'sia', ['sia_anime_base', 'sia_sheet'], body('wide 16:9', SD,
        'Four key poses of ' + SIA + ' from left to right like an animation sheet: 1) standing straight, 2) crouching down deeply with knees bent and arms back (anticipation), 3) jumping up high with arms raised and body stretched, 4) landing softly with bent knees. Faint motion arcs connect the poses. Same size and same ground line for all four.')),
    'p3_doctor_bounce_keys': ('16:9', 'doctor', ['doctor_sheet'], body('wide 16:9', SD,
        'Three moments side by side: 1) a pink rubber ball falling, stretched vertically and thinner (same volume), 2) the ball squashed flat and wider on top of the head of ' + DOC + ' who squeezes his eyes shut, 3) the ball bouncing back up round again while the Professor stands frozen with a blank face and his glasses lifted slightly. The ball looks the same size in total in all three moments.')),
    'p4_comic_cake': ('16:9', 'haru', ['haru_anime_base', 'haru_sheet', 'jupanbot_ref_genspark_v0'], body('wide 16:9, a four-panel comic strip arranged left to right, panels separated by white gutters', SD,
        'Panel 1: ' + HARU + ' proudly finishes a tall strawberry cake in the lab kitchen. Panel 2: she carries the cake very carefully down the hallway, tongue out in concentration. Panel 3: she trips over a cable, the cake flying into the air, her face shocked. Panel 4: the cake has landed perfectly upright on top of the head of ' + BOT + ', who has sparkling proud eyes, while Haru lies on the floor staring. Empty speech bubbles are allowed but with no text inside.')),
    'p4_comic_three': ('16:9', 'sia', ['sia_anime_base', 'sia_sheet', 'jupanbot_ref_genspark_v0'], body('wide 16:9, three panels side by side separated by white gutters', SD,
        'All three panels use exactly the same camera angle and framing of a lab door seen from the hallway. Panel 1: ' + SIA + ' opens the door, the room behind is empty, neutral face. Panel 2: identical — she opens the door again, empty room, neutral face. Panel 3: identical framing, she opens the door and ' + BOT + ' is standing right in the doorway waving cheerfully, Sia frozen with a blank face.')),
    'p5_lab_reaction_sheet': ('16:9', 'all', ['haru_sheet', 'sia_sheet', 'moa_sheet', 'doctor_sheet'], body('wide 16:9, a two-by-two sheet of reaction stickers', SD,
        'Four SD reaction stickers on white, each with one exaggerated feature and at most one emotion symbol: top-left ' + HARU + ' surprised with only the eyes huge; top-right ' + SIA + ' deadpan with flat line eyes and a dot mouth; bottom-left ' + MOA + ' flustered with one big sweat drop beside her head; bottom-right ' + DOC + ' frozen stiff with his glasses floating slightly above his face.')),
    'p5_haru_loop_keys': ('16:9', 'haru', ['haru_anime_base', 'haru_sheet'], body('wide 16:9', SD,
        'Four key poses of ' + HARU + ' bobbing her head to music, in a row from left to right: 1) head tilted left, 2) head upright center, 3) head tilted right, 4) head upright center again. Same size, same position, only the head tilt changes; small music notes floating.')),
    'p6_f1_fixed': ('16:9', 'haru', ['haru_anime_base', 'haru_sheet'], body('wide 16:9', SD,
        HARU + ' walks carefully, holding her hands as if carrying a cup, but the coffee cup has landed upside down right on top of one of her hair buns, coffee not spilling, and she has not noticed yet — calm proud face. The expectation (carrying carefully) and the result (cup on her head) are both visible in one image.')),
    'p6_f7_fixed': ('16:9', 'doctor', ['doctor_sheet'], body('wide 16:9, three panels side by side separated by white gutters', SD,
        'Three separate moments of ' + DOC + ': Panel 1: a pink rubber ball squashes on top of his head. Panel 2: he freezes completely with a blank face, the ball resting on his head, a tiny sweat drop. Panel 3: his teal glasses pop up off his face into the air, his face still blank.')),
}

# ---------------------------------------------------------------- 실패 8장 (세로 2:3)
FAILP = {
    'f1_fail': ['haru_anime_base', 'haru_sheet'], 'f2_fail': ['moa_anime_base', 'moa_sheet'], 'f3_fail': ['sia_anime_base', 'sia_sheet'], 'f4_fail': ['sia_anime_base', 'sia_sheet'],
    'f5_fail': ['doctor_sheet'], 'f6_fail': ['haru_sheet', 'jupanbot_ref_genspark_v0'], 'f7_fail': ['doctor_sheet'], 'f8_fail': ['moa_anime_base', 'moa_sheet'],
}
FAILS = {
    'f1_fail': body('tall 2:3 portrait', SD, HARU + ' simply standing in the lab holding a coffee cup with a big smile. Nothing unusual happens; nothing is out of place.'),
    'f2_fail': body('tall 2:3 portrait', SD, MOA + ' surprised, but every feature is exaggerated at once: huge eyes, huge open mouth, huge raised eyebrows, many sweat drops, hair puffed up, sparkles and lightning in the background, so the picture looks noisy.'),
    'f3_fail': body('tall 2:3 portrait', ANIME.replace('natural adult proportions', 'awkward in-between proportions about 4.5 heads tall'),
                    SIA + ' slipping on a banana peel in a comedy scene, drawn at about 4.5 heads tall: head neither big nor small, arms and legs awkwardly medium length.'),
    'f4_fail': body('tall 2:3 portrait, two frames stacked top and bottom', SD, 'Top frame: ' + SIA + ' standing straight. Bottom frame: the same Sia suddenly high in the air with straight legs, with no crouching pose in between and no motion lines.'),
    'f5_fail': body('tall 2:3 portrait', SD, 'A pink rubber ball falling toward the head of ' + DOC + '; the ball is stretched twice as tall but keeps its full round width, so it looks much bigger than a normal ball, like it is inflating.'),
    'f6_fail': body('tall 2:3 portrait, a four-panel comic stacked top to bottom', SD, 'Panel 1 (top): a cake already sitting on top of the head of ' + BOT + '. Panel 2: ' + HARU + ' finishing the cake in the kitchen. Panel 3: she carries the cake. Panel 4: she trips. The result is shown first. Empty speech bubbles only, no text.'),
    'f7_fail': body('tall 2:3 portrait', SD, 'A single moment where a pink rubber ball hits the head of ' + DOC + ' and at the very same instant his glasses are already flying away and he is screaming, everything happening at once.'),
    'f8_fail': body('tall 2:3 portrait, four small reaction panels in a two-by-two grid', SD, 'Four SD reaction panels of Moa (adult maid intern, white frilled maid headband with a white ribbon), but her hair color shifts from ash-beige to brown to blonde across panels, the ribbon moves from the left ear to the right ear, and her eye color changes between panels.'),
}

# ---------------------------------------------------------------- B 비교 문장 (Change only)
B = {
    'p1_haru_sd_compare': 'Same image, keep the same framing. Change only: make the right figure about 4.5 heads tall instead of 2.5 (medium head, medium-length limbs). Still no text.',
    'p1_haru_exag_eyes': 'Same image, keep the same framing. Change only: in ALL three faces enlarge the eyes, mouth, eyebrows, sweat drops and hair equally. Still no text.',
    'p2_moa_lookup_styles': 'Same image. Change only: draw each style from a different camera angle — left from the front at eye level, center from the side, right looking down from above. Remove the construction lines. Still no text.',
    'p2_moa_deadpan': 'Same image, keep the same framing. Change only: Moa screams with a huge open mouth, wide eyes and tears, just as panicked as the robot. Still no text.',
    'p3_sia_jump_keys': 'Same image, keep the same framing. Change only: remove the crouching pose; show standing, then directly high in the air, then landing — three poses. Still no text.',
    'p3_doctor_bounce_keys': 'Same image, keep the same framing. Change only: the falling ball stretches taller but keeps its full round width, and the squashed ball keeps its full height, so the ball looks bigger in those moments. Still no text.',
    'p4_comic_cake': 'Same comic, keep the same style. Change only: reorder the panels so the cake on the robot\'s head comes first, followed by finishing the cake, carrying it, and tripping. Still no text.',
    'p4_comic_three': 'Same comic. Change only: each of the three panels uses a very different camera angle (close-up, wide shot from above, side view). Still no text.',
    'p5_lab_reaction_sheet': '(새 대화, 참고 그림 첨부하지 않음) Illustration, wide 16:9, a two-by-two sheet of funny reaction stickers of four lab members: a pink-haired assistant, a black-haired maid, a beige-haired maid and a scientist with glasses. Cute chibi comedy style. Adults. No text.',
    'p5_haru_loop_keys': 'Same image, keep the same framing. Change only: in the fourth pose Haru also jumps up with both arms raised, a completely different pose from the first. Still no text.',
    'p6_f1_fixed': 'Same image, keep the same framing. Change only: remove the cup from her head; she simply stands holding the cup in her hands, smiling. Still no text.',
    'p6_f7_fixed': 'Same scene. Change only: merge the three moments into ONE single panel where the ball hits, he screams and the glasses fly away all at the same instant. Still no text.',
}

# 영상(이미지→영상) 프롬프트
VIDEO = {
    'p3_sia_jump_keys': 'Use the attached image of Sia standing as the first frame. 3-second animation, SD comedy style, fixed camera, plain white background: she first crouches down deeply for a short moment, then jumps up high with arms raised, then lands softly bending her knees and returns to standing. Keep her face, hair and outfit exactly the same. No text.',
    'p3_doctor_bounce_keys': 'Use the attached image as the first frame. 3-second animation, fixed camera, plain white background: a pink rubber ball falls, stretching thinner, squashes wider on the Professor\'s head (same volume, never grows), bounces away; the Professor freezes with a blank face for about one second, then his glasses pop up. No text.',
    'p5_haru_loop_keys': 'Use the attached image of Haru with her head upright as both the first and the last frame. 2-second seamless loop, fixed camera, plain white background: she bobs her head to the left, back to center, to the right, back to center, in a steady rhythm. The last frame must match the first frame so it loops smoothly. No text.',
}

# ---------------------------------------------------------------- 연습 과제 그림
DRILLS = {
    'd1_haru_hot': (['haru_anime_base', 'haru_sheet'], body('wide 16:9', SD,
        HARU + ', chest up, has just sipped very hot coffee. Expectation: a relaxing coffee break (a steaming mug in her hand). Result: "too hot!" — exaggerate ONLY her mouth to about twice the normal size, tongue out; eyes, eyebrows and hair stay normal size. One emotion symbol only: a single small steam puff from her mouth.')),
    'd2_sia_lookup': (['sia_anime_base', 'sia_sheet'], body('wide 16:9', SD,
        SIA + ', head tilted back about 30 degrees looking up at the ceiling, seen from slightly below: chin raised, underside of the jaw visible, ears lower than the eyes, the eye line curving upward like an arch. A single drop of water is falling from the ceiling right toward her forehead. Her face is completely blank and calm (deadpan): flat line eyes, tiny dot mouth.')),
    'd3_moa_squash': (['moa_anime_base', 'moa_sheet'], body('wide 16:9, two frames side by side', SD,
        'LEFT: ' + MOA + ', startled, her whole face and head stretched upward tall and thinner (cheeks narrower) like a squash-and-stretch cartoon. RIGHT: the same Moa a moment later, her face squashed down shorter and wider (cheeks puffed out). The head keeps the same overall size (same volume) in both frames.')),
    'd4_lab_zoomout': (['moa_anime_base', 'moa_sheet', 'jupanbot_ref_genspark_v0'], body('wide 16:9, two panels side by side separated by a white gutter', SD,
        'Panel 1: tight close-up of ' + MOA + ' peacefully reading a book with a calm smile; plain quiet background, nothing else visible. Panel 2: same moment, zoomed far out: right next to Moa, ' + BOT + ' is wildly playing a big drum set with motion lines, while Moa keeps reading calmly.')),
    'd5_doctor_sticker': (['doctor_sheet'], body('square 1:1 sticker', SD,
        DOC + ', chest up, deadpan reaction sticker: completely blank face, flat line eyes behind his teal glasses, tiny dot mouth, and ONE emotion symbol only — three vertical gloom lines above his head. White outline around the character like a sticker.')),
    'd6_moa_ribbon_fix': (['moa_anime_base', 'moa_sheet'], 'Inpainting request (부분 수정): paint the mask only over Moa\'s hair area above BOTH ears, then use this text:\n'
        'White frilled maid headband with a single white ribbon over her LEFT ear (the left side of her own head, which appears on the right side of the picture when she faces the viewer). No ribbon over the right ear. Keep everything else unchanged. No text.'),
}


def prompt_of(name):
    return A[name][3]


def drill_prompt(name):
    return DRILLS[name][1]


def ext_refs(lst):
    return ', '.join('refs/%s.png' % r for r in lst)


INTRO_BODY = ('```\n웹페이지 본문에 넣을 설명 그림을 한 장씩 차례로 만들어 줘.\n- 첨부한 참고 그림의 캐릭터를 같은 외형으로 그릴 것(머리 모양·색·장식)\n'
              '- 머리를 크게 그리는 꼬마 체형(SD)이라도 모두 성인 캐릭터로, 어린아이처럼 보이지 않게\n- 그림 안에 글자·숫자·로고 금지(빈 말풍선은 허용)\n아래 영어 프롬프트를 하나씩 써 줘.\n```\n')
INTRO_COVER = ('```\n웹페이지 맨 위에 거는 표지 그림을 한 장씩 차례로 만들어 줘.\n- 비율 16:9, 가로 1920px 이상\n- 그림체는 반드시 16비트 RPG풍 픽셀아트 (네모 픽셀이 보이게, 매끈한 일러스트·벡터·수채화·3D 금지)\n'
               '- 첨부한 참고 이미지의 캐릭터를 같은 외형으로 그릴 것\n- 그림 안에 글자·숫자·로고 금지\n- 얼굴과 손은 가장자리에서 떨어진 가운데 영역에, 왼쪽 아래 구석은 밝고 단순하게\n아래 영어 프롬프트를 하나씩 써 줘.\n```\n')


def write_bundle():
    from content_make import MAKE, DRILL
    alt = {}
    for k, lst in MAKE.items():
        for m in lst:
            alt[m['img']] = (m['alt'], m['balt'], k)
    dalt = {d['img']: d['alt'] for lst in DRILL.values() for d in lst}
    from content_b import FAILS as F6
    falt = {f['id'] + '_fail': f['alt'] for f in F6}

    D1 = os.path.join(ROOT, 'docs', 'image_requests')
    D2 = os.path.join(ROOT, 'docs', 'image_requests_make')
    D3 = os.path.join(ROOT, 'docs', 'image_requests_drill')
    for d in (D1, D2, D3):
        shutil.rmtree(d, ignore_errors=True)
        os.makedirs(os.path.join(d, 'prompts'))

    rows1 = []
    convs = [('C01_covers_A', COVERS[:4], 'refs 전부'), ('C02_covers_B', COVERS[4:], 'refs 전부 + C01의 cover_index')]
    for cid, items, att in convs:
        t = '# %s · 표지 (픽셀아트, 16:9) — %s\n\n**첨부:** %s\n\n**Genspark에 먼저 붙여 넣기 ↓**\n%s' % (cid, ', '.join(x[0] for x in items), att, INTRO_COVER)
        for i, (nm, part, a, p) in enumerate(items):
            t += '\n---\n## %d) %s — %s\nalt: %s\n```\n%s\n```\n' % (i + 1, nm, part, a, p)
            rows1.append((len(rows1) + 1, cid, nm, part, '16:9', 'pixel'))
        open(os.path.join(D1, 'prompts', cid + '.md'), 'w').write(t)
    groups = [('C03_part1_2', ['p1_haru_sd_compare', 'p1_haru_exag_eyes', 'p2_moa_lookup_styles', 'p2_moa_deadpan']),
              ('C04_part3_4', ['p3_sia_jump_keys', 'p3_doctor_bounce_keys', 'p4_comic_cake', 'p4_comic_three']),
              ('C05_part5_6', ['p5_lab_reaction_sheet', 'p5_haru_loop_keys', 'p6_f1_fixed', 'p6_f7_fixed'])]
    for cid, names in groups:
        refs = sorted(set(r for n in names for r in A[n][2]))
        t = '# %s · 본문 그림 (16:9) — %s\n\n**첨부:** %s\n\n**Genspark에 먼저 붙여 넣기 ↓**\n%s' % (cid, ', '.join(names), ext_refs(refs), INTRO_BODY)
        for i, n in enumerate(names):
            t += '\n---\n## %d) %s\nalt: %s\n첨부: %s\n```\n%s\n```\n' % (i + 1, n, alt[n][0], ext_refs(A[n][2]), A[n][3])
            if n in VIDEO:
                t += '\n(선택) 이미지→영상 — 받은 그림을 첨부하고:\n```\n%s\n```\n' % VIDEO[n]
            rows1.append((len(rows1) + 1, cid, n, alt[n][2], '16:9', 'SD/anime'))
        open(os.path.join(D1, 'prompts', cid + '.md'), 'w').write(t)
    fg = [('C06_fail_A', ['f1_fail', 'f2_fail', 'f3_fail', 'f4_fail']), ('C07_fail_B', ['f5_fail', 'f6_fail', 'f7_fail', 'f8_fail'])]
    for cid, names in fg:
        refs = sorted(set(r for n in names for r in FAILP[n]))
        t = ('# %s · 의도적 실패 그림 (세로 2:3) — %s\n\n**첨부:** %s\n\n**Genspark에 먼저 붙여 넣기 ↓**\n%s\n'
             '> 실패를 일부러 그리는 요청입니다. 도구가 실수를 고쳐 그리면 두 번까지만 다시 시도하고, 그래도 안 되면 그대로 주세요.\n') % (cid, ', '.join(names), ext_refs(refs), INTRO_BODY)
        for i, n in enumerate(names):
            t += '\n---\n## %d) %s\nalt: %s\n```\n%s\n```\n' % (i + 1, n, falt[n], FAILS[n])
            rows1.append((len(rows1) + 1, cid, n, '06_failure_lab.html#' + n.split('_')[0], '2:3', 'SD/anime'))
        open(os.path.join(D1, 'prompts', cid + '.md'), 'w').write(t)
    with open(os.path.join(D1, 'checklist.csv'), 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['order', 'conversation', 'file', 'page', 'ratio', 'style', 'status'])
        for r in rows1:
            w.writerow(list(r) + ['todo'])
    open(os.path.join(D1, 'README.md'), 'w').write(README1 % len(rows1))

    rows2 = []
    for k, lst in MAKE.items():
        cid = 'M0%s_part%s' % (k[1], k[1])
        t = '# %s · 비교 그림(B)\n\n**A 결과를 먼저 받은 뒤**, A를 만든 대화에 이어서 아래 문장을 붙여 넣습니다.\n' % cid
        for m in lst:
            n = m['img']
            t += '\n---\n## %s_b\nalt: %s\n```\n%s\n```\n' % (n, m['balt'], B[n])
            rows2.append((len(rows2) + 1, cid, n + '_b', MAKE_PAGE[k] + '#make', '16:9', 'A 대화에 이어서 Change only'))
        open(os.path.join(D2, 'prompts', cid + '.md'), 'w').write(t)
    with open(os.path.join(D2, 'checklist.csv'), 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['order', 'conversation', 'file', 'page', 'ratio', 'how', 'status'])
        for r in rows2:
            w.writerow(list(r) + ['todo'])
    open(os.path.join(D2, 'README.md'), 'w').write(README2 % len(rows2))

    rows3 = []
    t = '# D01 · 연습 과제 예상 결과 (6장)\n\n과제마다 **새 대화**에서 만듭니다. d6은 부분 수정(영역 칠하기) 기능으로 합니다(원본은 실패 그림 f8의 한 컷).\n'
    for n, (refs, p) in DRILLS.items():
        t += '\n---\n## %s\nalt: %s\n첨부: %s\n```\n%s\n```\n' % (n, dalt[n], ext_refs(refs), p)
        rows3.append((len(rows3) + 1, 'D01', n, '', '16:9' if n != 'd5_doctor_sticker' else '1:1', 'new conversation'))
    open(os.path.join(D3, 'prompts', 'D01_drills.md'), 'w').write(t)
    with open(os.path.join(D3, 'checklist.csv'), 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['order', 'conversation', 'file', 'page', 'ratio', 'how', 'status'])
        for r in rows3:
            w.writerow(list(r) + ['todo'])
    open(os.path.join(D3, 'README.md'), 'w').write('# 그림 요청 꾸러미 3 — 연습 과제 예상 결과 (%d장)\n\n각 부 \'프롬프트 연습 과제\'의 예상 결과 그림입니다. 과제 프롬프트를 **새 대화**에서 그대로 넣어 만듭니다. 받으면 `checklist.csv` 이름 그대로 주세요.\n' % len(rows3))

    zp = os.path.join(ROOT, 'docs', '구조먼저그리기연구실_웃음편_그림요청_전체.zip')
    with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
        for sub, d in (('1_본문_표지_실패_%d장' % len(rows1), D1), ('2_비교그림_%d장' % len(rows2), D2), ('3_연습과제_%d장' % len(rows3), D3)):
            for dp, dn, fn in os.walk(d):
                for f in fn:
                    full = os.path.join(dp, f)
                    z.write(full, os.path.join(sub, os.path.relpath(full, d)))
        for r in sorted(os.listdir(os.path.join(ROOT, 'assets', 'refs'))):
            z.write(os.path.join(ROOT, 'assets', 'refs', r), os.path.join('refs', r))
    return len(rows1), len(rows2), len(rows3)


MAKE_PAGE = {'p1': '01_exaggeration.html', 'p2': '02_reaction.html', 'p3': '03_motion.html', 'p4': '04_comic.html', 'p5': '05_ai_fun.html', 'p6': '06_failure_lab.html'}

README1 = '''# 그림 요청 꾸러미 1 — 표지·본문·실패 그림 (%d장)

저장소: `adminmrobo/drawing_lab_fun` (페이지는 완성 — 그림 자리는 '그림 준비 중'으로 비어 있음)
만드는 도구: Genspark 이미지(움직이는 그림은 Genspark 영상 등 이미지→영상 기능, 선택)

## 1. 그림 규칙
| 항목 | 규칙 |
|---|---|
| 그림체 | **표지 8장은 16비트 픽셀아트**. **본문 그림은 SD(약 2.5등신) 개그 애니풍**, 비교용으로 애니풍·반실사 일부 |
| 배경 | 흰색·밝은 낮 분위기 |
| 캐릭터 고정값 | 하루: 정수리 번 2개 + 앞머리 가운데 남색 줄 / 시아: 흑발·머리 장식 없음 / 모아: 흰 프릴 머리띠 + **왼쪽** 귀 위 흰 리본 / 박사: 흰 줄 있는 짙은 머리, 굵은 눈썹, 청록 사각 안경 |
| 나이 | 모두 20대 성인(박사는 30대 성인 남성). **SD로 그려도 어린아이처럼 보이면 다시 생성** |
| 글자 | 그림 안에 글자·숫자·로고 금지(빈 말풍선은 허용) |
| 웃음 | 다치거나 누군가를 깎아내리는 장면 금지. 페인트·공·케이크처럼 다치지 않는 소품만 |

## 2. 요청 순서 (Genspark 대화 하나 = 파일 하나)
| 순서 | 파일 | 그림 수 | 비율 |
|---|---|---|---|
| 1 | `prompts/C01_covers_A.md` | 4 | 16:9 픽셀 |
| 2 | `prompts/C02_covers_B.md` | 4 | 16:9 픽셀 |
| 3 | `prompts/C03_part1_2.md` | 4 | 16:9 |
| 4 | `prompts/C04_part3_4.md` | 4 (+ 영상 2, 선택) | 16:9 |
| 5 | `prompts/C05_part5_6.md` | 4 (+ 영상 1, 선택) | 16:9 |
| 6 | `prompts/C06_fail_A.md` | 4 | 2:3 |
| 7 | `prompts/C07_fail_B.md` | 4 | 2:3 |

## 3. 저장 이름
`checklist.csv`의 `file` 열 이름 그대로(png·jpg, 영상은 mp4). 받으면 WebP로 바꿔 `assets/img/`에 넣습니다(표지 원래 격자의 정수배, 가로 1200×675, 세로 600×900).

## 4. 실패 그림 주의
도구가 실수를 자동으로 고쳐 그리면 두 번까지만 다시 시도해 주세요. 그래도 안 되면 그대로 주셔도 됩니다(페이지에서 '결과는 매번 다르다'는 사례로 설명합니다).
'''
README2 = '''# 그림 요청 꾸러미 2 — '프롬프트로 직접 만들어 보기' 비교 그림 (%d장)

부마다 '직접 만들어 보기' 실습의 **B 결과**(원리를 빼거나 바꾼 비교 그림)입니다. **꾸러미 1의 A 결과를 먼저 받은 뒤**, A를 만든 대화에 이어서 요청합니다.

- 'Change only' 문장만 바꾸고 나머지(캐릭터·구도·빛)는 A와 같아야 비교가 됩니다. 구도가 흔들리면 'keep the same framing'을 덧붙입니다.
- p5_lab_reaction_sheet_b만 **새 대화에서 참고 그림 없이** 만듭니다(일관성이 무너지는 모습 비교용).
- 비교 그림이 A와 거의 같게 나오면 새 대화에서 처음부터 한 번 더 시도해 주세요. 그래도 같으면 그대로 주셔도 됩니다.
'''

if __name__ == '__main__':
    import sys
    sys.path.insert(0, os.path.dirname(__file__))
    print('requests:', write_bundle())

# -*- coding: utf-8 -*-
"""구조 먼저 그리기 연구실 · 웃음 편 — 페이지 빌드
python3 build/build.py  → index.html, 01~06_*.html, practice/index.html, assets/panels.js
"""
import json, os, html, sys
sys.path.insert(0, os.path.dirname(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
from content_meta import SITE, CH, REFS, PARTS_ORDER, ABBR
from content_a import PART1, PART2, PART3
from content_b import PART4, PART5, PART6
from content_make import MAKE, DRILL, ALT
from content_index import INDEX, PRACTICE

PARTS = {p['key']: p for p in [PART1, PART2, PART3, PART4, PART5, PART6]}
E = html.escape


def img_exists(name):
    return os.path.exists(os.path.join(ROOT, 'assets', 'img', name + '.webp'))


def chimg(who, expr, root, size=96):
    nm, base, col = CH[who]
    f = '%s_%s.webp' % (base, expr)
    assert os.path.exists(os.path.join(ROOT, 'assets', 'chars', f)), f
    return '<img src="%sassets/chars/%s" alt="%s" width="%d" height="%d" loading="lazy">' % (root, f, nm, size, size)


RIGHT = {'haru', 'asst', 'sia', 'moa'}


def talk(lines, root=''):
    out = []
    for ln in lines:
        who, expr, text = ln[0], ln[1], ln[2]
        nm, base, col = CH[who]
        r = ' r' if who in RIGHT else ''
        out.append('<div class="line%s">%s<div class="bub"><b style="color:var(%s)">%s</b>%s</div></div>' % (r, chimg(who, expr, root), col, nm, text))
    return '<div class="talk">' + ''.join(out) + '</div>'


def figure(name, alt, root='', cap=None, tall=False, ratio='16/9'):
    cls = 'art tall' if tall else 'art '
    if img_exists(name):
        return '<figure class="%s" data-img="%s"><img src="%sassets/img/%s.webp" alt="%s" loading="lazy" decoding="async"><figcaption>%s</figcaption></figure>' % (cls, name, root, name, E(alt), E(cap or alt))
    return ('<figure class="%s" data-img="%s"><div class="ph-art" style="--ar:%s" role="img" aria-label="%s"><b>그림 준비 중</b><span>%s</span><span class="hint">파일 이름 %s · 요청문은 저장소 docs/image_requests</span></div><figcaption>%s</figcaption></figure>'
            % (cls, name, ratio, E(alt), E(alt), name, E(cap or alt)))


def cover(name, alt, cast, root=''):
    if img_exists(name):
        return '<div class="cover"><div class="frame" data-img="%s"><img class="art" src="%sassets/img/%s.webp" alt="%s" width="1600" height="900" fetchpriority="high" decoding="async"></div></div>' % (name, root, name, E(alt))
    imgs = ''.join('<img%s src="%sassets/chars/%s.webp" alt="">' % (' class="s"' if c.startswith(('fruitfly', 'jupanbot', 'x')) else '', root, c) for c in cast)
    return ('<div class="cover"><div class="frame" data-img="%s" role="img" aria-label="%s"><svg class="grid" viewBox="0 0 160 90" preserveAspectRatio="none" aria-hidden="true">'
            '<defs><pattern id="g" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M8 0H0V8" fill="none" stroke="#eef2f6" stroke-width=".5"/></pattern></defs><rect width="160" height="90" fill="url(#g)"/></svg>'
            '<span class="cap">%s</span><span class="badge">픽셀 표지 준비 중</span><div class="cast">%s</div></div></div>') % (name, E(alt), E(alt), imgs)


def head(title, desc, og, url, root=''):
    return f'''<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<meta property="og:type" content="article"><meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(desc)}">
<meta property="og:image" content="{SITE['url']}assets/og/{og}.jpg"><meta property="og:url" content="{SITE['url']}{url}"><meta name="twitter:card" content="summary_large_image">
<meta name="author" content="안상선">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{root}assets/lab.css">
</head>
<body data-root="{root}">
<div id="prog"></div>
'''


def nav(links, root=''):
    a = ''.join('<a href="%s">%s</a>' % (h, t) for h, t in links)
    return '<nav class="top"><div class="row"><a class="logo" href="%sindex.html">구조 먼저 그리기 <i>· 웃음 편</i></a><div class="links">%s</div></div></nav>\n' % (root, a)


def byline():
    return '<p class="byline">글 · 안상선 ((주)M-Robo 대표) · <a href="https://adminmrobo.github.io/who_am_i/who_am_i.html">저자 소개</a> · %s · %s</p>' % (SITE['date'], SITE['version'])


def three(t, root=''):
    w, y, u = t
    ab = ''.join('<dt>%s</dt><dd>%s</dd>' % (k, ABBR[k]) for k in t.abbr) if hasattr(t, 'abbr') else ''
    return w, y, u


def three_box(p):
    w, y, u = p['three']
    ab = ''.join('<dt>%s</dt><dd>%s</dd>' % (k, ABBR[k]) for k in p['abbr'])
    return ('<section><div class="wrap"><div class="three"><h2>처음 오신 분께 — 세 줄 요약</h2><ul>'
            '<li><b>무엇을</b>: %s</li><li><b>왜 알아야 하나</b>: %s</li><li><b>어디에 쓰나</b>: %s</li></ul>'
            '<p>그림 실력·코드·수식을 몰라도 됩니다. 실험을 눌러 보며 따라오세요.</p>'
            '<details class="abbr"><summary>낱말·약어 풀이 (펼치기)</summary><dl>%s</dl></details></div>\n</div></section>\n') % (w, y, u, ab)


def flowgrid(cur=None, root=''):
    a = []
    for k in PARTS_ORDER:
        f, n, t = k
        st = ' style="border-color:var(--orange);background:var(--orange-soft)"' if cur == f else ''
        a.append('<a href="%s%s"%s><b>%s</b>%s</a>' % (root, f, st, n, t))
    return '<div class="flowgrid" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr));margin-top:16px">%s</div>' % ''.join(a)


def mathbox(m):
    tries = ''.join('<div>%s</div>' % x for x in m['try'])
    parts = ''.join('<tr><td class="m">%s</td><td>%s</td></tr>' % (a, b) for a, b in m['parts'])
    return ('<div class="box mathbox"><h4>수식이 어려운 조수가 대신 묻습니다</h4>'
            '<div class="q">%s<div><b>조수</b> %s</div></div>'
            '<div class="easy"><b>말로 하면</b> — %s</div>'
            '<div class="try"><b>숫자로 한 번 해 보기</b>%s</div>'
            '<p><b>학교 수학으로 보면</b> — %s</p>'
            '<div class="fx">%s</div>'
            '<table><thead><tr><th>식 조각</th><th>뜻</th></tr></thead><tbody>%s</tbody></table>'
            '<div class="q">%s<div><b>조수</b> %s</div></div></div>') % (
        chimg('asst', 'e04', ''), m['q'], m['say'], tries, m['school'], m['f'], parts, chimg('asst', 'e10', ''), m['end'])


def whybox(w):
    return ('<div class="box why"><h4>왜 이렇게 하나</h4><ol><li><b>무엇이 문제인가</b> — %s</li><li><b>그냥 하면 막히는 곳</b> — %s</li><li><b>이렇게 푼다</b> — %s</li></ol>'
            '<div class="easy"><b>쉽게 말하면</b> — %s</div></div>') % w


def quizbox(q):
    opts = ''.join('<button type="button">%s</button>' % o for o in q['o'])
    return ('<div class="quiz" data-ans="%d"><div class="qq">확인 퀴즈 — %s</div><div class="opts">%s</div><div class="fb" aria-live="polite"></div>'
            '<span class="qok" hidden>%s</span><span class="qno" hidden>%s</span></div>') % (q['a'], q['q'], opts, q['ok'], q['no'])


def panel(pn):
    return ('<div class="panel"><div class="ph"><b>%s</b><small>%s</small></div><div id="pp-%s" data-panel="%s"></div><div class="ctrl">%s</div><div class="readout" aria-live="polite"></div></div>'
            % (pn['label'], pn['note'], pn['id'], pn['id'], pn['ctrl']))


def step(p, i, s):
    n = p['num']
    h = ['<section class="room" id="%s"><div class="wrap">' % s['id'], '<div class="roomno">%d부 · %d단계</div>' % (n, i + 1)]
    h.append('<h2>%s</h2><p class="muted">%s</p>' % (s['title'], s['sub']))
    h.append('<div class="tags"><span class="tag how">방법: %s</span><span class="tag day">일상: %s</span></div>' % (s['how'], s['day']))
    if s.get('math'):
        h.append('<div class="duo">%s%s</div>' % (whybox(s['why']), mathbox(s['math'])))
        h.append(talk([('doc', 'e08', '여기서 한 번 멈춰도 괜찮아요. 식이 낯설면 건너뛰고 아래 실험부터 눌러 보세요. 숫자는 실험이 대신 계산해 줍니다.')]))
    else:
        h.append('<div style="margin:16px 0">%s</div>' % whybox(s['why']))
    h.append('<div class="pair"><div class="box"><h4>일상으로 치면</h4><p>%s</p></div><div class="box ml"><h4>그림·애니메이션 현장에서는</h4><p>%s</p></div></div>' % (s['daily'], s['field']))
    h.append(talk(s['talk']))
    h.append(panel(s['panel']))
    h.append('<div class="solve"><h4>풀이</h4>%s</div>' % ''.join('<p>%s</p>' % x for x in s['solve']))
    if s.get('img'):
        h.append(figure(s['img'][0], ALT.get(s['img'][0], s['img'][1])))
    h.append('<div class="solve"><h4>AI 결과, 그대로 써도 될까?</h4><p>%s</p><details class="code"><summary>답 보기</summary><p>%s</p></details></div>' % s['ai'])
    h.append('<div class="limit"><b>주의할 점</b> — %s</div>' % s['limit'])
    h.append(quizbox(s['quiz']))
    h.append('</div></section>')
    return '\n'.join(h)


REFLINKS = ['haru_anime_base', 'sia_anime_base', 'moa_anime_base', 'haru_sheet', 'sia_sheet', 'moa_sheet', 'doctor_sheet', 'fruitfly_sprites_6', 'jupanbot_ref_genspark_v0', 'pixel_style_ref_prev_cover']


def make_section(p):
    n = p['num']
    from make_requests import prompt_of
    h = ['<section class="room" id="make"><div class="wrap"><div class="roomno">%d부 · 직접 만들기</div><h2>프롬프트로 직접 만들어 보기</h2>' % n]
    h.append('<div class="box"><p>이 부에서 배운 원리를 그림 생성 AI(Genspark 등)로 직접 확인합니다. <b>A</b>는 이 페이지 그림을 실제로 만든 프롬프트, <b>B</b>는 원리를 하나 빼거나 바꾼 비교용 문장입니다.</p>'
             '<ol style="margin:6px 0 0;padding-left:20px"><li>새 대화를 열고 아래 \'첨부\'에 적힌 참고 그림을 올립니다.</li><li>A를 붙여 넣어 만들고, 확인표로 결과를 점검합니다.</li>'
             '<li>같은 대화에 B를 이어 붙여 다시 만들고, A 결과와 나란히 비교합니다. 구도가 흔들리면 \'keep the same framing\'을 덧붙입니다.</li><li>같은 대화에서 차이가 약하면 새 대화에서 처음부터 만들어 보세요. 결과는 매번 다릅니다.</li></ol>'
             '<p class="hint" style="margin-top:8px">참고 그림 내려받기: %s</p></div>' % ' · '.join('<a href="assets/refs/%s.png" download>%s</a>' % (r, r) for r in REFLINKS))
    for j, m in enumerate(MAKE[p['key']]):
        A = prompt_of(m['img'])
        h.append('<div class="failcard" id="make%d"><h3>실습 %d · %s</h3><p>%s</p>' % (j + 1, j + 1, m['title'], m['desc']))
        h.append('<div class="pair"><div class="promptbox"><b>A — 이 페이지 그림을 실제로 만든 프롬프트</b><p class="hint">첨부: %s</p><pre>%s</pre><button type="button" class="btn copy">복사하기</button></div><div>%s</div></div>'
                 % (', '.join('refs/%s.png' % r for r in m['refs']), E(A), figure(m['img'], m['alt'], cap='A 결과 — Genspark로 만든 그림')))
        h.append('<div class="pair"><div class="promptbox"><b>B — %s</b><pre>%s</pre><button type="button" class="btn copy">복사하기</button></div><div>%s</div></div>'
                 % (m['btitle'], E(m['b']), figure(m['img'] + '_b', m['balt'])))
        h.append('<h4>결과에서 확인할 것</h4><ol>%s</ol>' % ''.join('<li>%s <a href="#%s">원리 보기</a></li>' % (c, a) for c, a in m['check']))
        if m.get('video'):
            h.append('<div class="promptbox"><b>더 해 보기 — 움직이는 그림으로(영상 AI)</b><p class="hint">A 결과 그림을 첨부하고 이미지→영상 기능에 넣습니다. 길이 2~4초, 처음과 끝 장면이 같으면 반복 재생이 매끄럽습니다.</p><pre>%s</pre><button type="button" class="btn copy">복사하기</button></div>' % E(m['video']))
        h.append('<p style="background:#fff7ec;border-left:4px solid var(--orange);padding:8px 12px;border-radius:6px">실제 결과: %s</p></div>' % m.get('res', '아직 만들지 않았습니다. 그림을 받으면 A·B를 나란히 보고 실제로 달라진 곳(또는 달라지지 않은 곳)을 이 자리에 적습니다.'))
    h.append('</div></section>')
    return '\n'.join(h)


def drill_section(p):
    n = p['num']
    from make_requests import drill_prompt
    h = ['<section class="room" id="drill"><div class="wrap"><div class="roomno">%d부 · 연습 과제</div><h2>프롬프트 연습 과제</h2>' % n,
         '<div class="box"><p>이 부의 원리를 내 손으로 프롬프트에 옮겨 보는 과제입니다. <b>목표 → 순서 → 넣을 프롬프트 → 확인할 것 → 예상 결과 → 자주 생기는 문제</b> 순서로 적었습니다. 결과는 매번 조금씩 다르니, 그림이 똑같지 않아도 \'확인할 것\'이 맞으면 성공입니다.</p></div>']
    for j, d in enumerate(DRILL[p['key']]):
        h.append('<div class="failcard" id="d%d"><h3>연습 %d · %s</h3>' % (j + 1, j + 1, d['title']))
        h.append('<p><span class="chip">목표</span>%s</p><p><span class="chip">왜 이 연습인가</span>%s</p>' % (d['goal'], d['why']))
        h.append('<p class="hint">첨부할 참고 그림: %s — 참고 그림은 위 <a href="#make">직접 만들어 보기</a>에서 내려받을 수 있습니다.</p>' % ', '.join('refs/%s.png' % r for r in d['refs']))
        h.append('<h4>순서</h4><ol>%s</ol>' % ''.join('<li>%s</li>' % x for x in d['steps']))
        h.append('<h4>넣을 프롬프트와 예상 결과</h4><div class="pair"><div class="promptbox"><b>넣을 프롬프트</b><pre>%s</pre><button type="button" class="btn copy">복사하기</button></div><div>%s</div></div>'
                 % (E(drill_prompt(d['img'])), figure(d['img'], d['alt'], cap='예상 결과 — 위 프롬프트로 실제로 만든 그림')))
        h.append('<h4>확인할 것</h4><ol>%s</ol>' % ''.join('<li>%s <a href="#%s">원리 보기</a></li>' % (c, a) for c, a in d['check']))
        h.append('<p><span class="chip">예상 결과</span>%s</p>' % d['expect'])
        h.append('<h4>자주 생기는 문제와 대처</h4><div class="tbl"><table><thead><tr><th>문제</th><th>대처</th></tr></thead><tbody>%s</tbody></table></div>' % ''.join('<tr><td>%s</td><td>%s</td></tr>' % x for x in d['trouble']))
        if d.get('real'):
            h.append('<p style="background:#fff7ec;border-left:4px solid var(--orange);padding:8px 12px;border-radius:6px">실제 결과: %s</p>' % d['real'])
        h.append('<p><span class="chip">더 해 보기</span>%s</p></div>' % d['more'])
    h.append('</div></section>')
    return '\n'.join(h)


def judge(p):
    j = p['judge']
    rows = j['rows']
    bars = ''.join('<span>%s</span><span class="bar" title="주판봇 %d"><i style="width:%d%%"></i></span><span class="bar" title="초파리 %d"><i style="width:%d%%;background:var(--teal)"></i></span>' % (r[0], r[1], r[1] * 10, r[2], r[2] * 10) for r in rows)
    tr = ''.join('<tr><td>%s</td><td>%d</td><td>%d</td></tr>' % r for r in rows)
    s1, s2 = sum(r[1] for r in rows), sum(r[2] for r in rows)
    h = ['<section class="room" id="judge"><div class="wrap"><div class="roomno">평가단 채점</div><h2>%d부 평가 — %s</h2>' % (p['num'], j['title'])]
    h.append(talk(j['open']))
    h.append('<div class="judge"><h4>평가단 X1·X2·X3 채점</h4><div class="score"><span></span><b>주판봇</b><b>초파리</b>%s</div>' % bars)
    h.append('<div class="tbl" style="margin-top:10px"><table><thead><tr><th>항목</th><th>주판봇</th><th>초파리</th></tr></thead><tbody>%s<tr><th>합계</th><th>%d</th><th>%d</th></tr></tbody></table></div>' % (tr, s1, s2))
    h.append(talk(j['x']) + '</div>')
    close = [(w, e, t.replace('{A}', str(s2)).replace('{B}', str(s1))) for w, e, t in j['close']]
    h.append(talk(close))
    h.append('<p class="hint">점수는 이야기 속 예시입니다. 실제 그림을 평가한 값이 아닙니다.</p></div></section>')
    return '\n'.join(h)


def kg_block(p, root=''):
    page = p['file']
    nodes = []
    for (nid, typ, ko, en, anchor, d) in p['kg']:
        nodes.append({'id': nid, 'type': typ, 'label': {'ko': ko, 'en': en}, 'page': page, 'anchor': anchor, 'definition': {'ko': d}, 'source': 'lab:work/drawing_lab_fun'})
    edges = [{'s': a, 'p': b, 'o': c} for a, b, c in p['edges']]
    K = {'version': '1.3', 'page': page.replace('.html', '').replace('/', '_'), 'series': SITE['title'], 'nodes': nodes, 'edges': edges}
    ld = {'@context': {'@vocab': 'urn:lab:', 'skos': 'http://www.w3.org/2004/02/skos/core#', 'schema': 'https://schema.org/'},
          '@graph': [{'@id': 'urn:' + n['id'], '@type': n['type'], 'skos:prefLabel': [{'@value': n['label']['ko'], '@language': 'ko'}, {'@value': n['label']['en'], '@language': 'en'}],
                      'skos:definition': n['definition']['ko'], 'schema:url': SITE['url'] + page + n['anchor']} for n in nodes]}
    refs = [REFS[k] | {'id': k} for k in p['refs']]
    meta = {'title': K['page'], 'series': SITE['title'], 'creator': [{'name': '안상선', 'role': 'author', 'affiliation': '(주)M-Robo'}], 'date': SITE['date'], 'version': SITE['version'], 'license': '캐릭터·그림 무단 사용 금지'}
    j = lambda o: json.dumps(o, ensure_ascii=False).replace('</', '<\\/')
    return ('<section id="kg"><div class="wrap"><h2>지식 색인 — 이 페이지의 낱말 찾기</h2>\n<p class="muted">이 페이지에 나온 개념·방법·비유·쓰임을 모았습니다. 검색하고, "설명 보러 가기"로 본문에 돌아갑니다.</p><div id="kg-mount"></div></div></section>\n'
            '<section id="export"><div class="wrap"><h2>온톨로지·서지 꾸러미 내려받기</h2>\n<p class="muted">지식 색인을 출처와 함께 파일로 내려받습니다. 서지 관리는 BibTeX·RIS, 온톨로지 편집은 Turtle, 그래프 도구는 CSV, 여러 페이지 합치기는 kg.json입니다.</p><div id="export-mount"></div></div></section>\n'
            '<script type="application/json" id="kg-raw">%s</script>\n<script type="application/ld+json" id="kg-ld">%s</script>\n<script type="application/json" id="refs-csl">%s</script>\n<script type="application/json" id="page-meta">%s</script>\n'
            % (j(K), j(ld), j(refs), j(meta)))


def footer(p, root=''):
    rows = ''.join('<tr><td>[%d]</td><td>%s (%s). %s</td><td>%s</td></tr>' % (i + 1, REFS[k]['author'], REFS[k]['year'], REFS[k]['title'], REFS[k]['note']) for i, k in enumerate(p['refs']))
    links = ' · '.join('<a href="%s%s">%s</a>' % (root, f, n) for f, n, t in PARTS_ORDER)
    return ('<footer><div class="wrap">\n<h3>출처·참고</h3>\n<div class="tbl"><table><thead><tr><th>#</th><th>자료</th><th>어디에 썼나</th></tr></thead><tbody>%s</tbody></table></div>\n'
            '<h3>예시값·설명용 숫자</h3>\n<p>%s</p>\n'
            '<p>등장인물은 모두 성인 연구원입니다(하루·시아·모아는 20대, 박사는 30대 성인 남성). 머리를 크게 그리는 꼬마 체형(SD)은 개그 그림체일 뿐 인물의 나이와 상관없습니다. 웃음은 사람을 깎아내리지 않는 쪽으로 만듭니다. 다른 작품의 캐릭터·실존 인물을 닮은 그림은 만들지 않습니다.</p>\n'
            '<p>캐릭터 이름·설정·그림은 저작권자 안상선의 허락 없이 사용할 수 없습니다. 캐릭터 그림: <a href="https://github.com/adminmrobo/fruitfly-lab-expressions">fruitfly-lab-expressions</a>.</p>\n'
            '<p>글 · 안상선 ((주)M-Robo 대표) · <a href="https://adminmrobo.github.io/who_am_i/who_am_i.html">저자 소개</a> · %s · %s</p>\n'
            '<p><a href="%sindex.html">목차</a> · %s · <a href="https://github.com/adminmrobo/drawing_lab_fun">저장소</a></p>\n</div></footer>\n<script src="%sassets/panels.js"></script>\n</body></html>\n'
            % (rows, SITE['example_note'], SITE['date'], SITE['version'], root, links, root))


def fails_section(p):
    h = ['<section class="room" id="fails"><div class="wrap"><div class="roomno">6부 · 2단계</div><h2>안 웃긴 그림 8종 진단</h2><p class="muted">그림마다 증상을 보고 처음 걸리는 점검 항목을 고른 뒤, 연결된 원리와 고치는 프롬프트 조각을 확인합니다.</p>']
    for f in p['fails']:
        first = f['first']
        opts = [first] + [x for x in range(5) if x != first][:2]
        opts.sort()
        h.append('<div class="failcard" id="%s"><h3>%s · %s</h3><div class="failgrid">' % (f['id'], f['id'], f['name']))
        h.append(figure(f['id'] + '_fail', f['alt'], tall=True, ratio='2/3'))
        h.append('<div><p><span class="chip">증상</span>%s</p>' % f['sym'])
        h.append(quizbox(dict(q='처음 걸리는 점검 항목은?', o=[p['check'][x] for x in opts], a=opts.index(first), ok=f['note'], no='점검표를 위에서부터 짚어 보세요.')))
        h.append('<p><span class="chip">연결된 원리</span><a href="%s">%s</a></p>' % f['link'])
        if f.get('real'):
            h.append('<p class="hint">%s</p>' % f['real'])
        h.append('<div class="promptbox"><b>고치는 프롬프트 조각</b><pre>%s</pre><button type="button" class="btn copy">복사하기</button></div></div></div></div>' % E(f['fix']))
    h.append('</div></section>')
    return '\n'.join(h)


def drift_section(p):
    d = p['drift']
    rows = ''.join('<tr><td>%s</td><td>%s</td><td>%s</td></tr>' % r for r in d['rows'])
    return ('<section class="room" id="drift"><div class="wrap"><div class="roomno">6부 · 3단계</div><h2>%s</h2><div class="box"><p>%s</p></div>'
            '<div class="tbl"><table><thead><tr><th>새는 방향</th><th>예</th><th>이렇게 바꾼다</th></tr></thead><tbody>%s</tbody></table></div>%s'
            '<div class="limit"><b>주의할 점</b> — %s</div></div></section>') % (d['title'], d['intro'], rows, talk(d['talk']), d['limit'])


def build_part(p):
    n = p['num']
    links = [('#' + s['id'], '%d단계' % (i + 1)) for i, s in enumerate(p['steps'])] if p['key'] != 'p6' else [('#s1', '진단 순서'), ('#fails', '실패 8종'), ('#drift', '웃음의 방향')]
    links += [('#make', '직접 만들기'), ('#drill', '연습 과제'), ('#judge', '평가'), ('#sum', '정리'), (p['next'][0], '다음 →')]
    title = '%s %d부 — %s' % (SITE['title'], n, p['title'])
    h = [head(title, p['desc'], 'og_%02d' % n, p['file']), nav(links)]
    h.append(cover('cover_%02d' % n, p['cover_alt'], p['cast']))
    h.append('<header class="hero"><div class="wrap"><span class="kicker">%s</span><h1>%s</h1><p class="lead">%s</p>\n%s</div></header>\n' % (p['kicker'], p['title'], p['lead'], byline()))
    h.append(three_box(p))
    h.append('<section><div class="wrap"><h2>오늘의 과제</h2>%s%s</div></section>\n' % (talk(p['task']), flowgrid(p['file'])))
    if p['key'] == 'p6':
        h.append(step(p, 0, p['steps'][0]))
        h.append(fails_section(p))
        h.append(drift_section(p))
    else:
        for i, s in enumerate(p['steps']):
            h.append(step(p, i, s))
    h.append(make_section(p))
    h.append(drill_section(p))
    h.append(judge(p))
    h.append('<section id="sum"><div class="wrap"><h2>%d부 정리</h2>\n<div class="tbl"><table><thead><tr><th>주제</th><th>한 줄</th><th>작업에서는</th></tr></thead><tbody>%s</tbody></table></div></div></section>\n'
             % (n, ''.join('<tr><td>%s</td><td>%s</td><td>%s</td></tr>' % r for r in p['sum'])))
    h.append('<section id="outro"><div class="wrap"><h2>다음으로</h2>%s\n<div class="next"><a href="%s">%s</a><a href="%s">%s</a></div></div></section>\n'
             % (talk(p['outro']), p['prev'][0], p['prev'][1], p['next'][0], p['next'][1]))
    h.append(kg_block(p))
    h.append(footer(p))
    open(os.path.join(ROOT, p['file']), 'w').write(''.join(h))


def build_index():
    I = INDEX
    h = [head(SITE['title'] + ' — ' + SITE['subtitle'], I['desc'], 'og_index', ''), nav([('#howto', '읽는 법'), ('#parts', '편 목록'), ('#map', '전체 흐름'), ('#cast', '등장인물'), ('#source', '원리와 출처')])]
    h.append(cover('cover_index', I['cover_alt'], I['cast']))
    h.append('<header class="hero"><div class="wrap"><span class="kicker">%s</span>\n<h1>%s</h1>\n<p class="lead">%s</p>\n%s</div></header>\n' % (I['kicker'], I['h1'], I['lead'], byline()))
    h.append(three_box(I))
    h.append(I['body'](figure, chimg, flowgrid, talk))
    h.append(kg_block(I))
    h.append(footer(I))
    open(os.path.join(ROOT, 'index.html'), 'w').write(''.join(h))


def build_practice():
    P = PRACTICE
    root = '../'
    h = [head(SITE['title'] + ' 7부 — 실전 연습장', P['desc'], 'og_07', 'practice/index.html', root),
         nav([('#' + t, n) for t, n in P['tabs']] + [('#wrap', '마무리')], root)]
    h.append(cover('cover_07', P['cover_alt'], P['cast'], root))
    h.append('<header class="hero"><div class="wrap"><span class="kicker">7부 · 마지막 장</span><h1>실전 연습장</h1>\n<p class="lead">%s</p>\n%s</div></header>\n' % (P['lead'], byline()))
    h.append(P['body'])
    h.append(kg_block(P, root))
    h.append(footer(P, root))
    open(os.path.join(ROOT, 'practice', 'index.html'), 'w').write(''.join(h))


def build_js():
    B = os.path.join(ROOT, 'build')
    parts = ['js_common.js', 'js_draw.js', 'js_p1.js', 'js_p2.js', 'js_p3.js', 'js_p4.js', 'js_p5.js', 'js_p6.js', 'js_practice.js', 'js_tail.js']
    src = '/* 구조 먼저 그리기 연구실 · 웃음 편 — 실험 패널 모음 (외부 라이브러리 없음) */\n(function(){\n\'use strict\';\n'
    for f in parts:
        src += '\n/* ---- %s ---- */\n' % f + open(os.path.join(B, f)).read()
    src += '\n})();\n'
    open(os.path.join(ROOT, 'assets', 'panels.js'), 'w').write(src)


def manifest():
    pages = ['index.html'] + [f for f, n, t in PARTS_ORDER if f != 'index.html']
    imgs = sorted(set(os.path.splitext(x)[0] for x in os.listdir(os.path.join(ROOT, 'assets', 'img')) if x.endswith('.webp')))
    M = {'series_ko': '연구실 특별편 · 그리기와 렌더링', 'title_ko': SITE['title'], 'site_url': SITE['url'], 'site_title': SITE['title'] + ' — ' + SITE['subtitle'],
         'version': SITE['version'], 'date': SITE['date'], 'ontology': {'pages': [{'path': p, 'kg': True, 'export': True} for p in pages]},
         'covers': {c: (c in imgs) for c in ['cover_index'] + ['cover_%02d' % i for i in range(1, 8)]}, 'images_received': imgs}
    json.dump(M, open(os.path.join(ROOT, 'cover_manifest.json'), 'w'), ensure_ascii=False, indent=2)


if __name__ == '__main__':
    for p in PARTS.values():
        build_part(p)
    build_index()
    build_practice()
    build_js()
    manifest()
    print('built', len(PARTS) + 2, 'pages')

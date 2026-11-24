# -*- coding: utf-8 -*-
"""실전 연습장 미션 판정 점검 (로컬 서버 8765) — 조작 전 0개, 정답 조작 뒤 모두 통과해야 한다"""
import sys
from playwright.sync_api import sync_playwright

URL = 'http://localhost:8765/practice/index.html'
SET = """([sc,name,val])=>{const e=document.querySelector('#'+sc+' [name='+name+']');if(e.type==='checkbox'){e.checked=val;e.dispatchEvent(new Event('change'));}else{e.value=String(val);e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input'));}}"""
DONE = "(sc)=>[...document.querySelectorAll('#'+sc+' .missions li')].map(l=>l.classList.contains('done'))"
fail = 0
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.goto(URL)
    pg.wait_for_timeout(300)
    for sc in ('bench', 'bounce', 'comic', 'desk'):
        if any(pg.evaluate(DONE, sc)):
            print('BAD', sc, '조작 전에 통과 표시'); fail += 1
    s = lambda sc, n, v: pg.evaluate(SET, [sc, n, v])
    # bench
    s('bench', 'job', 'comic'); s('bench', 'n', 2.5); s('bench', 'all', False); s('bench', 'k', 2)
    s('bench', 'job', 'react'); s('bench', 'k', 2.4)
    s('bench', 'job', 'poster'); s('bench', 'n', 7); s('bench', 'k', 1)
    # bounce
    s('bounce', 'mat', 'rubber'); s('bounce', 'keep', True); s('bounce', 's', 1.5); s('bounce', 'h', 0.8)
    s('bounce', 'mat', 'bowl'); s('bounce', 's', 1.05)
    s('bounce', 'mat', 'water'); s('bounce', 's', 1.8)
    # comic
    for st, cs in (('A', 'ABCD'), ('B', 'PQRS')):
        s('comic', 'set', st)
        for i, c in enumerate(cs):
            s('comic', 'c%d' % (i + 1), c)
        s('comic', 'z', 90); s('comic', 'face', 'dead')
    # desk: 정답을 알고 누른다
    syms = ['캐릭터가 서 있을 뿐인데, 설명을 들어야 웃긴 그림', '놀란 얼굴인데 눈·입·땀·머리카락이 다 커서 시끄러운 그림', '개그 장면인데 팔다리가 애매하게 길어 귀엽지도 멋지지도 않은 그림', '서 있다가 갑자기 공중에 떠 있는 점프',
            '떨어지며 길어질 때 커 보이는 고무공', '4컷 중 첫 컷에 결과가 나와 나머지가 설명이 된 만화', '공이 닿는 순간 이미 안경이 날아가 무슨 일인지 놓치는 장면', '컷마다 머리색과 리본 위치가 달라 다른 사람 같은 리액션 짤']
    ca = [0, 1, 1, 2, 2, 3, 3, 4]
    for _ in range(80):
        t = pg.evaluate("document.querySelector('#desk .sym').textContent").replace('증상: ', '')
        pg.evaluate("(i)=>document.querySelector('#desk .deskopts button[data-i=\"'+i+'\"]').click()", ca[syms.index(t)])
    for sc in ('bench', 'bounce', 'comic', 'desk'):
        d = pg.evaluate(DONE, sc)
        print('OK ' if all(d) else 'BAD', sc, d)
        if not all(d):
            fail += 1
    b.close()
sys.exit(1 if fail else 0)

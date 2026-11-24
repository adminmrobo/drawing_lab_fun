# -*- coding: utf-8 -*-
"""390px·1280px 가로 넘침, 콘솔 오류, 깨진 실험 점검 (로컬 서버 8765에서)
python3 -m http.server 8765 &  →  python3 build/check_pages.py"""
import sys
from playwright.sync_api import sync_playwright

PAGES = ['index.html', '01_exaggeration.html', '02_reaction.html', '03_motion.html', '04_comic.html', '05_ai_fun.html', '06_failure_lab.html', 'practice/index.html']
BASE = 'http://localhost:8765/'
bad = 0
with sync_playwright() as p:
    b = p.chromium.launch()
    for w in (390, 1280):
        pg = b.new_page(viewport={'width': w, 'height': 900})
        errs = []
        pg.route('**/*', lambda r: r.continue_() if r.request.url.startswith(BASE) else r.abort())
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_FAILED' not in m.text else None)
        pg.on('pageerror', lambda e: errs.append(str(e)))
        for u in PAGES:
            errs.clear()
            pg.goto(BASE + u, wait_until='load')
            pg.wait_for_timeout(250)
            # 모든 입력을 한 번씩 건드려 본다
            pg.evaluate("""()=>{document.querySelectorAll('.panel .ctrl input[type=range]').forEach(i=>{i.value=i.max;i.dispatchEvent(new Event('input'));i.value=i.min;i.dispatchEvent(new Event('input'));});
              document.querySelectorAll('.panel .ctrl input[type=checkbox]').forEach(i=>{i.click();});
              document.querySelectorAll('.panel .ctrl select').forEach(s=>{for(const o of s.options){s.value=o.value;s.dispatchEvent(new Event('change'));}});
              document.querySelectorAll('.panel [data-act=play]').forEach(b=>b.click());}""")
            pg.wait_for_timeout(300)
            ov = pg.evaluate('document.documentElement.scrollWidth - window.innerWidth')
            broken = pg.evaluate("[...document.querySelectorAll('[data-panel]')].filter(h=>h.textContent.includes('불러오지 못했')||!h.children.length).map(h=>h.dataset.panel)")
            empty = pg.evaluate("[...document.querySelectorAll('.readout')].filter(r=>!r.textContent.trim()).length")
            ok = ov <= 1 and not errs and not broken and empty == 0
            if not ok:
                bad += 1
            print(('OK ' if ok else 'BAD'), w, u, 'overflow=%d' % ov, 'errors=%s' % errs[:3], 'broken=%s' % broken, 'empty_readout=%d' % empty)
    b.close()
sys.exit(1 if bad else 0)

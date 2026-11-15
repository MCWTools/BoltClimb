#!/usr/bin/env python3
"""Xuất toàn bộ sprite đang vẽ bằng code ra PNG trong assets/ và tạo assets/manifest.json.
Cần: pip install playwright && playwright install chromium   (hoặc có sẵn Google Chrome)
Chạy:  python3 tools/export_assets.py"""
import asyncio, base64, json, os, re, shutil, sys
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC=os.path.join(ROOT,'index.html')
PLAT=('plank','scaf','crate','girder','hex','crys','ice','ramp','stairs','pipe','brick','metal','solar','moon','gpad','dark','hot','cl','rock')
BG=('bgcl','sat','ast')
def cat(k):
    if k.startswith('B'): return None            # frame nhân vật: dùng sprite sheet trong characters/
    if k.startswith(BG): return 'backgrounds'
    if k.startswith(PLAT): return 'platforms'
    return 'objects'
def fname(k): return re.sub(r'[^A-Za-z0-9_.-]','_',k)+'.png'
async def main():
    tmp=os.path.join(ROOT,'tools','_export.html')
    h=open(SRC,encoding='utf-8').read().replace('window.__bc={PL,','window.__bc={SC,PL,',1)
    open(tmp,'w',encoding='utf-8').write(h)
    async with async_playwright() as p:
        kw={}
        for exe in ('/usr/bin/google-chrome','/usr/bin/chromium'):
            if os.path.exists(exe): kw=dict(executable_path=exe,args=['--no-sandbox']);break
        br=await p.chromium.launch(**kw);pg=await br.new_page(viewport={'width':390,'height':780})
        await pg.goto('file://'+tmp);await pg.wait_for_timeout(500)
        await pg.evaluate("window.__bc.startNew('exportseed')");await pg.wait_for_timeout(300)
        out=await pg.evaluate("""()=>{const b=window.__bc;const res={};
          for(const seed of ['exportseed','a1','b2','c3']){b.startNew(seed);
            for(let r=0;r<460;r+=4){b.genUpTo(r+22);b.P.x=100;b.P.y=-r*40;b.cam.x=0;b.cam.y=b.P.y-170;for(let i=0;i<6;i++){try{b.step(1/60)}catch(e){}}try{b.render()}catch(e){}}}
          for(const [k,c] of b.SC){if(c&&c.toDataURL)try{res[k]=c.toDataURL('image/png')}catch(e){}}return res}""")
        await br.close();os.remove(tmp)
    man={'characters':[],'shields':[],'platforms':[],'backgrounds':[],'objects':[]}
    for c in man:
        d=os.path.join(ROOT,'assets',c);os.makedirs(d,exist_ok=True)
        if c in('platforms','backgrounds','objects'):
            for f in os.listdir(d):
                if f.endswith('.png'):os.remove(os.path.join(d,f))
    for k,u in sorted(out.items()):
        c=cat(k)
        if not c: continue
        open(os.path.join(ROOT,'assets',c,fname(k)),'wb').write(base64.b64decode(u.split(',',1)[1]))
        man[c].append({'key':k,'file':fname(k)})
    for c in('characters','shields'):
        d=os.path.join(ROOT,'assets',c)
        for f in sorted(os.listdir(d)):
            if f.lower().endswith('.png'): man[c].append({'file':f,'name':os.path.splitext(f)[0]})
    json.dump(man,open(os.path.join(ROOT,'assets','manifest.json'),'w'),indent=1,ensure_ascii=False)
    print({k:len(v) for k,v in man.items()})
asyncio.run(main())

import json, os, subprocess
import guide, base64, io
from PIL import Image
def shrink(uri, maxw=900):
    raw = base64.b64decode(uri.split(',', 1)[1]); im = Image.open(io.BytesIO(raw)).convert('RGB')
    if im.width > maxw: im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    q = im.quantize(colors=48, method=Image.MEDIANCUT, dither=Image.NONE); b = io.BytesIO(); q.save(b, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()
HERE = os.path.dirname(os.path.abspath(__file__))
def attach_steps(cfgs, render_page):
    items = []; plan = []
    for cfg in cfgs:
        if cfg.get('mode') != 'tp': continue
        prev = cfg['start']
        for i, m in enumerate(cfg['missions']):
            base = m.get('start') or (cfg['start'] if m.get('fresh') else prev)
            st = guide.steps_for(base, m['solution'])
            for k, x in enumerate(st):
                iid = '%s_%d_%d' % (cfg['id'], i, k); items.append({'id': iid, 'xml': x['xml']}); x['id'] = iid
            plan.append((m, st)); prev = m['solution']
    json.dump(items, open('/tmp/steps_in.json', 'w'))
    subprocess.run('DSF=1.5 NODE_PATH=$(npm root -g) node render_blocks.js %s /tmp/steps_in.json /tmp/steps_out.json' % render_page, shell=True, check=True, cwd=HERE)
    out = json.load(open('/tmp/steps_out.json'))
    for m, st in plan:
        m['steps'] = [{'t': x['t'], 'cat': x['cat'], 'x': x.get('x', ''), 'img': shrink(out[x['id']]['png'])} for x in st]
    return len(items)

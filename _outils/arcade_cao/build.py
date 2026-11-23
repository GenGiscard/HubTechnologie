import json, re, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
BL = os.path.join(HERE, 'node_modules', 'blockly')
PROF_PW = 'Agostini2025'

def djb(s):
    h = 5381
    for c in s: h = ((h * 33) ^ ord(c)) & 0xffffffff
    return h

def blockly_bundle():
    parts = [open(os.path.join(BL, f), encoding='utf-8').read() for f in ('blockly_compressed.js', 'blocks_compressed.js', 'javascript_compressed.js', 'msg/fr.js')]
    s = '\n'.join(parts)
    s = re.sub(r'//# sourceMappingURL=.*', '', s)
    return s.replace('</script', '<\\/script')

def cfg_js(cfg):
    fns = []
    c = json.loads(json.dumps(cfg))
    for m in c['missions']:
        for t in m['tests']:
            fns.append(t['ok']); t['ok'] = '__FN%d__' % (len(fns) - 1)
    c['profHash'] = djb(PROF_PW)
    s = json.dumps(c, ensure_ascii=False)
    for i, f in enumerate(fns):
        s = s.replace('"__FN%d__"' % i, '(T=>{' + f + '})')
    return 'const CFG = ' + s + ';'

_BUNDLE = None
def build(cfg, out):
    global _BUNDLE
    if _BUNDLE is None: _BUNDLE = blockly_bundle()
    src = lambda n: open(os.path.join(HERE, 'src', n), encoding='utf-8').read()
    t = src('template.html')
    for key, val in [('BLOCKLY', _BUNDLE), ('IMAGES', src('images.js')), ('RUNTIME', src('runtime.js')), ('BLOCKS', src('blocks.js')), ('CFG', cfg_js(cfg)), ('UI', src('ui.js'))]:
        t = t.replace('/*%s*/' % key, val, 1)
    open(out, 'w', encoding='utf-8').write(t)
    return out

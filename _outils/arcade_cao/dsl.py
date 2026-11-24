# Mini-langage pour écrire les programmes de blocs (solutions, départs) en XML Blockly
import json, html

def esc(s): return html.escape(str(s), quote=False)

class Blk:
    def __init__(self, t, f=None, v=None, s=None, mut=None):
        self.t, self.f, self.v, self.s, self.mut = t, f or {}, v or {}, s or {}, mut
        self.nxt = None
    def xml(self):
        o = '<block type="%s">' % self.t
        if self.mut: o += self.mut
        for k, x in self.f.items(): o += '<field name="%s">%s</field>' % (k, esc(x))
        for k, x in self.v.items():
            o += '<value name="%s">%s</value>' % (k, val(x))
        for k, lst in self.s.items():
            c = chain(lst)
            if c: o += '<statement name="%s">%s</statement>' % (k, c.xml())
        if self.nxt: o += '<next>%s</next>' % self.nxt.xml()
        return o + '</block>'

def val(x):
    if isinstance(x, Blk): return x.xml()
    if isinstance(x, bool): return Blk('logic_boolean', {'BOOL': 'TRUE' if x else 'FALSE'}).xml()
    if isinstance(x, (int, float)): return '<shadow type="math_number"><field name="NUM">%s</field></shadow>' % x
    if isinstance(x, str): return '<shadow type="text"><field name="TEXT">%s</field></shadow>' % esc(x)
    raise ValueError(x)

def chain(lst):
    lst = [b for b in lst if b is not None]
    if not lst: return None
    # copie superficielle pour éviter d'enchaîner deux fois le même objet
    import copy
    lst = [copy.copy(b) for b in lst]
    for a, b in zip(lst, lst[1:]): a.nxt = b
    lst[-1].nxt = None
    return lst[0]

def prog(*hats):
    return '<xml>' + ''.join(h.xml() for h in hats) + '</xml>'

# ---------- chapeaux ----------
def start(*b): return Blk('g_start', s={'DO': list(b)})
def update(*b): return Blk('g_update', s={'DO': list(b)})
def every(ms, *b): return Blk('g_interval', {'MS': ms}, s={'DO': list(b)})
def overlap(k1, k2, *b): return Blk('sp_overlap_ev', {'K1': k1, 'K2': k2}, s={'DO': list(b)})
def button(btn, *b, ev='presse'): return Blk('ct_button_ev', {'B': btn, 'EV': ev}, s={'DO': list(b)})
def countend(*b): return Blk('g_countend', s={'DO': list(b)})
def lifezero(*b): return Blk('g_lifezero', s={'DO': list(b)})
def fn(name, *b, args=(), ret=None):
    mut = '<mutation>' + ''.join('<arg name="%s"></arg>' % a for a in args) + '</mutation>'
    if ret is not None:
        return Blk('procedures_defreturn', {'NAME': name}, {'RETURN': ret}, {'STACK': list(b)}, mut)
    return Blk('procedures_defnoreturn', {'NAME': name}, s={'STACK': list(b)}, mut=mut)
def call(name, *a, ret=False):
    mut = '<mutation name="%s">' % esc(name) + ''.join('<arg name="x%d"></arg>' % i for i in range(len(a))) + '</mutation>'
    return Blk('procedures_callreturn' if ret else 'procedures_callnoreturn', v={'ARG%d' % i: x for i, x in enumerate(a)}, mut=mut)

# ---------- sprites ----------
def create(img, kind): return Blk('sp_create', {'IMG': img, 'KIND': kind})
def setv(var, value): return Blk('variables_set', {'VAR': var}, {'VALUE': value})
def getv(var): return Blk('variables_get', {'VAR': var})
def changev(var, d): return Blk('math_change', {'VAR': var}, {'DELTA': d})
def newsprite(var, img, kind): return setv(var, create(img, kind))
def proj(var, img, src, vx, vy): return setv(var, Blk('sp_projectile', {'IMG': img, 'VAR': src}, {'VX': vx, 'VY': vy}))
def setpos(var, x, y): return Blk('sp_setpos', {'VAR': var}, {'X': x, 'Y': y})
def sset(var, p, v): return Blk('sp_set', {'VAR': var, 'P': p}, {'V': v})
def schange(var, p, v): return Blk('sp_change', {'VAR': var, 'P': p}, {'V': v})
def sget(var, p): return Blk('sp_get', {'VAR': var, 'P': p})
def rndpos(var): return Blk('sp_random', {'VAR': var})
def flag(var, f, on=True): return Blk('sp_flag', {'VAR': var, 'F': f, 'ON': '1' if on else '0'})
def say(var, t): return Blk('sp_say', {'VAR': var}, {'TXT': t})
def destroy(var): return Blk('sp_destroy', {'VAR': var})
def follow(var, tgt, v): return Blk('sp_follow', {'VAR': var, 'TGT': tgt}, {'V': v})
def setimg(var, img): return Blk('sp_image', {'VAR': var, 'IMG': img})
def overlaps(a, b): return Blk('sp_overlaps', {'VAR': a, 'B': b})
def kcount(k): return Blk('sp_count', {'KIND': k})
def move(var, vx=100, vy=100): return Blk('ct_move', {'VAR': var}, {'VX': vx, 'VY': vy})
def pressed(btn): return Blk('ct_pressed', {'B': btn})
# ---------- jeu / info / son ----------
def bg(c): return Blk('g_bg', {'C': c})
def splash(t): return Blk('g_splash', v={'TXT': t})
def gameover(win): return Blk('g_over', {'WIN': '1' if win else '0'})
def setscore(v): return Blk('i_setscore', v={'V': v})
def addscore(v): return Blk('i_addscore', v={'V': v})
def score(): return Blk('i_score')
def setlife(v): return Blk('i_setlife', v={'V': v})
def addlife(v): return Blk('i_addlife', v={'V': v})
def life(): return Blk('i_life')
def countdown(v): return Blk('i_countdown', v={'V': v})
def sound(s): return Blk('m_play', {'S': s})
# ---------- logique / maths / texte ----------
OPS = {'==': 'EQ', '!=': 'NEQ', '<': 'LT', '<=': 'LTE', '>': 'GT', '>=': 'GTE'}
def cmp(a, op, b): return Blk('logic_compare', {'OP': OPS[op]}, {'A': a, 'B': b})
def land(a, b): return Blk('logic_operation', {'OP': 'AND'}, {'A': a, 'B': b})
def lor(a, b): return Blk('logic_operation', {'OP': 'OR'}, {'A': a, 'B': b})
def lnot(a): return Blk('logic_negate', v={'BOOL': a})
def iff(c, then, els=None, elifs=()):
    mut = ''
    if els is not None or elifs:
        mut = '<mutation%s%s></mutation>' % (' elseif="%d"' % len(elifs) if elifs else '', ' else="1"' if els is not None else '')
    v = {'IF0': c}; s = {'DO0': then}
    for i, (c2, t2) in enumerate(elifs, 1): v['IF%d' % i] = c2; s['DO%d' % i] = t2
    if els is not None: s['ELSE'] = els
    return Blk('controls_if', v=v, s=s, mut=mut or None)
AR = {'+': 'ADD', '-': 'MINUS', '*': 'MULTIPLY', '/': 'DIVIDE'}
def ar(a, op, b): return Blk('math_arithmetic', {'OP': AR[op]}, {'A': a, 'B': b})
def num(n): return Blk('math_number', {'NUM': n})
def rnd(a, b): return Blk('math_random_int', v={'FROM': a, 'TO': b})
def absn(x): return Blk('math_single', {'OP': 'ABS'}, {'NUM': x})
def neg(x): return Blk('math_single', {'OP': 'NEG'}, {'NUM': x})
def txt(t): return Blk('text', {'TEXT': t})
def join(*parts): return Blk('text_join', v={'ADD%d' % i: p for i, p in enumerate(parts)}, mut='<mutation items="%d"></mutation>' % len(parts))
# ---------- boucles ----------
def repeat(n, *b): return Blk('controls_repeat_ext', v={'TIMES': n}, s={'DO': list(b)})
def forr(var, a, b_, *b, by=1): return Blk('controls_for', {'VAR': var}, {'FROM': a, 'TO': b_, 'BY': by}, {'DO': list(b)})
def whilee(c, *b): return Blk('controls_whileUntil', {'MODE': 'WHILE'}, {'BOOL': c}, {'DO': list(b)})
def foreach(var, lst, *b): return Blk('controls_forEach', {'VAR': var}, {'LIST': lst}, {'DO': list(b)})
# ---------- listes ----------
def lst(*items): return Blk('lists_create_with', v={'ADD%d' % i: x for i, x in enumerate(items)}, mut='<mutation items="%d"></mutation>' % len(items))
def lget(l, i): return Blk('lists_getIndex', {'MODE': 'GET', 'WHERE': 'FROM_START'}, {'VALUE': l, 'AT': i}, mut='<mutation statement="false" at="true"></mutation>')
def lrand(l): return Blk('lists_getIndex', {'MODE': 'GET', 'WHERE': 'RANDOM'}, {'VALUE': l}, mut='<mutation statement="false" at="false"></mutation>')
def llen(l): return Blk('lists_length', v={'VALUE': l})
def lpush(l, x): return Blk('lists_setIndex', {'MODE': 'INSERT', 'WHERE': 'LAST'}, {'LIST': l, 'TO': x}, mut='<mutation at="false"></mutation>')

def js(o):
    return json.dumps(o, ensure_ascii=False)

def floor(x): return Blk('math_round', {'OP': 'ROUNDDOWN'}, {'NUM': x})
def boolv(b): return Blk('logic_boolean', {'BOOL': 'TRUE' if b else 'FALSE'})
# ---------- effets ----------
def scene(n): return Blk('fx_scene', {'S': n})
def effect(var, e): return Blk('fx_effect', {'E': e, 'VAR': var})
def shake(f='faible'): return Blk('fx_shake', {'F': f})
def music(m): return Blk('fx_music', {'M': m})
def camf(var): return Blk('cam_follow', {'VAR': var})
def world(w, h): return Blk('world_size', v={'W': w, 'H': h})

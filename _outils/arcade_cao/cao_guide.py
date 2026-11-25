# Tutoriel pas à pas pour les TP CAO : étapes générées à partir des fonctions de la pièce cible
import json, re, subprocess, os, base64, io
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))

def fr(v):
    v = round(float(v), 2)
    return (str(int(v)) if v == int(v) else str(v)).replace('.', ',')

def plane_txt(p):
    n, off = tuple(p['n']), p['off']
    if n == (0, 0, 1):
        if off == 0: return 'Clique sur <b>Nouvelle esquisse</b> puis sur <b>Dessus</b> (plan XY).', ''
        return 'Clique sur <b>Nouvelle esquisse</b>, puis <b>Une face</b>, et clique sur la face du dessus située à <b>%s mm</b> de haut.' % fr(off), ''
    if n == (0, -1, 0):
        return 'Clique sur <b>Nouvelle esquisse</b> puis sur <b>Face</b> (plan XZ).', ' Sur ce plan, le <b>y</b> de l’esquisse est la <b>hauteur</b>.'
    if n == (1, 0, 0):
        if off == 0: return 'Clique sur <b>Nouvelle esquisse</b> puis sur <b>Droite</b> (plan YZ).', ' Sur ce plan, x = profondeur et y = hauteur.'
        return 'Clique sur <b>Nouvelle esquisse</b>, puis <b>Une face</b>, et clique sur la face de droite (à <b>x = %s mm</b>).' % fr(off), ' Sur cette face, x = profondeur et y = hauteur.'
    return 'Clique sur <b>Nouvelle esquisse</b> et choisis le plan comme sur le dessin.', ''

def ent_txt(group, H):
    e = group[0]; t = e['t']
    if t == 'rect':
        return ' '.join('Outil <b>Rectangle</b> : trace un rectangle, puis tape à droite Longueur <b>%s</b>, Largeur <b>%s</b>, coin bas-gauche x <b>%s</b>, y <b>%s</b>.' % (H(r['w']), H(r['h']), H(r['x']), H(r['y'])) for r in group)
    if t == 'circle':
        c = ', '.join('(%s ; %s)' % (H(r['cx']), H(r['cy'])) for r in group)
        return ('Outil <b>Cercle</b> : trace %s cercle%s de Ø <b>%s</b>, centre%s %s. Tape les valeurs à droite pour chaque cercle.' % (len(group) if len(group) > 1 else 'un', 's' if len(group) > 1 else '', H(e['d']), 's' if len(group) > 1 else '', c))
    if t == 'oblong':
        return ' '.join('Outil <b>Oblong</b> : entraxe <b>%s</b>, largeur <b>%s</b>, centre (%s ; %s)%s.' % (H(r['L']), H(r['d']), H(r['cx']), H(r['cy']), ', angle <b>%s°</b>' % fr(r['a']) if r.get('a') else '') for r in group)
    if t == 'npoly':
        return ' '.join('Outil <b>Polygone</b> : <b>%d</b> côtés, Ø extérieur <b>%s</b>, centre (%s ; %s)%s.' % (r['n'], H(r['d']), H(r['cx']), H(r['cy']), ', rotation <b>%s°</b>' % fr(r['a']) if r.get('a') else '') for r in group)
    if t == 'poly':
        pts = ' → '.join('(%s ; %s)' % (H(x), H(y)) for x, y in e['pts'])
        return 'Outil <b>Polyligne</b> : clique les points dans l’ordre, puis reclique sur le premier pour fermer. Corrige ensuite les coordonnées à droite : %s.' % pts
    return 'Trace le contour comme sur le dessin.'

EX = {'rect': 'Les cotes fixent la taille et la position exactes du rectangle : c’est un dessin précis, pas à main levée.',
      'circle': 'Un cercle dans l’esquisse devient un cylindre avec un bossage, ou un trou avec un enlèvement.',
      'oblong': 'L’oblong, deux demi-cercles reliés, donne une fente arrondie ou une forme de bielle.',
      'npoly': 'Le polygone régulier a tous ses côtés égaux, comme la tête d’une vis ou un écrou.',
      'poly': 'Une polyligne fermée permet de dessiner n’importe quel contour, point par point.'}
def groups(ents):
    out = []
    for e in ents:
        if out and e['t'] == out[-1][0]['t'] and e['t'] == 'circle' and e['d'] == out[-1][0]['d']: out[-1].append(e)
        else: out.append([e])
    return out

def steps_for(m, hide=False):
    known = set()
    for c in m.get('cotes', []):
        for x in re.findall(r'\d+(?:[.,]\d+)?', str(c.get('t', ''))): known.add(round(float(x.replace(',', '.')), 2))
    q = m.get('question') or {}
    ans = round(float(q['answer']), 2) if q.get('type') == 'num' and isinstance(q.get('answer'), (int, float)) else None
    used = []
    def H(v):
        v = round(float(v), 2)
        if (hide and v != 0 and abs(v) not in known) or (ans is not None and v != 0 and abs(v) == abs(ans)): used.append(1); return '?'
        return fr(v)
    st = []
    feats = m['cible']; nf = len(feats)
    for k, f in enumerate(feats):
        p, note = plane_txt(f['sketch']['plane'])
        head = ('Fonction %d sur %d. ' % (k + 1, nf)) if nf > 1 else ''
        face = f['sketch']['plane']['off'] != 0
        st.append({'t': head + p + note, 'x': 'Tu dessines sur une face de la pièce : le nouveau volume partira de cette face.' if face else 'Le plan d’esquisse est la feuille sur laquelle tu dessines la forme en 2D.'})
        for g in groups(f['sketch']['ents']):
            st.append({'t': ent_txt(g, H), 'x': EX.get(g[0]['t'], 'Ce contour 2D donnera sa forme au volume.')})
        op = 'Bossage' if f['op'] == 'boss' else 'Enlèvement'
        dep = 'coche <b>À travers tout</b>' if f.get('thru') else 'profondeur <b>%s mm</b>' % H(f['depth'])
        sens = {1: 'Normal', -1: 'Inversé', 0: 'Symétrique'}.get(f.get('dir', 1), 'Normal')
        st.append({'t': 'Clique sur <b>Valider l’esquisse</b>. Choisis <b>%s</b>, %s, sens <b>%s</b>, puis <b>Valider</b>. Ta pièce doit ressembler à l’image.' % (op, dep, sens), 'img': (k + 1),
                   'x': ('Le bossage pousse l’esquisse en 3D : il ajoute de la matière.' if f['op'] == 'boss' else 'L’enlèvement de matière creuse ou perce la pièce avec la forme de l’esquisse.') + (' « À travers tout » traverse toute la pièce.' if f.get('thru') else '')})
    for g in m.get('guideExtra', []): st.append({'t': g['t'], 'x': g.get('x', '')})
    if used: st[0]['t'] += ' Les valeurs <b>?</b> ne sont pas données : lis le dessin et calcule-les.'
    st.append({'t': 'Compare avec la pièce cible (tourne-la), puis clique sur <b>Vérifier ma pièce</b>.' + (' Ensuite, suis la méthode résumée pour la suite.' if m.get('sim') or m.get('question') else '')})
    return st

def eligible(m):
    return m.get('cible') and not m.get('start') and m.get('useModelOf') is None and m.get('ws') != 'asm'

def shrink(uri, w=520):
    im = Image.open(io.BytesIO(base64.b64decode(uri.split(',', 1)[1]))).convert('RGB')
    if im.width > w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'JPEG', quality=78, optimize=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()

def attach(cfgs, page, hide_ids=()):
    req = []; plan = []
    for cfg in cfgs:
        for i, m in enumerate(cfg['missions']):
            if not eligible(m): continue
            st = steps_for(m, cfg['id'] in hide_ids)
            for s in st:
                if 'img' in s: rid = '%s_%d_%d' % (cfg['id'], i, s['img']); req.append({'id': rid, 'feats': m['cible'][:s['img']], 'all': m['cible']}); s['img'] = rid
            plan.append((m, st))
    dreq = []
    for cfg in cfgs:
        for i, m in enumerate(cfg['missions']):
            if eligible(m) or not m.get('guide'): continue
            for k, g in enumerate(m['guide']):
                if 'state' in g:
                    rid = '%s_d%d_%d' % (cfg['id'], i, k); dreq.append({'id': rid, 'features': m['start'], 'mat': m.get('mat', 0), 'state': g.pop('state')}); g['img'] = rid
    if dreq:
        json.dump(dreq, open('/tmp/drw_req.json', 'w'))
        subprocess.run('NODE_PATH=$(npm root -g) node drw_shots.js %s /tmp/drw_req.json /tmp/drw_out.json' % page, shell=True, check=True, cwd=HERE)
        dout = json.load(open('/tmp/drw_out.json'))
        for cfg in cfgs:
            for m in cfg['missions']:
                for g in m.get('guide', []):
                    if isinstance(g.get('img'), str) and g['img'] in dout: g['img'] = shrink(dout[g['img']], 560)
    json.dump(req, open('/tmp/cao_req.json', 'w'))
    subprocess.run('NODE_PATH=$(npm root -g) node cao_shots.js %s /tmp/cao_req.json /tmp/cao_out.json' % page, shell=True, check=True, cwd=HERE)
    out = json.load(open('/tmp/cao_out.json'))
    for m, st in plan:
        for s in st:
            if 'img' in s: s['img'] = shrink(out[s['img']])
        m['guide'] = st
    return len(req)

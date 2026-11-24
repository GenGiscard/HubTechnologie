# Génère des étapes de tutoriel (texte + catégorie + image de blocs) par différence entre solutions successives
import xml.etree.ElementTree as ET
import copy, re

CAT = {'Jeu': 'Jeu', 'Sprites': 'Sprites', 'Contrôleur': 'Contrôleur', 'Info': 'Info', 'Musique': 'Musique', 'Effets': 'Effets', 'Boucles': 'Boucles',
       'Logique': 'Logique', 'Variables': 'Variables', 'Maths': 'Maths', 'Texte': 'Texte', 'Fonctions': 'Fonctions', 'Listes': 'Listes'}
IMGN = {'heros': 'le héros', 'vaisseau': 'le vaisseau', 'asteroide': 'l’astéroïde', 'piece': 'la pièce', 'pomme': 'la pomme', 'etoile': 'l’étoile', 'fantome': 'le fantôme',
        'slime': 'le slime', 'coeur': 'le cœur', 'tir': 'le tir', 'balle': 'la balle', 'brique': 'la brique', 'raquette': 'la raquette', 'mur': 'le mur', 'drapeau': 'le drapeau',
        'bombe': 'la bombe', 'poisson': 'le poisson', 'brique_bleue': 'la brique bleue', 'brique_verte': 'la brique verte', 'chauve_souris': 'la chauve-souris', 'cristal': 'le cristal',
        'boss': 'le boss', 'panier': 'le panier'}
SCN = {'foret': 'forêt', 'espace': 'espace étoilé', 'nuit': 'nuit hantée', 'ocean': 'océan', 'ciel': 'coucher de soleil', 'neon': 'ville néon', 'grotte': 'grotte'}
PROP = {'x': 'x', 'y': 'y', 'vx': 'vitesse x (vx)', 'vy': 'vitesse y (vy)', 'ax': 'accélération x (ax)', 'ay': 'accélération y (ay)', 'pv': 'points de vie (pv)'}
FLAG = {'stay': 'reste dans l’écran', 'bounce': 'rebondit sur les bords', 'autoDestroy': 'disparaît hors de l’écran'}
FX = {'explosion': 'explosion', 'etincelles': 'étincelles', 'confettis': 'confettis', 'fumee': 'fumée', 'coeurs': 'cœurs'}

def F(b, n):
    for f in b.findall('field'):
        if f.get('name') == n: return f.text or ''
    return ''
def V(b, n):
    for v in b.findall('value'):
        if v.get('name') == n:
            for c in v:
                if c.tag in ('block', 'shadow'): return c
    return None
def q(t): return '« ' + (t or '') + ' »'

def hat_desc(b):
    t = b.get('type')
    if t == 'g_start': return 'Jeu', 'Prends l’événement ' + q('au démarrage') + '.'
    if t == 'g_update': return 'Jeu', 'Prends l’événement ' + q('à chaque mise à jour du jeu') + '.'
    if t == 'g_interval': return 'Jeu', 'Prends ' + q('toutes les … ms') + ' et règle %s ms.' % F(b, 'MS')
    if t == 'g_countend': return 'Info', 'Prends ' + q('quand le compte à rebours est fini') + '.'
    if t == 'g_lifezero': return 'Info', 'Prends ' + q('quand les vies sont à zéro') + '.'
    if t == 'sp_overlap_ev': return 'Sprites', 'Prends ' + q('quand sprite … chevauche autreSprite …') + ' : choisis %s puis %s.' % (F(b, 'K1'), F(b, 'K2'))
    if t == 'ct_button_ev': return 'Contrôleur', 'Prends ' + q('quand le bouton … est pressé') + ' et choisis le bouton %s.' % F(b, 'B')
    if t == 'procedures_defnoreturn': return 'Fonctions', 'Prends ' + q('pour faire quelque chose') + ' et renomme la fonction <b>%s</b>.' % F(b, 'NAME')
    if t == 'procedures_defreturn': return 'Fonctions', 'Prends ' + q('pour faire quelque chose retourner') + ' et renomme la fonction <b>%s</b>.' % F(b, 'NAME')
    return 'Jeu', 'Ajoute ce bloc.'

def nonext(b):
    c = copy.deepcopy(b)
    for n in c.findall('next'): c.remove(n)
    return c
def loopvars(b):
    return {F(x, 'VAR') for x in b.iter('block') if x.get('type') in ('controls_for', 'controls_forEach')}
def stmt_desc(b, newvars):
    t = b.get('type'); var = F(b, 'VAR')
    pre = ''
    if var and var in newvars: pre = 'Crée d’abord la variable <b>%s</b> (catégorie Variables, « Créer une variable… »). ' % var
    if t == 'variables_set':
        val = V(b, 'VALUE'); vt = val.get('type') if val is not None else ''
        if vt == 'sp_create': return 'Sprites', pre + 'Glisse ' + q('définir … à sprite … de type …') + ' : variable <b>%s</b>, image : %s, type <b>%s</b>.' % (var, IMGN.get(F(val, 'IMG'), F(val, 'IMG')), F(val, 'KIND'))
        if vt == 'sp_projectile': return 'Sprites', pre + 'Glisse ' + q('définir projectile à projectile … depuis …') + ' : image %s, depuis <b>%s</b>, vitesses comme sur l’image.' % (IMGN.get(F(val, 'IMG'), ''), F(val, 'VAR'))
        if vt in ('lists_create_with',): return 'Listes', pre + 'Glisse ' + q('définir %s à …' % var) + ' (Variables) puis ' + q('créer une liste avec') + ' (Listes) et tape les valeurs.'
        if vt == 'procedures_callreturn': return 'Variables', pre + q('définir %s à …' % var) + ' avec l’appel de la fonction.'
        return 'Variables', pre + 'Glisse ' + q('définir %s à …' % var) + ' et complète la valeur comme sur l’image.'
    D = {
     'sp_setpos': ('Sprites', 'Glisse ' + q('placer %s en x … y …' % var) + ' et tape les nombres.'),
     'sp_set': ('Sprites', 'Glisse ' + q('fixer %s %s à …' % (var, PROP.get(F(b, 'P'), F(b, 'P')))) + '.'),
     'sp_change': ('Sprites', 'Glisse ' + q('modifier %s %s de …' % (var, PROP.get(F(b, 'P'), F(b, 'P')))) + '.'),
     'sp_random': ('Sprites', 'Glisse ' + q('placer %s à une position aléatoire' % var) + '.'),
     'sp_flag': ('Sprites', 'Glisse ' + q('régler %s %s : %s' % (var, FLAG.get(F(b, 'F'), ''), 'oui' if F(b, 'ON') == '1' else 'non')) + '.'),
     'sp_say': ('Sprites', 'Glisse ' + q('%s dit …' % var) + ' et écris le message.'),
     'sp_destroy': ('Sprites', 'Glisse ' + q('détruire %s' % var) + '.'),
     'sp_follow': ('Sprites', 'Glisse ' + q('%s suit %s vitesse …' % (var, F(b, 'TGT'))) + '.'),
     'sp_image': ('Sprites', 'Glisse ' + q('changer l’image de %s' % var) + ' et choisis %s.' % IMGN.get(F(b, 'IMG'), '')),
     'ct_move': ('Contrôleur', 'Glisse ' + q('déplacer %s avec les flèches' % var) + ' et règle les vitesses.'),
     'g_bg': ('Jeu', 'Glisse ' + q('couleur du fond') + '.'),
     'g_splash': ('Jeu', 'Glisse ' + q('afficher le message') + ' et écris le texte.'),
     'g_over': ('Jeu', 'Glisse ' + q('fin de partie %s' % ('gagnée' if F(b, 'WIN') == '1' else 'perdue')) + '.'),
     'i_setscore': ('Info', 'Glisse ' + q('fixer le score à …') + '.'), 'i_addscore': ('Info', 'Glisse ' + q('modifier le score de …') + ' et tape la valeur.'),
     'i_setlife': ('Info', 'Glisse ' + q('fixer les vies à …') + '.'), 'i_addlife': ('Info', 'Glisse ' + q('modifier les vies de …') + ' et tape la valeur.'),
     'i_countdown': ('Info', 'Glisse ' + q('lancer le compte à rebours … s') + '.'),
     'm_play': ('Musique', 'Glisse ' + q('jouer le son') + ' et choisis un son.'),
     'fx_scene': ('Effets', 'Glisse ' + q('décor') + ' et choisis <b>%s</b>.' % SCN.get(F(b, 'S'), '')),
     'fx_music': ('Effets', 'Glisse ' + q('jouer la musique') + ' et choisis une musique.'),
     'fx_effect': ('Effets', 'Glisse ' + q('effet … sur …') + ' : %s sur <b>%s</b>.' % (FX.get(F(b, 'E'), ''), var)),
     'fx_shake': ('Effets', 'Glisse ' + q('secouer l’écran') + '.'),
     'cam_follow': ('Effets', 'Glisse ' + q('la caméra suit %s' % var) + '.'),
     'world_size': ('Effets', 'Glisse ' + q('taille du monde') + ' et tape largeur et hauteur.'),
     'controls_if': ('Logique', 'Glisse un bloc ' + q('si … alors') + ' (ou « si … sinon »). Construis la condition avec les blocs de l’image : comparaison dans Logique, valeurs dans Sprites, Info ou Variables.'),
     'controls_repeat_ext': ('Boucles', 'Glisse ' + q('répéter … fois') + ' et mets dedans les blocs de l’image.'),
     'controls_for': ('Boucles', 'Glisse ' + q('pour %s de … à …' % var) + ' et mets dedans les blocs de l’image.'),
     'controls_forEach': ('Boucles', 'Glisse ' + q('pour chaque élément %s dans la liste' % var) + ' et complète comme sur l’image.'),
     'controls_whileUntil': ('Boucles', 'Glisse ' + q('répéter tant que') + ' et construis la condition.'),
     'math_change': ('Variables', 'Glisse ' + q('modifier %s de …' % var) + '.'),
     'procedures_callnoreturn': ('Fonctions', 'Glisse l’appel de la fonction ' + q(F(b, 'NAME') or (b.find('mutation').get('name') if b.find('mutation') is not None else '')) + '.'),
     'lists_setIndex': ('Listes', 'Glisse ' + q('insérer à la fin') + ' (Listes) et complète comme sur l’image.'),
    }
    if t in D:
        c, txt = D[t]; return c, pre + txt
    return 'Jeu', pre + 'Ajoute ce bloc comme sur l’image.'

def stmts(hat):
    name = 'STACK' if hat.get('type', '').startswith('procedures_def') else 'DO'
    st = None
    for s in hat.findall('statement'):
        if s.get('name') == name: st = s
    out = []
    if st is None: return out
    b = st.find('block')
    while b is not None:
        out.append(b)
        n = b.find('next'); b = n.find('block') if n is not None else None
    return out
def key_stmt(b):
    c = copy.deepcopy(b)
    for n in c.findall('next'): c.remove(n)
    for e in c.iter():
        if 'id' in e.attrib: del e.attrib['id']
    return ET.tostring(c, encoding='unicode')
def hat_key(h):
    t = h.get('type')
    return t + '|' + '|'.join(F(h, n) for n in ('K1', 'K2', 'B', 'EV', 'MS', 'NAME'))
def hats(xml):
    return [b for b in ET.fromstring(xml).findall('block')]
def variables(xml):
    vs = set()
    for f in ET.fromstring(xml).iter('field'):
        if f.get('name') == 'VAR' and f.text: vs.add(f.text)
    for a in ET.fromstring(xml).iter('arg'):
        if a.get('name'): vs.add(a.get('name'))
    return vs
def build_hat(hat, keep, new_idx=None):
    """Recopie du chapeau avec seulement les instructions `keep` ; l'instruction new_idx reçoit id=NEW."""
    h = copy.deepcopy(hat)
    name = 'STACK' if h.get('type', '').startswith('procedures_def') else 'DO'
    for s in list(h.findall('statement')):
        if s.get('name') == name: h.remove(s)
    if keep:
        blocks = []
        for i, b in enumerate(keep):
            c = copy.deepcopy(b)
            for n in c.findall('next'): c.remove(n)
            if i == new_idx: c.set('id', 'NEW')
            blocks.append(c)
        for a, b in zip(blocks, blocks[1:]):
            nx = ET.SubElement(a, 'next'); nx.append(b)
        st = ET.Element('statement', {'name': name}); st.append(blocks[0])
        # la valeur RETURN doit rester après les instructions : on insère la statement au bon endroit
        h.insert(len([c for c in h if c.tag in ('mutation', 'field')]), st)
    return '<xml>' + ET.tostring(h, encoding='unicode') + '</xml>'

def hat_label(h):
    return {'g_start': 'au démarrage', 'g_update': 'à chaque mise à jour du jeu', 'g_interval': 'toutes les %s ms' % F(h, 'MS'), 'g_countend': 'quand le compte à rebours est fini',
            'g_lifezero': 'quand les vies sont à zéro', 'sp_overlap_ev': 'quand %s chevauche %s' % (F(h, 'K1'), F(h, 'K2')), 'ct_button_ev': 'quand le bouton %s est pressé' % F(h, 'B'),
            'procedures_defnoreturn': 'fonction %s' % F(h, 'NAME'), 'procedures_defreturn': 'fonction %s' % F(h, 'NAME')}.get(h.get('type'), 'ce bloc')

def steps_for(prev_xml, sol_xml):
    P = hats(prev_xml); S = hats(sol_xml)
    pv = variables(prev_xml) | {'monSprite'}
    pmap = {}
    for h in P: pmap.setdefault(hat_key(h), h)
    steps = []
    seen_vars = set(pv)
    for h in S:
        k = hat_key(h); sl = stmts(h)
        old = pmap.get(k)
        if old is None:
            c, t = hat_desc(h)
            extra = ''
            if h.get('type') == 'procedures_defnoreturn' or h.get('type') == 'procedures_defreturn':
                mut = h.find('mutation'); args = [a.get('name') for a in mut.findall('arg')] if mut is not None else []
                if args: extra = ' Clique sur sa roue dentée et ajoute l’entrée <b>%s</b>.' % ', '.join(args); seen_vars |= set(args)
                if h.get('type') == 'procedures_defreturn': extra += ' Branche dans « retourner » le bloc de l’image.'
            steps.append(dict(cat=c, t=t + extra + ' Pose-le dans l’espace de travail.', xml=build_hat(h, [] if h.get('type') != 'procedures_defreturn' else [], None) if h.get('type') != 'procedures_defreturn' else '<xml>' + ET.tostring(h, encoding='unicode') + '</xml>', where=''))
            if h.get('type') == 'procedures_defreturn': continue
            for i, b in enumerate(sl):
                bb = nonext(b); vs = {F(x, 'VAR') for x in bb.iter('block') if F(x, 'VAR')} - seen_vars - {'sprite', 'autreSprite', 'monSprite'} - loopvars(bb)
                c, t = stmt_desc(b, vs); seen_vars |= vs
                steps.append(dict(cat=c, t=t + ' Place-le dans ' + q(hat_label(h)) + '.', xml=build_hat(h, sl[:i + 1], i)))
        else:
            if h.get('type', '').startswith('procedures_def'):
                na = [x.get('name') for x in (h.find('mutation').findall('arg') if h.find('mutation') is not None else [])]
                oa = [x.get('name') for x in (old.find('mutation').findall('arg') if old.find('mutation') is not None else [])]
                add = [a for a in na if a not in oa]
                if add:
                    seen_vars |= set(add)
                    steps.append(dict(param=True, cat='Fonctions', t='Clique sur la petite roue dentée de la fonction <b>%s</b> et glisse « nom de l\u2019entrée » dans « entrées » : appelle-la <b>%s</b>. Le bloc <b>%s</b> apparaît alors dans Variables.' % (F(h, 'NAME'), ', '.join(add), add[0]), xml=build_hat(h, [], None)))
            ol = stmts(old); okeys = [key_stmt(b) for b in ol]
            used = set(); news = []
            for i, b in enumerate(sl):
                kk = key_stmt(b)
                j = next((j for j, o in enumerate(okeys) if o == kk and j not in used), None)
                if j is None: news.append(i)
                else: used.add(j)
            removed = len(ol) - len(used)
            for n, i in enumerate(news):
                b = sl[i]
                bb = nonext(b); vs = {F(x, 'VAR') for x in bb.iter('block') if F(x, 'VAR')} - seen_vars - {'sprite', 'autreSprite', 'monSprite'} - loopvars(bb)
                c, t = stmt_desc(b, vs); seen_vars |= vs
                verb = ' Remplace l’ancien bloc par celui-ci, dans ' if (removed > 0 and n == 0) else ' Place-le dans '
                ns = set(news); keep = [j for j in range(len(sl)) if j <= i or j not in ns]
                steps.append(dict(cat=c, t=t + verb + q(hat_label(h)) + ', à l’endroit surligné.', xml=build_hat(h, [sl[j] for j in keep], keep.index(i))))
            if removed > 0 and not news:
                steps.append(dict(cat='Jeu', t='Modifie ' + q(hat_label(h)) + ' pour qu’il ressemble à l’image.', xml=build_hat(h, sl, None)))
    return [x for x in steps if x.get('param')] + [x for x in steps if not x.get('param')]

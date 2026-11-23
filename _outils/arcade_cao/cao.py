# TP et évaluations CAO (moteur CAO Studio existant) — progression 5e / 4e / 3e
import json, re, os, copy
ENGINE = '/home/claude/hubtechnologie/02_tp_cao.html'
_id = [100]
def nid():
    _id[0] += 1; return 'f%d' % _id[0]
TOP = lambda off=0: {'n': [0, 0, 1], 'off': off}
FRONT = {'n': [0, -1, 0], 'off': 0}           # plan de face y = 0 : esquisse (x ; z), matière vers +y
RIGHT = lambda off: {'n': [1, 0, 0], 'off': off}  # plan x = off : esquisse (y ; z)
def R(x, y, w, h): return {'t': 'rect', 'x': x, 'y': y, 'w': w, 'h': h}
def C(cx, cy, d): return {'t': 'circle', 'cx': cx, 'cy': cy, 'd': d}
def OB(cx, cy, L, d, a=0): return {'t': 'oblong', 'cx': cx, 'cy': cy, 'L': L, 'd': d, 'a': a}
def NP(cx, cy, n, d, a=0): return {'t': 'npoly', 'cx': cx, 'cy': cy, 'n': n, 'd': d, 'a': a}
def PL(*pts): return {'t': 'poly', 'pts': [list(p) for p in pts]}
def boss(plane, ents, depth, dir=1): return {'id': nid(), 'op': 'boss', 'sketch': {'plane': plane, 'ents': ents}, 'depth': depth, 'dir': dir, 'thru': False}
def cut(plane, ents, depth, dir=-1, thru=False): return {'id': nid(), 'op': 'cut', 'sketch': {'plane': plane, 'ents': ents}, 'depth': depth, 'dir': dir, 'thru': thru}
def L(a, b, o, t): return {'a': list(a), 'b': list(b), 'o': list(o), 't': str(t)}
def D(c, n, d, ang=60, lead=14): return {'c': list(c), 'n': list(n), 'd': d, 't': 'Ø%s' % str(d).replace('.', ','), 'ang': ang, 'lead': lead}
def TX(at, txt): return {'at': list(at), 'txt': txt}
def QV(texte='Lis le volume de ta pièce dans les Propriétés.', dec=1, **kw): return dict(type='num', texte=texte, unite='cm³', auto='vol', dec=dec, **kw)
def QM(mat, texte=None, dec=1, **kw): return dict(type='num', texte=texte or 'Quelle est la masse de la pièce en %s ?' % mat, unite='g', auto='mass', mat=mat, dec=dec, hint='Choisis le matériau %s dans les Propriétés.' % mat, **kw)
def QN(texte, answer, unite='mm', dec=0, expl='', tol=0.01): return dict(type='num', texte=texte, unite=unite, answer=answer, tolAbs=tol, dec=dec, expl=expl)
def QC(texte, options, answer, expl=''): return dict(type='choice', texte=texte, options=options, answer=answer, expl=expl)
def QO(texte, items): return dict(type='order', texte=texte, items=items)
def MI(titre, pitch, cible, cotes, methode, question=None, **kw):
    d = dict(titre=titre, pitch=pitch, cible=cible, cotes=cotes, methode=methode)
    if question: d['question'] = question
    d.update(kw); return d
CL5 = ['5A', '5B', '5C', '5D', '5E']; CL4 = ['4A', '4B', '4C', '4D', '4E']; CL3 = ['3A', '3B', '3C', '3D', '3E', '3PM']
ESQ = 'Clique sur <b>Nouvelle esquisse</b> et choisis le plan <b>%s</b>.'

# =================== 5e ===================
T5_2 = dict(mode='tp', id='tp_cao5_2', title='TP CAO 2 — Formes et perçages', classes=CL5, fileName='tp-cao-5e-2',
  intro='Cinq pièces avec des cercles, des polygones et des trous. Reproduis la pièce montrée à gauche puis clique sur Vérifier.', missions=[
  MI('Le badge', 'Une plaque de 50 × 30 × 3 avec une fente oblongue pour passer un cordon.',
     [boss(TOP(), [R(0, 0, 50, 30)], 3), cut(TOP(3), [OB(25, 24, 20, 5)], 3, thru=True)],
     [L((0, 0, 0), (50, 0, 0), (0, -10, 0), 50), L((50, 0, 0), (50, 30, 0), (10, 0, 0), 30), L((0, 0, 0), (0, 0, 3), (-7, -7, 0), 3), L((15, 24, 3), (35, 24, 3), (0, 12, 0), 20), TX((25, 15, 8), 'centre de la fente à 6 du bord')],
     ['Bossage d’un rectangle 50 × 30, épaisseur 3.', ESQ % 'Dessus' + ' Outil <b>Oblong</b> : longueur 20, diamètre 5, centre (25 ; 24).', '<b>Enlèvement</b> à travers toute la pièce.'],
     QC('Quel outil d’esquisse dessine une fente aux bouts arrondis ?', ['Rectangle', 'Oblong', 'Polyligne'], 1)),
  MI('L’écrou géant', 'Un hexagone de 30 mm (entre sommets), épaisseur 12, percé au centre d’un trou de Ø16.',
     [boss(TOP(), [NP(15, 15, 6, 30)], 12), cut(TOP(12), [C(15, 15, 16)], 12, thru=True)],
     [TX((15, 15, 24), 'hexagone : Ø30 entre sommets'), L((15, 15, 0), (15, 15, 12), (20, 0, 0), 12), D((15, 15, 12), (0, 0, 1), 16)],
     ['Outil <b>Polygone</b> : 6 côtés, diamètre 30, centre (15 ; 15).', 'Bossage 12.', 'Cercle Ø16 au même centre, enlèvement traversant.'],
     QV(dec=2)),
  MI('La règle', 'Une règle de 150 × 20 × 3, percée d’un trou de Ø6 à 8 mm du bout pour l’accrocher.',
     [boss(TOP(), [R(0, 0, 150, 20)], 3), cut(TOP(3), [C(8, 10, 6)], 3, thru=True)],
     [L((0, 0, 0), (150, 0, 0), (0, -10, 0), 150), L((150, 0, 0), (150, 20, 0), (10, 0, 0), 20), L((0, 0, 0), (0, 0, 3), (-7, -7, 0), 3), L((0, 10, 3), (8, 10, 3), (0, 14, 0), 8), D((8, 10, 3), (0, 0, 1), 6, 120, 16)],
     ['Rectangle 150 × 20, bossage 3.', 'Cercle Ø6 centré en (8 ; 10).', 'Enlèvement traversant.'], QM('PLA')),
  MI('Le dessous de verre', 'Un carré de 80 × 80 × 5. Un trou de Ø20 au centre et 4 trous de Ø10, à 20 mm des bords.',
     [boss(TOP(), [R(0, 0, 80, 80)], 5), cut(TOP(5), [C(40, 40, 20), C(20, 20, 10), C(60, 20, 10), C(20, 60, 10), C(60, 60, 10)], 5, thru=True)],
     [L((0, 0, 0), (80, 0, 0), (0, -10, 0), 80), L((80, 0, 0), (80, 80, 0), (10, 0, 0), 80), L((0, 0, 0), (0, 0, 5), (-7, -7, 0), 5), D((40, 40, 5), (0, 0, 1), 20, 45, 22), D((60, 60, 5), (0, 0, 1), 10, 45, 14), L((0, 20, 5), (20, 20, 5), (0, -26, 0), 20)],
     ['Bossage 80 × 80 × 5.', 'Une seule esquisse sur le dessus avec les 5 cercles.', 'Enlèvement traversant.'],
     QN('Combien de cercles as-tu dessinés dans l’esquisse de l’enlèvement ?', 5, unite='', expl='1 au centre + 4 dans les coins.')),
  MI('Défi : le pot hexagonal', 'Un pot à crayons hexagonal : Ø50 entre sommets, hauteur 60. Le trou intérieur fait Ø36 et laisse un fond de 5 mm.',
     [boss(TOP(), [NP(25, 25, 6, 50)], 60), cut(TOP(60), [C(25, 25, 36)], 55)],
     [TX((25, 25, 75), 'hexagone Ø50 entre sommets'), L((25, 25, 0), (25, 25, 60), (30, 0, 0), 60), D((25, 25, 60), (0, 0, 1), 36), TX((25, -10, 3), 'fond : 5 mm')],
     ['Polygone 6 côtés, Ø50, bossage 60.', 'Cercle Ø36 sur le dessus.', 'Calcule la profondeur de l’enlèvement pour garder 5 mm de fond.'],
     QN('Quelle profondeur as-tu donnée à l’enlèvement ?', 55, expl='60 − 5 = 55 mm.')),
])
T5_3 = dict(mode='tp', id='tp_cao5_3', title='TP CAO 3 — Esquisser sur plusieurs faces', classes=CL5, fileName='tp-cao-5e-3',
  intro='Certaines pièces se dessinent de face, puis se percent par le dessus ou par le côté.', missions=[
  MI('La marche d’escalier', 'Trois marches de 20 mm de profondeur et 15 mm de haut. Largeur 40.',
     [boss(FRONT, [PL((0, 0), (60, 0), (60, 15), (40, 15), (40, 30), (20, 30), (20, 45), (0, 45))], 40, -1)],
     [L((0, 0, 0), (60, 0, 0), (0, 0, -10), 60), L((0, 0, 0), (0, 0, 45), (-10, 0, 0), 45), L((60, 0, 0), (60, 40, 0), (10, 0, 0), 40), L((40, 0, 15), (60, 0, 15), (0, 0, 8), 20), L((60, 0, 0), (60, 0, 15), (8, 0, 0), 15)],
     [ESQ % 'Face', 'Outil <b>Polyligne</b> : dessine le profil des marches point par point, puis ferme-le.', '<b>Bossage</b> de 40.'],
     QC('Sur quel plan dessine-t-on le profil des marches ?', ['Dessus', 'Face', 'Droite'], 1)),
  MI('L’équerre percée', 'Une équerre en L (50 × 40, épaisseur 5, largeur 30), percée d’un trou de Ø6 dans chaque aile.',
     [boss(FRONT, [PL((0, 0), (50, 0), (50, 5), (5, 5), (5, 40), (0, 40))], 30, -1), cut(TOP(5), [C(30, 15, 6)], 5, thru=True), cut(RIGHT(5), [C(15, 25, 6)], 5, thru=True)],
     [L((0, 0, 0), (50, 0, 0), (0, 0, -10), 50), L((0, 0, 0), (0, 0, 40), (-10, 0, 0), 40), L((50, 0, 0), (50, 30, 0), (10, 0, 0), 30), D((30, 15, 5), (0, 0, 1), 6, 60, 16), D((5, 15, 25), (1, 0, 0), 6, 60, 16), TX((30, 15, 14), 'trou à x = 30'), TX((12, 15, 34), 'trou à z = 25')],
     ['Profil en L sur le plan <b>Face</b>, bossage 30.', 'Esquisse sur le <b>dessus de l’aile horizontale</b> : cercle Ø6 en (30 ; 15), enlèvement traversant.', 'Esquisse sur la <b>face intérieure de l’aile verticale</b> : cercle Ø6 en (15 ; 25), enlèvement traversant.'],
     QV(dec=2)),
  MI('Le support de téléphone', 'Une base avec une butée à l’avant et un dossier incliné. Largeur 60.',
     [boss(FRONT, [PL((0, 0), (70, 0), (70, 5), (36, 5), (56, 55), (50, 57), (28, 5), (6, 5), (6, 12), (0, 12))], 60, -1)],
     [L((0, 0, 0), (70, 0, 0), (0, 0, -10), 70), L((0, 0, 0), (0, 0, 12), (-10, 0, 0), 12), L((70, 0, 0), (70, 60, 0), (10, 0, 0), 60), L((70, 0, 0), (70, 0, 57), (14, 0, 0), 57), L((70, 0, 0), (70, 0, 5), (6, 0, 0), 5)],
     ['Plan <b>Face</b>, outil Polyligne : (0;0) (70;0) (70;5) (36;5) (56;55) (50;57) (28;5) (6;5) (6;12) (0;12).', 'Ferme le profil en revenant au point (0 ; 0).', 'Bossage 60.'],
     QM('PLA')),
  MI('La poignée de tiroir', 'Un U renversé de 80 × 25, épaisseur 12. Deux trous de Ø4 traversent les pieds pour les vis.',
     [boss(FRONT, [PL((0, 0), (10, 0), (10, 15), (70, 15), (70, 0), (80, 0), (80, 25), (0, 25))], 12, -1), cut(TOP(25), [C(5, 6, 4), C(75, 6, 4)], 25, thru=True)],
     [L((0, 0, 0), (80, 0, 0), (0, 0, -10), 80), L((0, 0, 0), (0, 0, 25), (-10, 0, 0), 25), L((10, 0, 0), (70, 0, 0), (0, 0, 7), 60), L((80, 0, 0), (80, 0, 15), (8, 0, 0), 15), L((80, 0, 0), (80, 12, 0), (10, 0, 0), 12), D((5, 6, 25), (0, 0, 1), 4, 120, 14)],
     ['Profil en U sur le plan Face, bossage 12.', 'Esquisse sur le dessus : deux cercles Ø4, centres (5 ; 6) et (75 ; 6).', 'Enlèvement traversant.'],
     QN('Quelle est la longueur de l’ouverture sous la poignée ?', 60, expl='80 − 10 − 10 = 60 mm.')),
  MI('Défi : le chevalet', 'Un prisme triangulaire (base 60, hauteur 40, longueur 120) pour poser une étiquette.',
     [boss(FRONT, [PL((0, 0), (60, 0), (30, 40))], 120, -1)],
     [L((0, 0, 0), (60, 0, 0), (0, 0, -10), 60), L((30, 0, 0), (30, 0, 40), (-40, 0, 0), 40), L((60, 0, 0), (60, 120, 0), (10, 0, 0), 120)],
     ['Plan Face, polyligne triangle (0;0), (60;0), (30;40).', 'Bossage 120.'],
     QN('Quel est le volume du chevalet ? (aire du triangle × longueur)', 144, unite='cm³', expl='60 × 40 ÷ 2 = 1200 mm² ; × 120 = 144 000 mm³ = 144 cm³.', tol=1)),
])
T5_4 = dict(mode='tp', id='tp_cao5_4', title='TP CAO 4 — Mini-projet : le mobilier miniature', classes=CL5, fileName='tp-cao-5e-4',
  intro='Modélise le mobilier de la maquette au 1/10. Chaque meuble se construit avec plusieurs bossages empilés.', missions=[
  MI('Le banc', 'Une assise de 80 × 30 × 4 posée sur deux pieds de 8 × 30, hauteur 30.',
     [boss(TOP(), [R(5, 0, 8, 30), R(67, 0, 8, 30)], 30), boss(TOP(30), [R(0, 0, 80, 30)], 4)],
     [L((0, 0, 30), (80, 0, 30), (0, -10, 0), 80), L((80, 0, 34), (80, 30, 34), (10, 0, 0), 30), L((80, 0, 0), (80, 0, 30), (10, -6, 0), 30), L((80, 0, 30), (80, 0, 34), (16, -6, 0), 4), L((5, 0, 0), (13, 0, 0), (0, -10, 0), 8), L((0, 0, 0), (5, 0, 0), (0, -18, 0), 5)],
     ['Esquisse sur le Dessus : deux rectangles 8 × 30 (x = 5 et x = 67). Bossage 30.', 'Nouvelle esquisse sur le <b>dessus des pieds</b> : rectangle 80 × 30. Bossage 4.'],
     QO('Remets les étapes dans l’ordre.', ['Esquisse des pieds sur le plan Dessus', 'Bossage de 30', 'Esquisse de l’assise sur le dessus des pieds', 'Bossage de 4'])),
  MI('La table', 'Un plateau de 60 × 40 × 4 sur quatre pieds de 5 × 5, hauteur 40, placés dans les coins.',
     [boss(TOP(), [R(0, 0, 5, 5), R(55, 0, 5, 5), R(0, 35, 5, 5), R(55, 35, 5, 5)], 40), boss(TOP(40), [R(0, 0, 60, 40)], 4)],
     [L((0, 0, 40), (60, 0, 40), (0, -10, 0), 60), L((60, 0, 44), (60, 40, 44), (10, 0, 0), 40), L((60, 0, 0), (60, 0, 40), (10, -6, 0), 40), L((60, 0, 40), (60, 0, 44), (16, -6, 0), 4), L((0, 0, 0), (5, 0, 0), (0, -10, 0), 5)],
     ['4 carrés de 5 × 5 dans les coins, bossage 40.', 'Plateau 60 × 40 sur le dessus des pieds, bossage 4.'], QM('Bois (pin)')),
  MI('La lampe', 'Un socle de Ø50 × 6, une tige de Ø8 haute de 60 et une tête hexagonale de Ø30, épaisseur 10.',
     [boss(TOP(), [C(25, 25, 50)], 6), boss(TOP(6), [C(25, 25, 8)], 60), boss(TOP(66), [NP(25, 25, 6, 30)], 10)],
     [D((25, 25, 6), (0, 0, 1), 50, 30, 18), L((50, 25, 0), (50, 25, 6), (8, 0, 0), 6), D((25, 25, 40), (0, 0, 1), 8, 0, 16), L((25, 25, 6), (25, 25, 66), (34, 0, 0), 60), TX((25, 25, 86), 'tête : hexagone Ø30, épaisseur 10')],
     ['Socle : cercle Ø50, bossage 6.', 'Tige : cercle Ø8 sur le dessus du socle, bossage 60.', 'Tête : polygone 6 côtés Ø30 sur le haut de la tige, bossage 10.'], QV(dec=2)),
  MI('Défi : le tabouret', 'Une assise ronde de Ø40 × 4, à 35 mm du sol, sur 4 pieds de Ø6 placés à 10 mm du centre en x et en y.',
     [boss(TOP(), [C(10, 10, 6), C(30, 10, 6), C(10, 30, 6), C(30, 30, 6)], 35), boss(TOP(35), [C(20, 20, 40)], 4)],
     [D((20, 20, 39), (0, 0, 1), 40, 30, 18), L((40, 20, 0), (40, 20, 35), (10, 0, 0), 35), L((40, 20, 35), (40, 20, 39), (16, 0, 0), 4), D((30, 30, 18), (0, 0, 1), 6, 0, 14), TX((20, 20, 50), '4 pieds Ø6')],
     ['4 cercles Ø6 en (10 ; 10), (30 ; 10), (10 ; 30), (30 ; 30), bossage 35.', 'Assise Ø40 centrée en (20 ; 20) sur le dessus des pieds, bossage 4.'], QM('ABS')),
])

# =================== 4e ===================
T4_1 = dict(mode='tp', id='tp_cao4_1', title='TP CAO 4e-1 — Lire un dessin technique', classes=CL4, fileName='tp-cao-4e-1',
  intro='Toutes les cotes ne sont pas écrites : certaines se calculent à partir des autres, comme sur un vrai plan.', missions=[
  MI('La plaque de fixation', 'Plaque 80 × 50 × 6. Quatre trous de Ø6 à 8 mm des bords. Au centre, une fente oblongue de longueur 30 et de largeur 8.',
     [boss(TOP(), [R(0, 0, 80, 50)], 6), cut(TOP(6), [C(8, 8, 6), C(72, 8, 6), C(8, 42, 6), C(72, 42, 6), OB(40, 25, 30, 8)], 6, thru=True)],
     [L((0, 0, 0), (80, 0, 0), (0, -10, 0), 80), L((80, 0, 0), (80, 50, 0), (10, 0, 0), 50), L((0, 0, 0), (0, 0, 6), (-7, -7, 0), 6), L((0, 8, 6), (8, 8, 6), (0, -16, 0), 8), D((72, 42, 6), (0, 0, 1), 6, 45, 14), L((25, 25, 6), (55, 25, 6), (0, 10, 0), 30)],
     ['Calcule les coordonnées des centres des trous : 8 mm de chaque bord.', 'Une esquisse sur le dessus : 4 cercles + 1 oblong.', 'Enlèvement traversant.'],
     QN('Quel est l’entraxe horizontal entre deux trous ?', 64, expl='80 − 8 − 8 = 64 mm.')),
  MI('Le profilé en T', 'Un T de largeur 60 et de hauteur 40. L’âme (le pied) fait 20 de large, centrée ; le chapeau fait 10 d’épaisseur. Longueur 25.',
     [boss(FRONT, [PL((20, 0), (40, 0), (40, 30), (60, 30), (60, 40), (0, 40), (0, 30), (20, 30))], 25, -1)],
     [L((0, 0, 40), (60, 0, 40), (0, 0, 10), 60), L((60, 0, 0), (60, 0, 40), (10, 0, 0), 40), L((20, 0, 0), (40, 0, 0), (0, 0, -10), 20), L((0, 0, 30), (0, 0, 40), (-10, 0, 0), 10), L((60, 0, 0), (60, 25, 0), (12, 0, 0), 25)],
     ['Calcule où commence l’âme : (60 − 20) ÷ 2.', 'Plan Face, polyligne du T.', 'Bossage 25.'],
     QN('À quelle abscisse x commence l’âme ?', 20, expl='(60 − 20) ÷ 2 = 20 mm.')),
  MI('Le palier', 'Un socle 60 × 30 × 10 surmonté d’un bloc de 30 × 30, hauteur totale 40, centré. Un alésage de Ø16 le traverse, son axe est à 28 mm du sol. Deux trous de Ø6 dans le socle, à 7 mm des bords.',
     [boss(TOP(), [R(0, 0, 60, 30)], 10), boss(TOP(10), [R(15, 0, 30, 30)], 30), cut(FRONT, [C(30, 28, 16)], 30, thru=True), cut(TOP(10), [C(7, 15, 6), C(53, 15, 6)], 10, thru=True)],
     [L((0, 0, 0), (60, 0, 0), (0, 0, -10), 60), L((60, 0, 0), (60, 30, 0), (10, 0, 0), 30), L((60, 30, 0), (60, 30, 10), (8, 0, 0), 10), L((15, 0, 40), (45, 0, 40), (0, 0, 8), 30), L((0, 0, 0), (0, 0, 40), (-10, 0, 0), 40), D((30, 0, 28), (0, -1, 0), 16, 30, 18), L((0, 0, 28), (30, 0, 28), (0, 0, 0), ''), TX((30, -6, 50), 'axe de l’alésage à 28 du sol'), D((53, 15, 10), (0, 0, 1), 6, 45, 14)],
     ['Socle 60 × 30 × 10.', 'Bloc 30 × 30 centré sur le socle (x de 15 à 45), bossage 30.', 'Plan <b>Face</b> : cercle Ø16 en (30 ; 28), enlèvement traversant.', 'Trous Ø6 du socle depuis son dessus.'],
     QV(dec=2)),
  MI('Le guide en U', 'Un profilé en U de 50 × 30 : la rainure fait 30 de large et 20 de profondeur. Longueur 80.',
     [boss(FRONT, [PL((0, 0), (50, 0), (50, 30), (40, 30), (40, 10), (10, 10), (10, 30), (0, 30))], 80, -1)],
     [L((0, 0, 0), (50, 0, 0), (0, 0, -10), 50), L((50, 0, 0), (50, 0, 30), (10, 0, 0), 30), L((10, 0, 30), (40, 0, 30), (0, 0, 8), 30), L((0, 0, 10), (0, 0, 30), (-10, 0, 0), 20), L((50, 0, 0), (50, 80, 0), (12, 0, 0), 80)],
     ['Épaisseur des flancs : (50 − 30) ÷ 2. Épaisseur du fond : 30 − 20.', 'Plan Face, polyligne du U, bossage 80.'], QM('Aluminium')),
  MI('Défi : la bride', 'Un disque de Ø70 × 8 et un moyeu central de Ø30 qui dépasse de 12. Alésage de Ø16 traversant. Quatre trous de Ø8 sur un cercle de Ø50.',
     [boss(TOP(), [C(35, 35, 70)], 8), boss(TOP(8), [C(35, 35, 30)], 12), cut(TOP(20), [C(35, 35, 16)], 20, thru=True), cut(TOP(8), [C(10, 35, 8), C(60, 35, 8), C(35, 10, 8), C(35, 60, 8)], 8, thru=True)],
     [D((35, 35, 8), (0, 0, 1), 70, 210, 18), D((35, 35, 20), (0, 0, 1), 30, 30, 18), D((35, 35, 20), (0, 0, 1), 16, 120, 18), TX((35, 35, 34), '4 trous Ø8 sur un cercle de Ø50'), L((70, 35, 0), (70, 35, 8), (8, 0, 0), 8), L((70, 35, 8), (70, 35, 20), (16, 0, 0), 12)],
     ['Disque Ø70 × 8, puis moyeu Ø30 de 12 sur le dessus.', 'Les trous Ø8 sont à 25 mm du centre (rayon du cercle de Ø50).', 'Calcule leurs coordonnées : centre (35 ; 35) ± 25.'],
     QN('À quelle distance du centre sont les trous Ø8 ?', 25, expl='Cercle de Ø50 → rayon 25 mm.')),
])
T4_2 = dict(mode='tp', id='tp_cao4_2', title='TP CAO 4e-2 — Matériaux et masse', classes=CL4, fileName='tp-cao-4e-2',
  intro='Le logiciel calcule le volume ; la masse dépend du matériau choisi (masse = volume × masse volumique).', missions=[
  MI('Le lingot', 'Un lingot de 50 × 25 × 10.', [boss(TOP(), [R(0, 0, 50, 25)], 10)],
     [L((0, 0, 0), (50, 0, 0), (0, -10, 0), 50), L((50, 0, 0), (50, 25, 0), (10, 0, 0), 25), L((0, 0, 0), (0, 0, 10), (-7, -7, 0), 10)],
     ['Bossage 50 × 25 × 10.', 'Dans Propriétés, choisis <b>Aluminium</b> et lis la masse.'], QM('Aluminium', dec=1)),
  MI('La même pièce en acier', 'Même lingot : compare sa masse en acier.', [boss(TOP(), [R(0, 0, 50, 25)], 10)],
     [L((0, 0, 0), (50, 0, 0), (0, -10, 0), 50), L((50, 0, 0), (50, 25, 0), (10, 0, 0), 25), L((0, 0, 0), (0, 0, 10), (-7, -7, 0), 10)],
     ['Refais le lingot (ou garde-le).', 'Change le matériau en <b>Acier</b>.'],
     QC('Le lingot en acier est environ combien de fois plus lourd qu’en aluminium ?', ['1,5 fois', '3 fois', '7 fois'], 1, '7,85 ÷ 2,70 ≈ 2,9.')),
  MI('La roue de trottinette', 'Une roue de Ø100, largeur 24, avec un alésage de Ø8 et un évidement de Ø70 profond de 8 sur chaque face.',
     [boss(TOP(), [C(50, 50, 100)], 24), cut(TOP(24), [C(50, 50, 70)], 8), boss(TOP(16), [C(50, 50, 20)], 8), cut(TOP(24), [C(50, 50, 8)], 24, thru=True)],
     [D((50, 50, 24), (0, 0, 1), 100, 210, 18), L((100, 50, 0), (100, 50, 24), (10, 0, 0), 24), D((50, 50, 16), (0, 0, 1), 70, 30, 16), D((50, 50, 24), (0, 0, 1), 20, 120, 22), D((50, 50, 24), (0, 0, 1), 8, 300, 26), TX((50, 50, 40), 'évidement : profondeur 8')],
     ['Disque Ø100 × 24.', 'Enlèvement Ø70 profond de 8 sur le dessus.', 'Remets un moyeu Ø20 au fond de l’évidement (bossage 8).', 'Alésage Ø8 traversant.'], QM('PLA')),
  MI('Alléger une pièce', 'Une semelle en aluminium de 100 × 60 × 10. On creuse une poche de 80 × 40, profonde de 6, centrée.',
     [boss(TOP(), [R(0, 0, 100, 60)], 10), cut(TOP(10), [R(10, 10, 80, 40)], 6)],
     [L((0, 0, 0), (100, 0, 0), (0, -10, 0), 100), L((100, 0, 0), (100, 60, 0), (10, 0, 0), 60), L((0, 0, 0), (0, 0, 10), (-7, -7, 0), 10), L((10, 10, 10), (90, 10, 10), (0, -4, 0), 80), TX((50, 30, 16), 'poche 80 × 40, profonde de 6')],
     ['Semelle 100 × 60 × 10.', 'Poche centrée : rectangle 80 × 40 à 10 mm des bords, enlèvement de 6.'],
     QN('Combien de grammes la poche fait-elle gagner en aluminium ? (volume enlevé × 2,70)', 51.84, unite='g', dec=2, expl='80 × 40 × 6 = 19 200 mm³ = 19,2 cm³ ; × 2,70 = 51,84 g.', tol=0.5)),
  MI('Défi : le contrepoids', 'Un contrepoids en acier de 50 × 40 doit peser 157 g. Calcule son épaisseur, puis modélise-le.',
     [boss(TOP(), [R(0, 0, 50, 40)], 10)],
     [L((0, 0, 0), (50, 0, 0), (0, -10, 0), 50), L((50, 0, 0), (50, 40, 0), (10, 0, 0), 40), L((0, 0, 0), (0, 0, 10), (-7, -7, 0), '?')],
     ['Volume = masse ÷ masse volumique = 157 ÷ 7,85.', 'Épaisseur = volume ÷ aire de la base (5 cm × 4 cm).'],
     QN('Quelle épaisseur trouves-tu ?', 10, expl='157 ÷ 7,85 = 20 cm³ ; 20 ÷ 20 cm² = 1 cm = 10 mm.')),
])
def fixm(titre, pitch, cible, start, cotes, err, q=None):
    return MI(titre, pitch, cible, cotes, ['Compare la pièce affichée au dessin : ' + err, 'Dans l’arbre, clique sur la fonction fautive puis sur <b>Esquisse</b> (ou sur la fonction) pour corriger.', 'Clique sur <b>Vérifier ma pièce</b>.'], q, start=start)
T4_3 = dict(mode='tp', id='tp_cao4_3', title='TP CAO 4e-3 — Corriger un modèle', classes=CL4, fileName='tp-cao-4e-3',
  intro='Un camarade a modélisé ces pièces mais s’est trompé. Trouve les erreurs en comparant au dessin et corrige-les dans l’arbre.', missions=[
  fixm('La cale', 'La cale doit mesurer 60 × 30 × 12.', [boss(TOP(), [R(0, 0, 60, 30)], 12)], [boss(TOP(), [R(0, 0, 60, 30)], 15)],
       [L((0, 0, 0), (60, 0, 0), (0, -10, 0), 60), L((60, 0, 0), (60, 30, 0), (10, 0, 0), 30), L((0, 0, 0), (0, 0, 12), (-7, -7, 0), 12)], 'une seule cote est fausse.', QN('Quelle épaisseur était fausse ?', 15)),
  fixm('La plaque percée', 'Plaque 70 × 40 × 5, trou de Ø10 au centre.', [boss(TOP(), [R(0, 0, 70, 40)], 5), cut(TOP(5), [C(35, 20, 10)], 5, thru=True)],
       [boss(TOP(), [R(0, 0, 70, 40)], 5), cut(TOP(5), [C(30, 20, 10)], 5, thru=True)],
       [L((0, 0, 0), (70, 0, 0), (0, -10, 0), 70), L((70, 0, 0), (70, 40, 0), (10, 0, 0), 40), D((35, 20, 5), (0, 0, 1), 10), TX((35, 20, 12), 'trou au centre')], 'le trou n’est pas au centre.'),
  fixm('L’équerre', 'Équerre en L : 40 × 35, épaisseur 4, largeur 20.', [boss(FRONT, [PL((0, 0), (40, 0), (40, 4), (4, 4), (4, 35), (0, 35))], 20, -1)],
       [boss(FRONT, [PL((0, 0), (40, 0), (40, 6), (6, 6), (6, 35), (0, 35))], 25, -1)],
       [L((0, 0, 0), (40, 0, 0), (0, 0, -10), 40), L((0, 0, 0), (0, 0, 35), (-10, 0, 0), 35), L((40, 0, 0), (40, 20, 0), (10, 0, 0), 20), L((40, 0, 0), (40, 0, 4), (8, 0, 0), 4)], 'deux erreurs : l’épaisseur et la largeur.'),
  fixm('Défi : le support de capteur', 'Socle 50 × 30 × 6 avec une colonne Ø12 haute de 30 au centre, percée de Ø5 sur toute la hauteur.',
       [boss(TOP(), [R(0, 0, 50, 30)], 6), boss(TOP(6), [C(25, 15, 12)], 30), cut(TOP(36), [C(25, 15, 5)], 36, thru=True)],
       [boss(TOP(), [R(0, 0, 50, 30)], 6), boss(TOP(6), [C(25, 15, 16)], 24), cut(TOP(30), [C(25, 15, 5)], 10)],
       [L((0, 0, 0), (50, 0, 0), (0, -10, 0), 50), L((50, 0, 0), (50, 30, 0), (10, 0, 0), 30), L((50, 30, 0), (50, 30, 6), (8, 0, 0), 6), D((25, 15, 20), (0, 0, 1), 12, 0, 16), L((25, 15, 6), (25, 15, 36), (24, 0, 0), 30), D((25, 15, 36), (0, 0, 1), 5, 120, 14), TX((25, 15, 46), 'trou sur toute la hauteur')],
       'trois erreurs : diamètre et hauteur de la colonne, profondeur du trou.'),
])
T4_4 = dict(mode='tp', id='tp_cao4_4', title='TP CAO 4e-4 — Concevoir selon un cahier des charges', classes=CL4, fileName='tp-cao-4e-4',
  intro='Pas de dessin complet : les dimensions sont données dans le cahier des charges. À toi de concevoir la pièce.', missions=[
  MI('Le support de piles', 'Cahier des charges : bloc de 60 × 25 × 40. Trois logements Ø15 profonds de 35, alignés au milieu de la largeur, espacés de 20 mm, le premier à 10 mm du bord.',
     [boss(TOP(), [R(0, 0, 60, 25)], 40), cut(TOP(40), [C(10, 12.5, 15), C(30, 12.5, 15), C(50, 12.5, 15)], 35)],
     [L((0, 0, 0), (60, 0, 0), (0, -10, 0), 60), L((60, 0, 0), (60, 25, 0), (10, 0, 0), 25), L((0, 0, 0), (0, 0, 40), (-7, -7, 0), 40), TX((30, 12.5, 52), '3 logements Ø15')],
     ['Centres des logements : x = 10, 30, 50 ; y = 12,5.', 'Enlèvement de 35 depuis le dessus.'],
     QN('Quelle épaisseur de fond reste sous les piles ?', 5, expl='40 − 35 = 5 mm.')),
  MI('Le porte-crayons empilable', 'Cahier des charges : cylindre Ø60, hauteur 50, parois de 3 mm, fond de 4 mm.',
     [boss(TOP(), [C(30, 30, 60)], 50), cut(TOP(50), [C(30, 30, 54)], 46)],
     [D((30, 30, 50), (0, 0, 1), 60, 30, 18), L((60, 30, 0), (60, 30, 50), (10, 0, 0), 50), TX((30, 30, 62), 'parois 3 mm, fond 4 mm')],
     ['Diamètre intérieur = 60 − 2 × 3.', 'Profondeur = 50 − 4.'],
     QN('Quel diamètre intérieur as-tu calculé ?', 54, expl='60 − 2 × 3 = 54 mm.')),
  MI('La boîte de rangement', 'Cahier des charges : boîte de 80 × 50 × 30, parois de 2,5 mm, fond de 3 mm, et deux compartiments séparés par une cloison de 2 mm au milieu de la longueur.',
     [boss(TOP(), [R(0, 0, 80, 50)], 30), cut(TOP(30), [R(2.5, 2.5, 36.5, 45), R(41, 2.5, 36.5, 45)], 27)],
     [L((0, 0, 0), (80, 0, 0), (0, -10, 0), 80), L((80, 0, 0), (80, 50, 0), (10, 0, 0), 50), L((0, 0, 0), (0, 0, 30), (-7, -7, 0), 30), TX((40, 25, 40), 'parois 2,5 · fond 3')],
     ['Longueur d’un compartiment : (80 − 2,5 − 2,5 − 2) ÷ 2.', 'Deux rectangles dans la même esquisse, enlèvement de 27.'],
     QN('Quelle est la longueur intérieure d’un compartiment ?', 36.5, dec=1, expl='(80 − 5 − 2) ÷ 2 = 36,5 mm.')),
  MI('Défi : le crochet mural', 'Cahier des charges : profil vu de face, épaisseur 15. Plaque murale 8 × 50 ; bras horizontal de 40 sur 8 en bas ; ergot vertical de 8 × 15 au bout du bras. Deux trous de Ø5 dans la plaque, à 12 et 38 mm du bas.',
     [boss(FRONT, [PL((0, 0), (48, 0), (48, 23), (40, 23), (40, 8), (8, 8), (8, 50), (0, 50))], 15, -1), cut(RIGHT(8), [C(7.5, 30, 5), C(7.5, 42, 5)], 8, thru=True)],
     [L((0, 0, 0), (48, 0, 0), (0, 0, -10), 48), L((0, 0, 0), (0, 0, 50), (-10, 0, 0), 50), L((48, 0, 0), (48, 15, 0), (10, 0, 0), 15), L((48, 0, 8), (48, 0, 23), (8, 0, 0), 15), TX((8, 7.5, 58), 'trous Ø5 à 30 et 42 du bas')],
     ['Profil en J sur le plan Face (8 + 40 = 48 de long).', 'Les trous sont sur la face intérieure de la plaque (plan x = 8).'], QM('ABS')),
])
for m in T4_4['missions'][3:]:
    m['pitch'] = m['pitch'].replace('à 12 et 38 mm du bas', 'à 30 et 42 mm du bas')

# =================== 3e ===================
T3_1 = dict(mode='tp', id='tp_cao3_1', title='TP CAO 3e-1 — Pièces mécaniques', classes=CL3, fileName='tp-cao-3e-1',
  intro='Des pièces de mécanique réelles, en plusieurs fonctions et sur plusieurs plans.', missions=[
  MI('La chape', 'Une base 50 × 30 × 8 et deux flasques de 6 × 30, hauteur totale 40, à l’intérieur des bords. Un axe Ø8 traverse les flasques à 30 mm du sol. Deux trous Ø6 dans la base.',
     [boss(TOP(), [R(0, 0, 50, 30)], 8), boss(TOP(8), [R(8, 0, 6, 30), R(36, 0, 6, 30)], 32), cut(RIGHT(42), [C(15, 30, 8)], 42, thru=True), cut(TOP(8), [C(25, 8, 6), C(25, 22, 6)], 8, thru=True)],
     [L((0, 0, 0), (50, 0, 0), (0, -10, 0), 50), L((50, 0, 0), (50, 30, 0), (10, 0, 0), 30), L((50, 30, 0), (50, 30, 40), (8, 0, 0), 40), L((8, 0, 40), (14, 0, 40), (0, -8, 6), 6), L((14, 0, 40), (36, 0, 40), (0, -8, 6), 22), D((42, 15, 30), (1, 0, 0), 8, 45, 16), D((25, 22, 8), (0, 0, 1), 6, 60, 14)],
     ['Base 50 × 30 × 8.', 'Deux flasques sur la base : x de 8 à 14 et de 36 à 42, bossage 32.', 'Axe : esquisse sur la face extérieure du flasque droit (plan x = 42), cercle Ø8 en (15 ; 30), enlèvement traversant.'],
     QV(dec=2)),
  MI('Le boîtier de capteur', 'Un boîtier 60 × 40 × 25, parois et fond de 2. Une ouverture oblongue (longueur 20, largeur 6) sur la face avant pour le câble, à 10 mm du bas.',
     [boss(TOP(), [R(0, 0, 60, 40)], 25), cut(TOP(25), [R(2, 2, 56, 36)], 23), cut(FRONT, [OB(30, 10, 20, 6)], 2, thru=True)],
     [L((0, 0, 0), (60, 0, 0), (0, -10, 0), 60), L((60, 0, 0), (60, 40, 0), (10, 0, 0), 40), L((0, 0, 0), (0, 0, 25), (-7, -7, 0), 25), TX((30, 20, 34), 'parois et fond : 2'), TX((30, -8, 10), 'oblong 20 × 6, centre à 10 du bas')],
     ['Bloc puis poche (parois 2, fond 2).', 'Plan Face : oblong centré en (30 ; 10), enlèvement traversant (la paroi seulement).'], QM('ABS')),
  MI('La poulie', 'Une poulie Ø60, épaisseur 20, avec une gorge : le fond de gorge fait Ø46 sur 8 mm de large, au milieu de l’épaisseur. Alésage Ø10.',
     [boss(TOP(), [C(30, 30, 60)], 6), boss(TOP(6), [C(30, 30, 46)], 8), boss(TOP(14), [C(30, 30, 60)], 6), cut(TOP(20), [C(30, 30, 10)], 20, thru=True)],
     [D((30, 30, 20), (0, 0, 1), 60, 30, 18), L((60, 30, 0), (60, 30, 20), (12, 0, 0), 20), D((30, 30, 10), (0, 0, 1), 46, 200, 14), L((60, 30, 6), (60, 30, 14), (6, 0, 0), 8), D((30, 30, 20), (0, 0, 1), 10, 120, 22)],
     ['Joue du bas : Ø60 × 6.', 'Fond de gorge : Ø46 × 8 sur la joue.', 'Joue du haut : Ø60 × 6.', 'Alésage Ø10 traversant.'],
     QN('Quelle est la profondeur de la gorge ?', 7, expl='(60 − 46) ÷ 2 = 7 mm.')),
  MI('Défi : le support moteur', 'Une plaque 60 × 50 × 5 et une équerre verticale 60 × 5, hauteur totale 45, sur l’arrière. Sur l’équerre : un passage Ø22 pour l’axe (centre à 25 du sol, au milieu) et deux trous Ø3 à ± 15 mm du centre. Dans la plaque : deux trous oblongs (longueur 10, largeur 5) pour régler la position.',
     [boss(TOP(), [R(0, 0, 60, 50)], 5), boss(TOP(5), [R(0, 45, 60, 5)], 40), cut(FRONT, [C(30, 25, 22), C(15, 25, 3), C(45, 25, 3)], 50, thru=True), cut(TOP(5), [OB(15, 20, 10, 5), OB(45, 20, 10, 5)], 5, thru=True)],
     [L((0, 0, 0), (60, 0, 0), (0, -10, 0), 60), L((60, 0, 0), (60, 50, 0), (10, 0, 0), 50), L((60, 50, 0), (60, 50, 45), (8, 0, 0), 45), D((30, 50, 25), (0, 1, 0), 22, 30, 18), L((15, 50, 25), (45, 50, 25), (0, 4, 14), 30), TX((30, 20, 12), '2 oblongs 10 × 5')],
     ['Plaque 60 × 50 × 5, puis équerre (y de 45 à 50), bossage 40.', 'Plan Face : passage Ø22 et trous Ø3, enlèvement traversant.', 'Oblongs 10 × 5 dans la plaque, centrés en (15 ; 20) et (45 ; 20).'], QM('Aluminium')),
])
EOF_MARK = True

def build_cao(cfg, out):
    s = open(ENGINE, encoding='utf-8').read()
    i = s.index('\nconst CFG = {'); j = s.index('\n', i + 1)
    c = dict(discipline='Technologie · ESTIC', calc=False); c.update(cfg)
    s = s[:i] + '\nconst CFG = ' + json.dumps(c, ensure_ascii=False) + ';' + s[j:]
    s = s.replace('<div class="eb-title">TP CAO — Mes premières pièces en 3D</div>', '<div class="eb-title">%s</div>' % cfg['title'], 1)
    t = re.search(r'<title>.*?</title>', s)
    s = s.replace(t.group(0), '<title>%s · ESTIC</title>' % cfg['title'], 1)
    open(out, 'w', encoding='utf-8').write(s); return out

# ---------- 3e : simulation ----------
def console(t, w=30, Lg=60, H=60): return [boss(FRONT, [PL((0, 0), (Lg, 0), (Lg, t), (t, t), (t, H), (0, H))], w, -1)]
def cot_console(t): return [L((0, 0, 0), (60, 0, 0), (0, 0, -10), 60), L((0, 0, 0), (0, 0, 60), (-10, 0, 0), 60), L((60, 0, 0), (60, 30, 0), (10, 0, 0), 30), L((60, 0, 0), (60, 0, t), (8, 0, 0), t)]
SIMSTEPS = lambda F, extra='': ['Ouvre <b>Simulation</b>. Encastrement : la <b>face arrière</b> (contre le mur, x = 0).', 'Effort : la <b>face du dessus</b> de l’aile horizontale, F = %d N, direction <b>−Z</b>.' % F, 'Lance le calcul (Rapide ou Précis) et lis le coefficient de sécurité s.' + extra]
T3_2 = dict(mode='tp', id='tp_cao3_2', title='TP CAO 3e-2 — Simulation : la pièce va-t-elle tenir ?', classes=CL3, fileName='tp-cao-3e-2', sim=True,
  intro='Le logiciel calcule les contraintes dans la pièce. Le coefficient de sécurité s = Re ÷ σmax doit être assez grand.', missions=[
  MI('La console en PLA', 'Une console d’étagère en L (60 × 60, épaisseur 6, largeur 30), imprimée en PLA, porte 200 N.',
     console(6), cot_console(6), ['Modélise la console (profil en L sur le plan Face, bossage 30).', 'Matériau : PLA.'] + SIMSTEPS(200),
     QC('La console est-elle assez sûre (s ≥ 2) ?', ['Oui, s ≥ 2', 'Non, s < 2'], 1, 's ≈ 1,5 à 1,7 : trop juste pour une étagère.'), sim=dict(mat='PLA', F=200, vmax=31, tol=0.2), mat=0),
  MI('Choisir le matériau', 'La même console doit porter 600 N avec s ≥ 1,9. Trouve un matériau qui convient.',
     console(6), cot_console(6), ['Garde la console de 6 mm.'] + SIMSTEPS(600, ' Change de matériau dans Propriétés et relance le calcul.'),
     QC('Parmi les matériaux qui conviennent, lequel est le plus léger ?', ['Acier', 'Aluminium', 'Fonte'], 1, 'Aluminium : 2,70 g/cm³ contre 7,85 pour l’acier.'), sim=dict(F=600, vmax=94, tol=0.2, minS=1.9)),
  MI('Renforcer la pièce', 'On garde le PLA (pas cher, imprimable) pour 600 N. Il faut s ≥ 1,4 : épaissis la console à 10 mm.',
     console(10), cot_console(10), ['Modifie l’épaisseur du profil : 10 mm.', 'Matériau : PLA.'] + SIMSTEPS(600),
     QC('Pourquoi la console de 10 mm résiste mieux ?', ['Le PLA devient plus solide', 'La section est plus grande, la contrainte diminue', 'L’effort est plus petit'], 1), sim=dict(mat='PLA', F=600, vmax=31.5, tol=0.2, minS=1.4), mat=0),
  MI('Défi : le crochet de charge', 'Le crochet mural du TP de 4e, en ABS, épaisseur 15, doit porter 100 N avec s ≥ 3.',
     [boss(FRONT, [PL((0, 0), (48, 0), (48, 23), (40, 23), (40, 8), (8, 8), (8, 50), (0, 50))], 15, -1)],
     [L((0, 0, 0), (48, 0, 0), (0, 0, -10), 48), L((0, 0, 0), (0, 0, 50), (-10, 0, 0), 50), L((48, 0, 0), (48, 15, 0), (10, 0, 0), 15), L((48, 0, 8), (48, 0, 23), (8, 0, 0), 15), L((8, 0, 0), (8, 0, 8), (0, 0, 0), '')],
     ['Profil en J : (0;0) (48;0) (48;23) (40;23) (40;8) (8;8) (8;50) (0;50), bossage 15.', 'Matériau : ABS.', 'Encastrement : face arrière (x = 0). Effort : dessus du bras (z = 8), 100 N, direction −Z.'],
     QM('ABS'), sim=dict(mat='ABS', F=100, vmax=11.6, tol=0.2, minS=3), mat=1),
])

# ---------- 3e : assemblage bielle-manivelle ----------
MANI = [boss(TOP(), [OB(10, 0, 20, 14)], 5), cut(TOP(5), [C(0, 0, 5), C(20, 0, 5)], 5, thru=True)]
LIB = [dict(name='Bâti', features=[boss(TOP(), [R(-20, -15, 130, 30)], 4)]),
       dict(name='Bielle', features=[boss(TOP(10), [OB(30, 0, 60, 12)], 4), cut(TOP(14), [C(0, 0, 5), C(60, 0, 5)], 4, thru=True)]),
       dict(name='Piston', features=[boss(TOP(4), [R(-10, -8, 20, 16)], 12)])]
ASMSTEPS = ['Onglet <b>Assemblage</b>. Insère d’abord le <b>Bâti</b> (il devient la pièce fixe), puis ta manivelle (« Pièce en cours »), la <b>Bielle</b> et le <b>Piston</b>.',
            'Positions : manivelle x = 0, z = 4 ; bielle x = 20 ; piston x = 80.',
            'Liaisons : pivot Bâti–Manivelle en (0 ; 0), <b>motorisée</b> ; pivot Manivelle–Bielle en (20 ; 0) ; pivot Bielle–Piston en (80 ; 0) ; glissière Bâti–Piston, direction 0°.',
            'Clique sur <b>Calculer un tour</b> puis <b>Animer</b>.']
T3_3 = dict(mode='tp', id='tp_cao3_3', title='TP CAO 3e-3 — Assemblage : le système bielle-manivelle', classes=CL3, fileName='tp-cao-3e-3', asm=True, library=LIB,
  intro='Dans un moteur, la bielle transforme la rotation de la manivelle en translation du piston. Tu vas l’assembler et le faire tourner.', missions=[
  MI('La manivelle', 'Un oblong de 20 mm entre centres, largeur 14, épaisseur 5, percé de deux trous de Ø5. Le premier trou est sur l’origine.',
     MANI, [L((0, -7, 5), (20, -7, 5), (0, -12, 0), 20), TX((10, 0, 14), 'oblong largeur 14, épaisseur 5'), D((20, 0, 5), (0, 0, 1), 5, 30, 14)],
     ['Plan Dessus, outil Oblong : centre (10 ; 0), longueur 20, diamètre 14. Bossage 5.', 'Deux cercles Ø5 en (0 ; 0) et (20 ; 0), enlèvement traversant.'],
     QN('Quelle est la distance entre les centres des trous ?', 20, expl='C’est le rayon de la manivelle : R = 20 mm.')),
  MI('Le mécanisme complet', 'Assemble bâti, manivelle, bielle et piston. Le piston doit faire des allers-retours.',
     MANI, [], ASMSTEPS, QN('Quelle est la course du piston (distance parcourue entre ses deux positions extrêmes) ?', 40, expl='Course = 2 × R = 2 × 20 = 40 mm.'),
     ws='asm', useModelOf=0, asmCheck=dict(part=True, course=dict(name='Piston', axis=0, value=40, tol=1))),
  MI('Le moteur', 'Règle la vitesse du moteur sur 120 tr/min.',
     MANI, [], ['Reste dans l’onglet Assemblage.', 'Règle la vitesse moteur : 120 tr/min.', 'Recalcule un tour.'],
     QN('Combien d’allers-retours le piston fait-il par seconde ?', 2, unite='', expl='120 tr/min ÷ 60 = 2 tours par seconde, donc 2 allers-retours.'),
     ws='asm', useModelOf=0, asmCheck=dict(part=True, N=120, course=dict(name='Piston', axis=0, value=40, tol=1))),
])

# ---------- 3e : projet ----------
PV = [(0, 0), (8, 0), (8, 56), (120, 56), (120, 88), (112, 88), (112, 72), (8, 72), (8, 80), (0, 80)]
V1 = [boss(FRONT, [PL(*PV)], 30, -1), cut(RIGHT(8), [C(15, 15, 6), C(15, 35, 6)], 8, thru=True)]
V2 = V1 + [cut(FRONT, [OB(60, 64, 50, 8)], 30, thru=True)]
CV = [L((0, 0, 0), (0, 0, 80), (-10, 0, 0), 80), L((8, 0, 56), (120, 0, 56), (0, 0, -8), 112), L((120, 0, 56), (120, 0, 72), (8, 0, 0), 16), L((120, 0, 72), (120, 0, 88), (8, 0, 0), 16),
      L((0, 0, 0), (8, 0, 0), (0, 0, -8), 8), L((120, 0, 0), (120, 30, 0), (10, 0, 0), 30), TX((8, 15, 46), 'trous Ø6 à z = 15 et 35')]
T3_4 = dict(mode='tp', id='tp_cao3_4', title='TP CAO 3e-4 — Projet : le support de vélo mural', classes=CL3, fileName='tp-cao-3e-4', sim=True, defaultMat=1,
  intro='Un client veut un support mural en ABS pour accrocher 2 vélos (300 N). Modélise, vérifie la résistance, puis allège la pièce.', missions=[
  MI('Modéliser le support', 'Plaque murale 8 × 80, bras de 112 sur 16 et crochet de 16 en bout. Épaisseur 30. Deux trous Ø6 pour les vis.',
     V1, CV, ['Plan Face, polyligne : (0;0) (8;0) (8;56) (120;56) (120;88) (112;88) (112;72) (8;72) (8;80) (0;80). Bossage 30.', 'Trous Ø6 sur la face intérieure de la plaque (plan x = 8), en (15 ; 15) et (15 ; 35).'],
     QM('ABS'), mat=1),
  MI('Vérifier la résistance', 'Le support doit porter 300 N (2 vélos) avec s ≥ 2.',
     V1, CV, ['Garde la pièce de la mission 1, matériau ABS.', 'Encastrement : face arrière (x = 0). Effort : dessus du bras (z = 72), 300 N, direction −Z.', 'Lance le calcul.'],
     QC('Où la contrainte est-elle la plus forte ?', ['Au bout du crochet', 'À la jonction bras / plaque murale', 'Au milieu des trous'], 1, 'Le bras agit comme un levier : la contrainte est maximale à l’encastrement du bras.'),
     sim=dict(mat='ABS', F=300, vmax=13.1, tol=0.2, minS=2), useModelOf=0, mat=1),
  MI('Alléger le support', 'Une fenêtre oblongue (longueur 50, largeur 8) dans le bras économise de la matière. La pièce doit encore tenir : s ≥ 2.',
     V2, CV + [TX((60, -8, 64), 'fenêtre 50 × 8 au centre du bras')], ['Plan Face : oblong centré en (60 ; 64), longueur 50, diamètre 8. Enlèvement traversant.', 'Relance la simulation (mêmes réglages).'],
     QC('Après l’allègement, s a…', ['augmenté', 'diminué, mais reste ≥ 2', 'diminué sous 2'], 1), sim=dict(mat='ABS', F=300, vmax=18.2, tol=0.15, minS=2), mat=1),
  MI('Bilan matière', 'Compare la masse avant et après allègement.',
     V2, CV, ['Lis la masse de la pièce allégée en ABS dans les Propriétés.'], QM('ABS', texte='Quelle est la masse du support allégé en ABS ?'), useModelOf=2, mat=1),
])

# ---------- évaluations ----------
EVC4 = dict(mode='eval', id='eval_cao_4e', fbNode='eval_cao_4e', fbEvalPath='evaluations/cao_4e', lockCode='PROFIL4', title='Évaluation CAO 4e — L’atelier du FabLab', classes=CL4, fileName='eval-cao-4e',
  intro='Le FabLab prépare des pièces pour un robot. Lis les plans, modélise, corrige et calcule.',
  competences='<b>Compétences évaluées</b><br>Lire un dessin technique · Modéliser une pièce · Corriger un modèle · Exploiter le modèle (volume, masse)<br><b>Barème</b> : support 6 · guide 5 · plaque corrigée 5 · questions 4', tasks=[
  dict(kind='model', pts=6, titre='Le support de capteur', pitch='Socle 60 × 40 × 6, colonne de Ø16 haute de 30 au centre, percée de Ø6 sur toute la hauteur. Deux trous de Ø5 dans le socle à 8 mm des petits côtés, au milieu de la largeur.',
       cible=[boss(TOP(), [R(0, 0, 60, 40)], 6), boss(TOP(6), [C(30, 20, 16)], 30), cut(TOP(36), [C(30, 20, 6)], 36, thru=True), cut(TOP(6), [C(8, 20, 5), C(52, 20, 5)], 6, thru=True)],
       cotes=[L((0, 0, 0), (60, 0, 0), (0, -10, 0), 60), L((60, 0, 0), (60, 40, 0), (10, 0, 0), 40), L((60, 40, 0), (60, 40, 6), (8, 0, 0), 6), D((30, 20, 22), (0, 0, 1), 16, 0, 16), L((30, 20, 6), (30, 20, 36), (-34, 0, 0), 30), D((30, 20, 36), (0, 0, 1), 6, 120, 14), D((52, 20, 6), (0, 0, 1), 5, 45, 14), L((0, 20, 6), (8, 20, 6), (0, -26, 0), 8)]),
  dict(kind='model', pts=5, titre='Le guide en U', pitch='Profilé en U, longueur 60. Largeur totale 40, hauteur 25 ; la rainure fait 24 de large et 18 de profondeur.',
       cible=[boss(FRONT, [PL((0, 0), (40, 0), (40, 25), (32, 25), (32, 7), (8, 7), (8, 25), (0, 25))], 60, -1)],
       cotes=[L((0, 0, 0), (40, 0, 0), (0, 0, -10), 40), L((40, 0, 0), (40, 0, 25), (10, 0, 0), 25), L((8, 0, 25), (32, 0, 25), (0, 0, 8), 24), L((0, 0, 7), (0, 0, 25), (-10, 0, 0), 18), L((40, 0, 0), (40, 60, 0), (12, 0, 0), 60)]),
  dict(kind='fix', pts=5, titre='La plaque de fixation', pitch='Un camarade a fait deux erreurs : compare au dessin (plaque 70 × 40 × 5, trous Ø6 à 10 mm des bords).',
       consigne='Dans l’arbre, clique sur une fonction puis sur <b>Esquisse</b> pour corriger les cotes.',
       start=[boss(TOP(), [R(0, 0, 70, 40)], 8), cut(TOP(8), [C(10, 10, 6), C(60, 10, 6), C(10, 30, 6), C(60, 30, 4)], 8, thru=True)],
       cible=[boss(TOP(), [R(0, 0, 70, 40)], 5), cut(TOP(5), [C(10, 10, 6), C(60, 10, 6), C(10, 30, 6), C(60, 30, 6)], 5, thru=True)],
       cotes=[L((0, 0, 0), (70, 0, 0), (0, -10, 0), 70), L((70, 0, 0), (70, 40, 0), (10, 0, 0), 40), L((0, 0, 0), (0, 0, 5), (-7, -7, 0), 5), D((60, 30, 5), (0, 0, 1), 6, 45, 14), L((0, 10, 5), (10, 10, 5), (0, -20, 0), 10)]),
  dict(kind='questions', pts=4, titre='Questions', pitch='Réponds en t’aidant du logiciel.', questions=[
       dict(type='num', pts=1.5, texte='Quelle est la masse du support de capteur (partie 1) imprimé en PLA ?', unite='g', auto='mass', mat='PLA', **{'from': 0}, dec=1, expl='Volume × 1,24 g/cm³.'),
       dict(type='num', pts=1, texte='Quelle est l’épaisseur du fond du guide en U ?', unite='mm', answer=7, tolAbs=0.01, dec=0, expl='25 − 18 = 7 mm.'),
       dict(type='choice', pts=1.5, texte='Pour la colonne du support, on utilise :', options=['un enlèvement de matière', 'un bossage sur le dessus du socle', 'une nouvelle pièce'], answer=1)]),
])
EVC3 = dict(mode='eval', id='eval_cao_3e', fbNode='eval_cao_3e', fbEvalPath='evaluations/cao_3e', lockCode='LIAIS33', sim=True, title='Évaluation CAO 3e — La console du bureau d’études', classes=CL3, fileName='eval-cao-3e',
  intro='Le bureau d’études conçoit une console en aluminium. Modélise-la, vérifie sa résistance et justifie tes choix.',
  competences='<b>Compétences évaluées</b><br>Modéliser une pièce complexe · Simuler le comportement mécanique · Interpréter des résultats · Choisir un matériau<br><b>Barème</b> : chape 6 · console et simulation 8 · questions 6', tasks=[
  dict(kind='model', pts=6, titre='La chape', pitch='Base 50 × 30 × 8, deux flasques de 6 × 30 (x de 8 à 14 et de 36 à 42), hauteur totale 40. Un axe Ø8 traverse les flasques à 30 mm du sol, au milieu de la largeur.',
       cible=[boss(TOP(), [R(0, 0, 50, 30)], 8), boss(TOP(8), [R(8, 0, 6, 30), R(36, 0, 6, 30)], 32), cut(RIGHT(42), [C(15, 30, 8)], 42, thru=True)],
       cotes=[L((0, 0, 0), (50, 0, 0), (0, -10, 0), 50), L((50, 0, 0), (50, 30, 0), (10, 0, 0), 30), L((50, 30, 0), (50, 30, 40), (8, 0, 0), 40), D((42, 15, 30), (1, 0, 0), 8, 45, 16)]),
  dict(kind='model', pts=8, simPts=4, titre='La console et sa simulation', pitch='Console en L : 70 × 50, épaisseur 5, largeur 25, en <b>aluminium</b>. Simule-la : encastrement face arrière (x = 0), effort de 300 N vers le bas (−Z) sur le dessus de l’aile horizontale. Il faut s ≥ 2.',
       cible=[boss(FRONT, [PL((0, 0), (70, 0), (70, 5), (5, 5), (5, 50), (0, 50))], 25, -1)],
       cotes=[L((0, 0, 0), (70, 0, 0), (0, 0, -10), 70), L((0, 0, 0), (0, 0, 50), (-10, 0, 0), 50), L((70, 0, 0), (70, 25, 0), (10, 0, 0), 25), L((70, 0, 0), (70, 0, 5), (8, 0, 0), 5)],
       sim=dict(mat='Aluminium', F=300, vmax=88, tol=0.2, minS=2), mat=3),
  dict(kind='questions', pts=6, titre='Interpréter', pitch='Réponds à l’aide de tes résultats.', questions=[
       dict(type='choice', pts=1.5, texte='Si on fabrique la console en PLA (Re = 50 MPa), sous 300 N :', options=['elle tient avec s ≥ 2', 'elle casse ou se déforme : s < 1', 'on ne peut pas savoir'], answer=1, expl='σmax ≈ 90 MPa > 50 MPa.'),
       dict(type='num', pts=1.5, texte='Quelle est la masse de la console en aluminium ?', unite='g', auto='mass', mat='Aluminium', **{'from': 1}, dec=1),
       dict(type='choice', pts=1.5, texte='Pour augmenter s sans changer de matériau, on peut :', options=['augmenter l’épaisseur', 'augmenter l’effort', 'réduire la largeur'], answer=0),
       dict(type='order', pts=1.5, texte='Remets la démarche dans l’ordre.', items=['Modéliser la pièce', 'Choisir le matériau', 'Placer encastrement et effort', 'Lancer le calcul', 'Comparer s à la valeur exigée'])]),
])

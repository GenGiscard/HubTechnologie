from dsl import *
from seq5e import M, OV, MOVE_R, P, INV
CL3 = ['3A', '3B', '3C', '3D', '3E', '3PM']
EMPTY = prog(start())
TB3 = ['jeu', 'sprites', 'controleur', 'info', 'musique', 'boucles', 'logique', 'variables', 'maths', 'texte', 'listes', 'fonctions']
H3 = ['sp_follow']
hero = [newsprite('monSprite', 'heros', 'Joueur'), move('monSprite'), flag('monSprite', 'stay'), setlife(3)]

# ---------------- TP 1 : fonctions ----------------
f_app = fn('apparaitre', newsprite('ennemi', 'fantome', 'Ennemi'), setpos('ennemi', rnd(10, 150), 0), sset('ennemi', 'vy', 40), flag('ennemi', 'autoDestroy'))
f_app3 = fn('apparaitre', newsprite('ennemi', 'fantome', 'Ennemi'), setpos('ennemi', rnd(10, 150), 0), sset('ennemi', 'vy', getv('vitesse')), flag('ennemi', 'autoDestroy'), args=['vitesse'])
f_app5 = fn('apparaitre', newsprite('ennemi', 'fantome', 'Ennemi'), setpos('ennemi', call('x_au_hasard', ret=True), 0), sset('ennemi', 'vy', getv('vitesse')), flag('ennemi', 'autoDestroy'), args=['vitesse'])
f_x = fn('x_au_hasard', ret=rnd(10, 150))
f_pv = fn('perdre_vie', addlife(-1), sound('degat'), say('monSprite', 'Aïe !'))
f_win = fn('victoire', splash('Tu as survécu !'), gameover(True))
bombs = [repeat(2, newsprite('bombe', 'bombe', 'Obstacle'), rndpos('bombe'))]
SAFE = "const p=T.one('Joueur'); p.x=80; p.y=110; T.all('Obstacle').forEach(s=>{s.x=150;s.y=60;});"
FELL = INV + "T.run(3.1); const e=T.all('Ennemi'); return e.length>=3;"
TP1 = dict(id='tp_arcade3_1', mode='tp', title='TP 1 — Fonctions : la fabrique d’ennemis', classes=CL3,
  intro='Une fonction regroupe des instructions sous un nom. On l’écrit une fois, on l’appelle autant qu’on veut.', toolbox=TB3, hide=H3, start=EMPTY, missions=[
  M('Ma première fonction', 'Crée le héros (3 vies). Écris une fonction <b>apparaitre</b> : un fantôme (Ennemi) en haut (y = 0), x au hasard entre 10 et 150, qui tombe (vy = 40) et disparaît hors de l’écran. Appelle-la chaque seconde.',
    [('La fonction apparaitre existe', "return !!T.def('apparaitre');"), ('Un fantôme apparaît chaque seconde', FELL), ('Ils naissent en haut et tombent', INV + "T.run(1.05); const e=T.all('Ennemi'); return e.length>=1&&e.every(s=>s.y<20&&s.vy>0);")],
    prog(start(*hero), f_app, every(1000, call('apparaitre'))), aide='<b>Fonctions</b> : « pour faire quelque chose » ; renomme-la <b>apparaitre</b>. Le bloc d’appel apparaît ensuite dans la catégorie.'),
  M('Réutiliser la fonction', 'Au démarrage, appelle 3 fois la fonction avec une boucle : 3 fantômes sont là dès le début.',
    [('3 fantômes dès le démarrage', "return T.n('Ennemi')===3;"), ('La fonction est appelée à 2 endroits', "return T.calls('apparaitre')>=2;"), ('Un fantôme apparaît toujours chaque seconde', FELL)],
    prog(start(*(hero + [repeat(3, call('apparaitre'))])), f_app, every(1000, call('apparaitre'))), aide='« répéter 3 fois » + appel de <b>apparaitre</b>.'),
  M('Un paramètre', 'Ajoute un paramètre <b>vitesse</b> à la fonction : vy prend cette valeur. Au démarrage, vitesse 30 ; ensuite, vitesse 40 + score.',
    [('La fonction a un paramètre', "return T.args('apparaitre').length>=1;"), ('Au démarrage, les fantômes tombent à 30', "const e=T.all('Ennemi'); return e.length===3&&e.every(s=>Math.abs(s.vy-30)<.5);"),
     ('Avec 60 points, un nouveau fantôme tombe à 100', INV + "T.rt.score=60; T.run(1.05); const e=T.all('Ennemi'); return e.some(s=>Math.abs(s.vy-100)<.5);")],
    prog(start(*(hero + [repeat(3, call('apparaitre', 30))])), f_app3, every(1000, call('apparaitre', ar(40, '+', score())))),
    aide='Clique sur la roue dentée de la fonction et ajoute une entrée « vitesse ». Le bloc <b>vitesse</b> est alors dans Variables.'),
  M('La fonction perdre_vie', 'Écris une fonction <b>perdre_vie</b> (−1 vie, son, le héros dit « Aïe ! »). Ajoute 2 bombes (Obstacle). Toucher un fantôme <b>ou</b> une bombe appelle perdre_vie. Le fantôme touché est détruit, la bombe part ailleurs.',
    [('La fonction perdre_vie existe', "return !!T.def('perdre_vie');"), ('Elle est appelée à 2 endroits', "return T.calls('perdre_vie')>=2;"),
     ('Toucher un fantôme : −1 vie et il disparaît', SAFE + "const e=T.rt.create('fantome','Ennemi'); e.x=p.x; e.y=p.y; T.run(.1); return T.rt.life===2&&!e.alive&&/a.e/i.test(T.said());"),
     ('Toucher une bombe : −1 vie', SAFE + "const b=T.one('Obstacle'); if(!b) return false; b.x=p.x; b.y=p.y; T.run(.1); return T.rt.life===2;")],
    prog(start(*(hero + [repeat(3, call('apparaitre', 30))] + bombs)), f_app3, f_pv, every(1000, call('apparaitre', ar(40, '+', score()))),
         overlap('Joueur', 'Ennemi', call('perdre_vie'), destroy('autreSprite')), overlap('Joueur', 'Obstacle', call('perdre_vie'), rndpos('autreSprite')))),
  M('Une fonction qui renvoie', 'Écris une fonction <b>x_au_hasard</b> qui <b>renvoie</b> un nombre au hasard entre 10 et 150. Utilise-la dans apparaitre.',
    [('La fonction x_au_hasard renvoie une valeur', "const d=T.def('x_au_hasard'); return !!d&&d.type==='procedures_defreturn';"), ('Elle est utilisée', "return T.calls('x_au_hasard')>=1;"),
     ('Les fantômes apparaissent à des x différents', INV + "T.run(4.1); return new Set(T.all('Ennemi').map(s=>Math.round(s.x))).size>=3;")],
    prog(start(*(hero + [repeat(3, call('apparaitre', 30))] + bombs)), f_app5, f_x, f_pv, every(1000, call('apparaitre', ar(40, '+', score()))),
         overlap('Joueur', 'Ennemi', call('perdre_vie'), destroy('autreSprite')), overlap('Joueur', 'Obstacle', call('perdre_vie'), rndpos('autreSprite')))),
  M('Défi : la survie', 'Chaque seconde de survie rapporte 1 point. À 30 points, une fonction <b>victoire</b> affiche un message et termine la partie gagnée.',
    [('Le score augmente chaque seconde', INV + "T.run(2.1); return T.rt.score>=2;"), ('La fonction victoire existe', "return !!T.def('victoire');"), ('À 30 points, la partie est gagnée', INV + "T.rt.score=30; T.run(.2); return T.rt.state==='won';")],
    prog(start(*(hero + [repeat(3, call('apparaitre', 30))] + bombs)), f_app5, f_x, f_pv, f_win, every(1000, call('apparaitre', ar(40, '+', score())), addscore(1)),
         overlap('Joueur', 'Ennemi', call('perdre_vie'), destroy('autreSprite')), overlap('Joueur', 'Obstacle', call('perdre_vie'), rndpos('autreSprite')), update(iff(cmp(score(), '>=', 30), [call('victoire')])))),
])

# ---------------- TP 2 : listes ----------------
b2 = [newsprite('monSprite', 'heros', 'Joueur'), move('monSprite'), flag('monSprite', 'stay'), newsprite('piece', 'piece', 'Nourriture'), rndpos('piece')]
msgs = [setv('messages', lst('Bravo !', 'Super !', 'Miam !'))]
eat1 = overlap('Joueur', 'Nourriture', addscore(1), rndpos('autreSprite'), say('monSprite', lrand(getv('messages'))))
lvl = [setv('vitesses', lst(40, 60, 90, 130)), setv('niveau', 1), newsprite('fantome', 'fantome', 'Ennemi'), setpos('fantome', 20, 20), sset('fantome', 'vx', lget(getv('vitesses'), getv('niveau'))), flag('fantome', 'bounce'), newsprite('etoile', 'etoile', 'Bonus'), rndpos('etoile')]
star = overlap('Joueur', 'Bonus', iff(cmp(getv('niveau'), '<', 4), [changev('niveau', 1)]), sset('fantome', 'vx', lget(getv('vitesses'), getv('niveau'))), rndpos('autreSprite'))
xs = [setv('xs', lst(20, 50, 80, 110, 140)), foreach('x', getv('xs'), newsprite('p', 'piece', 'Nourriture'), setpos('p', getv('x'), 30))]
mx = [setv('scores', lst(12, 7, 25, 18, 9)), setv('record', lget(getv('scores'), 1)), foreach('s', getv('scores'), iff(cmp(getv('s'), '>', getv('record')), [setv('record', getv('s'))])), say('monSprite', join('Record : ', getv('record')))]
moy = [setv('total', 0), foreach('s', getv('scores'), changev('total', getv('s'))), say('monSprite', join('Moyenne : ', ar(getv('total'), '/', llen(getv('scores')))))]
hist = [setv('historique', lst())]
eat6 = overlap('Joueur', 'Nourriture', addscore(1), rndpos('autreSprite'), say('monSprite', lrand(getv('messages'))), lpush(getv('historique'), score()))
SAFE2 = "const p=T.one('Joueur'); p.x=80; p.y=110; const fa=T.one('Ennemi'); if(fa){fa.vx=0;fa.vy=0;fa.x=150;fa.y=10;}"
EATN = "const f=T.all('Nourriture')[0]; f.x=p.x; f.y=p.y; T.run(.1);"
TP2 = dict(id='tp_arcade3_2', mode='tp', title='TP 2 — Listes : messages, niveaux et records', classes=CL3,
  intro='Une liste range plusieurs valeurs dans une seule variable. On peut y piocher, la parcourir, la compléter.', toolbox=TB3, hide=H3,
  start=prog(start(*b2), overlap('Joueur', 'Nourriture', addscore(1), rndpos('autreSprite'))), missions=[
  M('Des messages au hasard', 'Crée une liste <b>messages</b> d’au moins 3 encouragements. À chaque pièce mangée, le héros dit un message pris au hasard dans la liste.',
    [('Une liste d’au moins 3 éléments existe', "return T.ws.getAllBlocks(false).some(b=>b.type==='lists_create_with'&&b.itemCount_>=3);"),
     ('Le héros parle quand il mange une pièce', P + EATN + "return p.say.length>0;"),
     ('Les messages changent', P + "for(let k=0;k<8;k++){ const f=T.all('Nourriture')[0]; f.x=p.x; f.y=p.y; T.run(.1); p.x=(p.x+40)%160; } return new Set(T.rt.logSay).size>=2;")],
    prog(start(*(b2 + msgs)), eat1), aide='<b>Listes</b> : « créer une liste avec ». Puis « obtenir … aléatoire » dans le bloc « dit ».'),
  M('Les niveaux', 'Une liste <b>vitesses</b> = [40, 60, 90, 130] et une variable <b>niveau</b> = 1. Un fantôme rebondit avec vx = l’élément n° niveau. Chaque étoile (Bonus) attrapée fait monter d’un niveau (4 au maximum).',
    [('Au début, le fantôme va à 40', "const e=T.one('Ennemi'); return !!e&&Math.abs(Math.abs(e.vx)-40)<.5;"),
     ('Une étoile : il passe à 60', SAFE2.replace("fa.vx=0;", "") + "const s=T.one('Bonus'); s.x=p.x; s.y=p.y; T.run(.1); return Math.abs(Math.abs(T.one('Ennemi').vx)-60)<.5;"),
     ('Trois étoiles : 130', SAFE2.replace("fa.vx=0;", "") + "for(let k=0;k<3;k++){ const s=T.one('Bonus'); s.x=p.x; s.y=p.y; T.run(.1); p.x=(p.x+50)%160; } return Math.abs(Math.abs(T.one('Ennemi').vx)-130)<.5;"),
     ('Jamais au-delà du niveau 4', SAFE2.replace("fa.vx=0;", "") + "for(let k=0;k<6;k++){ const s=T.one('Bonus'); s.x=p.x; s.y=p.y; T.run(.1); p.x=(p.x+50)%160; } return T.rt.state!=='error'&&Math.abs(Math.abs(T.one('Ennemi').vx)-130)<.5;")],
    prog(start(*(b2 + msgs + lvl)), eat1, star), aide='« obtenir n° niveau » dans la liste vitesses. Attention : dans les blocs, le premier élément est le n° 1.'),
  M('Des positions dans une liste', 'Une liste <b>xs</b> = [20, 50, 80, 110, 140]. Pour chaque élément x de la liste, crée une pièce en (x ; 30).',
    [('5 pièces en y = 30 aux bonnes positions', "const s=T.all('Nourriture'); return [20,50,80,110,140].every(x=>s.some(o=>Math.abs(o.x-x)<1&&Math.abs(o.y-30)<1));"), ('Une boucle « pour chaque » est utilisée', "return T.blocks('controls_forEach')>=1;")],
    prog(start(*(b2 + msgs + lvl + xs)), eat1, star), aide='<b>Boucles</b> : « pour chaque élément x dans la liste xs ».'),
  M('Le record (maximum)', 'Liste <b>scores</b> = [12, 7, 25, 18, 9]. Trouve le plus grand avec une boucle et un « si », puis le héros dit « Record : » suivi du nombre.',
    [('Le héros annonce le record 25', "return /record\\s*:?\\s*25/i.test(T.said());"), ('Une boucle et un test sont utilisés', "return T.blocks('controls_forEach')+T.blocks('controls_for')>=2&&T.blocks('controls_if')>=2;")],
    prog(start(*(b2 + msgs + lvl + xs + mx)), eat1, star), aide='Algorithme : record = premier élément ; pour chaque s : si s > record alors record = s.', cahier='écris l’algorithme du maximum en langage naturel.'),
  M('La moyenne', 'Calcule la moyenne de la liste scores (somme ÷ nombre d’éléments). Le héros dit aussi « Moyenne : » et le résultat.',
    [('Le héros annonce la moyenne 14,2', "return /moyenne\\s*:?\\s*14[.,]2/i.test(T.said());"), ('La longueur de la liste est utilisée', "return T.blocks('lists_length')>=1;")],
    prog(start(*(b2 + msgs + lvl + xs + mx + moy)), eat1, star), aide='total = 0 ; pour chaque s : total = total + s. Puis total ÷ longueur de scores.'),
  M('Défi : l’historique', 'Une liste vide <b>historique</b>. À chaque pièce mangée, ajoute le score à la fin. Le bouton B fait dire « Pièces : » et la longueur de la liste.',
    [('Après 3 pièces, B fait dire 3', SAFE2 + "const cs=T.all('Nourriture').slice(-3); for(const f of cs){ f.x=p.x; f.y=p.y; T.run(.1); p.x=(p.x+40)%160; } T.tap('B'); return /pi.ces\\s*:?\\s*3/i.test(T.rt.logSay[T.rt.logSay.length-1]||'');"),
     ('Sans pièce, B fait dire 0', "T.tap('B'); return /pi.ces\\s*:?\\s*0/i.test(T.rt.logSay[T.rt.logSay.length-1]||'');")],
    prog(start(*(b2 + msgs + lvl + xs + mx + moy + hist)), eat6, star, button('B', say('monSprite', join('Pièces : ', llen(getv('historique')))))),
    aide='« insérer à la fin » (Listes). Pour une liste vide : « créer une liste vide ».'),
])

# ---------------- TP 3 : algorithmes ----------------
pl = [newsprite('monSprite', 'heros', 'Joueur'), setpos('monSprite', 20, 60), move('monSprite', 100, 0), flag('monSprite', 'stay'), sset('monSprite', 'ay', 300)]
slime = [newsprite('slime', 'slime', 'Ennemi'), setpos('slime', 150, 20)]
chase = [iff(cmp(sget('monSprite', 'x'), '>', sget('slime', 'x')), [sset('slime', 'vx', 30)], [sset('slime', 'vx', -30)]),
         iff(cmp(sget('monSprite', 'y'), '>', sget('slime', 'y')), [sset('slime', 'vy', 30)], [sset('slime', 'vy', -30)])]
ground = iff(cmp(sget('monSprite', 'y'), '>', 100), [sset('monSprite', 'y', 100), sset('monSprite', 'vy', 0)])
jump = button('A', iff(cmp(sget('monSprite', 'y'), '>=', 99), [sset('monSprite', 'vy', -150), sound('saut')]))
dicho = [newsprite('tresor', 'piece', 'Bonus'), setpos('tresor', rnd(10, 150), 112), setv('mini', 0), setv('maxi', 160), setv('essais', 0),
         whilee(cmp(ar(getv('maxi'), '-', getv('mini')), '>', 1), setv('milieu', floor(ar(ar(getv('mini'), '+', getv('maxi')), '/', 2))), changev('essais', 1),
                iff(cmp(sget('tresor', 'x'), '>', getv('milieu')), [setv('mini', getv('milieu'))], [setv('maxi', getv('milieu'))])),
         setv('robot', create('drapeau', 'Obstacle')), setpos('robot', getv('maxi'), 20), say('robot', join('Trouvé en ', getv('essais'), ' essais'))]
etat = [setv('etat', 'menu'), splash('Appuie sur B pour jouer')]
go = button('B', iff(cmp(getv('etat'), '==', txt('menu')), [setv('etat', 'jeu'), repeat(3, newsprite('f', 'fantome', 'Ennemi'), rndpos('f'), sset('f', 'vx', 40), flag('f', 'bounce'))]))
tick = every(1000, iff(cmp(getv('etat'), '==', txt('jeu')), [addscore(1)]))
GND = P + "T.run(1.5);"
TP3 = dict(id='tp_arcade3_3', mode='tp', title='TP 3 — Algorithmes de jeu', classes=CL3,
  intro='Les jeux sont pleins d’algorithmes : poursuite, gravité, saut et états du jeu.', toolbox=TB3, hide=H3 + ['sp_follow'], start=EMPTY, missions=[
  M('La poursuite', 'Le héros part en (20 ; 60). Un slime (Ennemi) part en (150 ; 20). À chaque mise à jour, le slime va vers le héros : vx = 30 si le héros est à droite, −30 sinon. Pareil pour vy.',
    [('Le slime se rapproche du héros', P + "const e=T.one('Ennemi'); const d=Math.hypot(e.x-p.x,e.y-p.y); T.run(2); return Math.hypot(e.x-p.x,e.y-p.y)<d-40;"),
     ('Si le héros passe de l’autre côté, le slime fait demi-tour', P + "const e=T.one('Ennemi'); p.ay=0; p.x=150; p.y=100; e.x=60; e.y=100; T.run(.2); const v1=e.vx; p.x=10; T.run(.2); return v1>0&&e.vx<0;")],
    prog(start(*(pl[:4] + slime)), update(*chase)), aide='Deux « si … sinon » dans « à chaque mise à jour » : un pour x, un pour y.'),
  M('La gravité', 'Le héros tombe : accélération ay = 300. Le sol est en y = 100 : s’il descend plus bas, on le remet en y = 100 avec vy = 0.',
    [('Le héros tombe jusqu’au sol', GND + "return Math.abs(p.y-100)<1.5;"), ('Il ne passe jamais sous le sol', P + "for(let k=0;k<60;k++){ T.rt.step(); if(p.y>101.5) return false; } return true;"), ('Posé au sol, il ne bouge plus', GND + "return Math.abs(p.vy)<11;")],
    prog(start(*(pl + slime)), update(*(chase + [ground]))), aide='« fixer monSprite accélération y (ay) à 300 » au démarrage. Dans la mise à jour : « si y > 100 alors … ».'),
  M('Le saut', 'Le bouton A fait sauter (vy = −150), mais seulement si le héros est au sol (y ≥ 99) : pas de saut en l’air.',
    [('Au sol, A fait sauter', GND + "T.tap('A'); T.run(.2); return p.y<90;"), ('En l’air, A ne fait rien', GND + "T.tap('A'); T.run(.2); const v=p.vy; T.tap('A'); return p.vy>v-5;"), ('Il retombe ensuite au sol', GND + "T.tap('A'); T.run(2); return Math.abs(p.y-100)<1.5;")],
    prog(start(*(pl + slime)), update(*(chase + [ground])), jump)),
  M('Les états du jeu', 'Une variable <b>etat</b> vaut « menu » au départ et un message dit d’appuyer sur B. Un appui sur B, si etat = « menu », passe etat à « jeu » et crée 3 fantômes qui rebondissent. Un 2e appui ne fait rien.',
    [('Avant B, aucun fantôme', "return T.all('Ennemi').filter(e=>e.img==='fantome').length===0;"), ('Après B, 3 fantômes', "T.tap('B'); return T.all('Ennemi').filter(e=>e.img==='fantome').length===3;"),
     ('Un 2e appui ne recrée rien', "T.tap('B'); T.tap('B'); return T.all('Ennemi').filter(e=>e.img==='fantome').length===3;")],
    prog(start(*(pl + slime + etat)), update(*(chase + [ground])), jump, go), aide='Compare la variable etat au texte « menu » avec un bloc « = » (Logique).'),
  M('Défi : chrono de survie', 'Toutes les secondes, si etat = « jeu », le score augmente de 1. Dans le menu, le score ne bouge pas.',
    [('Dans le menu, le score reste à 0', "T.run(2.1); return T.rt.score===0;"), ('En jeu, +1 point par seconde', "T.tap('B'); T.run(2.1); return T.rt.score>=2;")],
    prog(start(*(pl + slime + etat)), update(*(chase + [ground])), jump, go, tick)),
])

# ---------------- TP 4 : projet plateforme ----------------
pl4 = [newsprite('monSprite', 'heros', 'Joueur'), setpos('monSprite', 20, 60), move('monSprite', 80, 0), flag('monSprite', 'stay'), sset('monSprite', 'ay', 300), bg('#87f2ff')]
G4 = prog(start(*pl4), update(iff(cmp(sget('monSprite', 'y'), '>', 100), [sset('monSprite', 'y', 100), sset('monSprite', 'vy', 0)])), button('A', iff(cmp(sget('monSprite', 'y'), '>=', 99), [sset('monSprite', 'vy', -150)])))
plats = [setv('px', lst(40, 85, 130)), setv('py', lst(85, 65, 45)), forr('i', 1, 3, newsprite('plateforme', 'mur', 'Obstacle'), setpos('plateforme', lget(getv('px'), getv('i')), lget(getv('py'), getv('i'))))]
ground2 = iff(cmp(sget('monSprite', 'y'), '>', 100), [sset('monSprite', 'y', 100), sset('monSprite', 'vy', 0), setv('au_sol', True)])
land = overlap('Joueur', 'Obstacle', iff(cmp(sget('sprite', 'vy'), '>', 0), [sset('sprite', 'y', ar(sget('autreSprite', 'haut'), '-', 8)), sset('sprite', 'vy', 0), setv('au_sol', True)]))
land0 = overlap('Joueur', 'Obstacle', iff(cmp(sget('sprite', 'vy'), '>', 0), [sset('sprite', 'y', ar(sget('autreSprite', 'haut'), '-', 8)), sset('sprite', 'vy', 0)]))
jump2 = button('A', iff(getv('au_sol'), [sset('monSprite', 'vy', -170), setv('au_sol', False), sound('saut')]))
coins = [forr('i', 1, 3, newsprite('piece', 'piece', 'Nourriture'), setpos('piece', lget(getv('px'), getv('i')), ar(lget(getv('py'), getv('i')), '-', 18)))]
eatc = overlap('Joueur', 'Nourriture', addscore(1), destroy('autreSprite'), sound('piece'))
flagp = [newsprite('drapeau', 'drapeau', 'Bonus'), setpos('drapeau', 150, 92)]
fin = overlap('Joueur', 'Bonus', iff(cmp(kcount('Nourriture'), '==', 0), [gameover(True)], [say('monSprite', 'Il manque des pièces !')]))
PLAT = "const s=T.all('Obstacle'); return [[40,85],[85,65],[130,45]].every(([x,y])=>s.some(o=>Math.abs(o.x-x)<1&&Math.abs(o.y-y)<1));"
DROP = P + "p.x=85; p.y=20; p.vy=0; T.run(1.5);"
TP4 = dict(id='tp_arcade3_4', mode='tp', title='TP 4 — Projet : jeu de plateforme', classes=CL3,
  intro='La gravité, le sol et le saut sont prêts. Construis un vrai niveau : plateformes, pièces et drapeau d’arrivée.', toolbox=TB3, hide=H3, start=G4, missions=[
  M('Les plateformes', 'Deux listes : <b>px</b> = [40, 85, 130] et <b>py</b> = [85, 65, 45]. Avec une boucle « pour i de 1 à 3 », crée 3 plateformes (Obstacle, image mur) en (élément i de px ; élément i de py).',
    [('3 plateformes aux bonnes positions', PLAT), ('Une boucle et des listes sont utilisées', "return T.blocks('controls_for')>=1&&T.blocks('lists_getIndex')>=2;")],
    prog(start(*(pl4 + plats)), update(iff(cmp(sget('monSprite', 'y'), '>', 100), [sset('monSprite', 'y', 100), sset('monSprite', 'vy', 0)])), button('A', iff(cmp(sget('monSprite', 'y'), '>=', 99), [sset('monSprite', 'vy', -150)])))),
  M('Atterrir', 'Quand le héros touche une plateforme en tombant (vy > 0), il se pose dessus : son y devient « bord haut de la plateforme − 8 », et vy = 0.',
    [('Lâché au-dessus d’une plateforme, il reste dessus', DROP + "return Math.abs(p.y-(65-8-8))<3;"), ('Il ne traverse pas la plateforme', DROP + "return p.y<60;"), ('Le sol marche toujours', P + "p.x=10; p.y=20; T.run(1.5); return Math.abs(p.y-100)<1.5;")],
    prog(start(*(pl4 + plats)), update(iff(cmp(sget('monSprite', 'y'), '>', 100), [sset('monSprite', 'y', 100), sset('monSprite', 'vy', 0)])), button('A', iff(cmp(sget('monSprite', 'y'), '>=', 99), [sset('monSprite', 'vy', -150)])), land0),
    aide='Événement « chevauche » Joueur / Obstacle. Le bord haut est dans le bloc « monSprite x » (menu déroulant).'),
  M('Sauter depuis une plateforme', 'Le test y ≥ 99 ne marche qu’au sol. Crée une variable <b>au_sol</b> : vrai quand il touche le sol ou atterrit, faux quand il saute. A fait sauter (vy = −170) seulement si au_sol est vrai.',
    [('Sur une plateforme, A fait sauter', DROP + "const y=p.y; T.tap('A'); T.run(.2); return p.y<y-12;"), ('Au sol, A fait sauter', P + "T.run(1.5); T.tap('A'); T.run(.2); return p.y<90;"), ('Pas de double saut', P + "T.run(1.5); T.tap('A'); T.run(.15); const v=p.vy; T.tap('A'); return p.vy>v-5;")],
    prog(start(*(pl4 + plats)), update(ground2), jump2, land), aide='Le bloc « vrai / faux » est dans Logique. Dans « si », tu peux mettre directement la variable au_sol.'),
  M('Les pièces', 'Une pièce (Nourriture) flotte 18 pixels au-dessus de chaque plateforme (utilise les mêmes listes). La toucher : +1 point, elle disparaît.',
    [('3 pièces au-dessus des plateformes', "const s=T.all('Nourriture'); return s.length===3&&[[40,67],[85,47],[130,27]].every(([x,y])=>s.some(o=>Math.abs(o.x-x)<1&&Math.abs(o.y-y)<1));"),
     ('Une pièce touchée rapporte 1 point et disparaît', P + "const f=T.all('Nourriture')[0]; f.x=p.x; f.y=p.y; T.run(.05); return T.rt.score===1&&!f.alive;")],
    prog(start(*(pl4 + plats + coins)), update(ground2), jump2, land, eatc)),
  M('Défi : le drapeau d’arrivée', 'Un drapeau (Bonus) en (150 ; 92). Le toucher fait gagner si toutes les pièces sont ramassées ; sinon le héros dit « Il manque des pièces ! ».',
    [('Toutes les pièces ramassées : gagné', P + "T.all('Nourriture').forEach(s=>s.alive=false); const d=T.one('Bonus'); if(!d) return false; d.x=p.x; d.y=p.y; T.run(.1); return T.rt.state==='won';"),
     ('Il reste des pièces : message, pas de victoire', P + "const d=T.one('Bonus'); if(!d) return false; d.x=p.x; d.y=p.y; T.run(.1); return T.rt.state==='run'&&p.say.length>0;")],
    prog(start(*(pl4 + plats + coins + flagp)), update(ground2), jump2, land, eatc, fin)),
])

# ---------------- Évaluation 3e ----------------
h3 = [newsprite('monSprite', 'heros', 'Joueur'), setpos('monSprite', 80, 100), move('monSprite', 100, 0), flag('monSprite', 'stay')]
H3S = prog(start(*h3))
f_b = fn('lancer_bombe', newsprite('bombe', 'bombe', 'Ennemi'), setpos('bombe', rnd(10, 150), 0), sset('bombe', 'vy', 60), flag('bombe', 'autoDestroy'))
EV3 = dict(id='eval_arcade3', mode='eval', code='BOSS319', fbEval='evaluations/prog_3e', title='Évaluation — Le défi du programmeur', classes=CL3,
  intro='Quatre petits programmes à écrire. Chaque partie est notée par des tests automatiques quand tu rends ta copie.', toolbox=TB3, hide=H3, start=EMPTY, missions=[
  M('Une fonction', 'Écris une fonction <b>lancer_bombe</b> : une bombe (Ennemi) apparaît en haut (y = 0), à un x au hasard entre 10 et 150, tombe à vy = 60 et disparaît hors de l’écran. Appelle-la toutes les 2 secondes.',
    [('La fonction lancer_bombe existe', "return !!T.def('lancer_bombe');"), ('Une bombe toutes les 2 s', INV + "T.run(4.1); return T.rt.calls.create>=3;"),
     ('Les bombes naissent en haut et tombent', INV + "T.run(2.05); const e=T.all('Ennemi'); return e.length>=1&&e.every(s=>s.y<20&&s.vy>0);"), ('Leur x varie', INV + "T.run(8.1); return new Set(T.all('Ennemi').map(s=>Math.round(s.x))).size>=2;")],
    prog(start(*h3), f_b, every(2000, call('lancer_bombe'))), pts=5, start=H3S),
  M('Une liste', 'Une liste <b>vitesses</b> = [50, 80, 120] et une variable <b>niveau</b> = 1. Chaque appui sur B monte d’un niveau (3 au maximum), puis le héros dit « Vitesse : » suivi de l’élément n° niveau de la liste.',
    [('Un appui sur B : « Vitesse : 80 »', "T.tap('B'); return /vitesse\\s*:?\\s*80/i.test(T.rt.logSay[T.rt.logSay.length-1]||'');"), ('Deux appuis : 120', "T.tap('B'); T.tap('B'); return /120/.test(T.rt.logSay[T.rt.logSay.length-1]||'');"),
     ('Cinq appuis : toujours 120', "for(let k=0;k<5;k++) T.tap('B'); return T.ok()&&/120/.test(T.rt.logSay[T.rt.logSay.length-1]||'');")],
    prog(start(*(h3 + [setv('vitesses', lst(50, 80, 120)), setv('niveau', 1)])), button('B', iff(cmp(getv('niveau'), '<', 3), [changev('niveau', 1)]), say('monSprite', join('Vitesse : ', lget(getv('vitesses'), getv('niveau')))))), pts=5, start=H3S),
  M('Un algorithme', 'Liste <b>notes</b> = [11, 15, 8, 17, 12]. Trouve la plus petite note avec une boucle, puis le héros dit « Min : » suivi du résultat.',
    [('Le héros annonce « Min : 8 »', "return /min\\s*:?\\s*8(?!\\d)/i.test(T.said());"), ('Une boucle et un test sont utilisés', "return T.blocks('controls_forEach')+T.blocks('controls_for')+T.blocks('controls_whileUntil')>=1&&T.blocks('controls_if')>=1;")],
    prog(start(*(h3 + [setv('notes', lst(11, 15, 8, 17, 12)), setv('mini', lget(getv('notes'), 1)), foreach('n', getv('notes'), iff(cmp(getv('n'), '<', getv('mini')), [setv('mini', getv('n'))])), say('monSprite', join('Min : ', getv('mini')))]))), pts=5, start=H3S),
  M('Gravité et saut', 'Le héros a une accélération ay = 300. Le sol est en y = 100 (il s’y pose avec vy = 0). A le fait sauter (vy = −150) uniquement s’il est au sol.',
    [('Le héros se pose au sol en y = 100', P + "p.y=40; T.run(1.5); return Math.abs(p.y-100)<1.5;"), ('Au sol, A fait sauter', P + "T.run(1); T.tap('A'); T.run(.2); return p.y<90;"),
     ('Pas de saut en l’air', P + "T.run(1); T.tap('A'); T.run(.15); const v=p.vy; T.tap('A'); return p.vy>v-5;"), ('Il ne passe jamais sous le sol', P + "p.y=20; for(let k=0;k<60;k++){ T.rt.step(); if(p.y>101.5) return false; } return true;")],
    prog(start(*(h3 + [sset('monSprite', 'ay', 300)])), update(iff(cmp(sget('monSprite', 'y'), '>', 100), [sset('monSprite', 'y', 100), sset('monSprite', 'vy', 0)])), button('A', iff(cmp(sget('monSprite', 'y'), '>=', 99), [sset('monSprite', 'vy', -150)]))), pts=5, start=H3S),
])

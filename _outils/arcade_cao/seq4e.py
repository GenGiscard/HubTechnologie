from dsl import *
from seq5e import M, OV, MOVE_R, P, INV
CL4 = ['4A', '4B', '4C', '4D', '4E']
EMPTY = prog(start())
TB4 = ['jeu', 'sprites', 'controleur', 'info', 'musique', 'effets', 'boucles', 'logique', 'variables', 'maths', 'texte']
H4 = ['controls_forEach', 'sp_follow', 'cam_follow', 'world_size']
POS = lambda kind, pts: "const s=T.all('%s'); const want=%s; return s.length===want.length&&want.every(([x,y])=>s.some(o=>Math.abs(o.x-x)<1&&Math.abs(o.y-y)<1));" % (kind, pts)
DX = lambda v, tol: P + "const x=p.x; T.hold('droite',1); const d=p.x-x; return Math.abs(d-%s)<%s;" % (v, tol)

# ---------------- TP 1 : coordonnées et variables ----------------
corners = [newsprite('etoile', 'etoile', 'Bonus'), setpos('etoile', 10, 10), newsprite('etoile', 'etoile', 'Bonus'), setpos('etoile', 150, 10),
           newsprite('etoile', 'etoile', 'Bonus'), setpos('etoile', 10, 110), newsprite('etoile', 'etoile', 'Bonus'), setpos('etoile', 150, 110)]
hero = [scene('ciel'), music('aventure'), newsprite('monSprite', 'heros', 'Joueur'), setv('vitesse', 80), move('monSprite', getv('vitesse'), getv('vitesse'))]
turbo = button('A', changev('vitesse', 20), move('monSprite', getv('vitesse'), getv('vitesse')), sound('saut'))
cpt = button('B', changev('sauts', 1), say('monSprite', join('Sauts : ', getv('sauts'))))
tun1 = iff(cmp(sget('monSprite', 'x'), '>', 155), [sset('monSprite', 'x', 5)])
tun2 = iff(cmp(sget('monSprite', 'x'), '<', 5), [sset('monSprite', 'x', 155)])
s4 = corners + hero + [setv('sauts', 0)]
TP1 = dict(id='tp_arcade4_1', mode='tp', title='TP 1 — Coordonnées et variables', classes=CL4,
  intro='Se repérer dans l’écran et utiliser des variables pour régler la vitesse et compter.',
  toolbox=TB4, hide=H4, start=EMPTY, missions=[
  M('Le repère de l’écran', 'Place une étoile (Bonus) dans chaque coin : (10 ; 10), (150 ; 10), (10 ; 110) et (150 ; 110).',
    [('Il y a 4 étoiles, une dans chaque coin', POS('Bonus', '[[10,10],[150,10],[10,110],[150,110]]'))],
    prog(start(*corners)), aide='Tu peux réutiliser la même variable <b>etoile</b> : chaque « définir » crée une nouvelle étoile.', cahier='dessine l’écran 160 × 120 et écris les coordonnées des 4 coins. Attention : y augmente vers le <b>bas</b>.'),
  M('Une variable vitesse', 'Ajoute le héros. Crée une variable <b>vitesse</b> qui vaut 80 et utilise-la dans « déplacer avec les flèches ».',
    [('Une variable vitesse existe', "return T.vars().includes('vitesse');"), ('Le héros avance de 80 pixels en 1 s', DX(80, 6)), ('Les étoiles sont toujours là', "return T.n('Bonus')===4;")],
    prog(start(*(corners + hero))), aide='<b>Variables</b> : « Créer une variable… » puis « définir vitesse à 80 ». Glisse le bloc rond <b>vitesse</b> dans les cases vx et vy.'),
  M('Le turbo', 'Chaque appui sur A augmente la vitesse de 20. Le héros doit vraiment aller plus vite.',
    [('Après 2 appuis sur A, le héros avance de 120 pixels en 1 s', P + "T.tap('A'); T.tap('A'); const x=p.x; T.hold('droite',1); return Math.abs(p.x-x-120)<8;"), ('Sans appui, il avance toujours de 80', DX(80, 6))],
    prog(start(*(corners + hero)), turbo), aide='« modifier vitesse de 20 » (catégorie Variables), puis <b>redonne</b> la nouvelle vitesse au bloc « déplacer avec les flèches ».'),
  M('Le compteur de sauts', 'Crée une variable <b>sauts</b> (0 au départ). Chaque appui sur B l’augmente de 1 et le héros dit « Sauts : » suivi du nombre.',
    [('Après 3 appuis sur B, le héros dit « Sauts : 3 »', "T.tap('B'); T.tap('B'); T.tap('B'); const l=T.rt.logSay; return l.length>=1&&/3/.test(l[l.length-1])&&/saut/i.test(l[l.length-1]);"), ('Au premier appui, il dit 1', "T.tap('B'); const l=T.rt.logSay; return l.length>=1&&/1/.test(l[l.length-1]);")],
    prog(start(*s4), turbo, cpt), aide='<b>Texte</b> : « créer un texte avec » permet de coller « Sauts : » et la variable <b>sauts</b>.'),
  M('Le tunnel', 'Le héros ne s’arrête plus au bord : s’il dépasse x = 155, il réapparaît à gauche en x = 5.',
    [('En allant longtemps à droite, le héros reste dans l’écran', P + "for(let i=0;i<4;i++){ T.hold('droite',1); if(p.x<0||p.x>160) return false; } return true;"), ('Il passe bien par la gauche', P + "let seen=false; T.rt.keys.droite=true; for(let i=0;i<120;i++){ T.rt.step(); if(p.x<20) seen=true; } return seen;")],
    prog(start(*s4), turbo, cpt, update(tun1)), aide='<b>Jeu</b> : « à chaque mise à jour du jeu ». <b>Logique</b> : « si x de monSprite > 155 alors fixer x à 5 ».'),
  M('Défi : tunnel dans les deux sens', 'Même chose à gauche : sous x = 5, le héros réapparaît en x = 155.',
    [('Vers la gauche aussi, il reste dans l’écran', P + "for(let i=0;i<4;i++){ T.hold('gauche',1); if(p.x<0||p.x>160) return false; } return true;"), ('Vers la droite, ça marche toujours', P + "for(let i=0;i<4;i++){ T.hold('droite',1); if(p.x<0||p.x>160) return false; } return true;")],
    prog(start(*s4), turbo, cpt, update(tun1, tun2)), aide='Ajoute un deuxième « si » dans la même mise à jour.'),
])

# ---------------- TP 2 : conditions ----------------
base = [scene('grotte'), music('mystere'), newsprite('monSprite', 'heros', 'Joueur'), move('monSprite'), flag('monSprite', 'stay'), newsprite('piece', 'cristal', 'Nourriture'), rndpos('piece')]
eat = overlap('Joueur', 'Nourriture', addscore(1), effect('autreSprite', 'etincelles'), rndpos('autreSprite'), sound('piece'))
bomb = [newsprite('bombe', 'bombe', 'Ennemi'), rndpos('bombe')]
boom = overlap('Joueur', 'Ennemi', effect('autreSprite', 'explosion'), shake('fort'), iff(cmp(score(), '>', 0), [addscore(-1)], [gameover(False)]), rndpos('autreSprite'))
u2 = iff(cmp(score(), '>=', 5), [bg('#78dc52')])
u4 = iff(land(cmp(sget('monSprite', 'x'), '<', 20), cmp(sget('monSprite', 'y'), '<', 20)), [say('monSprite', 'Zone secrète !')])
u5 = iff(cmp(score(), '>=', 10), [gameover(True)])
u6 = iff(cmp(score(), '>=', 5), [move('monSprite', 150, 150)], [move('monSprite', 100, 100)])
SAFE = "const p=T.one('Joueur'); p.x=80; p.y=60; T.all('Nourriture').concat(T.all('Ennemi')).forEach(s=>{s.x=150;s.y=110;});"
TP2 = dict(id='tp_arcade4_2', mode='tp', title='TP 2 — Conditions : la mine de cristaux', classes=CL4,
  intro='Le jeu réagit selon la situation : si… alors… sinon.', toolbox=TB4, hide=H4, start=EMPTY, missions=[
  M('La mine d’or', 'Le héros ramasse des pièces (Nourriture) : +1 point, son, et la pièce réapparaît ailleurs.',
    [('Le héros bouge avec les flèches', MOVE_R), ('Une pièce rapporte 1 point', OV('Joueur', 'Nourriture') + "return T.rt.score===1;"),
     ('Puis elle réapparaît ailleurs', OV('Joueur', 'Nourriture') + "const g=T.one('Nourriture'); return !!g&&Math.hypot(g.x-p.x,g.y-p.y)>8;")],
    prog(start(*base), eat), aide='Comme en 5e : un événement « chevauche » entre Joueur et Nourriture.'),
  M('Niveau 2', 'À partir de 5 points, la couleur du fond change.',
    [('À 4 points, le fond ne change pas', SAFE + "const b=T.rt.bg; T.rt.score=4; T.run(.1); return T.rt.bg===b;"), ('À 5 points, le fond change', SAFE + "const b=T.rt.bg; T.rt.score=5; T.run(.1); return T.rt.bg!==b;")],
    prog(start(*base), eat, update(u2)), aide='« à chaque mise à jour du jeu » + « si score ≥ 5 alors couleur du fond… ».'),
  M('La bombe', 'Ajoute une bombe (Ennemi). Si le héros la touche : il perd 1 point s’il en a, sinon la partie est perdue. La bombe part ailleurs.',
    [('Avec 3 points, toucher la bombe en retire 1', SAFE + "T.rt.score=3; const p2=T.one('Joueur'),f=T.one('Ennemi'); if(!f) return false; f.x=p2.x; f.y=p2.y; T.run(.1); return T.rt.score===2&&T.rt.state==='run';"),
     ('Avec 0 point, toucher la bombe fait perdre', SAFE + "const p2=T.one('Joueur'),f=T.one('Ennemi'); if(!f) return false; f.x=p2.x; f.y=p2.y; T.run(.1); return T.rt.state==='lost';"),
     ('La bombe part ailleurs', SAFE + "T.rt.score=3; const p2=T.one('Joueur'),f=T.one('Ennemi'); if(!f) return false; f.x=p2.x; f.y=p2.y; T.run(.1); return Math.hypot(f.x-p2.x,f.y-p2.y)>8;")],
    prog(start(*(base + bomb)), eat, boom, update(u2)), aide='Bloc « si … alors … sinon » (catégorie Logique, deuxième bloc).'),
  M('La zone secrète', 'Si le héros est dans le coin en haut à gauche (x < 20 <b>et</b> y < 20), il dit « Zone secrète ! ».',
    [('Dans le coin (8 ; 8), il parle', SAFE + "p.x=8; p.y=8; T.run(.1); return p.say.length>0;"), ('En (8 ; 100), il ne dit rien', SAFE + "p.x=8; p.y=100; T.run(.3); return T.rt.logSay.length===0;"),
     ('En (100 ; 8), il ne dit rien', SAFE + "p.x=100; p.y=8; T.run(.3); return T.rt.logSay.length===0;")],
    prog(start(*(base + bomb)), eat, boom, update(u2, u4)), aide='Logique : le bloc « … et … » permet de tester deux conditions à la fois.'),
  M('Victoire', 'Le joueur gagne quand il atteint 10 points.',
    [('À 9 points, la partie continue', SAFE + "T.rt.score=9; T.run(.2); return T.rt.state==='run';"), ('À 10 points, la partie est gagnée', SAFE + "T.rt.score=10; T.run(.2); return T.rt.state==='won';")],
    prog(start(*(base + bomb)), eat, boom, update(u2, u4, u5))),
  M('Défi : plus rapide au niveau 2', 'Le héros va à la vitesse 100. À partir de 5 points, il va à 150.',
    [('Avec 0 point : 100 pixels en 1 s', SAFE + "p.x=10; const x=p.x; T.hold('droite',1); return Math.abs(p.x-x-100)<7;"), ('Avec 6 points : 150 pixels en 1 s', SAFE + "p.x=5; T.rt.score=6; T.run(.1); const x=p.x; T.hold('droite',.8); return Math.abs(p.x-x-120)<8;")],
    prog(start(*(base + bomb)), eat, boom, update(u2, u4, u5, u6)), aide='Dans la mise à jour : « si score ≥ 5 alors déplacer … 150 sinon déplacer … 100 ».'),
])

# ---------------- TP 3 : boucles ----------------
row_rand = [repeat(8, newsprite('brique', 'brique', 'Obstacle'), rndpos('brique'))]
row = [forr('i', 0, 7, newsprite('brique', 'brique', 'Obstacle'), setpos('brique', ar(10, '+', ar(20, '*', getv('i'))), 10))]
wall = [forr('j', 0, 2, forr('i', 0, 7, newsprite('brique', 'brique', 'Obstacle'), setpos('brique', ar(10, '+', ar(20, '*', getv('i'))), ar(10, '+', ar(10, '*', getv('j')))), iff(cmp(getv('j'), '==', 1), [setimg('brique', 'brique_bleue')]), iff(cmp(getv('j'), '==', 2), [setimg('brique', 'brique_verte')])))]
pad = [scene('neon'), music('action'), newsprite('raquette', 'raquette', 'Joueur'), setpos('raquette', 80, 112), move('raquette', 120, 0), flag('raquette', 'stay')]
ball = [newsprite('balle', 'balle', 'Projectile'), setpos('balle', 80, 90), sset('balle', 'vx', 60), sset('balle', 'vy', -60), flag('balle', 'bounce')]
hitb = overlap('Projectile', 'Obstacle', effect('autreSprite', 'etincelles'), destroy('autreSprite'), addscore(1), sset('sprite', 'vy', ar(0, '-', sget('sprite', 'vy'))), sound('piece'))
WALL = POS('Obstacle', '[...Array(24)].map((_,k)=>[10+20*(k%8),10+10*Math.floor(k/8)])')
TP3 = dict(id='tp_arcade4_3', mode='tp', title='TP 3 — Boucles : le casse-briques', classes=CL4,
  intro='Les boucles répètent des instructions : idéal pour construire un mur de briques.', toolbox=TB4, hide=H4, start=EMPTY, missions=[
  M('Répéter', 'Crée 8 briques (Obstacle) à des positions au hasard, avec une boucle « répéter ».',
    [('Il y a 8 briques', "return T.n('Obstacle')===8;"), ('Tu as utilisé une boucle', "return T.blocks('controls_repeat_ext')+T.blocks('controls_for')>=1;")],
    prog(start(*row_rand)), aide='<b>Boucles</b> : « répéter 8 fois ». Dedans : crée la brique et place-la au hasard.'),
  M('Bien alignées', 'Les 8 briques forment une ligne en haut : y = 10, et x = 10 + 20 × i, pour i de 0 à 7.',
    [('8 briques alignées en y = 10, tous les 20 pixels', POS('Obstacle', '[0,1,2,3,4,5,6,7].map(i=>[10+20*i,10])')), ('Tu as utilisé une boucle « pour »', "return T.blocks('controls_for')>=1;")],
    prog(start(*row)), aide='« pour i de 0 à 7 ». Dans x, construis le calcul <b>10 + 20 × i</b> avec deux blocs de Maths.', cahier='calcule x pour i = 0, 1, 2 et 7.'),
  M('Le mur', 'Trois rangées de 8 briques : la rangée j (de 0 à 2) est en y = 10 + 10 × j. La 2e rangée (j = 1) est bleue, la 3e (j = 2) est verte.',
    [('24 briques bien rangées', WALL), ('Deux boucles l’une dans l’autre', "return T.blocks('controls_for')+T.blocks('controls_repeat_ext')>=2;")],
    prog(start(*wall)), aide='Une boucle « pour j » qui contient la boucle « pour i ».'),
  M('La raquette', 'Ajoute la raquette (Joueur) en x = 80, y = 112. Elle se déplace seulement à gauche et à droite (vitesse 120) et reste dans l’écran.',
    [('La raquette part en (80 ; 112)', P + "return !!p&&Math.abs(p.x-80)<1&&Math.abs(p.y-112)<1;"), ('Elle va à droite', P + "const x=p.x; T.hold('droite',.3); return p.x>x+20;"), ('Elle ne monte pas', P + "const y=p.y; T.hold('haut',.5); return Math.abs(p.y-y)<1;"), ('Le mur est toujours là', WALL)],
    prog(start(*(wall + pad)))),
  M('La balle', 'Ajoute une balle de type <b>Projectile</b> en (80 ; 90), vitesse vx = 60, vy = −60, qui rebondit sur les bords.',
    [('Une balle (Projectile) se déplace', "const b=T.one('Projectile'); if(!b) return false; const x=b.x; T.run(.5); return Math.abs(b.x-x)>15;"), ('Elle reste dans l’écran', "const b=T.one('Projectile'); if(!b) return false; for(let i=0;i<8;i++){ T.run(1); if(b.x<0||b.x>160||b.y<0||b.y>120) return false; } return b.alive;")],
    prog(start(*(wall + pad + ball))), aide='Crée-la avec « sprite … de type Projectile » (pas avec le bloc projectile).'),
  M('Casse !', 'Quand la balle touche une brique : la brique est détruite, +1 point, et la balle repart dans l’autre sens vertical (vy devient −vy).',
    [('La brique touchée est détruite', "const b=T.one('Projectile'),o=T.one('Obstacle'); b.x=o.x; b.y=o.y; b.vy=-60; T.run(.05); return !o.alive;"), ('Le score augmente de 1', "const b=T.one('Projectile'),o=T.one('Obstacle'); b.x=o.x; b.y=o.y; T.run(.05); return T.rt.score===1;"),
     ('La balle repart vers le bas', "const b=T.one('Projectile'),o=T.one('Obstacle'); b.x=o.x; b.y=o.y; b.vy=-60; T.run(.05); return b.vy>0;")],
    prog(start(*(wall + pad + ball)), hitb), aide='Pour inverser vy : « fixer sprite vy à (0 − vy de sprite) ».'),
])

# ---------------- TP 4 : projet casse-briques ----------------
B4 = prog(start(*(wall + pad + ball)), hitb)
bounce_pad = overlap('Projectile', 'Joueur', sset('sprite', 'vy', ar(0, '-', absn(sget('sprite', 'vy')))), sound('saut'))
lives = iff(cmp(sget('balle', 'y'), '>', 115), [addlife(-1), setpos('balle', 80, 60), sset('balle', 'vy', -60)])
win = iff(cmp(kcount('Obstacle'), '==', 0), [gameover(True)])
hitb2 = overlap('Projectile', 'Obstacle', effect('autreSprite', 'etincelles'), destroy('autreSprite'), addscore(1), sset('sprite', 'vy', ar(0, '-', sget('sprite', 'vy'))), sound('piece'),
                iff(cmp(rnd(1, 4), '==', 1), [newsprite('coeur', 'coeur', 'Bonus'), setpos('coeur', sget('autreSprite', 'x'), sget('autreSprite', 'y')), sset('coeur', 'vy', 30), flag('coeur', 'autoDestroy')]))
catch = overlap('Joueur', 'Bonus', addlife(1), effect('autreSprite', 'coeurs'), destroy('autreSprite'), sound('bonus'))
accel = every(10000, sset('balle', 'vx', ar(sget('balle', 'vx'), '*', 1.2)), sset('balle', 'vy', ar(sget('balle', 'vy'), '*', 1.2)))
st4 = wall + pad + ball + [setlife(3)]
BL = "const b=T.one('Projectile');"
TP4 = dict(id='tp_arcade4_4', mode='tp', title='TP 4 — Projet : le casse-briques complet', classes=CL4,
  intro='Le mur, la raquette et la balle sont prêts. Transforme-les en vrai jeu : rebonds, vies, bonus et victoire.', toolbox=TB4, hide=H4, start=B4, missions=[
  M('La raquette renvoie la balle', 'Quand la balle touche la raquette, elle repart vers le haut.',
    [('La balle qui tombe sur la raquette remonte', P + BL + "b.x=p.x; b.y=p.y; b.vy=60; T.run(.05); return b.vy<0;"), ('Même si elle montait déjà, elle continue de monter', P + BL + "b.x=p.x; b.y=p.y; b.vy=-60; T.run(.05); return b.vy<0;")],
    prog(start(*(wall + pad + ball)), hitb, bounce_pad), aide='vy doit devenir <b>négative</b> : 0 − (valeur absolue de vy). La valeur absolue est dans Maths.'),
  M('Trois vies', 'Le joueur a 3 vies. Si la balle passe sous la raquette (y > 115), il perd une vie et la balle repart du centre (80 ; 60) vers le haut.',
    [('Le joueur a 3 vies', "return T.rt.life===3;"), ('Balle en bas : une vie en moins', BL + "b.x=20; b.y=117; b.vy=60; T.run(.1); return T.rt.life===2;"), ('La balle repart du centre', BL + "b.x=20; b.y=117; b.vy=60; T.run(.05); return Math.abs(b.x-80)<6&&Math.abs(b.y-60)<6;")],
    prog(start(*st4), hitb, bounce_pad, update(lives))),
  M('Victoire', 'Quand il n’y a plus de brique, la partie est gagnée.',
    [('S’il reste des briques, la partie continue', "T.run(.2); return T.rt.state==='run';"), ('Plus de brique : gagné', "T.all('Obstacle').forEach(o=>o.alive=false); T.run(.2); return T.rt.state==='won';")],
    prog(start(*st4), hitb, bounce_pad, update(lives, win)), aide='<b>Sprites</b> : « nombre de sprites de type Obstacle ».'),
  M('Le bonus cœur', 'Quand une brique casse, une chance sur 4 qu’un cœur (Bonus) tombe de sa place. Si la raquette l’attrape : +1 vie.',
    [('Attraper un cœur donne une vie', P + "const c=T.rt.create('coeur','Bonus'); c.x=p.x; c.y=p.y; T.run(.1); return T.rt.life===4&&!c.alive;"), ('Le hasard est utilisé quand une brique casse', "return T.inHat('math_random_int','sp_overlap_ev')>=1;"),
     ('Des cœurs tombent parfois', "let n=0; for(let k=0;k<24;k++){ const b=T.one('Projectile'), o=T.all('Obstacle')[0]; if(!o) break; b.x=o.x; b.y=o.y; b.vy=-60; T.run(.05); } return T.rt.calls.create>=27+1;")],
    prog(start(*st4), hitb2, bounce_pad, catch, update(lives, win)), aide='Dans « chevauche Projectile / Obstacle » : « si (choisir au hasard entre 1 et 4) = 1 alors … ».'),
  M('Défi : la balle accélère', 'Toutes les 10 secondes, la balle va 20 % plus vite (vx et vy multipliées par 1,2).',
    [('Après 10 s, la balle va plus vite', BL + "T.rt.life=99; const v0=Math.hypot(b.vx,b.vy); T.run(10.1); return Math.hypot(b.vx,b.vy)>v0*1.15;"), ('Avant 10 s, sa vitesse ne change pas', BL + "T.rt.life=99; const v0=Math.hypot(b.vx,b.vy); T.run(5); return Math.abs(Math.hypot(b.vx,b.vy)-v0)<1;")],
    prog(start(*st4), hitb2, bounce_pad, catch, update(lives, win), accel), aide='« toutes les 10000 ms » : fixer vx de balle à (vx de balle × 1,2), pareil pour vy.'),
])

# ---------------- Évaluation 4e ----------------
ship = [newsprite('vaisseau', 'vaisseau', 'Joueur'), setpos('vaisseau', 80, 100), setv('vitesse', 90), move('vaisseau', getv('vitesse'), 0)]
SHIP = prog(start(*ship))
stars = [forr('i', 0, 5, newsprite('etoile', 'etoile', 'Bonus'), setpos('etoile', ar(15, '+', ar(26, '*', getv('i'))), 20))]
EV4 = dict(id='eval_arcade4', mode='eval', code='PIXEL48', fbEval='evaluations/prog_4e', title='Évaluation — Les étoiles filantes', classes=CL4,
  intro='Programme le jeu des étoiles filantes. Chaque partie est notée par des tests automatiques quand tu rends ta copie.', toolbox=TB4, hide=H4, start=EMPTY, missions=[
  M('Variable et coordonnées', 'Crée le vaisseau (Joueur) en x = 80, y = 100. Crée une variable <b>vitesse</b> = 90, utilisée pour le déplacer seulement à gauche et à droite.',
    [('Le vaisseau part en (80 ; 100)', P + "return !!p&&Math.abs(p.x-80)<1&&Math.abs(p.y-100)<1;"), ('Une variable vitesse existe', "return T.vars().includes('vitesse');"),
     ('Il avance de 90 pixels en 1 s', DX(90, 6)), ('Il ne monte pas', P + "const y=p.y; T.hold('haut',.5); return Math.abs(p.y-y)<1;")],
    prog(start(*ship)), pts=5, start=EMPTY),
  M('Une boucle d’étoiles', 'Avec une boucle, crée 6 étoiles (Bonus) en y = 20, avec x = 15 + 26 × i pour i de 0 à 5.',
    [('6 étoiles aux bonnes positions', POS('Bonus', '[0,1,2,3,4,5].map(i=>[15+26*i,20])')), ('Une boucle est utilisée', "return T.blocks('controls_for')+T.blocks('controls_repeat_ext')>=1;")],
    prog(start(*(ship + stars))), pts=5, start=SHIP),
  M('Le tunnel', 'Le vaisseau traverse les bords : au-delà de x = 155 il réapparaît en x = 5, et sous x = 5 il réapparaît en x = 155.',
    [('Vers la droite, il reste dans l’écran', P + "for(let i=0;i<4;i++){ T.hold('droite',1); if(p.x<0||p.x>160) return false; } return true;"), ('Vers la gauche, il reste dans l’écran', P + "for(let i=0;i<4;i++){ T.hold('gauche',1); if(p.x<0||p.x>160) return false; } return true;"),
     ('Il passe d’un bord à l’autre', P + "let seen=false; T.rt.keys.droite=true; for(let i=0;i<120;i++){ T.rt.step(); if(p.x<20) seen=true; } return seen;")],
    prog(start(*ship), update(iff(cmp(sget('vaisseau', 'x'), '>', 155), [sset('vaisseau', 'x', 5)]), iff(cmp(sget('vaisseau', 'x'), '<', 5), [sset('vaisseau', 'x', 155)]))), pts=5, start=SHIP),
  M('Conditions de fin', 'Le joueur a 3 vies. Si un Ennemi le touche : s’il a plus d’une vie, il en perd une et l’ennemi est détruit ; sinon la partie est perdue. À 15 points, la partie est gagnée.',
    [('Le joueur a 3 vies', "return T.rt.life===3;"), ('Avec 3 vies, une collision en retire 1 et détruit l’ennemi', P + "const e=T.rt.create('asteroide','Ennemi'); e.x=p.x; e.y=p.y; T.run(.1); return T.rt.life===2&&!e.alive;"),
     ('Avec 1 vie, une collision fait perdre la partie', P + "T.rt.life=1; const e=T.rt.create('asteroide','Ennemi'); e.x=p.x; e.y=p.y; T.run(.1); return T.rt.state==='lost';"), ('À 15 points, la partie est gagnée', "T.rt.score=15; T.run(.2); return T.rt.state==='won';")],
    prog(start(*(ship + [setlife(3)])), overlap('Joueur', 'Ennemi', iff(cmp(life(), '>', 1), [addlife(-1), destroy('autreSprite')], [gameover(False)])), update(iff(cmp(score(), '>=', 15), [gameover(True)]))), pts=5, start=SHIP),
])

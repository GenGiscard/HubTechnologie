import json, subprocess, os, sys, html
from dsl import *
HERE = os.path.dirname(os.path.abspath(__file__))
NODE = 'NODE_PATH=$(npm root -g) node '

# ---------- contenu des 3 cours ----------
hero = [newsprite('monSprite', 'heros', 'Joueur'), move('monSprite'), flag('monSprite', 'stay')]
C5 = dict(file='01_cours_arcade_5e.html', niv='5ème', acc='#7c3aed', accf='#5b21b6', title='Programmer un jeu vidéo',
  sous='Un jeu vidéo, ce sont des personnages, des règles et des événements. Avec des blocs, on écrit tout ça sans taper une ligne de code.',
  objectifs=['Décrire un jeu avec des sprites, des événements et des actions', 'Repérer une position avec des coordonnées x et y', 'Écrire un programme par blocs qui réagit aux actions du joueur'],
  competences=['Analyser le comportement attendu d’un système', 'Écrire, mettre au point et exécuter un programme', 'Décrire un programme avec un algorithme'],
  sections=[
  dict(t='Un sprite, c’est quoi ?', chapo='Tout ce qui bouge ou se voit dans le jeu.', items=[
    ('p', 'Un <b>sprite</b> a une <b>image</b>, un <b>type</b> (Joueur, Ennemi, Nourriture…) et une <b>position</b>.'),
    ('img', 's5_1', prog(start(newsprite('monSprite', 'heros', 'Joueur'), newsprite('pomme', 'pomme', 'Nourriture'), setpos('pomme', 120, 40)))),
    ('demo', 's5_1', 'Le héros au centre, la pomme en haut à droite.'),
    ('retenir', 'Le <b>type</b> sert à écrire les règles : « quand un Joueur touche une Nourriture… ».')]),
  dict(t='L’écran et ses coordonnées', chapo='Pour placer un sprite, on donne x et y.', items=[
    ('p', 'L’écran mesure <b>160</b> pixels de large et <b>120</b> de haut. Le point (0 ; 0) est en <b>haut à gauche</b>.'),
    ('widget', 'repere'),
    ('retenir', 'x augmente vers la <b>droite</b>, y augmente vers le <b>bas</b>.')]),
  dict(t='Les événements', chapo='Le programme attend qu’il se passe quelque chose.', items=[
    ('p', 'Un bloc <b>événement</b> (en forme de chapeau) contient des actions. Elles s’exécutent quand l’événement arrive.'),
    ('table', [['Événement', 'Quand ?'], ['au démarrage', 'une fois, au lancement'], ['quand le bouton A est pressé', 'à chaque appui'], ['quand sprite chevauche autreSprite', 'quand deux sprites se touchent'], ['toutes les 1000 ms', 'chaque seconde']]),
    ('img', 's5_2', prog(start(*(hero + [newsprite('pomme', 'pomme', 'Nourriture'), setpos('pomme', 120, 40)])), overlap('Joueur', 'Nourriture', addscore(1), rndpos('autreSprite'), sound('piece')))),
    ('demo', 's5_2', 'Clique sur le jeu puis utilise les flèches : attrape la pomme.')]),
  dict(t='Score, vies et chrono', chapo='Les règles du jeu.', items=[
    ('p', 'La catégorie <b>Info</b> gère le score, les vies et le compte à rebours. À 0 vie, ou à la fin du temps, la partie s’arrête.'),
    ('img', 's5_3', prog(start(*(hero + [setlife(3), countdown(30), newsprite('fantome', 'fantome', 'Ennemi'), sset('fantome', 'vx', 50), sset('fantome', 'vy', 40), flag('fantome', 'bounce')])),
                         overlap('Joueur', 'Ennemi', addlife(-1), rndpos('autreSprite')), countend(gameover(True)))),
    ('demo', 's5_3', 'Évite le fantôme pendant 30 secondes.')]),
  dict(t='De l’idée au programme', chapo='Avant de coder, on décrit les règles.', items=[
    ('p', 'On écrit d’abord l’<b>algorithme</b> en français, règle par règle, puis on le traduit en blocs.'),
    ('table', [['Algorithme', 'Bloc'], ['Au début, le héros apparaît', 'au démarrage + sprite'], ['Les flèches le déplacent', 'déplacer avec les flèches'], ['S’il touche une pomme, +1 point', 'chevauche + modifier le score'], ['Au bout de 30 s, fin', 'compte à rebours']]),
    ('retenir', 'On <b>teste</b> souvent : on lance le jeu, on observe, on corrige.')]),
  ],
  trace=['Un <b>sprite</b> est un objet du jeu : image, type, position (x ; y).', 'L’écran mesure 160 × 120 ; (0 ; 0) est en haut à gauche, y augmente vers le bas.',
         'Un <b>événement</b> déclenche des actions : au démarrage, appui sur un bouton, contact entre deux sprites, intervalle de temps.',
         'Le score, les vies et le chrono fixent les <b>règles</b> du jeu.', 'Un <b>algorithme</b> décrit les règles en français ; le <b>programme</b> les traduit en blocs.',
         'On met au point un programme en le testant et en le corrigeant.'])

C4 = dict(file='01_cours_arcade_4e.html', niv='4ème', acc='#0e7490', accf='#155e75', title='Variables, conditions et boucles',
  sous='Pour que le jeu s’adapte, il doit mémoriser des valeurs, prendre des décisions et répéter des actions.',
  objectifs=['Utiliser une variable pour mémoriser et modifier une valeur', 'Écrire une condition simple ou composée (et, ou)', 'Répéter des instructions avec une boucle'],
  competences=['Écrire, mettre au point et exécuter un programme', 'Décrire un programme avec un algorithme ou un organigramme', 'Utiliser des variables, des conditions et des boucles'],
  sections=[
  dict(t='La variable', chapo='Une boîte qui porte un nom et contient une valeur.', items=[
    ('p', 'On peut <b>lire</b> la valeur, la <b>remplacer</b> (définir) ou la <b>modifier</b> (ajouter).'),
    ('widget', 'variable'),
    ('img', 's4_1', prog(start(newsprite('monSprite', 'heros', 'Joueur'), setv('vitesse', 80), move('monSprite', getv('vitesse'), getv('vitesse'))),
                         button('A', changev('vitesse', 20), move('monSprite', getv('vitesse'), getv('vitesse'))))),
    ('demo', 's4_1', 'Flèches pour bouger, barre Espace (A) pour accélérer.')]),
  dict(t='La condition', chapo='si … alors … sinon …', items=[
    ('p', 'Une condition est <b>vraie</b> ou <b>fausse</b>. Selon le résultat, le programme fait une chose ou une autre.'),
    ('img', 's4_2', prog(start(newsprite('monSprite', 'heros', 'Joueur'), move('monSprite')), update(iff(cmp(sget('monSprite', 'x'), '>', 155), [sset('monSprite', 'x', 5)]), iff(cmp(sget('monSprite', 'x'), '<', 5), [sset('monSprite', 'x', 155)])))),
    ('demo', 's4_2', 'Va tout à droite : le héros passe par un tunnel.'),
    ('retenir', 'Comparaisons : <b>=</b>, <b>≠</b>, <b>&lt;</b>, <b>&gt;</b>, <b>≤</b>, <b>≥</b>.')]),
  dict(t='ET, OU', chapo='Combiner deux conditions.', items=[
    ('p', '« A <b>et</b> B » est vrai si les deux sont vraies. « A <b>ou</b> B » est vrai si au moins une est vraie.'),
    ('widget', 'logique')]),
  dict(t='La boucle', chapo='Répéter sans recopier.', items=[
    ('p', '« <b>répéter</b> n fois » refait les mêmes blocs. « <b>pour</b> i de 0 à 7 » les refait en changeant la valeur de i.'),
    ('widget', 'boucle'),
    ('img', 's4_3', prog(start(forr('i', 0, 7, newsprite('brique', 'brique', 'Obstacle'), setpos('brique', ar(10, '+', ar(20, '*', getv('i'))), 10))))),
    ('retenir', 'Pour i = 0, 1, 2… le calcul 10 + 20 × i donne x = 10, 30, 50…')]),
  dict(t='Organigramme', chapo='Dessiner l’algorithme.', items=[
    ('widget', 'organi'),
    ('p', 'Le losange est une <b>condition</b> : deux sorties, oui ou non. Le rectangle est une <b>action</b>.')]),
  ],
  trace=['Une <b>variable</b> a un nom et une valeur ; on peut la lire, la remplacer ou la modifier.', 'Une <b>condition</b> est vraie ou fausse : « si … alors … sinon … ».',
         'On combine des conditions avec <b>et</b> (les deux vraies) et <b>ou</b> (au moins une vraie).', 'Une <b>boucle</b> répète des instructions : « répéter n fois », « pour i de a à b ».',
         'Un <b>organigramme</b> représente un algorithme : losange = condition, rectangle = action.'])

C3 = dict(file='01_cours_arcade_3e.html', niv='3ème', acc='#be123c', accf='#9f1239', title='Fonctions, listes et algorithmes',
  sous='Les vrais jeux réutilisent du code, rangent des données et suivent des algorithmes : poursuite, gravité, recherche.',
  objectifs=['Découper un programme en fonctions, avec paramètre et valeur renvoyée', 'Ranger des données dans une liste et la parcourir', 'Comprendre et programmer des algorithmes : maximum, dichotomie, gravité'],
  competences=['Écrire, mettre au point et exécuter un programme', 'Décomposer un problème en sous-problèmes', 'Programmer des algorithmes avec des listes, des fonctions et des états'],
  sections=[
  dict(t='La fonction', chapo='Un morceau de programme avec un nom.', items=[
    ('p', 'On la <b>définit</b> une fois, on l’<b>appelle</b> partout. Un <b>paramètre</b> change son comportement ; elle peut <b>renvoyer</b> une valeur.'),
    ('img', 's3_1', prog(fn('apparaitre', newsprite('ennemi', 'fantome', 'Ennemi'), setpos('ennemi', rnd(10, 150), 0), sset('ennemi', 'vy', getv('vitesse')), flag('ennemi', 'autoDestroy'), args=['vitesse']),
                         start(*hero), every(800, call('apparaitre', ar(30, '+', score())), addscore(1)))),
    ('demo', 's3_1', 'Une seule fonction fabrique tous les fantômes.'),
    ('retenir', 'Décomposer un problème en fonctions rend le programme plus court et plus lisible.')]),
  dict(t='La liste', chapo='Plusieurs valeurs dans une seule variable.', items=[
    ('p', 'Chaque élément a un <b>numéro</b> (dans les blocs, le premier est le n° 1). On peut lire un élément, en ajouter, ou parcourir toute la liste.'),
    ('widget', 'liste')]),
  dict(t='La dichotomie', chapo='Chercher en coupant en deux.', items=[
    ('p', 'Dans un intervalle trié, on teste le <b>milieu</b> et on garde la bonne moitié. Pour 160 positions, 8 essais suffisent.'),
    ('widget', 'dicho'),
    ('retenir', 'À chaque essai, l’intervalle est divisé par 2 : 160 → 80 → 40 → 20 → 10 → 5 → 3 → 2 → 1.')]),
  dict(t='Simuler la gravité', chapo='La vitesse change, la position suit.', items=[
    ('p', 'À chaque image : la vitesse augmente de a × dt, puis la position de v × dt. Le sol bloque la chute.'),
    ('img', 's3_2', prog(start(newsprite('monSprite', 'heros', 'Joueur'), move('monSprite', 100, 0), flag('monSprite', 'stay'), sset('monSprite', 'ay', 300)),
                         update(iff(cmp(sget('monSprite', 'y'), '>', 100), [sset('monSprite', 'y', 100), sset('monSprite', 'vy', 0)])),
                         button('A', iff(cmp(sget('monSprite', 'y'), '>=', 99), [sset('monSprite', 'vy', -150)])))),
    ('demo', 's3_2', 'Flèches pour marcher, barre Espace pour sauter.')]),
  dict(t='Les états du jeu', chapo='Un jeu passe d’un état à l’autre.', items=[
    ('widget', 'etats'),
    ('p', 'Une variable <b>etat</b> mémorise où on en est. Chaque événement vérifie l’état avant d’agir.')]),
  ],
  trace=['Une <b>fonction</b> regroupe des instructions sous un nom ; elle peut avoir des <b>paramètres</b> et <b>renvoyer</b> une valeur.',
         'Une <b>liste</b> range plusieurs valeurs ; on y accède par leur numéro, on la parcourt avec « pour chaque ».',
         'Algorithme du <b>maximum</b> : on garde la plus grande valeur rencontrée en parcourant la liste.',
         'La <b>dichotomie</b> trouve une valeur dans un intervalle trié en le coupant en deux à chaque essai.',
         'Une <b>simulation</b> calcule à chaque instant la nouvelle vitesse puis la nouvelle position.',
         'Une variable d’<b>état</b> (menu, jeu, fin) organise le déroulement du jeu.'])

WIDGETS = {
'repere': '''<div class="wid"><canvas id="wRep" width="480" height="360" style="max-width:480px;cursor:crosshair"></canvas><div class="wlab" id="wRepL">Survole l’écran : x = … ; y = …</div></div>
<script>(function(){const c=document.getElementById('wRep'),g=c.getContext('2d'),L=document.getElementById('wRepL');let P=null;
function d(){g.fillStyle='#003fad';g.fillRect(0,0,480,360);g.strokeStyle='#ffffff22';for(let x=0;x<=160;x+=10){g.beginPath();g.moveTo(x*3,0);g.lineTo(x*3,360);g.stroke();}for(let y=0;y<=120;y+=10){g.beginPath();g.moveTo(0,y*3);g.lineTo(480,y*3);g.stroke();}
g.fillStyle='#fff';g.font='bold 15px Segoe UI';g.fillText('(0 ; 0)',6,18);g.textAlign='right';g.fillText('(160 ; 120)',474,352);g.textAlign='left';
g.strokeStyle='#f9b13c';g.lineWidth=3;g.beginPath();g.moveTo(40,40);g.lineTo(160,40);g.stroke();g.beginPath();g.moveTo(150,33);g.lineTo(162,40);g.lineTo(150,47);g.closePath();g.fillStyle='#f9b13c';g.fill();g.fillText('x',170,46);
g.beginPath();g.moveTo(40,40);g.lineTo(40,140);g.stroke();g.beginPath();g.moveTo(33,130);g.lineTo(40,142);g.lineTo(47,130);g.closePath();g.fill();g.fillText('y',34,160);g.lineWidth=1;
if(P){const s=imgCanvas('etoile');g.imageSmoothingEnabled=false;g.drawImage(s,P[0]*3-24,P[1]*3-24,48,48);g.fillStyle='#fff';g.fillText('('+P[0]+' ; '+P[1]+')',P[0]*3+28,P[1]*3+5);}}
c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect(),x=Math.round((e.clientX-r.left)/r.width*160),y=Math.round((e.clientY-r.top)/r.height*120);L.textContent='x = '+x+' ; y = '+y+'  (clique pour placer une étoile)';});
c.addEventListener('click',e=>{const r=c.getBoundingClientRect();P=[Math.round((e.clientX-r.left)/r.width*160),Math.round((e.clientY-r.top)/r.height*120)];d();});d();})();</script>''',
'variable': '''<div class="wid"><div class="vbox"><div class="vname">vitesse</div><div class="vval" id="wVar">80</div></div>
<div class="wbtns"><button onclick="wv(20)">modifier vitesse de 20</button><button onclick="wv(-20)">modifier vitesse de −20</button><button onclick="wv(0,1)">définir vitesse à 80</button></div></div>
<script>let VV=80;function wv(d,r){VV=r?80:VV+d;const e=document.getElementById('wVar');e.textContent=VV;e.classList.remove('pop');void e.offsetWidth;e.classList.add('pop');}</script>''',
'logique': '''<div class="wid"><div class="wbtns"><button id="wA" onclick="wl('A')">A : vrai</button><button id="wB" onclick="wl('B')">B : vrai</button></div>
<div class="sorties"><div class="sortie"><div class="lab">A et B</div><div class="val" id="wET">vrai</div></div><div class="sortie"><div class="lab">A ou B</div><div class="val" id="wOU">vrai</div></div><div class="sortie"><div class="lab">non A</div><div class="val" id="wNO">faux</div></div></div></div>
<script>const LG={A:true,B:true};function wl(k){LG[k]=!LG[k];const f=v=>v?'vrai':'faux';document.getElementById('w'+k).textContent=k+' : '+f(LG[k]);document.getElementById('wET').textContent=f(LG.A&&LG.B);document.getElementById('wOU').textContent=f(LG.A||LG.B);document.getElementById('wNO').textContent=f(!LG.A);
['wET','wOU','wNO'].forEach(i=>{const e=document.getElementById(i);e.style.color=e.textContent==='vrai'?'#16a34a':'#c0392b';});}wl('A');wl('A');</script>''',
'boucle': '''<div class="wid"><canvas id="wLoop" width="480" height="120" style="max-width:480px"></canvas><div class="wlab" id="wLoopL"></div><div class="wbtns"><button onclick="wLoopGo()">Rejouer la boucle</button></div></div>
<script>let LI=-1,LT=0;function wLoopGo(){LI=-1;clearInterval(LT);LT=setInterval(()=>{LI++;if(LI>7){clearInterval(LT);LI=7;}wLoopD();},650);wLoopD();}
function wLoopD(){const c=document.getElementById('wLoop'),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#003fad';g.fillRect(0,0,480,120);const b=imgCanvas('brique');for(let i=0;i<=LI;i++){g.drawImage(b,(10+20*i)*3-24,30-12,48,24);}
g.fillStyle='#fff';g.font='bold 15px Segoe UI';if(LI>=0){g.fillText('i = '+LI+'   →   x = 10 + 20 × '+LI+' = '+(10+20*LI),12,100);}document.getElementById('wLoopL').textContent=LI<0?'':'Tour n° '+(LI+1)+' sur 8';}wLoopGo();</script>''',
'organi': '''<div class="wid"><svg viewBox="0 0 520 330" style="max-width:520px;width:100%" font-family="Segoe UI" font-size="15">
<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#1e3a5f"/></marker></defs>
<rect x="190" y="10" width="140" height="38" rx="19" fill="#ede9fe" stroke="#5b21b6" stroke-width="2"/><text x="260" y="34" text-anchor="middle">à chaque image</text>
<line x1="260" y1="48" x2="260" y2="80" stroke="#1e3a5f" stroke-width="2" marker-end="url(#ar)"/>
<polygon points="260,82 360,130 260,178 160,130" fill="#fff7ed" stroke="#ea580c" stroke-width="2"/><text x="260" y="135" text-anchor="middle">x &gt; 155 ?</text>
<line x1="360" y1="130" x2="420" y2="130" stroke="#1e3a5f" stroke-width="2"/><line x1="420" y1="130" x2="420" y2="208" stroke="#1e3a5f" stroke-width="2" marker-end="url(#ar)"/><text x="385" y="122" fill="#16a34a" font-weight="700">oui</text>
<rect x="355" y="210" width="130" height="40" rx="6" fill="#ecfeff" stroke="#0e7490" stroke-width="2"/><text x="420" y="235" text-anchor="middle">x ← 5</text>
<line x1="260" y1="178" x2="260" y2="282" stroke="#1e3a5f" stroke-width="2" marker-end="url(#ar)"/><text x="268" y="205" fill="#c0392b" font-weight="700">non</text>
<path d="M420 250 L420 300 L272 300" fill="none" stroke="#1e3a5f" stroke-width="2" marker-end="url(#ar)"/>
<rect x="200" y="284" width="120" height="34" rx="17" fill="#ede9fe" stroke="#5b21b6" stroke-width="2" transform="translate(0,0)"/><text x="260" y="306" text-anchor="middle">suite</text></svg></div>''',
'liste': '''<div class="wid"><div class="lst" id="wList"></div><div class="wlab" id="wListL">record = ?</div><div class="wbtns"><button onclick="wMax()">Chercher le maximum pas à pas</button></div></div>
<script>const LS=[12,7,25,18,9];let MT=0;function wListD(k,rec){document.getElementById('wList').innerHTML=LS.map((v,i)=>'<div class="cell'+(i===k?' on':'')+'"><span>n° '+(i+1)+'</span><b>'+v+'</b></div>').join('');document.getElementById('wListL').innerHTML=rec===undefined?'record = ?':'record = <b>'+rec+'</b>';}
function wMax(){clearInterval(MT);let k=0,rec=LS[0];wListD(0,rec);MT=setInterval(()=>{k++;if(k>=LS.length){clearInterval(MT);wListD(-1,rec);return;}if(LS[k]>rec)rec=LS[k];wListD(k,rec);},900);}wListD(-1);</script>''',
'dicho': '''<div class="wid"><canvas id="wDi" width="640" height="150" style="max-width:640px"></canvas><div class="wlab" id="wDiL"></div><div class="wbtns"><button onclick="wDiNew()">Nouveau trésor</button><button onclick="wDiStep()">Essai suivant</button></div></div>
<script>let DS,DMi,DMa,DN,DM;function wDiNew(){DS=10+Math.floor(Math.random()*141);DMi=0;DMa=160;DN=0;DM=null;wDiD();}
function wDiStep(){if(DMa-DMi<=1)return;DM=Math.floor((DMi+DMa)/2);DN++;if(DS>DM)DMi=DM;else DMa=DM;wDiD();}
function wDiD(){const c=document.getElementById('wDi'),g=c.getContext('2d'),k=4;g.clearRect(0,0,640,150);g.fillStyle='#f1f5f9';g.fillRect(0,50,640,40);g.fillStyle='#fecdd3';g.fillRect(DMi*k,50,(DMa-DMi)*k,40);
g.strokeStyle='#9f1239';g.lineWidth=2;g.strokeRect(DMi*k+1,51,(DMa-DMi)*k-2,38);g.imageSmoothingEnabled=false;if(DMa-DMi<=1){g.drawImage(imgCanvas('piece'),DS*k-16,54,32,32);}
g.fillStyle='#1e3a5f';g.font='14px Segoe UI';g.textAlign='center';g.fillText('mini = '+DMi,Math.max(40,DMi*k),40);g.fillText('maxi = '+DMa,Math.min(600,DMa*k),112);
if(DM!==null){g.strokeStyle='#ea580c';g.beginPath();g.moveTo(DM*k,44);g.lineTo(DM*k,96);g.stroke();g.fillStyle='#ea580c';g.fillText('milieu '+DM,DM*k,140);}g.textAlign='left';
document.getElementById('wDiL').innerHTML=DMa-DMi<=1?'Trouvé : x = <b>'+DMa+'</b> en <b>'+DN+'</b> essais':'Essais : '+DN+' · le trésor est entre '+DMi+' (exclu) et '+DMa;}wDiNew();</script>''',
'etats': '''<div class="wid"><svg viewBox="0 0 560 150" style="max-width:560px;width:100%" font-family="Segoe UI" font-size="15">
<defs><marker id="ar2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#1e3a5f"/></marker></defs>
<circle cx="80" cy="70" r="46" fill="#ffe4e6" stroke="#9f1239" stroke-width="2"/><text x="80" y="75" text-anchor="middle" font-weight="700">menu</text>
<circle cx="280" cy="70" r="46" fill="#ffe4e6" stroke="#9f1239" stroke-width="2"/><text x="280" y="75" text-anchor="middle" font-weight="700">jeu</text>
<circle cx="480" cy="70" r="46" fill="#ffe4e6" stroke="#9f1239" stroke-width="2"/><text x="480" y="75" text-anchor="middle" font-weight="700">fin</text>
<line x1="128" y1="70" x2="230" y2="70" stroke="#1e3a5f" stroke-width="2" marker-end="url(#ar2)"/><text x="180" y="60" text-anchor="middle" font-size="13">bouton B</text>
<line x1="328" y1="70" x2="430" y2="70" stroke="#1e3a5f" stroke-width="2" marker-end="url(#ar2)"/><text x="380" y="60" text-anchor="middle" font-size="13">0 vie</text>
<path d="M480 118 C480 150 80 150 80 120" fill="none" stroke="#1e3a5f" stroke-width="2" marker-end="url(#ar2)"/><text x="280" y="144" text-anchor="middle" font-size="13">rejouer</text></svg></div>''',
}

CSS = open(os.path.join(HERE, 'cours.css')).read() if os.path.exists(os.path.join(HERE, 'cours.css')) else ''

def build_cours(C, snaps, out_dir):
    acc, accf = C['acc'], C['accf']
    h = []
    h.append('<section class="bloc obj"><h2>Ce que tu vas apprendre</h2><div class="cols"><div><h3>Objectifs</h3><ul>%s</ul></div><div><h3>Compétences</h3><ul>%s</ul></div></div></section>' % (
        ''.join('<li>%s</li>' % o for o in C['objectifs']), ''.join('<li>%s</li>' % o for o in C['competences'])))
    demos = {}
    for k, S in enumerate(C['sections'], 1):
        body = ''
        for it in S['items']:
            kind = it[0]
            if kind == 'p': body += '<p>%s</p>' % it[1]
            elif kind == 'retenir': body += '<div class="retenir">%s</div>' % it[1]
            elif kind == 'img':
                sn = snaps[it[1]]; body += '<div class="blk"><img alt="Programme en blocs" src="%s" style="max-width:%dpx"></div>' % (sn['png'], int(sn['w'] * 1.0))
            elif kind == 'demo':
                demos[it[1]] = snaps[it[1]]['code']
                body += '<div class="demo"><canvas class="dscr" data-code="%s" width="320" height="240" tabindex="0"></canvas><div class="dcap">%s</div><button class="dbtn" data-code="%s">Rejouer</button></div>' % (it[1], it[2], it[1])
            elif kind == 'widget': body += WIDGETS[it[1]]
            elif kind == 'table':
                rows = it[1]
                body += '<table><tr>%s</tr>%s</table>' % (''.join('<th>%s</th>' % c for c in rows[0]), ''.join('<tr>%s</tr>' % ''.join('<td>%s</td>' % c for c in r) for r in rows[1:]))
        h.append('<section class="bloc"><h2><span class="num">%d</span>%s</h2><p class="chapo">%s</p>%s</section>' % (k, S['t'], S['chapo'], body))
    h.append('<section class="bloc" id="sTrace"><h2>Trace écrite</h2><ul class="trace">%s</ul></section>' % ''.join('<li>%s</li>' % t for t in C['trace']))
    src = lambda n: open(os.path.join(HERE, 'src', n), encoding='utf-8').read()
    page = TEMPLATE.replace('%TITLE%', C['title']).replace('%NIV%', C['niv']).replace('%SOUS%', C['sous']).replace('%ACC%', acc).replace('%ACCF%', accf)
    page = page.replace('%BODY%', '\n'.join(h)).replace('%DEMOS%', json.dumps(demos, ensure_ascii=False).replace('</', '<\\/'))
    page = page.replace('/*IMAGES*/', src('images.js')).replace('/*RUNTIME*/', src('runtime.js'))
    open(os.path.join(out_dir, C['file']), 'w', encoding='utf-8').write(page)

TEMPLATE = '''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cours — %TITLE% · ESTIC</title>
<style>
:root{--ink:#1e3a5f;--acc:%ACC%;--accf:%ACCF%;--or:#ea580c;--vert:#16a34a;--gris:#64748b;--fond:#F8F4EC;--carte:#fff;--bord:#e9e2d4}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--fond);color:#3f3a34;line-height:1.65}
.estic-bar{display:flex;align-items:center;gap:14px;background:#fff;border-bottom:3px solid var(--acc);padding:8px 20px}
.estic-bar img{height:36px}.estic-bar b{color:var(--accf);font-size:14px}.estic-bar span{display:block;font-size:11px;color:var(--gris)}.estic-bar .copy{margin-left:auto;font-size:11px;color:var(--gris)}
header.cours{max-width:920px;margin:0 auto;padding:30px 22px 6px;text-align:center}
.eyebrow{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--or);font-weight:800}
h1{font-size:38px;color:var(--accf);margin:6px 0 10px;line-height:1.2}.sous{font-size:16.5px;color:#5b544a;max-width:760px;margin:0 auto}
section.bloc{max-width:920px;margin:26px auto;background:var(--carte);border:1px solid var(--bord);border-radius:18px;padding:22px 26px}
h2{font-size:23px;color:var(--accf);margin-bottom:4px}h2 .num{display:inline-block;background:var(--acc);color:#fff;border-radius:8px;padding:1px 10px;font-size:17px;margin-right:9px}
h3{font-size:14px;letter-spacing:1px;text-transform:uppercase;color:var(--or);margin:6px 0}
.chapo{color:var(--gris);font-size:14.5px;margin-bottom:10px}p{margin:9px 0;font-size:16px}
.obj .cols{display:grid;grid-template-columns:1fr 1fr;gap:20px}.obj ul{padding-left:20px;font-size:15.5px}@media(max-width:700px){.obj .cols{grid-template-columns:1fr}}
.retenir{background:#f5f3ff;border-left:5px solid var(--acc);border-radius:10px;padding:11px 16px;margin:12px 0;font-size:15.5px}
.blk{text-align:center;margin:14px 0}.blk img{width:100%;height:auto;border:1px solid var(--bord);border-radius:12px;background:#fff}
.demo{display:flex;flex-direction:column;align-items:center;gap:6px;margin:12px 0;background:#2b2f3e;border-radius:16px;padding:14px}
.dscr{width:320px;height:240px;image-rendering:pixelated;border-radius:8px;outline:none;background:#1e1e2a}.dscr:focus{box-shadow:0 0 0 3px var(--or)}
.dcap{color:#e2e8f0;font-size:14px}.dbtn,.wbtns button{border:1px solid var(--bord);background:#fff;color:var(--accf);border-radius:9px;padding:7px 14px;font:600 14px 'Segoe UI',sans-serif;cursor:pointer}
.wid{display:flex;flex-direction:column;align-items:center;gap:8px;margin:14px 0}.wid canvas{width:100%;height:auto;border:1px solid var(--bord);border-radius:12px}
.wlab{font-size:15px;color:var(--ink)}.wbtns{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.vbox{border:3px solid var(--acc);border-radius:14px;padding:10px 26px;text-align:center;background:#faf5ff}.vname{font-size:13px;font-weight:700;color:var(--accf);text-transform:uppercase;letter-spacing:1px}.vval{font-size:40px;font-weight:900;color:var(--ink)}
.vval.pop{animation:pop .4s}@keyframes pop{0%{transform:scale(1.5);color:var(--or)}100%{transform:scale(1)}}
.sorties{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%;max-width:520px}.sortie{background:#f8fafc;border:1px solid var(--bord);border-radius:10px;padding:9px;text-align:center}
.sortie .lab{font-size:12px;letter-spacing:1px;text-transform:uppercase;color:var(--gris);font-weight:800}.sortie .val{font-size:22px;font-weight:900}
.lst{display:flex;gap:6px}.lst .cell{border:2px solid var(--bord);border-radius:10px;padding:6px 12px;text-align:center;min-width:64px;background:#fff;transition:.2s}.lst .cell span{display:block;font-size:11px;color:var(--gris)}.lst .cell b{font-size:22px;color:var(--ink)}.lst .cell.on{border-color:var(--or);background:#fff7ed;transform:translateY(-4px)}
table{width:100%;border-collapse:collapse;font-size:15px;margin:10px 0}th,td{border:1px solid var(--bord);padding:6px 9px;text-align:left}th{background:#f8fafc;color:var(--accf)}
.trace{padding-left:22px;font-size:16px}.trace li{margin:6px 0}
footer{text-align:center;padding:22px;font-size:12px;color:var(--gris)}
</style>
<script>/*IMAGES*/</script>
<script>/*RUNTIME*/</script>
</head>
<body>
<div class="estic-bar"><img alt="Logo ESTIC" src="logo_estic.png"><div><b>Professeur AGOSTINI</b><span>Technologie · ESTIC</span></div><div class="copy">© ESTIC — Tous droits réservés</div></div>
<header class="cours"><div class="eyebrow">Séquence %NIV% · Programmation</div><h1>%TITLE%</h1><p class="sous">%SOUS%</p></header>
%BODY%
<footer>Cours « %TITLE% » · Technologie %NIV% · ESTIC Don Bosco</footer>
<script>
const DEMOS=%DEMOS%;
const KM={ArrowUp:'haut',ArrowDown:'bas',ArrowLeft:'gauche',ArrowRight:'droite',' ':'A',Enter:'B'};
document.querySelectorAll('.dscr').forEach(cv=>{
  let rt=null, raf=0; const g=cv.getContext('2d');
  const run=()=>{ cancelAnimationFrame(raf); rt=new Runtime({seed:7}); rt.load(DEMOS[cv.dataset.code]); let acc=0,last=performance.now();
    const loop=t=>{ acc+=Math.min(.25,(t-last)/1000); last=t; while(acc>=DT){ rt.step(); acc-=DT; } g.setTransform(2,0,0,2,0,0); g.imageSmoothingEnabled=false; rt.draw(g); raf=requestAnimationFrame(loop); }; raf=requestAnimationFrame(loop); };
  const io=new IntersectionObserver(es=>{ es.forEach(e=>{ if(e.isIntersecting){ if(!rt) run(); } else { cancelAnimationFrame(raf); rt=null; } }); },{threshold:.3}); io.observe(cv);
  cv.addEventListener('keydown',e=>{ const b=KM[e.key]; if(b&&rt){ rt.keys[b]=true; e.preventDefault(); } });
  cv.addEventListener('keyup',e=>{ const b=KM[e.key]; if(b&&rt){ rt.keys[b]=false; e.preventDefault(); } });
  cv.addEventListener('click',()=>cv.focus());
  cv.parentNode.querySelector('.dbtn').addEventListener('click',()=>{ run(); cv.focus(); });
});
</script>
</body>
</html>'''

if __name__ == '__main__':
    out_dir = sys.argv[1]
    items = []
    for C in (C5, C4, C3):
        for S in C['sections']:
            for it in S['items']:
                if it[0] == 'img': items.append({'id': it[1], 'xml': it[2]})
    json.dump(items, open('/tmp/snips.json', 'w'))
    subprocess.run(NODE + 'render_blocks.js /tmp/arc_TP1.html /tmp/snips.json /tmp/snaps.json', shell=True, check=True, cwd=HERE)
    snaps = json.load(open('/tmp/snaps.json'))
    for C in (C5, C4, C3): build_cours(C, snaps, out_dir); print('ok', C['file'])

# ---------- cours CAO 4e et 3e ----------
WIDGETS['masse'] = '''<div class="wid"><div class="wbtns" style="align-items:center"><label style="font-size:15px">Volume <input id="wmV" type="number" value="20" style="width:90px;padding:6px;border:1px solid #ccc;border-radius:8px"> cm³</label>
<select id="wmM" style="padding:7px;border-radius:8px;border:1px solid #ccc"><option value="1.24">PLA (1,24 g/cm³)</option><option value="1.04">ABS (1,04)</option><option value="0.5">Bois de pin (0,50)</option><option value="2.7">Aluminium (2,70)</option><option value="7.85">Acier (7,85)</option></select></div>
<div class="sorties" style="grid-template-columns:1fr"><div class="sortie"><div class="lab" style="text-transform:none">masse = volume × masse volumique</div><div class="val" id="wmR">24,8 g</div></div></div></div>
<script>(function(){const f=()=>{const v=parseFloat(document.getElementById('wmV').value)||0,r=parseFloat(document.getElementById('wmM').value);document.getElementById('wmR').textContent=(v*r).toFixed(1).replace('.',',')+' g';};document.getElementById('wmV').oninput=f;document.getElementById('wmM').onchange=f;f();})();</script>'''
WIDGETS['secu'] = '''<div class="wid"><div class="wbtns" style="align-items:center"><label style="font-size:15px">Re <input id="wsR" type="number" value="50" style="width:80px;padding:6px;border:1px solid #ccc;border-radius:8px"> MPa</label>
<label style="font-size:15px">σmax <input id="wsS" type="number" value="33" style="width:80px;padding:6px;border:1px solid #ccc;border-radius:8px"> MPa</label></div>
<div class="sorties" style="grid-template-columns:1fr"><div class="sortie"><div class="lab" style="text-transform:none">coefficient de sécurité s = Re ÷ σmax</div><div class="val" id="wsO">1,52</div><div id="wsT" style="font-size:14px;font-weight:700"></div></div></div></div>
<script>(function(){const f=()=>{const R=parseFloat(document.getElementById('wsR').value)||0,S=parseFloat(document.getElementById('wsS').value)||1,s=R/S;const o=document.getElementById('wsO'),t=document.getElementById('wsT');o.textContent=s.toFixed(2).replace('.',',');
const c=s<1?['#c0392b','La pièce casse ou se déforme définitivement']:s<2?['#d97706','Elle tient, mais la marge est faible']:['#16a34a','Marge de sécurité confortable'];o.style.color=c[0];t.style.color=c[0];t.textContent=c[1];};document.getElementById('wsR').oninput=f;document.getElementById('wsS').oninput=f;f();})();</script>'''
WIDGETS['cl'] = '''<div class="wid"><svg viewBox="0 0 560 230" style="max-width:560px;width:100%" font-family="Segoe UI" font-size="14">
<defs><marker id="arF" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#c0392b"/></marker></defs>
<rect x="60" y="40" width="16" height="150" fill="#e2c799" stroke="#7a5a2b" stroke-width="2"/><rect x="76" y="166" width="300" height="16" fill="#e2c799" stroke="#7a5a2b" stroke-width="2"/>
<line x1="56" y1="34" x2="56" y2="196" stroke="#1e3a5f" stroke-width="3"/><g stroke="#1e3a5f" stroke-width="2">''' + ''.join('<line x1="56" y1="%d" x2="44" y2="%d"/>' % (y, y + 12) for y in range(36, 190, 14)) + '''</g>
<text x="30" y="215" fill="#1e3a5f" font-weight="700">encastrement</text>
<g>''' + ''.join('<line x1="%d" y1="110" x2="%d" y2="160" stroke="#c0392b" stroke-width="2.5" marker-end="url(#arF)"/>' % (x, x) for x in range(110, 371, 52)) + '''</g>
<line x1="100" y1="110" x2="380" y2="110" stroke="#c0392b" stroke-width="2"/><text x="400" y="128" fill="#c0392b" font-weight="700">effort F (−Z)</text>
<text x="400" y="150" fill="#64748b">sur la face du dessus</text></svg></div>'''
WIDGETS['bielle'] = '''<div class="wid"><canvas id="wBM" width="640" height="220" style="max-width:640px"></canvas><div class="wbtns" style="align-items:center"><label style="font-size:15px">Rayon R de la manivelle <input id="wBR" type="range" min="10" max="40" value="20"> <b id="wBRv">20</b> mm</label></div><div class="wlab" id="wBL"></div></div>
<script>(function(){const c=document.getElementById('wBM'),g=c.getContext('2d'),Lb=60,k=2.6;let th=0;const ox=110,oy=110;
function f(){const R=+document.getElementById('wBR').value;document.getElementById('wBRv').textContent=R;document.getElementById('wBL').innerHTML='Course du piston = 2 × R = <b>'+(2*R)+' mm</b>';
th+=0.035;const ax=R*Math.cos(th),ay=R*Math.sin(th),px=ax+Math.sqrt(Lb*Lb-ay*ay);g.clearRect(0,0,640,220);
g.fillStyle='#f1f5f9';g.fillRect(ox+(Lb-R)*k-30,oy-26,(2*R)*k+60,52);g.strokeStyle='#94a3b8';g.strokeRect(ox+(Lb-R)*k-30,oy-26,(2*R)*k+60,52);
g.strokeStyle='#ea580c';g.setLineDash([5,4]);[Lb-R,Lb+R].forEach(x=>{g.beginPath();g.moveTo(ox+x*k,oy-40);g.lineTo(ox+x*k,oy+40);g.stroke();});g.setLineDash([]);
g.lineCap='round';g.strokeStyle='#5b21b6';g.lineWidth=14;g.beginPath();g.moveTo(ox,oy);g.lineTo(ox+ax*k,oy-ay*k);g.stroke();
g.strokeStyle='#0e7490';g.lineWidth=10;g.beginPath();g.moveTo(ox+ax*k,oy-ay*k);g.lineTo(ox+px*k,oy);g.stroke();
g.fillStyle='#9f1239';g.fillRect(ox+px*k-22,oy-18,44,36);[[ox,oy],[ox+ax*k,oy-ay*k],[ox+px*k,oy]].forEach(([x,y])=>{g.fillStyle='#fff';g.beginPath();g.arc(x,y,5,0,7);g.fill();g.strokeStyle='#1e3a5f';g.lineWidth=2;g.stroke();});
g.fillStyle='#1e3a5f';g.font='13px Segoe UI';g.fillText('manivelle (rotation)',ox-60,oy+60);g.fillText('bielle',ox+(ax+px)/2*k-18,oy-ay*k/2-14);g.fillText('piston (translation)',ox+(Lb-R)*k-10,oy+48);requestAnimationFrame(f);}f();})();</script>'''
CC4 = dict(file='01_cours_cao_4e.html', niv='4ème', acc='#0e7490', accf='#155e75', title='La CAO : lire, modéliser, calculer',
  sous='Un logiciel de CAO transforme un dessin coté en pièce 3D, puis calcule son volume et sa masse avant de la fabriquer.',
  objectifs=['Lire un dessin coté et calculer une cote manquante', 'Choisir le plan d’esquisse et la fonction (bossage, enlèvement)', 'Calculer une masse à partir du volume et du matériau'],
  competences=['Lire, utiliser et produire des représentations numériques d’objets', 'Modéliser une pièce avec un logiciel de CAO', 'Exploiter un modèle pour obtenir une grandeur'],
  sections=[
  dict(t='Le dessin coté', chapo='Les dimensions de la pièce, en millimètres.', items=[
    ('p', 'Une <b>cote</b> donne une distance. Si une cote manque, on la calcule : la cote totale est la <b>somme</b> des cotes partielles.'),
    ('table', [['Exemple', 'Calcul'], ['Plaque de 80 avec trous à 8 du bord', 'entraxe = 80 − 8 − 8 = 64'], ['T de 60, âme de 20 centrée', 'début de l’âme = (60 − 20) ÷ 2 = 20'], ['Cylindre Ø60, paroi 3', 'Ø intérieur = 60 − 2 × 3 = 54']]),
    ('retenir', 'Toujours chercher la <b>cote totale</b> d’abord, puis les cotes partielles.')]),
  dict(t='Modéliser une pièce', chapo='Esquisse, puis fonction 3D.', items=[
    ('table', [['Étape', 'Rôle'], ['Choisir un plan', 'Dessus, Face, Droite ou une face de la pièce'], ['Esquisse', 'contour fermé et coté (rectangle, cercle, polyligne…)'], ['Bossage', 'ajoute de la matière'], ['Enlèvement', 'retire de la matière (trou, poche)']]),
    ('p', 'Le profil d’une pièce en L ou en U se dessine sur le plan <b>Face</b>, puis on le « tire » en épaisseur.'),
    ('retenir', 'L’<b>arbre de construction</b> garde toutes les fonctions : on peut corriger une cote sans tout refaire.')]),
  dict(t='Volume et masse', chapo='m = ρ × V', items=[
    ('p', 'Le logiciel donne le <b>volume</b>. La <b>masse volumique</b> ρ dépend du matériau (g/cm³).'),
    ('widget', 'masse'),
    ('retenir', '1 cm³ = 1 000 mm³. Une pièce de 60 × 25 × 10 mm fait 15 000 mm³ = 15 cm³.')]),
  ],
  trace=['Un <b>dessin coté</b> donne les dimensions en mm ; une cote manquante se calcule à partir des autres.', 'On modélise par étapes : plan, esquisse cotée, fonction (<b>bossage</b> ou <b>enlèvement</b>).',
         'L’<b>arbre de construction</b> permet de modifier et corriger un modèle.', 'Masse = volume × masse volumique (m = ρ × V) ; 1 cm³ = 1 000 mm³.'])
CC3 = dict(file='01_cours_cao_3e.html', niv='3ème', acc='#be123c', accf='#9f1239', title='La CAO : simuler et assembler',
  sous='Avant de fabriquer, on vérifie par le calcul que la pièce résiste, et que le mécanisme produit le bon mouvement.',
  objectifs=['Paramétrer une simulation : encastrement, effort, matériau', 'Interpréter une contrainte et un coefficient de sécurité', 'Assembler des pièces avec des liaisons et simuler un mouvement'],
  competences=['Simuler numériquement la structure et le comportement d’un objet', 'Interpréter les résultats d’une simulation', 'Associer liaisons et mouvements dans un mécanisme'],
  sections=[
  dict(t='Préparer une simulation', chapo='Où la pièce est tenue, où elle est poussée.', items=[
    ('widget', 'cl'),
    ('p', 'L’<b>encastrement</b> bloque une face. L’<b>effort</b> F (en newtons) s’applique sur une autre face, dans une direction.')]),
  dict(t='Contrainte et sécurité', chapo='La pièce tient-elle ?', items=[
    ('p', 'Le logiciel calcule la <b>contrainte</b> σ (en MPa) partout dans la pièce. Chaque matériau supporte jusqu’à sa <b>limite élastique</b> Re.'),
    ('widget', 'secu'),
    ('retenir', 'Pour réduire σ : épaissir la pièce, changer sa forme, ou choisir un matériau avec un Re plus grand.')]),
  dict(t='Les liaisons', chapo='Comment deux pièces bougent l’une par rapport à l’autre.', items=[
    ('table', [['Liaison', 'Mouvement permis', 'Exemple'], ['Pivot', 'une rotation autour d’un axe', 'roue sur son axe, charnière'], ['Glissière', 'une translation le long d’une direction', 'tiroir, piston'], ['Encastrement', 'aucun', 'pièces collées ou vissées']]),
    ('retenir', 'Le <b>bâti</b> est la pièce fixe. Le <b>moteur</b> pilote une liaison pivot.')]),
  dict(t='Le système bielle-manivelle', chapo='Transformer une rotation en translation.', items=[
    ('widget', 'bielle'),
    ('p', 'La manivelle tourne, la bielle pousse et tire, le piston va et vient. La <b>course</b> vaut 2 × R.')]),
  ],
  trace=['Une simulation nécessite un <b>matériau</b>, un <b>encastrement</b> et un <b>effort</b> (intensité, direction).', 'La <b>contrainte</b> σ s’exprime en MPa ; le coefficient de sécurité vaut s = Re ÷ σmax.',
         'Si s < 1 la pièce casse ou se déforme ; on vise souvent s ≥ 2.', 'Une <b>liaison pivot</b> permet une rotation, une <b>liaison glissière</b> une translation.',
         'Le système <b>bielle-manivelle</b> transforme une rotation en translation ; course = 2 × R.'])

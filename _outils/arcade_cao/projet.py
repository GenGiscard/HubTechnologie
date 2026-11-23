import json, os
PRJ = {
'5e': dict(file='05_projet_makecode_5e.html', niv='5ème', acc='#7c3aed', accf='#5b21b6', fb='projet_arcade_5e', classes=['5A','5B','5C','5D','5E'],
  titre='Projet — Mon jeu d’attrape', sous='Crée ton propre jeu sur le vrai MakeCode Arcade, puis partage-le avec la classe.',
  cdc=['Un écran titre (message de départ)', 'Un personnage que tu as <b>dessiné toi-même</b> (éditeur d’images)', 'Il se déplace avec les flèches et reste dans l’écran',
       'Des objets à attraper qui rapportent des points', 'Un ennemi qui fait perdre des vies', 'Un compte à rebours ou une condition de victoire', 'Des sons'],
  bareme=[('Écran titre et thème cohérent', 2), ('Personnage dessiné et déplacement', 4), ('Objets à attraper et score', 4), ('Ennemi et vies', 4), ('Fin de partie (chrono ou victoire)', 3), ('Sons et finitions', 3)]),
'4e': dict(file='05_projet_makecode_4e.html', niv='4ème', acc='#0e7490', accf='#155e75', fb='projet_arcade_4e', classes=['4A','4B','4C','4D','4E'],
  titre='Projet — Un jeu à niveaux', sous='Sur MakeCode Arcade, crée un jeu qui devient plus difficile grâce aux variables, aux conditions et aux boucles.',
  cdc=['Un personnage dessiné, déplacé aux flèches', 'Une <b>variable</b> (vitesse, niveau…) qui change pendant la partie', 'Au moins une <b>condition</b> « si … alors … sinon »',
       'Une <b>boucle</b> qui crée des objets ou un décor', 'Un passage au niveau 2 (vitesse, couleur, ennemis…)', 'Score, vies et fin de partie', 'Sur ton cahier : l’organigramme d’une règle du jeu'],
  bareme=[('Jeu jouable, personnage et déplacement', 3), ('Variable utilisée et modifiée', 4), ('Conditions (si / sinon, et / ou)', 4), ('Boucle', 3), ('Niveaux et fin de partie', 3), ('Organigramme sur le cahier', 3)]),
'3e': dict(file='05_projet_makecode_3e.html', niv='3ème', acc='#be123c', accf='#9f1239', fb='projet_arcade_3e', classes=['3A','3B','3C','3D','3E','3PM'],
  titre='Projet — Un jeu complet en équipe', sous='En binôme, concevez et programmez un jeu complet sur MakeCode Arcade : menu, niveaux, fonctions et listes.',
  cdc=['Un <b>cahier des charges</b> écrit avant de programmer (thème, règles, commandes)', 'Des <b>états</b> : menu, jeu, fin', 'Au moins 2 <b>fonctions</b>, dont une avec paramètre',
       'Une <b>liste</b> (niveaux, messages, positions…)', 'Un <b>algorithme</b> de jeu : gravité, poursuite ou recherche', 'Au moins 2 niveaux de difficulté', 'Une courte présentation orale (2 min) du programme'],
  bareme=[('Cahier des charges et jeu conforme', 3), ('États du jeu', 3), ('Fonctions', 4), ('Liste', 3), ('Algorithme de jeu', 3), ('Présentation orale', 4)]),
}
EQUIV = [('au démarrage', 'au démarrage'), ('définir … à sprite … de type', 'définir mySprite à sprite … de type'), ('déplacer … avec les flèches', 'déplacer … avec les boutons'),
         ('régler … reste dans l’écran', 'définir … reste dans l’écran ACTIVÉ'), ('quand sprite … chevauche autreSprite', 'quand sprite de type … chevauche otherSprite'),
         ('toutes les … ms', 'à chaque intervalle de … ms'), ('modifier le score de …', 'modifier le score de …'), ('lancer le compte à rebours', 'démarrer le compte à rebours'),
         ('projectile … depuis …', 'projectile … depuis …'), ('fin de partie gagnée', 'fin de partie (gagné)')]
def page(P):
    cdc = ''.join('<label class="ck"><input type="checkbox" data-k="%d"><span>%s</span></label>' % (i, c) for i, c in enumerate(P['cdc']))
    bar = ''.join('<tr><td>%s</td><td class="n">%d</td></tr>' % b for b in P['bareme'])
    eq = ''.join('<tr><td>%s</td><td>%s</td></tr>' % e for e in EQUIV)
    cls = ''.join('<option>%s</option>' % c for c in P['classes'])
    crit = json.dumps(P['bareme'], ensure_ascii=False)
    return TPL.replace('%TITRE%', P['titre']).replace('%SOUS%', P['sous']).replace('%NIV%', P['niv']).replace('%ACC%', P['acc']).replace('%ACCF%', P['accf']) \
      .replace('%CDC%', cdc).replace('%BAR%', bar).replace('%EQ%', eq).replace('%CLS%', cls).replace('%FB%', P['fb']).replace('%CRIT%', crit).replace('%FILE%', P['file'])
TPL = '''<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>%TITRE% · ESTIC</title>
<style>
:root{--ink:#1e3a5f;--acc:%ACC%;--accf:%ACCF%;--or:#ea580c;--gris:#64748b;--fond:#F8F4EC;--bord:#e9e2d4}
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--fond);color:#3f3a34;line-height:1.6}
.estic-bar{display:flex;align-items:center;gap:14px;background:#fff;border-bottom:3px solid var(--acc);padding:8px 20px}.estic-bar img{height:36px}.estic-bar b{color:var(--accf);font-size:14px}.estic-bar span{display:block;font-size:11px;color:var(--gris)}.estic-bar .copy{margin-left:auto;font-size:11px;color:var(--gris)}
header{max-width:920px;margin:0 auto;padding:28px 22px 4px;text-align:center}.eyebrow{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--or);font-weight:800}
h1{font-size:36px;color:var(--accf);margin:6px 0 8px}.sous{font-size:16.5px;color:#5b544a}
section{max-width:920px;margin:22px auto;background:#fff;border:1px solid var(--bord);border-radius:18px;padding:20px 24px}
h2{font-size:21px;color:var(--accf);margin-bottom:8px}h2 .num{display:inline-block;background:var(--acc);color:#fff;border-radius:8px;padding:0 9px;margin-right:8px;font-size:16px}
.go{display:inline-block;background:var(--acc);color:#fff;text-decoration:none;font-weight:700;border-radius:12px;padding:12px 22px;font-size:17px;margin:6px 0}
.tip{background:#fff7ed;border-left:5px solid var(--or);border-radius:10px;padding:10px 14px;margin-top:10px;font-size:15px}
.ck{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px dashed var(--bord);font-size:16px;cursor:pointer}.ck input{width:20px;height:20px;margin-top:3px;accent-color:var(--acc)}
table{width:100%;border-collapse:collapse;font-size:15px}th,td{border:1px solid var(--bord);padding:7px 10px;text-align:left}th{background:#f8fafc;color:var(--accf)}td.n{text-align:center;font-weight:700;width:80px}
.etapes{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.etapes div{background:#f8fafc;border:1px solid var(--bord);border-radius:12px;padding:10px;font-size:14.5px}.etapes b{display:block;color:var(--acc)}
@media(max-width:700px){.etapes{grid-template-columns:1fr 1fr}}
form label{display:block;font-weight:600;font-size:14px;margin:8px 0}form input,form select{display:block;width:100%;margin-top:4px;padding:9px 11px;border:1px solid var(--bord);border-radius:9px;font:15px 'Segoe UI',sans-serif}
.row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}.btn{border:0;background:var(--acc);color:#fff;font:700 15px 'Segoe UI',sans-serif;border-radius:10px;padding:10px 18px;cursor:pointer;margin-top:10px}
.btn.sec{background:#fff;color:var(--accf);border:1px solid var(--bord)}#msg{margin-top:8px;font-weight:600}
#prof{display:none}.pj{border:1px solid var(--bord);border-radius:12px;padding:12px;margin:10px 0}.pj h3{font-size:16px;color:var(--ink)}.pj .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:8px 0}.pj .grid label{font-size:13px;font-weight:400}.pj .grid input{width:70px;display:inline-block;margin-left:6px;padding:4px 6px}
.pj .tot{font-weight:700;color:var(--accf)}footer{text-align:center;padding:20px;font-size:12px;color:var(--gris)}.lk{word-break:break-all}
</style></head><body>
<div class="estic-bar"><img alt="Logo ESTIC" src="logo_estic.png"><div><b>Professeur AGOSTINI</b><span>Technologie · ESTIC</span></div><div class="copy">© ESTIC — Tous droits réservés</div></div>
<header><div class="eyebrow">Séquence %NIV% · Programmation</div><h1>%TITRE%</h1><p class="sous">%SOUS%</p></header>
<section><h2><span class="num">1</span>Ouvrir MakeCode Arcade</h2>
<a class="go" href="https://arcade.makecode.com/" target="_blank" rel="noopener">arcade.makecode.com</a>
<div class="tip">Pour passer en français : roue dentée en haut à droite, puis <b>Langue</b>, puis <b>Français</b>. Clique sur <b>Nouveau projet</b> et donne-lui ton nom.</div></section>
<section><h2><span class="num">2</span>Le cahier des charges</h2><p style="font-size:14px;color:var(--gris);margin-bottom:6px">Coche au fur et à mesure (enregistré sur ce poste).</p>%CDC%</section>
<section><h2><span class="num">3</span>Du Studio Arcade à MakeCode</h2><p style="font-size:15px;margin-bottom:8px">Les blocs sont presque les mêmes. Quelques noms changent :</p>
<table><tr><th>Studio Arcade (TP)</th><th>MakeCode Arcade</th></tr>%EQ%</table></section>
<section><h2><span class="num">4</span>Les étapes</h2><div class="etapes"><div><b>Séance 1</b>Écrire le cahier des charges et dessiner les sprites</div><div><b>Séance 2</b>Programmer les règles principales</div><div><b>Séance 3</b>Ajouter niveaux, sons, finitions</div><div><b>Séance 4</b>Tester, corriger, partager</div></div></section>
<section><h2><span class="num">5</span>Grille d’évaluation</h2><table><tr><th>Critère</th><th>Points</th></tr>%BAR%</table></section>
<section><h2><span class="num">6</span>Rendre mon projet</h2>
<p style="font-size:15px">Dans MakeCode, clique sur <b>Partager</b> (en haut), puis <b>Publier</b> et copie le lien.</p>
<form id="f" onsubmit="return false"><div class="row"><label>Nom<input id="n" required></label><label>Prénom<input id="p" required></label><label>Classe<select id="c">%CLS%</select></label></div>
<label>Lien de partage MakeCode<input id="l" placeholder="https://makecode.com/_..." required></label><label>Nom du jeu<input id="t"></label>
<button class="btn" id="send">Rendre mon projet</button><div id="msg"></div></form></section>
<section><button class="btn sec" id="pbtn">Espace professeur</button><div id="prof"></div></section>
<footer>%TITRE% · Technologie %NIV% · ESTIC Don Bosco</footer>
<script>
const FB='https://evaluation-bloc-default-rtdb.europe-west1.firebasedatabase.app/', NODE='scores_tp/%FB%', EVAL='evaluations/%FB%', CRIT=%CRIT%, LS='cdc_%FB%';
const $=s=>document.querySelector(s);
let st={}; try{ st=JSON.parse(localStorage.getItem(LS))||{}; }catch(e){}
document.querySelectorAll('.ck input').forEach(i=>{ i.checked=!!st[i.dataset.k]; i.onchange=()=>{ st[i.dataset.k]=i.checked; try{ localStorage.setItem(LS,JSON.stringify(st)); }catch(e){} }; });
$('#send').onclick=()=>{ const n=$('#n').value.trim(), p=$('#p').value.trim(), l=$('#l').value.trim();
  if(!n||!p){ $('#msg').textContent='Écris ton nom et ton prénom.'; return; }
  if(!/^https:\\/\\/(arcade\\.)?makecode\\.com\\//.test(l)){ $('#msg').textContent='Colle le lien de partage MakeCode (il commence par https://makecode.com/ ou https://arcade.makecode.com/).'; return; }
  const d={nom:n,prenom:p,classe:$('#c').value,lien:l,titre:$('#t').value.trim(),date:new Date().toISOString()};
  fetch(FB+NODE+'.json',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}).then(r=>{ $('#msg').textContent=r.ok?'Projet rendu. Merci !':'Envoi impossible : montre ton lien au professeur.'; }).catch(()=>{ $('#msg').textContent='Envoi impossible : montre ton lien au professeur.'; }); };
function djb(s){ let h=5381; for(const c of s) h=((h*33)^c.charCodeAt(0))>>>0; return h; }
$('#pbtn').onclick=()=>{ const pw=prompt('Mot de passe professeur'); if(pw===null) return; if(djb(pw)!==%HASH%){ alert('Mot de passe incorrect.'); return; } $('#prof').style.display='block'; $('#pbtn').style.display='none'; load(); };
function esc(s){ return String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
let GR={}; try{ GR=JSON.parse(localStorage.getItem(LS+'_notes'))||{}; }catch(e){}
function load(){ $('#prof').innerHTML='Chargement…'; fetch(FB+NODE+'.json').then(r=>r.json()).then(d=>{ const L=Object.entries(d||{}).sort((a,b)=>(a[1].classe+a[1].nom).localeCompare(b[1].classe+b[1].nom));
  if(!L.length){ $('#prof').innerHTML='<p>Aucun projet rendu pour l\\u2019instant.</p>'; return; }
  $('#prof').innerHTML='<h2>Projets rendus ('+L.length+')</h2>'+L.map(([k,v])=>'<div class="pj" data-k="'+k+'"><h3>'+esc(v.classe)+' · '+esc(v.prenom)+' '+esc(v.nom)+(v.titre?' — '+esc(v.titre):'')+'</h3><a class="lk" href="'+esc(v.lien)+'" target="_blank" rel="noopener">'+esc(v.lien)+'</a>'+
   '<div class="grid">'+CRIT.map((c,i)=>'<label>'+esc(c[0])+'<input type="number" min="0" max="'+c[1]+'" step="0.5" data-i="'+i+'" value="'+(GR[k]?GR[k].notes[i]:'')+'"> / '+c[1]+'</label>').join('')+'</div>'+
   '<span class="tot">'+(GR[k]?'Note déjà envoyée : '+GR[k].note20+' / 20 (renvoyer crée une 2e ligne)':'')+'</span> <button class="btn" data-send="'+k+'">Envoyer la note au tableau de bord</button></div>').join('');
  document.querySelectorAll('[data-send]').forEach(b=>b.onclick=()=>{ const k=b.dataset.send, box=b.closest('.pj'), v=d[k]; const notes=[...box.querySelectorAll('input')].map(i=>Math.min(+i.max,Math.max(0,+i.value||0)));
    const tot=Math.round(notes.reduce((a,x)=>a+x,0)*4)/4;
    const copie={nom:v.nom,prenom:v.prenom||'',classe:v.classe,score:tot,sur:20,note20:tot,duree_s:0,date:new Date().toISOString(),reponses:notes,statut:'terminee',note20_brute:tot,bonus:0,bonus_eleves:'aucun'};
    fetch(FB+EVAL+'.json',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(copie)})
     .then(r=>{ if(r.ok){ GR[k]={notes,note20:tot}; try{ localStorage.setItem(LS+'_notes',JSON.stringify(GR)); }catch(e){} } alert(r.ok?'Note envoyée au tableau de bord : '+tot+' / 20':'Envoi impossible.'); load(); }).catch(()=>alert('Envoi impossible.')); }); }).catch(()=>{ $('#prof').innerHTML='<p>Lecture impossible.</p>'; }); }
</script></body></html>'''
if __name__ == '__main__':
    import sys, build
    out = sys.argv[1]
    for k, P in PRJ.items():
        open(os.path.join(out, P['file']), 'w', encoding='utf-8').write(page(P).replace('%HASH%', str(build.djb(build.PROF_PW))))
        print('ok', P['file'])

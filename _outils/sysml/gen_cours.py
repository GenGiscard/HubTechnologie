# Génère les cours SysML (gabarit diapositives) puis applique le thème moderne
import json, html, sys, os, subprocess
sys.path.insert(0, os.path.dirname(__file__))
from contenu import SEQ, COMP
OUT = sys.argv[1]
D = os.path.dirname(os.path.abspath(__file__))
LIB = open(os.path.join(D, 'sysml_lib.js'), encoding='utf-8').read()
MOD = open(os.path.join(D, 'sysml_modeles.js'), encoding='utf-8').read()
ANIM = open('/home/claude/arcade/anim_lib.js', encoding='utf-8').read()
E = lambda t: html.escape(t, quote=False)
IMG = {'req': 'sysml-exigences-3e', 'uc': 'sysml-cas-dutilisation-3e', 'bdd': 'sysml-definition-de-blocs-3e', 'ibd': 'sysml-blocs-internes-3e', 'seq': 'sysml-sequence-3e', 'stm': 'sysml-etats-3e'}

def animbox(nom, cid):
    return f'''<div class="animbox">
 <canvas id="{cid}" width="820" height="420"></canvas>
 <div class="legende"><div class="caption" id="cap_{nom}"></div></div>
 <div class="anavig">
 <button class="navbtn" data-prev="{nom}">◀ Précédent</button>
 <div class="phasepts" id="pts_{nom}"></div>
 <button class="navbtn" data-next="{nom}">Suivant ▶</button>
 <button class="rejbtn" data-anim="{nom}">⟳ Rejouer l’étape</button>
 </div>
</div>'''

for S in SEQ:
    menu = [('s1', S['court']), ('sObj', 'Objectifs & compétences'), ('s2', 'À quoi ça sert ?'), ('s3', S['anim1']['titre'].replace('Construire le ', '').capitalize() + ' (animation)'),
            ('s4', 'Le vocabulaire'), ('s5', S['anim2']['titre'].split(' : ')[0]), ('s6', S['anim3']['titre']), ('s7', 'À retenir'), ('sTrace', 'Trace écrite')]
    nav = ''.join(f'<a href="#{i}"><span class="dot"></span>{E(t)}</a>' for i, t in menu)
    obj = ''.join(f'<li>{E(o)}</li>' for o in S['objectifs'])
    comp = ''.join(f'<tr><td class="obj-code">{COMP[c][0]}</td><td>{E(COMP[c][1])}</td></tr>' for c in S['comps'])
    cartes = ''.join(f'<div class="carte" style="--accent:{c[3]}"><h3>{E(c[0])}</h3><p>{E(c[1])}</p><span class="ex">{E(c[2])}</span></div>' for c in S['cartes'])
    vocab = ''.join(f'<tr><td><b>{E(a)}</b></td><td>{E(b)}</td></tr>' for a, b in S['vocab'])
    ret = ''.join(f'<li>{r}</li>' for r in S['retenir'])
    tr = ''.join(f'<li>{r}</li>' for r in S['trace'])
    anims = {k: S[k] for k in ('anim1', 'anim2', 'anim3')}
    page = f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cours 3ème — {E(S['titre'])} · ESTIC</title>
<style>
:root{{--ink:#1e3a5f;--niv:#1d4ed8;--niv-fonce:#1e40af;--orange:#ea580c;--papier:#f8fafc;--gris:#64748b;--vert:#16a34a;--rouge:#dc2626;--ombre:0 4px 14px rgba(30,58,95,.10)}}
*{{margin:0;padding:0;box-sizing:border-box}}html{{scroll-behavior:smooth}}
body{{font-family:'Segoe UI',system-ui,sans-serif;background:var(--papier);color:var(--ink)}}
.estic-bar{{position:sticky;top:0;z-index:50;display:flex;align-items:center;gap:14px;background:#fff;padding:8px 20px}}
.estic-bar img{{height:38px}}.estic-bar .id span{{display:block;font-size:11px;color:var(--gris)}}.estic-bar .copy{{margin-left:auto;font-size:11px;color:var(--gris)}}
nav.side{{position:fixed;left:0;top:64px;bottom:0;width:230px;overflow-y:auto}}
nav.side a{{display:flex;align-items:center;gap:9px;padding:9px 12px;margin:2px 0;text-decoration:none}}
nav.side a .dot{{width:9px;height:9px;border-radius:50%;flex-shrink:0}}
nav.side .aide{{margin-top:18px;padding:10px 12px;line-height:1.5}}
main{{margin-left:230px}}
section.slide{{min-height:calc(100vh - 64px);display:flex;flex-direction:column;justify-content:center}}
.cartes{{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;margin-top:26px}}
.carte p{{color:var(--gris);line-height:1.5;margin:6px 0}}.carte .ex{{display:inline-block;margin-top:8px}}
.animbox{{max-width:900px}}.animbox canvas{{width:100%;height:auto;display:block;background:#fff}}
.legende{{display:flex;align-items:center;gap:14px;margin-top:12px}}.legende .caption{{flex:1;min-height:46px;display:flex;align-items:center}}
.anavig{{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:14px;flex-wrap:wrap}}
.phasepts{{display:flex;gap:6px}}.phasepts span{{width:26px;height:6px;background:#e2e8f0}}
.navbtn{{border:none;color:#fff;font-size:15px;cursor:pointer}}.navbtn:disabled{{background:#e2e8f0!important;color:#94a3b8;cursor:not-allowed}}
.rejbtn{{background:#fff;font-size:13px;padding:0 15px;cursor:pointer}}
table.mat{{border-collapse:collapse;width:100%;max-width:900px;margin-top:24px}}table.mat th,table.mat td{{padding:12px 14px;text-align:left;color:inherit}}table.mat th{{color:#fff}}
.kbd{{font-size:12px;padding:2px 7px;font-family:monospace}}
@media (max-width:900px){{nav.side{{display:none}}main{{margin-left:0}}}}
</style>
</head>
<body>
<div class="estic-bar">
 <img alt="Logo ESTIC" src="logo_estic.png">
 <div class="id"><b>Professeur AGOSTINI</b><span>Technologie · ESTIC</span></div>
 <div class="copy">© ESTIC — Tous droits réservés</div>
</div>
<div class="layout">
<nav class="side" id="menu">{nav}<div class="aide">Navigation : molette ou touches <span class="kbd">↑</span> <span class="kbd">↓</span></div></nav>
<main>
<section class="slide" id="s1">
 <div class="eyebrow">Technologie · 3ème · SysML · Diagramme {S['sigle']}</div>
 <h1>{E(S['titre'])}</h1>
 <p class="sous" style="margin-top:16px">{E(S['accroche'])} Notre fil rouge : un <b>robot aspirateur</b>.</p>
</section>
<section id="sObj">
 <h2>Objectifs et compétences travaillées</h2>
 <div class="obj-bloc"><div class="obj-t">OBJECTIFS D’APPRENTISSAGE</div><ul>{obj}</ul></div>
 <div class="obj-bloc"><div class="obj-t">COMPÉTENCES DU PROGRAMME (BO n° 9 du 29 février 2024)</div><table>{comp}</table>
 <div class="obj-rep"><b>Repère de progressivité :</b> 3e — décrire la structure et le comportement d’un système avec un langage adapté (SysML).</div></div>
</section>
<section class="slide" id="s2">
 <h2>À quoi sert ce diagramme ?</h2>
 <div class="cartes">{cartes}</div>
</section>
<section class="slide" id="s3"><h2>{E(S['anim1']['titre'])}</h2>{animbox('a1','cvA1')}</section>
<section class="slide" id="s4"><h2>Le vocabulaire</h2><table class="mat"><tr><th>Mot</th><th>Ce que ça veut dire</th></tr>{vocab}</table></section>
<section class="slide" id="s5"><h2>{E(S['anim2']['titre'])}</h2>{animbox('a2','cvA2')}</section>
<section class="slide" id="s6"><h2>{E(S['anim3']['titre'])}</h2>{animbox('a3','cvA3')}</section>
<section class="slide" id="s7"><h2>À retenir</h2><div class="retenir"><ul>{ret}</ul></div>
 <p class="sous" style="margin-top:22px">Prochaine étape : le <b>TP</b>, pour lire et compléter des diagrammes toi-même.</p></section>
<section id="sTrace">
 <h2>Trace écrite</h2>
 <p class="tr-consigne">À recopier sur le cahier, schéma compris.</p>
 <canvas id="trace_sysml" width="820" height="420" class="tr-schema"></canvas>
 <ul class="tr-liste">{tr}</ul>
</section>
</main>
</div>
<script>
{LIB}
{MOD}
{ANIM}
/* ===== Animations construites à partir des modèles ===== */
const ANIMS_DEF={json.dumps(anims, ensure_ascii=False)};
function idsModele(M){{ return [...M.el.map(e=>e.id),...M.liens.map(l=>l.id||(l.de+'>'+l.a))]; }}
function fondDiag(c,W,H){{ const g=c.createLinearGradient(0,0,0,H); g.addColorStop(0,'#ffffff'); g.addColorStop(1,'#f5f8ff'); c.fillStyle=g; c.fillRect(0,0,W,H);
 c.fillStyle='rgba(29,78,216,.05)'; for(let x=14;x<W;x+=24) for(let y=14;y<H;y+=24){{ c.beginPath(); c.arc(x,y,1.2,0,7); c.fill(); }} }}
function phasesDe(def){{ const M=MODELES[def.modele], tous=idsModele(M); let deja=[];
 return def.phases.map(ph=>{{ const [cap,show,hl,faux,rempl]=ph; const nouv=show.includes('*')?tous.filter(i=>!deja.includes(i)):show; const avant=deja.slice(); deja=deja.concat(nouv);
  const n=Math.max(1,nouv.length);
  return {{dur:Math.max(2600,1400+nouv.length*500), caption:cap, draw(c,p,W,H,t){{ fondDiag(c,W,H);
   const vis=id=>{{ if(avant.includes(id)) return 1; const k=nouv.indexOf(id); if(k<0) return 0; return clamp((p*1.4-k/n*.9)*n/1.2); }};
   const pulse=.5+.5*Math.sin(t*5);
   SYS.dessiner(c,M,{{vis,hl:p>.15?hl:[],faux:faux||[],remplis:rempl||{{}}}});
  }}}}; }}); }}
creerAnim('a1','cvA1','cap_a1','pts_a1',phasesDe(ANIMS_DEF.anim1));
creerAnim('a2','cvA2','cap_a2','pts_a2',phasesDe(ANIMS_DEF.anim2));
creerAnim('a3','cvA3','cap_a3','pts_a3',phasesDe(ANIMS_DEF.anim3));
/* ===== Trace écrite : le diagramme du fil rouge ===== */
(function(){{ const cv=document.getElementById('trace_sysml'); const c=SYS.setup(cv); const dessin=()=>{{ c.clearRect(0,0,820,420); c.fillStyle='#fff'; c.fillRect(0,0,820,420); SYS.dessiner(c,MODELES[ANIMS_DEF.anim1.modele],{{}}); }}; dessin(); document.fonts&&document.fonts.ready&&document.fonts.ready.then(dessin); }})();
/* ===== Navigation ===== */
document.querySelectorAll('button[data-prev]').forEach(b=>b.addEventListener('click',()=>ANIMS[b.dataset.prev].precedent()));
document.querySelectorAll('button[data-next]').forEach(b=>b.addEventListener('click',()=>ANIMS[b.dataset.next].suivant()));
document.querySelectorAll('button[data-anim]').forEach(b=>b.addEventListener('click',()=>ANIMS[b.dataset.anim].rejouer()));
const slideAnim={{s3:'a1',s5:'a2',s6:'a3'}}, lancees=new Set();
const obsAnim=new IntersectionObserver(es=>{{es.forEach(en=>{{const n=slideAnim[en.target.id]; if(en.isIntersecting&&n&&!lancees.has(n)){{lancees.add(n);ANIMS[n].demarrer();}}}});}},{{threshold:0.5}});
Object.keys(slideAnim).forEach(id=>obsAnim.observe(document.getElementById(id)));
const liensMenu=[...document.querySelectorAll('#menu a')];
const obsMenu=new IntersectionObserver(es=>{{es.forEach(en=>{{if(en.isIntersecting)liensMenu.forEach(a=>a.classList.toggle('actif',a.getAttribute('href')==='#'+en.target.id));}});}},{{rootMargin:'-30% 0px -60% 0px'}});
document.querySelectorAll('main > section').forEach(s=>obsMenu.observe(s));
const slides=[...document.querySelectorAll('main > section')];
function slideCourante(){{const y=window.scrollY+window.innerHeight/2;let best=0;slides.forEach((s,i)=>{{if(s.offsetTop<y)best=i;}});return best;}}
document.addEventListener('keydown',e=>{{
 if(e.key==='ArrowDown'||e.key==='PageDown'){{e.preventDefault();slides[Math.min(slides.length-1,slideCourante()+1)].scrollIntoView({{behavior:'smooth'}});}}
 if(e.key==='ArrowUp'||e.key==='PageUp'){{e.preventDefault();slides[Math.max(0,slideCourante()-1)].scrollIntoView({{behavior:'smooth'}});}}
}});
</script>
<script src="portail_suivi.js"></script>
</body>
</html>'''
    f = os.path.join(OUT, f"01_cours_sysml_{S['cle']}.html")
    open(f, 'w', encoding='utf-8').write(page)
    subprocess.run(['python3', '/home/claude/arcade/cours_theme.py', f, '#1d4ed8', '#1e40af', IMG[S['cle']]], check=True, capture_output=True)
    print('cours', f)

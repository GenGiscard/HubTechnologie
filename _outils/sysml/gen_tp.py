# Génère les TP SysML : 8 missions progressives, code des mini-jeux à la fin
import json, html, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from contenu import SEQ
OUT = sys.argv[1]
D = os.path.dirname(os.path.abspath(__file__))
LIB = open(os.path.join(D, 'sysml_lib.js'), encoding='utf-8').read()
MOD = open(os.path.join(D, 'sysml_modeles.js'), encoding='utf-8').read()
E = lambda t: html.escape(t, quote=False)

CSS = '''
:root{--c:#1d4ed8;--cf:#1e40af;--ct:#eef2ff;--ink:#1b2f4b;--gris:#5b6b80;--ligne:#e3e9f2;--vert:#16a34a;--rouge:#dc2626;--ombre:0 16px 36px -18px rgba(29,78,216,.45),0 2px 6px rgba(15,23,42,.05)}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Nunito,'Segoe UI',system-ui,sans-serif;color:var(--ink);background:radial-gradient(900px 600px at 100% 0%,rgba(29,78,216,.12),transparent 70%),#f4f7fb;background-attachment:fixed;min-height:100vh}
.estic-bar{position:sticky;top:0;z-index:40;display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.88);backdrop-filter:blur(14px);border-bottom:1px solid var(--ligne);padding:10px 22px}
.estic-bar img{height:38px}.estic-bar b{font-size:15px}.estic-bar span{display:block;font-size:12.5px;color:var(--gris)}.estic-bar .copy{margin-left:auto;font-size:12px;color:var(--gris)}
header{max-width:1000px;margin:0 auto;padding:30px 20px 6px}
.eyebrow{display:inline-block;font-size:14px;font-weight:900;color:var(--cf);background:var(--ct);border-radius:999px;padding:6px 14px}
h1{font-size:clamp(30px,4vw,44px);font-weight:900;line-height:1.08;margin:12px 0 8px}
header p{font-size:17px;color:#3b4d66;max-width:70ch}
.etapes{max-width:1000px;margin:14px auto 0;padding:0 20px;display:flex;gap:8px;flex-wrap:wrap}
.etapes button{font:inherit;font-weight:900;font-size:14px;width:44px;height:44px;border-radius:14px;border:0;background:#fff;color:var(--gris);box-shadow:0 6px 14px -10px rgba(15,23,42,.4);cursor:pointer}
.etapes button.fait{background:var(--vert);color:#fff}.etapes button.cours{background:linear-gradient(135deg,var(--c),var(--cf));color:#fff}.etapes button:disabled{opacity:.45;cursor:not-allowed}
main{max-width:1000px;margin:18px auto 50px;padding:0 20px}
.mission{background:rgba(255,255,255,.92);border:1px solid #fff;border-radius:26px;box-shadow:var(--ombre);padding:26px 28px}
.mission h2{display:flex;align-items:center;gap:12px;font-size:clamp(22px,2.6vw,28px);font-weight:900}
.mission h2 .badge{display:inline-flex;align-items:center;justify-content:center;min-width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,var(--c),var(--cf));color:#fff;font-size:20px}
.consigne{font-size:17px;color:#334155;margin:10px 0 14px;font-weight:700}
.cv{width:100%;height:auto;display:block;border-radius:18px;border:1px solid var(--ligne);background:#fff;cursor:pointer;touch-action:manipulation}
.invite{display:flex;align-items:center;gap:10px;background:var(--ct);border-radius:14px;padding:12px 16px;font-weight:800;font-size:16px;margin:0 0 12px}
.invite b{color:var(--cf)}
.etiqs{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:14px 0}
.etiqs button,.choix button,.assoc button{font:inherit;font-weight:800;font-size:15px;border:2px solid var(--ligne);background:#fff;color:var(--ink);border-radius:14px;padding:10px 14px;cursor:pointer;min-height:44px;transition:transform .12s}
.etiqs button:hover,.choix button:hover,.assoc button:hover{transform:translateY(-2px);border-color:var(--c)}
.etiqs button.sel,.assoc button.sel{border-color:var(--c);background:var(--ct);box-shadow:0 0 0 3px rgba(29,78,216,.2)}
.etiqs button.pose{opacity:.35;pointer-events:none}
.ok{background:var(--vert)!important;color:#fff!important;border-color:var(--vert)!important}
.ko{background:var(--rouge)!important;color:#fff!important;border-color:var(--rouge)!important}
.assoc{display:grid;grid-template-columns:1fr 1fr;gap:10px}.assoc .col{display:flex;flex-direction:column;gap:8px}
.ligneC{background:#f8fafc;border-radius:14px;padding:12px;margin:8px 0}.ligneC .q{font-weight:800;margin-bottom:8px}
.choix{display:flex;flex-wrap:wrap;gap:8px}
.suite{min-height:52px;background:#f8fafc;border-radius:14px;padding:10px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:8px;font-weight:800}
.fb{margin-top:14px;border-radius:14px;padding:12px 16px;font-weight:800;display:none}.fb.on{display:block}.fb.bien{background:#dcfce7;color:#14532d}.fb.mal{background:#fee2e2;color:#7f1d1d}
.btns{display:flex;gap:10px;justify-content:flex-end;margin-top:16px;flex-wrap:wrap}
.btn{font:inherit;font-weight:900;font-size:15.5px;border:0;border-radius:999px;min-height:46px;padding:0 22px;color:#fff;background:linear-gradient(135deg,var(--c),var(--cf));box-shadow:0 8px 18px -10px var(--c);cursor:pointer}
.btn.gris{background:#e2e8f0;color:var(--ink);box-shadow:none}.btn:disabled{opacity:.45;cursor:not-allowed}
.etoiles{font-weight:900;color:#b45309}
.codefinal{display:none;text-align:center;margin-top:18px;background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-radius:20px;padding:20px}
.codefinal.on{display:block}.codefinal .code{font-family:ui-monospace,Consolas,monospace;font-size:34px;font-weight:900;letter-spacing:4px;color:#047857;margin:8px 0}
.codefinal a{color:#047857;font-weight:900}
.cahiernote{background:#fffbeb;border-left:0;border-radius:12px;padding:10px 14px;font-size:14.5px;color:#92400e;font-weight:700;margin-bottom:12px}
button:focus-visible{outline:3px solid #f59e0b;outline-offset:2px}
@media(max-width:640px){.assoc{grid-template-columns:1fr}.mission{padding:18px}}
'''

JS = r'''
const $=s=>document.querySelector(s);
function el(tag,attrs={},parent=null,txt=''){ const e=document.createElement(tag); Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v)); if(txt) e.textContent=txt; if(parent) parent.appendChild(e); return e; }
const melange=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const CLE='tp_sysml_'+T.cle;
let etat; try{ etat=JSON.parse(localStorage.getItem(CLE))||{fait:[],etoiles:{}}; }catch(e){ etat={fait:[],etoiles:{}}; }
const sauver=()=>{ try{ localStorage.setItem(CLE,JSON.stringify(etat)); }catch(e){} };
function idsM(M){ return [...M.el.map(e=>e.id),...M.liens.map(l=>l.id||(l.de+'>'+l.a))]; }
function canvasModele(zone,M){ const cv=el('canvas',{width:820,height:420,class:'cv'},zone); const c=SYS.setup(cv); return {cv,c}; }
function peindre(c,M,o){ c.clearRect(0,0,820,420); c.fillStyle='#fff'; c.fillRect(0,0,820,420); SYS.dessiner(c,M,o); }
function cible(cv,M,ev,ids){ const r=cv.getBoundingClientRect(), x=(ev.clientX-r.left)*820/r.width, y=(ev.clientY-r.top)*420/r.height; let best=null, aire=1e9;
 (ids||idsM(M)).forEach(id=>{ if(id==='cadre') return; const z=SYS.zone(M,id); if(!z) return; if(x>=z[0]-6&&x<=z[0]+z[2]+6&&y>=z[1]-6&&y<=z[1]+z[3]+6){ const a=z[2]*z[3]; if(a<aire){ aire=a; best=id; } } }); return best; }
function fb(zone,ok,txt){ let f=zone.querySelector('.fb'); if(!f) f=el('div',{class:'fb'},zone); f.className='fb on '+(ok?'bien':'mal'); f.innerHTML=txt; }
function termine(i,premier,zone){ if(!etat.fait.includes(i)) etat.fait.push(i); etat.etoiles[i]=Math.max(etat.etoiles[i]||0,premier?3:2); sauver(); majEtapes();
 const b=el('div',{class:'btns'},zone); if(i<MISSIONS.length-1){ const n=el('button',{class:'btn'},b,'Mission suivante ➜'); n.onclick=()=>ouvrir(i+1); } }
/* ---------- types de missions ---------- */
const TYPES={
 cliquer(zone,m,fin){ const M=MODELES[m.modele]; const inv=el('div',{class:'invite'},zone); const {cv,c}=canvasModele(zone,M); let k=0, erreurs=0, trouves=[];
  const maj=()=>{ inv.innerHTML='<span>'+(k+1)+' / '+m.items.length+'</span> <b></b>'; inv.querySelector('b').textContent=m.items[k][0]; peindre(c,M,{hl:trouves}); };
  maj(); cv.onclick=ev=>{ if(k>=m.items.length) return; const id=cible(cv,M,ev); if(!id) return;
   if(id===m.items[k][1]){ trouves.push(id); k++; if(k>=m.items.length){ peindre(c,M,{hl:trouves}); inv.innerHTML='<b>Tout est trouvé !</b>'; fb(zone,true,erreurs?'Bravo ! Relis bien la consigne pour réussir du premier coup.':'Parfait, aucune erreur !'); fin(erreurs===0); } else maj(); }
   else { erreurs++; peindre(c,M,{hl:trouves,faux:[id]}); setTimeout(()=>peindre(c,M,{hl:trouves}),600); } }; },
 associer(zone,m,fin){ const g=el('div',{class:'assoc'},zone), A=el('div',{class:'col'},g), B=el('div',{class:'col'},g); let sel=null, ok=0, err=0;
  melange(m.paires.map((p,i)=>[p[0],i])).forEach(([t,i])=>{ const b=el('button',{},A,t); b.dataset.i=i; b.onclick=()=>{ if(b.classList.contains('ok')) return; A.querySelectorAll('button').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); sel=b; }; });
  melange(m.paires.map((p,i)=>[p[1],i])).forEach(([t,i])=>{ const b=el('button',{},B,t); b.onclick=()=>{ if(!sel||b.classList.contains('ok')) return; if(+sel.dataset.i===i){ sel.classList.remove('sel'); sel.classList.add('ok'); b.classList.add('ok'); sel=null; ok++; if(ok===m.paires.length){ fb(zone,true,'Toutes les paires sont trouvées.'); fin(err===0); } } else { err++; b.classList.add('ko'); setTimeout(()=>b.classList.remove('ko'),500); } }; }); },
 completer(zone,m,fin){ const M=MODELES[m.modele]; const {cv,c}=canvasModele(zone,M); const rem={}; let choisi=null, essais=0;
  const reponse={}; m.trous.forEach(id=>{ const e=M.el.find(x=>x.id===id); const l=M.liens.find(x=>(x.id||(x.de+'>'+x.a))===id); reponse[id]=e?e.txt:(l.label||''); });
  const zEt=el('div',{class:'etiqs'},zone); const boutons={};
  melange(m.etiq).forEach(t=>{ const b=el('button',{},zEt,t); boutons[t]=b; b.onclick=()=>{ zEt.querySelectorAll('button').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); choisi=t; }; });
  const maj=(faux)=>peindre(c,M,{trous:m.trous,remplis:rem,faux:faux||[]}); maj();
  cv.onclick=ev=>{ const id=cible(cv,M,ev,m.trous); if(!id) return; if(rem[id]){ boutons[rem[id]].classList.remove('pose'); delete rem[id]; maj(); return; } if(!choisi) return; rem[id]=choisi; boutons[choisi].classList.add('pose'); boutons[choisi].classList.remove('sel'); choisi=null; maj(); val.disabled=Object.keys(rem).length<m.trous.length; };
  const b=el('div',{class:'btns'},zone), val=el('button',{class:'btn'},b,'Valider'); val.disabled=true;
  val.onclick=()=>{ essais++; const faux=m.trous.filter(id=>rem[id]!==reponse[id]); if(!faux.length){ maj(); val.disabled=true; cv.onclick=null; fb(zone,true,'Diagramme complet et juste !'); fin(essais===1); }
   else { maj(faux); fb(zone,false,faux.length+' case(s) fausse(s), en rouge. Clique une case pour la vider, puis recommence.'); } }; },
 classer(zone,m,fin){ let rep=0, pts=0; melange(m.items).forEach(([t,k])=>{ const l=el('div',{class:'ligneC'},zone); el('div',{class:'q'},l,t); const ch=el('div',{class:'choix'},l); let premier=true, fait=false;
   m.cats.forEach((cat,j)=>{ const b=el('button',{},ch,cat); b.onclick=()=>{ if(fait) return; if(j===k){ fait=true; b.classList.add('ok'); if(premier) pts++; rep++; if(rep===m.items.length){ fb(zone,pts===m.items.length,pts+' / '+m.items.length+' du premier coup.'); fin(pts===m.items.length); } } else { premier=false; b.classList.add('ko'); } }; }); }); },
 ordre(zone,m,fin){ let k=0, err=0; const rang=el('div',{class:'etiqs'},zone), suite=el('div',{class:'suite'},zone);
  const init=()=>{ k=0; rang.innerHTML=''; suite.innerHTML='<span style="color:#94a3b8">— ton ordre apparaît ici —</span>'; melange(m.items).forEach(t=>{ const b=el('button',{},rang,t); b.onclick=()=>{ if(t===m.items[k]){ if(k===0) suite.innerHTML=''; b.classList.add('pose'); el('span',{},suite,(k?' → ':'')+t); k++; if(k===m.items.length){ fb(zone,true,'Ordre parfait : '+m.items.join(' → ')); fin(err===0); } } else { err++; b.classList.add('ko'); fb(zone,false,'Pas encore : on recommence depuis le début.'); setTimeout(init,900); } }; }); };
  init(); },
 erreur(zone,m,fin){ const M=MODELES[m.modele]; const {cv,c}=canvasModele(zone,M); let err=0; peindre(c,M,{remplis:m.remplis});
  cv.onclick=ev=>{ const id=cible(cv,M,ev); if(!id) return; if(id===m.cible){ cv.onclick=null; peindre(c,M,{remplis:m.remplis,faux:[id]}); fb(zone,true,'Trouvé ! '+m.expl); fin(err===0); } else { err++; peindre(c,M,{remplis:m.remplis,faux:[id]}); setTimeout(()=>peindre(c,M,{remplis:m.remplis}),600); fb(zone,false,'Ce n’est pas là. Cherche l’élément qui n’a pas sa place.'); } }; },
 quiz(zone,m,fin){ const tirer=()=>{ zone.querySelectorAll('.ligneC,.btns.q,.fb').forEach(x=>x.remove()); const Q=melange(m.pool).slice(0,4); const rep={};
   Q.forEach((q,i)=>{ const l=el('div',{class:'ligneC'},zone); el('div',{class:'q'},l,(i+1)+'. '+q[0]); const ch=el('div',{class:'choix'},l); melange(q[1].map((t,j)=>[t,j])).forEach(([t,j])=>{ const b=el('button',{},ch,t); b.onclick=()=>{ ch.querySelectorAll('button').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); rep[i]=j; b.style.borderColor='var(--c)'; ch.querySelectorAll('button').forEach(x=>{ if(x!==b) x.style.borderColor=''; }); v.disabled=Object.keys(rep).length<4; }; }); });
   const bb=el('div',{class:'btns q'},zone), v=el('button',{class:'btn'},bb,'Valider le bilan'); v.disabled=true;
   v.onclick=()=>{ const n=Q.filter((q,i)=>rep[i]===q[2]).length; if(n>=3){ v.disabled=true; fb(zone,true,n+' / 4 : bilan réussi !'); $('#codefinal').classList.add('on'); fin(n===4); } else { fb(zone,false,n+' / 4 : il en faut au moins 3. Les questions vont changer, relis le cours si besoin.'); v.disabled=true; setTimeout(tirer,2200); } }; };
  tirer(); },
};
const MISSIONS=T.missions;
function majEtapes(){ const z=$('#etapes'); z.innerHTML=''; MISSIONS.forEach((m,i)=>{ const b=el('button',{title:m.titre},z,String(i+1)); const dispo=i===0||etat.fait.includes(i-1)||etat.fait.includes(i); b.disabled=!dispo; if(etat.fait.includes(i)) b.classList.add('fait'); if(i===courante) b.classList.add('cours'); b.onclick=()=>ouvrir(i); }); }
let courante=0;
function ouvrir(i){ courante=i; const m=MISSIONS[i]; const z=$('#mission'); z.innerHTML=''; const h=el('h2',{},z); el('span',{class:'badge'},h,String(i+1)); h.appendChild(document.createTextNode(m.titre));
 if(etat.etoiles[i]) el('span',{class:'etoiles',style:'margin-left:auto;font-size:15px'},h,'★'.repeat(etat.etoiles[i])+'☆'.repeat(3-etat.etoiles[i]));
 el('div',{class:'consigne'},z,m.consigne); if(m.cahier) el('div',{class:'cahiernote'},z,'SUR TON CAHIER — '+m.cahier);
 const zone=el('div',{},z); TYPES[m.type](zone,m,premier=>termine(i,premier,zone)); majEtapes(); window.scrollTo({top:$('#etapes').offsetTop-80,behavior:'smooth'}); }
const debut=Math.min(MISSIONS.length-1,(etat.fait.length?Math.max(...etat.fait)+1:0)); majEtapes(); ouvrir(debut);
if(etat.fait.includes(MISSIONS.length-1)) $('#codefinal').classList.add('on');
document.fonts&&document.fonts.ready&&document.fonts.ready.then(()=>{ /* redessine les canvas avec la bonne police */ ouvrir(courante); });
'''

for S in SEQ:
    missions = [
     dict(type='cliquer', titre='Repère les éléments', consigne='Lis la question dans le cadre bleu, puis clique le bon élément du diagramme.', modele=S['completer']['modele'], items=S['cliquer']),
     dict(type='associer', titre='Le bon mot', consigne='Clique un mot à gauche, puis sa définition à droite.', paires=S['vocab']),
     dict(type='completer', titre='Complète le diagramme', consigne='Clique une étiquette, puis la case « ? » où elle va. Attention aux intrus !', **S['completer']),
     dict(type='classer', titre='Trie les éléments', consigne='Pour chaque élément, clique la bonne famille. Un point par bonne réponse du premier coup.', **S['classer']),
     dict(type='ordre', titre='Dans le bon ordre', consigne=S['ordre']['consigne']+' Clique les étiquettes une par une.', items=S['ordre']['items']),
     dict(type='erreur', titre='Trouve l’erreur', consigne='Un élément de ce diagramme est faux. Clique-le.', **S['erreur']),
     dict(type='completer', titre='À toi sur un autre objet', consigne='Même travail sur un nouvel objet : clique une étiquette, puis sa case.', **S['completer2']),
     dict(type='quiz', titre='Bilan', consigne='Réponds aux 4 questions puis valide. Il faut au moins 3 bonnes réponses pour obtenir le code.', pool=S['qcm'][:8]),
    ]
    for m in missions:
        m.pop('etiqLiens', None)
    T = dict(cle=S['cle'], missions=missions)
    page = f'''<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TP 3ème — {E(S['titre'])} · ESTIC</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800;900&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>
<div class="estic-bar"><img alt="Logo ESTIC" src="logo_estic.png"><div><b>Professeur AGOSTINI</b><span>Technologie · ESTIC</span></div><div class="copy">© ESTIC — Tous droits réservés</div></div>
<header><span class="eyebrow">TP · 3ème · SysML · {S['sigle']}</span><h1>{E(S['titre'])}</h1><p>8 missions pour lire, compléter et corriger des diagrammes. Le code des mini-jeux t’attend à la fin.</p></header>
<nav class="etapes" id="etapes" aria-label="Missions"></nav>
<main><div class="mission" id="mission"></div>
<div class="codefinal" id="codefinal">Diagramme maîtrisé ! Voici le code des mini-jeux :<div class="code">{S['code_jeux']}</div>
<div>Entre-le dans <a href="03_jeu_sysml_{S['cle']}.html">SysML Blaster</a> et <a href="03b_jeu_sysml_{S['cle']}.html">Atelier express</a>.</div></div></main>
<script>{LIB}
{MOD}
const T={json.dumps(T, ensure_ascii=False)};
{JS}</script>
</body></html>'''
    f = os.path.join(OUT, f"02_tp_sysml_{S['cle']}.html")
    open(f, 'w', encoding='utf-8').write(page); print('tp', f)

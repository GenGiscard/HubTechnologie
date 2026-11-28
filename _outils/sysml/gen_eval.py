# Génère les évaluations SysML à partir du moteur d'évaluation existant (robotique 3e)
import json, re, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from contenu import SEQ
REPO, OUT = sys.argv[1], sys.argv[2]
D = os.path.dirname(os.path.abspath(__file__))
LIB = open(os.path.join(D, 'sysml_lib.js'), encoding='utf-8').read()
MOD = open(os.path.join(D, 'sysml_modeles.js'), encoding='utf-8').read()
BASE = open(os.path.join(REPO, '04_evaluation_robotique.html'), encoding='utf-8').read()

FACT = r'''
/* ===== Fabriques d'activités SysML (aucune correction pendant l'épreuve) ===== */
const melangeS=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
function cvSys(zone){ const cv=el('canvas',{width:820,height:420,style:'width:100%;height:auto;display:block;border:1px solid #e2e8f0;border-radius:14px;background:#fff;cursor:pointer;margin:6px 0'},zone); return {cv,c:SYS.setup(cv)}; }
function peindreS(c,M,o){ c.clearRect(0,0,820,420); c.fillStyle='#fff'; c.fillRect(0,0,820,420); SYS.dessiner(c,M,o||{}); }
function idsS(M){ return [...M.el.map(e=>e.id),...M.liens.map(l=>l.id||(l.de+'>'+l.a))]; }
function cibleS(cv,M,ev,ids){ const r=cv.getBoundingClientRect(), x=(ev.clientX-r.left)*820/r.width, y=(ev.clientY-r.top)*420/r.height; let best=null, aire=1e9;
 (ids||idsS(M)).forEach(id=>{ if(id==='cadre') return; const z=SYS.zone(M,id); if(!z) return; if(x>=z[0]-6&&x<=z[0]+z[2]+6&&y>=z[1]-6&&y<=z[1]+z[3]+6){ const a=z[2]*z[3]; if(a<aire){ aire=a; best=id; } } }); return best; }
function txtS(M,id){ const e=M.el.find(x=>x.id===id); if(e) return e.txt; const l=M.liens.find(x=>(x.id||(x.de+'>'+x.a))===id); return l&&l.label; }
const FAB={
 qcm(titre,qs,pt){ return {titre,icone:'',max:qs.length*pt,consigne:'Pour chaque question, clique la bonne réponse, puis valide. ('+pt+' pt par question)',
  render(zone,done){ const rep={}; qs.forEach((q,i)=>{ const l=el('div',{style:'background:#f8fafc;border-radius:12px;padding:12px;margin:8px 0'},zone); el('div',{style:'font-weight:800;margin-bottom:8px;font-size:15.5px'},l,(i+1)+'. '+q[0]); const r=el('div',{class:'etiqs',style:'justify-content:flex-start;margin:0'},l);
   melangeS(q[1].map((t,j)=>[t,j])).forEach(([t,j])=>{ const b=el('button',{style:'font-size:14px;padding:8px 12px'},r,t); b.onclick=()=>{ r.querySelectorAll('button').forEach(x=>{ x.style.background=''; x.style.color=''; }); b.style.background='#1d4ed8'; b.style.color='#fff'; rep[i]=j; v.disabled=Object.keys(rep).length<qs.length; }; }); });
   const v=boutonValider(zone,()=>{ v.disabled=true; let p=0; qs.forEach((q,i)=>{ if(rep[i]===q[2]) p+=pt; }); feedback(p===qs.length*pt?'ok':(p>0?'moyen':'ko'),'Bonnes réponses : '+qs.map(q=>'« '+q[1][q[2]]+' »').join(' · ')); done(p); }); } }; },
 associer(paires){ return {titre:'Le vocabulaire',icone:'',max:paires.length*.5,consigne:'Clique un mot à gauche puis sa définition à droite. Une association validée ne peut plus changer. (0,5 pt par bonne paire)',
  render(zone,done){ const g=el('div',{style:'display:grid;grid-template-columns:1fr 1fr;gap:10px'},zone), A=el('div',{style:'display:flex;flex-direction:column;gap:8px'},g), B=el('div',{style:'display:flex;flex-direction:column;gap:8px'},g); let sel=null, n=0, p=0;
   const st='font:inherit;font-weight:700;font-size:14px;border:2px solid #e2e8f0;background:#fff;border-radius:12px;padding:9px;cursor:pointer;text-align:left';
   melangeS(paires.map((x,i)=>[x[0],i])).forEach(([t,i])=>{ const b=el('button',{style:st},A,t); b.onclick=()=>{ if(b.dataset.f) return; A.querySelectorAll('button').forEach(x=>{ if(!x.dataset.f) x.style.borderColor='#e2e8f0'; }); b.style.borderColor='#1d4ed8'; sel=[b,i]; }; });
   melangeS(paires.map((x,i)=>[x[1],i])).forEach(([t,i])=>{ const b=el('button',{style:st},B,t); b.onclick=()=>{ if(!sel||b.dataset.f) return; if(sel[1]===i) p+=.5; [sel[0],b].forEach(x=>{ x.dataset.f=1; x.style.background='#e2e8f0'; x.style.color='#64748b'; x.style.borderColor='#cbd5e1'; }); sel=null; n++;
    if(n===paires.length){ feedback(p===paires.length*.5?'ok':'moyen',paires.map(x=>'<b>'+x[0]+'</b> : '+x[1]).join('<br>')); done(p); } }; }); } }; },
 classer(cl){ return {titre:'Trie les éléments',icone:'',max:cl.items.length*.5,consigne:'Pour chaque élément, clique sa famille, puis valide. (0,5 pt par bonne réponse)',
  render(zone,done){ const rep={}; const it=melangeS(cl.items); it.forEach(([t,k],i)=>{ const l=el('div',{style:'background:#f8fafc;border-radius:12px;padding:10px;margin:6px 0;display:flex;flex-wrap:wrap;gap:8px;align-items:center'},zone); el('div',{style:'font-weight:800;min-width:200px'},l,t);
   cl.cats.forEach((cat,j)=>{ const b=el('button',{style:'font:inherit;font-weight:800;font-size:14px;border:2px solid #e2e8f0;background:#fff;border-radius:10px;padding:7px 11px;cursor:pointer'},l,cat); b.onclick=()=>{ l.querySelectorAll('button').forEach(x=>{ x.style.background='#fff'; x.style.color=''; }); b.style.background='#1d4ed8'; b.style.color='#fff'; rep[i]=j; v.disabled=Object.keys(rep).length<it.length; }; }); });
   const v=boutonValider(zone,()=>{ v.disabled=true; let p=0; it.forEach(([t,k],i)=>{ if(rep[i]===k) p+=.5; }); feedback(p===it.length*.5?'ok':'moyen',it.map(([t,k])=>t+' → '+cl.cats[k]).join(' · ')); done(p); }); } }; },
 completer(titre,cp){ const M=MODELES[cp.modele]; return {titre,icone:'',max:cp.trous.length,consigne:'Clique une étiquette puis la case « ? » où elle va. Clique une case remplie pour la vider. Valide quand tout est placé. (1 pt par case juste)',
  render(zone,done){ const {cv,c}=cvSys(zone); const rem={}; let ch=null; const bt={}; const z=el('div',{class:'etiqs'},zone);
   melangeS(cp.etiq).forEach(t=>{ const b=el('button',{},z,t); bt[t]=b; b.onclick=()=>{ z.querySelectorAll('button').forEach(x=>x.style.outline=''); b.style.outline='3px solid #1d4ed8'; ch=t; }; });
   const maj=()=>peindreS(c,M,{trous:cp.trous,remplis:rem}); maj();
   cv.onclick=ev=>{ const id=cibleS(cv,M,ev,cp.trous); if(!id) return; if(rem[id]){ bt[rem[id]].style.opacity=''; bt[rem[id]].disabled=false; delete rem[id]; maj(); v.disabled=true; return; } if(!ch) return; rem[id]=ch; bt[ch].style.opacity='.35'; bt[ch].disabled=true; bt[ch].style.outline=''; ch=null; maj(); v.disabled=Object.keys(rem).length<cp.trous.length; };
   const v=boutonValider(zone,()=>{ v.disabled=true; cv.onclick=null; let p=0; cp.trous.forEach(id=>{ if(rem[id]===txtS(M,id)) p++; }); feedback(p===cp.trous.length?'ok':(p?'moyen':'ko'),'Réponses attendues : '+cp.trous.map(id=>'« '+txtS(M,id)+' »').join(' · ')); done(p); }); } }; },
 cliquer(cp,items){ const M=MODELES[cp]; return {titre:'Repère dans le diagramme',icone:'',max:items.length*.5,consigne:'Lis chaque question puis clique l’élément du diagramme. Un seul clic par question. (0,5 pt par bonne réponse)',
  render(zone,done){ const q=el('div',{style:'background:#eef2ff;border-radius:12px;padding:12px;font-weight:800;font-size:15.5px'},zone); const {cv,c}=cvSys(zone); let k=0,p=0; const vus=[];
   const maj=()=>{ q.textContent=(k+1)+' / '+items.length+' — '+items[k][0]; peindreS(c,M,{hl:vus}); }; maj();
   cv.onclick=ev=>{ const id=cibleS(cv,M,ev); if(!id) return; if(id===items[k][1]) p+=.5; vus.push(id); k++; if(k>=items.length){ cv.onclick=null; q.textContent='Réponses enregistrées.'; peindreS(c,M,{}); feedback(p===items.length*.5?'ok':'moyen','Éléments attendus : '+items.map(x=>'« '+(txtS(M,x[1])||x[1])+' »').join(' · ')); done(p); } else maj(); }; } }; },
 erreur(er){ const M=MODELES[er.modele]; return {titre:'Trouve l’erreur',icone:'',max:2,consigne:'Un élément de ce diagramme est faux. Clique-le (un seul essai). (2 pts)',
  render(zone,done){ const {cv,c}=cvSys(zone); peindreS(c,M,{remplis:er.remplis}); cv.onclick=ev=>{ const id=cibleS(cv,M,ev); if(!id) return; cv.onclick=null; peindreS(c,M,{remplis:er.remplis,hl:[id]}); const ok=id===er.cible; feedback(ok?'ok':'ko',er.expl); done(ok?2:0); }; } }; },
 ordre(od){ return {titre:'Remets dans l’ordre',icone:'',max:2,consigne:od.consigne+' Clique les étiquettes dans l’ordre, puis valide. (2 pts, au prorata des étiquettes bien placées)',
  render(zone,done){ const choix=[]; const r=el('div',{class:'etiqs'},zone), s=el('div',{style:'min-height:48px;background:#f8fafc;border-radius:12px;padding:10px;font-weight:800'},zone);
   melangeS(od.items).forEach(t=>{ const b=el('button',{},r,t); b.onclick=()=>{ if(b.disabled) return; b.disabled=true; b.style.opacity='.35'; choix.push(t); s.textContent=choix.map((x,i)=>(i+1)+'. '+x).join('  →  '); v.disabled=choix.length<od.items.length; }; });
   const v=boutonValider(zone,()=>{ v.disabled=true; const n=choix.filter((t,i)=>t===od.items[i]).length; const p=Math.round(2*n/od.items.length*2)/2; feedback(n===od.items.length?'ok':'moyen','Ordre attendu : '+od.items.join(' → ')); done(p); }); } }; },
};
'''

for S in SEQ:
    s = BASE
    q = S['qcm']
    acts = f'''const ACTIVITES=[
FAB.qcm('Les bases du diagramme',DATA.qcm.slice(0,3),1),
FAB.associer(DATA.vocab),
FAB.completer('Complète le diagramme du robot',DATA.completer),
FAB.qcm('Lire le diagramme',DATA.qcm.slice(3,6),1),
FAB.cliquer(DATA.completer.modele,DATA.cliquer),
FAB.classer(DATA.classer),
FAB.erreur(DATA.erreur),
FAB.completer('Complète le diagramme d’un autre objet',DATA.completer2),
FAB.ordre(DATA.ordre),
FAB.qcm('Pour aller plus loin',DATA.qcm.slice(6,9),1),
];
/* ===FIN ACTIVITES=== */'''
    data = dict(qcm=q, vocab=S['vocab'], completer={k: v for k, v in S['completer'].items() if k != 'etiqLiens'}, completer2={k: v for k, v in S['completer2'].items() if k != 'etiqLiens'},
                cliquer=S['cliquer'], classer=S['classer'], erreur=S['erreur'], ordre=S['ordre'])
    a = s.index('const ACTIVITES=['); b = s.index('/* ===FIN ACTIVITES=== */') + len('/* ===FIN ACTIVITES=== */')
    s = s[:a] + FACT + 'const DATA=' + json.dumps(data, ensure_ascii=False) + ';\n' + acts + s[b:]
    s = s.replace('<title>Évaluation 3ème — Robotique &amp; Projet · ESTIC</title>', f"<title>Évaluation 3ème — {S['titre']} · ESTIC</title>")
    s = re.sub(r'<!-- ===CONFIG_TITRE=== -->.*?<!-- ===FIN CONFIG_TITRE=== -->',
               f'<!-- ===CONFIG_TITRE=== -->\n <h1>Évaluation — {S["titre"]}</h1>\n <div class="sous">10 activités : lire, compléter et corriger des diagrammes SysML. Tout se fait en cliquant.</div>\n <!-- ===FIN CONFIG_TITRE=== -->', s, flags=re.S)
    s = s.replace("evaluations/robotique_3e_v2'", f"evaluations/{S['fb']}'").replace("resultats_robotique_3e.csv", f"resultats_{S['fb']}.csv")
    s = s.replace('var CODE = "BRAS517";', f'var CODE = "{S["code_eval"]}";')
    s = s.replace('<style>', f'<script>{LIB}\n{MOD}</script>\n<style>', 1)
    s = s.replace('--niv:#0f766e; --niv-fonce:#115e59;', '--niv:#1d4ed8; --niv-fonce:#1e40af;')
    assert S['fb'] in s and S['code_eval'] in s
    f = os.path.join(OUT, f"04_evaluation_sysml_{S['cle']}.html")
    open(f, 'w', encoding='utf-8').write(s); print('eval', f)

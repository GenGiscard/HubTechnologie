{
 const PS=window.PortailSuivi, $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const MDP='Agostini2025';
 let CLASSES=['5A','5B','5C','5D','5E','4A','4B','4C','4D','4E','3A','3B','3C','3D','3E','3PM'];
 const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const nivDe=c=>{const m=/^\s*([345])/.exec(c);return m?m[1]+'e':null};
 const choix=$('#choix'), chip=$('#classeChip'), rep=$('#reprise');

 function dessinerChoix(){
  const g={'5e':[],'4e':[],'3e':[],'Autres':[]};
  CLASSES.forEach(c=>(g[nivDe(c)]||g.Autres).push(c));
  const der=PS.L.get('portail_derniere_classe');
  $('#choixListe').innerHTML=Object.entries(g).filter(([,l])=>l.length).map(([n,l])=>
   `<div class="cg"><span class="cn">${n==='Autres'?'Autres':esc(n)}</span><div class="cb">${l.map(c=>`<button type="button" data-c="${esc(c)}" class="cl n${esc(nivDe(c)||'x')}${c===der?' der':''}">${esc(c)}</button>`).join('')}</div></div>`).join('');
 }
 function ouvrirChoix(){ dessinerChoix(); choix.hidden=false; document.body.classList.add('modal'); setTimeout(()=>{const b=choix.querySelector('.der')||choix.querySelector('button.cl');b&&b.focus()},50); }
 function fermerChoix(){ choix.hidden=true; document.body.classList.remove('modal'); }
 choix.addEventListener('click',e=>{const b=e.target.closest('button[data-c]'); if(b) choisir(b.dataset.c);});
 $('#choixLibre').addEventListener('click',()=>choisir('libre'));
 chip.addEventListener('click',ouvrirChoix);

 function choisir(c){
  PS.S.set('portail_classe',c); if(c!=='libre') PS.L.set('portail_derniere_classe',c);
  fermerChoix(); maj();
  const n=nivDe(c); if(n&&!location.hash&&window.__montrerNiveau) window.__montrerNiveau('niv-'+n);
 }

 function quand(t){
  const d=new Date(t), j=Math.floor((new Date().setHours(0,0,0,0)-new Date(t).setHours(0,0,0,0))/864e5);
  const h=d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
  return j<=0?"aujourd'hui à "+h : j===1?'hier à '+h : 'le '+d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
 }
 function appliquer(c,C){
  $$('.card').forEach(card=>{
   const vus=new Set(), tous=new Set();
   card.querySelectorAll('.tree a[href]').forEach(a=>{
    const k=PS.cle(a.href); a.classList.remove('vu','fait'); if(!k) return;
    const key=k.join('|'), v=C?C[key]||0:0; tous.add(key);
    if(v>=1){a.classList.add(v>=2?'fait':'vu'); vus.add(key);}
   });
   card.querySelectorAll('details').forEach(d=>{
    const ks=[...d.querySelectorAll('ol a[href]')].map(a=>PS.cle(a.href)).filter(Boolean).map(k=>k.join('|'));
    const n=ks.filter(k=>C&&C[k]>=1).length, el=d.querySelector('.n');
    if(el) el.textContent=C&&n?n+'/'+ks.length:ks.length;
    d.classList.toggle('partiel',!!(C&&n&&n<ks.length)); d.classList.toggle('complet',!!(C&&n&&n===ks.length));
   });
   const pr=card.querySelector('.prog');
   if(pr){ if(C&&tous.size){pr.hidden=false; pr.querySelector('i').style.width=Math.round(100*vus.size/tous.size)+'%'; pr.querySelector('b').textContent=vus.size+' / '+tous.size+' vus';} else pr.hidden=true; }
   card.classList.remove('last');
  });
  const d=C&&C._dernier;
  if(c&&d&&d.seq){
   const card=$$('.card').find(x=>x.dataset.k===d.niv+'|'+d.seq);
   if(card) card.classList.add('last');
   rep.hidden=false;
   rep.innerHTML=`<div class="rp-t"><span class="rp-c">${esc(c)}</span><div><b>On en était à : ${esc(d.seq)} › ${esc(d.mod)}</b><span>Ouvert ${esc(quand(d.t))}</span></div></div>
    <div class="rp-b">${card?'<button type="button" id="rpVoir">Voir la séquence</button>':''}<a id="rpGo" href="${esc(d.href)}">Reprendre ici</a></div>`;
   const v=$('#rpVoir'); if(v) v.addEventListener('click',()=>{const s=card.closest('.niveau'); window.__montrerNiveau&&window.__montrerNiveau(s.id); card.scrollIntoView({behavior:'smooth',block:'center'}); card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash');});
  } else if(c){
   rep.hidden=false;
   rep.innerHTML=`<div class="rp-t"><span class="rp-c">${esc(c)}</span><div><b>Rien d'ouvert pour l'instant avec cette classe</b><span>Chaque ressource ouverte depuis le portail ou un hub sera retenue ici.</span></div></div>`;
  } else rep.hidden=true;
 }
 function maj(){
  const cl=PS.classe(), c=PS.suivi();
  document.body.classList.toggle('avec-suivi',!!c);
  chip.hidden=!PS.poste();
  chip.querySelector('b').textContent=cl?(cl==='libre'?'Libre':cl):'Choisir';
  chip.classList.toggle('libre',cl==='libre');
  if(!c){appliquer(null,null); return;}
  appliquer(c,PS.cache(c));
  fetch(PS.url(c)).then(r=>r.json()).then(j=>{
   if(PS.suivi()!==c) return;
   const C=Object.assign({},PS.cache(c),j||{}); if(j&&j._dernier&&PS.cache(c)._dernier&&PS.cache(c)._dernier.t>j._dernier.t) C._dernier=PS.cache(c)._dernier;
   PS.setCache(c,C); appliquer(c,C);
  }).catch(()=>{});
 }
 function majPoste(){
  const on=PS.poste();
  $('#posteEtat').textContent=on?'Activé sur ce poste : le portail demande la classe à chaque arrivée.':'Désactivé sur ce poste (les élèves ne voient rien).';
  $('#posteForm').hidden=on; $('#posteOff').hidden=!on;
 }
 $('#posteForm').addEventListener('submit',e=>{e.preventDefault(); const i=$('#posteMdp');
  if(i.value!==MDP){$('#posteErr').textContent='Code incorrect.'; return;}
  PS.L.set('portail_poste_prof','1'); i.value=''; $('#posteErr').textContent=''; majPoste(); maj(); ouvrirChoix();});
 $('#posteOff').addEventListener('click',()=>{PS.L.set('portail_poste_prof',null); PS.S.set('portail_classe',null); majPoste(); maj();});

 fetch(PS.BASE+'/classes.json').then(r=>r.json()).then(j=>{ if(Array.isArray(j)&&j.length){CLASSES=j.slice().sort(); if(!choix.hidden) dessinerChoix();} }).catch(()=>{});
 majPoste(); maj();
 if(PS.poste()&&!PS.classe()) ouvrirChoix();
 else if(PS.suivi()&&!location.hash&&window.__montrerNiveau){const n=nivDe(PS.suivi()); if(n) window.__montrerNiveau('niv-'+n);}
}

/* Suivi de progression des classes — partagé par le portail (index.html) et les hubs.
   Actif seulement sur un poste professeur activé (code prof), quand une classe a été choisie
   à l'arrivée sur le portail pour cette session de navigation. Fichier généré par _outils/index_gen.py. */
(function(){
 const BASE='https://evaluation-bloc-default-rtdb.europe-west1.firebasedatabase.app/suivi_classes';
 const MAP=__MAP__;
 const st=(o)=>({get:k=>{try{return o.getItem(k)}catch(e){return null}},set:(k,v)=>{try{v==null?o.removeItem(k):o.setItem(k,v)}catch(e){}}});
 let L,S; try{L=st(localStorage)}catch(e){L=st({getItem(){return null},setItem(){},removeItem(){}})} try{S=st(sessionStorage)}catch(e){S=L}
 const PS=window.PortailSuivi={BASE,MAP,L,S};
 PS.poste=()=>L.get('portail_poste_prof')==='1';
 PS.classe=()=>PS.poste()?S.get('portail_classe'):null;
 PS.suivi=()=>{const c=PS.classe();return c&&c!=='libre'?c:null};
 PS.fname=h=>{try{const u=new URL(h,location.href);if(u.origin!==location.origin&&!/^https?:/.test(h))return '';return u.origin===location.origin?decodeURIComponent(u.pathname.split('/').pop()):u.href}catch(e){return ''}};
 PS.cle=h=>MAP[PS.fname(h)]||null;
 PS.cache=c=>{try{return JSON.parse(L.get('portail_vu_'+c)||'{}')}catch(e){return {}}};
 PS.setCache=(c,o)=>L.set('portail_vu_'+c,JSON.stringify(o));
 PS.url=c=>BASE+'/etat/'+encodeURIComponent(c)+'.json';
 PS.noter=function(href){
  const c=PS.suivi(), k=PS.cle(href); if(!c||!k) return null;
  const key=k.join('|'), C=PS.cache(c), body={};
  if(!(C[key]>=1)){C[key]=1;body[key]=1;}
  C._dernier=body._dernier={niv:k[0],seq:k[1],mod:k[2],href:PS.fname(href),t:Date.now()};
  PS.setCache(c,C);
  try{return fetch(PS.url(c),{method:'PATCH',keepalive:true,body:JSON.stringify(body)}).catch(()=>{})}catch(e){return null}
 };
 document.addEventListener('click',e=>{
  const a=e.target.closest&&e.target.closest('a[href]'); if(!a||!PS.suivi()||!PS.cle(a.href)) return;
  const p=PS.noter(a.href);
  const nouvelOnglet=a.target==='_blank'||e.ctrlKey||e.metaKey||e.shiftKey||e.button!==0;
  if(nouvelOnglet||!p) return;
  e.preventDefault();
  Promise.race([p,new Promise(r=>setTimeout(r,700))]).then(()=>{location.href=a.href});
 },true);
 if(!window.PORTAIL_INDEX){
  const c=PS.classe(); if(!c) return;
  const go=()=>{const d=document.createElement('a');d.href='index.html';d.textContent=c==='libre'?'Mode libre':'Suivi : '+c;d.title='Retour au portail';
   d.style.cssText='position:fixed;left:12px;bottom:12px;z-index:9999;background:'+(c==='libre'?'#64748b':'#1e3a5f')+';color:#fff;font:800 13px Nunito,system-ui,sans-serif;padding:7px 13px;border-radius:999px;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,.2)';
   document.body.appendChild(d)};
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',go):go();
 }
})();

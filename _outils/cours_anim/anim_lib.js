/* ============================================================
 MOTEUR D'ANIMATIONS PÉDAGOGIQUES EN PHASES (version illustrée)
 Chaque animation = phases successives {dur, caption, draw(ctx,p,W,H,t)}
 p : avancement de la phase (0 → 1), t : temps en secondes (décor vivant)
 Rendu net sur écran haute définition, décor animé tant que la diapositive est visible.
 ============================================================ */
const ANIMS={};
function creerAnim(nom,canvasId,capId,ptsId,phases){
 const cv=document.getElementById(canvasId),ctx=cv.getContext('2d');
 const W=+cv.getAttribute('width'),H=+cv.getAttribute('height'),dpr=Math.min(2,window.devicePixelRatio||1)*1.25;
 cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr);
 const cap=document.getElementById(capId),pts=document.getElementById(ptsId);
 phases.forEach(()=>{const s=document.createElement('span');pts.appendChild(s);});
 const etat={i:0,t0:null,raf:null,vis:false,debut:performance.now()};
 function majPts(){[...pts.children].forEach((s,k)=>s.classList.toggle('on',k<=etat.i));}
 function majBtns(){
  const bp=document.querySelector('button[data-prev="'+nom+'"]'),bn=document.querySelector('button[data-next="'+nom+'"]');
  if(bp) bp.disabled=(etat.i===0); if(bn) bn.disabled=(etat.i===phases.length-1);
 }
 function peindre(p,ts){
  ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,W,H);
  phases[etat.i].draw(ctx,p,W,H,(ts-etat.debut)/1000);
 }
 function boucle(ts){
  if(etat.t0===null) etat.t0=ts;
  const p=Math.min(1,(ts-etat.t0)/phases[etat.i].dur);
  peindre(p,ts);
  if(p<1||etat.vis) etat.raf=requestAnimationFrame(boucle); else etat.raf=null;
 }
 function jouer(){
  cancelAnimationFrame(etat.raf); etat.t0=null;
  cap.textContent=phases[etat.i].caption; majPts(); majBtns();
  etat.raf=requestAnimationFrame(boucle);
 }
 if('IntersectionObserver' in window) new IntersectionObserver(es=>es.forEach(e=>{
  etat.vis=e.isIntersecting; if(etat.vis&&etat.raf===null&&etat.t0!==null){etat.t0=performance.now()-phases[etat.i].dur; etat.raf=requestAnimationFrame(boucle);} })).observe(cv);
 ANIMS[nom]={
  demarrer(){ etat.i=0; jouer(); }, rejouer(){ jouer(); },
  suivant(){ if(etat.i<phases.length-1){ etat.i++; jouer(); } },
  precedent(){ if(etat.i>0){ etat.i--; jouer(); } }
 };
 cap.textContent=phases[0].caption; majPts(); majBtns();
 const go=()=>peindre(0,performance.now());
 document.fonts&&document.fonts.ready? document.fonts.ready.then(go):go(); go();
}
const lisse = p =>p<0.5 ? 2*p*p : 1-Math.pow(-2*p+2,2)/2;
const rebond = p => p<1 ? 1-Math.pow(1-p,3)*Math.cos(p*9)*(1-p) : 1;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const sous=(p,a,b)=>clamp((p-a)/(b-a));   // avancement entre a et b
const POLICE='Nunito, Segoe UI, sans-serif';

/* ---------- Bibliothèque de dessin ---------- */
const G={
 ciel(c,W,H,haut='#bfe3ff',bas='#f2f9ff'){ const g=c.createLinearGradient(0,0,0,H); g.addColorStop(0,haut); g.addColorStop(1,bas); c.fillStyle=g; c.fillRect(0,0,W,H); },
 soleil(c,x,y,r=26){ const g=c.createRadialGradient(x,y,0,x,y,r*3); g.addColorStop(0,'rgba(255,236,150,.9)'); g.addColorStop(.35,'rgba(255,236,150,.35)'); g.addColorStop(1,'rgba(255,236,150,0)');
  c.fillStyle=g; c.beginPath(); c.arc(x,y,r*3,0,7); c.fill(); c.fillStyle='#ffd65a'; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); },
 nuage(c,x,y,s=1,a=.9){ c.save(); c.globalAlpha=a; c.fillStyle='#fff'; c.beginPath();
  [[0,0,22],[24,-10,26],[50,0,20],[26,8,22]].forEach(([dx,dy,r])=>{c.moveTo(x+dx*s+r*s,y+dy*s); c.arc(x+dx*s,y+dy*s,r*s,0,7);}); c.fill(); c.restore(); },
 nuages(c,W,t,y0=40){ [[.1,0,1],[.55,18,.8],[.85,-6,1.1]].forEach(([fx,dy,s],k)=>{ const x=((fx*W+t*(8+k*4))%(W+160))-80; G.nuage(c,x,y0+dy,s,.85); }); },
 collines(c,W,y,coul1='#cfe8d6',coul2='#b4dcc2'){
  c.fillStyle=coul1; c.beginPath(); c.moveTo(0,y); for(let x=0;x<=W;x+=20) c.lineTo(x,y-18-14*Math.sin(x/90)-8*Math.sin(x/37)); c.lineTo(W,y); c.closePath(); c.fill();
  c.fillStyle=coul2; c.beginPath(); c.moveTo(0,y); for(let x=0;x<=W;x+=20) c.lineTo(x,y-6-10*Math.sin(x/70+2)); c.lineTo(W,y); c.closePath(); c.fill(); },
 sol(c,x0,x1,y,H){ const g=c.createLinearGradient(0,y,0,H); g.addColorStop(0,'#8fcf7a'); g.addColorStop(.12,'#7cbf66'); g.addColorStop(.13,'#a0794f'); g.addColorStop(1,'#7a5a3a');
  c.fillStyle=g; c.fillRect(x0,y,x1-x0,H-y); },
 eau(c,x0,x1,y,H,t){ const g=c.createLinearGradient(0,y,0,H); g.addColorStop(0,'#5ab4e8'); g.addColorStop(1,'#2a7fbf'); c.fillStyle=g; c.fillRect(x0,y,x1-x0,H-y);
  c.strokeStyle='rgba(255,255,255,.55)'; c.lineWidth=2; c.lineCap='round';
  for(let k=0;k<9;k++){ const yy=y+10+((k*13)%(H-y-12)), xx=x0+((k*97+t*22)%(x1-x0-40)); c.beginPath(); c.moveTo(xx,yy); c.lineTo(xx+18+(k%3)*8,yy); c.stroke(); } },
 boite(c,x,y,w,h,r=8){ c.beginPath(); c.roundRect(x,y,w,h,r); },
 // étiquette en pastille
 pastille(c,txt,x,y,coul,taille=15,fond='#fff'){
  c.font=`900 ${taille}px ${POLICE}`; const w=c.measureText(txt).width+taille*1.3, h=taille*1.85;
  c.save(); c.shadowColor='rgba(15,23,42,.18)'; c.shadowBlur=10; c.shadowOffsetY=3;
  c.fillStyle=fond; G.boite(c,x-w/2,y-h/2,w,h,h/2); c.fill(); c.restore();
  c.strokeStyle=coul; c.lineWidth=2; G.boite(c,x-w/2,y-h/2,w,h,h/2); c.stroke();
  c.fillStyle=coul; c.textAlign='center'; c.textBaseline='middle'; c.fillText(txt,x,y+1); c.textBaseline='alphabetic'; },
 titre(c,txt,x,y,coul='#1b2f4b',taille=22){ c.font=`900 ${taille}px ${POLICE}`; c.fillStyle=coul; c.textAlign='center'; c.fillText(txt,x,y); },
 texte(c,txt,x,y,coul='#475569',taille=14,al='center'){ c.font=`800 ${taille}px ${POLICE}`; c.fillStyle=coul; c.textAlign=al; c.fillText(txt,x,y); },
 // flèche épaisse avec liseré blanc : le trait s'arrête à la base de la pointe, la pointe va jusqu'à (x2,y2)
 fleche(c,x1,y1,x2,y2,coul,ep=6){
  const a=Math.atan2(y2-y1,x2-x1), L=ep*2.6+6, l=ep*1.7+4, bx=x2-L*Math.cos(a), by=y2-L*Math.sin(a);
  const tete=()=>{ c.beginPath(); c.moveTo(x2,y2); c.lineTo(bx-l*Math.sin(a),by+l*Math.cos(a)); c.lineTo(bx+l*Math.sin(a),by-l*Math.cos(a)); c.closePath(); };
  c.lineCap='butt'; c.lineJoin='round';
  c.strokeStyle='#fff'; c.lineWidth=ep+5; c.beginPath(); c.moveTo(x1,y1); c.lineTo(bx,by); c.stroke(); tete(); c.lineWidth=5; c.stroke();
  c.strokeStyle=coul; c.lineWidth=ep; c.beginPath(); c.moveTo(x1,y1); c.lineTo(bx+Math.cos(a),by+Math.sin(a)); c.stroke(); c.fillStyle=coul; tete(); c.fill(); },
 // camion
 camion(c,x,y,s=1,coul='#f59e0b'){ c.save(); c.translate(x,y); c.scale(s,s);
  c.fillStyle='rgba(0,0,0,.18)'; c.beginPath(); c.ellipse(0,1,40,4,0,0,7); c.fill();
  const g=c.createLinearGradient(0,-34,0,-8); g.addColorStop(0,coul); g.addColorStop(1,'#d97706');
  c.fillStyle=g; G.boite(c,-40,-34,50,26,4); c.fill();
  c.fillStyle='#1e3a8a'; G.boite(c,12,-28,22,20,5); c.fill(); c.fillStyle='#bfdbfe'; G.boite(c,22,-25,9,9,2); c.fill();
  c.fillStyle='#334155'; c.fillRect(-40,-10,74,4);
  [-26,22].forEach(wx=>{ c.fillStyle='#1f2937'; c.beginPath(); c.arc(wx,-4,7.5,0,7); c.fill(); c.fillStyle='#cbd5e1'; c.beginPath(); c.arc(wx,-4,3,0,7); c.fill(); });
  c.restore(); },
 // appui en béton avec ombre
 appui(c,x,y){ c.fillStyle='rgba(0,0,0,.15)'; c.beginPath(); c.ellipse(x,y+38,34,5,0,0,7); c.fill();
  const g=c.createLinearGradient(x-26,0,x+26,0); g.addColorStop(0,'#cbd5e1'); g.addColorStop(1,'#94a3b8');
  c.fillStyle=g; c.beginPath(); c.moveTo(x-12,y); c.lineTo(x+12,y); c.lineTo(x+26,y+36); c.lineTo(x-26,y+36); c.closePath(); c.fill();
  c.fillStyle='#e2e8f0'; c.fillRect(x-14,y-4,28,5); },
 // caisse en bois
 caisse(c,x,y,w=70,h=52,coul='#c0843d'){ c.save(); c.translate(x,y);
  const g=c.createLinearGradient(0,-h,0,0); g.addColorStop(0,'#d9a35e'); g.addColorStop(1,coul); c.fillStyle=g; G.boite(c,-w/2,-h,w,h,5); c.fill();
  c.strokeStyle='#8a5a24'; c.lineWidth=3; G.boite(c,-w/2,-h,w,h,5); c.stroke();
  c.beginPath(); c.moveTo(-w/2+6,-h+6); c.lineTo(w/2-6,-6); c.moveTo(w/2-6,-h+6); c.lineTo(-w/2+6,-6); c.stroke();
  c.fillStyle='#fff'; c.font=`900 13px ${POLICE}`; c.textAlign='center'; c.restore(); },
 boulon(c,x,y,r=9){ const g=c.createRadialGradient(x-r*.35,y-r*.35,1,x,y,r); g.addColorStop(0,'#f8fafc'); g.addColorStop(1,'#475569');
  c.fillStyle=g; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); c.strokeStyle='#1e293b'; c.lineWidth=1.5; c.stroke(); },
 // barre métallique (deux passes + reflet)
 barre(c,x1,y1,x2,y2,coul='#64748b',ep=14){ c.lineCap='round';
  c.strokeStyle='rgba(15,23,42,.25)'; c.lineWidth=ep+4; c.beginPath(); c.moveTo(x1,y1+3); c.lineTo(x2,y2+3); c.stroke();
  c.strokeStyle=coul; c.lineWidth=ep; c.beginPath(); c.moveTo(x1,y1); c.lineTo(x2,y2); c.stroke();
  c.strokeStyle='rgba(255,255,255,.45)'; c.lineWidth=ep*.25; c.beginPath(); const a=Math.atan2(y2-y1,x2-x1), ox=Math.sin(a)*ep*.22, oy=-Math.cos(a)*ep*.22;
  c.moveTo(x1+ox,y1+oy); c.lineTo(x2+ox,y2+oy); c.stroke(); },
 halo(c,x,y,r,coul){ const g=c.createRadialGradient(x,y,0,x,y,r); g.addColorStop(0,coul); g.addColorStop(1,'rgba(255,255,255,0)'); c.fillStyle=g; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); }
};


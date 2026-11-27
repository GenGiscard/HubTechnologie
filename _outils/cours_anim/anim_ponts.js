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

/* ============ ANIM 1 : LES EFFORTS (poutre en flexion) ============ */
function decorAtelier(c,W,H,t){ G.ciel(c,W,H,'#d7ecfb','#f5fbff'); G.nuages(c,W,t,46); G.collines(c,W,H-62,'#d6ecdc','#c2e3cc'); G.sol(c,0,W,H-62,H); }
// poutre en béton, fléchie : bord haut et bas suivent la même parabole, face de dessus en perspective
function poutre(c,xg,xd,y,f,ep=28){
 const yAt=x=>y+f*4*(x-xg)*(xd-x)/((xd-xg)*(xd-xg));
 const N=40, haut=[],bas=[];
 for(let k=0;k<=N;k++){ const x=xg-10+(xd-xg+20)*k/N; const yy=yAt(clamp(x,xg,xd)); haut.push([x,yy-ep/2]); bas.push([x,yy+ep/2]); }
 // dessus
 c.fillStyle='#e2e8f0'; c.beginPath(); haut.forEach(([x,yy],k)=>k?c.lineTo(x+9,yy-8):c.moveTo(x+9,yy-8)); for(let k=N;k>=0;k--) c.lineTo(haut[k][0],haut[k][1]); c.closePath(); c.fill();
 // face avant
 const g=c.createLinearGradient(0,y-ep/2,0,y+ep/2+f); g.addColorStop(0,'#94a3b8'); g.addColorStop(1,'#64748b'); c.fillStyle=g;
 c.beginPath(); haut.forEach(([x,yy],k)=>k?c.lineTo(x,yy):c.moveTo(x,yy)); for(let k=N;k>=0;k--) c.lineTo(bas[k][0],bas[k][1]); c.closePath(); c.fill();
 c.strokeStyle='#475569'; c.lineWidth=1.5; c.stroke();
 // bout droit
 c.fillStyle='#7c8ba1'; c.beginPath(); c.moveTo(haut[N][0],haut[N][1]); c.lineTo(haut[N][0]+9,haut[N][1]-8); c.lineTo(bas[N][0]+9,bas[N][1]-8); c.lineTo(bas[N][0],bas[N][1]); c.closePath(); c.fill();
 return yAt;
}
function scenePoutre(c,W,H,t,f,charge,descente=1,fl=true){
 decorAtelier(c,W,H,t);
 const xg=170,xd=W-170,y=H-150;
 G.appui(c,xg,y+14); G.appui(c,xd,y+14);
 const yAt=poutre(c,xg,xd,y,f);
 if(charge>0){ const cx=W/2, yc=yAt(cx)-14-(1-descente)*150; c.globalAlpha=clamp(charge*2); G.caisse(c,cx,yc,78,58); c.globalAlpha=1;
  if(descente>=1&&fl) G.fleche(c,cx,yc-112,cx,yc-66,'#dc2626',7); }
 return {xg,xd,y,yAt};
}
// loupe sur les fibres de la poutre
function loupe(c,x,y,r,e,rupture=0){
 c.save(); c.beginPath(); c.arc(x,y,r,0,7); c.fillStyle='#fff'; c.fill(); c.clip();
 const g=c.createLinearGradient(0,y-r*.5,0,y+r*.5); g.addColorStop(0,'#fecaca'); g.addColorStop(.5,'#e2e8f0'); g.addColorStop(1,'#bfdbfe');
 c.fillStyle=g; c.fillRect(x-r,y-r*.55,2*r,r*1.1);
 // petits blocs de matière : écrasés en haut, étirés en bas
 for(let row=0;row<5;row++){ const ry=y-r*.45+row*r*.22, k=(2-row)/2; // +1 haut, -1 bas
  const largeur=22*(1-.35*k*e), n=Math.ceil(2*r/largeur)+2;
  for(let i=-n/2;i<n/2;i++){ const bx=x+i*(largeur+4)*(1); c.fillStyle=k>0?'#ef4444':k<0?'#3b82f6':'#94a3b8'; c.globalAlpha=.25+.5*Math.abs(k)*e+(k===0?.3:0);
   G.boite(c,bx-largeur/2,ry-7*(1+.25*k*e),largeur,14*(1+.25*k*e),3); c.fill(); } }
 c.globalAlpha=1;
 c.setLineDash([6,5]); c.strokeStyle='#475569'; c.lineWidth=1.5; c.beginPath(); c.moveTo(x-r,y); c.lineTo(x+r,y); c.stroke(); c.setLineDash([]);
 if(rupture>0){ c.strokeStyle='#1e293b'; c.lineWidth=3; c.beginPath(); c.moveTo(x,y+r*.55); c.lineTo(x-6,y+r*.55-r*.3*rupture); c.lineTo(x+5,y+r*.55-r*.5*rupture); c.stroke(); }
 c.restore();
 c.strokeStyle='#1b2f4b'; c.lineWidth=5; c.beginPath(); c.arc(x,y,r,0,7); c.stroke();
}
creerAnim('efforts','cvEfforts','capEfforts','ptsEfforts',[
 { dur:2600, caption:'STRUCTURE — Une poutre repose sur deux appuis. Au repos, elle est parfaitement droite.',
  draw(c,p,W,H,t){ const s=scenePoutre(c,W,H,t,0,0); const e=lisse(p);
   c.globalAlpha=e; G.pastille(c,'poutre',W/2,s.y-58,'#475569'); G.pastille(c,'appui',s.xg,s.y+70,'#64748b',13); G.pastille(c,'appui',s.xd,s.y+70,'#64748b',13); c.globalAlpha=1; } },
 { dur:3400, caption:'ACTION — Une charge appuie au centre : la poutre se déforme, elle FLÉCHIT.',
  draw(c,p,W,H,t){ const d=lisse(sous(p,0,.45)), f=rebond(sous(p,.4,1))*34; const s=scenePoutre(c,W,H,t,f,1,d);
   if(p>.6){ c.globalAlpha=sous(p,.6,.8); G.pastille(c,'la poutre fléchit',W/2+200,s.yAt(W/2)+64,'#ea580c'); c.globalAlpha=1; } } },
 { dur:4200, caption:'ZOOM — En haut, la matière est ÉCRASÉE (compression). En bas, elle est ÉTIRÉE (traction).',
  draw(c,p,W,H,t){ const s=scenePoutre(c,W,H,t,34,1); const e=lisse(sous(p,0,.5)), cx=W/2, cy=s.yAt(cx);
   const lx=cx, ly=96, r=78;
   c.globalAlpha=e; c.strokeStyle='#1b2f4b'; c.lineWidth=2; c.setLineDash([5,5]); c.beginPath(); c.moveTo(cx-24,cy-20); c.lineTo(lx-r*.7,ly+r*.7); c.moveTo(cx+24,cy-20); c.lineTo(lx+r*.7,ly+r*.7); c.stroke(); c.setLineDash([]);
   loupe(c,lx,ly,r,lisse(sous(p,.3,.8)));
   const a=sous(p,.55,.85); c.globalAlpha=a;
   G.fleche(c,lx-r-74,ly-26,lx-r-14,ly-26,'#dc2626',6); G.fleche(c,lx+r+74,ly-26,lx+r+14,ly-26,'#dc2626',6);
   G.fleche(c,lx-r-14,ly+26,lx-r-74,ly+26,'#1d4ed8',6); G.fleche(c,lx+r+14,ly+26,lx+r+74,ly+26,'#1d4ed8',6);
   G.pastille(c,'COMPRESSION',lx-r-150,ly-26,'#dc2626',14); G.pastille(c,'TRACTION',lx-r-150,ly+26,'#1d4ed8',14);
   G.pastille(c,'écrasé',lx+r+132,ly-26,'#dc2626',13); G.pastille(c,'étiré',lx+r+126,ly+26,'#1d4ed8',13);
   c.globalAlpha=1; } },
 { dur:4600, caption:'PROPRIÉTÉ — La flexion combine compression (dessus) et traction (dessous). Si l’effort dépasse la résistance du matériau : rupture !',
  draw(c,p,W,H,t){ const surcharge=sous(p,.35,.6), fis=sous(p,.55,.9); const f=34+18*lisse(surcharge);
   const s=scenePoutre(c,W,H,t,f,1,1,false); const cx=W/2, cy=s.yAt(cx); const yTop=cy-14-58-(1-lisse(surcharge))*120;
   if(surcharge>0){ c.globalAlpha=surcharge; G.caisse(c,cx,yTop,60,44,'#b45309'); c.globalAlpha=1; }
   const ya=(surcharge>0?yTop-44:cy-14-58); G.fleche(c,cx,ya-60,cx,ya-12,'#dc2626',7+4*surcharge);
   if(fis>0){ c.strokeStyle='#1e293b'; c.lineWidth=3.5; c.lineCap='round'; c.beginPath(); const yb=cy+14;
    c.moveTo(cx,yb); c.lineTo(cx-5,yb-9*fis); c.lineTo(cx+4,yb-17*fis); c.lineTo(cx-2,yb-24*fis); c.stroke();
    G.halo(c,cx,yb,40*fis,'rgba(239,68,68,.35)'); G.pastille(c,'fissure côté traction',cx,yb+56,'#dc2626',14); }
   G.pastille(c,'FLEXION = COMPRESSION + TRACTION',W/2,36,'#15803d',17); } },
]);

/* ============ ANIM 2 : LA TRIANGULATION ============ */
function decorChantier(c,W,H,t){ G.ciel(c,W,H,'#dff0fb','#f7fbff'); G.nuages(c,W,t,40); G.collines(c,W,H-42,'#dbe9f5','#cfe2f0');
 const g=c.createLinearGradient(0,H-42,0,H); g.addColorStop(0,'#d6d3d1'); g.addColorStop(1,'#a8a29e'); c.fillStyle=g; c.fillRect(0,H-42,W,42); }
function cadre(c,pts,coul='#64748b',diag=0,coulDiag='#16a34a'){
 for(let i=0;i<pts.length;i++){ const a=pts[i],b=pts[(i+1)%pts.length]; G.barre(c,a[0],a[1],b[0],b[1],coul,14); }
 if(diag>0){ const a=pts[3],b=pts[1]; G.barre(c,a[0],a[1],a[0]+(b[0]-a[0])*diag,a[1]+(b[1]-a[1])*diag,coulDiag,14); }
 pts.forEach(pt=>G.boulon(c,pt[0],pt[1],10));
}
function carrePts(cx,cy,cote,skew){ return [[cx-cote/2+skew,cy-cote/2],[cx+cote/2+skew,cy-cote/2],[cx+cote/2,cy+cote/2],[cx-cote/2,cy+cote/2]]; }
function verin(c,x,y,ext,ysol){ // poussoir mécanique : la plaque touche le coin du cadre
 c.fillStyle='#64748b'; c.fillRect(x-80,y+12,12,ysol-y-12); c.fillRect(x-100,ysol-8,52,8);
 const g=c.createLinearGradient(0,y-15,0,y+15); g.addColorStop(0,'#475569'); g.addColorStop(1,'#1e293b'); c.fillStyle=g; G.boite(c,x-110,y-15,76,30,7); c.fill();
 c.fillStyle='#e2e8f0'; c.fillRect(x-34,y-5,24+ext,10); c.fillStyle='#ef4444'; G.boite(c,x-12+ext,y-17,10,34,3); c.fill(); }
// petites structures réelles triangulées
function pylone(c,x,y,h){ const w=h*.32; const P=[[x-w,y],[x+w,y],[x-w*.25,y-h],[x+w*.25,y-h]];
 G.barre(c,P[0][0],P[0][1],P[2][0],P[2][1],'#64748b',5); G.barre(c,P[1][0],P[1][1],P[3][0],P[3][1],'#64748b',5);
 for(let k=0;k<4;k++){ const t1=k/4,t2=(k+1)/4; const xa=x-w+(w*.75)*t1, xb=x+w-(w*.75)*t2, ya=y-h*t1, yb=y-h*t2;
  G.barre(c,xa,ya,xb,yb,'#16a34a',3); G.barre(c,x+w-(w*.75)*t1,ya,x-w+(w*.75)*t2,yb,'#16a34a',3); } }
function treillis(c,x,y,L,h,n){ G.barre(c,x,y,x+L,y,'#64748b',5); G.barre(c,x,y-h,x+L,y-h,'#64748b',5);
 for(let k=0;k<n;k++){ const xa=x+L*k/n, xb=x+L*(k+1)/n; G.barre(c,xa,y,xb,y-h,'#16a34a',3); G.barre(c,xb,y-h,xb,y,'#64748b',3); if(k===0) G.barre(c,xa,y,xa,y-h,'#64748b',3); } }
creerAnim('triang','cvTriang','capTriang','ptsTriang',[
 { dur:2600, caption:'STRUCTURE — Un cadre carré fait de 4 barres articulées (les liaisons pivotent).',
  draw(c,p,W,H,t){ decorChantier(c,W,H,t); const P=carrePts(W/2,H/2+6,170,0); cadre(c,P);
   c.globalAlpha=lisse(p); G.pastille(c,'articulation (pivot)',P[1][0]+170,P[1][1]-2,'#475569',14); G.fleche(c,P[1][0]+90,P[1][1]-2,P[1][0]+16,P[1][1]-1,'#475569',4); c.globalAlpha=1; } },
 { dur:3400, caption:'ACTION — On pousse horizontalement… le carré se déforme en parallélogramme : il n’est PAS rigide !',
  draw(c,p,W,H,t){ decorChantier(c,W,H,t); const e=lisse(p), sk=72*e; const P=carrePts(W/2,H/2+6,170,sk);
   verin(c,W/2-85-2,P[0][1],sk,H-42); cadre(c,P,e>.5?'#ef4444':'#64748b');
   if(e>.6){ c.globalAlpha=sous(e,.6,1); G.pastille(c,'il se déforme !',W/2+200,H/2+40,'#dc2626',16); c.globalAlpha=1; } } },
 { dur:3400, caption:'SOLUTION — On ajoute une barre en DIAGONALE : le carré devient deux triangles.',
  draw(c,p,W,H,t){ decorChantier(c,W,H,t); const e=lisse(p); const P=carrePts(W/2,H/2+6,170,0); cadre(c,P,'#64748b',e);
   if(p>.55){ c.globalAlpha=sous(p,.55,.85);
    c.fillStyle='rgba(22,163,74,.12)'; c.beginPath(); c.moveTo(...P[0]); c.lineTo(...P[1]); c.lineTo(...P[3]); c.closePath(); c.fill();
    c.fillStyle='rgba(37,99,235,.10)'; c.beginPath(); c.moveTo(...P[1]); c.lineTo(...P[2]); c.lineTo(...P[3]); c.closePath(); c.fill();
    G.pastille(c,'diagonale',W/2+190,H/2+6,'#16a34a',15); G.fleche(c,W/2+140,H/2+6,W/2+30,H/2+6,'#16a34a',4); c.globalAlpha=1; } } },
 { dur:4200, caption:'PROPRIÉTÉ — On repousse : rien ne bouge ! Le TRIANGLE est la seule figure INDÉFORMABLE.',
  draw(c,p,W,H,t){ decorChantier(c,W,H,t); const tr=p<.4?Math.sin(p*60)*2.2*(.4-p):0; const P=carrePts(W/2+tr,H/2+6,170,0);
   verin(c,W/2-85-2+tr,P[0][1],0,H-42); cadre(c,P,'#64748b',1);
   const a=sous(p,.4,.8); c.globalAlpha=a; pylone(c,96,H-42,170); treillis(c,W-250,H-42-20,210,56,4); G.texte(c,'pylône',96,H-12,'#334155',13); G.texte(c,'pont en treillis',W-145,H-12,'#334155',13);
   G.pastille(c,'TRIANGULATION = RIGIDITÉ',W/2,36,'#15803d',17); c.globalAlpha=1; } },
]);

/* ============ ANIM 3 : LES TYPES DE PONTS ============ */
function decorRiviere(c,W,H,t,yEau){ G.ciel(c,W,H); G.soleil(c,W-80,58,20); G.nuages(c,W,t,52); G.collines(c,W,yEau,'#cfe8d6','#b8dfc5');
 G.eau(c,0,W,yEau,H,t); }
function berges(c,W,H,yEau,yRoute,larg=110){ [[0,larg],[W-larg,W]].forEach(([x0,x1],k)=>{ const g=c.createLinearGradient(0,yRoute,0,H); g.addColorStop(0,'#8fcf7a'); g.addColorStop(.08,'#a0794f'); g.addColorStop(1,'#6f5034'); c.fillStyle=g;
  c.beginPath(); if(k===0){ c.moveTo(0,yRoute); c.lineTo(x1,yRoute); c.lineTo(x1+18,H); c.lineTo(0,H);} else { c.moveTo(W,yRoute); c.lineTo(x0,yRoute); c.lineTo(x0-18,H); c.lineTo(W,H);} c.closePath(); c.fill(); }); }
function tablier(c,x0,x1,y,ep=14,f=0){ const N=30; c.fillStyle='#e2e8f0'; c.fillRect(x0,y-ep/2-5,x1-x0,5);
 const g=c.createLinearGradient(0,y-ep/2,0,y+ep/2); g.addColorStop(0,'#94a3b8'); g.addColorStop(1,'#475569'); c.fillStyle=g; c.beginPath();
 for(let k=0;k<=N;k++){ const x=x0+(x1-x0)*k/N; c.lineTo(x,y-ep/2+f*Math.sin(Math.PI*k/N)); } for(let k=N;k>=0;k--){ const x=x0+(x1-x0)*k/N; c.lineTo(x,y+ep/2+f*Math.sin(Math.PI*k/N)); } c.closePath(); c.fill();
 c.strokeStyle='#cbd5e1'; c.lineWidth=2; c.beginPath(); c.moveTo(x0,y-ep/2-14); c.lineTo(x1,y-ep/2-14); c.stroke(); for(let x=x0;x<=x1;x+=22){ c.beginPath(); c.moveTo(x,y-ep/2-14); c.lineTo(x,y-ep/2-4); c.stroke(); } }
function pile(c,x,yh,yb,w=26){ const g=c.createLinearGradient(x-w/2,0,x+w/2,0); g.addColorStop(0,'#cbd5e1'); g.addColorStop(1,'#64748b'); c.fillStyle=g; c.fillRect(x-w/2,yh,w,yb-yh);
 c.fillStyle='rgba(255,255,255,.25)'; c.fillRect(x-w/2,yb-14,w,4); }
function dessinPontPoutre(c,W,H,t,cx){ const yE=H-90, yR=H-150; decorRiviere(c,W,H,t,yE); berges(c,W,H,yE,yR);
 const piles=[W*.37,W*.63]; piles.forEach(px=>pile(c,px,yR,H-20));
 const f=cx==null?0:6*Math.sin(Math.PI*clamp((cx-90)/(W-180)));
 tablier(c,70,W-70,yR,16,f); if(cx!=null) G.camion(c,cx,yR-13+f); return {yR,piles}; }
function dessinPontArc(c,W,H,t,cx){ const yE=H-90, yR=H-170, xg=150, xd=W-150; decorRiviere(c,W,H,t,yE); berges(c,W,H,yE,yR,150);
 // tympans en pierre
 c.fillStyle='#e7dfd3'; c.beginPath(); c.moveTo(xg,yR); c.lineTo(xd,yR); c.lineTo(xd,yE+10); c.quadraticCurveTo(W/2,yR-56,xg,yE+10); c.closePath(); c.fill();
 c.strokeStyle='rgba(120,100,80,.25)'; c.lineWidth=1; for(let y=yR+12;y<yE;y+=14){ c.beginPath(); c.moveTo(xg,y); c.lineTo(xd,y); c.stroke(); }
 // voussoirs
 const arc=t1=>{ const u=1-t1; return [u*u*xg+2*u*t1*W/2+t1*t1*xd, u*u*(yE+10)+2*u*t1*(yR-56)+t1*t1*(yE+10)]; };
 for(let k=0;k<18;k++){ const a=arc(k/18), b=arc((k+1)/18); c.strokeStyle=k%2?'#a8937a':'#b8a389'; c.lineWidth=20; c.lineCap='butt'; c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.stroke(); }
 c.fillStyle='#d6cbb9'; c.fillRect(xg-40,yR,40,yE-yR+10); c.fillRect(xd,yR,40,yE-yR+10);
 tablier(c,xg-40,xd+40,yR,12); if(cx!=null) G.camion(c,cx,yR-11); return {yR,yE,xg,xd,arc}; }
function dessinPontSuspendu(c,W,H,t,cx){ const yE=H-80, yR=H-140, xg=60, xd=W-60, t1=W*.27, t2=W*.73, ht=60; decorRiviere(c,W,H,t,yE); berges(c,W,H,yE,yR,70);
 [t1,t2].forEach(px=>{ const g=c.createLinearGradient(px-14,0,px+14,0); g.addColorStop(0,'#94a3b8'); g.addColorStop(1,'#475569'); c.fillStyle=g; c.fillRect(px-13,ht,10,H-20-ht); c.fillRect(px+3,ht,10,H-20-ht); c.fillRect(px-16,ht+6,32,8); c.fillRect(px-16,yR-40,32,7); });
 const P0=[t1,ht], C=[W/2,yR-30+18], P1=[t2,ht];
 c.strokeStyle='#1d4ed8'; c.lineWidth=5; c.beginPath(); c.moveTo(xg,yR-8); c.quadraticCurveTo((xg+t1)/2,ht+40,t1,ht); c.quadraticCurveTo(C[0],C[1],t2,ht); c.quadraticCurveTo((t2+xd)/2,ht+40,xd,yR-8); c.stroke();
 c.strokeStyle='#60a5fa'; c.lineWidth=2; for(let k=1;k<12;k++){ const s=k/12,u=1-s; const x=u*u*P0[0]+2*u*s*C[0]+s*s*P1[0], y=u*u*P0[1]+2*u*s*C[1]+s*s*P1[1]; c.beginPath(); c.moveTo(x,y); c.lineTo(x,yR-8); c.stroke(); }
 tablier(c,xg,xd,yR,12); if(cx!=null) G.camion(c,cx,yR-11); return {yR,t1,t2,ht,C,P0,P1}; }
creerAnim('ponts','cvPonts','capPonts','ptsPonts',[
 { dur:5200, caption:'PONT POUTRE — Deux pièces, deux efforts : le TABLIER se plie, il travaille en FLEXION ; les PILES sont écrasées, elles travaillent en COMPRESSION.',
  draw(c,p,W,H,t){ const cx=100+(W-200)*lisse(p); const s=dessinPontPoutre(c,W,H,t,cx);
   G.fleche(c,cx,s.yR-112,cx,s.yR-58,'#ea580c',6); G.pastille(c,'TABLIER : flexion',clamp(cx,120,W-120),s.yR-128,'#ea580c',14);
   s.piles.forEach(px=>G.fleche(c,px,s.yR+22,px,s.yR+82,'#dc2626',6)); G.pastille(c,'PILES : compression',W/2,s.yR+56,'#dc2626',14);
   G.titre(c,'PONT POUTRE',W/2,34,'#1e3a8a',20); } },
 { dur:5200, caption:'PONT EN ARC — L’arc transmet toute la charge en COMPRESSION vers ses appuis. Idéal pour la pierre !',
  draw(c,p,W,H,t){ const cx=110+(W-220)*lisse(p); const s=dessinPontArc(c,W,H,t,cx);
   [[.12,.04],[.88,.96]].forEach(([a,b])=>{ const A=s.arc(a),B=s.arc(b); G.fleche(c,A[0],A[1]-2,B[0]+(b<.5?-6:6),B[1]+20,'#dc2626',6); });
   [[.3,.18],[.7,.82]].forEach(([a,b])=>{ const A=s.arc(a),B=s.arc(b); G.fleche(c,A[0],A[1]-10,B[0],B[1]-10,'#dc2626',5); });
   G.pastille(c,'l’arc pousse sur ses appuis',W/2,s.yE-10,'#dc2626',14); G.titre(c,'PONT EN ARC',W/2,34,'#1e3a8a',20); } },
 { dur:5200, caption:'PONT SUSPENDU — Le tablier PEND à des câbles tendus : ils travaillent en TRACTION. Champion des grandes portées !',
  draw(c,p,W,H,t){ const cx=90+(W-180)*lisse(p); const s=dessinPontSuspendu(c,W,H,t,cx);
   G.fleche(c,W/2+60,s.yR-22,W/2+60,s.yR-70,'#1d4ed8',5); G.fleche(c,s.t1-40,s.ht+60,s.t1-14,s.ht+12,'#1d4ed8',5); G.fleche(c,s.t2+40,s.ht+60,s.t2+14,s.ht+12,'#1d4ed8',5);
   G.pastille(c,'câbles tendus : traction',W/2+60,s.yR-90,'#1d4ed8',14); G.titre(c,'PONT SUSPENDU',W/2,34,'#1e3a8a',20); } },
 { dur:3800, caption:'PROPRIÉTÉ — Chaque famille dirige la charge autrement : le tablier du pont poutre FLÉCHIT, l’arc est COMPRIMÉ, les câbles du pont suspendu sont TENDUS.',
  draw(c,p,W,H,t){ G.ciel(c,W,H,'#eef6fd','#f8fbff');
   const items=[['PONT POUTRE','flexion du tablier','#ea580c',dessinPontPoutre],['PONT EN ARC','compression de l’arc','#dc2626',dessinPontArc],['PONT SUSPENDU','traction des câbles','#1d4ed8',dessinPontSuspendu]];
   items.forEach((it,k)=>{ const a=lisse(sous(p,k*.2,k*.2+.5)); if(a<=0) return; const x=W*(0.18+0.32*k), w=240, h=250, y0=H/2-h/2+10+(1-a)*20;
    c.globalAlpha=a; c.save(); c.shadowColor='rgba(15,23,42,.18)'; c.shadowBlur=18; c.shadowOffsetY=6; c.fillStyle='#fff'; G.boite(c,x-w/2,y0,w,h,18); c.fill(); c.restore();
    c.save(); G.boite(c,x-w/2+10,y0+10,w-20,140,12); c.clip(); c.translate(x-w/2+10,y0+10); c.scale((w-20)/W,140/H*1.0); it[3](c,W,H,t,null); c.restore();
    G.titre(c,it[0],x,y0+182,'#1b2f4b',17); G.pastille(c,it[1],x,y0+216,it[2],14); c.globalAlpha=1; }); } },
]);

/* ============ SCHÉMA DE LA TRACE ÉCRITE ============ */
(function(){
 const cv=document.getElementById('trace_hab'); if(!cv)return;
 const W=860,H=330,dpr=2.5; cv.width=W*dpr; cv.height=H*dpr; const c=cv.getContext('2d'); c.setTransform(dpr,0,0,dpr,0,0);
 const T=(t,x,y,ta,coul,al)=>{c.font=`800 ${ta||13}px ${POLICE}`;c.fillStyle=coul||'#334155';c.textAlign=al||'center';c.fillText(t,x,y);};
 const FL=(x1,y1,x2,y2,coul,ep)=>G.fleche(c,x1,y1,x2,y2,coul,ep||3);
 const panneau=(x,y,w,h,titre)=>{ c.fillStyle='#f8fafc'; G.boite(c,x,y,w,h,14); c.fill(); c.strokeStyle='#e2e8f0'; c.lineWidth=1.5; c.stroke(); T(titre,x+w/2,y+22,13,'#15803d'); };
 const dessin=()=>{ c.clearRect(0,0,W,H); c.fillStyle='#fff'; c.fillRect(0,0,W,H);
  panneau(10,8,300,168,'LES TROIS EFFORTS'); panneau(320,8,530,168,'LA TRIANGULATION'); panneau(10,184,840,138,'LES TROIS FAMILLES DE PONTS');
  [['compression',70,'#dc2626'],['traction',160,'#1d4ed8'],['flexion',252,'#ea580c']].forEach(([nom,x,coul],i)=>{
   c.fillStyle='#94a3b8';
   if(i<2){ G.boite(c,x-10,64,20,56,3); c.fill(); }
   else { c.beginPath(); c.moveTo(x-42,72); c.quadraticCurveTo(x,98,x+42,72); c.lineTo(x+42,84); c.quadraticCurveTo(x,110,x-42,84); c.closePath(); c.fill(); }
   if(i===0){ FL(x,36,x,60,coul); FL(x,148,x,124,coul); } else if(i===1){ FL(x,62,x,38,coul); FL(x,122,x,146,coul); } else { FL(x,38,x,70,coul); }
   T(nom,x,166,13,coul); });
  c.lineCap='round'; c.lineJoin='round'; c.lineWidth=6;
  c.strokeStyle='#dc2626'; c.beginPath(); c.moveTo(440,130); c.lineTo(460,64); c.lineTo(526,64); c.lineTo(506,130); c.closePath(); c.stroke();
  [[440,130],[460,64],[526,64],[506,130]].forEach(([x,y])=>G.boulon(c,x,y,5));
  T('carré : se déforme',483,162,13,'#dc2626');
  c.lineWidth=6; c.strokeStyle='#16a34a'; c.beginPath(); c.moveTo(676,130); c.lineTo(744,130); c.lineTo(710,64); c.closePath(); c.stroke();
  [[676,130],[744,130],[710,64]].forEach(([x,y])=>G.boulon(c,x,y,5));
  T('triangle : indéformable',710,162,13,'#16a34a');
  const solY=296; const sol=(x0,x1)=>{ c.fillStyle='#d6d3d1'; c.fillRect(x0,solY,x1-x0,12); };
  (function(){ const xg=50,xd=260,y=254; sol(xg-16,xd+16);
   c.fillStyle='#94a3b8'; c.fillRect(xg-14,y,14,solY-y); c.fillRect(xd,y,14,solY-y); c.fillStyle='#64748b'; c.fillRect(150,y,13,solY-y);
   c.fillStyle='#475569'; c.fillRect(xg-14,y-9,xd-xg+28,9); FL(208,214,208,242,'#ea580c',3); T('tablier : flexion',208,208,12,'#ea580c'); T('PONT À POUTRE',155,318,13,'#15803d'); })();
  (function(){ const xg=340,xd=520,y=250; sol(xg-30,xd+30);
   c.fillStyle='#e7dfd3'; c.beginPath(); c.moveTo(xg,y); c.lineTo(xd,y); c.lineTo(xd,solY); c.quadraticCurveTo((xg+xd)/2,y-34,xg,solY); c.closePath(); c.fill();
   c.fillStyle='#d6cbb9'; c.fillRect(xg-26,y,26,solY-y); c.fillRect(xd,y,26,solY-y);
   c.strokeStyle='#a8937a'; c.lineWidth=8; c.lineCap='butt'; c.beginPath(); c.moveTo(xg,solY); c.quadraticCurveTo((xg+xd)/2,y-34,xd,solY); c.stroke();
   c.fillStyle='#475569'; c.fillRect(xg-26,y-9,xd-xg+52,9); FL(372,262,348,288,'#dc2626',3); FL(488,262,512,288,'#dc2626',3); T('arc : compression',430,282,12,'#dc2626'); T('PONT EN ARC',430,318,13,'#15803d'); })();
  (function(){ const xg=610,xd=830,y=262,ph=200; sol(xg-10,xd+10);
   c.fillStyle='#475569'; c.fillRect(xg,y-4,xd-xg,8); c.fillStyle='#64748b'; c.fillRect(xg+26,ph,10,solY-ph); c.fillRect(xd-36,ph,10,solY-ph);
   c.strokeStyle='#1d4ed8'; c.lineWidth=3; c.lineCap='round'; c.beginPath(); c.moveTo(xg,y-4); c.lineTo(xg+31,ph); c.quadraticCurveTo((xg+xd)/2,y-2,xd-31,ph); c.lineTo(xd,y-4); c.stroke();
   c.strokeStyle='#93c5fd'; c.lineWidth=1.6; const P0x=xg+31,P1x=xd-31,Cx=(xg+xd)/2,Cy=y-2;
   for(let k=1;k<=5;k++){ const s=k/6,u=1-s; const x=u*u*P0x+2*u*s*Cx+s*s*P1x, yc=u*u*ph+2*u*s*Cy+s*s*ph; c.beginPath(); c.moveTo(x,yc); c.lineTo(x,y-4); c.stroke(); }
   FL(720,250,720,224,'#1d4ed8',3); T('câbles : traction',720,214,12,'#1d4ed8'); T('PONT SUSPENDU',720,318,13,'#15803d'); })();
 };
 dessin(); document.fonts&&document.fonts.ready&&document.fonts.ready.then(dessin);
})();

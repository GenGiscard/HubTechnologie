<script>
/* ═══ schéma de la trace écrite — algorithmes ═══ */
window.addEventListener('DOMContentLoaded',function(){
  const cv=document.getElementById("cvTrace"); if(!cv) return;
  const W=860,H=200,dpr=2.5; cv.width=W*dpr; cv.height=H*dpr; const c=cv.getContext("2d"); c.setTransform(dpr,0,0,dpr,0,0);
  const B=[["L’ENTRÉE","le capteur donne une valeur"],["LA CONDITION","on compare à un seuil"],["L’ACTION","le programme commande"],["LA BOUCLE","et on recommence"]], A="#4f46e5", F="#3730a3";
  const dessin=()=>{ c.clearRect(0,0,W,H); c.fillStyle="#fff"; c.fillRect(0,0,W,H);
   G.texte(c,"ALGORITHMES ET PROGRAMMATION",430,28,F,14.5);
   const n=B.length, m=24, e=26, w=Math.floor((W-2*m-(n-1)*e)/n);
   B.forEach((b,i)=>{ const x=m+i*(w+e);
    c.save(); c.shadowColor='rgba(79,70,229,.18)'; c.shadowBlur=10; c.shadowOffsetY=3; const g=c.createLinearGradient(0,56,0,126); g.addColorStop(0,'#eef2ff'); g.addColorStop(1,'#e0e7ff'); c.fillStyle=g; G.boite(c,x,56,w,70,14); c.fill(); c.restore();
    c.strokeStyle=A; c.lineWidth=2; G.boite(c,x,56,w,70,14); c.stroke();
    G.texte(c,b[0],x+w/2,87,F,13); G.texte(c,b[1],x+w/2,107,"#5b5b8a",11.5);
    if(i<n-1) G.fleche(c,x+w+3,91,x+w+e-2,91,A,4);
   });
   c.strokeStyle=A; c.lineWidth=2; c.setLineDash([5,5]); c.beginPath(); c.moveTo(m+3*(w+e)+w/2,128); c.lineTo(m+3*(w+e)+w/2,142); c.lineTo(m+w/2,142); c.stroke(); c.setLineDash([]); G.fleche(c,m+w/2,142,m+w/2,130,A,2.5);
   G.texte(c,"entrée → condition → action → boucle : dérouler avant d’exécuter",430,172,"#475569",13.5);
  };
  dessin(); document.fonts&&document.fonts.ready&&document.fonts.ready.then(dessin);
});
</script>

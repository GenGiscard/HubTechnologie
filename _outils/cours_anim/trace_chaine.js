<script>
/* ═══ schéma de la trace écrite — chaîne d’énergie ═══ */
window.addEventListener('DOMContentLoaded',function(){
  const cv=document.getElementById("cvTrace"); if(!cv) return;
  const W=860,H=200,dpr=2.5; cv.width=W*dpr; cv.height=H*dpr; const c=cv.getContext("2d"); c.setTransform(dpr,0,0,dpr,0,0);
  const B=[["ALIMENTER","la batterie fournit"],["DISTRIBUER","le contrôleur dose"],["CONVERTIR","le moteur transforme"],["TRANSMETTRE","la chaîne entraîne"]], A="#7c3aed", F="#5b21b6";
  const dessin=()=>{ c.clearRect(0,0,W,H); c.fillStyle="#fff"; c.fillRect(0,0,W,H);
   G.texte(c,"LA CHAÎNE D’ÉNERGIE",430,28,F,14.5);
   const n=B.length, m=24, e=26, w=Math.floor((W-2*m-(n-1)*e)/n);
   B.forEach((b,i)=>{ const x=m+i*(w+e);
    c.save(); c.shadowColor='rgba(124,58,237,.18)'; c.shadowBlur=10; c.shadowOffsetY=3; const g=c.createLinearGradient(0,56,0,126); g.addColorStop(0,'#f5f3ff'); g.addColorStop(1,'#ede9fe'); c.fillStyle=g; G.boite(c,x,56,w,70,14); c.fill(); c.restore();
    c.strokeStyle=A; c.lineWidth=2; G.boite(c,x,56,w,70,14); c.stroke();
    G.texte(c,b[0],x+w/2,87,F,13); G.texte(c,b[1],x+w/2,107,"#5b5b8a",11.5);
    if(i<n-1) G.fleche(c,x+w+3,91,x+w+e-2,91,A,4);
   });
   G.texte(c,"alimenter → distribuer → convertir → transmettre : l’énergie ne saute jamais un maillon",430,172,"#475569",13.5);
  };
  dessin(); document.fonts&&document.fonts.ready&&document.fonts.ready.then(dessin);
});
</script>

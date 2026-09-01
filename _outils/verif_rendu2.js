/* verif_rendu2.js — convertit les dessins canvas d'une page en SVG.
   Différence avec verif_rendu.js : les transformations translate / rotate / scale
   sont réellement appliquées. L'ancienne version les ignorait, ce qui faisait
   retomber à l'origine tous les schémas dessinés via SCHEMA(ctx,nom,x,y,T)
   (qui utilise translate) : la planche de contrôle sortait vide.

   Usage : node verif_rendu2.js page.html sortie.svg idDuCanvas
   Sans idDuCanvas, la liste des canvas trouvés est affichée. */
const {JSDOM}=require('/home/claude/node_modules/jsdom');const fs=require('fs');

function ctx(W,H){
 let st={f:'#000',s:'#000',lw:1,font:'13px x',al:'start',m:[1,0,0,1,0,0]};
 let cur=[],out=[],pile=[];
 const ap=(x,y)=>{const m=st.m;return [m[0]*x+m[2]*y+m[4], m[1]*x+m[3]*y+m[5]];};
 const P=(x,y)=>{const p=ap(x,y);return p[0].toFixed(1)+','+p[1].toFixed(1);};
 const mul=(n)=>{const m=st.m;st.m=[
   m[0]*n[0]+m[2]*n[1], m[1]*n[0]+m[3]*n[1],
   m[0]*n[2]+m[2]*n[3], m[1]*n[2]+m[3]*n[3],
   m[0]*n[4]+m[2]*n[5]+m[4], m[1]*n[4]+m[3]*n[5]+m[5]];};
 const ech=()=>Math.sqrt(Math.abs(st.m[0]*st.m[3]-st.m[1]*st.m[2]))||1;
 const o={
  save(){pile.push({...st,m:st.m.slice()});},
  restore(){if(pile.length)st=pile.pop();},
  translate(x,y){mul([1,0,0,1,x,y]);},
  rotate(a){mul([Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),0,0]);},
  scale(x,y){mul([x,0,0,y===undefined?x:y,0,0]);},
  transform(a,b,c,d,e,f){mul([a,b,c,d,e,f]);},
  setTransform(a,b,c,d,e,f){st.m=[a,b,c,d,e,f];},
  resetTransform(){st.m=[1,0,0,1,0,0];},
  beginPath(){cur=[];},closePath(){cur.push('Z');},
  moveTo(x,y){cur.push('M'+P(x,y));},lineTo(x,y){cur.push('L'+P(x,y));},
  quadraticCurveTo(a,b,x,y){cur.push('Q'+P(a,b)+' '+P(x,y));},
  bezierCurveTo(a,b,c,d,x,y){cur.push('C'+P(a,b)+' '+P(c,d)+' '+P(x,y));},
  /* Sémantique réelle du canvas : sens horaire par défaut, avec repli de 2*pi
     quand l'angle de fin est inférieur à l'angle de départ. Sans cela,
     arc(x,y,r,PI,0) traçait le demi-cercle du bas au lieu de celui du haut. */
  arc(x,y,r,a0,a1,anti){const n=48;let d=a1-a0;
    if(!anti&&d<0) d+=Math.PI*2*Math.ceil(-d/(Math.PI*2));
    if(anti&&d>0) d-=Math.PI*2*Math.ceil(d/(Math.PI*2));
    for(let k=0;k<=n;k++){const a=a0+d*k/n;
     cur.push((k===0&&!cur.length?'M':'L')+P(x+r*Math.cos(a),y+r*Math.sin(a)));}},
  ellipse(x,y,rx,ry,rot,a0,a1){const n=32;for(let k=0;k<=n;k++){const a=a0+(a1-a0)*k/n;
    const px=rx*Math.cos(a),py=ry*Math.sin(a);
    const qx=px*Math.cos(rot||0)-py*Math.sin(rot||0), qy=px*Math.sin(rot||0)+py*Math.cos(rot||0);
    cur.push((k===0&&!cur.length?'M':'L')+P(x+qx,y+qy));}},
  rect(x,y,w,h){cur.push('M'+P(x,y),'L'+P(x+w,y),'L'+P(x+w,y+h),'L'+P(x,y+h),'Z');},
  roundRect(x,y,w,h){o.rect(x,y,w,h);},
  fill(){if(cur.length)out.push('<path d="'+cur.join(' ')+'" fill="'+st.f+'"/>');},
  stroke(){if(cur.length)out.push('<path d="'+cur.join(' ')+'" fill="none" stroke="'+st.s+
    '" stroke-width="'+(st.lw*ech()).toFixed(2)+'" stroke-linecap="round"/>');},
  clip(){},setLineDash(){},clearRect(){out.length=0;},
  fillRect(x,y,w,h){out.push('<path d="M'+P(x,y)+' L'+P(x+w,y)+' L'+P(x+w,y+h)+' L'+P(x,y+h)+
    ' Z" fill="'+st.f+'"/>');},
  strokeRect(x,y,w,h){out.push('<path d="M'+P(x,y)+' L'+P(x+w,y)+' L'+P(x+w,y+h)+' L'+P(x,y+h)+
    ' Z" fill="none" stroke="'+st.s+'" stroke-width="'+(st.lw*ech()).toFixed(2)+'"/>');},
  fillText(t,x,y){const m=/([\d.]+)px/.exec(st.font),ts=(m?+m[1]:13)*ech();
   const a=st.al==='center'?'middle':(st.al==='right'||st.al==='end'?'end':'start');
   const p=ap(x,y);
   out.push('<text x="'+p[0].toFixed(1)+'" y="'+p[1].toFixed(1)+'" font-size="'+ts.toFixed(1)+
    '" text-anchor="'+a+'" fill="'+st.f+'" font-family="Arial"'+
    (/bold/.test(st.font)?' font-weight="bold"':'')+'>'+
    String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</text>');},
  strokeText(t,x,y){o.fillText(t,x,y);},
  measureText(t){return{width:String(t).length*6.2};},
  createLinearGradient(){return{addColorStop(){}};},
  createRadialGradient(){return{addColorStop(){}};},
  createPattern(){return null;},drawImage(){},
  svg(){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'"><rect width="'+
   W+'" height="'+H+'" fill="#fff"/>'+out.join('')+'</svg>';}};
 /* Les getters renvoient la valeur réellement en cours : le corpus utilise
    partout l'idiome c.strokeStyle=c.fillStyle, qui donnait un trait vide
    lorsque le getter renvoyait une chaîne nulle. */
 const autres={};
 ['fillStyle','strokeStyle','lineWidth','font','textAlign','globalAlpha','lineCap',
  'lineJoin','lineDashOffset','textBaseline','shadowBlur','shadowColor'].forEach(p=>
  Object.defineProperty(o,p,{
   get(){
    if(p==='fillStyle')return st.f;
    if(p==='strokeStyle')return st.s;
    if(p==='lineWidth')return st.lw;
    if(p==='font')return st.font;
    if(p==='textAlign')return st.al;
    return autres[p];},
   set(v){
    if(p==='fillStyle')st.f=typeof v==='string'?v:'#000';
    else if(p==='strokeStyle')st.s=typeof v==='string'?v:'#000';
    else if(p==='lineWidth')st.lw=v;
    else if(p==='font')st.font=v;
    else if(p==='textAlign')st.al=v;
    else autres[p]=v;}}));
 return o;}

const cs={};let rafs=[];
const dom=new JSDOM(fs.readFileSync(process.argv[2],'utf8'),{runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){
 w.HTMLCanvasElement.prototype.getContext=function(){const i=this.id||'x';
  if(!cs[i])cs[i]=ctx(+this.getAttribute('width'),+this.getAttribute('height'));return cs[i];};
 w.HTMLCanvasElement.prototype.getBoundingClientRect=function(){return{left:0,top:0,width:860,height:230};};
 w.requestAnimationFrame=cb=>{rafs.push(cb);return 1;};w.cancelAnimationFrame=()=>{};
 w.IntersectionObserver=class{constructor(){}observe(){}disconnect(){}};w.scrollTo=()=>{};
 w.Element.prototype.scrollIntoView=()=>{};
 Object.defineProperty(w,'localStorage',{value:{getItem:()=>null,setItem:()=>{}}});
}});
for(let i=0;i<2;i++) rafs.splice(0).forEach(cb=>{try{cb(16);}catch(e){}});

/* 5e argument facultatif : extrait de JS exécuté dans la page avant capture,
   pour contrôler un canvas qui n'apparaît qu'après une interaction.
   Les variables w (window) et d (document) sont disponibles. */
if(process.argv[5]){
 const w=dom.window, d=w.document;
 try{ (new Function('w','d',process.argv[5]))(w,d); }
 catch(e){ console.log('interaction: erreur —',e.message); }
 for(let i=0;i<2;i++) rafs.splice(0).forEach(cb=>{try{cb(32);}catch(e){}});
}
const id=process.argv[4];
if(cs[id]) fs.writeFileSync(process.argv[3],cs[id].svg());
console.log('canvas:',Object.keys(cs).join(' '));

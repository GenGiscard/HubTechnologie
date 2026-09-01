const {JSDOM}=require('/home/claude/node_modules/jsdom');const fs=require('fs');
function ctx(W,H){let st={f:'#000',s:'#000',lw:1,font:'13px x',al:'start'},cur=[],out=[],pile=[];
 const P=(x,y)=>x.toFixed(1)+','+y.toFixed(1);
 const o={save(){pile.push({...st});},restore(){if(pile.length)st=pile.pop();},translate(){},rotate(){},scale(){},
  beginPath(){cur=[];},closePath(){cur.push('Z');},moveTo(x,y){cur.push('M'+P(x,y));},lineTo(x,y){cur.push('L'+P(x,y));},
  quadraticCurveTo(a,b,x,y){cur.push('Q'+P(a,b)+' '+P(x,y));},bezierCurveTo(a,b,c,d,x,y){cur.push('C'+P(a,b)+' '+P(c,d)+' '+P(x,y));},
  arc(x,y,r,a0,a1){const n=24;for(let k=0;k<=n;k++){const a=a0+(a1-a0)*k/n;cur.push((k===0&&!cur.length?'M':'L')+P(x+r*Math.cos(a),y+r*Math.sin(a)));}},
  ellipse(x,y,rx,ry,rot,a0,a1){const n=24;for(let k=0;k<=n;k++){const a=a0+(a1-a0)*k/n;cur.push((k===0&&!cur.length?'M':'L')+P(x+rx*Math.cos(a),y+ry*Math.sin(a)));}},
  rect(x,y,w,h){cur.push('M'+P(x,y),'L'+P(x+w,y),'L'+P(x+w,y+h),'L'+P(x,y+h),'Z');},
  roundRect(x,y,w,h){o.rect(x,y,w,h);},
  fill(){if(cur.length)out.push('<path d="'+cur.join(' ')+'" fill="'+st.f+'"/>');},
  stroke(){if(cur.length)out.push('<path d="'+cur.join(' ')+'" fill="none" stroke="'+st.s+'" stroke-width="'+st.lw+'" stroke-linecap="round"/>');},
  clip(){},setLineDash(){},clearRect(){out.length=0;},
  fillRect(x,y,w,h){out.push('<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+st.f+'"/>');},
  strokeRect(x,y,w,h){out.push('<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="none" stroke="'+st.s+'" stroke-width="'+st.lw+'"/>');},
  fillText(t,x,y){const m=/([\d.]+)px/.exec(st.font),ts=m?m[1]:13;
   const a=st.al==='center'?'middle':(st.al==='right'||st.al==='end'?'end':'start');
   out.push('<text x="'+x+'" y="'+y+'" font-size="'+ts+'" text-anchor="'+a+'" fill="'+st.f+'" font-family="Arial"'+(/bold/.test(st.font)?' font-weight="bold"':'')+'>'+String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</text>');},
  measureText(t){return{width:String(t).length*6.2};},createLinearGradient(){return{addColorStop(){}};},
  svg(){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'"><rect width="'+W+'" height="'+H+'" fill="#fff"/>'+out.join('')+'</svg>';}};
 ['fillStyle','strokeStyle','lineWidth','font','textAlign','globalAlpha','lineCap','lineJoin','lineDashOffset','textBaseline'].forEach(p=>
  Object.defineProperty(o,p,{get(){return '';},set(v){if(p==='fillStyle')st.f=typeof v==='string'?v:'#000';
   else if(p==='strokeStyle')st.s=typeof v==='string'?v:'#000';else if(p==='lineWidth')st.lw=v;
   else if(p==='font')st.font=v;else if(p==='textAlign')st.al=v;}}));
 return o;}
const cs={};let rafs=[];
new JSDOM(fs.readFileSync(process.argv[2],'utf8'),{runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){
 w.HTMLCanvasElement.prototype.getContext=function(){const i=this.id||'x';if(!cs[i])cs[i]=ctx(+this.getAttribute('width'),+this.getAttribute('height'));return cs[i];};
 w.HTMLCanvasElement.prototype.getBoundingClientRect=function(){return{left:0,top:0,width:860,height:230};};
 w.requestAnimationFrame=cb=>{rafs.push(cb);return 1;};w.cancelAnimationFrame=()=>{};
 w.IntersectionObserver=class{constructor(){}observe(){}disconnect(){}};w.scrollTo=()=>{};
 w.Element.prototype.scrollIntoView=()=>{};
 Object.defineProperty(w,'localStorage',{value:{getItem:()=>null,setItem:()=>{}}});
}});
for(let i=0;i<2;i++) rafs.splice(0).forEach(cb=>{try{cb(16);}catch(e){}});
const id=process.argv[4];
if(cs[id]) fs.writeFileSync(process.argv[3],cs[id].svg());
console.log('canvas:',Object.keys(cs).join(' '));

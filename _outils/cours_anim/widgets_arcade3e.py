import sys,re
f=sys.argv[1]; s=open(f,encoding='utf-8').read()
# --- dichotomie ---
a=s.index('<canvas id="wDi" width="640" height="150" style="max-width:640px"></canvas>')
s=s.replace('<canvas id="wDi" width="640" height="150" style="max-width:640px"></canvas>','<canvas id="wDi" width="680" height="200" style="max-width:680px"></canvas>',1)
i=s.index('<script>let DS,DMi,DMa,DN,DM;'); j=s.index('</script>',i)+9
NEW=r'''<script>let DS,DMi,DMa,DN,DM,DH=[];
function wDiNew(){DS=10+Math.floor(Math.random()*141);DMi=0;DMa=160;DN=0;DM=null;DH=[];wDiD();}
function wDiStep(){if(DMa-DMi<=1)return;DM=Math.floor((DMi+DMa)/2);DN++;DH.push(DM);if(DS>DM)DMi=DM;else DMa=DM;wDiD();}
function wDiD(){const c=document.getElementById('wDi'),W=680,H=200,R=2.5;if(c.width!==W*R){c.width=W*R;c.height=H*R;}const g=c.getContext('2d');g.setTransform(R,0,0,R,0,0);g.clearRect(0,0,W,H);
 const F="Nunito, Segoe UI, sans-serif",x0=20,k=(W-40)/160,y=70,h=46,X=v=>x0+v*k;
 g.fillStyle='#f1f5f9';g.beginPath();g.roundRect(x0,y,W-40,h,12);g.fill();
 // zones écartées hachurées
 g.save();g.beginPath();g.roundRect(x0,y,W-40,h,12);g.clip();g.strokeStyle='rgba(148,163,184,.45)';g.lineWidth=6;for(let xx=-40;xx<W;xx+=16){g.beginPath();g.moveTo(xx,y+h);g.lineTo(xx+40,y);g.stroke();}
 const gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,'#fecdd3');gr.addColorStop(1,'#fda4af');g.fillStyle=gr;g.fillRect(X(DMi),y,(DMa-DMi)*k,h);g.restore();
 g.strokeStyle='#9f1239';g.lineWidth=2.5;g.beginPath();g.roundRect(X(DMi)+1,y+1,Math.max(4,(DMa-DMi)*k-2),h-2,10);g.stroke();
 // règle graduée
 g.strokeStyle='#64748b';g.fillStyle='#64748b';g.font='800 11px '+F;g.textAlign='center';
 for(let v=0;v<=160;v+=10){const xx=X(v);g.lineWidth=v%20?1:1.6;g.beginPath();g.moveTo(xx,y+h+4);g.lineTo(xx,y+h+(v%20?9:13));g.stroke();if(v%20===0)g.fillText(v,xx,y+h+26);}
 // bornes
 const pastille=(t,x,yy,col)=>{g.font='900 13px '+F;const w=g.measureText(t).width+20;g.fillStyle='#fff';g.beginPath();g.roundRect(x-w/2,yy-12,w,24,12);g.fill();g.strokeStyle=col;g.lineWidth=2;g.stroke();g.fillStyle=col;g.textAlign='center';g.fillText(t,x,yy+5);};
 let pm=X(DMi),pM=X(DMa);if(pM-pm<140){const m=(pm+pM)/2;pm=m-70;pM=m+70;}pm=Math.max(52,Math.min(W-192,pm));pM=Math.min(W-52,Math.max(192,pM));pastille('mini = '+DMi,pm,y-22,'#9f1239');pastille('maxi = '+DMa,pM,y-22,'#9f1239');
 // milieu testé : un drapeau planté
 if(DM!==null&&DMa-DMi>1){const xx=X(DM);g.strokeStyle='#ea580c';g.lineWidth=3;g.beginPath();g.moveTo(xx,y+h+2);g.lineTo(xx,y-6);g.stroke();g.fillStyle='#ea580c';g.beginPath();g.moveTo(xx,y-6);g.lineTo(xx+20,y+1);g.lineTo(xx,y+8);g.closePath();g.fill();}
 if(DMa-DMi<=1){const xx=X(DS);const hal=g.createRadialGradient(xx,y+h/2,0,xx,y+h/2,40);hal.addColorStop(0,'rgba(250,204,21,.8)');hal.addColorStop(1,'rgba(250,204,21,0)');g.fillStyle=hal;g.beginPath();g.arc(xx,y+h/2,40,0,7);g.fill();g.imageSmoothingEnabled=false;g.drawImage(imgCanvas('piece'),xx-16,y+h/2-16,32,32);}
 // historique des essais
 g.textAlign='left';g.font='800 13px '+F;g.fillStyle='#475569';g.fillText('essais :',x0,H-14);let cx=x0+60;
 DH.forEach((v,n)=>{const t=String(v);g.font='900 13px '+F;const w=g.measureText(t).width+16;g.fillStyle=n===DH.length-1?'#ea580c':'#ffe4e6';g.beginPath();g.roundRect(cx,H-30,w,22,11);g.fill();g.fillStyle=n===DH.length-1?'#fff':'#9f1239';g.fillText(t,cx+8,H-14);cx+=w+6;});
 document.getElementById('wDiL').innerHTML=DMa-DMi<=1?'Trouvé : x = <b>'+DMa+'</b> en <b>'+DN+'</b> essais':'Essais : '+DN+' · le trésor est entre '+DMi+' (exclu) et '+DMa;}
wDiNew();document.fonts&&document.fonts.ready&&document.fonts.ready.then(wDiD);</script>'''
s=s[:i]+NEW+s[j:]
# --- états du jeu ---
i=s.index('<svg viewBox="0 0 560 150"'); j=s.index('</svg>',i)+6
def fl(x1,y1,x2,y2,col='#334155'):
    import math
    a=math.atan2(y2-y1,x2-x1); L=13; l=7; bx,by=x2-L*math.cos(a),y2-L*math.sin(a)
    return f'<path d="M{x1} {y1}L{bx:.1f} {by:.1f}" stroke="{col}" stroke-width="3" fill="none"/><path d="M{x2} {y2}L{bx-l*math.sin(a):.1f} {by+l*math.cos(a):.1f}L{bx+l*math.sin(a):.1f} {by-l*math.cos(a):.1f}Z" fill="{col}"/>'
def carte(x,titre,icone,c1,c2):
    return f'''<g><rect x="{x-62}" y="34" width="124" height="96" rx="20" fill="url(#{c1})" filter="url(#om)"/><g transform="translate({x},68)" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">{icone}</g><text x="{x}" y="116" text-anchor="middle" font-weight="900" font-size="17" fill="#fff">{titre}</text></g>'''
pill=lambda x,y,t:f'<g><rect x="{x-len(t)*4.6-12}" y="{y-13}" width="{len(t)*9.2+24}" height="26" rx="13" fill="#fff" stroke="#be123c" stroke-width="2"/><text x="{x}" y="{y+5}" text-anchor="middle" font-weight="900" font-size="13" fill="#be123c">{t}</text></g>'
icM='<path d="M-9 -12L13 0L-9 12Z" fill="#fff"/>'
icJ='<path d="M-16 -6h32a8 8 0 0 1 8 8v2a6 6 0 0 1-11 3l-3-3h-20l-3 3a6 6 0 0 1-11-3v-2a8 8 0 0 1 8-8z"/><path d="M-11 -1v7M-14.5 2.5h7"/><circle cx="10" cy="0" r="1.6" fill="#fff"/><circle cx="14" cy="5" r="1.6" fill="#fff"/>'
icF='<path d="M-10 14V-14M-10 -14h20l-5 7 5 7h-20"/>'
SVG=f'''<svg viewBox="0 0 640 200" style="max-width:640px;width:100%" font-family="Nunito, Segoe UI, sans-serif" role="img" aria-label="États du jeu : menu, jeu, fin">
<defs><linearGradient id="gM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#60a5fa"/><stop offset="1" stop-color="#2563eb"/></linearGradient>
<linearGradient id="gJ" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fb7185"/><stop offset="1" stop-color="#be123c"/></linearGradient>
<linearGradient id="gF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#94a3b8"/><stop offset="1" stop-color="#475569"/></linearGradient>
<filter id="om" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity=".22"/></filter></defs>
{carte(100,'menu',icM,'gM','')}{carte(320,'jeu',icJ,'gJ','')}{carte(540,'fin',icF,'gF','')}
{fl(166,82,252,82)}{fl(386,82,472,82)}
<path d="M540 134 C540 186 100 186 100 146" stroke="#334155" stroke-width="3" fill="none"/>{fl(100,150,100,136)}
{pill(209,58,'bouton B')}{pill(429,58,'0 vie')}{pill(320,178,'rejouer')}
</svg>'''
s=s[:i]+SVG+s[j:]
open(f,'w',encoding='utf-8').write(s); print('ok')

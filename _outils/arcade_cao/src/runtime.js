/* ===== Moteur de jeu (écran 160 x 120, logique à 30 images/s) ===== */
const SCR_W=160, SCR_H=120, FPS=30, DT=1/FPS;
const KINDS=['Joueur','Ennemi','Nourriture','Projectile','Obstacle','Bonus'];
const BTNS=['A','B','haut','bas','gauche','droite'];
const SONS={piece:[[988,.06],[1319,.12]],saut:[[440,.05],[660,.05],[880,.08]],explosion:[[110,.25]],victoire:[[523,.1],[659,.1],[784,.1],[1047,.25]],degat:[[220,.08],[160,.15]],tir:[[1200,.03],[800,.05]],bonus:[[660,.06],[880,.06],[1320,.1]]};
const FX_COLS={explosion:['#fff609','#ff8135','#ff2121','#ffffff'],etincelles:['#fff609','#ffffff','#87f2ff'],confettis:['#ff2121','#fff609','#78dc52','#87f2ff','#ff93c4','#8e2ec4'],fumee:['#a4839f','#c8c8d0','#e5cdc4'],coeurs:['#ff93c4','#ff2121']};

function mulberry(seed){ let a=seed>>>0; return ()=>{ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
const VR=Math.random; /* hasard purement visuel : ne change pas le déroulement du jeu */

class Runtime {
  constructor(opts){
    opts=opts||{};
    this.headless=!!opts.headless; this.rnd=mulberry(opts.seed||Date.now());
    this.sprites=[]; this.nextId=1; this.frame=0; this.t=0;
    this.h={start:[],update:[],interval:[],overlap:[],btn:[],lifeZero:[],countEnd:[]};
    this.score=0; this.life=null; this.countdown=null; this.scoreShown=false;
    this.bg='#003fad'; this.scene=null; this.state='run'; this.endMsg=''; this.splash=null; this.splashT=0;
    this.keys={}; this.prevKeys={}; this.moveCtl=[]; this.sounds=[]; this.err=null;
    this.trap=0; this.overlapsNow=new Set(); this.logSay=[]; this.calls={};
    this.W=SCR_W; this.H=SCR_H; this.cam={x:0,y:0}; this.camT=null;
    this.parts=[]; this.pops=[]; this.shakeA=0; this.flashA=0; this.flashC='#ff2121'; this.music=null; this.evSprite=null; this.hurtT=0; this.best=0;
  }
  /* ---------- API appelée par le code des blocs ---------- */
  onStart(f){ this.h.start.push(f); }
  onUpdate(f){ this.h.update.push(f); }
  onInterval(ms,f){ this.h.interval.push({ms:Math.max(30,+ms||500),f,next:Math.max(30,+ms||500)/1000}); }
  onOverlap(k1,k2,f){ this.h.overlap.push({k1,k2,f}); }
  onButton(b,ev,f){ this.h.btn.push({b,ev,f}); }
  onLifeZero(f){ this.h.lifeZero.push(f); }
  onCountEnd(f){ this.h.countEnd.push(f); }
  count(n){ this.calls[n]=(this.calls[n]||0)+1; }
  create(img,kind){
    if(!IMGS[img]) img='heros';
    const c=imgCanvas(img);
    const s={id:this.nextId++,img,kind,x:this.W/2,y:this.H/2,vx:0,vy:0,ax:0,ay:0,w:c.width,h:c.height,alive:true,
      stay:false,bounce:false,autoDestroy:false,say:'',sayT:0,follow:null,followV:0,born:this.t,pv:0,pvMax:0,face:1,hitT:0};
    this.sprites.push(s); this.count('create'); return s;
  }
  projectile(img,from,vx,vy){
    const s=this.create(img,'Projectile');
    if(from&&from.alive!==undefined){ s.x=from.x; s.y=from.y; }
    s.vx=+vx||0; s.vy=+vy||0; s.autoDestroy=true; this.count('projectile'); return s;
  }
  ok(s){ return s&&typeof s==='object'&&s.id; }
  setPos(s,x,y){ if(!this.ok(s)) return; s.x=+x||0; s.y=+y||0; }
  setProp(s,p,v){ if(!this.ok(s)) return; s[p]=+v||0; if(p==='pv'){ s.pvMax=Math.max(s.pvMax,s.pv); this.count('pv'); } }
  changeProp(s,p,v){ if(!this.ok(s)) return; s[p]=(+s[p]||0)+(+v||0); if(p==='pv'){ if(+v<0) s.hitT=.15; s.pvMax=Math.max(s.pvMax,s.pv); this.count('pv'); } }
  getProp(s,p){ if(!this.ok(s)) return 0; return p==='gauche'?s.x-s.w/2:p==='droite'?s.x+s.w/2:p==='haut'?s.y-s.h/2:p==='bas'?s.y+s.h/2:(+s[p]||0); }
  randomPos(s){ if(!this.ok(s)) return; s.x=Math.round(8+this.rnd()*(this.W-16)); s.y=Math.round(8+this.rnd()*(this.H-16)); }
  flag(s,f,on){ if(!this.ok(s)) return; s[f]=!!on; }
  say(s,txt){ if(!this.ok(s)) return; s.say=String(txt); s.sayT=2; this.logSay.push(String(txt)); this.count('say'); }
  destroy(s){ if(!this.ok(s)) return; s.alive=false; this.count('destroy'); }
  follow(s,target,v){ if(!this.ok(s)) return; s.follow=this.ok(target)?target:null; s.followV=+v||50; }
  setImg(s,img){ if(!this.ok(s)||!IMGS[img]) return; const c=imgCanvas(img); s.img=img; s.w=c.width; s.h=c.height; }
  kindCount(k){ return this.sprites.filter(s=>s.alive&&s.kind===k).length; }
  overlaps(a,b){ return this.ok(a)&&this.ok(b)&&a.alive&&b.alive&&a!==b&&Math.abs(a.x-b.x)<(a.w+b.w)/2-1&&Math.abs(a.y-b.y)<(a.h+b.h)/2-1; }
  move(s,vx,vy){ if(!this.ok(s)) return; this.moveCtl=this.moveCtl.filter(m=>m.s!==s); this.moveCtl.push({s,vx:+vx||0,vy:+vy||0}); this.count('move'); }
  pressed(b){ return !!this.keys[b]; }
  popAt(txt,col){ const s=this.evSprite; if(this.headless||!s) return; this.pops.push({x:s.x,y:s.y-s.h/2,txt,t:0,col}); }
  setScore(v){ this.score=Math.round(+v||0); this.scoreShown=true; }
  addScore(v){ v=Math.round(+v||0); this.score+=v; this.scoreShown=true; if(v) this.popAt((v>0?'+':'')+v,v>0?'#fff609':'#ff93c4'); }
  setLife(v){ this.life=Math.round(+v||0); this.checkLife(); }
  addLife(v){ v=Math.round(+v||0); if(this.life===null) this.life=3; this.life+=v;
    if(v<0&&!this.headless){ this.flashA=.45; this.flashC='#ff2121'; this.shakeA=Math.max(this.shakeA,3); this.hurtT=1; }
    if(v>0) this.popAt('+'+v+' vie','#ff93c4'); this.checkLife(); }
  getLife(){ return this.life===null?0:this.life; }
  checkLife(){ if(this.life!==null&&this.life<=0&&this.state==='run'){ this.life=0; if(this.h.lifeZero.length) this.h.lifeZero.forEach(f=>this.call(f)); else this.over(false); } }
  startCountdown(s){ this.countdown=Math.max(0,+s||0); this.count('countdown'); }
  over(win){ if(this.state!=='run') return; this.state=win?'won':'lost'; this.count(win?'win':'lose');
    if(!this.headless){ stopMusic(); playSound(win?'victoire':'explosion'); if(win) for(let i=0;i<4;i++) this.burst(this.cam.x+20+VR()*120,this.cam.y+20+VR()*60,'confettis',30); } }
  bgColor(c){ this.bg=c; this.scene=null; }
  setScene(n){ this.scene=n; this.count('scene'); }
  splashMsg(t){ this.splash=String(t); this.splashT=2.2; this.logSay.push(String(t)); this.count('splash'); }
  sound(n){ this.sounds.push(n); if(!this.headless) playSound(n); }
  playMusic(n){ this.music=n; this.count('music'); if(!this.headless) startMusic(n); }
  effect(s,type){ this.count('effect'); this.calls['fx_'+type]=(this.calls['fx_'+type]||0)+1; if(this.headless||!this.ok(s)) return;
    this.burst(s.x,s.y,type,type==='explosion'?28:type==='fumee'?10:type==='coeurs'?7:18); if(type==='explosion'){ this.shakeA=Math.max(this.shakeA,2); (this.booms=this.booms||[]).push({x:s.x,y:s.y,t:0,sz:Math.max(24,Math.max(s.w,s.h)*1.5)}); } }
  shake(force){ this.count('shake'); if(this.headless) return; this.shakeA=Math.max(this.shakeA,force==='fort'?6:3); if(force==='fort'){ this.flashA=.35; this.flashC='#ffffff'; } }
  camFollow(s){ this.count('camera'); this.camT=this.ok(s)?s:null; }
  worldSize(w,h){ this.W=Math.max(SCR_W,Math.round(+w||SCR_W)); this.H=Math.max(SCR_H,Math.round(+h||SCR_H)); this.count('world'); }
  randInt(a,b){ a=Math.round(+a||0); b=Math.round(+b||0); if(a>b){ const t=a; a=b; b=t; } return a+Math.floor(this.rnd()*(b-a+1)); }
  burst(x,y,type,n){ const C=FX_COLS[type]||FX_COLS.etincelles;
    for(let i=0;i<n;i++){ const a=VR()*Math.PI*2, sp=type==='explosion'?20+VR()*70:type==='fumee'?6+VR()*12:type==='confettis'?30+VR()*50:15+VR()*40;
      this.parts.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-(type==='fumee'||type==='coeurs'||type==='etincelles'?18:0),g:type==='confettis'?80:type==='explosion'?20:0,
        life:0,max:(type==='fumee'?.9:.45)+VR()*.5,col:C[Math.floor(VR()*C.length)],sz:type==='fumee'?2+VR()*2:type==='explosion'?1+Math.round(VR()*2):1,heart:type==='coeurs'}); }
    if(type==='explosion') this.parts.push({x,y,vx:0,vy:0,g:0,life:0,max:.3,col:'#ffffff',ring:true,sz:1}); }
  /* ---------- exécution ---------- */
  call(f,...args){
    if(this.err||this.state==='error') return;
    this.trap=20000;
    try{ f(...args); }catch(e){ this.err=(e&&e.message)||String(e); this.state='error'; }
  }
  load(code){
    try{ new Function('G',code)(this); }catch(e){ this.err=(e&&e.message)||String(e); this.state='error'; return; }
    this.h.start.forEach(f=>this.call(f));
  }
  step(){
    this.fxStep();
    if(this.state!=='run') { this.frame++; return; }
    this.t+=DT; this.frame++;
    for(const b of BTNS){
      const now=!!this.keys[b], was=!!this.prevKeys[b];
      if(now!==was) this.h.btn.forEach(h=>{ if(h.b===b&&((h.ev==='presse'&&now)||(h.ev==='relache'&&!now))) this.call(h.f); });
    }
    this.prevKeys={...this.keys};
    for(const m of this.moveCtl){ if(!m.s.alive) continue;
      if(m.vx){ m.s.vx=(this.keys.droite?m.vx:0)-(this.keys.gauche?m.vx:0); }
      if(m.vy){ m.s.vy=(this.keys.bas?m.vy:0)-(this.keys.haut?m.vy:0); } }
    const W=this.W, H=this.H;
    for(const s of this.sprites){ if(!s.alive) continue;
      if(s.follow){ if(!s.follow.alive) s.follow=null; else { const dx=s.follow.x-s.x, dy=s.follow.y-s.y, d=Math.hypot(dx,dy)||1; if(d>1){ s.vx=dx/d*s.followV; s.vy=dy/d*s.followV; } else { s.vx=0; s.vy=0; } } }
      s.vx+=s.ax*DT; s.vy+=s.ay*DT; s.x+=s.vx*DT; s.y+=s.vy*DT;
      if(s.vx<-1) s.face=-1; else if(s.vx>1) s.face=1;
      const hw=s.w/2, hh=s.h/2;
      if(s.bounce){ if(s.x<hw){ s.x=hw; s.vx=Math.abs(s.vx);} if(s.x>W-hw){ s.x=W-hw; s.vx=-Math.abs(s.vx);} if(s.y<hh){ s.y=hh; s.vy=Math.abs(s.vy);} if(s.y>H-hh){ s.y=H-hh; s.vy=-Math.abs(s.vy);} }
      else if(s.stay){ s.x=Math.min(Math.max(s.x,hw),W-hw); s.y=Math.min(Math.max(s.y,hh),H-hh); }
      if(s.autoDestroy&&(s.x<-hw-2||s.x>W+hw+2||s.y<-hh-2||s.y>H+hh+2)) s.alive=false;
      if(s.sayT>0){ s.sayT-=DT; if(s.sayT<=0) s.say=''; }
      if(s.hitT>0) s.hitT-=DT;
    }
    this.h.update.forEach(f=>this.call(f));
    for(const it of this.h.interval){ if(this.t>=it.next-1e-9){ it.next+=it.ms/1000; this.call(it.f); } }
    const now=new Set();
    for(const h of this.h.overlap){
      const A=this.sprites.filter(s=>s.alive&&s.kind===h.k1), B=this.sprites.filter(s=>s.alive&&s.kind===h.k2);
      for(const a of A) for(const b of B){ if(a===b||!a.alive||!b.alive) continue;
        if(this.overlaps(a,b)){ const key=h.k1+'|'+h.k2+'|'+a.id+'|'+b.id; now.add(key);
          if(!this.overlapsNow.has(key)){ this.count('overlap'); this.evSprite={x:b.x,y:b.y,h:b.h}; this.call(h.f,a,b); this.evSprite=null; } } }
    }
    this.overlapsNow=now;
    if(this.countdown!==null&&this.state==='run'){ this.countdown-=DT; if(this.countdown<=0){ this.countdown=null; if(this.h.countEnd.length) this.h.countEnd.forEach(f=>this.call(f)); else { this.endMsg='TEMPS ÉCOULÉ'; this.over(false); } } }
    if(this.splashT>0){ this.splashT-=DT; if(this.splashT<=0) this.splash=null; }
    if(this.frame%60===0) this.sprites=this.sprites.filter(s=>s.alive);
  }
  fxStep(){
    if(this.headless) return;
    for(const p of this.parts){ p.life+=DT; p.vy+=p.g*DT; p.vx*=.97; p.vy*=.97; p.x+=p.vx*DT; p.y+=p.vy*DT; }
    this.parts=this.parts.filter(p=>p.life<p.max);
    for(const p of this.pops) p.t+=DT; this.pops=this.pops.filter(p=>p.t<.9);
    this.shakeA*=.85; if(this.shakeA<.2) this.shakeA=0; this.flashA*=.85; if(this.flashA<.02) this.flashA=0; if(this.hurtT>0) this.hurtT-=DT;
    const T=this.camT; if(T&&T.alive){ const tx=Math.min(Math.max(T.x-SCR_W/2,0),this.W-SCR_W), ty=Math.min(Math.max(T.y-SCR_H/2,0),this.H-SCR_H); this.cam.x+=(tx-this.cam.x)*.18; this.cam.y+=(ty-this.cam.y)*.18; }
  }
  /* ---------- dessin ---------- */
  draw(g){
    const sx=this.shakeA?(VR()-.5)*this.shakeA*2:0, sy=this.shakeA?(VR()-.5)*this.shakeA*2:0;
    const cx=Math.round(this.cam.x-sx), cy=Math.round(this.cam.y-sy);
    if(this.scene&&BGIMG[this.scene]&&BGIMG[this.scene].ok) drawBg(g,this.scene,this.t,cx,cy); else if(this.scene&&SCENES[this.scene]) SCENES[this.scene](g,this.t,cx,cy,this); else { g.fillStyle=this.bg; g.fillRect(0,0,SCR_W,SCR_H); }
    g.save(); g.translate(-cx,-cy);
    for(const s of this.sprites){ if(!s.alive) continue;
      if(s.kind==='Joueur'&&this.hurtT>0&&Math.floor(this.hurtT*14)%2) continue;
      const moving=Math.abs(s.vx)+Math.abs(s.vy)>5&&!s.autoDestroy, bob=moving&&(s.kind==='Joueur'||s.kind==='Ennemi')?Math.round(Math.sin(this.t*18+s.id)):0;
      const im=imgCanvas(s.img), X=Math.round(s.x-s.w/2), Y=Math.round(s.y-s.h/2)+bob;
      if(s.kind==='Joueur'||s.kind==='Ennemi'){ g.fillStyle='rgba(0,0,0,.22)'; g.fillRect(X+2,Math.round(s.y+s.h/2)-1,Math.max(2,s.w-4),2); }
      if(hdReady(s.img)){ const d=HD[s.img], H2=HDIMG[s.img], fps=d.fps||8, still=d.anim==='marche'&&!moving;
        const fi=still?0:Math.floor(this.t*fps+s.id*1.7)%d.n, dw=d.w/2, dh=d.h/2, DX=Math.round(s.x-dw/2), DY=Math.round(s.y-dh/2)+bob;
        const src=s.hitT>0&&Math.floor(s.hitT*30)%2?H2.white:H2.im;
        if(IMGS[s.img].flip&&s.face<0){ g.save(); g.translate(DX+dw,DY); g.scale(-1,1); g.drawImage(src,fi*d.w,0,d.w,d.h,0,0,dw,dh); g.restore(); } else g.drawImage(src,fi*d.w,0,d.w,d.h,DX,DY,dw,dh);
      } else {
      if(IMGS[s.img].flip&&s.face<0){ g.save(); g.translate(X+s.w,Y); g.scale(-1,1); g.drawImage(im,0,0); g.restore(); } else g.drawImage(im,X,Y);
      if(s.hitT>0){ g.fillStyle='rgba(255,255,255,.55)'; g.fillRect(X,Y,s.w,s.h); } }
      if(s.pvMax>0&&s.pv>0){ const bw=Math.max(16,s.w); g.fillStyle='#000'; g.fillRect(Math.round(s.x-bw/2)-1,Y-6,bw+2,4); g.fillStyle='#5a1a1a'; g.fillRect(Math.round(s.x-bw/2),Y-5,bw,2); g.fillStyle=s.pv/s.pvMax>.35?'#78dc52':'#ff2121'; g.fillRect(Math.round(s.x-bw/2),Y-5,Math.round(bw*Math.max(0,s.pv)/s.pvMax),2); }
    }
    if(this.booms&&this.booms.length&&hdReady('explosion')){ const d=HD.explosion; this.booms=this.booms.filter(b=>{ b.t+=1/30; const fi=Math.floor(b.t*(d.fps||14)); if(fi>=d.n) return false;
      g.drawImage(HDIMG.explosion.im,fi*d.w,0,d.w,d.h,Math.round(b.x-b.sz/2),Math.round(b.y-b.sz/2),b.sz,b.sz); return true; }); }
    for(const p of this.parts){ const a=1-p.life/p.max; g.globalAlpha=Math.max(0,a);
      if(p.ring){ g.strokeStyle=p.col; g.lineWidth=1; g.beginPath(); g.arc(p.x,p.y,2+p.life*60,0,7); g.stroke(); }
      else if(p.heart){ g.fillStyle=p.col; const x=Math.round(p.x), y=Math.round(p.y); g.fillRect(x-1,y,1,1); g.fillRect(x+1,y,1,1); g.fillRect(x-1,y+1,3,1); g.fillRect(x,y+2,1,1); }
      else { const z=p.sz*(p.g===0&&p.sz>1?1+p.life:1); g.fillStyle=p.col; g.fillRect(Math.round(p.x-z/2),Math.round(p.y-z/2),Math.ceil(z),Math.ceil(z)); } }
    g.globalAlpha=1;
    g.font='bold 7px Lexend, sans-serif'; g.textBaseline='top';
    for(const p of this.pops){ g.globalAlpha=Math.max(0,1-p.t/.9); g.textAlign='center'; g.fillStyle='#000'; g.fillText(p.txt,p.x+1,p.y-p.t*22+1); g.fillStyle=p.col; g.fillText(p.txt,p.x,p.y-p.t*22); } g.globalAlpha=1; g.textAlign='left';
    for(const s of this.sprites){ if(!s.alive||!s.say) continue;
      const tw=Math.ceil(g.measureText(s.say).width)+6, x=Math.round(Math.min(Math.max(s.x-tw/2,cx+1),cx+SCR_W-tw-1)), y=Math.round(Math.max(s.y-s.h/2-13,cy+1));
      g.fillStyle='#fff'; g.fillRect(x,y,tw,11); g.strokeStyle='#000'; g.strokeRect(x+.5,y+.5,tw-1,10); g.fillStyle='#000'; g.fillText(s.say,x+3,y+2); }
    g.restore();
    if(this.flashA){ g.globalAlpha=this.flashA; g.fillStyle=this.flashC; g.fillRect(0,0,SCR_W,SCR_H); g.globalAlpha=1; }
    /* interface */
    g.font='bold 7px Lexend, sans-serif'; g.textBaseline='top'; g.textAlign='left';
    if(this.scoreShown){ const t='SCORE '+this.score; const w=Math.ceil(g.measureText(t).width)+8; g.fillStyle='#000000aa'; g.fillRect(SCR_W-w-2,2,w,11); g.fillStyle='#fff609'; g.fillText(t,SCR_W-w+2,4); }
    if(this.life!==null){ const hd=hdReady('coeur'), c=hd?HDIMG.coeur.im:imgCanvas('coeur'), cw=hd?HD.coeur.w:c.width; for(let i=0;i<Math.min(this.life,8);i++) g.drawImage(c,0,0,cw,hd?HD.coeur.h:c.height,2+i*9,2,9,9); }
    if(this.countdown!==null){ const t=String(Math.ceil(this.countdown)), urg=this.countdown<5; g.fillStyle=urg?'#ff2121cc':'#000a'; g.fillRect(SCR_W/2-11,2,22,11); g.fillStyle='#fff'; g.textAlign='center'; g.fillText(t,SCR_W/2,4); g.textAlign='left'; }
    if(this.splash){ const k=Math.min(1,(2.2-this.splashT)*5); g.fillStyle='#000000cc'; g.fillRect(8,SCR_H/2-14,(SCR_W-16)*k,28); if(k>=1){ g.strokeStyle='#fff609'; g.strokeRect(8.5,SCR_H/2-13.5,SCR_W-17,27); g.fillStyle='#fff'; g.textAlign='center'; g.font='bold 8px Lexend, sans-serif'; g.fillText(this.splash.slice(0,30),SCR_W/2,SCR_H/2-4); g.font='bold 7px Lexend, sans-serif'; g.textAlign='left'; } }
    if(this.state!=='run'){
      const won=this.state==='won', err=this.state==='error';
      g.fillStyle='#000000aa'; g.fillRect(0,0,SCR_W,SCR_H);
      g.fillStyle=err?'#5c406c':won?'#1a7a3a':'#a01a1a'; g.fillRect(0,SCR_H/2-30,SCR_W,58);
      g.fillStyle=won?'#fff609':'#fff'; g.textAlign='center'; g.font='bold 14px Lexend, sans-serif';
      g.fillText(err?'ERREUR':won?'GAGNÉ !':(this.endMsg||'PERDU'),SCR_W/2,SCR_H/2-25);
      g.font='bold 8px Lexend, sans-serif'; g.fillStyle='#fff';
      if(err) g.fillText(String(this.err).slice(0,36),SCR_W/2,SCR_H/2-4);
      else { g.fillText('Score : '+this.score+(this.best?'   ·   Record : '+Math.max(this.best,this.score):''),SCR_W/2,SCR_H/2-5); g.fillStyle='#fff609'; g.font='7px Lexend, sans-serif'; g.fillText('Appuie sur A pour rejouer',SCR_W/2,SCR_H/2+12); }
      g.textAlign='left'; g.font='bold 7px Lexend, sans-serif';
    }
  }
}
/* ---------- décors animés ---------- */
const STARS=[...Array(90)].map((_,i)=>({x:(i*97.3)%160,y:(i*53.7)%120,l:i%3}));
function px(g,c,x,y,w,h){ g.fillStyle=c; g.fillRect(Math.round(x),Math.round(y),w,h); }
function hills(g,c,base,amp,per,off){ g.fillStyle=c; for(let x=0;x<160;x++){ const h=base+Math.sin((x+off)/per)*amp+Math.sin((x+off)/(per*.37))*amp*.4; g.fillRect(x,Math.round(h),1,120); } }
function grad(g,a,b){ const G=g.createLinearGradient(0,0,0,120); G.addColorStop(0,a); G.addColorStop(1,b); g.fillStyle=G; g.fillRect(0,0,160,120); }
const wrap=(v,m)=>((v%m)+m)%m;
const SCENES={
 espace:(g,t,cx,cy)=>{ grad(g,'#05051a','#1a0b3a'); g.fillStyle='#2a1060'; g.globalAlpha=.6; g.beginPath(); g.arc(120-cx*.05,40,26,0,7); g.fill(); g.fillStyle='#3b1880'; g.beginPath(); g.arc(114-cx*.05,34,10,0,7); g.fill(); g.globalAlpha=1;
   for(const s of STARS){ const sp=[8,18,40][s.l], y=wrap(s.y+t*sp-cy*(.2+s.l*.2),120), x=wrap(s.x-cx*(.2+s.l*.2),160); px(g,s.l===2?'#ffffff':s.l?'#87f2ff':'#5c6c9c',x,y,1,s.l===2?2:1); } },
 foret:(g,t,cx,cy)=>{ grad(g,'#6cc6ff','#c9f1ff'); px(g,'#fff6a0',128-cx*.02,10,10,10);
   for(let i=0;i<4;i++){ const x=wrap(i*55-t*4-cx*.1,220)-30; px(g,'#ffffff',x,14+(i*7)%20,22,5); px(g,'#ffffff',x+5,10+(i*7)%20,12,5); }
   hills(g,'#5fae6e',70,6,22,cx*.25); hills(g,'#3f8a4f',84,5,15,cx*.5);
   for(let i=0;i<9;i++){ const x=wrap(i*23-cx*.8,207)-20; px(g,'#6b3f22',x+5,88,3,14); g.fillStyle='#2e6b35'; g.beginPath(); g.moveTo(x,92); g.lineTo(x+6.5,70); g.lineTo(x+13,92); g.fill(); }
   px(g,'#4caf50',0,100,160,20); for(let x=0;x<160;x+=4) px(g,'#3c8f40',wrap(x-cx,160),100,2,2); },
 nuit:(g,t,cx,cy)=>{ grad(g,'#140a2a','#3b1f5c'); g.fillStyle='#fdf5c9'; g.beginPath(); g.arc(30-cx*.03,22,10,0,7); g.fill(); g.fillStyle='#1d0f36'; g.beginPath(); g.arc(35-cx*.03,19,9,0,7); g.fill();
   for(const s of STARS.slice(0,30)) px(g,Math.sin(t*3+s.x)>0?'#ffffff':'#8b7bb0',wrap(s.x-cx*.1,160),s.y*.5,1,1);
   hills(g,'#24123d',78,8,25,cx*.3); const hx=wrap(100-cx*.4,200)-20; px(g,'#1a0d2c',hx,52,30,40); px(g,'#1a0d2c',hx+6,40,6,14); px(g,'#1a0d2c',hx+22,44,6,10);
   for(let i=0;i<3;i++) px(g,Math.sin(t*2+i)>-.3?'#fff609':'#3a2a10',hx+4+i*8,60,3,4);
   g.globalAlpha=.25; for(let i=0;i<5;i++) px(g,'#c8b8e8',wrap(i*40+t*6,200)-20,92+Math.sin(t+i)*3,40,6); g.globalAlpha=1; px(g,'#120a20',0,104,160,16); },
 ocean:(g,t,cx,cy)=>{ grad(g,'#1aa3c8','#062a5a'); g.globalAlpha=.12; for(let i=0;i<6;i++) px(g,'#ffffff',wrap(i*31+t*10,180)-10,0,6,120); g.globalAlpha=1;
   for(let i=0;i<14;i++){ const y=120-wrap(t*(12+i%4*5)+i*37,130); px(g,'#bff3ff',wrap(i*41+Math.sin(t*2+i)*3,160),y,i%3?1:2,i%3?1:2); }
   for(let i=0;i<8;i++){ const x=wrap(i*21-cx*.6,170)-5; for(let k=0;k<14;k++) px(g,'#2f9e57',x+Math.round(Math.sin(t*2+k*.5+i)*2),112-k*2.4,2,3); }
   px(g,'#d9c27a',0,112,160,8); },
 ciel:(g,t,cx,cy)=>{ grad(g,'#ff9a76','#ffe29a'); px(g,'#fff4c2',70-cx*.02,70,22,22);
   for(let i=0;i<7;i++){ const x=wrap(i*37-t*(6+i%3*4)-cx*.2,220)-30, y=10+(i*17)%60; px(g,'#ffffffcc',x,y,26,6); px(g,'#ffffffcc',x+6,y-4,14,5); }
   hills(g,'#e07a5f',92,6,30,cx*.3); hills(g,'#9b4a5c',104,4,18,cx*.6); },
 neon:(g,t,cx,cy)=>{ grad(g,'#0b0420','#2c0a40'); g.fillStyle='#ff2e88'; g.globalAlpha=.35; g.beginPath(); g.arc(80,58,22,0,7); g.fill(); g.globalAlpha=1;
   for(let i=0;i<12;i++){ const w=10+(i*7)%9, h=20+(i*13)%40, x=wrap(i*15-cx*.4,180)-10; px(g,'#120826',x,100-h,w,h+20);
     for(let k=0;k<h/6;k++) for(let j=0;j<w/4;j++) if(((i+k+j+Math.floor(t*1.5))%5)===0) px(g,['#00f0ff','#ff2e88','#fff609'][(i+j)%3],x+1+j*4,100-h+2+k*6,2,2); }
   g.strokeStyle='#00f0ff'; g.globalAlpha=.6; for(let k=0;k<6;k++){ const y=100+k*k*.8+wrap(t*20,8)*(k/6); g.beginPath(); g.moveTo(0,y); g.lineTo(160,y); g.stroke(); } g.globalAlpha=1; },
 grotte:(g,t,cx,cy)=>{ grad(g,'#1b1410','#3a2a20'); for(let i=0;i<12;i++){ const x=wrap(i*15-cx*.5,170)-5; g.fillStyle='#4a3626'; g.beginPath(); g.moveTo(x,0); g.lineTo(x+5,8+(i*7)%14); g.lineTo(x+10,0); g.fill(); }
   for(let i=0;i<7;i++){ const x=wrap(i*27-cx*.5,180)-10, c=['#87f2ff','#ff93c4','#a0ffb0'][i%3]; g.globalAlpha=.25+.2*Math.sin(t*3+i); g.fillStyle=c; g.beginPath(); g.arc(x+1,41+(i*13)%40,5,0,7); g.fill(); g.globalAlpha=1; px(g,c,x,40+(i*13)%40,2,2); }
   hills(g,'#2a1e16',104,4,12,cx*.8); }
};
/* fonds peints : image répétée en miroir (raccord invisible) + parallaxe + petites animations */
function drawBg(g,k,t,cx,cy){ const d=BGS[k], im=BGIMG[k].im, W=d.w/2, H=d.h/2, ox=wrap(cx*d.par,2*W);
  for(let x=-ox, i=0; x<SCR_W; x+=W, i++){ if(i%2){ g.save(); g.translate(Math.round(x)+W,0); g.scale(-1,1); g.drawImage(im,0,0,d.w,d.h,0,0,W,H); g.restore(); } else g.drawImage(im,0,0,d.w,d.h,Math.round(x),0,W,H); }
  (BG_FX[k]||(()=>{}))(g,t,cx,cy); }
const BG_FX={
 espace:(g,t,cx,cy)=>{ for(const s of STARS.slice(0,40)){ const y=wrap(s.y+t*(10+s.l*14)-cy*.3,120), x=wrap(s.x-cx*(.3+s.l*.2),160); g.globalAlpha=.5+.5*Math.sin(t*4+s.x); px(g,s.l?'#ffffff':'#9fd8ff',x,y,1,s.l===2?2:1); } g.globalAlpha=1; },
 foret:(g,t,cx,cy)=>{ for(let i=0;i<7;i++){ const x=wrap(i*29+t*(8+i%3*3)-cx*.4,180)-10, y=wrap(i*17+t*(5+i%2*4),130)-5; px(g,i%2?'#ffe066':'#9be36b',x+Math.sin(t*2+i)*3,y,1,1); } },
 nuit:(g,t,cx,cy)=>{ g.globalAlpha=.18; for(let i=0;i<6;i++) px(g,'#d8c8f0',wrap(i*37+t*(5+i%3*2)-cx*.3,220)-40,78+i*5+Math.sin(t+i)*2,44,4); g.globalAlpha=1;
   for(let i=0;i<8;i++) if(Math.sin(t*3+i*1.7)>.6) px(g,'#ffffff',wrap(i*23.3-cx*.1,160),(i*11)%40,1,1); },
 ocean:(g,t,cx,cy)=>{ for(let i=0;i<16;i++){ const y=120-wrap(t*(10+i%4*5)+i*37,130); px(g,'#d8f6ff',wrap(i*41+Math.sin(t*2+i)*3-cx*.3,160),y,i%3?1:2,i%3?1:2); }
   g.globalAlpha=.07+.04*Math.sin(t*1.3); px(g,'#ffffff',0,0,160,120); g.globalAlpha=1; },
 ciel:(g,t,cx,cy)=>{ for(let i=0;i<4;i++){ const x=wrap(i*53-t*(5+i*2)-cx*.25,220)-30, y=18+(i*19)%50; g.globalAlpha=.7; px(g,'#fff4e6',x,y,24,5); px(g,'#fff4e6',x+6,y-3,12,4); g.globalAlpha=1; } },
 neon:(g,t,cx,cy)=>{ g.globalAlpha=.35; for(let i=0;i<26;i++){ const x=wrap(i*13.7-cx*.5+t*8,170)-5, y=wrap(i*29+t*140,130)-10; px(g,'#9fe8ff',x,y,1,4); } g.globalAlpha=1; },
 grotte:(g,t,cx,cy)=>{ g.globalAlpha=.3; px(g,'#000000',0,0,160,120); g.globalAlpha=1;
   for(let i=0;i<9;i++){ const x=wrap(i*19+Math.sin(t+i)*6-cx*.4,170)-5, y=120-wrap(t*(4+i%3*2)+i*23,130), c=['#87f2ff','#c792ff','#ff93c4'][i%3]; g.globalAlpha=.5+.5*Math.sin(t*3+i); px(g,c,x,y,1,1); } g.globalAlpha=1; }
};
const SCENE_NAMES=[['forêt','foret'],['espace étoilé','espace'],['nuit hantée','nuit'],['océan','ocean'],['coucher de soleil','ciel'],['ville néon','neon'],['grotte','grotte']];
/* ---------- sons et musique ---------- */
let AC=null, MUS=null;
function ac(){ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); return AC; }
function playSound(n){
  try{ const A=ac(), seq=SONS[n]; if(!seq) return; let t=A.currentTime;
    for(const [f,d] of seq){ const o=A.createOscillator(), v=A.createGain(); o.type=n==='explosion'?'sawtooth':'square'; o.frequency.value=f; if(n==='explosion') o.frequency.exponentialRampToValueAtTime(40,t+d); v.gain.setValueAtTime(.07,t); v.gain.exponentialRampToValueAtTime(.001,t+d); o.connect(v); v.connect(A.destination); o.start(t); o.stop(t+d); t+=d; } }catch(e){}
}
const MUSIQUES={
 aventure:{bpm:132,lead:[72,0,76,0,79,0,76,0,74,0,77,0,81,0,77,0,72,0,76,0,79,0,84,0,83,0,79,0,74,0,0,0],bass:[48,48,55,55,53,53,50,50]},
 action:{bpm:156,lead:[69,72,76,72,69,72,76,79,74,77,81,77,74,77,81,84,72,76,79,76,72,76,79,83,71,74,77,74,71,0,71,0],bass:[45,45,50,50,48,48,47,47]},
 mystere:{bpm:96,lead:[69,0,0,72,0,0,71,0,68,0,0,0,69,0,0,76,0,0,74,0,72,0,71,0,69,0,0,0,0,0,0,0],bass:[45,45,41,41,43,43,40,40]}
};
function midi(n){ return 440*Math.pow(2,(n-69)/12); }
function startMusic(name){ stopMusic(); const M=MUSIQUES[name]; if(!M) return; try{ const A=ac(), st=A.currentTime+.05, step=60/M.bpm/2; let k=0;
  const master=A.createGain(); master.gain.value=.05; master.connect(A.destination);
  const tick=()=>{ while(st+k*step<A.currentTime+.3){ const t=st+k*step, n=M.lead[k%M.lead.length];
      if(n){ const o=A.createOscillator(), v=A.createGain(); o.type='square'; o.frequency.value=midi(n); v.gain.setValueAtTime(.5,t); v.gain.exponentialRampToValueAtTime(.01,t+step*.9); o.connect(v); v.connect(master); o.start(t); o.stop(t+step); }
      if(k%4===0){ const b=M.bass[(k/4)%M.bass.length], o=A.createOscillator(), v=A.createGain(); o.type='triangle'; o.frequency.value=midi(b); v.gain.setValueAtTime(1,t); v.gain.exponentialRampToValueAtTime(.01,t+step*3.8); o.connect(v); v.connect(master); o.start(t); o.stop(t+step*4); }
      k++; } };
  tick(); MUS={id:setInterval(tick,100),master}; }catch(e){} }
function stopMusic(){ if(MUS){ clearInterval(MUS.id); try{ MUS.master.gain.setValueAtTime(0,AC.currentTime); MUS.master.disconnect(); }catch(e){} MUS=null; } }

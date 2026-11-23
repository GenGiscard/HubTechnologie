/* ===== Moteur de jeu (160 x 120, logique à 30 images/s) ===== */
const SCR_W=160, SCR_H=120, FPS=30, DT=1/FPS;
const KINDS=['Joueur','Ennemi','Nourriture','Projectile','Obstacle','Bonus'];
const BTNS=['A','B','haut','bas','gauche','droite'];
const SONS={piece:[[988,.06],[1319,.12]],saut:[[440,.05],[660,.05],[880,.08]],explosion:[[110,.25]],victoire:[[523,.1],[659,.1],[784,.1],[1047,.25]],degat:[[220,.08],[160,.15]]};

function mulberry(seed){ let a=seed>>>0; return ()=>{ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

class Runtime {
  constructor(opts){
    opts=opts||{};
    this.headless=!!opts.headless; this.rnd=mulberry(opts.seed||Date.now());
    this.sprites=[]; this.nextId=1; this.frame=0; this.t=0;
    this.h={start:[],update:[],interval:[],overlap:[],btn:[],lifeZero:[],countEnd:[]};
    this.score=0; this.life=null; this.countdown=null; this.scoreShown=false;
    this.bg='#003fad'; this.state='run'; this.endMsg=''; this.splash=null; this.splashT=0;
    this.keys={}; this.prevKeys={}; this.moveCtl=[]; this.sounds=[]; this.err=null;
    this.trap=0; this.overlapsNow=new Set(); this.logSay=[]; this.calls={};
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
    const s={id:this.nextId++,img,kind,x:SCR_W/2,y:SCR_H/2,vx:0,vy:0,ax:0,ay:0,w:c.width,h:c.height,alive:true,
      stay:false,bounce:false,autoDestroy:false,say:'',sayT:0,follow:null,followV:0,born:this.t};
    this.sprites.push(s); this.count('create'); return s;
  }
  projectile(img,from,vx,vy){
    const s=this.create(img,'Projectile');
    if(from&&from.alive!==undefined){ s.x=from.x; s.y=from.y; }
    s.vx=+vx||0; s.vy=+vy||0; s.autoDestroy=true; this.count('projectile'); return s;
  }
  ok(s){ return s&&typeof s==='object'&&s.id; }
  setPos(s,x,y){ if(!this.ok(s)) return; s.x=+x||0; s.y=+y||0; }
  setProp(s,p,v){ if(!this.ok(s)) return; s[p]=+v||0; }
  changeProp(s,p,v){ if(!this.ok(s)) return; s[p]=(+s[p]||0)+(+v||0); }
  getProp(s,p){ if(!this.ok(s)) return 0; return p==='gauche'?s.x-s.w/2:p==='droite'?s.x+s.w/2:p==='haut'?s.y-s.h/2:p==='bas'?s.y+s.h/2:(+s[p]||0); }
  randomPos(s){ if(!this.ok(s)) return; s.x=Math.round(8+this.rnd()*(SCR_W-16)); s.y=Math.round(8+this.rnd()*(SCR_H-16)); }
  flag(s,f,on){ if(!this.ok(s)) return; s[f]=!!on; }
  say(s,txt){ if(!this.ok(s)) return; s.say=String(txt); s.sayT=2; this.logSay.push(String(txt)); this.count('say'); }
  destroy(s){ if(!this.ok(s)) return; s.alive=false; this.count('destroy'); }
  follow(s,target,v){ if(!this.ok(s)) return; s.follow=this.ok(target)?target:null; s.followV=+v||50; }
  setImg(s,img){ if(!this.ok(s)||!IMGS[img]) return; const c=imgCanvas(img); s.img=img; s.w=c.width; s.h=c.height; }
  kindCount(k){ return this.sprites.filter(s=>s.alive&&s.kind===k).length; }
  overlaps(a,b){ return this.ok(a)&&this.ok(b)&&a.alive&&b.alive&&a!==b&&Math.abs(a.x-b.x)<(a.w+b.w)/2-1&&Math.abs(a.y-b.y)<(a.h+b.h)/2-1; }
  move(s,vx,vy){ if(!this.ok(s)) return; this.moveCtl=this.moveCtl.filter(m=>m.s!==s); this.moveCtl.push({s,vx:+vx||0,vy:+vy||0}); this.count('move'); }
  pressed(b){ return !!this.keys[b]; }
  setScore(v){ this.score=Math.round(+v||0); this.scoreShown=true; }
  addScore(v){ this.score+=Math.round(+v||0); this.scoreShown=true; }
  setLife(v){ this.life=Math.round(+v||0); this.checkLife(); }
  addLife(v){ if(this.life===null) this.life=3; this.life+=Math.round(+v||0); this.checkLife(); }
  getLife(){ return this.life===null?0:this.life; }
  checkLife(){ if(this.life!==null&&this.life<=0&&this.state==='run'){ this.life=0; if(this.h.lifeZero.length) this.h.lifeZero.forEach(f=>this.call(f)); else this.over(false); } }
  startCountdown(s){ this.countdown=Math.max(0,+s||0); this.count('countdown'); }
  over(win){ if(this.state!=='run') return; this.state=win?'won':'lost'; this.count(win?'win':'lose'); if(!this.headless) playSound(win?'victoire':'explosion'); }
  bgColor(c){ this.bg=c; }
  splashMsg(t){ this.splash=String(t); this.splashT=2; this.logSay.push(String(t)); this.count('splash'); }
  sound(n){ this.sounds.push(n); if(!this.headless) playSound(n); }
  randInt(a,b){ a=Math.round(+a||0); b=Math.round(+b||0); if(a>b){ const t=a; a=b; b=t; } return a+Math.floor(this.rnd()*(b-a+1)); }
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
    for(const s of this.sprites){ if(!s.alive) continue;
      if(s.follow){ if(!s.follow.alive) s.follow=null; else { const dx=s.follow.x-s.x, dy=s.follow.y-s.y, d=Math.hypot(dx,dy)||1; if(d>1){ s.vx=dx/d*s.followV; s.vy=dy/d*s.followV; } else { s.vx=0; s.vy=0; } } }
      s.vx+=s.ax*DT; s.vy+=s.ay*DT; s.x+=s.vx*DT; s.y+=s.vy*DT;
      const hw=s.w/2, hh=s.h/2;
      if(s.bounce){ if(s.x<hw){ s.x=hw; s.vx=Math.abs(s.vx);} if(s.x>SCR_W-hw){ s.x=SCR_W-hw; s.vx=-Math.abs(s.vx);} if(s.y<hh){ s.y=hh; s.vy=Math.abs(s.vy);} if(s.y>SCR_H-hh){ s.y=SCR_H-hh; s.vy=-Math.abs(s.vy);} }
      else if(s.stay){ s.x=Math.min(Math.max(s.x,hw),SCR_W-hw); s.y=Math.min(Math.max(s.y,hh),SCR_H-hh); }
      if(s.autoDestroy&&(s.x<-hw-2||s.x>SCR_W+hw+2||s.y<-hh-2||s.y>SCR_H+hh+2)) s.alive=false;
      if(s.sayT>0){ s.sayT-=DT; if(s.sayT<=0) s.say=''; }
    }
    this.h.update.forEach(f=>this.call(f));
    for(const it of this.h.interval){ if(this.t>=it.next-1e-9){ it.next+=it.ms/1000; this.call(it.f); } }
    const now=new Set();
    for(const h of this.h.overlap){
      const A=this.sprites.filter(s=>s.alive&&s.kind===h.k1), B=this.sprites.filter(s=>s.alive&&s.kind===h.k2);
      for(const a of A) for(const b of B){ if(a===b||!a.alive||!b.alive) continue;
        if(this.overlaps(a,b)){ const key=h.k1+'|'+h.k2+'|'+a.id+'|'+b.id; now.add(key);
          if(!this.overlapsNow.has(key)){ this.count('overlap'); this.call(h.f,a,b); } } }
    }
    this.overlapsNow=now;
    if(this.countdown!==null&&this.state==='run'){ this.countdown-=DT; if(this.countdown<=0){ this.countdown=null; if(this.h.countEnd.length) this.h.countEnd.forEach(f=>this.call(f)); else { this.endMsg='Temps écoulé'; this.over(false); } } }
    if(this.splashT>0){ this.splashT-=DT; if(this.splashT<=0) this.splash=null; }
    if(this.frame%60===0) this.sprites=this.sprites.filter(s=>s.alive);
  }
  /* ---------- dessin ---------- */
  draw(g){
    g.fillStyle=this.bg; g.fillRect(0,0,SCR_W,SCR_H);
    for(const s of this.sprites){ if(!s.alive) continue; g.drawImage(imgCanvas(s.img),Math.round(s.x-s.w/2),Math.round(s.y-s.h/2)); }
    g.font='bold 7px Lexend, sans-serif'; g.textBaseline='top';
    for(const s of this.sprites){ if(!s.alive||!s.say) continue;
      const tw=Math.ceil(g.measureText(s.say).width)+6, x=Math.round(Math.min(Math.max(s.x-tw/2,1),SCR_W-tw-1)), y=Math.round(Math.max(s.y-s.h/2-13,1));
      g.fillStyle='#fff'; g.fillRect(x,y,tw,11); g.strokeStyle='#000'; g.strokeRect(x+.5,y+.5,tw-1,10); g.fillStyle='#000'; g.fillText(s.say,x+3,y+2); }
    if(this.scoreShown){ const t='SCORE '+this.score; const w=Math.ceil(g.measureText(t).width)+6; g.fillStyle='#4b7bec'; g.fillRect(SCR_W-w-2,2,w,11); g.fillStyle='#fff'; g.fillText(t,SCR_W-w+1,4); }
    if(this.life!==null){ const c=imgCanvas('coeur'); for(let i=0;i<Math.min(this.life,8);i++) g.drawImage(c,2+i*9,2,9,9); }
    if(this.countdown!==null){ const t=String(Math.ceil(this.countdown)); g.fillStyle='#000a'; g.fillRect(SCR_W/2-10,2,20,11); g.fillStyle='#fff'; g.textAlign='center'; g.fillText(t,SCR_W/2,4); g.textAlign='left'; }
    if(this.splash){ g.fillStyle='#000c'; g.fillRect(8,SCR_H/2-12,SCR_W-16,24); g.fillStyle='#fff'; g.textAlign='center'; g.fillText(this.splash.slice(0,30),SCR_W/2,SCR_H/2-4); g.textAlign='left'; }
    if(this.state!=='run'){
      const won=this.state==='won', err=this.state==='error';
      g.fillStyle=err?'#5c406ccc':won?'#1a7a3acc':'#a01a1acc'; g.fillRect(0,SCR_H/2-22,SCR_W,44);
      g.fillStyle='#fff'; g.textAlign='center'; g.font='bold 10px Lexend, sans-serif';
      g.fillText(err?'ERREUR DANS LE PROGRAMME':won?'GAGNÉ !':(this.endMsg||'PERDU'),SCR_W/2,SCR_H/2-14);
      g.font='7px Lexend, sans-serif'; g.fillText(err?String(this.err).slice(0,34):'Score : '+this.score,SCR_W/2,SCR_H/2+2); g.textAlign='left';
    }
  }
}
let AC=null;
function playSound(n){
  try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); const seq=SONS[n]; if(!seq) return; let t=AC.currentTime;
    for(const [f,d] of seq){ const o=AC.createOscillator(), v=AC.createGain(); o.type='square'; o.frequency.value=f; v.gain.setValueAtTime(.06,t); v.gain.exponentialRampToValueAtTime(.001,t+d); o.connect(v); v.connect(AC.destination); o.start(t); o.stop(t+d); t+=d; } }catch(e){}
}

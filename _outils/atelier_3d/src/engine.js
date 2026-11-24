/* ===== Atelier 3D : rigger et animer un personnage ===== */
const BONES=[
 {n:'bassin',p:null,l:'Bassin',end:null},{n:'torse',p:'bassin',l:'Torse'},{n:'tete',p:'torse',l:'Tête',tip:[0,2.25,0]},
 {n:'epaule_g',p:'torse',l:'Épaule gauche'},{n:'coude_g',p:'epaule_g',l:'Coude gauche'},{n:'main_g',p:'coude_g',l:'Main gauche',tip:[1.12,1.55,0]},
 {n:'epaule_d',p:'torse',l:'Épaule droite'},{n:'coude_d',p:'epaule_d',l:'Coude droit'},{n:'main_d',p:'coude_d',l:'Main droite',tip:[-1.12,1.55,0]},
 {n:'cuisse_g',p:'bassin',l:'Hanche gauche'},{n:'genou_g',p:'cuisse_g',l:'Genou gauche'},{n:'pied_g',p:'genou_g',l:'Cheville gauche',tip:[.17,.06,.28]},
 {n:'cuisse_d',p:'bassin',l:'Hanche droite'},{n:'genou_d',p:'cuisse_d',l:'Genou droit'},{n:'pied_d',p:'genou_d',l:'Cheville droite',tip:[-.17,.06,.28]}];
const REST={bassin:[0,1.0,0],torse:[0,1.32,0],tete:[0,1.64,0],epaule_g:[.3,1.55,0],coude_g:[.64,1.55,0],main_g:[.96,1.55,0],epaule_d:[-.3,1.55,0],coude_d:[-.64,1.55,0],main_d:[-.96,1.55,0],
 cuisse_g:[.17,.95,0],genou_g:[.17,.53,0],pied_g:[.17,.12,0],cuisse_d:[-.17,.95,0],genou_d:[-.17,.53,0],pied_d:[-.17,.12,0]};
const BI=Object.fromEntries(BONES.map((b,i)=>[b.n,i]));
const LAB=Object.fromEntries(BONES.map(b=>[b.n,b.l]));
const CHAN=['x','y','z','py','pz'];
const $=s=>document.querySelector(s);
const rad=d=>d*Math.PI/180;

/* ---------- état ---------- */
const LSK='anim3d_'+CFG.id;
function freshState(){
  const S={joints:{},parents:{},bound:false,rot:zeroRot(),anim:{dur:(CFG.missions[0].dur||2),interp:CFG.interp||'lisse',keys:{}},t:0,sel:'',done:{},stp:{},cur:0,id:null,seen:{},slots:{},slot:slotOf(0)};
  BONES.forEach(b=>{ S.parents[b.n]=b.p; });
  if(CFG.rigged){ BONES.forEach(b=>S.joints[b.n]=REST[b.n].slice()); S.bound=true; }
  if(CFG.parentsMissing) CFG.parentsMissing.forEach(n=>S.parents[n]='');
  return S;
}
function zeroRot(){ const r={}; BONES.forEach(b=>r[b.n]={x:0,y:0,z:0,py:0,pz:0}); return r; }
function slotOf(i){ const m=CFG.missions[i]; return m.slot===undefined?'main':String(m.slot); }
function switchSlot(i){ const sl=slotOf(i), m=CFG.missions[i]; if(sl===S.slot) return; S.slots[S.slot]={anim:S.anim,rot:S.rot};
  const o=S.slots[sl]; if(o){ S.anim=o.anim; S.rot=o.rot; } else { S.anim={dur:m.dur||2,interp:CFG.interp||'lisse',keys:{}}; S.rot=zeroRot(); } S.slot=sl; S.t=0; poseAt(0); syncSel(); }
function syncSel(){ const d=document.querySelector('#dur'); if(d){ d.value=String(S.anim.dur); document.querySelector('#interp').value=S.anim.interp; } }
let S=freshState();
try{ const o=JSON.parse(localStorage.getItem(LSK)); if(o&&o.anim) S=Object.assign(freshState(),o); }catch(e){}
function save(){ try{ localStorage.setItem(LSK,JSON.stringify(S)); }catch(e){} }

/* ---------- scène ---------- */
let CANDS=[],R,SC,CAM,ORB,TC,MESH=null,SKEL=null,BONEOBJ={},STATIC=null,MARK={},GHOST=[],LINES=null,PLAY=false,LAST=0,DRAG=null,HELP=false;
const ROOT=new THREE.Group();
function partGeoms(){
  const P=[]; CANDS=[]; let cur=['torse']; const C=(g,col,m)=>{ if(m) g.applyMatrix4(m); const n=g.attributes.position.count, c=new THREE.Color(col), a=new Float32Array(n*3); for(let i=0;i<n;i++){ a[i*3]=c.r; a[i*3+1]=c.g; a[i*3+2]=c.b; } g.setAttribute('color',new THREE.BufferAttribute(a,3)); if(g.index) g=g.toNonIndexed(); P.push(g); for(let i=0;i<g.attributes.position.count;i++) CANDS.push(cur); };
  const B=(...l)=>cur=l;
  const M=(x,y,z,rx,ry,rz,sx,sy,sz)=>{ const m=new THREE.Matrix4(); m.compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(rx||0,ry||0,rz||0)),new THREE.Vector3(sx||1,sy||1,sz||1)); return m; };
  const skin='#f2c29b', shirt='#ea580c', pants='#1f2a5a', shoe='#f8fafc', hair='#3b2314';
  B('tete');
  C(new THREE.SphereGeometry(.34,28,20),skin,M(0,1.92,0));
  C(new THREE.SphereGeometry(.355,28,14,0,Math.PI*2,0,Math.PI*.5),hair,M(0,1.95,-.02,-.25,0,0));
  C(new THREE.SphereGeometry(.055,12,10),'#1d1d1d',M(.12,1.95,.3)); C(new THREE.SphereGeometry(.055,12,10),'#1d1d1d',M(-.12,1.95,.3));
  C(new THREE.SphereGeometry(.018,8,6),'#ffffff',M(.135,1.97,.345)); C(new THREE.SphereGeometry(.018,8,6),'#ffffff',M(-.105,1.97,.345));
  C(new THREE.TorusGeometry(.08,.016,6,16,Math.PI),'#7a2e1d',M(0,1.84,.31,0,0,Math.PI));
  C(new THREE.SphereGeometry(.05,10,8),'#f4a07a',M(.21,1.86,.25)); C(new THREE.SphereGeometry(.05,10,8),'#f4a07a',M(-.21,1.86,.25));
  B('tete','torse'); C(new THREE.CylinderGeometry(.08,.09,.14,14),skin,M(0,1.62,0));
  B('torse','bassin'); C(new THREE.CapsuleGeometry(.27,.36,8,20),shirt,M(0,1.3,0,0,0,0,1,1,.78));
  C(new THREE.CylinderGeometry(.06,.06,.03,12),'#fde68a',M(0,1.42,.21,Math.PI/2,0,0));
  B('bassin','cuisse_g','cuisse_d'); C(new THREE.CapsuleGeometry(.25,.1,8,20),pants,M(0,.98,0,0,0,0,1,1,.8));
  for(const s of [1,-1]){ const k=s>0?'g':'d';
    B('epaule_'+k,'torse','coude_'+k); C(new THREE.CapsuleGeometry(.085,.26,6,14),shirt,M(s*.47,1.55,0,0,0,Math.PI/2));
    B('coude_'+k,'epaule_'+k,'main_'+k); C(new THREE.CapsuleGeometry(.075,.24,6,14),skin,M(s*.8,1.55,0,0,0,Math.PI/2));
    B('main_'+k,'coude_'+k); C(new THREE.SphereGeometry(.1,14,12),skin,M(s*1.04,1.55,0,0,0,0,1,.85,1));
    B('cuisse_'+k,'bassin','genou_'+k); C(new THREE.CapsuleGeometry(.11,.32,6,14),pants,M(s*.17,.74,0));
    B('genou_'+k,'cuisse_'+k,'pied_'+k); C(new THREE.CapsuleGeometry(.095,.32,6,14),pants,M(s*.17,.33,0));
    B('pied_'+k,'genou_'+k); C(new THREE.CapsuleGeometry(.1,.16,6,14),shoe,M(s*.17,.07,.09,Math.PI/2,0,0,1,1,.8));
  }
  return mergeGeometries(P,false);
}
function segDist(p,a,b){ const ab=b.clone().sub(a), t=Math.max(0,Math.min(1,p.clone().sub(a).dot(ab)/ab.lengthSq())); return p.distanceTo(a.clone().add(ab.multiplyScalar(t))); }
function childOf(n){ return BONES.filter(b=>S.parents[b.n]===n||(!S.parents[b.n]&&b.p===n&&false)); }
function boneEnd(n){ const b=BONES[BI[n]]; const kids=BONES.filter(k=>k.p===n&&S.joints[k.n]); if(b.tip){ const off=new THREE.Vector3(...b.tip).sub(new THREE.Vector3(...REST[n])); return new THREE.Vector3(...S.joints[n]).add(off); }
  if(n==='bassin') return new THREE.Vector3(...S.joints[n]).add(new THREE.Vector3(0,-.15,0));
  if(kids.length===1) return new THREE.Vector3(...S.joints[kids[0].n]);
  if(n==='torse') return new THREE.Vector3(...S.joints.tete);
  return new THREE.Vector3(...S.joints[n]).add(new THREE.Vector3(0,.1,0)); }
function buildSkinned(){
  if(MESH){ ROOT.remove(MESH); MESH.geometry.dispose(); } if(STATIC){ ROOT.remove(STATIC); STATIC=null; }
  const geo=partGeoms(), pos=geo.attributes.position, n=pos.count, si=new Uint16Array(n*4), sw=new Float32Array(n*4);
  const segs=BONES.map(b=>[new THREE.Vector3(...S.joints[b.n]),boneEnd(b.n)]), v=new THREE.Vector3();
  for(let i=0;i<n;i++){ v.fromBufferAttribute(pos,i); const d=CANDS[i].map(nm=>[BI[nm],segDist(v,segs[BI[nm]][0],segs[BI[nm]][1])]).sort((a,b)=>a[1]-b[1]).slice(0,3);
    let w=d.map(x=>1/Math.pow(x[1]+.02,8)), tot=w.reduce((a,b)=>a+b,0); for(let k=0;k<d.length;k++){ si[i*4+k]=d[k][0]; sw[i*4+k]=w[k]/tot; } }
  geo.setAttribute('skinIndex',new THREE.BufferAttribute(si,4)); geo.setAttribute('skinWeight',new THREE.BufferAttribute(sw,4));
  BONEOBJ={}; const bones=BONES.map(b=>{ const o=new THREE.Bone(); o.name=b.n; BONEOBJ[b.n]=o; return o; });
  BONES.forEach(b=>{ const o=BONEOBJ[b.n], par=b.p; const pj=par?S.joints[par]:[0,0,0];
    o.position.set(S.joints[b.n][0]-pj[0],S.joints[b.n][1]-pj[1],S.joints[b.n][2]-pj[2]); if(par) BONEOBJ[par].add(o); });
  SKEL=new THREE.Skeleton(bones);
  const mat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.55,metalness:.05});
  MESH=new THREE.SkinnedMesh(geo,mat); MESH.castShadow=true; MESH.add(BONEOBJ.bassin); MESH.updateMatrixWorld(true); MESH.bind(SKEL); ROOT.add(MESH);
  buildLines();
}
function buildStatic(){ if(MESH){ ROOT.remove(MESH); MESH=null; } if(STATIC) return; const geo=partGeoms(); STATIC=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.55,transparent:true,opacity:.55,depthWrite:false})); STATIC.castShadow=true; ROOT.add(STATIC); }
let SKL=null, SHOWSK=true;
function buildLines(){ if(SKL) SC.remove(SKL); const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(BONES.length*6),3)); g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(BONES.length*6),3));
  SKL=new THREE.LineSegments(g,new THREE.LineBasicMaterial({vertexColors:true,depthTest:false,transparent:true,opacity:.9})); SKL.renderOrder=20; SC.add(SKL); }
function updLines(){ if(!SKL) return; SKL.visible=SHOWSK&&S.bound&&!!MESH; if(!SKL.visible) return; const P=SKL.geometry.attributes.position, Cc=SKL.geometry.attributes.color;
  BONES.forEach((b,i)=>{ const a=BONEOBJ[b.n].getWorldPosition(new THREE.Vector3()), e=tipFast(b.n); P.setXYZ(i*2,a.x,a.y,a.z); P.setXYZ(i*2+1,e.x,e.y,e.z); const c=new THREE.Color(b.n===S.sel?'#f9b13c':'#38bdf8'); Cc.setXYZ(i*2,c.r,c.g,c.b); Cc.setXYZ(i*2+1,c.r,c.g,c.b); });
  P.needsUpdate=true; Cc.needsUpdate=true; }
function tipFast(n){ const end=boneEnd(n), j=new THREE.Vector3(...S.joints[n]); return BONEOBJ[n].localToWorld(end.sub(j)); }
function applyPose(){
  if(!S.bound||!SKEL) return;
  BONES.forEach(b=>{ const o=BONEOBJ[b.n], r=S.rot[b.n]; o.rotation.set(rad(r.x),rad(r.y),rad(r.z),'XYZ');
    if(b.n==='bassin'){ const par=[0,0,0]; o.position.set(S.joints.bassin[0],S.joints.bassin[1]+(r.py||0),S.joints.bassin[2]+(r.pz||0)); } });
  MESH.updateMatrixWorld(true);
}
function jointWorld(n){ if(!S.bound) return new THREE.Vector3(...(S.joints[n]||[0,0,0])); applyPose(); return BONEOBJ[n].getWorldPosition(new THREE.Vector3()); }
function tipWorld(n){ if(!S.bound) return boneEnd(n); applyPose(); const b=BONEOBJ[n], end=boneEnd(n), j=new THREE.Vector3(...S.joints[n]); const local=end.sub(j); return b.localToWorld(local.clone()); }

/* ---------- animation ---------- */
function ease(u){ return S.anim.interp==='lisse'?u*u*(3-2*u):u; }
function evalBone(n,t){ const K=(S.anim.keys[n]||[]).slice().sort((a,b)=>a.t-b.t); if(!K.length) return null;
  if(t<=K[0].t) return Object.assign({},K[0]); if(t>=K[K.length-1].t) return Object.assign({},K[K.length-1]);
  for(let i=0;i<K.length-1;i++){ const a=K[i], b=K[i+1]; if(t>=a.t&&t<=b.t){ const u=ease((t-a.t)/(b.t-a.t||1)), o={t}; CHAN.forEach(c=>o[c]=(a[c]||0)+((b[c]||0)-(a[c]||0))*u); return o; } } }
function poseAt(t){ BONES.forEach(b=>{ const e=evalBone(b.n,t); if(e) CHAN.forEach(c=>S.rot[b.n][c]=e[c]||0); }); }
function setTime(t){ S.t=Math.max(0,Math.min(S.anim.dur,Math.round(t*100)/100)); poseAt(S.t); refreshUI(); }
function keyBone(n,t){ t=t===undefined?S.t:t; t=Math.round(t*100)/100; const K=S.anim.keys[n]=(S.anim.keys[n]||[]).filter(k=>Math.abs(k.t-t)>.004); const o={t}; CHAN.forEach(c=>o[c]=S.rot[n][c]||0); K.push(o); K.sort((a,b)=>a.t-b.t); }
function delKey(n,t){ t=t===undefined?S.t:t; S.anim.keys[n]=(S.anim.keys[n]||[]).filter(k=>Math.abs(k.t-t)>.004); if(!S.anim.keys[n].length) delete S.anim.keys[n]; }

/* ---------- API (utilisée par les solutions et les tests) ---------- */
const A={
  reset(){ S=Object.assign(freshState(),{id:S.id,done:S.done,cur:S.cur}); rebuild(); },
  select(n){ S.sel=n; S.seen['sel_'+n]=1; },
  rot(n,ax,v){ S.rot[n][ax]=+v; }, pos(ax,v){ S.rot.bassin[ax]=+v; },
  key(n,t){ keyBone(n,t); }, time(t){ setTime(t); }, dur(d){ S.anim.dur=+d; }, interp(m){ S.anim.interp=m; },
  pose(t){ poseAt(t); applyPose(); },
  place(n,p){ S.joints[n]=p.slice(); }, parent(n,p){ S.parents[n]=p; }, bind(){ return doBind(); },
  hand(side){ return tipWorld('main_'+side); }, joint(n){ return jointWorld(n); }, tip(n){ return tipWorld(n); },
  keysOf(n){ return (S.anim.keys[n]||[]).slice(); }, keyed(){ return Object.keys(S.anim.keys).filter(k=>S.anim.keys[k].length); },
  get S(){ return S; }
};
function badParents(){ return BONES.filter(b=>b.p&&S.parents[b.n]!==b.p); }
function doBind(){ if(!BONES.every(b=>S.joints[b.n])) return false; if(badParents().length) return false; S.bound=true; S.seen.bind=1; buildSkinned(); applyPose(); return true; }
function rebuild(){ if(S.bound&&BONES.every(b=>S.joints[b.n])) buildSkinned(); else buildStatic(); drawMarkers(); applyPose(); refreshUI(); }

/* ---------- marqueurs d'articulations (mode rig) ---------- */
function drawMarkers(){
  Object.values(MARK).forEach(m=>ROOT.remove(m)); MARK={}; GHOST.forEach(g=>ROOT.remove(g)); GHOST=[];
  const ui=(MS()[S.cur]&&MS()[S.cur].ui)||[], rig=ui.includes('rig')||ui.includes('parents')||(ui.includes('bind')&&!S.bound);
  if(!rig) return;
  BONES.forEach((b,i)=>{ if(!S.joints[b.n]) S.joints[b.n]=[-1.05+(i%8)*.3,2.52+Math.floor(i/8)*.24,0];
    const ok=near(b.n), m=new THREE.Mesh(new THREE.SphereGeometry(.06,16,12),new THREE.MeshBasicMaterial({color:ok?0x22c55e:(S.sel===b.n?0xf9b13c:0x1f6feb),depthTest:false,transparent:true}));
    m.renderOrder=10; m.position.set(...S.joints[b.n]); m.userData.n=b.n; ROOT.add(m); MARK[b.n]=m;
    if(HELP){ const g=new THREE.Mesh(new THREE.RingGeometry(.05,.065,24),new THREE.MeshBasicMaterial({color:0xffffff,depthTest:false,transparent:true,opacity:.7})); g.position.set(...REST[b.n]); g.position.z=.4; g.renderOrder=9; ROOT.add(g); GHOST.push(g); } });
  if(LINES) ROOT.remove(LINES); LINES=new THREE.Group();
  BONES.forEach(b=>{ const p=S.parents[b.n]; if(!p||!S.joints[p]) return; const g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...S.joints[p]),new THREE.Vector3(...S.joints[b.n])]);
    const l=new THREE.Line(g,new THREE.LineBasicMaterial({color:0xf9b13c,depthTest:false,transparent:true})); l.renderOrder=8; LINES.add(l); });
  ROOT.add(LINES);
}
function near(n,tol){ const j=S.joints[n]; if(!j) return false; const r=REST[n]; return Math.hypot(j[0]-r[0],j[1]-r[1])<(tol||.07); }

/* ---------- interface ---------- */
function MS(){ return CFG.missions; }
function init3d(){
  const box=$('#view'); R=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true}); R.setPixelRatio(Math.min(2,devicePixelRatio)); R.shadowMap.enabled=true; R.shadowMap.type=THREE.PCFSoftShadowMap;
  R.outputColorSpace=THREE.SRGBColorSpace; R.toneMapping=THREE.ACESFilmicToneMapping; box.appendChild(R.domElement);
  SC=new THREE.Scene(); { const c=document.createElement('canvas'); c.width=4; c.height=256; const g=c.getContext('2d'), gr=g.createLinearGradient(0,0,0,256); gr.addColorStop(0,'#7fb2f0'); gr.addColorStop(.55,'#dcebfb'); gr.addColorStop(1,'#f6efe3'); g.fillStyle=gr; g.fillRect(0,0,4,256); const tx=new THREE.CanvasTexture(c); tx.colorSpace=THREE.SRGBColorSpace; SC.background=tx; }
  SC.fog=new THREE.Fog('#e9eef5',12,30);
  decor();
  CAM=new THREE.PerspectiveCamera(35,1,.1,100); CAM.position.set(2.7,1.9,5.4);
  SC.add(new THREE.HemisphereLight('#ffffff','#b9a98f',1.0));
  const sun=new THREE.DirectionalLight('#fff3e0',2.2); sun.position.set(3,6,4); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048); sun.shadow.camera.left=-3; sun.shadow.camera.right=3; sun.shadow.camera.top=3; sun.shadow.camera.bottom=-3; sun.shadow.radius=4; SC.add(sun);
  const rim=new THREE.DirectionalLight('#8ecbff',1.2); rim.position.set(-4,3,-3); SC.add(rim);
  const podium=new THREE.Mesh(new THREE.CylinderGeometry(2.5,2.6,.12,64),new THREE.MeshStandardMaterial({color:'#2b4a73',roughness:.6})); podium.position.y=-.061; podium.receiveShadow=true; SC.add(podium);
  const floor=new THREE.Mesh(new THREE.CircleGeometry(2.4,64),new THREE.MeshStandardMaterial({color:'#f1ece2',roughness:.9})); floor.rotation.x=-Math.PI/2; floor.receiveShadow=true; SC.add(floor);
  const ring=new THREE.Mesh(new THREE.RingGeometry(2.4,2.5,64),new THREE.MeshBasicMaterial({color:'#f9b13c'})); ring.rotation.x=-Math.PI/2; ring.position.y=.002; SC.add(ring);
  const grid=new THREE.GridHelper(4.8,24,'#d8cfbf','#e6dfd2'); grid.position.y=.003; SC.add(grid);
  SC.add(ROOT);
  ORB=new OrbitControls(CAM,R.domElement); ORB.target.set(0,1.2,0); ORB.enableDamping=true; ORB.minDistance=2; ORB.maxDistance=10; ORB.maxPolarAngle=Math.PI*.52; ORB.update();
  TC=new TransformControls(CAM,R.domElement); TC.setMode('rotate'); TC.setSpace('local'); TC.setSize(.7); SC.add(TC);
  TC.addEventListener('dragging-changed',e=>{ ORB.enabled=!e.value; if(!e.value) save(); });
  TC.addEventListener('objectChange',()=>{ const o=TC.object; if(!o) return; const r=S.rot[o.name]; r.x=Math.round(o.rotation.x*180/Math.PI); r.y=Math.round(o.rotation.y*180/Math.PI); r.z=Math.round(o.rotation.z*180/Math.PI); S.seen['rot_'+o.name]=1; refreshUI(false); });
  const resize=()=>{ const w=box.clientWidth, h=box.clientHeight; R.setSize(w,h); CAM.aspect=w/h; CAM.updateProjectionMatrix(); }; new ResizeObserver(resize).observe(box); resize();
  /* clic : sélectionner un os ou déplacer une articulation */
  const ray=new THREE.Raycaster(), mouse=new THREE.Vector2(), plane=new THREE.Plane(new THREE.Vector3(0,0,1),0);
  const setM=e=>{ const r=R.domElement.getBoundingClientRect(); mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1); ray.setFromCamera(mouse,CAM); };
  R.domElement.addEventListener('pointerdown',e=>{ if(TC.dragging||TC.axis) return; setM(e);
    const rig=Object.keys(MARK).length; if(rig){ const hit=ray.intersectObjects(Object.values(MARK)).sort((a,b)=>a.distance-b.distance)[0]; if(hit){ DRAG=hit.object.userData.n; S.sel=DRAG; ORB.enabled=false; refreshUI(); } return; }
    if(!S.bound||!MESH) return; const h=ray.intersectObject(MESH,false)[0]; if(!h) return; selectNearest(h.point); });
  R.domElement.addEventListener('pointermove',e=>{ if(!DRAG) return; setM(e); const p=new THREE.Vector3(); if(ray.ray.intersectPlane(plane,p)){ S.joints[DRAG]=[Math.round(p.x*100)/100,Math.round(p.y*100)/100,0]; MARK[DRAG].position.set(...S.joints[DRAG]); drawMarkers(); refreshUI(false); } });
  addEventListener('pointerup',()=>{ if(DRAG){ const r=REST[DRAG], j=S.joints[DRAG]; if(Math.hypot(j[0]-r[0],j[1]-r[1])<.09){ S.joints[DRAG]=r.slice(); toast(LAB[DRAG]+' : bien placé.'); } drawMarkers(); DRAG=null; ORB.enabled=true; save(); refreshUI(); } });
  loop();
}
function selectNearest(p){ let best=null,bd=1e9; BONES.forEach(b=>{ const d=segDist(p,jointWorld(b.n),tipWorld(b.n)); if(d<bd){ bd=d; best=b.n; } }); if(best){ A.select(best); refreshUI(); } }
function loop(now){ requestAnimationFrame(loop); now=now||0; const dt=Math.min(.05,(now-LAST)/1000); LAST=now;
  if(PLAY){ let t=S.t+dt; if(t>S.anim.dur) t=$('#loop')&&!$('#loop').checked?S.anim.dur:t%S.anim.dur; if(t>=S.anim.dur&&$('#loop')&&!$('#loop').checked) PLAY=false; S.t=t; poseAt(t); refreshUI(false,true); }
  applyPose(); updLines(); updLabels(); if(TC){ const want=S.bound&&S.sel&&BONEOBJ[S.sel]&&!PLAY&&!Object.keys(MARK).length?BONEOBJ[S.sel]:null; if(TC.object!==want){ want?TC.attach(want):TC.detach(); } }
  ORB.update(); R.render(SC,CAM); }
function decor(){ const G=new THREE.Group(); const ground=new THREE.Mesh(new THREE.CircleGeometry(40,48),new THREE.MeshStandardMaterial({color:'#b9d99a',roughness:1})); ground.rotation.x=-Math.PI/2; ground.position.y=-.12; ground.receiveShadow=true; G.add(ground);
  const rnd=(()=>{ let a=7; return ()=>((a=Math.imul(a^a>>>15,a|1)+0x6D2B79F5|0)>>>0)%10000/10000; })();
  for(let i=0;i<26;i++){ const ang=Math.PI*.55+rnd()*Math.PI*1.9, r=7+rnd()*9, x=Math.cos(ang)*r, z=Math.sin(ang)*r; if(z>3) continue; const h=1.2+rnd()*1.6;
    const tr=new THREE.Mesh(new THREE.CylinderGeometry(.08,.12,h*.5,8),new THREE.MeshStandardMaterial({color:'#7a5230'})); tr.position.set(x,h*.25-.1,z); G.add(tr);
    const top=new THREE.Mesh(i%3?new THREE.ConeGeometry(.6+rnd()*.4,h,10):new THREE.SphereGeometry(.7+rnd()*.3,14,10),new THREE.MeshStandardMaterial({color:['#4f9d5b','#3f8a4f','#6bb26a'][i%3],roughness:.8})); top.position.set(x,h*.5+h*.35,z); top.castShadow=true; G.add(top); }
  for(let i=0;i<6;i++){ const c=new THREE.Mesh(new THREE.SphereGeometry(.6+rnd()*.5,10,8),new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1,transparent:true,opacity:.9})); c.scale.set(2.2,.7,1); c.position.set(-14+i*6,7+rnd()*3,-18-rnd()*5); G.add(c); }
  SC.add(G); }
function updLabels(){ const box=$('#labels'); if(!box) return; const ks=Object.keys(MARK); if(!ks.length){ if(box.childElementCount) box.innerHTML=''; return; }
  if(box.childElementCount!==ks.length) box.innerHTML=ks.map(n=>`<span data-n="${n}">${LAB[n]}</span>`).join('');
  const W=R.domElement.clientWidth, Hh=R.domElement.clientHeight;
  box.querySelectorAll('span').forEach(sp=>{ const n=sp.dataset.n, v=MARK[n].position.clone().project(CAM); const ok=near(n);
    sp.style.transform=`translate(${(v.x+1)/2*W+9}px,${(1-v.y)/2*Hh-8}px)`; sp.className=(ok?'ok':'')+(S.sel===n?' on':' hid'); }); }
function view(k){ const T=new THREE.Vector3(0,k==='rig'?1.35:1.2,0); const P={rig:[0,1.35,6.4],face:[0,1.25,5.6],cote:[6.2,1.4,0],trois:[2.7,1.9,5.4]}[k]; CAM.position.set(...P); ORB.target.copy(T); ORB.update(); }

/* ---------- panneaux ---------- */
function refreshUI(full=true,fast=false){ syncSel();
  if(full!==false) renderSide();
  renderTimeline(); if(!fast) renderBonePanel(); renderCurve();
}
function renderBonePanel(){
  const el=$('#bonep'); if(!el) return; const m=MS()[S.cur]; const ui=(m&&m.ui)||[];
  if(ui.includes('rig')){ el.innerHTML=`<div class="ph">Articulations à placer</div><div class="jl">${BONES.map(b=>`<span class="j jr ${near(b.n)?'ok':''} ${S.sel===b.n?'on':''}" data-n="${b.n}">${b.l}</span>`).join('')}</div><div class="muted" style="margin:6px 0">Clique sur un nom : son point devient orange.</div>
    <label class="hl"><input type="checkbox" id="help" ${HELP?'checked':''}> Afficher les repères</label><div class="muted">Glisse chaque point bleu sur l’articulation du personnage. Il devient vert quand il est bien placé.</div>`;
    $('#help').onchange=e=>{ HELP=e.target.checked; drawMarkers(); }; el.querySelectorAll('.jr').forEach(x=>x.onclick=()=>{ S.sel=x.dataset.n; drawMarkers(); renderBonePanel(); }); return; }
  if(ui.includes('parents')){ const L=CFG.parentsMissing||[]; el.innerHTML=`<div class="ph">Qui est le parent ?</div>${L.map(n=>`<label class="pr">${LAB[n]} est rattaché(e) à <select data-n="${n}"><option value="">…</option>${BONES.filter(b=>b.n!==n).map(b=>`<option value="${b.n}" ${S.parents[n]===b.n?'selected':''}>${b.l}</option>`).join('')}</select></label>`).join('')}`;
    el.querySelectorAll('select').forEach(s=>s.onchange=()=>{ S.parents[s.dataset.n]=s.value; save(); drawMarkers(); }); return; }
  if(ui.includes('bind')&&!S.bound){ el.innerHTML=`<div class="ph">Lier la peau</div><p class="muted">Le logiciel calcule, pour chaque point de la peau, quels os le font bouger (les plus proches).</p><button class="btn prim" id="bindB">Lier la peau au squelette</button>`;
    $('#bindB').onclick=()=>{ if(badParents().length){ toast('Le squelette est incomplet : vérifie les parents de '+badParents().map(b=>b.l).join(', ')+'.'); return; } doBind(); drawMarkers(); save(); refreshUI(); toast('Peau liée : sélectionne un os et fais-le tourner.'); }; return; }
  if(!S.bound){ el.innerHTML='<div class="muted">Le personnage n’a pas encore de squelette.</div>'; return; }
  const n=S.sel; if(!n){ el.innerHTML='<div class="ph">Os</div><div class="muted">Clique sur une partie du personnage pour sélectionner un os.</div>'+boneList(); bindBoneList(); return; }
  const r=S.rot[n], sl=(ax,lab,col,min,max,k)=>{ k=k||1; const v=Math.round((r[ax]||0)*k); return `<label class="sl"><span style="color:${col}">${lab}</span><input type="range" min="${min}" max="${max}" step="1" value="${v}" data-ax="${ax}" data-k="${k}"><b>${v}${k===1?'°':' cm'}</b></label>`; };
  el.innerHTML=`<div class="ph">${LAB[n]}</div>${sl('x','Rotation X','#e5484d',-180,180)}${sl('y','Rotation Y','#30a46c',-180,180)}${sl('z','Rotation Z','#3e63dd',-180,180)}
   ${n==='bassin'?sl('py','Hauteur','#b45309',-60,80,100)+sl('pz','Avancer','#b45309',-100,100,100):''}
   <div class="bb"><button class="btn" id="zero">Remettre à zéro</button><button class="btn prim" id="kb2">Poser une clé (I)</button></div>`+boneList();
  el.querySelectorAll('input[type=range]').forEach(inp=>inp.oninput=()=>{ const ax=inp.dataset.ax, k=+inp.dataset.k; S.rot[n][ax]=(+inp.value)/k; S.seen['rot_'+n]=1; inp.nextElementSibling.textContent=inp.value+(k===1?'°':' cm'); save(); });
  $('#kb2').onclick=()=>$('#kb').click();
  $('#zero').onclick=()=>{ CHAN.forEach(c=>S.rot[n][c]=0); save(); refreshUI(); };
  bindBoneList();
}
function boneList(){ return `<div class="ph" style="margin-top:10px">Tous les os</div><div class="jl">${BONES.map(b=>`<span class="j sel ${S.sel===b.n?'on':''} ${(S.anim.keys[b.n]||[]).length?'k':''}" data-n="${b.n}">${b.l}</span>`).join('')}</div>`; }
function bindBoneList(){ document.querySelectorAll('.j.sel').forEach(e=>e.onclick=()=>{ A.select(e.dataset.n); save(); refreshUI(); }); }
function renderTimeline(){
  const cv=$('#tl'); if(!cv) return; const show=S.bound; $('#tlwrap').style.display=show?'':'none'; if(!show) return;
  const w=cv.clientWidth, h=cv.clientHeight; if(cv.width!==w*2){ cv.width=w*2; cv.height=h*2; } const g=cv.getContext('2d'); g.setTransform(2,0,0,2,0,0); g.clearRect(0,0,w,h);
  const L=110, X=t=>L+(w-L-14)*t/S.anim.dur, rows=BONES.filter(b=>(S.anim.keys[b.n]||[]).length||b.n===S.sel);
  g.fillStyle='#f8fafc'; g.fillRect(0,0,w,h); g.fillStyle='#64748b'; g.font='11px Segoe UI'; g.textBaseline='middle';
  for(let t=0;t<=S.anim.dur+1e-6;t+=.25){ const x=X(t); g.fillStyle=Math.abs(t%1)<1e-6?'#94a3b8':'#e2e8f0'; g.fillRect(x,18,1,h-18); if(Math.abs((t*2)%1)<1e-6){ g.fillStyle='#475569'; g.textAlign='center'; g.fillText(t.toFixed(1).replace('.',',')+' s',x,9); } }
  g.textAlign='left';
  rows.forEach((b,i)=>{ const y=30+i*17; if(y>h-6) return; g.fillStyle=b.n===S.sel?'#fff3d6':(i%2?'#fff':'#f1f5f9'); g.fillRect(0,y-8,w,16); g.fillStyle='#1e3a5f'; g.fillText(b.l,8,y);
    (S.anim.keys[b.n]||[]).forEach(k=>{ const x=X(k.t); g.save(); g.translate(x,y); g.rotate(Math.PI/4); g.fillStyle=Math.abs(k.t-S.t)<.005?'#f9b13c':'#1f6feb'; g.fillRect(-4,-4,8,8); g.restore(); }); });
  const px=X(S.t); g.fillStyle='#e5484d'; g.fillRect(px-1,14,2,h-14); g.beginPath(); g.moveTo(px-6,12); g.lineTo(px+6,12); g.lineTo(px,19); g.fill();
  $('#tlt').textContent=S.t.toFixed(2).replace('.',',')+' s';
  cv.onpointerdown=e=>{ const r=cv.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top; const t=(x-L)/(w-L-14)*S.anim.dur; if(x<L){ const i=Math.floor((y-22)/17); if(rows[i]){ A.select(rows[i].n); refreshUI(); } return; }
    setTime(Math.round(Math.max(0,Math.min(S.anim.dur,t))*20)/20); const mv=ev=>{ const xx=ev.clientX-r.left; setTime(Math.round(Math.max(0,Math.min(S.anim.dur,(xx-L)/(w-L-14)*S.anim.dur))*20)/20); };
    const up=()=>{ removeEventListener('pointermove',mv); removeEventListener('pointerup',up); }; addEventListener('pointermove',mv); addEventListener('pointerup',up); };
}
function renderCurve(){ const cv=$('#curve'); if(!cv) return; const wrap=$('#curvewrap'); const m=MS()[S.cur]; const on=m&&m.ui&&m.ui.includes('courbes')&&S.sel; wrap.style.display=on?'':'none'; if(!on) return;
  const w=cv.clientWidth,h=cv.clientHeight; if(cv.width!==w*2){ cv.width=w*2; cv.height=h*2; } const g=cv.getContext('2d'); g.setTransform(2,0,0,2,0,0); g.clearRect(0,0,w,h); g.fillStyle='#0f172a'; g.fillRect(0,0,w,h);
  const K=S.anim.keys[S.sel]||[]; g.fillStyle='#94a3b8'; g.font='11px Segoe UI'; g.fillText('Courbes de '+LAB[S.sel]+(K.length?'':' (aucune clé)'),8,14);
  if(!K.length) return; const ch=S.sel==='bassin'?['x','y','z','py','pz']:['x','y','z']; const cols={x:'#e5484d',y:'#30a46c',z:'#3e63dd',py:'#f9b13c',pz:'#ff93c4'};
  const vals=[]; for(let i=0;i<=80;i++){ const e=evalBone(S.sel,S.anim.dur*i/80); vals.push(e); } let mn=-10,mx=10; vals.forEach(e=>ch.forEach(c=>{ const v=c[0]==='p'?e[c]*100:e[c]; mn=Math.min(mn,v); mx=Math.max(mx,v); }));
  const X=i=>10+(w-20)*i/80, Y=v=>h-10-(h-30)*(v-mn)/(mx-mn||1);
  g.strokeStyle='#334155'; g.beginPath(); g.moveTo(10,Y(0)); g.lineTo(w-10,Y(0)); g.stroke();
  ch.forEach(c=>{ if(!vals.some(e=>Math.abs(e[c])>1e-6)) return; g.strokeStyle=cols[c]; g.lineWidth=2; g.beginPath(); vals.forEach((e,i)=>{ const v=c[0]==='p'?e[c]*100:e[c]; i?g.lineTo(X(i),Y(v)):g.moveTo(X(i),Y(v)); }); g.stroke(); });
  K.forEach(k=>{ const i=k.t/S.anim.dur*80; g.fillStyle='#fff'; ch.forEach(c=>{ const v=c[0]==='p'?k[c]*100:k[c]; if(Math.abs(v)>1e-6){ g.fillRect(X(i)-2,Y(v)-2,4,4); } }); });
  g.fillStyle='#e5484d'; g.fillRect(X(S.t/S.anim.dur*80)-1,20,2,h-30);
}

/* ---------- missions et tutoriel ---------- */
function runTests(m){ const snap=JSON.stringify(S); const out=m.tests.map(t=>{ let ok=false; try{ S=JSON.parse(snap); ok=!!t.ok(A); }catch(e){ ok=false; } return {txt:t.txt,ok}; }); S=JSON.parse(snap); poseAt(S.t); applyPose(); return out; }
function renderSide(){
  const m=MS()[S.cur]; if(!m) return;
  $('#tabs').innerHTML=MS().map((x,i)=>`<button class="tab ${i===S.cur?'on':''} ${S.done[i]?'ok':''} ${i>0&&!S.done[i-1]&&!S.done[i]?'lock':''}" data-m="${i}">Mission ${i+1}</button>`).join('');
  $('#prog').textContent=MS().filter((x,i)=>S.done[i]).length+' / '+MS().length+' missions réussies';
  const k=Math.min(S.stp[S.cur]||0,m.steps.length-1), st=Object.assign({},m.steps[k]); st.img=(window.IMG3D||{})['m'+S.cur+'s'+k]||'';
  $('#mis').innerHTML=`<div class="mh"><span class="num">Mission ${S.cur+1}</span></div><h2>${m.titre}</h2><p class="pitch">${m.pitch}</p>
   <div class="tuto"><div class="th"><span>Étape <b>${k+1}</b> sur ${m.steps.length}</span></div><p class="tt">${st.t}</p>${st.img?`<img class="ti" src="${st.img}" alt="Illustration de l’étape">`:''}
   <div class="tdots">${m.steps.map((_,i)=>`<i class="${i<k?'d':i===k?'c':''}"></i>`).join('')}</div>
   <div class="tn"><button class="btn" id="stPrev" ${k===0?'disabled':''}>Précédente</button>${k<m.steps.length-1?'<button class="btn prim" id="stNext">Étape suivante</button>':''}</div></div>
   <h3>Objectifs</h3><ul class="tests">${m.tests.map(t=>`<li><span class="ck"></span>${t.txt}</li>`).join('')}</ul>
   ${m.aide?`<details class="aide"><summary>Indice</summary><div>${m.aide}</div></details>`:''}
   <div class="mbtns"><button class="btn prim" id="verif">Vérifier ma mission</button></div><div id="res"></div>`;
  if(S.done[S.cur]) document.querySelectorAll('#mis .tests li').forEach(li=>li.classList.add('good'));
  const go=d=>{ S.stp[S.cur]=Math.max(0,Math.min(m.steps.length-1,k+d)); save(); renderSide(); };
  $('#stPrev').onclick=()=>go(-1); const nx=$('#stNext'); if(nx) nx.onclick=()=>go(1);
  $('#verif').onclick=verify;
  const im=document.querySelector('#mis .ti'); if(im) im.onclick=()=>{ $('#modal').innerHTML=`<div class="box big"><img src="${st.img}" style="max-width:100%"><div class="row"><button class="btn prim" id="zc">Fermer</button></div></div>`; $('#modal').classList.add('on'); $('#zc').onclick=()=>$('#modal').classList.remove('on'); };
}
function verify(){ const m=MS()[S.cur]; const r=runTests(m), ok=r.every(x=>x.ok);
  document.querySelectorAll('#mis .tests li').forEach((li,i)=>{ li.classList.toggle('good',r[i].ok); li.classList.toggle('bad',!r[i].ok); });
  if(ok){ S.done[S.cur]=true; save(); $('#res').innerHTML=`<div class="win"><b>Mission réussie !</b>${S.cur<MS().length-1?'<br><button class="btn prim" id="next">Mission suivante</button>':'<br>Toutes les missions sont faites : rends ton TP.'}</div>`; const nx=$('#next'); if(nx) nx.onclick=()=>openMission(S.cur+1); renderTabsOnly(); }
  else $('#res').innerHTML=`<div class="lose">Il reste ${r.filter(x=>!x.ok).length} objectif(s). Relis l’étape, observe ton personnage, puis corrige.</div>`; }
function renderTabsOnly(){ $('#prog').textContent=MS().filter((x,i)=>S.done[i]).length+' / '+MS().length+' missions réussies'; document.querySelectorAll('.tab').forEach((b,i)=>b.classList.toggle('ok',!!S.done[i])); }
function openMission(i){ switchSlot(i); S.cur=i; save(); if(MS()[i].onOpen) MS()[i].onOpen(A); rebuild(); renderSide(); if(MS()[i].view) view(MS()[i].view); }
function toast(t){ const d=$('#toast'); d.textContent=t; d.classList.add('on'); clearTimeout(d._t); d._t=setTimeout(()=>d.classList.remove('on'),3000); }

/* ---------- identité, rendu ---------- */
function askId(cb){ const cls=(CFG.classes||[]).map(c=>`<option>${c}</option>`).join('');
  $('#modal').innerHTML=`<div class="box"><h3>${CFG.title}</h3><p>${CFG.intro}</p><label>Nom<input id="idN"></label><label>Prénom<input id="idP"></label><label>Classe<select id="idC">${cls}</select></label><div class="err" id="idE"></div><button class="btn prim" id="idGo">Commencer</button></div>`;
  $('#modal').classList.add('on'); $('#idGo').onclick=()=>{ const n=$('#idN').value.trim(), p=$('#idP').value.trim(); if(!n||!p){ $('#idE').textContent='Écris ton nom et ton prénom.'; return; } S.id={nom:n,prenom:p,classe:$('#idC').value}; save(); $('#modal').classList.remove('on'); $('#who').textContent=p+' '+n+' · '+S.id.classe; cb(); }; }
function submit(){ const done=MS().map((m,i)=>!!S.done[i]), n=done.filter(Boolean).length;
  fetch('https://evaluation-bloc-default-rtdb.europe-west1.firebasedatabase.app/scores_tp/'+CFG.id+'.json',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nom:S.id.nom,prenom:S.id.prenom,classe:S.id.classe,tp:CFG.title,missions:done,reussies:n,total:MS().length,date:new Date().toISOString()})})
   .then(r=>toast(r.ok?'TP rendu : '+n+' / '+MS().length+' missions.':'Envoi impossible : montre ton écran au professeur.')).catch(()=>toast('Envoi impossible : montre ton écran au professeur.')); }
function djb(s){ let h=5381; for(const c of s) h=((h*33)^c.charCodeAt(0))>>>0; return h; }
function profSol(){ $('#modal').innerHTML=`<div class="box"><h3>Espace professeur</h3><label>Mot de passe<input id="pw" type="password"></label><div class="err" id="pwE"></div><div class="row"><button class="btn" id="pwNo">Fermer</button><button class="btn prim" id="pwOk">Appliquer la solution de la mission</button></div></div>`;
  $('#modal').classList.add('on'); $('#pwNo').onclick=()=>$('#modal').classList.remove('on');
  $('#pwOk').onclick=()=>{ if(djb($('#pw').value)!==CFG.profHash){ $('#pwE').textContent='Mot de passe incorrect.'; return; } $('#modal').classList.remove('on'); applySolutions(S.cur); }; }
function applySolutions(upto){ const keep={id:S.id,done:S.done,cur:S.cur,stp:S.stp}; S=Object.assign(freshState(),keep); S.slot=slotOf(0); for(let i=0;i<=upto;i++){ switchSlot(i); if(MS()[i].onOpen) MS()[i].onOpen(A); MS()[i].sol(A); } poseAt(S.t); rebuild(); save(); }

function init(){
  document.title=CFG.title+' · ESTIC'; $('#ttl').textContent=CFG.title;
  init3d(); rebuild();
  $('#tabs').onclick=e=>{ const b=e.target.closest('.tab'); if(!b) return; const i=+b.dataset.m; if(i>0&&!S.done[i-1]&&!S.done[i]){ toast('Réussis d’abord la mission précédente.'); return; } openMission(i); };
  $('#play').onclick=()=>{ PLAY=!PLAY; if(PLAY&&S.t>=S.anim.dur-.001) S.t=0; $('#play').textContent=PLAY?'Pause':'Lire'; };
  $('#kb').onclick=()=>{ if(!S.sel){ toast('Sélectionne d’abord un os.'); return; } keyBone(S.sel); S.seen.key=1; save(); refreshUI(); toast('Image clé posée : '+LAB[S.sel]+' à '+S.t.toFixed(2).replace('.',',')+' s'); };
  $('#kall').onclick=()=>{ BONES.forEach(b=>keyBone(b.n)); save(); refreshUI(); toast('Image clé posée pour tout le corps à '+S.t.toFixed(2).replace('.',',')+' s'); };
  $('#kdel').onclick=()=>{ if(S.sel){ delKey(S.sel); save(); refreshUI(); } };
  syncSel(); $('#dur').onchange=e=>{ S.anim.dur=+e.target.value; setTime(Math.min(S.t,S.anim.dur)); save(); };
  $('#interp').onchange=e=>{ S.anim.interp=e.target.value; save(); refreshUI(); };
  $('#t0').onclick=()=>setTime(0);
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>view(b.dataset.view));
  $('#rendre').onclick=submit; $('#prof').onclick=profSol;
  addEventListener('keydown',e=>{ if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT') return; if(e.key==='i'||e.key==='I'){ $('#kb').click(); } if(e.key===' '){ e.preventDefault(); $('#play').click(); } });
  $('#aide').onclick=tour; $('#sk').onclick=()=>{ SHOWSK=!SHOWSK; $('#sk').classList.toggle('on',SHOWSK); };
  const go=()=>{ if(!localStorage.getItem('anim3d_tour')){ localStorage.setItem('anim3d_tour','1'); setTimeout(tour,300); } $('#who').textContent=S.id.prenom+' '+S.id.nom+' · '+S.id.classe; openMission(S.cur||0); };
  if(!S.id) askId(go); else go();
}
function tour(){ const P=[
 ['Tourner autour du personnage','Clic gauche maintenu dans la scène, puis déplace la souris. La molette sert à zoomer.'],
 ['Sélectionner un os','Clique sur une partie du corps (le bras, la tête...). L\u2019os choisi devient orange.'],
 ['Faire tourner un os','Attrape un des anneaux de couleur et tire. Rouge = axe X, vert = axe Y, bleu = axe Z. Tu peux aussi utiliser les curseurs à droite.'],
 ['Poser une image clé','Place le curseur rouge de la frise sur un temps, prends la pose, puis appuie sur I (ou le bouton Clé).'],
 ['Regarder ton animation','Bouton Lire ou barre Espace. Le logiciel calcule tout seul les images entre deux clés.']];
 let i=0; const show=()=>{ $('#modal').innerHTML=`<div class="box"><div class="muted">Prise en main ${i+1} / ${P.length}</div><h3>${P[i][0]}</h3><p>${P[i][1]}</p><div class="row"><button class="btn" id="tq">Fermer</button><button class="btn prim" id="tn">${i<P.length-1?'Suivant':'C\u2019est parti'}</button></div></div>`;
  $('#modal').classList.add('on'); $('#tq').onclick=()=>$('#modal').classList.remove('on'); $('#tn').onclick=()=>{ if(++i<P.length) show(); else $('#modal').classList.remove('on'); }; }; show(); }
window.A3D=A; window.__cam=()=>CAM; window.__refresh=()=>rebuild(); window.__apply=applySolutions; window.__tests=i=>runTests(MS()[i]); window.__switch=switchSlot; window.__fresh=()=>{ S=Object.assign(freshState(),{id:S.id}); rebuild(); }; window.__mission=i=>openMission(i); window.__view=view; window.__sel=n=>{ A.select(n); refreshUI(); };
addEventListener('load',init);

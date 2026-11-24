const {chromium}=require('playwright'); const fs=require('fs');
(async()=>{const [f,inp,out]=process.argv.slice(2); const req=JSON.parse(fs.readFileSync(inp));
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}); const p=await b.newPage({viewport:{width:1400,height:900}});
 p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort()); await p.route(/firebasedatabase/,r=>r.fulfill({status:200,body:'null'}));
 await p.goto('file://'+f); await p.waitForTimeout(800);
 const res={};
 for(const r of req){
  res[r.id]=await p.evaluate(r=>{ const w=document.querySelector('#tgtWrap'); w.classList.remove('hidden'); const bx=document.querySelector('#tgtBox'); bx.style.width='640px'; bx.style.height='420px';
    const tv=MS.tv; tv.resize(); const C=G.compile({features:r.feats}); tv.setModel(C); const A=G.analyze({features:r.all}); tv.cam.yaw=-0.85; tv.cam.pitch=0.55; tv.cam.ortho=false; tv.resize(); tv.fit(A.bbox); tv.cam.dist*=1.1; tv.draw();
    const c=document.createElement('canvas'); c.width=tv.cv.width; c.height=tv.cv.height; const g=c.getContext('2d'); g.fillStyle='#f4f7fb'; g.fillRect(0,0,c.width,c.height); g.drawImage(tv.cv,0,0); return c.toDataURL('image/png'); },r);
 }
 fs.writeFileSync(out,JSON.stringify(res)); console.log(Object.keys(res).length,'vues CAO'); await b.close();})();

const {chromium}=require('playwright'); const fs=require('fs');
(async()=>{const [f,out]=process.argv.slice(2); const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const p=await b.newPage({viewport:{width:1400,height:860}}); p.on('pageerror',e=>console.log('ERR',e.message));
 await p.addInitScript(()=>{localStorage.setItem('anim3d_tour','1');});
 await p.goto('file://'+f); await p.waitForTimeout(1200);
 await p.evaluate(()=>{document.querySelector('#idN').value='T';document.querySelector('#idP').value='E';document.querySelector('#idGo').click();});
 const plan=await p.evaluate(()=>CFG.missions.map(m=>m.steps.map((s,k)=>k===0||!!s.do))); const rig=await p.evaluate(()=>CFG.missions.map(m=>!!(m.ui&&m.ui.includes('rig'))));
 const res={};
 for(let i=0;i<plan.length;i++) for(let k=0;k<plan[i].length;k++){ if(!plan[i][k]) continue;
   await p.evaluate(([i,k])=>{ __apply(i-1); __mission(i); const st=CFG.missions[i].steps; for(let j=0;j<=k;j++) if(st[j].do) st[j].do(A3D); __refresh(); },[i,k]);
   await p.waitForTimeout(250);
   const buf=await p.screenshot({type:'jpeg',quality:72,clip:rig[i]?{x:380,y:52,width:770,height:638}:{x:380,y:52,width:1020,height:808}});
   fs.writeFileSync('/tmp/stp.jpg',buf); require('child_process').execSync(`python3 -c "from PIL import Image;im=Image.open('/tmp/stp.jpg');im=im.resize((560,int(560*im.height/im.width)),Image.LANCZOS);im.save('/tmp/stp2.jpg',quality=70,optimize=True)"`);
   res['m'+i+'s'+k]='data:image/jpeg;base64,'+fs.readFileSync('/tmp/stp2.jpg').toString('base64');
 }
 fs.writeFileSync(out,JSON.stringify(res)); console.log(Object.keys(res).length,'images',Math.round(fs.statSync(out).size/1024)+' Ko');
 await b.close();})();

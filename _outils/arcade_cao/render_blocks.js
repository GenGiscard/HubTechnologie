// Rend des extraits de programmes en PNG (base64) + leur code JS, à partir d'un fichier TP construit
const {chromium}=require('playwright'); const fs=require('fs');
(async()=>{
const [page_file, in_json, out_json]=process.argv.slice(2);
const items=JSON.parse(fs.readFileSync(in_json,'utf8'));
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1600,height:1400},deviceScaleFactor:+(process.env.DSF||2)});
await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort()); await p.route(/firebasedatabase/,r=>r.abort());
await p.goto('file://'+page_file); await p.waitForTimeout(600);
await p.evaluate(()=>{ document.body.innerHTML='<div id="rb" style="position:absolute;left:0;top:0;width:1500px;height:1300px;background:#fff"></div>';
  const theme=Blockly.Theme.defineTheme('cours',{base:Blockly.Themes.Classic,componentStyles:{workspaceBackgroundColour:'#ffffff'},fontStyle:{family:'Segoe UI, sans-serif',size:11}});
  window.RW=Blockly.inject('rb',{renderer:'zelos',theme,readOnly:false,trashcan:false,scrollbars:false,zoom:{startScale:1},sounds:false}); });
const out={};
for(const it of items){
  const r=await p.evaluate(x=>{ RW.clear(); Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(x),RW); RW.cleanUp(); RW.scroll(0,0); const nb=RW.getBlockById('NEW'); try{ Blockly.common.setSelected(nb||null); }catch(e){}
    const bb=RW.getBlocksBoundingBox(); const m=RW.getMetrics(); RW.scroll(-bb.left+10, -bb.top+10);
    let code=''; try{ code=genCode(RW);}catch(e){code='';}
    const svg=document.querySelector('#rb .blocklyBlockCanvas').getBoundingClientRect();
    return {code, x:svg.left, y:svg.top, w:svg.width, h:svg.height}; }, it.xml);
  await p.waitForTimeout(80);
  const buf=await p.screenshot({clip:{x:Math.max(0,r.x-6),y:Math.max(0,r.y-6),width:r.w+12,height:r.h+12},omitBackground:false});
  out[it.id]={png:'data:image/png;base64,'+buf.toString('base64'),code:r.code,w:Math.round(r.w+12),h:Math.round(r.h+12)};
}
fs.writeFileSync(out_json,JSON.stringify(out)); console.log('rendered',Object.keys(out).length); await b.close();})();

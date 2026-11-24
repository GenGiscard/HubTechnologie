import json,sys,os
D=os.path.dirname(os.path.abspath(__file__))
def djb(s):
    h=5381
    for c in s: h=((h*33)^ord(c))&0xffffffff
    return h
def build(level,out,imgs=None):
    t=open(D+'/src/template.html').read()
    bundle=open(D+'/three_bundle.js').read().replace('</script','<\\/script')
    cfg=open(D+'/cfg/helpers.js').read()+'\n'+open(D+f'/cfg/cfg_{level}.js').read().replace('profHash:0',f'profHash:{djb("Agostini2025")}')
    if imgs is None:
        p=D+f'/imgs_{level}.json'; imgs=json.load(open(p)) if os.path.exists(p) else {}
    cfg+='\nwindow.IMG3D='+json.dumps(imgs)+';'
    eng=open(D+'/src/engine.js').read()
    t=t.replace('/*THREE*/',bundle,1).replace('/*CFG*/',cfg,1).replace('/*ENGINE*/',eng,1)
    open(out,'w').write(t); return out
if __name__=='__main__':
    lv=sys.argv[1]; print(build(lv,sys.argv[2] if len(sys.argv)>2 else f'/tmp/anim_{lv}.html', {} if '--noimg' in sys.argv else None))

# Découpe les planches Gemini (fond magenta), enlève le fond, réduit en vrai pixel art.
import numpy as np, json, base64, io, sys
from PIL import Image
SPEC={ # nom: (largeur, hauteur cible en pixels HD, ancrage, nb images)
 'heros':(32,32,'bas',4),'asteroide':(32,32,'centre',4),'fantome':(32,32,'centre',4),'slime':(32,32,'bas',4),'chauve_souris':(32,32,'centre',4),
 'poisson':(32,32,'centre',4),'vaisseau':(32,32,'centre',4),'boss':(64,64,'centre',4),'piece':(32,32,'centre',4),
 'etoile':(32,32,'centre',4),'coeur':(32,32,'centre',2),'pomme':(32,32,'centre',2),'cristal':(32,32,'bas',4),
 'bombe':(32,32,'centre',3),'drapeau':(32,32,'bas',4),'explosion':(32,32,'centre',6),'tir':(8,16,'centre',2),
 'panier':(32,32,'bas',1),'balle':(12,12,'centre',1),'raquette':(48,8,'plein',1),'mur':(32,32,'plein',1),'briques':(32,16,'plein',4)}
def is_bg(a):
    r,g,b=a[...,0].astype(int),a[...,1].astype(int),a[...,2].astype(int)
    return (r-g>70)&(b-g>70)&(abs(r-b)<100)
def split(im,n):
    a=np.asarray(im.convert('RGB')).astype(int); H,W,_=a.shape
    dark=(a.sum(2)<200).mean(0)  # colonnes presque noires
    cuts=[0]
    for k in range(1,n):
        x0=W*k//n; win=range(max(0,x0-W//(4*n)),min(W,x0+W//(4*n)))
        best=max(win,key=lambda x:dark[x]); cuts.append(best if dark[best]>.6 else x0)
    cuts.append(W)
    return [im.crop((cuts[i]+6,6,cuts[i+1]-6,H-6)) for i in range(n)]
def process(name,path):
    TW,TH,anc,n=SPEC[name]; im=Image.open(path).convert('RGB')
    if name=='explosion': im=im.crop((0,206,im.width,466))
    cells=[np.asarray(c).astype(int) for c in split(im,n)]
    h=min(c.shape[0] for c in cells); w=min(c.shape[1] for c in cells); cells=[c[:h,:w] for c in cells]
    masks=[~is_bg(c) for c in cells]
    # nettoyage : enlever les petits points isolés (bruit JPEG)
    ys,xs=np.where(np.any(masks,axis=0))
    y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    bw,bh=x1-x0,y1-y0; s=max(bw/TW,bh/TH) if anc!='plein' else None
    out=Image.new('RGBA',(TW*n,TH),(0,0,0,0)); O=np.zeros((TH,TW*n,4),np.uint8)
    for k,(c,m) in enumerate(zip(cells,masks)):
        if anc=='plein': sx,sy=bw/TW,bh/TH; offx=offy=0; uw,uh=TW,TH
        else:
            sx=sy=s; uw,uh=int(round(bw/s)),int(round(bh/s))
            offx=(TW-uw)//2; offy=(TH-uh) if anc=='bas' else (TH-uh)//2
        for ty in range(uh):
            for tx in range(uw):
                ya,yb=int(y0+ty*sy),max(int(y0+(ty+1)*sy),int(y0+ty*sy)+1); xa,xb=int(x0+tx*sx),max(int(x0+(tx+1)*sx),int(x0+tx*sx)+1)
                # échantillonne le centre du bloc (évite les bords flous)
                cy0,cy1=ya+(yb-ya)//4,yb-(yb-ya)//4; cx0,cx1=xa+(xb-xa)//4,xb-(xb-xa)//4
                if cy1<=cy0: cy0,cy1=ya,yb
                if cx1<=cx0: cx0,cx1=xa,xb
                mm=m[cy0:cy1,cx0:cx1]
                if mm.mean()<.5: continue
                px=c[cy0:cy1,cx0:cx1][mm]; q=(px>>4); key=q[:,0]*256+q[:,1]*16+q[:,2]
                vals,cnt=np.unique(key,return_counts=True); best=vals[cnt.argmax()]
                col=px[key==best].mean(0)
                O[offy+ty,k*TW+offx+tx]=[int(col[0]),int(col[1]),int(col[2]),255]
    out=Image.fromarray(O,'RGBA'); b=io.BytesIO(); out.save(b,'PNG',optimize=True)
    return {'w':TW,'h':TH,'n':n,'src':'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()}, out
if __name__=='__main__':
    import os
    res=json.load(open('hd.json')) if os.path.exists('hd.json') else {}
    for nm in sys.argv[1:]:
        d,img=process(nm,'raw/%s.png'%nm)
        if nm=='briques':
            for k,key in enumerate(['brique','brique_bleue','brique_verte','brique_or']):
                fr=img.crop((k*32,0,k*32+32,16)); b=io.BytesIO(); fr.save(b,'PNG',optimize=True); res[key]={'w':32,'h':16,'n':1,'src':'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()}
        else: res[nm]=d
        img.resize((img.width*8,img.height*8),Image.NEAREST).save('prev_%s.png'%nm)
        print(nm,len(d['src'])//1024,'Ko')
    json.dump(res,open('hd.json','w'))

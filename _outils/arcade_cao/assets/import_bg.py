# Fonds d'écran : réduction à la résolution d'affichage (2 px par pixel de jeu), palette réduite
import json, io, base64
from PIL import Image
SPEC={'espace':((0,0,1050,896),0.15),'foret':(None,.3),'nuit':(None,.2),'ocean':(None,.25),'ciel':(None,.15),'neon':(None,.3),'grotte':(None,.4)}
res={}
for k,(crop,par) in SPEC.items():
    im=Image.open('assets/raw/fond_%s.png'%k).convert('RGB')
    if crop: im=im.crop(crop)
    H=240; W=320 if im.width/im.height<2 else round(im.width*H/im.height/2)*2
    im=im.resize((W,H),Image.BOX).quantize(colors=96,method=Image.MEDIANCUT,dither=Image.Dither.NONE).convert('RGB')
    b=io.BytesIO(); im.save(b,'PNG',optimize=True)
    res[k]={'w':W,'h':H,'par':par,'src':'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()}
    im.save('/tmp/bg_%s.png'%k); print(k,W,H,len(b.getvalue())//1024,'Ko')
json.dump(res,open('assets/bg.json','w'))

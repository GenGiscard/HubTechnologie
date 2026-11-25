import json,re,os
H=os.path.dirname(os.path.abspath(__file__))
hd=json.load(open(H+'/hd.json'))
for k in ('heros',): 
    if k in hd: hd[k]['anim']='marche'
for k,f in {'piece':10,'etoile':6,'coeur':3,'pomme':1.5,'bombe':10,'drapeau':8,'boss':6,'cristal':5,'vaisseau':12,'chauve_souris':10,'heros':8,'fantome':5,'slime':6,'poisson':7,'explosion':14,'tir':12}.items():
    if k in hd: hd[k]['fps']=f
p=H+'/../src/images.js'; s=open(p).read()
s=re.sub(r'const HD=\{.*?\};\n','const HD='+json.dumps(hd,separators=(',',':'))+';\n',s,count=1,flags=re.S)
bg=json.load(open(H+'/bg.json')) if os.path.exists(H+'/bg.json') else {}
s=re.sub(r'const BGS=\{.*?\};\n','const BGS='+json.dumps(bg,separators=(',',':'))+';\n',s,count=1,flags=re.S)
open(p,'w').write(s); print(len(hd),'sprites HD,',os.path.getsize(p)//1024,'Ko')

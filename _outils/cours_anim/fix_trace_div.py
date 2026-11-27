# met en forme le bloc de trace écrite placé dans un div (gabarit transmissions / CAO / algo)
import sys, re
f=sys.argv[1]; s=open(f,encoding='utf-8').read()
s=re.sub(r'<div id="sTrace" style="[^"]*">','<div id="sTrace" class="trace-bloc">',s)
s=re.sub(r'<div style="font-size:12\.5px;font-weight:900;letter-spacing:1px;color:#64748b;margin-bottom:8px">TRACE ÉCRITE — À RECOPIER SUR LE CAHIER</div>','<h2>Trace écrite</h2><p class="tr-consigne">À recopier sur le cahier, schéma compris.</p>',s)
s=re.sub(r'(<canvas id="cvTrace" width="\d+" height="\d+") style="[^"]*"',r'\1 class="tr-schema"',s)
i=s.find('id="sTrace"')
if i>0:
    j=s.find('<ul style="',i)
    if j>0 and j-i<2000: s=s[:j]+re.sub(r'^<ul style="[^"]*"','<ul class="tr-liste"',s[j:],count=1)
open(f,'w',encoding='utf-8').write(s); print('ok')

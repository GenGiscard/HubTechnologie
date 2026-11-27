# remplace un segment [debut, fin) d'un fichier par le contenu de fichiers js
import sys
f, debut, fin, *js = sys.argv[1:]
s = open(f, encoding='utf-8').read()
a = s.index(debut); b = s.index(fin, a)
s = s[:a] + ''.join(open(j, encoding='utf-8').read() for j in js) + '\n' + s[b:]
open(f, 'w', encoding='utf-8').write(s); print('ok', b - a)

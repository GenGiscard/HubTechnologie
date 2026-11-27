import sys
f, js = sys.argv[1], sys.argv[2]
s = open(f, encoding='utf-8').read()
a = s.index("/* ============================================================\n MOTEUR D'ANIMATIONS")
b = s.index("/* ============ NAVIGATION")
s = s[:a] + open(js, encoding='utf-8').read() + '\n' + s[b:]
open(f, 'w', encoding='utf-8').write(s); print('ok')

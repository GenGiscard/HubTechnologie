# Atelier 3D — rigger et animer un personnage

- `npm i three@0.160 esbuild` puis `npx esbuild entry.js --bundle --minify --format=iife --outfile=three_bundle.js` (three.js + OrbitControls + TransformControls inlinés dans chaque fichier).
- `src/engine.js` : personnage procédural, 15 os, peau liée automatiquement (poids par distance aux os), gizmo de rotation, frise d'images clés, interpolation linéaire / lisse, courbes, missions et tests.
- `cfg/cfg_5e.js` (poser et animer un héros déjà riggé), `cfg/cfg_4e.js` (placer les articulations, hiérarchie, skinning, saut, salto), `cfg/cfg_3e.js` (rig + cycle de marche).
- `python3 build3d.py 5e sortie.html` construit un fichier ; `node gen_imgs.js fichier.html imgs_5e.json` régénère les captures des étapes ; `node v3d.js fichier.html` vérifie que chaque solution passe et que l'étape d'avant échoue.
- Copies rendues : Firebase `scores_tp/anim3d_5e|4e|3e`. Solution du professeur : bouton Prof, mot de passe des tableaux de bord.

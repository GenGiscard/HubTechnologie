# Journal de bord — Portail Technologie ESTIC

> À joindre en pièce jointe avec `portail_technologie_complet.zip` au début de chaque
> nouvelle conversation. Permet de reprendre le chantier sans rien réexpliquer.

> **Piège résolu — le portail en double.** Le site servait un `index.html` qui était un
> fork ancien du portail (emojis d'origine, sans les 10 jeux `03c`, sans les 2 dernières
> séquences), et qui divergeait en silence à chaque ajout. Le portail EST désormais
> `index.html` : un seul fichier, plus de doublon. Ne jamais recréer
> `000_portail_technologie.html`.






## Corrigés détaillés CAPET (18/10/2026)

286 corrigés enrichis : 14 TP (6 missions + 3 exercices sur copie) et 14 sujets types (toutes
les questions). Chacun : étapes numérotées, animation (canvas animé, « Rejouer »),
vérification, erreur fréquente, bouton mini-cours. Partie E des sujets : étapes seules.
- Données : `_outils/corriges_detail/<page>.js` (DETAILS({...}, {notions propres})).
- Moteur `_outils/corriges_detail/_moteur.js`, injecteur `_outils/ajouter_corriges_detailles.py`
  (relançable), aperçu `_outils/corriges_detail/_apercu.js`.
- Bibliothèque de mini-cours rafraîchie dans les 6 anciens sujets (toutes les notions).
- ORDRE COMPLET après régénération : générateur → corrigés (TP) / mini-cours (sujets)
  → schémas → corrigés détaillés.
- Corrections d'énoncés : TP trains mission 6 (rapport ωplanétaire ÷ ωcouronne = −4),
  sujet hydraulique E1 (800 000 N), sujet liaisons E1 (h = −2).

## Schémas dans les TP et sujets CAPET (18/10/2026)

174 schémas ajoutés aux 14 TP et 14 sujets types CAPET : un par mission de calcul (TP)
et par question de calcul (sujets, parties A à D). Les valeurs de l'énoncé y figurent,
jamais les résultats (« ? » ou renvoi à la question précédente).
- Dessins : `_outils/schemas_capet/<page>.js` (un fichier par page), bibliothèque
  commune `_outils/schemas_capet/_lib.js` (objet SC), aperçu `_apercu.js`.
- Injection : `python3 _outils/ajouter_schemas_capet.py [pages]` — relançable, remplace
  le bloc SCHEMAS_CAPET. TP : canvas sous la consigne. Sujet : canvas sous l'énoncé.
- ORDRE après toute régénération : générateur → corrigés (TP) ou mini-cours (sujets)
  → schémas.

## CAPET SII mécanique — série 2 : 4 séquences complètes (17/10/2026)

Dynamique, énergétique, hydraulique et pneumatique, matériaux et procédés : cours, TP et
sujet type pour chacune, placés après « Frottement » dans l'index et le suivi (niveau SI).
- Cours : `01_cours_capet_{dynamique,energetique,hydraulique,materiaux}.html`
  (générateur `_outils/creer_cours_capet_meca2.py`, qui réutilise `page()` de la série 1).
- TP : `02_tp_capet_{…}.html` (générateur `_outils/creer_tp_capet_meca2.py`), corrigés et
  exercices sur copie dans `_outils/corriges_tp_capet.py`, puis injection.
- Sujets types : `05_capet_sii_{…}.html` — monte-charge, ascenseur à contrepoids,
  fendeuse de bûches, manivelle de pédalier (générateur `_outils/creer_sujets_capet_meca2.py`).
  Mini-cours : 7 notions ajoutées à `minicours.js` (pfd, momentinertie, energiecinetique,
  verindebit, traction, indiceperf, flexionrect).

## CAPET SII mécanique — 4 séquences (17/10/2026)

Quatre séquences cours + TP ajoutées après « Spécification géométrique » dans `index.html`
et dans le suivi des classes (niveau SI).
- Cinématique : `01_cours_capet_cinematique.html` (bielle-manivelle animée, loi x(θ),
  équiprojectivité et CIR réglables) + `02_tp_capet_cinematique.html`.
- Liaisons et hyperstatisme : `01_cours_capet_liaisons.html` (11 liaisons sur trièdre,
  simulateur d'arbre sur deux paliers) + `02_tp_capet_liaisons.html`.
- Roulements : `01_cours_capet_roulements.html` (anatomie animée, dilatation, L10 en
  échelle log) + `02_tp_capet_roulements.html`.
- Frottement : `01_cours_capet_frottement.html` (plan incliné animé, embrayage, courroie
  d'Euler) + `02_tp_capet_frottement.html`.
TP : 7 missions, tout visible dès l'ouverture, progression acceptant le désordre,
clés `tp_capet_<thème>`. Corrigés et 3 exercices sur copie par TP dans
`_outils/corriges_tp_capet.py`, injectés par `_outils/ajouter_corriges_tp_capet.py`.
Générateurs : `_outils/creer_cours_capet_meca.py` et `_outils/creer_tp_capet_meca.py`
(relancer le générateur de TP efface les corrigés : relancer ensuite l'injection).
Sujets types (4 h, /100, réponses vérifiables uniquement : valeurs et choix uniques) :
`05_capet_sii_cinematique.html` (compresseur), `05_capet_sii_liaisons.html` (convoyeur,
vérin de hayon, tiroir), `05_capet_sii_roulements.html` (arbre de réducteur),
`05_capet_sii_frottement.html` (tondeuse autoportée). Générateur
`_outils/creer_sujets_capet_meca.py`, puis `_outils/ajouter_minicours.py` (9 notions
ajoutées à `minicours.js` : vitesseangulaire, loientree, equiprojectivite, cir,
hyperstatisme, chargeequiv, coulomb, embrayage, courroie).

## Mathématiques — calcul littéral (16/10/2026)

Nouvelle section « Mathématiques — cycle 4 » dans `index.html`, placée après la
Troisième. Séquence sans hub : la carte mène directement au cours et au TP.
- `01_cours_calcul_litteral.html` — 9 animations (valeur, réduire, simple et double
  distributivité, signe moins, (a + b)², factoriser, a² − b², vérifier), simulateur
  (x + a)(x + b), vérificateur de deux écritures, 7 QCM, trace écrite à la fin.
- `02_tp_calcul_litteral.html` — 9 missions + bilan, verrouillage, étoiles /27, clé
  locale `tp_calcul_litteral`. Mini-cours (fenêtre animée) sur les missions 4 à 9.
  Réponses saisies vérifiées par un analyseur d'expressions : égalité exacte des
  polynômes, puis forme exigée (développée réduite, ou factorisée au maximum).
Sources dans `/home/claude/maths/` (commun.js, commun.css, cours.html, tp.html, build.py).

> Volontairement HORS du suivi des classes : la régénération du suivi ne reconnaît que
> les sections Cinquième, Quatrième, Troisième et Lycée.
## Comment reprendre dans une conversation neuve

1. Télécharge `portail_technologie_complet.zip` (il contient tout l'état courant).
2. Ouvre une **nouvelle conversation** et joins le ZIP **et ce fichier**.
3. Écris simplement : « Reprends le chantier, voici l'état. Aujourd'hui : … »

Une conversation neuve repart avec un contexte vide : c'est ce qui rend le travail
rapide à nouveau. Tout l'historique utile tient dans ce fichier.

## Comment faire durer une conversation plus longtemps

- **Grouper les demandes** : une liste numérotée de 5 corrections dans un seul message
  coûte bien moins qu'un aller-retour par correction.
- **Nommer le fichier concerné** : « dans `02_tp_ponts.html`, … » évite une phase
  d'exploration à chaque fois.
- **Un chantier par conversation** : corriger les TP de 4e, puis ouvrir une nouvelle
  conversation pour les évaluations. Éviter de tout mélanger.
- **Signaler les bugs avec le symptôme exact** (« rien ne se passe au clic sur Suivant »)
  plutôt qu'en termes généraux : le diagnostic est immédiat.

## Conventions techniques du corpus

> **Important —  doit accompagner les fichiers HTML.**
> Le logo était auparavant embarqué en base64 dans chaque page ; cette combinaison
> (image base64 + script interne) déclenchait une détection antivirus « trojan »
> en faux positif. Il est désormais référencé comme fichier externe : garder
>  à la racine du dossier, à côté des pages.

- Fichiers **HTML autonomes**, un seul fichier par activité, aucun CDN, fonctionne hors-ligne.
- **Pas d'`onclick` inline**, pas de `confirm`/`prompt`, apostrophes typographiques réelles.
- **Aucun émoji** : les pictogrammes sont des schémas vectoriels (`SCHEMA(ctx,'nom',x,y,T)`).
- **Pas de `localStorage` dans les artefacts Claude.ai**, mais utilisé dans les fichiers
  déployés sur GitHub Pages pour la progression des TP.
- Police Segoe UI. Fonds : `#fdf9f0` (TP), `#F8F4EC` (cours projetés), `#fff` (schémas).
- Vérification obligatoire avant livraison : `node --check` sur chaque `<script>`,
  puis test jsdom, puis **rendu visuel des canvas** (voir plus bas).

## Structure des TP

7 à 10 missions, barre de progression, verrouillage progressif (`etat.debloque`),
score cumulé, code de déverrouillage des exercices compétitifs en fin de parcours.
Bilan final : validation globale, remélange à chaque tentative, aucune réponse dévoilée,
barème dégressif (3 étoiles au 1er essai, 2 au 2e, 1 ensuite).

## Firebase

- Base : `evaluation-bloc-default-rtdb.europe-west1.firebasedatabase.app`
- Chemin des évaluations : `/evaluations/<séquence>` — **une règle doit l'autoriser**
  (voir la règle `evaluations` fournie ; sans elle, le tableau de bord affiche
  « Lecture refusée par Firebase »).
- Mot de passe des tableaux de bord : `Agostini2025`
- Tableau de bord global : `000_tableau_de_bord.html`
- Portail / page d'accueil du site : `index.html`
- Champs écrits : `nom, prenom, classe, score, sur, note20, duree_s, date, reponses`

## Pièges rencontrés — à ne pas refaire

- **Supprimer un module** : délimiter le bloc par ses bornes explicites, jamais
  « jusqu'au commentaire suivant ». Deux régressions ont été causées ainsi
  (perte du script de trace, puis de toute la navigation du cours habitat).
- **Toujours retester l'interaction** après une suppression, pas seulement le rendu.
- **Variables non déclarées** : une `ReferenceError` silencieuse bloquait le
  déverrouillage de l'exercice 3 du TP ponts.
- **Vérifier les schémas au rendu** : plusieurs erreurs de géométrie (roues de tramway,
  goupilles inversées, flèches à double pointe) n'étaient visibles qu'à l'image.

## Outils de vérification (dans le ZIP)

- **`_outils/verif_rendu2.js` — à utiliser par défaut.** Convertit les dessins canvas
  d'une page en SVG. Usage :
  `node verif_rendu2.js page.html sortie.svg idDuCanvas ["extrait de JS"]`
  Le 5e argument, facultatif, est exécuté dans la page avant capture (variables `w`
  et `d` disponibles) : indispensable pour un canvas qui n'apparaît qu'après un clic.
- `_outils/verif_rendu.js` : **ancienne version, à ne plus utiliser pour les schémas.**
  Trois défauts la rendaient trompeuse : `translate()` était un stub vide (tous les
  symboles dessinés par `SCHEMA(ctx,nom,x,y,T)` retombaient à l'origine, planche vide),
  les getters de style renvoyaient une chaîne vide (l'idiome `c.strokeStyle=c.fillStyle`
  du corpus donnait un trait invisible, donc **tous les traits disparaissaient**), et
  `arc()` interpolait linéairement au lieu de suivre le sens du canvas
  (`arc(x,y,r,PI,0)` sortait le demi-cercle du bas au lieu du haut).
  C'est probablement la cause des erreurs de géométrie passées.
- Nécessite `npm install jsdom` et `pip install cairosvg` pour la conversion en PNG.

## État du corpus

- **215 fichiers HTML** + `plan_palier.svg`
- Portail : **`index.html`** (renommé depuis `000_portail_technologie.html`)
- Hubs de séquence : 34 · Cours : 35 · TP : 34
- Exercices compétitifs : 71 · Évaluations : 31 · Autres : 6

> **Séquences cycle de vie et matériaux : NE PLUS Y TOUCHER.** Mat a validé leur
> fonctionnement le 01/09/2026. Les réserves notées ci-dessous (blobs base64 du cours
> cycle de vie, polices Google de matériaux, emojis, `onclick` inline) sont **classées
> sans suite** à sa demande. Ne pas les « corriger » spontanément.

## Séquence « Développement durable & cycle de vie » — intégrée

Importée depuis `CYCLE-DE-VIE-main.zip`, placée dans le portail juste après
Ponts (Habitat) et Les Énergies. Fichiers renommés au format du corpus :
`00_hub_cycle_de_vie.html` (créé sur le gabarit du hub énergies),
`01_cours_dd_cycle_vie.html`, `02_tp_dd_carnet.html`, `03_simulateur_cycle_vie.html`.
Ajoutés au cours : bloc objectifs/compétences après le hero, trace écrite (schéma
5 blocs + 4 phrases) après le chapitre 5, avant « Pour aller plus loin ».
Le carnet remonte sur `resultats_dd_carnet`, déjà couvert par les règles Firebase.

> **ALERTE ANTIVIRUS — à traiter.** `01_cours_dd_cycle_vie.html` embarque les deux
> autres pages en base64 dans son propre script : `CARNET_BASE64` (502 Ko) et
> `SIMU_BASE64` (337 Ko), ouvertes via `URL.createObjectURL`. C'est exactement la
> combinaison « gros base64 + script interne » qui avait déclenché la détection
> « trojan » en faux positif. Le logo base64 a été remplacé par `logo_estic.png`
> dans les 3 fichiers, mais **les deux blobs restent**. Les trois pages étant
> désormais côte à côte dans le dossier, ils peuvent être remplacés par de simples
> liens `href` : cela retire ~840 Ko et le déclencheur. À valider avec Mat car cela
> change le comportement des deux boutons (blob → lien direct).

Autres écarts aux conventions dans ces 3 fichiers, non corrigés (hors demande) :
emojis nombreux dans les titres et boutons, 2 `onclick` inline, apostrophes en
entités `&rsquo;` plutôt que typographiques réelles.

## Séquence « Les matériaux et leurs propriétés » — intégrée

Importée depuis `Materiaux-main.zip`, placée dans le portail juste après le cycle de vie.
Renommages (les liens internes des 6 fichiers ont été recâblés) :
`index.html` → `00_hub_materiaux.html` · `02_cours_materiaux.html` → `01_cours_materiaux.html`
`03_exercices_materiaux.html` → `02_tp_materiaux.html`
`06_revision_materiaux.html` → `03_jeu_defi_materiaux.html`
`04_evaluation_materiaux.html` (inchangé) · `05_tableau_bord.html` → `05_tableau_bord_materiaux.html`

L'évaluation remonte sur `resultats_materiaux`, déjà couvert par les règles Firebase
(nœud sans `.validate`, donc les champs `groupe, classe, score, points, max_points,
duree_sec, timestamp, date_iso, reponses` passent tels quels).
Corrigé : le hub pointait vers `logo-estic.png` (tiret) — fichier inexistant dans le
corpus, qui utilise `logo_estic.png`.

> **Architecture à connaître avant de retoucher le cours.** `01_cours_materiaux.html`
> est un diaporama à verrouillage progressif (`slideOrder`, `refreshSlideLocks`) doublé
> d'un sommaire latéral `.nav-item`. **Ajouter une slide casse la chaîne de
> déverrouillage et désynchronise le sommaire.** Les blocs objectifs et trace écrite ont
> donc été injectés *à l'intérieur* de slides existantes : objectifs dans `s1`
> (ouverture), trace écrite dans `s12` (« À retenir »), avant le bouton d'accès aux
> activités. Compté après coup : 22 slides et 21 nav-item, inchangés.
> Outil : `python3 _outils/enrichir_materiaux.py` (idempotent).

> **Dépendance réseau — à traiter.** Les 6 fichiers chargent les polices
> *Bricolage Grotesque* et *JetBrains Mono* depuis `fonts.googleapis.com`. La convention
> du corpus est « aucun CDN, fonctionne hors-ligne ». Sans réseau, la mise en page
> retombe sur une police système. À arbitrer avec Mat : soit embarquer les polices,
> soit basculer sur Segoe UI comme le reste du corpus.

Autres écarts non corrigés (hors demande) : nombreux emojis, `onclick` inline
(23 dans le cours, 26 dans les activités).

## Verrouillage des évaluations — fait

Les **30 évaluations** du corpus sont protégées par un code, un par évaluation.
Table complète : `codes_evaluations.md`. Codes dans `_outils/codes_evaluations.json`.
Outil : `node _outils/verrouiller_evaluations.js _outils/codes_evaluations.json [--dry]`
(idempotent, refuse d'écrire si `</body>` n'est pas unique).

Choix de Mat : **aucune persistance**. Ni localStorage ni sessionStorage — le code est
redemandé à chaque ouverture, y compris après rechargement. Le professeur garde la main
sur le moment où la classe entre en évaluation. Ne pas « améliorer » en ajoutant une
mémorisation : c'est un choix, pas un oubli.
Aucune collision avec les 30 codes de jeux (vérifié par script).
`04_evaluation_materiaux.html` n'est PAS verrouillée (séquence classée sans suite).

> **Titres du tableau de bord — CORRIGÉ.** Le tableau `EVALS` de
> `000_tableau_de_bord.html` contenait 10 titres faux ou tronqués, dont trois entrées
> libellées « Habitat & Ouvrages » (5e habitat, 4e domotique, 3e robotique). Les titres
> sont désormais repris du `<h1>` réel de chaque évaluation. Vérifié : `f`, `fb` et `niv`
> strictement inchangés (aucune donnée déplacée), plus aucun titre en double.

## Bug corrigé — verrouillage mort dans `02_tp_dispatching.html`

Trouvé le 01/09/2026 en testant l'interaction (pas le rendu). La modernisation visuelle
de ce TP (chantier 5) avait remplacé le HTML des missions 1 et 3, mais **laissé en place
l'ancien JavaScript** : `initA1` cherchait `#cas1` et `initA3` cherchait `#pannes3`,
tous deux supprimés. La `TypeError` levée au chargement **interrompait tout le reste du
script** : aucun verrou n'était posé, et les 10 missions étaient ouvertes d'emblée.
Un élève pouvait sauter directement au code de fin.

Mesuré : ce TP posait **0 verrou** au chargement, contre **9** pour tout autre TP de 3e.

Correction : un `if(!zone) return;` commenté dans chacun des deux blocs, plutôt qu'une
suppression — le journal met en garde contre les suppressions par bornes floues, et le
code mort peut resservir. Vérifié après coup : 0 erreur JS, 9 verrous posés.

**À vérifier sur les autres TP modernisés** au fur et à mesure du chantier 5 : le test
utile est le nombre de `.verrou` au chargement, pas l'aspect visuel.

> **Fichier orphelin.** `02_tp_station_meteo_v3.html` n'est référencé par aucune page
> du corpus (ni portail, ni hub, ni TP). Il délivre pourtant le code `STATION7`, comme
> `02_tp_station_meteo.html` qui, lui, est bien câblé. Vraisemblablement une version de
> travail oubliée. À supprimer après vérification — non fait, pour ne rien perdre.

## Axes de rotation — vue de face ajoutée à la serrure (02/09/2026)

Signalé par Mat sur le module 3 du cours serrure. **Deux erreurs distinctes** :
1. le pivot était à `(420, yCes+40)` alors que le barillet, rectangle de `yCes` à
   `yCes+96`, a son centre à `yCes+48` : 8 px d'écart ;
2. surtout, **l'axe était incompatible avec la vue**. Le schéma est une COUPE
   LONGITUDINALE : l'axe du barillet y est horizontal, dans le sens de la clé.
   Le faire pivoter dans le plan de l'écran le faisait basculer comme une bascule,
   mouvement qui n'existe pas.

Correction retenue par Mat : la coupe ne tourne plus du tout, et une **vue de face**
a été ajoutée à droite (`vueDeFace()`), où l'axe est perpendiculaire à l'écran —
le barillet y tourne réellement autour de son centre. La rainure de clé, solidaire
du barillet, rend la rotation lisible ; le disque passe au vert quand la serrure
s'ouvre. L'étiquette « ligne de césure » a été déplacée à gauche, elle passait sous
la vue de face.

> **Règle générale à retenir.** Avant d'animer une rotation, vérifier que l'axe est
> compatible avec la VUE choisie. Une rotation peut être juste géométriquement
> (pivot au bon endroit) et fausse physiquement. Seul le rendu le montre.
> Audit du corpus : 233 appels à `rotate()` dans 93 fichiers, mais **une seule**
> rotation à pivot explicite (celle-ci) — les autres tournent autour de l'origine
> après un `translate`, motif correct par construction. Cela ne garantit pas leur
> justesse physique : à contrôler à l'image, en priorité sur atelier vélo (8),
> énergies (8), engrenages (7) et sécurité routière (6).

## Flèches droites — le trait dépassait la pointe (RÉGLÉ 02/09/2026)

Signalé par Mat sur le cours domotique. **Cause réelle, différente de ce que j'avais
supposé** : ce n'est pas `lineCap`. Le trait était tracé jusqu'à (x2,y2), là où se
trouve aussi la POINTE du triangle. Or près de la pointe le triangle devient plus
FIN que le trait : pour une épaisseur de 4 px et une pointe de 11, le trait déborde
des bords obliques sur les 4 derniers pixels et forme un bout carré qui dépasse.

Correction : le trait s'arrête à la BASE du triangle, soit `L*cos(0.45)` en arrière
de la pointe, dans l'axe de la flèche ; `lineCap='butt'` est forcé en plus pour
éviter tout héritage d'un `'round'` laissé par un dessin précédent.

Outil : `python3 _outils/corriger_fleches.py [--dry]` (idempotent, marqueur
`/*fleche-ok*/`). Il s'adapte aux variantes : pointe en constante `L=11`, en nombre
écrit en dur, ou proportionnelle à l'épaisseur `t=(lw||4)*3`.
**7 fichiers corrigés** : cours aéro, algo, domotique, énergies, robotique,
simulation, et TP bureau aéro. Syntaxe vérifiée, rendu contrôlé à l'image.

Restent 2 fichiers dont la fonction ne correspond à aucune variante connue et qui
n'ont pas été touchés : `01_cours_besoin.html`, `02_tp_bureau_simulation.html`.
À traiter à la main, en contrôlant au rendu.

## Emojis dessinés au canvas — RÉGLÉ (02/09/2026)

**70 emojis dans 34 fichiers** échappaient à tous les contrôles : ils ne sont pas dans
le HTML mais dans des `ctx.fillText('\ud83c\udfe0',x,y)`. C'est ce qui explique que les
audits « aucun emoji » passaient au vert depuis le début.

Remplacés par les pictogrammes vectoriels de la bibliothèque `SCHEMA` du corpus
(extraite dans `_outils/schema_lib.js`, injectée dans les fichiers qui ne l'avaient pas).
Outil : `python3 _outils/remplacer_emojis_canvas.py [--dry]`, table de correspondance
dans `_outils/map_emoji.json` (63 entrées).
**36 fichiers traités.** Vérifié : syntaxe JS sur tous, chargement jsdom sans erreur,
chaîne de verrouillage intacte sur les 36, rendu contrôlé à l'image.

Laissés en place car ce sont des symboles typographiques et non des emojis :
`✓` (dispatching, drone_be), `♪` (lignées), `│` (station météo).

> **Piège de l'outil.** Le pré-filtre initial faisait exploser la regex sur les gros
> fichiers (base64 du cours cycle de vie). Les 10 fichiers des séquences classées sans
> suite (cycle de vie, matériaux) sont exclus par la constante `EXCLUS` — c'est aussi
> conforme à la consigne de Mat de ne pas y toucher.

## DÉCISIONS DE MAT DU 02/09/2026 — à traiter en priorité

Quatre corrections demandées après relecture. **À faire dans cet ordre**, les deux
premières touchant les mêmes fichiers.

### A — FAIT (02/09/2026)
Mission 7 à réponse libre supprimée des **30 TP**, et missions suivantes renumérotées.
Outil : `_outils/retirer_mission7.py` (suppression par comptage de balises, jamais
par regex ; refuse d'écrire si un motif à décaler n'est pas unique, si plus de
70 lignes disparaissent, ou si une ancre témoin s'évapore).
Chaque TP passe de 10 à 9 missions : ids `a1..a9`, badges 1 à 9, 9 segments de barre.
Vérifié : syntaxe JS sur les 34 TP, **30/30 au chargement avec verrouillage
cohérent**, numérotation continue, et parcours rejoué (les calculs justes valident
et créditent le score). 21 lignes retirées par fichier, aucune sur-suppression.
Les missions « calculer » et « tracer » sont conservées : réponses vérifiables.

### (ancien) A. Supprimer les exercices à réponse libre (ancienne mission 7)
Verdict de Mat : « c'est impossible d'avoir juste avec une réponse libre ».
Le principe même est en cause, pas le réglage des mots-clés : la validation exigeait
les **trois** réponses justes simultanément et n'indiquait pas laquelle était refusée.
À supprimer partout où elle existe (30 TP : les 20 posées par l'outil + les 10 de 3e
qui l'avaient déjà). Garder les missions « calculer » et « tracer », qui ont des
réponses vérifiables.

> **ATTENTION — renumérotation obligatoire.** Retirer `a7` en laissant `a8`/`a9`/`a10`
> casse la chaîne : la boucle `for(let n=2;n<=10;n++)` cherchera un `a7` disparu et
> lèvera la TypeError qui interrompt tout le script (cf. le bug `dispatching`).
> Il faut donc décaler : a8→a7, a9→a8, a10→a9, les badges, `reussir(8→7, 9→8, 10→9)`,
> retirer un segment de barre, et ramener `n<=10`→`n<=9` et `n<10`→`n<9`.
> **Test obligatoire après chaque fichier : 8 verrous au chargement et 9 segments.**

### B et C — FAIT (02/09/2026)
Traces écrites et blocs objectifs déplacés des TP vers les COURS.
**29 cours sur 35** ont désormais objectifs + trace ; **0 TP** n'en contient plus.
Outils : `_outils/enrichir_cours.py` (pose) et `_outils/retirer_trace_tp.py` (retrait).
Les contenus viennent des configs `enrichissements_*.json` : rien n'a été réécrit.
28 cours sur 35 sont des DIAPORAMAS : les blocs sont injectés À L'INTÉRIEUR de la
première et de la dernière slide, jamais en nouvelle section — le nombre de slides
est vérifié inchangé après chaque fichier.
**TERMINÉ le 02/09 : 35 cours sur 35** ont objectifs, compétences et trace écrite.
- 3 pages déroulantes (lecture_plan, roue_tramway, serrure) : outil dédié
  `_outils/enrichir_cours_deroulants.py` + `contenus_cours_deroulants.json`
  (ancrages `</h1>` et `</body>`, tous deux uniques et vérifiés).
- 3 diaporamas (design, eau, evolution) : voir l'incident ci-dessous.

> **INCIDENT — contenu de Mat supprimé puis récupéré.** Cinq TP avaient été enrichis
> par Mat AVANT ce chantier (ponts, énergies, régie des eaux, bureau de design,
> lignées). `retirer_trace_tp.py` a retiré leurs blocs comme ceux des autres, alors
> qu'il n'existait AUCUNE config pour les réinjecter dans les cours : trois séquences
> se sont retrouvées sans objectifs ni trace nulle part (habitat et énergies étaient
> sauvés, leurs cours ayant déjà un `sObj` propre).
> Contenu récupéré depuis la sauvegarde `/tmp/sv_c/` et extrait dans
> `_outils/enrichissements_recuperes.json`, puis injecté dans les cours.
> **Leçon : avant tout retrait de masse, vérifier qu'une config existe pour chaque
> fichier touché — sinon on détruit du contenu sans pouvoir le replacer.**

`01_cours_energies.html` et `01_cours_habitat_ouvrages.html` ont une trace de Mat
d'un autre format, sans canvas. Ce n'est pas un défaut : ne pas la remplacer.

> **RÉGRESSION CAUSÉE ET RÉPARÉE — à lire avant toute suppression.**
> La première version du retrait utilisait
> `re.sub(r'\n<div id="blocObj".*?\n</div>\n', ...)`.
> Or dans plusieurs TP le `</div>` de fermeture partage sa ligne avec la suite :
> `</div> <p>7 missions progressives…`. La regex sautait donc jusqu'à un `</div>`
> bien plus loin et emportait l'en-tête, la barre de progression, jusqu'à
> **235 lignes**. **Les 30 TP ont été abîmés d'un coup.** Restaurés depuis la
> sauvegarde, puis retraités avec un **compteur de balises `<div>`/`</div>`** :
> 17 lignes retirées par fichier au lieu de 105.
> Le contrôle `.acti` seul n'avait pas suffi à détecter le dégât : il faut aussi
> comparer le NOMBRE DE LIGNES perdues à une borne, et vérifier que des ancres
> témoins (`class="progression"`, `</header>`, `id="prog"`) survivent.
> **Toujours sauvegarder avant, et diffusé ligne à ligne après.**

### (ancien) B. Déplacer les traces écrites des TP vers les cours
La trace se place **à la fin du COURS**, pas du TP. Mon erreur venait du gabarit :
`02_tp_ponts.html` contenait déjà un bloc trace, je l'ai donc reproduit dans les TP.
État actuel : **31 TP ont une trace, 2 cours sur 35 seulement**.
À faire : retirer `aTrace` des TP et le poser en fin de cours correspondant.
Les contenus existent déjà dans `_outils/enrichissements_{4e,5e,3e}.json` (clés
`titre`, `blocs`, `phrases`, `bas`) — il n'y a rien à réécrire, seulement à déplacer.

### (ancien) C. Objectifs et compétences dans les cours
Même constat : **2 cours sur 35** ont un `blocObj`. Les contenus sont dans les mêmes
configs (`objectifs`, `competences`, `repere`). Les cours n'ont pas la structure des TP
(pas de `<header class="tp">`) : prévoir un ancrage par cours, comme il a fallu le
faire pour `_outils/enrichir_lecture_plan.py` et `_outils/enrichir_cdv.py`.

### D bis. FLÈCHES — cause racine identifiée, correctif à appliquer partout

Mat : « tu mets toujours mal le triangle au bout du trait ». Diagnostic confirmé par
rendu comparatif. **Trois erreurs cumulées**, toujours les mêmes :

1. le trait est tracé **jusqu'au point d'arrivée**, puis le triangle est posé **centré
   sur ce même point** : le trait traverse la pointe et dépasse ;
2. `lineCap='round'` fait **dépasser le trait de la moitié de son épaisseur** au-delà
   du point d'arrivée, ce qui produit le bourrelet visible ;
3. sur un arc, le triangle est orienté à l'horizontale ou sur le rayon **au lieu de la
   tangente** : la pointe part de travers alors que la courbe arrive dans un autre sens.

**Méthode correcte, à utiliser systématiquement :**
```js
function FLECHE_ARC(c,cx,cy,r,a0,a1,ep,coul){
  const L=Math.max(14,ep*1.9), W=Math.max(12,ep*1.6); // pointe proportionnelle au trait
  c.strokeStyle=coul; c.fillStyle=coul; c.lineWidth=ep;
  c.lineCap='butt';                       // (1) pas de depassement du trait
  c.beginPath(); c.arc(cx,cy,r,a0,a1-L/r); c.stroke();  // (2) trait RACCOURCI de L
  const ex=cx+r*Math.cos(a1), ey=cy+r*Math.sin(a1);     // (3) pointe = point voulu
  const tx=-Math.sin(a1), ty=Math.cos(a1);              // tangente au point d'arrivee
  const nx=-ty, ny=tx, bx=ex-tx*L, by=ey-ty*L;
  c.beginPath(); c.moveTo(ex,ey);
  c.lineTo(bx+nx*W/2,by+ny*W/2); c.lineTo(bx-nx*W/2,by-ny*W/2);
  c.closePath(); c.fill();
}
function FLECHE(c,x0,y0,x1,y1,ep,coul){   // version segment droit, meme principe
  const L=Math.max(12,ep*1.9), W=Math.max(10,ep*1.6);
  const dx=x1-x0, dy=y1-y0, d=Math.hypot(dx,dy)||1, tx=dx/d, ty=dy/d;
  const nx=-ty, ny=tx, bx=x1-tx*L, by=y1-ty*L;
  c.strokeStyle=coul; c.fillStyle=coul; c.lineWidth=ep; c.lineCap='butt';
  c.beginPath(); c.moveTo(x0,y0); c.lineTo(bx,by); c.stroke();
  c.beginPath(); c.moveTo(x1,y1);
  c.lineTo(bx+nx*W/2,by+ny*W/2); c.lineTo(bx-nx*W/2,by-ny*W/2);
  c.closePath(); c.fill();
}
```
Règle à retenir : **la pointe se place au point d'arrivée, le trait s'arrête avant.**

**État au 02/09 : 1 flèche corrigée sur 97 — mais l'inventaire était trompeur.**
Sur les 6 « flèches courbes » détectées, **5 étaient des faux positifs** : la dérive
d'un avion (`01_cours_aero`), des oreilles de chat (`01_cours_ia`, x2), un cône de
lumière (`02_tp_bureau_design`) et un cône de détection (`02_tp_securite_routiere`).
Mon motif de détection (triangle précédé d'un `arc()`) est trop large : il faut
contrôler au rendu, pas au grep.
Corrigé : `flecheArc()` dans `01_cours_transmissions.html` (la flèche de rotation de
la capture de Mat). L'ancienne version orientait la pointe sur le RAYON — elle
regardait vers le centre au lieu de prolonger la courbe. Correction appliquée et
syntaxe vérifiée, mais **non confirmée à l'image** : ces flèches ne sont tracées
qu'après une interaction que `verif_rendu2.js` n'atteint pas en 2 frames.
À revoir dans le navigateur, ou en passant un état initial à l'outil.

Inventaire complet du corpus : **97 constructions de flèche dans 59 fichiers**,
dont 6 courbes (les plus visiblement fausses) :
`01_cours_aero.html`, `01_cours_ia.html` (x2), `01_cours_transmissions.html` (corrigé),
`02_tp_bureau_design.html`, `02_tp_securite_routiere.html`.
`lineCap='round'` est actif dans 61 fichiers : c'est la source du bourrelet.

À faire : passer tous les schémas du corpus au rendu avec `verif_rendu2.js` et
remplacer chaque construction de flèche par ces deux fonctions. Concerne aussi les
flèches du moteur générique du chantier 5 et celles des schémas de trace écrite.

### D. Flèches mal dessinées — exemple confirmé : les transmissions
Rendu de `cvTrain` dans `02_tp_engrenages.html` vérifié à l'image. Deux défauts :
1. **Les libellés se chevauchent** : « MOTEUR · Z1=12 · 120 tr/min » et
   « SORTIE · Z2=12 » sont centrés presque au même endroit et deviennent illisibles.
2. **Aucune flèche de sens de rotation** n'est tracée, alors que c'est le cœur de la
   notion (sens inverse entre deux roues en contact). Seuls des points rouges
   marquent une dent.
À corriger, puis passer en revue les autres schémas au rendu — l'outil
`verif_rendu2.js` est le seul fiable pour cela (voir la section outils).

## Erreur pédagogique corrigée — la roue n'est pas TRANSMETTRE (03/09/2026)

Signalée par Mat : dans la chaîne d'énergie, **c'est la CHAÎNE qui transmet**, la roue
étant l'organe d'**AGIR** (dernier maillon, effet recherché sur la route).
L'erreur s'était propagée à quatre endroits :

- `02_tp_garage_vae.html` — étiquette du schéma « LA ROUE (TRANSMETTRE → AGIR) »
  devenue « LA ROUE (AGIR) ».
- `01_cours_chaine_energie.html` — la roue figurait dans les exemples de TRANSMETTRE
  (remplacée par « cardan »), et le schéma animé annonçait « chaîne + roue » sous
  TRANSMETTRE (devenu « la chaîne »).
- `03_jeu_moteur_rush.html` — la Roue était une carte à classer en `transmettre` :
  **un élève qui répondait correctement était compté faux.** Carte retirée ;
  répartition désormais 4 / 4 / 5 / 4.
- `02_tp_atelier_velo.html` — le rôle de la roue disait « transmet le mouvement à la
  route », reformulé en « AGIT sur la route : dernier maillon ».

Vérifié après coup : toutes les occurrences restantes de « roue » près de
« transmettre » sont correctes — elles désignent la chaîne, le cardan ou la
transmission dans son ensemble. Les 4 fichiers se chargent sans erreur.

> **À surveiller dans les nouveaux contenus.** La confusion vient de ce que la roue
> se trouve en bout de chaîne : elle reçoit le mouvement transmis, mais elle ne le
> transmet pas, elle agit. Vérifier ce point à chaque séquence mécanique.

> **Lien france.tv : durée de vie limitée.** Les replays de france.tv expirent au
> bout de quelques mois et sont géo-restreints à la France. Le contrôle de liens
> morts ne teste que les fichiers locaux : à revérifier à chaque rentrée.

## Code des sorciers dans le footer des hubs (04/09/2026)

Ajouté en bas à DROITE du footer de `00_hub_habitat_5e.html` (`SORCIER7`) et
`00_hub_energies_5e.html` (`SORCIER2`).

> **Le code n'est PAS affiché d'emblée.** Les hubs sont consultés par les élèves :
> un code visible aurait supprimé le verrou de l'évaluation. Choix de Mat retenu —
> un lien discret « code prof » en gris clair, qui révèle le code au clic. Masqué
> aussi à l'impression (`@media print`).
> Ce n'est pas une sécurité : les codes restent dans le source de la page. C'est une
> protection contre le regard qui traîne, rien de plus.

**Mise à jour du 04/09** : le lien s'appelle **« technologie collège »** (et non plus
« code prof », trop explicite), et il révèle **TOUS les codes de la séquence**, chacun
avec son libellé — l'évaluation de base ET celle des sorciers.
Habitat : `ARCHE62` + `SORCIER7`. Énergies : `WATT118` + `SORCIER2`.
Le bloc est en flux normal, aligné à droite sous le texte du footer : la version
initiale en `position:absolute` aurait débordé du footer une fois les deux lignes
affichées. Imbrication corrigée aussi (plus de `<div>` dans un `<span>`).

**Généralisé le 04/09 : 30 hubs sur 34.** Outil
`python3 _outils/ajouter_codeprof.py [--dry]`, idempotent. Il lit les codes dans
`_outils/codes_evaluations.json` et les rattache à chaque hub d'après les liens
`04_evaluation_*.html` qu'il contient : aucune saisie manuelle, aucun risque de
recopier un code faux.

4 hubs sans bloc, faute d'évaluation à code :
`cycle_de_vie` et `roue_tramway` (pas d'évaluation), `lecture_plan` (chantier 7 :
seule séquence sans évaluation), `materiaux` (évaluation présente mais **non
verrouillée** — jamais de code attribué, séquence classée « ne pas toucher »).

> **Les évaluations des sorciers ne sont PAS liées depuis les hubs**, seulement
> depuis le portail. Les hubs habitat et énergies affichent pourtant leur code
> (ajout manuel antérieur). Incohérence à trancher avec Mat : soit ajouter une
> carte « Évaluation des sorciers » à ces deux hubs, soit retirer le code.

**MARCHE À SUIVRE POUR LES PROCHAINES SÉQUENCES.** Le plus simple est de relancer
`ajouter_codeprof.py` après avoir mis à jour `codes_evaluations.json` : il saute les
hubs déjà traités. Sinon, à la main : À chaque nouvelle évaluation des
sorciers, ajouter la même chose au hub correspondant :
1. dans le CSS, remplacer la règle `footer{…}` par la version avec `position:relative`
   suivie du bloc `.codeprof` (copier depuis un des deux hubs déjà faits) ;
2. juste avant `</footer>`, insérer
   `<span class="codeprof" id="cp"><button type="button" id="cpBtn" title="Codes de déverrouillage des évaluations">technologie collège</button><span class="valeur">…</span></span>`,
   avec une ligne par évaluation de la séquence :
   `<span class="ligne"><span>Évaluation</span><b>CODE</b></span>` ;
3. avant `</body>`, le petit script qui ajoute la classe `ouvert` au clic.
Le code doit correspondre à celui de `_outils/codes_evaluations.json`.

## Évaluation des sorciers — Les énergies (04/09/2026)

`04_evaluation_energies_sorciers.html`, calquée sur celle des ponts : 12 QCM,
code `SORCIER2`, Firebase `evaluations/energies_sorciers`, menu de classe 5A-5E.
Vidéo placée JUSTE AVANT l'entrée d'évaluation dans le
portail, et rappelée en tête de l'évaluation. Ajoutée au tableau de bord (32 entrées)
et à `codes_evaluations.md`.

**Vidéo remplacée le 04/09** : le lien podeduc (.mp4, qualité moindre) cède la place
à france.tv — « C'est toujours pas sorcier », saison 2, épisode
« Énergie : rien ne se crée, tout se transforme ». Remplacé aux DEUX endroits
(portail et en-tête de l'évaluation), libellés précisés avec le titre de l'épisode.

> **Le titre révèle le thème : la CONVERSION et la CONSERVATION de l'énergie.**
> Or les 12 questions ont été écrites sur le programme large de la séquence
> (renouvelable/fossile, transport haute tension, mix, sobriété). Plusieurs collent
> — turbine et alternateur, centrale thermique, barrage — mais **le cœur de
> l'épisode, « rien ne se perd, tout se transforme », n'est pas assez interrogé**.
> À revoir avec Mat : quelques questions sur les formes d'énergie, les chaînes de
> conversion et les pertes rendraient l'évaluation plus fidèle.

> **À RELIRE — vidéo non visionnée.** Les deux plateformes bloquent la lecture
> automatisée. Les 12 questions portent
> sur les notions de la séquence Énergies : renouvelable/fossile, turbine et
> alternateur, haute tension et transformateur, intermittence, équilibre
> production-consommation, centrale thermique, barrage, kWh, mix, sobriété.
> **Aucune ne s'appuie sur un contenu propre à la vidéo.** Vérifier que le
> vocabulaire correspond avant de la donner en évaluation notée.

> **Positions des bonnes réponses contrôlées AVANT écriture** (règle du 03/09) :
> le premier jet donnait 5/3/4, refusé par le garde-fou du script. Corrigé en 4/4/4,
> sans jamais trois positions identiques consécutives.

## Mission 8 retirée du TP mix énergie (04/09/2026)

`02_tp_energies.html` : la mission 8 « Tracer la chaîne de l'électricité » (posée par
le chantier 4) a été supprimée à la demande de Mat. Le TP passe de 9 à 8 missions.

Renumérotation faite, sans quoi la chaîne de verrouillage aurait sauté : bilan
`a9`→`a8`, badge 9→8, `reussir(9,…)`→`reussir(8,…)`, un segment de barre en moins,
`n<=9`→`n<=8` et `if(n<9)`→`if(n<8)`. Suppression par comptage de balises, jamais par
regex. 23 lignes retirées, aucune sur-suppression.
Vérifié : 7 verrous et 8 segments après (contre 8 et 9 avant), badges continus 1 à 8,
aucun résidu du moteur `champs9`/`verif9`, code final intact.

> Le TP mix énergie n'a donc plus de mission « tracer ». Les 29 autres TP la
> conservent : si Mat veut la retirer ailleurs, reprendre la même méthode.

## Points Kahoot : accents et lettres liées (01/10/2026)

Demande de Mat : qu'un accent oublié, par l'élève ou par lui, n'empêche pas la
correspondance. Vérification : les accents étaient DÉJÀ ignorés (Hélène = Helene,
majuscules accentuées comprises). Mais le test a révélé un vrai trou : les lettres
liées æ et œ ne se décomposent pas comme un accent et étaient SUPPRIMÉES —
« Lætitia » donnait « ltitia », jamais égal à « laetitia ».
Correction : œ → oe et æ → ae avant toute comparaison, dans les 32 évaluations
(`normB`, `motsB`), le tableau de bord et `_outils/bonus_kahoot_groupes.py`.
Testé dans une vraie évaluation : accents dans les deux sens, majuscules accentuées,
ligatures dans les deux sens, copie de groupe, et contrôle négatif (un autre élève
de même nom de famille n'est pas pris).

## Évaluations écrites ajoutées aux hubs (30/09/2026)

Cartes « Évaluation écrite » (tag « Individuel · à imprimer », ouverture dans un nouvel
onglet) :
- hub énergies 5e → `04_evaluation_ecrite_ponts_energies_5e.pdf` (carte 6, Kahoot
  renuméroté 7) ;
- hub transmissions 4e → `04_evaluation_ecrite_energie_transmissions_4e.pdf` (carte 5).
Versions **SANS corrigé** uniquement : les hubs sont accessibles aux élèves. Les
versions complètes restent hors du portail.

## Points Kahoot : valeur 0,25 ajoutée (30/09/2026)

Demande de Mat : pouvoir saisir 0,25 (le minimum était 0,5).
- Tableau de bord : option 0,25 dans la liste des points.
- **Piège évité** : les évaluations arrondissaient le bonus et la note finale AU
  DIXIÈME — 0,25 serait devenu 0,3, et 12,4 + 0,25 aurait donné 12,7. Arrondis passés
  AU CENTIÈME dans les 32 évaluations (total par élève, note finale individuelle,
  détail des copies de groupe) et dans `_outils/bonus_kahoot_groupes.py`.
Règles inchangées : elles acceptent tout nombre de 0 exclu à 5.
Testé : seul 12,4 + 0,25 = 12,65 ; groupe « +0,25 = 12,65 » ; deux 0,25 cumulés = 12,9.

## Points Kahoot : bouton « Effacer les points consommés » (30/09/2026)

Demande de Mat. Bouton sur la ligne du résumé de la section Kahoot. Il suit le filtre
« Afficher » : une classe choisie → seuls ses points consommés ; sinon toutes les
classes. Les points DISPONIBLES ne sont jamais touchés, même rangés sous le même élève
qu'un point consommé. Confirmation avec le nombre de points et la portée.
Aucune modification des règles : le nœud `bonus` autorisait déjà la suppression.
Testé : filtre de classe, toutes classes, confirmation refusée.

## Tableau de bord : outils de diagnostic Kahoot retirés (30/09/2026)

À la demande de Mat, retrait du « Tester une copie » et du « Vérifier les évaluations
en ligne » — outils de diagnostic devenus inutiles une fois les points Kahoot
opérationnels. Retirés : les deux encadrés, leurs gestionnaires de clic et le script
KAHOOT_TESTEUR. Retirer les seuls boutons aurait laissé le code chercher des éléments
absents et fait planter toute la section Kahoot.
Vérifié : liste, ajout de points, détail Kahoot des résultats et section d'effacement
intacts.

## Effacer des copies depuis le tableau de bord (30/09/2026)

Demande de Mat : un bouton pour effacer les données des évaluations quand il y en a
trop, en GARDANT les points Kahoot.

Section « Effacer des copies » (marqueur NETTOYAGE_EVALUATIONS) :
- une évaluation ou toutes, et en option seulement les copies antérieures à une date ;
- confirmation en tapant EFFACER ;
- **sauvegarde CSV téléchargée AVANT tout effacement** (mêmes colonnes que l'export,
  Kahoot compris) ;
- case « afficher un bouton Supprimer sur chaque copie » pour retirer une copie de
  test — colonne masquée le reste du temps.
Seul le nœud `evaluations` est touché : le nœud `bonus` (points Kahoot) jamais.

RÈGLES FIREBASE MODIFIÉES — à recoller :
- `evaluations` et `evaluations/$sequence` : `.write` autorisé UNIQUEMENT pour une
  suppression (`!newData.exists()`) ;
- `$copie` : création OU suppression, **toujours pas de modification** d'une copie
  existante — une note ne peut pas être falsifiée.

> CONTREPARTIE DE SÉCURITÉ, signalée à Mat : les copies n'étaient jusqu'ici que
> « ajout seul ». Sans authentification, n'importe qui connaissant l'adresse de la
> base peut désormais EFFACER des copies (pas les modifier). Même niveau que le nœud
> `bonus`, déjà modifiable. La sauvegarde CSV systématique limite la perte.

Testé sur base simulée : évaluation entière, effacement par date, confirmation
incorrecte (rien effacé, rien téléchargé), copie unique en mode nettoyage, aucune
requête sur `bonus`.

## Points Kahoot : conservés quand la note est déjà de 20/20 (29/09/2026)

Demande de Mat : « si les élèves avaient déjà 20/20 à l'éval avant application des
points Kahoot, ne consomme pas les points, sinon c'est injuste ».

Règle, dans les 32 évaluations : note AVANT bonus ≥ 20 → points ni ajoutés ni
consommés, CONSERVÉS pour une prochaine évaluation. L'élève voit « Points Kahoot
conservés pour une prochaine évaluation : tu as déjà 20/20 » ; la copie enregistre
« points conservés, note déjà à 20/20 », visible au tableau de bord. Vaut aussi pour
les copies de groupe à 20/20.

> Limite non traitée, signalée à Mat : à 19,5 avec +1, le bonus est plafonné à 20 et
> le demi-point excédentaire est perdu mais consommé. Une consommation PARTIELLE
> demanderait de réduire la valeur du point restant plutôt que de le marquer consommé.

> Conteneur réinitialisé en cours de travail : corpus restauré depuis
> `portail_technologie_complet.zip` (dernière livraison), jsdom réinstallé.

> Piège de test : les questions des évaluations des sorciers sont MÉLANGÉES à
> l'affichage. Viser la bonne réponse par le rang affiché donnait une fausse note ;
> il faut passer par `dataset.qi`, l'index d'origine.

Testé : 20/20 seul, 20/20 en groupe, 19/20 (bonus toujours appliqué), sorciers 12/12,
32/32 évaluations se chargent sans erreur.

## Blocage des activités d'étiquetage corrigé (28/09/2026)

Signalé par Mat sur « Habille le vélo » : « parfois, une fois les 3 choix cliqués,
ça ne passe pas à la suite et on ne peut plus cliquer sur rien ».

Cause reproduite : dans `widgetEtiquettes`, poser une étiquette sur un élément qui en
portait DÉJÀ une effaçait l'ancienne du schéma, mais son bouton restait marqué
« posé » — donc impossible à reprendre (`if(b.classList.contains('pose'))return`).
La zone qu'elle devait occuper restait à « ? », Valider ne s'activait jamais :
l'élève était bloqué sans issue. Le « parfois » = seulement si l'élève change d'avis
en posant sur un élément déjà rempli.

Correction, marqueur `ETIQUETTES_REPRISE`, dans les **30 évaluations** qui utilisent
ce widget — le bug n'était pas propre au vélo :
- l'étiquette déplacée hors d'une zone redevient disponible ;
- une étiquette posée peut être reprise et déplacée ;
- après validation, étiquettes et schéma sont figés (`fini`).

> Piège d'édition : le fragment `valider.disabled=true; let pts=0;` apparaît DEUX fois
> par fichier (une autre fonction l'emploie). L'outil n'écrivant rien sans
> correspondance unique, aucun fichier n'a été abîmé ; ancre élargie à la ligne
> `zonesDef.forEach` propre au widget.

> Piège de test : les formes cliquables ne sont pas dans l'ordre de la consigne
> (pédalier, pignon, chaîne). Viser une cible par son RANG a d'abord donné un
> résultat trompeur ; elles sont désormais visées par leur géométrie.

Vérifié : blocage reproduit puis levé, déplacement d'étiquette, parcours complet à
3/3, verrouillage après validation, 30/30 évaluations sans régression.

## Points Kahoot — v3 : correspondance par présence, erreurs visibles (28/09/2026)

Captures de Mat après dépôt et règles à jour : quatre copies de test, aucun point
consommé. Analyse ligne par ligne :
- « Person Phillipe FOFO / Michel Hugo François » : c'est MA RÈGLE qui échouait.
  L'appariement par position cherchait « Person Michel » (1er nom, 1er prénom) et
  ratait Hugo, placé en 2e. Règle trop stricte pour l'usage réel.
- une copie « ABANDON » : pas de bonus par conception (copies terminées seulement).
- deux copies au nom aligné, que mes tests reconnaissent : ancienne version en ligne
  à ce moment-là, OU lecture des points échouant silencieusement — indécidable d'ici.

v3, 32 évaluations + testeur du tableau de bord :
- **Correspondance par PRÉSENCE** du nom parmi les noms ET du prénom parmi les
  prénoms, dans les deux sens. L'appariement par position est retiré.
  Contrepartie assumée : le cas très rare d'un élève hors du groupe dont le nom ET le
  prénom figurent tous deux dans le groupe serait pris à tort.
- **Lecture refusée ou impossible = plus jamais silencieuse** : affichée à l'élève en
  orange (« lecture des points impossible (refus HTTP 401). Préviens ton
  professeur ») et ENREGISTRÉE dans la copie, visible au tableau de bord.
- **Trace systématique** : chaque copie porte `bonus_eleves` = détail, erreur, ou
  « aucun ». Le tableau de bord marque « version sans Kahoot » toute copie datée du
  28/09/2026 ou après qui n'a PAS cette trace — produite par un fichier ancien.

> Leçon : un mécanisme qui échoue en silence ne se diagnostique pas à distance.
> Chaque issue possible (appliqué, aucun point, lecture refusée, ancienne version)
> doit laisser une trace lisible, côté élève ET côté professeur.

## Points Kahoot — outils de diagnostic et champs inversés (28/09/2026)

Nouveau retour de Mat : « toujours pas », sans autre précision. Impossible de voir le
site ni la base depuis ici : plutôt que de deviner une troisième fois, trois ajouts.

- **Testeur de correspondance** au tableau de bord : classe + nom et prénom recopiés
  EXACTEMENT comme le groupe les a écrits → la MÊME règle que les évaluations (code
  copié depuis `bonus_kahoot_groupes.py`, encapsulé) dit si des points seraient
  appliqués, et sinon liste les points disponibles de la classe pour comparaison.
- **Champs inversés tolérés** : le testeur a révélé qu'un groupe écrivant les prénoms
  dans « Nom » et les noms dans « Prénom » ne correspondait à rien — erreur très
  courante chez les élèves. Appariement et correspondance exacte acceptent désormais
  les deux sens, sans rouvrir le faux positif « Bultez Hugo ».
- **Repère sur l'écran de fin** : une ligne « Points Kahoot » s'affiche TOUJOURS, grise
  quand aucun point n'est en attente. Son ABSENCE prouve que le navigateur a chargé
  l'ancienne version de l'évaluation (fichier non déposé, ou cache).

Diagnostic à mener avec Mat : 1) vérification en ligne 32/32 ? 2) testeur avec les
noms exacts ? 3) ligne Kahoot présente sur l'écran de fin de l'élève ?

## Points Kahoot — échec en ligne : un problème de DÉPLOIEMENT (28/09/2026)

Retour de Mat après la v2 : « ça ne marche toujours pas, points non consommés, pas
de détail par élève ». Vérifié : le fichier `04_evaluation_transmissions.html` de
l'archive contient bien la v2. Cause la plus probable, et de ma responsabilité : aux
deux livraisons Kahoot, je n'ai présenté SÉPARÉMENT que les règles et le tableau de
bord ; les 32 évaluations modifiées n'étaient que dans l'archive complète. Une
évaluation restée à l'ancienne version ne connaît pas les points : rien n'est
consommé et aucun détail n'est envoyé — exactement le symptôme observé.

Corrections :
- **Bouton « Vérifier les évaluations en ligne »** dans la section Kahoot : relit
  chaque évaluation TELLE QUE LE SITE LA SERT (requête sans cache) et y cherche le code
  v2. Liste les fichiers restés anciens, à redéposer.
- **Archive ciblée `mise_a_jour_points_kahoot.zip`** : les 33 fichiers exacts à mettre
  en ligne (32 évaluations + tableau de bord), au lieu du corpus entier.

> Leçon : quand une correction touche beaucoup de fichiers, livrer la LISTE ET le lot
> exacts à déployer, et fournir un moyen de vérifier le déploiement. Présenter
> quelques fichiers en évidence laisse croire que ce sont les seuls à changer.

## Points Kahoot — copies de GROUPE (28/09/2026)

Retour de Mat, captures à l'appui : un point saisi pour « Person Hugo » (3B) n'était
pas utilisé quand son groupe remettait l'évaluation. Le groupe avait écrit ses cinq
noms dans un seul champ : « Person Bultez Voituret Craygues Zin » / « Hugo Alexandre
Emma Laura Hamza ». La v1 ne cherchait qu'une correspondance exacte. Cas non prévu.

v2 — `_outils/bonus_kahoot_groupes.py`, 32 évaluations :
- lecture de tous les points de la CLASSE, puis correspondance : exacte pour une
  copie individuelle ; pour un groupe écrivant autant de noms que de prénoms,
  **appariement par position** (1er nom avec 1er prénom…) ; sinon présence du nom
  parmi les noms ET du prénom parmi les prénoms, noms composés compris ;
- **copie de groupe : la note du GROUPE reste inchangée** — sinon les cinq
  profiteraient du point d'un seul. Le bonus est noté par élève dans le nouveau champ
  `bonus_eleves` (« Hugo Person +1 = 17,5 »), affiché à l'élève, sous la note au
  tableau de bord, et dans une colonne « Kahoot » de l'export CSV ;
- points consommés après envoi réussi, individuels ou de groupe.

> RÈGLES FIREBASE À RECOLLER : nouveau champ `bonus_eleves` sur les copies.

> L'appariement par position a évité un faux positif dans les tests : un « Bultez
> Hugo » hors du groupe (+2) n'est PAS pris, car dans la copie Bultez va avec
> Alexandre. Une simple recherche de présence l'aurait attribué à tort.

> Règle corrigée avant livraison : une correspondance EXACTE désigne toujours une
> copie individuelle — sinon un élève seul au nom composé (« Le Gall » / « Anne
> Marie ») était pris pour un groupe et son point n'était pas ajouté.

Testé : le groupe de la capture, Hugo seul, nom composé seul, même nom dans une autre
classe (aucun mélange), évaluations des sorciers en groupe, tableau de bord et export,
30/30 évaluations sans régression.

## Points Kahoot appliqués automatiquement aux évaluations (28/09/2026)

Demande de Mat : saisir dans le tableau de bord les points gagnés aux Kahoot, et
qu'ils s'ajoutent automatiquement à la note de la prochaine évaluation, puis soient
marqués comme consommés.

- **Tableau de bord** (`000_tableau_de_bord.html`) : section « Points Kahoot » —
  classe (liste), nom, prénom, points (0,5 à 3), motif. Liste avec l'état de chaque
  point : « disponible » ou « consommé · nom de l'évaluation · date ». Suppression
  possible des seuls points disponibles. Résumé disponibles / consommés, filtre par
  classe. Pastille « +x » à côté de la note dans les résultats.
- **Évaluations** — les 30 du gabarit ACTIVITES (outil `ajouter_bonus_kahoot.py`)
  et les 2 des sorciers : à la remise, lecture des points non consommés, ajout à la
  note sur 20 **plafonnée à 20**, envoi avec `note20` (finale), `note20_brute` et
  `bonus`, puis marquage consommé **SEULEMENT si l'envoi a réussi**. L'élève voit
  « dont x point(s) Kahoot ajouté(s) à ta note de … ».
- Identification : classe + nom + prénom, normalisés (sans accents, majuscules ni
  espaces), MÊME fonction des deux côtés. La classe est choisie dans une liste, ce
  qui élimine les fautes sur la classe.
- Les copies ABANDONNÉES ne reçoivent pas de bonus.

> **RÈGLES FIREBASE À RECOLLER** : nouveau nœud `bonus` (points de 0 à 5, champs
> contrôlés), et deux champs ajoutés aux copies, `note20_brute` et `bonus`. Sans
> cela, les copies avec bonus sont REJETÉES — les règles refusent tout champ inconnu.

> Limites connues : au-delà de 20, les points en excès sont perdus mais consommés.
> Si l'envoi réussit et que le marquage échoue (coupure réseau à cet instant précis),
> les points resteraient disponibles pour l'évaluation suivante. Comme tout le reste
> du portail, le nœud n'est pas protégé par authentification.

Testé : saisie sans accent reconnue, points déjà consommés ignorés, plafond à 20,
envoi raté sans consommation, élève sans points inchangé, tableau de bord (ajout,
suppression, états, pastille), 30/30 évaluations sans régression.

> Un défaut de ma part corrigé en cours de route : en réutilisant le bloc de code
> partagé pour les évaluations des sorciers, je l'ai découpé avec un caractère de
> trop — un guillemet isolé qui cassait tout le script. Repéré par la vérification
> de syntaxe systématique.

## TP « Spécifier une pièce » : cadres dessinés (24/09/2026)

Retour de Mat : « je n'arrive pas à résoudre la première question du premier
exercice, il manque une information ? ». Aucune DONNÉE ne manquait — la question a)
se lit directement dans le cadre, réponse 0,30 mm. Mais le cadre était écrit comme
une ligne de texte, « localisation · Ø 0,3 · A · B », sans rien qui ressemble à un
cadre de tolérance, et sans figure de la pièce : la question PARAISSAIT incomplète.

Correction : deux figures dessinées.
- **Mission 1** : la plaque vue de face, le trou, les références A et B posées sur
  leurs faces, les cotes théoriques exactes encadrées (60 et 80), et le cadre à
  quatre cases relié au trou, légendé symbole / zone / références.
- **Mission 4** : le trou coté Ø 12,00 à 12,20 et le cadre avec le M entouré dans
  SA propre case — une première version le dessinait par-dessus la case A.
Symboles tracés sur canvas, pas en Unicode.

> Leçon : une spécification géométrique ne se transcrit PAS en texte. Un cadre de
> tolérance est un objet graphique ; le réduire à une ligne fait perdre l'essentiel
> de l'information perçue, même si toutes les valeurs y figurent.

## TP CAPET : tout visible dès le départ (24/09/2026)

Retour de Mat : « pour Spécifier une pièce, je n'ai pas de correction ». Les
corrigés étaient bien présents dans les six TP, mais CACHÉS : ils n'apparaissaient
qu'après réussite ou trois échecs, et les exercices sur copie étaient sous le verrou
du bilan. En ouvrant le TP pour le vérifier, Mat ne voyait donc rien. Défaut de
conception de ma part, pas d'injection : je n'avais pas assez expliqué ce comportement.

Choix de Mat : **tout visible dès le départ, pour les séquences CAPET uniquement.**
- corrigé détaillé posé sur CHAQUE mission à l'ouverture ;
- **verrouillage progressif levé** sur les six TP CAPET — indispensable, sinon le
  corrigé d'une mission verrouillée restait sous son cadenas ;
- exercices sur copie accessibles sans terminer le TP.
Le score reste juste : `reussir` ajoute les points à chaque réussite et un bouton
validé est désactivé ; seule la barre de progression avance toujours dans l'ordre.

> Les TP hors CAPET GARDENT leur verrouillage et n'ont aucun corrigé : vérifié.

> Leçon : un contenu masqué par défaut doit être signalé explicitement à la
> livraison, avec la façon de le faire apparaître. Sinon, il est perçu comme absent.

## Corrigés détaillés et exercices sur copie dans les six TP CAPET (24/09/2026)

Demandé par Mat : corrigés expliqués sur les exercices des TP, et des exercices à
faire sur copie. Outil `_outils/ajouter_corriges_tp_capet.py`, contenus dans
`_outils/corriges_tp_capet.py`. Idempotent (marqueur CORRIGES_CAPET).

- **Corrigé détaillé** sur chaque mission — 40 au total, dont les 4 missions de
  calcul ajoutées aux TP axe et statique (repris de `calculs_tp.json`). Trame fixe :
  formule, application numérique, résultat, À RETENIR. Le bouton apparaît :
  à la RÉUSSITE de la mission (on enveloppe `reussir`) ; ou après TROIS validations
  infructueuses, avec la mention « après 3 essais », pour ne pas laisser un élève
  bloqué ; et au RECHARGEMENT pour les missions déjà franchies.
- **Exercices sur copie** : 3 par TP, soit 18, placés dans la mission bilan — ils se
  découvrent SOUS LE VERROU, une fois le TP terminé. Corrigé à afficher soi-même,
  SANS correction automatique, conformément à la règle de Mat.
  Toutes les valeurs recalculées avant rédaction.

> **Défaut repéré au rendu, invisible aux tests** : les lignes du corrigé étaient en
> flex, et le contenu y était posé nu. Or un conteneur flex transforme chaque
> morceau (texte, indice, gras) en bloc séparé : les indices ω<sub>p</sub>
> remontaient comme des exposants, et les espaces disparaissaient (« 0,20et290 »).
> Correction : envelopper le contenu dans UN élément. Règle : ne jamais poser du
> texte riche directement dans une ligne flex.

Vérifié : 6/6 TP — aucun corrigé au départ, déblocage après 3 échecs, restauration au
rechargement, exercices sous verrou ; parcours complets toujours à 18 ; mini-cours et
verrouillage des 32 TP intacts.

## Mini-cours étendus aux deux derniers sujets CAPET (24/09/2026)

Quatre notions ajoutées à la bibliothèque, qui passe à **30** : zone de tolérance
de position, exigence du maximum de matière, système de références, cote de réglage.
Sujet GPS : 11 boutons. Sujet cotation : 9 boutons — la question B2, purement
économique, n'en reçoit pas.

> **Les deux nouveaux sujets avaient hérité du CODE du bouton** (le gabarit venait
> d'un sujet déjà équipé) mais ni de la bibliothèque ni du gestionnaire de clic, qui
> se trouvaient APRÈS la zone extraite. Sans correspondances, aucun bouton ne
> s'affichait — le défaut était donc invisible. Vérifier ce qu'un gabarit emporte
> réellement, pas ce qu'il semble contenir.

> **Bibliothèque unifiée** : chaque fichier embarquait la version de la bibliothèque
> du jour de son équipement. Les 75 fichiers portent désormais la même version, à
> 30 notions. À refaire après toute modification de `_outils/minicours.js`.

Un défaut corrigé au rendu : dans l'animation du maximum de matière, le cercle du trou
et celui de la zone se superposaient presque exactement. Ils sont désormais dessinés
côte à côte.

Vérifié après propagation : 13/13 sujets, 32/32 TP avec verrouillage intact, 30/30
évaluations sans aucun bouton avant la remise.

## Sixième séquence CAPET — Spécification géométrique et conception (24/09/2026)

Demandée par Mat, **distincte de la séquence cotation** : celle-ci traite les chaînes
de cotes DIMENSIONNELLES ; la nouvelle porte sur la spécification GÉOMÉTRIQUE (ISO
GPS) et sur les choix de conception qui la justifient. **Séquence complète** : cours, TP et sujet type.

- `01_cours_capet_gps.html` — pourquoi la cote ne suffit pas (deux pièces aux mêmes
  cotes, l'une se monte, l'autre non), les quatre familles, le cadre et la zone, le
  système de références 3-2-1, une **méthode de conception en cinq étapes** qui part
  de la fonction, et le maximum de matière.
  **Simulateur** : diamètre réel du trou, écart de position de l'axe, et une case à
  cocher pour l'exigence du maximum de matière. Cas clé vérifié : trou 10,06 et écart
  0,12 donnent une pièce REFUSÉE sans maximum de matière (zone Ø0,20 pour Ø0,24
  nécessaire) et ACCEPTÉE avec (zone portée à Ø0,26).
- `02_tp_capet_gps.html` — lecture d'un cadre, contrôle d'une position par l'écart
  radial, tri des familles, bonus de maximum de matière, diamètre virtuel et montage
  garanti, système de références. Parcours testé, score 18.

> **Symboles GPS DESSINÉS sur canvas**, pas écrits en Unicode : les caractères de
> planéité, localisation ou coaxialité ne s'affichent pas dans toutes les polices, et
> un symbole absent rendrait l'exercice incompréhensible.

> Mission 2 : l'axe est décalé de 0,12 en x et 0,16 en y, chacun sous la limite de
> 0,15 — et pourtant la pièce est refusée, l'écart radial valant 0,20. C'est LA
> confusion typique entre tolérancement dimensionnel et géométrique.

> Le cours insiste sur l'erreur de conception la plus coûteuse : prendre en référence
> une surface commode à mesurer plutôt que la surface fonctionnelle.

Deux défauts corrigés au rendu sur le schéma du cadre : légendes superposées, et
libellé de la zone collé au titre.

`05_capet_sii_gps.html` — support : la **flasque de fixation d'un moteur**. 5 documents
dont un dessin de face portant trois cadres de tolérance dessinés (localisation des
4 trous au maximum de matière, planéité de A, perpendicularité du centrage B), et un
relevé de contrôle réel. **13 questions, 100 points**, dont 16 d'exploitation.

> **Le cas central** : trou mesuré 9,14, axe décalé de 0,09 et 0,12. Écart radial 0,15,
> soit Ø0,30 nécessaire. Avec le maximum de matière la zone accordée est Ø0,34 :
> CONFORME. Sans, Ø0,20 : REFUSÉE. Le maximum de matière sauve une pièce parfaitement
> montable qu'un contrôle rigide aurait mise au rebut.

> **Partie D, les vrais choix de conception** : pourquoi le maximum de matière convient
> aux trous de fixation (la fonction est le passage de la vis) mais serait à proscrire
> sur le centrage (la fonction est l'alignement, un plus grand diamètre ne compense
> rien) ; et les conséquences d'une référence prise sur la face arrière, commode à
> palper mais non fonctionnelle.

Testé : 100/100, barème juste sans reprise. Un défaut corrigé au rendu : deux
libellés posés sur les hachures du carter, sortis avec des lignes de rappel.

## Cinquième séquence CAPET — Cotation fonctionnelle (24/09/2026)

**Séquence complète** : cours, TP et sujet type. C'était le dernier grand domaine
mécanique de l'écrit sans séquence.

`01_cours_capet_cotation.html` — la cote condition (un jeu, jamais coté sur un dessin
de définition), le tracé d'une chaîne avec sa méthode en quatre étapes, les valeurs
extrêmes, et la répartition des tolérances (égale, pondérée, cote de réglage).

**Simulateur** : deux curseurs règlent les tolérances de A et de B/C, et la plage de
jeu obtenue se superpose à la plage autorisée. On voit la barre passer du rouge au
bleu quand la condition devient tenable. Exemple de départ volontairement NON
conforme — A ± 0,15 donne un jeu de 0,75 à 1,25 pour une condition de 0,80 à 1,20.

> **La propriété à retenir**, mise en avant dans le cours et vérifiable d'un coup
> d'œil : l'IT de la condition est la SOMME des IT des cotes de la chaîne. Elle
> détecte la plupart des erreurs de calcul, et explique pourquoi on cherche toujours
> à raccourcir les chaînes.

> Exercice 6 : quelle cote resserrer pour gagner 0,10 mm ? La réponse n'est pas « la
> plus grande » — toutes les tolérances pèsent identiquement dans la somme. Le critère
> est économique, pas géométrique.

Un défaut corrigé au rendu : le libellé du vecteur A touchait le titre du schéma.

`02_tp_capet_cotation.html` — 6 cas : calcul des jeux extrêmes (2,00 / 1,80 / 2,20,
IT 0,40), conclusion face à une condition qui n'autorise que 0,30 — il faut retirer
0,10 d'intervalle ; tri cote condition / cote fonctionnelle ; répartition égale des
tolérances ; chaîne à QUATRE cotes donnant le MÊME jeu nominal mais un IT de 0,48 ;
enfin lecture d'un ajustement 30 H8/f7 (jeu de 0,020 à 0,074). Parcours testé,
score 18, chargement propre.

> **La mission 5 est construite en miroir de la mission 1** : même jeu nominal de
> 2,00 mm, mais une cote de plus, donc un intervalle qui passe de 0,40 à 0,48. La
> comparaison directe fait comprendre qu'allonger une chaîne dégrade toujours la
> maîtrise du jeu, et que cela ne se rattrape pas en resserrant.

> Piège signalé dans le corrigé de la mission 4 : confondre l'INTERVALLE (0,10) et
> la tolérance symétrique (± 0,05). C'est l'erreur la plus fréquente de l'exercice.

`05_capet_sii_cotation.html` — support : l'**arbre d'une pompe centrifuge** sur deux
roulements et une entretoise, jeu axial réglé par une **cale** sous le couvercle.
5 documents, **12 questions, 100 points**, dont 21 d'exploitation pédagogique.
Introduit la notion absente du TP : la **cote de réglage**.

> **Le raisonnement du sujet** : la chaîne produit 0,40 mm de dispersion pour 0,10
> autorisé — impossible par tolérancement. La solution « tout resserrer » demande
> ± 0,0125 mm par cote, soit un coût × 4, et surtout se heurte aux roulements du
> commerce dont la largeur est imposée. La cale, choisie après mesure de chaque pompe,
> absorbe toute la dispersion : 9 épaisseurs au pas de 0,05 couvrent la production,
> avec un jeu toujours compris entre 0,075 et 0,125.

> Partie D : avantage et inconvénient de la cote de réglage, puis raccourcir la chaîne
> — un épaulement sur l'arbre supprime l'entretoise et fait tomber l'IT de 0,40 à 0,30.

Testé : 100/100, barème juste sans reprise. Libellés sortis des hachures du carter.

## Évaluations des sorciers reliées aux hubs (24/09/2026)

Incohérence résolue : le bloc prof des hubs ponts et énergies affichait les codes
`SORCIER7` et `SORCIER2`, alors qu'AUCUNE carte ne menait à ces évaluations. Les
élèves recevaient le code d'une page qu'ils ne pouvaient pas atteindre depuis le hub ;
il fallait repasser par le portail.

Choix de Mat : **ajouter les cartes**. Chacune est placée juste après l'évaluation
classique, et les cartes suivantes ont été renumérotées — le hub des ponts passe à
9 cartes, celui des énergies à 8.

> Vérifié : les codes annoncés dans le bloc prof correspondent maintenant exactement
> aux cartes présentes (ARCHE62 + SORCIER7, WATT118 + SORCIER2).

## Quatre sujets type DNB créés (24/09/2026)

Les cours « Comment ça marche » qui n'avaient pas leur sujet en ont un :
`05_brevet_epingle_linge.html`, `fermeture_eclair`, `thermostat`, `differentiel`.
Même gabarit que les trois précédents : 3 documents, 6 questions, 25 points,
correction seulement à la remise. Les 7 inventions traitées ont désormais toutes
leur cours ET leur sujet.

Calculs vérifiés avant rédaction : épingle, bras 45/12 = 3,75 donc 8 N deviennent
30 N, et 10,7 N suffisent pour les 40 N d'un drap mouillé ; fermeture, 60 cm × 5 =
300 emboîtements, chacun ne supportant que 0,4 N sur les 120 N de traction ;
thermostat, 1 400 € × 7 % = 98 € pour un seul degré ; différentiel, 90 + 110 = 200
= 2 × 100, d'où 120 tr/min en virage serré et 0 tr/min quand l'autre roue patine.

> Chaque sujet garde un temps de recul en dernière question : choix bois/plastique,
> cas d'usage de la bande auto-agrippante, boucle fermée sans électronique, solution
> au patinage et son inconvénient.

> Un point que je trouve efficace sur la fermeture éclair : la question 5 fait
> expliquer pourquoi UNE dent tordue rend les 300 autres inutiles. C'est la faiblesse
> des systèmes en série, transposable bien au-delà de l'objet.

Testé : 25/25 sur les quatre. Trois chevauchements corrigés au rendu.

## Bouton « Mini-cours » sur chaque question des sujets CAPET (24/09/2026)

Demandé par Mat : un bouton par exercice ouvrant un mini-cours avec schémas,
animations, explications et formules.

> **Choix de conception** : une notion, un mini-cours — PAS une explication par
> question. Plusieurs questions d'un même sujet mobilisent la même notion (le moment
> d'une force, Willis, la concentration de contraintes) : écrire un texte par question
> aurait produit des dizaines de redites, impossibles à maintenir. Chaque question
> pointe vers une entrée de la bibliothèque `_outils/minicours.js`.

**26 notions animées**, couvrant les 11 sujets du corpus : poutre sur deux appuis, moment d'une force, solide à deux
forces, solide à trois forces, moment fléchissant, module de flexion et de torsion,
concentration de contraintes, contrainte équivalente, train ordinaire, Willis,
rendement, vis à billes, inertie équivalente, profil trapézoïdal, pression de vérin,
cisaillement simple et double.

Chaque entrée fournit un titre, une ou deux formules, trois lignes d'explication et un
**schéma animé** — la charge se déplace sur la poutre, le rayon de congé varie et Kt
avec lui, le dynamique des trois forces se ferme, le train épicycloïdal tourne.

Outil : `python3 _outils/ajouter_minicours.py [--dry]`, idempotent. La bibliothèque
est **intégrée dans chaque fichier** : les sujets restent autonomes hors ligne.
Aperçu visuel : `python3 _outils/apercu_minicours.py` puis `verif_rendu2.js`.

> Les questions d'exploitation pédagogique (partie E) n'ont pas de bouton : elles ne
> portent sur aucune notion de calcul.

> **L'animation est arrêtée à la fermeture** (`cancelAnimationFrame`) : vérifié par
> test, aucune boucle ne continue en arrière-plan une fois le panneau refermé.

**Étendu le 24/09 aux 7 autres sujets** — 5 DNB, Bac SI, BTS CPI. Notions ajoutées
pour ces niveaux : chaîne d'énergie, puissance et énergie, vitesse-distance-durée,
résolution d'une mesure, chaîne de cotes, durée de vie d'un roulement, liaisons et
degrés de liberté, puis débit-volume-durée, pourcentage et proportion, et comptage
de combinaisons.

> **Correspondances révisées avant application.** Mon premier jet rattachait
> « nombre de clés possibles » à la puissance électrique et « durée de remplissage »
> au même mini-cours : deux rapprochements faux, qui auraient induit les élèves en
> erreur. Plutôt que de forcer la correspondance, j'ai écrit les trois notions qui
> manquaient réellement (débit, proportion, combinaisons). Une correspondance
> approximative est pire que pas de bouton du tout.

**Étendu le 24/09 aux missions de calcul des TP** — outil
`_outils/ajouter_minicours_tp.py`, **63 boutons sur 32 TP**. Le bouton se pose dans
le titre de la mission, à côté du badge. Une mission sans notion adaptée n'en reçoit
PAS : c'est le cas du chemin critique en gestion de projet, qui ne correspond à
aucune entrée de la bibliothèque. Mieux vaut aucune aide qu'une aide hors sujet.

> Test spécifique ajouté : le **verrouillage progressif doit rester intact**. Poser
> des boutons dans les titres de mission aurait pu perturber le moteur — vérifié sur
> les 32 TP, le nombre de verrous correspond toujours au nombre de missions moins une.

**Étendu le 24/09 aux 30 évaluations — mais SEULEMENT APRÈS LA REMISE.** Demande
explicite de Mat : « je ne veux pas que ça s'affiche tant que la copie n'a pas été
rendue ». Le bouton n'est donc pas posé sur l'activité pendant l'épreuve, mais sur
la LIGNE DE RÉSULTAT de l'écran de bilan — écran qui n'existe qu'une fois la copie
envoyée. L'élève relit sa note et ouvre le rappel de la notion sur laquelle il a
perdu des points.
Outil : `_outils/ajouter_minicours_eval.py`, table dans `minicours_evals.json`.
**61 boutons**, un par activité de CALCUL. Les activités d'étiquetage ou de
reconnaissance n'en reçoivent pas : elles ne reposent sur aucune formule.

> Identifier les activités de calcul a demandé un détour : remonter à l'accolade
> précédant `activiteCalcul` tombait sur le corps de `render`, où le titre ne figure
> pas. Il a fallu repérer les titres, puis tester la présence d'un appel de calcul
> ENTRE deux titres consécutifs. 61 activités sur 214.

> **Test spécifique** : le harnais parcourt toute l'évaluation AVANT la remise et
> échoue si un seul bouton apparaît. Vérifié sur les 30 évaluations.

Vérifié : **206 boutons au total** — 82 sur les 11 sujets type, 63 sur les 32 TP, 61 au bilan des 30 évaluations — toutes les notions visées existent, les
26 dessins s'animent sans erreur à six instants différents, l'animation s'arrête à
la fermeture, et trois libellés qui débordaient du canvas ont été rentrés.

## Séquence CAPET RDM complétée — sujet type (24/09/2026)

`05_capet_sii_rdm.html` — support : l'**arbre de sortie d'un réducteur**, portant un
épaulement ET une rainure de clavette. 5 documents, **12 questions, 100 points**,
dont 18 d'exploitation pédagogique. **Les quatre séquences CAPET sont complètes** :
axe linéaire, statique, trains, RDM — chacune avec cours, TP et sujet.

Chaîne vérifiée : RA = 2 667 N, RB = 1 333 N, Mt = 300 N·m, Mf de 160 N·m à
l'épaulement et 266,7 N·m sous la roue. Épaulement Ø40 : σ 25,5 et τ 23,9, majorés à
45,8 et 35,8 par Kt 1,8 / 1,5, soit σéq = 85,0 MPa. Clavette Ø45 : σ 29,8 et τ 16,8,
majorés à 62,6 et 28,5 par Kt 2,1 / 1,7, soit σéq = 84,7 MPa. Rpe = 162,5 MPa.

> **LE POINT REMARQUABLE DU SUJET** : les deux sections aboutissent à 85,0 et
> 84,7 MPa, soit **0,4 % d'écart**. AUCUNE ne domine — il fallait les vérifier toutes
> les deux. Le diamètre plus grand sous la roue compense presque exactement le
> coefficient de concentration plus sévère de la clavette. C'est le contre-exemple
> parfait de l'idée reçue « la section critique est celle du moment maximal », que la
> question E2 fait précisément analyser.

> **D1 — portée de l'hypothèse** : sans les Kt, la section de la clavette donnerait
> 44,9 MPa au lieu de 84,7, soit une sous-estimation de 89 %, presque un facteur deux.

> Les Kt sont appliqués SÉPARÉMENT en flexion et en torsion, avant la combinaison —
> et non globalement à la contrainte équivalente, ce qui serait une approximation.

Testé : 100/100, barème juste sans reprise.

## Quatrième séquence CAPET — Résistance des matériaux (24/09/2026)

Cours et TP ; le sujet type reste à écrire. Quatrième et dernier pilier du socle
mécanique de l'écrit, après l'axe linéaire, la statique et les trains.

- `01_cours_capet_rdm.html` — les quatre sollicitations simples en tableau, les trois
  cas de charge en flexion, la **concentration de contraintes** et la contrainte
  équivalente √(σ² + 4τ²). Méthode de vérification en six étapes.
  **Simulateur** : diamètre et moment réglables, courbe σ(d) avec la limite pratique
  tracée — on voit la contrainte s'effondrer en 1/d³. 6 exercices corrigés.
- `02_tp_capet_rdm.html` — 6 cas : flexion d'un arbre de 25 mm (130,4 MPa contre
  111,7 admissibles, donc DÉJÀ non conforme), dimensionnement pour 80 MPa (d ≥ 29,4,
  on retient 30), tri des sollicitations, torsion (28,3 contre 55,8 : sans problème),
  **concentration Kt = 2,1** qui porte la contrainte à 273,8 MPa soit 2,5 fois la
  limite, et contrainte équivalente 142,2 MPa contre 158,7 pour la somme naïve.
  Parcours testé, score 18, chargement propre.

> **Le fil conducteur** : la pièce ne casse pas où la contrainte moyenne est la plus
> forte, mais au premier congé. La mission 5 le chiffre — un calcul sans Kt concluait
> à un léger dépassement, la réalité est un facteur 2,5. Le bilan insiste sur le
> réflexe attendu : chercher activement les changements de section avant de conclure.

> Trois défauts corrigés au rendu : la courbe de contrainte venait buter sur le titre
> du schéma de concentration, l'étiquette du congé tombait dans la zone de la courbe,
> et le libellé d'axe du simulateur sortait du canvas une fois pivoté.

## Séquence CAPET Trains complétée — sujet type (24/09/2026)

`05_capet_sii_trains.html` — support : un **treuil de levage à deux vitesses**,
train épicycloïdal 30/90 avec frein sur la couronne et embrayage planétaire-couronne.
5 documents, **12 questions, 100 points**, dont 19 d'exploitation pédagogique.
Les trois séquences CAPET sont désormais complètes : axe linéaire, statique, trains.

Chaîne vérifiée avant rédaction : satellites 30 dents, montage à 3 satellites possible
((30+90)/3 = 40), λ = −3, rapport lent 1/4, tambour 60,4 tr/min et câble 0,506 m/s ;
en prise directe le train tourne d'un bloc, rapport 1, câble 2,025 m/s. Effort 3 924 N,
couple tambour 313,9 N·m, rendement global 0,931.

> **Le ressort du sujet** : en vitesse lente il faut 14,05 N·m, le moteur en donne 18
> — cela passe. En prise directe il faudrait **53,94 N·m**, soit trois fois trop : le
> treuil est INCAPABLE de lever la charge dans cette configuration. La partie D fait
> chercher à quoi sert alors ce rapport (manœuvre à vide, approche du crochet), et
> conclut qu'un dimensionnement se juge **usage par usage**, pas rapport par rapport.

> **D2 — cohérence énergétique** : puissance de levage 1 986 W contre 2 133 W fournis
> par le moteur ; le quotient vaut 0,931, exactement le rendement trouvé en C2. La
> vérification croisée valide toute la chaîne de calculs.

> **E2 — erreur d'élève** : « la prise directe est meilleure, son rendement est plus
> élevé ». Confusion entre rendement et capacité. La remédiation proposée passe par un
> tableau à deux colonnes où la contradiction apparaît d'elle-même.

Testé : 100/100, barème juste sans reprise. Un défaut corrigé au rendu : le libellé du
frein, cadré à droite, sortait du canvas.

## Troisième séquence CAPET — Trains d'engrenages (24/09/2026)

Cours et TP ; le sujet type reste à écrire.

- `01_cours_capet_trains.html` — train ordinaire (rapport = produit, signe en (−1)ⁿ,
  roue folle), couple et rendement (les rendements se MULTIPLIENT), puis le train
  **épicycloïdal et la formule de Willis**. Méthode en six étapes. Deux encadrés
  « piège » : compter les roues au lieu des contacts, et appliquer le rapport d'un
  train ordinaire à un épicycloïdal — erreur qui ne se signale pas.
  **Simulateur de denture** : planétaire et couronne réglables, avec la raison
  basique, le rapport, la denture des satellites et la **condition de montage à trois
  satellites** ((Zp + Zc) divisible par 3). 6 exercices corrigés.
- `02_tp_capet_trains.html` — 6 cas : raison basique et denture des satellites,
  couronne bloquée (rapport 1/5 sur 20/80), tri ordinaire/épicycloïdal, deux étages
  en série (1/12), couple et rendement (0,97² = 0,941), enfin géométrie et
  **inversion de fonction** — porte-satellites bloqué, le rapport devient λ = −4 :
  la sortie tourne quatre fois plus VITE et en sens inverse.
  Toutes les réponses recalculées indépendamment. Parcours testé, score 18.

> **Piège du recyclage, encore** : le moteur repris du TP de statique bouclait
> `for(let n=2;n<=9;n++)` — parce que ce TP était passé de 7 à 9 missions avec les
> exercices de calcul ajoutés la veille. Le nouveau TP n'en ayant que 7, `a8` et `a9`
> étaient introuvables et le script plantait AU CHARGEMENT, alors que tout le parcours
> fonctionnait ensuite. Toujours vérifier les DEUX bornes du moteur après extraction,
> et regarder les erreurs de chargement même quand les tests fonctionnels passent.

> Trois défauts corrigés au rendu du cours : la légende du schéma épicycloïdal était
> positionnée par un décalage et sa première entrée sortait du canvas ; la légende du
> bas chevauchait la couronne ; les nombres s'affichaient avec un point décimal.

## Séquence CAPET Statique complétée — sujet type (24/09/2026)

`05_capet_sii_statique.html` — support : une **grue d'atelier hydraulique**, flèche
articulée relevée par un vérin. 5 documents, **13 questions, 100 points**, 5 parties,
dont **21 points d'exploitation pédagogique**. La séquence statique est donc complète :
cours, TP, sujet.

Deux documents dessinés : l'architecture cotée de la grue, et une **résolution
graphique amorcée** où les supports du vérin et de la charge sont tracés, avec leur
point de concours I — l'élève doit tracer le troisième support et fermer le dynamique.

Chaîne vérifiée avant rédaction : vérin à 49,4°, bras de levier 0,456 m, effort
16 460 N (plus de 3 fois la charge), composantes 10 710 et 12 500 N, action en A
de 13 080 N avec **les DEUX composantes négatives**, pression 83,8 bar contre 150
disponibles, cisaillement double 32,5 MPa contre 55,8 admissibles.

Le sujet est construit autour de trois points que le jury attend :
- **B4 — vérification croisée** : la pente de AI vaut 0,70, exactement le rapport
  7 500 / 10 710 du calcul. La géométrie confirme l'algèbre.
- **D2 — critique de l'hypothèse** : négliger le poids de la flèche SOUS-ESTIME
  l'effort réel. L'hypothèse va dans le sens défavorable à la sécurité.
- **E2 — erreur d'élève** : « la flèche pousse sur le mât vers le haut ». Faux, car
  le vérin pousse avec 12 500 N contre 5 000 N de charge. Remédiation par le tracé
  graphique plutôt que par la correction du signe.

Testé : 100/100.

> Deux défauts corrigés au rendu : le point de concours I, à 2,25 m, sortait du cadre
> à l'échelle du document 1 — le document 4 a désormais **son propre repère** ; et
> deux étiquettes chevauchaient le mât puis la légende du bas.

## Seconde séquence CAPET — Statique (05/09/2026)

Deux fichiers, sans sujet type pour l'instant.

- `01_cours_capet_statique.html` — cours de méthode : modéliser une action (torseur,
  transport du moment), tableau des liaisons et de leurs inconnues avec la règle
  **mobilités + inconnues = 3 dans le plan, 6 dans l'espace**, méthode d'isolement en
  cinq étapes, cas plan, et théorème des trois forces concourantes.
  Deux encadrés « piège » : sommer des torseurs exprimés en des points différents, et
  faire figurer une action INTÉRIEURE à l'isolement.
  **Simulateur de potence** : l'angle du tirant fait exploser la tension — 5333 N à
  30°, 10303 N à 15°. 6 exercices corrigés.
- `02_tp_capet_statique.html` — 6 cas chiffrés : potence (tirant à 40°), comptage des
  inconnues, tri intérieur/extérieur sur un isolement d'ensemble, levier inter-appui,
  poutre sur deux appuis, et **poulie de renvoi** — où l'axe supporte 2546 N pour un
  câble tendu à 1800 N, l'erreur classique. Toutes les réponses recalculées
  indépendamment. Parcours testé : 6 verrous au départ, score 18.

> **Défaut de recyclage, à nouveau** : ma chaîne de remplacement du nom de la clé
> `localStorage` a avalé une parenthèse fermante, cassant tout le script. Le contrôle
> `node --check` sur chaque bloc l'a attrapé avant livraison. Toujours vérifier la
> syntaxe APRÈS chaque adaptation de gabarit, pas seulement à la fin.

## Sujet type CAFEP-CAPET SII, ingénierie mécanique (05/09/2026)

`05_capet_sii_axe.html` — support : l'axe X d'un centre d'usinage, chaîne motorisée à
vis à billes. **6 documents, 17 questions, 100 points, 5 h**, cinq parties :
modélisation cinématique, étude dynamique, choix du moteur, précision, et
**exploitation pédagogique (15 points)** — partie propre au concours, absente des
autres sujets du corpus.

Trois documents dessinés : architecture de l'axe en coupe avec repères, **schéma
cinématique minimal** (deux pivots, une hélicoïdale, une glissière) et **profil de
vitesse trapézoïdal** coté.

Chaîne de calculs vérifiée indépendamment avant rédaction : k = p/2π = 1,59 mm/rad ;
3000 tr/min et 314 rad/s ; J_eq = M·k² = 6,33·10⁻⁴ ; J_tot = 2,03·10⁻³ dont 31 % pour
la masse ; dω/dt = 1257 rad/s² ; couples 2,56 + 0,354 = 2,91 N·m ; P = 914 W ;
profil 0,25 / 1,35 / 0,25 s pour 1,85 s au total ; résolution codeur 1 µm.

Trois questions portent la réflexion au-delà du calcul :
- **C2 — le dimensionnement est ITÉRATIF** : l'inertie du rotor choisi entre dans le
  J_tot qui a servi à le choisir. Retenir le BL-300 porterait le couple à 3,56 N·m.
- **D2 — la mesure est INDIRECTE** : jeu, torsion et dilatation de la vis échappent à
  la boucle. Les 1 µm sont une résolution de mesure, pas une précision de position.
- **E2 — analyse d'une erreur d'élève** : « doubler le pas double le couple ».
  Confusion entre relation linéaire et quadratique, l'inertie variant en k².
  La remédiation proposée passe par un tableur plutôt que par l'énoncé de la formule.

Testé : 100/100.

**Séquence complétée le 05/09** à la demande de Mat : cours et TP ajoutés autour du
sujet, pour en faire une séquence entière.

- `01_cours_capet_axe.html` — cours de MÉTHODE : loi entrée-sortie, inertie
  équivalente, les trois termes du couple, et le caractère itératif du
  dimensionnement. Deux encadrés « piège » (oubli du 2π dans k ; rendement appliqué
  à tort au terme d'inertie), un encadré méthode en six étapes, et un **simulateur du
  pas** qui trace C(p) et fait apparaître le minimum de couple — l'adaptation
  d'inertie. Vérifié : l'optimum tombe à 12 mm/tr, les 10 mm du sujet en sont proches.
  6 exercices corrigés.
- `02_tp_capet_axe.html` — 6 missions chiffrées sur le moteur de verrouillage, avec
  un jeu de données DIFFÉRENT du sujet (p = 8 mm, M = 180 kg) pour éviter la
  restitution. Missions : constante k, inertie équivalente, tri des trois termes du
  couple, couple en accélération, **cas de l'axe vertical** (le couple double), et
  **bouclage de l'itération** (+54 % sur le couple avec le vrai rotor).
  Toutes les réponses attendues recalculées indépendamment. Parcours testé : 6 verrous
  au départ, score 18.

Ajouté au portail dans la section SI.

> Incohérence rattrapée avant livraison : l'en-tête annonçait 18 questions et
> 100 points alors que le tableau en comptait 17 pour 90. Barème rééquilibré à 100,
> avec la partie pédagogique portée de 10 à 15 points — plus représentatif du concours.

## Sujet type BTS CPI (05/09/2026)

`05_bts_cpi_galet.html` — support : un galet tendeur de courroie. Même moteur,
format de l'épreuve de conception préliminaire : **5 documents, 12 questions,
60 points, 3 h**, trois parties — analyse du mécanisme, cotation fonctionnelle,
dimensionnement.

Documents dessinés : un **dessin d'ensemble en coupe** avec hachures normalisées et
repères renvoyant à la nomenclature (support, axe, roulements, galet, entretoise,
rondelle, vis), et une **chaîne de cotes** vectorielle de la condition de jeu axial.
Plus la nomenclature, les données de dimensionnement et le tableau des cotes.

Contenu CPI : nature de la liaison et composant qui la réalise, rôle de l'entretoise
et de la rondelle d'arrêt, choix du polyamide pour le galet, **chaîne de cotes**
(Ja = A − B − C = 0,30 ; Jmax 0,50 ; Jmin 0,10 ; IT 0,40), **RDM en flexion**
(Mf = 8,0 N·m ; I/v = 169,6 mm³ ; σ = 47,2 MPa contre Rpe = 78,3 MPa),
**durée de vie des roulements** (L10 = 4 391 Mtr, soit 48 800 h contre 20 000 exigées),
procédé d'obtention de la fonte, et une question d'optimisation. Testé : 60/60.

> **La chaîne de cotes conclut à une NON-CONFORMITÉ** : Jmax = 0,50 mm dépasse la
> condition de 0,40 mm. C'est volontaire — en CPI on attend une conclusion et une
> proposition de correction chiffrée, pas une validation automatique.

> **Piège du `clip()`, rencontré pour la troisième fois** (dents de la fermeture
> éclair, crémaillères du différentiel, hachures ici) : il n'est pas honoré par tous
> les moteurs de rendu et les hachures débordaient largement de leurs pièces.
> Chaque droite à 45° est désormais **tronquée analytiquement** au rectangle.
> Règle : ne jamais compter sur `clip()`, borner par calcul.

## Sujet type Bac SI (05/09/2026)

`05_bac_si_portail.html` — support : un portail coulissant motorisé. Même moteur que
les sujets DNB, mais au format de l'épreuve de SI : trois parties (analyser le besoin,
modéliser la chaîne de puissance, valider les performances), numéros A1, A2, B1…

**Étoffé le 05/09** après remarque de Mat : « ça manque de schémas et d'informations
sur le sujet, et ça me paraît trop court ». Juste — un sujet de bac présente d'abord
le système et fournit des relevés. Passé de 3 à **6 documents**, de 8 à
**12 questions**, de 20 à **40 points**, de 1 h 15 à **2 h**.
Ajoutés : une **présentation du système** en vue de dessus (vantail, rail, galets,
pignon-crémaillère, motoréducteur, cellules, butées, course cotée), un **relevé du
courant moteur** sur un cycle avec pic de démarrage à 4,5 A, régime à 1,6 A et
surintensité à 3,2 A sur obstacle, et un **tableau comparatif de quatre solutions
de détection**.

Deux documents dessinés : un **diagramme des exigences** en notation SysML simplifiée
(exigence mère « Motoriser le portail » et trois exigences dérivées : sécurité,
performance, autonomie) et la **chaîne de puissance** batterie → variateur → moteur →
réducteur → pignon-crémaillère. Plus un tableau de caractéristiques.

Chaîne de calculs vérifiée : durée d'ouverture 26,7 s (exigence < 30 s validée),
puissance utile 22,5 W, absorbée 37,5 W avec un rendement de 0,60, courant 1,56 A,
vitesse du pignon 71,6 tr/min et rapport de réduction 1/42, batterie 28,8 Wh pour
51 cycles (exigence de 5 largement tenue). Testé : 20/20.

Nouvelles questions apportées par ces documents : lecture directe du relevé et
**confrontation au calcul** (1,6 A mesuré contre 1,56 A calculé — le modèle est
validé par l'expérience, démarche attendue au bac), **choix d'un seuil de détection**
justifié par le relevé avec la nécessité d'inhiber la détection pendant le pic de
démarrage, calcul du **couple moteur** (3,00 N·m au pignon, 0,119 N·m au moteur,
vérifié par C×ω ≈ 37,4 W cohérent avec la puissance absorbée), et **choix argumenté
d'une solution de détection** à partir du tableau comparatif.

> Incohérence rattrapée avant livraison : l'en-tête annonçait 13 questions et
> 40 points alors que le tableau en comptait 12 pour 33. Barème rééquilibré à 40.

Ajouté au portail dans la section SI, en première entrée.

## Entrée « Sujets type DNB » en 3e (05/09/2026)

Décision de Mat : **ne garder que les sujets type DNB**. Le cours, le TP, l'évaluation
et le hub Domespace ont été SUPPRIMÉS du corpus, et l'entrée du portail est devenue
une entrée « Sujets type DNB » qui ne liste que les `05_brevet_*`.
Retirés aussi : l'évaluation `domespace` du tableau de bord (32 entrées) et le code
`DOMES14` de la table des codes.

Motif, dans ses mots : « on n'apprend pas vraiment les exercices du DNB, et les
questions sont posées sans avoir de schéma ou de descriptif ». Juste : le TP et
l'évaluation interrogeaient de mémoire, alors que l'épreuve consiste à EXPLOITER
DES DOCUMENTS. Seul le gabarit `05_brevet_*` fait ce travail.

**Sujets disponibles : 5.** `roue_tramway`, `serrure`, `chasse_eau`, `domespace`,
et **`trottinette`** (créé le 05/09). Tous sur le même moteur : 3 documents,
6 questions, 25 points, 30 minutes, correction seulement à la remise, mélange de
rédaction (mots-clés) et de calculs (tolérance numérique).

`05_brevet_trottinette.html` : chaîne d'énergie avec **deux fonctions laissées en
blanc** sur le schéma (c'est la question 1), caractéristiques techniques, et tableau
des essais d'autonomie du fabricant. Questions : fonctions de la chaîne, énergie de
la batterie (360 Wh) et durée à pleine puissance, écart entre autonomie annoncée et
mesurée (60 %), bridage réglementaire à 25 km/h, moteur-roue contre transmission par
chaîne, et impact environnemental d'une durée de vie de 18 mois (4 320 km). 25/25 testé.

> Les quatre fichiers Domespace supprimés restent récupérables dans l'archive ZIP
> livrée AVANT cette suppression, si Mat change d'avis.

## Évaluation des ponts — trois exercices remplacés (05/09/2026)

Demandé par Mat. Les trois retirés étaient des **restes de l'ancienne séquence
« Habitat & Ouvrages »**, hors sujet depuis le renommage en « Les ponts » :
« Le duel des murs » (isolation), « Calcule la flèche limite » et « Les économies de
l'isolation ». Remplacés à la MÊME position et au MÊME barème :

- [4] **Charge des camions sur le tablier** (3 pts) — pourcentage : 4 camions de
  **25 t** sur 150 t admissibles, soit **66,7 %**. Même type de calcul que `c82` du TP.
  L'énoncé demande un arrondi **au dixième** : avec 25 t le résultat n'est pas entier
  (66,666…), contrairement aux 24 t de la première version qui donnaient 64 % pile.
  Tolérance 0,2 — acceptés : 66,7 · 66.7 · 66,67. Refusés : 67, 66, 64.
  (Si Mat veut un résultat rond, passer la charge admissible à 200 t donne 50 %,
  ou à 125 t donne 80 %.)
- [9] **Traction ou compression ?** (2 pts) — la barre du dessous d'un treillis est
  étirée. Reprend `t93`/`t94` du TP (mission « tracer un treillis »).
- [10] **Espacement des suspentes** (2 pts) — division : 400 m ÷ 40 intervalles = 10 m.

Total inchangé : 11 activités, 29 points. Testé : les trois créditent bien leurs
points, aux index 4, 9 et 10 d'origine.

> **Piège d'édition contourné** : délimiter un littéral d'activité en cherchant le
> prochain `{ titre:` est fragile — la première tentative a emporté la fin du tableau.
> Passer par un **comptage d'accolades ignorant celles à l'intérieur des chaînes**.
> Attention aussi : les apostrophes des titres sont écrites `\u2019` dans le source,
> pas en caractère littéral — chercher les deux formes.

> **Conséquence sur le tableau de bord** : les copies DÉJÀ enregistrées gardent des
> points aux index 4, 9 et 10, qui correspondaient aux anciennes questions. Les
> statistiques par question mélangeront donc anciennes et nouvelles tant que ces
> copies restent dans la base. À vider si Mat veut des stats propres.

## Deux missions de calcul en plus dans les TP (21/09/2026)

Demandé par Mat : « les TP doivent avoir 2 exercices de plus, avec des calculs, pour
occuper les élèves plus longtemps. » Outil : `python3 _outils/ajouter_calculs_tp.py
[--dry]`, idempotent, avec les énoncés dans `_outils/calculs_tp.json`.

**TERMINÉ : les 32 TP au gabarit standard** sont traités (9 → 11 missions, 8 → 10
pour le mix énergie, 7 → 9 pour les deux TP CAPET). Les 4 TP restants du corpus ont
un gabarit différent (`dd_carnet`, `lecture_plan`, `materiaux`, `station_meteo_v3`)
et sortent de l'outil — à traiter à la main si besoin.

> **Les réponses ne sont JAMAIS saisies à la main** : le script qui fabrique le JSON
> les CALCULE à partir des données de l'énoncé. Énoncé et corrigé ne peuvent donc pas
> diverger — c'est le seul garde-fou fiable quand on écrit des dizaines d'exercices.

> **Le piège de l'insertion** : ajouter deux missions oblige à décaler le bilan
> (`aN` → `aN+2`, badge, appel à `reussir`), à ajouter deux segments à la barre de
> progression ET à décaler LES DEUX bornes du moteur (`for(let n=2;n<=N;n++)` et
> `if(n<N) setTimeout`). Sans ce décalage la chaîne de verrouillage casse et toutes
> les missions s'ouvrent d'un coup — même défaut que lors du retrait d'une mission au
> TP mix énergie. L'outil refuse d'ailleurs tout TP dont la numérotation est déjà
> incohérente, plutôt que d'aggraver le désordre.

Contenus : portée et flèche d'un viaduc, nombre de panneaux solaires et rendement
d'une centrale, rapport de transmission et pignon-crémaillère, autonomie et coût de
recharge d'un VAE, développement et vitesse d'un vélo, vitesse d'un robot et
temporisation à programmer, facture de chauffage et retour sur investissement d'un
thermostat, durée de téléchargement et partage de débit.

Vérifié : 32/32 TP avec numérotation cohérente, 2 verrous au départ des nouvelles
missions, calculs acceptés aux bonnes valeurs et refusés sur une erreur classique
(rapport de transmission inversé), 36/36 TP se chargent proprement.

## Tableaux de bord : plus récent en haut (21/09/2026)

Demandé par Mat : la dernière copie reçue en haut de liste.
- **Tableaux intégrés (30 évaluations)** : triaient par classe puis nom. Désormais
  par date décroissante, sur l'horodatage brut (`Date.parse`).
- **Tableau global** (`000_tableau_de_bord.html`) : il était CENSÉ trier par date
  décroissante (`tri={col:'date',sens:-1}`) mais **ne le faisait pas** — la date y
  était stockée DÉJÀ FORMATÉE (« 21/09/2026 ») et le tri comparait ce texte, donc par
  jour du mois : le 06/10 passait derrière le 21/09, et deux copies du même jour
  n'étaient pas départagées. Ajout d'un champ `ts` (horodatage) utilisé pour trier la
  colonne Date ; l'affichage montre maintenant la date ET l'heure.
- `05_tableau_bord_materiaux.html` : déjà correct (tri sur `timestamp` brut), non modifié.
Vérifié sur 4 copies de dates croisées : même ordre exact dans les deux tableaux.

> Leçon : ne jamais trier sur une valeur mise en forme pour l'affichage. Garder la
> valeur brute pour le tri, formater seulement au moment d'afficher.

## Copie envoyée même en cas d'abandon, reprise verrouillée (06/09/2026)

Demandé par Mat : les résultats ne partaient qu'à la fin ; un élève pouvait donc
fermer la page, puis relancer l'évaluation pour tricher.
Outil : `python3 _outils/copie_abandon.py [--dry]`, idempotent. **32 évaluations** :
les 30 du gabarit ACTIVITES, plus les 2 du gabarit QCM (sorciers), traitées à part.

Fonctionnement :
1. Au démarrage, la tentative est inscrite dans le navigateur (`localStorage`,
   clé `tentative_<nœud Firebase>` — 30 clés distinctes vérifiées, aucune collision).
2. Si la page est quittée avant la fin, la copie partielle part avec
   **`statut:'abandon'`** : points acquis, ZÉRO pour les activités non faites,
   note calculée sur le total. Une seule fois, même si l'événement se répète.
3. À la réouverture, **l'évaluation est verrouillée**. Seul le mot de passe
   professeur autorise une nouvelle tentative.
Les copies terminées portent désormais `statut:'terminee'`.

> **Choix techniques à ne pas défaire :**
> - `pagehide` et NON `visibilitychange` : ce dernier se déclenche aussi quand
>   l'élève change d'onglet, il l'aurait verrouillé à tort.
> - `fetch(..., {keepalive:true})` **sans en-tête Content-Type** : la requête reste
>   « simple » au sens CORS et part même pendant la fermeture de la page.
>
> **Gabarit QCM** : le nom se saisit EN BAS de page. Une copie abandonnée n'est donc
> envoyée que si nom et classe sont déjà remplis ; le verrou, lui, s'applique dès la
> première réponse cochée.
>
> **Rechargement (F5)** : couvert — il déclenche `pagehide` comme une fermeture ;
> la copie part, puis la page rouverte affiche l'écran verrouillé.
>
> **Retour arrière — ajouté le 06/09 après vérification.** Quand l'élève quitte par
> un lien puis revient avec Retour, le navigateur peut restaurer la page depuis son
> cache (bfcache) SANS la recharger : le verrou, posé au chargement, ne s'activait
> pas et l'élève retrouvait l'évaluation en l'état. Correction : écoute de `pageshow`
> avec `persisted`, qui force un `location.reload()` si une tentative inachevée
> existe. Vérifié : déclenché seulement dans ce cas, ni au chargement normal ni après
> une copie terminée.
>
> **Limite assumée** : le verrou vit dans le navigateur. Navigation privée ou autre
> navigateur permettent de recommencer — mais la copie abandonnée est déjà partie.

> **RÈGLE FIREBASE À RECOLLER** : le nœud `evaluations` refusait tout champ inconnu
> (`$autre: false`). Le champ **`statut`** y a été ajouté (chaîne ≤ 20 caractères).
> Sans cela, les copies abandonnées ET les copies terminées seraient rejetées.

> **VERSION 2 (06/09) — la v1 mentait.** Test de Mat : l'écran verrouillé
> affichait « la copie a été transmise », mais rien dans le tableau de bord.
> Deux causes cumulées : (1) très probablement, règles Firebase pas encore
> recollées → le champ `statut` rejeté ; (2) défaut de conception de la v1 : le
> drapeau « envoyé » était posé AVANT de connaître le résultat, sans nouvel essai,
> et le message l'affirmait sans vérification. Un envoi pendant la fermeture de
> page (keepalive) ne permet PAS de lire la réponse de la base.
> Refonte :
> - la copie partielle est gardée DANS LE NAVIGATEUR, mise à jour toutes les 8 s ;
> - elle est écrite sous un **identifiant FIXE** tiré au démarrage (`PUT`, et non
>   `POST` qui crée une clé aléatoire) : on peut donc la RELIRE ;
> - à la réouverture, `GET` vérifie si elle est arrivée ; sinon `PUT` la renvoie,
>   cette fois en attendant la réponse ;
> - le message dit la vérité : reçue, transmise à l'instant, refusée (avec la raison
>   renvoyée par la base et l'indication « règles Firebase à mettre à jour »), ou pas
>   de connexion. Une copie non confirmée est retentée à CHAQUE ouverture.
> Conséquence utile : **une copie refusée avant la mise à jour des règles est
> rattrapée** à la réouverture suivante. Testé sur les deux gabarits, avec une base
> simulée qui refuse puis accepte le champ `statut` : les 3 cas donnent le bon
> message, et aucun doublon (l'identifiant fixe l'interdit : la règle refuse d'écraser).

> **CORRECTIF v2.1 (21/09) — faux refus lors d'un RECHARGEMENT.** Test de Mat sur
> l'éco-conception : « Copie NON transmise (Permission denied) » alors que les règles
> étaient à jour (l'éval des ponts fonctionnait). Cause, reproduite en forçant
> l'ordre des requêtes : COURSE entre deux envois. Au rechargement, l'ancienne page
> envoie sa copie en partant et la nouvelle démarre aussitôt : elle LIT (copie pas
> encore arrivée), l'envoi de sortie ATTERRIT, elle ÉCRIT → la règle interdit
> d'écraser (`!data.exists()`) → « Permission denied ». **Le refus signifiait que la
> copie était déjà là.** La copie de test de Mat est donc très probablement en base.
> Correction : attente de 1,5 s avant la vérification, et surtout **relecture après
> un refus** avant de conclure. Vérifié dans l'ordre forcé (« bien reçue »), sur les
> deux gabarits, et non-régression des 3 scénarios de règles (vrai refus toujours
> signalé, rattrapage, cas normal).
> Leçon : un refus d'écriture sur une règle « ajout seul » est AMBIGU — il peut
> vouloir dire « déjà présent ». Toujours relire avant d'annoncer un échec.

Tableaux de bord : une pastille rouge **ABANDON** s'affiche à côté du nom, dans le
tableau intégré à chaque évaluation et dans `000_tableau_de_bord.html`.

## Ordre des questions aléatoire dans les évaluations (05/09/2026)

Demandé par Mat : éviter la copie entre postes mitoyens. **30 évaluations** traitées.
Outil : `python3 _outils/melanger_questions.py [--dry]`, idempotent.

> **CE QU'IL NE FALLAIT SURTOUT PAS FAIRE : mélanger le tableau `ACTIVITES`.**
> Les points sont stockés dans `pts[]` indexé par numéro d'activité, et le tableau de
> bord recoupe ces indices (`ACTIVITES[c.activite]` pour le détail d'une copie,
> `ACTIVITES.map((a,i)=>…)` pour les stats par question, colonnes `Act1…ActN` du CSV).
> Mélanger le tableau aurait fait que la « question 3 » de Léa n'aurait pas été celle
> de Tom : **statistiques fausses, sans aucun signal d'erreur.**
>
> Solution retenue : une permutation SÉPARÉE, `ORDRE`, utilisée uniquement pour
> l'affichage. L'activité montrée au rang `idx` est `ACTIVITES[ORDRE[idx]]`, mais les
> points sont écrits dans `pts[ORDRE[idx]]`, donc à l'index D'ORIGINE. Le format
> envoyé à Firebase est inchangé, et le tableau de bord n'a pas eu à bouger.
>
> Mélange par **Fisher-Yates**, pas par `sort(() => 0.5 - Math.random())` : ce dernier
> est biaisé et ne donne pas toutes les permutations avec la même probabilité. Il
> reste utilisé ailleurs dans le corpus pour mélanger des paires à relier, où le biais
> est sans conséquence.

Vérifié : sur 6 ouvertures, 5 premières activités différentes ; les 11 activités
défilent toutes sans doublon ; les 9 champs envoyés à Firebase sont inchangés.

## Classes : menus déroulants harmonisés (04/09/2026)

Liste officielle : 5A 5B 5C 5D 5E · 4A 4B 4C 4D 4E · 3A 3B 3C 3D 3E · **3PM**.
Les 33 évaluations proposent un menu, **aucun champ libre**.

**Mise à jour du 05/09 :** à la demande de Mat, **chaque évaluation propose les 16
classes**, tous niveaux confondus — et plus seulement celles de son niveau. Le filtre
du tableau de bord intégré a été élargi de la même façon, sans quoi une classe d'un
autre niveau aurait pu passer l'évaluation sans jamais apparaître dans les filtres.

> **Contrepartie assumée** : un élève de 5e peut désormais se déclarer en 3B, par
> erreur ou volontairement. L'ancienne restriction par niveau l'empêchait. En
> échange, une classe peut passer n'importe quelle évaluation — utile pour la 3PM,
> la remédiation ou un usage hors niveau. Ne pas « re-restreindre » sans son accord.

Trois corrections distinctes :
- **3PM ajouté aux 10 évaluations de 3e.** Attention, chaque fichier contient DEUX
  listes de classes : celle de saisie (`#fClasse`) et celle du filtre du tableau de
  bord intégré (`#filtreClasse`). Sans les deux, la classe 3PM aurait pu saisir mais
  pas être filtrée. Les deux ont été mises à jour.
- `04_evaluation_ponts_sorciers.html` : champ libre remplacé par un menu 5A-5E.
- `04_evaluation_materiaux.html` : **format incohérent corrigé.** Cette évaluation
  proposait « 5e A », « 4e B »… avec un espace, là où les 31 autres écrivent « 5A ».
  Les deux formats ne se seraient jamais regroupés dans le tableau de bord global.
  Liste normalisée et 3PM ajouté. (Séquence classée « ne pas toucher », mais la
  cohérence des données primait — signalé à Mat.)

Vérifié : 32/32 chargent proprement avec un menu, et la classe choisie remonte bien
à Firebase (testé sur l'évaluation des sorciers, valeur `5C`).

> **Les résultats déjà enregistrés au format « 5e A » restent tels quels** dans la
> base. S'il en existe, ils apparaîtront comme une classe distincte de « 5A ».

## TP transmissions 4e — deux corrections (05/09/2026)

**Exercice 3 : libellés superposés.** « MOTEUR · Z₁=12 · 120 tr/min » mesure ~190 px,
écrit sous des roues espacées de 83 px quand Z₁=Z₂=12 : les deux textes se
chevauchaient. Raccourcis sur deux lignes (« MOTEUR » puis « Z₁=12 »), et la vitesse
d'entrée remontée dans le bandeau du haut, où la place existe. Vérifié au rendu.

**Exercice 5 : courroie à contresens.** Les deux poulies tournent en sens ANTIHORAIRE
(vitesse négative passée à `roueDentee`). Or sur une poulie antihoraire le sommet
part vers la GAUCHE : le brin du haut doit défiler vers la gauche, celui du bas vers
la droite. Les deux `lineDashOffset` étaient inversés — la courroie remontait la
charge à l'envers par rapport aux roues.

**Exercice 5 : brins mal posés.** Les deux brins étaient tracés à y=158 et y=202,
donc À L'INTÉRIEUR de la roue (qui s'étend de 122 à 238) : la courroie traversait la
poulie au lieu de s'appuyer dessus. Remplacés par les **tangentes extérieures**
calculées d'après les rayons (inclinaison `asin((R1-R2)/d)`, soit 4,5° ici). Points
obtenus : (334,122)→(662,148) en haut, (334,238)→(662,212) en bas — 36 px d'écart
avec l'ancien tracé. Le calcul reste juste si on change un rayon.

> **RÉGRESSION CORRIGÉE (05/09) — zone cliquable de la courroie dans le vide.**
> Signalé par Mat : « la hitbox de la courroie est trop faible, on a du mal à cliquer ».
> Cause : la zone était un rectangle y 150→200. Quand j'ai corrigé le tracé en
> tangentes extérieures, les brins sont passés à y≈122-148 et y≈212-238 — la zone se
> retrouvait ENTRE les deux brins, dans le vide. Mon correctif géométrique avait
> cassé l'interaction sans que je vérifie la zone de clic.
> Correction : détection par **distance aux brins** (tolérance 18 px), limitée à la
> partie centrale pour ne pas empiéter sur les poulies. Et **retour visuel** ajouté,
> sur remarque pédagogique de Mat : quand une étiquette est choisie, l'organe survolé
> s'illumine, le curseur devient une main et une invite « clique ici ? » apparaît.
> Vérifié : brins cliquables, vide refusé, invite absente sans étiquette choisie.
>
> **Leçon : modifier la géométrie d'un dessin impose de revérifier ses zones de
> clic.** Le dessin et sa hitbox sont décrits séparément dans le code ; rien ne les
> tient synchronisés. Désormais la courroie calcule ses brins UNE fois (`BRINS`) et
> s'en sert pour le tracé ET pour la détection.

> **Généralisé le 05/09 à tous les exercices d'étiquettes** — outil
> `python3 _outils/surbrillance_zones.py [--dry]`, idempotent. Deux mécaniques :
> - **29 TP** (canvas + rectangles ZONES) : surbrillance par un **calque HTML posé
>   au-dessus du canvas**, et non dessinée dedans — beaucoup de ces canvas ont leur
>   propre boucle d'animation, qu'il aurait fallu retrouver fichier par fichier.
>   Le calque est indépendant de la boucle de rendu.
> - **30 évaluations** (fonction commune `widgetEtiquettes`, clic sur la forme SVG
>   elle-même) : ajout d'un **halo**, clone transparent au trait élargi de 22 px, qui
>   transmet le clic à la forme d'origine. Un câble de 8 px devient une cible de 30 px.
>   Les **groupes `<g>`** (6 cas) ne se clonent pas utilement : la surbrillance est
>   branchée directement sur le groupe, dont les enfants reçoivent déjà les clics.
> Règle commune : **rien ne s'affiche tant qu'aucune étiquette n'est choisie**, pour
> ne pas souffler la réponse. Vérifié : 29/29 TP et les deux cas d'évaluation
> (forme simple et groupe) ; 69 fichiers se chargent proprement.

> **Ces deux défauts ne se voient pas sur un rendu fixe pour le sens**, et le mauvais
> positionnement sautait aux yeux dès le premier rendu — mais personne n'avait rendu
> ce canvas. Même famille que l'erreur d'axe de rotation de la serrure.
> Pour toute animation : vérifier que le SENS est cohérent avec la pièce qui entraîne,
> et RENDRE le canvas pour contrôler la géométrie.

## Classement en ligne dans les jeux (05/09/2026)

**70 jeux sur 71** ont un classement : bouton « Classement » en bas à gauche, top 10,
saisie du prénom, et un lien discret « moderation » protégé par le mot de passe des
tableaux de bord, qui affiche jusqu'à 100 entrées avec un bouton « retirer » sur
chacune. Outil : `python3 _outils/ajouter_classement.py [--dry] [--seulement f.html]`,
idempotent.

> **Le code des jeux n'a PAS été modifié.** Le module enveloppe
> `localStorage.setItem` et réagit aux deux seules conventions de clé du corpus :
> `<jeu>_record` (60 jeux) et `<CLE>_rec3` (11 jeux de la série 03c). Seuls les
> RECORDS PERSONNELS déclenchent la proposition de signer : une partie ordinaire
> n'envoie rien, ce qui limite fortement le volume et le spam.
> `03_jeu_defi_materiaux.html` est le seul écarté : il n'a aucune clé de record
> (séquence matériaux, importée avec sa propre mécanique).

**Filtre de pseudos** : liste courte, appliquée après normalisation (accents retirés,
chiffres « leet » remis en lettres, lettres répétées réduites). « C0nnard », « c o n »
et « pUuuTe » sont donc attrapés, « Léa » ou « xX_Noa_Xx » passent. Il est
volontairement imparfait — c'est la modération qui tranche.

> **NOUVELLE RÈGLE FIREBASE À COLLER** (`_outils/regles_firebase.json`, nœud
> `highscores`). Elle autorise la création ET la suppression :
> `!data.exists() || !newData.exists()`. La suppression est indispensable à la
> modération, mais **n'importe qui connaissant l'URL peut donc supprimer une entrée**.
> La base n'a pas d'authentification : le bouton modération est protégé côté
> navigateur seulement. Le risque est limité (on ne peut que retirer un score, pas
> en modifier un), mais il est réel — arbitré avec Mat.
> Le `.validate` borne le pseudo à 2-16 caractères et le score à 1 000 000.

## Formes d'énergie du cours 5e — NE PAS AJOUTER (05/09/2026)

Question de Mat : faut-il ajouter l'énergie sonore aux 5 formes du cours
(`01_cours_energies.html`, slide `s2` : mécanique, électrique, thermique, chimique,
lumineuse) ? **Décision : on laisse en l'état.**

- Le **son n'est pas une 6e forme** : c'est une vibration de la matière, donc de
  l'énergie MÉCANIQUE. C'est pourquoi il ne traverse pas le vide, contrairement à
  la lumière. En faire une carte séparée installerait une erreur de classification.
- Le **nucléaire**, lui, manque vraiment : il est cité une fois dans le mix, et
  l'uranium apparaît à l'exercice 1 du TP, mais aucune carte ne lui correspond.
  Proposé à Mat, **refusé pour l'instant** — ne pas le rajouter de sa propre
  initiative.

## TP mix énergie — trois corrections (04/09/2026)

**Exercice 1 : tout faux débloquait la mission 2.** Le compteur `etat.q1ok` était
incrémenté aussi bien sur bonne que sur mauvaise réponse ; les 8 items « traités »
suffisaient à appeler `reussir(1,2)`. Désormais un item faux **reste actif** (le
marquage rouge s'efface après 0,9 s) et seul un item juste incrémente le compteur :
il faut donc les 8 bonnes réponses pour avancer. Les étoiles dépendent du nombre
d'erreurs (`err1`), au lieu d'être figées à 2.
Vérifié : tout faux ne débloque plus, tout juste débloque.

**Exercice 7 : énoncé physiquement faux.** Il disait « une éolienne produit 2 MW »,
en confondant puissance et énergie. Corrigé en « une éolienne d'une puissance de
2 MW produit donc 2 MWh chaque heure de fonctionnement », et le rappel d'unités est
passé à la ligne, en ambre : « 1 MW = 1000 kW, donc 1 MWh = 1000 kWh ».
Les réponses attendues sont inchangées (4 000 000 kWh, 1000 foyers, 25 éoliennes).

**Symbole parasite retiré** : le libellé du bouton était « ⬇ Non renouvelable ».

> **« Conduite forcée » est le terme exact** — vérifié, le fichier l'écrit
> correctement. Une conduite forcée est une conduite où l'eau circule sous pression.
> « Forgée » renverrait au forgeage du métal, sans rapport. Ne pas « corriger ».

## Bouton calculatrice des TP (04/09/2026)

Le rond noir en bas à droite affichait la lettre « C » : peu parlant. Remplacée par
une **calculatrice dessinée en SVG** (écran + six touches), dans les **31 fichiers**
qui portent ce bouton. Pas d'emoji, conformément à la convention : le pictogramme
est vectoriel et hérite de la couleur du bouton via `currentColor`.
Libellé passé de « calcul » à **« calculatrice »**. Le mot ne tenait pas dans le rond
de 60 px, même en réduisant la police : bouton élargi à **68 px** et police à 8,5 px.
Vérifié au rendu à la taille réelle avant application.
`aria-label` ajouté pour les lecteurs d'écran.
Le CSS `#calcBtn .ic` passe de `font-size:19px` à `margin:0 auto 1px`, l'icône
n'étant plus du texte.
Vérifié : 31/31 fichiers, aucun emoji, et les 30 TP se chargent toujours proprement.

## BUG BLOQUANT — variables non déclarées cassant le déverrouillage (04/09/2026)

Signalé par Mat : dans le TP des ponts, réussir la mission 5 ne débloquait pas la 6.
Cause : `err5` était **incrémentée et lue sans avoir été déclarée**. L'appel
`reussir(5, err5===0?3:…)` levait une `ReferenceError` AVANT d'entrer dans la
fonction : le score n'était pas crédité et `etat.debloque` n'avançait jamais.
Le verdict « Schéma complet ! » s'affichait quand même, puisqu'il est écrit juste
avant l'appel — d'où un TP qui semble fonctionner mais reste bloqué.

Recherche systématique dans tout le corpus : **7 cas, dans 3 TP**, tous à l'intérieur
d'un `reussir()`, donc tous bloquants :
`02_tp_ponts.html` (err5, essais6), `02_tp_maison_connectee.html` (essais2, essais6,
err5), `02_tp_robot.html` (essais2, essais6, err5).
Toutes déclarées à `0` en tête de leur bloc. Vérifié : la mission 6 des ponts se
débloque, `debloque` passe bien de 5 à 6, et les 30 TP se chargent toujours
proprement avec une chaîne de verrouillage cohérente.

> **Ce défaut est invisible au chargement** : la variable n'existe qu'au moment du
> clic de validation. Les tests de chargement ne le voient pas. Contrôle à refaire
> après toute modification d'un TP :
> `grep -oE '\b(err|essais)[0-9]\b' fichier.html | sort -u`
> puis vérifier que chacune est déclarée par un `let`.

## Kahoot : 3 séquences, hub + raccourci portail (04/09/2026)

Kahoots présents dans **5 hubs** : `energies_5e`, `chaine_energie_4e`,
`habitat_5e` (quiz `162e5bcd…`), `materiaux` (`d3380584…`) et `cycle_de_vie`
(`27b912e8…`). Ces deux derniers ont chacun un gabarit de carte différent :
matériaux utilise les cartes riches (`card-icon`, `card-meta`, `card-cta`),
cycle de vie le gabarit simple (`num`, `icone`, `tag`). Respecter le gabarit du hub.
Un **raccourci « Kahoot » a été ajouté dans le portail** pour ces trois séquences.

Outil : `python3 _outils/raccourcis_kahoot.py [--dry]`, idempotent.
**Il LIT le lien dans le hub** et le recopie dans le portail : aucune saisie
manuelle, et le portail ne peut pas diverger du hub. À relancer après avoir ajouté
un Kahoot à un nouveau hub — c'est la seule chose à faire.

> **CORRECTION (05/09) — affirmation fausse ci-dessus.** Les Kahoots ne sont PAS
> dans le suivi d'avancement. L'extraction exclut tous les liens commençant par
> `https:` (règle posée pour ignorer les activités bonus hébergées ailleurs), et
> un Kahoot en fait partie. Vérifié : le compteur reste à 178 modules après l'ajout
> de 2 Kahoots.
> **18 liens externes sont ainsi hors suivi** : 5 Kahoot et 13 autres (vidéos,
> activités bonus). Les Kahoots et les vidéos sont pourtant des séances réelles.
> À arbitrer avec Mat : lever l'exclusion pour les Kahoot et les vidéos revient à
> retirer le test `^https?:` et à filtrer plutôt sur le libellé.

## Séquence « Habitat & Ouvrages » renommée « Les ponts » (04/09/2026)

15 occurrences remplacées dans 9 fichiers : portail, hub, cours, jeux Bâtisseur et
Inspecteur, les deux évaluations, le tableau de bord et le suivi.
Les NOMS DE FICHIERS sont inchangés (`00_hub_habitat_5e.html`, `04_evaluation_habitat.html`) :
les renommer aurait cassé tous les liens sans bénéfice.

> **Effet sur le suivi d'avancement.** Les clés y valent `niveau|séquence|module` :
> celles de cette séquence sont passées de `5e|Habitat & Ouvrages|…` à
> `5e|Les ponts|…`. **Un avancement déjà coché sous l'ancien nom n'est plus
> retrouvé** — il reste dans Firebase, orphelin. À recocher si besoin. Peu de
> conséquences aujourd'hui, mais à garder en tête avant tout renommage futur.

> **Défaut corrigé au passage :** `04_evaluation_domotique.html` et
> `04_evaluation_robotique.html` avaient un `<title>` erroné, « Évaluation 5ème —
> Habitat & Ouvrages ». C'est la même erreur de copie que celle déjà trouvée dans
> le tableau de bord. Titres remis d'après leur séquence réelle.

Carte « Kahoot — quiz de révision » ajoutée en dernière position de
`00_hub_energies_5e.html` et `00_hub_chaine_energie_4e.html`, ouverture dans un
nouvel onglet. Le `&` de l'URL est écrit `&amp;` dans le HTML : vérifié que le lien
reconstruit contient bien `hostId` intact.

> **C'est un lien HÔTE, pas un lien élève.** `play.kahoot.it/v2/?quizId=…&hostId=…`
> lance la partie côté professeur et affiche le PIN. Les élèves, eux, passent par
> kahoot.it avec ce PIN. Ne pas diffuser cette carte aux élèves.
> Le lien dépend aussi du compte Kahoot de Mat : s'il change de compte ou supprime
> le quiz, les deux hubs pointeront dans le vide sans que le contrôle de liens morts
> le détecte (il ne teste que les fichiers locaux).

> **Non ajouté au portail**, donc **absent du suivi d'avancement** (qui s'alimente
> depuis `index.html`). À signaler à Mat s'il veut pouvoir le cocher.

## Suivi des classes (03/09/2026)

`000_suivi_classes.html` — tableau croisé séquences × classes. Un clic sur une case
la fait passer de « à faire » à « en cours » puis « terminé ». Enregistrement
automatique. Filtres par niveau, classe, état et texte ; résumé par classe avec
pourcentage et jauge ; export CSV. Les classes s'ajoutent et se retirent depuis la
page (pour retirer : sélectionner la classe dans le filtre, puis « Retirer »).
Accès par le mot de passe des tableaux de bord. Lien ajouté au Coin professeur du portail.

> **NOUVELLE RÈGLE FIREBASE À COLLER.** Le nœud `suivi_classes` a été ajouté à
> `_outils/regles_firebase.json`. **Il faut recoller le fichier dans la console**,
> sinon la page affichera « Lecture impossible » et n'enregistrera rien.
> Contrairement aux évaluations, ce nœud autorise la **mise à jour** (`.write` sans
> `!data.exists()`) puisqu'on modifie l'avancement en continu. Le `.write` exige la
> présence de `classes` et `etat`, et `$autre: false` interdit tout autre champ :
> un tiers ne peut pas y écrire n'importe quoi, mais il pourrait écraser le suivi.
> C'est le compromis assumé d'une base sans authentification.

**Mise à jour du 03/09 — suivi au MODULE, plus à la séquence.** Le tableau a deux
niveaux : une ligne par séquence (repliable, avec un récapitulatif « faits / total »
et une jauge par classe), puis une ligne par module en dessous.
**35 séquences, 177 modules** (Cours, TP, jeux, Évaluation…), extraits du portail.
Navigation par **onglets de niveau** (5e, 4e, 3e, SI). Depuis le 04/09, **chaque
onglet ne montre que les classes de son niveau** : le 5e affiche 5A à 5E, le 3e
affiche 3A à 3E plus 3PM. Le niveau est déduit du NOM de la classe (premier chiffre),
il n'est stocké nulle part. Une classe dont le nom ne commence ni par 3, ni par 4,
ni par 5 n'apparaît que dans les onglets sans aucune classe correspondante — utile
pour d'éventuelles classes de lycée. Le résumé et le filtre Classe suivent la même
restriction ; **l'export CSV, lui, reste complet, toutes classes confondues.**
Plus
deux boutons **« Regrouper tout »** et **« Développer tout »** qui agissent sur
l'onglet courant. Le pliage est mémorisé : un clic sur une case ne redéploie pas tout.

> **PIÈGE D'EXTRACTION — 6 séquences et 32 modules avaient été oubliés.** Le portail
> utilise DEUX classes pour les listes de liens : `.ressources` dans la plupart des
> blocs, mais `.liens` dans certains (« L'eau dans la ville », « Météo & instruments
> de mesure »…). La première extraction ne prenait que `.ressources`. Le sélecteur
> correct est `.ressources a, .liens a`. À réutiliser pour toute regénération.
Les liens externes et les hubs sont exclus : ce ne sont pas des modules à faire.

> **Clé de stockage : `niveau|séquence|module`.** Choisie stable exprès — un simple
> numéro d'ordre aurait décalé tout l'avancement au moindre changement d'ordre dans
> le portail. Les 144 clés ont été vérifiées contre les caractères interdits par
> Firebase (`.` `$` `#` `[` `]` `/` et caractères de contrôle) : aucune n'est invalide.

> **RÈGLE FIREBASE INCHANGÉE.** Le passage au suivi par module ne change ni la forme
> de la charge (`{classes, etat, maj}`) ni la profondeur : les clés de modules sont
> des enfants de `etat/<classe>/`, que la règle ne valide pas individuellement.
> Vérifié en simulant l'enregistrement. **Si tu as déjà collé les règles à l'étape
> précédente, il n'y a rien à refaire.**

> **La liste est FIGÉE dans le fichier** (constante `SEQS`). Après ajout d'une
> séquence ou d'un module au portail, la réextraire : parcourir `section.niveau`,
> puis `.seq h3` pour la séquence et `.ressources a` pour ses modules dans
> `index.html`, en excluant le libellé « Hub » et les liens `https://`.

## Évaluation des sorciers — Les ponts (03/09/2026)

`04_evaluation_ponts_sorciers.html` : 12 QCM sur l'épisode de « C'est pas sorcier »
consacré aux ponts. Ajoutée à la séquence **Habitat & Ouvrages** (5e), avec le lien
vidéo placé JUSTE AVANT l'entrée d'évaluation dans le portail, comme demandé.
Le lien figure aussi en tête de l'évaluation elle-même, avec la consigne de prendre
des notes. Code de déverrouillage : `SORCIER7` (verrou sans persistance, comme les 30
autres). Remontée Firebase sur `evaluations/ponts_sorciers`, mêmes 9 champs que les
autres évaluations, donc couverte par les règles en place.
Chaque question affiche son explication après l'envoi.

> **CORRIGÉ le 03/09 — position des bonnes réponses.** Signalé par Mat : 11 bonnes
> réponses sur 12 étaient en position centrale. Un élève cochant systématiquement le
> milieu obtenait 11/12 sans rien savoir. Redistribution en 4 / 4 / 4 sur les trois
> positions, sans série de plus de deux identiques. La même stratégie ne rapporte
> plus que 4/12, soit 6,7/20. Vérifié que seul l'ORDRE a changé : énoncés,
> propositions, explications et bonnes réponses sont identiques.
>
> **RÈGLE POUR TOUTE NOUVELLE ÉVALUATION À QCM : contrôler la répartition des
> positions avant livraison.** C'est un biais qui ne se voit pas à la relecture des
> questions une par une — il faut compter. Commande de contrôle :
> `grep -o '\],b:[0-9]' fichier.html | sort | uniq -c`
> Idéalement, répartir à parts égales entre toutes les positions.
Ajoutée au **tableau de bord global** (`000_tableau_de_bord.html`, 31 entrées) : elle
apparaît dans le menu des séquences après saisie du mot de passe.

> **Aucune modification des règles Firebase n'a été nécessaire** : la règle
> `evaluations/$sequence/$copie` utilise un joker, elle couvre donc `ponts_sorciers`
> sans rien changer. Les 9 champs envoyés sont exactement ceux autorisés par le
> `.validate`. C'est l'intérêt d'avoir écrit la règle avec `$sequence` plutôt qu'en
> énumérant les séquences : toute nouvelle évaluation posée sous `/evaluations/`
> remonte sans toucher à la console.

> **À RELIRE AVANT USAGE.** Je n'ai PAS pu visionner la vidéo : YouTube a renvoyé une
> erreur 429 et la recherche n'a rien donné. Les questions portent donc sur les notions
> que ce type d'épisode traite nécessairement — familles de ponts, traction et
> compression, tablier/piles/culées, portée, haubans contre suspendu, dilatation,
> béton armé, triangulation, fondations, poids propre. **Aucune ne s'appuie sur une
> anecdote ou un chiffre précis de l'épisode.** Vérifier que le vocabulaire employé
> correspond bien à celui de la vidéo avant de la donner en évaluation notée.

## Séquence binaire — cours créé (02/09/2026)

`01_cours_binaire.html` créé pour accompagner le TP externe
https://gengiscard.github.io/Binaire/ , ajouté à la section **Quatrième** du portail
(cours interne + 3 liens externes : 13 exercices, salle d'arcade 7 jeux, évaluation
12 activités).

Le cours suit le TP point par point, après lecture du TP en ligne : deux états et
fiabilité du tout-ou-rien, bit et octet, poids des bits, binaire naturel,
hexadécimal par paquets de 4, ASCII, couleurs RVB, DCB et code Gray.
Page déroulante (pas un diaporama), 6 schémas au canvas, plus un **convertisseur
interactif** qui affiche le même octet en binaire, décimal, hexadécimal et DCB —
il reprend le « convertisseur universel » du TP.
Les flèches utilisent la méthode correcte (`FLECHE()`, pointe au point d'arrivée,
trait raccourci, `lineCap='butt'`).

> **Reste à faire sur ce cours** : il n'a pas encore de bloc `sObj` ni de `sTrace`,
> contrairement aux 35 autres. À ajouter avec `_outils/enrichir_cours_deroulants.py`
> (ancrages `</h1>` et `</body>`, présents et uniques).

Le TP écrit sur les nœuds Firebase `tp_binaire` et `tp_binaire_eval`, déjà présents
dans les règles.

## Section « En plus » du portail (02/09/2026)

Ajoutée dans `index.html` entre la 3e et le lycée : 6 activités hébergées sur des
dépôts GitHub séparés, ouvertes dans un nouvel onglet (`target="_blank"`).
Erebus7 · Rouillo · technooubli-es · Perceuse · perteenergie · jointsilicone ·
Fabclicker · TechnoSurvivor. **8 entrées.**

> **Descriptions à confirmer par Mat.** Seules celles d'**Erebus-7** et de
> **ROUILLO** ont été écrites d'après le contenu réel des pages (récupéré en ligne).
> Les quatre autres n'ont PAS été consultées — leurs pages sont volumineuses — et
> leur description est déduite du nom du dépôt seulement. À relire et corriger.

Ces activités vivent hors du corpus : elles ne sont ni dans le ZIP, ni couvertes par
les contrôles de liens morts, ni par les tests de chargement. `Perceuse` écrit
vraisemblablement sur `resultats_perceuse`, nœud déjà présent dans les règles Firebase.

## Chantiers en cours — par ordre de priorité

### 1. Régression MOTEUR80 (4e) — RÉSOLU
`03_jeu_moteur_rush.html` recréé : « Moteur Rush », tri de 18 composants par fonction
(4 ALIMENTER ou STOCKER, 4 DISTRIBUER, 5 CONVERTIR, 5 TRANSMETTRE), code `MOTEUR80`,
clés `moteurrush_ok` / `moteurrush_record`. Chaque composant est un schéma vectoriel ;
un bandeau permanent montre les 4 maillons dans l'ordre et allume celui concerné.
Bonus de 60 points quand les 4 maillons sont enchaînés sans erreur.
Recâblé : `00_hub_chaine_energie_4e.html`, `02_tp_garage_vae.html`,
`000_portail_technologie.html`, plus les deux tables de codes.
`03b_jeu_sos_depannage.html` portait déjà `MOTEUR80` : inchangé.
Les liens 3e vers `03_jeu_watt_rush.html` (hub énergie 3e, TP dispatching, portail)
sont volontairement conservés : ce fichier est bien la version 3e (`RESEAU50`).
Vérifié : `node --check`, jsdom (déverrouillage, score, vies, combo, chrono, rejeu),
rendu des 18 schémas et des 2 canvas à l'image.

### 2. Règles Firebase — RÉSOLU
Les règles de `_outils/regles_firebase.json` ont été collées par Mat et **fonctionnent**
(confirmé le 01/09/2026). Les 30 tableaux de bord remontent. Détail conservé ci-dessous
pour mémoire.

#### (historique) Règles Firebase — rédaction
Fichier prêt : **`_outils/regles_firebase.json`** (JSON strict, à coller en
remplacement intégral dans la console). Les 13 nœuds existants sont reconduits
à l'identique ; le nœud `evaluations` est ajouté.
Cause de la panne : le wildcard racine `$eval_si` exige `beginsWith('eval_')` ou
`beginsWith('resultats_si_')` ; or `evaluations` commence par `eval` puis `u`.
L'écriture échouait aussi car `/evaluations/<séq>/<clé>` fait trois niveaux
alors que `$eval_si/$copie` n'en prévoit que deux.
Vérifié dans le corpus : 30 séquences, les chemins des évaluations et ceux du
tableau de bord concordent, les 30 fichiers écrivent les mêmes 9 champs, et le
tableau de bord lit **séquence par séquence** (d'où le `.read` au niveau `$sequence`).
**À faire : passer le simulateur de règles** (priorité enfant nommé sur `$variable`) —
lecture `/evaluations/chaine_energie_4e`, écriture d'une copie type,
et non-régression en lecture sur `/eval_si_demo`.
Choix assumé : pas de contrôle croisé `score <= sur`, pour ne pas perdre
définitivement la copie d'un élève sur un cas limite de barème.

### 3. Objectifs / compétences / trace écrite — TERMINÉ
Faits : ponts, énergies, régie des eaux, bureau de design, lignées,
**plus les 10 TP de 4e** (garage VAE, engrenages, ascenseur, maison connectée,
admin réseau, labo démontage, fablab, bureau des méthodes, bureau aéro,
sécurité routière).
Les 10 TP de 5e et les 10 de 4e sont faits, **et les 10 de 3e également**
(dispatching, réseau, objets connectés, studio code, robot, centre IA, bureau simulation,
centre spatial, labo biomédical, mission ACV).
Le lycée est fait aussi : `02_tp_lecture_plan.html`. **Chantier terminé.**
Configs : `_outils/enrichissements_4e.json`, `_5e.json`, `_3e.json`.
Le TP de lycée n'a PAS la structure du collège (ni `.acti`, ni `<header class="tp">`) :
`enrichir.js` ne s'y applique pas, d'où le script dédié
`_outils/enrichir_lecture_plan.py`. Même remarque pour tout futur TP de lycée.
(Les deux « TP » restants sans bloc, `02_tp_dd_carnet.html` et `02_tp_materiaux.html`,
appartiennent aux séquences classées sans suite : à ne pas toucher.)

Outil : `node _outils/enrichir.js _outils/<config>.json [--dry]`.
L'outil injecte le bloc `blocObj` après le `<h1>` du header et le bloc `aTrace`
avant `</body>`, au gabarit de `02_tp_ponts.html`. Il est **idempotent** (saute un
TP déjà enrichi), refuse d'écrire si un ancrage est absent ou si `</body>` n'est
pas unique, et reprend automatiquement la couleur `--niv` du fichier.
Config par TP : `titre`, 3 `objectifs`, 2-3 `competences` (`[["T2 · C4","intitulé BO"]]`),
`repere`, 4 `blocs` (`[titre, sous-titre]`), 4 `phrases`, `bas`.
Modèle complet à recopier : `_outils/enrichissements_4e.json`.
**Écrire les apostrophes typographiques directement dans la config** : l'outil ne
les convertit pas (30 apostrophes droites ont dû être reprises sur le lot 4e).

### 4. Missions 7 à 9 — REVU : la mission de rédaction a été retirée (voir A ci-dessus)
**Les 30 TP (10 de 5e, 10 de 4e, 10 de 3e) ont leurs missions 7 à 9.** Chantier terminé.
Configs : `_outils/missions789_4e_lot1.json` et `_lot2.json`,
`_outils/missions789_5e_lot1.json` et `_lot2.json`. Les 3e les avaient déjà.
Vérifié sur les 20 TP transformés : diff de 5 lignes exactement par fichier
(100 lignes au total), 9 verrous et 10 segments partout, badge du bilan à 10.

Outil : `node _outils/ajouter_missions789.js _outils/<config>.json [--dry]`
Modèle de config : `_outils/missions789_4e_lot1.json` (par TP : `t7`, 3 `redac` avec
mots-clés, `t8` + `enonce8` + 3 `calc`, `t9` + `consigne9` + `cahier9` + 4 `trace`,
et les 3 textes de bilan).

> **Ce n'est PAS un simple ajout.** Un TP de 4e/5e a 6 missions + bilan en `a7` ;
> les missions 7-9 obligent à faire passer le bilan en `a10`. L'outil enchaîne donc
> 7 opérations : bilan `a7`→`a10`, badge 7→10, `reussir(7,…)`→`reussir(10,…)`,
> 3 segments de barre en plus, `n<=7`→`n<=10`, `n<7`→`n<10`, et le CSS `.chp` /
> `.cahiernote` (absent des TP de 4e/5e, présent en 3e). Il refuse d'écrire si un
> seul de ces motifs est absent ou multiple.
> **Test qui compte : 9 verrous au chargement et 10 segments.** Une renumérotation
> ratée casse la chaîne sans rien changer à l'aspect.
> Vérifié sur le lot 1 : diff limité aux 5 lignes attendues, missions 1-6 intactes,
> réponses justes acceptées et fausses refusées.
Mission 7 = expliquer par écrit (mots-clés), 8 = calculer sans formule donnée,
9 = tracer un schéma sur le cahier vérifié par des questions de contrôle.

### 5. Modernisation visuelle des TP — 20 TP sur 30
Faits : `02_tp_dispatching.html` (schéma dessiné à la main), `02_tp_garage_vae.html`
(pilote du moteur générique), puis le **lot 1** : ascenseur, admin réseau, régie des
eaux, atelier vélo, objets connectés, labo démontage.
Puis le **lot 2** : bureau aéro, bureau méthodes, fablab, centre IA, centre spatial,
salle info. Configs : `_outils/modernisation_lot1.json` et `_lot2.json`.
**Restent 16 TP.**

Puis le **lot 3**, qui épuise le motif : sécurité routière, station météo,
PC mobilité, labo biomédical, bureau design, bureau simulation.
Configs : `_outils/modernisation_lot{1,2,3}.json`. **Restent 10 TP.**

> **Les 10 restants ne suivent PAS le motif** : leur activité 3 n'est pas un
> diagnostic mais un exercice à saisie (ex. `02_tp_engrenages`, calcul de rapport
> de transmission ; `02_tp_ponts`, essai de triangulation). Les convertir en
> diagnostic ferait PERDRE un bon exercice de calcul. **Ne pas les moderniser
> mécaniquement** : à arbitrer un par un avec Mat, et seulement si l'activité
> existante est faible.

> **Bulle d'information — corrigé le 02/09.** Signalé par Mat : le texte dépassait du
> rectangle. La bulle avait une hauteur FIXE de 62 px alors que les rôles se replient
> sur trois lignes. Elle mesure désormais le texte, compte les lignes et calcule sa
> hauteur ; largeur portée de 320 à 460 px. Corrigé dans l'outil ET dans les 7 TP
> déjà modernisés. Vérifié au rendu sur deux TP, clic simulé.

**12 TP suivent encore le motif modernisable** (`initA1` sur `cas1` et `initA3` sur
`pannes3`, ancres identiques partout) : bureau aéro, bureau design, bureau méthodes,
bureau simulation, centre IA, centre spatial, fablab, labo biomédical, PC mobilité,
salle info, sécurité routière, station météo. Pour eux il n'y a que le contenu à
écrire — 4 zones et 3 incidents par TP.
Les autres ont une activité 3 qui n'est pas un diagnostic (ex. `02_tp_engrenages`,
où c'est un calcul de rapport avec saisie) : ne pas la remplacer, elle est bonne.

Outil : `node _outils/moderniser_a1a3.js _outils/modernisation_<lot>.json [--dry]`
Modèle de config : `_outils/modernisation_pilote.json`.
Le moteur est **générique** : on décrit 4 à 6 `zones` {id, nom, court, role} et le
schéma est mis en page tout seul (blocs, flèches, point d'énergie animé qui circule).
L'activité 1 devient une visite guidée cliquable avec compteur ; l'activité 3 devient
un diagnostic — une alerte s'affiche, l'élève clique sur le bloc fautif.
Pas de géométrie à dessiner par TP, seulement du contenu à écrire.

> **Le piège de ce chantier, et comment l'outil l'évite.** La modernisation de
> `dispatching` avait remplacé le HTML des activités 1 et 3 en laissant leur ancien
> JavaScript, qui cherchait des éléments disparus : TypeError au chargement, tout le
> script suivant interrompu, **plus aucun verrou posé**. L'outil ne supprime donc
> jamais l'ancien code (bornes floues = régressions, cf. plus haut) : il insère un
> `if(!<ancre>) return;` commenté après la déclaration de sa variable d'ancrage.
> La config déclare ces ancres dans `neutraliser` ; l'outil refuse d'écrire si une
> ancre est absente ou multiple.
> **Test obligatoire après chaque TP : 9 verrous au chargement, avant ET après.**
> Vérifié sur le pilote : 9 verrous avant, 9 après, 0 erreur JS, parcours complet
> cliqué (visite 4/4 validée, 3 diagnostics justes, score et verrou levés).

### 6. Séquences « Comment ça marche ? » — 7 sur 12
Faites : roue de tramway, serrure à goupilles, **chasse d'eau** et **différentiel**
(05/09/2026). `01_cours_differentiel.html` : l'énigme du virage, les trois solutions
possibles (axe rigide / roues libres / différentiel), le schéma boîtier-planétaires-
satellites, un simulateur à trois modes, le DÉFAUT du mécanisme sur le verglas, et le
train épicycloïdal ailleurs (boîte auto, visseuse, éolienne).
> **Section 4 refaite le 05/09** — Mat : « on ne comprend vraiment pas comment marche
> le différentiel ». Le cours énonçait la règle sans la faire comprendre : des roues
> dentées rondes qui tournent n'expliquent rien.
> Remplacée par un **MODÈLE DÉPLIÉ** : les deux planétaires deviennent deux
> crémaillères horizontales, le satellite est entre les deux, et son axe — porté par
> le boîtier — est matérialisé par une ligne. L'élève voit alors que l'axe est au
> MILIEU des deux crémaillères, donc que sa vitesse est leur MOYENNE. Comme cette
> moyenne est imposée par le boîtier, la somme ne peut pas changer.
> Le satellite est dessiné avec une barre-repère : elle reste verticale en ligne
> droite, elle s'incline dès qu'une roue accélère. C'est l'image de la BALANCE.
>
> **AXES DE ROTATION CORRIGÉS (05/09)** — signalé par Mat. Deux erreurs distinctes :
> 1. **Schéma des pièces** : planétaires et satellites étaient dessinés en pignons
>    DROITS tournant dans le plan de l'écran. Or ce sont des engrenages CONIQUES, et
>    surtout leurs axes sont PERPENDICULAIRES — les planétaires tournent autour de
>    l'axe des roues, les satellites autour d'un axe à 90°. Redessinés en cônes vus
>    de côté, les quatre pointes convergeant au croisement des deux axes, avec les
>    axes tracés en trait mixte et une flèche de sens autour de chacun. C'est cette
>    perpendicularité qui permet au satellite de répartir : la montrer était le
>    cœur du schéma.
> 2. **Modèle déplié** : le satellite tournait à l'envers. Par rapport à son centre,
>    la crémaillère du haut RECULE et celle du bas AVANCE, donc le pignon tourne en
>    ANTIHORAIRE (angle négatif en canvas). Le signe était inversé.
>
> **Satellites : deuxième correction (05/09).** Ma première « correction » du sens des
> cônes était elle-même fausse : le calcul montre que le code d'origine était bon.
> La `rotate(-PI/2)` du repère rendait le raisonnement sur le signe impossible à tenir.
> Les satellites sont désormais dessinés par une fonction `conique_v()` VERTICALE
> explicite, sans rotation du repère. Les quatre pointes convergent au croisement des
> axes, vérifié au rendu.
> Leçon : quand un signe doit être raisonné à travers une rotation du repère, écrire
> plutôt une fonction dédiée — la rotation économise du code et coûte des erreurs.
>
> **Densité de texte réduite (05/09)** — Mat : « il y a trop de texte ».
> 843 → 634 mots hors code. Six paragraphes raccourcis, et DEUX blocs de texte
> remplacés par des schémas : le tableau des trois solutions devient `cv0`
> (trois essieux comparés visuellement), et le paragraphe sur les applications
> devient `cv4` (quatre trains épicycloïdaux, « il répartit » ou « il réduit »).
> Le cours compte maintenant 5 canvas dont un simulateur, et plus aucun tableau.

> Même famille que la serrure et la courroie : une rotation peut être juste
> géométriquement et fausse physiquement. Toujours se demander autour de QUEL axe,
> et dans quel sens, avant d'animer.
>
> Défauts corrigés au rendu : les dents débordaient de la barre (le `clip()` n'est pas
> honoré par tous les moteurs de rendu — bornage explicite à la place), et la ligne
> d'axe traversait son étiquette.

**Le thermostat de radiateur** (05/09) : `01_cours_thermostat.html`. 266 mots,
5 canvas, simulateur à DEUX curseurs (température de la pièce et consigne).
Il **prolonge la chasse d'eau** : même boucle fermée, mais ici la cire MESURE ET AGIT
en même temps — capteur et actionneur confondus dans une seule pièce.
Le cours attaque trois idées fausses courantes : le chiffre règle une température et
non une puissance ; mettre 5 ne chauffe pas plus vite ; un rideau devant le thermostat
lui fait lire l'air du radiateur et non celui de la pièce.

> Défaut corrigé au rendu : les graduations du cadran suivaient un pas qui donnait un
> ordre incohérent (0 en bas-gauche, 2 en haut, 5 en bas-droite) et l'aiguille masquait
> le 3. Réparties sur 288° en passant par le haut, aiguille raccourcie.

**La fermeture éclair** (05/09) : `01_cours_fermeture_eclair.html`. 278 mots,
5 canvas dont un simulateur à curseur qui détecte le SENS de déplacement et bascule
entre fermeture et ouverture. Notion visée : la CAME — une forme fixe qui guide,
sans pièce mobile ni énergie. Le même curseur fait deux choses opposées selon le sens
de passage des dents dans le Y.

> Trois défauts corrigés au rendu : les dents fermées se superposaient au même point
> (illisible) — elles ALTERNENT désormais gauche/droite comme sur une vraie
> fermeture ; et la tirette, centrée sous le curseur, masquait toute la zone fermée —
> déportée sur le côté.

**L'épingle à linge** (05/09) : `01_cours_epingle_linge.html`. Écrit d'emblée selon
la consigne de densité — **273 mots** hors code, 5 canvas dont un simulateur à
curseur, aucun tableau. L'élève déplace son doigt le long de la branche et lit la
force de serrage en direct (bras du doigt ÷ bras de la mâchoire × force du doigt).
Notions : levier, bras de levier, rapport de multiplication, rôle du RESSORT
(c'est lui qui fournit la force, le levier ne fait que multiplier), et les trois
familles de leviers.

Angle choisi : il **prolonge la roue de tramway** — le tramway résout le virage par la
conicité, la voiture ne le peut pas car ses roues sont cylindriques. Règle visée : la
somme des vitesses des deux roues est constante, égale au double de celle du boîtier.
`01_cours_chasse_eau.html`, ajouté au portail. Recette respectée : énigme (hypothèse
au cahier avant toute explication) → schéma légendé → simulateur animé → concept →
transfert → 4 exercices corrigés.
Le concept visé est la **boucle de régulation fermée** : le flotteur est un capteur
MÉCANIQUE, le clapet un actionneur, et l'ouverture du clapet diminue à mesure que le
niveau monte (arrêt progressif, jamais brutal). Un bouton « clapet qui fuit » montre
ce qui se passe quand la boucle ne se referme plus.
Transferts cités : thermostat de radiateur, régulateur de vitesse, château d'eau —
ce dernier raccroche à la séquence « L'eau dans la ville » de 5e.

**Sujets type DNB — 2 sur 3** (05/09/2026). `05_brevet_serrure.html` créé sur le
moteur de `05_brevet_roue_tramway.html`, repris tel quel : 3 documents, 6 questions,
25 points, correction affichée seulement à la remise, mélange de rédaction (mots-clés)
et de calculs (tolérance numérique).
Contenu : rôle de la ligne de césure, lecture d'un tableau de 3 clés pour trouver
celle qui ouvre et la goupille bloquante des autres, calcul de 6⁵ = 7 776
combinaisons puis du temps pour toutes les essayer (8,6 h), réfutation du « quatre
sur cinq ouvre presque » (ET logique), amélioration du nombre de combinaisons
(ajouter une goupille plutôt qu'une hauteur), et choix du laiton.
Testé : 25/25 avec les bonnes réponses.

> **Piège du recyclage du gabarit** : le code de dessin des documents du tramway
> (canvas `d1` et `d3`) suivait le moteur et a été repris par erreur — `d3`
> n'existait pas dans le nouveau sujet, d'où une TypeError au chargement. Le
> conteneur `#questions` et `#resultat` avait aussi disparu. Les deux corrigés.
> Premier schéma redessiné : les goupilles ne se rejoignaient pas (jonction
> incohérente) ; il montre désormais l'état AU REPOS, paires jointives, jonction
> sous la césure.

**Sujets type DNB — 3 sur 3** : les trois séquences « Comment ça marche ? » en ont un.
`05_brevet_chasse_eau.html` (05/09) suit le même moteur : 3 documents, 6 questions,
25 points. Contenu : lecture du tableau débit/ouverture, volume du réservoir
(30×20×18 = 10,8 L) confronté aux 9 L utiles — l'écart s'explique par l'eau qui reste
au fond —, durée de remplissage à débit constant puis explication de l'écart réel,
identification capteur/actionneur dans la boucle, panne de clapet et rôle du
trop-plein, et économie d'une chasse à double commande (26 280 L par an et par foyer).
Testé : 25/25. Schéma du document 1 coté (18 cm et 30 cm) pour rendre le calcul
faisable sans donnée supplémentaire.

> **Recette du recyclage, maintenant rodée** : découper le sujet existant en
> en-tête / utilitaires / moteur / dessin des documents, remplacer les documents et
> le tableau `Q`, puis RÉÉCRIRE entièrement le bloc de dessin — c'est lui qui a causé
> les trois défauts du sujet serrure.
> **Pas de hub** non plus (comme la serrure) : le cours est lié directement depuis
> le portail. Seule la roue de tramway a un hub.

> Défauts corrigés au rendu, tous invisibles autrement : le titre de `cv1` était
> effacé par le repeint du fond (à tracer APRÈS), puis il chevauchait l'étiquette
> « arrivée d'eau », déplacée à gauche du tuyau.
Restent 10 inventions au catalogue (`00_catalogue_inventions.html`) :
fermeture éclair, chasse d'eau, différentiel, thermostat, écran tactile,
ampoule LED, micro-ondes, épingle à linge, antivol de vélo, boîte de vitesses.
Recette : énigme → hypothèse au cahier → simulateur → concept → transfert.
Un seul **sujet type DNB** existe (tramway) : à décliner sur les autres.

### 7. Évaluation de la séquence lycée « lecture de plan »
C'est la seule séquence sans évaluation avec remontée Firebase.

### 8. Thème 3 du programme — angle mort
« Concevoir, réaliser » suppose un projet réellement fabriqué au fablab.
Aucun fichier ne peut le remplacer : au moins un projet fabriqué par an.

## Références programme

BO n° 9 du 29 février 2024 — 3 thèmes, 9 compétences.
Tableau d'ancrage complet : `00_programme_technologie.html`.

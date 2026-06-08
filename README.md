# Fiche de Personnage D&D 5e — Vue 3 CDN

Une fiche de personnage interactive pour **Donjons & Dragons 5e**, construite en HTML/CSS/JS + Vue 3 (sans étape de build). Déployée sur GitHub Pages avec sauvegarde automatique dans le dépôt.

> Personnage actuel : **Torvin "Trois-Parchemins"** — Gnome des Roches · Clerc Domaine Arcane · Artisan de Guilde

---

## Fonctionnalités

### Règles D&D 5e implémentées
- **Caractéristiques** : base + bonus racial + ASI/Dons par niveau
- **Classe d'armure** : calcul automatique (type d'armure + DEX) ou saisie manuelle — toggle ⚡/🔧
- **PV max** : dés de vie + modificateur CON × niveau + Don Robuste + bonus HP max manuel
- **PV temporaires** : champ dédié, reset à 0 au repos long
- **Épuisement** : PV max réduit de moitié au niveau 4, vitesse à 0 au niveau 5
- **Emplacements de sorts** : tableau officiel Clerc niveaux 1–10
- **Jets de mort** (1 naturel = 2 échecs, 20 naturel = 1 PV)
- **Canalisation divine** : compteur, récupération au repos court
- **ASI** : +2 une stat / +1+1 / Don (niveaux 4 et 8)
- **Sorts mineurs** : scaling automatique ×1→×2→×3→×4 dés selon niveau
- **Concentration** : suivi actif, DD automatique (max(10, dégâts/2)), avantage War Caster, bonus Résistant (Con)
- **Conditions** : 14 conditions PHB avec descriptions
- **Repos court** : 1d8 + CON PV + récupération Canalisation divine
- **Repos long** : PV max, tous les emplacements, épuisement −1

### Interface
- **5 onglets** : Personnage | Sorts | Combat | Histoire | Notes
- **Grille d'équipement** : 10 emplacements (arme, armure, bouclier, casque, cape, amulette, 2 anneaux, gants, bottes) avec bonus structurés (CA, stats, PV max, initiative, DD…)
- **Slot Arme** : champs dédiés (bonus d'attaque, dégâts, type de dégâts, portée) affichés directement sur la carte
- Tous les champs sont **éditables** (stats, PV, équipement, sorts, phrases...)
- **Mode sombre** : toggle lune/soleil, persisté en localStorage
- **Portrait** du personnage avec lightbox au clic (onglet Histoire)
- **Sauvegarde automatique** en localStorage (300 ms debounce)
- **Sauvegarde GitHub** via l'API REST (fichier `characters/torvin/torvin.json` dans le dépôt)
- **Export / Import JSON** pour portabilité et clonage
- Interface **responsive** (mobile + PC)
- Lanceur de **dés intégré** (d4, d6, d8, d10, d12, d20, d100) avec sélecteur NdX et historique
- **Lancer d'initiative** intégré (1d20 + DEX + bonus Alerte si actif)
- **Lancer d'attaque et de dégâts** depuis le slot arme (critique automatique)
- **Aide upcast** dans le modal de sort (description des niveaux supérieurs, PHB 2014)
- **Journal de session** : entrées datées avec titre, collapse/dépli automatique, textarea auto-redimensionnable, recherche par ligne

---

## Structure du projet

```
torvin/
├── index.html              # Application Vue 3 (template, composants x-template, SVG)
├── app.js                  # Point d'entrée : async _initApp(), createApp(), composants
├── computed.js             # Propriétés calculées Vue 3 (D&D math + helpers de template)
├── storage.js              # Persistance : localStorage, API GitHub, export/import JSON
├── data.js                 # Constantes D&D 5e (LEVELS, CONDITIONS, SKILLS, FEATS…)
├── engine.js               # Init async : _loadInitialState() fetch, _migrateState()
├── strings.js              # Textes UI centralisés (STRINGS.status / toast / info)
├── serve.js                # Serveur statique local Node.js (port 8080, sans npm)
├── style.css               # CSS principal (importe les modules css/)
├── css/
│   ├── base.css            # Variables, reset, layout commun
│   ├── tab-main.css        # Onglet Personnage
│   ├── tab-spells.css      # Onglet Sorts
│   ├── tab-combat.css      # Onglet Combat
│   └── histoire.css        # Onglet Histoire (portrait, lightbox)
├── characters/
│   └── torvin/
│       ├── torvin.js       # Données statiques : DOMAIN_SPELLS, FEATURES_BY_LEVEL…
│       ├── torvin.json     # ⭐ Source de vérité : état complet du personnage
│       └── torvin.jpg      # Portrait du personnage
└── .github/
    └── workflows/
        └── validate.yml    # CI GitHub Actions (syntax + sécurité)
```

---

## Démarrage rapide

### Lancer en local
```bash
# Node.js requis (installé dans .node/ — pas de npm)
node serve.js
# → http://localhost:8080
```

> **Note** : l'app utilise `fetch()` pour charger `torvin.json` — elle ne peut pas être ouverte directement via `file://`. Utiliser le serveur local ou GitHub Pages.

### Voir la fiche en ligne
```
https://funkyst4rz.github.io/torvin
```

### Sauvegarder sur GitHub
1. Créez un token GitHub avec les permissions `repo` :
   [github.com/settings/tokens](https://github.com/settings/tokens)
2. Dans la fiche, cliquez **⚙ Config**
3. Collez votre token (stocké uniquement dans votre navigateur, jamais dans le code)
4. Cliquez **💾 Sauvegarder** pour pousser vers `characters/torvin/torvin.json`

> **Sécurité** : le token n'est jamais inclus dans les fichiers sources ni dans les sauvegardes GitHub. Il vit uniquement dans `localStorage` de votre navigateur.

---

## Cloner pour un nouveau personnage

Ce projet est conçu pour être cloné facilement. Chaque personnage vit dans son propre dossier `characters/<nom>/`.

```bash
# 1. Fork ou clone le dépôt
git clone https://github.com/[vous]/[votre-perso]
cd [votre-perso]

# 2. Créez un dossier pour votre personnage
cp -r characters/torvin characters/[votre-perso]

# 3. Éditez characters/[votre-perso]/torvin.json
#    C'est la source de vérité — modifiez directement :
#    name, race, className, subclass, background, deity
#    base (stats), racial (bonus raciaux), level, hpRolls
#    equipment, languages, phrases, etc.
#    Mettez à jour ghFile → "characters/[votre-perso]/torvin.json"

# 4. Éditez characters/[votre-perso]/torvin.js :
#    DOMAIN_SPELLS (sorts de domaine de votre sous-classe)
#    FEATURES_BY_LEVEL (capacités de classe)
#    CLERIC_ASI_LEVELS (niveaux d'ASI de votre classe)

# 5. Mettez à jour dans data.js si besoin :
#    LEVELS (emplacements de sorts si classe différente)

# 6. Mettez à jour index.html :
#    Le <script src="characters/torvin/torvin.js"> → votre chemin
#    Le <title> et le sous-titre du header

# 7. Remplacez characters/[votre-perso]/torvin.jpg par votre portrait

# 8. Activez GitHub Pages : Settings → Pages → Source: main / root

# 9. Commitez et pushez
git add -A && git commit -m "init: nouveau personnage [Nom]"
git push
```

### Champs clés à modifier dans `torvin.json`
| Champ | Description |
|-------|-------------|
| `name` | Nom du personnage |
| `race`, `className`, `subclass` | Identité |
| `background`, `deity`, `alignment` | Contexte |
| `level` | Niveau de départ |
| `base` | Stats de base (str/dex/con/int/wis/cha) |
| `racial` | Bonus raciaux |
| `hpRolls` | Dés de vie par niveau (index 1–10) |
| `hpCurrent` | PV actuels |
| `slots` | Équipement porté (armure, arme, bouclier…) |
| `languages`, `toolProfs` | Langues et maîtrises |
| `traits`, `ideal`, `bond`, `flaw` | Personnalité |
| `phrases` | Phrases situationnelles (roleplay) |
| `ghRepo`, `ghFile` | Votre dépôt et chemin de sauvegarde |

---

## Développement

### Aucune dépendance de build
Ce projet utilise Vue 3 via CDN — aucun `npm install` requis. Lancez `node serve.js` et ouvrez `http://localhost:8080`.

### Ordre de chargement des scripts (bas du `<body>`)
```html
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
<script src="data.js"></script>                          <!-- constantes D&D 5e -->
<script src="strings.js"></script>                       <!-- textes UI (STRINGS) -->
<script src="characters/torvin/torvin.js"></script>      <!-- données statiques personnage -->
<script src="engine.js"></script>                        <!-- init async + migrations -->
<script src="computed.js"></script>                      <!-- propriétés calculées Vue -->
<script src="storage.js"></script>                       <!-- persistance (localStorage, GitHub) -->
<script src="app.js"></script>                           <!-- _initApp() async, createApp() -->
```

### Architecture
- **`characters/torvin/torvin.json`** : source de vérité unique — chargée par `fetch()` au démarrage, sauvegardée via API GitHub. Contient tout l'état du personnage.
- **`characters/torvin/torvin.js`** : données statiques jamais modifiées par l'app (`DOMAIN_SPELLS`, `FEATURES_BY_LEVEL`, `CLERIC_ASI_LEVELS`, `UNIVERSAL_REFLEXES`)
- **`engine.js`** : `_loadInitialState()` async (localStorage → fetch), `_migrateState()` pour les anciens formats
- **`data.js`** : constantes D&D 5e (`LEVELS`, `CONDITIONS`, `SKILLS`, `FEATS`…) — aucune logique
- **`strings.js`** : textes UI centralisés (`STRINGS.status / toast / info`) — équivalent i18n
- **`computed.js`** : objet `appComputed` — toutes les propriétés calculées Vue (stats, slots, modificateurs…)
- **`storage.js`** : objet `storageMethods` — localStorage (auto), GitHub API (manuel), export/import JSON
- **`app.js`** : `async _initApp()` → `createApp()` avec `data()`, `watch`, `methods`, enregistrement des composants Vue
- **`css/`** : styles découpés par onglet, tous importés depuis `style.css`
- Le token GitHub est **exclu** de toute sérialisation via `delete state.ghToken` dans `storage.js`

### CI (GitHub Actions)
Le workflow `.github/workflows/validate.yml` vérifie à chaque push :
- Syntaxe JS (`node --check`) sur tous les fichiers JS
- Présence des fichiers requis (dont `characters/torvin/torvin.json`)
- Absence de token dans les sources
- Structure HTML (htmlhint)
- Structure des onglets en HTML
- Champs requis dans `characters/torvin/torvin.json`
- Présence de la protection `delete state.ghToken` dans `storage.js`

---

## Licence

MIT — libre de copier, modifier et cloner pour vos propres personnages.

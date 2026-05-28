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
- **Sauvegarde automatique** en localStorage
- **Sauvegarde GitHub** via l'API (fichier `save.json` dans le dépôt)
- **Export / Import JSON** pour portabilité et clonage
- Interface **responsive** (mobile + PC)
- Lanceur de **dés intégré** (d4, d6, d8, d10, d12, d20, d100) avec sélecteur NdX
- **Lancer d'initiative** intégré (1d20 + DEX + bonus Alerte si actif)
- **Aide upcast** dans le modal de sort (description des niveaux supérieurs, PHB 2014)

---

## Structure du projet

```
torvin/
├── index.html              # Application Vue 3 (template, composants x-template, SVG)
├── app.js                  # Point d'entrée : createApp(), data(), watch, montage composants
├── computed.js             # Propriétés calculées Vue 3 (D&D math + helpers de template)
├── storage.js              # Persistance : localStorage, API GitHub, export/import JSON
├── data.js                 # Constantes D&D 5e (LEVELS, CONDITIONS, SKILLS, FEATS…)
├── engine.js               # Fonctions pures D&D 5e + hook CHARACTER_MIGRATIONS
├── strings.js              # Textes UI centralisés (STRINGS.status / toast / info)
├── style.css               # CSS principal (importe les modules css/)
├── css/
│   ├── base.css            # Variables, reset, layout commun
│   ├── tab-main.css        # Onglet Personnage
│   ├── tab-spells.css      # Onglet Sorts
│   ├── tab-combat.css      # Onglet Combat
│   └── histoire.css        # Onglet Histoire (portrait, lightbox)
├── characters/
│   ├── torvin.js           # Données personnage : DEFAULT_CHAR, DOMAIN_SPELLS, FEATURES_BY_LEVEL…
│   └── torvin.jpg          # Portrait du personnage
├── save.json               # Sauvegarde du personnage (généré automatiquement)
└── .github/
    └── workflows/
        └── validate.yml    # CI GitHub Actions (syntax + sécurité)
```

---

## Démarrage rapide

### Voir la fiche
Ouvrez directement `index.html` dans un navigateur, ou visitez la GitHub Pages :
```
https://[username].github.io/[repo-name]
```

### Sauvegarder sur GitHub
1. Créez un token GitHub avec les permissions `repo` :
   [github.com/settings/tokens](https://github.com/settings/tokens)
2. Dans la fiche, cliquez **⚙ Config**
3. Collez votre token (stocké uniquement dans votre navigateur, jamais dans le code)
4. Cliquez **💾 Sauvegarder** pour pousser vers `save.json`

> **Sécurité** : le token n'est jamais inclus dans les fichiers sources ni dans les sauvegardes GitHub. Il vit uniquement dans `localStorage` de votre navigateur.

---

## Cloner pour un nouveau personnage

Ce projet est conçu pour être cloné facilement :

```bash
# 1. Fork ou clone le dépôt
git clone https://github.com/[vous]/[votre-perso]
cd [votre-perso]

# 2. Modifiez characters/torvin.js → DEFAULT_CHAR avec votre personnage
#    Changez : name, race, className, subclass, background, deity
#    Changez : base (stats de départ), racial (bonus raciaux)
#    Changez : level, hpRolls, equipment, phrases, etc.

# 3. Mettez à jour dans characters/torvin.js :
#    - FEATURES_BY_LEVEL (capacités de classe)
#    - DOMAIN_SPELLS / SUGGESTED_SPELLS (sorts recommandés)
#    - CHARACTER_MIGRATIONS (migrations de données si nécessaire)

# 4. Mettez à jour dans data.js si besoin :
#    - LEVELS (emplacements de sorts si classe différente)
#    - FEATS (dons disponibles)

# 5. Mettez à jour dans index.html :
#    - ghRepo dans DEFAULT_CHAR (characters/torvin.js) → votre dépôt
#    - Le titre <title> et le sous-titre du header

# 6. Remplacez characters/torvin.jpg par le portrait de votre personnage

# 7. Activez GitHub Pages dans les Settings → Pages → Source: main / root

# 8. Commitez et pushez
git add -A && git commit -m "init: nouveau personnage [Nom]"
git push
```

### Champs clés à modifier dans `DEFAULT_CHAR` (characters/torvin.js)
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
| `equipment` | Équipement de départ |
| `languages`, `toolProfs` | Langues et maîtrises |
| `traits`, `ideal`, `bond`, `flaw` | Personnalité |
| `phrases` | Phrases situationnelles (roleplay) |
| `ghRepo` | Votre dépôt GitHub (`user/repo`) |

---

## Développement

### Aucune dépendance de build
Ce projet utilise Vue 3 via CDN — aucun `npm install` requis. Ouvrez simplement `index.html`.

### Ordre de chargement des scripts (bas du `<body>`)
```html
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
<script src="data.js"></script>          <!-- constantes D&D 5e -->
<script src="strings.js"></script>       <!-- textes UI (STRINGS) -->
<script src="characters/torvin.js"></script> <!-- données personnage -->
<script src="engine.js"></script>        <!-- fonctions pures D&D + migrations -->
<script src="computed.js"></script>      <!-- propriétés calculées Vue -->
<script src="storage.js"></script>       <!-- persistance (localStorage, GitHub) -->
<script src="app.js"></script>           <!-- createApp(), data(), watch, montage -->
```

### Architecture
- **`data.js`** : constantes D&D 5e (LEVELS, CONDITIONS, SKILLS, FEATS…) — aucune logique
- **`characters/torvin.js`** : données spécifiques au personnage (`DEFAULT_CHAR`, `DOMAIN_SPELLS`, `FEATURES_BY_LEVEL`, `CHARACTER_MIGRATIONS`)
- **`engine.js`** : fonctions pures D&D 5e (`_loadInitialState`, `_deepMerge`, migrations)
- **`strings.js`** : textes UI centralisés (`STRINGS.status / toast / info`) — équivalent i18n
- **`computed.js`** : objet `appComputed` — toutes les propriétés calculées Vue (stats, slots, modificateurs…)
- **`storage.js`** : objet `storageMethods` — localStorage (auto), GitHub API (manuel), export/import JSON
- **`app.js`** : `createApp()` avec `data()`, `watch`, `methods`, enregistrement des composants Vue
- **`css/`** : styles découpés par onglet, tous importés depuis `style.css`
- Sauvegarde : `localStorage` (auto, 300 ms debounce) + GitHub API PUT (manuelle)
- Le token GitHub est **exclu** de toute sérialisation via `delete state.ghToken` dans `storage.js`

### CI (GitHub Actions)
Le workflow `.github/workflows/validate.yml` vérifie à chaque push :
- Syntaxe JS (`node --check`) sur `app.js`, `computed.js`, `storage.js`, `data.js`, `strings.js`, `engine.js`, `characters/torvin.js`
- Présence des fichiers requis
- Absence de token dans les sources
- Structure HTML (htmlhint)
- Structure des onglets et champs requis dans `DEFAULT_CHAR` (characters/torvin.js)
- Présence de la protection de sécurité `delete state.ghToken` dans `storage.js`

---

## Licence

MIT — libre de copier, modifier et cloner pour vos propres personnages.

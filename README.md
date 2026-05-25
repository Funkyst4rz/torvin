# Fiche de Personnage D&D 5e — Vue 3 CDN

Une fiche de personnage interactive pour **Donjons & Dragons 5e**, construite en HTML/CSS/JS + Vue 3 (sans étape de build). Déployée sur GitHub Pages avec sauvegarde automatique dans le dépôt.

> Personnage actuel : **Torvin "Trois-Parchemins"** — Gnome des Roches · Clerc Domaine Arcane · Artisan de Guilde

---

## Fonctionnalités

### Règles D&D 5e implémentées
- **Caractéristiques** : base + bonus racial + ASI/Dons par niveau
- **Classe d'armure** : formule selon type d'armure (légère / intermédiaire / lourde / sans armure / armure du mage)
- **PV max** : dés de vie + modificateur CON × niveau + Don Robuste
- **Épuisement** : PV max réduit de moitié au niveau 4, vitesse à 0 au niveau 5
- **Emplacements de sorts** : tableau officiel Clerc niveaux 1–10
- **Jets de mort** (1 naturel = 2 échecs, 20 naturel = 1 PV)
- **Canalisation divine** : compteur, récupération au repos court
- **ASI** : +2 une stat / +1+1 / Don (niveaux 4 et 8)
- **Sorts mineurs** : scaling automatique ×1→×2→×3→×4 dés selon niveau
- **Concentration** : suivi actif, affichage DC, avantage War Caster, bonus Résistant (Con)
- **Conditions** : 14 conditions PHB avec descriptions
- **Repos court** : 1d8 + CON PV + récupération Canalisation divine
- **Repos long** : PV max, tous les emplacements, épuisement −1

### Interface
- **5 onglets** : Personnage | Sorts | Combat | Histoire | Notes
- Tous les champs sont **éditables** (stats, PV, équipement, sorts, phrases...)
- **Sauvegarde automatique** en localStorage
- **Sauvegarde GitHub** via l'API (fichier `save.json` dans le dépôt)
- **Export / Import JSON** pour portabilité et clonage
- Interface **responsive** (mobile + PC)
- Lanceur de **dés intégré** (d4, d6, d8, d10, d12, d20, d100)

---

## Structure du projet

```
torvin/
├── index.html        # Application Vue 3 (template principal)
├── app.js            # Logique Vue (computed, methods, save/load)
├── data.js           # Données D&D 5e (sorts, capacités, état par défaut)
├── style.css         # Styles parchemin
├── save.json         # Sauvegarde du personnage (généré automatiquement)
└── .github/
    └── workflows/
        └── validate.yml  # CI GitHub Actions (syntax + sécurité)
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

# 2. Modifiez data.js → DEFAULT_CHAR avec votre personnage
#    Changez : name, race, className, subclass, background, deity
#    Changez : base (stats de départ), racial (bonus raciaux)
#    Changez : level, hpRolls, equipment, phrases, etc.

# 3. Mettez à jour dans data.js :
#    - FEATURES_BY_LEVEL (capacités de classe)
#    - LEVELS (emplacements de sorts si classe différente)
#    - DOMAIN_SPELLS / SUGGESTED_SPELLS (sorts recommandés)
#    - FEATS (dons disponibles)

# 4. Mettez à jour dans index.html :
#    - ghRepo dans DEFAULT_CHAR → votre dépôt
#    - Le titre <title> et le sous-titre du header

# 5. Activez GitHub Pages dans les Settings → Pages → Source: main / root

# 6. Commitez et pushez
git add -A && git commit -m "init: nouveau personnage [Nom]"
git push
```

### Champs clés à modifier dans `DEFAULT_CHAR` (data.js)
| Champ | Description |
|-------|-------------|
| `name` | Nom du personnage |
| `race`, `className`, `subclass` | Identité |
| `background`, `deity`, `alignment` | Contexte |
| `level` | Niveau de départ |
| `base` | Stats de base (str/dex/con/int/wis/cha) |
| `racial` | Bonus raciaux |
| `armorBase`, `armorType` | Armure de départ |
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
<script src="data.js"></script>  <!-- constantes D&D + DEFAULT_CHAR -->
<script src="app.js"></script>   <!-- createApp() -->
```

### Architecture
- `data.js` : toutes les constantes D&D 5e (LEVELS, DOMAIN_SPELLS, CONDITIONS, etc.) + `DEFAULT_CHAR`
- `app.js` : `createApp()` avec `data()`, `computed`, `watch`, `methods`
  - `_deepMerge()` et `_loadInitialState()` sont des fonctions **standalone** (avant `createApp`) car `data()` s'exécute avant que `this` soit disponible
- Sauvegarde : `localStorage` (auto) + GitHub API PUT (manuelle)
- Le token GitHub est **exclu** de toute sérialisation via `delete state.ghToken`

### CI (GitHub Actions)
Le workflow `.github/workflows/validate.yml` vérifie à chaque push :
- Syntaxe JS (`node --check`)
- Présence des fichiers requis
- Absence de token dans les sources
- Structure HTML (htmlhint)
- Structure des onglets et champs requis dans `DEFAULT_CHAR`
- Présence de la protection de sécurité `delete state.ghToken`

---

## Licence

MIT — libre de copier, modifier et cloner pour vos propres personnages.

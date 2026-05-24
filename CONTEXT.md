# Contexte du projet — Torvin "Trois-Parchemins"

## Résumé du projet

Site web statique hébergé sur GitHub Pages (`https://funkyst4rz.github.io/torvin`) servant de fiche de personnage interactive pour une campagne D&D 5e. Sauvegarde des données dynamiques (PV, sorts utilisés, niveau) via l'API GitHub dans un fichier `save.json`.

## Fichiers du projet

```
D:\torvin\
├── index.html       — Fiche de personnage complète (fichier principal)
├── save.json        — Créé automatiquement par l'app via l'API GitHub
├── CONTEXT.md       — Ce fichier
```

## Déploiement

- **Repo GitHub :** `https://github.com/Funkyst4rz/torvin`
- **URL publique :** `https://funkyst4rz.github.io/torvin`
- **Branche :** `main`
- **GitHub Pages :** activé sur la racine `/`
- **Sauvegarde :** l'utilisateur entre son token GitHub dans la page (stocké en localStorage, jamais dans le code)

---

## Le personnage — Torvin "Trois-Parchemins"

### Identité
- **Race :** Gnome des Roches
- **Classe :** Clerc, Domaine Arcane (Sword Coast Adventurer's Guide)
- **Niveau de départ :** 3 (la fiche gère les niveaux 1 à 10)
- **Historique :** Artisan de Guilde
- **Divinité :** Azouth (Dieu des Magiciens, Loyal Neutre)
- **Alignement :** Neutre Bon

### Background narratif
Torvin était artisan dans une guilde de bricoleurs gnomes. Un client lui apporte ce qui semble être un vieux mécanisme à restaurer. En l'ouvrant, il découvre des inscriptions arcanes azouthiennes cachées dans les engrenages. Par pure curiosité intellectuelle, il les active — et Azouth le choisit involontairement. Depuis, il traite ses pouvoirs comme un mécanisme qu'il n'a pas encore entièrement démonté.

### Caractéristiques (tableau standard)
| Caractéristique | Base | Bonus racial | Total | Mod |
|----------------|------|-------------|-------|-----|
| Sagesse ★ | 15 | — | 15 (+17 au niv.4) | +2 (+3) |
| Intelligence | 14 | +2 | 16 | +3 |
| Constitution | 13 | +1 | 14 | +2 |
| Dextérité | 12 | — | 12 | +1 |
| Charisme | 10 | — | 10 | +0 |
| Force | 8 | — | 8 | -1 |

> Au niveau 4 : Amélioration de caractéristiques → +2 Sagesse → 17 (+3). Géré automatiquement dans le code.

### Stats de combat (niveau 3)
- **PV :** 26 (8 + 6 + 6 + 2×3 con)
- **CA :** 15 (armure de cuir 11 + Dex +1 + bouclier +2)
- **Initiative :** +1
- **Vitesse :** 9 m
- **Bonus de maîtrise :** +2
- **DD sorts :** 12 (8+2+2)
- **Bonus attaque sort :** +4 (2+2)

### Compétences maîtrisées
- **Arcanes (Int) ×2** → +7 (double maîtrise, Bénédictions du Savoir)
- **Histoire (Int) ×2** → +7 (double maîtrise, Bénédictions du Savoir)
- **Religion (Int)** → +5
- **Médecine (Sag)** → +4

### Sorts mineurs (cantrips)
1. Glas des trépassés (Toll the Dead) — 1d8 ou 1d12 nécrotique, DD Sag
2. Main du mage (Mage Hand)
3. Illusion mineure (Minor Illusion)

### Sorts de domaine (toujours préparés, ne comptent pas dans le quota)
| Niveau de sort | Sorts |
|---------------|-------|
| 1 | Identification, Projectile magique |
| 3 | Arme magique, Flèche acide de Melf |
| 5 | Boule de feu, Contresort |
| 7 | Œil d'Arcane, Amélioration de caractéristique |
| 9 | Télékinésie, Mur de force |

### Sorts préparés (5/jour au niveau 3)
| Sort | Niveau | Type | Concentration |
|------|--------|------|--------------|
| Fléau (Bane) ⭐ | 1 | Debuff signature | Oui |
| Mot de guérison (Healing Word) | 1 | Soin action bonus | Non |
| Immobilisation (Hold Person) | 2 | Contrôle boss | Oui |
| Cécité/Surdité (Blindness/Deafness) | 2 | Debuff sans conc. | Non |
| Arme spirituelle (Spiritual Weapon) | 2 | Dégâts action bonus | Non |

> ⚠️ À adapter si Torvin est le seul soigneur du groupe : remplacer Arme spirituelle par Aid ou Lesser Restoration.

### Équipement
- **La Relique d'Azouth** — focaliseur d'incantation ET lien divin (objet mécanique/arcane qui a déclenché ses pouvoirs)
- Masse d'armes (1d6-1 contondant)
- Armure de cuir + Bouclier (CA 15)
- Outils de bricoleur
- Pack d'explorateur
- Lettre de guilde · 15 pièces d'or

### Capacités raciales (Gnome des Roches)
- Bricoleur : fabrique de petits automates mécaniques
- Vision dans le noir : 18 m
- Ruse gnome : avantage sur JS Int/Sag/Cha contre la magie
- Connaissance de l'artificier

### Capacités de classe
- **Bénédictions du Savoir (niv.1) :** maîtrise doublée en Arcanes et Histoire
- **Sorts mineurs bonus magicien (niv.1) :** 2 sorts mineurs issus de la liste du magicien
- **Canalisation divine (niv.2, 1×/repos) :** Renvoi morts-vivants ou Renvoi aberrations/célestes
- **Incantation Puissante (niv.6) :** +mod Sag aux dégâts des sorts mineurs
- **Intervention divine (niv.10)**

### Personnalité
- **Trait 1 :** *"J'explique systématiquement ce que je fais et pourquoi, même en plein combat. Surtout en plein combat."*
- **Trait 2 :** *"Je trouve une explication rationnelle à tout. La magie n'est qu'un mécanisme qu'on ne comprend pas encore."*
- **Idéal :** *"La connaissance doit circuler librement — la garder pour soi est un crime contre l'humanité."*
- **Lien :** *"La relique d'Azouth est toujours en ma possession. Je ne sais pas encore ce qu'elle fait vraiment."*
- **Défaut :** *"Je suis incapable de jeter quoi que ce soit — parchemins, bouts de mécanismes, notes griffonnées. Mon sac est un désastre."*

---

## Architecture du code (index.html)

Le site est un fichier HTML unique avec CSS et JS embarqués.

### Structure JS principale

```javascript
// Données statiques
const LEVELS = { 1..10 }          // HP max, slots, prof bonus par niveau
const DOMAIN_SPELLS = { 1,3,5,7,9 } // Sorts de domaine par niveau de sort
const PREPARED_SPELLS = { 1..5 }   // Sorts préparés par niveau de sort
const FEATURES_BY_LEVEL = [...]    // Capacités débloquées par niveau

// Fonctions clés
renderLevel(lvl, isLevelUp)        // Recalcule TOUT pour un niveau donné
renderFeatures(lvl, newLvl)        // Affiche les capacités disponibles
renderSpells(lvl, newLvl)          // Affiche les sorts et emplacements
getState()                         // Sérialise l'état courant (PV, slots, checks)
applyState(s)                      // Restaure un état sauvegardé
saveToGitHub()                     // PUT save.json via API GitHub
loadFromGitHub()                   // GET save.json via API GitHub
autoSaveLocal()                    // Sauvegarde en localStorage à chaque interaction
```

### Ce qui est calculé dynamiquement par niveau
- Bonus de maîtrise (prof)
- DD de sauvegarde (8 + prof + modSag)
- Bonus d'attaque de sort (prof + modSag)
- Toutes les compétences et jets de sauvegarde
- PV maximum
- Dés de vie
- Sagesse passe à 17 au niveau 4 (wisMod recalculé)
- Emplacements de sorts
- Sorts de domaine débloqués
- Capacités disponibles

### Sauvegarde
- **localStorage** : sauvegarde automatique à chaque interaction (PV, slots, checks, niveau)
- **GitHub API** : sauvegarde manuelle via bouton → écrit `save.json` dans le repo
- Le token GitHub est stocké en localStorage, jamais dans le code

---

## Ce qui pourrait être amélioré / prochaines étapes

- [ ] Ajouter un lanceur de dés intégré (1d4, 1d6, 1d8, 1d12, 1d20)
- [ ] Tracker de repos (repos court / repos long avec reset des emplacements)
- [ ] Notes de session (zone de texte sauvegardée)
- [ ] Mode sombre / mode parchemin toggle
- [ ] Partage en lecture seule (URL avec état encodé)
- [ ] Support multi-personnages

---

## Notes importantes

- Le Domaine Arcane vient du **Sword Coast Adventurer's Guide** (SCAG) — vérifier que le MJ l'autorise
- La campagne se déroule dans un **setting maison** (pas les Royaumes Oubliés officiels)
- L'utilisateur est **joueur, pas MJ**
- Niveau de départ : **3**
- Groupe de **4 joueurs** — composition inconnue pour l'instant
- L'utilisateur est **peu expérimenté en roleplay** — la fiche contient des phrases situationnelles pour l'aider

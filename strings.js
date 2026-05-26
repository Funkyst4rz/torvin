// ══════════════════════════════════════════════════════════════
// strings.js — Textes d'interface centralisés
// Équivalent d'un fichier i18n/YAML — sans dépendance externe.
// Valeur statique : { title, body } ou string
// Valeur dynamique : fonction(...args) → { title, body } ou string
// ══════════════════════════════════════════════════════════════
'use strict';

const STRINGS = {

  // ── Barre de statut (sauvegarde / config) ────────────────────
  status: {
    tokenConfigured  : 'Token configuré — prêt',
    tokenMissing     : 'Non configuré — cliquez sur ⚙ Config',
    tokenSaved       : 'Token configuré — prêt',
    tokenCleared     : 'Token effacé',
    tokenNeeded      : 'Token manquant — cliquez sur ⚙ Config',
    tokenNeededShort : 'Token manquant',
    saving           : 'Sauvegarde en cours…',
    saved            : t   => `✓ Sauvegardé — ${t}`,
    saveError        : msg => `Erreur: ${msg}`,
    networkError     : 'Erreur réseau',
    loading          : 'Chargement…',
    loadNotFound     : 'Fichier introuvable',
    loadError        : 'Erreur chargement',
    loaded           : t   => `✓ Chargé — ${t}`,
    exportDone       : 'Export téléchargé',
    importDone       : 'Import réussi',
    importError      : 'Erreur import JSON',
    asiPending       : n   => `⚠ ASI non attribuée au niveau ${n} — cliquez sur ce niveau`,
  },

  // ── Toasts (messages contextuels courts) ─────────────────────
  toast: {
    shortRest      : (roll, con, heal) => `⬋ Repos court — d8: ${roll} + ${con} CON = +${heal} PV · Canalisation récupérée`,
    longRest       : '☀ Repos long — PV au maximum, emplacements et canalisation récupérés',
    longRestExhaust: (from, to) => `☀ Repos long — PV max, slots récupérés · Épuisement : ${from} → ${to}`,
    levelUp        : (n, roll, con, gain, info) => `✦ Niveau ${n} ! d8: ${roll} + ${con} CON = +${gain} PV · ${info}`,
    asiConfirmed   : n    => `✦ ASI niv.${n} confirmée !`,
    concSet        : name => `◆ Concentration : ${name}`,
    concBroken     : 'Concentration rompue',
    imported       : '✦ Personnage importé depuis JSON !',
    deathCrit      : roll => `🎲 d20 : ${roll} — CRITIQUE ! Torvin reprend conscience à 1 PV !`,
    deathCritFail  : roll => `🎲 d20 : ${roll} — 1 naturel ! Deux échecs.`,
    deathSuccess   : (roll, s) => `🎲 d20 : ${roll} — Succès (${s}/3)`,
    deathFailure   : (roll, f) => `🎲 d20 : ${roll} — Échec (${f}/3)`,
  },

  // ── Contenu des modaux "info" ─────────────────────────────────
  // showInfo(key, ...args) dans app.js résout ces entrées.
  info: {

    ca: {
      title: 'Classe d\'Armure (CA)',
      body:  'Les attaquants doivent obtenir ≥ votre CA pour vous toucher.<br><br>'
           + '<strong>Références rapides :</strong><br>'
           + '• Cuir : 11 + mod. DEX<br>'
           + '• Cuir clouté : 12 + mod. DEX<br>'
           + '• Chemise de mailles : 13 + mod. DEX (max +2)<br>'
           + '• Cotte de mailles : 16 (pas de DEX, nécessite maîtrise)<br><br>'
           + 'La CA est saisie manuellement dans cette fiche.',
    },

    initiative: bonusSign => ({
      title: 'Initiative',
      body:  `Détermine l'ordre d'action au combat.<br><strong>= 1d20 + Mod. DEX (+ 5 si Don Alerte)</strong><br>`
           + `Bonus actuel : <strong>${bonusSign}</strong><br><br>`
           + 'En cas d\'égalité : le MJ tranche ou jet supplémentaire.<br>'
           + 'Agir en premier peut être décisif — Immobilisation avant que les ennemis n\'agissent !<br><br>'
           + '🎲 Bouton dé dans la case Initiative pour lancer 1d20 + bonus.',
    }),

    speed: {
      title: 'Vitesse de déplacement',
      body:  'Distance max de déplacement par tour (action de déplacement).<br><br>'
           + '<strong>7,5 m (25 pieds)</strong> — vitesse de base du Gnome des Roches.<br><br>'
           + 'Peut être réduite de moitié par : terrain difficile, conditions (entravé, exténué niv.2…). '
           + 'Certaines conditions l\'annulent totalement (paralysé, pétrifié).',
    },

    proficiency: (level, profSign) => ({
      title: 'Bonus de Maîtrise',
      body:  'Ajouté aux jets où vous avez la maîtrise : attaques, compétences, sorts, outils.<br><br>'
           + '<strong>Progression par niveau :</strong><br>'
           + '• Niv. 1–4 : +2<br>• Niv. 5–8 : +3<br>• Niv. 9–12 : +4<br>• Niv. 13–16 : +5<br>• Niv. 17–20 : +6<br><br>'
           + `Actuellement niveau ${level} → <strong>${profSign}</strong>`,
    }),

    hp: hpMax => ({
      title: 'Points de vie',
      body:  `<strong>Maximum actuel : ${hpMax} PV</strong><br>`
           + '= somme des dés de vie + Mod. CON × niveau.<br><br>'
           + '<strong>À 0 PV :</strong> inconscient → jets de mort (d20 ≥ 10 = succès). '
           + '3 succès : stabilisé. 3 échecs : mort.<br><br>'
           + 'Si l\'excédent de dégâts en un coup ≥ PV max : mort instantanée.',
    }),

    hpTemp: {
      title: 'PV temporaires',
      body:  'Absorbent les dégâts <strong>avant</strong> les PV réels.<br><br>'
           + '• Ne se cumulent pas : si deux sources vous en donnent, gardez le plus élevé.<br>'
           + '• Ne se récupèrent pas avec les sorts de soin.<br>'
           + '• Disparaissent après un repos long.<br><br>'
           + 'Exemple : 5 PVT + 12 PV → 7 dégâts → 0 PVT, 12 PV.',
    },

    channelDivine: spellDC => ({
      title: 'Canalisation divine',
      body:  '<strong>Se recharge à chaque repos court ou long.</strong><br><br>'
           + 'Utilisations par repos :<br>• Niv. 2–5 : 1×<br>• Niv. 6–17 : 2×<br><br>'
           + '<strong>Usages disponibles pour Torvin :</strong><br>'
           + `• <em>Renvoi des morts-vivants</em> — JS <strong>Sagesse</strong> DD ${spellDC} ou renvoi<br>`
           + `• <em>Abjuration Arcanique</em> (domaine) — JS <strong>Sagesse</strong> DD ${spellDC} — bannit célestes, élémentaires, fées, fiélons `
           + '(FP ≤ ½ niveau à partir du niv.5)',
    }),

    shortRest: level => ({
      title: 'Repos court (~1 heure)',
      body:  `Récupère :<br>• Dés de vie dépensés (0 à ${level} dés, 1d8 + Mod. CON par dé)<br>`
           + '• Canalisation divine<br><br>'
           + 'Ne récupère PAS : emplacements de sorts, PV max.',
    }),

    longRest: level => ({
      title: 'Repos long (~8 heures)',
      body:  'Récupère :<br>• <strong>Tous les PV</strong><br>'
           + `• La moitié des dés de vie max (arrondi haut) — actuellement ${Math.ceil(level / 2)} dés<br>`
           + '• <strong>Tous les emplacements de sorts</strong><br>'
           + '• Canalisation divine<br><br>'
           + 'Nécessite au moins 6 heures de sommeil sur les 8 heures de repos.',
    }),

    passivePerc: val => ({
      title: 'Sagesse passive',
      body:  `= 10 + bonus de Perception.<br><strong>Actuellement : ${val}</strong><br><br>`
           + 'Utilisée par le MJ pour vérifier discrètement si vous remarquez quelque chose — '
           + 'sans jet de dés de votre part. Plus c\'est haut, plus Torvin perçoit l\'environnement même distrait.',
    }),

    spellDC: (prof, wisMod, dc) => ({
      title: 'DD sorts',
      body:  `= 8 + Maîtrise + Mod. Sagesse<br>= 8 + ${prof} + ${wisMod} = <strong>${dc}</strong><br><br>`
           + `Les ennemis font un jet de sauvegarde contre ce DD pour résister à vos sorts. `
           + `Il n'y a pas de jet d'attaque de votre côté — c'est eux qui doivent dépasser ${dc}.`,
    }),

    spellAtk: (prof, wisMod, atkSign) => ({
      title: 'Bonus d\'attaque de sort',
      body:  `= Maîtrise + Mod. Sagesse<br>= ${prof} + ${wisMod} = <strong>${atkSign}</strong><br><br>`
           + 'Ajouté au d20 pour les sorts qui nécessitent un <strong>jet d\'attaque</strong> (pas un JS ennemi). '
           + 'Exemples : Arme spirituelle, Fléau de flammes.<br><br>'
           + 'Différence clé : vous lancez le d20 et espérez dépasser la CA cible.',
    }),

    cantrips: (cantripDice, currentLevel) => {
      const here = ' <span style="color:var(--gold)">← vous êtes là</span>';
      const l = currentLevel;
      return {
        title: 'Sorts mineurs',
        body:  `Gratuits et à volonté — pas d'emplacement consommé.<br><br>`
             + `<strong>Scaling par niveau de personnage :</strong><br>`
             + `• Niv. 1–4 : ×1 dé${l < 5 ? here : ''}<br>`
             + `• Niv. 5–10 : ×2 dés${l >= 5 && l < 11 ? here : ''}<br>`
             + `• Niv. 11–16 : ×3 dés${l >= 11 && l < 17 ? here : ''}<br>`
             + `• Niv. 17+ : ×4 dés${l >= 17 ? here : ''}<br><br>`
             + `Exemple : Glas des trépassés fait actuellement ${cantripDice}d8 `
             + `(ou ${cantripDice}d12 si la cible a déjà perdu des PV).`,
      };
    },

    prepared: (level, wisMod, maxPrepared) => ({
      title: 'Sorts préparés',
      body:  `= Niveau de clerc + Mod. Sagesse<br>= ${level} + ${wisMod} = <strong>${maxPrepared} sorts max</strong><br><br>`
           + '• Les <strong>sorts de domaine</strong> (Arcane) ne comptent pas dans ce quota — ils sont toujours préparés.<br>'
           + '• Vous pouvez changer votre liste après un repos long.<br>'
           + '• Les sorts mineurs ne comptent pas non plus.',
    }),

    concentration: (conc, saveSign, hasAdvantage) => ({
      title: 'Concentration',
      body:  'Un seul sort de concentration à la fois.<br><br>'
           + '<strong>Se brise si :</strong><br>'
           + '• Vous prenez des dégâts → JS CON DD max(10, ½ dégâts)<br>'
           + '• Vous êtes incapacité, pétrifié ou mort<br>'
           + '• Vous lancez un autre sort de concentration<br>'
           + '• Vous le choisissez (bouton ✕)<br><br>'
           + (conc ? `Actuellement : <strong>${conc}</strong><br>` : '')
           + `JS CON : ${saveSign}${hasAdvantage ? ' + avantage (War Caster)' : ''}`,
    }),

    concentrationCombat: (saveSign, hasAdvantage) => ({
      title: 'Concentration — Comment elle se rompt',
      body:  '<strong>⚔ Dégâts reçus</strong><br>'
           + `Lancer 1d20 + mod. CON contre DD = max(10, ½ dégâts reçus en un coup).<br>`
           + `Torvin : 1d20 <strong>${saveSign}</strong>${hasAdvantage ? ' avec avantage (War Caster)' : ''}<br><br>`
           + '<strong>Ruptures automatiques</strong><br>'
           + '• Lancer un autre sort de concentration<br>'
           + '• Être <em>incapacité</em>, pétrifié ou tué<br>'
           + '• Choisir de la rompre volontairement (action gratuite)<br><br>'
           + '<strong>Astuce :</strong> War Caster donne l\'avantage au JS. Résistant (Con) ajoute la maîtrise.',
    }),

    slotLevel: (slotLvl, count) => ({
      title: `Emplacements de sorts — Niveau ${slotLvl}`,
      body:  `Vous avez <strong>${count} emplacement${count > 1 ? 's' : ''}</strong> de niveau ${slotLvl}.<br><br>`
           + `Un sort de niveau X consomme un emplacement de niveau ≥ X. `
           + `Lancer dans un emplacement supérieur peut amplifier l'effet (ex: Soins dans un slot niv.2 guérit plus).<br><br>`
           + '<strong>Récupération :</strong> tous les emplacements reviennent après un repos long.',
    }),

    // ── Stats individuelles ───────────────────────────────────
    // Chaque entrée retourne { title, uses: string[] }.
    // openStatInfo() dans app.js construit le corps du modal autour de ce tableau.
    stat: {
      str: loadKg => ({
        title: 'Force (FOR)',
        uses: [
          "Jets d'attaque au corps à corps (armes physiques)",
          "Compétence : Athlétisme",
          `Sauts, soulever, pousser, tirer (cap. de charge : ${loadKg} kg max)`,
          "Peu utile pour un clerc — Torvin préfère les sorts",
        ],
      }),
      dex: dexSign => ({
        title: 'Dextérité (DEX)',
        uses: [
          `Initiative au combat (actuellement ${dexSign})`,
          "Compétences : Acrobaties, Discrétion, Tour de main",
          "CA si armure légère ou sans armure",
          "Jets d'attaque à distance et armes finesse",
        ],
      }),
      con: hpMax => ({
        title: 'Constitution (CON)',
        uses: [
          `PV max (mod. CON × niveau inclus — total actuel : ${hpMax} PV)`,
          "JS Constitution — maintenir la concentration (DD 10 ou ½ des dégâts reçus)",
          "Résistance aux poisons, maladies, effets physiques",
          "Pas de compétences liées",
        ],
      }),
      int: () => ({
        title: 'Intelligence (INT)',
        uses: [
          "Compétences : Arcanes ★, Histoire, Investigation, Nature, Religion ★",
          "Ruse gnome : avantage sur tous les JS d'Intelligence contre la magie",
          "Savoir d'artisan : double maîtrise pour Histoire (objets magiques / technologiques)",
        ],
      }),
      wis: (dc, atkSign, passivePerc) => ({
        title: 'Sagesse (SAG) ★',
        uses: [
          `DD sorts (${dc}) et bonus d'attaque de sort (${atkSign})`,
          "Compétences : Médecine ★, Perspicacité ★, Perception, Dressage, Survie",
          `Sagesse passive : ${passivePerc} (perception discrète)`,
          "Ruse gnome : avantage sur tous les JS de Sagesse contre la magie",
        ],
      }),
      cha: chaSign => ({
        title: 'Charisme (CHA)',
        uses: [
          "Compétences : Persuasion ★, Duperie, Intimidation, Représentation",
          `DD Renvoi des Morts-Vivants et Abjuration Arcanique : ${chaSign}`,
          "Moins critique pour Torvin que la Sagesse",
        ],
      }),
    },

    // ── Jets de sauvegarde — texte des déclencheurs ──────────
    // Utilisé par openSaveInfo() dans app.js.
    savingThrow: {
      wis: 'Charme, Peur, Immobilisation de personne, Domination, Motif hypnotique. <em>Ruse gnome : avantage sur JS de SAG contre la magie.</em>',
      cha: 'Bannissement (important : Abjuration Arcanique utilise ce DD), Geôle argentée, sorts fiélons.',
      con: '<strong>Maintien de la concentration</strong> — DD = max(10, ½ des dégâts reçus). Poisons, maladies, pétrification.',
      int: 'Illusions mentales, Confusion, certaines variantes de Domination. <em>Ruse gnome : avantage sur JS d\'INT contre la magie.</em>',
      dex: 'Explosions et zones (Boule de feu, Appel de la foudre), pièges à déclenchement.',
      str: 'Vague tonnante, saisissement magique.',
    },
  },
};

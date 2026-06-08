// ══════════════════════════════════════════════════════════════
// characters/torvin/torvin.js — Torvin "Trois-Parchemins"
// Données spécifiques au personnage (race, classe, sorts, état initial)
// Dépend de : data.js (LEVELS, CLERIC_SPELLS, FEATS, CONDITIONS…)
// ══════════════════════════════════════════════════════════════

// Niveaux d'ASI pour le Clerc (dans la plage niv.1–10)
const CLERIC_ASI_LEVELS = [4, 8];

// Sorts de domaine Arcane (SCAG) — toujours préparés, ne comptent pas dans le quota
const DOMAIN_SPELLS = {
  1: [ { id:'detectmagic',   conc:true  }, { id:'magicmissile',   conc:false } ],
  3: [ { id:'magicweapon',   conc:true  }, { id:'nystulmagicaura', conc:true  } ],
  5: [ { id:'dispelmagic',   conc:false }, { id:'magiccircle',     conc:false } ],
  7: [ { id:'arcaneeye',     conc:true  }, { id:'leomundschest',   conc:false } ],
  9: [ { id:'planarbinding', conc:true  }, { id:'teleportcircle',  conc:false } ],
};

// Capacités débloquées par niveau — Domaine Arcane (SCAG) + racial Gnome des Roches
const FEATURES_BY_LEVEL = [
  { minLvl:1,  name:'Arcane Initiate',                desc:"Maîtrise de la compétence Arcanes. 2 sorts mineurs de magicien comptant comme sorts mineurs de clerc (Torvin : Main du mage + Illusion mineure)." },
  { minLvl:1,  name:'Ruse gnome',                     desc:"Avantage sur tous les JS d'Intelligence, Sagesse et Charisme contre la magie." },
  { minLvl:1,  name:'Savoir d\'artisan',              desc:"Double le bonus de maîtrise pour les jets d'Intelligence (Histoire) liés aux objets magiques, alchimiques ou technologiques." },
  { minLvl:1,  name:'Bricoleur · Vision 18 m',        desc:"Fabriquer des automates mécaniques (30 min + 10 po matériaux). Vision dans le noir 18 m." },
  { minLvl:2,  name:'Canalisation divine',             desc:"Renvoi des morts-vivants (base clerc) ou Abjuration Arcanique (célestes, élémentaires, fées, fiélons uniquement — pas les morts-vivants). Dès niv.5 : banissement si FP ≤ ½. 1× niv.2–5 · 2× niv.6–17." },
  { minLvl:5,  name:'Destruction des morts-vivants',  desc:'Renvoi = destruction si FP ≤ ½ (niv.5-7) · FP ≤ 1 (niv.8-10).' },
  { minLvl:6,  name:'Briseur de sorts',               desc:"Quand vous restaurez des PV à un allié avec un sort de niv.1+, vous pouvez aussi dissiper un sort sur lui dont le niveau ≤ l'emplacement utilisé." },
  { minLvl:8,  name:'Incantation Puissante',           desc:'Modificateur de Sagesse ajouté aux dégâts des sorts mineurs de Clerc.' },
  { minLvl:10, name:'Intervention divine',             desc:"Appel à Azouth pour aide miraculeuse. Succès auto si le jet ≤ niveau. 1× par repos long." },
];

// Réflexes universels de roleplay — toujours disponibles dans le tirage aléatoire
const UNIVERSAL_REFLEXES = [
  "Intéressant... j'avais lu quelque chose à ce sujet.",
  "Si vous me permettez une observation non sollicitée...",
  "Techniquement parlant...",
  "Ce n'est pas ce que j'aurais anticipé, mais bon.",
  "J'ai consigné quelque chose de similaire dans mes notes. Laissez-moi vérifier.",
  "Ce serait peut-être le moment de prendre du recul et d'analyser la situation.",
  "Je vais noter ça.",
  "Dans l'absolu, j'aurais préféré une autre approche.",
  "Ce n'est pas une retraite. C'est un repositionnement stratégique.",
  "Hmm. Les probabilités étaient pourtant en notre faveur.",
  "Azouth, si tu m'écoutes — maintenant serait un bon moment.",
  "Je ré-évalue mes hypothèses.",
  "Attendez. Non. Oui. Enfin... attendez.",
  "Je suis certain d'avoir une solution. Elle me reviendra.",
];

// Bonus raciaux — Gnome des Roches
const DEFAULT_RACIAL = { str:0, dex:0, con:1, int:2, wis:0, cha:0 };

// État initial du personnage
const DEFAULT_CHAR = {
  // ── Identité ──────────────────────────────────────────────────
  name: 'Torvin "Trois-Parchemins"',
  race: 'Gnome des Roches',
  className: 'Clerc',
  subclass: 'Domaine Arcane',
  background: 'Artisan de Guilde',
  deity: 'Azouth',
  alignment: 'Neutre Bon',
  level: 3,

  // ── Caractéristiques ──────────────────────────────────────────
  base:   { str:8,  dex:12, con:13, int:14, wis:15, cha:10 },
  racial: { str:0,  dex:0,  con:1,  int:2,  wis:0,  cha:0  },
  // Choix d'ASI par niveau : { 4: {type:'asi', bonuses:{wis:2}} | {type:'feat', feat:'war-caster'} }
  asi: {},

  // ── Combat ────────────────────────────────────────────────────
  caManual: 14,     // CA manuelle (override si useCaAuto=false)
  useCaAuto: true,  // true = calculer depuis les slots armure/bouclier/bonus items
  speed: 7.5,       // Gnome des Roches : 25 pieds = 7,5 m

  // ── Points de vie ─────────────────────────────────────────────
  hpRolls: [0, 8, 6, 6, 0, 0, 0, 0, 0, 0, 0],
  hpCurrent: 26,
  hpTemp: 0,
  hpMaxBonus: 0,

  // ── Sorts ─────────────────────────────────────────────────────
  slotsUsed:    { 1:0, 2:0, 3:0, 4:0, 5:0 },
  spellChecks:  {},
  cdUsed:       0,
  preparedSpells: {
    0: [
      { id:'tollDead'      },
      { id:'mageHand'      },
      { id:'minorIllusion' },
      { id:'guidance'      },
      { id:'sacredflame'   },
    ],
    1:[], 2:[], 3:[], 4:[], 5:[],
  },
  removedSpells: [],  // IDs des sorts mineurs par défaut supprimés par l'utilisateur

  // ── Compétences maîtrisées ────────────────────────────────────
  // Arcanes : Arcane Initiate · Religion + Médecine : choix de classe
  // Intuition + Persuasion : background Artisan de Guilde
  skillProfs: ['arcanes', 'religion', 'medecine', 'intuition', 'persuasion'],

  // ── Concentration ─────────────────────────────────────────────
  concentration: null,   // null | nom du sort

  // ── État de combat ────────────────────────────────────────────
  conditions:         [],                 // ids de CONDITIONS actives
  conditionDurations: {},                 // { id: rounds|null } — null = sans durée
  deathSaves:  { success:0, failure:0 }, // 0–3 chacun
  inspiration: false,
  exhaustion:  0,                        // 0–6
  combatRound: 0,                        // 0 = hors combat

  // ── Emplacements d'équipement ─────────────────────────────────
  slots: {
    arme:     { name:"Masse d'armes",  notes:'', atkBonus:'+1', damage:'1d6-1', damageType:'contondant', range:'Corps-à-corps', bonuses:[] },
    armure:   { name:'Armure de cuir', notes:'', armorBase:11, armorType:'light', bonuses:[] },
    bouclier: { name:'Bouclier',       notes:'', bonuses:[{ type:'ca', value:2 }] },
    casque:   { name:'',               notes:'', bonuses:[] },
    cape:     { name:'',               notes:'', bonuses:[] },
    amulette: { name:'',               notes:'', bonuses:[] },
    anneau1:  { name:'',               notes:'', bonuses:[] },
    anneau2:  { name:'',               notes:'', bonuses:[] },
    gants:    { name:'',               notes:'', bonuses:[] },
    bottes:   { name:'',               notes:'', bonuses:[] },
  },

  // ── Sac & objets divers ───────────────────────────────────────
  equipment: [
    "La Relique d'Azouth — focaliseur d'incantation & lien divin",
    "Masse d'armes",
    "Armure de cuir + Bouclier",
    "Outils de bricoleur",
    "Pack d'explorateur",
    "Lettre de guilde · 15 po",
  ],
  customEquipment: [],

  // Harmonisation (max 3 objets magiques)
  attunedItems: [],

  // ── Monnaies ──────────────────────────────────────────────────
  currency: { pp:0, gp:15, ep:0, sp:0, cp:0 },

  // ── Langues & maîtrises d'outils ──────────────────────────────
  languages:  ['Commun', 'Gnome'],
  toolProfs:  ['Outils de bricoleur'],

  // ── Roleplay / personnalité ────────────────────────────────────
  notes: '',         // Conservé pour migration depuis l'ancien textarea
  sessionNotes: [],  // Journal de session : [{ date:'YYYY-MM-DD', text:'' }, …]
  traits: [
    "J'explique systématiquement ce que je fais et pourquoi, même en plein combat. Surtout en plein combat.",
    "Je trouve une explication rationnelle à tout. La magie n'est qu'un mécanisme qu'on ne comprend pas encore."
  ],
  ideal: "La connaissance doit circuler librement — la garder pour soi est un crime contre l'humanité.",
  bond: "La relique d'Azouth est toujours en ma possession. Je ne sais pas encore ce qu'elle fait vraiment.",
  flaw: "Je suis incapable de jeter quoi que ce soit — parchemins, bouts de mécanismes, notes griffonnées. Mon sac est un désastre.",

  // Phrases situationnelles (éditables)
  phrases: [
    { situation: 'En lançant Fléau',           text: '« Fascinant — réduire votre efficacité combat augmente les probabilités de survie de mes collègues. Je procède. »' },
    { situation: 'En soignant',                text: '« Vous saignez à un rythme préoccupant. J\'ai documenté ce type de blessure — le protocole est clair. »' },
    { situation: 'En ratant un sort',          text: '« Hm. Résultat inattendu. Ce n\'était pas une erreur, c\'était... une donnée supplémentaire. »' },
    { situation: 'Découverte magique',         text: '« Passez-moi ça. Non — je ne vais pas le casser. Enfin... probablement pas. »' },
    { situation: 'Quelqu\'un conteste',        text: '« C\'est... une perspective. Incorrecte, mais une perspective tout de même. »' },
    { situation: 'Situation désespérée',       text: '« Ce n\'est pas idéal. Ce n\'est vraiment, vraiment pas idéal. Je recalcule. »' },
    { situation: 'En perdant des PV',          text: '« Ça fait mal. C\'est une donnée utile, mais ça fait quand même très mal. »' },
    { situation: 'Face à un monstre',          text: '« Fascinant. J\'aurais aimé l\'étudier dans des conditions moins urgentes. »' },
    { situation: 'Après une victoire',         text: '« Bien. Maintenant, quelqu\'un peut-il m\'expliquer ce qui vient de se passer ? »' },
    { situation: 'Avant un combat',            text: '« Stratégie : ne pas mourir. J\'affine au fur et à mesure. »' },
    { situation: 'Face à un arcaniste',        text: '« Oh. Oh, attendez. Vous êtes... Puis-je vous poser des questions ? Beaucoup de questions ? »' },
    { situation: 'Face à un piège',            text: '« Je l\'avais vu. Je ne l\'avais simplement pas encore mentionné. »' },
    { situation: 'En négociant',               text: '« Je propose un arrangement mutuellement bénéfique, documenté en trois exemplaires. »' },
    { situation: 'Quelqu\'un fait une erreur', text: '« C\'est une approche. Ce n\'est pas celle que j\'aurais choisie. Mais c\'est une approche. »' },
    { situation: 'Canalisation divine',        text: '« Azouth — maintenant. S\'il te plaît. »' },
    { situation: 'En fouillant un donjon',     text: '« L\'architecture est intéressante. Quelqu\'un prend des notes ? »' },
  ],

  // ── GitHub ────────────────────────────────────────────────────
  ghRepo:   'Funkyst4rz/torvin',
  ghFile:   'characters/torvin/save.json',
  ghBranch: 'main',
};

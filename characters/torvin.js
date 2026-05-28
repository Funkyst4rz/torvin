// ══════════════════════════════════════════════════════════════
// characters/torvin.js — Torvin "Trois-Parchemins"
// Données spécifiques au personnage (race, classe, sorts, état initial)
// Dépend de : data.js (LEVELS, CLERIC_SPELLS, FEATS, CONDITIONS…)
// ══════════════════════════════════════════════════════════════

// Niveaux d'ASI pour le Clerc (dans la plage niv.1–10)
const CLERIC_ASI_LEVELS = [4, 8];

// Sorts de domaine Arcane (SCAG) — toujours préparés, ne comptent pas dans le quota
const DOMAIN_SPELLS = {
  1: [
    { name:'Détection de la magie', tag:'rituel',     conc:true,  desc:"Détecte la présence de magie dans un rayon de 9 m pendant 10 min. Peut être lancé comme rituel. Identifie les auras magiques et les écoles de magie." },
    { name:'Projectile magique',    tag:'auto',        conc:false, desc:"3 fléchettes de force (1d4+1 chacune, +1 fléchette par niveau d'emplacement supérieur). Ne rate jamais. Peut cibler plusieurs créatures.", upcast:"+1 fléchette (1d4+1) par niveau d'emplacement supérieur au niv.1 (niv.2 = 4, niv.3 = 5…)." },
  ],
  3: [
    { name:'Arme magique',          tag:'buff',        conc:true,  desc:"Une arme non magique devient magique : +1 aux jets d'attaque et dégâts (ou +2 si emplacement de niv.4+). Concentration, 1 heure." },
    { name:"Aura magique de Nystul",tag:'illusion',    conc:true,  desc:"Modifie la détection magique d'un objet ou d'une créature pendant 24 heures. Peut masquer ou falsifier l'aura magique." },
  ],
  5: [
    { name:'Dissipation de la magie',tag:'utilitaire', conc:false, desc:"Annule les effets magiques dans un rayon de 9 m (DD = 10 + niveau du sort). Supprime automatiquement les sorts de niv.≤3." },
    { name:'Cercle magique',         tag:'protection', conc:false, desc:"Cylindre de 3 m de rayon × 9 m de hauteur : protège contre un type de créature choisi (fiélons, morts-vivants…). Dure 1 heure." },
  ],
  7: [
    { name:"Œil d'Arcane",    tag:'divination', conc:true,  desc:"Crée un œil magique invisible se déplaçant à 9 m/tour. Vous percevez à travers lui (vision normale + vision dans le noir 9 m) pendant 1 heure." },
    { name:'Coffre de Léomund', tag:'invocation', conc:false, desc:"Un coffre peut être caché sur le plan éthéré et rappelé avec un réplique miniature. Contenu conservé indéfiniment." },
  ],
  9: [
    { name:'Lien planaire',          tag:'DD Cha',  conc:true,  desc:"Soumet un céleste, fiélon ou élémentaire. JS Charisme. S'il échoue 3 fois, il est lié pendant 24 heures (renouvelable). Concentration." },
    { name:'Cercle de téléportation', tag:'rituel', conc:false, desc:"Ouvre un portail vers un cercle de téléportation connu. Dure 1 minute. Peut être gravé définitivement (11 jours de travail, coût 50 po/j)." },
  ],
};

// Sorts suggérés par niveau de sort (proposition de base pour Torvin)
const SUGGESTED_SPELLS = {
  1: [
    { id:'sc-bane', name:'Fléau (Bane)',       tag:'DD Cha', conc:true,  bonus:false },
    { id:'sc-hw',   name:'Mot de guérison',    tag:'soin',   conc:false, bonus:true  },
  ],
  2: [
    { id:'sc-hp',   name:'Immobilisation (Hold Person)', tag:'DD Sag', conc:true,  bonus:false },
    { id:'sc-bd',   name:'Cécité / Surdité',             tag:'DD Con', conc:false, bonus:false },
    { id:'sc-sw',   name:'Arme spirituelle',             tag:'+atk',   conc:false, bonus:true  },
  ],
  3: [
    { id:'sc-ss',   name:'Silence',       tag:'zone', conc:true,  bonus:false },
    { id:'sc-sb',   name:'Lumière du jour',tag:'60ft', conc:false, bonus:false },
  ],
  4: [
    { id:'sc-bg',   name:'Gardien de la foi',    tag:'zone', conc:false, bonus:false },
    { id:'sc-fof',  name:'Liberté de mouvement', tag:'buff', conc:false, bonus:false },
  ],
  5: [
    { id:'sc-con',  name:'Contagion',      tag:'DD Con', conc:false, bonus:false },
    { id:'sc-flf',  name:'Colonne de flamme',tag:'+atk', conc:false, bonus:false },
  ],
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
  asi: {
    4: { type:'asi', bonuses:{ wis:2 } },
  },

  // ── Combat ────────────────────────────────────────────────────
  caManual: 14,     // CA manuelle (override si useCaAuto=false)
  useCaAuto: true,  // true = calculer depuis les slots armure/bouclier/bonus items
  armorBase: 11,    // Conservé pour compatibilité ascendante
  armorType: 'light',
  useShield: true,
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
  customSpells: {
    0: [
      { id:'tollDead',      name:'Glas des trépassés', tag:'DD Sag',     conc:false },
      { id:'mageHand',      name:'Main du mage',        tag:'utilitaire', conc:false },
      { id:'minorIllusion', name:'Illusion mineure',    tag:'utilitaire', conc:false },
      { id:'guidance',      name:'Guidance',            tag:'utilitaire', conc:true  },
      { id:'sacredflame',   name:'Flamme sacrée',       tag:'DD Dex',     conc:false },
      { id:'resistance',    name:'Résistance',           tag:'buff',       conc:true  },
    ],
    1:[], 2:[], 3:[], 4:[], 5:[],
  },
  removedSpells: [],  // IDs des sorts suggérés masqués par l'utilisateur

  // ── Compétences maîtrisées ────────────────────────────────────
  // Arcanes : Arcane Initiate · Religion + Médecine : choix de classe
  // Intuition + Persuasion : background Artisan de Guilde
  skillProfs: ['arcanes', 'religion', 'medecine', 'intuition', 'persuasion'],

  // ── Concentration ─────────────────────────────────────────────
  concentration: null,   // null | nom du sort

  // ── État de combat ────────────────────────────────────────────
  conditions:  [],                       // ids de CONDITIONS actives
  deathSaves:  { success:0, failure:0 }, // 0–3 chacun
  inspiration: false,
  exhaustion:  0,                        // 0–6

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
    { situation: 'En lançant Fléau',    text: '« Fascinant — réduire votre efficacité combat augmente les probabilités de survie de mes collègues. Je procède. »' },
    { situation: 'En soignant',          text: '« Vous saignez à un rythme préoccupant. J\'ai documenté ce type de blessure — le protocole est clair. »' },
    { situation: 'En ratant un sort',    text: '« Hm. Résultat inattendu. Ce n\'était pas une erreur, c\'était... une donnée supplémentaire. »' },
    { situation: 'Découverte magique',   text: '« Passez-moi ça. Non — je ne vais pas le casser. Enfin... probablement pas. »' },
    { situation: 'Quelqu\'un conteste',  text: '« C\'est... une perspective. Incorrecte, mais une perspective tout de même. »' },
    { situation: 'Situation désespérée', text: '« Ce n\'est pas idéal. Ce n\'est vraiment, vraiment pas idéal. Je recalcule. »' },
  ],

  // ── GitHub ────────────────────────────────────────────────────
  ghRepo:   'Funkyst4rz/torvin',
  ghFile:   'save.json',
  ghBranch: 'main',
};

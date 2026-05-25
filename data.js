// ══════════════════════════════════════════════════════════════
// data.js — Torvin "Trois-Parchemins"
// Données statiques D&D 5e (Clerc Domaine Arcane, niv. 1–10)
// ══════════════════════════════════════════════════════════════

// Emplacements de sorts, prof bonus, CD par niveau de personnage (Clerc)
const LEVELS = {
  1:  { prof:2, slots:{1:2},                  cd:1, info:'Sorts de domaine niv.1 débloqués' },
  2:  { prof:2, slots:{1:3},                  cd:2, info:'Canalisation divine (2×/repos court)' },
  3:  { prof:2, slots:{1:4,2:2},              cd:2, info:'Sorts de domaine niv.2 débloqués' },
  4:  { prof:2, slots:{1:4,2:3},              cd:2, info:'Amélioration de caractéristiques' },
  5:  { prof:3, slots:{1:4,2:3,3:2},          cd:2, info:'Sorts de domaine niv.3 · Destruction des morts-vivants (FP ½)' },
  6:  { prof:3, slots:{1:4,2:3,3:3},          cd:2, info:'Incantation Puissante : +mod Sag aux dégâts des sorts mineurs' },
  7:  { prof:3, slots:{1:4,2:3,3:3,4:1},     cd:2, info:'Sorts de domaine niv.4 débloqués' },
  8:  { prof:3, slots:{1:4,2:3,3:3,4:2},     cd:2, info:'Amélioration de caractéristiques · Destruction (FP 1)' },
  9:  { prof:4, slots:{1:4,2:3,3:3,4:3,5:1}, cd:2, info:'Sorts de domaine niv.5 débloqués' },
  10: { prof:4, slots:{1:4,2:3,3:3,4:3,5:2}, cd:3, info:'Intervention divine · Canalisation divine 3×/repos court' },
};

// Niveaux d'ASI pour le Clerc (dans la plage niv.1–10)
const CLERIC_ASI_LEVELS = [4, 8];

// Sorts de domaine Arcane (SCAG) — toujours préparés, ne comptent pas dans le quota
const DOMAIN_SPELLS = {
  1: [
    { name:'Détection de la magie', tag:'rituel', conc:true  },
    { name:'Projectile magique',    tag:'auto',   conc:false },
  ],
  3: [
    { name:'Arme magique',          tag:'buff',    conc:true  },
    { name:"Aura magique de Nystul",tag:'illusion',conc:true  },
  ],
  5: [
    { name:'Dissipation de la magie',tag:'utilitaire', conc:false },
    { name:'Cercle magique',         tag:'protection', conc:false },
  ],
  7: [
    { name:"Œil d'Arcane",    tag:'divination', conc:true  },
    { name:'Coffre de Léomund',tag:'invocation', conc:false },
  ],
  9: [
    { name:'Lien planaire',         tag:'DD Cha', conc:true  },
    { name:'Cercle de téléportation',tag:'rituel', conc:false },
  ],
};

// Sorts suggérés par niveau de sort (proposition de base pour Torvin)
const SUGGESTED_SPELLS = {
  1: [
    { id:'sc-bane', name:'Fléau (Bane) ⭐',    tag:'DD Cha', conc:true,  bonus:false },
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

// Liste complète des sorts de Clerc disponibles (pour le picker)
const CLERIC_SPELLS = {
  0: [
    { id:'guidance',    name:'Guidance',        tag:'utilitaire', conc:true,  desc:"Touchez une créature. Elle peut ajouter 1d4 à un jet de caractéristique pendant 1 minute." },
    { id:'light',       name:'Lumière',          tag:'utilitaire', conc:false, desc:"Un objet émet une lumière vive sur 6 m et faible sur 6 m de plus pendant 1 heure." },
    { id:'resistance',  name:'Résistance',       tag:'buff',       conc:true,  desc:"Touchez une créature. Elle peut ajouter 1d4 à un jet de sauvegarde pendant 1 minute." },
    { id:'sacredflame', name:'Flamme sacrée',    tag:'DD Dex',     conc:false, desc:"JS Dextérité ou 1d8 dégâts radiants. Ignore les couvertures." },
    { id:'sparedying',  name:'Stabilisation',    tag:'utilitaire', conc:false, desc:"Touchez une créature à 0 PV pour la stabiliser." },
    { id:'thaumaturgy', name:'Thaumaturgie',      tag:'utilitaire', conc:false, desc:"Signe mineur de puissance divine (voix, lumière, tremblement) pendant 1 minute." },
    { id:'tollDead',    name:'Glas des trépassés',tag:'DD Sag',    conc:false, desc:"1d8 nécrotique (ou 1d12 si la cible est blessée). Portée 18 m. Sort mineur de magicien." },
    { id:'mageHand',    name:'Main du mage',     tag:'utilitaire', conc:false, desc:"Crée une main spectrale qui manipule des objets légers dans 9 m. Sort mineur de magicien." },
    { id:'minorIllusion',name:'Illusion mineure',tag:'utilitaire', conc:false, desc:"Crée une image ou un son illusoire dans 9 m pendant 1 minute. Sort mineur de magicien." },
  ],
  1: [
    { id:'bane',        name:'Fléau',            tag:'DD Cha',   conc:true,  desc:"3 créatures subissent −1d4 à leurs jets d'attaque et de sauvegarde pendant 1 minute." },
    { id:'bless',       name:'Bénédiction',       tag:'buff',     conc:true,  desc:"3 créatures ajoutent 1d4 à leurs jets d'attaque et de sauvegarde pendant 1 minute." },
    { id:'command',     name:'Commandement',      tag:'contrôle', conc:false, desc:"Une créature obéit à un commandement d'un mot. JS Sagesse pour résister." },
    { id:'curewounds',  name:'Soin des blessures',tag:'soin',     conc:false, desc:"Au toucher : la cible récupère 1d8 + mod Sag PV." },
    { id:'guidingbolt', name:'Trait de lumière',  tag:'+atk/4d6', conc:false, desc:"Attaque sort à distance : 4d6 dégâts radiants. Prochaine attaque contre la cible avec avantage." },
    { id:'healingword', name:'Mot de guérison',   tag:'soin bon.',conc:false, desc:"Action bonus : une créature récupère 1d4 + mod Sag PV." },
    { id:'infwounds',   name:'Infliger des blessures',tag:'+atk/3d10',conc:false,desc:"Attaque sort au contact : 3d10 dégâts nécrotiques." },
    { id:'protevil',    name:'Protection contre le mal',tag:'défense',conc:true, desc:"Protection contre les aberrations, célestes, élémentaires, fées, fiélons et morts-vivants." },
    { id:'sanctuary',   name:'Sanctuaire',         tag:'défense',  conc:false, desc:"Les attaquants visant la cible doivent réussir un JS Sagesse ou choisir une autre cible." },
    { id:'shieldfaith', name:'Bouclier de la foi', tag:'+2 CA',    conc:true,  desc:"Une créature gagne +2 à la CA pendant 10 minutes." },
    { id:'createwater', name:"Création d'eau",     tag:'utilitaire',conc:false, desc:"Crée jusqu'à 40 litres d'eau potable ou purifie de l'eau empoisonnée." },
  ],
  2: [
    { id:'aid',         name:'Aide',              tag:'+5 PV',     conc:false, desc:"3 alliés gagnent +5 PV max et actuels pendant 8 heures." },
    { id:'blinddeaf',   name:'Cécité / Surdité',  tag:'DD Con',    conc:false, desc:"JS Constitution ou aveugle ou sourd pendant 1 minute." },
    { id:'holdperson',  name:'Immobilisation de personne',tag:'DD Sag',conc:true,desc:"JS Sagesse ou paralysée. Renouvellement possible chaque round." },
    { id:'lessrestore', name:'Restauration partielle',tag:'utilitaire',conc:false,desc:"Supprime une maladie, un poison actif, une paralysie ou une cécité." },
    { id:'prayerheal',  name:'Prière de guérison', tag:'soin 10min',conc:false, desc:"6 créatures récupèrent 2d8 + mod Sag PV. Incantation de 10 minutes." },
    { id:'silence',     name:'Silence',            tag:'zone',      conc:true,  desc:"Sphère 6 m : aucun son, sorts à composante verbale impossibles à l'intérieur." },
    { id:'spweapon',    name:'Arme spirituelle',   tag:'bon./1d8',  conc:false, desc:"Action bonus : arme spectrale qui attaque à chaque tour. Bonus prof + mod Sag." },
    { id:'wardingbond', name:'Lien de protection', tag:'défense',   conc:false, desc:"+1 CA et JS, résistance à tous dégâts. Vous partagez les dégâts reçus." },
    { id:'augury',      name:'Augure',             tag:'rituel',    conc:false, desc:"Obtenez un présage (bien/mal/les deux/aucun) sur une action dans les 30 minutes." },
  ],
  3: [
    { id:'animdead',    name:'Animation des morts',tag:'nécro',     conc:false, desc:"Animez un squelette ou zombie obéissant pendant 24h. Renouvelable." },
    { id:'beaconhope',  name:"Balise d'espoir",    tag:'buff',      conc:true,  desc:"Alliés dans 9 m : avantage aux JS Sag et mort, PV max lors des soins." },
    { id:'bestowcurse', name:'Malédiction',         tag:'debuff',    conc:true,  desc:"Désavantage sur jets d'une caractéristique, −1d8 aux dégâts ou perte de tour." },
    { id:'daylight',    name:'Lumière du jour',     tag:'utilitaire',conc:false, desc:"Lumière vive 18 m pendant 1 heure. Dissipe ténèbres magiques ≤ 2." },
    { id:'massHW',      name:'Soins de groupe',     tag:'soin bon.', conc:false, desc:"Action bonus : jusqu'à 6 créatures récupèrent 1d4 + mod Sag PV." },
    { id:'protEnergy',  name:"Protection contre l'énergie",tag:'résistance',conc:true,desc:"Résistance à un type de dégâts choisi pendant 1 heure." },
    { id:'revivify',    name:'Rappel à la vie',     tag:'utilitaire',conc:false, desc:"Ramenez à 1 PV une créature morte il y a moins d'1 minute. (300 po)" },
    { id:'spiritguard', name:'Esprits gardiens',    tag:'zone',      conc:true,  desc:"Spectres 4,5 m infligent 3d8 dégâts radiants ou nécrotiques aux ennemis." },
    { id:'removecurse', name:'Suppression de malédiction',tag:'utilitaire',conc:false,desc:"Supprime toutes les malédictions ou désactive un objet maudit au toucher." },
    { id:'tongues',     name:'Langues',             tag:'utilitaire',conc:false, desc:"Comprend toutes les langues parlées et se fait comprendre pendant 1 heure." },
    { id:'sending',     name:'Message',             tag:'divination',conc:false, desc:"Envoyez 25 mots à n'importe quelle créature que vous connaissez." },
  ],
  4: [
    { id:'banishment',  name:'Bannissement',        tag:'contrôle',  conc:true,  desc:"JS Charisme ou banni pendant 1 min. Si extra-planaire, permanent après 1 minute." },
    { id:'deathward',   name:'Protection contre la mort',tag:'défense',conc:false,desc:"1ère fois à 0 PV : reste à 1 PV. Dure 8 heures." },
    { id:'divination',  name:'Divination',           tag:'rituel',   conc:false, desc:"Réponse véridique de votre divinité sur un événement dans les 7 prochains jours." },
    { id:'freedommvt',  name:'Liberté de mouvement', tag:'buff',     conc:false, desc:"Ignore terrain difficile, enchevêtrements et réductions de vitesse magiques pendant 1h." },
    { id:'guardianfaith',name:'Gardien de la foi',   tag:'zone',     conc:false, desc:"Gardien spectral : 20 dégâts radiants aux intrus entrant dans 3 m (60 PV total)." },
  ],
  5: [
    { id:'commune',     name:'Communion',            tag:'rituel',   conc:false, desc:"Posez 3 questions oui/non à votre divinité. Une fois par jour." },
    { id:'dispevil',    name:'Dissipation du mal',   tag:'défense',  conc:true,  desc:"Avantage aux JS contre aberrations, célestes, fées, fiélons, morts-vivants." },
    { id:'flamestrike', name:'Colonne de flamme',    tag:'+atk',     conc:false, desc:"Cylindre 3 m × 9 m : 4d6 feu + 4d6 radiants. JS Dex pour moitié." },
    { id:'greaterrest', name:'Restauration supérieure',tag:'utilitaire',conc:false,desc:"Supprime épuisement, charme, pétrification, malédiction ou réduction de caract." },
    { id:'masscure',    name:'Soins de groupe supérieurs',tag:'soin',conc:false, desc:"Jusqu'à 6 créatures dans 9 m récupèrent 3d8 + mod Sag PV." },
    { id:'raisedead',   name:'Rappel des morts',     tag:'utilitaire',conc:false, desc:"Ramenez une créature morte ≤ 10 jours à 1 PV. (500 po)" },
    { id:'scrying',     name:'Scrutation',            tag:'divination',conc:true, desc:"Observez une créature spécifique à distance. JS Sagesse (modifié par familiarité)." },
    { id:'legendlore',  name:'Légende',               tag:'divination',conc:false,desc:"Bribes d'histoire sur un lieu, objet ou personnage légendaire." },
  ],
};

// Capacités débloquées par niveau
const FEATURES_BY_LEVEL = [
  { minLvl:1,  name:'Bénédictions du Savoir',         desc:'Maîtrise doublée en Arcanes et Histoire. Maîtrise de deux langues ou compétences supplémentaires au choix.' },
  { minLvl:1,  name:'Sorts mineurs bonus (magicien)',  desc:'2 sorts mineurs de magicien : Glas des trépassés, Main du mage, Illusion mineure.' },
  { minLvl:1,  name:'Ruse gnome',                     desc:"Avantage sur tous les JS d'Intelligence, Sagesse et Charisme contre la magie." },
  { minLvl:1,  name:'Bricoleur · Vision 18 m',        desc:"Fabriquer des automates mécaniques (30 min + 10 po matériaux). Vision dans le noir 18 m." },
  { minLvl:2,  name:'Canalisation divine',             desc:'Renvoi des morts-vivants ou Renvoi des aberrations. 1× niv.1 · 2× niv.2-9 · 3× niv.10.' },
  { minLvl:5,  name:'Destruction des morts-vivants',  desc:'Renvoi = destruction si FP ≤ ½ (niv.5-7) · FP ≤ 1 (niv.8-10).' },
  { minLvl:6,  name:'Incantation Puissante',           desc:'Modificateur de Sagesse ajouté aux dégâts des sorts mineurs de Clerc.' },
  { minLvl:10, name:'Intervention divine',             desc:"Appel à Azouth pour aide miraculeuse. Succès auto si le jet ≤ niveau. 1× par repos long." },
];

// Dons disponibles
const FEATS = [
  {
    id: 'war-caster', recommended: true,
    name: 'Guerrier de la Magie (War Caster)',
    desc: "Avantage aux JS de concentration. Incantation possible avec armes et bouclier. Sort de réaction lors d'une attaque d'opportunité.",
    statBonus: null,
  },
  {
    id: 'resilient-con', recommended: true,
    name: 'Résistant — Constitution (Resilient)',
    desc: '+1 Constitution. Maîtrise des jets de sauvegarde de Constitution — boost massif pour maintenir la concentration.',
    statBonus: { stat:'con', val:1 },
  },
  {
    id: 'observant', recommended: true,
    name: 'Observateur (Observant)',
    desc: '+1 Intelligence ou Sagesse. +5 à la Perception et Investigation passives. Lecture sur les lèvres.',
    statBonus: { stat:'wis', val:1 },
  },
  {
    id: 'lucky', recommended: false,
    name: 'Chanceux (Lucky)',
    desc: "3 points de chance par repos long. Relancez un jet d'attaque, de caractéristique ou de sauvegarde.",
    statBonus: null,
  },
  {
    id: 'alert', recommended: false,
    name: 'Alerte (Alert)',
    desc: "+5 à l'initiative. Impossible d'être surpris. Les invisibles n'ont pas l'avantage contre vous.",
    statBonus: null,
  },
  {
    id: 'tough', recommended: false,
    name: 'Robuste (Tough)',
    desc: '+2 PV par niveau actuel et futur (+6 PV au niv.3, +20 PV au niv.10).',
    statBonus: null,
  },
  {
    id: 'spell-sniper', recommended: false,
    name: 'Tireur de sorts (Spell Sniper)',
    desc: 'Double la portée des sorts nécessitant un jet. Ignore demi-couverture et ¾. Sort mineur supplémentaire.',
    statBonus: null,
  },
  {
    id: 'mobile', recommended: false,
    name: 'Mobile',
    desc: "Vitesse +3 m. Pas de coût supplémentaire en terrain difficile lors d'un sprint. Pas d'attaque d'opportunité après une attaque.",
    statBonus: null,
  },
];

// ── Conditions PHB ──
const CONDITIONS = [
  { id:'blinded',       name:'Aveuglé',     desc:"Ne peut pas voir. Attaques contre lui : avantage. Ses attaques : désavantage." },
  { id:'charmed',       name:'Charmé',       desc:"Ne peut pas attaquer le charmeur. Le charmeur a l'avantage en social." },
  { id:'deafened',      name:'Assourdi',     desc:"Ne peut pas entendre. Fail auto aux jets nécessitant l'ouïe." },
  { id:'frightened',    name:'Effrayé',      desc:"Désavantage aux jets si la source de peur est visible. Mouvement vers la source interdit." },
  { id:'grappled',      name:'Agrippé',      desc:"Vitesse réduite à 0. Se termine si l'agrippeur est neutralisé." },
  { id:'incapacitated', name:'Incapacité',   desc:"Aucune action ni réaction possibles." },
  { id:'invisible',     name:'Invisible',    desc:"Invisible sans magie spéciale. Avantage aux attaques. Désavantage contre lui." },
  { id:'paralyzed',     name:'Paralysé',     desc:"Incapacité. Immobile et muet. Critiques auto à courte portée. Fail JS For/Dex." },
  { id:'petrified',     name:'Pétrifié',     desc:"Transformé en pierre. Paralysé. Résistance à tous les dégâts." },
  { id:'poisoned',      name:'Empoisonné',   desc:"Désavantage aux jets d'attaque et de caractéristique." },
  { id:'prone',         name:'À terre',      desc:"Peut seulement ramper. Désavantage aux attaques. Avantage en mêlée contre lui." },
  { id:'restrained',    name:'Entravé',      desc:"Vitesse 0. Désavantage aux attaques. Attaques contre lui avec avantage." },
  { id:'stunned',       name:'Étourdi',      desc:"Incapacité. Fail auto JS For/Dex. Attaques contre lui avec avantage." },
  { id:'unconscious',   name:'Inconscient',  desc:"Incapacité. Tombe à terre. Critiques auto. Fail auto JS For/Dex." },
];

// ── Niveaux d'épuisement (0 = aucun, 6 = mort) ──
const EXHAUSTION_EFFECTS = [
  'Aucun effet',
  'Désavantage aux jets de caractéristique',
  'Vitesse réduite de moitié',
  "Désavantage aux jets d'attaque et de sauvegarde",
  'Maximum de PV réduit de moitié',
  'Vitesse réduite à 0',
  '☠ Mort',
];

// Libellés des stats
const STAT_LABELS = {
  str: 'Force', dex: 'Dextérité', con: 'Constitution',
  int: 'Intelligence', wis: 'Sagesse', cha: 'Charisme',
};

// Bonus raciaux par défaut — Gnome des Roches
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
  armorBase: 11,    // Armure de cuir (CA de base)
  armorType: 'light', // light | medium | heavy | unarmored | mage-armor
  useShield: true,
  speed: 9,

  // ── Points de vie ─────────────────────────────────────────────
  hpRolls: [0, 8, 6, 6, 0, 0, 0, 0, 0, 0, 0],
  hpCurrent: 26,
  hpTemp: 0,

  // ── Sorts ─────────────────────────────────────────────────────
  slotsUsed:   { 1:0, 2:0, 3:0, 4:0, 5:0 },
  spellChecks: {},
  cdUsed:      0,
  customSpells: { 1:[], 2:[], 3:[], 4:[], 5:[] },

  // ── Concentration ─────────────────────────────────────────────
  concentration: null,   // null | nom du sort

  // ── État de combat ────────────────────────────────────────────
  conditions:  [],                       // ids de CONDITIONS actives
  deathSaves:  { success:0, failure:0 }, // 0–3 chacun
  inspiration: false,
  exhaustion:  0,                        // 0–6

  // ── Équipement ────────────────────────────────────────────────
  equipment: [
    "La Relique d'Azouth — focaliseur d'incantation & lien divin",
    "Masse d'armes",
    "Armure de cuir + Bouclier",
    "Outils de bricoleur",
    "Pack d'explorateur",
    "Lettre de guilde · 15 po",
  ],
  customEquipment: [],
  customAttacks:   [],

  // Harmonisation (max 3 objets magiques)
  attunedItems: [],

  // ── Monnaies ──────────────────────────────────────────────────
  currency: { pp:0, gp:15, ep:0, sp:0, cp:0 },

  // ── Langues & maîtrises d'outils ──────────────────────────────
  languages:  ['Commun', 'Gnome'],
  toolProfs:  ['Outils de bricoleur'],

  // ── Roleplay / personnalité ────────────────────────────────────
  notes: '',
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

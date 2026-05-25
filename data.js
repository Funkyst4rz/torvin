// ══════════════════════════════════════════════════════════════
// data.js — Données génériques D&D 5e
// Tables de règles réutilisables tous personnages confondus
// ══════════════════════════════════════════════════════════════

// Emplacements de sorts, prof bonus, CD par niveau de personnage (Clerc)
const LEVELS = {
  1:  { prof:2, slots:{1:2},                  cd:0, info:'Sorts de domaine niv.1 débloqués' },
  2:  { prof:2, slots:{1:3},                  cd:1, info:'Canalisation divine (1×/repos court)' },
  3:  { prof:2, slots:{1:4,2:2},              cd:1, info:'Sorts de domaine niv.2 débloqués' },
  4:  { prof:2, slots:{1:4,2:3},              cd:1, info:'Amélioration de caractéristiques' },
  5:  { prof:3, slots:{1:4,2:3,3:2},          cd:1, info:'Sorts de domaine niv.3 · Destruction des morts-vivants (FP ½)' },
  6:  { prof:3, slots:{1:4,2:3,3:3},          cd:2, info:'Briseur de sorts · Canalisation divine 2×/repos court' },
  7:  { prof:3, slots:{1:4,2:3,3:3,4:1},     cd:2, info:'Sorts de domaine niv.4 débloqués' },
  8:  { prof:3, slots:{1:4,2:3,3:3,4:2},     cd:2, info:'Incantation Puissante · Amélioration de caractéristiques · Destruction (FP 1)' },
  9:  { prof:4, slots:{1:4,2:3,3:3,4:3,5:1}, cd:2, info:'Sorts de domaine niv.5 débloqués' },
  10: { prof:4, slots:{1:4,2:3,3:3,4:3,5:2}, cd:2, info:'Intervention divine (jet ≤ niveau = succès · 1×/repos long)' },
};

// Liste complète des sorts de Clerc disponibles (pour le picker)
const CLERIC_SPELLS = {
  0: [
    // ── Sorts mineurs de Clerc ──
    { id:'guidance',    name:'Guidance',         tag:'utilitaire', conc:true,  desc:"Touchez une créature. Elle peut ajouter 1d4 à un jet de caractéristique pendant 1 minute." },
    { id:'light',       name:'Lumière',           tag:'utilitaire', conc:false, desc:"Un objet émet une lumière vive sur 6 m et faible sur 6 m de plus pendant 1 heure." },
    { id:'resistance',  name:'Résistance',        tag:'buff',       conc:true,  desc:"Touchez une créature. Elle peut ajouter 1d4 à un jet de sauvegarde pendant 1 minute." },
    { id:'sacredflame', name:'Flamme sacrée',     tag:'DD Dex',     conc:false, desc:"JS Dextérité ou 1d8 dégâts radiants. Ignore les couvertures." },
    { id:'sparedying',  name:'Stabilisation',     tag:'utilitaire', conc:false, desc:"Touchez une créature à 0 PV pour la stabiliser." },
    { id:'thaumaturgy', name:'Thaumaturgie',       tag:'utilitaire', conc:false, desc:"Signe mineur de puissance divine (voix, lumière, tremblement) pendant 1 minute." },
    // ── Sorts mineurs de Magicien (Arcane Initiate) ──
    { id:'acidSplash',   name:'Aspersion d\'acide', tag:'DD Dex',     conc:false, wizard:true, desc:"Bulle d'acide : une ou deux créatures adjacentes subissent 1d6 acide (JS Dex pour annuler)." },
    { id:'boomingBlade', name:'Lame retentissante', tag:'+atk/SCAG',  conc:false, wizard:true, desc:"Attaque de corps à corps : dégâts normaux + 1d8 tonnerre si la cible se déplace avant votre prochain tour. (SCAG)" },
    { id:'chillTouch',   name:'Contact glacial',    tag:'DD Con',     conc:false, wizard:true, desc:"1d8 nécrotique, la cible ne peut pas regagner de PV jusqu'à votre prochain tour. Les morts-vivants ont désavantage contre vous." },
    { id:'dancingLights',name:'Lumières dansantes', tag:'utilitaire', conc:true,  wizard:true, desc:"4 flammes flottantes dans un rayon de 18 m, mobiles à volonté. Lumière faible 3 m." },
    { id:'fireBolt',     name:'Trait de feu',       tag:'+atk/1d10',  conc:false, wizard:true, desc:"Attaque sort à distance : 1d10 feu, portée 36 m. Peut enflammer des objets." },
    { id:'friends',      name:'Amis',               tag:'utilitaire', conc:true,  wizard:true, desc:"Avantage aux jets de Charisme contre une créature non hostile pendant 1 minute. La cible réalise ensuite la manipulation." },
    { id:'greenFlameBlade',name:'Lame à flamme verte',tag:'+atk/SCAG',conc:false, wizard:true, desc:"Attaque de corps à corps : dégâts normaux + flammes qui sautent sur une créature adjacente pour mod Cha feu. (SCAG)" },
    { id:'lightningLure',name:'Lasso de foudre',    tag:'DD For',     conc:false, wizard:true, desc:"Attire une créature à portée 9 m vers vous de 3 m : 1d8 foudre si elle se retrouve dans un rayon de 1,5 m. (SCAG)" },
    { id:'mageHand',     name:'Main du mage',       tag:'utilitaire', conc:false, wizard:true, desc:"Crée une main spectrale qui manipule des objets légers dans 9 m pendant 1 minute." },
    { id:'mending',      name:'Réparation',         tag:'utilitaire', conc:false, wizard:true, desc:"Répare une cassure ou déchirure d'un objet (jusqu'à 30 cm). Incantation 1 minute." },
    { id:'message',      name:'Message',            tag:'utilitaire', conc:false, wizard:true, desc:"Chuchotez un message à une créature à 36 m : elle peut vous répondre en chuchotant." },
    { id:'minorIllusion',name:'Illusion mineure',   tag:'utilitaire', conc:false, wizard:true, desc:"Crée une image (1,5 m³) ou un son illusoire dans 9 m pendant 1 minute. Investigation DD 14 pour percer l'illusion." },
    { id:'poisonSpray',  name:'Vaporisation de poison',tag:'DD Con',  conc:false, wizard:true, desc:"Portée 3 m : 1d12 poison si le JS Constitution échoue." },
    { id:'prestidigitation',name:'Prestidigitation',tag:'utilitaire', conc:false, wizard:true, desc:"Effets magiques mineurs : allumer/éteindre, nettoyer, créer une sensation, une marque, un son ou une odeur." },
    { id:'rayFrost',     name:'Rayon de givre',     tag:'+atk/1d8',   conc:false, wizard:true, desc:"Attaque sort à distance : 1d8 froid, vitesse −3 m jusqu'à votre prochain tour." },
    { id:'shockingGrasp',name:'Choc électrique',    tag:'+atk/1d8',   conc:false, wizard:true, desc:"Attaque sort au contact : 1d8 foudre, la cible ne peut pas réagir jusqu'à votre prochain tour. Avantage si elle porte une armure métallique." },
    { id:'swordBurst',   name:'Rafale d\'épée',     tag:'DD Dex/zone',conc:false, wizard:true, desc:"Rafale de force : toutes les créatures dans 1,5 m subissent 1d6 force (JS Dex pour annuler). (SCAG)" },
    { id:'tollDead',     name:'Glas des trépassés', tag:'DD Sag',     conc:false, wizard:true, desc:"1d8 nécrotique (ou 1d12 si la cible est déjà blessée). Portée 18 m." },
    { id:'trueStrike',   name:'Frappe assurée',     tag:'utilitaire', conc:true,  wizard:true, desc:"Avantage au prochain jet d'attaque contre la cible avant la fin de votre prochain tour." },
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

// Liste complète des compétences, groupées par caractéristique
const SKILLS = [
  { key:'athletisme',     name:'Athlétisme',     stat:'str' },
  { key:'acrobaties',     name:'Acrobaties',     stat:'dex' },
  { key:'escamotage',     name:'Escamotage',     stat:'dex' },
  { key:'discretion',     name:'Discrétion',     stat:'dex' },
  { key:'arcanes',        name:'Arcanes',        stat:'int' },
  { key:'histoire',       name:'Histoire',       stat:'int' },
  { key:'investigation',  name:'Investigation',  stat:'int' },
  { key:'nature',         name:'Nature',         stat:'int' },
  { key:'religion',       name:'Religion',       stat:'int' },
  { key:'dressage',       name:'Dressage',       stat:'wis' },
  { key:'intuition',      name:'Intuition',      stat:'wis' },
  { key:'medecine',       name:'Médecine',       stat:'wis' },
  { key:'perception',     name:'Perception',     stat:'wis' },
  { key:'survie',         name:'Survie',         stat:'wis' },
  { key:'tromperie',      name:'Tromperie',      stat:'cha' },
  { key:'intimidation',   name:'Intimidation',   stat:'cha' },
  { key:'representation', name:'Représentation', stat:'cha' },
  { key:'persuasion',     name:'Persuasion',     stat:'cha' },
];

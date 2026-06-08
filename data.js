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
    { id:'guidance',    name:'Guidance',              tag:'utilitaire', conc:true,  cast:'1 action',  range:'Contact',      dur:'1 minute',    desc:"Touchez une créature. Elle peut ajouter 1d4 à un jet de caractéristique pendant 1 minute." },
    { id:'light',       name:'Lumière',               tag:'utilitaire', conc:false, cast:'1 action',  range:'Contact',      dur:'1 heure',     desc:"Un objet émet une lumière vive sur 6 m et faible sur 6 m de plus pendant 1 heure." },
    { id:'resistance',  name:'Résistance',            tag:'buff',       conc:true,  cast:'1 action',  range:'Contact',      dur:'1 minute',    desc:"Touchez une créature. Elle peut ajouter 1d4 à un jet de sauvegarde pendant 1 minute." },
    { id:'sacredflame', name:'Flamme sacrée',         tag:'DD Dex',     conc:false, cast:'1 action',  range:'18 m',         dur:'Instantanée', desc:"JS Dextérité ou 1d8 dégâts radiants. Ignore les couvertures." },
    { id:'sparedying',  name:'Stabilisation',         tag:'utilitaire', conc:false, cast:'1 action',  range:'Contact',      dur:'Instantanée', desc:"Touchez une créature à 0 PV pour la stabiliser." },
    { id:'thaumaturgy', name:'Thaumaturgie',           tag:'utilitaire', conc:false, cast:'1 action',  range:'9 m',          dur:'1 minute',    desc:"Signe mineur de puissance divine (voix, lumière, tremblement) pendant 1 minute." },
    // ── Sorts mineurs de Magicien (Arcane Initiate) ──
    { id:'acidSplash',    name:"Aspersion d'acide",   tag:'DD Dex',     conc:false, cast:'1 action',  range:'18 m',         dur:'Instantanée', wizard:true, desc:"Bulle d'acide : une ou deux créatures adjacentes subissent 1d6 acide (JS Dex pour annuler)." },
    { id:'boomingBlade',  name:'Lame retentissante',  tag:'+atk/SCAG',  conc:false, cast:'1 action',  range:'Personnelle',  dur:'1 tour',      wizard:true, desc:"Attaque de corps à corps : dégâts normaux + 1d8 tonnerre si la cible se déplace avant votre prochain tour. (SCAG)" },
    { id:'chillTouch',    name:'Contact glacial',     tag:'DD Con',     conc:false, cast:'1 action',  range:'36 m',         dur:'1 tour',      wizard:true, desc:"1d8 nécrotique, la cible ne peut pas regagner de PV jusqu'à votre prochain tour. Les morts-vivants ont désavantage contre vous." },
    { id:'dancingLights', name:'Lumières dansantes',  tag:'utilitaire', conc:true,  cast:'1 action',  range:'36 m',         dur:'1 minute',    wizard:true, desc:"4 flammes flottantes dans un rayon de 18 m, mobiles à volonté. Lumière faible 3 m." },
    { id:'fireBolt',      name:'Trait de feu',        tag:'+atk/1d10',  conc:false, cast:'1 action',  range:'36 m',         dur:'Instantanée', wizard:true, desc:"Attaque sort à distance : 1d10 feu, portée 36 m. Peut enflammer des objets." },
    { id:'friends',       name:'Amis',                tag:'utilitaire', conc:true,  cast:'1 action',  range:'Personnelle',  dur:'1 minute',    wizard:true, desc:"Avantage aux jets de Charisme contre une créature non hostile pendant 1 minute. La cible réalise ensuite la manipulation." },
    { id:'greenFlameBlade',name:'Lame à flamme verte',tag:'+atk/SCAG',  conc:false, cast:'1 action',  range:'Personnelle',  dur:'Instantanée', wizard:true, desc:"Attaque de corps à corps : dégâts normaux + flammes qui sautent sur une créature adjacente pour mod Cha feu. (SCAG)" },
    { id:'lightningLure', name:'Lasso de foudre',     tag:'DD For',     conc:false, cast:'1 action',  range:'4,5 m',        dur:'Instantanée', wizard:true, desc:"Attire une créature à portée 4,5 m vers vous de 3 m : 1d8 foudre si elle se retrouve dans un rayon de 1,5 m. (SCAG)" },
    { id:'mageHand',      name:'Main du mage',        tag:'utilitaire', conc:false, cast:'1 action',  range:'9 m',          dur:'1 minute',    wizard:true, desc:"Crée une main spectrale qui manipule des objets légers dans 9 m pendant 1 minute." },
    { id:'mending',       name:'Réparation',          tag:'utilitaire', conc:false, cast:'1 minute',  range:'Contact',      dur:'Instantanée', wizard:true, desc:"Répare une cassure ou déchirure d'un objet (jusqu'à 30 cm). Incantation 1 minute." },
    { id:'message',       name:'Message (mineur)',    tag:'utilitaire', conc:false, cast:'1 action',  range:'36 m',         dur:'1 tour',      wizard:true, desc:"Chuchotez un message à une créature à 36 m : elle peut vous répondre en chuchotant." },
    { id:'minorIllusion', name:'Illusion mineure',    tag:'utilitaire', conc:false, cast:'1 action',  range:'9 m',          dur:'1 minute',    wizard:true, desc:"Crée une image (1,5 m³) ou un son illusoire dans 9 m pendant 1 minute. Investigation DD 14 pour percer l'illusion." },
    { id:'poisonSpray',   name:'Vaporisation de poison',tag:'DD Con',   conc:false, cast:'1 action',  range:'3 m',          dur:'Instantanée', wizard:true, desc:"Portée 3 m : 1d12 poison si le JS Constitution échoue." },
    { id:'prestidigitation',name:'Prestidigitation',  tag:'utilitaire', conc:false, cast:'1 action',  range:'3 m',          dur:'1 heure',     wizard:true, desc:"Effets magiques mineurs : allumer/éteindre, nettoyer, créer une sensation, une marque, un son ou une odeur." },
    { id:'rayFrost',      name:'Rayon de givre',      tag:'+atk/1d8',   conc:false, cast:'1 action',  range:'18 m',         dur:'Instantanée', wizard:true, desc:"Attaque sort à distance : 1d8 froid, vitesse −3 m jusqu'à votre prochain tour." },
    { id:'shockingGrasp', name:'Choc électrique',     tag:'+atk/1d8',   conc:false, cast:'1 action',  range:'Contact',      dur:'Instantanée', wizard:true, desc:"Attaque sort au contact : 1d8 foudre, la cible ne peut pas réagir jusqu'à votre prochain tour. Avantage si elle porte une armure métallique." },
    { id:'swordBurst',    name:"Rafale d'épée",       tag:'DD Dex/zone',conc:false, cast:'1 action',  range:'Personnelle',  dur:'Instantanée', wizard:true, desc:"Rafale de force : toutes les créatures dans 1,5 m subissent 1d6 force (JS Dex pour annuler). (SCAG)" },
    { id:'tollDead',      name:'Glas des trépassés',  tag:'DD Sag',     conc:false, cast:'1 action',  range:'18 m',         dur:'Instantanée', wizard:true, desc:"1d8 nécrotique (ou 1d12 si la cible est déjà blessée). Portée 18 m." },
    { id:'trueStrike',    name:'Frappe assurée',      tag:'utilitaire', conc:true,  cast:'1 action',  range:'9 m',          dur:'1 tour',      wizard:true, desc:"Avantage au prochain jet d'attaque contre la cible avant la fin de votre prochain tour." },
  ],
  1: [
    { id:'bane',        name:'Fléau',                 tag:'DD Cha',     conc:true,  cast:'1 action',  range:'9 m',          dur:'1 minute',    desc:"3 créatures subissent −1d4 à leurs jets d'attaque et de sauvegarde pendant 1 minute.", upcast:"+1 créature par niveau d'emplacement supérieur au niv.1." },
    { id:'bless',       name:'Bénédiction',           tag:'buff',       conc:true,  cast:'1 action',  range:'9 m',          dur:'1 minute',    desc:"3 créatures ajoutent 1d4 à leurs jets d'attaque et de sauvegarde pendant 1 minute.", upcast:"+1 créature par niveau d'emplacement supérieur au niv.1." },
    { id:'command',     name:'Commandement',          tag:'contrôle',   conc:false, cast:'1 action',  range:'18 m',         dur:'1 tour',      desc:"Une créature obéit à un commandement d'un mot. JS Sagesse pour résister.", upcast:"+1 créature par niveau d'emplacement supérieur au niv.1." },
    { id:'curewounds',  name:'Soin des blessures',    tag:'soin',       conc:false, cast:'1 action',  range:'Contact',      dur:'Instantanée', desc:"Au toucher : la cible récupère 1d8 + mod Sag PV.", upcast:"+1d8 PV par niveau d'emplacement supérieur au niv.1." },
    { id:'guidingbolt', name:'Trait de lumière',      tag:'+atk/4d6',   conc:false, cast:'1 action',  range:'36 m',         dur:'1 tour',      desc:"Attaque sort à distance : 4d6 dégâts radiants. Prochaine attaque contre la cible avec avantage.", upcast:"+1d6 dégâts par niveau d'emplacement supérieur au niv.1." },
    { id:'healingword', name:'Mot de guérison',       tag:'soin bon.',  conc:false, cast:'1 bonus',   range:'18 m',         dur:'Instantanée', desc:"Action bonus : une créature récupère 1d4 + mod Sag PV.", upcast:"+1d4 PV par niveau d'emplacement supérieur au niv.1." },
    { id:'infwounds',   name:'Infliger des blessures',tag:'+atk/3d10',  conc:false, cast:'1 action',  range:'Contact',      dur:'Instantanée', desc:"Attaque sort au contact : 3d10 dégâts nécrotiques.", upcast:"+1d10 dégâts par niveau d'emplacement supérieur au niv.1." },
    { id:'protevil',    name:'Protection contre le mal',tag:'défense',  conc:true,  cast:'1 action',  range:'Contact',      dur:'10 minutes',  desc:"Protection contre les aberrations, célestes, élémentaires, fées, fiélons et morts-vivants." },
    { id:'sanctuary',   name:'Sanctuaire',            tag:'défense',    conc:false, cast:'1 bonus',   range:'9 m',          dur:'1 minute',    desc:"Les attaquants visant la cible doivent réussir un JS Sagesse ou choisir une autre cible." },
    { id:'shieldfaith', name:'Bouclier de la foi',    tag:'+2 CA',      conc:true,  cast:'1 bonus',   range:'18 m',         dur:'10 minutes',  desc:"Une créature gagne +2 à la CA pendant 10 minutes." },
    { id:'createwater',   name:"Création d'eau",              tag:'utilitaire', conc:false, cast:'1 action',  range:'9 m',          dur:'Instantanée', desc:"Crée jusqu'à 40 litres d'eau potable ou purifie de l'eau empoisonnée." },
    { id:'detectevil',    name:'Détection du mal et du bien', tag:'divination', conc:true,  cast:'1 action',  range:'Personnelle',  dur:'10 minutes',  desc:"Détectez les aberrations, célestes, élémentaires, fées, fiélons et morts-vivants dans 9 m. Sentez les lieux/objets consacrés ou profanés." },
    { id:'detectmagic',   name:'Détection de la magie',       tag:'rituel',     conc:true,  cast:'1 action',  range:'Personnelle',  dur:'10 minutes',  desc:"Détectez la magie dans 9 m. Vous percevez son aura et son école. Durée 10 minutes." },
    { id:'detectpoison',  name:'Détect. poison et maladies',  tag:'rituel',     conc:true,  cast:'1 action',  range:'Personnelle',  dur:'10 minutes',  desc:"Détectez les poisons, créatures venimeuses et maladies dans 9 m pendant 10 minutes." },
    { id:'purifyfood',    name:"Purification nourriture/eau", tag:'rituel',     conc:false, cast:'1 action',  range:'3 m',          dur:'Instantanée', desc:"Purifiez toute nourriture et eau non magique dans une sphère de 1,5 m de rayon, supprimant poisons et maladies." },
  ],
  2: [
    { id:'aid',           name:'Aide',                      tag:'+5 PV',      conc:false, cast:'1 action',  range:'9 m',          dur:'8 heures',    desc:"3 alliés gagnent +5 PV max et actuels pendant 8 heures.", upcast:"+5 PV supplémentaires par niveau d'emplacement supérieur au niv.2." },
    { id:'blinddeaf',     name:'Cécité / Surdité',          tag:'DD Con',     conc:false, cast:'1 action',  range:'9 m',          dur:'1 minute',    desc:"JS Constitution ou aveugle ou sourd pendant 1 minute.", upcast:"+1 créature par niveau d'emplacement supérieur au niv.2." },
    { id:'holdperson',    name:'Immobilisation de personne',tag:'DD Sag',     conc:true,  cast:'1 action',  range:'18 m',         dur:'1 minute',    desc:"JS Sagesse ou paralysée. Renouvellement possible chaque round.", upcast:"+1 créature par niveau d'emplacement supérieur au niv.2." },
    { id:'lessrestore',   name:'Restauration partielle',    tag:'utilitaire', conc:false, cast:'1 action',  range:'Contact',      dur:'Instantanée', desc:"Supprime une maladie, un poison actif, une paralysie ou une cécité." },
    { id:'prayerheal',    name:'Prière de guérison',        tag:'soin',       conc:false, cast:'10 minutes',range:'9 m',          dur:'Instantanée', desc:"6 créatures récupèrent 2d8 + mod Sag PV. Incantation de 10 minutes.", upcast:"+1d8 PV par niveau d'emplacement supérieur au niv.2." },
    { id:'silence',       name:'Silence',                   tag:'zone',       conc:true,  cast:'1 action',  range:'36 m',         dur:'10 minutes',  desc:"Sphère 6 m : aucun son, sorts à composante verbale impossibles à l'intérieur." },
    { id:'spweapon',      name:'Arme spirituelle',          tag:'bon./1d8',   conc:false, cast:'1 bonus',   range:'18 m',         dur:'1 minute',    desc:"Action bonus : arme spectrale qui attaque à chaque tour. Bonus prof + mod Sag.", upcast:"+1d8 dégâts par tranche de 2 niveaux au-dessus du niv.2 (slot niv.4 = 2d8, niv.6 = 3d8…)." },
    { id:'wardingbond',   name:'Lien de protection',        tag:'défense',    conc:false, cast:'1 action',  range:'Contact',      dur:'1 heure',     desc:"+1 CA et JS, résistance à tous dégâts. Vous partagez les dégâts reçus." },
    { id:'augury',        name:'Augure',                    tag:'rituel',     conc:false, cast:'1 minute',  range:'Personnelle',  dur:'Instantanée', desc:"Obtenez un présage (bien/mal/les deux/aucun) sur une action dans les 30 minutes." },
    { id:'calmeemotions', name:'Apaisement des émotions',   tag:'contrôle',   conc:true,  cast:'1 action',  range:'18 m',         dur:'1 minute',    desc:"JS Charisme ou les créatures dans 4,5 m sont neutralisées ou immunisées à la peur/charme pendant 1 minute." },
    { id:'contflame',     name:'Flamme continue',           tag:'utilitaire', conc:false, cast:'1 action',  range:'Contact',      dur:'Permanent',   desc:"Flamme permanente (non soufflable par le vent) sur un objet. Produit autant de lumière qu'une torche." },
    { id:'enhanceability',name:'Amélioration de caract.',   tag:'buff',       conc:true,  cast:'1 action',  range:'Contact',      dur:'1 heure',     desc:"Accordez l'un des effets suivants : Grâce du Taureau (+1d4 jets For, avantage For), Grâce du Chat (avantage Dex, pas de dégâts de chute < 6 m), Résistance de l'Ours (+2d6 PV temporaires), Bravoure du Renard (avantage Cha), Sérénité du Hibou (avantage Sag ou Int), Ardeur de l'Aigle (avantage Dex ou Str).", upcast:"+1 cible par niveau d'emplacement supérieur au niv.2." },
    { id:'findtraps',     name:'Détection des pièges',      tag:'divination', conc:false, cast:'1 action',  range:'36 m',         dur:'Instantanée', desc:"Détectez la présence de pièges (mais pas leur emplacement précis) dans votre champ de vision." },
    { id:'gentlerepose',  name:'Repos éternel',             tag:'rituel',     conc:false, cast:'1 action',  range:'Contact',      dur:'10 jours',    desc:"Préservez un cadavre de la décomposition et empêchez l'animation en mort-vivant pendant 10 jours." },
    { id:'locateobject',  name:"Localisation d'objet",      tag:'divination', conc:true,  cast:'1 action',  range:'Personnelle',  dur:'10 minutes',  desc:"Sentez la direction d'un objet familier ou d'un type d'objet dans 300 m pendant 10 minutes." },
    { id:'zoneoftruth',   name:'Zone de vérité',            tag:'utilitaire', conc:false, cast:'1 action',  range:'18 m',         dur:'10 minutes',  desc:"Sphère 4,5 m : JS Charisme ou impossible de mentir sciemment pendant 10 minutes." },
  ],
  3: [
    { id:'animdead',      name:'Animation des morts',       tag:'nécro',      conc:false, cast:'1 minute',  range:'3 m',          dur:'Instantanée', desc:"Animez un squelette ou zombie obéissant pendant 24h. Renouvelable.", upcast:"+2 morts-vivants supplémentaires par niveau d'emplacement supérieur au niv.3." },
    { id:'beaconhope',    name:"Balise d'espoir",           tag:'buff',       conc:true,  cast:'1 action',  range:'9 m',          dur:'1 minute',    desc:"Alliés dans 9 m : avantage aux JS Sag et mort, PV max lors des soins." },
    { id:'bestowcurse',   name:'Malédiction',               tag:'debuff',     conc:true,  cast:'1 action',  range:'Contact',      dur:'1 minute',    desc:"Désavantage sur jets d'une caractéristique, −1d8 aux dégâts ou perte de tour.", upcast:"Niv.4 : 10 min sans concentration. Niv.5 : 8 heures. Niv.7 : 24 heures. Niv.9 : jusqu'à dissipation." },
    { id:'daylight',      name:'Lumière du jour',           tag:'utilitaire', conc:false, cast:'1 action',  range:'18 m',         dur:'1 heure',     desc:"Lumière vive 18 m pendant 1 heure. Dissipe ténèbres magiques ≤ 2." },
    { id:'massHW',        name:'Soins de groupe',           tag:'soin bon.',  conc:false, cast:'1 bonus',   range:'18 m',         dur:'Instantanée', desc:"Action bonus : jusqu'à 6 créatures récupèrent 1d4 + mod Sag PV.", upcast:"+1d4 PV par niveau d'emplacement supérieur au niv.3." },
    { id:'protEnergy',    name:"Protection contre l'énergie",tag:'résistance',conc:true,  cast:'1 action',  range:'Contact',      dur:'1 heure',     desc:"Résistance à un type de dégâts choisi pendant 1 heure." },
    { id:'revivify',      name:'Rappel à la vie',           tag:'utilitaire', conc:false, cast:'1 action',  range:'Contact',      dur:'Instantanée', desc:"Ramenez à 1 PV une créature morte il y a moins d'1 minute. (300 po)" },
    { id:'spiritguard',   name:'Esprits gardiens',          tag:'zone',       conc:true,  cast:'1 action',  range:'Personnelle',  dur:'10 minutes',  desc:"Spectres 4,5 m infligent 3d8 dégâts radiants ou nécrotiques aux ennemis.", upcast:"+1d8 dégâts par niveau d'emplacement supérieur au niv.3." },
    { id:'removecurse',   name:'Suppression de malédiction',tag:'utilitaire', conc:false, cast:'1 action',  range:'Contact',      dur:'Instantanée', desc:"Supprime toutes les malédictions ou désactive un objet maudit au toucher." },
    { id:'tongues',       name:'Langues',                   tag:'utilitaire', conc:false, cast:'1 action',  range:'Contact',      dur:'1 heure',     desc:"Comprend toutes les langues parlées et se fait comprendre pendant 1 heure." },
    { id:'sending',       name:'Message (sort)',            tag:'divination', conc:false, cast:'1 action',  range:'Illimitée',    dur:'1 tour',      desc:"Envoyez 25 mots à n'importe quelle créature que vous connaissez." },
    { id:'clairvoyance',  name:'Clairvoyance',              tag:'divination', conc:true,  cast:'10 minutes',range:'1,6 km',       dur:'10 minutes',  desc:"Créez un œil ou une oreille invisible dans un lieu connu à 1,6 km. Perception via ce sens pendant 10 minutes." },
    { id:'createfoodwater',name:'Création de nourriture/eau',tag:'utilitaire',conc:false, cast:'1 action',  range:'9 m',          dur:'Instantanée', desc:"Créez 25 kg de nourriture et 100 litres d'eau potable — suffit pour 15 humanoïdes et 5 montures 24h." },
    { id:'dispelmagic',   name:'Dissipation de la magie',   tag:'utilitaire', conc:false, cast:'1 action',  range:'36 m',         dur:'Instantanée', desc:"Mettez fin à tous les sorts sur une cible (niv. ≤ 3 auto, niv. supérieur : JS Arcanes).", upcast:"Dissipe automatiquement les sorts de niveau égal au slot utilisé." },
    { id:'feigndeath',    name:'Feindre la mort',           tag:'rituel',     conc:false, cast:'1 action',  range:'Contact',      dur:'1 heure',     desc:"Au toucher : la cible entre dans un état de mort apparente pendant 1 heure (ou jusqu'à réveil). Résistance à tous dégâts sauf psychiques." },
    { id:'glyphwarding',  name:'Glyphe de protection',      tag:'piège',      conc:false, cast:'1 heure',   range:'Contact',      dur:'Jusqu\'au déclenchement', desc:"Inscrivez un glyphe qui déclenche un sort ou une explosion d'énergie (5d8) quand une condition est remplie." },
    { id:'magiccircle',   name:'Cercle magique',            tag:'défense',    conc:false, cast:'1 minute',  range:'3 m',          dur:'1 heure',     desc:"Cercle 3 m : bloque les aberrations, célestes, élémentaires, fées ou fiélons (votre choix) pendant 1h.", upcast:"+1 heure par niveau d'emplacement supérieur au niv.3." },
    { id:'meldstone',     name:'Fusion avec la pierre',     tag:'rituel',     conc:false, cast:'1 action',  range:'Contact',      dur:'8 heures',    desc:"Fusionnez avec une pierre ou roche adjacente et devenez indétectable. Durée 8 heures." },
    { id:'speakdead',     name:'Parler aux morts',          tag:'divination', conc:false, cast:'1 action',  range:'3 m',          dur:'10 minutes',  desc:"Un cadavre répond à 5 questions. Il répond selon ses connaissances et sa personnalité passée." },
    { id:'waterwalk',     name:"Marcher sur l'eau",         tag:'rituel',     conc:false, cast:'1 action',  range:'Contact',      dur:'1 heure',     desc:"Jusqu'à 10 créatures se déplacent sur les liquides pendant 1 heure." },
  ],
  4: [
    { id:'banishment',    name:'Bannissement',              tag:'contrôle',   conc:true,  cast:'1 action',  range:'18 m',         dur:'1 minute',    desc:"JS Charisme ou banni pendant 1 min. Si extra-planaire, permanent après 1 minute.", upcast:"+1 créature par niveau d'emplacement supérieur au niv.4." },
    { id:'deathward',     name:'Protection contre la mort', tag:'défense',    conc:false, cast:'1 action',  range:'Contact',      dur:'8 heures',    desc:"1ère fois à 0 PV : reste à 1 PV. Dure 8 heures." },
    { id:'divination',    name:'Divination',                tag:'rituel',     conc:false, cast:'1 action',  range:'Personnelle',  dur:'Instantanée', desc:"Réponse véridique de votre divinité sur un événement dans les 7 prochains jours." },
    { id:'freedommvt',    name:'Liberté de mouvement',      tag:'buff',       conc:false, cast:'1 action',  range:'Contact',      dur:'1 heure',     desc:"Ignore terrain difficile, enchevêtrements et réductions de vitesse magiques pendant 1h." },
    { id:'guardianfaith', name:'Gardien de la foi',         tag:'zone',       conc:false, cast:'1 action',  range:'9 m',          dur:'8 heures',    desc:"Gardien spectral : 20 dégâts radiants aux intrus entrant dans 3 m (60 PV total)." },
    { id:'controlwater',  name:"Contrôle de l'eau",         tag:'contrôle',   conc:true,  cast:'1 action',  range:'90 m',         dur:'10 minutes',  desc:"Inondation, tourbillon (3d8), séparation des eaux ou redirection du courant sur 30 m³ d'eau." },
    { id:'locatecreature',name:'Localisation de créature',  tag:'divination', conc:true,  cast:'1 action',  range:'Personnelle',  dur:'1 heure',     desc:"Sentez la direction d'une créature familière ou d'une espèce dans 300 m pendant 1 heure." },
    { id:'stoneshape',    name:'Façonnage de la pierre',    tag:'utilitaire', conc:false, cast:'1 action',  range:'Contact',      dur:'Instantanée', desc:"Façonnez une pierre touchée (max 1,5 m³) selon votre volonté." },
  ],
  5: [
    { id:'commune',       name:'Communion',                 tag:'rituel',     conc:false, cast:'1 minute',  range:'Personnelle',  dur:'1 minute',    desc:"Posez 3 questions oui/non à votre divinité. Une fois par jour." },
    { id:'dispevil',      name:'Dissipation du mal',        tag:'défense',    conc:true,  cast:'1 action',  range:'Personnelle',  dur:'1 minute',    desc:"Avantage aux JS contre aberrations, célestes, fées, fiélons, morts-vivants." },
    { id:'flamestrike',   name:'Colonne de flamme',         tag:'+atk',       conc:false, cast:'1 action',  range:'18 m',         dur:'Instantanée', desc:"Cylindre 3 m × 9 m : 4d6 feu + 4d6 radiants. JS Dex pour moitié.", upcast:"+1d6 feu + 1d6 radiant par niveau d'emplacement supérieur au niv.5." },
    { id:'greaterrest',   name:'Restauration supérieure',   tag:'utilitaire', conc:false, cast:'1 action',  range:'Contact',      dur:'Instantanée', desc:"Supprime épuisement, charme, pétrification, malédiction ou réduction de caract." },
    { id:'masscure',      name:'Soins de groupe supérieurs',tag:'soin',       conc:false, cast:'1 action',  range:'18 m',          dur:'Instantanée', desc:"Jusqu'à 6 créatures dans 9 m récupèrent 3d8 + mod Sag PV.", upcast:"+1d8 PV par niveau d'emplacement supérieur au niv.5." },
    { id:'raisedead',     name:'Rappel des morts',          tag:'utilitaire', conc:false, cast:'1 heure',   range:'Contact',      dur:'Instantanée', desc:"Ramenez une créature morte ≤ 10 jours à 1 PV. (500 po)" },
    { id:'scrying',       name:'Scrutation',                tag:'divination', conc:true,  cast:'10 minutes',range:'Personnelle',  dur:'10 minutes',  desc:"Observez une créature spécifique à distance. JS Sagesse (modifié par familiarité)." },
    { id:'legendlore',    name:'Légende',                   tag:'divination', conc:false, cast:'10 minutes',range:'Personnelle',  dur:'Instantanée', desc:"Bribes d'histoire sur un lieu, objet ou personnage légendaire." },
    { id:'contagion',     name:'Contagion',                 tag:'debuff',     conc:false, cast:'1 action',  range:'Contact',      dur:'7 jours',     desc:"Au toucher (jet d'attaque) : infligez une maladie (Fièvre aveuglante, Pourriture, Fièvre putride, Convulsions, Esprit enfiévré ou Pourriture ventre)." },
    { id:'geas',          name:'Geis',                      tag:'contrôle',   conc:false, cast:'1 minute',  range:'18 m',         dur:'30 jours',    desc:"JS Sagesse ou la cible obéit à une instruction monosyllabique pendant 30 jours (7d10 psychiques si désobéit).", upcast:"Niv.7 : durée 1 an. Niv.9 : permanent." },
    { id:'hallow',        name:'Sanctification',            tag:'zone',       conc:false, cast:'24 heures', range:'Contact',      dur:'Permanent',   desc:"Consacrez un lieu (18 m de rayon). Bloquez les créatures d'un type, accordez résistance, immunité à peur/charme, etc. (1 000 po, incantation 24h)." },
    { id:'insectplague',  name:"Nuée d'insectes",           tag:'zone/DD Con',conc:true,  cast:'1 action',  range:'90 m',         dur:'10 minutes',  desc:"Sphère 6 m d'insectes voraces : 4d10 piqûres (JS Con pour moitié). Terrain difficile, vue bloquée.", upcast:"+1d10 dégâts par niveau d'emplacement supérieur au niv.5." },
    { id:'planarbinding', name:'Liens planaires',           tag:'contrôle',   conc:false, cast:'1 heure',   range:'18 m',         dur:'24 heures',   desc:"Liez une aberration, céleste, élémentaire ou fiélon (JS Cha ou vous sert 24h).", upcast:"Durée augmente : niv.6 = 10 jours, niv.7 = 30 jours, niv.8 = 180 jours, niv.9 = 1 an." },
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

// Emplacements d'équipement (ordre = position dans la grille 5×2)
const EQUIPMENT_SLOTS = [
  { key:'arme',     label:'Arme',      icon:'⚔',  hasArmor:false, hasWeapon:true },
  { key:'armure',   label:'Armure',    icon:'🛡',  hasArmor:true  },
  { key:'bouclier', label:'Bouclier',  icon:'🔰',  hasArmor:false },
  { key:'casque',   label:'Casque',    icon:'⛑',  hasArmor:false },
  { key:'cape',     label:'Cape',      icon:'🧣',  hasArmor:false },
  { key:'amulette', label:'Amulette',  icon:'📿',  hasArmor:false },
  { key:'anneau1',  label:'Anneau 1',  icon:'💍',  hasArmor:false },
  { key:'anneau2',  label:'Anneau 2',  icon:'💍',  hasArmor:false },
  { key:'gants',    label:'Gants',     icon:'🥊',  hasArmor:false },
  { key:'bottes',   label:'Bottes',    icon:'👢',  hasArmor:false },
];

// Types de bonus structurés sur les items
const BONUS_TYPES = [
  { key:'ca',        label:'CA'            },
  { key:'wis',       label:'Sagesse'       },
  { key:'str',       label:'Force'         },
  { key:'dex',       label:'Dextérité'     },
  { key:'con',       label:'Constitution'  },
  { key:'int',       label:'Intelligence'  },
  { key:'cha',       label:'Charisme'      },
  { key:'hp_max',    label:'PV max'        },
  { key:'speed',     label:'Vitesse (m)'   },
  { key:'initiative',label:'Initiative'    },
  { key:'attack',    label:'Attaque'       },
  { key:'spell_dc',  label:'DD de sort'    },
];

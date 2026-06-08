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


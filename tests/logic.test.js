/* =====================================================================
   Tests automatiques — logique métier du prototype de bénévolat
   Exécute app.js dans un bac à sable Node (globals navigateur simulés),
   puis vérifie la mécanique premier-arrivé/premier-servi, la liste
   d'attente, la promotion automatique, le calcul des heures (2 modes),
   le délai de désistement et la règle « 1 activité / événement ».
   Aucune dépendance externe (module `vm` natif de Node).
   ===================================================================== */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

/* ---- Mini framework d'assertions ---- */
let passed = 0, failed = 0;
const fails = [];
function check(name, cond){
  if(cond){ passed++; console.log('  \x1b[32m✓\x1b[0m ' + name); }
  else { failed++; fails.push(name); console.log('  \x1b[31m✗ ' + name + '\x1b[0m'); }
}
function eq(name, a, b){ check(name + `  (attendu ${JSON.stringify(b)}, obtenu ${JSON.stringify(a)})`, a === b); }
function section(s){ console.log('\n\x1b[1m' + s + '\x1b[0m'); }

/* ---- Stubs de l'environnement navigateur ---- */
function makeSandbox(){
  const store = {};
  const localStorage = {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k,v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; }
  };
  const el = new Proxy({}, {
    get(_,p){
      if(p==='classList') return { toggle(){}, add(){}, remove(){}, contains(){return false;} };
      if(p==='style') return {};
      if(p==='value') return '';
      if(p==='dataset') return {};
      if(p==='textContent'||p==='innerHTML'||p==='outerHTML') return '';
      if(typeof p==='string') return (()=>{});
      return undefined;
    },
    set(){ return true; }
  });
  const document = {
    getElementById: () => el,
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: () => el,
    documentElement: {},
    addEventListener: () => {}
  };
  const windowStub = { addEventListener: () => {}, scrollTo: () => {} };
  const location = { origin:'file://', pathname:'/proto.html', hash:'', search:'' };
  const sandbox = {
    localStorage, document, window: windowStub, location,
    navigator: { language: 'fr-CA' },
    setTimeout: () => {}, clearTimeout: () => {},
    btoa: s => Buffer.from(s,'binary').toString('base64'),
    atob: s => Buffer.from(s,'base64').toString('binary'),
    Buffer, encodeURIComponent, decodeURIComponent, escape, unescape,
    console, Math, Date, JSON, parseInt, parseFloat, isNaN, String, Number, Object, Array
  };
  sandbox.globalThis = sandbox;
  return sandbox;
}

/* ---- Chargement de app.js dans le bac à sable ---- */
const appPath = path.join(__dirname, '..', 'app.js');
const code = fs.readFileSync(appPath, 'utf8');
const sb = makeSandbox();
vm.createContext(sb);
vm.runInContext(code, sb, { filename: 'app.js' });

/* DB et SESSION sont des liaisons `let` internes à app.js : on y accède
   en évaluant des expressions DANS le contexte (pas via sb.DB). */
const run = expr => vm.runInContext(expr, sb);
const getDB = () => run('DB');
function reset(){ run('DB = seedDB(); saveDB(); SESSION = null;'); }
function loginAs(userId){ run(`SESSION = {userId:${JSON.stringify(userId)}};`); }
function setSetting(k,v){ run(`DB.settings[${JSON.stringify(k)}] = ${JSON.stringify(v)};`); }
function regCount(eid,nid){ return getDB().regs.filter(r=>r.eid===eid && r.nid===nid).length; }
function assignedIds(eid,nid,qty){ return sb.assignedRegs(eid,nid,qty).map(r=>r.pid); }

console.log('\n=== Tests logique — Bénévolat FC ===');

/* --------------------------------------------------------------- */
section('1. Seed / intégrité des données de démonstration');
reset();
let DB = getDB();
check('DB créée avec settings', !!DB.settings);
eq('objectif d\'heures par défaut', DB.settings.hoursGoal, 15);
eq('mode de crédit par défaut', DB.settings.creditMode, 'approval');
eq('délai de désistement (h)', DB.settings.withdrawHours, 48);
check('9 utilisateurs (1 coach + 6 joueurs actifs + 2 invités)', DB.users.length === 9);
check('exactement 1 coach', DB.users.filter(u=>u.role==='coach').length === 1);
check('6 joueurs actifs', DB.users.filter(u=>u.role==='player' && u.status!=='invited').length === 6);
check('2 joueurs invités (en attente d\'activation)', DB.users.filter(u=>u.status==='invited').length === 2);
check('5 types d\'activités', DB.activities.length === 5);
check('4 événements', DB.events.length === 4);
check('tous les joueurs ACTIFS ont une catégorie', DB.users.filter(u=>u.role==='player' && u.status!=='invited').every(u=>['benjamin','cadet','juvenile'].includes(u.category)));
// aucune inscription du seed ne viole la règle de catégorie
let catSeedOk = true;
DB.regs.forEach(r=>{ const u=DB.users.find(x=>x.id===r.pid); const e=DB.events.find(x=>x.id===r.eid); if(u&&e&&e.category&&u.category===e.category) catSeedOk=false; });
check('seed cohérent avec la règle de catégorie', catSeedOk);
const dupe = {}; let ruleOk = true;
DB.regs.forEach(r=>{ const k=r.pid+'|'+r.eid; if(dupe[k]) ruleOk=false; dupe[k]=true; });
check('seed respecte 1 activité/joueur/événement', ruleOk);

/* --------------------------------------------------------------- */
section('2. FIFO — ordre premier arrivé, premier servi');
reset();
const assigned = assignedIds('e_p2','n3',3);
eq('3 places attribuées', assigned.length, 3);
eq('1re place = Sam (ts le plus ancien)', assigned[0], 'u_sam');
eq('2e place = Jordan', assigned[1], 'u_jo');
eq('3e place = Max', assigned[2], 'u_max');
const waiting = sb.waitRegs('e_p2','n3',3).map(r=>r.pid);
eq('2 en liste d\'attente', waiting.length, 2);
eq('1er en attente = Léa', waiting[0], 'u_lea');
eq('2e en attente = Noah', waiting[1], 'u_noa');

/* --------------------------------------------------------------- */
/* NB : dans le seed, les 6 joueurs sont déjà inscrits à Partie 2 (e_p2).
   On utilise donc la Pratique (e_pr, aucune inscription) pour ces tests :
   n5 = Chronométreur (qty 1), n6 = Cantine (qty 2). */
section('3. Inscription — remplit une place puis bascule en attente');
reset();
loginAs('u_alex');
sb.signUp('e_pr','n5'); // chrono qty1, vide → alex prend la place
eq('chrono : 1 inscription', regCount('e_pr','n5'), 1);
check('alex est sur la place attribuée', assignedIds('e_pr','n5',1)[0]==='u_alex');

reset();
loginAs('u_alex'); sb.signUp('e_pr','n6'); // cantine qty2, place 1
loginAs('u_sam');  sb.signUp('e_pr','n6'); // place 2
eq('cantine : 2 inscriptions', regCount('e_pr','n6'), 2);
check('alex + sam occupent les 2 places', assignedIds('e_pr','n6',2).includes('u_alex') && assignedIds('e_pr','n6',2).includes('u_sam'));

/* place pleine → en attente */
loginAs('u_jo'); sb.signUp('e_pr','n6'); // pleine → jo en attente
eq('cantine : 3 inscriptions dont 1 en attente', regCount('e_pr','n6'), 3);
check('jo est en liste d\'attente (pas attribué)', !assignedIds('e_pr','n6',2).includes('u_jo'));
check('jo est bien le 1er en attente', sb.waitRegs('e_pr','n6',2)[0].pid==='u_jo');

/* --------------------------------------------------------------- */
section('4. Règle : 1 seule activité par joueur par événement');
reset();
loginAs('u_sam'); // déjà sur cantine (n3) de Partie 2
const before = getDB().regs.length;
sb.signUp('e_p2','n2'); // tenter marqueur du MÊME événement → refusé
eq('aucune nouvelle inscription ajoutée', getDB().regs.length, before);
eq('sam reste sur 1 seule activité de l\'événement', getDB().regs.filter(r=>r.pid==='u_sam'&&r.eid==='e_p2').length, 1);

/* --------------------------------------------------------------- */
section('5. Désistement + promotion automatique du 1er en attente');
reset();
loginAs('u_sam');
const myReg = sb.myRegForEvent('e_p2'); // sam sur cantine
setSetting('withdrawHours', 0); // autoriser le désistement
sb.withdraw(myReg.id);
const after = assignedIds('e_p2','n3',3);
check('sam n\'est plus inscrit', !getDB().regs.some(r=>r.id===myReg.id));
eq('toujours 3 places attribuées', after.length, 3);
check('Léa (1re en attente) est promue', after.includes('u_lea'));
eq('nouvelle 1re place = Jordan', after[0], 'u_jo');
eq('nouvelle 3e place = Léa (promue)', after[2], 'u_lea');
const waitAfter = sb.waitRegs('e_p2','n3',3).map(r=>r.pid);
eq('1 seul joueur reste en attente', waitAfter.length, 1);
eq('reste en attente = Noah', waitAfter[0], 'u_noa');

/* --------------------------------------------------------------- */
section('6. Délai de désistement (bloque après l\'échéance)');
reset();
setSetting('withdrawHours', 48);
check('désistement permis à ~96h (délai 48h)', sb.canWithdrawNow(sb.eventById('e_p2').date) === true);
setSetting('withdrawHours', 200);
check('désistement bloqué quand délai (200h) > temps restant', sb.canWithdrawNow(sb.eventById('e_p2').date) === false);
reset();
setSetting('withdrawHours', 200);
loginAs('u_sam');
const rg = sb.myRegForEvent('e_p2');
const n0 = getDB().regs.length;
sb.withdraw(rg.id);
eq('withdraw sans effet après échéance', getDB().regs.length, n0);

/* --------------------------------------------------------------- */
section('7. Calcul des heures — mode APPROBATION');
reset();
setSetting('creditMode', 'approval');
eq('alex crédité de 2h (présence confirmée, événement passé)', sb.playerHours('u_alex'), 2);
eq('sam crédité de 3h', sb.playerHours('u_sam'), 3);
eq('noah (aucune présence) = 0h', sb.playerHours('u_noa'), 0);
reset();
setSetting('creditMode', 'approval');
run(`DB.regs.find(r=>r.id==='r7').present = null;`);
eq('sans présence cochée → 0h (approbation)', sb.playerHours('u_alex'), 0);

/* --------------------------------------------------------------- */
section('8. Calcul des heures — mode AUTOMATIQUE');
reset();
setSetting('creditMode', 'auto');
eq('alex auto = 2h (événement passé, place attribuée)', sb.playerHours('u_alex'), 2);
eq('sam auto = 3h', sb.playerHours('u_sam'), 3);
eq('léa (seulement futur + attente) = 0h', sb.playerHours('u_lea'), 0);

/* --------------------------------------------------------------- */
section('9. Heures : surcharge par événement l\'emporte sur le défaut du type');
reset();
setSetting('creditMode', 'approval');
run(`DB.events.find(e=>e.id==='e_p1').needs.find(n=>n.id==='n9').hours = 5;`);
eq('surcharge événement (5h) appliquée', sb.playerHours('u_sam'), 5);
run(`DB.events.find(e=>e.id==='e_p1').needs.find(n=>n.id==='n9').hours = null;`);
eq('sans surcharge → défaut du type (3h)', sb.playerHours('u_sam'), 3);

/* --------------------------------------------------------------- */
section('10. Utilitaires : initiales & isPast');
reset();
eq('initiales Alex Bergeron = AB', sb.initials({first:'Alex',last:'Bergeron'}), 'AB');
eq('initiales Léa Gagnon = LG', sb.initials({first:'Léa',last:'Gagnon'}), 'LG');
check('isPast() vrai pour Partie 1 (passé)', sb.isPast(sb.eventById('e_p1').date) === true);
check('isPast() faux pour Partie 2 (futur)', sb.isPast(sb.eventById('e_p2').date) === false);

/* --------------------------------------------------------------- */
section('11. Catégorie — un joueur ne peut pas choisir un événement de sa catégorie');
reset();
// helper categoryBlocked(user, event)
check('joueur benjamin bloqué sur événement benjamin (Partie 3)', run(`categoryBlocked(userById('u_alex'), eventById('e_p3'))`) === true);
check('joueur juvénile NON bloqué sur événement benjamin', run(`categoryBlocked(userById('u_jo'), eventById('e_p3'))`) === false);
check('événement sans catégorie (Pratique) : ouvert à tous', run(`categoryBlocked(userById('u_alex'), eventById('e_pr'))`) === false);
// blocage effectif à l'inscription
reset();
loginAs('u_alex'); // benjamin
const nBefore = getDB().regs.length;
sb.signUp('e_p3','n10'); // Partie 3 = benjamin → refusé
eq('inscription refusée (même catégorie)', getDB().regs.length, nBefore);
// un joueur d'une autre catégorie peut s'inscrire
reset();
loginAs('u_jo'); // juvénile
sb.signUp('e_p3','n10'); // Partie 3 = benjamin → autorisé
eq('inscription autorisée (catégorie différente)', getDB().regs.filter(r=>r.eid==='e_p3'&&r.pid==='u_jo').length, 1);
// changer la catégorie d'un joueur retire ses inscriptions désormais en conflit
reset();
loginAs('u_jo'); sb.signUp('e_p3','n10'); // jo (juvénile) s'inscrit sur événement benjamin
sb.setPlayerCategory('u_jo','benjamin'); // devient benjamin → conflit
eq('inscription en conflit retirée après changement de catégorie', getDB().regs.filter(r=>r.eid==='e_p3'&&r.pid==='u_jo').length, 0);

/* --------------------------------------------------------------- */
section('12. Invitations — coach crée les joueurs, activation par mot de passe');
reset();
// parsing d'une liste collée (courriel seul, courriel+nom, courriel+nom+catégorie, doublon, ligne d'en-tête)
run(`globalThis.__parsed = parseInviteList('Courriel,Nom,Catégorie\\njoueur1@test.ca\\njoueur2@test.ca, Marc Tremblay\\njoueur3@test.ca, Julie Roy, cadet\\njoueur1@test.ca\\npas-un-courriel');`);
eq('3 entrées valides (doublon + en-tête + ligne invalide ignorés)', run(`__parsed.length`), 3);
eq('courriel seul → prénom = partie locale', run(`__parsed[0].first`), 'joueur1');
eq('courriel + nom → prénom', run(`__parsed[1].first`), 'Marc');
eq('courriel + nom → nom', run(`__parsed[1].last`), 'Tremblay');
eq('catégorie reconnue', run(`__parsed[2].category`), 'cadet');
// création des invitations
reset();
loginAs('u_coach');
const usersBefore = getDB().users.length;
run(`document.getElementById=(function(orig){return function(id){ if(id==='inviteText') return {value:'nouveau1@test.ca\\nnouveau2@test.ca, Léo Caron, juvenile'}; return orig?orig(id):{value:''}; };})(document.getElementById);`);
sb.createInvites();
eq('2 joueurs invités créés', getDB().users.length - usersBefore, 2);
check('nouvel invité a le statut invited', run(`DB.users.find(u=>u.email==='nouveau1@test.ca').status`) === 'invited');
check('nouvel invité a un code d\'invitation', run(`!!DB.users.find(u=>u.email==='nouveau1@test.ca').inviteCode`) === true);
check('nouvel invité n\'a pas de mot de passe', run(`DB.users.find(u=>u.email==='nouveau1@test.ca').pass`) === null);
eq('catégorie transmise à l\'invité', run(`DB.users.find(u=>u.email==='nouveau2@test.ca').category`), 'juvenile');
// findInvite par courriel ou par code
check('findInvite trouve par courriel', run(`!!findInvite('nouveau1@test.ca')`) === true);
check('findInvite trouve par code', run(`(function(){var u=DB.users.find(x=>x.email==='nouveau1@test.ca'); return findInvite(u.inviteCode)===u;})()`) === true);
check('findInvite ignore un compte déjà actif', run(`findInvite('coach@equipe.ca')`) === null);
// activation : l'invité définit son mot de passe
run(`(function(){var u=DB.users.find(x=>x.email==='nouveau1@test.ca'); u.pass='secret1'; u.status='active'; delete u.inviteCode;})()`);
check('après activation : statut active', run(`DB.users.find(u=>u.email==='nouveau1@test.ca').status`) === 'active');
check('après activation : code d\'invitation retiré', run(`!DB.users.find(u=>u.email==='nouveau1@test.ca').inviteCode`) === true);
// le seed contient des invitations de démo en attente
reset();
check('seed contient des invitations en attente', run(`DB.users.filter(u=>u.status==='invited').length`) >= 1);

/* --------------------------------------------------------------- */
section('13. Parents — inscription en tant que parent + bénévolat');
reset();
// stub des champs du formulaire d'inscription parent (2 enfants existants)
run(`_signupRole='parent'; enterApp=function(){}; toast=function(){};
  var kids=DB.users.filter(u=>u.role==='player').slice(0,2).map(u=>u.id);
  globalThis.__kids=kids;
  var vals={suFirst:'Marie',suLast:'Dubois',suEmail:'marie.parent@test.ca',suPass:'motdepasse',suCategory:{value:''}};
  document.getElementById=function(id){ if(id in vals){ var v=vals[id]; return (typeof v==='string')?{value:v}:v; } return {value:'',style:{},classList:{toggle(){},add(){},remove(){},contains(){return false;}},textContent:''}; };
  document.querySelectorAll=function(sel){ if(sel.indexOf('suChildren')>=0) return kids.map(k=>({value:k})); return []; };`);
const uBefore = getDB().users.length;
run(`doSignup({preventDefault(){}});`);
eq('1 compte parent créé', getDB().users.length - uBefore, 1);
check('le nouvel utilisateur a le rôle parent', run(`DB.users.find(u=>u.email==='marie.parent@test.ca').role`) === 'parent');
eq('le parent est lié à 2 enfants', run(`DB.users.find(u=>u.email==='marie.parent@test.ca').childIds.length`), 2);
check('childrenOf() retourne les joueurs liés', run(`childrenOf(DB.users.find(u=>u.email==='marie.parent@test.ca')).length`) === 2);
check('parent connecté automatiquement après inscription', run(`SESSION && SESSION.userId===DB.users.find(u=>u.email==='marie.parent@test.ca').id`) === true);
// un parent peut faire du bénévolat (jamais bloqué par catégorie)
check('parent JAMAIS bloqué par catégorie', run(`categoryBlocked(DB.users.find(u=>u.email==='marie.parent@test.ca'), eventById('e_p3'))`) === false);
run(`SESSION={userId:DB.users.find(u=>u.email==='marie.parent@test.ca').id};`);
run(`signUp('e_pr','n5');`); // chrono qty1, vide → le parent prend la place
check('un parent peut s\'inscrire à une activité', run(`DB.regs.some(r=>r.eid==='e_pr'&&r.nid==='n5'&&r.pid===SESSION.userId)`) === true);
// inscription parent refusée si aucun enfant sélectionné
reset();
run(`_signupRole='parent'; enterApp=function(){}; toast=function(){};
  var vals={suFirst:'Sans',suLast:'Enfant',suEmail:'sansenfant@test.ca',suPass:'x',suCategory:{value:''}};
  document.getElementById=function(id){ if(id in vals){ var v=vals[id]; return (typeof v==='string')?{value:v}:v; } return {value:'',style:{},classList:{toggle(){},add(){},remove(){},contains(){return false;}},textContent:''}; };
  document.querySelectorAll=function(){ return []; };`);
const uBefore2 = getDB().users.length;
run(`doSignup({preventDefault(){}});`);
eq('inscription parent refusée sans enfant sélectionné', getDB().users.length - uBefore2, 0);

/* --------------------------------------------------------------- */
section('14. Activation — lien complet collé dans le champ code');
reset();
// récupérer une invitation existante (seed) et fabriquer son lien
const invCode = run(`DB.users.find(u=>u.status==='invited').inviteCode`);
const invEmail = run(`DB.users.find(u=>u.status==='invited').email`);
check('extractInviteCode extrait inv_xxx d\'un lien complet',
  run(`extractInviteCode('C:/x/Prototype_v8.html#invite='+${JSON.stringify(invCode)}+'&email=a%40b.com')`) === invCode);
check('extractInviteCode gère le code brut seul',
  run(`extractInviteCode(' '+${JSON.stringify(invCode)}+' ')`) === invCode);
check('extractInviteEmail décode le courriel du lien',
  run(`extractInviteEmail('#invite=x&email='+encodeURIComponent(${JSON.stringify(invEmail)}))`) === invEmail);
check('findInvite trouve via un lien complet collé',
  run(`!!findInvite('foo.html#invite='+${JSON.stringify(invCode)}+'&email=zzz%40zzz.com')`) === true);
check('findInvite insensible à la casse/espaces du courriel',
  run(`!!findInvite('  '+${JSON.stringify(invEmail)}.toUpperCase()+'  ')`) === true);
// activation via lien collé dans acCode, courriel laissé vide
run(`enterApp=function(){}; toast=function(){};
  var vals={acEmail:{value:''},acCode:{value:'X/p_v8.html#invite='+${JSON.stringify(invCode)}+'&email='+encodeURIComponent(${JSON.stringify(invEmail)}),},acPass:{value:'secret'},acPass2:{value:'secret'}};
  document.getElementById=function(id){ return (id in vals)?vals[id]:{value:'',classList:{toggle(){},add(){},remove(){},contains(){return false;}},focus(){},style:{}}; };`);
run(`doActivate({preventDefault(){}});`);
check('compte activé via lien collé (statut actif)',
  run(`DB.users.find(u=>u.email===${JSON.stringify(invEmail)}).status`) === 'active');
check('mot de passe enregistré après activation',
  run(`DB.users.find(u=>u.email===${JSON.stringify(invEmail)}).pass`) === 'secret');
check('session ouverte après activation',
  run(`SESSION && SESSION.userId===DB.users.find(u=>u.email===${JSON.stringify(invEmail)}).id`) === true);

section('15. Activation autonome — lien ouvert sur un appareil sans l\'invitation');
reset();
// Simuler un lien généré par le coach pour un joueur, PUIS un appareil où cette invitation n'existe pas.
run(`var _inv={id:'u_x',first:'Léa',last:'Tremblay',email:'lea.t@ex.com',category:'cadet',role:'player',inviteCode:'inv_voggo2'};
  globalThis.__link=inviteLink(_inv);`);
const link=run('__link');
check('inviteLink encode un payload de données (&d=)', /[#&]d=/.test(link));
check('decodeInviteData reconstruit nom+catégorie',
  run(`(function(){var d=decodeInviteData(__link);return d&&d.first==='Léa'&&d.last==='Tremblay'&&d.category==='cadet'&&d.role==='player';})()`) === true);
// L'invitation n'est PAS dans DB.users (autre appareil). On colle le lien complet dans le champ code.
check('aucune invitation locale correspondante', run(`!findInvite('inv_voggo2')`) === true);
run(`enterApp=function(){}; toast=function(){}; location.hash=''; location.search='';
  var vals={acEmail:{value:''},acCode:{value:__link},acPass:{value:'secret'},acPass2:{value:'secret'}};
  document.getElementById=function(id){ return (id in vals)?vals[id]:{value:'',classList:{toggle(){},add(){},remove(){},contains(){return false;}},focus(){},style:{}}; };`);
const before15=getDB().users.length;
run(`doActivate({preventDefault(){}});`);
eq('un nouveau compte est créé depuis le lien', getDB().users.length-before15, 1);
check('compte créé avec le bon courriel + statut actif',
  run(`(function(){var u=DB.users.find(x=>x.email==='lea.t@ex.com');return u&&u.status==='active'&&u.pass==='secret';})()`) === true);
check('nom et catégorie restaurés depuis le lien',
  run(`(function(){var u=DB.users.find(x=>x.email==='lea.t@ex.com');return u&&u.first==='Léa'&&u.category==='cadet';})()`) === true);
check('session ouverte après activation autonome',
  run(`SESSION && SESSION.userId===DB.users.find(x=>x.email==='lea.t@ex.com').id`) === true);
// Refus si le code n'est pas un vrai inv_xxx (ni lien valide)
reset();
run(`enterApp=function(){}; toast=function(){}; location.hash=''; location.search='';
  var vals={acEmail:{value:'personne@ex.com'},acCode:{value:'bonjour'},acPass:{value:'secret'},acPass2:{value:'secret'}};
  document.getElementById=function(id){ return (id in vals)?vals[id]:{value:'',classList:{toggle(){},add(){},remove(){},contains(){return false;}},focus(){},style:{}}; };`);
const before15b=getDB().users.length;
run(`doActivate({preventDefault(){}});`);
eq('activation refusée sans code inv_xxx valide', getDB().users.length-before15b, 0);

section('16. Journalisation (LOG) — nav, événements, exécutions, filtres, export');
reset();
run('LOG.clear();');
check('journal vide après clear', run('LOG.all().length') === 0);
run("LOG.nav('events',{from:'dash'});");
run("LOG.event('Test inscription',{eid:'e1',nid:'n1'});");
check('nav enregistre une entrée cat=nav', run("LOG.all().some(function(e){return e.cat==='nav'&&/events/.test(e.msg);})") === true);
check('event enregistre cat=event niveau success', run("(function(){var e=LOG.all().filter(function(x){return x.cat==='event';}).pop();return e&&e.level==='success';})()") === true);
check('chaque entrée a un horodatage ISO + seq', run("LOG.all().every(function(e){return e.iso&&typeof e.seq==='number';})") === true);
// exec : durée mesurée + valeur retournée
const execRet = run("LOG.exec('calcul', function(){return 21+21;}, {tag:'x'})");
eq('exec retourne la valeur de la fonction', execRet, 42);
check('exec journalise une durée (durationMs)', run("(function(){var e=LOG.all().filter(function(x){return x.cat==='exec';}).pop();return e&&typeof e.data.durationMs==='number'&&e.data.ok===true;})()") === true);
// exec avec erreur : journalise cat=error puis relance
let threw=false;
try{ run("LOG.exec('boom', function(){throw new Error('kaboom');})"); }catch(e){ threw = /kaboom/.test(String(e.message||e)); }
check('exec relance l\'erreur à l\'appelant', threw === true);
check('exec journalise l\'échec (cat=error, ok=false)', run("(function(){var e=LOG.all().pop();return e&&e.cat==='error'&&e.data.ok===false&&/kaboom/.test(e.data.error);})()") === true);
// filtres
run("LOG.setFilter({cat:'event',level:'all',q:''});");
check('filtre par catégorie', run("LOG.list().every(function(e){return e.cat==='event';})") === true);
run("LOG.setFilter({cat:'all',q:'kaboom'});");
check('recherche plein-texte dans les données', run("LOG.list().length>=1 && LOG.list().every(function(e){return JSON.stringify(e).toLowerCase().indexOf('kaboom')>=0;})") === true);
run("LOG.setFilter({cat:'all',level:'all',q:''});");
// export
check('export JSON = tableau parsable', run("(function(){try{return Array.isArray(JSON.parse(LOG.exportJSON()));}catch(e){return false;}})()") === true);
check('export CSV a un en-tête + lignes', run("(function(){var c=LOG.exportCSV().split('\\n');return c[0].indexOf('seq')===0 && c.length>2;})()") === true);
// persistance dans localStorage
check('journal persisté dans localStorage (bfc_logs)', run("!!localStorage.getItem('bfc_logs')") === true);
// les mutations réelles alimentent le journal
run('LOG.clear();');
run("SESSION={userId:DB.users.find(function(u){return u.role==='player';}).id};");
run("signUp('e_pr','n5');");
check('signUp génère une entrée événement', run("LOG.all().some(function(e){return e.cat==='event'&&/[Ii]nscription/.test(e.msg);})") === true);

section('17. Logo d\'équipe — définition, style du rond, retrait, persistance');
reset();
check('logo nul par défaut', run('DB.settings.logo') == null);
check('ballStyle vide sans logo', run("ballStyle()") === '');
const fakeLogo='data:image/png;base64,AAAABBBBCCCC';
eq('setTeamLogo stocke le dataURL', run(`setTeamLogo(${JSON.stringify(fakeLogo)})`), fakeLogo);
check('DB.settings.logo mis à jour', run('DB.settings.logo') === fakeLogo);
check('ballStyle inclut l\'image du logo', /background-image:url\(/.test(run('ballStyle()')) && run('ballStyle()').indexOf(fakeLogo)>=0);
check('logo persisté dans localStorage', run("JSON.parse(localStorage.getItem('bfc_db_v3')).settings.logo") === fakeLogo);
check('journal enregistre la mise à jour du logo', run("LOG.all().some(function(e){return /[Ll]ogo/.test(e.msg);})") === true);
// la vue Réglages affiche l'aperçu + le bouton retirer quand un logo existe
run("SESSION={userId:DB.users.find(function(u){return u.role==='coach';}).id};");
run("__cap={_h:'',set innerHTML(v){this._h=v;},get innerHTML(){return this._h;}}; renderSettings(__cap);");
check('Réglages affiche l\'aperçu du logo', /logo-preview/.test(run('__cap._h')) && run('__cap._h').indexOf(fakeLogo)>=0);
check('Réglages affiche le bouton Retirer', /removeTeamLogo/.test(run('__cap._h')));
// retrait
run('removeTeamLogo();');
check('setTeamLogo(null) via removeTeamLogo remet à null', run('DB.settings.logo') == null);
check('ballStyle redevient vide après retrait', run("ballStyle()") === '');

section('18. Mode développeur — journal réservé au dév, persistance toujours active');
reset();
run('setDev(false);');
check('mode dév OFF par défaut', run('isDev()') === false);
// La barre latérale du coach NE contient PAS l'onglet Journal hors dév
run("SESSION={userId:DB.users.find(function(u){return u.role==='coach';}).id};");
run("__sb={_h:'',set innerHTML(v){this._h=v;},get innerHTML(){return this._h;}}; var _g=document.getElementById; document.getElementById=function(id){return id==='sidebar'?__sb:_g(id);}; renderSidebar(currentUser()); document.getElementById=_g;");
check('onglet Journal absent de la barre hors dév', run("/go\\('logs'\\)/.test(__sb._h)") === false);
check('onglet Réglages toujours présent', run("/go\\('settings'\\)/.test(__sb._h)") === true);
// La console flottante reste masquée hors dév (renderConsole ne l'ouvre pas)
check('renderConsole ne plante pas hors dév', (function(){ try{ run('renderConsole();'); return true; }catch(e){ return false; } })());
// Le journal continue d'ENREGISTRER même hors dév (persistance production)
run('LOG.clear();');
run("LOG.event('Test prod',{x:1});");
check('les logs sont capturés même hors dév', run('LOG.all().length') >= 1);
check('les logs sont persistés en localStorage hors dév', run("!!localStorage.getItem('bfc_logs')") === true);
// Activation du mode dév
run('setDev(true);');
check('setDev(true) active le mode dév', run('isDev()') === true);
check('état dév persisté (bfc_dev=1)', run("localStorage.getItem('bfc_dev')") === '1');
run("__sb2={_h:'',set innerHTML(v){this._h=v;},get innerHTML(){return this._h;}}; var _g2=document.getElementById; document.getElementById=function(id){return id==='sidebar'?__sb2:_g2(id);}; renderSidebar(currentUser()); document.getElementById=_g2;");
check('onglet Journal présent en mode dév', run("/go\\('logs'\\)/.test(__sb2._h)") === true);
// activation par l'URL (#dev) et coupure (#dev=0)
run('setDev(false); location.hash="#dev"; applyDevFromHash();');
check('#dev active le mode dév', run('isDev()') === true);
run('location.hash="#dev=0"; applyDevFromHash();');
check('#dev=0 coupe le mode dév', run('isDev()') === false);
run('location.hash="";');

section('19. Description de poste + instruction spécifique');
reset();
// Le seed porte desc sur les activités et instr sur certains besoins
check('activité seed a une description de poste', run("!!(activity('a_marq').desc && activity('a_marq').desc.length>10)") === true);
check('besoin seed a une instruction spécifique', run("!!(eventById('e_p2').needs.find(function(n){return n.id==='n1';}).instr)") === true);
// instructionsHTML combine description + instruction
const ih = run("instructionsHTML(activity('a_marq'), eventById('e_p2').needs.find(function(n){return n.id==='n2';}))");
check('instructionsHTML montre la Description du poste', /Description du poste/.test(ih) && /feuille de pointage/.test(ih));
check('instructionsHTML montre l\'Instruction spécifique', /Instruction spécifique/.test(ih) && /feuille de match/.test(ih));
check('instructionsHTML gère l\'absence d\'infos', /Aucune instruction/.test(run("instructionsHTML({name:'X',desc:''},{instr:''})")));
// Le "voir plus" affiche TOUJOURS les deux sections (description ET instructions)
const ihBoth = run("instructionsHTML(activity('a_marq'), eventById('e_p2').needs.find(function(n){return n.id==='n2';}))");
check('voir plus: les deux en-têtes présents (desc + instr)', /Description du poste/.test(ihBoth) && /Instruction spécifique/.test(ihBoth));
// Cas de l'écran: description présente, mais AUCUNE instruction spécifique → les deux sections visibles
const ihDescOnly = run("instructionsHTML({name:'Marqueur',desc:'Tenir la feuille'}, {instr:''})");
check('voir plus (desc seule): en-tête Description + texte', /Description du poste/.test(ihDescOnly) && /Tenir la feuille/.test(ihDescOnly));
check('voir plus (desc seule): en-tête Instruction + placeholder vide', /Instruction spécifique/.test(ihDescOnly) && /Aucune instruction/.test(ihDescOnly));
// Cas inverse: instruction présente, pas de description → les deux sections visibles
const ihInstrOnly = run("instructionsHTML({name:'X',desc:''}, {instr:'Arriver 30 min avant'})");
check('voir plus (instr seule): en-tête Description + placeholder vide', /Description du poste/.test(ihInstrOnly) && /Aucune description du poste/.test(ihInstrOnly));
check('voir plus (instr seule): en-tête Instruction + texte', /Instruction spécifique/.test(ihInstrOnly) && /Arriver 30 min avant/.test(ihInstrOnly));
// saveActivity persiste la description
run("SESSION={userId:DB.users.find(function(u){return u.role==='coach';}).id};");
run("_pickedColor='#123456';");
run("var vals={acName:{value:'Test poste'},acHours:{value:'2'},acDesc:{value:'Ma description generale'}};"+
    "document.getElementById=function(id){return (id in vals)?vals[id]:{value:'',classList:{toggle(){},add(){},remove(){},contains(){return false;}},focus(){},style:{}};};"+
    "closeModal=function(){};toast=function(){};");
run("saveActivity(null);");
check('saveActivity enregistre la description', run("DB.activities.some(function(a){return a.name==='Test poste'&&a.desc==='Ma description generale';})") === true);
// toggle d'agrandissement (Mes activités + liste besoins)
run("_openNeedRows={}; toggleNeedRow('e_p2_n1');");
check('toggleNeedRow ouvre la ligne', run("_openNeedRows['e_p2_n1']") === true);
run("toggleNeedRow('e_p2_n1');");
check('toggleNeedRow referme la ligne', run("!_openNeedRows['e_p2_n1']") === true);
run("_openActRows={}; toggleActRow('r_demo');");
check('toggleActRow ouvre la ligne Mes activités', run("_openActRows['r_demo']") === true);

/* --------------------------------------------------------------- */
section('20. Rappels courriel — contenu, destinataires assignés, envoi simulé');
reset();
// Inscrire 2 joueurs à un besoin de e_p2 (qty=2 sur n1 = chaîneurs)
run("DB.regs=[];");
run("var pls=DB.users.filter(function(u){return u.role==='player'&&u.status!=='invited';});");
run("signUp=signUp;");
run("DB.regs.push({id:'r_a',eid:'e_p2',nid:'n1',pid:pls[0].id,ts:1}); DB.regs.push({id:'r_b',eid:'e_p2',nid:'n1',pid:pls[1].id,ts:2}); DB.regs.push({id:'r_c',eid:'e_p2',nid:'n1',pid:pls[2].id,ts:3});");
let mails = run("buildEventReminders('e_p2')");
check('un rappel par place TENUE (qty=2 → 2 rappels, pas 3)', run("buildEventReminders('e_p2').filter(function(m){return m.nid==='n1';}).length") === 2);
check('le rappel contient date, lieu, activité', mails[0] && !!mails[0].eventDate && mails[0].location==='Stade municipal' && mails[0].activityName==='Chaîneur');
check('le rappel contient l\'instruction spécifique du besoin', /veste orange/i.test(mails[0].instr));
check('le rappel contient la description du poste', run("buildEventReminders('e_p2').some(function(m){return m.jobDesc && m.jobDesc.length>5;})") === true);
// Un parent inscrit reçoit aussi un rappel, avec mention de l'enfant
run("var par=DB.users.find(function(u){return u.role==='parent';}); if(!par){par={id:'u_par',first:'Marie',last:'Parent',email:'marie@ex.ca',pass:'x',role:'parent',status:'active',childIds:[pls[0].id]};DB.users.push(par);} DB.regs.push({id:'r_par',eid:'e_p2',nid:'n2',pid:par.id,ts:1});");
check('un parent inscrit reçoit un rappel', run("buildEventReminders('e_p2').some(function(m){return m.role==='parent';})") === true);
check('le rappel du parent mentionne l\'enfant (onBehalfOf)', run("buildEventReminders('e_p2').some(function(m){return m.role==='parent'&&m.onBehalfOf&&m.onBehalfOf.length>0;})") === true);
// Aperçu HTML fidèle
let html = run("emailBodyHTML(buildEventReminders('e_p2')[0])");
check('l\'aperçu HTML montre l\'objet et les champs clés', /email-head/.test(html) && /Stade municipal/.test(html));
// Envoi simulé → outbox + aucun envoi réel
run("toast=function(){};");
let n = run("sendEventReminders('e_p2')");
check('sendEventReminders retourne le nombre envoyé', typeof n==='number' && n>0);
check('les courriels simulés sont dans la boîte d\'envoi', run("DB.outbox.length") === n);
check('chaque courriel outbox a un horodatage d\'envoi', run("DB.outbox.every(function(m){return !!m.sentAt;})") === true);
check('un événement sans inscrit ne génère aucun rappel', run("buildEventReminders('e_pr').length") === 0);
run("clearOutbox();");
check('clearOutbox vide la boîte d\'envoi', run("DB.outbox.length") === 0);

/* --------------------------------------------------------------- */
section('13. Import d\'événements depuis un tableur (CSV/TSV/collé)');
reset();
// Regroupement: 2 lignes même date+titre -> 1 événement, 2 postes
let p1 = sb.parseEventSheet('2026-09-20 14:00,Partie 2,Stade,,Chaîneur,2,\n2026-09-20 14:00,Partie 2,Stade,,Cantine,3,', getDB().activities);
eq('1 événement regroupé par date+titre', p1.events.length, 1);
eq('2 postes dans l\'événement', p1.events[0].needs.length, 2);
eq('les places sont lues (Chaîneur=2)', p1.events[0].needs[0].qty, 2);
eq('le lieu est repris', p1.events[0].location, 'Stade');
// En-tête détectée et ignorée
let p2 = sb.parseEventSheet('Date,Titre,Lieu,Catégorie,Activité,Places,Heures\n2026-10-01 10:00,Pratique,Gymnase,,Cantine,1,', getDB().activities);
eq('ligne d\'en-tête ignorée', p2.events.length, 1);
eq('titre correctement lu après en-tête', p2.events[0].title, 'Pratique');
// Activité connue (accents/casse) appariée, pas marquée comme nouvelle
let p3 = sb.parseEventSheet('2026-09-20 14:00,Partie 2,Stade,,CHAINEUR,2,', getDB().activities);
eq('activité existante appariée sans accent/casse -> 0 nouvelle', p3.newActs.length, 0);
// Activité inconnue -> proposée à la création
let p4 = sb.parseEventSheet('2026-09-20 14:00,Partie 2,Stade,,Vestiaire,1,', getDB().activities);
eq('activité inconnue détectée', p4.newActs.length, 1);
eq('nom de la nouvelle activité', p4.newActs[0], 'Vestiaire');
// Lignes invalides -> erreurs, pas d'événement
let p5 = sb.parseEventSheet('pas-de-date,Partie,Stade,,Cantine,2,\n2026-09-20 14:00,,Stade,,Cantine,2,\n2026-09-20 14:00,Sans activité,Stade,,,2,', getDB().activities);
eq('3 lignes invalides capturées', p5.errors.length, 3);
eq('aucun événement créé depuis lignes invalides', p5.events.length, 0);
// Détection séparateur point-virgule (Excel FR) + date JJ/MM/AAAA
let p6 = sb.parseEventSheet('20/09/2026 14:00;Partie 3;Stade;;Cantine;4;', getDB().activities);
eq('séparateur ; détecté -> 1 événement', p6.events.length, 1);
eq('date JJ/MM/AAAA analysée (place=4)', p6.events[0].needs[0].qty, 4);
check('date JJ/MM/AAAA -> ISO septembre 2026', /^2026-09-20/.test(p6.events[0].date));
// Places manquante -> 1 par défaut ; heures lues
let p7 = sb.parseEventSheet('2026-09-20 14:00,Partie 4,Stade,,Cantine,,2.5', getDB().activities);
eq('places vide -> 1 par défaut', p7.events[0].needs[0].qty, 1);
eq('heures personnalisées lues', p7.events[0].needs[0].hours, 2.5);
// doImportEvents applique réellement au DB
reset();
run("toast=function(){}; render=function(){};");
let evBefore = getDB().events.length, actBefore = getDB().activities.length;
run("_importPlan = parseEventSheet('2026-11-15 09:00,Tournoi,Complexe,,Chaîneur,2,\\n2026-11-15 09:00,Tournoi,Complexe,,Buvette,3,', DB.activities); doImportEvents();");
eq('doImportEvents crée 1 nouvel événement', getDB().events.length, evBefore+1);
eq('doImportEvents crée l\'activité manquante (Buvette)', getDB().activities.length, actBefore+1);
let imp = getDB().events.find(e=>e.title==='Tournoi');
check('événement importé a un id e_', !!imp && /^e_/.test(imp.id));
eq('événement importé a 2 postes', imp.needs.length, 2);
check('postes importés ont des ids n_', imp.needs.every(n=>/^n_/.test(n.id)));
check('poste lié à une activité existante', imp.needs.every(n=>getDB().activities.some(a=>a.id===n.actId)));

/* --------------------------------------------------------------- */
console.log('\n' + '─'.repeat(50));
if(failed===0){
  console.log(`\x1b[32m\x1b[1m✓ TOUS LES TESTS PASSENT — ${passed}/${passed} assertions\x1b[0m`);
  process.exit(0);
} else {
  console.log(`\x1b[31m\x1b[1m✗ ${failed} échec(s) sur ${passed+failed} assertions\x1b[0m`);
  fails.forEach(f=>console.log('   - ' + f));
  process.exit(1);
}

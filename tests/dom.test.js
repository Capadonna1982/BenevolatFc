/* Validation d'intégration DOM (statique, sans navigateur) :
   vérifie que chaque id référencé par le JS via getElementById existe dans le HTML,
   et que le script s'exécute jusqu'au bout dans un DOM simulé (jsdom-léger maison). */
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const js   = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');

let pass = 0, fail = 0;
const fails = [];
function check(name, cond){ if(cond){pass++; console.log('  \x1b[32m✓\x1b[0m '+name);} else {fail++; fails.push(name); console.log('  \x1b[31m✗ '+name+'\x1b[0m');} }
function section(t){ console.log('\n\x1b[1m'+t+'\x1b[0m'); }

console.log('\n=== Validation intégration DOM — Bénévolat FC ===');

/* 1) Tous les id="..." présents dans le HTML */
const htmlIds = new Set();
for(const m of html.matchAll(/id="([^"]+)"/g)) htmlIds.add(m[1]);

/* 2) Tous les getElementById('x') référencés dans le JS */
const jsIds = new Set();
for(const m of js.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)) jsIds.add(m[1]);

/* Certains id sont créés dynamiquement par le JS (innerHTML) — on les autorise. */
const dynamicOk = new Set(['modalRoot','toastRoot','app','authScreen']);

section('1. Références getElementById → existence dans le HTML (ou création dynamique)');
let missing = [];
for(const id of jsIds){
  const inHtml = htmlIds.has(id);
  const createdInJs = new RegExp("id=\\\\?['\"]"+id+"|id=\\\\?`"+id+"|'id','"+id+"'").test(js)
      || new RegExp("id=\"?"+id).test(js);
  if(!inHtml && !createdInJs && !dynamicOk.has(id)) missing.push(id);
}
check('aucun id manquant référencé par le JS statiquement chargé', missing.length===0);
if(missing.length) console.log('     manquants: '+missing.join(', '));

section('2. Structure HTML minimale');
check('conteneur #authScreen présent', htmlIds.has('authScreen'));
check('conteneur #app présent', htmlIds.has('app'));
check('formulaire de connexion #loginForm présent', htmlIds.has('loginForm'));
check('formulaire d\'inscription #signupForm présent', htmlIds.has('signupForm'));
check('zone modale #modalRoot présente', htmlIds.has('modalRoot'));
check('zone toast #toastRoot présente', htmlIds.has('toastRoot'));

section('3. Exécution du script dans un DOM simulé (parse + init sans erreur)');
/* mini-DOM : suffisant pour charger app.js jusqu'à l'init et détecter les erreurs de syntaxe/exécution */
function makeEl(){
  const el = {
    _cls:new Set(), style:{}, children:[], attrs:{}, value:'', _text:'', _html:'',
    classList:{ add(){}, remove(){}, toggle(){}, contains(){return false;} },
    addEventListener(){}, appendChild(c){this.children.push(c);}, removeChild(){},
    setAttribute(k,v){this.attrs[k]=v;}, getAttribute(k){return this.attrs[k]||null;},
    querySelector(){return makeEl();}, querySelectorAll(){return [];},
    reset(){}, focus(){}, closest(){return null;}, remove(){},
    get textContent(){return this._text;}, set textContent(v){this._text=v;},
    get innerHTML(){return this._html;}, set innerHTML(v){this._html=v;},
    get classList2(){return this._cls;}
  };
  return el;
}
const els = {};
const documentStub = {
  getElementById(id){ return els[id] || (els[id]=makeEl()); },
  querySelector(){ return makeEl(); },
  querySelectorAll(){ return []; },
  createElement(){ return makeEl(); },
  addEventListener(){},
  body: makeEl(),
  documentElement: makeEl()
};
const store = {};
const localStorageStub = {
  getItem(k){ return k in store ? store[k] : null; },
  setItem(k,v){ store[k]=String(v); },
  removeItem(k){ delete store[k]; }
};
const domHandlers = {};
function addEventListenerStub(evt, cb){ (domHandlers[evt]=domHandlers[evt]||[]).push(cb); }
documentStub.addEventListener = addEventListenerStub;
const sandbox = {
  document: documentStub,
  localStorage: localStorageStub,
  navigator: { language: 'fr' },
  console,
  setTimeout, clearTimeout,
  addEventListener: addEventListenerStub,
  alert(){}, confirm(){return true;}, prompt(){return '';}
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

let execOk = true, execErr = null;
try {
  const vm = require('vm');
  vm.createContext(sandbox);
  vm.runInContext(js, sandbox, { filename:'app.js' });
  // déclenche les handlers DOMContentLoaded/load enregistrés par le script
  for(const evt of ['DOMContentLoaded','load']){
    (domHandlers[evt]||[]).forEach(cb=>{ try{ cb({}); }catch(e){} });
  }
  // appelle explicitement l'init si présente et pas encore lancée
  if(typeof sandbox.init === 'function' && (!sandbox.DB)){ sandbox.init(); }
} catch(e){ execOk = false; execErr = e; }
check('app.js parse et s\'exécute sans lever d\'erreur', execOk);
if(!execOk) console.log('     erreur: '+(execErr && execErr.message));

let dbUsers = 0, hasT = false;
try {
  const vm = require('vm');
  dbUsers = vm.runInContext('(typeof DB!=="undefined" && DB && DB.users) ? DB.users.length : 0', sandbox);
  hasT = vm.runInContext('typeof t === "function"', sandbox);
} catch(e){}
check('objet DB initialisé après exécution (users seedés)', dbUsers > 0);
check('fonction t() (i18n) définie', hasT);

console.log('\n' + '─'.repeat(50));
if(fail===0) console.log('\x1b[32m\x1b[1m✓ VALIDATION DOM OK — '+pass+'/'+(pass+fail)+' vérifications\x1b[0m');
else { console.log('\x1b[31m\x1b[1m✗ '+fail+' échec(s) sur '+(pass+fail)+'\x1b[0m'); process.exit(1); }

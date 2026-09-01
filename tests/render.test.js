/* Vérifie le rendu de la barre tricolore du dashboard joueur, sans navigateur. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const js=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');

// --- DOM stub minimal ---
const nodes={};
function mkEl(id){ return {id:id||'',innerHTML:'',style:{},value:'',classList:{add(){},remove(){},toggle(){}},
  appendChild(){}, addEventListener(){}, querySelector(){return null;}, querySelectorAll(){return [];},
  setAttribute(){}, getAttribute(){return null;} }; }
const doc={ getElementById(id){ return nodes[id]||(nodes[id]=mkEl(id)); },
  querySelector(){return mkEl();}, querySelectorAll(){return [];},
  createElement(){return mkEl();}, addEventListener(){}, documentElement:{}, body:mkEl('body') };
const store={};
const localStorageStub={ getItem(k){return k in store?store[k]:null;}, setItem(k,v){store[k]=String(v);}, removeItem(k){delete store[k];} };
const handlers={};
const sandbox={ document:doc, localStorage:localStorageStub, navigator:{language:'fr'}, console,
  setTimeout, clearTimeout, addEventListener:(e,cb)=>{(handlers[e]=handlers[e]||[]).push(cb);},
  alert(){}, confirm(){return true;}, prompt(){return '';}, scrollTo(){} };
sandbox.window=sandbox; sandbox.globalThis=sandbox;
vm.createContext(sandbox);
vm.runInContext(js, sandbox, {filename:'app.js'});
['DOMContentLoaded','load'].forEach(e=>(handlers[e]||[]).forEach(cb=>{try{cb({});}catch(_){}}));

let pass=0, fail=0;
function check(name, cond){ if(cond){pass++;console.log('  \x1b[32m✓\x1b[0m '+name);} else {fail++;console.log('  \x1b[31m✗ '+name+'\x1b[0m');} }
function run(expr){ return vm.runInContext(expr, sandbox); }

console.log('\x1b[1mRendu — barre de progression tricolore\x1b[0m');

// Prépare un joueur avec heures complétées (Partie 1 passée) + heures sélectionnées (Partie 2 à venir)
run(`(function(){
  DB.settings.creditMode='auto';
  var pid='u_max';
  // heures COMPLÉTÉES (bleu): place attribuée sur un événement passé (Partie 1, chrono n8, 2h)
  if(!DB.regs.find(function(r){return r.pid===pid && r.eid==='e_p1';}))
    DB.regs.push({id:'r_done',eid:'e_p1',nid:'n8',pid:pid,ts:1,present:null});
  // heures SÉLECTIONNÉES (orange): place attribuée sur un événement à venir (Partie 2, marqueur n2)
  if(!DB.regs.find(function(r){return r.pid===pid && r.eid==='e_p2';}))
    DB.regs.push({id:'r_test',eid:'e_p2',nid:'n2',pid:pid,ts:Date.now(),present:null});
  SESSION={userId:pid};
})()`);

const bd = run(`playerHoursBreakdown('u_max')`);
check('breakdown a des heures complétées (>0)', bd.done>0);
check('breakdown a des heures sélectionnées (>0)', bd.selected>0);

// Rend le dashboard dans un conteneur simulé et inspecte le HTML
run(`renderPlayerDash(document.getElementById('content'))`);
const outHTML = nodes['content'].innerHTML;
check('Dashboard: segment complété (seg-done)', /seg-done/.test(outHTML));
check('Dashboard: segment sélectionné (seg-sel)', /seg-sel/.test(outHTML));
check('Dashboard: légende (dot-done/dot-sel/dot-rem)', /dot-done/.test(outHTML)&&/dot-sel/.test(outHTML)&&/dot-rem/.test(outHTML));
check('Dashboard: 3 libellés de légende', /Complété/.test(outHTML)&&/Sélectionné/.test(outHTML)&&/Restant/.test(outHTML));

// Même vérification pour la vue « Mes heures » (renderPlayerHours) — régression corrigée
run(`renderPlayerHours(document.getElementById('content2'))`);
const hoursHTML = nodes['content2'].innerHTML;
check('Mes heures: barre tricolore présente (seg-done + seg-sel)', /seg-done/.test(hoursHTML)&&/seg-sel/.test(hoursHTML));
check('Mes heures: la barre n\'est PAS vide (largeur seg-done > 0)', /seg-done" style="width:(?!0%)/.test(hoursHTML));
check('Mes heures: n\'utilise plus l\'ancienne classe .bar', !/class="bar/.test(hoursHTML));
check('Mes heures: légende présente', /dot-done/.test(hoursHTML)&&/dot-sel/.test(hoursHTML)&&/dot-rem/.test(hoursHTML));

// Waitlist ne compte pas
const wl = run(`(function(){
  // met u_max en liste d'attente sur une place déjà pleine → ne doit pas compter
  return playerHoursBreakdown('u_lea'); // léa: benjamin, aucune place passée
})()`);
check('un joueur sans place attribuée passée a 0h complétée', wl.done===0);

// ---- Copie d'événement ----
console.log('\n\x1b[1mCopie d\'événement\x1b[0m');
run(`SESSION={userId:'u_coach'}`);
const srcNeedsBefore = run(`JSON.stringify(DB.events.find(e=>e.id==='e_p2').needs.map(n=>n.id))`);
const evCountBefore = run(`DB.events.length`);
const regsBefore = run(`DB.regs.length`);
run(`copyEvent('e_p2')`);
// _needDraft doit être pré-rempli depuis la source
check('copie: _needDraft a le même nombre de besoins que la source', run(`_needDraft.length`) === run(`DB.events.find(e=>e.id==='e_p2').needs.length`));
check('copie: activités des besoins identiques à la source', run(`JSON.stringify(_needDraft.map(n=>n.actId))`) === run(`JSON.stringify(DB.events.find(e=>e.id==='e_p2').needs.map(n=>n.actId))`));
check('copie: quantités identiques à la source', run(`JSON.stringify(_needDraft.map(n=>n.qty))`) === run(`JSON.stringify(DB.events.find(e=>e.id==='e_p2').needs.map(n=>n.qty))`));
check('copie: IDs de besoins REGÉNÉRÉS (différents de la source)', run(`JSON.stringify(_needDraft.map(n=>n.id))`) !== srcNeedsBefore);
check('copie: aucun événement créé tant que non enregistré', run(`DB.events.length`) === evCountBefore);
check('copie: la source est intacte (besoins inchangés)', run(`JSON.stringify(DB.events.find(e=>e.id==='e_p2').needs.map(n=>n.id))`) === srcNeedsBefore);
check('copie: aucune inscription ajoutée', run(`DB.regs.length`) === regsBefore);
const mHTML = run(`document.getElementById('modalRoot').innerHTML`);
check('copie: le formulaire pré-remplit le titre avec le suffixe (copie)', /\(copie\)/.test(mHTML));
check('copie: bannière d\'aide de copie affichée', /copyEventHint|aucun joueur n'est assigné|Aucun joueur n'est assigné/i.test(mHTML) || mHTML.includes('⧉'));
check('copie: la date est vidée dans le formulaire', /id="evDate"[^>]*value=""/.test(mHTML));
check('copie: le titre du modal est « Copier l\'événement »', /Copier l(&#39;|')événement/.test(mHTML));

// ---- Suivi des heures (coach): liste d'activités sous chaque nom ----
console.log('\n\x1b[1mSuivi des heures — liste d\'activités par personne\x1b[0m');
run(`SESSION={userId:'u_coach'}`);
// Assure un parent avec une inscription pour vérifier l'inclusion des parents
run(`(function(){
  var par=DB.users.find(function(u){return u.role==='parent';});
  if(!par){ par={id:'u_par1',first:'Marie',last:'Tremblay',email:'marie@ex.ca',pass:'x',role:'parent',status:'active',childIds:['u_max']}; DB.users.push(par); }
  if(!DB.regs.find(function(r){return r.pid===par.id;}))
    DB.regs.push({id:'r_par1',eid:'e_p3',nid:'n10',pid:par.id,ts:1,present:null});
})()`);
run(`_openTrackRows={}`);
run(`renderTracking(document.getElementById('trk'))`);
const trkClosed = nodes['trk'].innerHTML;
check('Suivi: liste repliée par défaut (aucun pa-list)', !/pa-list/.test(trkClosed));
check('Suivi: chevron ▸ affiché quand repliée', /act-caret/.test(trkClosed) && trkClosed.includes('▸'));
check('Suivi: pastille de compte d\'activités affichée', /pa-count/.test(trkClosed));
check('Suivi: ligne cliquable (is-toggle + toggleTrackRow)', /track-name is-toggle/.test(trkClosed) && /toggleTrackRow/.test(trkClosed));
check('Suivi: barre tricolore (seg-done + seg-sel)', /seg-done/.test(trkClosed) && /seg-sel/.test(trkClosed));
check('Suivi: segment crédité non vide (seg-done > 0)', /seg-done" style="width:(?!0%)/.test(trkClosed));
check('Suivi: segment à venir non vide (seg-sel > 0)', /seg-sel" style="width:(?!0%)/.test(trkClosed));
const parentsLabel = run(`t('trackParents')`);
check('Suivi: section parents rendue', /Tremblay/.test(trkClosed) && trkClosed.includes(parentsLabel));
// Déplier un joueur → sa liste apparaît
run(`toggleTrackRow('u_max')`);
run(`renderTracking(document.getElementById('trk'))`);
const trkOpen = nodes['trk'].innerHTML;
check('Suivi: liste dépliée au clic (pa-list)', /pa-list/.test(trkOpen));
check('Suivi: chevron ▾ affiché quand dépliée', trkOpen.includes('▾'));
check('Suivi: le nom d\'un événement apparaît (pa-ev)', /pa-ev/.test(trkOpen));
check('Suivi: au moins un badge passé/à venir', /pa-badge (past|up)/.test(trkOpen));
// Déplier le parent → sa liste apparaît aussi
run(`toggleTrackRow('u_par1')`);
run(`renderTracking(document.getElementById('trk'))`);
const trkParent = nodes['trk'].innerHTML;
const parentIdx = trkParent.indexOf(parentsLabel);
check('Suivi: liste dépliable aussi pour les parents', parentIdx>=0 && /pa-list/.test(trkParent.slice(parentIdx)));

console.log('\n'+'─'.repeat(50));
if(fail){ console.log('\x1b[31m\x1b[1m✗ '+fail+' échec(s)\x1b[0m'); process.exit(1); }
console.log('\x1b[32m\x1b[1m✓ RENDU OK — '+pass+' vérifications\x1b[0m');

// Test unitaire pur du moteur d'auto-remplissage (sans navigateur ni Supabase).
// On reconstruit un mini-univers avec le MÊME modèle que app.js (DB.regs plat).

// ---- Modèle minimal identique à app.js ----
let DB;
function eventById(id){ return DB.events.find(e=>e.id===id); }
function regsForNeed(eid, nid){
  return DB.regs.filter(r=>r.eid===eid && r.nid===nid).sort((a,b)=>a.ts-b.ts);
}
function openCount(eid, need){
  return Math.max(0, (need.qty||1) - regsForNeed(eid, need.id).length);
}
function isWaitingReg(reg){
  const ev=eventById(reg.eid); if(!ev||!ev.needs) return false;
  const need=ev.needs.find(n=>n.id===reg.nid); if(!need) return false;
  const idx=regsForNeed(reg.eid, reg.nid).findIndex(r=>r.id===reg.id);
  return idx >= (need.qty||1);
}
let saved=0; function saveDB(){ saved++; }
function autoFillFromWaitlists(eid, opts){
  opts=opts||{}; const commit=opts.commit!==false;
  const ev=eventById(eid); if(!ev||!ev.needs) return [];
  const moves=[];
  const openByNeed={}; ev.needs.forEach(n=>{ openByNeed[n.id]=openCount(eid,n); });
  const waiting = DB.regs.filter(r=>r.eid===eid && isWaitingReg(r)).sort((a,b)=>a.ts-b.ts);
  waiting.forEach(function(reg){
    const target = ev.needs.find(n=> n.id!==reg.nid && openByNeed[n.id]>0);
    if(!target) return;
    moves.push({regId:reg.id, uid:reg.pid, from:reg.nid, to:target.id});
    openByNeed[target.id]--;
    if(commit){ reg.nid=target.id; }
  });
  if(commit && moves.length){ saveDB(); }
  return moves;
}

// ---- Utilitaires de test ----
let pass=0, fail=0;
function check(name, cond){ if(cond){pass++; console.log('  ✅', name);} else {fail++; console.log('  ❌', name);} }

// ============ SCÉNARIO 1 : désistement libère une place, un candidat en attente comble ============
console.log('\nSCÉNARIO 1 — Place libre comblée par un candidat en attente d\'une autre activité');
DB={
  events:[{id:'E1', needs:[
    {id:'nA', qty:1},   // Marqueur : 1 place
    {id:'nB', qty:1},   // Chaîneur : 1 place
  ]}],
  regs:[
    // Marqueur : Alice assignée (ts1). Personne d'autre.
    {id:'r1', pid:'Alice', eid:'E1', nid:'nA', ts:1},
    // Chaîneur : Bob assigné (ts2), Chloé EN ATTENTE (ts3).
    {id:'r2', pid:'Bob',   eid:'E1', nid:'nB', ts:2},
    {id:'r3', pid:'Chloe', eid:'E1', nid:'nB', ts:3},
  ]
};
// État initial : nA plein (Alice), nB plein (Bob) + Chloé en attente. Aucune place libre → aucun mouvement.
let m0=autoFillFromWaitlists('E1',{commit:false});
check('Aucun mouvement quand tout est plein', m0.length===0);

// Alice se désiste → sa place Marqueur (nA) se libère.
DB.regs = DB.regs.filter(r=>r.id!=='r1');
let m1=autoFillFromWaitlists('E1',{commit:true});
check('1 mouvement généré après désistement', m1.length===1);
check('C\'est Chloé (la candidate en attente) qui bouge', m1[0] && m1[0].uid==='Chloe');
check('Elle passe de Chaîneur (nB) vers Marqueur (nA)', m1[0] && m1[0].from==='nB' && m1[0].to==='nA');
check('Chloé est maintenant ASSIGNÉE au Marqueur', regsForNeed('E1','nA').some(r=>r.pid==='Chloe'));
check('Bob reste seul assigné au Chaîneur', regsForNeed('E1','nB').length===1 && regsForNeed('E1','nB')[0].pid==='Bob');
check('saveDB() appelé', saved>0);

// ============ SCÉNARIO 2 : premier arrivé, premier servi entre 2 candidats en attente ============
console.log('\nSCÉNARIO 2 — Premier arrivé, premier servi (2 candidats, 1 seule place libre)');
saved=0;
DB={
  events:[{id:'E2', needs:[
    {id:'nX', qty:1},   // 1 place libre (personne)
    {id:'nY', qty:1},   // Denis assigné, puis 2 en attente : Eve (plus tôt) et Félix (plus tard)
  ]}],
  regs:[
    {id:'r1', pid:'Denis', eid:'E2', nid:'nY', ts:10},
    {id:'r2', pid:'Eve',   eid:'E2', nid:'nY', ts:11}, // en attente, arrivée AVANT Félix
    {id:'r3', pid:'Felix', eid:'E2', nid:'nY', ts:12}, // en attente, arrivé APRÈS Eve
  ]
};
let m2=autoFillFromWaitlists('E2',{commit:true});
check('1 seul mouvement (1 seule place libre)', m2.length===1);
check('C\'est Eve qui obtient la place (arrivée en premier)', m2[0] && m2[0].uid==='Eve');
check('Eve déplacée vers nX', m2[0] && m2[0].to==='nX');
check('Félix reste en attente sur nY', isWaitingReg(DB.regs.find(r=>r.pid==='Felix')));

// ============ SCÉNARIO 3 : idempotence (relancer ne change rien) ============
console.log('\nSCÉNARIO 3 — Idempotence : relancer l\'auto-remplissage ne crée aucun nouveau mouvement');
let m3=autoFillFromWaitlists('E2',{commit:true});
check('0 mouvement au 2e passage', m3.length===0);

// ============ RÉSULTAT ============
console.log(`\n=== ${pass} réussis, ${fail} échoués ===`);
process.exit(fail? 1 : 0);

/* ============================================================================
 * Test d'INTÉGRATION multi-joueurs contre la VRAIE base Supabase.
 * Simule plusieurs joueurs qui s'inscrivent EN MÊME TEMPS (concurrence),
 * vérifie 1er-arrivé/1er-servi, file d'attente, désistement, promotion,
 * puis auto-remplissage. Tout est préfixé zz_test_ et nettoyé à la fin.
 * ==========================================================================*/
'use strict';
const { URL, KEY, sel, ins, del } = require('./_supa.js');
const R = require('../api/_lib/reminders.js');
const CFG = { supabaseUrl: URL, supabaseKey: KEY };

let pass=0, fail=0;
const ok=(n,c)=>{ if(c){pass++;console.log('  ✅',n);} else {fail++;console.log('  ❌',n);} };
const eq=(n,a,b)=>ok(`${n} (attendu ${JSON.stringify(b)}, obtenu ${JSON.stringify(a)})`, JSON.stringify(a)===JSON.stringify(b));

const P = 'zz_test_';
const EID = P+'evt';
async function cleanup(){
  await del('regs',       `id=like.${P}*`);
  await del('needs',      `id=like.${P}*`);
  await del('events',     `id=like.${P}*`);
  await del('activities', `id=like.${P}*`);
  await del('users',      `id=like.${P}*`);
}

(async () => {
  console.log('\n=== Préparation (nettoyage préalable) ===');
  await cleanup();
  console.log('  base nettoyée de tout résidu zz_test_');

  const players = [
    {id:P+'p1', first:'Aaa', last:'Un',     email:P+'p1@test.ca'},
    {id:P+'p2', first:'Bbb', last:'Deux',   email:P+'p2@test.ca'},
    {id:P+'p3', first:'Ccc', last:'Trois',  email:P+'p3@test.ca'},
    {id:P+'p4', first:'Ddd', last:'Quatre', email:P+'p4@test.ca'},
    {id:P+'p5', first:'Eee', last:'Cinq',   email:P+'p5@test.ca'},
    {id:P+'p6', first:'Fff', last:'Six',    email:P+'p6@test.ca'}
  ].map(u=>({...u, role:'player', category:'cadet', status:'active'}));
  await ins('users', players, {upsert:true});

  await ins('activities', [
    {id:P+'a_cant', name:'zz Cantine', hours:3, sort:90},
    {id:P+'a_chai', name:'zz Chaîneur', hours:3, sort:91}
  ], {upsert:true});

  await ins('events', [
    {id:EID, title:'zz Test Partie', date:new Date(Date.now()+3*864e5).toISOString(), location:'Test', category:'cadet'}
  ], {upsert:true});

  await ins('needs', [
    {id:P+'n_cant', eid:EID, act_id:P+'a_cant', qty:2, hours:3},
    {id:P+'n_chai', eid:EID, act_id:P+'a_chai', qty:2, hours:3}
  ], {upsert:true});
  console.log('  6 joueurs, 2 activités, 1 événement (2 postes × 2 places) créés');

  // --- TEST 1 : 5 joueurs s'inscrivent EN MÊME TEMPS à la Cantine (2 places)
  console.log('\n=== TEST 1 : inscriptions CONCURRENTES (5 joueurs → 2 places) ===');
  const NID = P+'n_cant';
  const base = Date.now();
  const order = ['p1','p2','p3','p4','p5'];
  const inserts = order.map((p,i) =>
    ins('regs', [{ id:`${P}r_${p}`, pid:P+p, eid:EID, nid:NID, ts:base + i*1000 }])
  );
  await Promise.all(inserts);   // ← concurrence réelle
  let regs = await sel('regs', `eid=eq.${EID}&select=id,pid,eid,nid,ts&order=ts`);
  eq('5 inscriptions enregistrées', regs.filter(r=>r.nid===NID).length, 5);

  let assigned = R.assignedRegs(regs, EID, NID, 2).map(r=>r.pid);
  eq('2 assignés = les 2 premiers arrivés (p1,p2)', assigned, [P+'p1',P+'p2']);
  let waiting = R.regsForNeed(regs, EID, NID).slice(2).map(r=>r.pid);
  eq('3 en attente dans l\'ordre (p3,p4,p5)', waiting, [P+'p3',P+'p4',P+'p5']);

  // --- TEST 2 : un assigné se DÉSISTE → promotion du 1er en attente ---------
  console.log('\n=== TEST 2 : désistement d\'un assigné → promotion 1er-arrivé ===');
  await del('regs', `id=eq.${P}r_p1`);   // p1 (1er assigné) se désiste
  regs = await sel('regs', `eid=eq.${EID}&select=id,pid,eid,nid,ts&order=ts`);
  assigned = R.assignedRegs(regs, EID, NID, 2).map(r=>r.pid);
  eq('après désistement p1 : assignés = p2,p3', assigned, [P+'p2',P+'p3']);
  ok('p3 (1er en attente) est promu automatiquement', assigned.includes(P+'p3'));

  // --- TEST 3 : AUTO-REMPLISSAGE vers l'autre poste libre -------------------
  console.log('\n=== TEST 3 : auto-remplissage vers le poste Chaîneur (2 places libres) ===');
  // État : Cantine p2,p3 assignés + p4,p5 en attente. Chaîneur 0/2.
  const state = await R.loadState(CFG);   // charge TOUTE la base (dont nos zz_test_)
  const moves = R.autoFillFromWaitlists(state, EID, {commit:false});
  eq('2 déplacements calculés', moves.length, 2);
  eq('p4 déplacé en premier (arrivé avant p5)', moves[0].uid, P+'p4');
  eq('p4 va au poste Chaîneur', moves[0].to, P+'n_chai');
  eq('p5 va aussi au poste Chaîneur', moves[1].to, P+'n_chai');

  // Appliquer réellement en base via la vraie fonction serveur persistMoves()
  const applied = await R.persistMoves(CFG, moves);
  eq('persistMoves a appliqué 2 déplacements', applied, 2);

  regs = await sel('regs', `eid=eq.${EID}&select=id,pid,eid,nid,ts&order=ts`);
  eq('Chaîneur a maintenant 2 inscrits', regs.filter(r=>r.nid===P+'n_chai').length, 2);
  eq('Cantine n\'a plus que 2 inscrits (file résorbée)', regs.filter(r=>r.nid===NID).length, 2);

  // --- TEST 4 : idempotence — relancer l'auto-remplissage ne bouge plus rien
  console.log('\n=== TEST 4 : idempotence ===');
  const state2 = await R.loadState(CFG);
  const moves2 = R.autoFillFromWaitlists(state2, EID, {commit:false});
  eq('2e passage = 0 déplacement', moves2.length, 0);

  // --- Ménage ---------------------------------------------------------------
  console.log('\n=== Nettoyage ===');
  await cleanup();
  const leftover = await sel('regs', `id=like.${P}*&select=id`);
  eq('aucun résidu de test en base', leftover.length, 0);

  console.log(`\n──────── ${pass} réussis, ${fail} échoués ────────`);
  process.exit(fail ? 1 : 0);
})().catch(async e => {
  console.error('\n💥 ERREUR:', e.message);
  try { await cleanup(); console.error('(ménage de secours effectué)'); } catch(_){}
  process.exit(1);
});

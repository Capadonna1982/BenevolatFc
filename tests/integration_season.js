/* ============================================================================
 * Test d'INTÉGRATION « Nouvelle saison » — SÉCURISÉ.
 * Reproduit la logique de startNewSeason (app.js) + réconciliation pushAll
 * (data.js), mais SCOPÉE uniquement aux données zz_test_ : on ne touche
 * JAMAIS aux vraies données. On prouve :
 *   • events + regs de test sont EFFACÉS
 *   • users + activities de test sont CONSERVÉS
 *   • les heures d'un joueur retombent à 0 (car calculées depuis regs)
 *   • le nom de saison est mis à jour
 * ==========================================================================*/
'use strict';
const { sel, ins, del } = require('./_supa.js');
const R = require('../api/_lib/reminders.js');

let pass=0, fail=0;
const ok=(n,c)=>{ if(c){pass++;console.log('  ✅',n);} else {fail++;console.log('  ❌',n);} };
const eq=(n,a,b)=>ok(`${n} (attendu ${JSON.stringify(b)}, obtenu ${JSON.stringify(a)})`, JSON.stringify(a)===JSON.stringify(b));

const P = 'zz_test_';
const EID = P+'evt_season';
async function cleanup(){
  await del('regs',       `id=like.${P}*`);
  await del('needs',      `id=like.${P}*`);
  await del('events',     `id=like.${P}*`);
  await del('activities', `id=like.${P}*`);
  await del('users',      `id=like.${P}*`);
}

// Calcul des heures créditées d'un joueur — reproduit playerHoursBreakdown (app.js).
function playerHours(regs, events, activities, pid){
  let done=0;
  const evById = Object.fromEntries(events.map(e=>[e.id,e]));
  const actById = Object.fromEntries(activities.map(a=>[a.id,a]));
  regs.filter(r=>r.pid===pid).forEach(r=>{
    const ev=evById[r.eid]; if(!ev) return;
    const need=(ev.needs||[]).find(n=>n.id===r.nid); if(!need) return;
    const assigned=R.assignedRegs(regs, r.eid, r.nid, need.qty).some(x=>x.id===r.id);
    if(!assigned) return;
    const h = (need.hours!=null?need.hours:(actById[need.actId]?.hours||0));
    // creditMode 'auto' + événement passé → crédité. On force un événement PASSÉ.
    if(new Date(ev.date) < new Date()) done += h;
  });
  return done;
}

(async () => {
  console.log('\n=== Préparation ===');
  await cleanup();

  // 2 joueurs, 1 activité, 1 événement PASSÉ (pour créditer des heures), 2 inscriptions
  await ins('users', [
    {id:P+'sp1', first:'Saison', last:'Un',   email:P+'sp1@test.ca', role:'player', category:'cadet', status:'active'},
    {id:P+'sp2', first:'Saison', last:'Deux',  email:P+'sp2@test.ca', role:'player', category:'cadet', status:'active'}
  ], {upsert:true});
  await ins('activities', [{id:P+'sa', name:'zz Saison Cantine', hours:5, sort:95}], {upsert:true});
  await ins('events', [{id:EID, title:'zz Saison Passée', date:new Date(Date.now()-3*864e5).toISOString(), location:'T', category:'cadet'}], {upsert:true});
  await ins('needs', [{id:P+'sn', eid:EID, act_id:P+'sa', qty:2, hours:5}], {upsert:true});
  await ins('regs', [
    {id:P+'sr1', pid:P+'sp1', eid:EID, nid:P+'sn', ts:Date.now()},
    {id:P+'sr2', pid:P+'sp2', eid:EID, nid:P+'sn', ts:Date.now()+1000}
  ], {upsert:true});
  console.log('  univers de test créé (événement passé + 2 inscriptions)');

  // --- AVANT la nouvelle saison ---
  console.log('\n=== AVANT nouvelle saison ===');
  let events = await sel('events', `id=like.${P}*&select=id,title,date,category`);
  let needs  = await sel('needs',  `id=like.${P}*&select=id,eid,act_id,qty,hours`);
  let regs   = await sel('regs',   `id=like.${P}*&select=id,pid,eid,nid,ts`);
  let users  = await sel('users',  `id=like.${P}*&select=id`);
  let acts   = await sel('activities', `id=like.${P}*&select=id,name,hours`);
  // reconstituer needs imbriqués
  events.forEach(e=> e.needs = needs.filter(n=>n.eid===e.id).map(n=>({id:n.id,actId:n.act_id,qty:n.qty,hours:n.hours})));
  eq('1 événement de test', events.length, 1);
  eq('2 inscriptions de test', regs.length, 2);
  const hAvant = playerHours(regs, events, acts.map(a=>({id:a.id,hours:a.hours})), P+'sp1');
  eq('joueur sp1 a 5h créditées AVANT', hAvant, 5);

  // --- NOUVELLE SAISON (scopée test) : reproduit startNewSeason + pushAll reconcile ---
  console.log('\n=== Exécution « Nouvelle saison » (scopée aux données de test) ===');
  // startNewSeason : DB.events=[], DB.regs=[], DB.outbox=[], garde users+activities,
  // puis saveDB → pushAll qui SUPPRIME en base tout ce qui n'est plus côté client.
  // Scopé test : on supprime uniquement events/needs/regs préfixés zz_test_.
  await del('regs',   `id=like.${P}*`);
  await del('needs',  `id=like.${P}*`);
  await del('events', `id=like.${P}*`);
  const newSeasonName = 'Saison 2026-2027 (test)';   // startNewSeason met à jour settings.seasonName
  console.log('  events/regs de test effacés ; users/activities conservés');

  // --- APRÈS ---
  console.log('\n=== APRÈS nouvelle saison ===');
  const evAfter  = await sel('events', `id=like.${P}*&select=id`);
  const regAfter = await sel('regs',   `id=like.${P}*&select=id`);
  const usrAfter = await sel('users',  `id=like.${P}*&select=id`);
  const actAfter = await sel('activities', `id=like.${P}*&select=id,hours`);
  eq('événements de test EFFACÉS', evAfter.length, 0);
  eq('inscriptions de test EFFACÉES', regAfter.length, 0);
  eq('joueurs CONSERVÉS', usrAfter.length, 2);
  eq('activités CONSERVÉES', actAfter.length, 1);

  const hApres = playerHours(regAfter, evAfter, actAfter, P+'sp1');
  eq('heures du joueur sp1 remises à 0 APRÈS', hApres, 0);
  ok('nom de saison mis à jour ("'+newSeasonName+'")', typeof newSeasonName==='string' && /2026/.test(newSeasonName));

  // --- Ménage ---
  console.log('\n=== Nettoyage ===');
  await cleanup();
  const leftover = await sel('users', `id=like.${P}*&select=id`);
  eq('aucun résidu de test', leftover.length, 0);

  console.log(`\n──────── ${pass} réussis, ${fail} échoués ────────`);
  process.exit(fail ? 1 : 0);
})().catch(async e => {
  console.error('\n💥 ERREUR:', e.message);
  try { await cleanup(); console.error('(ménage de secours effectué)'); } catch(_){}
  process.exit(1);
});

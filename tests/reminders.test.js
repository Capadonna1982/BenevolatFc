/* Tests purs de la logique serveur des rappels (aucun réseau). */
'use strict';
const R = require('../api/_lib/reminders.js');
let pass=0, fail=0;
function ok(name, cond){ if(cond){pass++; console.log('  ✅', name);} else {fail++; console.log('  ❌', name);} }
function eq(name, a, b){ ok(name + ` (attendu ${JSON.stringify(b)}, obtenu ${JSON.stringify(a)})`, JSON.stringify(a)===JSON.stringify(b)); }

// --- Données de test : Partie 2, calquées sur le seed --------------------
function makeState(){
  const now = Date.now();
  return {
    users: [
      {id:'u_sam', first:'Sam', last:'Côté', email:'sam@equipe.ca', role:'player'},
      {id:'u_jo',  first:'Jordan', last:'Lavoie', email:'jordan@equipe.ca', role:'player'},
      {id:'u_max', first:'Maxime', last:'Roy', email:'max@equipe.ca', role:'player'},
      {id:'u_lea', first:'Léa', last:'Gagnon', email:'lea@equipe.ca', role:'player'},
      {id:'u_noa', first:'Noah', last:'Fortin', email:'noah@equipe.ca', role:'player'},
      {id:'u_alex',first:'Alex', last:'Bergeron', email:'alex@equipe.ca', role:'player'}
    ],
    activities: [
      {id:'a_chai', name:'Chaîneur', hours:3, desc:'Tenir la chaîne.', instr:'Veste orange.'},
      {id:'a_marq', name:'Marqueur', hours:2, desc:'Feuille de pointage.', instr:''},
      {id:'a_cant', name:'Cantine', hours:3, desc:'Servir à la cantine.', instr:''},
      {id:'a_lav',  name:'Lavage maillots', hours:2, desc:'Laver les maillots.', instr:''}
    ],
    events: [{
      id:'e_p2', title:'Partie 2 — Domicile', date:new Date(now+4*864e5).toISOString(), location:'Stade municipal', category:'cadet',
      needs:[
        {id:'n1', actId:'a_chai', qty:2, hours:3, instr:'Côté banc.'},
        {id:'n2', actId:'a_marq', qty:1, hours:2, instr:''},
        {id:'n3', actId:'a_cant', qty:3, hours:3, instr:'Clés local B.'},
        {id:'n4', actId:'a_lav',  qty:1, hours:2, instr:''}
      ]
    }],
    // Cantine (n3) : 5 inscrits pour 3 places → 3 assignés + 2 en attente (lea, noa)
    // Chaîneur (n1) : 1 seul (alex) pour 2 places → 1 place libre
    regs: [
      {id:'r1', pid:'u_sam', eid:'e_p2', nid:'n3', ts:now-500000},
      {id:'r2', pid:'u_jo',  eid:'e_p2', nid:'n3', ts:now-400000},
      {id:'r3', pid:'u_max', eid:'e_p2', nid:'n3', ts:now-300000},
      {id:'r4', pid:'u_lea', eid:'e_p2', nid:'n3', ts:now-200000},
      {id:'r5', pid:'u_noa', eid:'e_p2', nid:'n3', ts:now-100000},
      {id:'r6', pid:'u_alex',eid:'e_p2', nid:'n1', ts:now-450000}
    ]
  };
}

console.log('\n=== Auto-remplissage (aperçu, sans commit) ===');
let s = makeState();
let preview = R.autoFillFromWaitlists(s, 'e_p2', {commit:false});
// Places libres : n1 (chaîneur) 1 place, n2 (marqueur) 1, n4 (lavage) 1 = 3 places.
// En attente : lea (r4), noa (r5) — les 2 derniers de la cantine. → 2 déplacements.
eq('nombre de déplacements', preview.length, 2);
eq('1er déplacé = Léa (arrivée avant Noah)', preview[0].uid, 'u_lea');
eq('Léa va vers le 1er poste libre = chaîneur (n1)', preview[0].to, 'n1');
eq('2e déplacé = Noah', preview[1].uid, 'u_noa');
eq('Noah va vers le poste libre suivant = marqueur (n2)', preview[1].to, 'n2');
// L'aperçu ne modifie rien :
eq('aperçu ne modifie pas les regs (Léa toujours en n3)', s.regs.find(r=>r.pid==='u_lea').nid, 'n3');

console.log('\n=== Auto-remplissage (commit) ===');
s = makeState();
let moves = R.autoFillFromWaitlists(s, 'e_p2', {commit:true});
eq('2 déplacements appliqués', moves.length, 2);
eq('Léa est maintenant chaîneur (n1)', s.regs.find(r=>r.pid==='u_lea').nid, 'n1');
eq('Noah est maintenant marqueur (n2)', s.regs.find(r=>r.pid==='u_noa').nid, 'n2');
eq('Léa conserve son ts d\'origine (équité)', s.regs.find(r=>r.pid==='u_lea').ts, makeState().regs.find(r=>r.pid==='u_lea').ts);
// Idempotence : relancer ne fait plus rien
let again = R.autoFillFromWaitlists(s, 'e_p2', {commit:true});
eq('idempotent : 2e passage = 0 déplacement', again.length, 0);
// Le lavage (n4) reste libre car plus personne en attente
eq('lavage (n4) toujours 0 inscrit', R.regsForNeed(s.regs,'e_p2','n4').length, 0);

console.log('\n=== Construction des courriels (après auto-remplissage) ===');
const mails = R.buildEventReminders(s, 'e_p2');
// Places tenues : cantine 3 (sam,jo,max) + chaîneur 2 (alex,lea) + marqueur 1 (noa) = 6
eq('6 courriels (toutes les places tenues)', mails.length, 6);
ok('Léa reçoit un courriel Chaîneur', mails.some(m=>m.toName==='Léa Gagnon' && m.activityName==='Chaîneur'));
ok('Noah reçoit un courriel Marqueur', mails.some(m=>m.toName==='Noah Fortin' && m.activityName==='Marqueur'));
ok('personne en attente ne reçoit de courriel (aucun doublon)', new Set(mails.map(m=>m.to)).size===mails.length);

console.log('\n=== Rendu HTML/texte d\'un courriel ===');
const one = mails.find(m=>m.toName==='Léa Gagnon');
const rendered = R.renderEmail(one, {appUrl:'https://exemple.app'});
ok('sujet contient le titre de l\'événement', /Partie 2/.test(rendered.subject));
ok('HTML contient le nom du destinataire', rendered.html.includes('Léa Gagnon'));
ok('HTML contient le poste (Chaîneur)', rendered.html.includes('Chaîneur'));
ok('HTML contient le bouton app', rendered.html.includes('https://exemple.app'));
ok('version texte présente', rendered.text.includes('Chaîneur'));

console.log('\n=== isSameDay / eventsOnDay ===');
ok('même jour (Toronto)', R.isSameDay('2026-09-09T18:00:00Z','2026-09-09T23:00:00Z','America/Toronto'));
ok('jours différents', !R.isSameDay('2026-09-09T18:00:00Z','2026-09-10T18:00:00Z','America/Toronto'));

console.log(`\n──────── ${pass} réussis, ${fail} échoués ────────`);
process.exit(fail ? 1 : 0);

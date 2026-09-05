/* ============================================================================
 * Bénévolat FC — Logique serveur des rappels courriel (partagée + testable)
 * ----------------------------------------------------------------------------
 * Ce module NE dépend d'aucune librairie externe (fetch natif Node 18+).
 * Il est utilisé par la fonction serverless /api/send-reminders.js ET par les
 * tests Node (tests/reminders.test.js).
 *
 * Rôle :
 *   1) charger l'état depuis Supabase (REST / PostgREST)
 *   2) reproduire l'auto-remplissage « 1er arrivé, 1er servi » (comme app.js)
 *   3) construire la liste des courriels à envoyer pour un/des événement(s)
 *   4) rendre le HTML d'un courriel (identique en esprit à emailBodyHTML)
 *
 * Les fonctions de calcul (autoFill, buildReminders, renderEmail, isSameDay…)
 * sont PURES : elles prennent des données en argument et ne touchent au réseau
 * que via loadState()/persistMoves()/sendViaResend() clairement isolées.
 * ==========================================================================*/
'use strict';

/* ------------------------------------------------------------------ */
/* Utilitaires                                                         */
/* ------------------------------------------------------------------ */
function esc(s){
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function fullName(u){ return ((u.first||'') + ' ' + (u.last||'')).trim(); }

// Formatte une date ISO en français lisible : « mardi 9 septembre 2026, 18 h 00 ».
function fmtDateFR(iso){
  try {
    const d = new Date(iso);
    const date = new Intl.DateTimeFormat('fr-CA', {
      weekday:'long', day:'numeric', month:'long', year:'numeric', timeZone:'America/Toronto'
    }).format(d);
    const heure = new Intl.DateTimeFormat('fr-CA', {
      hour:'2-digit', minute:'2-digit', hour12:false, timeZone:'America/Toronto'
    }).format(d).replace(':', ' h ');
    return `${date}, ${heure}`;
  } catch(_) { return String(iso); }
}

// Deux dates tombent-elles le même jour civil dans un fuseau donné ?
function isSameDay(isoA, isoB, tz){
  tz = tz || 'America/Toronto';
  const fmt = new Intl.DateTimeFormat('en-CA', { year:'numeric', month:'2-digit', day:'2-digit', timeZone:tz });
  return fmt.format(new Date(isoA)) === fmt.format(new Date(isoB));
}

/* ------------------------------------------------------------------ */
/* Modèle : tri des inscriptions + assigné vs attente (comme app.js)   */
/* ------------------------------------------------------------------ */
// Inscriptions pour un poste (need), triées par ordre d'arrivée (ts croissant).
function regsForNeed(regs, eid, nid){
  return regs.filter(r => r.eid === eid && r.nid === nid).sort((a,b) => a.ts - b.ts);
}
// Les `qty` premières inscriptions d'un poste = personnes ASSIGNÉES (places tenues).
function assignedRegs(regs, eid, nid, qty){
  return regsForNeed(regs, eid, nid).slice(0, qty);
}
// Places encore libres pour un poste (>= 0).
function openCount(regs, eid, need){
  return Math.max(0, (need.qty || 1) - regsForNeed(regs, eid, need.id).length);
}
// Une inscription est-elle « en attente » (au-delà de qty pour son poste) ?
function isWaitingReg(state, reg){
  const ev = state.events.find(e => e.id === reg.eid); if(!ev || !ev.needs) return false;
  const need = ev.needs.find(n => n.id === reg.nid);   if(!need) return false;
  const idx = regsForNeed(state.regs, reg.eid, reg.nid).findIndex(r => r.id === reg.id);
  return idx >= (need.qty || 1);
}

/* ------------------------------------------------------------------ */
/* Auto-remplissage « 1er arrivé, 1er servi » (miroir de app.js)       */
/* ------------------------------------------------------------------ */
// Calcule (et applique en mémoire si commit) les déplacements
// candidat-en-attente → place-libre, pour un événement donné.
// Retourne [{regId, uid, from, to}].
function autoFillFromWaitlists(state, eid, opts){
  opts = opts || {}; const commit = opts.commit !== false;
  const ev = state.events.find(e => e.id === eid); if(!ev || !ev.needs) return [];
  const moves = [];
  const openByNeed = {}; ev.needs.forEach(n => { openByNeed[n.id] = openCount(state.regs, eid, n); });
  const waiting = state.regs.filter(r => r.eid === eid && isWaitingReg(state, r)).sort((a,b) => a.ts - b.ts);
  waiting.forEach(function(reg){
    const target = ev.needs.find(n => n.id !== reg.nid && openByNeed[n.id] > 0);
    if(!target) return;
    moves.push({ regId: reg.id, uid: reg.pid, from: reg.nid, to: target.id });
    openByNeed[target.id]--;
    if(commit){ reg.nid = target.id; }   // on conserve le ts d'origine (équité)
  });
  return moves;
}

/* ------------------------------------------------------------------ */
/* Construction des courriels de rappel pour un événement              */
/* ------------------------------------------------------------------ */
function buildEventReminders(state, eid){
  const e = state.events.find(ev => ev.id === eid); if(!e) return [];
  const out = [];
  (e.needs || []).forEach(n => {
    const act = state.activities.find(a => a.id === n.actId); if(!act) return;
    // seules les places TENUES (assignées) reçoivent un rappel — pas la liste d'attente
    assignedRegs(state.regs, eid, n.id, n.qty).forEach(r => {
      const vol = state.users.find(u => u.id === r.pid); if(!vol) return;
      const email = vol.email || ''; if(!email) return;
      out.push({
        eid, nid: n.id,
        to: email, toName: fullName(vol), role: vol.role,
        eventTitle: e.title, eventDate: e.date, location: e.location || '',
        activityName: act.name, jobDesc: act.desc || act.descr || '', instr: n.instr || act.instr || '',
        hours: n.hours || 0
      });
    });
  });
  return out;
}

// Rendu HTML complet du courriel (autoportant, pour un vrai envoi).
function renderEmail(m, opts){
  opts = opts || {};
  const appUrl = opts.appUrl || '';
  const subject = `Rappel bénévolat — ${m.eventTitle}`;
  const rows = [
    ['Ton poste', esc(m.activityName) + (m.hours ? ` · ${m.hours} h` : '')],
    ['Date',      esc(fmtDateFR(m.eventDate))],
    ['Lieu',      esc(m.location || '—')],
    ['Description', m.jobDesc ? esc(m.jobDesc) : '—'],
    ['Consignes', m.instr ? esc(m.instr) : '—']
  ];
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f1f5f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="background:#0f172a;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
      <div style="font-size:18px;font-weight:700">⚽ Bénévolat — Équipe de football</div>
    </div>
    <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none">
      <p style="margin:0 0 12px">Bonjour ${esc(m.toName)},</p>
      <p style="margin:0 0 16px">Voici un rappel pour ta tâche de bénévolat à l'événement <strong>${esc(m.eventTitle)}</strong> aujourd'hui.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${rows.map(([k,v]) => `<tr>
          <th style="text-align:left;padding:8px 10px;background:#f8fafc;border:1px solid #e2e8f0;width:130px;vertical-align:top">${k}</th>
          <td style="padding:8px 10px;border:1px solid #e2e8f0">${v}</td></tr>`).join('')}
      </table>
      <p style="margin:16px 0 0">Merci pour ton implication ! 🙌<br>— L'équipe des bénévoles</p>
      ${appUrl ? `<p style="margin:20px 0 0"><a href="${esc(appUrl)}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600">Ouvrir l'application</a></p>` : ''}
    </div>
    <p style="color:#94a3b8;font-size:12px;text-align:center;margin:16px 0 0">Ce courriel a été envoyé automatiquement le matin de l'événement.</p>
  </div>
</body></html>`;
  const text =
`Bonjour ${m.toName},

Rappel pour ta tâche de bénévolat à l'événement « ${m.eventTitle} » aujourd'hui.

Ton poste : ${m.activityName}${m.hours ? ' · ' + m.hours + ' h' : ''}
Date : ${fmtDateFR(m.eventDate)}
Lieu : ${m.location || '—'}
Description : ${m.jobDesc || '—'}
Consignes : ${m.instr || '—'}

Merci pour ton implication !
— L'équipe des bénévoles`;
  return { subject, html, text };
}

/* ------------------------------------------------------------------ */
/* Accès réseau — Supabase REST (isolé pour rester testable)           */
/* ------------------------------------------------------------------ */
function supaHeaders(key){
  return { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
}

// Charge tout l'état nécessaire depuis Supabase et reconstruit les needs imbriqués.
async function loadState(cfg){
  const base = cfg.supabaseUrl.replace(/\/$/, '') + '/rest/v1';
  const h = supaHeaders(cfg.supabaseKey);
  const get = async (path) => {
    const res = await fetch(`${base}/${path}`, { headers: h });
    if(!res.ok) throw new Error(`Supabase GET ${path} → ${res.status} ${await res.text()}`);
    return res.json();
  };
  const [users, activities, events, needs, regs] = await Promise.all([
    get('users?select=*'),
    get('activities?select=*'),
    get('events?select=*'),
    get('needs?select=*'),
    get('regs?select=*')
  ]);
  // Reconvertir colonnes SQL → forme JS + imbriquer les needs.
  const acts = activities.map(a => ({ id:a.id, name:a.name, hours:Number(a.hours), color:a.color, desc:a.descr, instr:a.instr }));
  const evs  = events.map(e => ({ id:e.id, title:e.title, date:e.date, location:e.location, category:e.category, needs:[] }));
  const byEvent = {};
  needs.forEach(n => { (byEvent[n.eid] = byEvent[n.eid] || []).push({ id:n.id, actId:n.act_id, qty:Number(n.qty), hours:Number(n.hours), instr:n.instr }); });
  evs.forEach(e => { e.needs = byEvent[e.id] || []; });
  const rgs = regs.map(r => ({ id:r.id, pid:r.pid, eid:r.eid, nid:r.nid, ts:Number(r.ts), present:r.present }));
  return { users, activities: acts, events: evs, regs: rgs };
}

// Persiste les déplacements d'auto-remplissage (nid mis à jour) dans Supabase.
async function persistMoves(cfg, moves){
  if(!moves || !moves.length) return 0;
  const base = cfg.supabaseUrl.replace(/\/$/, '') + '/rest/v1';
  const h = supaHeaders(cfg.supabaseKey);
  let n = 0;
  for(const mv of moves){
    const res = await fetch(`${base}/regs?id=eq.${encodeURIComponent(mv.regId)}`, {
      method:'PATCH', headers: h, body: JSON.stringify({ nid: mv.to })
    });
    if(!res.ok) throw new Error(`Supabase PATCH regs ${mv.regId} → ${res.status} ${await res.text()}`);
    n++;
  }
  return n;
}

/* ------------------------------------------------------------------ */
/* Envoi via Resend (REST, sans SDK)                                   */
/* ------------------------------------------------------------------ */
async function sendViaResend(cfg, mail){
  const res = await fetch('https://api.resend.com/emails', {
    method:'POST',
    headers:{ Authorization:`Bearer ${cfg.resendKey}`, 'Content-Type':'application/json' },
    body: JSON.stringify({
      from: cfg.fromEmail,
      to: [mail.to],
      subject: mail.subject,
      html: mail.html,
      text: mail.text
    })
  });
  const bodyText = await res.text();
  if(!res.ok) throw new Error(`Resend → ${res.status} ${bodyText}`);
  let id = null; try { id = JSON.parse(bodyText).id; } catch(_){}
  return { id };
}

/* ------------------------------------------------------------------ */
/* Orchestration : quels événements aujourd'hui + envoi                */
/* ------------------------------------------------------------------ */
// Sélectionne les événements qui ont lieu « le jour de référence » (défaut : maintenant).
function eventsOnDay(state, refDate, tz){
  const ref = refDate ? new Date(refDate) : new Date();
  return state.events.filter(e => isSameDay(e.date, ref.toISOString(), tz));
}

module.exports = {
  esc, fullName, fmtDateFR, isSameDay,
  regsForNeed, assignedRegs, openCount, isWaitingReg,
  autoFillFromWaitlists, buildEventReminders, renderEmail,
  loadState, persistMoves, sendViaResend, eventsOnDay
};

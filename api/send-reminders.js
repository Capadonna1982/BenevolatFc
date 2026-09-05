/* ============================================================================
 * Bénévolat FC — Fonction serverless : envoi RÉEL des rappels du matin
 * ----------------------------------------------------------------------------
 * Déclenchée de 2 façons :
 *   1) Automatiquement par le CRON Vercel (voir vercel.json → "crons"),
 *      chaque matin ; envoie les rappels des événements du JOUR.
 *   2) Manuellement (test) : GET/POST /api/send-reminders?token=...&eid=e_p2
 *      ou ...&date=2026-09-09 pour cibler un jour précis, &dry=1 pour simuler.
 *
 * Sécurité : protégé par un jeton secret CRON_SECRET (query ?token= ou entête
 *   Authorization: Bearer). Le CRON Vercel envoie automatiquement l'entête.
 *
 * Variables d'environnement attendues (Vercel → Settings → Environment Variables) :
 *   SUPABASE_URL           (ex. https://xxxx.supabase.co)
 *   SUPABASE_SERVICE_KEY   (clé « service_role » — reste secrète côté serveur)
 *   RESEND_API_KEY         (clé API Resend)
 *   REMINDER_FROM          (ex. "Bénévolat FC <no-reply@ton-domaine.ca>")
 *   CRON_SECRET            (chaîne secrète que tu choisis)
 *   APP_URL                (optionnel — lien « Ouvrir l'application » dans le courriel)
 *   REMINDER_TZ            (optionnel — défaut America/Toronto)
 * ==========================================================================*/
'use strict';

const R = require('./_lib/reminders.js');

function readEnv(){
  return {
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseKey: process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '',
    resendKey:   process.env.RESEND_API_KEY || '',
    fromEmail:   process.env.REMINDER_FROM || 'Bénévolat FC <onboarding@resend.dev>',
    cronSecret:  process.env.CRON_SECRET || '',
    appUrl:      process.env.APP_URL || '',
    tz:          process.env.REMINDER_TZ || 'America/Toronto'
  };
}

function isAuthorized(req, cfg){
  if(!cfg.cronSecret) return true; // si non configuré, on n'impose pas (dev)
  const auth = req.headers && (req.headers.authorization || req.headers.Authorization);
  if(auth && auth === `Bearer ${cfg.cronSecret}`) return true;
  const url = new URL(req.url, 'http://localhost');
  if(url.searchParams.get('token') === cfg.cronSecret) return true;
  return false;
}

module.exports = async function handler(req, res){
  const cfg = readEnv();
  const json = (code, obj) => { res.statusCode = code; res.setHeader('Content-Type','application/json; charset=utf-8'); res.end(JSON.stringify(obj, null, 2)); };

  try {
    if(!isAuthorized(req, cfg)) return json(401, { ok:false, error:'Non autorisé (jeton manquant ou invalide).' });
    if(!cfg.supabaseUrl || !cfg.supabaseKey) return json(500, { ok:false, error:'Configuration Supabase manquante (SUPABASE_URL / SUPABASE_SERVICE_KEY).' });

    const url = new URL(req.url, 'http://localhost');
    const dry = url.searchParams.get('dry') === '1' || url.searchParams.get('dry') === 'true';
    const forcedEid = url.searchParams.get('eid');       // cibler un événement précis
    const forcedDate = url.searchParams.get('date');     // cibler un jour précis (YYYY-MM-DD)

    // 1) Charger l'état
    const state = await R.loadState(cfg);

    // 2) Déterminer les événements à traiter
    let targetEvents;
    if(forcedEid){
      targetEvents = state.events.filter(e => e.id === forcedEid);
    } else {
      const ref = forcedDate ? new Date(forcedDate + 'T12:00:00') : new Date();
      targetEvents = R.eventsOnDay(state, ref.toISOString(), cfg.tz);
    }

    if(!targetEvents.length) return json(200, { ok:true, sent:0, message:'Aucun événement à traiter pour ce jour.', when:new Date().toISOString() });

    // 3) Pour chaque événement : auto-remplissage → construire → envoyer
    const report = [];
    let totalSent = 0, totalMoves = 0;
    for(const ev of targetEvents){
      const moves = R.autoFillFromWaitlists(state, ev.id, { commit:true });
      if(moves.length && !dry){ await R.persistMoves(cfg, moves); }
      totalMoves += moves.length;

      const mails = R.buildEventReminders(state, ev.id);
      const evReport = { eid:ev.id, title:ev.title, date:ev.date, autoFilled:moves.length, recipients:[] };
      for(const m of mails){
        const rendered = R.renderEmail(m, { appUrl: cfg.appUrl });
        if(dry || !cfg.resendKey){
          evReport.recipients.push({ to:m.to, activity:m.activityName, sent:false, simulated:true });
        } else {
          try {
            const r = await R.sendViaResend(cfg, { to:m.to, subject:rendered.subject, html:rendered.html, text:rendered.text });
            evReport.recipients.push({ to:m.to, activity:m.activityName, sent:true, id:r.id });
            totalSent++;
          } catch(err){
            evReport.recipients.push({ to:m.to, activity:m.activityName, sent:false, error:String(err.message||err) });
          }
        }
      }
      report.push(evReport);
    }

    return json(200, {
      ok:true, dry, sent:totalSent, autoFilled:totalMoves,
      events:report.length, report, when:new Date().toISOString(),
      note: (!cfg.resendKey && !dry) ? 'RESEND_API_KEY absent → envois simulés.' : undefined
    });
  } catch(err){
    return json(500, { ok:false, error:String(err && err.message || err) });
  }
};

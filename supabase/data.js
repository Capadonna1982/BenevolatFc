/* ============================================================================
 * Bénévolat FC — Couche d'accès aux données (Supabase, côté navigateur)
 * ----------------------------------------------------------------------------
 * Rôle : parler directement à Supabase et convertir entre :
 *   • la forme SQL (colonnes snake_case, needs = table séparée)
 *   • la forme JS attendue par app.js (camelCase, needs imbriqués dans events)
 *
 * Expose l'objet global `Data` :
 *   Data.enabled                         → true si Supabase est configuré
 *   await Data.loadAll()                 → { settings, users, activities, events(+needs), regs }
 *   await Data.insert(entity, jsObj)     → crée une ligne
 *   await Data.update(entity, id, patch) → met à jour une ligne (patch en forme JS)
 *   await Data.remove(entity, id)        → supprime une ligne
 *   await Data.saveSettings(jsSettings)  → upsert de la ligne settings (id=1)
 *   Data.subscribe(onChange)            → abonnement Realtime (renvoie une fn d'arrêt)
 *
 * `entity` ∈ 'users' | 'activities' | 'events' | 'needs' | 'regs'
 * Toutes les fonctions renvoient des objets déjà reconvertis en forme JS.
 * ==========================================================================*/
(function(){
  "use strict";

  const enabled = () => !!window.SUPA_ENABLED && !!window.supa;

  /* ----------------------- Mappage SQL → JS ------------------------------- */
  const fromRow = {
    settings: r => ({ hoursGoal: Number(r.hours_goal), creditMode: r.credit_mode,
                      withdrawHours: Number(r.withdraw_hours), logo: r.logo || null,
                      seasonName: r.season_name || '' }),
    users: r => {
      const u = { id:r.id, first:r.first, last:r.last, email:r.email, pass:r.pass,
                  role:r.role, status:r.status };
      if(r.category)    u.category   = r.category;
      if(r.invite_code) u.inviteCode = r.invite_code;
      return u;
    },
    activities: r => {
      const a = { id:r.id, name:r.name, hours:Number(r.hours), color:r.color };
      if(r.descr != null) a.desc  = r.descr;
      if(r.instr != null) a.instr = r.instr;
      return a;
    },
    events: r => ({ id:r.id, title:r.title, date:r.date, location:r.location,
                    category:r.category || null, needs:[] }),
    needs: r => {
      const n = { id:r.id, actId:r.act_id, qty:Number(r.qty), hours:Number(r.hours) };
      if(r.instr != null) n.instr = r.instr;
      return n;
    },
    regs: r => ({ id:r.id, pid:r.pid, eid:r.eid, nid:r.nid,
                  ts:Number(r.ts), present:(r.present===undefined?null:r.present) })
  };

  /* ----------------------- Mappage JS → SQL ------------------------------- */
  const toRow = {
    settings: o => clean({ id:1, hours_goal:o.hoursGoal, credit_mode:o.creditMode, season_name:o.seasonName||'',
                           withdraw_hours:o.withdrawHours, logo:o.logo ?? null,
                           updated_at:new Date().toISOString() }),
    users: o => clean({ id:o.id, first:o.first, last:o.last, email:o.email, pass:o.pass ?? null,
                        role:o.role, category:o.category ?? null,
                        status:o.status || 'active', invite_code:o.inviteCode ?? null }),
    activities: o => clean({ id:o.id, name:o.name, hours:o.hours ?? 0, color:o.color ?? null,
                             descr:o.desc ?? null, instr:o.instr ?? null, sort:o.sort ?? 0 }),
    events: o => clean({ id:o.id, title:o.title, date:o.date, location:o.location ?? null,
                         category:o.category ?? null }),
    needs: o => clean({ id:o.id, eid:o.eid, act_id:o.actId, qty:o.qty ?? 1,
                        hours:o.hours ?? 0, instr:o.instr ?? null }),
    regs: o => clean({ id:o.id, pid:o.pid, eid:o.eid, nid:o.nid, ts:o.ts,
                       present:(o.present===undefined?null:o.present) })
  };

  // Retire les clés `undefined` (mais garde les `null` volontaires).
  function clean(obj){
    Object.keys(obj).forEach(k => { if(obj[k] === undefined) delete obj[k]; });
    return obj;
  }

  const TABLE = { settings:'settings', users:'users', activities:'activities',
                  events:'events', needs:'needs', regs:'regs' };

  // Traduction clé JS → colonne SQL (pour les mises à jour PARTIELLES, sans défauts).
  const KEYMAP = {
    settings:  { hoursGoal:'hours_goal', creditMode:'credit_mode', withdrawHours:'withdraw_hours', logo:'logo', seasonName:'season_name' },
    users:     { first:'first', last:'last', email:'email', pass:'pass', role:'role',
                 category:'category', status:'status', inviteCode:'invite_code' },
    activities:{ name:'name', hours:'hours', color:'color', desc:'descr', instr:'instr', sort:'sort' },
    events:    { title:'title', date:'date', location:'location', category:'category' },
    needs:     { eid:'eid', actId:'act_id', qty:'qty', hours:'hours', instr:'instr' },
    regs:      { pid:'pid', eid:'eid', nid:'nid', ts:'ts', present:'present' }
  };

  // Ne convertit QUE les clés présentes dans le patch (aucune valeur par défaut injectée).
  function toRowPartial(entity, patchJs){
    const map = KEYMAP[entity], out = {};
    Object.keys(patchJs).forEach(k => {
      if(k === 'id') return;
      if(map[k]) out[map[k]] = patchJs[k];
    });
    return out;
  }

  function assertOk(res, ctx){
    if(res.error){ console.error('[Data] '+ctx, res.error); throw res.error; }
    return res.data;
  }

  /* ----------------------- Chargement complet ----------------------------- */
  async function loadAll(){
    if(!enabled()) throw new Error('Supabase non configuré');
    const [st, us, ac, ev, nd, rg] = await Promise.all([
      window.supa.from('settings').select('*').eq('id',1).maybeSingle(),
      window.supa.from('users').select('*'),
      window.supa.from('activities').select('*').order('sort',{ascending:true}),
      window.supa.from('events').select('*').order('date',{ascending:true}),
      window.supa.from('needs').select('*'),
      window.supa.from('regs').select('*')
    ]);
    const settings   = st.data ? fromRow.settings(st.data)
                               : { hoursGoal:15, creditMode:'approval', withdrawHours:48, logo:null, seasonName:'' };
    const users      = (assertOk(us,'load users')      || []).map(fromRow.users);
    const activities = (assertOk(ac,'load activities') || []).map(fromRow.activities);
    const events     = (assertOk(ev,'load events')     || []).map(fromRow.events);
    // Reconstituer les needs imbriqués dans chaque event (groupés par eid) :
    const needRows = assertOk(nd,'load needs') || [];
    const byEvent = {};
    needRows.forEach(r => { (byEvent[r.eid] = byEvent[r.eid] || []).push(fromRow.needs(r)); });
    events.forEach(e => { e.needs = byEvent[e.id] || []; });
    const regs       = (assertOk(rg,'load regs') || []).map(fromRow.regs);
    return { settings, users, activities, events, regs, outbox:[] };
  }

  /* ----------------------- CRUD par entité -------------------------------- */
  async function insert(entity, jsObj){
    if(!enabled()) throw new Error('Supabase non configuré');
    const row = toRow[entity](jsObj);
    const data = assertOk(await window.supa.from(TABLE[entity]).insert(row).select(), 'insert '+entity);
    return data && data[0] ? fromRow[entity](data[0]) : jsObj;
  }

  async function update(entity, id, patchJs){
    if(!enabled()) throw new Error('Supabase non configuré');
    // patchJs est en forme JS partielle → on ne convertit QUE les clés fournies.
    const partial = toRowPartial(entity, patchJs);
    if(entity === 'settings') partial.updated_at = new Date().toISOString();
    const data = assertOk(await window.supa.from(TABLE[entity]).update(partial).eq('id', id).select(), 'update '+entity);
    return data && data[0] ? fromRow[entity](data[0]) : null;
  }

  async function remove(entity, id){
    if(!enabled()) throw new Error('Supabase non configuré');
    assertOk(await window.supa.from(TABLE[entity]).delete().eq('id', id), 'remove '+entity);
    return true;
  }

  async function saveSettings(jsSettings){
    if(!enabled()) throw new Error('Supabase non configuré');
    const row = toRow.settings(jsSettings);
    const data = assertOk(await window.supa.from('settings').upsert(row).select(), 'saveSettings');
    return data && data[0] ? fromRow.settings(data[0]) : jsSettings;
  }

  /* ----------------------- Miroir complet (pushAll) ----------------------- */
  // Reflète tout l'état JS `DB` vers Supabase : upsert de chaque entité + suppression
  // des lignes qui n'existent plus côté client. Simple et robuste pour une démo.
  async function pushAll(DB){
    if(!enabled()) throw new Error('Supabase non configuré');
    // 1) settings (ligne unique)
    await saveSettings(DB.settings || {});
    // 2) upserts par entité (events + needs aplatis)
    const flatNeeds = [];
    (DB.events||[]).forEach(e => (e.needs||[]).forEach(n => flatNeeds.push(toRow.needs(Object.assign({}, n, {eid:e.id})))));
    const sets = [
      ['users',      (DB.users||[]).map(toRow.users)],
      ['activities', (DB.activities||[]).map(toRow.activities)],
      ['events',     (DB.events||[]).map(e => toRow.events(e))],
      ['needs',      flatNeeds],
      ['regs',       (DB.regs||[]).map(toRow.regs)]
    ];
    for(const [entity, rows] of sets){
      if(rows.length) assertOk(await window.supa.from(TABLE[entity]).upsert(rows), 'pushAll upsert '+entity);
    }
    // 3) réconciliation des suppressions : retirer en base ce qui n'est plus côté client
    const keep = {
      users:(DB.users||[]).map(x=>x.id), activities:(DB.activities||[]).map(x=>x.id),
      events:(DB.events||[]).map(x=>x.id), needs:flatNeeds.map(x=>x.id), regs:(DB.regs||[]).map(x=>x.id)
    };
    for(const entity of ['regs','needs','events','activities','users']){
      const ids = keep[entity];
      let q = window.supa.from(TABLE[entity]).delete();
      q = ids.length ? q.not('id','in','('+ids.map(quote).join(',')+')') : q.neq('id','__none__');
      assertOk(await q, 'pushAll reconcile '+entity);
    }
    return true;
  }
  function quote(v){ return '"'+String(v).replace(/"/g,'')+'"'; }

  /* ----------------------- Realtime --------------------------------------- */
  // onChange(table, eventType, newRowJs, oldRowJs) — appelé à chaque changement.
  function subscribe(onChange){
    if(!enabled()) return function(){};
    const ch = window.supa.channel('benevolat-fc-changes');
    Object.keys(TABLE).forEach(entity => {
      ch.on('postgres_changes', { event:'*', schema:'public', table:TABLE[entity] }, payload => {
        try {
          const map = fromRow[entity];
          const nw  = payload.new && Object.keys(payload.new).length ? map(payload.new) : null;
          const od  = payload.old && Object.keys(payload.old).length ? map(payload.old) : null;
          onChange(entity, payload.eventType, nw, od);
        } catch(e){ console.error('[Data] realtime map', entity, e); }
      });
    });
    ch.subscribe(status => {
      if(status === 'SUBSCRIBED') console.info('[Bénévolat FC] Realtime abonné ✓');
    });
    return function unsubscribe(){ try { window.supa.removeChannel(ch); } catch(_){} };
  }

  window.Data = {
    get enabled(){ return enabled(); },
    loadAll, insert, update, remove, saveSettings, subscribe, pushAll,
    _fromRow: fromRow, _toRow: toRow, _toRowPartial: toRowPartial   // exposés pour les tests
  };
})();

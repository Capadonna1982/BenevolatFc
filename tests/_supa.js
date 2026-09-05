/* Petit client Supabase REST pour les tests d'intégration (Node 18+, fetch natif). */
'use strict';
const URL = "https://tjdzqlzthxtrmetfadmy.supabase.co";
const KEY = "sb_publishable_uoMfS5tc0AGtLYtsOoB4sQ_12XIo_0g";
const H = { 'apikey':KEY, 'Authorization':`Bearer ${KEY}`, 'Content-Type':'application/json' };

async function sel(table, query=''){
  const r = await fetch(`${URL}/rest/v1/${table}?${query}`, { headers:H });
  if(!r.ok) throw new Error(`SELECT ${table} → ${r.status} ${await r.text()}`);
  return r.json();
}
async function ins(table, rows, opts={}){
  const pref = opts.upsert ? 'resolution=merge-duplicates,return=representation' : 'return=representation';
  const r = await fetch(`${URL}/rest/v1/${table}`, { method:'POST', headers:{...H,'Prefer':pref}, body:JSON.stringify(rows) });
  if(!r.ok) throw new Error(`INSERT ${table} → ${r.status} ${await r.text()}`);
  return r.json();
}
async function del(table, query){
  const r = await fetch(`${URL}/rest/v1/${table}?${query}`, { method:'DELETE', headers:{...H,'Prefer':'return=representation'} });
  if(!r.ok) throw new Error(`DELETE ${table} → ${r.status} ${await r.text()}`);
  return r.json();
}
module.exports = { URL, KEY, sel, ins, del };

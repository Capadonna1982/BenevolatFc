/* ============================================================================
 * Bénévolat FC — Configuration Supabase (côté navigateur)
 * ----------------------------------------------------------------------------
 * COMMENT REMPLIR :
 *   1. Va sur ton projet Supabase → Settings → API
 *   2. Copie « Project URL »          → SUPABASE_URL
 *   3. Copie la clé « anon public »   → SUPABASE_ANON_KEY
 *
 * Ces deux valeurs sont PUBLIQUES par conception (la sécurité passe par les
 * règles RLS définies dans schema.sql). Il n'y a AUCUN secret ici.
 *
 * Si les deux champs restent vides, l'app bascule automatiquement en mode
 * « démo hors-ligne » (localStorage), exactement comme avant.
 * ==========================================================================*/
window.SUPABASE_URL      = "https://tjdzqlzthxtrmetfadmy.supabase.co";
window.SUPABASE_ANON_KEY = "sb_publishable_uoMfS5tc0AGtLYtsOoB4sQ_12XIo_0g";

/* --- Détection : la persistance cloud est-elle configurée ? --------------- */
window.SUPA_ENABLED = !!(window.SUPABASE_URL && window.SUPABASE_ANON_KEY);

/* --- Création du client (si configuré et si le SDK CDN est chargé) -------- */
window.supa = null;
(function initSupabaseClient(){
  if(!window.SUPA_ENABLED) {
    console.info("[Bénévolat FC] Supabase non configuré → mode démo hors-ligne (localStorage).");
    return;
  }
  if(typeof window.supabase === "undefined" || !window.supabase.createClient) {
    console.warn("[Bénévolat FC] SDK Supabase introuvable (CDN non chargé) → repli localStorage.");
    window.SUPA_ENABLED = false;
    return;
  }
  try {
    window.supa = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY,
      { realtime: { params: { eventsPerSecond: 10 } } }
    );
    console.info("[Bénévolat FC] Client Supabase initialisé ✓");
  } catch(e) {
    console.error("[Bénévolat FC] Échec init Supabase → repli localStorage.", e);
    window.SUPA_ENABLED = false;
    window.supa = null;
  }
})();

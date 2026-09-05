/* ============================================================================
 * GUIDE D'AIDE (wiki intégré) — vue "help"
 * Contenu non technique, adapté au rôle (coach vs joueur/parent).
 * Rendu dans #content par renderHelp(c). Navigation par sections ancrées.
 * Bilingue : s'appuie sur state.lang ('fr'/'en').
 * ==========================================================================*/
'use strict';

/* Petit helper : est-ce qu'on est en français ? */
function helpIsFR(){ try{ return (state.lang||'fr')==='fr'; }catch(e){ return true; } }

/* Contenu du guide. Chaque section = {id, icon, title, html}. */
function helpSections(role){
  const fr = helpIsFR();
  const coach = role==='coach';

  // Sections communes à tous (intro + comment ça marche)
  const S = [];

  S.push({
    id:'intro', icon:'👋',
    title: fr?'Bienvenue':'Welcome',
    html: fr? `
      <p>Cette application aide notre équipe à organiser le <b>bénévolat</b> des parents et des joueurs
      pendant la saison. Chaque famille doit accumuler un certain nombre d'<b>heures de bénévolat</b>
      en aidant lors des parties et des pratiques (cantine, chaînes, marqueur, etc.).</p>
      <p>Le principe est simple : les entraîneurs créent des <b>événements</b> (parties, pratiques) et
      indiquent les <b>postes de bénévoles</b> nécessaires. Vous vous inscrivez aux postes qui vous
      intéressent. C'est <b>premier arrivé, premier servi</b>.</p>
      <div class="help-tip">💡 ${coach?'En tant qu\'entraîneur, vous gérez les activités, les événements et le suivi des heures.':'Astuce : inscrivez-vous tôt — les postes populaires partent vite !'}</div>
    ` : `
      <p>This app helps our team organize <b>volunteering</b> by parents and players during the season.
      Each family must accumulate a number of <b>volunteer hours</b> by helping at games and practices
      (canteen, chains, scorekeeper, etc.).</p>
      <p>It's simple: coaches create <b>events</b> (games, practices) and list the <b>volunteer roles</b>
      needed. You sign up for the roles you want. It's <b>first come, first served</b>.</p>
      <div class="help-tip">💡 ${coach?'As a coach, you manage activities, events and hours tracking.':'Tip: sign up early — popular roles fill up fast!'}</div>
    `
  });

  if(!coach){
    // ---------- GUIDE JOUEUR / PARENT ----------
    S.push({
      id:'signup', icon:'✍️',
      title: fr?'S\'inscrire à un poste':'Sign up for a role',
      html: fr? `
        <ol class="help-steps">
          <li>Ouvrez l'onglet <b>📅 Calendrier</b> dans le menu de gauche.</li>
          <li>Cliquez sur un événement (une partie ou une pratique) pour voir les postes de bénévoles.</li>
          <li>Chaque poste affiche le nombre de places (ex. « Cantine — 2 places ») et le nombre d'<b>heures</b> qu'il donne.</li>
          <li>Cliquez sur <b>« M'inscrire »</b> au poste voulu. C'est fait !</li>
        </ol>
        <p>Si vous êtes parmi les premiers, votre nom apparaît comme <b>bénévole confirmé</b>.
        Sinon, vous êtes placé sur la <b>liste d'attente</b> (voir plus bas).</p>
      ` : `
        <ol class="help-steps">
          <li>Open the <b>📅 Calendar</b> tab in the left menu.</li>
          <li>Click an event (a game or practice) to see the volunteer roles.</li>
          <li>Each role shows the number of spots (e.g. "Canteen — 2 spots") and how many <b>hours</b> it grants.</li>
          <li>Click <b>"Sign up"</b> on the role you want. Done!</li>
        </ol>
        <p>If you're among the first, your name shows as a <b>confirmed volunteer</b>.
        Otherwise you're placed on the <b>waitlist</b> (see below).</p>
      `
    });

    S.push({
      id:'waitlist', icon:'⏳',
      title: fr?'La liste d\'attente':'The waitlist',
      html: fr? `
        <p>Chaque poste a un nombre limité de places. Quand elles sont prises, les inscriptions
        suivantes vont sur la <b>liste d'attente</b>, dans l'ordre d'arrivée.</p>
        <p>Sous chaque poste, vous voyez le <b>bénévole confirmé</b> et, dans de petits ronds,
        les <b>initiales</b> des personnes en attente.</p>
        <div class="help-tip">🔄 <b>Bonne nouvelle :</b> si un bénévole confirmé se désiste,
        la première personne en attente est <b>promue automatiquement</b> — sans rien faire.</div>
      ` : `
        <p>Each role has a limited number of spots. Once they're taken, further sign-ups go on the
        <b>waitlist</b>, in order of arrival.</p>
        <p>Under each role you'll see the <b>confirmed volunteer</b> and, in small circles,
        the <b>initials</b> of people waiting.</p>
        <div class="help-tip">🔄 <b>Good news:</b> if a confirmed volunteer drops out,
        the first person waiting is <b>promoted automatically</b> — nothing to do.</div>
      `
    });

    S.push({
      id:'autofill', icon:'✨',
      title: fr?'Remplissage automatique':'Automatic fill',
      html: fr? `
        <p>Il arrive qu'un poste reste <b>incomplet</b> (personne d'inscrit) alors que d'autres postes
        du même événement ont une <b>liste d'attente</b>.</p>
        <p>Dans ce cas, l'application <b>déplace automatiquement</b> les personnes en attente vers les
        places libres, toujours dans l'ordre <b>premier arrivé, premier servi</b>. Vous pourriez donc
        être affecté à un poste voisin — vous en serez informé dans vos instructions du matin.</p>
      ` : `
        <p>Sometimes a role stays <b>unfilled</b> (no sign-ups) while other roles in the same event
        have a <b>waitlist</b>.</p>
        <p>When that happens, the app <b>automatically moves</b> waiting people into the open spots,
        always <b>first come, first served</b>. So you may be assigned to a nearby role — you'll be
        told in your morning instructions.</p>
      `
    });

    S.push({
      id:'withdraw', icon:'🚪',
      title: fr?'Se désister':'Withdraw',
      html: fr? `
        <p>Un empêchement ? Retournez sur l'événement dans le <b>📅 Calendrier</b> et cliquez sur
        <b>« Me désister »</b>. Votre place se libère aussitôt et la première personne en attente
        prend le relais automatiquement.</p>
        <div class="help-tip">🙏 Désistez-vous dès que possible pour laisser le temps à quelqu'un d'autre de prendre le poste.</div>
      ` : `
        <p>Something came up? Go back to the event in the <b>📅 Calendar</b> and click
        <b>"Withdraw"</b>. Your spot frees up immediately and the first person waiting takes over
        automatically.</p>
        <div class="help-tip">🙏 Withdraw as early as you can so someone else has time to take the spot.</div>
      `
    });

    S.push({
      id:'hours', icon:'⏱️',
      title: fr?'Suivre mes heures':'Track my hours',
      html: fr? `
        <p>L'onglet <b>⏱️ Mes heures</b> montre votre progression vers l'objectif de la saison.
        Chaque poste effectué ajoute ses heures à votre total.</p>
        <ul>
          <li>La <b>barre de progression</b> indique où vous en êtes.</li>
          <li>Le <b>détail</b> liste chaque événement et les heures gagnées.</li>
        </ul>
      ` : `
        <p>The <b>⏱️ My hours</b> tab shows your progress toward the season goal.
        Each completed role adds its hours to your total.</p>
        <ul>
          <li>The <b>progress bar</b> shows where you stand.</li>
          <li>The <b>breakdown</b> lists each event and the hours earned.</li>
        </ul>
      `
    });

    S.push({
      id:'emails', icon:'📧',
      title: fr?'Les courriels du matin':'Morning emails',
      html: fr? `
        <p>Le matin d'un événement, vous recevez un <b>courriel</b> avec vos <b>instructions</b> :
        le poste qui vous est attribué, l'heure et le lieu. Vérifiez vos courriels (et vos indésirables)
        la veille et le matin même.</p>
      ` : `
        <p>On the morning of an event, you receive an <b>email</b> with your <b>instructions</b>:
        your assigned role, the time and place. Check your email (and spam folder) the night before
        and that morning.</p>
      `
    });

  } else {
    // ---------- GUIDE ENTRAÎNEUR (COACH) ----------
    S.push({
      id:'activities', icon:'🏷️',
      title: fr?'1. Créer les types d\'activités':'1. Create activity types',
      html: fr? `
        <p>Commencez par définir vos <b>types d'activités</b> de bénévolat (onglet <b>🏷️ Types d'activités</b>).
        Chaque activité a un <b>nom</b> (ex. Cantine, Chaîneur, Marqueur, Chronométreur) et un nombre d'<b>heures</b>
        que le bénévole reçoit lorsqu'il l'effectue.</p>
        <ol class="help-steps">
          <li>Cliquez sur <b>« + Nouvelle activité »</b>.</li>
          <li>Entrez le nom et le nombre d'heures.</li>
          <li>Enregistrez. L'activité devient disponible pour tous vos événements.</li>
        </ol>
        <div class="help-tip">💡 Créez toutes vos activités une fois en début de saison — vous les réutiliserez dans chaque événement.</div>
      ` : `
        <p>Start by defining your volunteer <b>activity types</b> (<b>🏷️ Activity types</b> tab).
        Each activity has a <b>name</b> (e.g. Canteen, Chains, Scorekeeper, Timekeeper) and a number of
        <b>hours</b> the volunteer receives for doing it.</p>
        <ol class="help-steps">
          <li>Click <b>"+ New activity"</b>.</li>
          <li>Enter the name and the number of hours.</li>
          <li>Save. The activity becomes available for all your events.</li>
        </ol>
        <div class="help-tip">💡 Create all your activities once at the start of the season — you'll reuse them in every event.</div>
      `
    });

    S.push({
      id:'events', icon:'📅',
      title: fr?'2. Créer un événement et ses postes':'2. Create an event and its roles',
      html: fr? `
        <p>Dans l'onglet <b>📅 Événements</b>, créez une partie ou une pratique, puis indiquez
        combien de bénévoles il vous faut pour chaque activité.</p>
        <ol class="help-steps">
          <li>Cliquez sur <b>« + Nouvel événement »</b>.</li>
          <li>Donnez un <b>titre</b> (ex. « Partie vs Titans »), une <b>date</b> et un <b>lieu</b>.</li>
          <li>Ajoutez les <b>postes</b> : pour chaque activité, indiquez le <b>nombre de personnes</b>
          (ex. 2 chaîneurs, 1 marqueur, 3 à la cantine).</li>
          <li>Enregistrez. Les joueurs et parents peuvent maintenant s'inscrire.</li>
        </ol>
      ` : `
        <p>In the <b>📅 Events</b> tab, create a game or practice, then specify how many volunteers you
        need for each activity.</p>
        <ol class="help-steps">
          <li>Click <b>"+ New event"</b>.</li>
          <li>Give a <b>title</b> (e.g. "Game vs Titans"), a <b>date</b> and a <b>location</b>.</li>
          <li>Add the <b>roles</b>: for each activity, set the <b>number of people</b>
          (e.g. 2 chains, 1 scorekeeper, 3 at the canteen).</li>
          <li>Save. Players and parents can now sign up.</li>
        </ol>
      `
    });

    S.push({
      id:'fcfs', icon:'⚖️',
      title: fr?'3. Premier arrivé, premier servi':'3. First come, first served',
      html: fr? `
        <p>Les inscriptions sont attribuées <b>automatiquement</b> selon l'ordre d'arrivée. Vous n'avez
        rien à attribuer à la main.</p>
        <ul>
          <li>Les premières personnes inscrites deviennent <b>bénévoles confirmés</b>.</li>
          <li>Les suivantes vont sur la <b>liste d'attente</b> (leurs initiales apparaissent sous le poste).</li>
          <li>Si un confirmé se désiste, le premier en attente est <b>promu automatiquement</b>.</li>
        </ul>
      ` : `
        <p>Sign-ups are assigned <b>automatically</b> by order of arrival. You don't assign anything by hand.</p>
        <ul>
          <li>The first people to sign up become <b>confirmed volunteers</b>.</li>
          <li>The next ones go on the <b>waitlist</b> (their initials appear under the role).</li>
          <li>If a confirmed volunteer withdraws, the first waiting is <b>promoted automatically</b>.</li>
        </ul>
      `
    });

    S.push({
      id:'autofill', icon:'✨',
      title: fr?'4. Remplissage automatique des places':'4. Automatic spot filling',
      html: fr? `
        <p>Si un poste reste <b>incomplet</b> alors qu'un autre poste du même événement a une
        <b>liste d'attente</b>, l'application <b>comble automatiquement</b> les places libres avec
        les personnes en attente, dans l'ordre premier arrivé, premier servi.</p>
        <p>Ce remplissage se déclenche tout seul à deux moments : quand quelqu'un se désiste, et
        juste avant l'envoi des courriels du matin (pour que les instructions soient à jour).</p>
      ` : `
        <p>If a role stays <b>unfilled</b> while another role in the same event has a <b>waitlist</b>,
        the app <b>automatically fills</b> the open spots with waiting people, in first-come-first-served order.</p>
        <p>This runs on its own at two moments: when someone withdraws, and right before the morning
        emails go out (so instructions are up to date).</p>
      `
    });

    S.push({
      id:'tracking', icon:'📊',
      title: fr?'5. Suivre les heures de l\'équipe':'5. Track the team\'s hours',
      html: fr? `
        <p>L'onglet <b>📊 Suivi des heures</b> montre la progression de chaque joueur (et parent) vers
        l'objectif de la saison, avec une barre de progression et le total d'heures.</p>
        <p>Vous pouvez y fixer l'<b>objectif d'heures</b> de la saison dans les <b>⚙️ Réglages</b>.</p>
      ` : `
        <p>The <b>📊 Hours tracking</b> tab shows each player's (and parent's) progress toward the
        season goal, with a progress bar and total hours.</p>
        <p>You can set the season <b>hours goal</b> in <b>⚙️ Settings</b>.</p>
      `
    });

    S.push({
      id:'members', icon:'👥',
      title: fr?'6. Gérer les membres':'6. Manage members',
      html: fr? `
        <p>Dans l'onglet <b>👥 Membres</b>, gérez la liste des joueurs et parents : nom, courriel,
        catégorie. Le <b>courriel</b> est important — c'est là que partent les instructions du matin.</p>
        <div class="help-tip">📧 Assurez-vous que chaque membre a un courriel valide pour recevoir ses rappels.</div>
      ` : `
        <p>In the <b>👥 Members</b> tab, manage the list of players and parents: name, email, category.
        The <b>email</b> matters — that's where morning instructions are sent.</p>
        <div class="help-tip">📧 Make sure each member has a valid email to receive reminders.</div>
      `
    });

    S.push({
      id:'emails', icon:'📧',
      title: fr?'7. Courriels et rappels du matin':'7. Emails and morning reminders',
      html: fr? `
        <p>Le matin de chaque événement, l'application envoie à chaque bénévole un courriel avec son
        <b>poste attribué</b>, l'heure et le lieu. Un envoi automatique est planifié <b>chaque matin</b>.</p>
        <p>Vous pouvez aussi <b>prévisualiser</b> les courriels d'un événement avant qu'ils partent,
        depuis la fiche de l'événement.</p>
      ` : `
        <p>On the morning of each event, the app emails every volunteer their <b>assigned role</b>,
        time and place. An automatic send is scheduled <b>every morning</b>.</p>
        <p>You can also <b>preview</b> an event's emails before they go out, from the event card.</p>
      `
    });

    S.push({
      id:'season', icon:'🔄',
      title: fr?'8. Démarrer une nouvelle saison':'8. Start a new season',
      html: fr? `
        <p>Dans les <b>⚙️ Réglages</b>, le bouton <b>« Nouvelle saison »</b> remet l'application à zéro
        pour l'année suivante :</p>
        <ul>
          <li>✅ <b>Conserve</b> les joueurs, les parents et les types d'activités.</li>
          <li>🗑️ <b>Efface</b> tous les événements et toutes les inscriptions de l'ancienne saison.</li>
          <li>0️⃣ <b>Remet à zéro</b> les compteurs d'heures de tout le monde.</li>
        </ul>
        <div class="help-tip">⚠️ Cette action est définitive. Faites-la seulement quand l'ancienne saison est bel et bien terminée.</div>
      ` : `
        <p>In <b>⚙️ Settings</b>, the <b>"New season"</b> button resets the app for next year:</p>
        <ul>
          <li>✅ <b>Keeps</b> players, parents and activity types.</li>
          <li>🗑️ <b>Erases</b> all events and sign-ups from the old season.</li>
          <li>0️⃣ <b>Resets</b> everyone's hour counters.</li>
        </ul>
        <div class="help-tip">⚠️ This is permanent. Only do it once the old season is truly over.</div>
      `
    });

    S.push({
      id:'feedback', icon:'💬',
      title: fr?'Signaler un problème':'Report an issue',
      html: fr? `
        <p>Une idée ou un bug ? Utilisez le bouton <b>💬 Commentaires</b> tout en bas du menu pour nous
        écrire directement.</p>
      ` : `
        <p>An idea or a bug? Use the <b>💬 Feedback</b> button at the very bottom of the menu to write to us directly.</p>
      `
    });
  }

  return S;
}

/* Rendu de la vue Aide dans le conteneur c. */
function renderHelp(c){
  const fr = helpIsFR();
  const u = currentUser();
  const role = u ? u.role : 'player';
  const secs = helpSections(role);

  const nav = secs.map(s =>
    `<a class="help-toc-item" href="#help-${s.id}" onclick="helpScrollTo('${s.id}');return false;">
       <span class="help-toc-ico">${s.icon}</span><span>${esc(s.title)}</span></a>`).join('');

  const body = secs.map(s => `
    <section class="help-section" id="help-${s.id}">
      <h3 class="help-h3"><span class="help-ico">${s.icon}</span>${esc(s.title)}</h3>
      <div class="help-body">${s.html}</div>
    </section>`).join('');

  const roleLabel = role==='coach' ? (fr?'Guide de l\'entraîneur':'Coach guide')
                   : role==='parent' ? (fr?'Guide du parent':'Parent guide')
                   : (fr?'Guide du joueur':'Player guide');

  c.innerHTML = `
    <div class="page-head">
      <h2>${fr?'Aide & guide d\'utilisation':'Help & user guide'}</h2>
      <p>${roleLabel} — ${fr?'tout ce qu\'il faut savoir pour utiliser l\'application.':'everything you need to use the app.'}</p>
    </div>
    <div class="help-layout">
      <aside class="help-toc card">
        <div class="help-toc-title">${fr?'Sommaire':'Contents'}</div>
        ${nav}
      </aside>
      <div class="help-content">
        ${body}
        <div class="help-foot">${fr?'Encore une question ? Parlez-en à un entraîneur.':'Still have a question? Ask a coach.'}</div>
      </div>
    </div>`;
}

/* Défilement doux vers une section. */
function helpScrollTo(id){
  const el = document.getElementById('help-'+id);
  if(el){ el.scrollIntoView({behavior:'smooth', block:'start'});
    el.classList.add('help-flash'); setTimeout(()=>el.classList.remove('help-flash'), 1200); }
}

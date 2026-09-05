/* =====================================================================
   Bénévolat FC — Prototype de gestion du bénévolat d'une équipe
   Application autonome. Données persistées dans localStorage.
   ===================================================================== */

/* ---------------- i18n ---------------- */
const I18N = {
  fr:{
    appName:"Bénévolat FC", appTagline:"Gestion des heures de bénévolat de l'équipe", loading:"Chargement…",
    login:"Connexion", signup:"Inscription", email:"Courriel", password:"Mot de passe",
    loginBtn:"Se connecter", signupBtn:"Créer mon compte joueur",
    firstName:"Prénom", lastName:"Nom", logout:"Déconnexion",
    signupNote:"Les nouveaux comptes sont créés comme joueurs.",
    roleCoach:"Coach", rolePlayer:"Joueur", roleParent:"Parent",
    // parent role
    iAmPlayer:"Je suis un joueur", iAmParent:"Je suis un parent",
    signupBtnParent:"Créer mon compte parent",
    myChildren:"Mon/mes enfant(s)", selectChildren:"Sélectionnez votre/vos enfant(s)",
    childrenHelp:"Cochez le(s) joueur(s) dont vous êtes le parent.",
    errNoChild:"Sélectionnez au moins un enfant.",
    parentOf:"Parent de", parents:"Parents", noParents:"Aucun parent inscrit.",
    myVolunteering:"Mon bénévolat", parentHoursNote:"Vos heures de bénévolat (ne comptent pas dans l'objectif de votre enfant)",
    childrenProgress:"Progression de mon/mes enfant(s)", volunteerHours:"Heures de bénévolat",
    // categories
    category:"Catégorie", playerCategory:"Catégorie du joueur",
    eventCategory:"Catégorie de l'événement (optionnel)",
    cat_benjamin:"Benjamin", cat_cadet:"Cadet", cat_juvenile:"Juvénile",
    catNone:"Toutes catégories", catNotSet:"Non définie",
    catBlocked:"Vous jouez dans cette catégorie — le bénévolat est réservé aux autres catégories",
    legendDone:"Complété", legendSelected:"Sélectionné", legendRemaining:"Restant",
    // invitations
    invitePlayers:"Inviter des joueurs", inviteTitle:"Inviter des joueurs",
    inviteHelp:"Collez une liste de courriels (un par ligne). Formats acceptés : <code>courriel</code> · <code>courriel, Prénom Nom</code> · <code>courriel, Prénom Nom, catégorie</code>. Vous pouvez aussi coller le contenu d'un fichier Excel exporté en CSV.",
    inviteListLabel:"Liste de courriels ou CSV",
    inviteBtn:"Créer les invitations", invited:"Invité", active:"Actif",
    status:"Statut", copyLink:"Copier le lien", copied:"Lien copié !",
    inviteResult:(n,s)=>`${n} invitation(s) créée(s)${s?`, ${s} ignoré(s) (déjà présents ou invalides)`:''}.`,
    inviteNoValid:"Aucun courriel valide trouvé.",
    resendInvite:"Lien d'invitation", pendingInvites:"Invitations en attente",
    // activation
    activateTab:"Activer un compte", activateTitle:"Activer mon compte",
    activateHelp:"Entrez le courriel fourni par votre coach et choisissez votre mot de passe.",
    inviteCode:"Code d'invitation", activateBtn:"Activer et se connecter",
    errNoInvite:"Aucune invitation trouvée pour ce courriel/code.",
    errAlreadyActive:"Ce compte est déjà activé — utilisez la connexion.",
    accountActivated:"Compte activé — bienvenue !",
    errInvitedNotActive:"Ce compte n'est pas encore activé. Utilisez « Activer un compte ».",
    confirmPasswordLabel:"Confirmer le mot de passe", errPassMismatch:"Les mots de passe ne correspondent pas.",
    // nav
    navDash:"Tableau de bord", navCalendar:"Calendrier", navMyHours:"Mes heures",
    navActivities:"Types d'activités", navEvents:"Événements", navTracking:"Suivi des heures", navHelp:"Aide",
    navMembers:"Membres", navSettings:"Réglages", navLogs:"Journal",
    // logs / journalisation
    logConsoleTitle:"Console (journal en direct)", logSearch:"Rechercher…", logAll:"Tout",
    logClear:"Vider", logClearConfirm:"Effacer tout le journal ?", logEmpty:"Aucune entrée.",
    logToggleTitle:"Ouvrir/fermer la console du journal",
    logsTitle:"Journal d'activité", logsSubtitle:"Navigation, événements, exécutions et erreurs — le plus récent en premier.",
    logColTime:"Heure", logColCat:"Catégorie", logColLevel:"Niveau", logColMsg:"Message",
    logColUser:"Utilisateur", logColView:"Vue", logColDur:"Durée", logColDetails:"Détails",
    logExportJSON:"Exporter JSON", logExportCSV:"Exporter CSV", logStats:(n,e)=>`${n} entrée(s) · ${e} affichée(s)`,
    logLevelAll:"Tous niveaux", logCatAll:"Toutes catégories",
    // dashboard player
    myProgress:"Ma progression", hoursDone:"Heures effectuées", hoursTarget:"Objectif",
    hoursRemaining:"Restant", goalReached:"Objectif atteint ! 🎉",
    myUpcoming:"Mes inscriptions à venir", noUpcoming:"Aucune inscription à venir.",
    browseEvents:"Voir le calendrier",
    // events
    upcoming:"À venir", past:"Passés", allEvents:"Tous les événements",
    noEvents:"Aucun événement pour le moment.",
    spotsFilled:"places", place:"Place", places:"places", waitlist:"Liste d'attente",
    signUp:"S'inscrire", withdraw:"Se désister", full:"Complet",
    youAreIn:"Vous participez", youWait:"Vous êtes en attente",
    alreadyRegistered:"Déjà inscrit à une autre activité de cet événement",
    deadlinePassed:"Délai de désistement dépassé — contactez un coach",
    interestedOthers:"Intéressés",
    // coach activities
    activityTypes:"Types d'activités de bénévolat", addActivity:"Ajouter une activité",
    activityName:"Nom de l'activité", defaultHours:"Heures créditées", color:"Couleur",
    jobDesc:"Description du poste", jobDescHint:"Description générale du rôle — s'applique à tous les événements où cette activité est proposée.",
    jobDescPh:"Ex.: Tenir le tableau de pointage, annoncer les buts…",
    genInstr:"Instruction générale", genInstrHint:"Consigne par défaut pour ce type — reprise dans chaque événement, où tu peux l'ajuster.",
    genInstrPh:"Ex.: Se présenter à la table officielle, prévoir un stylo.",
    specInstr:"Instruction spécifique", specInstrHint:"Consigne propre à cet événement (lieu de rencontre, matériel, heure d'arrivée…).",
    specInstrPh:"Ex.: Arriver 30 min avant, récupérer la trousse au local B.",
    noInstr:"Aucune instruction particulière.", noDescShort:"Aucune description du poste.", showDetails:"Détails", hideDetails:"Masquer",
    actInstrByEvent:"Instructions spécifiques par événement", actNoInstrYet:"Aucune instruction spécifique dans les événements pour l'instant.", actNoDesc:"Aucune description du poste. Cliquez sur Modifier pour en ajouter une.",
    editActivity:"Modifier l'activité", noActivities:"Aucun type d'activité. Créez-en un pour commencer.",
    hoursShort:"h", perEvent:"/ événement",
    // coach events
    createEvent:"Créer un événement", eventTitle:"Titre", eventDate:"Date et heure",
    eventLocation:"Lieu (optionnel)", needs:"Besoins en bénévoles",
    addNeed:"Ajouter", quantity:"Places", saveEvent:"Enregistrer l'événement",
    editEvent:"Modifier l'événement", deleteEvent:"Supprimer",
    copyEvent:"Copier", copyEventTitle:"Copier l'événement", copySuffix:" (copie)",
    copyEventHint:"Les activités et le nombre de places sont copiés. Aucun joueur n'est assigné. Ajustez le nom, la date et les infos.",
    importBtn:"Importer", importTitle:"Importer des événements",
    importHelp:"Créez plusieurs événements d'un coup à partir d'un fichier tableur. <b>Une ligne = un poste.</b> Les lignes ayant la même date et le même titre sont regroupées dans un seul événement. Colonnes : <code>Date, Titre, Lieu, Catégorie, Activité, Places, Heures</code>. Une activité inconnue est créée automatiquement (2 h par défaut, modifiable ensuite).",
    importTemplate:"1. Partez d'un modèle", importDownloadTpl:"Télécharger le modèle CSV",
    importFile:"2. Choisissez un fichier (CSV, TSV ou texte)",
    importPaste:"…ou collez directement les cellules (depuis Excel, Google Sheets)",
    importPastePh:"Date,Titre,Lieu,Catégorie,Activité,Places,Heures\n2026-09-20 14:00,Partie 2,Stade Municipal,,Chaîneur,2,\n2026-09-20 14:00,Partie 2,Stade Municipal,,Cantine,3,",
    importXlsxWarn:"Les fichiers .xlsx/.xls ne sont pas lus directement. Dans Excel : Fichier ▸ Enregistrer sous ▸ CSV — ou copiez-collez les cellules dans la zone ci-dessous.",
    importDoBtn:"Importer les événements", importNothing:"Aucun événement valide à importer. Vérifiez la date, le titre et l'activité.",
    importDone:"{e} événement(s), {n} poste(s) et {a} nouvelle(s) activité(s) créés.",
    importPreviewHead:"Aperçu avant import", importPreviewEvents:"événement(s)", importPreviewNeeds:"poste(s)",
    importNewActs:"Nouvelles activités à créer :", importErrorsHead:"Lignes ignorées :", importSpots:"places",
    seasonTitle:"Saison", seasonCurrent:"Saison en cours", seasonName:"Nom de la saison",
    seasonNameDesc:"Affiché en haut du tableau de bord. Ex. : « Saison 2026-2027 ».",
    seasonZone:"Nouvelle saison",
    seasonZoneDesc:"Efface <b>tous les événements et toutes les inscriptions</b> pour repartir à zéro. Les joueurs et les types d'activités sont conservés ; les compteurs d'heures de chaque joueur reviennent à 0.",
    seasonModalTitle:"Démarrer une nouvelle saison",
    seasonModalWarn:"Cette action est <b>irréversible</b>. Vont être supprimés définitivement :",
    seasonModalEvents:"événement(s)", seasonModalRegs:"inscription(s)",
    seasonModalKeep:"Conservés : {u} joueur(s)/coach(s) et {a} type(s) d'activité.",
    seasonNewNameLabel:"Nom de la nouvelle saison",
    seasonConfirmType:"Pour confirmer, écrivez EFFACER ci-dessous :",
    seasonConfirmWord:"EFFACER",
    seasonGoBtn:"Effacer et démarrer la saison",
    seasonDone:"Nouvelle saison démarrée : {n} événement(s) et {r} inscription(s) effacés.",
    delPlayer:"Retirer", delPlayerTitle:"Retirer le joueur",
    delPlayerWarn:"Retirer <b>{name}</b> de l'équipe ? Cette action est irréversible.",
    delPlayerRegs:"{r} inscription(s) de ce joueur seront aussi supprimées.",
    delPlayerParent:"Ce joueur est lié à un parent ({p}) : le lien sera retiré.",
    delPlayerGo:"Retirer le joueur", delPlayerDone:"{name} a été retiré de l'équipe.",
    delInvite:"Annuler l'invitation", delInviteDone:"Invitation annulée.",
    noNeeds:"Ajoutez au moins un besoin (activité + nombre de places).",
    // rappels courriel
    reminders:"Rappels courriel", sendReminders:"Envoyer les rappels", previewReminders:"Aperçu des courriels",
    remindersFor:"Rappels — ", remindersIntro:"Un courriel est généré pour chaque bénévole assigné (joueur ou parent) à cet événement.",
    noRecipients:"Aucun bénévole assigné pour le moment — aucun rappel à envoyer.",
    recipientsCount:(n)=>`${n} destinataire${n>1?'s':''}`,
    emailTo:"À", emailSubject:"Objet", emailSent:"Simulé — envoyé", emailSentAt:"Envoyé le",
    sendNow:"Simuler l'envoi maintenant", remindersSentToast:(n)=>`${n} rappel${n>1?'s':''} « envoyé${n>1?'s':''} » (simulation)`,
    outbox:"Boîte d'envoi (simulation)", outboxEmpty:"Aucun courriel envoyé.", clearOutbox:"Vider la boîte d'envoi",
    emailWhenReal:"⚠️ Prototype : aucun courriel réel n'est envoyé. Voir la note d'intégration ci-dessous.",
    reminderGreeting:(name)=>`Bonjour ${name},`,
    reminderLead:(title)=>`Voici votre rappel de bénévolat pour « ${title} » aujourd'hui :`,
    reminderRole:"Votre poste", reminderDate:"Date et heure", reminderPlace:"Lieu",
    reminderJobDesc:"Description du poste", reminderInstr:"Instruction spécifique",
    reminderThanks:"Merci de votre implication !", reminderSignature:"— L'équipe de coachs",
    onBehalfOf:(child)=>`(en tant que parent de ${child})`,
    autoReminderTitle:"Envoi automatique le jour J", integrationNote:"Comment brancher un vrai service d'envoi",
    overrideHours:"Heures (héritées, modifiables)",
    // tracking
    hoursTracking:"Suivi des heures par joueur", player:"Joueur", progress:"Progression",
    trackParents:"Parents bénévoles", noActivitiesYet:"Aucune activité pour l'instant", statusPast:"Fait", statusUpcoming:"À venir",
    confirmPresence:"Confirmer les présences", markPresent:"Présent",
    markAbsent:"Absent", presenceFor:"Présences —", noRegForEvent:"Aucune inscription pour cet événement.",
    creditedAuto:"Crédité automatiquement", pendingApproval:"En attente d'approbation",
    // members
    teamMembers:"Membres de l'équipe", addCoach:"Ajouter un coach", name:"Nom", role:"Rôle",
    coachAddedNote:"Le nouveau coach pourra se connecter avec ce courriel et ce mot de passe.",
    // settings
    teamSettings:"Réglages de l'équipe", hoursGoal:"Objectif d'heures (par joueur)",
    teamLogo:"Logo de l'équipe", teamLogoDesc:"S'affiche dans le rond en haut à gauche et sur l'écran de connexion. PNG ou JPG, idéalement carré.",
    uploadLogo:"Choisir une image", removeLogo:"Retirer le logo", logoUpdated:"Logo mis à jour", logoRemoved:"Logo retiré",
    logoTooBig:"Image trop lourde (max 3 Mo).", logoBadType:"Format non supporté (PNG ou JPG).",
    creditMode:"Mode de créditation des heures",
    creditAuto:"Automatique à la fin de l'événement",
    creditAutoDesc:"Les heures sont créditées dès que la date de l'événement est passée.",
    creditApproval:"Sur approbation du coach",
    creditApprovalDesc:"Le coach coche la présence après l'événement pour créditer les heures.",
    withdrawDeadline:"Délai limite de désistement (heures avant l'événement)",
    withdrawDeadlineDesc:"Passé ce délai, un joueur doit passer par un coach pour se retirer.",
    save:"Enregistrer", cancel:"Annuler", delete:"Supprimer", edit:"Modifier", close:"Fermer",
    confirm:"Confirmer",
    // toasts
    savedOk:"Enregistré", deletedOk:"Supprimé", signedUp:"Inscription confirmée !",
    addedWait:"Ajouté à la liste d'attente", withdrawn:"Vous vous êtes désisté",
    promoted:"a été promu depuis la liste d'attente", accountCreated:"Compte créé, bienvenue !",
    // errors
    errBadLogin:"Courriel ou mot de passe incorrect.",
    errEmailUsed:"Ce courriel est déjà utilisé.",
    errFillAll:"Veuillez remplir tous les champs.",
    // misc
    coachDemo:"Coach démo", playerDemo:"Joueur démo",
    demoAccounts:"<b>Comptes de démonstration :</b><br>Coach — coach@equipe.ca / coach<br>Joueur — alex@equipe.ca / joueur",
    at:"à", confirmDelete:"Confirmer la suppression ?", members:"membres",
    filled:"pourvues", of:"sur", registeredPlayers:"Joueurs inscrits",
    yourSpot:"Votre place", noColor:"Couleur", eventPast:"Événement passé",
    hoursCredited:"heures créditées", target:"objectif",
    // affecter candidats
    assignCandidates:"Affecter les candidats",
    assignCandidatesTitle:"Affecter les candidats en attente",
    assignCandidatesDesc:"Ces joueurs sont en liste d'attente pour cet événement. Affectez-les aux postes encore disponibles.",
    openSpots:"Postes avec places disponibles",
    waitingCandidates:"Candidats en attente",
    waitingFor:"En attente — ",
    assignTo:"Affecter à",
    assignBtn:"Affecter",
    noOpenSpots:"Aucun poste avec places disponibles.",
    noWaitingCandidates:"Aucun candidat en attente.",
    assignedOk:(name,spot)=>`${name} affecté(e) au poste « ${spot} »`,
    assignCandidatesNone:"Aucun candidat en attente ni place disponible pour le moment.",
    autoFillApply:"Remplir automatiquement",
    autoFillDone:"{n} joueur(s) déplacé(s) depuis la liste d'attente vers des places libres.",
    // feedback
    feedbackBtn:"💬 Retours",
    feedbackModalTitle:"Envoyer un retour",
    feedbackModalDesc:"Signalez un bug ou proposez une amélioration. Vos retours aident à améliorer l'application.",
    feedbackType:"Type", feedbackTitle:"Titre", feedbackDesc:"Description",
    feedbackPriority:"Priorité",
    feedbackBug:"🐛 Bug", feedbackImprove:"💡 Amélioration", feedbackQuestion:"❓ Question",
    feedbackPrioHigh:"Haute", feedbackPrioMed:"Normale", feedbackPrioLow:"Basse",
    feedbackSend:"Envoyer",
    feedbackSent:"Merci ! Votre retour a été enregistré.",
    feedbackErrTitle:"Le titre est requis.",
    feedbackListTitle:"Retours reçus",
    feedbackEmpty:"Aucun retour pour le moment.",
    feedbackExportCSV:"Exporter CSV",
    feedbackFrom:"De", feedbackAt:"Le",
    feedbackColType:"Type", feedbackColTitle:"Titre", feedbackColDesc:"Description",
    feedbackColPriority:"Priorité", feedbackColUser:"Utilisateur", feedbackColDate:"Date",
    feedbackDeleteAll:"Tout effacer", feedbackDeleteAllConfirm:"Effacer tous les retours ?"
  },
  en:{
    appName:"Volunteer FC", appTagline:"Team volunteer hours management", loading:"Loading…",
    login:"Log in", signup:"Sign up", email:"Email", password:"Password",
    loginBtn:"Log in", signupBtn:"Create my player account",
    firstName:"First name", lastName:"Last name", logout:"Log out",
    signupNote:"New accounts are created as players.",
    roleCoach:"Coach", rolePlayer:"Player", roleParent:"Parent",
    iAmPlayer:"I am a player", iAmParent:"I am a parent",
    signupBtnParent:"Create my parent account",
    myChildren:"My child(ren)", selectChildren:"Select your child(ren)",
    childrenHelp:"Check the player(s) you are the parent of.",
    errNoChild:"Select at least one child.",
    parentOf:"Parent of", parents:"Parents", noParents:"No parents registered.",
    myVolunteering:"My volunteering", parentHoursNote:"Your volunteer hours (do not count toward your child's goal)",
    childrenProgress:"My child(ren)'s progress", volunteerHours:"Volunteer hours",
    category:"Category", playerCategory:"Player category",
    eventCategory:"Event category (optional)",
    cat_benjamin:"Benjamin", cat_cadet:"Cadet", cat_juvenile:"Juvenile",
    catNone:"All categories", catNotSet:"Not set",
    catBlocked:"You play in this category — volunteering is reserved for other categories",
    legendDone:"Completed", legendSelected:"Selected", legendRemaining:"Remaining",
    invitePlayers:"Invite players", inviteTitle:"Invite players",
    inviteHelp:"Paste a list of emails (one per line). Accepted formats: <code>email</code> · <code>email, First Last</code> · <code>email, First Last, category</code>. You can also paste the content of an Excel file exported as CSV.",
    inviteListLabel:"Email list or CSV",
    inviteBtn:"Create invitations", invited:"Invited", active:"Active",
    status:"Status", copyLink:"Copy link", copied:"Link copied!",
    inviteResult:(n,s)=>`${n} invitation(s) created${s?`, ${s} skipped (already present or invalid)`:''}.`,
    inviteNoValid:"No valid email found.",
    resendInvite:"Invite link", pendingInvites:"Pending invitations",
    activateTab:"Activate account", activateTitle:"Activate my account",
    activateHelp:"Enter the email your coach gave you and choose your password.",
    inviteCode:"Invitation code", activateBtn:"Activate and sign in",
    errNoInvite:"No invitation found for this email/code.",
    errAlreadyActive:"This account is already active — please sign in.",
    accountActivated:"Account activated — welcome!",
    errInvitedNotActive:"This account isn't activated yet. Use “Activate account”.",
    confirmPasswordLabel:"Confirm password", errPassMismatch:"Passwords do not match.",
    navDash:"Dashboard", navCalendar:"Calendar", navMyHours:"My hours",
    navActivities:"Activity types", navEvents:"Events", navTracking:"Hours tracking", navHelp:"Help",
    navMembers:"Members", navSettings:"Settings", navLogs:"Logs",
    // logs
    logConsoleTitle:"Console (live log)", logSearch:"Search…", logAll:"All",
    logClear:"Clear", logClearConfirm:"Clear the entire log?", logEmpty:"No entries.",
    logToggleTitle:"Open/close the log console",
    logsTitle:"Activity log", logsSubtitle:"Navigation, events, executions and errors — newest first.",
    logColTime:"Time", logColCat:"Category", logColLevel:"Level", logColMsg:"Message",
    logColUser:"User", logColView:"View", logColDur:"Duration", logColDetails:"Details",
    logExportJSON:"Export JSON", logExportCSV:"Export CSV", logStats:(n,e)=>`${n} entr(ies) · ${e} shown`,
    logLevelAll:"All levels", logCatAll:"All categories",
    myProgress:"My progress", hoursDone:"Hours completed", hoursTarget:"Goal",
    hoursRemaining:"Remaining", goalReached:"Goal reached! 🎉",
    myUpcoming:"My upcoming sign-ups", noUpcoming:"No upcoming sign-ups.",
    browseEvents:"View calendar",
    upcoming:"Upcoming", past:"Past", allEvents:"All events",
    noEvents:"No events yet.",
    spotsFilled:"spots", place:"Spot", places:"spots", waitlist:"Waitlist",
    signUp:"Sign up", withdraw:"Withdraw", full:"Full",
    youAreIn:"You're in", youWait:"You're on the waitlist",
    alreadyRegistered:"Already signed up for another activity of this event",
    deadlinePassed:"Withdrawal deadline passed — contact a coach",
    interestedOthers:"Interested",
    activityTypes:"Volunteer activity types", addActivity:"Add activity",
    activityName:"Activity name", defaultHours:"Credited hours", color:"Color",
    jobDesc:"Job description", jobDescHint:"General description of the role — applies to every event where this activity is offered.",
    jobDescPh:"E.g. Keep the scoreboard, announce goals…",
    genInstr:"General instruction", genInstrHint:"Default guidance for this type — carried into each event, where you can adjust it.",
    genInstrPh:"E.g. Check in at the officials' table, bring a pen.",
    specInstr:"Specific instruction", specInstrHint:"Instruction specific to this event (meeting point, equipment, arrival time…).",
    specInstrPh:"E.g. Arrive 30 min early, pick up the kit in room B.",
    noInstr:"No specific instructions.", noDescShort:"No job description.", showDetails:"Details", hideDetails:"Hide",
    actInstrByEvent:"Specific instructions by event", actNoInstrYet:"No specific instructions in events yet.", actNoDesc:"No job description yet. Click Edit to add one.",
    editActivity:"Edit activity", noActivities:"No activity types yet. Create one to get started.",
    hoursShort:"h", perEvent:"/ event",
    createEvent:"Create event", eventTitle:"Title", eventDate:"Date & time",
    eventLocation:"Location (optional)", needs:"Volunteer needs",
    addNeed:"Add", quantity:"Spots", saveEvent:"Save event",
    editEvent:"Edit event", deleteEvent:"Delete",
    copyEvent:"Copy", copyEventTitle:"Copy event", copySuffix:" (copy)",
    copyEventHint:"Activities and number of spots are copied. No player is assigned. Adjust the name, date and info.",
    importBtn:"Import", importTitle:"Import events",
    importHelp:"Create several events at once from a spreadsheet file. <b>One row = one position.</b> Rows with the same date and title are grouped into a single event. Columns: <code>Date, Title, Location, Category, Activity, Spots, Hours</code>. An unknown activity is created automatically (2h default, editable later).",
    importTemplate:"1. Start from a template", importDownloadTpl:"Download CSV template",
    importFile:"2. Choose a file (CSV, TSV or text)",
    importPaste:"…or paste cells directly (from Excel, Google Sheets)",
    importPastePh:"Date,Title,Location,Category,Activity,Spots,Hours\n2026-09-20 14:00,Game 2,City Stadium,,Chain crew,2,\n2026-09-20 14:00,Game 2,City Stadium,,Canteen,3,",
    importXlsxWarn:".xlsx/.xls files are not read directly. In Excel: File ▸ Save As ▸ CSV — or copy-paste the cells into the box below.",
    importDoBtn:"Import events", importNothing:"No valid event to import. Check the date, title and activity.",
    importDone:"{e} event(s), {n} position(s) and {a} new activity(ies) created.",
    importPreviewHead:"Preview before import", importPreviewEvents:"event(s)", importPreviewNeeds:"position(s)",
    importNewActs:"New activities to create:", importErrorsHead:"Skipped rows:", importSpots:"spots",
    seasonTitle:"Season", seasonCurrent:"Current season", seasonName:"Season name",
    seasonNameDesc:"Shown at the top of the dashboard. E.g. “Season 2026-2027”.",
    seasonZone:"New season",
    seasonZoneDesc:"Clears <b>all events and all sign-ups</b> to start fresh. Players and activity types are kept; every player's hour counter goes back to 0.",
    seasonModalTitle:"Start a new season",
    seasonModalWarn:"This action is <b>irreversible</b>. The following will be permanently deleted:",
    seasonModalEvents:"event(s)", seasonModalRegs:"sign-up(s)",
    seasonModalKeep:"Kept: {u} player(s)/coach(es) and {a} activity type(s).",
    seasonNewNameLabel:"New season name",
    seasonConfirmType:"To confirm, type ERASE below:",
    seasonConfirmWord:"ERASE",
    seasonGoBtn:"Erase and start season",
    seasonDone:"New season started: {n} event(s) and {r} sign-up(s) cleared.",
    delPlayer:"Remove", delPlayerTitle:"Remove player",
    delPlayerWarn:"Remove <b>{name}</b> from the team? This action is irreversible.",
    delPlayerRegs:"{r} sign-up(s) from this player will also be deleted.",
    delPlayerParent:"This player is linked to a parent ({p}): the link will be removed.",
    delPlayerGo:"Remove player", delPlayerDone:"{name} was removed from the team.",
    delInvite:"Cancel invitation", delInviteDone:"Invitation cancelled.",
    noNeeds:"Add at least one need (activity + number of spots).",
    // email reminders
    reminders:"Email reminders", sendReminders:"Send reminders", previewReminders:"Email preview",
    remindersFor:"Reminders — ", remindersIntro:"One email is generated for every assigned volunteer (player or parent) for this event.",
    noRecipients:"No assigned volunteers yet — nothing to remind.",
    recipientsCount:(n)=>`${n} recipient${n>1?'s':''}`,
    emailTo:"To", emailSubject:"Subject", emailSent:"Simulated — sent", emailSentAt:"Sent at",
    sendNow:"Simulate send now", remindersSentToast:(n)=>`${n} reminder${n>1?'s':''} "sent" (simulation)`,
    outbox:"Outbox (simulation)", outboxEmpty:"No emails sent.", clearOutbox:"Clear outbox",
    emailWhenReal:"⚠️ Prototype: no real email is sent. See the integration note below.",
    reminderGreeting:(name)=>`Hi ${name},`,
    reminderLead:(title)=>`Here is your volunteering reminder for "${title}" today:`,
    reminderRole:"Your role", reminderDate:"Date & time", reminderPlace:"Location",
    reminderJobDesc:"Job description", reminderInstr:"Specific instruction",
    reminderThanks:"Thanks for helping out!", reminderSignature:"— The coaching staff",
    onBehalfOf:(child)=>`(as parent of ${child})`,
    autoReminderTitle:"Automatic send on event day", integrationNote:"How to connect a real email service",
    overrideHours:"Hours (inherited, editable)",
    hoursTracking:"Hours tracking by player", player:"Player", progress:"Progress",
    trackParents:"Volunteer parents", noActivitiesYet:"No activities yet", statusPast:"Done", statusUpcoming:"Upcoming",
    confirmPresence:"Confirm attendance", markPresent:"Present",
    markAbsent:"Absent", presenceFor:"Attendance —", noRegForEvent:"No sign-ups for this event.",
    creditedAuto:"Credited automatically", pendingApproval:"Pending approval",
    teamMembers:"Team members", addCoach:"Add coach", name:"Name", role:"Role",
    coachAddedNote:"The new coach can log in with this email and password.",
    teamSettings:"Team settings", hoursGoal:"Hours goal (per player)",
    teamLogo:"Team logo", teamLogoDesc:"Shown in the circle at the top left and on the login screen. PNG or JPG, ideally square.",
    uploadLogo:"Choose an image", removeLogo:"Remove logo", logoUpdated:"Logo updated", logoRemoved:"Logo removed",
    logoTooBig:"Image too large (max 3 MB).", logoBadType:"Unsupported format (PNG or JPG).",
    creditMode:"Hours crediting mode",
    creditAuto:"Automatic at end of event",
    creditAutoDesc:"Hours are credited as soon as the event date has passed.",
    creditApproval:"On coach approval",
    creditApprovalDesc:"The coach marks attendance after the event to credit hours.",
    withdrawDeadline:"Withdrawal deadline (hours before event)",
    withdrawDeadlineDesc:"After this deadline, a player must go through a coach to withdraw.",
    save:"Save", cancel:"Cancel", delete:"Delete", edit:"Edit", close:"Close",
    confirm:"Confirm",
    savedOk:"Saved", deletedOk:"Deleted", signedUp:"Sign-up confirmed!",
    addedWait:"Added to waitlist", withdrawn:"You withdrew",
    promoted:"was promoted from the waitlist", accountCreated:"Account created, welcome!",
    errBadLogin:"Incorrect email or password.",
    errEmailUsed:"This email is already in use.",
    errFillAll:"Please fill in all fields.",
    coachDemo:"Demo coach", playerDemo:"Demo player",
    demoAccounts:"<b>Demo accounts:</b><br>Coach — coach@equipe.ca / coach<br>Player — alex@equipe.ca / joueur",
    at:"at", confirmDelete:"Confirm deletion?", members:"members",
    filled:"filled", of:"of", registeredPlayers:"Registered players",
    yourSpot:"Your spot", noColor:"Color", eventPast:"Past event",
    hoursCredited:"hours credited", target:"goal",
    assignCandidates:"Assign Candidates",
    assignCandidatesTitle:"Assign Waiting Candidates",
    assignCandidatesDesc:"The players below are waiting for a spot in this event. Assign them to an available position.",
    waitingFor:(name,act)=>`${name} — waiting: ${act}`,
    assignTo:"Assign to:", assignBtn:"Assign",
    noWaitingCandidates:"No waiting candidates for this event.",
    noOpenSlots:"No open slots available.",
    assignedOk:(name,act)=>`${name} assigned to ${act}`,
    assignCandidatesEmpty:"No candidates can be reassigned right now.",
    autoFillApply:"Auto-fill open spots",
    autoFillDone:"{n} player(s) moved from the waitlist into open spots.",
    // feedback
    feedbackBtn:"💬 Feedback",
    feedbackModalTitle:"Send feedback",
    feedbackModalDesc:"Report a bug or suggest an improvement. Your feedback helps improve the app.",
    feedbackType:"Type", feedbackTitle:"Title", feedbackDesc:"Description",
    feedbackPriority:"Priority",
    feedbackBug:"🐛 Bug", feedbackImprove:"💡 Improvement", feedbackQuestion:"❓ Question",
    feedbackPrioHigh:"High", feedbackPrioMed:"Normal", feedbackPrioLow:"Low",
    feedbackSend:"Send",
    feedbackSent:"Thank you! Your feedback has been recorded.",
    feedbackErrTitle:"Title is required.",
    feedbackListTitle:"Received feedback",
    feedbackEmpty:"No feedback yet.",
    feedbackExportCSV:"Export CSV",
    feedbackFrom:"From", feedbackAt:"At",
    feedbackColType:"Type", feedbackColTitle:"Title", feedbackColDesc:"Description",
    feedbackColPriority:"Priority", feedbackColUser:"User", feedbackColDate:"Date",
    feedbackDeleteAll:"Clear all", feedbackDeleteAllConfirm:"Clear all feedback?"
  }
};
let lang = localStorage.getItem('bfc_lang') || 'fr';
function t(k){ return (I18N[lang] && I18N[lang][k]) || (I18N.fr[k]) || k; }

/* ---------------- Colors ---------------- */
const COLORS = ["#2563eb","#16a34a","#d97706","#dc2626","#7c3aed","#0891b2","#db2777","#65a30d","#ea580c","#4f46e5"];

/* ---------------- Categories ---------------- */
// Player age categories. Value stored on user.category and event.category.
const CATEGORIES = ['benjamin','cadet','juvenile'];
function catLabel(v){ return v ? t('cat_'+v) : t('catNotSet'); }

/* ---------------- Storage ---------------- */
const DB_KEY = 'bfc_db_v3';
let DB = null;

function saveDB(){
  localStorage.setItem(DB_KEY, JSON.stringify(DB));
  // Miroir vers Supabase si configuré (anti-rebond pour regrouper les rafales d'écritures).
  if(window.Data && window.Data.enabled && !window.__supaApplying){
    clearTimeout(window.__supaPushTimer);
    window.__supaPushTimer = setTimeout(function(){
      window.Data.pushAll(DB).catch(function(e){ if(window.LOG) LOG.error('Supabase pushAll', {err:String(e)}); });
    }, 400);
  }
}
function loadDB(){
  const raw = localStorage.getItem(DB_KEY);
  if(raw){ try{ DB = JSON.parse(raw); if(!Array.isArray(DB.outbox)) DB.outbox=[]; return; }catch(e){} }
  DB = seedDB();
  saveDB();
}
/* Retours (bugs/améliorations) — stockés dans une clé dédiée, indépendante de la
   synchro cloud Supabase (qui ne connaît pas cette table et l'effacerait). */
const FEEDBACK_KEY = 'benevolat_feedbacks_v1';
function getFeedbacks(){
  try{ const raw = localStorage.getItem(FEEDBACK_KEY); return raw ? JSON.parse(raw) : []; }
  catch(e){ return []; }
}
function saveFeedbacks(list){
  try{ localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list||[])); }catch(e){}
}
function uid(p){ return p + Math.random().toString(36).slice(2,9); }
function nowISO(){ return new Date().toISOString(); }

/* =====================================================================
   LOG — Journalisation riche (navigation, événements, exécutions, erreurs)
   - Tampon circulaire persisté dans localStorage (bfc_logs)
   - Console flottante in-app + vue Journal (coach) + export JSON/CSV
   Conçu pour ne JAMAIS faire planter l'app (tout est protégé).
   ===================================================================== */
const LOG = (function(){
  const KEY='bfc_logs';
  const MAX=800;                 // nb max d'entrées conservées
  const SID=uid('s_');           // identifiant de session (onglet courant)
  const CAT_LABELS={nav:'Navigation',event:'Événement',exec:'Exécution',error:'Erreur',system:'Système'};
  const CAT_ICONS={nav:'🧭',event:'⭐',exec:'⚙️',error:'🔴',system:'🟦'};
  let buf=[];
  let seq=0;
  let ready=false;
  let filter={cat:'all',level:'all',q:''};
  let consoleOpen=false;

  function load(){
    try{ const raw=localStorage.getItem(KEY); if(raw){ buf=JSON.parse(raw)||[]; } }catch(e){ buf=[]; }
    seq = buf.reduce((m,e)=>Math.max(m, e.seq||0), 0);
    ready=true;
  }
  function persist(){ try{ localStorage.setItem(KEY, JSON.stringify(buf.slice(-MAX))); }catch(e){} }
  function ctx(){
    let u=null; try{ u=(typeof currentUser==='function')?currentUser():null; }catch(e){}
    let view=null; try{ view=(typeof state!=='undefined')?state.view:null; }catch(e){}
    return {
      userId: u?u.id:null,
      userName: u?((u.first||'')+' '+(u.last||'')).trim():'(anonyme)',
      role: u?u.role:null,
      view: view
    };
  }
  function push(cat, level, msg, data){
    if(!ready) load();
    const c=ctx();
    const e={
      seq: ++seq, id: uid('l_'),
      ts: Date.now(), iso: nowISO(),
      cat: cat||'system', level: level||'info',
      msg: String(msg==null?'':msg),
      data: (data && typeof data==='object') ? data : (data!=null?{value:data}:null),
      sid: SID,
      userId: c.userId, userName: c.userName, role: c.role, view: c.view
    };
    buf.push(e); if(buf.length>MAX) buf=buf.slice(-MAX);
    persist();
    // écho console navigateur (utile en dev)
    try{
      const tag='%c['+e.cat+']%c '+e.msg;
      const col=level==='error'?'#dc2626':level==='warn'?'#d97706':level==='success'?'#16a34a':'#2563eb';
      (console[level==='error'?'error':level==='warn'?'warn':'log'])(tag,'color:'+col+';font-weight:bold','color:inherit', e.data||'');
    }catch(e2){}
    if(consoleOpen) renderConsole();
    return e;
  }
  // Raccourcis
  const api={
    nav:(to,meta)=>push('nav','info','Page : '+to, Object.assign({to:to}, meta||{})),
    event:(msg,data)=>push('event','success',msg,data),
    info:(msg,data)=>push('system','info',msg,data),
    warn:(msg,data)=>push('system','warn',msg,data),
    error:(msg,data)=>push('error','error',msg,data),
    debug:(msg,data)=>push('system','debug',msg,data),
    push:push,
    // Enveloppe une opération : mesure la durée, journalise succès/erreur.
    exec:function(name, fn, meta){
      const t0=(typeof performance!=='undefined'&&performance.now)?performance.now():Date.now();
      try{
        const res=fn();
        const dur=Math.round(((typeof performance!=='undefined'&&performance.now)?performance.now():Date.now())-t0);
        push('exec','info','⚙️ '+name, Object.assign({op:name, durationMs:dur, ok:true}, meta||{}));
        return res;
      }catch(err){
        const dur=Math.round(((typeof performance!=='undefined'&&performance.now)?performance.now():Date.now())-t0);
        push('error','error','❌ Échec : '+name, Object.assign({op:name, durationMs:dur, ok:false, error:String(err&&err.message||err), stack:String(err&&err.stack||'')}, meta||{}));
        throw err;
      }
    },
    list:function(f){
      f=f||filter;
      let out=buf.slice();
      if(f.cat&&f.cat!=='all') out=out.filter(e=>e.cat===f.cat);
      if(f.level&&f.level!=='all') out=out.filter(e=>e.level===f.level);
      if(f.q){ const q=f.q.toLowerCase(); out=out.filter(e=> (e.msg||'').toLowerCase().includes(q) || JSON.stringify(e.data||{}).toLowerCase().includes(q) || (e.userName||'').toLowerCase().includes(q)); }
      return out;
    },
    all:()=>buf.slice(),
    clear:function(){ buf=[]; seq=0; persist(); if(consoleOpen) renderConsole(); if(typeof render==='function'){ try{ render(); }catch(e){} } },
    setFilter:function(patch){ Object.assign(filter, patch||{}); },
    getFilter:()=>Object.assign({}, filter),
    CAT_LABELS, CAT_ICONS,
    // Export
    exportJSON:function(){ return JSON.stringify(buf, null, 2); },
    exportCSV:function(){
      const cols=['seq','iso','cat','level','msg','userName','role','view','durationMs','data'];
      const esc=v=>{ v=(v==null?'':String(v)); return '"'+v.replace(/"/g,'""')+'"'; };
      const rows=buf.map(e=>[e.seq,e.iso,e.cat,e.level,e.msg,e.userName,e.role||'',e.view||'',(e.data&&e.data.durationMs)||'', e.data?JSON.stringify(e.data):''].map(esc).join(','));
      return cols.join(',')+'\n'+rows.join('\n');
    },
    download:function(kind){
      try{
        const isCSV=kind==='csv';
        const content=isCSV?api.exportCSV():api.exportJSON();
        const blob=new Blob([content], {type:isCSV?'text/csv':'application/json'});
        const url=URL.createObjectURL(blob);
        const a=document.createElement('a');
        a.href=url; a.download='benevolat-fc-journal-'+new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')+(isCSV?'.csv':'.json');
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(()=>URL.revokeObjectURL(url), 1000);
        push('system','info','Export du journal ('+(isCSV?'CSV':'JSON')+')',{count:buf.length});
      }catch(e){ push('error','error','Export impossible',{error:String(e)}); }
    },
    // État console
    isConsoleOpen:()=>consoleOpen,
    toggleConsole:function(v){ consoleOpen=(v==null?!consoleOpen:!!v); renderConsole(); },
    _internalRenderConsole:()=>renderConsole()
  };
  return api;
})();

/* =====================================================================
   DEV — Mode développeur
   Le journal tourne et se PERSISTE TOUJOURS (même en production), mais son
   interface (bouton console flottant + onglet « Journal » du coach) n'est
   visible qu'en mode dev, réservé au développeur.
   Activation : ajouter #dev à l'URL, OU raccourci Ctrl+Shift+D,
   OU dans la console du navigateur : DEV.enable().  #dev=0 / DEV.disable() coupe.
   L'état est mémorisé par navigateur (localStorage bfc_dev).
   ===================================================================== */
let DEV_MODE=false;
(function(){ try{ DEV_MODE = localStorage.getItem('bfc_dev')==='1'; }catch(e){} })();
function isDev(){ return !!DEV_MODE; }
// Applique un état dev (au boot, sans re-render forcé).
function applyDevFromHash(){
  let h=''; try{ h=(location.hash||'')+' '+(location.search||''); }catch(e){}
  if(/(?:^|[#?&\s])dev(?:=(?:1|on|true))?(?=[&\s#]|$)/i.test(h)){ DEV_MODE=true; try{localStorage.setItem('bfc_dev','1');}catch(e){} }
  else if(/(?:^|[#?&\s])dev=(?:0|off|false)/i.test(h)){ DEV_MODE=false; try{localStorage.setItem('bfc_dev','0');}catch(e){} }
}
function setDev(on){
  DEV_MODE=!!on;
  try{ localStorage.setItem('bfc_dev', DEV_MODE?'1':'0'); }catch(e){}
  try{ LOG.info('Mode développeur '+(DEV_MODE?'activé':'désactivé'),{dev:DEV_MODE}); }catch(e){}
  if(!DEV_MODE){ try{ LOG.toggleConsole(false); }catch(e){} 
    try{ if(typeof state!=='undefined' && state.view==='logs'){ state.view='events'; } }catch(e){} }
  try{ if(typeof toast==='function') toast('Mode dév : '+(DEV_MODE?'ON':'OFF'), DEV_MODE?'ok':''); }catch(e){}
  if(typeof render==='function' && typeof SESSION!=='undefined' && SESSION){ try{ render(); }catch(e){} }
  try{ renderConsole(); }catch(e){}
}
function toggleDev(){ setDev(!DEV_MODE); }
try{ if(typeof window!=='undefined'){ window.DEV={enable:function(){setDev(true);},disable:function(){setDev(false);},toggle:toggleDev,status:function(){return DEV_MODE;}}; } }catch(e){}

/* ---- Rendu de la console flottante in-app ---- */
function renderConsole(){
  const panel=document.getElementById('logConsole');
  const btn=document.getElementById('logToggle');
  if(!panel) return;
  // Hors mode dev : masquer bouton + panneau, ne rien rendre.
  if(!isDev()){ panel.classList.add('hidden'); if(btn) btn.classList.add('hidden'); return; }
  if(btn) btn.classList.remove('hidden');
  const open=LOG.isConsoleOpen();
  panel.classList.toggle('hidden', !open);
  if(btn) btn.classList.toggle('active', open);
  if(!open) return;
  const f=LOG.getFilter();
  const cats=['all','nav','event','exec','error','system'];
  const rows=LOG.list(f).slice(-200).reverse();
  const chip=(v,label,active)=>`<button class="logchip ${active?'on':''}" onclick="LOG.setFilter({cat:'${v}'});renderConsole()">${esc(label)}</button>`;
  panel.innerHTML=`
    <div class="logc-head">
      <b>📜 ${t('logConsoleTitle')}</b>
      <span class="logcount">${LOG.list(f).length} / ${LOG.all().length}</span>
      <div class="logc-actions">
        <input id="logSearch" class="logsearch" placeholder="${t('logSearch')}" value="${esc(f.q||'')}" oninput="LOG.setFilter({q:this.value});renderConsole();var el=document.getElementById('logSearch');if(el)el.focus()">
        <button class="btn tiny" onclick="LOG.download('json')">JSON</button>
        <button class="btn tiny" onclick="LOG.download('csv')">CSV</button>
        <button class="btn tiny ghost" onclick="if(confirm('${t('logClearConfirm')}'))LOG.clear()">${t('logClear')}</button>
        <button class="btn tiny ghost" onclick="LOG.toggleConsole(false)">✕</button>
      </div>
    </div>
    <div class="logc-filters">${cats.map(c=>chip(c, c==='all'?t('logAll'):(LOG.CAT_ICONS[c]+' '+LOG.CAT_LABELS[c]), (f.cat||'all')===c)).join('')}</div>
    <div class="logc-body">
      ${rows.length?rows.map(logRowHTML).join(''):`<div class="logempty">${t('logEmpty')}</div>`}
    </div>`;
}
function logRowHTML(e){
  const time=new Date(e.ts).toLocaleTimeString('fr-CA',{hour12:false})+'.'+String(e.ts%1000).padStart(3,'0');
  const dur=(e.data&&e.data.durationMs!=null)?` <span class="logdur">${e.data.durationMs} ms</span>`:'';
  const who=e.userName&&e.userName!=='(anonyme)'?` <span class="logwho">${esc(e.userName)}</span>`:'';
  const details=e.data?`<pre class="logdata">${esc(JSON.stringify(e.data))}</pre>`:'';
  return `<div class="logrow lv-${e.level} cat-${e.cat}">
    <span class="logtime">${time}</span>
    <span class="logcat" title="${esc(LOG.CAT_LABELS[e.cat]||e.cat)}">${LOG.CAT_ICONS[e.cat]||'•'}</span>
    <span class="logmsg">${esc(e.msg)}${dur}${who}</span>
    ${details}
  </div>`;
}

/* ---- Vue Journal (coach) : table filtrable + recherche + export ---- */
function renderLogs(c){
  const f=LOG.getFilter();
  const cats=['all','nav','event','exec','error','system'];
  const levels=['all','info','success','warn','error','debug'];
  const all=LOG.all(); const rows=LOG.list(f).slice().reverse();
  const catChip=(v)=>`<button class="logchip ${((f.cat||'all')===v)?'on':''}" onclick="LOG.setFilter({cat:'${v}'});render()">${v==='all'?t('logCatAll'):(LOG.CAT_ICONS[v]+' '+LOG.CAT_LABELS[v])}</button>`;
  const tr=(e)=>{
    const time=new Date(e.ts).toLocaleString('fr-CA',{hour12:false});
    const dur=(e.data&&e.data.durationMs!=null)?e.data.durationMs+' ms':'';
    const data=e.data?esc(JSON.stringify(e.data)):'';
    return `<tr class="lv-${e.level}">
      <td class="nowrap mono">${time}</td>
      <td><span class="logcat">${LOG.CAT_ICONS[e.cat]||'•'}</span> ${esc(LOG.CAT_LABELS[e.cat]||e.cat)}</td>
      <td><span class="loglvl lv-${e.level}">${esc(e.level)}</span></td>
      <td>${esc(e.msg)}</td>
      <td>${esc(e.userName||'')}${e.role?` <span class="chip tiny">${esc(e.role)}</span>`:''}</td>
      <td class="mono">${esc(e.view||'')}</td>
      <td class="nowrap mono">${dur}</td>
      <td><pre class="logdata big">${data}</pre></td>
    </tr>`;
  };
  c.innerHTML=`
    <div class="page-head logs-head">
      <div><h2>${t('logsTitle')}</h2><p>${t('logsSubtitle')}</p></div>
      <div class="logs-actions">
        <button class="btn btn-ghost" onclick="LOG.download('json')">⬇︎ ${t('logExportJSON')}</button>
        <button class="btn btn-ghost" onclick="LOG.download('csv')">⬇︎ ${t('logExportCSV')}</button>
        <button class="btn btn-danger" onclick="if(confirm('${t('logClearConfirm')}'))LOG.clear()">🗑 ${t('logClear')}</button>
      </div>
    </div>
    <div class="card">
      <div class="logfilters-row">
        <div class="logc-filters">${cats.map(catChip).join('')}</div>
        <select class="loglevel" onchange="LOG.setFilter({level:this.value});render()">
          ${levels.map(l=>`<option value="${l}" ${((f.level||'all')===l)?'selected':''}>${l==='all'?t('logLevelAll'):l}</option>`).join('')}
        </select>
        <input class="logsearch grow" placeholder="${t('logSearch')}" value="${esc(f.q||'')}"
          oninput="LOG.setFilter({q:this.value});render();var el=document.querySelector('.logsearch.grow');if(el){el.focus();el.setSelectionRange(el.value.length,el.value.length);}">
        <span class="logcount">${t('logStats')(all.length, rows.length)}</span>
      </div>
      <div class="tablewrap">
        <table class="logtable">
          <thead><tr>
            <th>${t('logColTime')}</th><th>${t('logColCat')}</th><th>${t('logColLevel')}</th>
            <th>${t('logColMsg')}</th><th>${t('logColUser')}</th><th>${t('logColView')}</th>
            <th>${t('logColDur')}</th><th>${t('logColDetails')}</th>
          </tr></thead>
          <tbody>${rows.length?rows.map(tr).join(''):`<tr><td colspan="8" class="logempty">${t('logEmpty')}</td></tr>`}</tbody>
        </table>
      </div>
    </div>`;
}

/* ---- Capture globale des erreurs non gérées ---- */
if(typeof window!=='undefined'){
  window.addEventListener('error', function(ev){
    try{ LOG.error('Erreur JS non capturée',{message:ev.message, source:ev.filename, line:ev.lineno, col:ev.colno, stack:ev.error&&ev.error.stack?String(ev.error.stack):null}); }catch(e){}
  });
  window.addEventListener('unhandledrejection', function(ev){
    try{ LOG.error('Promesse rejetée non capturée',{reason:String(ev.reason&&ev.reason.message||ev.reason)}); }catch(e){}
  });
}

/* ---------------- Seed / demo data ---------------- */
function seedDB(){
  const users = [
    {id:'u_coach', first:'Marc', last:'Tremblay', email:'coach@equipe.ca', pass:'coach', role:'coach', status:'active'},
    {id:'u_alex',  first:'Alex', last:'Bergeron', email:'alex@equipe.ca',  pass:'joueur', role:'player', category:'benjamin', status:'active'},
    {id:'u_sam',   first:'Sam',  last:'Côté',     email:'sam@equipe.ca',   pass:'joueur', role:'player', category:'benjamin', status:'active'},
    {id:'u_jo',    first:'Jordan',last:'Lavoie',  email:'jordan@equipe.ca',pass:'joueur', role:'player', category:'juvenile', status:'active'},
    {id:'u_max',   first:'Maxime',last:'Roy',     email:'max@equipe.ca',   pass:'joueur', role:'player', category:'juvenile', status:'active'},
    {id:'u_lea',   first:'Léa',  last:'Gagnon',   email:'lea@equipe.ca',   pass:'joueur', role:'player', category:'benjamin', status:'active'},
    {id:'u_noa',   first:'Noah', last:'Fortin',   email:'noah@equipe.ca',  pass:'joueur', role:'player', category:'juvenile', status:'active'},
    // demo pending invitations (no password yet — activate via « Activer un compte »)
    {id:'u_inv1', first:'Emma', last:'Boucher', email:'emma@equipe.ca', pass:null, role:'player', category:'cadet', status:'invited', inviteCode:'EMMA-2F7K'},
    {id:'u_inv2', first:'Lucas',last:'Girard',  email:'lucas@equipe.ca',pass:null, role:'player', category:'cadet', status:'invited', inviteCode:'LUCA-9QX3'}
  ];
  const activities = [
    {id:'a_marq', name:'Marqueur',      hours:2, color:'#2563eb', desc:"Tenir la feuille de pointage et le tableau d'affichage : noter les buts, cartons et changements tout au long du match.", instr:"Se présenter à la table officielle 20 min avant le coup d'envoi. Prévoir un stylo."},
    {id:'a_chro', name:'Chronométreur', hours:2, color:'#16a34a', desc:"Gérer le chronomètre officiel du match : démarrer/arrêter aux coups de sifflet de l'arbitre et signaler la fin des périodes."},
    {id:'a_chai', name:'Chaîneur',      hours:3, color:'#d97706', desc:"Tenir la chaîne de mesure (10 verges) le long de la ligne de touche et la déplacer selon les indications de l'arbitre.", instr:"Porter la veste orange fournie. Rester attentif aux signaux de l'arbitre de touche."},
    {id:'a_cant', name:'Cantine',       hours:3, color:'#dc2626', desc:"Préparer et servir à la cantine : boissons, collations, encaissement. Respecter les consignes d'hygiène."},
    {id:'a_lav',  name:'Lavage maillots',hours:2,color:'#7c3aed', desc:"Récupérer les maillots après le match, les laver et les rapporter propres et pliés au prochain entraînement."}
  ];
  const dayMs=86400000;
  const d = n => new Date(Date.now()+n*dayMs);
  const iso = (dt,h)=>{ dt.setHours(h,0,0,0); return dt.toISOString(); };
  const events = [
    {id:'e_p2', title:'Partie 2 — Domicile', date:iso(d(4),18), location:'Stade municipal', category:'cadet',
      needs:[
        {id:'n1', actId:'a_chai', qty:2, hours:3, instr:"Se présenter côté banc de touche 30 min avant le coup d'envoi. Veste orange fournie à la table officielle."},
        {id:'n2', actId:'a_marq', qty:1, hours:2, instr:"Récupérer la feuille de match auprès du coach principal avant le début."},
        {id:'n3', actId:'a_cant', qty:3, hours:3, instr:"Clés de la cantine au local B. Ouvrir 1 h avant le match, caisse de fond dans le tiroir."},
        {id:'n4', actId:'a_lav',  qty:1, hours:2}
      ]},
    {id:'e_pr', title:'Pratique — Semaine 3', date:iso(d(7),19), location:'Terrain école', category:null,
      needs:[
        {id:'n5', actId:'a_chro', qty:1, hours:2},
        {id:'n6', actId:'a_cant', qty:2, hours:2}
      ]},
    {id:'e_p1', title:'Partie 1 — Extérieur', date:iso(d(-6),18), location:'Stade adverse', category:'juvenile',
      needs:[
        {id:'n7', actId:'a_marq', qty:1, hours:2},
        {id:'n8', actId:'a_chro', qty:1, hours:2},
        {id:'n9', actId:'a_cant', qty:2, hours:3}
      ]},
    {id:'e_p3', title:'Partie 3 — Benjamins', date:iso(d(9),18), location:'Stade municipal', category:'benjamin',
      needs:[
        {id:'n10', actId:'a_chai', qty:2, hours:3},
        {id:'n11', actId:'a_cant', qty:2, hours:3}
      ]}
  ];
  // registrations: playerId, eventId, needId, ts, status(assigned|wait), present(null/true/false)
  const T=Date.now();
  const regs = [
    // Partie 2 — cantine: 2 assigned + 2 wait (shows the initials-in-circles feature)
    {id:'r1', pid:'u_sam', eid:'e_p2', nid:'n3', ts:T-500000, present:null},
    {id:'r2', pid:'u_jo',  eid:'e_p2', nid:'n3', ts:T-400000, present:null},
    {id:'r3', pid:'u_max', eid:'e_p2', nid:'n3', ts:T-300000, present:null},
    {id:'r4', pid:'u_lea', eid:'e_p2', nid:'n3', ts:T-200000, present:null},
    {id:'r5', pid:'u_noa', eid:'e_p2', nid:'n3', ts:T-100000, present:null},
    // Partie 2 — chaîneur: 1 of 2
    {id:'r6', pid:'u_alex',eid:'e_p2', nid:'n1', ts:T-450000, present:null},
    // Past event Partie 1 — some done (for hours demo)
    {id:'r7', pid:'u_alex',eid:'e_p1', nid:'n7', ts:T-9000000, present:true},
    {id:'r8', pid:'u_sam', eid:'e_p1', nid:'n9', ts:T-8000000, present:true},
    {id:'r9', pid:'u_alex',eid:'e_p1', nid:'n9', ts:T-7000000, present:null} // one player, but rule = 1 activity/event → keep r7 only; this is a different player anyway
  ];
  // fix: r9 makes alex in two activities of same past event — remove to respect rule
  const regsClean = regs.filter(r=>r.id!=='r9');
  return {
    settings:{ hoursGoal:15, creditMode:'approval', withdrawHours:48, logo:null, seasonName:'' },
    users, activities, events, regs:regsClean, outbox:[]
  };
}

/* ---------------- Session ---------------- */
let SESSION = null; // {userId}
function currentUser(){ return DB.users.find(u=>u.id===(SESSION&&SESSION.userId)); }

/* ---------------- Auth actions ---------------- */
function setAuthTab(which){
  document.getElementById('tabLogin').classList.toggle('active', which==='login');
  document.getElementById('tabSignup').classList.toggle('active', which==='signup');
  const tabAct=document.getElementById('tabActivate'); if(tabAct) tabAct.classList.toggle('active', which==='activate');
  document.getElementById('loginForm').classList.toggle('hidden', which!=='login');
  document.getElementById('signupForm').classList.toggle('hidden', which!=='signup');
  const acForm=document.getElementById('activateForm'); if(acForm) acForm.classList.toggle('hidden', which!=='activate');
  hideAuthErr();
}
function showAuthErr(msg){ const e=document.getElementById('authError'); e.textContent=msg; e.classList.remove('hidden'); }
function hideAuthErr(){ document.getElementById('authError').classList.add('hidden'); }

function doLogin(ev){
  ev.preventDefault();
  const email=document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass=document.getElementById('loginPass').value;
  // invited but not yet activated: guide the user to the activation tab
  const invited=DB.users.find(x=>x.email.toLowerCase()===email && x.status==='invited');
  if(invited){ LOG.warn('Connexion : compte invité non activé',{email:email}); showAuthErr(t('errInvitedNotActive')); setAuthTab('activate'); document.getElementById('acEmail').value=email; return false; }
  const u=DB.users.find(x=>x.email.toLowerCase()===email && x.pass===pass);
  if(!u){ LOG.warn('Échec de connexion (identifiants invalides)',{email:email}); showAuthErr(t('errBadLogin')); return false; }
  SESSION={userId:u.id}; sessionStorage.setItem('bfc_session', u.id);
  LOG.event('Connexion réussie',{userId:u.id, userName:(u.first+' '+(u.last||'')).trim(), role:u.role});
  enterApp();
  return false;
}

/* ---- Account activation (invited players set their own password) ---- */
// Extrait un code d'invitation (inv_xxx) d'une chaîne : lien complet, query, ou code seul.
function extractInviteCode(raw){
  const s=(raw||'').trim();
  if(!s) return '';
  // lien/hash/query du type #invite=inv_xxx ou ?invite=inv_xxx
  const m=s.match(/[#?&]?invite=([^&\s#]+)/i);
  if(m){ try{ return decodeURIComponent(m[1]).trim(); }catch(e){ return m[1].trim(); } }
  // code brut de la forme inv_xxx présent quelque part
  const m2=s.match(/inv_[a-z0-9]+/i);
  if(m2) return m2[0];
  return s;
}
// Extrait un courriel d'un lien d'invitation collé (paramètre email=...).
function extractInviteEmail(raw){
  const s=(raw||'').trim();
  if(!s) return '';
  const m=s.match(/[#?&]email=([^&\s#]+)/i);
  if(m){ try{ return decodeURIComponent(m[1]).trim(); }catch(e){ return m[1].trim(); } }
  return '';
}
// Find an invited user by email OR invite code (accepte un lien complet collé).
function findInvite(idOrEmail){
  const raw=(idOrEmail||'').trim();
  if(!raw) return null;
  const v=raw.toLowerCase();
  const code=extractInviteCode(raw).toLowerCase();
  const email=(extractInviteEmail(raw)||'').toLowerCase();
  return DB.users.find(u=> u.status==='invited' && (
    u.email.toLowerCase()===v ||
    (u.inviteCode||'').toLowerCase()===v ||
    (code && (u.inviteCode||'').toLowerCase()===code) ||
    (email && u.email.toLowerCase()===email)
  )) || null;
}
function doActivate(ev){
  ev.preventDefault();
  const rawCode=document.getElementById('acCode').value.trim();
  let key=document.getElementById('acEmail').value.trim();
  // Toutes les sources d'info possibles : le champ code (lien collé) + le hash/URL courant.
  let urlRaw=''; try{ urlRaw=(location.hash||'')+' '+(location.search||''); }catch(e){}
  const combined=(rawCode+' '+urlRaw).trim();
  // si le courriel est vide, l'extraire du lien collé ou de l'URL
  if(!key){ const em=extractInviteEmail(rawCode)||extractInviteEmail(urlRaw); if(em) key=em; }
  const code=extractInviteCode(rawCode) || extractInviteCode(urlRaw);
  const pass=document.getElementById('acPass').value;
  const pass2=document.getElementById('acPass2').value;
  // compte déjà actif qui tente de se ré-activer ?
  const active=key && DB.users.find(u=>u.email.toLowerCase()===key.toLowerCase() && u.status!=='invited');
  if(active){ showAuthErr(t('errAlreadyActive')); return false; }
  // validations mot de passe (avant toute création)
  if(!pass||pass.length<4){ showAuthErr(t('errFillAll')); return false; }
  if(pass!==pass2){ showAuthErr(t('errPassMismatch')); return false; }
  // 1) invitation présente dans ce navigateur ?
  let u=findInvite(rawCode) || findInvite(code) || findInvite(key);
  if(u){
    u.pass=pass; u.status='active'; delete u.inviteCode;
    LOG.event('Activation de compte (invitation locale)',{userId:u.id, userName:(u.first+' '+(u.last||'')).trim(), email:u.email, role:u.role});
  } else {
    // 2) Activation autonome : le localStorage de cet appareil ne contient pas l'invitation
    //    (lien ouvert sur un autre appareil/onglet). On recrée le compte à partir des données du lien.
    //    Exigé : un code d'invitation valide (inv_xxx) ET un courriel.
    const hasCode=/^inv_[a-z0-9]+$/i.test(code||'');
    const emailOk=EMAIL_RE.test((key||'').toLowerCase());
    if(!hasCode || !emailOk){ showAuthErr(t('errNoInvite')); return false; }
    const data=decodeInviteData(combined) || {};
    const first=data.first || (key.split('@')[0]);
    u={id:uid('u_'),first:first,last:data.last||'',email:key,pass:pass,
       role:data.role||'player',category:data.category||null,status:'active'};
    DB.users.push(u);
    LOG.event('Activation autonome (compte recréé depuis le lien)',{userId:u.id, userName:(u.first+' '+(u.last||'')).trim(), email:u.email, role:u.role, category:u.category, inviteCode:code});
  }
  saveDB();
  SESSION={userId:u.id}; sessionStorage.setItem('bfc_session', u.id);
  enterApp(); toast(t('accountActivated'),'ok');
  return false;
}
let _signupRole = 'player';
// Bascule Joueur/Parent sur l'écran d'inscription
function setSignupRole(role){
  _signupRole = role;
  const isParent = role==='parent';
  document.getElementById('suRolePlayer').classList.toggle('active', !isParent);
  document.getElementById('suRoleParent').classList.toggle('active', isParent);
  document.getElementById('suCategoryField').classList.toggle('hidden', isParent);
  document.getElementById('suChildrenField').classList.toggle('hidden', !isParent);
  document.getElementById('suBtn').textContent = isParent ? t('signupBtnParent') : t('signupBtn');
  if(isParent) renderChildrenChecklist();
}
// Liste des joueurs à cocher (enfants) pour l'inscription parent
function renderChildrenChecklist(){
  const box=document.getElementById('suChildren'); if(!box) return;
  const players=DB.users.filter(u=>u.role==='player');
  box.innerHTML = players.length ? players.map(p=>
    `<label class="child-opt"><input type="checkbox" value="${p.id}"> ${esc(fullName(p))}${p.category?` <span class="cat-badge">${esc(catLabel(p.category))}</span>`:''}</label>`
  ).join('') : `<div class="children-help">—</div>`;
}
function doSignup(ev){
  ev.preventDefault();
  const first=document.getElementById('suFirst').value.trim();
  const last=document.getElementById('suLast').value.trim();
  const email=document.getElementById('suEmail').value.trim().toLowerCase();
  const pass=document.getElementById('suPass').value;
  if(!first||!last||!email||!pass){ showAuthErr(t('errFillAll')); return false; }
  if(DB.users.some(u=>u.email.toLowerCase()===email)){ showAuthErr(t('errEmailUsed')); return false; }
  let u;
  if(_signupRole==='parent'){
    const childIds=[...document.querySelectorAll('#suChildren input:checked')].map(c=>c.value);
    if(!childIds.length){ showAuthErr(t('errNoChild')); return false; }
    u={id:uid('u_'), first,last,email,pass,role:'parent',childIds,status:'active'};
  } else {
    const category=document.getElementById('suCategory').value || null;
    u={id:uid('u_'), first,last,email,pass,role:'player',category,status:'active'};
  }
  DB.users.push(u); saveDB();
  LOG.event('Création de compte',{userId:u.id, userName:(u.first+' '+(u.last||'')).trim(), email:u.email, role:u.role, category:u.category||null, childIds:u.childIds||null});
  SESSION={userId:u.id}; sessionStorage.setItem('bfc_session', u.id);
  enterApp(); toast(t('accountCreated'),'ok');
  return false;
}
function logout(){
  const me=currentUser();
  LOG.event('Déconnexion',{userId:me&&me.id, userName:me?(me.first+' '+(me.last||'')).trim():null});
  SESSION=null; sessionStorage.removeItem('bfc_session'); sessionStorage.removeItem('bfc_view');
  document.getElementById('app').classList.add('hidden');
  document.getElementById('authScreen').classList.remove('hidden');
  document.getElementById('loginForm').reset(); document.getElementById('signupForm').reset();
}

/* ---------------- Language ---------------- */
function applyStaticI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.getAttribute('data-i18n');
    if(k==='demoAccounts') return;
    el.textContent=t(k);
  });
  document.getElementById('demoHint').innerHTML=t('demoAccounts');
  document.documentElement.lang=lang;
  fillCategoryOptions(document.getElementById('suCategory'), '', false);
}
// Fill a <select> with the category options. includeAll=true adds an "all categories" option (value '').
function fillCategoryOptions(sel, selected, includeAll){
  if(!sel) return;
  let html = includeAll ? `<option value="">${t('catNone')}</option>` : `<option value="" disabled ${selected?'':'selected'}></option>`;
  html += CATEGORIES.map(c=>`<option value="${c}" ${selected===c?'selected':''}>${t('cat_'+c)}</option>`).join('');
  sel.innerHTML=html;
  if(selected!==undefined) sel.value=selected||'';
}
function setLang(l){
  lang=l; localStorage.setItem('bfc_lang',l);
  document.getElementById('langFr').classList.toggle('active',l==='fr');
  document.getElementById('langEn').classList.toggle('active',l==='en');
  applyStaticI18n();
}
function toggleLang(){
  lang = lang==='fr'?'en':'fr'; localStorage.setItem('bfc_lang',lang);
  document.getElementById('langBtn').textContent = lang==='fr'?'EN':'FR';
  applyStaticI18n();
  render();
}

/* ---------------- Helpers ---------------- */
function initials(u){ return ((u.first[0]||'')+(u.last[0]||'')).toUpperCase(); }
function colorFor(str){ let h=0; for(let i=0;i<str.length;i++) h=str.charCodeAt(i)+((h<<5)-h); return COLORS[Math.abs(h)%COLORS.length]; }
function avatarHTML(u,cls=''){ return `<div class="avatar ${cls}" style="background:${colorFor(u.id)}">${initials(u)}</div>`; }
function fmtDate(iso){
  const dt=new Date(iso);
  const loc = lang==='fr'?'fr-CA':'en-CA';
  const day = dt.toLocaleDateString(loc,{weekday:'short',day:'numeric',month:'short'});
  const time = dt.toLocaleTimeString(loc,{hour:'2-digit',minute:'2-digit'});
  return `${day} ${t('at')} ${time}`;
}
function dateParts(iso){
  const dt=new Date(iso); const loc=lang==='fr'?'fr-CA':'en-CA';
  return { d:dt.getDate(), m:dt.toLocaleDateString(loc,{month:'short'}).replace('.','') };
}
function isPast(iso){ return new Date(iso).getTime() < Date.now(); }
function activity(id){ return DB.activities.find(a=>a.id===id); }
function eventById(id){ return DB.events.find(e=>e.find? null : e.id===id) || DB.events.find(e=>e.id===id); }
function userById(id){ return DB.users.find(u=>u.id===id); }

/* registrations for a need, sorted by ts (first-come-first-served) */
function regsForNeed(eid,nid){ return DB.regs.filter(r=>r.eid===eid && r.nid===nid).sort((a,b)=>a.ts-b.ts); }
function assignedRegs(eid,nid,qty){ return regsForNeed(eid,nid).slice(0,qty); }
function waitRegs(eid,nid,qty){ return regsForNeed(eid,nid).slice(qty); }
function myRegForEvent(eid){ const me=currentUser(); return DB.regs.find(r=>r.eid===eid && r.pid===me.id); }

/* =====================================================================
   MAIL — Rappels courriel le jour de l'événement (prototype sans serveur)
   - buildEventReminders(eid) : un courriel par bénévole ASSIGNÉ (place tenue)
     contenant date/heure, lieu, description du poste + instruction spécifique.
   - sendEventReminders(eid)  : simule l'envoi (journalise + stocke dans DB.outbox).
   Aucune donnée ne quitte le navigateur : c'est une simulation fidèle du contenu.
   ===================================================================== */
function fullName(u){ return ((u.first||'')+' '+(u.last||'')).trim(); }
// Construit la liste des courriels de rappel pour un événement (bénévoles assignés).
function buildEventReminders(eid){
  const e=eventById(eid); if(!e) return [];
  const out=[];
  (e.needs||[]).forEach(n=>{
    const act=activity(n.actId); if(!act) return;
    // seules les places TENUES (assignées) reçoivent un rappel — pas la liste d'attente
    assignedRegs(eid,n.nid||n.id,n.qty).forEach(r=>{
      const vol=userById(r.pid); if(!vol) return;
      // Le destinataire est le bénévole lui-même (joueur OU parent).
      const email=vol.email||'';
      const onBehalf = vol.role==='parent' && (vol.childIds||[]).length
        ? (vol.childIds.map(id=>{const c=userById(id);return c?fullName(c):null;}).filter(Boolean).join(', ')) : '';
      out.push({
        eid, nid:(n.nid||n.id),
        to:email, toName:fullName(vol), role:vol.role,
        onBehalfOf:onBehalf,
        eventTitle:e.title, eventDate:e.date, location:e.location||'',
        activityName:act.name, jobDesc:act.desc||'', instr:n.instr||'',
        hours:n.hours||0
      });
    });
  });
  return out;
}
// Rendu HTML d'un courriel (aperçu fidèle du message qui serait envoyé).
function emailBodyHTML(m){
  const subject = `${t('reminders')} — ${esc(m.eventTitle)}`;
  const rows = [
    [t('reminderRole'), esc(m.activityName)+(m.hours?` · ${m.hours} h`:'')],
    [t('reminderDate'), esc(fmtDate(m.eventDate))],
    [t('reminderPlace'), esc(m.location||'—')],
    [t('reminderJobDesc'), m.jobDesc?esc(m.jobDesc):'—'],
    [t('reminderInstr'), m.instr?esc(m.instr):'—']
  ];
  return `<div class="email">
    <div class="email-head">
      <div><span class="email-label">${t('emailTo')} :</span> ${esc(m.toName)} &lt;${esc(m.to)}&gt; ${m.onBehalfOf?`<span class="muted">${esc(t('onBehalfOf')(m.onBehalfOf))}</span>`:''}</div>
      <div><span class="email-label">${t('emailSubject')} :</span> ${subject}</div>
    </div>
    <div class="email-body">
      <p>${esc(t('reminderGreeting')(m.toName))}</p>
      <p>${esc(t('reminderLead')(m.eventTitle))}</p>
      <table class="email-table">${rows.map(([k,v])=>`<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>
      <p>${t('reminderThanks')}<br>${t('reminderSignature')}</p>
    </div>
  </div>`;
}
// Simule l'envoi : journalise chaque courriel et l'ajoute à la boîte d'envoi.
function sendEventReminders(eid){
  // Avant d'envoyer : on comble les places encore libres avec les candidats
  // en attente, pour que les instructions du matin reflètent l'affectation finale.
  runAutoFill(eid, {silent:true});
  const mails=buildEventReminders(eid);
  if(!mails.length){ toast(t('noRecipients'),'err'); return 0; }
  const sentAt=nowISO();
  mails.forEach(m=>{
    DB.outbox.push(Object.assign({}, m, {id:uid('mail_'), sentAt}));
    LOG.event('Rappel courriel (simulé)', {to:m.to, toName:m.toName, event:m.eventTitle, activity:m.activityName, role:m.role});
  });
  saveDB();
  toast(t('remindersSentToast')(mails.length),'ok');
  render();
  return mails.length;
}
function clearOutbox(){ DB.outbox=[]; saveDB(); LOG.event('Boîte d\'envoi vidée',{}); render(); }

// ── Affecter les candidats en attente ─────────────────────────────────────────

/* =====================================================================
   AUTO-REMPLISSAGE (moteur réel, basé sur DB.regs)
   Objectif : combler les places encore LIBRES d'un événement en y déplaçant
   les candidats EN ATTENTE des AUTRES activités du même événement, dans
   l'ordre d'arrivée (1er arrivé, 1er servi).

   Rappel du modèle : DB.regs est une liste plate {id,pid,eid,nid,ts}. Pour un
   besoin n, les n.qty premières inscriptions (triées par ts) sont ASSIGNÉES ;
   les suivantes sont EN ATTENTE. Déplacer un candidat en attente ne dérange
   jamais une personne déjà assignée (on ne touche qu'au surplus).
   ===================================================================== */

// Places encore libres pour un besoin (>= 0).
function openCount(eid, need){
  return Math.max(0, (need.qty||1) - regsForNeed(eid, need.id).length);
}
// Une inscription est-elle « en attente » (au-delà de qty pour son besoin) ?
function isWaitingReg(reg){
  const ev=eventById(reg.eid); if(!ev||!ev.needs) return false;
  const need=ev.needs.find(n=>n.id===reg.nid); if(!need) return false;
  const idx=regsForNeed(reg.eid, reg.nid).findIndex(r=>r.id===reg.id);
  return idx >= (need.qty||1);
}

// Calcule les déplacements candidat-en-attente → place-libre pour un événement.
// opts.commit (défaut true) : applique réellement (modifie reg.nid + saveDB).
// Retourne la liste des mouvements : [{regId, uid, from, to}].
function autoFillFromWaitlists(eid, opts){
  opts=opts||{}; const commit=opts.commit!==false;
  const ev=eventById(eid); if(!ev||!ev.needs) return [];
  const moves=[];
  // Compteur de places libres par besoin (simulation).
  const openByNeed={}; ev.needs.forEach(n=>{ openByNeed[n.id]=openCount(eid,n); });
  // Candidats en attente (tous besoins confondus), du plus ancien au plus récent.
  const waiting = DB.regs.filter(r=>r.eid===eid && isWaitingReg(r)).sort((a,b)=>a.ts-b.ts);
  waiting.forEach(function(reg){
    // Premier besoin (ordre stable) différent du sien ayant encore une place libre.
    const target = ev.needs.find(n=> n.id!==reg.nid && openByNeed[n.id]>0);
    if(!target) return;
    moves.push({regId:reg.id, uid:reg.pid, from:reg.nid, to:target.id});
    openByNeed[target.id]--;          // la place est prise dans la simulation
    if(commit){ reg.nid=target.id; }  // on conserve le ts d'origine (équité)
  });
  if(commit && moves.length){ saveDB(); }
  return moves;
}

// Vrai (bouton coach visible) s'il existe au moins un déplacement possible.
function eventHasAssignableCandidates(e){
  if(!e||!e.needs) return false;
  return autoFillFromWaitlists(e.id, {commit:false}).length > 0;
}

// Applique l'auto-remplissage automatiquement et notifie (utilisé aux points
// clés : désistement, envoi des rappels du matin). Silencieux si rien à faire.
function runAutoFill(eid, opts){
  opts=opts||{};
  const moves=autoFillFromWaitlists(eid, {commit:true});
  if(moves.length){
    const ev=eventById(eid);
    LOG.event('Auto-remplissage des places libres',{event:eid, eventTitle:ev&&ev.title, déplacements:moves.length});
    if(!opts.silent){
      const msg = t('autoFillDone').replace('{n}', moves.length);
      setTimeout(function(){ toast(msg,'ok'); }, 300);
    }
  }
  return moves;
}

/* Coach : aperçu puis application manuelle de l'auto-remplissage. */
function openAssignCandidates(eid){
  const e=eventById(eid); if(!e) return;
  const moves=autoFillFromWaitlists(eid, {commit:false});
  if(!moves.length){ toast(t('assignCandidatesEmpty')); return; }
  const rows=moves.map(function(m){
    const u=userById(m.uid);
    const fromNeed=e.needs.find(n=>n.id===m.from);
    const toNeed=e.needs.find(n=>n.id===m.to);
    return `<tr style="border-bottom:1px solid var(--border)">
      <td style="padding:10px 8px"><strong>${esc(u?fullName(u):m.uid)}</strong></td>
      <td style="padding:10px 8px;color:var(--muted);font-size:13px">${esc(actName(fromNeed)||'?')}</td>
      <td style="padding:10px 8px;font-size:13px">→ <strong>${esc(actName(toNeed)||'?')}</strong></td>
    </tr>`;
  }).join('');
  const body=`
    <p style="color:var(--muted);font-size:14px;margin-bottom:12px">${t('assignCandidatesDesc')}</p>
    <table style="width:100%;border-collapse:collapse">
      <thead><tr style="background:var(--surface2)">
        <th style="padding:8px;text-align:left;font-size:13px">${t('player')}</th>
        <th style="padding:8px;text-align:left;font-size:13px">${t('waitingFor')||''}</th>
        <th style="padding:8px;text-align:left;font-size:13px">${t('assignTo')}</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  modal(t('assignCandidatesTitle'), body,
    [{label:t('cancel'),cls:'btn-ghost',fn:closeModal},
     {label:t('autoFillApply'),cls:'btn-primary',fn:function(){ applyAutoFill(eid); }}]);
}
// Applique réellement puis ferme le modal et re-rend.
function applyAutoFill(eid){
  const moves=runAutoFill(eid, {silent:false});
  closeModal();
  render();
  if(!moves.length) toast(t('assignCandidatesEmpty'));
}

// Modale coach : aperçu des rappels d'un événement + envoi simulé + note d'intégration.
function openReminders(eid){
  const e=eventById(eid); if(!e) return;
  const mails=buildEventReminders(eid);
  const intro=`<p class="muted">${t('remindersIntro')}</p>
    <div class="notice">${t('emailWhenReal')}</div>`;
  let body;
  if(!mails.length){
    body=intro+`<p class="empty">${t('noRecipients')}</p>`;
  } else {
    body=intro+`<p><strong>${t('recipientsCount')(mails.length)}</strong></p>`
      + `<div class="email-list">`+mails.map(emailBodyHTML).join('')+`</div>`;
  }
  body+=integrationNoteHTML();
  const buttons=[{label:t('close'),cls:'btn-ghost',fn:closeModal}];
  if(mails.length){
    buttons.unshift({label:'✉ '+t('sendNow'),cls:'btn-primary',fn:()=>{ sendEventReminders(eid); closeModal(); }});
  }
  modal(t('remindersFor')+e.title, body, buttons);
}
// Note explicative : comment brancher un vrai service d'envoi (prod).
function integrationNoteHTML(){
  const fr = lang==='fr';
  return `<details class="integration"><summary>🔌 ${t('integrationNote')}</summary>
    <div class="integration-body">
      <p><strong>${t('autoReminderTitle')}</strong></p>
      <p>${fr?'Ce prototype fonctionne entièrement dans le navigateur : il génère le contenu exact des courriels mais ne les envoie pas. Pour un envoi réel et automatique le matin de l\'événement, il faut un petit service côté serveur :':'This prototype runs entirely in the browser: it generates the exact email content but does not send it. For real automatic sending on the morning of the event, a small server-side service is needed:'}</p>
      <ol>
        <li>${fr?'Héberger les données (joueurs, événements, inscriptions) sur un serveur ou un service infonuagique (ex. Firebase, Supabase).':'Host the data (players, events, sign-ups) on a server or cloud service (e.g. Firebase, Supabase).'}</li>
        <li>${fr?'Une tâche planifiée (CRON) s\'exécute chaque matin, trouve les événements du jour et appelle <code>buildEventReminders()</code>.':'A scheduled task (CRON) runs each morning, finds the day\'s events and calls <code>buildEventReminders()</code>.'}</li>
        <li>${fr?'Chaque courriel est transmis à un fournisseur d\'envoi — <strong>SendGrid</strong>, <strong>Mailgun</strong>, <strong>Amazon SES</strong> ou <strong>Postmark</strong> — via leur API.':'Each email is passed to a delivery provider — <strong>SendGrid</strong>, <strong>Mailgun</strong>, <strong>Amazon SES</strong> or <strong>Postmark</strong> — via their API.'}</li>
        <li>${fr?'Le même gabarit (date, heure, lieu, description du poste, instruction) est réutilisé tel quel.':'The same template (date, time, location, job description, instruction) is reused as-is.'}</li>
      </ol>
      <p class="muted">${fr?'La logique de contenu ci-dessus est déjà prête : seule la couche d\'envoi reste à brancher.':'The content logic above is already in place: only the sending layer remains to be connected.'}</p>
    </div></details>`;
}

/* Hours split for a player:
   - done     : credited hours (event completed / presence confirmed)  → blue
   - selected : hours for assigned spots not yet credited (upcoming)    → orange
   Waitlist spots are NOT counted (the player doesn't hold the spot yet). */
function playerHoursBreakdown(pid){
  let done=0, selected=0;
  DB.regs.filter(r=>r.pid===pid).forEach(r=>{
    const ev=eventById(r.eid); if(!ev) return;
    const need=ev.needs.find(n=>n.id===r.nid); if(!need) return;
    // must hold an assigned spot (not waitlist)
    const assigned=assignedRegs(r.eid,r.nid,need.qty).some(x=>x.id===r.id);
    if(!assigned) return;
    const h = (need.hours!=null?need.hours:(activity(need.actId)?.hours||0));
    const credited = DB.settings.creditMode==='auto'
      ? isPast(ev.date)
      : (r.present===true);
    if(credited) done += h; else selected += h;
  });
  return {done, selected};
}
/* Credited hours only (used for tracking / goal completion) */
function playerHours(pid){ return playerHoursBreakdown(pid).done; }

/* ---------------- Toast ---------------- */
function toast(msg,type=''){
  const r=document.getElementById('toastRoot');
  const el=document.createElement('div'); el.className='toast '+type; el.innerHTML=msg;
  r.appendChild(el); setTimeout(()=>{el.style.opacity='0';el.style.transition='.3s';},2200);
  setTimeout(()=>el.remove(),2600);
}

/* ---------------- Boot ---------------- */
function enterApp(){
  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  const u=currentUser();
  document.getElementById('myName').textContent=`${u.first} ${u.last}`;
  document.getElementById('myAvatar').outerHTML=avatarHTML(u).replace('class="avatar ','class="avatar" id="myAvatar" style-x=" ').replace('style-x=" ','');
  // simpler: set avatar
  const av=document.getElementById('myAvatar');
  if(av){ av.style.background=colorFor(u.id); av.textContent=initials(u); }
  const rb=document.getElementById('roleBadge');
  rb.textContent = u.role==='coach'?t('roleCoach'):(u.role==='parent'?t('roleParent'):t('rolePlayer'));
  rb.className='role-badge '+(u.role==='coach'?'role-coach':(u.role==='parent'?'role-parent':'role-player'));
  document.getElementById('langBtn').textContent = lang==='fr'?'EN':'FR';
  // Vue par défaut selon le rôle, mais on restaure la dernière vue de CET onglet si elle est valide (survit au refresh).
  const defView = u.role==='coach' ? 'events' : 'dash';
  const validViews = u.role==='coach'
    ? ['events','activities','tracking','members','settings','logs']
    : ['dash','calendar','myhours'];
  let saved=null; try{ saved=sessionStorage.getItem('bfc_view'); }catch(e){}
  state.view = (saved && validViews.indexOf(saved)!==-1) ? saved : defView;
  LOG.event('Entrée dans l\'app',{userId:u.id, name:(u.first+' '+(u.last||'')).trim(), role:u.role, startView:state.view});
  LOG.nav(state.view,{from:'(boot)'});
  render();
  // Chargement terminé : on dévoile l'app (supprime le clignotement de l'écran de connexion).
  document.body.classList.remove('booting');
}

window.addEventListener('DOMContentLoaded',()=>{
  applyDevFromHash();
  LOG.info('Démarrage de l\'application',{lang:lang, ts:nowISO(), dev:isDev()});
  // Filet de sécurité : ne jamais laisser le splash bloqué si un imprévu survient.
  setTimeout(function(){ document.body.classList.remove('booting'); }, 6000);
  bootData().then(finishBoot).catch(function(e){
    if(window.LOG) LOG.error('Boot Supabase — repli localStorage',{err:String(e)});
    loadDB(); finishBoot();
  });
});

// Charge l'état initial : depuis Supabase si configuré (en semant la base si elle est vide),
// sinon depuis localStorage. Branche aussi le temps réel.
async function bootData(){
  if(!(window.Data && window.Data.enabled)){ loadDB(); return; }
  LOG.info('Supabase configuré — chargement cloud');
  let cloud = await window.Data.loadAll();
  // Base vide ? On sème les données de démo puis on les pousse une fois.
  if(!cloud.users || cloud.users.length === 0){
    LOG.info('Base cloud vide — initialisation avec les données de démo');
    DB = seedDB();
    await window.Data.pushAll(DB);
  } else {
    DB = cloud; if(!Array.isArray(DB.outbox)) DB.outbox = [];
  }
  // Temps réel : à chaque changement distant, on recharge et on re-rend.
  window.Data.subscribe(function(){
    if(window.__supaReloadTimer) clearTimeout(window.__supaReloadTimer);
    window.__supaReloadTimer = setTimeout(async function(){
      try{
        window.__supaApplying = true;      // évite de re-pousser ce qu'on vient de recevoir
        const fresh = await window.Data.loadAll();
        if(fresh.users && fresh.users.length){ fresh.outbox = DB.outbox || []; DB = fresh; }
        localStorage.setItem(DB_KEY, JSON.stringify(DB));
        if(SESSION && SESSION.userId) render();
      } finally { window.__supaApplying = false; }
    }, 150);
  });
}

function finishBoot(){
  setLang(lang);
  applyBranding();
  // Raccourci développeur : Ctrl+Shift+D bascule le mode dév
  try{ window.addEventListener('keydown', function(ev){ if((ev.ctrlKey||ev.metaKey)&&ev.shiftKey&&(ev.key==='D'||ev.key==='d')){ ev.preventDefault(); toggleDev(); } }); }catch(e){}
  const sid=sessionStorage.getItem('bfc_session');
  if(sid && DB.users.find(u=>u.id===sid)){ SESSION={userId:sid}; LOG.info('Session restaurée',{userId:sid}); enterApp(); return; }
  // Aucune session active dans cet onglet : on montre l'écran de connexion (fin du chargement).
  document.body.classList.remove('booting');
  // Auto-remplissage depuis un lien d'invitation : #invite=inv_xxx&email=...
  maybePrefillFromInviteHash();
}
// Lit le hash/URL d'invitation et pré-remplit l'onglet « Activer un compte ».
function maybePrefillFromInviteHash(){
  let raw='';
  try{ raw=(location.hash||'')+' '+(location.search||''); }catch(e){}
  // ne rien faire s'il n'y a pas de véritable marqueur d'invitation dans l'URL
  if(!/(?:[#?&]invite=|inv_[a-z0-9]+|[#?&]email=)/i.test(raw)) return;
  const code=extractInviteCode(raw);
  const email=extractInviteEmail(raw);
  if(!code && !email) return;
  const inv=findInvite(code) || findInvite(email);
  setAuthTab('activate');
  const acEmail=document.getElementById('acEmail');
  const acCode=document.getElementById('acCode');
  if(acEmail) acEmail.value = (inv && inv.email) || email || '';
  if(acCode)  acCode.value  = (inv && inv.inviteCode) || code || '';
  const acPass=document.getElementById('acPass'); if(acPass) acPass.focus();
}


/* =====================================================================
   RENDER LAYER
   ===================================================================== */
const state = { view:'dash', eventFilter:'upcoming' };

function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function render(){
  const u=currentUser(); if(!u) return;
  LOG.exec('render:'+state.view, ()=>{
    renderSidebar(u);
    const c=document.getElementById('content');
    if(u.role==='coach'){
      let route=state.view;
      if(route==='logs' && !isDev()) route='events';  // Journal réservé au mode dév
      ({ events:renderCoachEvents, activities:renderCoachActivities, tracking:renderTracking,
         members:renderMembers, settings:renderSettings, logs:renderLogs, help:renderHelp }[route] || renderCoachEvents)(c);
    } else if(u.role==='parent'){
      ({ dash:renderParentDash, calendar:renderPlayerCalendar, myhours:renderPlayerHours, help:renderHelp }[state.view]
         || renderParentDash)(c);
    } else {
      ({ dash:renderPlayerDash, calendar:renderPlayerCalendar, myhours:renderPlayerHours, help:renderHelp }[state.view]
         || renderPlayerDash)(c);
    }
    renderConsole();
    applyBranding();
  }, {view:state.view, role:u.role});
}

/* ---------------- TEAM LOGO / BRANDING ---------------- */
// Style inline d'un rond de marque : logo d'équipe si présent, sinon le dégradé par défaut.
function ballStyle(){
  const logo = DB && DB.settings && DB.settings.logo;
  if(logo){ return "background-image:url('"+logo+"');background-size:cover;background-position:center;background-repeat:no-repeat"; }
  return '';
}
// Applique le logo (ou le défaut) à TOUS les ronds .ball présents (auth + topbar).
function applyBranding(){
  const style=ballStyle();
  let balls=[];
  try{ balls=Array.prototype.slice.call(document.querySelectorAll('.ball')); }catch(e){ return; }
  balls.forEach(function(b){
    if(style){ b.style.backgroundImage="url('"+DB.settings.logo+"')"; b.style.backgroundSize='cover'; b.style.backgroundPosition='center'; b.style.backgroundRepeat='no-repeat'; }
    else { b.style.backgroundImage=''; b.style.backgroundSize=''; b.style.backgroundPosition=''; b.style.backgroundRepeat=''; }
  });
}
// Fonction pure : définit/retire le logo (dataURL ou null). Retourne DB.settings.logo.
function setTeamLogo(dataUrl){
  DB.settings.logo = dataUrl || null;
  saveDB();
  LOG.event(dataUrl?'Logo d\'équipe mis à jour':'Logo d\'équipe retiré',{hasLogo:!!dataUrl, sizeKB: dataUrl?Math.round(dataUrl.length/1024):0});
  return DB.settings.logo;
}
// Redimensionne une image (dataURL) côté client via canvas -> PNG dataURL <= max px.
function resizeImageDataURL(srcDataUrl, maxPx, cb){
  try{
    const img=new Image();
    img.onload=function(){
      let w=img.width, h=img.height;
      const scale=Math.min(1, maxPx/Math.max(w,h));
      w=Math.round(w*scale); h=Math.round(h*scale);
      const cv=document.createElement('canvas'); cv.width=w; cv.height=h;
      const ctx=cv.getContext('2d'); ctx.drawImage(img,0,0,w,h);
      try{ cb(cv.toDataURL('image/png')); }catch(e){ cb(srcDataUrl); }
    };
    img.onerror=function(){ cb(srcDataUrl); };
    img.src=srcDataUrl;
  }catch(e){ cb(srcDataUrl); }
}
// Handler du <input type=file> de la vue Réglages.
function onLogoPick(input){
  const file = input && input.files && input.files[0];
  if(!file) return;
  if(!/^image\/(png|jpe?g)$/i.test(file.type)){ toast(t('logoBadType'),'err'); input.value=''; return; }
  if(file.size > 3*1024*1024){ toast(t('logoTooBig'),'err'); input.value=''; return; }
  LOG.exec('logo:upload', function(){
    const reader=new FileReader();
    reader.onload=function(){
      resizeImageDataURL(reader.result, 256, function(resized){
        setTeamLogo(resized);
        applyBranding();
        toast(t('logoUpdated'),'ok');
        render();
      });
    };
    reader.onerror=function(){ toast(t('logoBadType'),'err'); };
    reader.readAsDataURL(file);
  }, {name:file.name, type:file.type, sizeKB:Math.round(file.size/1024)});
}
function removeTeamLogo(){
  setTeamLogo(null); applyBranding(); toast(t('logoRemoved')); render();
}
function renderSidebar(u){
  const sb=document.getElementById('sidebar');
  const items = u.role==='coach' ? [
    ['events','📅',t('navEvents')],
    ['activities','🏷️',t('navActivities')],
    ['tracking','📊',t('navTracking')],
    ['members','👥',t('navMembers')],
    ['settings','⚙️',t('navSettings')]
  ].concat(isDev()?[['logs','🧾',t('navLogs')]]:[]) : u.role==='parent' ? [
    ['dash','🏠',t('navDash')],
    ['calendar','📅',t('navCalendar')],
    ['myhours','⏱️',t('myVolunteering')],
    ['help','❓',t('navHelp')]
  ] : [
    ['dash','🏠',t('navDash')],
    ['calendar','📅',t('navCalendar')],
    ['myhours','⏱️',t('navMyHours')],
    ['help','❓',t('navHelp')]
  ];
  sb.innerHTML = items.map(([v,ic,label])=>
    `<button class="nav-item ${state.view===v?'active':''}" onclick="go('${v}')">
       <span class="ico">${ic}</span><span class="txt">${esc(label)}</span></button>`).join('')
  + (u.role==='coach'?
    `<button class="nav-item ${state.view==='help'?'active':''}" onclick="go('help')" style="margin-top:auto">
       <span class="ico">❓</span><span class="txt">${esc(t('navHelp'))}</span></button>
     <button class="nav-item nav-feedback" onclick="openFeedbackModal()" style="opacity:.75">
       <span class="ico">💬</span><span class="txt">${esc(t('feedbackBtn').replace('💬 ',''))}</span></button>`:'');
}
function go(v){ const from=state.view; state.view=v; try{ sessionStorage.setItem('bfc_view', v); }catch(e){} LOG.nav(v,{from:from}); render(); window.scrollTo(0,0); }

/* ---------------- PLAYER: Dashboard ---------------- */
function renderPlayerDash(c){
  const u=currentUser();
  const bd=playerHoursBreakdown(u.id);
  const done=bd.done, selected=bd.selected, goal=DB.settings.hoursGoal;
  // widths capped so done+selected never exceed 100%
  const donePct = goal>0?Math.min(100, done/goal*100):0;
  const selPct  = goal>0?Math.min(100-donePct, selected/goal*100):0;
  const pct=goal>0?Math.min(100,Math.round(done/goal*100)):0;
  const remaining=Math.max(0,goal-done);
  const reached=done>=goal;
  // upcoming regs
  const mine=DB.regs.filter(r=>r.pid===u.id).map(r=>({r,ev:eventById(r.eid)}))
    .filter(x=>x.ev && !isPast(x.ev.date)).sort((a,b)=>new Date(a.ev.date)-new Date(b.ev.date));
  c.innerHTML=`
    <div class="page-head"><h2>${t('navDash')}</h2><p>${esc(u.first)}, ${t('myProgress').toLowerCase()}</p></div>
    <div class="grid grid-3" style="margin-bottom:18px">
      <div class="stat"><div class="label">${t('hoursDone')}</div><div class="value">${done}<small> ${t('hoursShort')}</small></div></div>
      <div class="stat"><div class="label">${t('hoursTarget')}</div><div class="value">${goal}<small> ${t('hoursShort')}</small></div></div>
      <div class="stat"><div class="label">${t('hoursRemaining')}</div><div class="value">${remaining}<small> ${t('hoursShort')}</small></div></div>
    </div>
    <div class="card">
      <div class="card-head"><h3>${t('myProgress')}</h3>${reached?`<span class="chip" style="background:var(--green-light);color:#166534">${t('goalReached')}</span>`:''}</div>
      <div class="progress">
        <div class="seg-done" style="width:${donePct}%"></div>
        <div class="seg-sel" style="width:${selPct}%"></div>
      </div>
      <div class="progress-label"><span>${done} ${t('hoursShort')} / ${goal} ${t('hoursShort')}</span><span>${pct}%</span></div>
      <div class="legend">
        <span class="legend-item"><span class="dot dot-done"></span>${t('legendDone')} (${done} ${t('hoursShort')})</span>
        <span class="legend-item"><span class="dot dot-sel"></span>${t('legendSelected')} (${selected} ${t('hoursShort')})</span>
        <span class="legend-item"><span class="dot dot-rem"></span>${t('legendRemaining')} (${remaining} ${t('hoursShort')})</span>
      </div>
    </div>
    <div class="card">
      <div class="card-head"><h3>${t('myUpcoming')}</h3>
        <button class="btn btn-ghost btn-sm" onclick="go('calendar')">${t('browseEvents')} →</button></div>
      ${mine.length? mine.map(x=>{
        const need=x.ev.needs.find(n=>n.id===x.r.nid); const act=activity(need.actId);
        const assigned=assignedRegs(x.r.eid,x.r.nid,need.qty).some(z=>z.id===x.r.id);
        return `<div class="act-type" style="cursor:pointer" onclick="go('calendar')">
          <div class="swatch" style="background:${act.color}">${esc(initials({first:act.name,last:''}))}</div>
          <div class="info"><div class="n">${esc(act.name)} — ${esc(x.ev.title)}</div>
            <div class="h">${fmtDate(x.ev.date)}</div></div>
          <span class="chip" style="background:${assigned?'var(--green-light)':'var(--amber-light)'};color:${assigned?'#166534':'#92400e'}">
            ${assigned?t('youAreIn'):t('youWait')}</span></div>`;
      }).join('') : `<div class="empty-state"><div class="em">🗓️</div>${t('noUpcoming')}</div>`}
    </div>`;
}

/* ---------------- PARENT: Dashboard ---------------- */
function childrenOf(parent){ return (parent.childIds||[]).map(id=>userById(id)).filter(Boolean); }
function renderParentDash(c){
  const u=currentUser();
  const bd=playerHoursBreakdown(u.id); // le parent peut aussi faire du bénévolat
  const myHours=bd.done, mySel=bd.selected;
  const kids=childrenOf(u);
  // upcoming regs du parent
  const mine=DB.regs.filter(r=>r.pid===u.id).map(r=>({r,ev:eventById(r.eid)}))
    .filter(x=>x.ev && !isPast(x.ev.date)).sort((a,b)=>new Date(a.ev.date)-new Date(b.ev.date));
  const kidCards = kids.map(k=>{
    const kb=playerHoursBreakdown(k.id); const goal=DB.settings.hoursGoal;
    const donePct=goal>0?Math.min(100,kb.done/goal*100):0;
    const selPct=goal>0?Math.min(100-donePct,kb.selected/goal*100):0;
    const pct=goal>0?Math.min(100,Math.round(kb.done/goal*100)):0;
    return `<div class="card" style="margin-bottom:14px">
      <div class="card-head"><h3>${esc(k.first)} ${esc(k.last)} <span class="cat-badge">${esc(catLabel(k.category))}</span></h3>
        <span class="chip">${kb.done} ${t('hoursShort')} / ${goal} ${t('hoursShort')}</span></div>
      <div class="progress">
        <div class="seg-done" style="width:${donePct}%"></div>
        <div class="seg-sel" style="width:${selPct}%"></div>
      </div>
      <div class="progress-label"><span>${kb.done} ${t('hoursShort')} / ${goal} ${t('hoursShort')}</span><span>${pct}%</span></div>
    </div>`;
  }).join('');
  c.innerHTML=`
    <div class="page-head"><h2>${t('navDash')}</h2><p>${esc(u.first)} — ${t('parentOf')} ${esc(kids.map(k=>k.first).join(', ')||'—')}</p></div>
    <div class="grid grid-3" style="margin-bottom:18px">
      <div class="stat"><div class="label">${t('volunteerHours')}</div><div class="value">${myHours}<small> ${t('hoursShort')}</small></div></div>
      <div class="stat"><div class="label">${t('legendSelected')}</div><div class="value">${mySel}<small> ${t('hoursShort')}</small></div></div>
      <div class="stat"><div class="label">${t('myChildren')}</div><div class="value">${kids.length}</div></div>
    </div>
    <div class="card" style="margin-bottom:18px">
      <div class="card-head"><h3>${t('myVolunteering')}</h3>
        <button class="btn btn-ghost btn-sm" onclick="go('calendar')">${t('browseEvents')} →</button></div>
      <p style="color:var(--muted);font-size:13px;margin:0 0 10px">${t('parentHoursNote')}</p>
      ${mine.length? mine.map(x=>{
        const need=x.ev.needs.find(n=>n.id===x.r.nid); const act=activity(need.actId);
        const assigned=assignedRegs(x.r.eid,x.r.nid,need.qty).some(z=>z.id===x.r.id);
        return `<div class="act-type" style="cursor:pointer" onclick="go('calendar')">
          <div class="swatch" style="background:${act.color}">${esc(initials({first:act.name,last:''}))}</div>
          <div class="info"><div class="n">${esc(act.name)} — ${esc(x.ev.title)}</div>
            <div class="h">${fmtDate(x.ev.date)}</div></div>
          <span class="chip" style="background:${assigned?'var(--green-light)':'var(--amber-light)'};color:${assigned?'#166534':'#92400e'}">
            ${assigned?t('youAreIn'):t('youWait')}</span></div>`;
      }).join('') : `<div class="empty-state"><div class="em">🗓️</div>${t('noUpcoming')}</div>`}
    </div>
    <div class="page-head" style="margin-bottom:10px"><h2 style="font-size:18px">${t('childrenProgress')}</h2></div>
    ${kidCards || `<div class="empty-state"><div class="em">👥</div>—</div>`}`;
}

/* ---------------- PLAYER: Calendar / Events ---------------- */
function renderPlayerCalendar(c){
  c.innerHTML=`
    <div class="page-head"><h2>${t('navCalendar')}</h2><p>${t('appTagline')}</p></div>
    <div style="margin-bottom:18px"><div class="seg">
      <button class="${state.eventFilter==='upcoming'?'active':''}" onclick="setFilter('upcoming')">${t('upcoming')}</button>
      <button class="${state.eventFilter==='past'?'active':''}" onclick="setFilter('past')">${t('past')}</button>
    </div></div>
    <div id="eventList"></div>`;
  renderEventList(document.getElementById('eventList'), false);
}
function setFilter(f){ state.eventFilter=f; render(); }

function renderEventList(host, coachMode){
  let evs=[...DB.events].sort((a,b)=>new Date(a.date)-new Date(b.date));
  if(state.eventFilter==='upcoming') evs=evs.filter(e=>!isPast(e.date));
  else evs=evs.filter(e=>isPast(e.date)).reverse();
  if(!evs.length){ host.innerHTML=`<div class="empty-state"><div class="em">📅</div>${t('noEvents')}</div>`; return; }
  host.innerHTML=evs.map(e=>eventCardHTML(e,coachMode)).join('');
}

// Besoins (activités) dont les instructions sont agrandies dans la liste d'événements.
let _openNeedRows={};
function toggleNeedRow(key){ _openNeedRows[key]=!_openNeedRows[key]; render(); }
function eventCardHTML(e, coachMode){
  const past=isPast(e.date); const dp=dateParts(e.date);
  const totalSpots=e.needs.reduce((s,n)=>s+n.qty,0);
  const filled=e.needs.reduce((s,n)=>s+Math.min(n.qty,regsForNeed(e.id,n.id).length),0);
  return `<div class="event-card">
    <div class="event-top">
      <div class="event-date"><div class="d">${dp.d}</div><div class="m">${esc(dp.m)}</div></div>
      <div class="meta">
        <h4>${esc(e.title)}</h4>
        <div class="sub"><span>🕒 ${fmtDate(e.date)}</span>${e.location?`<span>📍 ${esc(e.location)}</span>`:''}
          <span>✅ ${filled}/${totalSpots} ${t('filled')}</span>${e.category?`<span class="cat-badge">🏷️ ${esc(catLabel(e.category))}</span>`:''}</div>
      </div>
      <span class="event-badge ${past?'badge-past':'badge-up'}">${past?t('past'):t('upcoming')}</span>
      ${coachMode?`<div style="display:flex;gap:6px;margin-left:8px">
        <button class="btn btn-ghost btn-sm" onclick="openEventModal('${e.id}')">${t('edit')}</button>
        <button class="btn btn-ghost btn-sm" onclick="copyEvent('${e.id}')">⧉ ${t('copyEvent')}</button>
        <button class="btn btn-ghost btn-sm" onclick="openReminders('${e.id}')">✉ ${t('reminders')}</button>
        ${eventHasAssignableCandidates(e)?`<button class="btn btn-secondary btn-sm" onclick="openAssignCandidates('${e.id}')">🔀 ${t('assignCandidates')}</button>`:''}
        <button class="btn btn-danger btn-sm" onclick="deleteEvent('${e.id}')">✕</button></div>`:''}
    </div>
    <div class="event-body">
      ${e.needs.map(n=>needHTML(e,n,coachMode,past)).join('')}
    </div></div>`;
}

/* Render one need (activity slot block) */
function needHTML(e,n,coachMode,past){
  const act=activity(n.actId); if(!act) return '';
  const hrs = n.hours!=null?n.hours:act.hours;
  const all=regsForNeed(e.id,n.id);
  const assigned=all.slice(0,n.qty);
  const waiting=all.slice(n.qty);
  const me=currentUser();
  const myReg = me.role==='player' ? all.find(r=>r.pid===me.id) : null;
  const iAmAssigned = myReg && assigned.some(r=>r.id===myReg.id);
  // slots display
  let slots='';
  for(let i=0;i<n.qty;i++){
    const r=assigned[i];
    if(r){ const p=userById(r.pid);
      slots+=`<div class="slot">${avatarHTML(p,'av')}<span>${esc(p.first)} ${esc(p.last[0])}.</span>${r.pid===me.id?` <span class="mine-flag">${t('yourSpot')}</span>`:''}</div>`;
    } else {
      slots+=`<div class="slot empty">— ${t('place')} ${i+1} —</div>`;
    }
  }
  // waitlist circles with initials
  let wl='';
  if(waiting.length){
    wl=`<div class="waitlist"><span class="lbl">${t('waitlist')}:</span>`+
      waiting.map((r,idx)=>{ const p=userById(r.pid);
        return `<div class="wl-circle ${p.id===me.id?'mine':''}" title="${esc(p.first)} ${esc(p.last)}">${initials(p)}<span class="pos">${idx+1}</span></div>`;
      }).join('')+`</div>`;
  }
  // player actions
  let actions='';
  if(me.role==='player' && !past){
    if(myReg){
      if(canWithdrawNow(e.date)){
        actions=`<button class="btn btn-danger btn-sm" onclick="withdraw('${myReg.id}')">${t('withdraw')}</button>
                 <span class="need-note">${iAmAssigned?t('youAreIn'):t('youWait')}</span>`;
      } else {
        actions=`<span class="need-note">🔒 ${t('deadlinePassed')}</span>`;
      }
    } else if(categoryBlocked(me, e)){
      actions=`<span class="need-note">🚫 ${t('catBlocked')}</span>`;
    } else {
      const otherReg = myRegForEvent(e.id);
      if(otherReg){ actions=`<span class="need-note">↪ ${t('alreadyRegistered')}</span>`; }
      else { actions=`<button class="btn btn-primary btn-sm" onclick="signUp('${e.id}','${n.id}')">${t('signUp')}</button>`; }
    }
  }
  if(coachMode && past && DB.settings.creditMode==='approval' && all.length){
    actions=`<button class="btn btn-ghost btn-sm" onclick="openPresence('${e.id}')">${t('confirmPresence')} →</button>`;
  }
  const isFull=assigned.length>=n.qty;
  const hasInfo = (act.desc&&act.desc.trim()) || (n.instr&&n.instr.trim());
  const rowKey = e.id+'_'+n.id;
  const open = _openNeedRows[rowKey];
  return `<div class="need">
    <div class="need-head">
      <div class="swatch" style="background:${act.color}">${esc(act.name.slice(0,2).toUpperCase())}</div>
      <span class="n">${esc(act.name)}</span>
      <span class="cap">${assigned.length}/${n.qty} ${t('places')}</span>
      <span class="hrs">${hrs} ${t('hoursShort')}</span>
      ${isFull && me.role==='player' && !myReg && !past?`<span class="chip" style="background:var(--line);color:var(--muted)">${t('full')}</span>`:''}
      ${hasInfo?`<button class="need-info-btn" onclick="toggleNeedRow('${rowKey}')" title="${t('showDetails')}">ℹ︎ ${open?t('hideDetails'):t('showDetails')}</button>`:''}
    </div>
    ${hasInfo&&open?instructionsHTML(act,n):''}
    <div class="slots">${slots}</div>
    ${wl}
    ${actions?`<div class="need-actions">${actions}</div>`:''}
  </div>`;
}

// Category rule: a player who plays in the event's category cannot volunteer for it.
// Returns true if this player is blocked from signing up for this event.
function categoryBlocked(user, ev){
  if(!user || user.role!=='player') return false;
  if(!ev || !ev.category) return false;       // event with no category → open to everyone
  return user.category === ev.category;        // same category → blocked
}
function hoursUntil(iso){ return (new Date(iso).getTime()-Date.now())/3600000; }
function canWithdrawNow(iso){ return hoursUntil(iso) >= DB.settings.withdrawHours; }
function belowDeadline(iso){ return hoursUntil(iso) >= DB.settings.withdrawHours; }

/* ---------------- PLAYER actions: sign up / withdraw ---------------- */
// Nom lisible d'une activité pour les journaux.
function actName(need){ if(!need) return null; const a=activity(need.actId); return a?a.name:need.actId; }
function signUp(eid,nid){
  const me=currentUser();
  const ev=eventById(eid);
  if(categoryBlocked(me, ev)){ LOG.warn('Inscription bloquée (catégorie)',{user:me.id, event:ev&&ev.id, eventCat:ev&&ev.category, userCat:me.category}); toast(t('catBlocked'),'err'); return; }
  if(myRegForEvent(eid)){ LOG.warn('Inscription refusée (déjà inscrit)',{user:me.id, event:eid}); toast(t('alreadyRegistered'),'err'); return; }
  const need=ev.needs.find(n=>n.id===nid);
  const before=regsForNeed(eid,nid).length;
  const assigned = before < need.qty;
  LOG.exec('signUp', function(){
    DB.regs.push({id:uid('r_'), pid:me.id, eid, nid, ts:Date.now(), present:null});
    saveDB();
  }, {user:me.id, userName:(me.first+' '+(me.last||'')).trim(), event:eid, eventTitle:ev&&ev.title, need:nid, activity:actName(need), position: assigned?'assigné':'liste d\'attente', rank:before+1});
  LOG.event(assigned?'Inscription à une activité':'Ajout à la liste d\'attente',{user:me.id, userName:(me.first+' '+(me.last||'')).trim(), event:eid, eventTitle:ev&&ev.title, activity:actName(need), assigned:assigned});
  toast(assigned ? t('signedUp') : t('addedWait'), assigned ? 'ok':'');
  render();
}
function withdraw(regId){
  const reg=DB.regs.find(r=>r.id===regId); if(!reg) return;
  const ev=eventById(reg.eid); const need=ev.needs.find(n=>n.id===reg.nid);
  if(!canWithdrawNow(ev.date)){ LOG.warn('Désistement refusé (délai dépassé)',{reg:regId, event:reg.eid}); toast(t('deadlinePassed'),'err'); return; }
  // was this an assigned spot?
  const wasAssigned=assignedRegs(reg.eid,reg.nid,need.qty).some(r=>r.id===regId);
  const who=userById(reg.pid);
  LOG.exec('withdraw', function(){
    DB.regs=DB.regs.filter(r=>r.id!==regId);
    saveDB();
  }, {reg:regId, user:reg.pid, userName:who?(who.first+' '+(who.last||'')).trim():reg.pid, event:reg.eid, eventTitle:ev&&ev.title, activity:actName(need), wasAssigned:wasAssigned});
  LOG.event('Désistement',{user:reg.pid, userName:who?(who.first+' '+(who.last||'')).trim():reg.pid, event:reg.eid, eventTitle:ev&&ev.title, activity:actName(need), wasAssigned:wasAssigned});
  toast(t('withdrawn'));
  // automatic promotion: next in line becomes assigned by natural ordering (ts).
  if(wasAssigned){
    const nowAssigned=assignedRegs(reg.eid,reg.nid,need.qty);
    const promoted=nowAssigned[need.qty-1];
    if(promoted){ const p=userById(promoted.pid); LOG.event('Promotion automatique depuis la liste d\'attente',{promoted:p.id, promotedName:(p.first+' '+(p.last||'')).trim(), event:reg.eid, activity:actName(need)}); setTimeout(()=>toast(`${initials(p)} ${t('promoted')}`,'ok'),400); }
  }
  // Auto-remplissage : si des places restent libres sur d'autres postes,
  // on y déplace les candidats encore en attente (1er arrivé, 1er servi).
  runAutoFill(reg.eid, {silent:false});
  render();
}

/* ---------------- PLAYER: My hours detail ---------------- */
// Lignes « Mes activités » actuellement agrandies (par id d'inscription).
let _openActRows={};
function toggleActRow(regId){ _openActRows[regId]=!_openActRows[regId]; render(); }
// Bloc HTML des consignes : description du poste (générale) + instruction spécifique à l'événement.
function instructionsHTML(act, need){
  const desc = act && act.desc && act.desc.trim();
  const instr = need && need.instr && need.instr.trim();
  const descBody = desc
    ? `<div class="instr-t">${esc(desc)}</div>`
    : `<div class="instr-t instr-empty">${t('noDescShort')}</div>`;
  const instrBody = instr
    ? `<div class="instr-t">${esc(instr)}</div>`
    : `<div class="instr-t instr-empty">${t('noInstr')}</div>`;
  return `<div class="instr-box">
    <div class="instr-blk"><div class="instr-h">📋 ${t('jobDesc')}</div>${descBody}</div>
    <div class="instr-blk"><div class="instr-h">📌 ${t('specInstr')}</div>${instrBody}</div>
  </div>`;
}
function renderPlayerHours(c){
  const u=currentUser(); const goal=DB.settings.hoursGoal;
  const bd=playerHoursBreakdown(u.id);
  const done=bd.done, selected=bd.selected;
  const donePct = goal>0?Math.min(100, done/goal*100):0;
  const selPct  = goal>0?Math.min(100-donePct, selected/goal*100):0;
  const pct=goal>0?Math.min(100,Math.round(done/goal*100)):0;
  const remaining=Math.max(0,goal-done);
  const reached=done>=goal;
  const rows=DB.regs.filter(r=>r.pid===u.id).map(r=>({r,ev:eventById(r.eid)})).filter(x=>x.ev)
    .sort((a,b)=>new Date(b.ev.date)-new Date(a.ev.date));
  c.innerHTML=`
    <div class="page-head"><h2>${t('navMyHours')}</h2><p>${done} ${t('hoursShort')} ${t('of')} ${goal} ${t('hoursShort')}</p></div>
    <div class="card">
      <div class="card-head"><h3>${t('myProgress')}</h3>${reached?`<span class="chip" style="background:var(--green-light);color:#166534">${t('goalReached')}</span>`:''}</div>
      <div class="progress">
        <div class="seg-done" style="width:${donePct}%"></div>
        <div class="seg-sel" style="width:${selPct}%"></div>
      </div>
      <div class="progress-label"><span>${done} ${t('hoursShort')} / ${goal} ${t('hoursShort')}</span><span>${pct}%</span></div>
      <div class="legend">
        <span class="legend-item"><span class="dot dot-done"></span>${t('legendDone')} (${done} ${t('hoursShort')})</span>
        <span class="legend-item"><span class="dot dot-sel"></span>${t('legendSelected')} (${selected} ${t('hoursShort')})</span>
        <span class="legend-item"><span class="dot dot-rem"></span>${t('legendRemaining')} (${remaining} ${t('hoursShort')})</span>
      </div>
    </div>
    <div class="card">
      <div class="card-head"><h3>${t('navMyHours')}</h3></div>
      <table><thead><tr><th>${t('eventTitle')}</th><th>${t('navActivities')}</th><th>${t('hoursShort')}</th><th>${t('role')}</th><th></th></tr></thead><tbody>
      ${rows.length?rows.map(x=>{
        const need=x.ev.needs.find(n=>n.id===x.r.nid); const act=activity(need.actId);
        const hrs=need.hours!=null?need.hours:act.hours;
        const assigned=assignedRegs(x.r.eid,x.r.nid,need.qty).some(z=>z.id===x.r.id);
        const credited=DB.settings.creditMode==='auto'?isPast(x.ev.date):(x.r.present===true);
        let status = !assigned?`<span class="chip" style="background:var(--amber-light);color:#92400e">${t('youWait')}</span>`
          : credited?`<span class="chip" style="background:var(--green-light);color:#166534">✓ ${hrs} ${t('hoursShort')}</span>`
          : `<span class="chip" style="background:var(--line);color:var(--muted)">${t('pendingApproval')}</span>`;
        const hasInfo = (act.desc&&act.desc.trim()) || (need.instr&&need.instr.trim());
        const open = _openActRows[x.r.id];
        return `<tr><td><b>${esc(x.ev.title)}</b><br><span style="color:var(--muted);font-size:12px">${fmtDate(x.ev.date)}</span></td>
          <td><span class="chip" style="background:${act.color}22;color:${act.color}"><span class="tag-dot" style="background:${act.color}"></span>${esc(act.name)}</span></td>
          <td><b>${assigned&&credited?hrs:0}</b></td><td>${status}</td>
          <td style="text-align:right">${hasInfo?`<button class="btn btn-ghost btn-sm" onclick="toggleActRow('${x.r.id}')">${open?t('hideDetails'):t('showDetails')} ${open?'▴':'▾'}</button>`:''}</td></tr>
          ${hasInfo&&open?`<tr class="detail-row"><td colspan="5">${instructionsHTML(act,need)}</td></tr>`:''}`;
      }).join(''):`<tr><td colspan="5"><div class="empty-state">${t('noUpcoming')}</div></td></tr>`}
      </tbody></table>
    </div>`;
}


/* =====================================================================
   COACH VIEWS
   ===================================================================== */

/* ---------------- COACH: Activity types ---------------- */
function renderCoachActivities(c){
  c.innerHTML=`
    <div class="page-head"><h2>${t('activityTypes')}</h2><p>${t('appTagline')}</p></div>
    <div class="card">
      <div class="card-head"><h3>${t('activityTypes')}</h3>
        <button class="btn btn-primary btn-sm" onclick="openActivityModal()">+ ${t('addActivity')}</button></div>
      ${DB.activities.length? DB.activities.map(a=>{
        const open=!!_openActTypes[a.id];
        return `
        <div class="act-type ${open?'is-open':''}">
          <div class="act-type-head" onclick="toggleActType('${a.id}')">
            <div class="swatch" style="background:${a.color}">${esc(a.name.slice(0,2).toUpperCase())}</div>
            <div class="info"><div class="n">${esc(a.name)} <span class="act-caret">${open?'▾':'▸'}</span></div>
              <div class="h">${a.hours} ${t('hoursShort')} ${t('perEvent')}</div></div>
            <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();openActivityModal('${a.id}')">${t('edit')}</button>
            <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();deleteActivity('${a.id}')">✕</button>
          </div>
          ${open?`<div class="act-type-body">${activityDetailHTML(a)}</div>`:''}
        </div>`;}).join('')
        : `<div class="empty-state"><div class="em">🏷️</div>${t('noActivities')}</div>`}
    </div>`;
}
// État d'agrandissement des types d'activité (vue coach).
let _openActTypes={};
function toggleActType(id){ _openActTypes[id]=!_openActTypes[id]; render(); }
// Panneau agrandi : description du poste + instructions spécifiques regroupées par événement.
function activityDetailHTML(a){
  const descHTML = (a.desc&&a.desc.trim())
    ? `<div class="detail-block"><div class="detail-label">${t('jobDesc')}</div><p class="detail-text">${esc(a.desc)}</p></div>`
    : `<div class="detail-block"><p class="instr-empty">${t('actNoDesc')}</p></div>`;
  const genInstrHTML = (a.instr&&a.instr.trim())
    ? `<div class="detail-block"><div class="detail-label">${t('genInstr')}</div><p class="detail-text">${esc(a.instr)}</p></div>`
    : '';
  // Rassembler chaque événement qui propose ce type ET porte une instruction spécifique.
  const rows=[];
  (DB.events||[]).slice().sort((x,y)=>String(x.date).localeCompare(String(y.date))).forEach(e=>{
    (e.needs||[]).forEach(n=>{
      if(n.actId===a.id && n.instr && n.instr.trim()){
        rows.push(`<li><span class="ev-tag">${esc(e.title)} · ${fmtDate(e.date)}</span><span class="ev-instr">${esc(n.instr)}</span></li>`);
      }
    });
  });
  const instrHTML = `${genInstrHTML}<div class="detail-block"><div class="detail-label">${t('actInstrByEvent')}</div>`
    + (rows.length? `<ul class="ev-instr-list">${rows.join('')}</ul>` : `<p class="instr-empty">${t('actNoInstrYet')}</p>`)
    + `</div>`;
  return descHTML + instrHTML;
}
function openActivityModal(id){
  const a = id?DB.activities.find(x=>x.id===id):null;
  const sel = a?a.color:COLORS[0];
  modal(a?t('editActivity'):t('addActivity'), `
    <div class="field"><label>${t('activityName')}</label>
      <input id="acName" value="${a?esc(a.name):''}" placeholder="${t('activityName')}"></div>
    <div class="field"><label>${t('defaultHours')}</label>
      <input id="acHours" type="number" min="0" step="0.5" value="${a?a.hours:2}"></div>
    <div class="field"><label>${t('jobDesc')}</label>
      <textarea id="acDesc" rows="3" placeholder="${t('jobDescPh')}">${a&&a.desc?esc(a.desc):''}</textarea>
      <div class="need-note" style="margin-top:4px">${t('jobDescHint')}</div></div>
    <div class="field"><label>${t('genInstr')}</label>
      <textarea id="acInstr" rows="3" placeholder="${t('genInstrPh')}">${a&&a.instr?esc(a.instr):''}</textarea>
      <div class="need-note" style="margin-top:4px">${t('genInstrHint')}</div></div>
    <div class="field"><label>${t('color')}</label>
      <div class="color-picker" id="acColors">
        ${COLORS.map(col=>`<div class="color-opt ${col===sel?'sel':''}" style="background:${col}" onclick="pickColor(this,'${col}')" data-c="${col}"></div>`).join('')}
      </div></div>`,
    [{label:t('cancel'),cls:'btn-ghost',fn:closeModal},
     {label:t('save'),cls:'btn-primary',fn:()=>saveActivity(id)}]);
}
let _pickedColor=null;
function pickColor(el,col){ document.querySelectorAll('#acColors .color-opt').forEach(x=>x.classList.remove('sel')); el.classList.add('sel'); _pickedColor=col; }
function saveActivity(id){
  const name=document.getElementById('acName').value.trim();
  const hours=parseFloat(document.getElementById('acHours').value)||0;
  const color=_pickedColor || (document.querySelector('#acColors .sel')?.dataset.c) || COLORS[0];
  if(!name){ toast(t('errFillAll'),'err'); return; }
  const desc=(document.getElementById('acDesc')?document.getElementById('acDesc').value.trim():'')||'';
  const instr=(document.getElementById('acInstr')?document.getElementById('acInstr').value.trim():'')||'';
  if(id){ const a=DB.activities.find(x=>x.id===id); a.name=name; a.hours=hours; a.color=color; a.desc=desc; a.instr=instr; LOG.event('Type d\'activité modifié',{id:id, name:name, hours:hours, hasDesc:!!desc, hasInstr:!!instr}); }
  else { const na={id:uid('a_'),name,hours,color,desc,instr}; DB.activities.push(na); LOG.event('Type d\'activité créé',{id:na.id, name:name, hours:hours, hasDesc:!!desc, hasInstr:!!instr}); }
  _pickedColor=null; saveDB(); closeModal(); toast(t('savedOk'),'ok'); render();
}
function deleteActivity(id){
  confirmModal(t('confirmDelete'),()=>{
    const a=DB.activities.find(x=>x.id===id);
    DB.activities=DB.activities.filter(a=>a.id!==id);
    // remove needs referencing it + their regs
    let regsRemoved=0;
    DB.events.forEach(e=>{ const removed=e.needs.filter(n=>n.actId===id).map(n=>n.id);
      e.needs=e.needs.filter(n=>n.actId!==id);
      const b=DB.regs.length; DB.regs=DB.regs.filter(r=>!(r.eid===e.id && removed.includes(r.nid))); regsRemoved+=b-DB.regs.length; });
    LOG.event('Type d\'activité supprimé',{id:id, name:a&&a.name, inscriptionsSupprimées:regsRemoved});
    saveDB(); closeModal(); toast(t('deletedOk')); render();
  });
}

/* ---------------- COACH: Events ---------------- */
function renderCoachEvents(c){
  c.innerHTML=`
    <div class="page-head"><h2>${t('navEvents')}</h2><p>${DB.settings.seasonName?('🗓️ '+esc(DB.settings.seasonName)):t('appTagline')}</p></div>
    <div class="card-head" style="margin-bottom:14px">
      <div class="seg">
        <button class="${state.eventFilter==='upcoming'?'active':''}" onclick="setFilter('upcoming')">${t('upcoming')}</button>
        <button class="${state.eventFilter==='past'?'active':''}" onclick="setFilter('past')">${t('past')}</button>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="openImportModal()">⬆ ${t('importBtn')}</button>
        <button class="btn btn-primary btn-sm" onclick="openEventModal()">+ ${t('createEvent')}</button>
      </div>
    </div>
    <div id="eventList"></div>`;
  renderEventList(document.getElementById('eventList'), true);
}

let _needDraft=[]; // [{actId, qty, hours}]
// srcId: quand fourni (et id=null), pré-remplit depuis un événement source (copie) sans assigner de joueurs
function openEventModal(id, srcId){
  const e = id?DB.events.find(x=>x.id===id):null;
  const src = (!e && srcId)?DB.events.find(x=>x.id===srcId):null;
  const base = e || src; // source des valeurs pré-remplies
  // en mode copie, on régénère des IDs de besoins neufs (aucune inscription ne les référence)
  _needDraft = base? base.needs.map(n=>({actId:n.actId,qty:n.qty,hours:n.hours,instr:n.instr||'',id: e?n.id:uid('n_')})) : [];
  const dtVal = e? toLocalInput(e.date) : ''; // date vidée en copie
  const titleVal = e? e.title : (src? (src.title + t('copySuffix')) : '');
  const modalTitle = e? t('editEvent') : (src? t('copyEventTitle') : t('createEvent'));
  modal(modalTitle, `
    ${src?`<div class="need-note" style="background:var(--amber-light);color:#92400e;padding:8px 10px;border-radius:8px;margin-bottom:12px">⧉ ${t('copyEventHint')}</div>`:''}
    <div class="field"><label>${t('eventTitle')}</label><input id="evTitle" value="${esc(titleVal)}" placeholder="${t('eventTitle')}"></div>
    <div class="row-2">
      <div class="field"><label>${t('eventDate')}</label><input id="evDate" type="datetime-local" value="${dtVal}"></div>
      <div class="field"><label>${t('eventLocation')}</label><input id="evLoc" value="${base?esc(base.location||''):''}"></div>
    </div>
    <div class="field"><label>${t('eventCategory')}</label><select id="evCategory"></select></div>
    <div class="field"><label>${t('needs')}</label>
      <div class="need-builder">
        <div class="field" style="flex:2;min-width:130px"><label style="font-size:11px">${t('navActivities')}</label>
          <select id="ndAct">${DB.activities.map(a=>`<option value="${a.id}">${esc(a.name)} (${a.hours}${t('hoursShort')})</option>`).join('')}</select></div>
        <div class="field" style="width:80px"><label style="font-size:11px">${t('quantity')}</label>
          <input id="ndQty" type="number" min="1" value="1"></div>
        <div class="field" style="width:90px"><label style="font-size:11px">${t('hoursShort')}</label>
          <input id="ndHours" type="number" min="0" step="0.5" placeholder="auto"></div>
        <button class="btn btn-ghost btn-sm" style="height:41px" onclick="addNeedDraft()">+ ${t('addNeed')}</button>
      </div>
      <div id="needDraftList"></div>
    </div>`,
    [{label:t('cancel'),cls:'btn-ghost',fn:closeModal},
     {label:t('saveEvent'),cls:'btn-primary',fn:()=>saveEvent(id)}]);
  fillCategoryOptions(document.getElementById('evCategory'), base?(base.category||''):'', true);
  renderNeedDraft();
}
// Copie d'un événement : ouvre le formulaire de création pré-rempli (activités + places), sans joueurs assignés
function copyEvent(srcId){ openEventModal(null, srcId); }
function toLocalInput(iso){ const dt=new Date(iso); const off=dt.getTimezoneOffset(); const l=new Date(dt.getTime()-off*60000); return l.toISOString().slice(0,16); }
function addNeedDraft(){
  const actId=document.getElementById('ndAct').value;
  const qty=parseInt(document.getElementById('ndQty').value)||1;
  const hv=document.getElementById('ndHours').value;
  const a=activity(actId);
  // Hériter des heures de l'activité si le champ est laissé vide
  const hours = hv===''? (a?a.hours:0) : parseFloat(hv);
  _needDraft.push({actId,qty,hours,instr:(a&&a.instr?a.instr:''),id:uid('n_')});
  renderNeedDraft();
}
function removeNeedDraft(i){ _needDraft.splice(i,1); renderNeedDraft(); }
function renderNeedDraft(){
  const host=document.getElementById('needDraftList'); if(!host) return;
  if(!_needDraft.length){ host.innerHTML=`<div class="need-note" style="padding:6px 2px">${t('noNeeds')}</div>`; return; }
  host.innerHTML=_needDraft.map((n,i)=>{ const a=activity(n.actId); const hrs=n.hours!=null?n.hours:a.hours;
    return `<div class="need-chip need-chip-col">
      <div class="need-chip-row">
        <div class="swatch" style="background:${a.color}">${esc(a.name.slice(0,2).toUpperCase())}</div>
        <span class="t">${esc(a.name)} — ${n.qty} ${t('places')} · ${hrs} ${t('hoursShort')}</span>
        <button class="x" onclick="removeNeedDraft(${i})">✕</button>
      </div>
      <input class="need-instr" placeholder="${t('specInstrPh')}" value="${n.instr?esc(n.instr):''}" oninput="_needDraft[${i}].instr=this.value">
    </div>`;
  }).join('');
}
function saveEvent(id){
  const title=document.getElementById('evTitle').value.trim();
  const dateV=document.getElementById('evDate').value;
  const loc=document.getElementById('evLoc').value.trim();
  if(!title||!dateV){ toast(t('errFillAll'),'err'); return; }
  if(!_needDraft.length){ toast(t('noNeeds'),'err'); return; }
  const iso=new Date(dateV).toISOString();
  const category=(document.getElementById('evCategory').value)||null;
  const needs=_needDraft.map(n=>({id:n.id||uid('n_'),actId:n.actId,qty:n.qty,hours:n.hours,instr:(n.instr||'').trim()}));
  if(id){ const e=DB.events.find(x=>x.id===id);
    // drop regs for removed needs
    const keptIds=needs.map(n=>n.id);
    DB.regs=DB.regs.filter(r=>r.eid!==id || keptIds.includes(r.nid));
    e.title=title; e.date=iso; e.location=loc; e.needs=needs; e.category=category;
    // if category changed, drop any now-conflicting registrations
    if(category){ DB.regs=DB.regs.filter(r=>{ if(r.eid!==id) return true; const u=userById(r.pid); return !(u && u.category===category); }); }
    LOG.event('Événement modifié',{id:id, title:title, date:iso, category:category, postes:needs.length, placesTotal:needs.reduce((s,n)=>s+n.qty,0)});
  } else { const ne={id:uid('e_'),title,date:iso,location:loc,needs,category}; DB.events.push(ne); LOG.event('Événement créé',{id:ne.id, title:title, date:iso, category:category, postes:needs.length, placesTotal:needs.reduce((s,n)=>s+n.qty,0)}); }
  _needDraft=[]; saveDB(); closeModal(); toast(t('savedOk'),'ok'); render();
}
function deleteEvent(id){
  confirmModal(t('confirmDelete'),()=>{
    const e=DB.events.find(x=>x.id===id);
    const regs=DB.regs.filter(r=>r.eid===id).length;
    DB.events=DB.events.filter(e=>e.id!==id);
    DB.regs=DB.regs.filter(r=>r.eid!==id);
    LOG.event('Événement supprimé',{id:id, title:e&&e.title, inscriptionsSupprimées:regs});
    saveDB(); closeModal(); toast(t('deletedOk')); render();
  });
}

/* ---------------- COACH: Import d'événements (tableur) ---------------- */
// Normalisation accent-insensible pour apparier les noms d'activités
function normKey(s){ return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
// Détecte le séparateur le plus probable d'une ligne (tab, point-virgule, virgule)
function detectDelim(line){
  if(line.indexOf('\t')>=0) return '\t';
  if(line.indexOf(';')>=0 && line.indexOf(',')<0) return ';';
  if(line.indexOf(';')>=0 && line.split(';').length>line.split(',').length) return ';';
  return ',';
}
// Découpe une ligne CSV en respectant les guillemets
function splitCsvLine(line,d){
  const out=[]; let cur=''; let q=false;
  for(let i=0;i<line.length;i++){ const ch=line[i];
    if(q){ if(ch==='"'){ if(line[i+1]==='"'){cur+='"';i++;} else q=false; } else cur+=ch; }
    else { if(ch==='"') q=true; else if(ch===d){ out.push(cur); cur=''; } else cur+=ch; }
  }
  out.push(cur); return out.map(s=>s.trim());
}
// Analyse une date souple : ISO, "YYYY-MM-DD HH:mm", "JJ/MM/AAAA HH:mm". Retourne ISO ou null.
function parseFlexDate(s){
  s=String(s||'').trim(); if(!s) return null;
  let m;
  // JJ/MM/AAAA [HH:mm]
  if((m=s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})(?:[ T](\d{1,2}):(\d{2}))?/))){
    const d=new Date(+m[3],+m[2]-1,+m[1],m[4]?+m[4]:0,m[5]?+m[5]:0);
    return isNaN(d)?null:d.toISOString();
  }
  // AAAA-MM-JJ [HH:mm]  (accepte T ou espace)
  if((m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2}))?/))){
    const d=new Date(+m[1],+m[2]-1,+m[3],m[4]?+m[4]:0,m[5]?+m[5]:0);
    return isNaN(d)?null:d.toISOString();
  }
  const d=new Date(s); return isNaN(d)?null:d.toISOString();
}
// Reconnaît une ligne d'en-tête (contient des mots-clés connus, pas de date)
function looksLikeHeader(cells){
  const joined=normKey(cells.join(' '));
  const kw=['date','titre','title','activite','activity','places','spots','lieu','location','heures','hours','categorie','category'];
  const hits=kw.filter(k=>joined.indexOf(k)>=0).length;
  return hits>=2 && !parseFlexDate(cells[0]);
}
// PARSEUR PRINCIPAL (pur) : texte tableur -> plan d'import.
// Colonnes: Date, Titre, Lieu, Catégorie, Activité, Places, Heures
// Retour: {events:[{key,title,date,location,category,needs:[{actName,qty,hours}]}], newActs:[names], errors:[{line,reason}]}
function parseEventSheet(text, activities){
  activities = activities || (typeof DB!=='undefined'? DB.activities : []);
  const actByKey={}; (activities||[]).forEach(a=>{ actByKey[normKey(a.name)]=a; });
  const rawLines=String(text||'').split(/\r?\n/).filter(l=>l.trim()!=='');
  const events=[]; const evByKey={}; const newActKeys={}; const newActs=[]; const errors=[];
  if(!rawLines.length) return {events,newActs,errors};
  const delim=detectDelim(rawLines[0]);
  let start=0;
  const first=splitCsvLine(rawLines[0],delim);
  if(looksLikeHeader(first)) start=1;
  for(let i=start;i<rawLines.length;i++){
    const lineNo=i+1;
    const c=splitCsvLine(rawLines[i],delim);
    const dateRaw=c[0]||'', title=(c[1]||'').trim(), loc=(c[2]||'').trim();
    const cat=(c[3]||'').trim(), actName=(c[4]||'').trim();
    const qtyRaw=(c[5]||'').trim(), hoursRaw=(c[6]||'').trim();
    const iso=parseFlexDate(dateRaw);
    if(!iso){ errors.push({line:lineNo, reason:'date'}); continue; }
    if(!title){ errors.push({line:lineNo, reason:'titre'}); continue; }
    if(!actName){ errors.push({line:lineNo, reason:'activite'}); continue; }
    let qty=parseInt(qtyRaw,10); if(!(qty>0)) qty=1;
    let hours = hoursRaw===''? null : parseFloat(hoursRaw.replace(',','.'));
    if(hours!=null && (isNaN(hours)||hours<0)) hours=null;
    const ak=normKey(actName);
    if(!actByKey[ak] && !newActKeys[ak]){ newActKeys[ak]=true; newActs.push(actName); }
    const evKey=iso+'||'+normKey(title);
    let ev=evByKey[evKey];
    if(!ev){ ev={key:evKey,title,date:iso,location:loc,category:cat||'',needs:[]}; evByKey[evKey]=ev; events.push(ev); }
    else { if(!ev.location&&loc) ev.location=loc; if(!ev.category&&cat) ev.category=cat; }
    // fusionne les postes identiques (même activité) d'un même événement
    const same=ev.needs.find(n=>normKey(n.actName)===ak && (n.hours===hours));
    if(same) same.qty+=qty; else ev.needs.push({actName,qty,hours});
  }
  return {events,newActs,errors};
}

let _importPlan=null; // dernier résultat de parseEventSheet
function eventTemplateCSV(){
  return t('importPastePh');
}
function downloadEventTemplate(){
  const csv=eventTemplateCSV();
  const blob=new Blob(["\ufeff"+csv],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob); const a=document.createElement('a');
  a.href=url; a.download='modele-evenements.csv'; document.body.appendChild(a); a.click();
  document.body.removeChild(a); setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function openImportModal(){
  _importPlan=null;
  modal(t('importTitle'), `
    <div class="need-note" style="margin-bottom:12px">${t('importHelp')}</div>
    <div class="field"><label>${t('importTemplate')}</label>
      <button class="btn btn-ghost btn-sm" onclick="downloadEventTemplate()">⬇ ${t('importDownloadTpl')}</button></div>
    <div class="field"><label>${t('importFile')}</label>
      <input id="impFile" type="file" accept=".csv,.tsv,.txt,text/csv,text/plain" onchange="handleImportFile(this)">
      <div class="need-note" style="margin-top:4px">${t('importXlsxWarn')}</div></div>
    <div class="field"><label>${t('importPaste')}</label>
      <textarea id="impText" rows="6" placeholder="${esc(t('importPastePh'))}" oninput="refreshImportPreview()"></textarea></div>
    <div id="impPreview"></div>`,
    [{label:t('cancel'),cls:'btn-ghost',fn:closeModal},
     {label:t('importDoBtn'),cls:'btn-primary',fn:doImportEvents}]);
}
function handleImportFile(input){
  const f=input.files&&input.files[0]; if(!f) return;
  const nm=(f.name||'').toLowerCase();
  if(nm.endsWith('.xlsx')||nm.endsWith('.xls')){ toast(t('importXlsxWarn'),'err'); input.value=''; return; }
  const rd=new FileReader();
  rd.onload=()=>{ const ta=document.getElementById('impText'); if(ta){ ta.value=rd.result; refreshImportPreview(); } };
  rd.readAsText(f);
}
function refreshImportPreview(){
  const ta=document.getElementById('impText'); const host=document.getElementById('impPreview');
  if(!ta||!host) return;
  const plan=parseEventSheet(ta.value, DB.activities); _importPlan=plan;
  if(!ta.value.trim()){ host.innerHTML=''; return; }
  const totalNeeds=plan.events.reduce((s,e)=>s+e.needs.length,0);
  let html=`<div style="border-top:1px solid var(--line);margin-top:12px;padding-top:12px">
    <div style="font-weight:700;margin-bottom:8px">${t('importPreviewHead')} — <span style="color:var(--green)">${plan.events.length}</span> ${t('importPreviewEvents')}, <span style="color:var(--green)">${totalNeeds}</span> ${t('importPreviewNeeds')}</div>`;
  if(plan.newActs.length){ html+=`<div class="need-note" style="background:var(--amber-light);color:#92400e;padding:6px 10px;border-radius:8px;margin-bottom:8px">${t('importNewActs')} ${plan.newActs.map(esc).join(', ')}</div>`; }
  html+=plan.events.map(e=>{
    const d=new Date(e.date); const ds=isNaN(d)?e.date:d.toLocaleString();
    return `<div class="need-chip need-chip-col" style="margin-bottom:6px">
      <div class="need-chip-row"><span class="t"><b>${esc(e.title)}</b> — ${esc(ds)}${e.location?' · '+esc(e.location):''}${e.category?' · '+esc(e.category):''}</span></div>
      <div style="font-size:12px;color:var(--muted);padding-left:2px">${e.needs.map(n=>esc(n.actName)+' ×'+n.qty+(n.hours!=null?' ('+n.hours+t('hoursShort')+')':'')).join(' · ')}</div>
    </div>`;
  }).join('');
  if(plan.errors.length){ html+=`<div class="need-note" style="color:var(--red);margin-top:6px">${t('importErrorsHead')} ${plan.errors.map(e=>'#'+e.line+' ('+e.reason+')').join(', ')}</div>`; }
  html+='</div>';
  host.innerHTML=html;
}
function doImportEvents(){
  const ta=document.getElementById('impText');
  const plan = _importPlan || (ta? parseEventSheet(ta.value, DB.activities) : null);
  if(!plan || !plan.events.length){ toast(t('importNothing'),'err'); return; }
  // 1) créer les activités manquantes
  const actByKey={}; DB.activities.forEach(a=>{ actByKey[normKey(a.name)]=a; });
  let createdActs=0;
  plan.newActs.forEach((name,idx)=>{
    const k=normKey(name); if(actByKey[k]) return;
    const color=COLORS[(DB.activities.length+idx)%COLORS.length];
    const na={id:uid('a_'),name:name,hours:2,color:color,desc:'',instr:''};
    DB.activities.push(na); actByKey[k]=na; createdActs++;
    LOG.event('Type d\'activité créé',{id:na.id, name:name, hours:2, viaImport:true});
  });
  // 2) créer les événements + postes
  let createdEvents=0, createdNeeds=0;
  plan.events.forEach(e=>{
    const needs=e.needs.map(n=>{ const a=actByKey[normKey(n.actName)];
      return {id:uid('n_'), actId:a.id, qty:n.qty, hours:(n.hours!=null?n.hours:null), instr:(a.instr||'')}; });
    const ne={id:uid('e_'), title:e.title, date:e.date, location:e.location||'', needs:needs, category:e.category||null};
    DB.events.push(ne); createdEvents++; createdNeeds+=needs.length;
    LOG.event('Événement créé',{id:ne.id, title:e.title, date:e.date, category:ne.category, postes:needs.length, placesTotal:needs.reduce((s,n)=>s+n.qty,0), viaImport:true});
  });
  _importPlan=null; saveDB(); closeModal();
  toast(t('importDone').replace('{e}',createdEvents).replace('{n}',createdNeeds).replace('{a}',createdActs),'ok');
  render();
}

/* ---------------- COACH: Tracking + presence ---------------- */
// Activités assignées d'une personne (joueur ou parent), triées par date, avec passé/à venir.
function personActivities(pid){
  const out=[];
  DB.regs.filter(r=>r.pid===pid).forEach(r=>{
    const ev=eventById(r.eid); if(!ev) return;
    const need=ev.needs.find(n=>n.id===r.nid); if(!need) return;
    const assigned=assignedRegs(r.eid,r.nid,need.qty).some(x=>x.id===r.id);
    if(!assigned) return;
    const act=activity(need.actId);
    const hrs=need.hours!=null?need.hours:(act?act.hours:0);
    out.push({actName:act?act.name:'?', color:act?act.color:'#999', evTitle:ev.title, date:ev.date, hrs, past:isPast(ev.date)});
  });
  return out.sort((a,b)=>new Date(a.date)-new Date(b.date));
}
function personActivitiesHTML(pid){
  const list=personActivities(pid);
  if(!list.length) return `<div class="pa-empty">${t('noActivitiesYet')}</div>`;
  return `<div class="pa-list">`+list.map(a=>`
    <div class="pa-item">
      <span class="pa-dot" style="background:${a.color}"></span>
      <span class="pa-act">${esc(a.actName)}</span>
      <span class="pa-ev">${esc(a.evTitle)} · ${fmtDate(a.date)}</span>
      <span class="pa-badge ${a.past?'past':'up'}">${a.past?t('statusPast'):t('statusUpcoming')}</span>
    </div>`).join('')+`</div>`;
}
// État de dépliage des lignes de suivi (par personne).
let _openTrackRows={};
function toggleTrackRow(id){ _openTrackRows[id]=!_openTrackRows[id]; render(); }
function trackingRowHTML(p,goal){
  const bd=playerHoursBreakdown(p.id); const done=bd.done, selected=bd.selected;
  const donePct = goal>0?Math.min(100, done/goal*100):0;
  const selPct  = goal>0?Math.min(100-donePct, selected/goal*100):0;
  const reached=done>=goal;
  const goalCell = p.role==='parent' ? `<td><b>${done}</b></td>` : `<td><b>${done}</b> <span style="color:var(--muted)">/ ${goal}</span></td>`;
  const progCell = p.role==='parent'
    ? `<td><span style="color:var(--muted);font-size:13px">—</span></td>`
    : `<td><div class="progress"><div class="seg-done" style="width:${donePct}%"></div><div class="seg-sel" style="width:${selPct}%"></div></div></td>`;
  const acts=personActivities(p.id);
  const open=!!_openTrackRows[p.id];
  const hasActs=acts.length>0;
  const caret = hasActs ? `<span class="act-caret">${open?'▾':'▸'}</span> <span class="pa-count">${acts.length}</span>` : '';
  const nameCell = hasActs
    ? `<div class="track-name is-toggle" onclick="toggleTrackRow('${p.id}')">${avatarHTML(p)}<b>${esc(p.first)} ${esc(p.last)}</b> ${caret}</div>`
    : `<div class="track-name">${avatarHTML(p)}<b>${esc(p.first)} ${esc(p.last)}</b></div>`;
  return `<tr><td>${nameCell}
      ${open?personActivitiesHTML(p.id):''}</td>
    ${progCell}
    ${goalCell}</tr>`;
}
function renderTracking(c){
  const players=DB.users.filter(u=>u.role==='player');
  const parents=DB.users.filter(u=>u.role==='parent');
  const goal=DB.settings.hoursGoal;
  const pastEvents=DB.events.filter(e=>isPast(e.date)).sort((a,b)=>new Date(b.date)-new Date(a.date));
  c.innerHTML=`
    <div class="page-head"><h2>${t('hoursTracking')}</h2><p>${t('creditMode')}: ${DB.settings.creditMode==='auto'?t('creditAuto'):t('creditApproval')}</p></div>
    <div class="card">
      <div class="card-head"><h3>${t('hoursTracking')}</h3><span class="chip" style="background:var(--brand-light);color:var(--brand-dark)">${t('target')}: ${goal} ${t('hoursShort')}</span></div>
      <table><thead><tr><th>${t('player')}</th><th style="width:45%">${t('progress')}</th><th>${t('hoursShort')}</th></tr></thead><tbody>
      ${players.map(p=>trackingRowHTML(p,goal)).join('')}
      </tbody></table>
    </div>
    ${parents.length? `
    <div class="card">
      <div class="card-head"><h3>${t('trackParents')}</h3></div>
      <table><thead><tr><th>${t('player')}</th><th style="width:45%">${t('progress')}</th><th>${t('hoursShort')}</th></tr></thead><tbody>
      ${parents.map(p=>trackingRowHTML(p,goal)).join('')}
      </tbody></table>
    </div>`:''}
    ${DB.settings.creditMode==='approval'? `
    <div class="card">
      <div class="card-head"><h3>${t('confirmPresence')}</h3></div>
      ${pastEvents.length? pastEvents.map(e=>`
        <div class="act-type" style="cursor:pointer" onclick="openPresence('${e.id}')">
          <div class="swatch" style="background:var(--brand)">📋</div>
          <div class="info"><div class="n">${esc(e.title)}</div><div class="h">${fmtDate(e.date)}</div></div>
          <button class="btn btn-ghost btn-sm">${t('confirmPresence')} →</button>
        </div>`).join('') : `<div class="empty-state">${t('noEvents')}</div>`}
    </div>`:''}`;
}

function openPresence(eid){
  const e=eventById(eid);
  const regs=DB.regs.filter(r=>r.eid===eid).map(r=>{
    const need=e.needs.find(n=>n.id===r.nid); const assigned=assignedRegs(eid,r.nid,need.qty).some(z=>z.id===r.id);
    return {r,need,assigned,p:userById(r.pid)};
  }).filter(x=>x.assigned);
  const body = regs.length? regs.map(x=>{ const act=activity(x.need.actId); const hrs=x.need.hours!=null?x.need.hours:act.hours;
    return `<div class="switch-line">
      <div style="display:flex;align-items:center;gap:10px">${avatarHTML(x.p)}
        <div><div class="t">${esc(x.p.first)} ${esc(x.p.last)}</div>
        <div class="d">${esc(act.name)} · ${hrs} ${t('hoursShort')}</div></div></div>
      <div class="seg">
        <button class="${x.r.present===true?'active':''}" onclick="setPresence('${x.r.id}',true)">${t('markPresent')}</button>
        <button class="${x.r.present===false?'active':''}" onclick="setPresence('${x.r.id}',false)">${t('markAbsent')}</button>
      </div></div>`;
  }).join('') : `<div class="empty-state">${t('noRegForEvent')}</div>`;
  modal(`${t('presenceFor')} ${esc(e.title)}`, body,
    [{label:t('close'),cls:'btn-primary',fn:()=>{closeModal();render();}}]);
}
function setPresence(regId,val){
  const r=DB.regs.find(x=>x.id===regId); if(!r) return;
  r.present = r.present===val ? null : val;
  saveDB();
  // re-render modal in place
  const openEid = r.eid; closeModal(); openPresence(openEid);
}

/* ---------------- COACH: Members ---------------- */
function renderMembers(c){
  const coaches=DB.users.filter(u=>u.role==='coach');
  const players=DB.users.filter(u=>u.role==='player' && u.status!=='invited');
  const invited=DB.users.filter(u=>u.role==='player' && u.status==='invited');
  const parents=DB.users.filter(u=>u.role==='parent');
  const catSelect=(u)=>`<select class="cat-select" onchange="setPlayerCategory('${u.id}',this.value)">
      ${CATEGORIES.map(cc=>`<option value="${cc}" ${u.category===cc?'selected':''}>${t('cat_'+cc)}</option>`).join('')}
      <option value="" ${!u.category?'selected':''}>${t('catNotSet')}</option>
    </select>`;
  c.innerHTML=`
    <div class="page-head"><h2>${t('teamMembers')}</h2><p>${DB.users.length} ${t('members')}</p></div>
    <div class="card">
      <div class="card-head"><h3>${t('roleCoach')}s</h3>
        <button class="btn btn-primary btn-sm" onclick="openCoachModal()">+ ${t('addCoach')}</button></div>
      <table><thead><tr><th>${t('name')}</th><th>${t('email')}</th><th>${t('role')}</th></tr></thead><tbody>
      ${coaches.map(u=>memberRow(u)).join('')}
      </tbody></table>
    </div>
    <div class="card">
      <div class="card-head"><h3>${t('rolePlayer')}s</h3>
        <button class="btn btn-primary btn-sm" onclick="openInviteModal()">+ ${t('invitePlayers')}</button></div>
      <table><thead><tr><th>${t('name')}</th><th>${t('email')}</th><th>${t('category')}</th><th>${t('hoursShort')}</th><th></th></tr></thead><tbody>
      ${players.length?players.map(u=>`<tr><td><div style="display:flex;align-items:center;gap:10px">${avatarHTML(u)}<b>${esc(u.first)} ${esc(u.last)}</b></div></td>
        <td style="color:var(--muted)">${esc(u.email)}</td>
        <td>${catSelect(u)}</td>
        <td><span class="chip" style="background:var(--brand-light);color:var(--brand-dark)">${playerHours(u.id)} / ${DB.settings.hoursGoal} ${t('hoursShort')}</span></td>
        <td style="text-align:right"><button class="btn btn-ghost btn-sm" title="${t('delPlayer')}" onclick="confirmDeletePlayer('${u.id}')">🗑️</button></td></tr>`).join(''):`<tr><td colspan="5" style="color:var(--muted);text-align:center;padding:16px">—</td></tr>`}
      </tbody></table>
    </div>
    ${parents.length?`<div class="card">
      <div class="card-head"><h3>${t('parents')} <span class="chip">${parents.length}</span></h3></div>
      <table><thead><tr><th>${t('name')}</th><th>${t('email')}</th><th>${t('parentOf')}</th><th>${t('myVolunteering')}</th></tr></thead><tbody>
      ${parents.map(p=>{const kids=childrenOf(p);const bd=playerHoursBreakdown(p.id);return `<tr>
        <td><div style="display:flex;align-items:center;gap:10px">${avatarHTML(p)}<b>${esc(p.first)} ${esc(p.last||'')}</b></div></td>
        <td style="color:var(--muted)">${esc(p.email)}</td>
        <td>${esc(kids.map(k=>k.first+' '+(k.last||'')).join(', '))||'—'}</td>
        <td><b>${bd.done}</b> h</td></tr>`;}).join('')}
      </tbody></table>
    </div>`:''}
    ${invited.length?`<div class="card">
      <div class="card-head"><h3>${t('pendingInvites')} <span class="chip" style="background:#fef3c7;color:#92400e">${invited.length}</span></h3></div>
      <table><thead><tr><th>${t('name')}</th><th>${t('email')}</th><th>${t('category')}</th><th>${t('status')}</th><th></th></tr></thead><tbody>
      ${invited.map(u=>`<tr><td><div style="display:flex;align-items:center;gap:10px">${avatarHTML(u)}<b>${esc(u.first)} ${esc(u.last||'')}</b></div></td>
        <td style="color:var(--muted)">${esc(u.email)}</td>
        <td>${catSelect(u)}</td>
        <td><span class="chip" style="background:#fef3c7;color:#92400e">${t('invited')}</span></td>
        <td style="white-space:nowrap"><button class="btn btn-ghost btn-sm" onclick="copyInvite('${u.id}')">🔗 ${t('copyLink')}</button>
          <button class="btn btn-ghost btn-sm" title="${t('delInvite')}" onclick="confirmDeletePlayer('${u.id}')">🗑️</button></td></tr>`).join('')}
      </tbody></table>
    </div>`:''}`;
}
function memberRow(u){
  return `<tr><td><div style="display:flex;align-items:center;gap:10px">${avatarHTML(u)}<b>${esc(u.first)} ${esc(u.last)}</b></div></td>
    <td style="color:var(--muted)">${esc(u.email)}</td>
    <td><span class="chip role-coach" style="color:#fff">${t('roleCoach')}</span></td></tr>`;
}
// Coach edits a player's category. Changing it drops any registration that now conflicts with an event of the same category.
function setPlayerCategory(pid,val){
  const u=userById(pid); if(!u) return;
  u.category = val||null;
  if(u.category){
    DB.regs=DB.regs.filter(r=>{ if(r.pid!==pid) return true; const ev=eventById(r.eid); return !(ev && ev.category===u.category); });
  }
  saveDB(); toast(t('savedOk'),'ok'); render();
}
// Coach retire un joueur (ou annule une invitation). Confirmation avec détails d'impact.
function confirmDeletePlayer(pid){
  const u=userById(pid); if(!u) return;
  const invited = u.status==='invited';
  const regCount = DB.regs.filter(r=>r.pid===pid).length;
  const parents = DB.users.filter(p=>p.role==='parent' && (p.childIds||[]).includes(pid));
  const name = fullName(u);
  let body = `<p style="font-size:15px;margin:0 0 10px">${t('delPlayerWarn').replace('{name}',esc(name))}</p>`;
  const notes=[];
  if(regCount) notes.push(t('delPlayerRegs').replace('{r}',regCount));
  if(parents.length) notes.push(t('delPlayerParent').replace('{p}',esc(parents.map(fullName).join(', '))));
  if(notes.length) body += `<ul class="need-note" style="margin:0;padding-left:18px">${notes.map(n=>`<li>${n}</li>`).join('')}</ul>`;
  modal(invited?t('delInvite'):t('delPlayerTitle'), body,
    [{label:t('cancel'),cls:'btn-ghost',fn:closeModal},
     {label:invited?t('delInvite'):t('delPlayerGo'),cls:'btn-danger',fn:()=>deletePlayer(pid)}]);
}
// Suppression propre : retire l'utilisateur, ses inscriptions, et le lien depuis tout parent.
function deletePlayer(pid){
  const u=userById(pid); if(!u) return;
  const invited = u.status==='invited';
  const name = fullName(u);
  const regCount = DB.regs.filter(r=>r.pid===pid).length;
  DB.regs = DB.regs.filter(r=>r.pid!==pid);
  // délier de tout parent ; si un parent n'a plus d'enfant, il est retiré aussi
  DB.users.forEach(p=>{ if(p.role==='parent' && (p.childIds||[]).includes(pid)) p.childIds=p.childIds.filter(id=>id!==pid); });
  DB.users = DB.users.filter(p=>!(p.role==='parent' && (!p.childIds || p.childIds.length===0)));
  DB.users = DB.users.filter(x=>x.id!==pid);
  LOG.info(invited?'Invitation annulée':'Joueur retiré',{userId:pid, userName:name, regsRemoved:regCount});
  saveDB(); closeModal();
  toast((invited?t('delInviteDone'):t('delPlayerDone').replace('{name}',name)),'ok');
  render();
}
function openCoachModal(){
  modal(t('addCoach'), `
    <div class="row-2">
      <div class="field"><label>${t('firstName')}</label><input id="coFirst"></div>
      <div class="field"><label>${t('lastName')}</label><input id="coLast"></div>
    </div>
    <div class="field"><label>${t('email')}</label><input id="coEmail" type="email"></div>
    <div class="field"><label>${t('password')}</label><input id="coPass" type="text" value="coach"></div>
    <div class="need-note">${t('coachAddedNote')}</div>`,
    [{label:t('cancel'),cls:'btn-ghost',fn:closeModal},
     {label:t('save'),cls:'btn-primary',fn:saveCoach}]);
}
function saveCoach(){
  const first=document.getElementById('coFirst').value.trim();
  const last=document.getElementById('coLast').value.trim();
  const email=document.getElementById('coEmail').value.trim().toLowerCase();
  const pass=document.getElementById('coPass').value||'coach';
  if(!first||!last||!email){ toast(t('errFillAll'),'err'); return; }
  if(DB.users.some(u=>u.email.toLowerCase()===email)){ toast(t('errEmailUsed'),'err'); return; }
  const nc={id:uid('u_'),first,last,email,pass,role:'coach',status:'active'};
  DB.users.push(nc);
  LOG.event('Coach ajouté',{id:nc.id, userName:(first+' '+last).trim(), email:email});
  saveDB(); closeModal(); toast(t('savedOk'),'ok'); render();
}

/* ---------------- COACH: Invite players (paste list / CSV) ---------------- */
const EMAIL_RE=/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;
// Parse pasted text: one entry per line. Accepts: email | email,First Last | email,First Last,category
// Also tolerates comma/semicolon/tab separators and a header line.
function parseInviteList(text){
  const out=[]; const seen={};
  (text||'').split(/\r?\n/).forEach(line=>{
    const raw=line.trim(); if(!raw) return;
    const parts=raw.split(/[,;\t]/).map(s=>s.trim()).filter(Boolean);
    // find the email token anywhere on the line
    const email=(parts.find(p=>EMAIL_RE.test(p))||'').toLowerCase();
    if(!email) return;                       // skip lines w/o valid email (incl. header)
    if(seen[email]) return; seen[email]=1;
    const rest=parts.filter(p=>p!==email && !EMAIL_RE.test(p));
    let first='',last='',category=null;
    // category = any token matching a known category label/id
    const catTok=rest.find(p=>CATEGORIES.includes(p.toLowerCase()) || CATEGORIES.some(c=>t('cat_'+c).toLowerCase()===p.toLowerCase()));
    if(catTok){ const low=catTok.toLowerCase(); category=CATEGORIES.includes(low)?low:CATEGORIES.find(c=>t('cat_'+c).toLowerCase()===low); }
    const nameTok=rest.filter(p=>p!==catTok);
    if(nameTok.length){ const nm=nameTok.join(' ').split(/\s+/); first=nm.shift()||''; last=nm.join(' '); }
    if(!first){ first=email.split('@')[0]; }   // fallback: local-part as first name
    out.push({email,first,last,category});
  });
  return out;
}
function openInviteModal(){
  modal(t('inviteTitle'), `
    <div class="need-note" style="margin-bottom:10px">${t('inviteHelp')}</div>
    <div class="field"><label>${t('inviteListLabel')}</label>
      <textarea id="inviteText" rows="8" placeholder="joueur1@courriel.ca\njoueur2@courriel.ca, Prénom Nom\njoueur3@courriel.ca, Prénom Nom, cadet" style="width:100%;font-family:inherit;font-size:14px;padding:10px;border:1px solid var(--line2);border-radius:8px;resize:vertical"></textarea></div>`,
    [{label:t('cancel'),cls:'btn-ghost',fn:closeModal},
     {label:t('inviteBtn'),cls:'btn-primary',fn:createInvites}]);
}
function createInvites(){
  const text=document.getElementById('inviteText').value;
  const rows=parseInviteList(text);
  if(!rows.length){ toast(t('inviteNoValid'),'err'); return; }
  let created=0, skipped=0;
  rows.forEach(r=>{
    if(DB.users.some(u=>u.email.toLowerCase()===r.email)){ skipped++; return; }
    DB.users.push({id:uid('u_'),first:r.first,last:r.last||'',email:r.email,
      pass:null,role:'player',category:r.category||null,status:'invited',inviteCode:uid('inv_')});
    created++;
  });
  saveDB(); closeModal();
  LOG.event('Invitations générées',{créées:created, ignorées:skipped, total:rows.length, courriels:rows.map(r=>r.email)});
  toast(t('inviteResult')(created,skipped), created?'ok':'err');
  render();
}
// Encode/décode un petit payload de données d'invitation (nom, catégorie) transporté dans le lien,
// pour que l'activation fonctionne même sur un appareil qui n'a jamais vu cette invitation.
function encodeInviteData(u){
  try{
    const payload={f:u.first||'',l:u.last||'',c:u.category||'',r:u.role||'player'};
    const json=JSON.stringify(payload);
    // base64 URL-safe (fonctionne en navigateur via btoa ; en Node via Buffer)
    let b64 = (typeof btoa!=='undefined')
      ? btoa(unescape(encodeURIComponent(json)))
      : Buffer.from(json,'utf8').toString('base64');
    return b64.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }catch(e){ return ''; }
}
function decodeInviteData(raw){
  const s=(raw||'').trim(); if(!s) return null;
  const m=s.match(/[#?&]d=([^&\s#]+)/i);
  const token = m ? m[1] : (/^[A-Za-z0-9\-_]+$/.test(s)&&s.length>8 && !/^inv_/.test(s) ? s : '');
  if(!token) return null;
  try{
    let b64=token.replace(/-/g,'+').replace(/_/g,'/'); while(b64.length%4) b64+='=';
    const json = (typeof atob!=='undefined')
      ? decodeURIComponent(escape(atob(b64)))
      : Buffer.from(b64,'base64').toString('utf8');
    const o=JSON.parse(json);
    return {first:o.f||'',last:o.l||'',category:o.c||null,role:o.r||'player'};
  }catch(e){ return null; }
}
// Build a shareable invite link (works when the file is opened via a URL; also carries the code + data).
function inviteLink(u){
  let base='';
  try{ base=location.origin+location.pathname; }catch(e){}
  const d=encodeInviteData(u);
  return (base||'')+'#invite='+encodeURIComponent(u.inviteCode||'')+'&email='+encodeURIComponent(u.email)+(d?('&d='+d):'');
}
function copyInvite(pid){
  const u=userById(pid); if(!u) return;
  const link=inviteLink(u);
  const done=()=>toast(t('copied'),'ok');
  try{
    if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(link).then(done,()=>fallbackCopy(link,done)); }
    else fallbackCopy(link,done);
  }catch(e){ fallbackCopy(link,done); }
}
function fallbackCopy(text,done){
  try{ const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta); done && done();
  }catch(e){ prompt(t('copyLink'), text); }
}

/* ---------------- COACH: Settings ---------------- */
function renderSettings(c){
  const s=DB.settings;
  c.innerHTML=`
    <div class="page-head"><h2>${t('teamSettings')}</h2><p>${t('appTagline')}</p></div>
    <div class="card" style="max-width:640px">
      <div style="font-weight:700;font-size:14px;margin-bottom:8px">${t('teamLogo')}</div>
      <div class="logo-setting">
        <div class="logo-preview ball" ${s.logo?`style="background-image:url('${s.logo}');background-size:cover;background-position:center;background-repeat:no-repeat"`:''}></div>
        <div class="logo-setting-body">
          <p class="need-note" style="margin:0 0 10px">${t('teamLogoDesc')}</p>
          <div class="row gap">
            <label class="btn btn-ghost" style="cursor:pointer;margin:0">🖼︎ ${t('uploadLogo')}
              <input type="file" accept="image/png,image/jpeg" style="display:none" onchange="onLogoPick(this)"></label>
            ${s.logo?`<button class="btn btn-danger" onclick="removeTeamLogo()">${t('removeLogo')}</button>`:''}
          </div>
        </div>
      </div>
      <hr style="border:none;border-top:1px solid var(--border);margin:18px 0">
      <div class="field"><label>${t('seasonName')}</label>
        <input id="setSeason" type="text" maxlength="60" placeholder="${t('seasonCurrent')}" value="${esc(s.seasonName||'')}">
        <div class="need-note" style="margin-top:6px">${t('seasonNameDesc')}</div></div>
      <hr style="border:none;border-top:1px solid var(--border);margin:18px 0">
      <div class="field"><label>${t('hoursGoal')}</label>
        <input id="setGoal" type="number" min="0" step="0.5" value="${s.hoursGoal}"></div>

      <div style="margin:18px 0 6px;font-weight:700;font-size:14px">${t('creditMode')}</div>
      <div class="switch-line">
        <div><div class="t">${t('creditAuto')}</div><div class="d">${t('creditAutoDesc')}</div></div>
        <div class="toggle ${s.creditMode==='auto'?'on':''}" onclick="setCredit('auto')"></div>
      </div>
      <div class="switch-line">
        <div><div class="t">${t('creditApproval')}</div><div class="d">${t('creditApprovalDesc')}</div></div>
        <div class="toggle ${s.creditMode==='approval'?'on':''}" onclick="setCredit('approval')"></div>
      </div>

      <div class="field" style="margin-top:18px"><label>${t('withdrawDeadline')}</label>
        <input id="setWd" type="number" min="0" value="${s.withdrawHours}">
        <div class="need-note" style="margin-top:6px">${t('withdrawDeadlineDesc')}</div></div>

      <div style="margin-top:18px;text-align:right">
        <button class="btn btn-primary" onclick="saveSettings()">${t('save')}</button></div>
    </div>

    <div class="card" style="max-width:640px;margin-top:18px;border-color:var(--danger,#e5484d)">
      <div style="font-weight:700;font-size:14px;margin-bottom:6px;color:var(--danger,#e5484d)">⚠️ ${t('seasonZone')}</div>
      <p class="need-note" style="margin:0 0 14px">${t('seasonZoneDesc')}</p>
      <button class="btn btn-danger" onclick="openNewSeasonModal()">${t('seasonNewBtn')||t('seasonModalTitle')}</button>
    </div>

    <div class="card" style="max-width:640px;margin-top:18px">
      <div style="font-weight:700;font-size:15px;margin-bottom:12px">💬 ${t('feedbackListTitle')}
        <span style="font-size:12px;font-weight:400;color:#888;margin-left:8px">(${getFeedbacks().length})</span></div>
      ${getFeedbacks().length===0
        ? `<p style="color:#888;font-size:13px">${t('feedbackEmpty')}</p>`
        : `<div style="overflow-x:auto">
           <table class="data-table" style="width:100%;font-size:12px">
             <thead><tr>
               <th>${t('feedbackColType')}</th>
               <th>${t('feedbackColPriority')}</th>
               <th>${t('feedbackColTitle')}</th>
               <th>${t('feedbackColDesc')}</th>
               <th>${t('feedbackColUser')}</th>
               <th>${t('feedbackColDate')}</th>
             </tr></thead>
             <tbody>${getFeedbacks().slice().reverse().map(f=>`<tr>
               <td>${esc(f.type)}</td>
               <td><span style="padding:2px 7px;border-radius:12px;font-size:11px;background:${f.priority==='high'?'#fce4e4':f.priority==='low'?'#e8f4e8':'#eef2ff'};color:${f.priority==='high'?'#c00':'#444'}">${esc(f.priority)}</span></td>
               <td style="font-weight:600">${esc(f.title)}</td>
               <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(f.desc||'')}</td>
               <td>${esc(f.user)}</td>
               <td style="white-space:nowrap">${f.at?new Date(f.at).toLocaleDateString():''}</td>
             </tr>`).join('')}</tbody>
           </table></div>`}
      <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end">
        ${getFeedbacks().length>0?`
          <button class="btn btn-ghost btn-sm" onclick="exportFeedbackCSV()">📄 ${t('feedbackExportCSV')}</button>
          <button class="btn btn-danger btn-sm" onclick="deleteAllFeedbacks()">${t('feedbackDeleteAll')}</button>`:''}
      </div>
    </div>`;
}
function setCredit(mode){ DB.settings.creditMode=mode; saveDB(); render(); }
function saveSettings(){
  DB.settings.hoursGoal=parseFloat(document.getElementById('setGoal').value)||0;
  DB.settings.withdrawHours=parseFloat(document.getElementById('setWd').value)||0;
  const seasonEl=document.getElementById('setSeason');
  if(seasonEl) DB.settings.seasonName=seasonEl.value.trim();
  saveDB(); toast(t('savedOk'),'ok'); render();
}

/* =====================================================================
   SAISONS — démarrer une nouvelle saison (efface événements + inscriptions)
   ===================================================================== */
function openNewSeasonModal(){
  const nEvents=DB.events.length, nRegs=DB.regs.length;
  const nUsers=DB.users.length, nActs=DB.activities.length;
  const suggested = suggestNextSeasonName(DB.settings.seasonName);
  modal(t('seasonModalTitle'), `
    <p style="font-size:14px;margin:0 0 10px">${t('seasonModalWarn')}</p>
    <ul style="margin:0 0 14px;padding-left:20px;font-size:14px">
      <li><b>${nEvents}</b> ${t('seasonModalEvents')}</li>
      <li><b>${nRegs}</b> ${t('seasonModalRegs')}</li>
    </ul>
    <div class="need-note" style="margin-bottom:16px">${t('seasonModalKeep').replace('{u}',nUsers).replace('{a}',nActs)}</div>
    <div class="field"><label>${t('seasonNewNameLabel')}</label>
      <input id="newSeasonName" type="text" maxlength="60" placeholder="${t('seasonCurrent')}" value="${esc(suggested)}"></div>
    <div class="field" style="margin-top:12px"><label>${t('seasonConfirmType')}</label>
      <input id="seasonConfirm" type="text" autocomplete="off" oninput="onSeasonConfirmInput()" placeholder="${t('seasonConfirmWord')}"></div>`,
    [{label:t('cancel'),cls:'btn-ghost',fn:closeModal},
     {label:t('seasonGoBtn'),cls:'btn-danger',fn:startNewSeason}]);
  // Désactive le bouton d'action tant que le mot de confirmation n'est pas saisi
  setTimeout(function(){
    const foot=document.getElementById('modalFoot');
    if(foot){ const go=foot.querySelectorAll('button')[1]; if(go){ go.id='seasonGoBtn'; go.disabled=true; go.style.opacity=.5; go.style.cursor='not-allowed'; } }
  },0);
}
function onSeasonConfirmInput(){
  const inp=document.getElementById('seasonConfirm');
  const go=document.getElementById('seasonGoBtn');
  if(!inp||!go) return;
  const ok=inp.value.trim().toUpperCase()===t('seasonConfirmWord');
  go.disabled=!ok; go.style.opacity=ok?1:.5; go.style.cursor=ok?'pointer':'not-allowed';
}
// Propose « Saison 2026-2027 » → « Saison 2027-2028 » ; sinon déduit de l'année courante
function suggestNextSeasonName(current){
  if(current){
    const m=String(current).match(/(\d{4})\s*[-–/]\s*(\d{4})/);
    if(m){ return String(current).replace(m[0], (parseInt(m[1],10)+1)+'-'+(parseInt(m[2],10)+1)); }
  }
  const y=new Date().getFullYear();
  return (t('seasonCurrent')+' '+y+'-'+(y+1));
}
function startNewSeason(){
  const inp=document.getElementById('seasonConfirm');
  if(!inp || inp.value.trim().toUpperCase()!==t('seasonConfirmWord')) return; // garde-fou
  const nameEl=document.getElementById('newSeasonName');
  const newName=nameEl? nameEl.value.trim() : '';
  const nEvents=DB.events.length, nRegs=DB.regs.length;
  LOG.exec('season:new', function(){
    DB.events=[]; DB.regs=[]; DB.outbox=[];
    if(newName) DB.settings.seasonName=newName;
    saveDB();
  });
  LOG.event('Nouvelle saison démarrée',{saison:newName||null, événementsEffacés:nEvents, inscriptionsEffacées:nRegs});
  closeModal();
  toast(t('seasonDone').replace('{n}',nEvents).replace('{r}',nRegs),'ok');
  go('events');
}

/* =====================================================================
   FEEDBACK (coach → admin)
   ===================================================================== */
function openFeedbackModal(){
  const u=currentUser();
  modal(t('feedbackModalTitle'),`
    <p style="font-size:13px;color:#666;margin-bottom:12px">${t('feedbackModalDesc')}</p>
    <div style="display:grid;gap:10px">
      <label style="font-size:13px;font-weight:600">${t('feedbackType')}
        <div style="display:flex;gap:6px;margin-top:4px">
          <button type="button" id="fb_bug"  class="btn btn-sm btn-ghost" onclick="fbType('bug')">${t('feedbackBug')}</button>
          <button type="button" id="fb_imp"  class="btn btn-sm btn-ghost" onclick="fbType('improvement')">${t('feedbackImprove')}</button>
          <button type="button" id="fb_q"    class="btn btn-sm btn-ghost" onclick="fbType('question')">${t('feedbackQuestion')}</button>
        </div>
        <input type="hidden" id="fb_type" value="bug">
      </label>
      <label style="font-size:13px;font-weight:600">${t('feedbackTitle')}
        <input id="fb_title" class="input" style="margin-top:4px;width:100%" placeholder="${t('feedbackTitle')}…" maxlength="120">
      </label>
      <label style="font-size:13px;font-weight:600">${t('feedbackDesc')}
        <textarea id="fb_desc" class="input" style="margin-top:4px;width:100%;min-height:80px;resize:vertical" placeholder="Détails optionnels…"></textarea>
      </label>
      <label style="font-size:13px;font-weight:600">${t('feedbackPriority')}
        <select id="fb_prio" class="input" style="margin-top:4px">
          <option value="high">${t('feedbackPrioHigh')}</option>
          <option value="normal" selected>${t('feedbackPrioMed')}</option>
          <option value="low">${t('feedbackPrioLow')}</option>
        </select>
      </label>
    </div>`,
    [{label:t('cancel'),cls:'btn-ghost',fn:closeModal},
     {label:t('feedbackSend'),cls:'btn-primary',fn:submitFeedback}]);
  // Highlight the selected type button
  setTimeout(()=>fbType('bug'),0);
}
function fbType(type){
  const inp=document.getElementById('fb_type'); if(inp) inp.value=type;
  ['bug','improvement','question'].forEach(k=>{
    const map={bug:'fb_bug',improvement:'fb_imp',question:'fb_q'};
    const btn=document.getElementById(map[k]);
    if(btn) btn.classList.toggle('btn-primary', k===type), btn.classList.toggle('btn-ghost', k!==type);
  });
}
function submitFeedback(){
  const title=(document.getElementById('fb_title')||{}).value||'';
  if(!title.trim()){toast(t('feedbackErrTitle'),'err'); return;}
  const u=currentUser();
  const entry={
    id: uid('fb_'),
    type:  (document.getElementById('fb_type')||{}).value||'bug',
    title: title.trim(),
    desc:  ((document.getElementById('fb_desc')||{}).value||'').trim(),
    priority:(document.getElementById('fb_prio')||{}).value||'normal',
    user:  u ? u.name : '?',
    at:    new Date().toISOString()
  };
  const list = getFeedbacks();
  list.push(entry);
  saveFeedbacks(list);
  LOG.event('Retour envoyé', {type:entry.type, priority:entry.priority});
  closeModal();
  toast(t('feedbackSent'),'ok');
  if(state.view==='settings') render();
}
function exportFeedbackCSV(){
  const cols=['feedbackColType','feedbackColTitle','feedbackColDesc','feedbackColPriority','feedbackColUser','feedbackColDate'];
  const header=cols.map(k=>t(k)).join(',');
  const rows=getFeedbacks().map(f=>[
    f.type, f.title, f.desc||'', f.priority, f.user, f.at
  ].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','));
  const csv=[header,...rows].join('\n');
  const a=document.createElement('a');
  a.href='data:text/csv;charset=utf-8,'+ encodeURIComponent(csv);
  a.download='retours.csv'; a.click();
}
function deleteAllFeedbacks(){
  confirmModal(t('feedbackDeleteAllConfirm'), ()=>{
    saveFeedbacks([]);
    LOG.event('Retours effacés',{});
    closeModal(); render();
  });
}

/* =====================================================================
   MODAL SYSTEM
   ===================================================================== */
function modal(title, bodyHTML, buttons){
  const root=document.getElementById('modalRoot');
  root.innerHTML=`<div class="modal-back" onclick="if(event.target===this)closeModal()">
    <div class="modal">
      <div class="modal-head"><h3>${esc(title)}</h3><button class="x" onclick="closeModal()">✕</button></div>
      <div class="modal-body">${bodyHTML}</div>
      <div class="modal-foot" id="modalFoot"></div>
    </div></div>`;
  const foot=document.getElementById('modalFoot');
  (buttons||[]).forEach((b,i)=>{ const btn=document.createElement('button');
    btn.type='button';
    btn.className='btn '+(b.cls||'btn-ghost'); btn.textContent=b.label;
    btn.onclick=b.fn; foot.appendChild(btn); });
}
function closeModal(){ document.getElementById('modalRoot').innerHTML=''; }
function confirmModal(msg,onYes){
  modal(t('confirm'), `<p style="font-size:15px">${esc(msg)}</p>`,
    [{label:t('cancel'),cls:'btn-ghost',fn:closeModal},
     {label:t('delete'),cls:'btn-danger',fn:onYes}]);
}

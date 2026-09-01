# Bénévolat FC — Prototype

Application web pour gérer le bénévolat d'une équipe de football : les **coachs** créent des types
d'activités et des événements avec des besoins par activité ; les **joueurs** se connectent et
choisissent leurs activités en **premier arrivé, premier servi**, avec liste d'attente et suivi des heures.

## Démarrer

**Le plus simple :** ouvrir `benevolat-fc.html` (fichier unique autonome) directement dans un navigateur — double-clic, aucune installation.

**Version multi-fichiers (développement) :**
```bash
cd benevolat-foot
npm run serve        # http://localhost:61000
```

## Comptes de démonstration

| Rôle   | Nom            | Email               | Mot de passe |
|--------|----------------|---------------------|--------------|
| Coach  | Marc Tremblay  | `coach@equipe.ca`   | `coach`      |
| Joueur | Sam Côté       | `sam@equipe.ca`     | `joueur`     |
| Joueur | Alex Bergeron  | `alex@equipe.ca`    | `joueur`     |
| Joueur | Jordan Lavoie  | `jordan@equipe.ca`  | `joueur`     |
| Joueur | Maxime Roy     | `max@equipe.ca`     | `joueur`     |
| Joueur | Léa Gagnon     | `lea@equipe.ca`     | `joueur`     |
| Joueur | Noah Fortin    | `noah@equipe.ca`    | `joueur`     |

On peut aussi créer un nouveau compte joueur depuis l'écran d'inscription.

## Fonctionnalités

### Côté coach
- **Réglages d'équipe** : objectif d'heures (identique pour tous), mode de créditation
  (automatique à la fin de l'événement **ou** sur approbation), délai de désistement (heures).
- **Types d'activités** : nom, heures créditées par défaut, couleur.
- **Calendrier / événements** : titre, date, lieu ; ajout de besoins (activité × nombre de places),
  heures **héritées du type** mais **surchargeables** pour l'événement.
- **Suivi** : total d'heures par joueur vs objectif ; en mode « approbation », cocher les présences
  après l'événement pour créditer les heures.
- **Membres** : liste des joueurs, ajout d'autres coachs.

### Côté joueur
- Connexion / inscription (email + mot de passe).
- Tableau de bord avec **barre de progression** (X h / objectif).
- Calendrier des événements ; pour chaque activité : les noms sur les places attribuées, puis les
  **ronds d'initiales** des joueurs en liste d'attente.
- Inscription / désistement (bloqué après l'échéance) — **promotion automatique** du 1er en attente
  quand une place se libère.

### Règles clés
- **Premier arrivé, premier servi** (ordre par horodatage d'inscription).
- **1 seule activité par joueur par événement.**
- Bilingue **FR / EN** (bascule dans l'en-tête), français par défaut.

## Tests automatiques

```bash
npm test         # ou : node tests/run-all.js
```

Trois suites, lancées ensemble par `node tests/run-all.js` :

- `tests/logic.test.js` — ~160 assertions sur la logique métier : FIFO, liste d'attente,
  promotion automatique, règle 1 activité/événement, délai de désistement, calcul des heures
  (modes automatique et approbation), surcharge d'heures par événement, catégories, invitations,
  parents, activation par lien, journalisation, logo d'équipe, rappels courriel, utilitaires.
- `tests/dom.test.js` — vérifications d'intégration : chaque `id` référencé par le JS existe
  dans le HTML, structure minimale présente, le script s'exécute et initialise les données sans erreur.
- `tests/render.test.js` — vérifications de rendu (sans navigateur) : barre de progression tricolore
  (crédité / à venir / restant), suivi des heures coach (liste d'activités repliable, joueurs + parents),
  copie d'événement.

## Reconstruire le fichier autonome

Après toute modification de `index.html` ou `app.js` :
```bash
npm run build    # régénère benevolat-fc.html (app.js inliné)
```

## Structure

```
benevolat-foot/
├── index.html          # interface + styles (CSS inline)
├── app.js              # logique (données, i18n, auth, vues, mécanique FIFO)
├── benevolat-fc.html   # build autonome (à ouvrir directement)  ← livrable
├── build.js            # inline app.js dans index.html
├── package.json        # scripts test / build / serve
├── SPEC.md             # spécification et décisions validées
├── README.md
└── tests/
    ├── logic.test.js
    ├── dom.test.js
    ├── render.test.js
    └── run-all.js
```

## Portée du prototype
- Données stockées **localement** dans le navigateur (`localStorage`) — pas de serveur ni de base de données.
- Pas de lien HUDL (évolution future : exigerait l'API officielle de HUDL).
- Une seule équipe (le multi-équipes est une évolution prévue).

# Prototype — Gestion du bénévolat de l'équipe de football

## 1. Décisions validées

| # | Sujet | Décision |
|---|-------|----------|
| 1 | Connexion | Comptes **email + mot de passe** (joueurs et coachs). Stockage local pour le prototype, pas de lien HUDL (évolution future). |
| 2 | Objectif d'heures | **Identique pour toute l'équipe**, fixé par le coach (ex. 20 h). Barre de progression par joueur (ex. 12 h / 20 h). |
| 3 | Créditation des heures | **Réglable par le coach** : soit automatique à la fin de l'événement, soit sur approbation du coach (présence cochée). |
| 4 | Attribution des places | **Premier arrivé, premier servi.** Si un joueur se désiste, le **1ᵉʳ de la liste d'attente est promu automatiquement**. |
| 5 | Liste d'attente | Sous les places remplies : petits ronds avec les **initiales** des intéressés, dans l'ordre d'arrivée. |
| 6 | Désistement | Autorisé librement **jusqu'à une échéance** avant l'événement (délai **configurable par le coach**). Après : via le coach. |
| 7 | Comptes coachs | **Un compte coach prédéfini** au départ, qui peut ensuite ajouter d'autres coachs. |
| 8 | Portée | **Une seule équipe** pour l'instant. |
| 9 | Heures par activité | La valeur d'heures est **héritée du type d'activité**, mais **surchargeable pour un événement précis**. |
| 10 | Inscriptions par événement | **Une seule activité par joueur par événement.** |
| 11 | Interface | **Bilingue (FR par défaut / EN)**, dynamique, agréable, professionnelle. Application web. |

## 2. Modèle de données

**Équipe (réglages)**
- Objectif d'heures (ex. 20)
- Mode de créditation : `auto` | `approbation`
- Délai de désistement (en heures, ex. 48)

**Utilisateur**
- Nom, prénom → initiales calculées
- Email, mot de passe
- Rôle : `joueur` | `coach`

**Type d'activité** (créé par le coach)
- Nom (ex. Chronométreur, Cantine, Chaîneur…)
- Heures créditées par défaut (ex. 3)
- Couleur (pour repérage visuel)

**Événement** (créé par le coach)
- Titre (ex. « Partie 2 »)
- Date et heure
- Lieu (optionnel)
- Statut : à venir / passé
- Liste de **besoins** :
  - Type d'activité + nombre de places (ex. Cantine × 3)
  - Heures (héritées du type, modifiables ici)

**Inscription** (créée par le joueur)
- Joueur + Événement + Besoin (activité)
- Horodatage (pour l'ordre premier arrivé/premier servi)
- État : `place attribuée` | `liste d'attente`
- Présence confirmée (oui/non) — utilisé si mode « approbation »

## 3. Écrans

### Côté joueur
1. **Connexion / Inscription**
2. **Tableau de bord** — barre de progression « X h / objectif », liste de mes inscriptions à venir
3. **Calendrier / Événements** — liste des événements à venir ; pour chacun, les activités disponibles avec places restantes
4. **Détail d'un événement** — chaque activité montre : les noms des joueurs sur les places, puis les ronds d'initiales des intéressés en attente ; bouton s'inscrire / se désister (bloqué après l'échéance)

### Côté coach (admin)
1. **Réglages d'équipe** — objectif d'heures, mode de créditation, délai de désistement
2. **Types d'activités** — ajouter/modifier/supprimer, avec heures par défaut et couleur
3. **Calendrier** — créer un événement (titre, date, lieu) et y ajouter des besoins (activité × nombre de places, heures ajustables)
4. **Suivi** — tableau des joueurs avec total d'heures / objectif ; pour le mode « approbation » : cocher les présences après l'événement
5. **Gestion des comptes** — liste des joueurs, ajout d'autres coachs

## 4. Format technique
- Application web autonome (HTML/CSS/JS), responsive (mobile + ordinateur)
- Données sauvegardées localement dans le navigateur (localStorage) pour le prototype
- Données de démonstration préchargées (équipe, activités, un ou deux événements, quelques joueurs) pour tester immédiatement

# 🚀 Finir le déploiement — Bénévolat FC

**Où on en est :** 7 fichiers sur 8 sont déjà en ligne sur GitHub
(`index.html`, toute la couche `supabase/`, `build.js`, modèle CSV…).
Il ne reste que **1 fichier à téléverser** + **3 étapes de mise en service**.

---

## ✅ Étape 1 — Téléverser le dernier fichier `app.js`  (~1 min)

C'est le cœur de l'application (la logique complète : import tableur, saisons,
retrait de joueurs, temps réel Supabase).

1. Ouvre 👉 **https://github.com/Capadonna1982/BenevolatFc**
2. Clique le fichier **`app.js`** dans la liste
3. Clique l'icône **crayon ✏️ (Edit)** en haut à droite
4. **Tout sélectionner** (Ctrl+A / Cmd+A) puis **supprimer**
5. **Colle** le contenu à jour de `app.js` (je te le fournis)
6. En bas : **« Commit changes »**

> 💡 Alternative : bouton vert **« Add file » → « Upload files »**, puis
> glisse le fichier `app.js` à jour → **Commit**.

---

## ✅ Étape 2 — Créer les tables dans Supabase  (~1 min)

1. Va sur **https://supabase.com** → ton projet `tjdzqlzthxtrmetfadmy`
2. Menu de gauche : **SQL Editor** → **New query**
3. Ouvre le fichier **`supabase/schema.sql`** (il est déjà sur GitHub),
   copie **tout** son contenu, colle-le dans l'éditeur
4. Clique **RUN** (▶️)
5. Tu dois voir « Success. No rows returned » → les tables sont créées ✅

---

## ✅ Étape 3 — Déployer sur Vercel  (~2 min)

1. Va sur **https://vercel.com** → connecte-toi avec **GitHub**
2. **Add New… → Project**
3. Choisis le dépôt **`BenevolatFc`** → **Import**
4. Laisse tous les réglages par défaut (c'est un site statique) → **Deploy**
5. Après ~30 s, tu obtiens une URL du type
   **`https://benevolat-fc.vercel.app`** → c'est ton app en ligne ! 🎉

---

## ✅ Étape 4 — Tester le temps réel  (~1 min)

1. Ouvre l'URL Vercel sur **2 appareils** (ou 2 onglets, dont 1 en navigation privée)
2. Crée un compte coach sur l'un, un compte joueur sur l'autre
3. Le coach crée un événement → il doit **apparaître instantanément** chez le joueur
   sans rafraîchir la page = la persistance Supabase + temps réel fonctionnent ✅

---

## 🔒 Rappel sécurité
- La **clé publishable/anon** dans `config.js` est faite pour être publique — OK.
- Ne mets **jamais** la clé `service_role` dans le code front / sur GitHub.
- Les règles d'accès (RLS) sont incluses dans `schema.sql`.

---

### Besoin d'aide pendant une étape ?
Dis-moi simplement à quelle étape tu bloques (ex. « étape 3, erreur X ») et je te guide.

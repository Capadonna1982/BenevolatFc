-- ============================================================================
-- Bénévolat FC — Schéma Supabase (Postgres + Realtime)
-- ----------------------------------------------------------------------------
-- À exécuter dans Supabase : Dashboard → SQL Editor → coller ce fichier → Run.
-- Idempotent : peut être relancé sans erreur (DROP ... IF EXISTS en tête).
--
-- Modèle calqué 1:1 sur seedDB() de app.js :
--   settings (ligne unique), users, activities, events, needs, regs, outbox
--
-- ⚠️ Contexte PROTOTYPE / DÉMO :
--   Les politiques RLS ci-dessous autorisent la lecture ET l'écriture à la
--   clé « anon » (public), car l'app parle directement à Supabase depuis le
--   navigateur, sans authentification Supabase (l'app gère ses propres
--   comptes dans la table users). C'est volontairement permissif pour une
--   démo. Voir la section « DURCISSEMENT » en bas pour la mise en production.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0) Remise à zéro (ordre inverse des dépendances)
-- ---------------------------------------------------------------------------
drop table if exists regs        cascade;
drop table if exists needs       cascade;
drop table if exists events      cascade;
drop table if exists activities  cascade;
drop table if exists users       cascade;
drop table if exists outbox      cascade;
drop table if exists settings    cascade;

-- ---------------------------------------------------------------------------
-- 1) settings — une seule ligne (id = 1)
-- ---------------------------------------------------------------------------
create table settings (
  id            int primary key default 1 check (id = 1),
  hours_goal    numeric not null default 15,
  credit_mode   text    not null default 'approval',   -- 'approval' | 'auto'
  withdraw_hours numeric not null default 48,
  logo          text,                                  -- data URL ou null
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2) users — joueurs, coachs, invitations en attente
-- ---------------------------------------------------------------------------
create table users (
  id          text primary key,                        -- ex. 'u_coach'
  first       text not null,
  last        text not null,
  email       text not null unique,
  pass        text,                                    -- null tant qu'invité
  role        text not null check (role in ('coach','player')),
  category    text check (category in ('benjamin','cadet','juvenile')),
  status      text not null default 'active' check (status in ('active','invited')),
  invite_code text,
  created_at  timestamptz not null default now()
);
create index users_email_idx on users (lower(email));

-- ---------------------------------------------------------------------------
-- 3) activities — types de bénévolat
-- ---------------------------------------------------------------------------
create table activities (
  id     text primary key,                             -- ex. 'a_marq'
  name   text not null,
  hours  numeric not null default 0,
  color  text,
  descr  text,                                         -- « desc » est réservé en SQL → descr
  instr  text,
  sort   int not null default 0
);

-- ---------------------------------------------------------------------------
-- 4) events — événements du calendrier
-- ---------------------------------------------------------------------------
create table events (
  id        text primary key,                          -- ex. 'e_p2'
  title     text not null,
  date      timestamptz not null,
  location  text,
  category  text check (category in ('benjamin','cadet','juvenile')),
  created_at timestamptz not null default now()
);
create index events_date_idx on events (date);

-- ---------------------------------------------------------------------------
-- 5) needs — postes à combler par événement
-- ---------------------------------------------------------------------------
create table needs (
  id      text primary key,                            -- ex. 'n1'
  eid     text not null references events(id)     on delete cascade,
  act_id  text not null references activities(id) on delete restrict,
  qty     int  not null default 1 check (qty >= 1),
  hours   numeric not null default 0,
  instr   text
);
create index needs_eid_idx on needs (eid);

-- ---------------------------------------------------------------------------
-- 6) regs — inscriptions (assigné vs liste d'attente = ordre par ts)
-- ---------------------------------------------------------------------------
create table regs (
  id       text primary key,                           -- ex. 'r1'
  pid      text not null references users(id)  on delete cascade,
  eid      text not null references events(id) on delete cascade,
  nid      text not null references needs(id)  on delete cascade,
  ts       bigint not null,                            -- epoch ms : décide l'ordre PAPS
  present  boolean,                                    -- null | true | false
  created_at timestamptz not null default now(),
  unique (pid, nid)                                    -- un joueur ne postule qu'une fois par poste
);
create index regs_nid_ts_idx on regs (nid, ts);
create index regs_eid_idx    on regs (eid);
create index regs_pid_idx    on regs (pid);

-- ---------------------------------------------------------------------------
-- 7) outbox — file d'envoi de courriels simulés (prototype)
-- ---------------------------------------------------------------------------
create table outbox (
  id         bigint generated always as identity primary key,
  payload    jsonb not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 8) RLS — Row Level Security (permissif pour la démo)
-- ============================================================================
alter table settings   enable row level security;
alter table users      enable row level security;
alter table activities enable row level security;
alter table events     enable row level security;
alter table needs      enable row level security;
alter table regs       enable row level security;
alter table outbox     enable row level security;

-- Politique unique par table : accès total (SELECT/INSERT/UPDATE/DELETE)
-- aux rôles anon + authenticated. « USING true » = aucune restriction.
do $$
declare tbl text;
begin
  foreach tbl in array array['settings','users','activities','events','needs','regs','outbox']
  loop
    execute format('drop policy if exists demo_all on %I;', tbl);
    execute format(
      'create policy demo_all on %I for all to anon, authenticated using (true) with check (true);',
      tbl
    );
  end loop;
end $$;

-- ============================================================================
-- 9) Realtime — diffuser les changements (surtout regs pour les places live)
-- ============================================================================
do $$
declare tbl text;
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
  -- Ajout idempotent : n'ajoute la table que si elle n'est pas déjà publiée.
  foreach tbl in array array['regs','needs','events','activities','users','settings']
  loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = tbl
    ) then
      execute format('alter publication supabase_realtime add table %I;', tbl);
    end if;
  end loop;
end $$;

-- REPLICA IDENTITY FULL : nécessaire pour recevoir l'ancienne ligne sur
-- les évènements DELETE/UPDATE via Realtime.
alter table regs       replica identity full;
alter table needs      replica identity full;
alter table events     replica identity full;
alter table activities replica identity full;
alter table users      replica identity full;
alter table settings   replica identity full;

-- ============================================================================
-- 10) SEED — données de démo (identiques à seedDB() de app.js)
-- ============================================================================

-- settings (ligne unique)
insert into settings (id, hours_goal, credit_mode, withdraw_hours, logo)
values (1, 15, 'approval', 48, null);

-- users
insert into users (id, first, last, email, pass, role, category, status, invite_code) values
  ('u_coach','Marc','Tremblay','coach@equipe.ca','coach','coach',null,'active',null),
  ('u_alex','Alex','Bergeron','alex@equipe.ca','joueur','player','benjamin','active',null),
  ('u_sam','Sam','Côté','sam@equipe.ca','joueur','player','benjamin','active',null),
  ('u_jo','Jordan','Lavoie','jordan@equipe.ca','joueur','player','juvenile','active',null),
  ('u_max','Maxime','Roy','max@equipe.ca','joueur','player','juvenile','active',null),
  ('u_lea','Léa','Gagnon','lea@equipe.ca','joueur','player','benjamin','active',null),
  ('u_noa','Noah','Fortin','noah@equipe.ca','joueur','player','juvenile','active',null),
  ('u_inv1','Emma','Boucher','emma@equipe.ca',null,'player','cadet','invited','EMMA-2F7K'),
  ('u_inv2','Lucas','Girard','lucas@equipe.ca',null,'player','cadet','invited','LUCA-9QX3');

-- activities
insert into activities (id, name, hours, color, descr, instr, sort) values
  ('a_marq','Marqueur',2,'#2563eb','Tenir la feuille de pointage et le tableau d''affichage : noter les buts, cartons et changements tout au long du match.','Se présenter à la table officielle 20 min avant le coup d''envoi. Prévoir un stylo.',0),
  ('a_chro','Chronométreur',2,'#16a34a','Gérer le chronomètre officiel du match : démarrer/arrêter aux coups de sifflet de l''arbitre et signaler la fin des périodes.',null,1),
  ('a_chai','Chaîneur',3,'#d97706','Tenir la chaîne de mesure (10 verges) le long de la ligne de touche et la déplacer selon les indications de l''arbitre.','Porter la veste orange fournie. Rester attentif aux signaux de l''arbitre de touche.',2),
  ('a_cant','Cantine',3,'#dc2626','Préparer et servir à la cantine : boissons, collations, encaissement. Respecter les consignes d''hygiène.',null,3),
  ('a_lav','Lavage maillots',2,'#7c3aed','Récupérer les maillots après le match, les laver et les rapporter propres et pliés au prochain entraînement.',null,4);

-- events (dates relatives à maintenant, comme seedDB : +4j, +7j, -6j, +9j à 18h/19h)
insert into events (id, title, date, location, category) values
  ('e_p2','Partie 2 — Domicile', (now()::date + 4) + time '18:00', 'Stade municipal','cadet'),
  ('e_pr','Pratique — Semaine 3',(now()::date + 7) + time '19:00', 'Terrain école',null),
  ('e_p1','Partie 1 — Extérieur',(now()::date - 6) + time '18:00', 'Stade adverse','juvenile'),
  ('e_p3','Partie 3 — Benjamins', (now()::date + 9) + time '18:00', 'Stade municipal','benjamin');

-- needs
insert into needs (id, eid, act_id, qty, hours, instr) values
  ('n1','e_p2','a_chai',2,3,'Se présenter côté banc de touche 30 min avant le coup d''envoi. Veste orange fournie à la table officielle.'),
  ('n2','e_p2','a_marq',1,2,'Récupérer la feuille de match auprès du coach principal avant le début.'),
  ('n3','e_p2','a_cant',3,3,'Clés de la cantine au local B. Ouvrir 1 h avant le match, caisse de fond dans le tiroir.'),
  ('n4','e_p2','a_lav', 1,2,null),
  ('n5','e_pr','a_chro',1,2,null),
  ('n6','e_pr','a_cant',2,2,null),
  ('n7','e_p1','a_marq',1,2,null),
  ('n8','e_p1','a_chro',1,2,null),
  ('n9','e_p1','a_cant',2,3,null),
  ('n10','e_p3','a_chai',2,3,null),
  ('n11','e_p3','a_cant',2,3,null);

-- regs (ts en epoch ms ; on décale par rapport à maintenant pour garder l'ordre PAPS)
-- Partie 2 — cantine (n3) : 5 postulants pour 3 places → 3 assignés + 2 en attente
-- Partie 2 — chaîneur (n1) : 1 sur 2
-- Partie 1 (passée) : présences confirmées pour la démo des heures créditées
insert into regs (id, pid, eid, nid, ts, present) values
  ('r1','u_sam','e_p2','n3', (extract(epoch from now())*1000)::bigint - 500000, null),
  ('r2','u_jo', 'e_p2','n3', (extract(epoch from now())*1000)::bigint - 400000, null),
  ('r3','u_max','e_p2','n3', (extract(epoch from now())*1000)::bigint - 300000, null),
  ('r4','u_lea','e_p2','n3', (extract(epoch from now())*1000)::bigint - 200000, null),
  ('r5','u_noa','e_p2','n3', (extract(epoch from now())*1000)::bigint - 100000, null),
  ('r6','u_alex','e_p2','n1',(extract(epoch from now())*1000)::bigint - 450000, null),
  ('r7','u_alex','e_p1','n7',(extract(epoch from now())*1000)::bigint - 9000000, true),
  ('r8','u_sam', 'e_p1','n9',(extract(epoch from now())*1000)::bigint - 8000000, true);

-- ============================================================================
-- DURCISSEMENT (pour plus tard, hors démo) — NE PAS exécuter maintenant.
-- ----------------------------------------------------------------------------
-- Pour une vraie mise en production, on remplacerait la politique « demo_all »
-- par des règles fondées sur auth.uid() (comptes Supabase Auth) :
--   • users     : chacun lit/écrit sa propre ligne ; le coach gère l'équipe.
--   • activities/events/needs : lecture publique ; écriture réservée au coach.
--   • regs      : un joueur crée/supprime SES inscriptions ; le coach voit tout.
-- On stockerait aussi les mots de passe hashés (jamais en clair) et on
-- brancherait l'auth applicative sur Supabase Auth.
-- ============================================================================

-- E-Voting OSIS - Phase 1 Supabase Schema
-- Copy seluruh file ini ke Supabase SQL Editor lalu Run.

create extension if not exists "pgcrypto";

do $$ begin
  create type user_role as enum ('student', 'staff', 'admin', 'panitia', 'auditor');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type election_status as enum ('planning', 'active', 'closed', 'finalized');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type registration_status as enum ('pending', 'registered', 'ineligible');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type qr_status as enum ('active', 'used', 'revoked');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type verification_status as enum ('approved', 'rejected', 'timeout');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type booth_session_status as enum ('pending', 'active', 'voting', 'completed', 'expired');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type audit_actor_type as enum ('student', 'staff', 'admin', 'panitia', 'auditor', 'system');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type audit_status as enum ('success', 'failure');
exception when duplicate_object then null;
end $$;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username varchar(100) unique not null,
  email varchar(255) unique not null,
  password_hash varchar(255) not null,
  role user_role not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  nis varchar(20) unique not null,
  name varchar(255) not null,
  class varchar(50) not null,
  photo_url text,
  registration_status registration_status not null default 'pending',
  registration_date timestamptz,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists elections (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  description text,
  status election_status not null default 'planning',
  start_time timestamptz not null,
  end_time timestamptz not null,
  created_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint elections_valid_time check (end_time > start_time)
);

create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references elections(id) on delete cascade,
  name varchar(255) not null,
  number int not null,
  photo_url text,
  platform text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (election_id, number)
);

create table if not exists qr_codes (
  id uuid primary key default gen_random_uuid(),
  nis varchar(20) not null unique references students(nis),
  hash varchar(64) not null,
  salt varchar(32) not null,
  qr_data text not null,
  status qr_status not null default 'active',
  created_at timestamptz not null default now(),
  generated_by varchar(50) not null default 'system',
  metadata jsonb not null default '{}'::jsonb,
  constraint qr_hash_length check (char_length(hash) = 64)
);

create table if not exists verifications (
  id uuid primary key default gen_random_uuid(),
  nis varchar(20) not null references students(nis),
  staff_id uuid references users(id),
  booth_id int not null,
  status verification_status not null default 'approved',
  approval_reason varchar(255),
  rejection_reason varchar(255),
  session_token uuid unique,
  session_expires_at timestamptz,
  verified_at timestamptz not null default now(),
  ip_address inet,
  device_fingerprint varchar(255),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists booth_sessions (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references elections(id) on delete cascade,
  booth_id int not null,
  session_token uuid not null unique,
  nis varchar(20) references students(nis),
  status booth_session_status not null default 'pending',
  activated_at timestamptz,
  expires_at timestamptz,
  voting_started_at timestamptz,
  voting_submitted_at timestamptz,
  created_by varchar(50) not null default 'system',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references elections(id) on delete restrict,
  session_token uuid not null unique references booth_sessions(session_token),
  candidate_id uuid not null references candidates(id) on delete restrict,
  vote_token uuid not null unique,
  submitted_at timestamptz not null default now(),
  ip_address inet,
  device_fingerprint varchar(255),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists vote_tokens (
  id uuid primary key default gen_random_uuid(),
  token_hash uuid not null unique,
  candidate_id uuid not null references candidates(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  election_id uuid references elections(id) on delete set null,
  event_type varchar(100) not null,
  actor_type audit_actor_type not null default 'system',
  actor_id varchar(50),
  resource_type varchar(100),
  resource_id varchar(100),
  action varchar(100) not null,
  status audit_status not null default 'success',
  error_code varchar(50),
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet,
  device_fingerprint varchar(255),
  created_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_users_updated_at on users;
create trigger set_users_updated_at
before update on users
for each row execute function set_updated_at();

drop trigger if exists set_students_updated_at on students;
create trigger set_students_updated_at
before update on students
for each row execute function set_updated_at();

drop trigger if exists set_elections_updated_at on elections;
create trigger set_elections_updated_at
before update on elections
for each row execute function set_updated_at();

drop trigger if exists set_candidates_updated_at on candidates;
create trigger set_candidates_updated_at
before update on candidates
for each row execute function set_updated_at();

drop trigger if exists set_booth_sessions_updated_at on booth_sessions;
create trigger set_booth_sessions_updated_at
before update on booth_sessions
for each row execute function set_updated_at();

create index if not exists idx_users_role on users(role);
create index if not exists idx_students_nis on students(nis);
create index if not exists idx_students_registration_status on students(registration_status);
create index if not exists idx_candidates_election on candidates(election_id);
create index if not exists idx_qr_codes_nis on qr_codes(nis);
create index if not exists idx_qr_codes_status on qr_codes(status);
create index if not exists idx_verifications_nis on verifications(nis);
create index if not exists idx_verifications_staff on verifications(staff_id);
create index if not exists idx_verifications_session_token on verifications(session_token);
create index if not exists idx_booth_sessions_election on booth_sessions(election_id);
create index if not exists idx_booth_sessions_booth on booth_sessions(booth_id);
create index if not exists idx_booth_sessions_status on booth_sessions(status);
create index if not exists idx_booth_sessions_session_token on booth_sessions(session_token);
create index if not exists idx_votes_candidate on votes(candidate_id);
create index if not exists idx_votes_election on votes(election_id);
create index if not exists idx_votes_submitted_at on votes(submitted_at);
create index if not exists idx_vote_tokens_hash on vote_tokens(token_hash);
create index if not exists idx_audit_logs_election on audit_logs(election_id);
create index if not exists idx_audit_logs_event on audit_logs(event_type);
create index if not exists idx_audit_logs_created on audit_logs(created_at);
create index if not exists idx_audit_logs_actor on audit_logs(actor_type, actor_id);

alter table users enable row level security;
alter table students enable row level security;
alter table elections enable row level security;
alter table candidates enable row level security;
alter table qr_codes enable row level security;
alter table verifications enable row level security;
alter table booth_sessions enable row level security;
alter table votes enable row level security;
alter table vote_tokens enable row level security;
alter table audit_logs enable row level security;

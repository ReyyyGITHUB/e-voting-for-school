-- E-Voting OSIS - Append-only and Lock Helpers
-- Jalankan setelah 01_schema.sql.

create or replace function prevent_votes_update_delete()
returns trigger
language plpgsql
as $$
begin
  raise exception 'votes table is append-only';
end;
$$;

drop trigger if exists votes_append_only on votes;
create trigger votes_append_only
before update or delete on votes
for each row execute function prevent_votes_update_delete();

create or replace function prevent_vote_tokens_update_delete()
returns trigger
language plpgsql
as $$
begin
  raise exception 'vote_tokens table is append-only';
end;
$$;

drop trigger if exists vote_tokens_append_only on vote_tokens;
create trigger vote_tokens_append_only
before update or delete on vote_tokens
for each row execute function prevent_vote_tokens_update_delete();

create or replace function prevent_audit_logs_update_delete()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_logs table is append-only';
end;
$$;

drop trigger if exists audit_logs_append_only on audit_logs;
create trigger audit_logs_append_only
before update or delete on audit_logs
for each row execute function prevent_audit_logs_update_delete();

create table if not exists system_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into system_settings (key, value)
values ('database_locked', 'false'::jsonb)
on conflict (key) do nothing;

create or replace function is_database_locked()
returns boolean
language sql
stable
as $$
  select coalesce((select value::boolean from system_settings where key = 'database_locked'), false);
$$;

create or replace function prevent_writes_when_locked()
returns trigger
language plpgsql
as $$
begin
  if is_database_locked() then
    raise exception 'database is locked after election';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

drop trigger if exists lock_students_writes on students;
create trigger lock_students_writes
before insert or update or delete on students
for each row execute function prevent_writes_when_locked();

drop trigger if exists lock_elections_writes on elections;
create trigger lock_elections_writes
before insert or update or delete on elections
for each row execute function prevent_writes_when_locked();

drop trigger if exists lock_candidates_writes on candidates;
create trigger lock_candidates_writes
before insert or update or delete on candidates
for each row execute function prevent_writes_when_locked();

drop trigger if exists lock_qr_codes_writes on qr_codes;
create trigger lock_qr_codes_writes
before insert or update or delete on qr_codes
for each row execute function prevent_writes_when_locked();

drop trigger if exists lock_verifications_writes on verifications;
create trigger lock_verifications_writes
before insert or update or delete on verifications
for each row execute function prevent_writes_when_locked();

drop trigger if exists lock_booth_sessions_writes on booth_sessions;
create trigger lock_booth_sessions_writes
before insert or update or delete on booth_sessions
for each row execute function prevent_writes_when_locked();

drop trigger if exists lock_votes_writes on votes;
create trigger lock_votes_writes
before insert or update or delete on votes
for each row execute function prevent_writes_when_locked();

drop trigger if exists lock_vote_tokens_writes on vote_tokens;
create trigger lock_vote_tokens_writes
before insert or update or delete on vote_tokens
for each row execute function prevent_writes_when_locked();

create or replace function lock_database_after_election()
returns void
language plpgsql
as $$
begin
  insert into system_settings (key, value, updated_at)
  values ('database_locked', 'true'::jsonb, now())
  on conflict (key) do update set value = excluded.value, updated_at = now();

  insert into audit_logs (event_type, actor_type, action, status, metadata)
  values ('database_locked', 'system', 'lock_database_after_election', 'success', '{}'::jsonb);
end;
$$;

create or replace function unlock_database_for_admin()
returns void
language plpgsql
as $$
begin
  insert into system_settings (key, value, updated_at)
  values ('database_locked', 'false'::jsonb, now())
  on conflict (key) do update set value = excluded.value, updated_at = now();

  insert into audit_logs (event_type, actor_type, action, status, metadata)
  values ('database_unlocked', 'system', 'unlock_database_for_admin', 'success', '{}'::jsonb);
end;
$$;

-- Pakai ini setelah pemilu selesai:
-- select lock_database_after_election();

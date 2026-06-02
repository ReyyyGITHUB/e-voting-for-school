-- Migration: registration_status flow baru
-- Copy seluruh file ini ke Supabase SQL Editor lalu Run.
-- Flow: pending -> qr_generated -> verified. ineligible = tidak boleh ikut voting.

begin;

-- 1. Pastikan semua data existing aman sebelum enum lama diganti.
-- Kalau masih ada status lama 'registered', map ke 'qr_generated'.
alter table students alter column registration_status drop default;
alter table students alter column registration_status type text using registration_status::text;

update students
set registration_status = case
  when registration_status = 'registered' then 'qr_generated'
  when registration_status = 'pending' then 'pending'
  when registration_status = 'ineligible' then 'ineligible'
  when registration_status = 'qr_generated' then 'qr_generated'
  when registration_status = 'verified' then 'verified'
  else 'pending'
end;

-- 2. Buang enum lama dan buat enum baru.
drop type if exists registration_status cascade;
create type registration_status as enum ('pending', 'qr_generated', 'verified', 'ineligible');

-- 3. Pasang enum baru ke kolom students.
alter table students
  alter column registration_status type registration_status
  using registration_status::registration_status;

alter table students
  alter column registration_status set default 'pending'::registration_status;

alter table students
  alter column registration_status set not null;

commit;

-- Cek hasil:
select nis, name, class, registration_status
from students
order by nis;

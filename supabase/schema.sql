-- BoltClimb multiplayer (Race Mode) schema. Run once in Supabase Dashboard > SQL Editor.
-- Matchmaking uses tables + RPC polling (no Realtime messages); only the in-race position sync uses Realtime Broadcast.

create table if not exists public.bc_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null unique,
  created_at timestamptz not null default now()
);
alter table public.bc_profiles enable row level security;
drop policy if exists bc_profiles_read on public.bc_profiles;
create policy bc_profiles_read on public.bc_profiles for select to authenticated using (true);

create table if not exists public.bc_rooms (
  id uuid primary key default gen_random_uuid(),
  p1 uuid not null,
  p2 uuid not null,
  p1_name text not null,
  p2_name text not null,
  p1_skin jsonb,
  p2_skin jsonb,
  seed integer not null,
  round integer not null default 1,
  winner uuid,
  created_at timestamptz not null default now(),
  finished_at timestamptz
);
alter table public.bc_rooms enable row level security;
drop policy if exists bc_rooms_read on public.bc_rooms;
create policy bc_rooms_read on public.bc_rooms for select to authenticated using (auth.uid() = p1 or auth.uid() = p2);

create table if not exists public.bc_queue (
  user_id uuid primary key,
  name text not null,
  skin jsonb,
  seen_at timestamptz not null default now(),
  room_id uuid
);
alter table public.bc_queue enable row level security; -- no policies: only the functions below touch it

-- 1) random unique guest name (idempotent: returns the existing name if the user already has one)
create or replace function public.bc_claim_name() returns text
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  n text; tries int := 0;
  adj text[] := array['Swift','Brave','Lucky','Cosmic','Turbo','Neon','Rapid','Hyper','Pixel','Solar','Lunar','Mighty','Sneaky','Jolly','Zippy','Atomic','Frosty','Blazing','Silent','Wild'];
  noun text[] := array['Bolt','Comet','Falcon','Otter','Panda','Rocket','Tiger','Wolf','Fox','Robot','Nova','Gecko','Moth','Yeti','Lynx','Orbit','Raven','Cobra','Koala','Drone'];
begin
  if uid is null then raise exception 'not authenticated'; end if;
  select name into n from bc_profiles where id = uid;
  if found then return n; end if;
  loop
    n := adj[1 + floor(random() * array_length(adj, 1))::int] || noun[1 + floor(random() * array_length(noun, 1))::int]
         || (case when tries < 20 then (10 + floor(random() * 90))::int else (1000 + floor(random() * 9000))::int end)::text;
    begin
      insert into bc_profiles(id, name) values (uid, n);
      return n;
    exception when unique_violation then
      select name into n from bc_profiles where id = uid;
      if found then return n; end if;
      tries := tries + 1;
    end;
  end loop;
end $$;

-- 2) matchmaking: pair with the oldest waiting player, otherwise wait in the queue
create or replace function public.bc_find_match(p_skin jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  me text; o record; rid uuid; sd int; r bc_rooms;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  me := bc_claim_name();
  perform pg_advisory_xact_lock(777001);
  delete from bc_queue where seen_at < now() - interval '15 seconds' and room_id is null;
  delete from bc_rooms where created_at < now() - interval '1 day';
  delete from bc_queue where user_id = uid;
  select * into o from bc_queue where room_id is null and user_id <> uid order by seen_at asc limit 1;
  if found then
    sd := floor(random() * 2000000000)::int;
    insert into bc_rooms(p1, p2, p1_name, p2_name, p1_skin, p2_skin, seed)
      values (o.user_id, uid, o.name, me, o.skin, p_skin, sd) returning * into r;
    update bc_queue set room_id = r.id, seen_at = now() where user_id = o.user_id;
    return jsonb_build_object('status', 'matched', 'room', to_jsonb(r));
  end if;
  insert into bc_queue(user_id, name, skin) values (uid, me, p_skin);
  return jsonb_build_object('status', 'waiting', 'name', me);
end $$;

-- 3) poll while waiting (also refreshes the heartbeat)
create or replace function public.bc_poll_match() returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); q record; r bc_rooms;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  select * into q from bc_queue where user_id = uid;
  if not found then return jsonb_build_object('status', 'none'); end if;
  if q.room_id is not null then
    select * into r from bc_rooms where id = q.room_id;
    delete from bc_queue where user_id = uid;
    return jsonb_build_object('status', 'matched', 'room', to_jsonb(r));
  end if;
  update bc_queue set seen_at = now() where user_id = uid;
  return jsonb_build_object('status', 'waiting');
end $$;

create or replace function public.bc_leave_queue() returns void
language sql security definer set search_path = public as $$
  delete from bc_queue where user_id = auth.uid();
$$;

-- 4) first finisher wins (atomic; the server decides, not the clients)
create or replace function public.bc_finish(p_room uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); r bc_rooms;
begin
  select * into r from bc_rooms where id = p_room for update;
  if not found or (uid <> r.p1 and uid <> r.p2) then raise exception 'not in room'; end if;
  if r.winner is null then
    update bc_rooms set winner = uid, finished_at = now() where id = p_room returning * into r;
  end if;
  return jsonb_build_object('winner', r.winner, 'you', uid);
end $$;

-- 5) rematch accepted: new seed, clear the winner
create or replace function public.bc_new_round(p_room uuid, p_seed int) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); r bc_rooms;
begin
  select * into r from bc_rooms where id = p_room for update;
  if not found or (uid <> r.p1 and uid <> r.p2) then raise exception 'not in room'; end if;
  update bc_rooms set winner = null, finished_at = null, seed = p_seed, round = round + 1 where id = p_room returning * into r;
  return to_jsonb(r);
end $$;

revoke all on function public.bc_claim_name(), public.bc_find_match(jsonb), public.bc_poll_match(), public.bc_leave_queue(), public.bc_finish(uuid), public.bc_new_round(uuid, int) from public, anon;
grant execute on function public.bc_claim_name(), public.bc_find_match(jsonb), public.bc_poll_match(), public.bc_leave_queue(), public.bc_finish(uuid), public.bc_new_round(uuid, int) to authenticated;

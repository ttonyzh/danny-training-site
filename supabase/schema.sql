-- Run this once in the Supabase SQL editor (project → SQL Editor → New query).
create table signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  player_age int,
  training_interest text not null,
  message text,
  trainer text
);

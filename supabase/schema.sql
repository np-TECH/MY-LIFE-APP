-- Njabulo OS schema (run in Supabase SQL Editor)
-- Enable Email Auth in Supabase first.

create table if not exists daily_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  outreach_done boolean default false,
  income_action_done boolean default false,
  future_build_done boolean default false,
  family_time_done boolean default false,
  gym_done boolean default false,
  touchpoints_count int default 0,
  meetings_count int default 0,
  pitches_count int default 0,
  notes text,
  created_at timestamptz default now(),
  unique(user_id, entry_date)
);

create table if not exists weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  touchpoints int default 0,
  meetings int default 0,
  pitches int default 0,
  gym_sessions int default 0,
  date_night boolean default false,
  family_walk boolean default false,
  notes text,
  created_at timestamptz default now(),
  unique(user_id, week_start)
);

create table if not exists pipeline_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  contact_name text not null,
  company text,
  category text,
  channel text,
  stage text not null default 'Sent',
  date_contacted date,
  follow_up_date date,
  value_potential numeric default 0,
  next_action text,
  notes text,
  created_at timestamptz default now()
);

alter table daily_entries enable row level security;
alter table weekly_reviews enable row level security;
alter table pipeline_items enable row level security;

create policy "own_daily_entries" on daily_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_weekly_reviews" on weekly_reviews
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_pipeline_items" on pipeline_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

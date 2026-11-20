-- Enable pgvector for semantic similarity search on property descriptions
create extension if not exists vector with schema extensions;

-- Agents are real estate professionals who list properties and manage leads
create table public.agents (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  agency_name text,
  avatar_url text,
  bio text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update the updated_at timestamp on every row change
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger agents_updated_at
  before update on public.agents
  for each row execute function public.handle_updated_at();

-- Index for quick lookup by email (used during auth)
create index idx_agents_email on public.agents(email);

-- Properties are real estate listings managed by agents
create type public.property_type as enum ('apartment', 'villa', 'townhouse');
create type public.property_purpose as enum ('rent', 'sale');
create type public.property_status as enum ('active', 'rented', 'sold');

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  title text not null,
  type public.property_type not null,
  purpose public.property_purpose not null,
  price_aed numeric not null check (price_aed > 0),
  bedrooms integer not null check (bedrooms >= 0),
  bathrooms integer not null check (bathrooms >= 0),
  size_sqft integer not null check (size_sqft > 0),
  area text not null,
  latitude double precision not null,
  longitude double precision not null,
  furnished boolean not null default false,
  pet_friendly boolean not null default false,
  near_metro boolean not null default false,
  parking integer not null default 0,
  amenities text[] not null default '{}',
  description_en text not null,
  description_ar text,
  photos text[] not null default '{}',
  status public.property_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger properties_updated_at
  before update on public.properties
  for each row execute function public.handle_updated_at();

-- Indexes for the most common filter patterns
create index idx_properties_status on public.properties(status);
create index idx_properties_area on public.properties(area);
create index idx_properties_purpose on public.properties(purpose);
create index idx_properties_type on public.properties(type);
create index idx_properties_bedrooms on public.properties(bedrooms);
create index idx_properties_price on public.properties(price_aed);
create index idx_properties_agent on public.properties(agent_id);

-- Composite index for the most frequent search: active properties filtered by purpose
create index idx_properties_active_purpose on public.properties(status, purpose);

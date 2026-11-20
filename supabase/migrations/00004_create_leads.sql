-- Leads are created when a buyer/renter submits an enquiry on a property
create type public.lead_status as enum ('new', 'contacted', 'viewing_booked', 'closed', 'lost');

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  agent_id uuid not null references public.agents(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  message text,
  preferred_contact_time text,
  status public.lead_status not null default 'new',
  language text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger leads_updated_at
  before update on public.leads
  for each row execute function public.handle_updated_at();

create index idx_leads_agent on public.leads(agent_id);
create index idx_leads_property on public.leads(property_id);
create index idx_leads_status on public.leads(status);
create index idx_leads_agent_status on public.leads(agent_id, status);

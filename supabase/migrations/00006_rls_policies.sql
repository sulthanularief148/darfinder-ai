-- Row Level Security ensures data isolation between agents
-- and limits public access to only active properties.

alter table public.agents enable row level security;
alter table public.properties enable row level security;
alter table public.property_embeddings enable row level security;
alter table public.leads enable row level security;
alter table public.search_logs enable row level security;

-- AGENTS: users can read their own agent profile, insert on signup
create policy "agents_select_own"
  on public.agents for select
  using (auth.uid() = id);

create policy "agents_insert_own"
  on public.agents for insert
  with check (auth.uid() = id);

create policy "agents_update_own"
  on public.agents for update
  using (auth.uid() = id);

-- PROPERTIES: anyone can read active listings; agents CRUD their own
create policy "properties_select_active"
  on public.properties for select
  using (status = 'active');

create policy "properties_select_own"
  on public.properties for select
  using (auth.uid() = agent_id);

create policy "properties_insert_own"
  on public.properties for insert
  with check (auth.uid() = agent_id);

create policy "properties_update_own"
  on public.properties for update
  using (auth.uid() = agent_id);

create policy "properties_delete_own"
  on public.properties for delete
  using (auth.uid() = agent_id);

-- PROPERTY EMBEDDINGS: readable by all (needed for search ranking),
-- writable only by the property's agent via service role
create policy "embeddings_select_all"
  on public.property_embeddings for select
  using (true);

-- LEADS: agents can only see and update their own leads.
-- Public users can insert (via service role in the API).
create policy "leads_select_own"
  on public.leads for select
  using (auth.uid() = agent_id);

create policy "leads_update_own"
  on public.leads for update
  using (auth.uid() = agent_id);

-- SEARCH LOGS: only insertable via service role (server-side).
-- Agents read aggregate stats through the dashboard API, not directly.

-- Search logs power the agent dashboard analytics.
-- We store the parsed filters (never personal data) so agents can see
-- what buyers are searching for and spot gaps in their inventory.
create table public.search_logs (
  id uuid primary key default gen_random_uuid(),
  query_text text not null,
  parsed_filters jsonb not null default '{}',
  result_count integer not null default 0,
  ip_hash text,
  created_at timestamptz not null default now()
);

-- Index for dashboard queries: most searched areas, zero-result queries
create index idx_search_logs_created on public.search_logs(created_at desc);
create index idx_search_logs_result_count on public.search_logs(result_count);

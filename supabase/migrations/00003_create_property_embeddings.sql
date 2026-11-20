-- Embeddings power the semantic ranking in hybrid search.
-- After hard filters narrow results, we rank by cosine similarity
-- between the user's "free text intent" and each property's embedding.
create table public.property_embeddings (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null unique references public.properties(id) on delete cascade,
  embedding vector(768) not null,
  content_hash text not null,
  created_at timestamptz not null default now()
);

-- HNSW index for fast approximate nearest-neighbor search (cosine distance)
create index idx_property_embeddings_vector
  on public.property_embeddings
  using hnsw (embedding vector_cosine_ops);

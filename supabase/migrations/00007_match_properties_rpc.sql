-- RPC function for pgvector similarity re-ranking
-- Called by the search API to re-rank filtered results by semantic similarity
create or replace function match_properties(
  query_embedding vector(768),
  match_count int default 20,
  property_ids uuid[] default '{}'
)
returns table (id uuid, similarity float)
language plpgsql
as $$
begin
  return query
    select
      pe.property_id as id,
      1 - (pe.embedding <=> query_embedding) as similarity
    from property_embeddings pe
    inner join properties p on p.id = pe.property_id
    where p.status = 'active'
      and (array_length(property_ids, 1) is null or pe.property_id = any(property_ids))
    order by pe.embedding <=> query_embedding
    limit match_count;
end;
$$;

-- Alternative: Hybrid approach with dimensionality reduction
-- Store full 3072-dim embeddings + reduced 768-dim for indexing

-- Add a reduced embedding column for indexing
ALTER TABLE document_chunks 
ADD COLUMN IF NOT EXISTS embedding_reduced vector(768);

-- Create index on reduced embeddings
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding_reduced ON document_chunks 
USING hnsw (embedding_reduced vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- Create hybrid search function that uses reduced embeddings for initial filtering
-- then full embeddings for final ranking
CREATE OR REPLACE FUNCTION search_similar_chunks_hybrid(
  query_embedding_full vector(3072),
  query_embedding_reduced vector(768),
  workspace_filter text DEFAULT NULL,
  similarity_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  document_id uuid,
  chunk_text text,
  chunk_type text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dc.id,
    dc.document_id,
    dc.chunk_text,
    dc.chunk_type,
    1 - (dc.embedding <=> query_embedding_full) as similarity
  FROM (
    -- First pass: Use reduced embeddings with index for fast filtering
    SELECT * FROM document_chunks dc_inner
    WHERE 
      (workspace_filter IS NULL OR dc_inner.workspace_id = workspace_filter)
      AND dc_inner.embedding_reduced IS NOT NULL
    ORDER BY dc_inner.embedding_reduced <=> query_embedding_reduced
    LIMIT match_count * 3  -- Get 3x candidates for reranking
  ) dc
  WHERE 
    dc.embedding IS NOT NULL
    AND 1 - (dc.embedding <=> query_embedding_full) > similarity_threshold
  ORDER BY dc.embedding <=> query_embedding_full
  LIMIT match_count;
END;
$$;

-- Update document_chunks table to use gemini-embedding-001 (3072 dimensions)
-- No vector index due to Supabase 2000 dimension limit, but still fast for small-medium datasets

-- First, drop the existing vector index
DROP INDEX IF EXISTS idx_document_chunks_embedding;

-- Alter the embedding column to use correct dimensions (3072 for gemini-embedding-001)
ALTER TABLE document_chunks 
ALTER COLUMN embedding TYPE vector(3072);

-- NOTE: No vector index created due to 2000 dimension limit
-- For small-medium datasets (< 100k chunks), unindexed search is still fast
-- Similarity search will use sequential scan with cosine distance

-- Update the similarity search function with correct dimensions
CREATE OR REPLACE FUNCTION search_similar_chunks(
  query_embedding vector(3072),
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
    1 - (dc.embedding <=> query_embedding) as similarity
  FROM document_chunks dc
  WHERE 
    (workspace_filter IS NULL OR dc.workspace_id = workspace_filter)
    AND dc.embedding IS NOT NULL
    AND 1 - (dc.embedding <=> query_embedding) > similarity_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

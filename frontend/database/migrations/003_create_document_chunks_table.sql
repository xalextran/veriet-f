-- Document chunks table for RAG pipeline
-- Run this in Supabase SQL Editor after enabling pgvector extension

-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop table if it exists (be careful in production!)
DROP TABLE IF EXISTS document_chunks;

-- Create document_chunks table
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(document_id),
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  
  -- Chunk content and metadata
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL, -- Order of chunk within document
  chunk_type TEXT DEFAULT 'text' CHECK (chunk_type IN ('text', 'table', 'heading', 'paragraph')),
  
  -- Chunking metadata
  token_count INTEGER,
  character_count INTEGER,
  
  -- Vector embedding (768 dimensions for gemini-embedding-001)
  embedding vector(768),
  
  -- Processing metadata
  embedding_model TEXT DEFAULT 'gemini-embedding-001',
  chunking_strategy TEXT DEFAULT 'token',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX idx_document_chunks_workspace_id ON document_chunks(workspace_id);
CREATE INDEX idx_document_chunks_user_id ON document_chunks(user_id);
CREATE INDEX idx_document_chunks_chunk_index ON document_chunks(document_id, chunk_index);

-- Vector similarity search index (HNSW for better performance)
CREATE INDEX idx_document_chunks_embedding ON document_chunks 
USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.character_count = LENGTH(NEW.chunk_text);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_document_chunks_updated_at 
  BEFORE UPDATE ON document_chunks 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Character count trigger for inserts
CREATE OR REPLACE FUNCTION set_character_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.character_count = LENGTH(NEW.chunk_text);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_document_chunks_character_count
  BEFORE INSERT ON document_chunks 
  FOR EACH ROW 
  EXECUTE FUNCTION set_character_count();

-- Enable Row Level Security
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

-- RLS policy - users can only access chunks from their workspace
CREATE POLICY "Users can access chunks from their workspace" ON document_chunks
  FOR ALL USING (workspace_id IN (
    SELECT workspace_id FROM documents WHERE user_id = auth.uid()::text
  ));

-- Grant permissions
GRANT ALL ON document_chunks TO authenticated;
GRANT ALL ON document_chunks TO anon;

-- Create a function for similarity search
CREATE OR REPLACE FUNCTION search_similar_chunks(
  query_embedding vector(768),
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
    AND 1 - (dc.embedding <=> query_embedding) > similarity_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Simple documents table creation (run this in Supabase SQL Editor)
-- Drop table if it exists (be careful in production!)
DROP TABLE IF EXISTS documents;

-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL UNIQUE,
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  
  -- File metadata
  original_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  
  -- File properties
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  file_extension TEXT NOT NULL,
  
  -- Business categorization
  category TEXT,
  folder_path TEXT,
  tags TEXT[],
  
  -- Processing status
  processing_status TEXT DEFAULT 'uploaded' CHECK (processing_status IN ('uploaded', 'processing', 'processed', 'failed')),
  confidence_score DECIMAL(3,2),
  
  -- Timestamps
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_documents_workspace_id ON documents(workspace_id);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_uploaded_at ON documents(uploaded_at DESC);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_processing_status ON documents(processing_status);
CREATE INDEX idx_documents_original_name ON documents(original_name);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_updated_at 
  BEFORE UPDATE ON documents 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Simple RLS policy - allow all for authenticated users for now
CREATE POLICY "Allow all for authenticated users" ON documents
  FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON documents TO authenticated;
GRANT ALL ON documents TO anon;

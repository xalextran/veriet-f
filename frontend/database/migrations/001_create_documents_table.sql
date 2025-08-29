-- Create documents table for file metadata
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL UNIQUE, -- The UUID from upload
  workspace_id TEXT NOT NULL, -- Clerk org_id or user_id
  user_id TEXT NOT NULL, -- Clerk user_id
  
  -- File metadata
  original_name TEXT NOT NULL,
  file_name TEXT NOT NULL, -- Stored filename (document_id.ext)
  file_path TEXT NOT NULL, -- Full storage path
  public_url TEXT NOT NULL,
  
  -- File properties
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL, -- MIME type
  file_extension TEXT NOT NULL,
  
  -- Business categorization
  category TEXT, -- Invoice, Contract, Receipt, etc.
  folder_path TEXT, -- Virtual folder structure
  tags TEXT[], -- Array of tags
  
  -- Processing status
  processing_status TEXT DEFAULT 'uploaded' CHECK (processing_status IN ('uploaded', 'processing', 'processed', 'failed')),
  confidence_score DECIMAL(3,2), -- AI confidence 0.00-1.00
  
  -- Timestamps
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for fast queries
  CONSTRAINT documents_workspace_user_check CHECK (workspace_id IS NOT NULL AND user_id IS NOT NULL)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_workspace_id ON documents(workspace_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON documents(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_processing_status ON documents(processing_status);
CREATE INDEX IF NOT EXISTS idx_documents_original_name ON documents(original_name);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see documents in their workspace
CREATE POLICY "Users can view documents in their workspace" ON documents
  FOR SELECT USING (
    workspace_id = COALESCE(
      (SELECT auth.jwt() ->> 'org_id')::text,
      (SELECT auth.jwt() ->> 'sub')::text
    )
  );

-- Users can insert documents in their workspace
CREATE POLICY "Users can insert documents in their workspace" ON documents
  FOR INSERT WITH CHECK (
    workspace_id = COALESCE(
      (SELECT auth.jwt() ->> 'org_id')::text,
      (SELECT auth.jwt() ->> 'sub')::text
    )
    AND user_id = (SELECT auth.jwt() ->> 'sub')::text
  );

-- Users can update documents in their workspace
CREATE POLICY "Users can update documents in their workspace" ON documents
  FOR UPDATE USING (
    workspace_id = COALESCE(
      (SELECT auth.jwt() ->> 'org_id')::text,
      (SELECT auth.jwt() ->> 'sub')::text
    )
  );

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

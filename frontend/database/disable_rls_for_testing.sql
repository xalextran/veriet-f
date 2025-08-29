-- Temporarily disable RLS for testing
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;

-- Or update the policy to be more permissive
DROP POLICY IF EXISTS "Allow all for authenticated users" ON documents;

CREATE POLICY "Allow all for testing" ON documents
  FOR ALL USING (true);

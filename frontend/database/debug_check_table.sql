-- Debug: Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'documents';

-- Debug: List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Debug: Check table structure if it exists
\d documents;

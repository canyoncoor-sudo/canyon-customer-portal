-- Add missing columns to subcontractors table
-- Run this in Supabase SQL Editor

-- Add address column for professional's business address
ALTER TABLE subcontractors 
ADD COLUMN IF NOT EXISTS address TEXT;

-- Add notes column for additional information
ALTER TABLE subcontractors 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add updated_at column with automatic timestamp
ALTER TABLE subcontractors 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add created_at column if it doesn't exist
ALTER TABLE subcontractors 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if it exists and recreate it
DROP TRIGGER IF EXISTS update_subcontractors_updated_at ON subcontractors;
CREATE TRIGGER update_subcontractors_updated_at
    BEFORE UPDATE ON subcontractors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'subcontractors'
ORDER BY ordinal_position;

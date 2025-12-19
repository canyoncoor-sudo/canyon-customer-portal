-- Add proposal_data column to store line items and proposal details
ALTER TABLE portal_jobs 
ADD COLUMN IF NOT EXISTS proposal_data JSONB;

-- Add updated_at column if it doesn't exist
ALTER TABLE portal_jobs 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add job_city, job_state, job_zip if they don't exist
ALTER TABLE portal_jobs 
ADD COLUMN IF NOT EXISTS job_city TEXT,
ADD COLUMN IF NOT EXISTS job_state TEXT,
ADD COLUMN IF NOT EXISTS job_zip TEXT;

-- Add comment
COMMENT ON COLUMN portal_jobs.proposal_data IS 'Stores proposal line items, costs, and other proposal details as JSON';

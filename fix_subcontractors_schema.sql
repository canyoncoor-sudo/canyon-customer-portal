-- Allow subcontractors to exist without being tied to a specific job
-- This enables a master list of professionals organized by trade
ALTER TABLE subcontractors ALTER COLUMN job_id DROP NOT NULL;

-- Add an index for better performance when filtering by trade
CREATE INDEX IF NOT EXISTS idx_subcontractors_trade ON subcontractors(trade);

-- Add status column if it doesn't exist (for tracking availability)
ALTER TABLE subcontractors ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';

-- Create job_intakes table to store detailed intake information
CREATE TABLE IF NOT EXISTS job_intakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES portal_jobs(id) ON DELETE CASCADE,
  
  -- Additional contact info
  customer_secondary_phone TEXT,
  
  -- Location details
  job_city TEXT,
  job_state TEXT,
  job_zip TEXT,
  
  -- Project information
  project_type TEXT,
  work_description TEXT,
  estimated_budget TEXT,
  timeline TEXT,
  
  -- Meeting information
  first_meeting_datetime TIMESTAMP WITH TIME ZONE,
  meeting_notes TEXT,
  
  -- Lead tracking
  lead_source TEXT,
  priority TEXT DEFAULT 'medium',
  
  -- Internal notes
  internal_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on job_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_job_intakes_job_id ON job_intakes(job_id);

-- Create index on priority for filtering
CREATE INDEX IF NOT EXISTS idx_job_intakes_priority ON job_intakes(priority);

-- Create index on first_meeting_datetime for scheduling
CREATE INDEX IF NOT EXISTS idx_job_intakes_meeting ON job_intakes(first_meeting_datetime);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_job_intakes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER job_intakes_updated_at
  BEFORE UPDATE ON job_intakes
  FOR EACH ROW
  EXECUTE FUNCTION update_job_intakes_updated_at();

-- Grant permissions (adjust as needed for your RLS policies)
ALTER TABLE job_intakes ENABLE ROW LEVEL SECURITY;

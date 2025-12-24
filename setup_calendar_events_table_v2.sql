-- Drop the table if it exists and recreate it fresh
DROP TABLE IF EXISTS calendar_events CASCADE;

-- Create calendar_events table with all required columns
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Google Calendar sync fields
  google_event_id TEXT UNIQUE,
  google_calendar_id TEXT,
  
  -- Event details
  summary TEXT,
  description TEXT,
  title TEXT,
  
  -- Date/time (REQUIRED FIELDS)
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'America/Los_Angeles',
  
  -- Event classification
  event_type TEXT,
  status TEXT DEFAULT 'scheduled',
  
  -- Customer/job info
  customer_name TEXT,
  job_id UUID,
  
  -- Additional details
  location TEXT,
  attendees TEXT,
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  
  -- Recurrence
  recurrence_rule TEXT,
  is_recurring BOOLEAN DEFAULT false
);

-- Create indexes for performance
CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_calendar_events_job_id ON calendar_events(job_id);
CREATE INDEX idx_calendar_events_google_id ON calendar_events(google_event_id);
CREATE INDEX idx_calendar_events_customer ON calendar_events(customer_name);
CREATE INDEX idx_calendar_events_type ON calendar_events(event_type);
CREATE INDEX idx_calendar_events_status ON calendar_events(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_calendar_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calendar_events_updated_at
    BEFORE UPDATE ON calendar_events
    FOR EACH ROW
    EXECUTE FUNCTION update_calendar_events_updated_at();

-- Verify table was created
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'calendar_events'
ORDER BY ordinal_position;

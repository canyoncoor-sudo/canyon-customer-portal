-- =====================================================
-- CALENDAR_EVENTS TABLE SETUP
-- Run this in Supabase SQL Editor
-- =====================================================

-- Check if table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables 
               WHERE table_name = 'calendar_events') THEN
        RAISE NOTICE 'Table calendar_events already exists. Adding missing columns...';
    ELSE
        RAISE NOTICE 'Creating calendar_events table...';
    END IF;
END $$;

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Google Calendar sync fields
  google_event_id TEXT UNIQUE,
  google_calendar_id TEXT,
  
  -- Event details
  summary TEXT NOT NULL,                  -- Event title/name
  description TEXT,                       -- Event notes/description
  title TEXT,                             -- Alternate title field
  
  -- Date/time
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'America/Los_Angeles',
  
  -- Event classification
  event_type TEXT,                        -- 'meeting', 'crew', 'site_visit', 'appointment', 'task'
  status TEXT DEFAULT 'scheduled',        -- 'scheduled', 'confirmed', 'completed', 'cancelled', 'pending'
  
  -- Customer/job info
  customer_name TEXT,
  job_id UUID REFERENCES job_intakes(id) ON DELETE SET NULL,
  
  -- Additional details
  location TEXT,
  attendees TEXT,                         -- Crew names or attendee list
  notes TEXT,                             -- Internal notes
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  
  -- Recurrence (for future use)
  recurrence_rule TEXT,
  is_recurring BOOLEAN DEFAULT false
);

-- Add columns if they don't exist (for existing tables)
DO $$ 
BEGIN
    -- Add summary column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'calendar_events' AND column_name = 'summary') THEN
        ALTER TABLE calendar_events ADD COLUMN summary TEXT;
        RAISE NOTICE 'Added column: summary';
    END IF;
    
    -- Add description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'calendar_events' AND column_name = 'description') THEN
        ALTER TABLE calendar_events ADD COLUMN description TEXT;
        RAISE NOTICE 'Added column: description';
    END IF;
    
    -- Add title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'calendar_events' AND column_name = 'title') THEN
        ALTER TABLE calendar_events ADD COLUMN title TEXT;
        RAISE NOTICE 'Added column: title';
    END IF;
    
    -- Add event_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'calendar_events' AND column_name = 'event_type') THEN
        ALTER TABLE calendar_events ADD COLUMN event_type TEXT;
        RAISE NOTICE 'Added column: event_type';
    END IF;
    
    -- Add customer_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'calendar_events' AND column_name = 'customer_name') THEN
        ALTER TABLE calendar_events ADD COLUMN customer_name TEXT;
        RAISE NOTICE 'Added column: customer_name';
    END IF;
    
    -- Add attendees column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'calendar_events' AND column_name = 'attendees') THEN
        ALTER TABLE calendar_events ADD COLUMN attendees TEXT;
        RAISE NOTICE 'Added column: attendees';
    END IF;
    
    -- Add google_event_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'calendar_events' AND column_name = 'google_event_id') THEN
        ALTER TABLE calendar_events ADD COLUMN google_event_id TEXT UNIQUE;
        RAISE NOTICE 'Added column: google_event_id';
    END IF;
    
    -- Add google_calendar_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'calendar_events' AND column_name = 'google_calendar_id') THEN
        ALTER TABLE calendar_events ADD COLUMN google_calendar_id TEXT;
        RAISE NOTICE 'Added column: google_calendar_id';
    END IF;
    
    -- Add location column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'calendar_events' AND column_name = 'location') THEN
        ALTER TABLE calendar_events ADD COLUMN location TEXT;
        RAISE NOTICE 'Added column: location';
    END IF;
    
    -- Add notes column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'calendar_events' AND column_name = 'notes') THEN
        ALTER TABLE calendar_events ADD COLUMN notes TEXT;
        RAISE NOTICE 'Added column: notes';
    END IF;
    
    -- Add timezone column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'calendar_events' AND column_name = 'timezone') THEN
        ALTER TABLE calendar_events ADD COLUMN timezone TEXT DEFAULT 'America/Los_Angeles';
        RAISE NOTICE 'Added column: timezone';
    END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_job_id ON calendar_events(job_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_google_id ON calendar_events(google_event_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_customer ON calendar_events(customer_name);
CREATE INDEX IF NOT EXISTS idx_calendar_events_type ON calendar_events(event_type);
CREATE INDEX IF NOT EXISTS idx_calendar_events_status ON calendar_events(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_calendar_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_calendar_events_updated_at ON calendar_events;
CREATE TRIGGER trigger_calendar_events_updated_at
    BEFORE UPDATE ON calendar_events
    FOR EACH ROW
    EXECUTE FUNCTION update_calendar_events_updated_at();

-- Show the final table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'calendar_events'
ORDER BY ordinal_position;

-- Verify indexes were created
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'calendar_events';

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE '✅ calendar_events table setup complete!';
    RAISE NOTICE 'You can now use the Calendar and Operations features.';
END $$;

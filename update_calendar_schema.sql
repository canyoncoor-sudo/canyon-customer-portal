-- Update calendar_events table for multi-day scheduling and professional assignments
-- Run this in Supabase SQL Editor

-- Add new columns to calendar_events
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS duration_days INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS assigned_professional_id UUID REFERENCES subcontractors(id),
ADD COLUMN IF NOT EXISTS day_assignments JSONB,
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES portal_jobs(id),
ADD COLUMN IF NOT EXISTS is_multi_day BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS display_mode VARCHAR(20) DEFAULT 'normal';

-- Add assigned_color to subcontractors table
ALTER TABLE subcontractors 
ADD COLUMN IF NOT EXISTS assigned_color VARCHAR(7) DEFAULT '#567A8D';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_professional 
ON calendar_events(assigned_professional_id);

CREATE INDEX IF NOT EXISTS idx_calendar_events_project 
ON calendar_events(project_id);

CREATE INDEX IF NOT EXISTS idx_calendar_events_duration 
ON calendar_events(duration_days);

-- Add comments for documentation
COMMENT ON COLUMN calendar_events.duration_days IS 'Number of days the event spans (1 for single day, 2+ for multi-day)';
COMMENT ON COLUMN calendar_events.assigned_professional_id IS 'Primary licensed professional assigned to this event';
COMMENT ON COLUMN calendar_events.day_assignments IS 'JSON array of {date, professional_id, professional_name} for each day of multi-day events';
COMMENT ON COLUMN calendar_events.project_id IS 'Reference to portal_jobs table for project-based filtering';
COMMENT ON COLUMN calendar_events.is_multi_day IS 'Flag to quickly identify multi-day events';
COMMENT ON COLUMN calendar_events.display_mode IS 'Display mode: normal, compact, extended';

COMMENT ON COLUMN subcontractors.assigned_color IS 'Hex color code assigned to this professional for consistent calendar display';

-- Sample update: assign default colors to existing professionals
-- You can customize these colors later in the UI
UPDATE subcontractors 
SET assigned_color = CASE 
  WHEN trade = 'Electrical' THEN '#FFA500'
  WHEN trade = 'Plumbing' THEN '#4169E1'
  WHEN trade = 'HVAC' THEN '#DC143C'
  WHEN trade = 'Framing' THEN '#8B4513'
  WHEN trade = 'Concrete' THEN '#808080'
  WHEN trade = 'Roofing' THEN '#8B0000'
  WHEN trade = 'Drywall' THEN '#F5F5DC'
  WHEN trade = 'Painting' THEN '#FFD700'
  WHEN trade = 'Flooring' THEN '#CD853F'
  ELSE '#567A8D'
END
WHERE assigned_color IS NULL OR assigned_color = '#567A8D';

-- Sample multi-day event (for testing)
-- Uncomment to insert a test event:
/*
INSERT INTO calendar_events (
  summary,
  title,
  start_time,
  end_time,
  duration_days,
  is_multi_day,
  event_type,
  status,
  day_assignments
) VALUES (
  'Foundation Work - Smith Residence',
  'Foundation Work',
  '2025-01-15 08:00:00+00',
  '2025-01-18 17:00:00+00',
  4,
  TRUE,
  'crew',
  'active',
  '[
    {"date": "2025-01-15", "professional_id": null, "professional_name": "ABC Excavation"},
    {"date": "2025-01-16", "professional_id": null, "professional_name": "ABC Excavation"},
    {"date": "2025-01-17", "professional_id": null, "professional_name": "XYZ Concrete"},
    {"date": "2025-01-18", "professional_id": null, "professional_name": "XYZ Concrete"}
  ]'::jsonb
);
*/

SELECT 'Calendar schema updated successfully! ✅' AS status;

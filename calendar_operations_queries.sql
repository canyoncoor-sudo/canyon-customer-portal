-- =====================================================
-- CALENDAR → OPERATIONS INTEGRATION SQL
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Check what's currently in your calendar
-- =====================================================
SELECT 
  id,
  summary AS event_title,
  event_type AS type,
  start_time,
  end_time,
  customer_name,
  status
FROM calendar_events
ORDER BY start_time DESC
LIMIT 20;

-- 2. View TODAY's events (what Operations dashboard shows)
-- =====================================================
SELECT 
  summary AS event_title,
  event_type AS type,
  TO_CHAR(start_time AT TIME ZONE 'America/Los_Angeles', 'HH12:MI AM') AS time,
  customer_name,
  status
FROM calendar_events
WHERE start_time >= CURRENT_DATE
  AND start_time < CURRENT_DATE + INTERVAL '1 day'
ORDER BY start_time;

-- 3. View TOMORROW's events
-- =====================================================
SELECT 
  summary AS event_title,
  event_type AS type,
  TO_CHAR(start_time AT TIME ZONE 'America/Los_Angeles', 'HH12:MI AM') AS time,
  customer_name,
  status
FROM calendar_events
WHERE start_time >= CURRENT_DATE + INTERVAL '1 day'
  AND start_time < CURRENT_DATE + INTERVAL '2 days'
ORDER BY start_time;

-- 4. DELETE any fake/demo events (if they exist)
-- =====================================================
DELETE FROM calendar_events
WHERE summary LIKE '%Smith Residence%' 
   OR summary LIKE '%Johnson Project%'
   OR customer_name IN ('John Smith', 'Jane Johnson');

-- Verify deletion
SELECT COUNT(*) AS remaining_events FROM calendar_events;

-- 5. INSERT a test event for TODAY to verify Operations dashboard
-- =====================================================
INSERT INTO calendar_events (
  id,
  summary,
  event_type,
  start_time,
  end_time,
  customer_name,
  status,
  description
) VALUES (
  gen_random_uuid(),
  'Test Site Visit - Your Name',
  'site_visit',
  CURRENT_TIMESTAMP + INTERVAL '2 hours',
  CURRENT_TIMESTAMP + INTERVAL '3 hours',
  'Test Customer',
  'scheduled',
  'Testing calendar → operations integration'
);

-- 6. Verify the test event appears in today's schedule
-- =====================================================
SELECT 
  summary,
  TO_CHAR(start_time AT TIME ZONE 'America/Los_Angeles', 'HH12:MI AM') AS time,
  customer_name
FROM calendar_events
WHERE start_time >= CURRENT_DATE
  AND start_time < CURRENT_DATE + INTERVAL '1 day'
ORDER BY start_time;

-- 7. Check if calendar_events table has the correct structure
-- =====================================================
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'calendar_events'
ORDER BY ordinal_position;

-- 8. Clean up test event when done
-- =====================================================
DELETE FROM calendar_events
WHERE summary = 'Test Site Visit - Your Name';

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

-- If Operations dashboard is empty, check:
-- 1. Are there events for today?
SELECT COUNT(*) AS today_events
FROM calendar_events
WHERE start_time >= CURRENT_DATE
  AND start_time < CURRENT_DATE + INTERVAL '1 day';

-- 2. Are there any events at all?
SELECT COUNT(*) AS total_events FROM calendar_events;

-- 3. Check the date range of existing events
SELECT 
  MIN(start_time) AS earliest_event,
  MAX(start_time) AS latest_event,
  COUNT(*) AS total_events
FROM calendar_events;

-- =====================================================
-- EXAMPLE: Add a real crew scheduling event
-- =====================================================
INSERT INTO calendar_events (
  id,
  summary,
  event_type,
  start_time,
  end_time,
  customer_name,
  job_id,
  status,
  attendees,
  description
) VALUES (
  gen_random_uuid(),
  'Deck Construction - Anderson Property',
  'crew',
  CURRENT_DATE + TIME '08:00:00',
  CURRENT_DATE + TIME '16:00:00',
  'Mike Anderson',
  NULL, -- Replace with actual job_id if linking to a job
  'confirmed',
  'Crew A - John, Mike, Sarah',
  'Install deck framing and boards'
);

-- =====================================================
-- QUERY: Link calendar events to job intakes
-- =====================================================
SELECT 
  ce.summary AS event_title,
  ce.start_time,
  ce.customer_name,
  ji.project_type,
  ji.status AS job_status
FROM calendar_events ce
LEFT JOIN job_intakes ji ON ce.job_id = ji.id
WHERE ce.start_time >= CURRENT_DATE
ORDER BY ce.start_time;

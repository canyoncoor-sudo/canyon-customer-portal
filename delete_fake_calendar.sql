-- First, let's check what's in the calendar_events table
SELECT id, summary, title, event_type, start_time, customer_name 
FROM calendar_events 
ORDER BY start_time;

-- If there are any fake events, delete them with:
-- DELETE FROM calendar_events WHERE id IN ('list', 'of', 'fake', 'ids');

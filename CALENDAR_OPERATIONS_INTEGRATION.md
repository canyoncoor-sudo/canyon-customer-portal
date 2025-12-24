# Calendar ↔ Operations Integration

## ✅ FIXED: No More Fake Data

All fake calendar events have been removed. The system now pulls ONLY from your Google Calendar via the `calendar_events` table.

---

## How It Works Now

### 1. **Calendar Page** (`/admin/calendar`)
- Displays events from `calendar_events` table
- This table syncs with your Google Calendar
- No more fake "Site Visit - Smith Residence" or "Crew - Johnson Project"
- If you don't see events, it's because none exist in your Google Calendar yet

### 2. **Operations Dashboard** (`/admin/dashboard`)
- Shows TODAY's and TOMORROW's schedule from `calendar_events`
- Same data source as Calendar page
- Filters by date automatically
- Real-time view of what you need to do

### 3. **Data Flow**

```
Google Calendar 
    ↓ (syncs via OAuth)
calendar_events table in Supabase
    ↓ (API calls)
Calendar Page + Operations Dashboard
```

---

## Why They Communicate

When you add an event in Google Calendar (or through the portal):

1. **Event saved to `calendar_events` table**
   - `start_time`, `end_time`, `summary`, `event_type`
   - `customer_name`, `job_id`, `status`

2. **Calendar page fetches ALL events**
   - Shows monthly view
   - All your appointments, crew schedules, site visits

3. **Operations dashboard fetches TODAY + TOMORROW**
   - Filters `start_time >= today AND start_time < tomorrow`
   - Shows only actionable items for the current day
   - Automatically updates each day

---

## Database Structure

### `calendar_events` Table
```sql
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY,
  google_event_id TEXT,           -- From Google Calendar sync
  summary TEXT,                    -- Event title
  description TEXT,                -- Notes
  start_time TIMESTAMPTZ,          -- When it starts
  end_time TIMESTAMPTZ,            -- When it ends
  event_type TEXT,                 -- 'meeting', 'crew', 'site_visit', etc.
  customer_name TEXT,              -- Who it's for
  job_id UUID,                     -- Links to job_intakes
  status TEXT,                     -- 'scheduled', 'confirmed', 'completed'
  attendees TEXT,                  -- Assigned crew/person
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## SQL to Check Your Calendar Events

Run this in Supabase SQL Editor to see what's actually in your calendar:

```sql
-- View all calendar events
SELECT 
  id,
  summary AS title,
  event_type AS type,
  start_time,
  customer_name,
  status
FROM calendar_events
ORDER BY start_time DESC
LIMIT 20;

-- View today's events (what Operations shows)
SELECT 
  summary,
  event_type,
  TO_CHAR(start_time, 'HH12:MI AM') AS time,
  customer_name
FROM calendar_events
WHERE start_time >= CURRENT_DATE
  AND start_time < CURRENT_DATE + INTERVAL '1 day'
ORDER BY start_time;

-- Delete fake events (if any exist)
DELETE FROM calendar_events
WHERE summary LIKE '%Smith Residence%' 
   OR summary LIKE '%Johnson Project%';
```

---

## Adding Real Events

### Option 1: Through Google Calendar (Recommended)
1. Add events to your linked Google Calendar
2. They sync automatically to `calendar_events`
3. Appear in both Calendar and Operations

### Option 2: Through Portal Calendar Page
1. Go to `/admin/calendar`
2. Click a date
3. Fill out event form
4. Saves to `calendar_events` table
5. Appears in Operations if it's today/tomorrow

### Option 3: When Creating a Job
1. When you create a job with a meeting date
2. System can auto-create calendar event
3. Links `job_id` to the calendar event

---

## Why You Don't See Events Now

If your calendar is empty, it's because:

1. ✅ **No fake data** (this is correct!)
2. ✅ **Waiting for Google Calendar sync** (need to connect first)
3. ✅ **No events created yet** (add some through Calendar page)

---

## Next Steps

1. **Connect Google Calendar** (see `GOOGLE_CALENDAR_SETUP.md`)
2. **Add your first real event** through Calendar page
3. **Check Operations dashboard** to see today's schedule
4. **All data flows automatically** between Calendar ↔ Operations

---

## Testing

```sql
-- Insert a test event for TODAY
INSERT INTO calendar_events (
  id,
  summary,
  event_type,
  start_time,
  end_time,
  customer_name,
  status
) VALUES (
  gen_random_uuid(),
  'Test Site Visit',
  'site_visit',
  CURRENT_TIMESTAMP + INTERVAL '2 hours',
  CURRENT_TIMESTAMP + INTERVAL '3 hours',
  'Test Customer',
  'scheduled'
);

-- Check Operations dashboard - you should see it!
```

---

## No More Fake Data ✅

- ❌ "Site Visit - Smith Residence" - REMOVED
- ❌ "Crew - Johnson Project" - REMOVED  
- ❌ All hardcoded events - REMOVED
- ✅ Only real data from `calendar_events` table
- ✅ Empty calendar until you add events

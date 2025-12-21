# Testing Action Notifications

## Overview
The admin dashboard now shows action notifications in the "Actions" column to alert you when customers take actions that need your attention.

## What's Changed

### 1. Clickable Rows
- Click anywhere on a customer row to view their project details
- No more need to click the "Preview" button
- Rows highlight on hover with a subtle animation
- Left border appears in Canyon rust color on hover

### 2. Actions Column
- Shows notification count badge when there are pending actions
- Badge displays total number of items requiring attention
- Hover over badge to see breakdown of actions
- Shows "—" when no actions needed

### 3. Action Types Tracked

**Proposal Accepted**: Customer has signed and accepted the proposal
- Badge: Shows as part of total count
- Detail: "✓ Proposal Accepted"

**New Messages**: Customer has sent messages you haven't read
- Badge: Adds message count to total
- Detail: "X New Message(s)"

**New Photos**: Customer has uploaded photos you haven't reviewed
- Badge: Adds photo count to total
- Detail: "X New Photo(s)"

## Database Setup

Run this SQL in Supabase SQL Editor:

```sql
-- Add action tracking columns
ALTER TABLE portal_jobs 
ADD COLUMN IF NOT EXISTS proposal_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS proposal_accepted_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS customer_message_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS unread_message_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS customer_photo_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS new_customer_photos INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_customer_activity TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_portal_jobs_actions ON portal_jobs(proposal_accepted, unread_message_count, new_customer_photos);
```

Or use the file: `add-action-tracking.sql`

## Testing

### Test 1: Simulate Proposal Acceptance
```javascript
// Run in Supabase SQL Editor or via API
UPDATE portal_jobs 
SET 
  proposal_accepted = true,
  proposal_accepted_at = NOW(),
  last_customer_activity = NOW()
WHERE job_address = 'salem';
```

Result: Actions column shows badge with "1", hover shows "✓ Proposal Accepted"

### Test 2: Simulate New Messages
```javascript
UPDATE portal_jobs 
SET 
  customer_message_count = 3,
  unread_message_count = 2,
  last_customer_activity = NOW()
WHERE job_address = 'salem';
```

Result: Badge shows "2", hover shows "2 New Messages"

### Test 3: Simulate New Photos
```javascript
UPDATE portal_jobs 
SET 
  customer_photo_count = 10,
  new_customer_photos = 5,
  last_customer_activity = NOW()
WHERE job_address = 'salem';
```

Result: Badge shows "5", hover shows "5 New Photos"

### Test 4: Multiple Actions
```javascript
UPDATE portal_jobs 
SET 
  proposal_accepted = true,
  proposal_accepted_at = NOW(),
  unread_message_count = 3,
  new_customer_photos = 2,
  last_customer_activity = NOW()
WHERE job_address = 'salem';
```

Result: Badge shows "6" (1 proposal + 3 messages + 2 photos), hover shows all three items

## How It Works

1. **Badge Count**: Sum of all pending actions
   - 1 if proposal accepted
   - + number of unread messages
   - + number of new photos

2. **Hover Tooltip**: Shows detailed breakdown
   - Lists each type of action
   - Shows specific counts

3. **Row Click**: Opens job details in same page
   - Actions column stops click propagation
   - Allows hovering badge without triggering row click

## Future Enhancements

When you build customer messaging and photo upload features:

1. When customer sends message:
   ```javascript
   customer_message_count += 1
   unread_message_count += 1
   last_customer_activity = NOW()
   ```

2. When admin reads messages:
   ```javascript
   unread_message_count = 0
   ```

3. When customer uploads photo:
   ```javascript
   customer_photo_count += 1
   new_customer_photos += 1
   last_customer_activity = NOW()
   ```

4. When admin views photos:
   ```javascript
   new_customer_photos = 0
   ```

5. When customer accepts proposal:
   ```javascript
   proposal_accepted = true
   proposal_accepted_at = NOW()
   last_customer_activity = NOW()
   ```

## Visual Design

- **Badge Color**: Canyon rust (#712A18)
- **Badge Animation**: Subtle pulse effect
- **Hover Effect**: Scales slightly larger
- **Tooltip**: White card with shadow, appears below badge
- **Row Hover**: Light background, rust left border, subtle lift
- **Cursor**: Pointer on rows, indicating clickability

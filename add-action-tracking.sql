-- Add columns to track customer actions that need admin attention

ALTER TABLE portal_jobs 
ADD COLUMN IF NOT EXISTS proposal_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS proposal_accepted_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS customer_message_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS unread_message_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS customer_photo_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS new_customer_photos INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_customer_activity TIMESTAMP;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_portal_jobs_actions ON portal_jobs(proposal_accepted, unread_message_count, new_customer_photos);

-- Comment the columns
COMMENT ON COLUMN portal_jobs.proposal_accepted IS 'Whether customer has accepted the proposal';
COMMENT ON COLUMN portal_jobs.proposal_accepted_at IS 'When customer accepted the proposal';
COMMENT ON COLUMN portal_jobs.customer_message_count IS 'Total messages from customer';
COMMENT ON COLUMN portal_jobs.unread_message_count IS 'Unread messages from customer';
COMMENT ON COLUMN portal_jobs.customer_photo_count IS 'Total photos uploaded by customer';
COMMENT ON COLUMN portal_jobs.new_customer_photos IS 'New photos since last admin check';
COMMENT ON COLUMN portal_jobs.last_customer_activity IS 'Last time customer took any action';

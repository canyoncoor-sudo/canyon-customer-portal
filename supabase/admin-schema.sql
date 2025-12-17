-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add expiration tracking to portal_jobs
ALTER TABLE portal_jobs
ADD COLUMN IF NOT EXISTS access_code_type TEXT DEFAULT 'active', -- 'proposal' or 'active'
ADD COLUMN IF NOT EXISTS access_code_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS proposal_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS project_closed_at TIMESTAMPTZ;

-- Notification Logs Table
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES portal_jobs(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL, -- 'email', 'sms'
  recipient TEXT NOT NULL, -- email or phone
  subject TEXT,
  message TEXT,
  status TEXT DEFAULT 'sent', -- 'sent', 'failed', 'pending'
  sent_at TIMESTAMPTZ DEFAULT now(),
  error_message TEXT
);

-- Admin Activity Log
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id),
  job_id UUID REFERENCES portal_jobs(id),
  action TEXT NOT NULL, -- 'created_project', 'uploaded_photo', 'sent_notification', etc.
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security Policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Admin users can access their own data
CREATE POLICY "Admin users can read their own data" ON admin_users
  FOR SELECT USING (true);

-- Notification logs are readable by admins (service role)
CREATE POLICY "Service role can manage notification logs" ON notification_logs
  FOR ALL USING (true);

-- Admin activity logs are readable by service role
CREATE POLICY "Service role can manage activity logs" ON admin_activity_log
  FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_portal_jobs_access_expires ON portal_jobs(access_code_expires_at);
CREATE INDEX IF NOT EXISTS idx_portal_jobs_is_active ON portal_jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_notification_logs_job_id ON notification_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_job_id ON admin_activity_log(job_id);

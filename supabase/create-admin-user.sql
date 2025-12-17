-- First, run the admin schema
-- Then add your admin user (replace with your actual email and desired password)

-- Create admin user
-- Password will be 'admin123' (change this after first login!)
INSERT INTO admin_users (email, password_hash, full_name)
VALUES (
  'admin@canyonconstructioninc.com',
  '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUJ13jmi16', -- 'admin123'
  'Canyon Admin'
)
ON CONFLICT (email) DO NOTHING;

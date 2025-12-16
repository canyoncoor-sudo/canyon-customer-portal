-- Test Data for Canyon Customer Portal
-- Copy and paste this into Supabase SQL Editor

-- 1. Create a test job
INSERT INTO public.jobs (job_name, address_line1, city, state, zip, customer_name, customer_email, customer_phone, status)
VALUES ('Kitchen Remodel - Smith Residence', '123 Main St', 'Salem', 'OR', '97301', 'John Smith', 'john.smith@example.com', '503-555-0100', 'Active')
RETURNING id;

-- 2. COPY THE ID FROM ABOVE, then replace YOUR_JOB_ID_HERE below with it

-- Add access code (hash for: CANYON-1024)
INSERT INTO public.job_access (job_id, access_code_hash, is_active)
VALUES ('YOUR_JOB_ID_HERE', '$2b$10$Ko9dXHf07DnMsWfa4skX4uD0me1Qs6LFUeK8Mvb/L1GWWE3G8q4k2', true);

-- Add bid
INSERT INTO public.job_bid (job_id, title, body, amount)
VALUES ('YOUR_JOB_ID_HERE', 'Kitchen Remodel Estimate', 
'Complete kitchen renovation including:

• Custom cabinet installation
• Quartz countertops (upgrade)
• New stainless steel appliances
• Electrical updates (lighting & outlets)
• Plumbing updates (new fixtures)
• Flooring installation
• Paint and finishing', 45000.00);

-- Add some notes
INSERT INTO public.job_notes (job_id, note, created_by)
VALUES 
  ('YOUR_JOB_ID_HERE', 'Site inspection completed. Ready to begin demolition phase.', 'Canyon Construction'),
  ('YOUR_JOB_ID_HERE', 'Materials ordered. Expected delivery December 20th.', 'Canyon Construction'),
  ('YOUR_JOB_ID_HERE', 'Permits submitted to city. Awaiting approval.', 'Canyon Construction');

-- Add subcontractors
INSERT INTO public.job_subcontractors (job_id, trade, company_name, contact_name, contact_phone, scheduled_window, status)
VALUES 
  ('YOUR_JOB_ID_HERE', 'Electrical', 'Bright Electric LLC', 'Mike Torres', '503-555-0201', 'Week of Dec 18', 'Scheduled'),
  ('YOUR_JOB_ID_HERE', 'Plumbing', 'Flow Right Plumbing', 'Lisa Chen', '503-555-0202', 'Week of Dec 20', 'Scheduled'),
  ('YOUR_JOB_ID_HERE', 'Countertops', 'Stone & Granite Co', 'David Lee', '503-555-0203', 'Week of Dec 27', 'Scheduled');

-- Add permits
INSERT INTO public.job_permits (job_id, permit_type, permit_number, status, filed_date)
VALUES 
  ('YOUR_JOB_ID_HERE', 'Building Permit', 'BP-2025-001234', 'Approved', '2025-12-01'),
  ('YOUR_JOB_ID_HERE', 'Electrical Permit', 'EP-2025-005678', 'Submitted', '2025-12-05'),
  ('YOUR_JOB_ID_HERE', 'Plumbing Permit', 'PP-2025-003456', 'Approved', '2025-12-03');

-- Add a change order
INSERT INTO public.job_change_orders (job_id, title, description, amount, status)
VALUES ('YOUR_JOB_ID_HERE', 'Upgrade to Quartz Countertops', 'Customer requested upgrade from granite to premium quartz countertops', 3500.00, 'Approved');

-- Success! Now you can test with:
-- Address: 123 Main St
-- Code: CANYON-1024

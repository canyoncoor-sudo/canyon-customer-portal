-- Test Data for Canyon Construction Portal
-- Run this AFTER the timeline table is created

-- Photo Galleries
INSERT INTO public.photo_galleries (job_id, gallery_name, description, sort_order) VALUES
((SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1), 'Kitchen Remodel', 'Kitchen renovation progress photos', 1),
((SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1), 'Roof Replacement', 'New roof installation', 2),
((SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1), 'Paver Patio', 'Backyard patio construction', 3);

-- Photos
INSERT INTO public.photos (gallery_id, job_id, file_url, caption, sort_order) VALUES
((SELECT id FROM photo_galleries WHERE gallery_name = 'Kitchen Remodel' LIMIT 1),
 (SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1),
 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800',
 'Before - Original kitchen', 1),
((SELECT id FROM photo_galleries WHERE gallery_name = 'Kitchen Remodel' LIMIT 1),
 (SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1),
 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800',
 'Demolition phase', 2),
((SELECT id FROM photo_galleries WHERE gallery_name = 'Roof Replacement' LIMIT 1),
 (SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1),
 'https://images.unsplash.com/photo-1558976825-6b1b03a03719?w=800',
 'Old roof condition', 1);

-- Subcontractors
INSERT INTO public.subcontractors (job_id, company_name, ccb_number, contact_name, phone, email, trade, status) VALUES
((SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1), 'Premier Plumbing LLC', 'CCB #198765', 'Mike Johnson', '503-555-0101', 'mike@premierplumbing.com', 'Plumbing', 'Active'),
((SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1), 'Bright Electric Co', 'CCB #176543', 'Sarah Chen', '503-555-0202', 'sarah@brightelectric.com', 'Electrical', 'Active'),
((SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1), 'TopShield Roofing', 'CCB #145678', 'Tom Davidson', '503-555-0303', 'tom@topshield.com', 'Roofing', 'Completed');

-- Bids
INSERT INTO public.bids (job_id, bid_name, description, amount, status, notes) VALUES
((SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1),
 'Kitchen Remodel - Full Package',
 'Complete kitchen renovation including cabinets, countertops, appliances',
 45000.00, 'Accepted', 'Includes all materials and labor'),
((SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1),
 'Roof Replacement',
 'Remove old roof, install new architectural shingles',
 12500.00, 'Pending', '30-year warranty on materials');

-- Payments
INSERT INTO public.payments (job_id, payment_type, amount, status, due_date, notes) VALUES
((SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1), 'Down Payment', 15000.00, 'Paid', '2024-12-01', 'Initial deposit'),
((SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1), 'Milestone Payment', 15000.00, 'Pending', '2025-01-05', 'After cabinet installation'),
((SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1), 'Final Payment', 15000.00, 'Pending', '2025-01-20', 'Upon completion');

-- Documents  
INSERT INTO public.documents (job_id, document_type, document_name, file_url, description) VALUES
((SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1), 'Contract', 'Kitchen Remodel Contract', 'https://example.com/contract.pdf', 'Signed contract'),
((SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1), 'Permit', 'Building Permit #2024-12345', 'https://example.com/permit.pdf', 'City building permit'),
((SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1), 'Invoice', 'Invoice #001', 'https://example.com/invoice001.pdf', 'Down payment invoice');

-- Timeline Events
INSERT INTO public.timeline_events (job_id, event_date, title, description, event_type, is_completed) VALUES
((SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1), '2024-12-01', 'Project Kickoff', 'Initial meeting and contract signing', 'Meeting', true),
((SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1), '2024-12-05', 'Demolition Complete', 'Kitchen demolition finished', 'Milestone', true),
((SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1), '2025-01-05', 'Countertop Installation', 'Quartz countertops to be installed', 'Milestone', false),
((SELECT id FROM portal_jobs WHERE job_address = 'salem' LIMIT 1), '2025-01-15', 'Final Inspection', 'Final city inspection scheduled', 'Inspection', false);

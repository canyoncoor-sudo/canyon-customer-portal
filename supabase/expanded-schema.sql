-- Canyon Construction Inc. Customer Portal - EXPANDED SCHEMA
-- Run this in your Supabase SQL Editor after the basic portal_jobs table

-- ============================================
-- PHOTO GALLERIES (e.g., "Kitchen", "Roof", "Pavers")
-- ============================================
CREATE TABLE IF NOT EXISTS public.photo_galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.portal_jobs(id) ON DELETE CASCADE,
  gallery_name TEXT NOT NULL, -- e.g., "Kitchen Remodel", "Roof Replacement"
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PHOTOS (individual images within galleries)
-- ============================================
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID NOT NULL REFERENCES public.photo_galleries(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.portal_jobs(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL, -- Supabase Storage URL
  caption TEXT,
  uploaded_by TEXT, -- "contractor" or "admin"
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- SUBCONTRACTORS
-- ============================================
CREATE TABLE IF NOT EXISTS public.subcontractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.portal_jobs(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  ccb_number TEXT, -- Contractor license number
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  trade TEXT, -- e.g., "Plumbing", "Electrical", "Roofing"
  status TEXT DEFAULT 'Active', -- "Active", "Completed", "Pending"
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- SUBCONTRACTOR PHOTOS (photos taken by specific subs)
-- ============================================
CREATE TABLE IF NOT EXISTS public.subcontractor_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcontractor_id UUID NOT NULL REFERENCES public.subcontractors(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.portal_jobs(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- BIDS / QUOTES
-- ============================================
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.portal_jobs(id) ON DELETE CASCADE,
  bid_name TEXT NOT NULL, -- e.g., "Kitchen Remodel Quote", "Roof Replacement"
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'Pending', -- "Pending", "Accepted", "Rejected", "Paid"
  file_url TEXT, -- PDF of the quote
  accepted_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.portal_jobs(id) ON DELETE CASCADE,
  bid_id UUID REFERENCES public.bids(id) ON DELETE SET NULL, -- Optional: link to specific bid
  payment_type TEXT NOT NULL, -- "Down Payment", "Milestone", "Final Payment"
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'Pending', -- "Pending", "Paid", "Overdue"
  due_date DATE,
  paid_at TIMESTAMPTZ,
  payment_method TEXT, -- "Credit Card", "Check", "ACH", etc.
  transaction_id TEXT, -- From payment processor
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- DOCUMENTS (contracts, permits, invoices)
-- ============================================
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.portal_jobs(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- "Contract", "Permit", "Invoice", "Other"
  document_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  description TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- EXPAND portal_jobs TABLE (if needed)
-- Add columns for home photo, contact info
-- ============================================
ALTER TABLE public.portal_jobs 
  ADD COLUMN IF NOT EXISTS home_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS project_description TEXT,
  ADD COLUMN IF NOT EXISTS start_date DATE,
  ADD COLUMN IF NOT EXISTS estimated_completion DATE;

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_photo_galleries_job ON photo_galleries(job_id);
CREATE INDEX IF NOT EXISTS idx_photos_gallery ON photos(gallery_id);
CREATE INDEX IF NOT EXISTS idx_photos_job ON photos(job_id);
CREATE INDEX IF NOT EXISTS idx_subcontractors_job ON subcontractors(job_id);
CREATE INDEX IF NOT EXISTS idx_subcontractor_photos_sub ON subcontractor_photos(subcontractor_id);
CREATE INDEX IF NOT EXISTS idx_bids_job ON bids(job_id);
CREATE INDEX IF NOT EXISTS idx_payments_job ON payments(job_id);
CREATE INDEX IF NOT EXISTS idx_documents_job ON documents(job_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Customers can only see their own job data via JWT
-- ============================================

-- Enable RLS on all tables
ALTER TABLE photo_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcontractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcontractor_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policies: customers can only see data for their job_id (from JWT)
CREATE POLICY "Customers see own photo galleries" ON photo_galleries
  FOR SELECT USING ((auth.jwt() ->> 'job_id')::uuid = job_id);

CREATE POLICY "Customers see own photos" ON photos
  FOR SELECT USING ((auth.jwt() ->> 'job_id')::uuid = job_id);

CREATE POLICY "Customers see own subcontractors" ON subcontractors
  FOR SELECT USING ((auth.jwt() ->> 'job_id')::uuid = job_id);

CREATE POLICY "Customers see own subcontractor photos" ON subcontractor_photos
  FOR SELECT USING ((auth.jwt() ->> 'job_id')::uuid = job_id);

CREATE POLICY "Customers see own bids" ON bids
  FOR SELECT USING ((auth.jwt() ->> 'job_id')::uuid = job_id);

CREATE POLICY "Customers see own payments" ON payments
  FOR SELECT USING ((auth.jwt() ->> 'job_id')::uuid = job_id);

CREATE POLICY "Customers see own documents" ON documents
  FOR SELECT USING ((auth.jwt() ->> 'job_id')::uuid = job_id);

-- Admin policies (using service_role key can bypass RLS)
-- You'll use service_role key when adding data as admin
-
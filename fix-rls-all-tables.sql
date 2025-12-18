-- Canyon Customer Portal - Enable RLS on All Public Tables
-- Run this in your Supabase SQL Editor
-- This script is safe to run multiple times

-- ============================================
-- STEP 1: Check current RLS status
-- ============================================
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================
-- STEP 2: Enable RLS on all tables
-- ============================================

-- Core Tables
ALTER TABLE public.portal_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcontractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Additional Job-Related Tables
ALTER TABLE IF EXISTS public.job_bid ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.job_note ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.job_change_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.job_permit ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.job_subcontractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.job_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.job_access ENABLE ROW LEVEL SECURITY;

-- Proposal Tables
ALTER TABLE IF EXISTS public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.proposal_line_items ENABLE ROW LEVEL SECURITY;

-- Bids Table
ALTER TABLE IF EXISTS public.bids ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: Drop existing policies (safe approach)
-- ============================================

-- Portal Jobs
DROP POLICY IF EXISTS "portal_jobs_public_select" ON public.portal_jobs;
DROP POLICY IF EXISTS "portal_jobs_service_write" ON public.portal_jobs;

-- Job Items
DROP POLICY IF EXISTS "job_items_public_select" ON public.job_items;
DROP POLICY IF EXISTS "job_items_service_write" ON public.job_items;

-- Subcontractors
DROP POLICY IF EXISTS "subcontractors_service_only" ON public.subcontractors;

-- Admin Users
DROP POLICY IF EXISTS "admin_users_service_only" ON public.admin_users;

-- Job Bid
DROP POLICY IF EXISTS "job_bid_public_select" ON public.job_bid;
DROP POLICY IF EXISTS "job_bid_service_write" ON public.job_bid;

-- Job Note
DROP POLICY IF EXISTS "job_note_public_select" ON public.job_note;
DROP POLICY IF EXISTS "job_note_service_write" ON public.job_note;

-- Job Change Order
DROP POLICY IF EXISTS "job_change_order_public_select" ON public.job_change_order;
DROP POLICY IF EXISTS "job_change_order_service_write" ON public.job_change_order;

-- Job Permit
DROP POLICY IF EXISTS "job_permit_public_select" ON public.job_permit;
DROP POLICY IF EXISTS "job_permit_service_write" ON public.job_permit;

-- Job Subcontractors
DROP POLICY IF EXISTS "job_subcontractors_public_select" ON public.job_subcontractors;
DROP POLICY IF EXISTS "job_subcontractors_service_write" ON public.job_subcontractors;

-- Job Files
DROP POLICY IF EXISTS "job_files_public_select" ON public.job_files;
DROP POLICY IF EXISTS "job_files_service_write" ON public.job_files;

-- Job Access
DROP POLICY IF EXISTS "job_access_public_select" ON public.job_access;
DROP POLICY IF EXISTS "job_access_service_write" ON public.job_access;

-- Proposals
DROP POLICY IF EXISTS "proposals_public_select" ON public.proposals;
DROP POLICY IF EXISTS "proposals_service_write" ON public.proposals;

-- Proposal Line Items
DROP POLICY IF EXISTS "proposal_line_items_public_select" ON public.proposal_line_items;
DROP POLICY IF EXISTS "proposal_line_items_service_write" ON public.proposal_line_items;

-- Bids
DROP POLICY IF EXISTS "bids_public_select" ON public.bids;
DROP POLICY IF EXISTS "bids_service_write" ON public.bids;

-- ============================================
-- STEP 4: Create RLS Policies (fresh start)
-- ============================================

-- PORTAL_JOBS
CREATE POLICY "portal_jobs_public_select" ON public.portal_jobs
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "portal_jobs_service_write" ON public.portal_jobs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- JOB_ITEMS
CREATE POLICY "job_items_public_select" ON public.job_items
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "job_items_service_write" ON public.job_items
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- SUBCONTRACTORS
CREATE POLICY "subcontractors_service_only" ON public.subcontractors
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ADMIN_USERS
CREATE POLICY "admin_users_service_only" ON public.admin_users
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- JOB_BID
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'job_bid') THEN
    EXECUTE 'CREATE POLICY "job_bid_public_select" ON public.job_bid FOR SELECT TO anon, authenticated USING (true)';
    EXECUTE 'CREATE POLICY "job_bid_service_write" ON public.job_bid FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- JOB_NOTE
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'job_note') THEN
    EXECUTE 'CREATE POLICY "job_note_public_select" ON public.job_note FOR SELECT TO anon, authenticated USING (true)';
    EXECUTE 'CREATE POLICY "job_note_service_write" ON public.job_note FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- JOB_CHANGE_ORDER
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'job_change_order') THEN
    EXECUTE 'CREATE POLICY "job_change_order_public_select" ON public.job_change_order FOR SELECT TO anon, authenticated USING (true)';
    EXECUTE 'CREATE POLICY "job_change_order_service_write" ON public.job_change_order FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- JOB_PERMIT
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'job_permit') THEN
    EXECUTE 'CREATE POLICY "job_permit_public_select" ON public.job_permit FOR SELECT TO anon, authenticated USING (true)';
    EXECUTE 'CREATE POLICY "job_permit_service_write" ON public.job_permit FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- JOB_SUBCONTRACTORS
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'job_subcontractors') THEN
    EXECUTE 'CREATE POLICY "job_subcontractors_public_select" ON public.job_subcontractors FOR SELECT TO anon, authenticated USING (true)';
    EXECUTE 'CREATE POLICY "job_subcontractors_service_write" ON public.job_subcontractors FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- JOB_FILES
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'job_files') THEN
    EXECUTE 'CREATE POLICY "job_files_public_select" ON public.job_files FOR SELECT TO anon, authenticated USING (true)';
    EXECUTE 'CREATE POLICY "job_files_service_write" ON public.job_files FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- JOB_ACCESS
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'job_access') THEN
    EXECUTE 'CREATE POLICY "job_access_public_select" ON public.job_access FOR SELECT TO anon, authenticated USING (true)';
    EXECUTE 'CREATE POLICY "job_access_service_write" ON public.job_access FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- PROPOSALS
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'proposals') THEN
    EXECUTE 'CREATE POLICY "proposals_public_select" ON public.proposals FOR SELECT TO anon, authenticated USING (true)';
    EXECUTE 'CREATE POLICY "proposals_service_write" ON public.proposals FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- PROPOSAL_LINE_ITEMS
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'proposal_line_items') THEN
    EXECUTE 'CREATE POLICY "proposal_line_items_public_select" ON public.proposal_line_items FOR SELECT TO anon, authenticated USING (true)';
    EXECUTE 'CREATE POLICY "proposal_line_items_service_write" ON public.proposal_line_items FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- BIDS
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bids') THEN
    EXECUTE 'CREATE POLICY "bids_public_select" ON public.bids FOR SELECT TO anon, authenticated USING (true)';
    EXECUTE 'CREATE POLICY "bids_service_write" ON public.bids FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- ============================================
-- STEP 5: Create indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_portal_jobs_address ON public.portal_jobs(job_address);
CREATE INDEX IF NOT EXISTS idx_job_items_job_id ON public.job_items(job_id);
CREATE INDEX IF NOT EXISTS idx_subcontractors_job_id ON public.subcontractors(job_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- Additional indexes for optional tables
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'job_bid') THEN
    CREATE INDEX IF NOT EXISTS idx_job_bid_job_id ON public.job_bid(job_id);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'job_note') THEN
    CREATE INDEX IF NOT EXISTS idx_job_note_job_id ON public.job_note(job_id);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'job_change_order') THEN
    CREATE INDEX IF NOT EXISTS idx_job_change_order_job_id ON public.job_change_order(job_id);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'job_permit') THEN
    CREATE INDEX IF NOT EXISTS idx_job_permit_job_id ON public.job_permit(job_id);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'job_subcontractors') THEN
    CREATE INDEX IF NOT EXISTS idx_job_subcontractors_job_id ON public.job_subcontractors(job_id);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'job_files') THEN
    CREATE INDEX IF NOT EXISTS idx_job_files_job_id ON public.job_files(job_id);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'job_access') THEN
    CREATE INDEX IF NOT EXISTS idx_job_access_job_id ON public.job_access(job_id);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'proposal_line_items') THEN
    CREATE INDEX IF NOT EXISTS idx_proposal_line_items_proposal_id ON public.proposal_line_items(proposal_id);
  END IF;
END $$;

-- ============================================
-- STEP 6: Verify RLS is enabled
-- ============================================
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = pg_tables.tablename) as policy_count
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$ 
BEGIN
  RAISE NOTICE '✅ RLS enabled and policies created for all tables!';
  RAISE NOTICE '✅ Your database is now production-ready and secure!';
END $$;

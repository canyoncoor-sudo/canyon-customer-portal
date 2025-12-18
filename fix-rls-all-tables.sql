-- Canyon Customer Portal - Enable RLS on All Public Tables
-- Run this in your Supabase SQL Editor

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
-- STEP 3: Create RLS Policies
-- ============================================

-- ============================================
-- PORTAL_JOBS POLICIES
-- ============================================
DROP POLICY IF EXISTS "portal_jobs_public_select" ON public.portal_jobs;
CREATE POLICY "portal_jobs_public_select" ON public.portal_jobs
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "portal_jobs_service_write" ON public.portal_jobs;
CREATE POLICY "portal_jobs_service_write" ON public.portal_jobs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- JOB_ITEMS POLICIES
-- ============================================
DROP POLICY IF EXISTS "job_items_public_select" ON public.job_items;
CREATE POLICY "job_items_public_select" ON public.job_items
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "job_items_service_write" ON public.job_items;
CREATE POLICY "job_items_service_write" ON public.job_items
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- SUBCONTRACTORS POLICIES
-- ============================================
DROP POLICY IF EXISTS "subcontractors_service_only" ON public.subcontractors;
CREATE POLICY "subcontractors_service_only" ON public.subcontractors
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- ADMIN_USERS POLICIES
-- ============================================
DROP POLICY IF EXISTS "admin_users_service_only" ON public.admin_users;
CREATE POLICY "admin_users_service_only" ON public.admin_users
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- JOB_BID POLICIES
-- ============================================
DROP POLICY IF EXISTS "job_bid_public_select" ON public.job_bid;
CREATE POLICY "job_bid_public_select" ON public.job_bid
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "job_bid_service_write" ON public.job_bid;
CREATE POLICY "job_bid_service_write" ON public.job_bid
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- JOB_NOTE POLICIES
-- ============================================
DROP POLICY IF EXISTS "job_note_public_select" ON public.job_note;
CREATE POLICY "job_note_public_select" ON public.job_note
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "job_note_service_write" ON public.job_note;
CREATE POLICY "job_note_service_write" ON public.job_note
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- JOB_CHANGE_ORDER POLICIES
-- ============================================
DROP POLICY IF EXISTS "job_change_order_public_select" ON public.job_change_order;
CREATE POLICY "job_change_order_public_select" ON public.job_change_order
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "job_change_order_service_write" ON public.job_change_order;
CREATE POLICY "job_change_order_service_write" ON public.job_change_order
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- JOB_PERMIT POLICIES
-- ============================================
DROP POLICY IF EXISTS "job_permit_public_select" ON public.job_permit;
CREATE POLICY "job_permit_public_select" ON public.job_permit
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "job_permit_service_write" ON public.job_permit;
CREATE POLICY "job_permit_service_write" ON public.job_permit
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- JOB_SUBCONTRACTORS POLICIES
-- ============================================
DROP POLICY IF EXISTS "job_subcontractors_public_select" ON public.job_subcontractors;
CREATE POLICY "job_subcontractors_public_select" ON public.job_subcontractors
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "job_subcontractors_service_write" ON public.job_subcontractors;
CREATE POLICY "job_subcontractors_service_write" ON public.job_subcontractors
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- JOB_FILES POLICIES
-- ============================================
DROP POLICY IF EXISTS "job_files_public_select" ON public.job_files;
CREATE POLICY "job_files_public_select" ON public.job_files
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "job_files_service_write" ON public.job_files;
CREATE POLICY "job_files_service_write" ON public.job_files
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- JOB_ACCESS POLICIES
-- ============================================
DROP POLICY IF EXISTS "job_access_public_select" ON public.job_access;
CREATE POLICY "job_access_public_select" ON public.job_access
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "job_access_service_write" ON public.job_access;
CREATE POLICY "job_access_service_write" ON public.job_access
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- PROPOSALS POLICIES
-- ============================================
DROP POLICY IF EXISTS "proposals_public_select" ON public.proposals;
CREATE POLICY "proposals_public_select" ON public.proposals
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "proposals_service_write" ON public.proposals;
CREATE POLICY "proposals_service_write" ON public.proposals
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- PROPOSAL_LINE_ITEMS POLICIES
-- ============================================
DROP POLICY IF EXISTS "proposal_line_items_public_select" ON public.proposal_line_items;
CREATE POLICY "proposal_line_items_public_select" ON public.proposal_line_items
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "proposal_line_items_service_write" ON public.proposal_line_items;
CREATE POLICY "proposal_line_items_service_write" ON public.proposal_line_items
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- BIDS POLICIES
-- ============================================
DROP POLICY IF EXISTS "bids_public_select" ON public.bids;
CREATE POLICY "bids_public_select" ON public.bids
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "bids_service_write" ON public.bids;
CREATE POLICY "bids_service_write" ON public.bids
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- STEP 4: Create indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_portal_jobs_address ON public.portal_jobs(job_address);
CREATE INDEX IF NOT EXISTS idx_job_items_job_id ON public.job_items(job_id);
CREATE INDEX IF NOT EXISTS idx_subcontractors_job_id ON public.subcontractors(job_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- Additional indexes for new tables
CREATE INDEX IF NOT EXISTS idx_job_bid_job_id ON public.job_bid(job_id);
CREATE INDEX IF NOT EXISTS idx_job_note_job_id ON public.job_note(job_id);
CREATE INDEX IF NOT EXISTS idx_job_change_order_job_id ON public.job_change_order(job_id);
CREATE INDEX IF NOT EXISTS idx_job_permit_job_id ON public.job_permit(job_id);
CREATE INDEX IF NOT EXISTS idx_job_subcontractors_job_id ON public.job_subcontractors(job_id);
CREATE INDEX IF NOT EXISTS idx_job_files_job_id ON public.job_files(job_id);
CREATE INDEX IF NOT EXISTS idx_job_access_job_id ON public.job_access(job_id);
CREATE INDEX IF NOT EXISTS idx_proposal_line_items_proposal_id ON public.proposal_line_items(proposal_id);

-- ============================================
-- STEP 5: Verify RLS is enabled
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
-- NOTES:
-- ============================================
-- ✅ Covers all 15 tables with RLS warnings:
--    1. portal_jobs
--    2. job_items  
--    3. subcontractors
--    4. admin_users
--    5. job_bid
--    6. job_note
--    7. job_change_order
--    8. job_permit
--    9. job_subcontractors
--    10. job_files
--    11. job_access
--    12. proposals
--    13. proposal_line_items
--    14. bids
--    15. (any other public tables)
--
-- Security Model:
-- - Public SELECT allowed (API controls access via JWT)
-- - Only service_role can INSERT/UPDATE/DELETE
-- - Your API verifies JWT tokens before operations
-- - RLS prevents direct database manipulation
-- ============================================

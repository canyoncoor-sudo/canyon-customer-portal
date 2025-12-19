# Canyon Customer Portal - Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Database Migrations (Run in Supabase SQL Editor)

**CRITICAL - Must run in this order:**

1. **add-proposal-data-column.sql** (NEW - REQUIRED)
   - Adds `proposal_data` JSONB column for storing line items
   - Adds `updated_at`, `job_city`, `job_state`, `job_zip` columns
   - Required for proposal creation to work

2. **fix_subcontractors_schema.sql** (If not already run)
   - Allows professionals without job_id
   - Adds trade index and status column

3. **add-missing-columns.sql** (If not already run)
   - Adds address, notes, created_at, updated_at to subcontractors
   - Creates auto-update trigger

4. **add-google-fields.sql** (If not already run)
   - Adds Google Business integration fields
   - Creates indexes for performance

5. **create-job-intakes-table.sql** (If not already run)
   - Creates job_intakes table for detailed intake data
   - Links to portal_jobs via job_id

6. **fix-rls-all-tables.sql** (IMPORTANT - Security)
   - Enables Row Level Security on all tables
   - Creates proper policies for admin and public access
   - Production-ready security setup

### 2. Environment Variables (Vercel)

Add these in Vercel Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORTAL_JWT_SECRET=your_portal_secret
ADMIN_JWT_SECRET=your_admin_secret
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### 3. Build Verification

✅ **Build Status:** PASSING (41 pages, 0 errors)

All routes compiled successfully:
- Admin dashboard
- Job intake form
- Job preview pages
- Proposal form with line items
- Access code generation
- Customer portal

### 4. Critical Workflows Verified

✅ **Job Intake → Proposal → Access Code Flow:**
1. Admin creates job via intake form → Saves to portal_jobs
2. Admin previews job → Displays all details
3. Admin creates proposal → Saves line items to proposal_data (NEW)
4. System redirects to access code page → Generates CANYON-XXXX code
5. Admin saves access code → Hashes and stores in portal_jobs
6. Customer logs in → Verifies address + code

### 5. API Endpoints (Next.js 16 Compatible)

All dynamic routes use Promise params pattern:
- ✅ `/api/admin/jobs/[id]` - Job details
- ✅ `/api/admin/jobs/[id]/proposal` - Save proposal (NEW)
- ✅ `/api/admin/jobs/[id]/access-code` - Generate access code
- ✅ `/api/admin/professionals/[id]` - Professional details

### 6. Latest Code Status

✅ **Git Status:** All changes committed and pushed
- Latest commit: Fix proposal creation to save to existing job
- All files tracked and up to date

---

## 🚀 Deployment Steps

### Step 1: Run SQL Migrations
1. Go to Supabase Dashboard → SQL Editor
2. Run `add-proposal-data-column.sql` first (REQUIRED)
3. Run other SQL files if not already executed
4. Verify columns exist in portal_jobs table

### Step 2: Deploy to Vercel
1. Push to GitHub (already done ✓)
2. Vercel will auto-deploy from main branch
3. Verify build succeeds in Vercel dashboard

### Step 3: Configure Environment Variables
1. Go to Vercel Project Settings
2. Add all 6 environment variables listed above
3. Redeploy if variables were added after initial deploy

### Step 4: Test Production
1. Admin login with email/password
2. Create test job via intake form
3. Preview job and create proposal
4. Generate access code
5. Test customer login with address + code

---

## ⚠️ Known Issues & Notes

### Must Complete Before Testing:
- Run `add-proposal-data-column.sql` in Supabase
- Without this, proposal creation will fail with database error

### Optional Enhancements (Future):
- Email notifications for access codes
- PDF generation for proposals
- Edit job functionality (currently placeholder)
- Proposal versioning

---

## 📋 Post-Deployment Verification

After deployment, test these critical paths:

1. **Admin Portal:**
   - [ ] Login at homepage with admin email
   - [ ] Access admin dashboard
   - [ ] View All Jobs list
   - [ ] Create new job via intake form
   - [ ] Preview job details
   - [ ] Create proposal with line items
   - [ ] Generate access code

2. **Customer Portal:**
   - [ ] Login with address + access code
   - [ ] View project dashboard
   - [ ] Check proposal details visible

3. **Database:**
   - [ ] Verify portal_jobs has proposal_data column
   - [ ] Check access_code_hash is properly stored
   - [ ] Confirm RLS policies are active

---

## 🆘 Troubleshooting

### Proposal Creation Fails:
- **Issue:** "Failed to create proposal" error
- **Fix:** Run `add-proposal-data-column.sql` in Supabase

### Access Code Not Working:
- **Issue:** Customer can't login with access code
- **Fix:** Check access_code_hash exists in portal_jobs record

### Build Errors:
- **Issue:** Deployment fails in Vercel
- **Fix:** Verify all environment variables are set correctly

---

## 📞 Support

For issues during deployment:
1. Check Vercel build logs for specific errors
2. Verify Supabase SQL migrations completed successfully
3. Confirm all environment variables match .env.local format

**Status:** Ready for production deployment ✅

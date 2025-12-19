# Canyon Customer Portal - Deployment Checklist ✅

## ✅ Completed Steps

### 1. Dependencies Installed
- ✅ bcrypt installed (`npm install bcrypt @types/bcrypt`)
- ✅ All TypeScript types resolved
- ✅ Build succeeds (`npm run build`)
- ✅ Dev server running on http://localhost:3000

### 2. Code Committed
- ✅ Commit 932cb13: Install bcrypt for job intake access code hashing
- ✅ All changes pushed to GitHub

---

## ⚠️ REQUIRED: Database Setup

### Run this SQL in Supabase SQL Editor:

**Location:** `create-job-intakes-table.sql`

```sql
-- Create job_intakes table to store detailed intake information
CREATE TABLE IF NOT EXISTS job_intakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES portal_jobs(id) ON DELETE CASCADE,
  
  -- Additional contact info
  customer_secondary_phone TEXT,
  
  -- Location details
  job_city TEXT,
  job_state TEXT,
  job_zip TEXT,
  
  -- Project information
  project_type TEXT,
  work_description TEXT,
  estimated_budget TEXT,
  timeline TEXT,
  
  -- Meeting information
  first_meeting_datetime TIMESTAMP WITH TIME ZONE,
  meeting_notes TEXT,
  
  -- Lead tracking
  lead_source TEXT,
  priority TEXT DEFAULT 'medium',
  
  -- Internal notes
  internal_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on job_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_job_intakes_job_id ON job_intakes(job_id);

-- Create index on priority for filtering
CREATE INDEX IF NOT EXISTS idx_job_intakes_priority ON job_intakes(priority);

-- Create index on first_meeting_datetime for scheduling
CREATE INDEX IF NOT EXISTS idx_job_intakes_meeting ON job_intakes(first_meeting_datetime);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_job_intakes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER job_intakes_updated_at
  BEFORE UPDATE ON job_intakes
  FOR EACH ROW
  EXECUTE FUNCTION update_job_intakes_updated_at();

-- Grant permissions (adjust as needed for your RLS policies)
ALTER TABLE job_intakes ENABLE ROW LEVEL SECURITY;
```

**Steps:**
1. Open Supabase Dashboard: https://app.supabase.com
2. Go to SQL Editor
3. Copy the entire SQL above
4. Click "Run"
5. Verify success message

---

## 🧪 Testing the Complete Flow

### Test 1: Admin Login
1. Go to http://localhost:3000
2. Login with: `admin@canyonconstructioninc.com` / `admin123`
3. Should redirect to `/admin/dashboard`

### Test 2: Navigate to Jobs
1. Click "Jobs" button on dashboard
2. Should see `/admin/jobs` page with job list
3. Click "+ Add Job" button
4. Should navigate to `/admin/jobs/new`

### Test 3: Create Job Intake (REQUIRES SQL RUN FIRST!)
1. Fill out job intake form:
   - Customer Name: Test Customer
   - Email: test@example.com
   - Phone: 503-555-1234
   - Address: 123 Main St
   - City: Portland
   - State: OR
   - Zip: 97201
2. Click "Save Job Intake"
3. Should see success message with CANYON-XXXX code
4. Should redirect to `/admin/jobs`
5. New job should appear in list

### Test 4: Job List Display
1. Verify new job appears in "All Jobs"
2. Check status shows "New Lead"
3. Verify is_active is false (inactive)

---

## 🔄 Application Flow

### Customer Lead → Job Workflow

```
1. WEBSITE LEAD RECEIVED
   └─> Email arrives from website

2. ADMIN CREATES JOB INTAKE
   ├─> Go to: All Jobs → + Add Job
   ├─> Fill customer info
   ├─> Fill project details
   ├─> Schedule first meeting
   └─> System generates CANYON-XXXX code
       └─> Creates portal_jobs record (status: "New Lead", is_active: false)
       └─> Creates job_intakes record (detailed data)

3. FIRST MEETING CONDUCTED
   └─> Admin attends site visit

4. CREATE PROPOSAL (Future Feature)
   ├─> Build proposal from job details
   ├─> Generate PDF
   └─> Send to customer

5. PROPOSAL ACCEPTED (Future Feature)
   ├─> Update job status to "Active"
   ├─> Set is_active = true
   └─> Customer can now access portal with CANYON-XXXX code

6. ASSIGN SUBCONTRACTORS (Future Feature)
   └─> Link professionals to active job
```

---

## 🚀 Vercel Deployment

### Environment Variables Required:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_JWT_SECRET=canyon_admin_secret_2024_secure_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBDwJI7OHHH-atn98BrBfh2HF8abFKwoq8
```

### Deployment Steps:
1. Ensure SQL migration is run in Supabase
2. Verify all environment variables in Vercel
3. Push to GitHub (triggers auto-deploy)
4. Check Vercel build logs
5. Test production URL

---

## ✅ Current Status

**Local Environment:**
- ✅ Dev server running successfully
- ✅ Build passes with no errors
- ✅ All TypeScript errors resolved
- ✅ bcrypt installed and working

**Database:**
- ⏳ PENDING: Run job_intakes SQL migration in Supabase

**Next Steps:**
1. Run the SQL migration in Supabase (CRITICAL - blocks form submission)
2. Test job intake form end-to-end
3. Deploy to Vercel with environment variables
4. Build proposal system (next feature)
5. Build subcontractor assignment (next feature)

---

## 📋 Files Created/Modified

**New Files:**
- `app/admin/jobs/new/page.tsx` - Job intake form
- `app/admin/jobs/new/new-job.css` - Form styling
- `app/api/admin/jobs/create/route.ts` - API endpoint
- `create-job-intakes-table.sql` - Database migration

**Modified Files:**
- `app/admin/jobs/page.tsx` - Added navigation to new form
- `package.json` - Added bcrypt dependency
- `package-lock.json` - Dependency lock file

**Commits:**
- 3ee907d: Add comprehensive job intake form
- 932cb13: Install bcrypt for job intake access code hashing

---

## 🐛 Known Issues

1. **Google Business Search Performance**: Very slow, freezes on input (deferred optimization)
2. **Vercel Environment Variable**: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not configured yet

---

Generated: $(date)

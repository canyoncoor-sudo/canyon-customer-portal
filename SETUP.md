# Canyon Customer Portal - Supabase Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name:** Canyon Customer Portal
   - **Database Password:** (save this!)
   - **Region:** (choose closest to you)
4. Click "Create new project" (takes ~2 minutes)

### Step 2: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy all contents from `supabase/schema.sql` and paste
4. Click **RUN** (bottom right)
5. You should see: ✅ "Success. No rows returned"

### Step 3: Create Storage Bucket (Optional - for file uploads later)

1. Go to **Storage** (left sidebar)
2. Click **New Bucket**
3. Name: `job-files`
4. Make it **Private** (not public)
5. Click **Create bucket**

### Step 4: Get Your Credentials

1. Go to **Project Settings** (gear icon, bottom left)
2. Click **API** in the left menu
3. Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGc...
service_role key: eyJhbGc... (expand to see)
```

4. Also get JWT Secret:
   - Still in Settings → API
   - Scroll to **JWT Settings**
   - Copy the **JWT Secret**

### Step 5: Add Credentials to Your App

1. Open `.env.local` in your project root
2. Fill in the values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_service_role_key
PORTAL_JWT_SECRET=your_jwt_secret_here
```

### Step 6: Test with Sample Data

1. In Supabase SQL Editor, run:

```sql
-- Create a test job
insert into public.jobs (job_name, address_line1, city, state, zip, customer_name)
values ('Test Kitchen Remodel', '123 Main St', 'Salem', 'OR', '97301', 'John Smith')
returning id;
```

2. Copy the `id` that's returned (looks like: `550e8400-e29b-41d4-a716-446655440000`)

3. Generate access code hash:

```bash
node scripts/hash-generator.js CANYON-1024
```

4. Copy the hash and run in Supabase:

```sql
insert into public.job_access (job_id, access_code_hash, is_active)
values ('PASTE_JOB_ID_HERE', '$2b$10$Ko9dXHf07DnMsWfa4skX4uD0me1Qs6LFUeK8Mvb/L1GWWE3G8q4k2', true);
```

5. Add a sample bid:

```sql
insert into public.job_bid (job_id, title, body, amount)
values ('PASTE_JOB_ID_HERE', 'Kitchen Remodel Estimate', 
'Complete kitchen remodel including:
- Cabinet replacement
- Countertop installation (quartz)
- New appliances
- Electrical work
- Plumbing updates', 45000.00);
```

### Step 7: Run Your App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Test Login:**
- Address: `123 Main St`
- Code: `CANYON-1024`

You should see the test job and bid! 🎉

---

## 🔧 Common Issues

### "Unable to verify" error
- Check that address matches exactly (case doesn't matter)
- Verify job exists in database
- Make sure access code was hashed correctly

### "Connection error"
- Check `.env.local` has correct Supabase URL
- Verify API keys are correct
- Make sure project is not paused (free tier pauses after inactivity)

### "No matching job found"
- Address must match `address_line1` exactly
- Try copying address directly from database

### Environment variables not loading
- File must be named `.env.local` (not `.env`)
- Restart dev server after changing `.env.local`
- Keys starting with `NEXT_PUBLIC_` are exposed to browser
- Keys without `NEXT_PUBLIC_` are server-only

---

## 📊 Database Quick Reference

### Add a new job + access code:

```sql
-- 1. Create job
insert into jobs (job_name, address_line1, city, state, zip, customer_name)
values ('Project Name', '456 Oak Ave', 'Portland', 'OR', '97201', 'Jane Doe')
returning id;

-- 2. Generate hash: node scripts/hash-generator.js YOUR_CODE

-- 3. Add access code
insert into job_access (job_id, access_code_hash, is_active)
values ('job_id_from_step_1', 'hash_from_step_2', true);
```

### View all jobs:

```sql
select id, job_name, address_line1, city, status 
from jobs 
order by created_at desc;
```

### Check access codes:

```sql
select j.job_name, j.address_line1, ja.is_active, ja.created_at
from jobs j
join job_access ja on ja.job_id = j.id;
```

---

## 🎯 Next Steps

1. **Add real project data** - Replace test job with actual customer info
2. **Customize branding** - Update colors in `app/page.tsx`
3. **Deploy to production** - Use Vercel: `vercel --prod`
4. **Add more features:**
   - File uploads
   - Email notifications
   - Project timeline
   - Payment tracking

Need help? Check the main README.md

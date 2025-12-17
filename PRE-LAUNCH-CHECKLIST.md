# 🚀 Pre-Launch Checklist for Canyon Customer Portal

## ✅ Completed Database Setup

1. **portal_jobs table** - Customer projects/jobs ✅
   - Has: id, job_address, access_code_hash, customer info, etc.

2. **admin_users table** - Admin authentication ✅
   - Login: project@canyonconstructioninc.com / admin123

3. **subcontractors table** - Licensed professionals ✅  
   - Has: company_name, trade, ccb_number, contact_name, phone, email, address, notes
   - Fixed: job_id nullable, created_at, updated_at timestamps
   - Features working: Create, Read, Update, Delete

## 🔧 Required Before Going Live

### Run this SQL in Supabase (if using proposals):
```sql
-- See: create-proposals-table.sql
```
This creates:
- `proposals` table - For proposal builder feature
- `proposal_line_items` table - For itemized pricing
- Indexes and triggers

## 📋 Environment Variables Checklist

Make sure these are in Vercel/production:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_JWT_SECRET=canyon_admin_secret_2024_secure_key
```

## 🔐 Security Checklist

- [ ] Change ADMIN_JWT_SECRET to a new secure random string for production
- [ ] Verify Supabase Row Level Security (RLS) policies are enabled
- [ ] Test admin login works in production
- [ ] Test customer portal login works
- [ ] Verify API routes are protected (require tokens)

## 🧪 Testing Checklist

### Customer Portal:
- [ ] Customer can login with job address + access code
- [ ] Dashboard loads with project info
- [ ] Documents section works
- [ ] Updates/timeline section works

### Admin Portal:
- [ ] Admin can login with email + password
- [ ] Dashboard loads
- [ ] **Professionals Management:**
  - [ ] Can view all professionals organized by trade
  - [ ] Can create new professional
  - [ ] Can edit professional (including address & notes)
  - [ ] Can delete professional
- [ ] **Projects (if implemented):**
  - [ ] Can create new project
  - [ ] Can view projects list
- [ ] **Proposals (if implemented):**
  - [ ] Can create new proposal
  - [ ] Proposal builder works

## 🌐 Deployment Steps

### 1. Connect to Vercel (if not already)
```bash
cd ~/Desktop/canyon-customer-portal
vercel
```

### 2. Set Environment Variables in Vercel Dashboard
- Go to your project settings
- Add all environment variables listed above
- **Important:** Use a NEW random ADMIN_JWT_SECRET for production

### 3. Deploy
```bash
vercel --prod
```

### 4. Update Landing Site AI Subdomain
- Point your subdomain DNS to Vercel
- Vercel will handle SSL certificate automatically

### 5. Post-Deploy Verification
- [ ] Visit your live URL
- [ ] Test admin login
- [ ] Test customer login with a test project
- [ ] Test creating/editing/deleting a professional
- [ ] Check browser console for errors
- [ ] Test on mobile device

## 📊 Optional: Create Test Data

Run this in Supabase SQL Editor to create sample data for testing:

```sql
-- Create a test job for customer portal testing
INSERT INTO portal_jobs (
  job_address,
  access_code_hash,
  customer_name,
  customer_email,
  customer_phone,
  project_type,
  start_date,
  status
) VALUES (
  'TEST PROJECT - 123 Demo St',
  '$2b$10$jdkzfs37j6PgWPnCIvUcB.e6UJo72qh4vS9R2I1eG2KouVHPn9Mi6',
  'Test Customer',
  'test@example.com',
  '503-555-1234',
  'Remodel',
  CURRENT_DATE,
  'In Progress'
);

-- Access code for test project: CANYON-1024
-- Address: TEST PROJECT - 123 Demo St
```

## 🚨 Known Issues / Notes

- Edit and Delete for professionals now working ✅
- Database columns (address, notes, timestamps) added ✅
- Next.js 15+ params handling fixed ✅
- Proposals table needs to be created if using that feature

## 🎯 Post-Launch Monitoring

After going live, monitor:
1. Supabase logs for errors
2. Vercel deployment logs
3. Any customer login issues
4. Admin portal functionality

## 📞 Support Contacts

- Vercel support: vercel.com/support
- Supabase support: supabase.com/support
- Next.js docs: nextjs.org/docs

---

**Ready to deploy? Run the proposals SQL if needed, then push to Vercel!** 🚀

# Canyon Construction Portal - Complete Workflow Guide

## 📋 Overview
This guide explains the complete workflow from receiving a customer inquiry to project completion, showing how the admin portal and customer portal work together.

---

## 🔄 Complete Workflow

### Step 1: Lead Comes In
**Where it comes from:**
- Email from website contact form
- Phone call from referral
- Walk-in customer

**What you do:**
1. Go to Admin Portal → Jobs → "Create New Job"
2. Fill out the Job Intake Form with customer information:
   - Customer name, email, phone
   - Project address (with Oregon city dropdown)
   - Project type and description
   - Meeting date/time
   - Lead source

---

### Step 2: Create the Job Intake
**Admin Portal: `/admin/jobs/new`**

**Fields to fill:**
- **Customer Info:** Name, email, primary phone, secondary phone
- **Location:** Street address, city (dropdown), state (Oregon), ZIP code
- **Project:** Type, description, estimated budget, timeline
- **Meeting:** First meeting date/time, notes
- **Internal:** Lead source, priority, internal notes

**After saving:**
- Job is created in the system
- You can view it in the Jobs list
- Status starts as "Active"

---

### Step 3: Meet with Customer
**What happens:**
- Meet with customer at scheduled time
- Gather detailed project requirements
- Take notes about their needs
- Discuss budget and timeline

**Update the job:**
1. Go to the job detail page
2. Click "Edit Job"
3. Add meeting notes and any additional details

---

### Step 4: Create a Proposal
**Admin Portal: Job Detail Page**

**Two ways to create:**

**Option A: From Job Detail Page**
1. View the job at `/admin/jobs/[id]`
2. Click "Create Proposal" button
3. Form pre-fills with customer information
4. Add project details, pricing, scope of work
5. Generate access code
6. Save proposal

**Option B: From Documents Section**
1. Go to Admin Portal → Documents
2. Click "Project Proposal"
3. Manually fill in customer information
4. Add project details and pricing
5. Generate access code
6. Save proposal

**The proposal includes:**
- Customer information (pre-filled from job)
- Project scope and description
- Pricing breakdown
- Timeline estimates
- Terms and conditions
- Unique access code (CANYON-XXXX format)

---

### Step 5: Send Proposal to Customer
**Admin Portal: `/admin/jobs/[id]/send-proposal`**

**How to send:**
1. From the job detail page, click "📧 Send Proposal Email"
2. Review the auto-generated email:
   - Personalized greeting with customer's first name
   - Portal link: `https://yourwebsite.com`
   - Project address
   - Access code
   - Instructions to access portal
3. Edit the email text to personalize further
4. Click one of:
   - **"📧 Open in Email Client"** - Opens in Outlook/Mail
   - **"📋 Copy Email Body"** - Copy to paste in Gmail/other
   - **"📋 Copy Subject + Body"** - Copy everything

**Email template includes:**
- Warm greeting mentioning your meeting
- Portal access credentials (address + code)
- What they'll find in the portal
- Step-by-step login instructions
- Your contact information

---

### Step 6: Customer Views Proposal
**Customer Portal: `https://yourwebsite.com`**

**Customer login process:**
1. Customer receives your email
2. Clicks portal link or visits your website
3. Enters their project address
4. Enters the access code (CANYON-XXXX)
5. Logs into their personal portal

**What customer sees:**
- Dashboard with project overview
- **Documents tab** - View proposal PDF
- **Quotes tab** - Proposal details and pricing
- Project timeline
- Contact information

**Customer actions:**
- Review the proposal
- Accept or request changes
- Upload documents if needed
- Track project progress (later)

---

### Step 7: Customer Accepts Proposal
**Customer Portal: Quotes Section**

**What happens:**
1. Customer reviews proposal
2. Clicks "Accept Proposal"
3. System updates project status
4. You get notified

**Your next steps:**
1. Project moves from "Proposal" to "Active"
2. Time to add more documents to their portal

---

### Step 8: Add Additional Documents
**Admin Portal: Various Document Sections**

**Documents to add after acceptance:**

**A. Lien Law Notice** (`/admin/documents/lien-law`)
- Required preliminary lien notice
- Fill in project and contractor details
- Print/Save as PDF
- Upload to customer portal

**B. Permits** (if required)
- Scan/upload building permits
- Electrical permits
- Plumbing permits
- Upload to customer portal

**C. Professional Agreements** (`/admin/professionals/agreement`)
- Subcontractor agreements
- Licensed professional contracts
- Insurance certificates
- Upload to customer portal

**D. Site Safety Plan** (`/admin/documents/safety-plan`)
- Complete safety requirements
- Hazard identification
- PPE requirements
- Print/Save as PDF

---

### Step 9: Assign Licensed Professionals
**Admin Portal: `/admin/professionals`**

**Adding professionals to project:**
1. Go to "Licensed Professionals"
2. Click "Add New Professional" or select existing
3. Fill in:
   - Company name
   - Trade (Electrical, Plumbing, etc.)
   - CCB license number
   - Contact information
   - Multiple contacts with titles
4. Link them to the specific job
5. Professional appears in customer portal
6. Mark as "Complete" when their work is done

---

### Step 10: Collect Payments
**Admin Portal: Payment Tracking** (Future: In customer portal too)

**Payment methods:**
1. **Online Payment** (future integration)
   - Customer pays through portal
   - Automatic tracking
   - Receipts generated

2. **Check Payment**
   - Customer writes check
   - You record it in admin portal
   - Mark as "Paid"
   - Upload check photo/receipt

**Payment tracking:**
- Initial deposit
- Progress payments
- Final payment
- Outstanding balance
- Payment history

---

### Step 11: Project Progress Updates
**Admin Portal: During Construction**

**Adding photos:**
1. Go to job detail page
2. Upload progress photos
3. Add captions/descriptions
4. Photos appear in customer portal
5. Customer can view project progress anytime

**Adding progress reports:**
1. Update job status
2. Add notes about completed work
3. Mark subcontractors as complete
4. Update timeline if needed
5. Customer sees updates in real-time

**What customer sees:**
- Photo gallery of work progress
- Status updates
- Completed milestones
- Remaining work
- Professional/subcontractor status

---

### Step 12: Mark Tasks Complete
**Throughout the project:**

**Subcontractors:**
- When electrician finishes → Mark complete
- When plumber finishes → Mark complete
- Customer sees completion status

**Inspections:**
- Upload inspection reports
- Mark inspections as passed
- Customer can view results

**Permits:**
- Update permit status
- Upload final inspections
- Close out permits

---

### Step 13: Project Closeout
**Admin Portal: `/admin/documents/closeout`**

**Final steps:**
1. Complete Project Closeout Checklist:
   - All work completed ✓
   - Final inspection passed ✓
   - Permits closed ✓
   - Final payment received ✓
   - Warranties provided ✓
   - Customer walkthrough done ✓

2. Upload final documents:
   - Lien releases
   - Warranties
   - Operating manuals
   - Final photos

3. Customer portal shows:
   - Complete project history
   - All documents
   - Final photos
   - Payment receipts

---

## 🔐 Admin Portal → Customer Portal Connection

### How They Communicate:

**1. Shared Database Tables:**
- `portal_jobs` - Job records (both portals read)
- `job_intakes` - Detailed job info
- `proposals` - Proposal data
- `documents` - All project documents
- `subcontractors` - Licensed professionals
- `photos` - Progress photos
- `payments` - Payment records

**2. Access Codes:**
- Admin creates unique code for each job
- Customer uses code to login
- Code links customer to their specific job data
- Secure token-based authentication

**3. Real-Time Updates:**
- Admin uploads document → Customer sees it immediately
- Admin adds photo → Appears in customer portal
- Admin marks professional complete → Status updates for customer
- Admin tracks payment → Balance updates in portal

**4. API Endpoints:**
```
/api/documents?job_id=xxx     → Customer sees their documents
/api/photos?job_id=xxx        → Customer sees progress photos
/api/subcontractors?job_id=xxx → Customer sees professionals
/api/payments?job_id=xxx      → Customer sees payment status
/api/timeline?job_id=xxx      → Customer sees project timeline
```

---

## 📊 Data Flow Example

```
1. You create Job Intake
   ↓
2. Job stored in portal_jobs table
   ↓
3. You create Proposal (links to job_id)
   ↓
4. Proposal stored with access code
   ↓
5. You send email with access code
   ↓
6. Customer logs in with code
   ↓
7. Portal queries: WHERE job_id = customer's job
   ↓
8. Customer sees only THEIR data:
   - Their proposal
   - Their documents
   - Their photos
   - Their professionals
   - Their payments
```

---

## 🎯 Quick Reference

### Admin Portal Key Pages:
- `/admin/jobs` - All jobs list
- `/admin/jobs/new` - Create job intake
- `/admin/jobs/[id]` - Job details
- `/admin/jobs/[id]/send-proposal` - Email generator
- `/admin/documents` - Create documents
- `/admin/professionals` - Manage professionals
- `/admin/dashboard` - Overview of all projects

### Customer Portal Pages:
- `/` - Login page
- `/dashboard` - Customer dashboard
- `/dashboard/documents` - View all documents
- `/dashboard/quotes` - View proposals
- `/dashboard/photos` - Progress photos
- `/dashboard/payments` - Payment history
- `/dashboard/subcontractors` - Licensed professionals

---

## 💡 Best Practices

1. **Always create Job Intake first** - This is your foundation
2. **Generate access code before emailing** - Customer needs it to login
3. **Personalize emails** - Edit the template to add personal touches
4. **Upload documents promptly** - Keep customer informed
5. **Update photos regularly** - Customers love seeing progress
6. **Mark tasks complete** - Shows professionalism and progress
7. **Track all payments** - Maintains financial clarity

---

## 🚀 Future Enhancements (Planned)

- [ ] Online payment processing (Stripe integration)
- [ ] SMS notifications for updates
- [ ] Customer can upload documents
- [ ] Digital signatures for contracts
- [ ] Automated email reminders
- [ ] Project timeline with milestones
- [ ] Bid comparison for subcontractors

---

**Last Updated:** December 19, 2025

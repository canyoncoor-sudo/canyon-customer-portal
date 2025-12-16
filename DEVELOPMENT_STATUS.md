# Canyon Construction Customer Portal - Development Status

## ✅ COMPLETED PAGES

### 1. Login Page (`/app/page.tsx`)
- Address + access code authentication
- JWT token storage
- Redirect to dashboard on success
- **Status:** Working with test credentials (salem / CANYON-1024)

### 2. Dashboard (`/app/dashboard/page.tsx`)
- Job overview with customer info
- Project status badge
- 6 navigation cards: Photos, Quotes, Subcontractors, Payments, Documents, Timeline
- Logout functionality
- **Status:** Complete with Canyon branding

### 3. Photos Gallery (`/app/dashboard/photos/`)
- Sidebar gallery navigation (Kitchen, Roof, Pavers, etc.)
- Photo grid view
- Lightbox modal for full-size images
- **Status:** UI complete, needs `/api/galleries` and `/api/photos` endpoints

### 4. Quotes/Bids (`/app/dashboard/quotes/`)
- Bid cards with pricing, status, description
- Accept bid functionality
- PDF viewing button
- Status badges (Pending, Accepted, Paid, Rejected)
- **Status:** UI complete, needs `/api/bids` and `/api/bids/accept` endpoints

### 5. Subcontractors (`/app/dashboard/subcontractors/`)
- Grid of subcontractor cards
- CCB numbers, company info, trade badges
- "View Their Photos" functionality
- Individual subcontractor photo galleries with lightbox
- **Status:** UI complete, needs `/api/subcontractors` and `/api/subcontractors/[id]/photos` endpoints

### 6. Payments (`/app/dashboard/payments/`)
- Payment schedule display
- Total/Paid/Remaining summary cards
- Progress bar visualization
- Payment type breakdown (down payment, milestone, final)
- "Make Payment" buttons
- Status tracking (Paid, Pending, Overdue)
- **Status:** UI complete, needs `/api/payments` endpoint and payment processor integration

### 7. Documents (`/app/dashboard/documents/`)
- Filter tabs (All, Contract, Permit, Invoice, Other)
- Document cards with file type badges
- Download buttons
- File size and upload date display
- **Status:** UI complete, needs `/api/documents` endpoint

### 8. Timeline (`/app/dashboard/timeline/`)
- Project overview with start/completion dates
- Overall progress bar
- Visual timeline with milestone markers
- Event types (Milestone, Inspection, Delivery, Payment, Meeting)
- Completion status for each event
- **Status:** UI complete, needs `/api/timeline` endpoint

---

## 🎨 STYLING
- **Canyon Brand Colors:** Ecru, Red clay, Rust, Espresso, Sky slate, Cornflower, Charcoal
- **CSS Variables:** Defined in `/app/globals.css`
- **Responsive Design:** All pages work on mobile and desktop
- **Consistent UI:** Cards, buttons, badges use shared styling

---

## 📁 DATABASE SCHEMA

### Current Tables (Working)
- `portal_jobs` - Job records with address, access code, customer info

### Pending Tables (SQL file created, not deployed)
File: `/supabase/expanded-schema.sql`

Tables to create:
- `photo_galleries` - Gallery organization (Kitchen, Roof, etc.)
- `photos` - Individual photos with URLs
- `subcontractors` - Contractor info with CCB numbers
- `subcontractor_photos` - Photos specific to each contractor
- `bids` - Quotes/bids with pricing and status
- `payments` - Payment schedule and transactions
- `documents` - Files (contracts, permits, invoices)
- `timeline_events` - Project milestones and dates

**Action Required:** Run `/supabase/expanded-schema.sql` in Supabase SQL Editor

---

## 🔌 API ENDPOINTS NEEDED

All endpoints should:
- Accept JWT token via `Authorization: Bearer <token>`
- Filter by `job_id` from token claims
- Return JSON responses

### To Implement:

1. **GET `/api/galleries`**
   - Query param: `job_id`
   - Returns: List of photo galleries for the job

2. **GET `/api/photos`**
   - Query param: `gallery_id`
   - Returns: Photos in a specific gallery

3. **GET `/api/bids`**
   - Query param: `job_id`
   - Returns: All bids/quotes for the job

4. **POST `/api/bids/accept`**
   - Body: `{ bid_id }`
   - Updates bid status to "Accepted"

5. **GET `/api/subcontractors`**
   - Query param: `job_id`
   - Returns: List of subcontractors with details

6. **GET `/api/subcontractors/[id]/photos`**
   - Returns: Photos for specific subcontractor

7. **GET `/api/payments`**
   - Query param: `job_id`
   - Returns: Payment schedule and transactions

8. **GET `/api/documents`**
   - Query param: `job_id`
   - Returns: All documents for the job

9. **GET `/api/timeline`**
   - Query param: `job_id`
   - Returns: Timeline events for the project

---

## 🚀 DEPLOYMENT CHECKLIST

### Before Deploying:
1. ✅ Push all code to GitHub (already done)
2. ⏳ Run expanded database schema in Supabase
3. ⏳ Implement all API endpoints
4. ⏳ Add test data to new tables
5. ⏳ Test all pages with real data locally

### Deploy to Vercel:
```bash
cd /Users/canyoninc/Desktop/canyon-customer-portal
vercel
```

### Environment Variables (Vercel):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`

---

## 🧪 TESTING PLAN

### 1. Database Setup
- Run SQL schema in Supabase SQL Editor
- Add sample data for all new tables

### 2. API Testing
- Create each API endpoint
- Test with curl or Postman
- Verify JWT authentication works

### 3. Page Testing
- Navigate to each page
- Verify data loads correctly
- Test interactive features (lightbox, accept bid, download)

### 4. Integration Testing
- Complete user flow: Login → Dashboard → Each section
- Test on mobile and desktop
- Verify logout and re-login

---

## 📊 NEXT IMMEDIATE STEPS

### Priority 1: Database
```bash
# In Supabase Dashboard → SQL Editor
# Copy contents of /supabase/expanded-schema.sql
# Run the SQL to create all tables
```

### Priority 2: API Endpoints
Start with the most important:
1. `/api/galleries` and `/api/photos` (Photos page)
2. `/api/bids` (Quotes page)
3. `/api/payments` (Payments page)
4. Others as needed

### Priority 3: Test Data
Add sample records to test the UI:
- Photo galleries with photos
- Sample bids/quotes
- Payment schedule
- Documents
- Timeline events

---

## 💡 FUTURE ENHANCEMENTS

After basic functionality works:
- File upload for documents
- Payment processing integration (Stripe/Square)
- Email notifications
- Real-time updates
- Chat/messaging feature
- Mobile app version

---

## 🎯 CURRENT STATUS

**All portal pages built!** Ready to implement API endpoints and deploy.

**Working Features:**
- ✅ Authentication
- ✅ Dashboard navigation
- ✅ All page UIs complete

**Pending Work:**
- ⏳ Database schema deployment
- ⏳ API endpoint implementation
- ⏳ Integration testing
- ⏳ Production deployment

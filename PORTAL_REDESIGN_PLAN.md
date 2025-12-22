# Canyon Portal Redesign - Complete Implementation Plan

**Date:** December 22, 2025  
**Goal:** Transform Canyon Portal into a contractor-first, card-based, highly intuitive SaaS platform

---

## 🎯 CORE DESIGN PRINCIPLES

1. **Card-Based Navigation** - Main dashboard uses large, clickable cards (like Documents section)
2. **Single Source of Truth** - Customer data entered once, reused everywhere
3. **Status-Driven Workflow** - Clear job pipeline with "Next Best Action" buttons
4. **Auto-Populated Forms** - Documents pre-fill with customer/job/company data
5. **Mirror View** - Admin can see customer portal exactly as customer sees it
6. **Multi-Tenant Ready** - Designed to sell to other contractors

---

## 📊 MAIN DASHBOARD LAYOUT

### Card Grid (6 Primary Cards)

```
┌─────────────┬─────────────┬─────────────┐
│  CUSTOMERS  │JOBS&PROJECTS│  CALENDAR   │
│             │             │  SCHEDULE   │
└─────────────┴─────────────┴─────────────┘
┌─────────────┬─────────────┬─────────────┐
│  DOCUMENTS  │  LICENSED   │TASKS&TODOS  │
│  PROPOSALS  │PROFESSIONALS│             │
└─────────────┴─────────────┴─────────────┘
```

---

## 1️⃣ CUSTOMERS CARD

### Purpose
Central hub for all customer relationships and their portals

### When Clicked Opens:
**Customer List View** with cards for each customer

### Each Customer Card Shows:
- Customer Name (Large, Bold)
- Property Address
- Status Badge (Active | Pending | Completed | Archived)
- Last Activity Date
- Action Indicators:
  - 🔔 Unread Messages
  - 📸 New Photos
  - ✅ Proposal Accepted
  - 📄 Documents Pending

### Clicking a Customer Opens:
**Customer Portal Command Center** (Admin Mirror View)

#### Top Section:
- Customer Info Card (Name, Email, Phone, Address)
- Status Badge + Timeline Progress Bar
- **"View as Customer" Button** (shows exact customer view)
- **Quick Actions:**
  - Send Message
  - Upload Photo
  - Add Document
  - Generate Access Code

#### Tabs:
1. **Overview** - Project summary, key dates, next actions
2. **Proposal** - View/Edit/Create proposals
3. **Documents** - All signed/unsigned docs
4. **Photos** - Gallery organized by date/category
5. **Schedule** - Site visits, start dates, inspections
6. **Licensed Professionals** - Assigned contractors
7. **Payments** - Invoices, payment status
8. **Timeline** - Activity history
9. **Notes** - Internal notes (customer can't see)

### Add Customer Button:
Quick form with:
- Name, Email, Phone
- Property Address (Street, City, State, ZIP)
- Project Type
- Lead Source
- Priority (High/Medium/Low)

**On Save:** Creates customer record + empty portal container

---

## 2️⃣ JOBS & PROJECTS CARD

### Purpose
Daily work management - what's happening today/this week

### When Clicked Opens:
**Jobs Dashboard** with filtered views

### View Toggles:
- **Today's Jobs** (default)
- **Active Jobs**
- **Completed Jobs**
- **Needs Action**

### Each Job Card Shows:
- Property Address (Large)
- Customer Name
- Job Type (Remodel, New Build, Repair, etc.)
- Current Status:
  - 🔵 Lead/Intake
  - 🟡 Scheduled
  - 🟢 In Progress
  - 🔴 Needs Approval
  - ⚫ Completed
- Progress Bar (0-100%)
- Next Best Action Button:
  - "Schedule Site Visit"
  - "Create Proposal"
  - "Assign Crew"
  - "Upload Photos"
  - "Send Invoice"
  
### Quick Filters:
- By Status (dropdown)
- By Trade (dropdown)
- By Priority (High/Med/Low)
- Search by Address

### Job Detail View:
When clicking a job card:

#### Header:
- Address + Customer Name
- Status Badge
- Progress Indicator
- **Next Best Action** (big, colorful button)

#### Left Column:
- Customer Contact
- Property Details
- Budget & Timeline
- Assigned Licensed Professionals
- Crew Assignment

#### Right Column:
- Key Dates:
  - Lead Date
  - Site Visit Scheduled
  - Proposal Sent
  - Proposal Accepted
  - Start Date
  - Inspection Dates
  - Completion Date
  
#### Tabs:
1. **Overview** - Summary of entire job
2. **Proposal** - Scope, line items, pricing
3. **Schedule** - All dates and appointments
4. **Crew & Contractors** - Who's assigned
5. **Photos** - Before/during/after
6. **Documents** - Permits, contracts, etc.
7. **Change Orders** - Any scope changes
8. **Timeline** - Full activity log
9. **Notes** - Internal only

---

## 3️⃣ CALENDAR/SCHEDULE CARD

### Purpose
Daily/weekly view of what's happening when

### When Clicked Opens:
**Integrated Calendar View**

### View Options:
- **Daily** (default - "What am I doing today?")
- **Weekly**
- **Monthly**

### Event Types (Color Coded):
- 🔵 **Site Visits** - Customer meetings at property
- 🟢 **Start Dates** - Job kickoffs
- 🟡 **Inspections** - Scheduled inspections
- 🟠 **Crew Assignments** - Who works where
- 🔴 **Deadlines** - Payment due, permit expiration
- ⚪ **Follow-ups** - Callbacks, estimates

### Event Cards Show:
- Time
- Customer Name + Address
- Event Type
- Assigned Crew/Person
- Notes/Details
- Quick Actions:
  - Reschedule
  - Add Notes
  - Mark Complete
  - Send Reminder

### Crew Assignment Feature:
Clicking "Assign Crew" for an event opens:
- **Select Crew Members** (checkboxes)
- **Assign Vehicle** (dropdown: Truck 1, Truck 2, Van, etc.)
- **Tools Needed** (checklist: Excavator, Concrete mixer, etc.)
- **Assign Licensed Professional** (if subcontracting)
- **Estimated Duration**
- **Special Notes**

### Integration Features:
- ✅ **Google Calendar Sync** (optional)
- ✅ **Export to iCal**
- ✅ **Send SMS Reminders**
- ✅ **Automatic Scheduling Conflicts**

---

## 4️⃣ DOCUMENTS & PROPOSALS CARD

### Purpose
All paperwork in one place with smart templates

### When Clicked Opens:
**Document Dashboard** (like current documents section)

### Document Type Cards:
Each is a clickable card showing:
- Document Type Icon
- Document Name
- Count (e.g., "12 Proposals Sent This Month")
- Quick Action

### Document Types:

1. **Proposals & Estimates**
   - Create New Proposal
   - View All Proposals (Draft | Sent | Accepted | Declined)
   - Proposal Templates

2. **Contracts**
   - Create New Contract
   - View All Contracts
   - Contract Templates

3. **Invoices**
   - Create Invoice
   - View All Invoices (Paid | Pending | Overdue)
   - Payment Tracking

4. **Permits**
   - Upload Permit
   - Track Permit Status
   - Expiration Reminders

5. **Customer Intake Forms**
   - Blank Intake Template
   - Completed Intakes by Customer

6. **Licensed Professional Agreements**
   - Create Agreement
   - View All Agreements
   - Track Insurance/License Expiration

7. **Safety Sheets & Inspection Reports**
   - Site Safety Plans
   - Inspection Checklists
   - Incident Reports

8. **Lien Law Paperwork**
   - Lien Notices
   - Lien Releases
   - Contractor Affidavits

9. **Change Orders**
   - Create Change Order
   - View All Change Orders
   - Approval Status

10. **Punchlist & Closeout**
    - Punchlist Templates
    - Completion Certificates
    - Warranty Documents

### Smart Document Creation:
When creating ANY document:

**Step 1: Select Customer**
- Searchable dropdown
- Shows: Name, Address, Active Job

**Step 2: Auto-Populate**
System automatically fills in:
- Customer Name
- Property Address
- Customer Email
- Customer Phone
- Company Name (Canyon Construction Inc.)
- Company License #
- Company Contact Info
- Document Date
- Document Number (auto-incremented)
- Job Reference (if active job exists)

**Step 3: Document-Specific Fields**
User only enters what's unique:
- Proposal: Line items, scope, pricing
- Invoice: Payment due date, services rendered
- Contract: Terms, start date, completion date

**Step 4: Preview & Send**
- PDF Preview
- **Save to Customer Portal** (checkbox)
- **Email to Customer** (checkbox)
- **Print** (opens print dialog)

---

## 5️⃣ LICENSED PROFESSIONALS CARD

### Purpose
Manage all subcontractors by trade

### When Clicked Opens:
**Licensed Professionals Dashboard**

### Trade Category Cards:
Similar to document cards, organized by trade:

```
┌──────────────┬──────────────┬──────────────┐
│  ELECTRICIANS│   PLUMBERS   │  HVAC TECHS  │
│  (5 Active)  │  (3 Active)  │  (2 Active)  │
└──────────────┴──────────────┴──────────────┘
┌──────────────┬──────────────┬──────────────┐
│   ROOFERS    │  EXCAVATION  │  ARBORISTS   │
│  (4 Active)  │  (2 Active)  │  (1 Active)  │
└──────────────┴──────────────┴──────────────┘
```

### All Trade Categories:
- General Contractors
- Electricians
- Plumbers
- HVAC Technicians
- Landscape/Irrigation
- Excavation
- Arborists/Tree Service
- Finish Carpenters
- Drywall/Sheetrock
- Insulation
- Roofers
- Flooring Specialists
- Foundation/Concrete
- Window Installers
- Remodelers
- Asphalt/Paving
- Handyman Services
- Fencing
- Masons/Stonework
- Painters

### Clicking a Trade Opens:
**List of Professionals in That Trade**

Each Professional Card Shows:
- Company Name (Large)
- Contact Name
- Phone Number
- CCB License # (with expiration date indicator)
- Insurance Status:
  - ✅ Current (green)
  - ⚠️ Expiring Soon (yellow)
  - ❌ Expired (red)
- Rating (1-5 stars)
- Jobs Completed Count
- Status (Active | Inactive | Blacklisted)

### Professional Detail View:
When clicking a professional:

**Profile Section:**
- Company Name
- Primary Contact
- Phone, Email
- CCB License #
- License Expiration Date (with alert if <30 days)
- Insurance Provider
- Insurance Expiration (with alert)
- Insurance Certificate (PDF upload)

**Documents:**
- W-9
- License Copy
- Insurance Certificate
- Signed Agreement
- Custom Documents

**Job History:**
- List of jobs they worked on
- Performance ratings per job
- Payment history
- Photos of their work

**Notes:**
- Quality notes
- Reliability notes
- Pricing notes
- Would-hire-again rating

**Quick Actions:**
- Assign to Job (dropdown of active jobs)
- Send Agreement
- Upload Document
- Update License/Insurance
- Mark Inactive

### Add Licensed Professional:
Form includes:
- Trade (dropdown)
- Company Name
- Contact Name
- Phone, Email
- CCB License #
- License Expiration
- Insurance Details
- Preferred Contact Method
- Hourly Rate (optional)
- Notes

---

## 6️⃣ TASKS & TO-DOS CARD

### Purpose
Never miss a follow-up or deadline

### When Clicked Opens:
**Task Management Dashboard**

### View Filters:
- **Today** (default)
- **This Week**
- **Overdue** (red badge with count)
- **Upcoming**
- **Completed**

### Task Cards Show:
- Task Title (Bold)
- Customer/Job Link
- Due Date (with color coding)
- Priority (🔴 High | 🟡 Medium | 🟢 Low)
- Category Icon:
  - 📞 Follow-up
  - 📄 Permit Reminder
  - 💰 Payment Due
  - 🔍 Inspection Scheduled
  - 📧 Send Proposal
  - 🚧 Job Start
  - ✅ Callback

### Task Categories:

1. **Follow-ups**
   - Call customer back
   - Follow up on proposal
   - Check on job progress

2. **Permit Reminders**
   - Permit application due
   - Permit expiring
   - Inspection required

3. **Customer Callbacks**
   - Scheduled callback
   - Return quote request
   - Answer questions

4. **Assigned to Days/Schedule**
   - Tasks linked to calendar events
   - Auto-appear on scheduled date

### Creating a Task:
- **Title** (what needs to be done)
- **Link to Customer** (dropdown, optional)
- **Link to Job** (dropdown, optional)
- **Due Date**
- **Priority** (High/Med/Low)
- **Category** (dropdown)
- **Assigned To** (dropdown of users)
- **Add to Calendar** (checkbox)
- **Notes**

### Completed Tasks:
- Mark complete (checkbox)
- Moved to "Completed" tab
- Can be un-done if needed

---

## 7️⃣ PHOTOS & MEDIA CARD (Bonus)

### Purpose
Organize all job photos by customer/contractor

### When Clicked Opens:
**Photo Library Dashboard**

### View Options:
- **By Customer** (folders for each customer)
- **By Job** (folders for each active job)
- **By Licensed Professional** (contractor work portfolios)
- **By Date** (chronological)
- **Unorganized** (needs sorting)

### Each Photo Shows:
- Thumbnail
- Date Uploaded
- Linked Customer/Job
- Category (Before | During | After | Problem | Completed)
- Who Uploaded (Admin | Customer | Contractor)

### Photo Actions:
- **Add to Customer Portal** (toggle)
- **Add to Contractor Profile** (toggle)
- **Tag/Category** (dropdown)
- **Add Caption**
- **Delete**
- **Download**

### Bulk Actions:
- Select multiple photos
- Assign to customer
- Assign to contractor
- Add to portal
- Download as ZIP

---

## 📋 DATABASE SCHEMA UPDATES

### New/Modified Tables:

```sql
-- Tenants (for multi-tenant SaaS)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  license_number TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  logo_url TEXT,
  branding_colors JSONB,
  subscription_tier TEXT, -- starter, pro, enterprise
  subscription_status TEXT, -- active, trial, expired
  trial_ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Users (multiple per tenant)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT, -- owner, admin, crew, readonly
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Customers (linked to tenant)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  secondary_phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  lead_source TEXT,
  status TEXT, -- active, inactive, archived
  rating INTEGER, -- 1-5
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Jobs (one per customer project)
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  customer_id UUID REFERENCES customers(id),
  job_number TEXT UNIQUE,
  property_address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  job_type TEXT, -- remodel, new_build, repair, etc.
  description TEXT,
  estimated_budget DECIMAL,
  timeline TEXT,
  priority TEXT, -- high, medium, low
  
  -- Status Pipeline
  status TEXT NOT NULL, -- lead, intake, scheduled, proposal_sent, proposal_accepted, in_progress, closeout, completed, archived
  status_updated_at TIMESTAMP,
  
  -- Key Dates
  lead_date TIMESTAMP,
  site_visit_date TIMESTAMP,
  proposal_sent_date TIMESTAMP,
  proposal_accepted_date TIMESTAMP,
  start_date TIMESTAMP,
  completion_date TIMESTAMP,
  
  -- Portal Access
  portal_active BOOLEAN DEFAULT FALSE,
  access_code_hash TEXT,
  access_code_expires_at TIMESTAMP,
  
  -- Tracking
  proposal_accepted BOOLEAN DEFAULT FALSE,
  unread_messages INTEGER DEFAULT 0,
  new_photos INTEGER DEFAULT 0,
  last_activity TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Job Status History
CREATE TABLE job_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id),
  from_status TEXT,
  to_status TEXT,
  changed_by UUID REFERENCES users(id),
  notes TEXT,
  changed_at TIMESTAMP DEFAULT NOW()
);

-- Appointments/Calendar Events
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  job_id UUID REFERENCES jobs(id),
  customer_id UUID REFERENCES customers(id),
  title TEXT NOT NULL,
  event_type TEXT, -- site_visit, start_date, inspection, follow_up, etc.
  scheduled_date TIMESTAMP NOT NULL,
  duration_minutes INTEGER,
  assigned_users JSONB, -- array of user IDs
  assigned_vehicle TEXT,
  tools_needed JSONB,
  location TEXT,
  notes TEXT,
  status TEXT, -- scheduled, completed, cancelled
  google_calendar_id TEXT, -- for sync
  created_at TIMESTAMP DEFAULT NOW()
);

-- Proposals
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  job_id UUID REFERENCES jobs(id),
  customer_id UUID REFERENCES customers(id),
  proposal_number TEXT UNIQUE,
  title TEXT,
  date_created TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP,
  total_amount DECIMAL,
  status TEXT, -- draft, sent, viewed, accepted, declined
  pdf_url TEXT,
  customer_signature TEXT,
  customer_signed_at TIMESTAMP,
  contractor_signature TEXT,
  contractor_signed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Proposal Line Items
CREATE TABLE proposal_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  sort_order INTEGER,
  scope TEXT, -- category/trade
  description TEXT,
  quantity DECIMAL,
  unit_price DECIMAL,
  total DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  job_id UUID REFERENCES jobs(id),
  customer_id UUID REFERENCES customers(id),
  document_type TEXT, -- proposal, contract, invoice, permit, etc.
  document_number TEXT,
  title TEXT,
  file_url TEXT,
  pdf_url TEXT,
  metadata JSONB, -- structured data for search/automation
  is_signed BOOLEAN DEFAULT FALSE,
  signed_at TIMESTAMP,
  visible_to_customer BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Document Templates
CREATE TABLE document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  template_name TEXT NOT NULL,
  document_type TEXT,
  template_content JSONB, -- HTML/JSON template
  variables JSONB, -- {{customer_name}}, {{address}}, etc.
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Licensed Professionals (Subcontractors)
CREATE TABLE licensed_professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  trade TEXT NOT NULL, -- electrician, plumber, etc.
  company_name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  ccb_number TEXT,
  license_expires_at TIMESTAMP,
  insurance_provider TEXT,
  insurance_expires_at TIMESTAMP,
  insurance_certificate_url TEXT,
  w9_url TEXT,
  agreement_url TEXT,
  hourly_rate DECIMAL,
  rating INTEGER, -- 1-5
  status TEXT, -- active, inactive, blacklisted
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Job Assignments (linking professionals to jobs)
CREATE TABLE job_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id),
  professional_id UUID REFERENCES licensed_professionals(id),
  assigned_date TIMESTAMP DEFAULT NOW(),
  completed_date TIMESTAMP,
  rating INTEGER,
  notes TEXT
);

-- Tasks & To-Dos
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  job_id UUID REFERENCES jobs(id),
  customer_id UUID REFERENCES customers(id),
  title TEXT NOT NULL,
  category TEXT, -- follow_up, permit, callback, etc.
  priority TEXT, -- high, medium, low
  due_date TIMESTAMP,
  assigned_to UUID REFERENCES users(id),
  status TEXT, -- pending, completed
  completed_at TIMESTAMP,
  linked_to_calendar BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Photos/Media
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  job_id UUID REFERENCES jobs(id),
  customer_id UUID REFERENCES customers(id),
  professional_id UUID REFERENCES licensed_professionals(id),
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT, -- before, during, after, problem, completed
  caption TEXT,
  uploaded_by TEXT, -- admin, customer, contractor
  visible_to_customer BOOLEAN DEFAULT FALSE,
  visible_in_contractor_profile BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Files (storage references)
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  mime_type TEXT,
  related_entity_type TEXT, -- job, customer, professional, document
  related_entity_id UUID,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔄 WORKFLOW STATES & NEXT BEST ACTIONS

### Job Pipeline States:

1. **Lead / Intake Started**
   - Next Best Action: "Complete Intake Form"
   - Visible: Basic customer info only
   
2. **Intake Submitted**
   - Next Best Action: "Schedule Site Visit"
   - Visible: Full intake details
   
3. **Site Visit Scheduled**
   - Next Best Action: "View Calendar"
   - Visible: Appointment details
   
4. **Site Visit Completed**
   - Next Best Action: "Create Proposal"
   - Visible: Meeting notes, photos
   
5. **Proposal Draft**
   - Next Best Action: "Send Proposal"
   - Visible: Proposal editor
   
6. **Proposal Sent**
   - Next Best Action: "Follow Up"
   - Visible: Sent date, tracking
   - Customer Sees: Proposal only (read-only)
   
7. **Proposal Accepted**
   - Next Best Action: "Activate Portal & Schedule Start"
   - Visible: Full proposal
   - **TRIGGERS:**
     - Portal activation
     - Access code generation
     - Customer sees full portal
   
8. **Production Scheduled**
   - Next Best Action: "Assign Crew"
   - Visible: Start date, crew assignment
   
9. **In Progress**
   - Next Best Action: "Upload Progress Photos"
   - Visible: Timeline, photos, change orders
   
10. **Closeout**
    - Next Best Action: "Create Final Invoice"
    - Visible: Punchlist, final photos
    
11. **Invoice Sent**
    - Next Best Action: "Track Payment"
    - Visible: Invoice, payment status
    
12. **Paid / Completed**
    - Next Best Action: "Archive & Request Review"
    - Visible: Full history

---

## 🎨 USER INTERFACE SPECIFICATIONS

### Card Design (Dashboard Cards):
```css
.dashboard-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dashboard-card:hover {
  border-color: #567A8D;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.card-title {
  font-size: 24px;
  font-weight: 800;
  color: #261312;
  margin-bottom: 8px;
}

.card-subtitle {
  font-size: 14px;
  color: #567A8D;
  margin-bottom: 20px;
}

.card-count {
  font-size: 36px;
  font-weight: 900;
  color: #712A18;
}

.card-action {
  background: #712A18;
  color: #F0F0EE;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  margin-top: auto;
}
```

### Status Badges:
```css
.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.status-lead { background: #E3F2FD; color: #1976D2; }
.status-scheduled { background: #FFF9C4; color: #F57F17; }
.status-in-progress { background: #C8E6C9; color: #388E3C; }
.status-completed { background: #E0E0E0; color: #424242; }
.status-needs-action { background: #FFCDD2; color: #C62828; }
```

### Next Best Action Button:
```css
.next-action-btn {
  background: linear-gradient(135deg, #712A18 0%, #567A8D 100%);
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  border: none;
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(113, 42, 24, 0.3);
  transition: all 0.2s;
}

.next-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(113, 42, 24, 0.4);
}
```

---

## 📱 RESPONSIVE DESIGN

### Desktop (1200px+)
- Dashboard: 3 cards per row
- Job cards: 2 per row
- Full sidebar navigation

### Tablet (768px - 1199px)
- Dashboard: 2 cards per row
- Job cards: 1 per row
- Collapsible sidebar

### Mobile (<768px)
- Dashboard: 1 card per row (stacked)
- Job cards: 1 per row
- Bottom navigation bar
- Hamburger menu

---

## 🔐 MULTI-TENANT ARCHITECTURE

### Tenant Isolation:
- All database queries filtered by `tenant_id`
- Row Level Security (RLS) policies in Supabase
- Each tenant has separate file storage bucket
- Custom subdomain per tenant: `{company}.canyonportal.com`

### Subscription Tiers:

**Starter** ($49/month)
- 1 user
- 10 active jobs
- 50 customers
- Basic documents
- Email support

**Professional** ($149/month)
- 5 users
- 50 active jobs
- Unlimited customers
- All documents + templates
- Calendar sync
- Licensed professional tracking
- Priority support

**Enterprise** ($299/month)
- Unlimited users
- Unlimited jobs
- White-label branding
- API access
- Custom integrations
- Dedicated account manager

### Onboarding Flow:
1. Signup form (company name, email, password)
2. Trial starts (14 days)
3. Setup wizard:
   - Enter company info
   - Upload logo
   - Choose brand colors
   - Add first customer (optional)
4. Dashboard tour
5. First job walkthrough

---

## 📤 IMPLEMENTATION PHASES

### Phase 1: Database & Backend (Week 1-2)
- [ ] Create new multi-tenant schema
- [ ] Set up RLS policies
- [ ] Build API endpoints for all entities
- [ ] Implement authentication with tenant context

### Phase 2: Dashboard Redesign (Week 3)
- [ ] Build new card-based dashboard
- [ ] Implement 6 main navigation cards
- [ ] Add quick stats and counts

### Phase 3: Customers Module (Week 4)
- [ ] Customer list with cards
- [ ] Customer detail/command center
- [ ] Mirror view functionality
- [ ] Add customer form

### Phase 4: Jobs & Projects (Week 5)
- [ ] Jobs dashboard with filters
- [ ] Job detail view with tabs
- [ ] Status workflow engine
- [ ] Next best action logic

### Phase 5: Calendar/Schedule (Week 6)
- [ ] Calendar views (day/week/month)
- [ ] Event creation
- [ ] Crew assignment
- [ ] Google Calendar sync

### Phase 6: Documents (Week 7)
- [ ] Document dashboard
- [ ] Smart templates
- [ ] Auto-population system
- [ ] PDF generation

### Phase 7: Licensed Professionals (Week 8)
- [ ] Trade categories
- [ ] Professional profiles
- [ ] Job assignment
- [ ] License/insurance tracking

### Phase 8: Tasks & Photos (Week 9)
- [ ] Task management
- [ ] Photo library
- [ ] Organization system
- [ ] Bulk actions

### Phase 9: Polish & Testing (Week 10)
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] User testing
- [ ] Bug fixes

### Phase 10: Multi-Tenant Launch (Week 11-12)
- [ ] Tenant signup flow
- [ ] Subscription billing
- [ ] Data migration tools
- [ ] Marketing site

---

## 🎯 SUCCESS METRICS

### User Experience:
- Average clicks to complete task: <3
- Time to create proposal: <5 minutes
- Dashboard load time: <2 seconds
- Mobile satisfaction score: >4.5/5

### Business:
- Customer acquisition cost (CAC)
- Monthly recurring revenue (MRR)
- Churn rate <5%
- Net promoter score (NPS) >50

---

## 🚀 GETTING STARTED

**Next Steps:**
1. Review this plan and provide feedback
2. Approve database schema changes
3. Begin Phase 1 implementation
4. Set up project management board (Trello/Asana)
5. Schedule weekly progress reviews

**Questions to Answer:**
1. Do you want to start with Phase 1 (backend) or jump to Phase 2 (UI redesign)?
2. Any modifications to the 6 main dashboard cards?
3. Priority features for MVP?
4. Target launch date for multi-tenant version?

---

**Document Version:** 1.0  
**Last Updated:** December 22, 2025  
**Author:** AI Product Designer & Architect

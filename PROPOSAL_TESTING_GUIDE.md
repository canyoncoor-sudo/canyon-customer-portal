# 📋 How to Create & View Proposals

## Step-by-Step Guide

### 1. Create a Proposal (Admin Side)

1. **Go to any job** in your admin portal
2. **Click "Create Proposal"** button
3. **Fill out the form:**
   - Customer info (pre-filled from job)
   - Project address (pre-filled)
   - **Add line items** (click "+ Add Line Item")
     - Description (e.g., "Kitchen cabinets")
     - Quantity
     - Unit Price
     - Total calculates automatically
   - Add notes if needed
4. **Click "Submit Proposal"**
5. You'll be redirected to access code generation

### 2. Verify Proposal Was Saved

1. **Go back to the job details page**
2. **Look for status badge** - should now say "Proposal Created ✓"
3. **Click on the status badge** to view the full proposal

### 3. View in Customer Portal

#### Option A: As Admin Preview
1. From job details, **click "View Client Portal"**
2. You'll see the customer's view
3. **Scroll down** - you should see **"Your Project Proposal"** section
4. It will show:
   - Total Amount
   - Scope/Notes
   - "View Full Proposal" button

#### Option B: As Actual Customer
1. Customer logs in with their access code
2. Dashboard shows proposal section automatically
3. They can click "View Full Proposal" to see complete document

## What Gets Saved to Database

When you create a proposal, this data is saved to `portal_jobs.proposal_data`:

```json
{
  "lineItems": [
    {
      "scope": "Kitchen cabinets",
      "cost": 5000
    }
  ],
  "totalCost": 15000,
  "createdAt": "2025-12-20T..."
}
```

Plus the job status changes to `'proposal_created'`.

## Troubleshooting

**If proposal doesn't show in customer portal:**
1. Check that job status = 'proposal_created'
2. Check that proposal_data is not null
3. Try refreshing the customer portal view
4. Check browser console for errors

**If "Create Proposal" button doesn't work:**
1. Make sure you're logged in as admin
2. Check that job has all required fields (name, email, address)
3. Look at browser console for navigation errors

## Quick Test

1. Create a test proposal with one line item: "Test Item - $100"
2. Click "View Client Portal"
3. Scroll down - you should see "$100" in the proposal section
4. That's it! Your proposal system is working!


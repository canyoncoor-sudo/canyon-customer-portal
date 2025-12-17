-- Create proposals table for proposal builder feature
-- Run this in Supabase SQL Editor before going live

CREATE TABLE IF NOT EXISTS proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES portal_jobs(id) ON DELETE CASCADE,
  
  -- Proposal metadata
  proposal_number TEXT UNIQUE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'draft', -- draft, sent, accepted, rejected
  
  -- Dates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sent_date TIMESTAMPTZ,
  expiration_date DATE,
  
  -- Customer information (can override job defaults)
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  project_address TEXT,
  
  -- Proposal content
  introduction TEXT,
  scope_of_work TEXT,
  timeline TEXT,
  notes TEXT,
  
  -- Pricing
  subtotal DECIMAL(12,2),
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(12,2),
  total_amount DECIMAL(12,2) NOT NULL,
  
  -- Terms and conditions
  payment_terms TEXT,
  warranty_info TEXT,
  terms_and_conditions TEXT,
  
  -- Tracking
  viewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT
);

-- Create proposal line items table for itemized pricing
CREATE TABLE IF NOT EXISTS proposal_line_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  
  -- Line item details
  item_order INTEGER NOT NULL,
  category TEXT, -- Materials, Labor, Equipment, etc.
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit TEXT, -- sq ft, linear ft, hours, each, etc.
  unit_price DECIMAL(12,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  
  -- Optional fields
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_proposals_job_id ON proposals(job_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proposal_line_items_proposal_id ON proposal_line_items(proposal_id);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_proposals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_proposals_timestamp ON proposals;
CREATE TRIGGER update_proposals_timestamp
    BEFORE UPDATE ON proposals
    FOR EACH ROW
    EXECUTE FUNCTION update_proposals_updated_at();

-- Verify tables were created
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('proposals', 'proposal_line_items')
ORDER BY table_name, ordinal_position;

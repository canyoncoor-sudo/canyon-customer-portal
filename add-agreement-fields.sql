-- Add agreement tracking fields to subcontractors table
ALTER TABLE subcontractors 
ADD COLUMN IF NOT EXISTS agreement_signed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS agreement_date DATE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_subcontractors_agreement_signed ON subcontractors(agreement_signed);

-- Success message
SELECT 'Agreement fields added successfully!' as message;

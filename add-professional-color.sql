-- Add color field to subcontractors table for trade-based color coding
ALTER TABLE subcontractors 
ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#567A8D';

-- Add comment explaining the field
COMMENT ON COLUMN subcontractors.color IS 'Hex color code for calendar display (e.g., #FF5733)';

-- Add Google Business Profile integration fields to subcontractors table
-- Run this in Supabase SQL Editor

-- Add Google-related columns
ALTER TABLE public.subcontractors
  ADD COLUMN IF NOT EXISTS google_place_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS google_business_name TEXT,
  ADD COLUMN IF NOT EXISTS google_rating NUMERIC(2,1),
  ADD COLUMN IF NOT EXISTS google_total_reviews INTEGER,
  ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
  ADD COLUMN IF NOT EXISTS google_profile_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS google_last_synced TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS is_google_verified BOOLEAN DEFAULT false;

-- Create index on google_place_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_subcontractors_google_place_id 
ON public.subcontractors(google_place_id);

-- Create index on is_google_verified for filtering
CREATE INDEX IF NOT EXISTS idx_subcontractors_google_verified 
ON public.subcontractors(is_google_verified);

-- Add comment for documentation
COMMENT ON COLUMN public.subcontractors.google_place_id IS 'Unique Google Place ID linking to Google Business Profile';
COMMENT ON COLUMN public.subcontractors.google_business_name IS 'Original business name from Google listing';
COMMENT ON COLUMN public.subcontractors.google_rating IS 'Google Business rating (1.0 to 5.0)';
COMMENT ON COLUMN public.subcontractors.google_total_reviews IS 'Total number of Google reviews';
COMMENT ON COLUMN public.subcontractors.google_maps_url IS 'Direct link to Google Maps listing';
COMMENT ON COLUMN public.subcontractors.google_profile_photo_url IS 'Primary business photo from Google';
COMMENT ON COLUMN public.subcontractors.google_last_synced IS 'Timestamp of last Google data refresh';
COMMENT ON COLUMN public.subcontractors.is_google_verified IS 'Whether profile is linked to verified Google Business listing';

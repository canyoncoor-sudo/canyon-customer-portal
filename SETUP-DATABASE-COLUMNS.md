# Database Setup - Add Missing Columns

## Problem
The edit form was failing with error: "Could not find the 'address' column" and "Could not find the 'updated_at' column"

Your `subcontractors` table is missing several columns that the form needs.

## Solution - Run this SQL in Supabase

1. Go to your Supabase dashboard
2. Click on "SQL Editor" in the left sidebar  
3. Copy and paste the SQL from `add-missing-columns.sql`
4. Click "Run" to execute

## What the SQL does:

✅ Adds `address` column (TEXT) - for business address  
✅ Adds `notes` column (TEXT) - for additional information  
✅ Adds `updated_at` column (TIMESTAMPTZ) - automatically tracks when records are updated  
✅ Adds `created_at` column (TIMESTAMPTZ) - tracks when records are created  
✅ Creates trigger to automatically update `updated_at` on every change

## After running the SQL:

1. The edit form will work completely
2. You can add/edit addresses for professionals
3. You can add/edit notes for additional information
4. The system will automatically track when records are created/updated

## Files Updated:

- ✅ `app/admin/professionals/edit/[id]/page.tsx` - Includes address and notes fields
- ✅ `app/api/admin/professionals/[id]/route.ts` - PUT handler includes address and notes
- ✅ `app/api/admin/professionals/create/route.ts` - POST handler includes address and notes

All code is ready - just need to run the SQL!

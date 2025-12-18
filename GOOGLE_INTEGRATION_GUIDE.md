# Google Business Profile Integration - Setup Guide

## Overview
This integration allows licensed professional profiles to be linked with their Google Business listings, providing verified information and enhanced credibility for customers viewing contractor profiles in the Canyon Construction portal.

## Features Implemented

### 1. **Google Business Search Component**
- Real-time autocomplete search using Google Places API
- Debounced input (300ms) for optimized API usage
- Dropdown with business name, address preview
- Automatic form population with Google data
- Manual entry fallback option

### 2. **Auto-Populated Fields from Google**
When a business is selected from Google, the following fields are automatically filled:
- Business Name (`company_name`)
- Address (`formatted_address`)
- Phone Number (`formatted_phone_number`)
- Google Rating (`rating`)
- Total Reviews (`user_ratings_total`)
- Business Type/Category (`types` → mapped to `trade`)
- Google Maps URL (`url`)
- Business Photo (`photos[0]`)
- **Place ID (`place_id`)** - Stored for future reference

### 3. **Database Schema**
Added 8 new columns to `subcontractors` table:
- `google_place_id` (TEXT, UNIQUE) - Primary link to Google Business
- `google_business_name` (TEXT) - Original name from Google
- `google_rating` (NUMERIC) - Rating from Google (1.0-5.0)
- `google_total_reviews` (INTEGER) - Total review count
- `google_maps_url` (TEXT) - Link to Google Maps listing
- `google_profile_photo_url` (TEXT) - Business photo URL
- `google_last_synced` (TIMESTAMP) - Last data refresh
- `is_google_verified` (BOOLEAN) - Linked to Google Business

### 4. **User Workflow**
1. Admin starts creating a new licensed professional
2. Sees "Search Google Business" component at top of form
3. Types business name → Google autocomplete shows matching businesses
4. Selects a business → Place Details fetched automatically
5. Form fields auto-populate (editable before saving)
6. Saves professional with `google_place_id` stored
7. Profile displays "Google Verified" badge

### 5. **Visual Indicators**
- **✅ Google Verified Badge** - Green badge on professional cards
- **Star Rating Display** - Shows Google rating and review count
- **"View on Google Maps" Link** - Direct link to Google Business listing
- **Google Business Info Box** - Shown during professional creation after linking

## Setup Instructions

### Step 1: Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Places API** (or "Places API (New)")
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. **Restrict the API key**:
   - Application restrictions: HTTP referrers (websites)
   - Add your domain: `canyon-customer-portal-xxt7.vercel.app`
   - Add localhost for testing: `localhost:3000`
   - API restrictions: Restrict key to "Places API"

### Step 2: Add API Key to Environment Variables

**Local Development (.env.local):**
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Vercel Production:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variable:
   - **Name:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - **Value:** Your API key from Google Cloud Console
   - **Environments:** Production, Preview, Development
3. Redeploy your application

### Step 3: Run Database Migration
Execute this SQL in Supabase SQL Editor:
```bash
# File: add-google-fields.sql
```
This adds all Google-related columns to the `subcontractors` table.

### Step 4: Verify Installation
1. Login to admin portal: `projects@canyonconstructioninc.com`
2. Go to **Licensed Professionals** → **+ Add Professional**
3. See "Search Google Business" component at top
4. Type a business name (e.g., "Premier Plumbing Portland")
5. Verify autocomplete dropdown appears
6. Select a business and confirm form auto-populates

## Files Created/Modified

### New Files
- **`lib/googlePlaces.ts`** - Core Google Places API integration utilities
- **`components/GoogleBusinessSearch.tsx`** - Autocomplete search component
- **`add-google-fields.sql`** - Database migration script

### Modified Files
- **`app/layout.tsx`** - Added Google Maps script tag
- **`app/admin/professionals/new/page.tsx`** - Integrated GoogleBusinessSearch
- **`app/admin/professionals/page.tsx`** - Added Google verification badges
- **`app/api/admin/professionals/create/route.ts`** - Handle Google fields
- **`app/api/admin/professionals/[id]/route.ts`** - Handle Google fields in updates
- **`.env.local`** - Added NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

## Usage Examples

### Creating a Professional with Google Link
```typescript
// User searches for "Bright Electric Portland"
// Selects from dropdown
// Form auto-populates with:
{
  company_name: "Bright Electric Co",
  address: "123 Main St, Portland, OR 97201",
  phone: "(503) 555-0100",
  google_place_id: "ChIJN1t_tDeu1234567890",
  google_rating: 4.8,
  google_total_reviews: 127,
  google_maps_url: "https://maps.google.com/?cid=1234567890",
  is_google_verified: true
}
```

### Displaying Google Verification
Professional cards now show:
```
✅ Google Verified
⭐ 4.8 (127 reviews)
[View on Google Maps]
```

## API Rate Limiting & Optimization
- **Debounced Search**: 300ms delay prevents excessive API calls
- **Client-Side Caching**: Search results cached for 5 minutes
- **Restricted Key**: API key restricted to your domains only
- **Minimal Fields**: Only fetch necessary Place Details fields

## Error Handling
- **API Not Loaded**: Shows warning message with troubleshooting
- **No Results Found**: Allows manual entry fallback
- **Place Details Fail**: Graceful error message, form remains editable
- **Invalid Place ID**: Can re-link or update manually

## Security Considerations
1. **API Key Restrictions**: 
   - HTTP referrer restrictions prevent unauthorized usage
   - API restrictions limit to Places API only
   - Monitor usage in Google Cloud Console

2. **Environment Variables**:
   - `NEXT_PUBLIC_*` prefix exposes to client (necessary for Google Maps)
   - Key restrictions prevent abuse
   - Rate limit monitoring recommended

3. **Data Validation**:
   - All Google data validated before database insertion
   - Required fields still enforced (CCB number, contact info)
   - Google fields are optional enhancements

## Troubleshooting

### "Google Places API is loading..." persists
- Check API key in `.env.local` or Vercel environment variables
- Verify Places API is enabled in Google Cloud Console
- Check browser console for CORS or API key errors
- Ensure API key restrictions allow your domain

### Autocomplete not showing results
- Verify internet connection
- Check API key quota limits in Google Cloud Console
- Try searching for well-known business names
- Verify `componentRestrictions: {country: 'us'}` if needed

### Form not auto-populating
- Check browser console for JavaScript errors
- Verify Place Details API is enabled
- Ensure `mapGooglePlaceToFormData` function is working
- Check if Place ID is valid

## Future Enhancements (Optional)
- **Refresh from Google Button**: Update existing profiles with latest Google data
- **Periodic Sync**: Scheduled job to refresh ratings/reviews
- **Photo Gallery**: Display multiple Google Business photos
- **Business Hours Display**: Show opening hours on profile
- **Review Snippets**: Display recent Google reviews
- **Search Filters**: Filter by Google rating in professional listings

## Cost Estimation
Google Places API pricing (as of 2024):
- **Autocomplete (per session)**: $2.83 per 1,000 sessions
- **Place Details**: $17 per 1,000 requests
- **Basic Data Only**: First $200/month free (Google Cloud credit)

Estimated monthly cost for 100 professionals created:
- 100 Autocomplete sessions: ~$0.28
- 100 Place Details: ~$1.70
- **Total: ~$2/month** (well within free tier)

## Support & Maintenance
- **Google Maps API Docs**: https://developers.google.com/maps/documentation/places
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Environment Variables**: https://nextjs.org/docs/basic-features/environment-variables

## Integration Checklist
- [✓] Google Cloud Console project created
- [✓] Places API enabled
- [✓] API key created and restricted
- [✓] Environment variables configured (local + Vercel)
- [✓] Database schema updated (add-google-fields.sql)
- [✓] Google Maps script loaded in layout.tsx
- [✓] GoogleBusinessSearch component created
- [✓] New professional form integrated
- [✓] API routes updated for Google fields
- [✓] Professional listings show verification badges
- [✓] Tested with real business searches

---

**Last Updated**: December 18, 2024  
**Status**: Production Ready ✅

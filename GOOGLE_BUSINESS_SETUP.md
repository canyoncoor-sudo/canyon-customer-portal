# Google Business Profile Integration Setup

## Overview
This guide will help you set up Google Business Profile integration for licensed professional listings in the Canyon Construction customer portal.

## Prerequisites
- Google Cloud Console account
- Billing enabled on Google Cloud project
- Domain/URL for API key restrictions

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: "Canyon Construction Portal"
4. Click "Create"

## Step 2: Enable Google Places API

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Places API"
3. Click on **Places API (New)** or **Places API**
4. Click **Enable**

## Step 3: Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **API Key**
3. Copy the API key immediately (you'll need this)

## Step 4: Restrict API Key (IMPORTANT for Security)

### Application Restrictions:
1. Click on your API key to edit it
2. Under "Application restrictions":
   - Select **HTTP referrers (websites)**
   - Add these referrers:
     ```
     https://canyon-customer-portal-xxt7.vercel.app/*
     http://localhost:3000/*
     ```

### API Restrictions:
1. Under "API restrictions":
   - Select **Restrict key**
   - Check **Places API**
   - Save

## Step 5: Add API Key to Your Project

### Local Development:
The `.env.local` file already has a placeholder. Replace it with your actual API key:

```bash
# In .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_google_api_key_here
```

### Vercel Production:
1. Go to [Vercel Dashboard](https://vercel.com/)
2. Select your project: **canyon-customer-portal-xxt7**
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - **Value**: Your Google API key
   - **Environments**: Production, Preview, Development
5. Click **Save**
6. **Redeploy** your application for changes to take effect

## Step 6: Run Database Migration

Run the SQL script in your Supabase SQL Editor to add Google fields:

```bash
# File: add-google-fields.sql
```

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **canyon-portal**
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy/paste contents of `add-google-fields.sql`
6. Click **Run** or press `Cmd+Enter`
7. Verify: "Success. No rows returned"

## Step 7: Test the Integration

### Test Locally:
1. Start dev server:
   ```bash
   cd ~/Desktop/canyon-customer-portal
   npm run dev
   ```

2. Login to admin portal:
   - Email: `projects@canyonconstructioninc.com`
   - Password: `bubbacutit1234!`

3. Go to **Licensed Professionals** → **Add Professional**

4. You should see:
   - "🔍 Search Google Business" section at the top
   - Search input with autocomplete
   - Type a business name (e.g., "Premier Plumbing Portland")
   - Select from dropdown
   - Form auto-fills with Google data

### Verify Features:
- ✅ Autocomplete shows business suggestions
- ✅ Selecting business auto-populates form
- ✅ "Google Verified" badge appears when linked
- ✅ Rating and reviews display
- ✅ "View on Google Maps" link works
- ✅ Manual entry toggle works as fallback

## Features Included

### 1. Business Search Component
- **File**: `components/GoogleBusinessSearch.tsx`
- Debounced autocomplete (300ms delay)
- Dropdown with business name and address
- Auto-populates form fields on selection

### 2. Google Places Utilities
- **File**: `lib/googlePlaces.ts`
- Place Autocomplete service
- Place Details fetching
- Data mapping functions
- Phone number formatting

### 3. Auto-Populated Fields
When selecting a Google Business, these fields auto-fill:
- ✅ Company Name
- ✅ Address
- ✅ Phone Number
- ✅ Trade/Business Type
- ✅ Google Rating
- ✅ Total Reviews
- ✅ Google Maps URL
- ✅ Business Photo URL
- ✅ Google Place ID

### 4. Professional Profile Display
Google-verified professionals show:
- ✅ "Google Verified" badge
- ⭐ Rating (e.g., 4.5 stars)
- 📊 Review count
- 🔗 "View on Google Maps" link

### 5. Database Schema
New columns in `subcontractors` table:
- `google_place_id` - Unique identifier
- `google_business_name` - Original name from Google
- `google_rating` - Business rating (1.0-5.0)
- `google_total_reviews` - Number of reviews
- `google_maps_url` - Direct Maps link
- `google_profile_photo_url` - Business photo
- `google_last_synced` - Last data refresh
- `is_google_verified` - Verification status

## Troubleshooting

### "Google Places API is loading..."
- Check API key is correctly added to `.env.local`
- Verify API key in browser console (should load script)
- Restart dev server after adding key

### "Failed to search businesses"
- Verify Places API is enabled in Google Cloud Console
- Check API key restrictions aren't blocking requests
- Check browser console for specific error messages

### "Autocomplete failed: REQUEST_DENIED"
- API key restrictions may be too strict
- Temporarily remove restrictions to test
- Verify referrer URLs match exactly

### Database Errors
- Ensure `add-google-fields.sql` was run successfully
- Check Supabase SQL Editor for migration errors
- Verify all 8 new columns exist in `subcontractors` table

### No Businesses Found
- Try different search terms
- Check US country restriction (can remove if needed)
- Verify internet connection
- Check Google Cloud Console quota/usage

## Cost Estimation

### Google Places API Pricing:
- **Autocomplete requests**: $2.83 per 1,000 requests
- **Place Details requests**: $17 per 1,000 requests
- **First $200/month**: FREE (Google Cloud credit)

### Estimated Usage:
- Creating 10 professionals/month: ~20 requests = **$0.40/month**
- With free tier: **$0/month** for typical usage

## API Key Security Best Practices

✅ **DO:**
- Restrict API key to your domain
- Use environment variables
- Enable only required APIs
- Monitor usage in Google Cloud Console
- Rotate keys periodically

❌ **DON'T:**
- Commit API keys to Git
- Share keys publicly
- Leave keys unrestricted
- Use same key for multiple projects

## Support Resources

- **Google Places API Docs**: https://developers.google.com/maps/documentation/places/web-service
- **Places API Pricing**: https://developers.google.com/maps/billing-and-pricing/pricing
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Environment Variables**: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables

## Next Steps (Optional Enhancements)

1. **Refresh from Google** - Add button to update existing profiles
2. **Scheduled Sync** - Cron job to refresh ratings weekly
3. **Photo Display** - Show Google business photo on profile cards
4. **Business Hours** - Display operating hours from Google
5. **Review Integration** - Show recent Google reviews
6. **Multi-location Support** - Handle businesses with multiple locations

---

**Setup complete!** Your professional profiles now integrate with Google Business, providing verified information and building customer trust.

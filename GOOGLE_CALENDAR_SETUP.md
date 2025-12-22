# Google Calendar Integration Setup Guide

## 🎯 Overview
This guide will help you connect your Canyon Construction admin calendar with Google Calendar for two-way sync.

---

## 📋 Prerequisites

1. **Google Cloud Project** (free)
2. **Google Account** with calendar access
3. **Supabase Database** (already set up)

---

## 🚀 Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"New Project"**
3. Name it: `Canyon Construction Calendar`
4. Click **"Create"**

### Step 2: Enable Google Calendar API

1. In your project, go to **"APIs & Services"** > **"Library"**
2. Search for **"Google Calendar API"**
3. Click on it and press **"Enable"**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"Create Credentials"** > **"OAuth client ID"**
3. If prompted, configure the **OAuth consent screen**:
   - User Type: **External**
   - App name: `Canyon Construction Portal`
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add **Google Calendar API** scopes
   - Add test users if needed
   - Save and continue

4. Create OAuth Client:
   - Application type: **Web application**
   - Name: `Canyon Calendar Integration`
   - Authorized redirect URIs:
     - Development: `http://localhost:3000/api/admin/calendar/google/callback`
     - Production: `https://your-domain.com/api/admin/calendar/google/callback`
   - Click **"Create"**

5. **SAVE YOUR CREDENTIALS:**
   - Copy the **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
   - Copy the **Client Secret** (looks like: `GOCSPX-abc123xyz`)

### Step 4: Add Environment Variables

Add these to your `.env.local` file:

```bash
# Google Calendar Integration
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/admin/calendar/google/callback

# For production, also set:
# GOOGLE_REDIRECT_URI=https://your-domain.vercel.app/api/admin/calendar/google/callback
```

### Step 5: Install Required Package

Run this in your terminal:

```bash
npm install googleapis
```

### Step 6: Set Up Database

1. Go to your **Supabase Dashboard**
2. Click **SQL Editor**
3. Copy and paste the contents of `google-calendar-setup.sql`
4. Click **"Run"**

This creates:
- `google_calendar_tokens` table (stores OAuth tokens)
- `calendar_events` table (stores calendar events)
- `calendar_tasks` table (stores tasks)

---

## 🔗 How to Connect

1. **Login to Admin Portal**
   - Go to `/admin/calendar`

2. **Click "Connect Google Calendar"**
   - You'll see a settings section in the calendar
   - Click the connect button

3. **Authorize the App**
   - Sign in with your Google account
   - Grant calendar permissions
   - You'll be redirected back

4. **Start Syncing!**
   - New events created in Canyon portal → automatically added to Google Calendar
   - Events show up with color coding matching your event types

---

## 🎨 Color Coding (Google Calendar)

Events sync with these colors:
- 🔵 **Meetings** → Peacock Blue
- 🔴 **Crew Scheduling** → Red
- 🟡 **Site Visits** → Yellow
- ⚫ **Appointments** → Gray
- 🔷 **Tasks** → Blueberry

---

## ✅ What Gets Synced

**From Canyon → Google:**
- Event title
- Start/end times
- Notes/description
- Event type (as color)
- Status

**Event Operations:**
- ✅ Create new events
- ✅ Update existing events
- ✅ Delete events
- ✅ Two-way sync

---

## 🔧 Troubleshooting

### "Google Calendar not connected" error
- Make sure you completed the OAuth flow
- Check that tokens are stored in Supabase
- Try disconnecting and reconnecting

### "Token expired" error
- Click "Disconnect" then "Connect" again
- This refreshes your OAuth tokens

### Events not syncing
- Check browser console for errors
- Verify API is enabled in Google Cloud
- Check redirect URI matches exactly

### Can't authorize
- Make sure you're using the correct Google account
- Check OAuth consent screen is configured
- Verify redirect URI in Google Cloud matches your .env

---

## 📱 Production Deployment

When deploying to production (Vercel):

1. Add environment variables to Vercel:
   - Go to your project settings
   - Add `GOOGLE_CLIENT_ID`
   - Add `GOOGLE_CLIENT_SECRET`
   - Add `GOOGLE_REDIRECT_URI` (with your production URL)

2. Update redirect URI in Google Cloud:
   - Add your production URL: `https://your-domain.vercel.app/api/admin/calendar/google/callback`

3. Update OAuth consent screen if needed

---

## 🔐 Security Notes

- OAuth tokens are stored encrypted in Supabase
- Access tokens expire and are automatically refreshed
- Only authorized admin users can connect calendars
- Each admin can connect their own Google Calendar

---

## 📞 Support

If you need help:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Make sure the SQL script ran successfully
4. Check Google Cloud Console for API quota/errors

---

## 🎉 That's it!

Once set up, your Canyon Construction calendar will sync seamlessly with Google Calendar!

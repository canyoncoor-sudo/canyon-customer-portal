# 🚀 Quick Start: Google Calendar Integration

## ✅ What's Already Set Up

1. **API Routes Created:**
   - `/api/admin/calendar/google/auth` - Generates auth URL
   - `/api/admin/calendar/google/callback` - Handles OAuth callback
   - `/api/admin/calendar/google/sync` - Syncs events to Google
   - `/api/admin/calendar/google/status` - Check connection status

2. **UI Components Added:**
   - "Connect Google Calendar" button in calendar header
   - Settings panel with connection status
   - Automatic sync on event create/delete

3. **Database Schema:**
   - `google-calendar-setup.sql` ready to run in Supabase

---

## 📝 Setup Steps (5 minutes)

### Step 1: Google Cloud Setup

1. Go to https://console.cloud.google.com/
2. Create new project: "Canyon Calendar"
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials:
   - Authorized redirect URI: `http://localhost:3000/api/admin/calendar/google/callback`
5. Copy Client ID and Secret

### Step 2: Add Environment Variables

Add to `.env.local`:

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/admin/calendar/google/callback
```

### Step 3: Database Setup

1. Open Supabase SQL Editor
2. Run `google-calendar-setup.sql`
3. Verify tables created

### Step 4: Test It

1. Start dev server: `npm run dev`
2. Login to admin portal
3. Go to Calendar page
4. Click "Connect Google Calendar"
5. Authorize with Google
6. Create an event - it syncs to Google! 🎉

---

## 🎨 How It Works

### Event Creation Flow:
1. User creates event in Canyon portal
2. Event saved to local state
3. `syncEventToGoogle()` automatically called
4. Event appears in Google Calendar with correct color

### Color Mapping:
- Meetings → Blue (#567A8D)
- Crew → Red (#712A18)
- Site Visits → Yellow (#9A8C7A)
- Appointments → Gray (#454547)
- Tasks → Dark Blue (#261312)

---

## 🔧 Troubleshooting

**"Google Calendar not connected"**
- Check environment variables are set
- Verify OAuth redirect URI matches exactly
- Try disconnecting and reconnecting

**Events not syncing**
- Check browser console for errors
- Verify Google Calendar API is enabled
- Check Supabase table has token stored

**Can't authorize**
- Make sure OAuth consent screen is configured
- Add yourself as test user if in development
- Check redirect URI in Google Cloud Console

---

## 📚 Full Documentation

See `GOOGLE_CALENDAR_SETUP.md` for complete setup instructions.

---

## ✨ What's Next

- Events sync TO Google Calendar ✅
- Add sync FROM Google Calendar (import events)
- Add webhook for real-time updates
- Support multiple calendars
- Batch sync for existing events

---

Ready to connect? Just add your Google credentials and click connect!

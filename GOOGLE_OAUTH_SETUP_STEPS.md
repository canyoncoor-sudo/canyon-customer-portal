# Google Calendar OAuth Setup - Step by Step

You're currently in Google Cloud Console and need to create OAuth credentials for the Canyon portal.

## Current Setup Status
✅ Code is ready in your Canyon portal
✅ Google Calendar integration built
⚠️ Need OAuth credentials from Google Cloud

---

## Step-by-Step Instructions

### 1. In Google Cloud Console - Create/Select Project

1. Make sure you have a project selected (top left dropdown)
2. If no project exists, create one:
   - Click "Select a project" dropdown
   - Click "NEW PROJECT"
   - Name: "Canyon Calendar Integration"
   - Click "CREATE"

### 2. Enable Google Calendar API

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for "Google Calendar API"
3. Click on "Google Calendar API"
4. Click **"ENABLE"**
5. Wait for it to enable

### 3. Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** (unless you have Google Workspace)
3. Click **"CREATE"**

**App Information:**
- App name: `Canyon Construction Calendar`
- User support email: Your email
- Developer contact: Your email

**Scopes (IMPORTANT):**
4. Click **"ADD OR REMOVE SCOPES"**
5. Find and check:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
6. Click **"UPDATE"**
7. Click **"SAVE AND CONTINUE"**

**Test Users:**
8. Add your Google email as a test user
9. Click **"SAVE AND CONTINUE"**

### 4. Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**

**CRITICAL - Application Type:**
4. **Application type:** Select **"Web application"**
   (NOT Chrome app, NOT Desktop app)

**Name:**
5. Name: `Canyon Portal Calendar Integration`

**Authorized redirect URIs:**
6. Click **"+ ADD URI"**
7. Enter EXACTLY: `http://localhost:3000/api/admin/calendar/google/callback`
8. For production, also add: `https://yourdomain.com/api/admin/calendar/google/callback`

**LEAVE BLANK:**
- Authorized JavaScript origins (not needed)
- Any "Store ID" field (only for Chrome apps, should not appear for Web application)

9. Click **"CREATE"**

### 5. Copy Your Credentials

A popup will show your credentials:

```
Client ID: something.apps.googleusercontent.com
Client Secret: GOCSPX-something
```

**COPY BOTH** - you'll need them in the next step!

---

## Next Steps - Add to Canyon Portal

After you have your Client ID and Client Secret, you need to add them to your `.env.local` file:

### Open Terminal and Run:

```bash
cd ~/Desktop/canyon-customer-portal
```

```bash
cat >> .env.local << 'ENVEOF'

# Google Calendar Integration
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-YOUR_SECRET_HERE
GOOGLE_REDIRECT_URI=http://localhost:3000/api/admin/calendar/google/callback
ENVEOF
```

**Replace `YOUR_CLIENT_ID_HERE` and `YOUR_SECRET_HERE` with your actual credentials!**

### Then Run the Database Setup:

1. Go to Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
2. Copy the contents of `google-calendar-setup.sql`
3. Paste and run it

### Test the Connection:

```bash
npm run dev
```

1. Open http://localhost:3000
2. Login to admin portal
3. Go to Calendar page
4. Click "Connect Google Calendar"
5. Authorize with your Google account
6. Start creating events!

---

## Troubleshooting

**If you see "Store ID" field:**
- You selected the wrong application type
- Go back and make sure you select **"Web application"**
- Delete the credential and start over

**If authorization fails:**
- Check your redirect URI is EXACTLY: `http://localhost:3000/api/admin/calendar/google/callback`
- No trailing slash
- Must match exactly

**If you see "This app isn't verified":**
- This is normal for testing
- Click "Advanced" → "Go to Canyon Construction Calendar (unsafe)"
- In production, you'd submit for verification


# Google Calendar Setup for Vercel Production

## Error: "OAuth client was not found" or "Error 401: invalid_client"

This means the Google Calendar OAuth isn't configured correctly for production. Follow these steps:

---

## Step 1: Get Your Vercel Production URL

Your production URL should be something like:
- `https://canyon-customer-portal.vercel.app`
- Or a custom domain if you've set one up

**Find it in Vercel:**
1. Go to your Vercel dashboard
2. Look at your deployment URL (top of the page)

---

## Step 2: Update Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Under **"Authorized redirect URIs"**, add your production callback URL:

```
https://YOUR-VERCEL-DOMAIN.vercel.app/api/admin/calendar/google/callback
```

**Example:**
```
https://canyon-customer-portal.vercel.app/api/admin/calendar/google/callback
```

4. Click **"SAVE"**

---

## Step 3: Add Environment Variables in Vercel

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add these 3 variables (get values from your .env.local file):

### Variable 1: GOOGLE_CLIENT_ID
```
Your Google Client ID from .env.local
```

### Variable 2: GOOGLE_CLIENT_SECRET
```
Your Google Client Secret from .env.local
```

### Variable 3: GOOGLE_REDIRECT_URI
```
https://YOUR-VERCEL-DOMAIN.vercel.app/api/admin/calendar/google/callback
```

**⚠️ Important:** Replace `YOUR-VERCEL-DOMAIN.vercel.app` with your actual Vercel URL!

---

## Step 4: Redeploy

After adding the environment variables:

1. Go to Vercel → **Deployments**
2. Click the **"..."** menu on your latest deployment
3. Click **"Redeploy"**

OR just push a new commit to trigger a deployment.

---

## Step 5: Test

1. Go to your production URL
2. Login: `admin@canyonconstructioninc.com` / `admin123`
3. Go to **Calendar** page
4. Click **"Connect Google Calendar"**
5. Should redirect to Google for authorization

---

## Troubleshooting

### Still getting "OAuth client not found"?
- Double-check the Client ID and Secret in Vercel match your .env.local values
- Make sure there are no extra spaces or quotes in the environment variables
- Verify the redirect URI in Google Cloud Console is EXACTLY the same as in Vercel

### Getting "redirect_uri_mismatch"?
- The redirect URI in Vercel environment variables must EXACTLY match one in Google Cloud Console
- Check for trailing slashes (don't include one)
- Make sure it's `https://` not `http://`

### Environment variables not working?
- They only apply to NEW deployments
- You must redeploy after adding them
- Check they're set for "Production" environment

---

## Quick Reference

**Where to find your credentials:**
- Check your local `.env.local` file for `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

**Required Redirect URIs in Google Cloud Console:**
1. Local: `http://localhost:3000/api/admin/calendar/google/callback`
2. Production: `https://YOUR-VERCEL-DOMAIN/api/admin/calendar/google/callback`


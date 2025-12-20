# Email Sending Setup Guide

## Overview
The portal can send emails directly to customers using Resend (a modern email API service).

## Quick Setup (5 minutes)

### Step 1: Get a Free Resend Account
1. Go to https://resend.com
2. Sign up for a free account
3. Free tier includes: **100 emails/day** (perfect for getting started)

### Step 2: Get Your API Key
1. After signing up, go to your Resend dashboard
2. Click "API Keys" in the sidebar
3. Click "Create API Key"
4. Give it a name (e.g., "Canyon Portal")
5. Copy the API key (starts with `re_`)

### Step 3: Add to Your Portal
1. Open `.env.local` file in your project root
2. Add this line:
   ```
   RESEND_API_KEY=re_your_api_key_here
   ```
3. Save the file
4. Restart your development server (if running)

### Step 4: Test It!
1. Go to any job → "Send Proposal Email"
2. Review the email
3. Click "📧 Send Email Now"
4. Email will be sent instantly! ✅

## Features

### What Works Now:
✅ Send emails directly from the portal
✅ No need to open Gmail/Outlook
✅ Automatic email with customer's name, access code, and portal link
✅ Edit email content before sending
✅ Success/error notifications

### Button Explanations:
- **📧 Send Email Now** - Sends immediately from the system
- **📧 Open in Email Client** - Opens your Outlook/Gmail app
- **📋 Copy Email Body** - Copy text to paste anywhere

## Email Sending Limits

### Free Tier (Resend):
- 100 emails per day
- 1 email per second
- Perfect for most small businesses

### Need More?
- Paid plans start at $20/month for 50,000 emails
- See https://resend.com/pricing

## Customizing the "From" Address

By default, emails come from `onboarding@resend.dev` (a test address).

### To use your own domain (e.g., `projects@canyonconstructioninc.com`):

1. In Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter your domain: `canyonconstructioninc.com`
4. Follow Resend's instructions to add DNS records
5. Once verified, update the API code:
   - Open `/app/api/admin/send-email/route.ts`
   - Change line: `from: 'Canyon Construction <projects@canyonconstructioninc.com>'`

## Troubleshooting

### "Email service not configured" error
- Make sure `RESEND_API_KEY` is in your `.env.local` file
- Restart your dev server after adding it

### Email not received
- Check spam/junk folder
- Verify the customer email is correct
- Check Resend dashboard for delivery logs

### Need to test?
- Use your own email first
- Create a test job with your email address
- Send yourself a proposal to verify it works

## Alternative: Keep Using Email Client

If you prefer to keep using Outlook/Gmail:
- Just click "Open in Email Client" button
- Your email app will open with everything pre-filled
- Review and send from there

Both options work great - choose what you prefer!

## Security Notes

- Your API key is private - never share it
- It's stored in `.env.local` (not committed to GitHub)
- Each email is logged in Resend for tracking
- Customers only see the email, not your API key

## Questions?

The system works perfectly without email setup - you can still:
- Generate proposals
- Create access codes
- Use "Open in Email Client" button
- Copy email content

The "Send Email Now" button just makes it faster! 🚀

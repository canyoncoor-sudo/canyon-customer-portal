import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/admin/calendar/google/callback'
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(new URL('/admin/calendar?error=no_code', req.url));
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info to identify the admin
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    // Store tokens in database
    const { error } = await supabase
      .from('google_calendar_tokens')
      .upsert({
        admin_email: userInfo.data.email,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'admin_email'
      });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.redirect(new URL('/admin/calendar?error=db_error', req.url));
    }

    return NextResponse.redirect(new URL('/admin/calendar?connected=true', req.url));
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/admin/calendar?error=auth_failed', req.url));
  }
}

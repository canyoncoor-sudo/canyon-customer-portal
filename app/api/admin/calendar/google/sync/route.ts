import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminToken } from '@/lib/verify-token';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/admin/calendar/google/callback'
);

export async function POST(req: NextRequest) {
  try {
    // Verify admin token
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyAdminToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { event, action } = body; // action: 'create', 'update', 'delete'

    // Get stored tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('google_calendar_tokens')
      .select('*')
      .eq('admin_email', decoded.email)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: 'Google Calendar not connected' }, { status: 400 });
    }

    // Set credentials
    oauth2Client.setCredentials({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expiry_date: tokenData.expiry_date
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    let result;

    if (action === 'create') {
      // Create event in Google Calendar
      const googleEvent = {
        summary: event.title,
        description: event.notes || '',
        start: {
          dateTime: event.start,
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: event.end,
          timeZone: 'America/Los_Angeles',
        },
        colorId: getColorId(event.type),
        extendedProperties: {
          private: {
            canyonEventId: event.id,
            canyonEventType: event.type,
            canyonStatus: event.status
          }
        }
      };

      result = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: googleEvent,
      });

      // Store Google event ID
      await supabase
        .from('calendar_events')
        .update({ google_event_id: result.data.id })
        .eq('id', event.id);

    } else if (action === 'update' && event.google_event_id) {
      // Update event in Google Calendar
      const googleEvent = {
        summary: event.title,
        description: event.notes || '',
        start: {
          dateTime: event.start,
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: event.end,
          timeZone: 'America/Los_Angeles',
        },
        colorId: getColorId(event.type),
      };

      result = await calendar.events.update({
        calendarId: 'primary',
        eventId: event.google_event_id,
        requestBody: googleEvent,
      });

    } else if (action === 'delete' && event.google_event_id) {
      // Delete event from Google Calendar
      await calendar.events.delete({
        calendarId: 'primary',
        eventId: event.google_event_id,
      });

      result = { data: { deleted: true } };
    }

    return NextResponse.json({ 
      success: true, 
      googleEventId: result?.data?.id 
    });

  } catch (error: any) {
    console.error('Google Calendar sync error:', error);
    
    // Handle token refresh if needed
    if (error.code === 401) {
      return NextResponse.json({ 
        error: 'Token expired, please reconnect Google Calendar' 
      }, { status: 401 });
    }

    return NextResponse.json({ 
      error: error.message || 'Sync failed' 
    }, { status: 500 });
  }
}

// Map Canyon event types to Google Calendar colors
function getColorId(type: string): string {
  const colorMap: { [key: string]: string } = {
    'meeting': '7',      // Peacock blue
    'crew': '11',        // Red
    'site_visit': '5',   // Banana yellow
    'appointment': '8',  // Graphite gray
    'task': '9'          // Blueberry blue
  };
  return colorMap[type] || '1';
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
      jwt.verify(token, secret);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Fetch all calendar events from Google Calendar sync
    const { data: events, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching calendar events:', error);
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }

    // Format events for the calendar
    const formattedEvents = (events || []).map(event => ({
      id: event.id,
      title: event.summary || event.title || 'Untitled Event',
      type: event.event_type || 'appointment',
      start: event.start_time,
      end: event.end_time,
      customer_name: event.customer_name || '',
      job_id: event.job_id || '',
      status: event.status || 'scheduled',
      notes: event.description || '',
      assignedTo: event.attendees || ''
    }));

    return NextResponse.json({ events: formattedEvents });
  } catch (error) {
    console.error('Calendar events API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
      jwt.verify(token, secret);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const eventData = await request.json();

    // Create event in calendar_events table
    const { data: event, error } = await supabase
      .from('calendar_events')
      .insert({
        summary: eventData.title,
        event_type: eventData.type,
        start_time: eventData.start,
        end_time: eventData.end,
        customer_name: eventData.customer_name,
        job_id: eventData.job_id,
        status: eventData.status || 'scheduled',
        description: eventData.notes,
        attendees: eventData.assignedTo
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Create event API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
      jwt.verify(token, secret);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get event ID from URL
    const url = new URL(request.url);
    const eventId = url.pathname.split('/').pop();

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }

    // Delete the event
    const { error: deleteError } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', eventId);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete event', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


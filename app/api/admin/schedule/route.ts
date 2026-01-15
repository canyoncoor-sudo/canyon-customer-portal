import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminToken } from '@/lib/verify-token';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/admin/schedule - Get all schedule events with project and customer info
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const admin = verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // Filter by status (pending, accepted, completed, etc.)
    const eventType = searchParams.get('type'); // Filter by event type

    let query = supabase
      .from('schedule_events')
      .select(`
        *,
        projects:project_id (
          id,
          project_name,
          project_type,
          customers:customer_id (
            id,
            name,
            email,
            phone,
            address,
            city,
            state,
            zip_code
          )
        )
      `)
      .order('start_time', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    if (eventType) {
      query = query.eq('event_type', eventType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Schedule fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data to match calendar format
    const events = (data || []).map(event => ({
      id: event.id,
      title: event.event_title,
      type: event.event_type,
      start: event.start_time,
      end: event.end_time,
      location: event.location,
      attendees: event.attendees,
      notes: event.notes,
      status: event.status,
      project_id: event.project_id,
      project_name: event.projects?.project_name,
      customer_name: event.projects?.customers?.name,
      customer_email: event.projects?.customers?.email,
      customer_phone: event.projects?.customers?.phone,
      created_at: event.created_at
    }));

    return NextResponse.json({ events });

  } catch (error: any) {
    console.error('Schedule GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/admin/schedule - Create new schedule event
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const admin = verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const {
      project_id,
      event_title,
      event_type,
      start_time,
      end_time,
      location,
      attendees,
      notes,
      status
    } = body;

    const { data, error } = await supabase
      .from('schedule_events')
      .insert({
        project_id,
        event_title,
        event_type: event_type || 'meeting',
        start_time,
        end_time,
        location: location || null,
        attendees: attendees || [],
        notes: notes || null,
        status: status || 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Schedule creation error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ event: data });

  } catch (error: any) {
    console.error('Schedule POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/schedule - Update schedule event (e.g., change status)
export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const admin = verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('schedule_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Schedule update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ event: data });

  } catch (error: any) {
    console.error('Schedule PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminToken } from '@/lib/verify-token';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyAdminToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user has connected Google Calendar
    const { data, error } = await supabase
      .from('google_calendar_tokens')
      .select('admin_email, updated_at')
      .eq('admin_email', decoded.email)
      .single();

    if (error || !data) {
      return NextResponse.json({ connected: false });
    }

    return NextResponse.json({ 
      connected: true,
      email: data.admin_email,
      lastSync: data.updated_at
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({ connected: false });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyAdminToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Disconnect Google Calendar
    await supabase
      .from('google_calendar_tokens')
      .delete()
      .eq('admin_email', decoded.email);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Disconnect error:', error);
    return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 });
  }
}

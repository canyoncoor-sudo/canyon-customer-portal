import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/verify-admin-token';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const adminData = await verifyAdminToken(token);
    
    if (!adminData) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Fetch all professionals (not tied to specific jobs)
    const { data: professionals, error } = await supabaseAdmin
      .from('subcontractors')
      .select('id, company_name, trade, ccb_number, contact_name, phone, email, created_at')
      .is('job_id', null) // Only get master list professionals
      .order('company_name', { ascending: true });

    if (error) {
      console.error('Error fetching professionals:', error);
      return NextResponse.json({ error: 'Failed to fetch professionals' }, { status: 500 });
    }

    return NextResponse.json({ professionals: professionals || [] });
  } catch (error) {
    console.error('Error in professionals API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

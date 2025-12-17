import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/verify-admin-token';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { company_name, trade, ccb_number, contact_name, phone, email, address, notes } = body;

    // Validate required fields
    console.log('Received data:', { company_name, trade, ccb_number, contact_name, phone, email });
    if (!company_name || !trade || !ccb_number || !contact_name || !phone || !email) {
      console.log('Missing fields:', { 
        company_name: !company_name, 
        trade: !trade, 
        ccb_number: !ccb_number, 
        contact_name: !contact_name, 
        phone: !phone, 
        email: !email 
      });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert professional into subcontractors table (with job_id = null for master list)
    const { data: professional, error } = await supabaseAdmin
      .from('subcontractors')
      .insert({
        job_id: null, // Master list professionals don't have a job_id
        company_name,
        trade,
        ccb_number,
        contact_name,
        phone,
        email,
        address,
        notes,
        status: 'Active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating professional:', error);
      return NextResponse.json({ error: 'Failed to create professional' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      professional 
    });
  } catch (error) {
    console.error('Error in /api/admin/professionals/create:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/verify-admin-token';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcrypt';

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
    const { 
      customer_name, 
      project_address, 
      email, 
      phone, 
      project_description, 
      access_code,
      expiration_days 
    } = body;

    // Validate required fields
    if (!customer_name || !project_address || !email || !phone || !access_code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Hash the access code
    const hashedCode = await bcrypt.hash(access_code, 10);

    // Calculate expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + parseInt(expiration_days || '30'));

    // Insert into portal_jobs table
    const { data: job, error: jobError } = await supabaseAdmin
      .from('portal_jobs')
      .insert({
        job_address: project_address,
        customer_name,
        customer_email: email,
        customer_phone: phone,
        project_description,
        access_code_hash: hashedCode,
        status: 'proposal',
        proposal_expires_at: expirationDate.toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (jobError) {
      console.error('Error creating job:', jobError);
      return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      proposal: job,
      access_info: {
        address: project_address,
        code: access_code
      }
    });
  } catch (error) {
    console.error('Error in /api/admin/proposals/create:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

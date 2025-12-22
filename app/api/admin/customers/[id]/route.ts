import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || process.env.PORTAL_JWT_SECRET || 'admin-secret-key'
);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    try {
      await jwtVerify(token, ADMIN_JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id } = await params;
    const updatedData = await request.json();

    // Update customer information in portal_jobs table
    const { data: job, error } = await supabase
      .from('portal_jobs')
      .update({
        customer_name: updatedData.customer_name,
        customer_email: updatedData.customer_email,
        customer_phone: updatedData.customer_phone,
        customer_phone_2: updatedData.customer_phone_2,
        job_address: updatedData.job_address,
        city: updatedData.city,
        state: updatedData.state,
        zip_code: updatedData.zip_code,
        project_type: updatedData.project_type,
        project_description: updatedData.project_description,
        estimated_budget: updatedData.estimated_budget,
        estimated_timeline: updatedData.estimated_timeline,
        status: updatedData.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update customer:', error);
      return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
    }

    return NextResponse.json({ job });

  } catch (error) {
    console.error('Customer update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

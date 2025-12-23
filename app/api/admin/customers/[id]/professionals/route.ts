import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-secret-key';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: customerId } = await params;
    
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { professional_id, description, start_date, status = 'Active' } = body;

    if (!professional_id || !description || !start_date) {
      return NextResponse.json(
        { error: 'Missing required fields: professional_id, description, start_date' },
        { status: 400 }
      );
    }

    // Get the job ID for this customer
    const { data: customer, error: customerError } = await supabase
      .from('portal_jobs')
      .select('id')
      .eq('id', customerId)
      .single();

    if (customerError || !customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Add the professional to job_professionals table
    const { data: assignment, error: assignmentError } = await supabase
      .from('job_professionals')
      .insert({
        job_id: customer.id,
        professional_id: professional_id,
        description,
        start_date,
        status,
      })
      .select()
      .single();

    if (assignmentError) {
      console.error('Assignment error:', assignmentError);
      return NextResponse.json(
        { error: assignmentError.message || 'Failed to assign professional' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Professional added to customer portal successfully',
      assignment,
    });
  } catch (error) {
    console.error('Error adding professional to customer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

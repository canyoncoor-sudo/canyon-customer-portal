import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/verify-admin-token';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id: jobId } = await context.params;
    const body = await req.json();
    const { 
      customerName,
      customerAddress,
      customerPhone,
      customerEmail,
      lineItems,
      totalCost
    } = body;

    // Validate required fields
    if (!customerName || !customerAddress || !customerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update the job with proposal data
    const { data: job, error: jobError } = await supabaseAdmin
      .from('portal_jobs')
      .update({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        proposal_data: {
          lineItems: lineItems || [],
          totalCost: totalCost || 0,
          createdAt: new Date().toISOString()
        },
        status: 'proposal_created',
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId)
      .select()
      .single();

    if (jobError) {
      console.error('Error updating job with proposal:', jobError);
      return NextResponse.json({ error: 'Failed to save proposal' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      job,
      projectId: jobId
    });
  } catch (error) {
    console.error('Error in /api/admin/jobs/[id]/proposal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

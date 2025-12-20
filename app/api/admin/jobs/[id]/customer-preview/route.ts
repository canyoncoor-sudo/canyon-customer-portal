import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/verify-token';
import { signPortalToken } from '@/lib/jwt';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin token
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const adminPayload = await verifyAdminToken(token);

    if (!adminPayload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const params = await context.params;
    const jobId = params.id;

    // Verify the job exists
    const { data: job, error } = await supabase
      .from('portal_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Generate a customer portal token for this job
    const customerToken = await signPortalToken(jobId);

    return NextResponse.json({
      token: customerToken,
      job: {
        id: job.id,
        customer_name: job.customer_name,
        job_address: job.job_address,
        status: job.status,
      },
    });
  } catch (error: any) {
    console.error('Customer preview error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

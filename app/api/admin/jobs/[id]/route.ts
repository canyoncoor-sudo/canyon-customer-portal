import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/verify-admin-token';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
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

    const jobId = params.id;

    // Fetch job details from portal_jobs
    const { data: job, error: jobError } = await supabaseAdmin
      .from('portal_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Fetch job intake details if they exist
    const { data: intake, error: intakeError } = await supabaseAdmin
      .from('job_intakes')
      .select('*')
      .eq('job_id', jobId)
      .maybeSingle();

    // Combine job and intake data
    const jobDetails = {
      ...job,
      intake: intake || null
    };

    return NextResponse.json({ job: jobDetails });
  } catch (error) {
    console.error('Error fetching job details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

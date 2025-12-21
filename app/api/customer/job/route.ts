import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify JWT token
    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'canyon_portal_secret_2024');
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!payload || !payload.jobId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Fetch job data
    const { data: job, error } = await supabase
      .from('portal_jobs')
      .select('*')
      .eq('id', payload.jobId)
      .single();

    if (error || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({
      job: {
        id: job.id,
        customer_name: job.customer_name,
        job_address: job.job_address,
        status: job.status,
        customer_email: job.customer_email,
        customer_phone: job.customer_phone,
        home_photo_url: job.home_photo_url,
        project_description: job.project_description,
        proposal_data: job.proposal_data,
        has_proposal: job.status === 'proposal_created' && job.proposal_data !== null,
      },
    });
  } catch (error: any) {
    console.error('Customer job fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

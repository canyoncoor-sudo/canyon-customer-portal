import { NextRequest, NextResponse } from 'next/server';
import { verifyJob } from '@/lib/verify-job';
import { signPortalToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const { address, code } = await req.json();

    if (!address || !code) {
      return NextResponse.json(
        { error: 'Address and code are required.' },
        { status: 400 }
      );
    }

    const result = await verifyJob(address, code);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    const token = await signPortalToken(result.job.id);

    return NextResponse.json({
      token,
      job: {
        id: result.job.id,
        customer_name: result.job.customer_name,
        job_address: result.job.job_address,
        status: result.job.status,
      },
    });
  } catch (e: any) {
    console.error('Verification error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

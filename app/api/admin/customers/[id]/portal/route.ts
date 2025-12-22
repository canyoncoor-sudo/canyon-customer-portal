import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    try {
      jwt.verify(token, process.env.ADMIN_JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Fetch job details
    const { data: job, error: jobError } = await supabase
      .from('portal_jobs')
      .select('*')
      .eq('id', resolvedParams.id)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Fetch documents (placeholder - will be implemented later)
    const documents: any[] = [];

    // Fetch photos (placeholder - will be implemented later)
    const photos: any[] = [];

    // Fetch timeline (placeholder - will be implemented later)
    const timeline: any[] = [];

    // Fetch payments (placeholder - will be implemented later)
    const payments: any[] = [];

    return NextResponse.json({
      job,
      documents,
      photos,
      timeline,
      payments,
    });

  } catch (error) {
    console.error('Customer portal fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

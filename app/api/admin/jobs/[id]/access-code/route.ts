import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/verify-admin-token';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: jobId } = await params;
    const body = await req.json();
    const { access_code, expiration_days } = body;

    if (!access_code) {
      return NextResponse.json({ error: 'Access code is required' }, { status: 400 });
    }

    // Hash the access code
    const hashedCode = await bcrypt.hash(access_code, 10);

    // Calculate expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + (expiration_days || 30));

    // Update the portal_jobs record with access code
    const { data: job, error: jobError } = await supabaseAdmin
      .from('portal_jobs')
      .update({
        access_code_hash: hashedCode,
        access_code_type: 'proposal',
        access_code_expires_at: expirationDate.toISOString(),
        status: 'proposal_sent',
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId)
      .select()
      .single();

    if (jobError) {
      console.error('Error updating job:', jobError);
      return NextResponse.json({ error: 'Failed to create access code' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      job,
      access_info: {
        code: access_code,
        expires_at: expirationDate.toISOString()
      }
    });
  } catch (error) {
    console.error('Error in /api/admin/jobs/[id]/access-code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

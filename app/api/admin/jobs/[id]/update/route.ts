import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/verify-admin-token';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('\n🔵 PUT /api/admin/jobs/[id]/update - Request received');
  
  try {
    const authHeader = req.headers.get('authorization');
    console.log('🔐 Auth header present:', !!authHeader);
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('❌ No Bearer token found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const adminData = await verifyAdminToken(token);
    
    if (!adminData) {
      console.log('❌ Token verification failed');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    console.log('✅ Token verified for admin:', adminData.email);

    const { id: jobId } = await params;
    console.log('📝 Job ID:', jobId);
    
    const body = await req.json();
    console.log('📦 Request body:', JSON.stringify(body, null, 2));
    
    const {
      customer_name,
      customer_email,
      customer_phone,
      job_address,
      status,
      intake
    } = body;

    // Update portal_jobs table
    console.log('🔄 Updating portal_jobs...');
    const { error: jobError } = await supabaseAdmin
      .from('portal_jobs')
      .update({
        customer_name,
        customer_email,
        customer_phone,
        job_address,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

    if (jobError) {
      console.error('❌ Error updating portal_jobs:', jobError);
      return NextResponse.json({
        error: jobError.message || 'Failed to update job',
        details: typeof jobError === 'object' ? JSON.stringify(jobError, null, 2) : String(jobError)
      }, { status: 500 });
    }
    
    console.log('✅ portal_jobs updated successfully');

    // Check if job_intake exists
    console.log('🔍 Checking for existing job_intake...');
    const { data: existingIntake } = await supabaseAdmin
      .from('job_intakes')
      .select('id')
      .eq('job_id', jobId)
      .maybeSingle();

    if (existingIntake) {
      console.log('✅ Found existing intake, updating...');
      // Update existing intake
      const { error: intakeError } = await supabaseAdmin
        .from('job_intakes')
        .update({
          customer_secondary_phone: intake.customer_secondary_phone,
          job_city: intake.job_city,
          job_state: intake.job_state,
          job_zip: intake.job_zip,
          project_type: intake.project_type,
          work_description: intake.work_description,
          estimated_budget: intake.estimated_budget,
          timeline: intake.timeline,
          first_meeting_datetime: intake.first_meeting_datetime,
          meeting_notes: intake.meeting_notes,
          lead_source: intake.lead_source,
          priority: intake.priority,
          internal_notes: intake.internal_notes,
          updated_at: new Date().toISOString()
        })
        .eq('job_id', jobId);

      if (intakeError) {
        console.error('❌ Error updating job_intakes:', intakeError);
        return NextResponse.json({
          error: intakeError.message || 'Failed to update job intake',
          details: typeof intakeError === 'object' ? JSON.stringify(intakeError, null, 2) : String(intakeError)
        }, { status: 500 });
      }
      console.log('✅ job_intakes updated successfully');
    } else {
      console.log('➕ No existing intake found, creating new...');
      // Create new intake
      const { error: intakeError } = await supabaseAdmin
        .from('job_intakes')
        .insert({
          job_id: jobId,
          customer_secondary_phone: intake.customer_secondary_phone,
          job_city: intake.job_city,
          job_state: intake.job_state,
          job_zip: intake.job_zip,
          project_type: intake.project_type,
          work_description: intake.work_description,
          estimated_budget: intake.estimated_budget,
          timeline: intake.timeline,
          first_meeting_datetime: intake.first_meeting_datetime,
          meeting_notes: intake.meeting_notes,
          lead_source: intake.lead_source,
          priority: intake.priority,
          internal_notes: intake.internal_notes
        });

      if (intakeError) {
        console.error('❌ Error creating job_intakes:', intakeError);
        return NextResponse.json({
          error: intakeError.message || 'Failed to create job intake',
          details: typeof intakeError === 'object' ? JSON.stringify(intakeError, null, 2) : String(intakeError)
        }, { status: 500 });
      }
      console.log('✅ job_intakes created successfully');
    }

    console.log('🎉 Job update completed successfully\n');
    return NextResponse.json({ 
      success: true,
      message: 'Job updated successfully'
    });
  } catch (error: any) {
    console.error('❌ Exception during update:', error);
    return NextResponse.json({
      error: error?.message || 'Internal server error',
      details: typeof error === 'object' ? JSON.stringify(error, null, 2) : String(error)
    }, { status: 500 });
  }
}

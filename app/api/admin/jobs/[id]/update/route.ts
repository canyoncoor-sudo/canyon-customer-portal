import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/verify-admin-token';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PUT(
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
    
    const {
      customer_name,
      customer_email,
      customer_phone,
      job_address,
      status,
      intake
    } = body;

    // Update portal_jobs table
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
      console.error('Error updating job:', jobError);
      return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
    }

    // Check if job_intake exists
    const { data: existingIntake } = await supabaseAdmin
      .from('job_intakes')
      .select('id')
      .eq('job_id', jobId)
      .maybeSingle();

    if (existingIntake) {
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
        console.error('Error updating intake:', intakeError);
        return NextResponse.json({ error: 'Failed to update job intake' }, { status: 500 });
      }
    } else {
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
        console.error('Error creating intake:', intakeError);
        return NextResponse.json({ error: 'Failed to create job intake' }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Job updated successfully'
    });
  } catch (error) {
    console.error('Error in /api/admin/jobs/[id]/update:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

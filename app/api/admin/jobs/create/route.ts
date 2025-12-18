import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/verify-admin-token';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcrypt';

function generateAccessCode(): string {
  const number = Math.floor(1000 + Math.random() * 9000);
  return `CANYON-${number}`;
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_secondary_phone,
      job_address,
      job_city,
      job_state,
      job_zip,
      project_type,
      work_description,
      estimated_budget,
      timeline,
      first_meeting_date,
      first_meeting_time,
      meeting_notes,
      lead_source,
      priority,
      internal_notes
    } = body;

    // Validate required fields
    if (!customer_name || !customer_email || !customer_phone || !job_address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate access code and hash it
    const accessCode = generateAccessCode();
    const accessCodeHash = await bcrypt.hash(accessCode, 10);

    // Prepare full address
    const fullAddress = [job_address, job_city, job_state, job_zip]
      .filter(Boolean)
      .join(', ');

    // Combine meeting date and time if both provided
    let meetingDateTime = null;
    if (first_meeting_date && first_meeting_time) {
      meetingDateTime = `${first_meeting_date}T${first_meeting_time}`;
    } else if (first_meeting_date) {
      meetingDateTime = `${first_meeting_date}T09:00:00`;
    }

    // Create job intake record in portal_jobs table
    const { data: job, error: jobError } = await supabaseAdmin
      .from('portal_jobs')
      .insert({
        job_address: fullAddress,
        customer_name,
        customer_email,
        customer_phone,
        access_code_hash: accessCodeHash,
        access_code_type: 'intake', // New status for job intake
        is_active: false, // Not active until proposal is created
        status: 'New Lead',
        // Additional fields we'll store in a separate table or as JSON
      })
      .select()
      .single();

    if (jobError) {
      console.error('Error creating job:', jobError);
      return NextResponse.json(
        { error: 'Failed to create job intake' },
        { status: 500 }
      );
    }

    // Create detailed job intake record (we'll need a new table for this)
    const { data: intake, error: intakeError } = await supabaseAdmin
      .from('job_intakes')
      .insert({
        job_id: job.id,
        customer_secondary_phone,
        job_city,
        job_state,
        job_zip,
        project_type,
        work_description,
        estimated_budget,
        timeline,
        first_meeting_datetime: meetingDateTime,
        meeting_notes,
        lead_source,
        priority,
        internal_notes
      })
      .select()
      .single();

    if (intakeError) {
      console.error('Error creating intake details:', intakeError);
      // Job was created, but intake details failed - still return success
      // The details can be added later
    }

    return NextResponse.json({
      success: true,
      job: {
        ...job,
        intake_details: intake
      },
      accessCode // Return the plain access code so admin can see it
    });

  } catch (error) {
    console.error('Error in POST /api/admin/jobs/create:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

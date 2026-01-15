import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminToken } from '@/lib/verify-token';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const admin = verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { customer, project, scheduleMeeting } = body;

    // Step 1: Create customer record
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .insert({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        secondary_phone: customer.secondary_phone || null,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zip_code: customer.zip_code,
        notes: null
      })
      .select()
      .single();

    if (customerError) {
      console.error('Customer creation error:', customerError);
      return NextResponse.json({ 
        error: 'Failed to create customer', 
        details: customerError.message 
      }, { status: 500 });
    }

    // Step 2: Create project record linked to customer
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert({
        customer_id: customerData.id,
        project_name: project.project_name,
        project_type: project.project_type,
        description: project.description,
        status: 'lead', // New intake forms start as leads
        budget_estimate: project.budget_estimate || null,
        timeline_estimate: project.timeline_estimate || null,
        priority: project.priority || 'medium',
        lead_source: project.lead_source || null,
        meeting_date: project.meeting_date || null,
        meeting_notes: project.meeting_notes || null,
        internal_notes: project.internal_notes || null
      })
      .select()
      .single();

    if (projectError) {
      console.error('Project creation error:', projectError);
      // Cleanup: delete customer if project creation fails
      await supabase.from('customers').delete().eq('id', customerData.id);
      return NextResponse.json({ 
        error: 'Failed to create project', 
        details: projectError.message 
      }, { status: 500 });
    }

    // Step 3: Create document record (intake form)
    const { data: documentData, error: documentError } = await supabase
      .from('documents')
      .insert({
        project_id: projectData.id,
        document_name: `Intake Form - ${customer.name}`,
        document_type: 'other',
        file_url: null, // Will be populated when form is finalized/signed
        signature_status: 'pending',
        notes: 'Customer intake form created from admin portal'
      })
      .select()
      .single();

    if (documentError) {
      console.error('Document creation error:', documentError);
      // Cleanup is handled by CASCADE DELETE on customer
      await supabase.from('customers').delete().eq('id', customerData.id);
      return NextResponse.json({ 
        error: 'Failed to create document', 
        details: documentError.message 
      }, { status: 500 });
    }

    // Step 4: Create schedule event if meeting date is provided
    let scheduleEventData = null;
    if (scheduleMeeting && project.meeting_date) {
      // Calculate end time (default 1 hour after start)
      const startTime = new Date(project.meeting_date);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);

      const { data: eventData, error: eventError } = await supabase
        .from('schedule_events')
        .insert({
          project_id: projectData.id,
          event_title: `Site Visit - ${customer.name}`,
          event_type: 'site_visit',
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          location: `${customer.address}, ${customer.city}, ${customer.state} ${customer.zip_code}`,
          attendees: [customer.name, customer.email],
          notes: project.meeting_notes || 'Initial site visit from customer intake',
          status: 'pending' // Starts as pending, waiting for customer confirmation
        })
        .select()
        .single();

      if (eventError) {
        console.error('Schedule event creation error:', eventError);
        // Don't fail the whole request, just log the error
      } else {
        scheduleEventData = eventData;
      }
    }

    // Return success with all created records
    return NextResponse.json({
      success: true,
      customer: customerData,
      project: projectData,
      document: documentData,
      scheduleEvent: scheduleEventData,
      message: scheduleMeeting 
        ? 'Intake form created and site visit scheduled as pending'
        : 'Intake form created successfully'
    });

  } catch (error: any) {
    console.error('Intake creation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}

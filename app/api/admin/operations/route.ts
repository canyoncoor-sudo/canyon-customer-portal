import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
      jwt.verify(token, secret);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    // Fetch today's and tomorrow's schedule from Google Calendar events
    const { data: todayEvents } = await supabase
      .from('calendar_events')
      .select('*')
      .gte('start_time', today.toISOString())
      .lt('start_time', tomorrow.toISOString())
      .order('start_time', { ascending: true });

    const { data: tomorrowEvents } = await supabase
      .from('calendar_events')
      .select('*')
      .gte('start_time', tomorrow.toISOString())
      .lt('start_time', dayAfterTomorrow.toISOString())
      .order('start_time', { ascending: true });

    // Format schedule events
    const todaySchedule = (todayEvents || []).map(event => ({
      id: event.id,
      jobId: event.job_id || '',
      title: event.summary || event.title || 'Untitled Event',
      time: new Date(event.start_time).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      type: event.event_type || 'Event',
      customer: event.customer_name || ''
    }));

    const tomorrowSchedule = (tomorrowEvents || []).map(event => ({
      id: event.id,
      jobId: event.job_id || '',
      title: event.summary || event.title || 'Untitled Event',
      time: new Date(event.start_time).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      type: event.event_type || 'Event',
      customer: event.customer_name || ''
    }));

    // Fetch active jobs for documents and active work sections
    const { data: jobs } = await supabase
      .from('job_intakes')
      .select('*')
      .neq('status', 'completed')
      .neq('status', 'cancelled')
      .neq('status', 'archived');

    // Documents that need attention
    const documents: any[] = [];
    
    // Active work items
    const activeWork: any[] = [];

    if (jobs) {
      jobs.forEach(job => {
        const createdDate = new Date(job.created_at);
        const daysSince = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

        // Determine status and next action
        const status = job.status?.toLowerCase() || 'new';
        
        if (status === 'approved' && !job.scheduled_date) {
          activeWork.push({
            id: job.id,
            jobId: job.id,
            jobName: job.project_type || 'Project',
            customer: job.customer_name || 'Unknown',
            status: 'awaiting_schedule',
            daysInStatus: daysSince,
            nextAction: 'Schedule Job'
          });
        } else if (status === 'proposal_sent' || status === 'pending_approval') {
          activeWork.push({
            id: job.id,
            jobId: job.id,
            jobName: job.project_type || 'Project',
            customer: job.customer_name || 'Unknown',
            status: 'awaiting_response',
            daysInStatus: daysSince,
            nextAction: 'Follow Up'
          });
        } else if (status === 'completed' && !job.invoice_sent) {
          activeWork.push({
            id: job.id,
            jobId: job.id,
            jobName: job.project_type || 'Project',
            customer: job.customer_name || 'Unknown',
            status: 'invoice_pending',
            daysInStatus: daysSince,
            nextAction: 'Send Invoice'
          });
        } else if (status === 'blocked' || job.blocked_reason) {
          activeWork.push({
            id: job.id,
            jobId: job.id,
            jobName: job.project_type || 'Project',
            customer: job.customer_name || 'Unknown',
            status: 'blocked',
            blockReason: job.blocked_reason || 'Unknown',
            daysInStatus: daysSince,
            nextAction: 'Check Status'
          });
        }
      });
    }

    return NextResponse.json({
      todaySchedule,
      tomorrowSchedule,
      documents,
      activeWork
    });

  } catch (error) {
    console.error('Operations API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

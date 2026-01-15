import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials from .env.local
const supabaseUrl = 'https://owirtofahwdrdwevmvjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93aXJ0b2ZhaHdkcmR3ZXZtdmpuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTgyMjAxNywiZXhwIjoyMDgxMzk4MDE3fQ.3BLBPxeMjnVRMhOsHz1VvJcP-7Ie5D9XeF5AlwOrHiE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchedule() {
  console.log('Checking schedule_events table...\n');

  const { data: events, error } = await supabase
    .from('schedule_events')
    .select(`
      *,
      projects:project_id (
        id, project_name, meeting_date,
        customers:customer_id (
          id, name
        )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching events:', error);
    return;
  }

  if (!events || events.length === 0) {
    console.log('❌ No schedule events found. Checking projects table...\n');
    
    const { data: projects, error: projectError } = await supabase
      .from('projects')
      .select(`
        id, project_name, meeting_date, created_at,
        customers:customer_id (name)
      `)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (projectError) {
      console.error('Error fetching projects:', projectError);
      return;
    }

    console.log('Recent projects:');
    projects?.forEach(p => {
      console.log(`\n- ${p.project_name}`);
      console.log(`  Customer: ${p.customers?.name}`);
      console.log(`  Meeting Date: ${p.meeting_date || 'NOT SET'}`);
      console.log(`  Created: ${p.created_at}`);
    });
  } else {
    console.log(`✅ Found ${events.length} schedule event(s):\n`);
    events.forEach(e => {
      console.log(`Event: ${e.event_title}`);
      console.log(`  Type: ${e.event_type}`);
      console.log(`  Status: ${e.status}`);
      console.log(`  Start: ${e.start_time}`);
      console.log(`  End: ${e.end_time}`);
      console.log(`  Location: ${e.location}`);
      console.log(`  Customer: ${e.projects?.customers?.name}`);
      console.log(`  Project: ${e.projects?.project_name}`);
      console.log(`  Created: ${e.created_at}\n`);
    });
  }
}

checkSchedule();

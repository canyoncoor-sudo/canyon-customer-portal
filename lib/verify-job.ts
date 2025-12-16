import bcrypt from 'bcryptjs';
import { supabaseAdmin } from './supabase-admin';
import { normalize } from './normalize';

interface Job {
  id: string;
  customer_name: string;
  job_address: string;
  status: string;
}

export async function verifyJob(
  address: string,
  code: string
): Promise<{ success: true; job: Job } | { success: false; error: string }> {
  // Find job by job_address
  const { data: jobs, error: jErr } = await supabaseAdmin
    .from('portal_jobs')
    .select('*')
    .limit(50);

  if (jErr) {
    return { success: false, error: jErr.message };
  }

  const job = (jobs || []).find(
    (j: any) => normalize(j.job_address) === normalize(address)
  );

  if (!job) {
    return { success: false, error: 'No matching job found for that address.' };
  }

  // Check access code hash (it's in the same table)
  const ok = bcrypt.compareSync(String(code), job.access_code_hash);

  if (!ok) {
    return { success: false, error: 'Invalid access code.' };
  }

  return { success: true, job };
}

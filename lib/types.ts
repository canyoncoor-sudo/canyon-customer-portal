export interface Job {
  id: string;
  job_name: string;
  status: string;
  address_line1: string;
  city: string;
  state: string;
  zip: string;
}

export interface JobBid {
  id: string;
  job_id: string;
  title: string;
  body: string;
  amount: number | null;
  created_at: string;
  updated_at: string;
}

export interface JobNote {
  id: string;
  job_id: string;
  note: string;
  created_by: string | null;
  created_at: string;
}

export interface JobChangeOrder {
  id: string;
  job_id: string;
  title: string;
  description: string;
  amount: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface JobPermit {
  id: string;
  job_id: string;
  permit_type: string;
  permit_number: string | null;
  status: string;
  filed_date: string | null;
  approval_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobSubcontractor {
  id: string;
  job_id: string;
  trade: string;
  company_name: string;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  scheduled_window: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface JobFile {
  id: string;
  job_id: string;
  file_name: string;
  storage_path: string;
  file_type: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_by: string | null;
  created_at: string;
}

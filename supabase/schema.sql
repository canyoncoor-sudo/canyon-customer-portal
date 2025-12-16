-- Canyon Construction Inc. Customer Portal Database Schema
-- Run this in your Supabase SQL Editor

create extension if not exists pgcrypto;

-- ============================================
-- TABLES
-- ============================================

-- JOBS (Projects)
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  job_name text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null default 'OR',
  zip text,
  customer_name text,
  customer_email text,
  customer_phone text,
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ACCESS CODES (what the homeowner types)
create table if not exists public.job_access (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  access_code_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- BID (your bid / estimate visible to customer)
create table if not exists public.job_bid (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  title text not null default 'Bid',
  body text not null,
  amount numeric(12,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- NOTES (visible to customer)
create table if not exists public.job_notes (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  note text not null,
  created_by text,
  created_at timestamptz not null default now()
);

-- CHANGE ORDERS (visible)
create table if not exists public.job_change_orders (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  title text not null,
  description text not null,
  amount numeric(12,2),
  status text not null default 'Pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PERMITS (visible)
create table if not exists public.job_permits (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  permit_type text not null,
  permit_number text,
  status text not null default 'Submitted',
  filed_date date,
  approval_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- SUBS (VISIBLE LIST ONLY — NO SUB BIDS)
create table if not exists public.job_subcontractors (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  trade text not null,
  company_name text not null,
  contact_name text,
  contact_phone text,
  contact_email text,
  scheduled_window text,
  status text not null default 'Scheduled',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- FILES (PHOTOS / DOCS / PERMITS / PDFs)
create table if not exists public.job_files (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  file_type text not null,
  file_size bigint,
  mime_type text,
  uploaded_by text,
  created_at timestamptz not null default now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

alter table public.job_bid enable row level security;
alter table public.job_notes enable row level security;
alter table public.job_change_orders enable row level security;
alter table public.job_permits enable row level security;
alter table public.job_subcontractors enable row level security;
alter table public.job_files enable row level security;

create policy "Portal read bid"
on public.job_bid for select
using ( (auth.jwt() ->> 'job_id')::uuid = job_id );

create policy "Portal read notes"
on public.job_notes for select
using ( (auth.jwt() ->> 'job_id')::uuid = job_id );

create policy "Portal read change orders"
on public.job_change_orders for select
using ( (auth.jwt() ->> 'job_id')::uuid = job_id );

create policy "Portal read permits"
on public.job_permits for select
using ( (auth.jwt() ->> 'job_id')::uuid = job_id );

create policy "Portal read subcontractors"
on public.job_subcontractors for select
using ( (auth.jwt() ->> 'job_id')::uuid = job_id );

create policy "Portal read files"
on public.job_files for select
using ( (auth.jwt() ->> 'job_id')::uuid = job_id );

-- ============================================
-- INDEXES
-- ============================================

create index if not exists idx_jobs_address on public.jobs(lower(address_line1));
create index if not exists idx_job_access_job_id on public.job_access(job_id);
create index if not exists idx_job_bid_job_id on public.job_bid(job_id);
create index if not exists idx_job_notes_job_id on public.job_notes(job_id);
create index if not exists idx_job_change_orders_job_id on public.job_change_orders(job_id);
create index if not exists idx_job_permits_job_id on public.job_permits(job_id);
create index if not exists idx_job_subcontractors_job_id on public.job_subcontractors(job_id);
create index if not exists idx_job_files_job_id on public.job_files(job_id);

-- ============================================
-- TRIGGERS
-- ============================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.jobs
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.job_bid
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.job_change_orders
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.job_permits
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.job_subcontractors
  for each row execute function public.handle_updated_at();

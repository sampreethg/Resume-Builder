-- ==============================================================================
-- SRI SHAKTHI INSTITUTE OF ENGINEERING AND TECHNOLOGY (SIET)
-- SUPABASE RESUMES TABLE WITH STRICT ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. Create the resumes table
create table if not exists public.resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  college_email text not null,
  resume_data jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.resumes enable row level security;

-- 3. Policy: Users can only select/view their own resume
create policy "Users can view own resume"
  on public.resumes for select
  using (auth.uid() = user_id);

-- 4. Policy: Users can only insert their own resume
create policy "Users can insert own resume"
  on public.resumes for insert
  with check (auth.uid() = user_id);

-- 5. Policy: Users can only update their own resume
create policy "Users can update own resume"
  on public.resumes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 6. Policy: Users can only delete their own resume
create policy "Users can delete own resume"
  on public.resumes for delete
  using (auth.uid() = user_id);

-- 7. Add index for fast user queries
create index if not exists resumes_user_id_idx on public.resumes(user_id);
create index if not exists resumes_college_email_idx on public.resumes(college_email);

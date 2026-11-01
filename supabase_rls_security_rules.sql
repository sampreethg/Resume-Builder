-- ==============================================================================
-- SRI SHAKTHI INSTITUTE OF ENGINEERING AND TECHNOLOGY (SIET)
-- RESUME BUILDER: BACKEND SECURITY & ROW LEVEL SECURITY (RLS) POLICY SPECIFICATION
-- ==============================================================================

-- If Supabase / PostgreSQL backend persistence is attached in the future:
-- 1. Create student resumes table
CREATE TABLE IF NOT EXISTS student_resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    college_email TEXT NOT NULL,
    resume_payload JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Strictly Enable Row-Level Security (RLS)
ALTER TABLE student_resumes ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Students can only view their own resume
CREATE POLICY "Students can only view own resume"
ON student_resumes FOR SELECT
USING (auth.uid() = user_id);

-- 4. Policy: Students can only insert their own resume
CREATE POLICY "Students can only insert own resume"
ON student_resumes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 5. Policy: Students can only update their own resume
CREATE POLICY "Students can only update own resume"
ON student_resumes FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. Policy: Students can only delete their own resume
CREATE POLICY "Students can only delete own resume"
ON student_resumes FOR DELETE
USING (auth.uid() = user_id);

-- SECURITY MANDATE:
-- NEVER expose or embed the Supabase service_role key into client-side code (.env.local or frontend bundles).
-- Only use the public anon-key alongside the active Supabase JWT authenticated session.

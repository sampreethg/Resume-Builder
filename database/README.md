# SIET Resume Builder - Database Architecture

This directory houses all PostgreSQL database migrations, schema definitions, and Row Level Security (RLS) policies for the **Sri Shakthi Institute of Engineering and Technology (SIET)** Resume Engine backed by Supabase.

## Files

- **`supabase_migration_resumes.sql`**:
  Initial migration creating the `public.resumes` table with user foreign keys, JSONB resume payload, automatic timestamps, and user indexes.
- **`supabase_rls_security_rules.sql`**:
  Comprehensive Row-Level Security (RLS) policies guaranteeing strict zero-data-leakage and client isolation:
  - `auth.uid() = user_id` for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.

## Deployment Instructions

1. Open your [Supabase Dashboard](https://supabase.com/dashboard/project/qviujuzxjnsyomjnieit).
2. Navigate to **SQL Editor**.
3. Run `supabase_migration_resumes.sql` to initialize the database tables and enable RLS.

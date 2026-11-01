# SIET Resume Builder - Backend API

Standalone Node.js & Express server utilizing `@supabase/server` for token verification, cryptographic JWKS checks, and client-isolated Row Level Security (RLS) operations.

## Architecture

- **`src/lib/supabaseServer.ts`**:
  Backend server adapter wrapping `@supabase/server/core` primitives:
  - `verifyCredentials`: Cryptographically validates inbound Bearer tokens against `SUPABASE_JWKS_URL`.
  - `createContextClient`: Builds an RLS-scoped database client bound strictly to the calling user's JWT.
  - `createAdminClient`: Provisions service-role access for admin background routines if required.
- **`src/index.ts`**:
  Express REST API exposing:
  - `GET /api/health`: Health status.
  - `GET /api/resumes`: Loads authenticated student's resume draft via user-scoped RLS query.
  - `POST /api/resumes`: Saves/upserts student resume draft via user-scoped RLS query.

## Setup & Running

```bash
cd backend
npm install
npm run dev
```

Server will run on `http://localhost:5000`.

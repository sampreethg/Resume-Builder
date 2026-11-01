# Deployment Guide: Vercel (Frontend), Render (Backend), and Supabase (Database)

This guide walks you through deploying the **Sri Shakthi Institute of Engineering and Technology (SIET)** Resume Builder stack across Vercel, Render, and Supabase.

---

## 1. Database Setup: Supabase

1. Open your project on the [Supabase Dashboard](https://supabase.com/dashboard/project/qviujuzxjnsyomjnieit).
2. Go to **SQL Editor** in the left sidebar.
3. Click **+ New Query**.
4. Copy the entire contents of [`database/supabase_migration_resumes.sql`](./database/supabase_migration_resumes.sql) and paste it into the editor.
5. Click **Run**.
   - This creates the `public.resumes` table.
   - Enables Row-Level Security (RLS).
   - Establishes zero-leakage security policies ensuring students can only view, insert, and update their own records.

---

## 2. Backend Deployment: Render (Web Service)

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `https://github.com/sampreethg/Resume-Builder`.
4. Configure the Web Service settings:
   - **Name**: `siet-resume-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
5. Under **Environment Variables**, add the following:
   | Key | Value | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `5000` | Standard internal port |
   | `SUPABASE_URL` | `https://qviujuzxjnsyomjnieit.supabase.co` | Your Supabase project URL |
   | `SUPABASE_SECRET_KEY` | *(Your unmasked secret key)* | Found in Supabase -> Settings -> API Keys |
   | `SUPABASE_JWKS_URL` | `https://qviujuzxjnsyomjnieit.supabase.co/auth/v1/.well-known/jwks.json` | Used for cryptographic token checks |
   | `FRONTEND_URL` | `https://your-vercel-domain.vercel.app` | Your Vercel frontend URL (or `*`) |
6. Click **Deploy Web Service**.
7. Note down your assigned Render URL (e.g. `https://siet-resume-backend.onrender.com`).

---

## 3. Frontend Deployment: Vercel

1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository: `https://github.com/sampreethg/Resume-Builder`.
4. In the Project Configuration:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click **Edit** and choose `frontend`.
5. Under **Environment Variables**, add:
   | Key | Value | Notes |
   |---|---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://qviujuzxjnsyomjnieit.supabase.co` | Supabase API URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_yvFrLbKpDcz_HeTENBc_4Q_o_ZfAkj2` | Public client publishable key |
   | `NEXT_PUBLIC_BACKEND_API_URL` | `https://siet-resume-backend.onrender.com` | Your Render Web Service URL from Step 2 |
6. Click **Deploy**.
7. Once deployed, copy your Vercel URL and add it to `FRONTEND_URL` on Render if you had set a placeholder earlier.

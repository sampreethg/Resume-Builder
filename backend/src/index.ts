import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServerSupabaseContext } from "./lib/supabaseServer.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "5mb" }));

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    service: "siet-resume-backend",
    timestamp: new Date().toISOString()
  });
});

// GET /api/resumes - Fetch authenticated user's resume draft (RLS-isolated)
app.get("/api/resumes", async (req, res) => {
  try {
    const { data: ctx, error: authError } = await createServerSupabaseContext(req, {
      auth: "user"
    });

    if (authError || !ctx) {
      return res.status(401).json({
        error: "Unauthorized: Invalid or missing authentication token"
      });
    }

    const userId = ctx.jwtClaims?.sub;

    const { data, error } = await ctx.supabase
      .from("resumes")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      return res.status(500).json({ error: error.message });
    }

    res.json({ data: data?.resume_data || null });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Internal server error" });
  }
});

// POST /api/resumes - Upsert user's resume draft (RLS-isolated)
app.post("/api/resumes", async (req, res) => {
  try {
    const { data: ctx, error: authError } = await createServerSupabaseContext(req, {
      auth: "user"
    });

    if (authError || !ctx) {
      return res.status(401).json({
        error: "Unauthorized: Invalid or missing authentication token"
      });
    }

    const userId = ctx.jwtClaims?.sub;
    const { college_email, resume_data } = req.body;

    if (!resume_data) {
      return res.status(400).json({ error: "Missing resume_data in payload" });
    }

    const { data, error } = await ctx.supabase
      .from("resumes")
      .upsert(
        {
          user_id: userId,
          college_email: college_email || ctx.jwtClaims?.email,
          resume_data,
          updated_at: new Date().toISOString()
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`[siet-resume-backend] Running on http://localhost:${port}`);
});

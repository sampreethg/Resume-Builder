import {
  verifyCredentials,
  createContextClient,
  createAdminClient,
} from "@supabase/server/core";
import type {
  AuthModeWithKey,
  SupabaseContext,
  SupabaseEnv,
} from "@supabase/server";

function resolveServerEnv(): Partial<SupabaseEnv> {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  return {
    url: url || undefined,
    publishableKeys: publishableKey ? { default: publishableKey } : {},
    secretKeys: secretKey && secretKey !== "your_unmasked_secret_key_here" ? { default: secretKey } : {},
  };
}

let cachedJwks: SupabaseEnv["jwks"] = null;

async function getJwks(jwksUrl?: string, supabaseUrl?: string): Promise<SupabaseEnv["jwks"]> {
  if (cachedJwks) return cachedJwks;
  const targetUrl = jwksUrl || (supabaseUrl ? `${supabaseUrl}/auth/v1/.well-known/jwks.json` : null);
  if (!targetUrl) return null;

  try {
    const res = await fetch(targetUrl);
    if (!res.ok) return null;
    cachedJwks = await res.json();
    return cachedJwks;
  } catch {
    return null;
  }
}

/**
 * Server-side authentication and Supabase context builder using @supabase/server.
 * Verifies inbound tokens against JWKS and provisions RLS-scoped context client or admin client.
 */
export async function createServerSupabaseContext(
  req: Request | { headers: Record<string, string | string[] | undefined> },
  options: { auth?: AuthModeWithKey | AuthModeWithKey[] } = { auth: "user" }
): Promise<{ data: SupabaseContext; error: null } | { data: null; error: Error }> {
  const serverEnv = resolveServerEnv();
  const jwksUrl = process.env.SUPABASE_JWKS_URL;

  if (!serverEnv.url) {
    return {
      data: null,
      error: new Error("Missing SUPABASE_URL configuration"),
    };
  }

  // Handle Fetch Request or Express Request headers
  let authHeader = "";
  let apiKeyHeader: string | null = null;

  if ("headers" in req && typeof (req as any).headers.get === "function") {
    authHeader = (req as Request).headers.get("authorization") || "";
    apiKeyHeader = (req as Request).headers.get("apikey") || null;
  } else if ("headers" in req) {
    const h = (req as any).headers;
    authHeader = (Array.isArray(h["authorization"]) ? h["authorization"][0] : h["authorization"]) || "";
    apiKeyHeader = (Array.isArray(h["apikey"]) ? h["apikey"][0] : h["apikey"]) || null;
  }

  const token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : null;

  const jwks = await getJwks(jwksUrl, serverEnv.url);
  const env: Partial<SupabaseEnv> = { ...serverEnv, jwks };

  const { data: auth, error } = await verifyCredentials(
    { token, apikey: apiKeyHeader },
    { auth: options.auth ?? "user", env }
  );

  if (error) {
    return { data: null, error };
  }

  const supabase = createContextClient({
    auth: { token: auth!.token },
    env,
  });

  const supabaseAdmin = createAdminClient({ env });

  return {
    data: {
      supabase,
      supabaseAdmin,
      userClaims: auth!.userClaims,
      jwtClaims: auth!.jwtClaims,
      authMode: auth!.authMode,
    },
    error: null,
  };
}

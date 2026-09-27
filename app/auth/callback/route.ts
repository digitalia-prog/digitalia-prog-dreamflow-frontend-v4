import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next");
  // Only known local destinations may receive an authenticated session.
  const next = requestedNext === "/reset-password"
    ? "/reset-password"
    : "/dashboard/overview";
  const failure = next === "/reset-password"
    ? "/forgot-password?error=recovery"
    : "/login?error=confirmation";

  try {
    if (code) {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const response = NextResponse.redirect(new URL(next, origin));
        response.headers.set("Cache-Control", "no-store");
        return response;
      }
    }
  } catch {
    // Never put the authorization code or provider error in the redirect URL.
  }
  const response = NextResponse.redirect(new URL(failure, origin));
  response.headers.set("Cache-Control", "no-store");
  return response;
}

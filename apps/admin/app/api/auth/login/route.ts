import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSessionToken } from "@/lib/session";

// ---------------------------------------------------------------------------
// In-memory rate limiter — max 5 attempts per IP per 15-minute window.
// Uses the Web Crypto-compatible globalThis so it works in the Edge runtime.
// ---------------------------------------------------------------------------
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const attempts = new Map<string, RateLimitEntry>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    // Fresh window
    attempts.set(ip, { count: 1, windowStart: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil(
      (WINDOW_MS - (now - entry.windowStart)) / 1000,
    );
    return { allowed: false, retryAfterSeconds };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function clearRateLimit(ip: string): void {
  attempts.delete(ip);
}

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed, retryAfterSeconds } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) },
      },
    );
  }

  // Guard against malformed / missing JSON body
  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { password } = body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (
    !adminPassword ||
    typeof password !== "string" ||
    password !== adminPassword
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Successful login — clear the attempt counter and issue a session token.
  clearRateLimit(ip);
  const token = await createSessionToken(adminPassword);

  const response = NextResponse.json({ ok: true });
  response.cookies.set("snap_admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}

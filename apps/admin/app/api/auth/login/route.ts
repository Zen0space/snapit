import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSessionToken } from "@/lib/session";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

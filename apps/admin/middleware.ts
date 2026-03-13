import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/session";

const PROTECTED = ["/dashboard", "/events"];
const SESSION_COOKIE = "snap_admin_session";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect dashboard and events routes
  if (PROTECTED.some((p) => path.startsWith(p))) {
    const session = request.cookies.get(SESSION_COOKIE);
    const adminPassword = process.env.ADMIN_PASSWORD;

    const isValid =
      !!session?.value &&
      !!adminPassword &&
      (await verifySessionToken(session.value, adminPassword));

    if (!isValid) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/events/:path*"],
};

import { initTRPC, TRPCError } from "@trpc/server";
import type { Request } from "express";
import { z } from "zod";

void z; // keep import

export interface Context {
  req: Request;
}

export const createContext = ({ req }: { req: Request }): Context => ({
  req,
});

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// ---------------------------------------------------------------------------
// Stateless HMAC-SHA256 session token verification.
// Mirrors the implementation in apps/admin/lib/session.ts.
// Token format: {nonce}.{expiry}.{hmac-sha256-hex}
// ---------------------------------------------------------------------------
const ALGORITHM = { name: "HMAC", hash: "SHA-256" };

async function importKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    ALGORITHM,
    false,
    ["sign", "verify"],
  );
}

async function verifyAdminToken(
  token: string,
  secret: string,
): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [nonce, expiryStr, sigHex] = parts;

  const expiry = parseInt(expiryStr, 10);
  if (isNaN(expiry) || Math.floor(Date.now() / 1000) > expiry) return false;

  const payload = `${nonce}.${expiryStr}`;
  try {
    const key = await importKey(secret);
    const encoder = new TextEncoder();
    const sigBytes = new Uint8Array(
      (sigHex.match(/.{2}/g) ?? []).map((b) => parseInt(b, 16)),
    );
    return await crypto.subtle.verify(
      ALGORITHM,
      key,
      sigBytes,
      encoder.encode(payload),
    );
  } catch {
    return false;
  }
}

// Admin procedure — validates ADMIN_PASSWORD by verifying a short-lived
// HMAC-signed token issued by the admin app. The raw password never travels
// the wire.
const isAdmin = t.middleware(async ({ ctx, next }) => {
  const authHeader = ctx.req.headers["authorization"];
  const token = authHeader?.replace("Bearer ", "");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (
    !adminPassword ||
    !token ||
    !(await verifyAdminToken(token, adminPassword))
  ) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({ ctx });
});

export const adminProcedure: typeof t.procedure = t.procedure.use(
  isAdmin,
) as typeof t.procedure;

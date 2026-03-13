/**
 * Stateless HMAC-SHA256 session tokens.
 *
 * Token format: {nonce}.{expiry}.{signature}
 *   nonce     — random hex string (prevents token reuse)
 *   expiry    — Unix timestamp in seconds (explicit TTL baked into token)
 *   signature — HMAC-SHA256(nonce + "." + expiry, ADMIN_PASSWORD)
 *
 * Uses the Web Crypto API — compatible with Next.js Edge runtime and Node.js 18+.
 */

const ALGORITHM = { name: "HMAC", hash: "SHA-256" };
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

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

function toHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomHex(bytes = 16): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return toHex(buf);
}

/**
 * Creates a signed session token tied to the given secret.
 * The token embeds its own expiry — no server-side state required.
 */
export async function createSessionToken(
  secret: string,
  ttlSeconds = SESSION_TTL_SECONDS,
): Promise<string> {
  const nonce = randomHex(16);
  const expiry = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${nonce}.${expiry}`;

  const key = await importKey(secret);
  const encoder = new TextEncoder();
  const sig = await crypto.subtle.sign(ALGORITHM, key, encoder.encode(payload));

  return `${payload}.${toHex(sig)}`;
}

/**
 * Verifies a session token against the given secret.
 * Returns false if the signature is invalid or the token has expired.
 */
export async function verifySessionToken(
  token: string,
  secret: string,
): Promise<boolean> {
  const parts = token.split(".");
  // nonce and signature are hex strings with no dots; expiry is an integer
  // format: {nonce}.{expiry}.{signature}
  if (parts.length !== 3) return false;

  const [nonce, expiryStr, sigHex] = parts;

  // Check expiry first (cheap, no crypto needed)
  const expiry = parseInt(expiryStr, 10);
  if (isNaN(expiry) || Math.floor(Date.now() / 1000) > expiry) return false;

  // Verify HMAC signature
  const payload = `${nonce}.${expiryStr}`;
  try {
    const key = await importKey(secret);
    const encoder = new TextEncoder();

    // Decode stored hex signature back to bytes
    const sigBytes = new Uint8Array(
      sigHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)),
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

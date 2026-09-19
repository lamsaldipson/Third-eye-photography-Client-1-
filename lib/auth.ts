// Intentionally simple: one shared password for the shop owner, stored in
// an environment variable and never in code. The session cookie holds a
// hash, not the password itself. This is fine for a small single-admin
// site; if more than one person will manage the gallery, swap this for
// proper per-user accounts (e.g. next-auth) later.
//
// Uses Web Crypto (available in both the Node.js route handlers and the
// Edge runtime middleware that guards /admin) instead of Node's `crypto`
// module, which the Edge runtime does not support.

export const ADMIN_COOKIE_NAME = "tep_admin_session";

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function expectedSessionToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD ?? "";
  return sha256Hex(password);
}

export function isCorrectPassword(candidate: string): boolean {
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!password) return false;
  return candidate === password;
}

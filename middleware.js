// middleware.js - Edge-safe JWT verification (HMAC SHA256) using Web Crypto
import { NextResponse } from "next/server";

/**
 * Explicit protected route matchers (avoid regex negative lookaheads).
 * Add more protected top-level routes if needed.
 */
export const config = {
  matcher: [
    "/reports/:path*",
    "/reports",
    "/dashboard/:path*",
    "/api/reports/:path*",
    "/api/admin/:path*",
  ],
};

/* --- Base64url helpers --- */
function base64UrlToUint8Array(base64Url) {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = base64 + (pad ? "=".repeat(4 - pad) : "");
  const binary = atob(padded);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
function uint8ArrayToBase64Url(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Verify HS256 JWT using Web Crypto.
 * Returns decoded payload if valid, otherwise throws.
 */
async function verifyJwtEdge(token) {
  if (!token) throw new Error("No token");

  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT format");
  const [headerB64, payloadB64, signatureB64] = parts;
  const signingInput = `${headerB64}.${payloadB64}`;

  // Parse payload JSON (to check `exp`)
  let payloadJson;
  try {
    const payloadBytes = base64UrlToUint8Array(payloadB64);
    const payloadText = new TextDecoder().decode(payloadBytes);
    payloadJson = JSON.parse(payloadText);
  } catch {
    throw new Error("Failed to parse JWT payload");
  }

  // Expiration check
  if (payloadJson.exp && typeof payloadJson.exp === "number") {
    const nowSec = Math.floor(Date.now() / 1000);
    if (payloadJson.exp <= nowSec) throw new Error("Token expired");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT secret not configured in env");

  const enc = new TextEncoder();
  const keyData = enc.encode(secret);

  // Import key for HMAC sign/verify — include "sign" usage because we call sign
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // Compute HMAC-SHA256 of signingInput
  const computedRaw = new Uint8Array(
    await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(signingInput))
  );
  const computedB64Url = uint8ArrayToBase64Url(computedRaw);

  if (computedB64Url !== signatureB64) throw new Error("Invalid JWT signature");

  return payloadJson;
}

export default async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow public routes without auth
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("token");
  if (!cookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    console.warn("[middleware] no token cookie; redirecting to /login for", pathname);
    return NextResponse.redirect(url);
  }

  const token = cookie.value;

  try {
    const payload = await verifyJwtEdge(token);
    // Optionally attach user data for downstream server code:
    const res = NextResponse.next(payload);
    // Example (dev only): res.headers.set("x-user-id", payload.id ?? "");
    return res;
  } catch (err) {
    console.warn("[middleware] token verification failed:", err?.message || err);
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

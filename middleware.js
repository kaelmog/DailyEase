import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/reports/:path*",
    "/reports",
    "/dashboard/:path*",
    "/api/reports/:path*",
    "/api/admin/:path*",
    "/"
  ],
};

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

async function verifyJwtEdge(token) {
  if (!token) throw new Error("No token");
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT format");
  const [headerB64, payloadB64, signatureB64] = parts;
  const signingInput = `${headerB64}.${payloadB64}`;

  let payload;
  try {
    const payloadBytes = base64UrlToUint8Array(payloadB64);
    payload = JSON.parse(new TextDecoder().decode(payloadBytes));
  } catch {
    throw new Error("Failed to parse JWT payload");
  }

  if (payload.exp && typeof payload.exp === "number") {
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) throw new Error("Token expired");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");

  const keyData = new TextEncoder().encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const computed = new Uint8Array(
    await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(signingInput))
  );
  const computedB64Url = uint8ArrayToBase64Url(computed);

  if (computedB64Url !== signatureB64) throw new Error("Invalid JWT signature");
  return payload;
}

export default async function middleware(req) {
  const { pathname } = req.nextUrl;

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

  try {
    await verifyJwtEdge(cookie.value);
    return NextResponse.next();
  } catch (err) {
    console.warn("[middleware] token verification failed:", err?.message || err);
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

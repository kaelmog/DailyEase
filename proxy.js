import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export const config = {
  matcher: ["/((?!_next|api/auth|login|register|favicon.ico).*)"],
};

export default async function proxy(req) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    verifyToken(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    console.warn("Invalid token:", err.message);
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";

export async function GET(req) {
  const cookie = req.cookies.get("token");
  if (!cookie) return NextResponse.json({ user: null }, { status: 200 });

  try {
    const payload = verifyJwt(cookie.value);
    return NextResponse.json({ user: payload }, { status: 200 });
  } catch (err) {
    console.warn("[/api/auth/me] invalid token:", err?.message || err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

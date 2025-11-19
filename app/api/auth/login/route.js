import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { comparePassword, signJwt } from "@/lib/auth";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await comparePassword(password, user.password_hash || "");
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signJwt({ id: user.id, username: user.username });

    const res = NextResponse.json({ message: "Login successful" });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("[/api/auth/login] error:", err);
    return NextResponse.json({ error: "Server error during login" }, { status: 500 });
  }
}

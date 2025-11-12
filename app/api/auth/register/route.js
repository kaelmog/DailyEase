import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { username, password, email } = await req.json();
    if (!username || !password)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("username", username)
      .maybeSingle();
    if (existing)
      return NextResponse.json({ error: "Username taken" }, { status: 400 });

    const hashed = await hashPassword(password);

    const { data: newUser, error } = await supabaseAdmin
      .from("users")
      .insert([{ username, email, password_hash: hashed, role: "Admin" }])
      .select()
      .single();

    if (error) throw error;

    const token = signToken(newUser);
    return NextResponse.json({ token, user: newUser }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

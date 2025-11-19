import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { hashPassword } from "@/lib/auth";

const ADMIN_SECRET = process.env.ADMIN_API_SECRET;

export async function POST(req) {
  try {
    const body = await req.json();

    const headerSecret = req.headers.get("x-admin-secret");
    const provided = headerSecret || body?.admin_secret;
    if (!ADMIN_SECRET || provided !== ADMIN_SECRET) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { username, password, role = "user" } = body || {};
    if (!username || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const password_hash = await hashPassword(password);

    const { data, error } = await supabase
      .from("users")
      .insert([{ username, password_hash, role }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data }, { status: 201 });
  } catch (err) {
    console.error("[/api/auth/register] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

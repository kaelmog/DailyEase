import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const { username, password, name, email } = await req.json();

  const apiSecret = req.headers.get("x-admin-secret");
  if (apiSecret !== process.env.ADMIN_API_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: user, error: userErr } = await supabaseAdmin()
    .from("users")
    .insert([{ username, name, email, role: "user", is_active: true }])
    .select()
    .single();

  if (userErr)
    return NextResponse.json({ error: userErr.message }, { status: 400 });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  await supabaseAdmin().from("auth_credentials").insert({
    user_id: user.id,
    password_hash: hash,
    salt,
  });

  return NextResponse.json({ success: true, user });
}

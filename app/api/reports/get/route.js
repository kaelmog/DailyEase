import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token)
    return NextResponse.json({ error: "Missing token" }, { status: 401 });

  const decoded = verifyToken(token, process.env.ADMIN_API_SECRET);
  if (!decoded)
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from("reports")
    .select("*")
    .eq("id", id)
    .eq("user_id", decoded.id)
    .single();

  if (error)
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  return NextResponse.json(data);
}

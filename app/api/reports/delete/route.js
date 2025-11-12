import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    const decoded = verifyToken(token, process.env.ADMIN_API_SECRET);
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });

    const { error } = await supabaseAdmin.from("reports").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete API error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

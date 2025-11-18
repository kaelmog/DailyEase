import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Missing token" }, { status: 401 });

  const decoded = verifyToken(token, process.env.ADMIN_API_SECRET);
  if (!decoded)
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });

  const { data, error } = await supabaseAdmin()
    .from("reports")
    .select("id, report_date, total_sales, transactions, notes")
    .eq("user_id", decoded.id)
    .order("report_date", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

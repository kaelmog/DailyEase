import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Missing token" }, { status: 401 });

    const decoded = verifyToken(token, process.env.ADMIN_API_SECRET);
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });

    const { data, error } = await supabaseAdmin()
      .from("reports")
      .select("id, report_date, total_sales, transactions, created_at")
      .eq("user_id", decoded.id)
      .order("report_date", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("History fetch error:", err);
    return NextResponse.json(
      { error: "Error fetching history" },
      { status: 500 }
    );
  }
}

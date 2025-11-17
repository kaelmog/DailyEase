import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Missing token" }, { status: 401 });

    const decoded = verifyToken(token, process.env.ADMIN_API_SECRET);
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });

    const { id, updates } = await req.json();

    if (!id || !updates)
      return NextResponse.json(
        { error: "Missing report ID or update data" },
        { status: 400 }
      );

    const updateData = {
      cash: updates.payments?.cash?.amount ?? 0,
      qris: updates.payments?.qris?.amount ?? 0,
      grabfood: updates.payments?.grabfood?.amount ?? 0,
      gofood: updates.payments?.gofood?.amount ?? 0,
      debit: updates.payments?.debit?.amount ?? 0,
      credit_card: updates.payments?.credit_card?.amount ?? 0,
      transfer: updates.payments?.transfer?.amount ?? 0,
      voucher: updates.payments?.voucher?.amount ?? 0,
      transfer_outstanding: updates.payments?.transfer_outstanding?.amount ?? 0,
      total_sales: Object.values(updates.payments || {}).reduce(
        (a, b) => a + (Number(b.amount) || 0),
        0
      ),
      transactions: Object.values(updates.payments || {}).reduce(
        (a, b) => a + (Number(b.transactions) || 0),
        0
      ),
      category_sales: updates.summary_sales || {},
      stock_remaining: updates.leftovers || [],
      notes: updates.notes || null,
      report_date: updates.report_date || new Date().toISOString().slice(0, 10),
    };

    const { error } = await supabaseAdmin()
      .from("reports")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", decoded.id);

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json(
        { error: "Failed to update report" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unhandled error in update route:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

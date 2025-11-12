import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Missing token" }, { status: 401 });

    const decoded = verifyToken(token, process.env.ADMIN_API_SECRET);
    if (!decoded)
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });

    const body = await req.json();

    if (!body)
      return NextResponse.json(
        { error: "Missing report data" },
        { status: 400 }
      );

    const reportData = {
      report_date: new Date().toISOString().split("T")[0],
      user_id: decoded.id,
      payments: {
        cash: body.payments?.cash?.amount || 0,
        qris: body.payments?.qris?.amount || 0,
        grabfood: body.payments?.grabfood?.amount || 0,
        gofood: body.payments?.gofood?.amount || 0,
        debit: body.payments?.debit?.amount || 0,
        credit_card: body.payments?.credit_card?.amount || 0,
        transfer: body.payments?.transfer?.amount || 0,
        voucher: body.payments?.voucher?.amount || 0,
        transfer_outstanding: body.payments?.transfer_outstanding?.amount || 0,
      },
      total_sales: Object.values(body.payments || {}).reduce(
        (acc, p) => acc + (Number(p.amount) || 0),
        0
      ),
      transactions: Object.values(body.payments || {}).reduce(
        (acc, p) => acc + (Number(p.transactions) || 0),
        0
      ),
      category_sales: body.summary_sales || {},
      stock_remaining: {
        leftovers: body.leftovers || [],
        product_categories: body.leftovers.product_categories,
      },
      notes: body.notes || null,
    };

    const { data, error } = await supabaseAdmin
      .from("reports")
      .insert([reportData])
      .select("id");

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Report created successfully", data });
  } catch (e) {
    console.error("Report create error:", e);
    return NextResponse.json(
      { error: e.message || "Failed to create report" },
      { status: 500 }
    );
  }
}

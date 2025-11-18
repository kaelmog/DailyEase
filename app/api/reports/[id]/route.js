import { verifyJwt } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";


export async function GET(req, context) {
  const { id } = await context.params;

  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Missing token" }, { status: 401 });

  const decoded = verifyJwt(token, process.env.ADMIN_API_SECRET);
  if (!decoded)
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  const user = await verifyJwt(token, process.env.ADMIN_API_SECRET);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Supabase fetch error:", error);
    return Response.json({ error: "Failed to fetch report" }, { status: 500 });
  }

  return Response.json(data, { status: 200 });
}

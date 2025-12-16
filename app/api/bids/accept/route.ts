import { NextRequest, NextResponse } from "next/server";
import { verifyPortalToken } from "@/lib/verify-token";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = await verifyPortalToken(token);

    if (!payload?.job_id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { bid_id } = body;

    if (!bid_id) {
      return NextResponse.json({ error: "bid_id required" }, { status: 400 });
    }

    // Update bid status to Accepted
    const { data, error } = await supabaseAdmin
      .from("bids")
      .update({
        status: "Accepted",
        accepted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", bid_id)
      .eq("job_id", payload.job_id) // Security: ensure bid belongs to user's job
      .select()
      .single();

    if (error) {
      console.error("Error accepting bid:", error);
      return NextResponse.json({ error: "Failed to accept bid" }, { status: 500 });
    }

    return NextResponse.json({ success: true, bid: data });
  } catch (error) {
    console.error("Error in /api/bids/accept:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

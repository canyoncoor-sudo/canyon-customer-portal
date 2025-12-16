import { NextRequest, NextResponse } from "next/server";
import { verifyPortalToken } from "@/lib/verify-token";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
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

    // Fetch subcontractors for this job
    const { data: subcontractors, error } = await supabaseAdmin
      .from("subcontractors")
      .select("*")
      .eq("job_id", payload.job_id)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching subcontractors:", error);
      return NextResponse.json({ error: "Failed to fetch subcontractors" }, { status: 500 });
    }

    return NextResponse.json({ subcontractors: subcontractors || [] });
  } catch (error) {
    console.error("Error in /api/subcontractors:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

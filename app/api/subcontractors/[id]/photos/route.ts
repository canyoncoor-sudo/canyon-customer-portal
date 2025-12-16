import { NextRequest, NextResponse } from "next/server";
import { verifyPortalToken } from "@/lib/verify-token";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const subcontractorId = id;

    // Fetch photos for this subcontractor (verify it belongs to user's job)
    const { data: photos, error } = await supabaseAdmin
      .from("subcontractor_photos")
      .select("*")
      .eq("subcontractor_id", subcontractorId)
      .eq("job_id", payload.job_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching subcontractor photos:", error);
      return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
    }

    return NextResponse.json({ photos: photos || [] });
  } catch (error) {
    console.error("Error in /api/subcontractors/[id]/photos:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

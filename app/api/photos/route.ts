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

    // Get gallery_id from query params
    const { searchParams } = new URL(request.url);
    const galleryId = searchParams.get("gallery_id");

    if (!galleryId) {
      return NextResponse.json({ error: "gallery_id required" }, { status: 400 });
    }

    // Fetch photos for this gallery (verify it belongs to user's job)
    const { data: photos, error } = await supabaseAdmin
      .from("photos")
      .select("*")
      .eq("gallery_id", galleryId)
      .eq("job_id", payload.job_id)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching photos:", error);
      return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
    }

    return NextResponse.json({ photos: photos || [] });
  } catch (error) {
    console.error("Error in /api/photos:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      return NextResponse.json({
        ok: false,
        error: "Missing env vars. Check .env.local and restart dev server."
      }, { status: 500 });
    }

    const supabase = createClient(url, serviceKey);

    const { data, error } = await supabase
      .from("portal_jobs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      ok: true, 
      rows: data,
      count: data?.length || 0,
      message: "✅ Database connection successful!"
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";

// One-time migration check — verifies heyzine_url and pdf_url columns exist on magazines
// Call: POST /api/admin/migrate
export async function POST() {
  try {
    const supabase = getServiceRoleClient();

    // Test if columns exist by querying them
    const { data, error } = await supabase
      .from("magazines")
      .select("id, heyzine_url, pdf_url")
      .limit(1);

    if (error) {
      return NextResponse.json({
        ok: false,
        message: "Columns may not exist yet. Please run this SQL in Supabase SQL Editor:",
        sql: "ALTER TABLE magazines ADD COLUMN IF NOT EXISTS heyzine_url TEXT; ALTER TABLE magazines ADD COLUMN IF NOT EXISTS pdf_url TEXT;",
        error: error.message,
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Columns heyzine_url and pdf_url are available.",
      sample: data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

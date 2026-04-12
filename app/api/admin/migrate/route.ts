import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase";

// One-time migration — adds heyzine_url and pdf_url columns to magazines table
// Call: POST /api/admin/migrate
export async function POST() {
  try {
    const supabase = getServiceRoleClient();

    // First check if columns already exist
    const { error: checkError } = await supabase
      .from("magazines")
      .select("id, heyzine_url, pdf_url")
      .limit(1);

    if (!checkError) {
      return NextResponse.json({
        ok: true,
        message: "Columns heyzine_url and pdf_url already exist. No migration needed.",
      });
    }

    // Columns don't exist — run ALTER TABLE via rpc or direct SQL
    // Use the Supabase REST API to execute raw SQL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const sqlStatements = [
      "ALTER TABLE magazines ADD COLUMN IF NOT EXISTS heyzine_url TEXT",
      "ALTER TABLE magazines ADD COLUMN IF NOT EXISTS pdf_url TEXT",
      "ALTER TABLE magazine_purchases ADD COLUMN IF NOT EXISTS customer_email TEXT",
    ];

    const results = [];

    for (const sql of sqlStatements) {
      const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: "POST",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: sql }),
      });

      if (!res.ok) {
        // rpc/exec_sql might not exist — try pg_net or return SQL to run manually
        results.push({ sql, status: res.status, fallback: true });
      } else {
        results.push({ sql, status: 200, ok: true });
      }
    }

    // If RPC didn't work, try using the PostgreSQL connection string directly
    const anyFallback = results.some((r) => r.fallback);

    if (anyFallback) {
      // Last resort: use supabase-js .rpc() won't work for DDL
      // Return the SQL for manual execution
      return NextResponse.json({
        ok: false,
        message: "RPC exec_sql not available. Please run this SQL manually in Supabase SQL Editor:",
        sql: "ALTER TABLE magazines ADD COLUMN IF NOT EXISTS heyzine_url TEXT; ALTER TABLE magazines ADD COLUMN IF NOT EXISTS pdf_url TEXT;",
        results,
      });
    }

    // Verify migration succeeded
    const { error: verifyError } = await supabase
      .from("magazines")
      .select("id, heyzine_url, pdf_url")
      .limit(1);

    return NextResponse.json({
      ok: !verifyError,
      message: verifyError
        ? "Migration may have failed: " + verifyError.message
        : "Migration successful. Columns heyzine_url and pdf_url added.",
      results,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

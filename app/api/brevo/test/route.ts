import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { testBrevoConnection, clearBrevoConfigCache } from '@/lib/brevo';
import { getServiceRoleClient } from '@/lib/supabase';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function corsJson(data: any, init?: { status?: number }) {
  return NextResponse.json(data, { ...init, headers: CORS_HEADERS });
}

// Handle CORS preflight
export async function OPTIONS() {
  return corsJson({});
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.status === 401 || authResult.status === 403) {
      return corsJson(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Check if body contains config to save first
    let body: Record<string, string> = {};
    try {
      body = await request.json();
    } catch {
      // No body is fine — just test with existing config
    }

    // If config values are provided, save them via service role (bypasses RLS)
    if (body && Object.keys(body).length > 0) {
      const allowedKeys = ['brevo_api_key', 'brevo_sender_email', 'brevo_sender_name', 'brevo_newsletter_list_id'];
      const supabase = getServiceRoleClient();

      for (const key of allowedKeys) {
        if (body[key] !== undefined) {
          const { error: upsertError } = await supabase
            .from('site_config')
            .upsert(
              { key, value: body[key].trim(), updated_at: new Date().toISOString() },
              { onConflict: 'key' }
            );

          if (upsertError) {
            console.error(`[Brevo test] Failed to save ${key}:`, upsertError);
          } else {
            console.log(`[Brevo test] Saved ${key} to site_config`);
          }
        }
      }

      // Clear cache so test uses the freshly saved values
      clearBrevoConfigCache();
    }

    const result = await testBrevoConnection();
    console.log('[Brevo test]', result.success ? 'OK' : 'FAIL', result.error || result.email);

    if (result.success) {
      return corsJson({
        success: true,
        message: `Connexion réussie. Compte : ${result.email}`,
        email: result.email,
      });
    } else {
      return corsJson(
        { success: false, error: result.error || 'Échec de la connexion' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('POST /api/brevo/test error:', error);
    return corsJson(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { getServiceRoleClient } from '@/lib/supabase';

const BREVO_API_URL = 'https://api.brevo.com/v3';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function corsJson(data: any, init?: { status?: number }) {
  return NextResponse.json(data, { ...init, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return corsJson({});
}

/**
 * GET /api/brevo/senders — List all senders registered in Brevo
 */
export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.status === 401 || authResult.status === 403) {
      return corsJson({ error: authResult.error }, { status: authResult.status });
    }

    const apiKey = await getBrevoApiKey();
    if (!apiKey) {
      return corsJson({ error: 'Clé API Brevo non configurée' }, { status: 400 });
    }

    // Fetch senders from Brevo
    const res = await fetch(`${BREVO_API_URL}/senders`, {
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const text = await res.text();
      return corsJson({ error: `Brevo API error (${res.status}): ${text}` }, { status: res.status });
    }

    const data = await res.json();
    const senders = (data.senders || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      active: s.active,
    }));

    return corsJson({ senders });
  } catch (error: any) {
    console.error('GET /api/brevo/senders error:', error);
    return corsJson({ error: error.message || 'Erreur interne' }, { status: 500 });
  }
}

/**
 * POST /api/brevo/senders — Create a new sender in Brevo
 * Body: { email: string, name: string }
 *
 * After creation, Brevo sends a verification email to the address.
 * The user must click the verification link in the email.
 */
export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.status === 401 || authResult.status === 403) {
      return corsJson({ error: authResult.error }, { status: authResult.status });
    }

    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return corsJson({ error: 'Email requis' }, { status: 400 });
    }

    const apiKey = await getBrevoApiKey();
    if (!apiKey) {
      return corsJson({ error: 'Clé API Brevo non configurée' }, { status: 400 });
    }

    // First check if sender already exists
    const listRes = await fetch(`${BREVO_API_URL}/senders`, {
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    });

    if (listRes.ok) {
      const listData = await listRes.json();
      const existing = listData.senders?.find((s: any) => s.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        // Sender exists already
        if (existing.active) {
          // Already verified — just update site_config
          await updateSenderConfig(email, name || existing.name);
          return corsJson({
            success: true,
            verified: true,
            message: `L'adresse ${email} est déjà vérifiée et active.`,
          });
        } else {
          // Exists but not verified — re-send verification
          // Brevo doesn't have a resend endpoint, but we can try to validate by calling validate endpoint
          try {
            await fetch(`${BREVO_API_URL}/senders/${existing.id}/validate`, {
              method: 'PUT',
              headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
            });
          } catch {
            // Ignore — validation endpoint may not exist in all Brevo plans
          }

          return corsJson({
            success: true,
            verified: false,
            message: `L'adresse ${email} est enregistrée mais pas encore vérifiée. Vérifiez votre boîte mail pour le lien de confirmation Brevo.`,
          });
        }
      }
    }

    // Create new sender
    const createRes = await fetch(`${BREVO_API_URL}/senders`, {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name || 'AFRIKHER',
        email,
      }),
    });

    if (!createRes.ok) {
      const errorText = await createRes.text();
      console.error(`[BREVO] Create sender failed (${createRes.status}):`, errorText);

      // Check if it's a "sender already exists" error
      if (createRes.status === 400 && errorText.includes('already')) {
        return corsJson({
          success: true,
          verified: false,
          message: `L'adresse ${email} est déjà enregistrée. Vérifiez votre boîte mail pour le lien de confirmation.`,
        });
      }

      return corsJson(
        { error: `Erreur Brevo (${createRes.status}): ${errorText}` },
        { status: createRes.status }
      );
    }

    // Sender created — Brevo will send verification email
    console.log(`[BREVO] Sender ${email} created — verification email sent`);

    return corsJson({
      success: true,
      verified: false,
      message: `L'adresse ${email} a été enregistrée. Un email de vérification a été envoyé par Brevo. Cliquez sur le lien dans cet email pour activer l'adresse.`,
    });
  } catch (error: any) {
    console.error('POST /api/brevo/senders error:', error);
    return corsJson({ error: error.message || 'Erreur interne' }, { status: 500 });
  }
}

async function getBrevoApiKey(): Promise<string> {
  try {
    const supabase = getServiceRoleClient();
    const { data } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'brevo_api_key')
      .maybeSingle();

    if (data?.value) return data.value.trim();
  } catch {
    // Fall back to env
  }
  return process.env.BREVO_API_KEY || '';
}

async function updateSenderConfig(email: string, name: string) {
  try {
    const supabase = getServiceRoleClient();
    const now = new Date().toISOString();

    await supabase.from('site_config').upsert(
      { key: 'brevo_sender_email', value: email, updated_at: now },
      { onConflict: 'key' }
    );
    await supabase.from('site_config').upsert(
      { key: 'brevo_sender_name', value: name, updated_at: now },
      { onConflict: 'key' }
    );

    console.log(`[BREVO] Updated sender config: ${email} (${name})`);
  } catch (err) {
    console.error('[BREVO] Failed to update sender config:', err);
  }
}

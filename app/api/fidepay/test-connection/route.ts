import { NextResponse } from 'next/server';

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

// POST /api/fidepay/test-connection
// Server-side proxy to test FIDEPAY connection (avoids CORS issues from browser)
export async function POST(request: Request) {
  try {
    const { public_key, access_token_url } = await request.json();

    if (!public_key) {
      return corsJson(
        { success: false, message: 'La cle publique est requise.' },
        { status: 400 }
      );
    }

    if (!access_token_url) {
      return corsJson(
        { success: false, message: "L'URL access-token est requise." },
        { status: 400 }
      );
    }

    const response = await fetch(access_token_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_key }),
    });

    const responseText = await response.text();
    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      return corsJson({
        success: false,
        message: `Reponse non-JSON de FIDEPAY (status ${response.status}): ${responseText.substring(0, 150)}`,
      });
    }

    if (!response.ok) {
      return corsJson({
        success: false,
        message: `Erreur ${response.status}: ${data?.message || data?.error || responseText.substring(0, 150)}`,
      });
    }

    // Check for access_token in various possible locations
    const token = data.access_token || data.data?.access_token || data.token || data.data?.token;
    if (token) {
      return corsJson({
        success: true,
        message: 'Connexion reussie ! Token obtenu avec succes.',
      });
    } else {
      return corsJson({
        success: false,
        message: `Reponse FIDEPAY sans token. Cles: ${Object.keys(data).join(', ')}. Verifiez votre cle publique.`,
      });
    }
  } catch (err: any) {
    return corsJson({
      success: false,
      message: `Impossible de joindre FIDEPAY: ${err.message}`,
    }, { status: 500 });
  }
}

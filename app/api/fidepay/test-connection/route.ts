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

    if (response.ok) {
      const data = await response.json();
      if (data.access_token) {
        return corsJson({
          success: true,
          message: 'Connexion reussie ! Token obtenu avec succes.',
        });
      } else {
        return corsJson({
          success: false,
          message: 'Reponse inattendue de FIDEPAY. Verifiez votre cle publique.',
        });
      }
    } else {
      const errorText = await response.text();
      return corsJson({
        success: false,
        message: `Erreur ${response.status}: ${errorText.substring(0, 200)}`,
      });
    }
  } catch (err: any) {
    return corsJson({
      success: false,
      message: `Impossible de joindre FIDEPAY: ${err.message}`,
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

// POST /api/fidepay/test-connection
// Server-side proxy to test FIDEPAY connection (avoids CORS issues from browser)
export async function POST(request: Request) {
  try {
    const { public_key, access_token_url } = await request.json();

    if (!public_key) {
      return NextResponse.json(
        { success: false, message: 'La cle publique est requise.' },
        { status: 400 }
      );
    }

    if (!access_token_url) {
      return NextResponse.json(
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
        return NextResponse.json({
          success: true,
          message: 'Connexion reussie ! Token obtenu avec succes.',
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Reponse inattendue de FIDEPAY. Verifiez votre cle publique.',
        });
      }
    } else {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        message: `Erreur ${response.status}: ${errorText.substring(0, 200)}`,
      });
    }
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: `Impossible de joindre FIDEPAY: ${err.message}`,
    }, { status: 500 });
  }
}

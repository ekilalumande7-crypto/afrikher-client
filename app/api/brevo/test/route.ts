import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { testBrevoConnection } from '@/lib/brevo';

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

    const result = await testBrevoConnection();

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

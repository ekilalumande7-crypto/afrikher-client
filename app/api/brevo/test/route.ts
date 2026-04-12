import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { testBrevoConnection } from '@/lib/brevo';

export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.status === 401 || authResult.status === 403) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const result = await testBrevoConnection();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Connexion réussie. Compte : ${result.email}`,
        email: result.email,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Échec de la connexion' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('POST /api/brevo/test error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

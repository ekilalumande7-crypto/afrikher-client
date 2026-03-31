import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { getServiceRoleClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const adminAuth = await requireAdmin(request);
    if (adminAuth.error) {
      return NextResponse.json(
        { error: adminAuth.error },
        { status: adminAuth.status || 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      full_name,
      email,
      password,
      company_name,
      sector,
      website,
      linkedin,
      bio,
      country,
      collaboration_types,
    } = body;

    // Validate required fields
    if (!full_name || !email || !password || !company_name || !sector) {
      return NextResponse.json(
        { error: 'Champs requis: full_name, email, password, company_name, sector' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Format email invalide' }, { status: 400 });
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit faire au moins 6 caracteres' },
        { status: 400 }
      );
    }

    const adminClient = getServiceRoleClient();

    // 1. Create user in Supabase Auth (auto-confirm email)
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: `Echec creation utilisateur: ${authError?.message || 'Erreur inconnue'}` },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // 2. Create profile with role='partner'
    const { error: profileError } = await adminClient
      .from('profiles')
      .insert({
        id: userId,
        full_name,
        role: 'partner',
        created_at: new Date().toISOString(),
      });

    if (profileError) {
      // Rollback: delete auth user
      await adminClient.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: `Echec creation profil: ${profileError.message}` },
        { status: 400 }
      );
    }

    // 3. Create partners table entry (active immediately when admin creates)
    const { error: partnerError } = await adminClient
      .from('partners')
      .insert({
        id: userId,
        company_name,
        sector,
        website: website || null,
        linkedin: linkedin || null,
        bio: bio || null,
        country: country || null,
        collaboration_types: collaboration_types || [],
        status: 'active',
        validated_at: new Date().toISOString(),
        validated_by: adminAuth.user.id,
      });

    if (partnerError) {
      // Rollback
      await adminClient.from('profiles').delete().eq('id', userId);
      await adminClient.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: `Echec creation partenaire: ${partnerError.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Partenaire cree avec succes',
        data: { id: userId, full_name, email, company_name, sector, status: 'active' },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json(
      { error: `Erreur interne: ${error instanceof Error ? error.message : 'Inconnue'}` },
      { status: 500 }
    );
  }
}

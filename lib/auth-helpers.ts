import { createClient } from '@supabase/supabase-js';
import { getServiceRoleClient } from './supabase';

export interface AuthResult {
  user?: any;
  profile?: any;
  error?: string;
  status?: number;
}

export async function getAuthUser(request: Request): Promise<any> {
  const authHeader = request.headers.get('Authorization');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const { data: { user } } = await supabase.auth.getUser(token);
    if (user) return user;
  }

  return null;
}

export async function requireAdmin(request: Request): Promise<AuthResult> {
  const user = await getAuthUser(request);
  if (!user) {
    return { error: 'Not authenticated', status: 401 };
  }

  const supabase = getServiceRoleClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || profile?.role !== 'admin') {
    return { error: 'Not authorized', status: 403 };
  }

  return { user, profile };
}

export async function requirePartner(request: Request): Promise<AuthResult> {
  const user = await getAuthUser(request);
  if (!user) {
    return { error: 'Not authenticated', status: 401 };
  }

  const supabase = getServiceRoleClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !['partner', 'pending_partner'].includes(profile?.role)) {
    return { error: 'Not authorized', status: 403 };
  }

  return { user, profile };
}

export async function requireAuth(request: Request): Promise<AuthResult> {
  const user = await getAuthUser(request);
  if (!user) {
    return { error: 'Not authenticated', status: 401 };
  }

  const supabase = getServiceRoleClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user, profile };
}

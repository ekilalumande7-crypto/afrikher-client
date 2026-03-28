'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AfrikherInput from '@/components/ui/afrikher-input';
import AfrikherButton from '@/components/ui/afrikher-button';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-afrikher-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-afrikher-dark mb-2">
            Connexion
          </h1>
          <p className="font-sans text-afrikher-gray">
            Connectez-vous à votre compte AFRIKHER
          </p>
        </div>

        <div className="bg-white p-8 shadow-lg">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 font-sans text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <AfrikherInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />

            <AfrikherInput
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between">
              <Link
                href="/auth/forgot-password"
                className="font-sans text-sm text-afrikher-gold hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <AfrikherButton
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </AfrikherButton>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-afrikher-gray"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white font-sans text-afrikher-gray">Ou</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="mt-6 w-full flex items-center justify-center px-6 py-3 border-2 border-afrikher-gray text-afrikher-dark font-sans font-medium hover:bg-afrikher-cream transition-all duration-300"
            >
              Continuer avec Google
            </button>
          </div>

          <p className="mt-8 text-center font-sans text-sm text-afrikher-gray">
            Pas encore de compte ?{' '}
            <Link href="/auth/register" className="text-afrikher-gold font-medium hover:underline">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

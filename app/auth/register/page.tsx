'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AfrikherInput from '@/components/ui/afrikher-input';
import AfrikherButton from '@/components/ui/afrikher-button';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        role: 'reader',
      });

      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-afrikher-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-afrikher-dark mb-2">
            Inscription
          </h1>
          <p className="font-sans text-afrikher-gray">
            Créez votre compte AFRIKHER
          </p>
        </div>

        <div className="bg-white p-8 shadow-lg">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 font-sans text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <AfrikherInput
              label="Nom complet"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Votre nom"
              required
            />

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

            <AfrikherInput
              label="Confirmer le mot de passe"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <AfrikherButton
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </AfrikherButton>
          </form>

          <p className="mt-8 text-center font-sans text-sm text-afrikher-gray">
            Déjà un compte ?{' '}
            <Link href="/auth/login" className="text-afrikher-gold font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

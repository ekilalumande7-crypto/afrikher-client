'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

  const handleGoogleSignup = async () => {
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
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
          <div className="hidden md:flex md:w-1/2 bg-afrikher-dark p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute top-8 left-8">
              <div className="bg-afrikher-gold px-6 py-2">
                <span className="font-display text-sm font-bold text-afrikher-dark tracking-wider">AFRIKHER</span>
              </div>
            </div>

            <div className="mt-auto mb-12 relative z-10">
              <h2 className="font-display text-4xl md:text-5xl leading-tight text-afrikher-cream mb-8">
                Rejoignez la communauté AFRIKHER
              </h2>
              <p className="font-sans text-lg text-afrikher-cream/80 mb-4">
                Créez votre compte pour accéder à des contenus exclusifs, participer à nos événements et faire partie d&apos;une communauté inspirante.
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-8">
                <h1 className="font-display text-4xl font-bold text-afrikher-dark mb-2">
                  Inscription
                </h1>
                <p className="font-sans text-afrikher-gray">
                  Créez votre compte AFRIKHER
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 font-sans text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="block font-sans text-sm font-medium text-afrikher-dark mb-2">
                    Nom complet
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Votre nom"
                    required
                    className="w-full px-4 py-3 border border-gray-300 font-sans text-afrikher-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-afrikher-gold focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-sans text-sm font-medium text-afrikher-dark mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 font-sans text-afrikher-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-afrikher-gold focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block font-sans text-sm font-medium text-afrikher-dark mb-2">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 border border-gray-300 font-sans text-afrikher-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-afrikher-gold focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block font-sans text-sm font-medium text-afrikher-dark mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 border border-gray-300 font-sans text-afrikher-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-afrikher-gold focus:border-transparent transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-afrikher-gold text-afrikher-dark font-sans font-semibold py-3 px-6 hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Inscription...' : 'S\'inscrire'}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white font-sans text-afrikher-gray">Ou</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="mt-6 w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-afrikher-dark font-sans font-medium hover:bg-gray-50 transition-all duration-300"
                >
                  Continuer avec Google
                </button>
              </div>

              <p className="mt-8 text-center font-sans text-sm text-afrikher-gray">
                Déjà un compte ?{' '}
                <Link href="/auth/login" className="text-afrikher-gold font-semibold hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

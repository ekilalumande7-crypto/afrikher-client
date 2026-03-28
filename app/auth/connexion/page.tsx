'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader as Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ConnexionPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting login with:', email);
    setIsLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      console.log('Login response:', { data, error: signInError });

      if (signInError) {
        console.error('Login error:', signInError);
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        console.log('Login successful, redirecting to dashboard');
        window.location.href = '/dashboard';
      } else {
        setError('Erreur de connexion. Veuillez réessayer.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Une erreur inattendue est survenue');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-8 py-12">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <Link href="/">
            <h1
              className="text-[#C9A84C] mb-16 cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.5rem',
                letterSpacing: '0.3em',
                fontWeight: 400,
              }}
            >
              AFRIKHER
            </h1>
          </Link>

          <h2
            className="text-[#F5F0E8] mb-3"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2.5rem',
              fontWeight: 300,
            }}
          >
            Connexion
          </h2>

          <p
            className="text-[#9A9A8A] mb-10"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.8rem',
            }}
          >
            Bienvenue dans votre espace personnel
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-[#9A9A8A] mb-2"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
              }}
            >
              ADRESSE EMAIL
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-0 border-b border-white/20 text-[#F5F0E8] px-0 py-3 focus:border-[#C9A84C] focus:outline-none transition-colors duration-300"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[#9A9A8A] mb-2"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
              }}
            >
              MOT DE PASSE
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-0 border-b border-white/20 text-[#F5F0E8] px-0 py-3 pr-10 focus:border-[#C9A84C] focus:outline-none transition-colors duration-300"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.9rem',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-3 text-[#9A9A8A] hover:text-[#C9A84C] transition-colors duration-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link
              href="/auth/mot-de-passe-oublie"
              className="text-[#9A9A8A] hover:text-[#C9A84C] transition-colors duration-300"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.75rem',
              }}
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#C9A84C] text-[#0A0A0A] py-4 hover:bg-[#F5E6A3] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              fontWeight: 600,
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                CONNEXION EN COURS...
              </>
            ) : (
              'SE CONNECTER'
            )}
          </button>
        </form>

        <p
          className="mt-8 text-center text-[#9A9A8A]"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.8rem',
          }}
        >
          Pas encore de compte ?{' '}
          <Link href="/auth/inscription" className="text-[#C9A84C] hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}

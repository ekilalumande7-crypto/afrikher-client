'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader as Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function MotDePasseOubliePage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/nouveau-mot-de-passe`,
    });

    if (resetError) {
      setError(resetError.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md text-center">
          <h1
            className="text-[#C9A84C] mb-12"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.5rem',
              letterSpacing: '0.3em',
              fontWeight: 400,
            }}
          >
            AFRIKHER
          </h1>

          <div className="mb-8">
            <svg
              className="mx-auto mb-6"
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
            >
              <circle cx="32" cy="32" r="32" fill="#C9A84C" opacity="0.1" />
              <path
                d="M32 20v16M32 44h.01"
                stroke="#C9A84C"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>

            <h2
              className="text-[#F5F0E8] mb-4"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '2rem',
                fontWeight: 300,
              }}
            >
              Email envoyé
            </h2>

            <p
              className="text-[#9A9A8A]"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.8rem',
                lineHeight: '1.6',
              }}
            >
              Nous avons envoyé un lien de réinitialisation à{' '}
              <span className="text-[#C9A84C]">{email}</span>.
              <br />
              Vérifiez votre boîte de réception.
            </p>
          </div>

          <Link
            href="/auth/connexion"
            className="inline-flex items-center text-[#9A9A8A] hover:text-[#C9A84C] transition-colors duration-300"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.8rem',
            }}
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-8 py-12">
      <div className="w-full max-w-md">
        <h1
          className="text-[#C9A84C] mb-16 text-center"
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.5rem',
            letterSpacing: '0.3em',
            fontWeight: 400,
          }}
        >
          AFRIKHER
        </h1>

        <div className="mb-12">
          <h2
            className="text-[#F5F0E8] mb-3"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2.5rem',
              fontWeight: 300,
            }}
          >
            Réinitialiser le mot de passe
          </h2>

          <p
            className="text-[#9A9A8A]"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.8rem',
            }}
          >
            Entrez votre email pour recevoir un lien de réinitialisation.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-6">
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
                ENVOI EN COURS...
              </>
            ) : (
              'ENVOYER LE LIEN'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/auth/connexion"
            className="inline-flex items-center text-[#9A9A8A] hover:text-[#C9A84C] transition-colors duration-300"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.8rem',
            }}
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}

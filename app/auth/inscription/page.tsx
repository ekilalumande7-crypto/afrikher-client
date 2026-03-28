'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader as Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function InscriptionPage() {
  const router = useRouter();
  const supabase = createClient();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { label: '', color: '' };
    if (pwd.length < 6) return { label: 'Faible', color: '#E53E3E' };
    if (pwd.length < 10) return { label: 'Moyen', color: '#DD6B20' };
    return { label: 'Fort', color: '#38A169' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setIsLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`,
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
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
          <Link href="/">
            <h1
              className="text-[#C9A84C] mb-12 cursor-pointer hover:opacity-80 transition-opacity"
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
                d="M26 32L30 36L38 28"
                stroke="#C9A84C"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
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
              Bienvenue sur AFRIKHER
            </h2>

            <p
              className="text-[#C9A84C] mb-6"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.9rem',
              }}
            >
              Votre compte a été créé avec succès !
            </p>

            <p
              className="text-[#9A9A8A] mb-8"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.8rem',
              }}
            >
              Vous pouvez maintenant vous connecter et accéder à votre espace personnel.
            </p>
          </div>

          <Link
            href="/auth/connexion"
            className="inline-block bg-[#C9A84C] text-[#0A0A0A] px-8 py-4 hover:bg-[#F5E6A3] transition-colors duration-300"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              fontWeight: 600,
            }}
          >
            SE CONNECTER
          </Link>
        </div>
      </div>
    );
  }

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
            Inscription
          </h2>

          <p
            className="text-[#9A9A8A] mb-10"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.8rem',
            }}
          >
            Rejoignez la communauté AFRIKHER
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-[#9A9A8A] mb-2"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                }}
              >
                PRÉNOM
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                htmlFor="lastName"
                className="block text-[#9A9A8A] mb-2"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                }}
              >
                NOM
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full bg-transparent border-0 border-b border-white/20 text-[#F5F0E8] px-0 py-3 focus:border-[#C9A84C] focus:outline-none transition-colors duration-300"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

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
            {password && (
              <p
                className="mt-2"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.7rem',
                  color: passwordStrength.color,
                }}
              >
                Force : {passwordStrength.label}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-[#9A9A8A] mb-2"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
              }}
            >
              CONFIRMER LE MOT DE PASSE
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-transparent border-0 border-b border-white/20 text-[#F5F0E8] px-0 py-3 pr-10 focus:border-[#C9A84C] focus:outline-none transition-colors duration-300"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.9rem',
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-3 text-[#9A9A8A] hover:text-[#C9A84C] transition-colors duration-300"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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
                CRÉATION EN COURS...
              </>
            ) : (
              'CRÉER MON COMPTE'
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
          Déjà un compte ?{' '}
          <Link href="/auth/connexion" className="text-[#C9A84C] hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader as Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function NouveauMotDePassePage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { label: '', color: '' };
    if (pwd.length < 6) return { label: 'Faible', color: '#E53E3E' };
    if (pwd.length < 10) return { label: 'Moyen', color: '#DD6B20' };
    return { label: 'Fort', color: '#38A169' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

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

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
      return;
    }

    router.push('/dashboard');
  };

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
            Nouveau mot de passe
          </h2>

          <p
            className="text-[#9A9A8A]"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.8rem',
            }}
          >
            Choisissez un nouveau mot de passe sécurisé.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-6">
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
              NOUVEAU MOT DE PASSE
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
                MISE À JOUR...
              </>
            ) : (
              'METTRE À JOUR'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

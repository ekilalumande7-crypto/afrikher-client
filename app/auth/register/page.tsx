"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Redirect to login or show success message
      router.push("/auth/login?message=Check your email to confirm your account");
    }
  };

  return (
    <main className="min-h-screen bg-brand-dark flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <Link href="/" className="text-4xl font-display font-bold tracking-widest text-brand-gold mb-8 block">
            AFRIKHER
          </Link>
          <h1 className="text-2xl font-display text-brand-cream mb-2">Rejoignez le cercle</h1>
          <p className="text-brand-gray text-sm">Créez votre compte AFRIKHER</p>
        </div>

        <div
          className="bg-brand-charcoal p-8 border border-brand-gold/20 shadow-2xl"
        >
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-brand-gray font-bold">Nom complet</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-brand-dark border border-brand-charcoal py-3 px-4 pl-10 text-brand-cream focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="Prénom Nom"
                />
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-brand-gray font-bold">Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-dark border border-brand-charcoal py-3 px-4 pl-10 text-brand-cream focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="votre@email.com"
                />
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-brand-gray font-bold">Mot de passe</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brand-dark border border-brand-charcoal py-3 px-4 pl-10 text-brand-cream focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="••••••••"
                />
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray" />
              </div>
            </div>

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-gold text-brand-dark font-medium uppercase tracking-widest hover:bg-brand-cream transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-brand-dark border-t-transparent animate-spin rounded-full" />
              ) : (
                <>
                  <span>Créer mon compte</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-brand-gray text-sm">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="text-brand-gold hover:text-brand-cream transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}

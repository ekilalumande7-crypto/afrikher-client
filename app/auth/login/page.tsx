"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, ArrowRight, Github } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  };

  return (
    <main className="min-h-screen bg-brand-dark flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <Link href="/" className="text-4xl font-display font-bold tracking-widest text-brand-gold mb-8 block">
            AFRIKHER
          </Link>
          <h1 className="text-2xl font-display text-brand-cream mb-2">Bon retour parmi nous</h1>
          <p className="text-brand-gray text-sm">Connectez-vous à votre espace personnel</p>
        </div>

        <div
          className="bg-brand-charcoal p-8 border border-brand-gold/20 shadow-2xl"
        >
          <form onSubmit={handleLogin} className="space-y-6">
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
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest text-brand-gray font-bold">Mot de passe</label>
                <Link href="/auth/forgot-password" title="Mot de passe oublié ?" className="text-[10px] uppercase tracking-widest text-brand-gold hover:text-brand-cream transition-colors">
                  Oublié ?
                </Link>
              </div>
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
                  <span>Se connecter</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-charcoal"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-brand-charcoal px-4 text-brand-gray">Ou continuer avec</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 border border-brand-charcoal text-brand-cream hover:bg-brand-dark transition-all flex items-center justify-center space-x-3"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            <span className="text-sm uppercase tracking-widest">Google</span>
          </button>
        </div>

        <p className="text-center mt-8 text-brand-gray text-sm">
          Pas encore de compte ?{" "}
          <Link href="/auth/register" className="text-brand-gold hover:text-brand-cream transition-colors">
            Créer un compte
          </Link>
        </p>
      </div>
    </main>
  );
}

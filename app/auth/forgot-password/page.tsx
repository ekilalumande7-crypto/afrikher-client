"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const redirectTo = `${window.location.origin}/auth/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(
      "Un lien de reinitialisation a ete envoye a votre adresse email."
    );
    setLoading(false);
    setEmail("");
  };

  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F0E8]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.10),transparent_34%)]" />

      <div className="relative flex min-h-screen items-center justify-center px-6 py-20">
        <div className="w-full max-w-[30rem]">
          <div className="mb-10 text-center">
            <Link
              href="/"
              className="inline-block font-display text-[2.5rem] tracking-[0.22em] text-[#C9A84C] transition-opacity hover:opacity-80"
            >
              AFRIKHER
            </Link>

            <p className="mt-8 font-body text-[0.68rem] uppercase tracking-[0.34em] text-[#C9A84C]">
              Espace membre
            </p>

            <h1 className="mt-3 font-display text-[2.6rem] leading-[0.98] tracking-[-0.03em] text-[#F5F0E8] md:text-[3.4rem]">
              Mot de passe oublie
            </h1>

            <p className="mx-auto mt-4 max-w-md font-display text-[1rem] italic leading-[1.55] text-[#F5F0E8]/62 md:text-[1.08rem]">
              Recevez un lien securise pour retrouver l&apos;acces a votre espace
              AFRIKHER.
            </p>

            <div className="mx-auto mt-6 h-px w-20 bg-[#C9A84C]/70" />
          </div>

          <div className="border border-[#C9A84C]/18 bg-[#111111]/88 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2.5 block font-body text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#C9A84C]/88">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D877C]"
                  />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="h-13 w-full border border-[#C9A84C]/14 bg-[#080808] py-3 pl-12 pr-4 font-body text-sm text-[#F5F0E8] outline-none transition-colors placeholder:text-[#8D877C] focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              {error && (
                <div className="border border-red-400/20 bg-red-500/10 px-4 py-3">
                  <p className="font-body text-sm leading-[1.6] text-red-300">
                    {error}
                  </p>
                </div>
              )}

              {success && (
                <div className="border border-emerald-400/20 bg-emerald-500/10 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-300"
                    />
                    <p className="font-body text-sm leading-[1.6] text-emerald-200">
                      {success}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-13 w-full items-center justify-center gap-3 bg-[#C9A84C] px-6 font-body text-[0.74rem] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all duration-300 hover:bg-[#E2C872] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0A0A0A] border-t-transparent" />
                ) : (
                  <>
                    <span>Envoyer le lien</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-white/8 pt-5">
              <p className="text-center font-body text-[0.84rem] leading-[1.7] text-[#F5F0E8]/48">
                Si votre adresse est reconnue, vous recevrez un lien de
                reinitialisation en quelques instants.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3 text-center">
            <p className="font-body text-sm text-[#F5F0E8]/56">
              Vous vous souvenez de votre mot de passe ?{" "}
              <Link
                href="/auth/login"
                className="text-[#C9A84C] transition-opacity hover:opacity-75"
              >
                Se connecter
              </Link>
            </p>

            <Link
              href="/"
              className="inline-block font-body text-[0.68rem] uppercase tracking-[0.22em] text-[#8D877C] transition-colors hover:text-[#C9A84C]"
            >
              Retour a l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(
      "Votre compte a ete cree. Verifiez votre boite email pour confirmer votre inscription."
    );
    setLoading(false);
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
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
              Creer votre compte
            </h1>

            <p className="mx-auto mt-4 max-w-md font-display text-[1rem] italic leading-[1.55] text-[#F5F0E8]/62 md:text-[1.08rem]">
              Rejoignez l&apos;univers AFRIKHER et accedez a votre espace en toute
              fluidite.
            </p>

            <div className="mx-auto mt-6 h-px w-20 bg-[#C9A84C]/70" />
          </div>

          <div className="border border-[#C9A84C]/18 bg-[#111111]/88 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-8">
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="mb-2.5 block font-body text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#C9A84C]/88">
                  Nom complet
                </label>
                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D877C]"
                  />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Prenom Nom"
                    className="h-13 w-full border border-[#C9A84C]/14 bg-[#080808] py-3 pl-12 pr-4 font-body text-sm text-[#F5F0E8] outline-none transition-colors placeholder:text-[#8D877C] focus:border-[#C9A84C]"
                  />
                </div>
              </div>

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

              <div>
                <label className="mb-2.5 block font-body text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#C9A84C]/88">
                  Mot de passe
                </label>

                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D877C]"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-13 w-full border border-[#C9A84C]/14 bg-[#080808] py-3 pl-12 pr-12 font-body text-sm text-[#F5F0E8] outline-none transition-colors placeholder:text-[#8D877C] focus:border-[#C9A84C]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D877C] transition-colors hover:text-[#C9A84C]"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2.5 block font-body text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#C9A84C]/88">
                  Confirmer le mot de passe
                </label>

                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D877C]"
                  />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-13 w-full border border-[#C9A84C]/14 bg-[#080808] py-3 pl-12 pr-12 font-body text-sm text-[#F5F0E8] outline-none transition-colors placeholder:text-[#8D877C] focus:border-[#C9A84C]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D877C] transition-colors hover:text-[#C9A84C]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
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
                    <span>Creer un compte</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-white/8 pt-5">
              <p className="text-center font-body text-[0.84rem] leading-[1.7] text-[#F5F0E8]/48">
                Votre espace AFRIKHER vous donne acces a vos contenus, votre
                univers membre et vos avantages reserves.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3 text-center">
            <p className="font-body text-sm text-[#F5F0E8]/56">
              Deja un compte ?{" "}
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

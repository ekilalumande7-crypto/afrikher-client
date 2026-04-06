"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isRecoveryReady, setIsRecoveryReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    let invalidationTimer: number | null = null;
    let unsubscribe: (() => void) | null = null;

    const validateRecovery = async () => {
      try {
        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const hashError =
          hash.get("error_description") || hash.get("error") || null;

        if (hashError) {
          if (!mounted) return;
          setError(
            "Ce lien de reinitialisation est invalide ou a expire. Merci de recommencer."
          );
          setCheckingLink(false);
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session) {
          setIsRecoveryReady(true);
          setCheckingLink(false);
          return;
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, sessionValue) => {
          if (!mounted) return;
          if (event === "PASSWORD_RECOVERY" || sessionValue) {
            if (invalidationTimer) {
              window.clearTimeout(invalidationTimer);
              invalidationTimer = null;
            }
            setIsRecoveryReady(true);
            setCheckingLink(false);
            setError(null);
          }
        });

        unsubscribe = () => subscription.unsubscribe();

        invalidationTimer = window.setTimeout(() => {
          if (!mounted) return;
          setCheckingLink(false);
          setIsRecoveryReady(false);
          setError(
            "Ce lien de reinitialisation est invalide ou a expire. Merci de recommencer."
          );
        }, 1800);
      } catch {
        if (!mounted) return;
        setError(
          "Impossible de verifier ce lien de reinitialisation pour le moment."
        );
        setCheckingLink(false);
      }
    };

    validateRecovery();

    return () => {
      mounted = false;
      if (invalidationTimer) {
        window.clearTimeout(invalidationTimer);
      }
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setSuccess(null);

    if (!isRecoveryReady) {
      setError("Le lien de reinitialisation n'est pas valide.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caracteres.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(
      "Votre mot de passe a ete mis a jour. Vous allez etre redirige vers la connexion."
    );
    setLoading(false);
    setPassword("");
    setConfirmPassword("");

    window.setTimeout(() => {
      router.push("/auth/login");
    }, 1800);
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
              Nouveau mot de passe
            </h1>

            <p className="mx-auto mt-4 max-w-md font-display text-[1rem] italic leading-[1.55] text-[#F5F0E8]/62 md:text-[1.08rem]">
              Choisissez un mot de passe sobre, securise et facile a retrouver.
            </p>

            <div className="mx-auto mt-6 h-px w-20 bg-[#C9A84C]/70" />
          </div>

          <div className="border border-[#C9A84C]/18 bg-[#111111]/88 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-8">
            {checkingLink ? (
              <div className="flex min-h-[16rem] flex-col items-center justify-center gap-4 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
                <p className="font-body text-sm leading-[1.7] text-[#F5F0E8]/56">
                  Verification du lien de reinitialisation...
                </p>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-5">
                <div>
                  <label className="mb-2.5 block font-body text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#C9A84C]/88">
                    Nouveau mot de passe
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
                      disabled={!isRecoveryReady || !!success}
                      className="h-13 w-full border border-[#C9A84C]/14 bg-[#080808] py-3 pl-12 pr-12 font-body text-sm text-[#F5F0E8] outline-none transition-colors placeholder:text-[#8D877C] focus:border-[#C9A84C] disabled:cursor-not-allowed disabled:opacity-60"
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
                      disabled={!isRecoveryReady || !!success}
                      className="h-13 w-full border border-[#C9A84C]/14 bg-[#080808] py-3 pl-12 pr-12 font-body text-sm text-[#F5F0E8] outline-none transition-colors placeholder:text-[#8D877C] focus:border-[#C9A84C] disabled:cursor-not-allowed disabled:opacity-60"
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
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        size={18}
                        className="mt-0.5 shrink-0 text-red-300"
                      />
                      <p className="font-body text-sm leading-[1.6] text-red-300">
                        {error}
                      </p>
                    </div>
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
                  disabled={loading || !isRecoveryReady || !!success}
                  className="inline-flex h-13 w-full items-center justify-center gap-3 bg-[#C9A84C] px-6 font-body text-[0.74rem] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all duration-300 hover:bg-[#E2C872] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0A0A0A] border-t-transparent" />
                  ) : (
                    <>
                      <span>Mettre a jour</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 border-t border-white/8 pt-5">
              <p className="text-center font-body text-[0.84rem] leading-[1.7] text-[#F5F0E8]/48">
                Une fois votre mot de passe modifie, vous retrouverez
                immediatement l&apos;acces a votre espace membre.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3 text-center">
            <p className="font-body text-sm text-[#F5F0E8]/56">
              Besoin d&apos;un nouveau lien ?{" "}
              <Link
                href="/auth/forgot-password"
                className="text-[#C9A84C] transition-opacity hover:opacity-75"
              >
                Recommencer
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

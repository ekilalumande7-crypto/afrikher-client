"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      // Mocking the API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section className="py-32 px-6 md:px-12 bg-brand-cream text-brand-dark border-t border-brand-charcoal/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div
            className="max-w-xl"
          >
            <span className="text-brand-gold font-body font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">
              Le Cercle AFRIKHER
            </span>
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[0.9] tracking-tighter">
              Rejoignez <br /> <span className="text-brand-gold italic">le Cercle.</span>
            </h2>
            <p className="text-brand-gray text-lg mb-8 font-body leading-relaxed">
              Recevez chaque semaine nos analyses exclusives, portraits d'entrepreneures et invitations aux événements AFRIKHER. L'excellence se partage.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-brand-gold" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gray">Analyses Hebdo</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-brand-gold" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gray">Invitations VIP</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-brand-gold" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gray">Contenu Privé</span>
              </div>
            </div>
          </div>

          <div
            className="bg-white p-8 md:p-12 shadow-2xl rounded-2xl border border-brand-charcoal/5"
          >
            <h3 className="text-2xl font-display font-bold mb-6">S'abonner à la newsletter</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Votre adresse email professionnelle"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-cream/30 border border-brand-charcoal/10 rounded-lg py-4 px-6 text-brand-dark focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all placeholder:text-brand-gray/50 font-body text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="w-full bg-brand-dark text-brand-cream py-4 px-8 rounded-lg font-body font-bold uppercase tracking-widest text-xs hover:bg-brand-gold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <div className="w-5 h-5 border-2 border-brand-cream border-t-transparent animate-spin rounded-full" />
                ) : status === "success" ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Inscrit avec succès</span>
                  </>
                ) : (
                  <>
                    <span>Rejoindre le cercle</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
              <p className="text-[10px] text-brand-gray text-center uppercase tracking-widest leading-relaxed">
                En vous inscrivant, vous acceptez notre politique de confidentialité. <br />
                Désabonnement possible à tout moment.
              </p>
            </form>

            {status === "error" && (
              <p className="mt-4 text-red-500 text-xs text-center font-bold uppercase tracking-widest">
                Une erreur est survenue. Veuillez réessayer.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

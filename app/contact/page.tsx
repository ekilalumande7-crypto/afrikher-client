"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, MapPin, Phone, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [config, setConfig] = useState<Record<string, string>>({});
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const { data } = await supabase
          .from("site_config")
          .select("key, value")
          .or("key.like.contact_%,key.like.social_%");
        const map: Record<string, string> = {};
        data?.forEach((row: { key: string; value: string }) => {
          map[row.key] = row.value || "";
        });
        setConfig(map);
      } catch (err) {
        console.error("Contact config load error:", err);
      } finally {
        setPageLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Contact request failed");
      }
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitError("L'envoi a échoué. Merci de réessayer dans un instant.");
    }
  };

  const contactEmail = config.contact_email || "contact@afrikher.com";
  const contactPhone = (config.contact_phone || "").trim();
  const addresses = [
    config.contact_address_1,
    config.contact_address_2,
    config.contact_address_3,
  ].filter(Boolean);

  const pageTitle = config.contact_page_title || "Contact";
  const pageSubtitle =
    config.contact_page_subtitle ||
    "Une présence attentive pour vos messages, collaborations et demandes éditoriales.";
  const introText =
    config.contact_intro_text ||
    "AFRIKHER reste ouvert aux échanges sensibles, aux projets éditoriaux et aux collaborations construites avec intention.";

  const heroLabel = config.contact_hero_label || "Prendre contact";
  const introLabel = config.contact_intro_label || "Restons en contact";
  const introTitle =
    config.contact_intro_title ||
    "Parlons de votre projet, de votre message ou d'une collaboration.";
  const helpTitle =
    config.contact_help_title || "Nous vous répondons avec attention.";
  const helpText =
    config.contact_help_text ||
    "Chaque message est lu avec soin. Pour une demande éditoriale, un partenariat ou une prise de contact plus directe, notre équipe revient vers vous dans les meilleurs délais.";
  const closingCtaLabel = config.contact_cta_label || "Écrire à l'équipe";
  const closingCtaLink = config.contact_cta_link || `mailto:${contactEmail}`;

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
        <Navbar />
        <div className="flex items-center justify-center py-48">
          <Loader2 size={40} className="animate-spin text-[#C9A84C]" />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
      <div className="fixed left-0 right-0 top-0 z-[90] h-20 bg-[#0A0A0A]" />
      <Navbar />

      <section className="bg-[#0A0A0A] px-6 pb-16 pt-28 text-[#F5F0E8] md:pb-20 md:pt-32">
        <div className="mx-auto max-w-5xl text-center md:px-10 lg:px-12">
          <p className="font-body text-[0.72rem] uppercase tracking-[0.34em] text-[#C9A84C]">
            {heroLabel}
          </p>
          <h1 className="mt-3 font-display text-[3.4rem] leading-[0.94] tracking-[-0.03em] md:text-[5.4rem]">
            {pageTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-display text-[1.04rem] italic leading-[1.5] text-[#F5F0E8]/64 md:text-[1.22rem]">
            {pageSubtitle}
          </p>
          <div className="mx-auto mt-6 h-px w-24 bg-[#C9A84C]/75" />
        </div>
      </section>

      <section className="bg-[#F5F0E8] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-7xl md:px-10 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] xl:gap-16">
            <div className="space-y-10">
              <div className="max-w-[30rem]">
                <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                  {introLabel}
                </p>
                <h2 className="mt-3 font-display text-[2.2rem] leading-[1] tracking-[-0.02em] md:text-[3rem]">
                  {introTitle}
                </h2>
                <p className="mt-4 font-body text-[0.96rem] leading-[1.75] text-[#0A0A0A]/60">
                  {introText}
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <Mail size={18} className="mt-1 shrink-0 text-[#C9A84C]" />
                  <div>
                    <p className="font-body text-[0.66rem] uppercase tracking-[0.24em] text-[#8A6E2F]">
                      Email
                    </p>
                    <p className="mt-2 font-body text-[1rem] leading-[1.7] text-[#0A0A0A]/74">
                      {contactEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin size={18} className="mt-1 shrink-0 text-[#C9A84C]" />
                  <div>
                    <p className="font-body text-[0.66rem] uppercase tracking-[0.24em] text-[#8A6E2F]">
                      Bureaux
                    </p>
                    <div className="mt-2 space-y-1.5 font-body text-[1rem] leading-[1.7] text-[#0A0A0A]/72">
                      {addresses.length > 0 ? (
                        addresses.map((addr, i) => <p key={i}>{addr}</p>)
                      ) : (
                        <p>Waterloo, Belgique</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone size={18} className="mt-1 shrink-0 text-[#C9A84C]" />
                  <div>
                    <p className="font-body text-[0.66rem] uppercase tracking-[0.24em] text-[#8A6E2F]">
                      Téléphone
                    </p>
                    <p className="mt-2 font-body text-[1rem] leading-[1.7] text-[#0A0A0A]/72">
                      {contactPhone || "Sur rendez-vous"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-black/10 bg-[#FBF7F0] p-6 md:p-8">
              {submitted ? (
                <div className="flex min-h-[28rem] flex-col justify-center text-left">
                  <p className="font-body text-[0.7rem] uppercase tracking-[0.32em] text-[#C9A84C]">
                    Message envoyé
                  </p>
                  <h3 className="mt-3 font-display text-[2.2rem] leading-[1] tracking-[-0.02em]">
                    Merci pour votre message.
                  </h3>
                  <p className="mt-4 max-w-[28rem] font-body text-[0.96rem] leading-[1.75] text-[#0A0A0A]/60">
                    Notre équipe vous répondra dans les plus brefs délais avec l'attention que mérite votre demande.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 block font-body text-[0.66rem] uppercase tracking-[0.24em] text-[#8A6E2F]">
                      Nom
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-12 w-full border border-black/10 bg-[#F7F1E8] px-4 font-body text-sm text-[#0A0A0A] outline-none transition-colors focus:border-[#C9A84C]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-body text-[0.66rem] uppercase tracking-[0.24em] text-[#8A6E2F]">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12 w-full border border-black/10 bg-[#F7F1E8] px-4 font-body text-sm text-[#0A0A0A] outline-none transition-colors focus:border-[#C9A84C]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-body text-[0.66rem] uppercase tracking-[0.24em] text-[#8A6E2F]">
                      Sujet
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="h-12 w-full border border-black/10 bg-[#F7F1E8] px-4 font-body text-sm text-[#0A0A0A] outline-none transition-colors focus:border-[#C9A84C]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-body text-[0.66rem] uppercase tracking-[0.24em] text-[#8A6E2F]">
                      Message
                    </label>
                    <textarea
                      required
                      rows={7}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="min-h-[11rem] w-full border border-black/10 bg-[#F7F1E8] p-4 font-body text-sm text-[#0A0A0A] outline-none transition-colors focus:border-[#C9A84C] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-3 bg-[#0A0A0A] px-6 py-3.5 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#F5F0E8] transition-all duration-300 hover:bg-[#C9A84C] hover:text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-2"
                  >
                    <span>Envoyer</span>
                    <ArrowRight size={14} />
                  </button>

                  {submitError && (
                    <p className="font-body text-sm text-[#9C3A2D]">{submitError}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0A0A0A] px-6 py-12 text-[#F5F0E8] md:py-14">
        <div className="mx-auto max-w-7xl md:px-10 lg:px-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[34rem]">
              <p className="font-body text-[0.7rem] uppercase tracking-[0.32em] text-[#C9A84C]">
                Correspondance
              </p>
              <h2 className="mt-3 font-display text-[2rem] leading-[1] tracking-[-0.02em] md:text-[2.5rem]">
                {helpTitle}
              </h2>
              <p className="mt-4 font-body text-[0.95rem] leading-[1.72] text-[#F5F0E8]/60">
                {helpText}
              </p>
            </div>

            <Link
              href={closingCtaLink}
              className="inline-flex items-center gap-3 border border-[#C9A84C] px-6 py-3 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#C9A84C] transition-colors duration-300 hover:bg-[#C9A84C] hover:text-[#0A0A0A]"
            >
              <span>{closingCtaLabel}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

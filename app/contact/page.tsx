"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
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
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error(err);
    }
    setSubmitted(true);
  };

  const contactEmail = config.contact_email || "contact@afrikher.com";
  const contactPhone = config.contact_phone || "";
  const addresses = [
    config.contact_address_1,
    config.contact_address_2,
    config.contact_address_3,
  ].filter(Boolean);
  const pageTitle = config.contact_page_title || "Contact";
  const pageSubtitle = config.contact_page_subtitle || "Une question, une collaboration ? Nous sommes \u00e0 votre \u00e9coute.";
  const introText = config.contact_intro_text || "AFRIKHER est toujours ouvert aux \u00e9changes, collaborations et nouvelles perspectives. N\u2019h\u00e9sitez pas \u00e0 nous \u00e9crire.";

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-brand-cream text-brand-dark">
        <Navbar />
        <div className="flex items-center justify-center py-60">
          <Loader2 size={40} className="animate-spin text-brand-gold" />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-cream text-brand-dark">
      <Navbar />

      <section className="pt-40 pb-20 px-6 bg-brand-dark text-brand-cream">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-8">{pageTitle}</h1>
          <p className="text-brand-gold italic text-xl font-display max-w-2xl mx-auto">
            {pageSubtitle}
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-display font-bold">Restons en contact</h2>
              <p className="text-brand-gray leading-relaxed">{introText}</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Mail size={20} className="text-brand-gold mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest mb-1">Email</h4>
                  <p className="text-brand-gray">{contactEmail}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPin size={20} className="text-brand-gold mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest mb-1">Bureaux</h4>
                  {addresses.length > 0 ? (
                    addresses.map((addr, i) => (
                      <p key={i} className="text-brand-gray">{addr}</p>
                    ))
                  ) : (
                    <p className="text-brand-gray">Waterloo, Belgique</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone size={20} className="text-brand-gold mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest mb-1">T\u00e9l\u00e9phone</h4>
                  <p className="text-brand-gray">{contactPhone || "Sur rendez-vous"}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="bg-brand-dark text-brand-cream p-12 text-center">
                <h3 className="text-2xl font-display font-bold mb-4 text-brand-gold">Message envoy\u00e9</h3>
                <p className="text-brand-cream/70">Merci pour votre message. Notre \u00e9quipe vous r\u00e9pondra dans les plus brefs d\u00e9lais.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Nom</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-brand-charcoal/30 py-3 focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-brand-charcoal/30 py-3 focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Sujet</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-transparent border-b border-brand-charcoal/30 py-3 focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border border-brand-charcoal/30 p-3 focus:outline-none focus:border-brand-gold transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-brand-dark text-brand-cream font-medium uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-all duration-300"
                >
                  Envoyer
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

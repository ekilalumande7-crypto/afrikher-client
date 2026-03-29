"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-brand-cream text-brand-dark">
      <Navbar />

      <section className="pt-40 pb-20 px-6 bg-brand-dark text-brand-cream">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-8">Contact</h1>
          <p className="text-brand-gold italic text-xl font-display max-w-2xl mx-auto">
            Une question, une collaboration ? Nous sommes à votre écoute.
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div
              className="space-y-8"
            >
              <h2 className="text-3xl font-display font-bold">Restons en contact</h2>
              <p className="text-brand-gray leading-relaxed">
                AFRIKHER est toujours ouvert aux échanges, collaborations et nouvelles perspectives.
                N'hésitez pas à nous écrire.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Mail size={20} className="text-brand-gold mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest mb-1">Email</h4>
                  <p className="text-brand-gray">contact@afrikher.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <MapPin size={20} className="text-brand-gold mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest mb-1">Bureaux</h4>
                  <p className="text-brand-gray">Paris, France</p>
                  <p className="text-brand-gray">Abidjan, Côte d'Ivoire</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone size={20} className="text-brand-gold mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest mb-1">Téléphone</h4>
                  <p className="text-brand-gray">Sur rendez-vous</p>
                </div>
              </div>
            </div>
          </div>

          <div
          >
            {submitted ? (
              <div className="bg-brand-dark text-brand-cream p-12 text-center">
                <h3 className="text-2xl font-display font-bold mb-4 text-brand-gold">Message envoyé</h3>
                <p className="text-brand-cream/70">Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.</p>
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

'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CircleCheck as CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-afrikher-cream">
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-afrikher-dark">
          <div className="absolute inset-0 bg-gradient-to-b from-afrikher-dark/80 to-afrikher-dark/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-afrikher-cream mb-6">
            Contactez-nous
          </h1>
          <p className="font-serif text-xl md:text-2xl text-afrikher-cream/90 italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Nous sommes à votre écoute
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-4xl font-bold text-afrikher-dark mb-6">
              Parlons ensemble
            </h2>
            <p className="text-afrikher-gray text-lg mb-8 leading-relaxed">
              Que vous ayez une question, une suggestion ou que vous souhaitiez collaborer avec nous,
              notre équipe est là pour vous répondre. N'hésitez pas à nous contacter.
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-afrikher-gold flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-afrikher-dark" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-afrikher-dark mb-2">Email</h3>
                  <p className="text-afrikher-gray">contact@afrikher.com</p>
                  <p className="text-afrikher-gray">redaction@afrikher.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-afrikher-gold flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-afrikher-dark" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-afrikher-dark mb-2">Téléphone</h3>
                  <p className="text-afrikher-gray">+33 1 XX XX XX XX</p>
                  <p className="text-afrikher-gray text-sm">Du lundi au vendredi, 9h-18h</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-afrikher-gold flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-afrikher-dark" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-afrikher-dark mb-2">Adresse</h3>
                  <p className="text-afrikher-gray">Paris, France</p>
                  <p className="text-afrikher-gray">Dakar, Sénégal</p>
                </div>
              </div>
            </div>

            <div className="bg-afrikher-dark p-8 text-afrikher-cream">
              <h3 className="font-display text-2xl font-bold mb-4">
                Rejoignez notre communauté
              </h3>
              <p className="mb-6 text-afrikher-cream/80">
                Suivez-nous sur les réseaux sociaux pour ne rien manquer de nos actualités et contenus exclusifs.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-afrikher-gold flex items-center justify-center hover:bg-opacity-80 transition-all duration-300">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5 text-afrikher-dark" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-afrikher-gold flex items-center justify-center hover:bg-opacity-80 transition-all duration-300">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5 text-afrikher-dark" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-afrikher-gold flex items-center justify-center hover:bg-opacity-80 transition-all duration-300">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5 text-afrikher-dark" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 border border-afrikher-dark/10">
            <h2 className="font-display text-3xl font-bold text-afrikher-dark mb-8">
              Envoyez-nous un message
            </h2>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="font-display text-2xl font-bold text-afrikher-dark mb-2">
                  Message envoyé !
                </h3>
                <p className="text-afrikher-gray text-center">
                  Nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-sans text-sm font-medium text-afrikher-dark mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-afrikher-dark/20 focus:border-afrikher-gold focus:outline-none transition-colors"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-sans text-sm font-medium text-afrikher-dark mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-afrikher-dark/20 focus:border-afrikher-gold focus:outline-none transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block font-sans text-sm font-medium text-afrikher-dark mb-2">
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-afrikher-dark/20 focus:border-afrikher-gold focus:outline-none transition-colors"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="general">Question générale</option>
                    <option value="partenariat">Partenariat</option>
                    <option value="redaction">Proposition de contenu</option>
                    <option value="abonnement">Abonnement</option>
                    <option value="technique">Support technique</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block font-sans text-sm font-medium text-afrikher-dark mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-afrikher-dark/20 focus:border-afrikher-gold focus:outline-none transition-colors resize-none"
                    placeholder="Votre message..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-afrikher-gold text-afrikher-dark font-sans font-semibold py-4 px-6 hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Envoyer le message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

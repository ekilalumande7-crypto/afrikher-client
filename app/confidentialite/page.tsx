"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

export default function ConfidentialitePage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Politique de confidentialit\u00e9");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("site_config")
        .select("key, value")
        .in("key", ["legal_privacy_title", "legal_privacy_content"]);

      if (data) {
        data.forEach((row: { key: string; value: string }) => {
          if (row.key === "legal_privacy_title" && row.value) setTitle(row.value);
          if (row.key === "legal_privacy_content" && row.value) setContent(row.value);
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const defaultContent = `<p><strong>Derni\u00e8re mise \u00e0 jour :</strong> Avril 2026</p>
<p>AFRIKHER Magazine, \u00e9dit\u00e9 par Lamb&amp;Lion Corporate, s\u2019engage \u00e0 prot\u00e9ger la vie priv\u00e9e de ses utilisateurs. La pr\u00e9sente politique d\u00e9crit comment nous collectons, utilisons et prot\u00e9geons vos donn\u00e9es personnelles.</p>

<h2>1. Responsable du traitement</h2>
<p><strong>Lamb&amp;Lion Corporate</strong><br/>
20, avenue Eben-Ezer, Jama\u00efque / Kitambo<br/>
Kinshasa \u2013 R\u00e9publique D\u00e9mocratique du Congo<br/>
Contact : <a href="mailto:hadassa.ekilalumande@afrikher.com">hadassa.ekilalumande@afrikher.com</a></p>

<h2>2. Donn\u00e9es collect\u00e9es</h2>
<p>Nous collectons les donn\u00e9es suivantes dans le cadre de l\u2019utilisation de nos services :</p>
<ul>
<li><strong>Donn\u00e9es d\u2019identification :</strong> nom, pr\u00e9nom, adresse email</li>
<li><strong>Donn\u00e9es de connexion :</strong> adresse IP, type de navigateur, pages visit\u00e9es</li>
<li><strong>Donn\u00e9es de paiement :</strong> trait\u00e9es exclusivement par FIDEPAY (propuls\u00e9 par Stripe) \u2014 nous ne conservons aucune donn\u00e9e bancaire</li>
<li><strong>Donn\u00e9es de profil :</strong> photo, adresse de livraison, pr\u00e9f\u00e9rences newsletter</li>
</ul>

<h2>3. Finalit\u00e9s du traitement</h2>
<p>Vos donn\u00e9es sont utilis\u00e9es pour :</p>
<ul>
<li>La gestion de votre compte et de vos abonnements</li>
<li>Le traitement de vos commandes et paiements</li>
<li>L\u2019envoi de newsletters et communications \u00e9ditoriales (avec votre consentement)</li>
<li>L\u2019am\u00e9lioration de nos services et de l\u2019exp\u00e9rience utilisateur</li>
<li>Le respect de nos obligations l\u00e9gales</li>
</ul>

<h2>4. Base l\u00e9gale</h2>
<p>Le traitement de vos donn\u00e9es repose sur :</p>
<ul>
<li>Votre consentement (newsletter, cookies non essentiels)</li>
<li>L\u2019ex\u00e9cution du contrat (abonnement, commandes)</li>
<li>Notre int\u00e9r\u00eat l\u00e9gitime (am\u00e9lioration des services, s\u00e9curit\u00e9)</li>
</ul>

<h2>5. Sous-traitants et partenaires techniques</h2>
<p>Nous faisons appel aux prestataires suivants pour le fonctionnement de nos services :</p>
<ul>
<li><strong>Supabase</strong> (Europe) \u2014 Base de donn\u00e9es et authentification</li>
<li><strong>Firebase</strong> (Google) \u2014 Notifications en temps r\u00e9el</li>
<li><strong>Brevo</strong> \u2014 Envoi d\u2019emails transactionnels et newsletters</li>
<li><strong>FIDEPAY / Stripe</strong> \u2014 Traitement s\u00e9curis\u00e9 des paiements</li>
<li><strong>Vercel</strong> \u2014 H\u00e9bergement du site web</li>
<li><strong>Technovolut</strong> \u2014 D\u00e9veloppement et maintenance technique</li>
</ul>

<h2>6. Dur\u00e9e de conservation</h2>
<p>Vos donn\u00e9es sont conserv\u00e9es :</p>
<ul>
<li>Pendant la dur\u00e9e de votre inscription pour les donn\u00e9es de compte</li>
<li>3 ans apr\u00e8s votre derni\u00e8re activit\u00e9 pour les donn\u00e9es de navigation</li>
<li>Conform\u00e9ment aux obligations l\u00e9gales pour les donn\u00e9es de facturation</li>
</ul>

<h2>7. Vos droits</h2>
<p>Conform\u00e9ment \u00e0 la r\u00e9glementation applicable, vous disposez des droits suivants :</p>
<ul>
<li>Droit d\u2019acc\u00e8s \u00e0 vos donn\u00e9es personnelles</li>
<li>Droit de rectification des donn\u00e9es inexactes</li>
<li>Droit \u00e0 l\u2019effacement de vos donn\u00e9es</li>
<li>Droit \u00e0 la limitation du traitement</li>
<li>Droit \u00e0 la portabilit\u00e9 de vos donn\u00e9es</li>
<li>Droit d\u2019opposition au traitement</li>
<li>Droit de retirer votre consentement \u00e0 tout moment</li>
</ul>
<p>Pour exercer ces droits, contactez-nous \u00e0 : <a href="mailto:hadassa.ekilalumande@afrikher.com">hadassa.ekilalumande@afrikher.com</a></p>

<h2>8. S\u00e9curit\u00e9</h2>
<p>Nous mettons en \u0153uvre des mesures techniques et organisationnelles appropri\u00e9es pour prot\u00e9ger vos donn\u00e9es contre tout acc\u00e8s non autoris\u00e9, perte ou alt\u00e9ration.</p>

<h2>9. Transferts internationaux</h2>
<p>Certaines donn\u00e9es peuvent \u00eatre trait\u00e9es en dehors de votre pays de r\u00e9sidence, notamment via nos prestataires techniques. Ces transferts sont encadr\u00e9s par des garanties appropri\u00e9es.</p>

<h2>10. Modifications</h2>
<p>Nous nous r\u00e9servons le droit de modifier cette politique \u00e0 tout moment. Toute modification sera publi\u00e9e sur cette page avec la date de mise \u00e0 jour.</p>

<h2>11. Contact</h2>
<p>Pour toute question relative \u00e0 la protection de vos donn\u00e9es :<br/>
<a href="mailto:hadassa.ekilalumande@afrikher.com">hadassa.ekilalumande@afrikher.com</a></p>`;

  const html = content || defaultContent;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A] pt-32 pb-20">
        <div className="max-w-[780px] mx-auto px-6">
          <div className="mb-12">
            <span className="text-[0.5rem] text-[#C9A84C]/50 tracking-[0.35em] uppercase font-body block mb-4">
              Protection des donn\u00e9es
            </span>
            <h1 className="font-display text-[2rem] md:text-[2.8rem] text-[#F5F0E8] leading-[1.1] mb-4">
              {title}
            </h1>
            <div className="w-12 h-[1px] bg-[#C9A84C]/30" />
          </div>

          {loading ? (
            <div className="text-[#F5F0E8]/30 font-body text-sm">Chargement...</div>
          ) : (
            <div
              className="legal-content font-body text-[#F5F0E8]/70 text-[0.95rem] leading-[1.9]"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}

          <div className="mt-16 pt-8 border-t border-white/[0.06]">
            <Link href="/" className="text-[#C9A84C]/60 font-body text-[0.75rem] tracking-[0.15em] uppercase hover:text-[#C9A84C] transition-colors">
              \u2190 Retour \u00e0 l\u2019accueil
            </Link>
          </div>
        </div>
      </main>
      <Footer />

      <style jsx global>{`
        .legal-content h2 { font-family: var(--font-display, 'Cormorant Garamond', serif); font-size: 1.4rem; color: #F5F0E8; margin-top: 2.5rem; margin-bottom: 0.8rem; }
        .legal-content h3 { font-family: var(--font-display, 'Cormorant Garamond', serif); font-size: 1.15rem; color: #F5F0E8; margin-top: 2rem; margin-bottom: 0.6rem; }
        .legal-content p { margin-bottom: 1rem; }
        .legal-content ul { list-style: none; padding-left: 0; margin-bottom: 1rem; }
        .legal-content ul li { position: relative; padding-left: 1.2rem; margin-bottom: 0.5rem; }
        .legal-content ul li::before { content: ''; position: absolute; left: 0; top: 0.65rem; width: 4px; height: 4px; background: #C9A84C40; border-radius: 50%; }
        .legal-content a { color: #C9A84C; text-decoration: underline; text-underline-offset: 3px; }
        .legal-content a:hover { color: #E8C97A; }
        .legal-content strong { color: #F5F0E8; }
      `}</style>
    </>
  );
}

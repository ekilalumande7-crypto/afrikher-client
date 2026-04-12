"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

export default function CookiesPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Politique de cookies");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("site_config")
        .select("key, value")
        .in("key", ["legal_cookies_title", "legal_cookies_content"]);

      if (data) {
        data.forEach((row: { key: string; value: string }) => {
          if (row.key === "legal_cookies_title" && row.value) setTitle(row.value);
          if (row.key === "legal_cookies_content" && row.value) setContent(row.value);
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const defaultContent = `<p><strong>Derni\u00e8re mise \u00e0 jour :</strong> Avril 2026</p>
<p>Le site AFRIKHER Magazine utilise des cookies et technologies similaires pour assurer son bon fonctionnement et am\u00e9liorer votre exp\u00e9rience de navigation.</p>

<h2>1. Qu\u2019est-ce qu\u2019un cookie ?</h2>
<p>Un cookie est un petit fichier texte d\u00e9pos\u00e9 sur votre appareil (ordinateur, tablette, t\u00e9l\u00e9phone) lors de la visite d\u2019un site web. Il permet au site de m\u00e9moriser certaines informations sur votre visite pour faciliter votre navigation.</p>

<h2>2. Cookies utilis\u00e9s</h2>

<h3>Cookies strictement n\u00e9cessaires</h3>
<p>Ces cookies sont indispensables au fonctionnement du site. Ils ne peuvent pas \u00eatre d\u00e9sactiv\u00e9s.</p>
<ul>
<li><strong>Authentification Supabase</strong> \u2014 Gestion de votre session de connexion</li>
<li><strong>S\u00e9curit\u00e9</strong> \u2014 Protection contre les acc\u00e8s non autoris\u00e9s</li>
</ul>

<h3>Cookies fonctionnels</h3>
<p>Ces cookies permettent d\u2019am\u00e9liorer le fonctionnement du site et de personnaliser votre exp\u00e9rience.</p>
<ul>
<li><strong>Pr\u00e9f\u00e9rences utilisateur</strong> \u2014 Langue, th\u00e8me, param\u00e8tres d\u2019affichage</li>
<li><strong>Panier d\u2019achat</strong> \u2014 M\u00e9morisation de vos articles s\u00e9lectionn\u00e9s</li>
</ul>

<h3>Cookies tiers</h3>
<p>Certains services tiers utilis\u00e9s par AFRIKHER Magazine peuvent d\u00e9poser des cookies :</p>
<ul>
<li><strong>Firebase</strong> (Google) \u2014 Notifications en temps r\u00e9el</li>
<li><strong>Vercel Analytics</strong> \u2014 Statistiques anonymis\u00e9es de fr\u00e9quentation</li>
<li><strong>Stripe / FIDEPAY</strong> \u2014 S\u00e9curisation des paiements</li>
</ul>

<h2>3. Dur\u00e9e de conservation</h2>
<ul>
<li>Cookies de session : supprim\u00e9s \u00e0 la fermeture du navigateur</li>
<li>Cookies persistants : conserv\u00e9s entre 30 jours et 13 mois maximum</li>
</ul>

<h2>4. Gestion des cookies</h2>
<p>Vous pouvez \u00e0 tout moment configurer votre navigateur pour accepter ou refuser les cookies. La d\u00e9sactivation de certains cookies peut affecter le fonctionnement du site.</p>
<p>Voici comment g\u00e9rer les cookies dans les principaux navigateurs :</p>
<ul>
<li><strong>Chrome :</strong> Param\u00e8tres \u2192 Confidentialit\u00e9 et s\u00e9curit\u00e9 \u2192 Cookies</li>
<li><strong>Firefox :</strong> Param\u00e8tres \u2192 Vie priv\u00e9e et s\u00e9curit\u00e9 \u2192 Cookies</li>
<li><strong>Safari :</strong> Pr\u00e9f\u00e9rences \u2192 Confidentialit\u00e9 \u2192 G\u00e9rer les donn\u00e9es de sites</li>
<li><strong>Edge :</strong> Param\u00e8tres \u2192 Confidentialit\u00e9 \u2192 Cookies</li>
</ul>

<h2>5. Consentement</h2>
<p>En poursuivant votre navigation sur le site AFRIKHER Magazine, vous acceptez l\u2019utilisation des cookies strictement n\u00e9cessaires. Pour les autres cat\u00e9gories, votre consentement vous sera demand\u00e9.</p>

<h2>6. Modifications</h2>
<p>Cette politique de cookies peut \u00eatre mise \u00e0 jour \u00e0 tout moment. La date de derni\u00e8re modification est indiqu\u00e9e en haut de cette page.</p>

<h2>7. Contact</h2>
<p>Pour toute question relative aux cookies :<br/>
<a href="mailto:hadassa.ekilalumande@afrikher.com">hadassa.ekilalumande@afrikher.com</a></p>`;

  const html = content || defaultContent;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A] pt-32 pb-20">
        <div className="max-w-[780px] mx-auto px-6">
          <div className="mb-12">
            <span className="text-[0.5rem] text-[#C9A84C]/50 tracking-[0.35em] uppercase font-body block mb-4">
              Vie priv\u00e9e
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

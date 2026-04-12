"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

export default function ConditionsPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Conditions d\u2019utilisation & Mentions l\u00e9gales");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("site_config")
        .select("key, value")
        .in("key", ["legal_conditions_title", "legal_conditions_content"]);

      if (data) {
        data.forEach((row: { key: string; value: string }) => {
          if (row.key === "legal_conditions_title" && row.value) setTitle(row.value);
          if (row.key === "legal_conditions_content" && row.value) setContent(row.value);
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const defaultContent = `<p><strong>Derni\u00e8re mise \u00e0 jour :</strong> Avril 2026</p>
<p>L\u2019acc\u00e8s et l\u2019utilisation du magazine digital AFRIKHER Magazine impliquent l\u2019acceptation pleine et enti\u00e8re des pr\u00e9sentes conditions.</p>

<h2>1. \u00c9diteur</h2>
<p>Le magazine AFRIKHER Magazine est \u00e9dit\u00e9 par :<br/>
<strong>Lamb&amp;Lion Corporate</strong><br/>
20, avenue Eben-Ezer<br/>
Jama\u00efque / Kitambo<br/>
Kinshasa \u2013 R\u00e9publique D\u00e9mocratique du Congo<br/>
R\u00e9sidence secondaire : Waterloo \u2013 Belgique<br/>
Repr\u00e9sent\u00e9e par : Hadassa H\u00e9l\u00e8ne EKILA-LUMANDE, Fondatrice &amp; R\u00e9dactrice en Cheffe</p>

<h2>2. Objet</h2>
<p>AFRIKHER Magazine est un magazine digital panafricain premium d\u00e9di\u00e9 au business, au leadership et \u00e0 l\u2019entrepreneuriat f\u00e9minin.</p>
<p>Les pr\u00e9sentes conditions ont pour objet de d\u00e9finir les modalit\u00e9s d\u2019acc\u00e8s, d\u2019utilisation et d\u2019exploitation des contenus propos\u00e9s.</p>

<h2>3. Acc\u00e8s au service</h2>
<p>L\u2019acc\u00e8s au magazine est strictement personnel, non cessible et r\u00e9serv\u00e9 \u00e0 l\u2019utilisateur ayant proc\u00e9d\u00e9 \u00e0 son acquisition.</p>
<p>Toute utilisation est limit\u00e9e \u00e0 un cadre priv\u00e9, excluant tout usage commercial ou collectif.</p>

<h2>4. Propri\u00e9t\u00e9 intellectuelle</h2>
<p>L\u2019ensemble des \u00e9l\u00e9ments constituant AFRIKHER Magazine (textes, visuels, photographies, vid\u00e9os, interviews, design, identit\u00e9 graphique, logo) est prot\u00e9g\u00e9 par les l\u00e9gislations nationales et internationales relatives \u00e0 la propri\u00e9t\u00e9 intellectuelle.</p>
<p>Toute reproduction, repr\u00e9sentation, diffusion ou exploitation, totale ou partielle, sans autorisation \u00e9crite pr\u00e9alable est strictement interdite.</p>

<h2>5. Interdictions d\u2019usage</h2>
<p>Il est formellement interdit :</p>
<ul>
<li>De revendre, partager ou redistribuer le magazine, sous quelque forme que ce soit</li>
<li>De reproduire ou exploiter les contenus \u00e0 des fins commerciales, concurrentielles ou m\u00e9diatiques</li>
<li>D\u2019utiliser les contenus d\u2019une mani\u00e8re portant atteinte \u00e0 AFRIKHER Magazine, \u00e0 ses partenaires ou aux personnes pr\u00e9sent\u00e9es</li>
<li>De d\u00e9tourner les informations \u00e0 des fins diffamatoires, nuisibles ou contraires \u00e0 l\u2019\u00e9thique</li>
</ul>

<h2>6. Utilisation des contenus</h2>
<p>Les contenus sont propos\u00e9s \u00e0 des fins \u00e9ditoriales, informatives et inspirantes.</p>
<p>Toute citation ou utilisation publique doit faire l\u2019objet d\u2019une autorisation \u00e9crite pr\u00e9alable.</p>

<h2>7. Protection de l\u2019image et des personnes</h2>
<p>Les images, interviews et contenus mettant en lumi\u00e8re les entrepreneures sont strictement prot\u00e9g\u00e9s.</p>
<p>Toute r\u00e9utilisation non autoris\u00e9e est susceptible d\u2019engager la responsabilit\u00e9 civile et p\u00e9nale de l\u2019utilisateur.</p>

<h2>8. Donn\u00e9es personnelles &amp; Technologies</h2>
<p>AFRIKHER Magazine s\u2019appuie sur des solutions technologiques reconnues afin d\u2019assurer la s\u00e9curit\u00e9 et la confidentialit\u00e9 des donn\u00e9es.</p>
<ul>
<li>Base de donn\u00e9es : Supabase (Europe)</li>
<li>Authentification : Firebase</li>
<li>Emailing : Brevo</li>
<li>D\u00e9veloppement : Technovolut</li>
<li>H\u00e9bergement : Hostinger &amp; Vercel</li>
<li>Traitement d\u2019images : captation r\u00e9elle et optimisation via intelligence artificielle (Congo AI)</li>
</ul>
<p>Les donn\u00e9es collect\u00e9es sont utilis\u00e9es exclusivement dans le cadre des services propos\u00e9s et conform\u00e9ment aux r\u00e9glementations applicables, notamment en mati\u00e8re de protection des donn\u00e9es.</p>

<h2>9. Paiement</h2>
<p>Les transactions sont s\u00e9curis\u00e9es via FIDEPAY, solution de paiement propuls\u00e9e par Stripe.</p>
<p>Les donn\u00e9es bancaires ne sont pas conserv\u00e9es par AFRIKHER Magazine.</p>

<h2>10. Responsabilit\u00e9</h2>
<p>AFRIKHER Magazine s\u2019engage \u00e0 fournir des contenus fiables et qualitatifs.</p>
<p>Toutefois, l\u2019utilisation des informations rel\u00e8ve de la responsabilit\u00e9 exclusive de l\u2019utilisateur.</p>

<h2>11. Sanctions</h2>
<p>Toute violation des pr\u00e9sentes conditions pourra entra\u00eener :</p>
<ul>
<li>La suspension ou suppression de l\u2019acc\u00e8s</li>
<li>Des poursuites judiciaires</li>
<li>Une demande de r\u00e9paration du pr\u00e9judice subi</li>
</ul>

<h2>12. \u00c9volution des conditions</h2>
<p>AFRIKHER Magazine se r\u00e9serve le droit de modifier les pr\u00e9sentes conditions \u00e0 tout moment.</p>

<h2>13. Droit applicable</h2>
<p>Les pr\u00e9sentes conditions sont r\u00e9gies par les lois applicables.</p>
<p>Tout litige sera soumis aux juridictions comp\u00e9tentes.</p>

<h2>Mentions l\u00e9gales compl\u00e9mentaires</h2>

<h3>H\u00e9bergement</h3>
<p>Le site AFRIKHER Magazine est h\u00e9berg\u00e9 par : Hostinger &amp; Vercel</p>

<h3>Propri\u00e9t\u00e9 du site</h3>
<p>Le site internet et le magazine AFRIKHER sont la propri\u00e9t\u00e9 exclusive de <strong>Lamb&amp;Lion Corporate.</strong></p>

<h3>Contact</h3>
<p>Pour toute demande : <a href="mailto:hadassa.ekilalumande@afrikher.com">hadassa.ekilalumande@afrikher.com</a></p>

<h3>Engagement AFRIKHER Magazine</h3>
<p>AFRIKHER Magazine s\u2019inscrit dans une d\u00e9marche d\u2019excellence, de respect et de valorisation du leadership f\u00e9minin africain.</p>
<p>Chaque contenu est produit avec exigence et doit \u00eatre utilis\u00e9 avec responsabilit\u00e9.</p>`;

  const html = content || defaultContent;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A] pt-32 pb-20">
        <div className="max-w-[780px] mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <span className="text-[0.5rem] text-[#C9A84C]/50 tracking-[0.35em] uppercase font-body block mb-4">
              Informations l\u00e9gales
            </span>
            <h1 className="font-display text-[2rem] md:text-[2.8rem] text-[#F5F0E8] leading-[1.1] mb-4">
              {title}
            </h1>
            <div className="w-12 h-[1px] bg-[#C9A84C]/30" />
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-[#F5F0E8]/30 font-body text-sm">Chargement...</div>
          ) : (
            <div
              className="legal-content font-body text-[#F5F0E8]/70 text-[0.95rem] leading-[1.9]"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}

          {/* Back link */}
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

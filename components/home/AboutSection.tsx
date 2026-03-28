'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AboutSection() {
  const [aboutText, setAboutText] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchAbout = async () => {
      const { data } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'about_text')
        .maybeSingle();

      if (data) {
        setAboutText(data.value || '');
      }
    };

    fetchAbout();
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-afrikher-dark mb-4">
            Qui Sommes-Nous
          </h2>
          <div className="w-24 h-1 bg-afrikher-gold mx-auto"></div>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="font-sans text-lg text-afrikher-charcoal leading-relaxed text-center">
            {aboutText || 'AFRIKHER est une plateforme éditoriale premium dédiée aux femmes entrepreneures africaines et de la diaspora.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-afrikher-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="font-display text-3xl font-bold text-afrikher-dark">1</span>
            </div>
            <h3 className="font-display text-xl font-semibold text-afrikher-dark mb-2">
              Excellence
            </h3>
            <p className="font-sans text-sm text-afrikher-gray">
              Contenu premium et inspirant pour les entrepreneures
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-afrikher-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="font-display text-3xl font-bold text-afrikher-dark">2</span>
            </div>
            <h3 className="font-display text-xl font-semibold text-afrikher-dark mb-2">
              Innovation
            </h3>
            <p className="font-sans text-sm text-afrikher-gray">
              Plateforme moderne au service du business féminin
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-afrikher-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="font-display text-3xl font-bold text-afrikher-dark">3</span>
            </div>
            <h3 className="font-display text-xl font-semibold text-afrikher-dark mb-2">
              Communauté
            </h3>
            <p className="font-sans text-sm text-afrikher-gray">
              Réseau dynamique de femmes entrepreneures africaines
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

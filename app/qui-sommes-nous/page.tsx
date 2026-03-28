import Image from 'next/image';
import { Users, Target, Heart, Award } from 'lucide-react';

export default function QuiSommesNousPage() {
  return (
    <div className="min-h-screen bg-afrikher-cream">
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-afrikher-dark">
          <div className="absolute inset-0 bg-gradient-to-b from-afrikher-dark/80 to-afrikher-dark/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-afrikher-cream mb-6">
            Qui sommes-nous ?
          </h1>
          <p className="font-serif text-xl md:text-2xl text-afrikher-cream/90 italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            L'élégance hors du commun. Le Business au féminin.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="font-display text-4xl font-bold text-afrikher-dark mb-6">
              Notre Histoire
            </h2>
            <div className="space-y-4 text-afrikher-gray leading-relaxed">
              <p>
                AFRIKHER est né d'une vision : celle de créer un espace dédié à l'entrepreneuriat féminin africain,
                où les femmes qui osent, qui innovent et qui transforment trouvent enfin la reconnaissance qu'elles méritent.
              </p>
              <p>
                Dans un monde où les récits entrepreneuriaux africains sont souvent invisibilisés, AFRIKHER se positionne
                comme le magazine premium qui célèbre l'excellence, l'audace et l'élégance de ces femmes d'exception.
              </p>
              <p>
                Plus qu'un simple magazine, AFRIKHER est une communauté, une plateforme d'inspiration et un tremplin
                pour toutes celles qui construisent l'Afrique de demain.
              </p>
            </div>
          </div>

          <div className="relative h-[400px] bg-afrikher-dark">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Award className="w-20 h-20 text-afrikher-gold mx-auto mb-4" />
                <p className="font-serif text-2xl text-afrikher-cream italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  L'excellence au féminin
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="font-display text-4xl font-bold text-afrikher-dark mb-12 text-center">
            Nos Valeurs
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-afrikher-dark/10 hover:border-afrikher-gold transition-all duration-300">
              <div className="w-16 h-16 bg-afrikher-gold flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-afrikher-dark" />
              </div>
              <h3 className="font-display text-2xl font-bold text-afrikher-dark mb-4">
                Communauté
              </h3>
              <p className="text-afrikher-gray leading-relaxed">
                Nous créons un réseau puissant de femmes entrepreneures qui s'inspirent, se soutiennent et grandissent ensemble.
              </p>
            </div>

            <div className="bg-white p-8 border border-afrikher-dark/10 hover:border-afrikher-gold transition-all duration-300">
              <div className="w-16 h-16 bg-afrikher-gold flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-afrikher-dark" />
              </div>
              <h3 className="font-display text-2xl font-bold text-afrikher-dark mb-4">
                Excellence
              </h3>
              <p className="text-afrikher-gray leading-relaxed">
                Nous célébrons l'excellence entrepreneuriale africaine et mettons en lumière les parcours exceptionnels.
              </p>
            </div>

            <div className="bg-white p-8 border border-afrikher-dark/10 hover:border-afrikher-gold transition-all duration-300">
              <div className="w-16 h-16 bg-afrikher-gold flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-afrikher-dark" />
              </div>
              <h3 className="font-display text-2xl font-bold text-afrikher-dark mb-4">
                Authenticité
              </h3>
              <p className="text-afrikher-gray leading-relaxed">
                Nous partageons des histoires vraies, des défis réels et des succès inspirants avec honnêteté et profondeur.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-afrikher-dark text-afrikher-cream p-12 md:p-16">
          <h2 className="font-display text-4xl font-bold mb-8 text-center">
            Notre Mission
          </h2>
          <div className="max-w-3xl mx-auto space-y-6 text-center text-lg leading-relaxed">
            <p>
              Nous avons pour mission de transformer la visibilité de l'entrepreneuriat féminin africain en créant
              une plateforme éditoriale de référence qui inspire, éduque et connecte.
            </p>
            <p>
              À travers nos contenus premium, nos portraits inspirants et nos analyses pointues, nous voulons devenir
              le media incontournable pour toute femme qui entreprend sur le continent et dans la diaspora.
            </p>
            <p className="font-serif text-2xl italic text-afrikher-gold pt-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              "Parce que chaque femme qui entreprend mérite d'être célébrée."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

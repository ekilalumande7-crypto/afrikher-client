export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-32">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-normal text-afrikher-dark mb-8 leading-none">
              Contact us
            </h1>
            <p className="font-sans text-base text-afrikher-gray leading-relaxed mb-16 max-w-md">
              Get in touch with us for any enquiries and questions
            </p>

            <div className="space-y-12">
              <div>
                <h3 className="font-sans text-xs uppercase tracking-wider text-afrikher-gray mb-3">
                  general inquiries
                </h3>
                <a
                  href="mailto:contact@afrikher.com"
                  className="block font-sans text-lg text-afrikher-dark hover:text-afrikher-gold transition-colors duration-300 mb-1"
                >
                  contact@afrikher.com
                </a>
                <a
                  href="tel:+33123456789"
                  className="block font-sans text-lg text-afrikher-dark hover:text-afrikher-gold transition-colors duration-300"
                >
                  +33 1 23 45 67 89
                </a>
              </div>

              <div>
                <h3 className="font-sans text-xs uppercase tracking-wider text-afrikher-gray mb-3">
                  careers
                </h3>
                <a
                  href="mailto:careers@afrikher.com"
                  className="block font-sans text-lg text-afrikher-dark hover:text-afrikher-gold transition-colors duration-300"
                >
                  careers@afrikher.com
                </a>
              </div>

              <div>
                <h3 className="font-sans text-xs uppercase tracking-wider text-afrikher-gray mb-3">
                  collaborations
                </h3>
                <a
                  href="mailto:partnerships@afrikher.com"
                  className="block font-sans text-lg text-afrikher-dark hover:text-afrikher-gold transition-colors duration-300 mb-1"
                >
                  partnerships@afrikher.com
                </a>
                <a
                  href="tel:+221776543210"
                  className="block font-sans text-lg text-afrikher-dark hover:text-afrikher-gold transition-colors duration-300"
                >
                  +221 77 654 32 10
                </a>
              </div>

              <div>
                <h3 className="font-sans text-xs uppercase tracking-wider text-afrikher-gray mb-3">
                  address
                </h3>
                <p className="font-sans text-lg text-afrikher-dark leading-relaxed">
                  Paris, France
                  <br />
                  Dakar, Sénégal
                </p>
              </div>
            </div>

            <div className="mt-16 pt-16 border-t border-afrikher-dark/10">
              <div className="flex gap-6">
                <a
                  href="#"
                  className="font-sans text-sm text-afrikher-dark hover:text-afrikher-gold transition-colors duration-300"
                >
                  Instagram
                </a>
                <a
                  href="#"
                  className="font-sans text-sm text-afrikher-dark hover:text-afrikher-gold transition-colors duration-300"
                >
                  LinkedIn
                </a>
                <a
                  href="#"
                  className="font-sans text-sm text-afrikher-dark hover:text-afrikher-gold transition-colors duration-300"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] bg-afrikher-cream overflow-hidden">
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="AFRIKHER workspace"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

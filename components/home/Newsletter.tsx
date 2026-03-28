'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import AfrikherInput from '@/components/ui/afrikher-input';
import AfrikherButton from '@/components/ui/afrikher-button';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Merci de votre inscription !');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Une erreur est survenue');
    }

    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  return (
    <section className="py-24 bg-afrikher-gold">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-afrikher-dark rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-afrikher-gold" />
          </div>
        </div>

        <h2 className="font-display text-4xl md:text-5xl font-bold text-afrikher-dark mb-6">
          Restez Informée
        </h2>

        <p className="font-sans text-lg text-afrikher-dark mb-10 max-w-2xl mx-auto">
          Inscrivez-vous à notre newsletter pour recevoir nos derniers articles,
          nos offres exclusives et nos inspirations.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <AfrikherInput
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-afrikher-dark text-afrikher-dark"
              />
            </div>
            <AfrikherButton
              type="submit"
              variant="dark"
              disabled={status === 'loading'}
              className="whitespace-nowrap"
            >
              {status === 'loading' ? 'Inscription...' : 'S\'inscrire'}
            </AfrikherButton>
          </div>

          {message && (
            <p
              className={`mt-4 font-sans text-sm ${
                status === 'success' ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

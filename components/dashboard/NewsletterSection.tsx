'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface NewsletterSectionProps {
  profile: any;
  onUpdate: (profile: any) => void;
}

export default function NewsletterSection({
  profile,
  onUpdate,
}: NewsletterSectionProps) {
  const [updating, setUpdating] = useState(false);
  const supabase = createClient();

  const handleToggle = async () => {
    setUpdating(true);

    try {
      const newValue = !profile?.newsletter_subscribed;

      const { data, error } = await supabase
        .from('profiles')
        .update({ newsletter_subscribed: newValue })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;

      onUpdate(data);
    } catch (error) {
      console.error('Newsletter toggle error:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="mb-12">
      <h2
        className="font-sans text-xs tracking-[0.2em] uppercase mb-6"
        style={{ color: '#C9A84C' }}
      >
        — NEWSLETTER
      </h2>

      <div
        className="p-6 border border-white/[0.08]"
        style={{ backgroundColor: '#111111' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(201, 168, 76, 0.1)' }}
            >
              <Mail className="w-5 h-5" style={{ color: '#C9A84C' }} />
            </div>
            <div>
              <p
                className="font-sans text-sm font-medium mb-1"
                style={{ color: '#F5F0E8' }}
              >
                Recevoir la newsletter AFRIKHER
              </p>
              <p
                className="font-sans text-xs"
                style={{ color: '#9A9A8A' }}
              >
                Restez informée des derniers articles et actualités
              </p>
            </div>
          </div>

          <button
            onClick={handleToggle}
            disabled={updating}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: profile?.newsletter_subscribed
                ? '#C9A84C'
                : 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <span
              className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              style={{
                transform: profile?.newsletter_subscribed
                  ? 'translateX(1.5rem)'
                  : 'translateX(0.25rem)',
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

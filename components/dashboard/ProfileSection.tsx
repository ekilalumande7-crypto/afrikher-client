'use client';

import { useState } from 'react';
import { User as UserType } from '@supabase/supabase-js';
import { Camera, Loader as Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import AfrikherInput from '@/components/ui/afrikher-input';
import AfrikherButton from '@/components/ui/afrikher-button';

interface ProfileSectionProps {
  user: UserType;
  profile: any;
  onProfileUpdate: (profile: any) => void;
}

export default function ProfileSection({
  user,
  profile,
  onProfileUpdate,
}: ProfileSectionProps) {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const supabase = createClient();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      onProfileUpdate(data);
      setMessage('Profil mis à jour avec succès');
    } catch (error: any) {
      setMessage(error.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const firstName = fullName.split(' ')[0] || '';
  const lastName = fullName.split(' ').slice(1).join(' ') || '';

  const handleFirstNameChange = (value: string) => {
    setFullName(lastName ? `${value} ${lastName}` : value);
  };

  const handleLastNameChange = (value: string) => {
    setFullName(`${firstName} ${value}`.trim());
  };

  return (
    <div id="profil" className="mb-12 scroll-mt-8">
      <h2
        className="font-sans text-xs tracking-[0.2em] uppercase mb-6"
        style={{ color: '#C9A84C' }}
      >
        — MON PROFIL
      </h2>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex items-center gap-6 mb-8">
          <div
            className="relative w-24 h-24 rounded-full border-2 flex items-center justify-center overflow-hidden cursor-pointer group"
            style={{ borderColor: '#C9A84C', backgroundColor: '#111111' }}
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                className="font-display text-3xl"
                style={{ color: '#C9A84C' }}
              >
                {firstName.charAt(0).toUpperCase() || 'A'}
              </span>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6" style={{ color: '#F5F0E8' }} />
            </div>
          </div>
          <div>
            <p
              className="font-sans text-sm mb-1"
              style={{ color: '#F5F0E8' }}
            >
              Photo de profil
            </p>
            <p
              className="font-sans text-xs"
              style={{ color: '#9A9A8A' }}
            >
              Cliquez pour modifier
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="font-sans text-xs tracking-wider uppercase mb-2 block"
              style={{ color: '#9A9A8A' }}
            >
              Prénom
            </label>
            <AfrikherInput
              value={firstName}
              onChange={(e) => handleFirstNameChange(e.target.value)}
              placeholder="Votre prénom"
            />
          </div>
          <div>
            <label
              className="font-sans text-xs tracking-wider uppercase mb-2 block"
              style={{ color: '#9A9A8A' }}
            >
              Nom
            </label>
            <AfrikherInput
              value={lastName}
              onChange={(e) => handleLastNameChange(e.target.value)}
              placeholder="Votre nom"
            />
          </div>
        </div>

        <div>
          <label
            className="font-sans text-xs tracking-wider uppercase mb-2 block"
            style={{ color: '#9A9A8A' }}
          >
            Email
          </label>
          <AfrikherInput
            value={user.email || ''}
            disabled
            className="opacity-50 cursor-not-allowed"
          />
        </div>

        {message && (
          <p
            className="font-sans text-sm"
            style={{
              color: message.includes('succès') ? '#C9A84C' : '#ff6b6b',
            }}
          >
            {message}
          </p>
        )}

        <AfrikherButton
          type="submit"
          variant="gold"
          size="lg"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              SAUVEGARDE...
            </>
          ) : (
            'SAUVEGARDER'
          )}
        </AfrikherButton>
      </form>
    </div>
  );
}

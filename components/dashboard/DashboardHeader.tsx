'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface DashboardHeaderProps {
  profile: any;
}

export default function DashboardHeader({ profile }: DashboardHeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const firstName = profile?.full_name?.split(' ')[0] || 'Lectrice';

  return (
    <div className="border-b border-white/[0.08] bg-[#0A0A0A]">
      <div className="max-w-[900px] mx-auto px-10 py-12 flex items-center justify-between">
        <div>
          <h1
            className="font-display text-5xl mb-2"
            style={{ color: '#F5F0E8' }}
          >
            Bonjour, {firstName}
          </h1>
          <p
            className="font-sans text-[0.85rem] tracking-wider"
            style={{ color: '#9A9A8A' }}
          >
            Bienvenue dans votre espace AFRIKHER
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 border border-white/[0.08] hover:bg-white/[0.05] transition-colors"
          style={{ color: '#F5F0E8' }}
        >
          <LogOut className="w-4 h-4" />
          <span className="font-sans text-sm tracking-wide">DÉCONNEXION</span>
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';
import ProfileSection from './ProfileSection';
import OrdersSection from './OrdersSection';
import SubscriptionSection from './SubscriptionSection';
import NewsletterSection from './NewsletterSection';

interface DashboardClientProps {
  user: User;
  profile: any;
  subscription: any;
  orders: any[];
}

export default function DashboardClient({
  user,
  profile: initialProfile,
  subscription,
  orders,
}: DashboardClientProps) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />

      <DashboardHeader profile={profile} />

      <div className="max-w-[900px] mx-auto px-10 py-16">
        <DashboardStats
          subscription={subscription}
          ordersCount={orders.length}
          profile={profile}
        />

        <ProfileSection
          user={user}
          profile={profile}
          onProfileUpdate={setProfile}
        />

        <OrdersSection orders={orders} />

        <SubscriptionSection subscription={subscription} />

        <NewsletterSection
          profile={profile}
          onUpdate={setProfile}
        />
      </div>

      <Footer />
    </div>
  );
}

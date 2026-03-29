"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User, Package, CreditCard, LogOut, Settings, Bell } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-brand-cream text-brand-dark">
      <Navbar />
      
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-12">
            
            {/* Sidebar */}
            <aside className="w-full md:w-64 space-y-2">
              <div className="p-6 bg-brand-dark text-brand-cream mb-8 border border-brand-gold/20">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center text-brand-dark text-2xl font-bold mb-4">
                  {user?.user_metadata?.full_name?.charAt(0) || "U"}
                </div>
                <h3 className="font-display text-xl font-bold truncate">{user?.user_metadata?.full_name || "Utilisateur"}</h3>
                <p className="text-brand-gray text-xs truncate">{user?.email}</p>
              </div>

              <button className="w-full flex items-center space-x-3 p-4 bg-brand-dark text-brand-gold text-sm uppercase tracking-widest font-bold">
                <User size={18} />
                <span>Profil</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-4 hover:bg-brand-charcoal/5 text-brand-gray text-sm uppercase tracking-widest transition-colors">
                <Package size={18} />
                <span>Mes Commandes</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-4 hover:bg-brand-charcoal/5 text-brand-gray text-sm uppercase tracking-widest transition-colors">
                <CreditCard size={18} />
                <span>Abonnement</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-4 hover:bg-brand-charcoal/5 text-brand-gray text-sm uppercase tracking-widest transition-colors">
                <Bell size={18} />
                <span>Notifications</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-4 hover:bg-brand-charcoal/5 text-brand-gray text-sm uppercase tracking-widest transition-colors">
                <Settings size={18} />
                <span>Paramètres</span>
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-4 hover:bg-red-50 text-red-500 text-sm uppercase tracking-widest transition-colors mt-8"
              >
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>
            </aside>

            {/* Content */}
            <div className="flex-1 space-y-12">
              <div
                className="bg-white p-10 border border-brand-charcoal/10 shadow-sm"
              >
                <h2 className="text-3xl font-display font-bold mb-8">Informations Personnelles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-brand-gray font-bold">Nom complet</label>
                    <p className="border-b border-brand-charcoal/10 py-2 text-brand-dark">{user?.user_metadata?.full_name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-brand-gray font-bold">Email</label>
                    <p className="border-b border-brand-charcoal/10 py-2 text-brand-dark">{user?.email}</p>
                  </div>
                </div>
                <button className="mt-10 px-8 py-3 bg-brand-dark text-brand-cream text-xs uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-all">
                  Modifier le profil
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div
                  className="bg-white p-10 border border-brand-charcoal/10 shadow-sm"
                >
                  <h3 className="text-2xl font-display font-bold mb-6">Abonnement Actuel</h3>
                  <div className="p-6 bg-brand-cream border border-brand-gold/20">
                    <p className="text-xs uppercase tracking-widest text-brand-gold font-bold mb-2">Plan Gratuit</p>
                    <p className="text-brand-gray text-sm mb-6">Accès limité aux articles publics.</p>
                    <Link href="/abonnement" className="text-xs uppercase tracking-widest text-brand-dark font-bold border-b border-brand-dark pb-1">
                      Passer au Premium
                    </Link>
                  </div>
                </div>

                <div
                  className="bg-white p-10 border border-brand-charcoal/10 shadow-sm"
                >
                  <h3 className="text-2xl font-display font-bold mb-6">Dernière Commande</h3>
                  <div className="text-center py-8">
                    <p className="text-brand-gray text-sm italic">Vous n'avez pas encore passé de commande.</p>
                    <Link href="/boutique" className="inline-block mt-6 text-xs uppercase tracking-widest text-brand-gold font-bold border-b border-brand-gold pb-1">
                      Visiter la boutique
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

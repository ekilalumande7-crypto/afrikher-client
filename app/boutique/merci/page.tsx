"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { CheckCircle, ShoppingBag, ArrowRight, Mail, Package } from "lucide-react";

interface Order {
  id: string;
  total: number;
  status: string;
  items: any[];
  customer_email: string;
  created_at: string;
}

export default function MerciPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) loadOrder();
    else setLoading(false);
  }, [orderId]);

  async function loadOrder() {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) return;
      const supabase = createClient(url, key);

      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (data) setOrder(data);
    } catch (err) {
      console.error("Error loading order:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 pt-32 pb-20">
        {loading ? (
          <div className="flex items-center justify-center h-[40vh]">
            <div className="w-10 h-10 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="text-center">
            {/* Success icon */}
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle size={40} className="text-green-500" />
            </div>

            <h1 className="text-4xl font-serif font-bold text-[#0A0A0A] mb-3">
              Merci pour votre commande !
            </h1>
            <p className="text-[#9A9A8A] text-lg mb-10">
              Votre paiement a ete enregistre avec succes.
            </p>

            {/* Order details card */}
            {order && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100 text-left mb-10">
                <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-100">
                  <Package size={20} className="text-[#C9A84C]" />
                  <div>
                    <p className="text-xs text-[#9A9A8A] uppercase tracking-widest font-bold">Commande</p>
                    <p className="text-sm font-mono text-[#0A0A0A]">{order.id.substring(0, 8).toUpperCase()}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                  {(Array.isArray(order.items) ? order.items : []).map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-[#0A0A0A]">
                        {item.name} <span className="text-[#9A9A8A]">x{item.qty}</span>
                      </span>
                      <span className="font-bold text-[#0A0A0A]">
                        {(item.price * item.qty).toFixed(2)} &euro;
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#0A0A0A]">Total</span>
                  <span className="text-xl font-serif font-bold text-[#C9A84C]">
                    {Number(order.total).toFixed(2)} &euro;
                  </span>
                </div>
              </div>
            )}

            {/* Info boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 text-left">
                <Mail size={20} className="text-[#C9A84C] mb-3" />
                <h3 className="text-sm font-bold text-[#0A0A0A] mb-1">Confirmation par email</h3>
                <p className="text-xs text-[#9A9A8A]">
                  Un email de confirmation a ete envoye a votre adresse avec le detail de votre commande.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 text-left">
                <ShoppingBag size={20} className="text-[#C9A84C] mb-3" />
                <h3 className="text-sm font-bold text-[#0A0A0A] mb-1">Suivi de commande</h3>
                <p className="text-xs text-[#9A9A8A]">
                  Suivez l'etat de votre commande depuis votre espace personnel dans la section "Mes commandes".
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/boutique"
                className="inline-flex items-center px-8 py-3.5 bg-[#0A0A0A] text-white rounded-full font-bold text-sm hover:bg-[#2A2A2A] transition-colors"
              >
                <ShoppingBag size={16} className="mr-2" />
                Continuer mes achats
              </Link>
              <Link
                href="/dashboard/commandes"
                className="inline-flex items-center px-8 py-3.5 border-2 border-[#0A0A0A] text-[#0A0A0A] rounded-full font-bold text-sm hover:bg-[#0A0A0A] hover:text-white transition-all"
              >
                Mes commandes
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

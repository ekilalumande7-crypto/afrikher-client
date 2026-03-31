"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { ArrowLeft, ShieldCheck, CreditCard, Truck, Lock } from "lucide-react";

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  type?: string;
}

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState<any>(null);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Belgique");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");

  // Determine if this is a magazine or product purchase
  const productId = searchParams.get("product");
  const magazineSlug = searchParams.get("magazine");
  const qty = parseInt(searchParams.get("qty") || "1", 10);

  useEffect(() => {
    loadProductAndAuth();
  }, []);

  async function loadProductAndAuth() {
    setLoading(true);
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) throw new Error("No Supabase config");
      const supabase = createClient(url, key);

      // Check auth
      const { data: { session: sess } } = await supabase.auth.getSession();
      setSession(sess);
      if (sess?.user) {
        setEmail(sess.user.email || "");
        // Try to get profile name
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", sess.user.id)
          .single();
        if (profile?.full_name) setFullName(profile.full_name);
      }

      // Load product or magazine info
      if (productId) {
        const { data: product } = await supabase
          .from("products")
          .select("id, name, price, images, type")
          .eq("id", productId)
          .single();
        if (product) {
          setItems([{
            product_id: product.id,
            name: product.name,
            price: product.price,
            qty,
            image: product.images?.[0] || "",
            type: product.type,
          }]);
        }
      } else if (magazineSlug) {
        const { data: mag } = await supabase
          .from("magazines")
          .select("id, title, price, cover_image")
          .eq("slug", magazineSlug)
          .single();
        if (mag) {
          setItems([{
            product_id: mag.id,
            name: mag.title,
            price: mag.price,
            qty: 1,
            image: mag.cover_image || "",
            type: "magazine",
          }]);
        } else {
          // Fallback demo magazine
          setItems([{
            product_id: "magazine-" + magazineSlug,
            name: "AFRIKHER Magazine - " + magazineSlug.replace(/-/g, " "),
            price: 2.50,
            qty: 1,
            type: "magazine",
          }]);
        }
      }
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = items.some(i => i.type === "magazine" || i.type === "digital") ? 0 : 4.99;
  const total = subtotal + shipping;

  const isDigital = items.every(i => i.type === "magazine" || i.type === "digital");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim()) {
      setError("Le nom et l'email sont obligatoires.");
      return;
    }

    if (!isDigital && (!address.trim() || !city.trim())) {
      setError("L'adresse de livraison est obligatoire pour les produits physiques.");
      return;
    }

    setSubmitting(true);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch("/api/fidepay/checkout", {
        method: "POST",
        headers,
        body: JSON.stringify({
          items: items.map(i => ({
            product_id: i.product_id,
            name: i.name,
            qty: i.qty,
            price: i.price,
          })),
          amount: total,
          currency: "EUR",
          customer_name: fullName,
          customer_email: email,
          shipping_address: isDigital ? null : {
            full_name: fullName,
            phone,
            address,
            city,
            country,
            postal_code: postalCode,
            notes,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push(`/auth/login?redirect=/boutique/checkout?${searchParams.toString()}`);
          return;
        }
        throw new Error(data.error || "Erreur lors de la creation de la commande");
      }

      // Redirect to FIDEPAY payment page
      const paymentUrl = data.checkout_url || data.checkoutUrl || data.payment_url;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        // If no payment URL, go to merci page directly (free items or test)
        router.push(`/boutique/merci?order=${data.order?.id}`);
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Une erreur est survenue. Veuillez reessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAFAF8]">
        <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-10 h-10 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAFAF8]">
        <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-32 pb-20 text-center">
          <h1 className="text-3xl font-serif font-bold text-[#0A0A0A] mb-4">Panier vide</h1>
          <p className="text-[#9A9A8A] mb-8">Aucun article selectionne.</p>
          <Link href="/boutique" className="inline-block px-8 py-3 bg-[#0A0A0A] text-white rounded-full font-bold text-sm hover:bg-[#2A2A2A] transition-colors">
            Retour a la boutique
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        {/* Back link */}
        <Link href={magazineSlug ? `/magazine/${magazineSlug}` : "/boutique"} className="inline-flex items-center text-sm text-[#9A9A8A] hover:text-[#0A0A0A] transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Retour
        </Link>

        <h1 className="text-4xl font-serif font-bold text-[#0A0A0A] mb-2">Finaliser votre commande</h1>
        <p className="text-[#9A9A8A] mb-10">Remplissez vos informations pour proceder au paiement securise.</p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT: Customer info form */}
            <div className="lg:col-span-2 space-y-8">

              {/* Contact info */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h2 className="text-lg font-serif font-bold text-[#0A0A0A] mb-6 flex items-center">
                  <CreditCard size={20} className="mr-3 text-[#C9A84C]" />
                  Informations de contact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#9A9A8A] mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Votre nom complet"
                      className="w-full px-4 py-3.5 bg-[#FAFAF8] border border-gray-100 rounded-xl text-sm outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/20 transition-colors placeholder:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#9A9A8A] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3.5 bg-[#FAFAF8] border border-gray-100 rounded-xl text-sm outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/20 transition-colors placeholder:text-gray-300"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-[#9A9A8A] mb-2">
                      Telephone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+32 XXX XX XX XX"
                      className="w-full px-4 py-3.5 bg-[#FAFAF8] border border-gray-100 rounded-xl text-sm outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/20 transition-colors placeholder:text-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping address (only for physical products) */}
              {!isDigital && (
                <div className="bg-white rounded-2xl p-8 border border-gray-100">
                  <h2 className="text-lg font-serif font-bold text-[#0A0A0A] mb-6 flex items-center">
                    <Truck size={20} className="mr-3 text-[#C9A84C]" />
                    Adresse de livraison
                  </h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-[#9A9A8A] mb-2">
                        Adresse *
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        placeholder="Rue, numero..."
                        className="w-full px-4 py-3.5 bg-[#FAFAF8] border border-gray-100 rounded-xl text-sm outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/20 transition-colors placeholder:text-gray-300"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-[#9A9A8A] mb-2">
                          Ville *
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                          placeholder="Bruxelles"
                          className="w-full px-4 py-3.5 bg-[#FAFAF8] border border-gray-100 rounded-xl text-sm outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/20 transition-colors placeholder:text-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-[#9A9A8A] mb-2">
                          Code postal
                        </label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="1000"
                          className="w-full px-4 py-3.5 bg-[#FAFAF8] border border-gray-100 rounded-xl text-sm outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/20 transition-colors placeholder:text-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest font-bold text-[#9A9A8A] mb-2">
                          Pays
                        </label>
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full px-4 py-3.5 bg-[#FAFAF8] border border-gray-100 rounded-xl text-sm outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/20 transition-colors"
                        >
                          <option>Belgique</option>
                          <option>France</option>
                          <option>RD Congo</option>
                          <option>Congo Brazzaville</option>
                          <option>Cameroun</option>
                          <option>Cote d&apos;Ivoire</option>
                          <option>Senegal</option>
                          <option>Maroc</option>
                          <option>Suisse</option>
                          <option>Luxembourg</option>
                          <option>Autre</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-[#9A9A8A] mb-2">
                        Notes (optionnel)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        placeholder="Instructions de livraison, etc."
                        className="w-full px-4 py-3.5 bg-[#FAFAF8] border border-gray-100 rounded-xl text-sm outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/20 transition-colors resize-none placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {isDigital && (
                <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/10 rounded-2xl p-6 flex items-center space-x-4">
                  <div className="w-10 h-10 bg-[#C9A84C]/10 rounded-xl flex items-center justify-center text-[#C9A84C]">
                    <ShieldCheck size={20} />
                  </div>
                  <p className="text-sm text-[#0A0A0A]">
                    Produit numerique — pas de livraison necessaire. Vous recevrez un acces immediat apres le paiement.
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT: Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 sticky top-28">
                <h2 className="text-lg font-serif font-bold text-[#0A0A0A] mb-6">Recapitulatif</h2>

                {/* Items */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl bg-gray-100"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-[#F5F0E8] rounded-xl flex items-center justify-center text-[#C9A84C] font-serif text-xl font-bold">
                          A
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#0A0A0A] truncate">{item.name}</p>
                        <p className="text-xs text-[#9A9A8A]">Quantite: {item.qty}</p>
                      </div>
                      <p className="text-sm font-bold text-[#0A0A0A] whitespace-nowrap">
                        {(item.price * item.qty).toFixed(2)} &euro;
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-100 text-sm">
                  <div className="flex justify-between text-[#9A9A8A]">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)} &euro;</span>
                  </div>
                  <div className="flex justify-between text-[#9A9A8A]">
                    <span>Livraison</span>
                    <span>{shipping === 0 ? "Gratuit" : `${shipping.toFixed(2)} \u20ac`}</span>
                  </div>
                  <div className="flex justify-between text-[#0A0A0A] font-bold text-base pt-2">
                    <span>Total</span>
                    <span className="text-[#C9A84C]">{total.toFixed(2)} &euro;</span>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#0A0A0A] text-white rounded-xl font-bold text-sm hover:bg-[#2A2A2A] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
                      <span>Traitement en cours...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Payer {total.toFixed(2)} &euro; via FIDEPAY</span>
                    </>
                  )}
                </button>

                {/* Trust badges */}
                <div className="mt-6 flex items-center justify-center space-x-3 text-[#9A9A8A]">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Paiement securise via FIDEPAY</span>
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="px-2.5 py-1 bg-gray-50 rounded-full text-[9px] font-bold text-[#9A9A8A]">Visa</span>
                  <span className="px-2.5 py-1 bg-gray-50 rounded-full text-[9px] font-bold text-[#9A9A8A]">Mastercard</span>
                  <span className="px-2.5 py-1 bg-gray-50 rounded-full text-[9px] font-bold text-[#9A9A8A]">Mobile Money</span>
                  <span className="px-2.5 py-1 bg-gray-50 rounded-full text-[9px] font-bold text-[#9A9A8A]">QR Code</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

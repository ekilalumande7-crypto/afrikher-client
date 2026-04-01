"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import {
  ArrowLeft, User, Mail, Phone, MapPin, Building2, Hash,
  FileText, ShieldCheck, Lock, ChevronRight, Package,
  Minus, Plus, CreditCard, Smartphone, Globe
} from "lucide-react";

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

  // Steps
  const [step, setStep] = useState<1 | 2>(1);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Belgique");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<"fidepay">("fidepay");

  const productId = searchParams.get("product");
  const magazineSlug = searchParams.get("magazine");
  const initialQty = parseInt(searchParams.get("qty") || "1", 10);

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

      const { data: { session: sess } } = await supabase.auth.getSession();

      // Force authentication - redirect to login if not authenticated
      if (!sess) {
        const currentUrl = window.location.pathname + window.location.search;
        window.location.href = `/auth/login?redirect=${encodeURIComponent(currentUrl)}`;
        return;
      }

      setSession(sess);
      if (sess?.user) {
        setEmail(sess.user.email || "");
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", sess.user.id)
          .single();
        if (profile?.full_name) setFullName(profile.full_name);
      }

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
            qty: initialQty,
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

  function updateQty(idx: number, delta: number) {
    setItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const newQty = Math.max(1, item.qty + delta);
      return { ...item, qty: newQty };
    }));
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = items.some(i => i.type === "magazine" || i.type === "digital") ? 0 : 4.99;
  const total = subtotal + shipping;
  const isDigital = items.every(i => i.type === "magazine" || i.type === "digital");

  function goToStep2() {
    if (!fullName.trim() || !email.trim()) {
      setError("Le nom et l'email sont obligatoires.");
      return;
    }
    if (!isDigital && (!address.trim() || !city.trim())) {
      setError("L'adresse de livraison est obligatoire pour les produits physiques.");
      return;
    }
    setError("");
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
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

      const paymentUrl = data.checkout_url || data.checkoutUrl || data.payment_url;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        router.push(`/boutique/merci?order=${data.order?.id}`);
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Une erreur est survenue. Veuillez reessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Loading state ──
  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F0E8]">
        <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-10 h-10 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  // ── Empty cart ──
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#F5F0E8]">
        <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-32 pb-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#0A0A0A] rounded-full flex items-center justify-center">
            <Package size={32} className="text-[#C9A84C]" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#0A0A0A] mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Panier vide
          </h1>
          <p className="text-[#9A9A8A] mb-8 font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Aucun article selectionne.
          </p>
          <Link
            href="/boutique"
            className="inline-block px-8 py-3.5 bg-[#0A0A0A] text-white rounded-full font-bold text-sm hover:bg-[#2A2A2A] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Retour a la boutique
          </Link>
        </div>
      </main>
    );
  }

  const inputClass = "w-full pl-12 pr-4 py-3.5 bg-white border border-[#E5E0D5] rounded-xl text-sm text-[#0A0A0A] outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition-all placeholder:text-[#BBBBB0]";
  const iconWrapClass = "absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]";

  return (
    <main className="min-h-screen bg-[#F5F0E8]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Back link */}
        <Link
          href={magazineSlug ? `/magazine/${magazineSlug}` : "/boutique"}
          className="inline-flex items-center text-sm text-[#9A9A8A] hover:text-[#0A0A0A] transition-colors mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Retour
        </Link>

        {/* Page title */}
        <h1
          className="text-3xl sm:text-4xl font-bold text-[#0A0A0A] mb-2"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Checkout
        </h1>
        <p className="text-[#9A9A8A] text-sm mb-8">Finalisez votre commande en toute securite.</p>

        {/* Step tabs */}
        <div className="flex items-center mb-8 bg-[#0A0A0A] rounded-2xl p-1.5 max-w-md">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              step === 1
                ? "bg-[#C9A84C] text-[#0A0A0A]"
                : "text-[#9A9A8A] hover:text-white"
            }`}
          >
            <User size={16} />
            Informations
          </button>
          <button
            type="button"
            onClick={() => {
              if (step === 1) goToStep2();
              else setStep(2);
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              step === 2
                ? "bg-[#C9A84C] text-[#0A0A0A]"
                : "text-[#9A9A8A] hover:text-white"
            }`}
          >
            <CreditCard size={16} />
            Paiement
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* ═══ LEFT COLUMN: Form ═══ */}
            <div className="lg:col-span-3 space-y-6">

              {step === 1 && (
                <>
                  {/* Contact info card */}
                  <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E0D5]/50 shadow-sm">
                    <h2
                      className="text-xl font-bold text-[#0A0A0A] mb-1"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      Informations de contact
                    </h2>
                    <p className="text-xs text-[#9A9A8A] mb-6">Vos coordonnees pour la commande.</p>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Full name */}
                        <div className="relative">
                          <div className={iconWrapClass}><User size={18} /></div>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            placeholder="Nom complet *"
                            className={inputClass}
                          />
                        </div>
                        {/* Email */}
                        <div className="relative">
                          <div className={iconWrapClass}><Mail size={18} /></div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Email *"
                            className={inputClass}
                          />
                        </div>
                      </div>
                      {/* Phone */}
                      <div className="relative">
                        <div className={iconWrapClass}><Phone size={18} /></div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Telephone (optionnel)"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping address card */}
                  {!isDigital && (
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E0D5]/50 shadow-sm">
                      <h2
                        className="text-xl font-bold text-[#0A0A0A] mb-1"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                      >
                        Adresse de livraison
                      </h2>
                      <p className="text-xs text-[#9A9A8A] mb-6">Ou souhaitez-vous etre livre(e) ?</p>

                      <div className="space-y-4">
                        {/* Address */}
                        <div className="relative">
                          <div className={iconWrapClass}><MapPin size={18} /></div>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            placeholder="Adresse complete *"
                            className={inputClass}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* City */}
                          <div className="relative">
                            <div className={iconWrapClass}><Building2 size={18} /></div>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              required
                              placeholder="Ville *"
                              className={inputClass}
                            />
                          </div>
                          {/* Postal code */}
                          <div className="relative">
                            <div className={iconWrapClass}><Hash size={18} /></div>
                            <input
                              type="text"
                              value={postalCode}
                              onChange={(e) => setPostalCode(e.target.value)}
                              placeholder="Code postal"
                              className={inputClass}
                            />
                          </div>
                          {/* Country */}
                          <div className="relative">
                            <div className={iconWrapClass}><Globe size={18} /></div>
                            <select
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#E5E0D5] rounded-xl text-sm text-[#0A0A0A] outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition-all appearance-none"
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

                        {/* Notes */}
                        <div className="relative">
                          <div className="absolute left-4 top-4 text-[#C9A84C]"><FileText size={18} /></div>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            placeholder="Notes de livraison (optionnel)"
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#E5E0D5] rounded-xl text-sm text-[#0A0A0A] outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition-all resize-none placeholder:text-[#BBBBB0]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Digital notice */}
                  {isDigital && (
                    <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-2xl p-5 flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#C9A84C]/10 rounded-xl flex items-center justify-center shrink-0">
                        <ShieldCheck size={20} className="text-[#C9A84C]" />
                      </div>
                      <p className="text-sm text-[#0A0A0A]">
                        Produit numerique — pas de livraison. Acces immediat apres paiement.
                      </p>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Continue button */}
                  <button
                    type="button"
                    onClick={goToStep2}
                    className="w-full py-4 bg-[#0A0A0A] text-white rounded-xl font-bold text-sm hover:bg-[#2A2A2A] transition-all flex items-center justify-center gap-2"
                  >
                    Continuer vers le paiement
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  {/* Payment method card */}
                  <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E0D5]/50 shadow-sm">
                    <h2
                      className="text-xl font-bold text-[#0A0A0A] mb-1"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      Mode de paiement
                    </h2>
                    <p className="text-xs text-[#9A9A8A] mb-6">Choisissez votre methode de paiement securise.</p>

                    <div className="space-y-3">
                      {/* FIDEPAY option */}
                      <label
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === "fidepay"
                            ? "border-[#C9A84C] bg-[#C9A84C]/5"
                            : "border-[#E5E0D5] hover:border-[#C9A84C]/40"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          paymentMethod === "fidepay" ? "border-[#C9A84C]" : "border-[#E5E0D5]"
                        }`}>
                          {paymentMethod === "fidepay" && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#C9A84C]" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="payment"
                          value="fidepay"
                          checked={paymentMethod === "fidepay"}
                          onChange={() => setPaymentMethod("fidepay")}
                          className="sr-only"
                        />
                        <div className="w-10 h-10 bg-[#0A0A0A] rounded-xl flex items-center justify-center shrink-0">
                          <CreditCard size={20} className="text-[#C9A84C]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#0A0A0A]">FIDEPAY — Paiement en ligne</p>
                          <p className="text-xs text-[#9A9A8A]">Carte bancaire, Mobile Money, QR Code</p>
                        </div>
                      </label>
                    </div>

                    {/* Payment methods icons */}
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F0E8] rounded-lg text-[11px] font-bold text-[#0A0A0A]">
                        <CreditCard size={14} className="text-[#C9A84C]" /> Visa / Mastercard
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F0E8] rounded-lg text-[11px] font-bold text-[#0A0A0A]">
                        <Smartphone size={14} className="text-[#C9A84C]" /> Mobile Money
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F0E8] rounded-lg text-[11px] font-bold text-[#0A0A0A]">
                        <Globe size={14} className="text-[#C9A84C]" /> QR Code
                      </span>
                    </div>
                  </div>

                  {/* Order summary for step 2 */}
                  <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E0D5]/50 shadow-sm">
                    <h2
                      className="text-xl font-bold text-[#0A0A0A] mb-1"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      Vos informations
                    </h2>
                    <p className="text-xs text-[#9A9A8A] mb-4">Verifiez avant de confirmer.</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-3 py-2 border-b border-[#F5F0E8]">
                        <User size={16} className="text-[#C9A84C] shrink-0" />
                        <span className="text-[#9A9A8A] w-20 shrink-0">Nom</span>
                        <span className="text-[#0A0A0A] font-medium">{fullName}</span>
                      </div>
                      <div className="flex items-center gap-3 py-2 border-b border-[#F5F0E8]">
                        <Mail size={16} className="text-[#C9A84C] shrink-0" />
                        <span className="text-[#9A9A8A] w-20 shrink-0">Email</span>
                        <span className="text-[#0A0A0A] font-medium">{email}</span>
                      </div>
                      {phone && (
                        <div className="flex items-center gap-3 py-2 border-b border-[#F5F0E8]">
                          <Phone size={16} className="text-[#C9A84C] shrink-0" />
                          <span className="text-[#9A9A8A] w-20 shrink-0">Tel.</span>
                          <span className="text-[#0A0A0A] font-medium">{phone}</span>
                        </div>
                      )}
                      {!isDigital && address && (
                        <div className="flex items-center gap-3 py-2">
                          <MapPin size={16} className="text-[#C9A84C] shrink-0" />
                          <span className="text-[#9A9A8A] w-20 shrink-0">Adresse</span>
                          <span className="text-[#0A0A0A] font-medium">
                            {address}, {postalCode} {city}, {country}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="mt-4 text-xs font-bold text-[#C9A84C] hover:underline"
                    >
                      Modifier mes informations
                    </button>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Pay button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-[#0A0A0A] text-white rounded-xl font-bold text-sm hover:bg-[#2A2A2A] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
                        <span>Traitement en cours...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        <span>Payer {total.toFixed(2)} &euro;</span>
                      </>
                    )}
                  </button>

                  {/* Security badge */}
                  <div className="flex items-center justify-center gap-2 text-[#9A9A8A]">
                    <ShieldCheck size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Paiement 100% securise via FIDEPAY</span>
                  </div>
                </>
              )}
            </div>

            {/* ═══ RIGHT COLUMN: Order Summary ═══ */}
            <div className="lg:col-span-2">
              <div className="bg-[#0A0A0A] rounded-2xl p-6 sm:p-8 sticky top-28">
                <h2
                  className="text-lg font-bold text-white mb-6"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Votre commande
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      {/* Product image */}
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-[#2A2A2A] rounded-xl flex items-center justify-center">
                          <span className="text-[#C9A84C] font-serif text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>A</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{item.name}</p>
                        <p className="text-xs text-[#9A9A8A] mt-0.5">{item.price.toFixed(2)} &euro; / piece</p>
                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => updateQty(idx, -1)}
                            className="w-7 h-7 rounded-lg bg-[#2A2A2A] flex items-center justify-center text-white hover:bg-[#3A3A3A] transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold text-white w-6 text-center">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(idx, 1)}
                            className="w-7 h-7 rounded-lg bg-[#2A2A2A] flex items-center justify-center text-white hover:bg-[#3A3A3A] transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-[#C9A84C] whitespace-nowrap">
                        {(item.price * item.qty).toFixed(2)} &euro;
                      </p>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-[#2A2A2A] mb-5" />

                {/* Totals */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-[#9A9A8A]">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)} &euro;</span>
                  </div>
                  <div className="flex justify-between text-[#9A9A8A]">
                    <span>Livraison</span>
                    <span>{shipping === 0 ? "Gratuit" : `${shipping.toFixed(2)} \u20ac`}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="h-px bg-[#2A2A2A] my-5" />
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-base">Total</span>
                  <span className="text-[#C9A84C] font-bold text-xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {total.toFixed(2)} &euro;
                  </span>
                </div>

                {/* Mobile pay button (visible on mobile only) */}
                <div className="mt-6 lg:hidden">
                  {step === 1 ? (
                    <button
                      type="button"
                      onClick={goToStep2}
                      className="w-full py-4 bg-[#C9A84C] text-[#0A0A0A] rounded-xl font-bold text-sm hover:bg-[#E8C97A] transition-all flex items-center justify-center gap-2"
                    >
                      Continuer
                      <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-[#C9A84C] text-[#0A0A0A] rounded-xl font-bold text-sm hover:bg-[#E8C97A] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                          <span>Traitement...</span>
                        </>
                      ) : (
                        <>
                          <Lock size={16} />
                          <span>Payer {total.toFixed(2)} &euro;</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

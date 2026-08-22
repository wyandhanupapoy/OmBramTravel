"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import Script from "next/script";
import { LocationSearchInput } from "./LocationSearchInput";

const originCountries = [
  ["ID", "Indonesia"], ["MY", "Malaysia"], ["SG", "Singapore"], ["GB", "United Kingdom"],
  ["US", "United States"], ["CN", "China"], ["JP", "Japan"], ["KR", "South Korea"],
  ["TH", "Thailand"], ["IN", "India"], ["SA", "Saudi Arabia"], ["AU", "Australia"], ["OTHER", "Other"]
] as const;
const notificationLanguages = [["id", "Bahasa Indonesia"], ["en", "English"], ["zh", "中文"], ["ms", "Bahasa Melayu"], ["th", "ไทย"], ["ta", "தமிழ்"], ["ja", "日本語"], ["ko", "한국어"], ["ar", "العربية"]] as const;

interface BookingFormProps {
  tourId: string;
  tourSlug: string;
  title: string;
  adults: number;
  childrenCount: number;
  luggage: number;
  adultTotal: number;
  childTotal: number;
  extraTotal: number;
  luggageTotal: number;
  total: number;
  extraPax: number;
  locale: string;
  vehicles: { id: string; name: string; type: string; capacity: number; imageUrl: string | null }[];
}

export function BookingForm({
  tourId, tourSlug, title, adults, childrenCount, luggage,
  adultTotal, childTotal, extraTotal, luggageTotal, total, extraPax, locale, vehicles
}: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ discount: number, type: string, code: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    pickup: "",
    notes: "",
    country: "ID",
    language: locale,
    vehicleId: vehicles[0]?.id || ""
  });

  // Midtrans requires Snap script to be loaded
  const MIDTRANS_URL = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true" 
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

  const CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setPromoError("");
    setAppliedPromo(null);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        body: JSON.stringify({ code: promoCode }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setAppliedPromo({ discount: data.discount, type: data.type, code: promoCode.toUpperCase() });
    } catch (err: any) {
      setPromoError(err.message);
    }
  };

  let promoDiscountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === "percent") {
      promoDiscountAmount = Math.round((total * appliedPromo.discount) / 100);
    } else {
      promoDiscountAmount = appliedPromo.discount;
    }
  }
  const finalTotal = Math.max(0, total - promoDiscountAmount);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId,
          date: formData.date,
          adults,
          children: childrenCount,
          luggage,
          pickupPoint: formData.pickup,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          customerCountry: formData.country,
          customerLocale: formData.language,
          vehicleId: formData.vehicleId,
          notes: formData.notes,
          promoCode: appliedPromo?.code,
          discount: promoDiscountAmount,
          locale
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Trigger Snap Popup
      (window as any).snap.pay(data.token, {
        onSuccess: function(result: any) {
          router.push(`/${locale}/track/${data.orderCode}?status=success`);
        },
        onPending: function(result: any) {
          router.push(`/${locale}/track/${data.orderCode}?status=pending`);
        },
        onError: function(result: any) {
          alert("Pembayaran gagal!");
          setLoading(false);
        },
        onClose: function() {
          setLoading(false);
        }
      });
      
    } catch (err: any) {
      alert("Error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Script src={MIDTRANS_URL} data-client-key={CLIENT_KEY} strategy="lazyOnload" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <form onSubmit={handlePay} className="lg:col-span-2">
          <div className="bg-card border border-line rounded p-8">
            <h2 className="font-display text-xl text-pine-dark mb-6">Data Pemesan</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Nama Lengkap</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:outline-none focus:border-pine" placeholder="Sesuai KTP / Paspor" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Bahasa Notifikasi</label>
                <select required value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:outline-none focus:border-pine">
                  {notificationLanguages.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">No. WhatsApp</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:outline-none focus:border-pine" placeholder="+62..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:outline-none focus:border-pine" placeholder="email@contoh.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Pilih Kendaraan</label>
                <select required value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:outline-none focus:border-pine">
                  {vehicles.map(vehicle => <option key={vehicle.id} value={vehicle.id}>{vehicle.name} ({vehicle.type}, {vehicle.capacity} pax)</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Negara Asal</label>
                <select required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:outline-none focus:border-pine">
                  {originCountries.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                </select>
                <p className="text-xs text-ink-soft mt-1">Pesan WhatsApp dan email akan mengikuti bahasa halaman yang Anda pilih.</p>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tanggal Tour</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:outline-none focus:border-pine" />
                </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-pine-dark">Titik Jemput (Hotel/Stasiun/Bandara)</label>
                    <LocationSearchInput 
                      value={formData.pickup}
                      onChange={(val) => setFormData({ ...formData, pickup: val })}
                      placeholder="Cth: Stasiun Bandung..."
                    />
                  </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-6 flex justify-center items-center gap-2 font-display uppercase tracking-wide text-sm font-semibold px-6 py-4 rounded bg-pine-dark text-paper hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:transform-none"
              >
                {loading ? "Memproses..." : "Bayar Sekarang (Midtrans)"}
              </button>
            </div>
          </div>
        </form>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-pine-dark text-paper rounded p-7 sticky top-24">
            <span className="text-beacon font-mono text-xs tracking-wider uppercase block mb-3">Ringkasan Pesanan</span>
            <h3 className="font-display text-2xl mb-6 leading-tight">{title}</h3>
            
            <div className="space-y-3 font-mono text-sm border-b border-white/10 pb-6 mb-6">
              <div className="flex justify-between">
                <span className="text-white/70">Dewasa ({adults}x)</span>
                <CurrencyDisplay amountIDR={adultTotal} />
              </div>
              {childrenCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/70">Anak-anak ({childrenCount}x)</span>
                  <CurrencyDisplay amountIDR={childTotal} />
                </div>
              )}
              {extraPax > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/70">Extra Pax ({extraPax}x)</span>
                  <CurrencyDisplay amountIDR={extraTotal} />
                </div>
              )}
              {luggage > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/70">Koper ({luggage}x)</span>
                  <CurrencyDisplay amountIDR={luggageTotal} />
                </div>
              )}
            </div>
            
            {/* Promo Code UI */}
            <div className="border-b border-white/10 pb-6 mb-6">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Kode Promo" 
                  value={promoCode} 
                  onChange={e => setPromoCode(e.target.value)}
                  disabled={!!appliedPromo || loading}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 font-mono text-sm focus:outline-none focus:border-beacon uppercase"
                />
                {!appliedPromo ? (
                  <button 
                    type="button" 
                    onClick={handleApplyPromo}
                    disabled={!promoCode || loading}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-mono text-sm transition-colors disabled:opacity-50"
                  >
                    Terapkan
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => { setAppliedPromo(null); setPromoCode(""); }}
                    disabled={loading}
                    className="px-4 py-2 bg-rust/20 text-rust hover:bg-rust/30 rounded-lg font-mono text-sm transition-colors"
                  >
                    Batal
                  </button>
                )}
              </div>
              {promoError && <p className="text-rust text-xs mt-2">{promoError}</p>}
              {appliedPromo && (
                <div className="flex justify-between items-center mt-4 text-beacon font-mono text-sm">
                  <span>Diskon Promo ({appliedPromo.code})</span>
                  <span>-<CurrencyDisplay amountIDR={promoDiscountAmount} /></span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center text-xl font-bold">
              <span className="font-display tracking-wide uppercase">TOTAL</span>
              <CurrencyDisplay amountIDR={finalTotal} className="text-beacon" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

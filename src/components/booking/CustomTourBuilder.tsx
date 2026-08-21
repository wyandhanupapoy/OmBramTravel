"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LocationSearchInput } from "@/components/booking/LocationSearchInput";
import { DestinationSearchInput } from "@/components/booking/DestinationSearchInput";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useTranslations } from "next-intl";
import "leaflet/dist/leaflet.css";

// Dynamic map components
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then(m => m.Polyline), { ssr: false });

export function CustomTourBuilder({ locale }: { locale: string }) {
  const router = useRouter();
  const t = useTranslations("customTour");

  // Load initial state from sessionStorage or use defaults
  const loadState = (key: string, defaultVal: any) => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(`ct_${key}`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { return saved; }
      }
    }
    return defaultVal;
  };

  const [pickup, setPickup] = useState<string>(() => loadState("pickup", ""));
  const [destinations, setDestinations] = useState<string[]>(() => loadState("destinations", [""]));
  
  const [date, setDate] = useState<string>(() => loadState("date", ""));
  const [adults, setAdults] = useState<number>(() => loadState("adults", 1));
  const [children, setChildren] = useState<number>(() => loadState("children", 0));
  const [name, setName] = useState<string>(() => loadState("name", ""));
  const [phone, setPhone] = useState<string>(() => loadState("phone", ""));
  const [email, setEmail] = useState<string>(() => loadState("email", ""));

  // Save to sessionStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("ct_pickup", pickup);
      sessionStorage.setItem("ct_destinations", JSON.stringify(destinations));
      sessionStorage.setItem("ct_date", date);
      sessionStorage.setItem("ct_adults", adults.toString());
      sessionStorage.setItem("ct_children", children.toString());
      sessionStorage.setItem("ct_name", name);
      sessionStorage.setItem("ct_phone", phone);
      sessionStorage.setItem("ct_email", email);
    }
  }, [pickup, destinations, date, adults, children, name, phone, email]);

  const [routeLine, setRouteLine] = useState<[number, number][]>([]);
  const [distanceKm, setDistanceKm] = useState(0);
  
  // Pricing
  const BASE_PRICE = 300000;
  const RATE_PER_KM = 5000;
  const price = BASE_PRICE + (Math.ceil(distanceKm) * RATE_PER_KM);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map Icons (loaded client side)
  const [icons, setIcons] = useState<any>(null);

  useEffect(() => {
    import("leaflet").then(L => {
      setIcons({
        pickup: L.icon({ iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png", iconSize: [25, 41], iconAnchor: [12, 41] }),
        dest: L.icon({ iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png", iconSize: [25, 41], iconAnchor: [12, 41] })
      });
    });
  }, []);

  // Fetch Route whenever points change
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const points = [];
        if (pickup.startsWith("{")) points.push(JSON.parse(pickup));
        
        destinations.forEach(d => {
          if (d.startsWith("{")) points.push(JSON.parse(d));
        });

        if (points.length >= 2) {
          const coordsString = points.map(p => `${p.lng},${p.lat}`).join(";");
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`);
          const data = await res.json();
          
          if (data.routes && data.routes[0]) {
            const coords = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
            setRouteLine(coords);
            setDistanceKm(data.routes[0].distance / 1000);
          }
        } else {
          setRouteLine([]);
          setDistanceKm(0);
        }
      } catch (e) {}
    };

    const delay = setTimeout(fetchRoute, 1000);
    return () => clearTimeout(delay);
  }, [pickup, destinations]);

  const handleAddDest = () => {
    if (destinations.length < 4) {
      setDestinations([...destinations, ""]);
    }
  };

  const handleRemoveDest = (index: number) => {
    const newDests = [...destinations];
    newDests.splice(index, 1);
    setDestinations(newDests);
  };

  const handleDestChange = (index: number, val: string) => {
    const newDests = [...destinations];
    newDests[index] = val;
    setDestinations(newDests);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.startsWith("{") || destinations.some(d => !d.startsWith("{"))) {
      alert("Mohon pilih lokasi dari daftar saran yang muncul.");
      return;
    }

    setIsSubmitting(true);
    
    // Combine destinations into notes
    const parsedDests = destinations.map(d => JSON.parse(d).name).join(" -> ");
    const customNotes = `Custom Tour Route:\n${parsedDests}\nTotal Distance: ${distanceKm.toFixed(1)} KM`;

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: "custom", // Special flag
          date, adults, children, luggage: 0,
          pickupPoint: pickup,
          customerName: name, customerPhone: phone, customerEmail: email,
          notes: customNotes,
          locale,
          customDistance: distanceKm // Pass distance for server calc
        })
      });
      const data = await res.json();
      if (data.token) {
        (window as any).snap.pay(data.token, {
          onSuccess: (result: any) => { window.location.href = `/${locale}/track/${result.order_id}?status=success`; },
          onPending: (result: any) => { window.location.href = `/${locale}/track/${result.order_id}?status=pending`; },
          onError: () => { alert("Pembayaran gagal!"); setIsSubmitting(false); },
          onClose: () => { setIsSubmitting(false); }
        });
      }
    } catch (e) {
      alert("Terjadi kesalahan.");
      setIsSubmitting(false);
    }
  };

  const center: [number, number] = routeLine.length > 0 ? routeLine[Math.floor(routeLine.length / 2)] : [-6.9175, 107.6191];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} strategy="lazyOnload" />
      
      {/* Form Section */}
      <div>
        <h2 className="font-display text-2xl text-pine-dark mb-6">{t("title") || "Rancang Rute Anda"}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="bg-line/20 p-5 rounded-lg border border-line">
            <label className="block text-sm font-semibold mb-2 text-pine-dark">{t("pickupLabel") || "Titik Jemput (Mulai)"}</label>
            <LocationSearchInput value={pickup} onChange={setPickup} placeholder="Cth: Stasiun Bandung..." />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-pine-dark">Tujuan Wisata (Maks 4)</h3>
            {destinations.map((dest, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1">
                  <DestinationSearchInput 
                    value={dest} 
                    onChange={(val) => handleDestChange(i, val)} 
                    placeholder={`${t("customDestPlaceholder") || "Tujuan Wisata"} ${i + 1}...`} 
                  />
                </div>
                {destinations.length > 1 && (
                  <button type="button" onClick={() => handleRemoveDest(i)} className="p-3 bg-rust text-white rounded hover:bg-rust/90">
                    ✕
                  </button>
                )}
              </div>
            ))}
            
            {destinations.length < 4 && (
              <button type="button" onClick={handleAddDest} className="w-full py-3 border-2 border-dashed border-pine text-pine rounded font-semibold hover:bg-pine/10 transition-colors">
                + {t("customAddDest") || "Tambah Tujuan"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-line">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t("date") || "Tanggal Tour"}</label>
              <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-line rounded px-4 py-3 focus:outline-none focus:border-pine" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1.5">{t("adults") || "Dewasa"}</label>
                <input required type="number" min="1" max="15" value={adults} onChange={e => setAdults(parseInt(e.target.value))} className="w-full border border-line rounded px-4 py-3 focus:outline-none focus:border-pine" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1.5">{t("children") || "Anak-anak"}</label>
                <input required type="number" min="0" max="15" value={children} onChange={e => setChildren(parseInt(e.target.value))} className="w-full border border-line rounded px-4 py-3 focus:outline-none focus:border-pine" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-line">
            <h3 className="font-semibold text-pine-dark">{t("buyerData") || "Data Pemesan"}</h3>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t("name") || "Nama Lengkap"} className="w-full border border-line rounded px-4 py-3 focus:outline-none focus:border-pine" />
            <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder={t("phone") || "Nomor WhatsApp aktif"} className="w-full border border-line rounded px-4 py-3 focus:outline-none focus:border-pine" />
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t("email") || "Alamat Email"} className="w-full border border-line rounded px-4 py-3 focus:outline-none focus:border-pine" />
          </div>

          <button disabled={isSubmitting || distanceKm === 0} type="submit" className="w-full bg-pine-dark text-white font-display uppercase tracking-wider py-4 rounded font-semibold hover:bg-pine transition-colors disabled:opacity-50">
            {isSubmitting ? (t("btnLoading") || "Memproses...") : (t("btnSubmit") || "Bayar & Konfirmasi Rute")}
          </button>
        </form>
      </div>

      {/* Map & Pricing Section */}
      <div className="space-y-6">
        <div className="bg-card p-6 rounded-xl border border-line shadow-sm">
          <h3 className="font-display text-xl text-pine-dark border-b border-line pb-4 mb-4">{t("estTitle") || "Estimasi Harga Tur Kustom"}</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-ink-soft">
              <span>{t("base") || "Sewa Mobil + Driver (Base)"}</span>
              <CurrencyDisplay amountIDR={BASE_PRICE} />
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>{t("dist", { dist: distanceKm.toFixed(1), rate: 5000 }) || `Jarak Tempuh (${distanceKm.toFixed(1)} KM x Rp 5.000)`}</span>
              <CurrencyDisplay amountIDR={Math.ceil(distanceKm) * RATE_PER_KM} />
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-line">
            <span className="font-bold text-lg text-pine-dark">{t("total") || "TOTAL"}</span>
            <CurrencyDisplay amountIDR={price} className="font-bold text-2xl text-pine-dark" />
          </div>
        </div>

        <div className="h-[500px] w-full rounded-xl overflow-hidden border-2 border-line relative z-0">
          <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {icons && (() => {
               const points = [];
               if (pickup.startsWith("{")) points.push({ ...JSON.parse(pickup), isPickup: true });
               destinations.forEach(d => { if (d.startsWith("{")) points.push({ ...JSON.parse(d), isPickup: false }); });
               
               return points.map((p, i) => (
                 <Marker key={i} position={[p.lat, p.lng]} icon={p.isPickup ? icons.pickup : icons.dest} />
               ));
            })()}

            {routeLine.length > 0 && <Polyline positions={routeLine} color="#123024" weight={5} opacity={0.8} />}
          </MapContainer>
        </div>
      </div>

    </div>
  );
}

"use client";
import { useState } from "react";
import { createTour } from "@/app/actions/tour";

type TourFormData = {
  id?: string; slug: string; zone: string; duration: string; basePrice: number; maxPax: number; extraPaxFee: number; luggageFee: number;
  titleId: string; titleEn: string; titleZh: string; descId: string; descEn: string; descZh: string;
  stops: { nameId: string; nameEn: string; nameZh: string; time: string; duration: number }[];
};

export function TourForm({ initialTour, action = createTour }: { initialTour?: TourFormData; action?: typeof createTour }) {
  const [loading, setLoading] = useState(false);
  const [stops, setStops] = useState(initialTour?.stops?.map(stop => ({ ...stop, duration: String(stop.duration) })) || [{ nameId: "", nameEn: "", nameZh: "", time: "09:00", duration: "60" }]);

  const addStop = () => {
    setStops([...stops, { nameId: "", nameEn: "", nameZh: "", time: "10:00", duration: "60" }]);
  };

  const updateStop = (index: number, field: string, value: string) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], [field]: value };
    setStops(newStops);
  };

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    // Let the native form submission handle the rest, but we attach the stopsData
  };

  return (
    <form action={action} onSubmit={handleSubmit} className="space-y-10">
      {initialTour && <input type="hidden" name="id" value={initialTour.id} />}
      
      {/* Pengaturan Dasar */}
      <div className="bg-card border border-line rounded p-8">
        <h2 className="font-display text-xl text-pine-dark mb-6 border-b border-line pb-3">1. Pengaturan Dasar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1.5">URL Slug</label>
            <input name="slug" required defaultValue={initialTour?.slug} placeholder="cth: city-tour-bandung" className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Zona Tour</label>
            <select name="zone" defaultValue={initialTour?.zone || "north"} className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine">
              <option value="north">Bandung Utara (North)</option>
              <option value="south">Bandung Selatan (South)</option>
              <option value="city">Bandung Kota (City)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Durasi Tour</label>
            <select name="duration" defaultValue={initialTour?.duration || "full-day"} className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine">
              <option value="full-day">Sehari Penuh (Full Day)</option>
              <option value="half-day">Setengah Hari (Half Day)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Harga & Kapasitas */}
      <div className="bg-card border border-line rounded p-8">
        <h2 className="font-display text-xl text-pine-dark mb-6 border-b border-line pb-3">2. Harga & Kapasitas (IDR)</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1.5">Harga Dasar (per pax)</label>
            <input name="basePrice" type="number" required defaultValue={initialTour?.basePrice || 500000} className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Batas Pax Normal</label>
            <input name="maxPax" type="number" required defaultValue={initialTour?.maxPax || 7} className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Biaya Extra Pax</label>
            <input name="extraPaxFee" type="number" required defaultValue={initialTour?.extraPaxFee || 100000} className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Biaya Koper Besar</label>
            <input name="luggageFee" type="number" required defaultValue={initialTour?.luggageFee || 50000} className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine font-mono" />
          </div>
        </div>
      </div>

      {/* Konten Multi Bahasa */}
      <div className="bg-card border border-line rounded p-8">
        <h2 className="font-display text-xl text-pine-dark mb-6 border-b border-line pb-3">3. Konten Multi-Bahasa</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6 p-4 bg-line/20 rounded">
            <div>
              <label className="block text-xs font-bold uppercase mb-2 text-rust">🇮🇩 Judul Indonesia</label>
              <input name="titleId" required defaultValue={initialTour?.titleId} className="w-full border border-line bg-white rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-2 text-rust">🇬🇧 Judul English</label>
              <input name="titleEn" required defaultValue={initialTour?.titleEn} className="w-full border border-line bg-white rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-2 text-rust">🇨🇳 Judul Mandarin</label>
              <input name="titleZh" required defaultValue={initialTour?.titleZh} className="w-full border border-line bg-white rounded px-3 py-2" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 p-4 bg-line/20 rounded">
            <div>
              <label className="block text-xs font-bold uppercase mb-2 text-rust">🇮🇩 Deskripsi ID</label>
              <textarea name="descId" required defaultValue={initialTour?.descId} rows={3} className="w-full border border-line bg-white rounded px-3 py-2 text-sm"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-2 text-rust">🇬🇧 Deskripsi EN</label>
              <textarea name="descEn" required defaultValue={initialTour?.descEn} rows={3} className="w-full border border-line bg-white rounded px-3 py-2 text-sm"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-2 text-rust">🇨🇳 Deskripsi ZH</label>
              <textarea name="descZh" required defaultValue={initialTour?.descZh} rows={3} className="w-full border border-line bg-white rounded px-3 py-2 text-sm"></textarea>
            </div>
          </div>
        </div>
      </div>

      {/* Rute & Itinerary */}
      <div className="bg-card border border-line rounded p-8">
        <div className="flex justify-between items-center mb-6 border-b border-line pb-3">
          <h2 className="font-display text-xl text-pine-dark">4. Rute (Itinerary)</h2>
          <button type="button" onClick={addStop} className="rounded-md bg-pine-dark px-3 py-1.5 text-xs font-semibold text-paper transition-colors hover:bg-pine focus:outline-none focus:ring-2 focus:ring-beacon/70 active:scale-[0.98]">+ Tambah Titik</button>
        </div>
        
        {/* Hidden field to pass stops data to server action */}
        <input type="hidden" name="stopsData" value={JSON.stringify(stops)} />
        
        <div className="space-y-4">
          {stops.map((stop, i) => (
            <div key={i} className="flex gap-4 items-start p-4 border border-line-strong bg-paper rounded relative">
              <div className="w-24">
                <label className="block text-xs mb-1">Waktu (Jam)</label>
                <input type="time" value={stop.time} onChange={(e) => updateStop(i, "time", e.target.value)} className="w-full border border-line rounded px-2 py-1 text-sm font-mono" />
              </div>
              <div className="w-24">
                <label className="block text-xs mb-1">Lama (Mnt)</label>
                <input type="number" value={stop.duration} onChange={(e) => updateStop(i, "duration", e.target.value)} className="w-full border border-line rounded px-2 py-1 text-sm font-mono" />
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs mb-1 text-rust font-bold">🇮🇩 Nama (ID)</label>
                  <input value={stop.nameId} onChange={(e) => updateStop(i, "nameId", e.target.value)} className="w-full border border-line rounded px-2 py-1 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-rust font-bold">🇬🇧 Nama (EN)</label>
                  <input value={stop.nameEn} onChange={(e) => updateStop(i, "nameEn", e.target.value)} className="w-full border border-line rounded px-2 py-1 text-sm" required />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-rust font-bold">🇨🇳 Nama (ZH)</label>
                  <input value={stop.nameZh} onChange={(e) => updateStop(i, "nameZh", e.target.value)} className="w-full border border-line rounded px-2 py-1 text-sm" required />
                </div>
              </div>
              {stops.length > 1 && (
                <button type="button" onClick={() => removeStop(i)} className="absolute right-2 top-2 rounded px-2 py-1 text-xs font-semibold text-rust transition-colors hover:bg-rust/10 focus:outline-none focus:ring-2 focus:ring-rust/40">Hapus</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-4 flex justify-end gap-4">
        <button type="submit" disabled={loading} className="rounded-lg bg-beacon px-8 py-4 font-display text-sm font-semibold uppercase tracking-wide text-pine-dark shadow-lg transition-all hover:-translate-y-0.5 hover:bg-beacon-dark focus:outline-none focus:ring-2 focus:ring-pine-dark/40 active:translate-y-0 disabled:cursor-wait disabled:opacity-50 disabled:transform-none">
          {loading ? "Menyimpan..." : "Simpan Tour Baru"}
        </button>
      </div>

    </form>
  );
}

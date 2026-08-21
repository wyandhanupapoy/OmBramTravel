"use client";
import { useState } from "react";
import { createTour } from "@/app/actions/tour";

export function TourForm() {
  const [loading, setLoading] = useState(false);
  const [stops, setStops] = useState([{ nameId: "", nameEn: "", nameZh: "", time: "09:00", duration: "60" }]);

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
    <form action={createTour} onSubmit={handleSubmit} className="space-y-10">
      
      {/* Pengaturan Dasar */}
      <div className="bg-card border border-line rounded p-8">
        <h2 className="font-display text-xl text-pine-dark mb-6 border-b border-line pb-3">1. Pengaturan Dasar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1.5">URL Slug</label>
            <input name="slug" required placeholder="cth: city-tour-bandung" className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Zona Tour</label>
            <select name="zone" className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine">
              <option value="north">Bandung Utara (North)</option>
              <option value="south">Bandung Selatan (South)</option>
              <option value="city">Bandung Kota (City)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Durasi Tour</label>
            <select name="duration" className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine">
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
            <input name="basePrice" type="number" required defaultValue="500000" className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Batas Pax Normal</label>
            <input name="maxPax" type="number" required defaultValue="7" className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Biaya Extra Pax</label>
            <input name="extraPaxFee" type="number" required defaultValue="100000" className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Biaya Koper Besar</label>
            <input name="luggageFee" type="number" required defaultValue="50000" className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine font-mono" />
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
              <input name="titleId" required className="w-full border border-line bg-white rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-2 text-rust">🇬🇧 Judul English</label>
              <input name="titleEn" required className="w-full border border-line bg-white rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-2 text-rust">🇨🇳 Judul Mandarin</label>
              <input name="titleZh" required className="w-full border border-line bg-white rounded px-3 py-2" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 p-4 bg-line/20 rounded">
            <div>
              <label className="block text-xs font-bold uppercase mb-2 text-rust">🇮🇩 Deskripsi ID</label>
              <textarea name="descId" required rows={3} className="w-full border border-line bg-white rounded px-3 py-2 text-sm"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-2 text-rust">🇬🇧 Deskripsi EN</label>
              <textarea name="descEn" required rows={3} className="w-full border border-line bg-white rounded px-3 py-2 text-sm"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-2 text-rust">🇨🇳 Deskripsi ZH</label>
              <textarea name="descZh" required rows={3} className="w-full border border-line bg-white rounded px-3 py-2 text-sm"></textarea>
            </div>
          </div>
        </div>
      </div>

      {/* Rute & Itinerary */}
      <div className="bg-card border border-line rounded p-8">
        <div className="flex justify-between items-center mb-6 border-b border-line pb-3">
          <h2 className="font-display text-xl text-pine-dark">4. Rute (Itinerary)</h2>
          <button type="button" onClick={addStop} className="text-xs bg-pine-dark text-paper px-3 py-1.5 rounded">+ Tambah Titik</button>
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
                <button type="button" onClick={() => removeStop(i)} className="text-rust absolute top-2 right-2 text-xs hover:underline">Hapus</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 sticky bottom-4">
        <button type="submit" disabled={loading} className="font-display uppercase tracking-wide text-sm font-semibold px-8 py-4 rounded bg-beacon text-pine-dark hover:-translate-y-0.5 transition-transform shadow-lg disabled:opacity-50 disabled:transform-none">
          {loading ? "Menyimpan..." : "Simpan Tour Baru"}
        </button>
      </div>

    </form>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function TrackSearchPage() {
  const [orderCode, setOrderCode] = useState("");
  const router = useRouter();
  const locale = useLocale();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderCode.trim()) {
      router.push(`/${locale}/track/${orderCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-[70vh] bg-paper py-24 px-6 flex items-center justify-center">
      <div className="max-w-[500px] w-full text-center">
        
        <div className="w-20 h-20 bg-beacon rounded-full flex items-center justify-center mx-auto mb-8">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#123024" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        
        <h1 className="font-display uppercase tracking-tight text-3xl text-pine-dark mb-4">
          Cek Pesanan Anda
        </h1>
        <p className="text-ink-soft mb-10 text-[15px]">
          Masukkan Kode Pesanan (contoh: OB-ABC12) yang Anda dapatkan saat memesan untuk melihat status pembayaran dan melacak lokasi penjemputan secara Live.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-[400px] mx-auto">
          <input 
            type="text" 
            placeholder="OB-..." 
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
            className="flex-1 border border-line bg-transparent rounded px-5 py-4 focus:outline-none focus:border-pine font-mono text-lg uppercase placeholder:normal-case"
            required
          />
          <button 
            type="submit"
            className="font-display uppercase tracking-wide text-sm font-semibold px-8 py-4 rounded bg-pine-dark text-paper hover:-translate-y-0.5 transition-transform"
          >
            Cari
          </button>
        </form>

      </div>
    </div>
  );
}

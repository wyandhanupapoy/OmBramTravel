"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";

interface SearchTour {
  slug: string;
  title: string;
  basePrice: number;
  duration: string;
  zone: string;
  stops: string[];
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

export function HomeTourSearch({ tours, locale }: { tours: SearchTour[]; locale: string }) {
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState("all");
  const [sort, setSort] = useState("recommended");
  const deferredQuery = useDeferredValue(query);

  const filteredTours = tours
    .filter((tour) => zone === "all" || tour.zone === zone)
    .filter((tour) => {
      const needle = deferredQuery.trim().toLowerCase();
      if (!needle) return true;
      return [tour.title, ...tour.stops].some((value) => value.toLowerCase().includes(needle));
    })
    .sort((a, b) => {
      if (sort === "cheap") return a.basePrice - b.basePrice;
      if (sort === "expensive") return b.basePrice - a.basePrice;
      return a.title.localeCompare(b.title);
    });

  return (
    <section className="relative z-10 -mt-8 bg-paper py-6 sm:-mt-12">
      <div className="mx-auto max-w-[1180px] px-7">
        <div className="rounded-2xl border border-line bg-card p-5 shadow-xl sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-rust">Explore Bandung Raya</span>
              <h2 className="mt-2 font-display text-2xl uppercase text-pine-dark">Cari destinasi atau rute wisata</h2>
            </div>
            <span className="font-mono text-xs text-ink-soft">{filteredTours.length} rute tersedia</span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <label className="relative block">
              <span className="sr-only">Cari destinasi</span>
              <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Contoh: Dago, Braga, Kawah Putih..." className="w-full rounded-xl border border-line bg-white px-4 py-3.5 pl-12 text-base text-ink outline-none transition-colors placeholder:text-ink-soft/70 focus:border-pine focus:ring-2 focus:ring-beacon/40" />
            </label>
            <select value={zone} onChange={(event) => setZone(event.target.value)} aria-label="Filter area" className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-pine-dark outline-none focus:border-pine focus:ring-2 focus:ring-beacon/40">
              <option value="all">Semua area</option>
              <option value="city">Kota</option>
              <option value="nature">Alam</option>
              <option value="family">Keluarga</option>
            </select>
            <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Urutkan harga" className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-pine-dark outline-none focus:border-pine focus:ring-2 focus:ring-beacon/40">
              <option value="recommended">Rekomendasi</option>
              <option value="cheap">Termurah</option>
              <option value="expensive">Termahal</option>
            </select>
          </div>

          {(query || zone !== "all" || sort !== "recommended") && (
            <button type="button" onClick={() => { setQuery(""); setZone("all"); setSort("recommended"); }} className="mt-3 text-xs font-semibold text-rust underline underline-offset-2">Reset filter</button>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTours.slice(0, 9).map((tour) => (
              <Link key={tour.slug} href={`/${locale}/tours/${tour.slug}`} className="group rounded-xl border border-line bg-white p-4 no-underline transition-all hover:-translate-y-0.5 hover:border-pine hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg leading-tight text-pine-dark group-hover:text-rust">{tour.title}</h3>
                    <p className="mt-2 line-clamp-1 text-xs text-ink-soft">{tour.stops.join(" • ")}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-mist px-2 py-1 text-[10px] font-bold uppercase text-pine-dark">{tour.duration === "half-day" ? "Half day" : "Full day"}</span>
                </div>
                <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
                  <span className="font-mono text-xs text-ink-soft">mulai dari</span>
                  <span className="font-mono text-sm font-bold text-pine-dark">{formatPrice(tour.basePrice)}</span>
                </div>
              </Link>
            ))}
          </div>

          {filteredTours.length === 0 && <div className="py-10 text-center text-sm text-ink-soft">Destinasi belum ditemukan. Coba kata kunci lain.</div>}
          {filteredTours.length > 9 && <p className="mt-5 text-center text-xs text-ink-soft">Menampilkan 9 hasil teratas. Persempit pencarian untuk hasil yang lebih spesifik.</p>}
        </div>
      </div>
    </section>
  );
}

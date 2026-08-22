"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { TourCard } from "@/components/tours/TourCard";

interface SearchTour {
  slug: string;
  title: string;
  basePrice: number;
  duration: string;
  zone: string;
  stops: string[];
  images: string[];
  maxPax: number;
}

interface SearchVehicle { type: string; capacity: number; name: string; }

const searchCopy: Record<string, { eyebrow: string; heading: string; available: string; loading: string; placeholder: string; searchLabel: string; all: string; city: string; nature: string; family: string; areaLabel: string; recommended: string; cheap: string; expensive: string; sortLabel: string; reset: string; from: string; halfDay: string; fullDay: string; empty: string; showing: string }> = {
  id: { eyebrow: "Jelajahi Bandung Raya", heading: "Cari destinasi atau rute wisata", available: "rute tersedia", loading: "Mencari...", placeholder: "Contoh: Dago, Braga, Kawah Putih...", searchLabel: "Cari destinasi", all: "Semua area", city: "Kota", nature: "Alam", family: "Keluarga", areaLabel: "Filter area", recommended: "Rekomendasi", cheap: "Termurah", expensive: "Termahal", sortLabel: "Urutkan harga", reset: "Reset filter", from: "mulai dari", halfDay: "Half day", fullDay: "Full day", empty: "Destinasi belum ditemukan. Coba kata kunci lain.", showing: "Menampilkan 12 hasil teratas. Persempit pencarian untuk hasil yang lebih spesifik." },
  en: { eyebrow: "Explore Bandung Raya", heading: "Find a destination or travel route", available: "routes available", loading: "Searching...", placeholder: "Try: Dago, Braga, White Crater...", searchLabel: "Search destinations", all: "All areas", city: "City", nature: "Nature", family: "Family", areaLabel: "Filter area", recommended: "Recommended", cheap: "Lowest price", expensive: "Highest price", sortLabel: "Sort by price", reset: "Reset filters", from: "from", halfDay: "Half day", fullDay: "Full day", empty: "No destinations found. Try another keyword.", showing: "Showing the first 12 results. Refine your search for more specific results." },
  zh: { eyebrow: "探索万隆地区", heading: "搜索目的地或旅行路线", available: "条路线可选", loading: "搜索中...", placeholder: "例如：Dago、Braga、白色火山口...", searchLabel: "搜索目的地", all: "所有区域", city: "城市", nature: "自然", family: "家庭", areaLabel: "区域筛选", recommended: "推荐", cheap: "价格最低", expensive: "价格最高", sortLabel: "按价格排序", reset: "重置筛选", from: "起价", halfDay: "半日", fullDay: "全天", empty: "未找到目的地，请尝试其他关键词。", showing: "显示前12条结果，请缩小搜索范围。" },
  ja: { eyebrow: "バンドン周辺を探す", heading: "目的地または旅行ルートを検索", available: "ルート", loading: "検索中...", placeholder: "例：Dago、Braga、ホワイトクレーター...", searchLabel: "目的地を検索", all: "すべてのエリア", city: "市内", nature: "自然", family: "ファミリー", areaLabel: "エリア検索", recommended: "おすすめ", cheap: "安い順", expensive: "高い順", sortLabel: "価格順", reset: "条件をリセット", from: "最安値", halfDay: "半日", fullDay: "終日", empty: "目的地が見つかりません。別のキーワードをお試しください。", showing: "上位12件を表示しています。検索を絞り込んでください。" },
  ko: { eyebrow: "반둥 여행 찾기", heading: "여행지 또는 여행 경로 검색", available: "개 경로 이용 가능", loading: "검색 중...", placeholder: "예: Dago, Braga, 화이트 크레이터...", searchLabel: "여행지 검색", all: "전체 지역", city: "도시", nature: "자연", family: "가족", areaLabel: "지역 필터", recommended: "추천", cheap: "낮은 가격순", expensive: "높은 가격순", sortLabel: "가격순 정렬", reset: "필터 초기화", from: "최저가", halfDay: "반일", fullDay: "종일", empty: "여행지를 찾을 수 없습니다. 다른 검색어를 입력해 보세요.", showing: "상위 12개 결과입니다. 검색 범위를 좁혀 보세요." },
  ar: { eyebrow: "استكشف باندونغ", heading: "ابحث عن وجهة أو مسار رحلة", available: "مسار متاح", loading: "جارٍ البحث...", placeholder: "مثال: داغو، براغا، الحفرة البيضاء...", searchLabel: "البحث عن وجهة", all: "كل المناطق", city: "المدينة", nature: "الطبيعة", family: "العائلة", areaLabel: "تصفية المنطقة", recommended: "موصى به", cheap: "الأقل سعراً", expensive: "الأعلى سعراً", sortLabel: "ترتيب حسب السعر", reset: "إعادة ضبط", from: "يبدأ من", halfDay: "نصف يوم", fullDay: "يوم كامل", empty: "لم يتم العثور على وجهة. جرّب كلمة أخرى.", showing: "عرض أول 12 نتيجة. ضيّق البحث للحصول على نتائج أدق." }
};

const cache = new Map<string, { tours: SearchTour[]; total: number }>();

export function HomeTourSearch({ tours, locale, vehicles = [] }: { tours: SearchTour[]; locale: string; vehicles?: SearchVehicle[] }) {
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState("all");
  const [sort, setSort] = useState("recommended");
  const [results, setResults] = useState(tours);
  const [resultCount, setResultCount] = useState(tours.length);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [duration, setDuration] = useState("all");
  const [pax, setPax] = useState(0);
  const [vehicleType, setVehicleType] = useState("all");
  const deferredQuery = useDeferredValue(query);
  const copy = searchCopy[locale] || searchCopy.id;

  useEffect(() => {
    const timer = window.setTimeout(() => {
    const controller = new AbortController();
    const key = `${deferredQuery}|${zone}|${sort}|${minPrice}|${maxPrice}|${duration}|${pax}|${vehicleType}`;
    const cached = cache.get(key);
    if (cached) { setResults(cached.tours); setResultCount(cached.total); return; }
    setIsSearching(true);
    fetch(`/api/tours?q=${encodeURIComponent(deferredQuery)}&zone=${zone}&sort=${sort}&locale=${locale}&page=${page}&limit=12&minPrice=${minPrice}&maxPrice=${maxPrice}&duration=${duration}&pax=${pax}&vehicleType=${vehicleType}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => { const next = { tours: data.tours || [], total: data.total || 0 }; cache.set(key, next); setResults(next.tours); setResultCount(next.total); })
      .catch(() => {})
      .finally(() => setIsSearching(false));
    return () => controller.abort();
    }, 280);
    return () => window.clearTimeout(timer);
  }, [deferredQuery, zone, sort, minPrice, maxPrice, duration, pax, vehicleType, page, locale]);

  const filteredTours = results;

  return (
    <section className="relative z-10 -mt-8 bg-paper py-6 sm:-mt-12">
      <div className="mx-auto max-w-[1180px] px-7">
        <div className="rounded-2xl border border-line bg-card p-5 shadow-xl sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-rust">{copy.eyebrow}</span>
              <h2 className="mt-2 font-display text-2xl uppercase text-pine-dark">{copy.heading}</h2>
            </div>
            <span className="font-mono text-xs text-ink-soft">{isSearching ? copy.loading : `${resultCount} ${copy.available}`}</span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <label className="relative block">
              <span className="sr-only">{copy.searchLabel}</span>
              <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.placeholder} className="w-full rounded-xl border border-line bg-white px-4 py-3.5 pl-12 text-base text-ink outline-none transition-colors placeholder:text-ink-soft/70 focus:border-pine focus:ring-2 focus:ring-beacon/40" />
            </label>
            <select value={zone} onChange={(event) => setZone(event.target.value)} aria-label={copy.areaLabel} className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-pine-dark outline-none focus:border-pine focus:ring-2 focus:ring-beacon/40">
              <option value="all">{copy.all}</option>
              <option value="city">{copy.city}</option>
              <option value="nature">{copy.nature}</option>
              <option value="family">{copy.family}</option>
            </select>
            <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label={copy.sortLabel} className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-pine-dark outline-none focus:border-pine focus:ring-2 focus:ring-beacon/40">
              <option value="recommended">{copy.recommended}</option>
              <option value="cheap">{copy.cheap}</option>
              <option value="expensive">{copy.expensive}</option>
            </select>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input type="number" min="0" value={minPrice || ""} onChange={(event) => { setPage(1); setMinPrice(Number(event.target.value) || 0); }} placeholder="Harga minimum" className="rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-pine" />
            <input type="number" min="0" value={maxPrice || ""} onChange={(event) => { setPage(1); setMaxPrice(Number(event.target.value) || 0); }} placeholder="Harga maksimum" className="rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-pine" />
            <select value={duration} onChange={(event) => { setPage(1); setDuration(event.target.value); }} className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-pine-dark outline-none focus:border-pine"><option value="all">Semua durasi</option><option value="half-day">Half day</option><option value="full-day">Full day</option></select>
            <select value={pax} onChange={(event) => { setPage(1); setPax(Number(event.target.value)); }} className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-pine-dark outline-none focus:border-pine"><option value="0">Semua kapasitas</option><option value="2">Min. 2 pax</option><option value="4">Min. 4 pax</option><option value="7">Min. 7 pax</option></select>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <select value={vehicleType} onChange={(event) => { setPage(1); setVehicleType(event.target.value); }} className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-pine-dark outline-none focus:border-pine"><option value="all">Semua kendaraan</option>{Array.from(new Set(vehicles.map(vehicle => vehicle.type))).map(type => <option key={type} value={type}>{type} {vehicles.find(vehicle => vehicle.type === type)?.capacity ? `(${vehicles.find(vehicle => vehicle.type === type)?.capacity} pax)` : ""}</option>)}</select>
          </div>

          {(query || zone !== "all" || sort !== "recommended" || minPrice || maxPrice || duration !== "all" || pax || vehicleType !== "all") && (
            <button type="button" onClick={() => { setQuery(""); setZone("all"); setSort("recommended"); setMinPrice(0); setMaxPrice(0); setDuration("all"); setPax(0); setVehicleType("all"); setPage(1); }} className="mt-3 text-xs font-semibold text-rust underline underline-offset-2">{copy.reset}</button>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTours.slice(0, 9).map((tour) => <TourCard key={tour.slug} slug={tour.slug} title={tour.title} images={tour.images} duration={tour.duration} stopsCount={tour.stops.length} basePrice={tour.basePrice} locale={locale} />)}
          </div>

          {filteredTours.length === 0 && <div className="py-10 text-center text-sm text-ink-soft">{copy.empty}</div>}
          {resultCount > 12 && <p className="mt-5 text-center text-xs text-ink-soft">{copy.showing}</p>}
          {resultCount > 12 && <div className="mt-5 flex justify-center gap-2"><button type="button" disabled={page === 1} onClick={() => setPage(current => current - 1)} className="rounded-lg border border-line-strong px-4 py-2 text-sm font-semibold disabled:opacity-40">Prev</button><span className="px-3 py-2 font-mono text-sm">{page}</span><button type="button" disabled={page * 12 >= resultCount} onClick={() => setPage(current => current + 1)} className="rounded-lg border border-line-strong px-4 py-2 text-sm font-semibold disabled:opacity-40">Next</button></div>}
        </div>
      </div>
    </section>
  );
}

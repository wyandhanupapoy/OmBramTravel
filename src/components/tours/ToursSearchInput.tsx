"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function ToursSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("tours");
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="mb-10 flex gap-2 w-full max-w-[400px]">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchPlaceholder") || "Cari tour..."}
        className="flex-1 rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/70 focus:border-pine focus:ring-2 focus:ring-beacon/40"
      />
      <button type="submit" className="bg-pine text-paper px-6 py-3 rounded-xl font-semibold hover:bg-pine-dark transition-colors">
        Cari
      </button>
    </form>
  );
}

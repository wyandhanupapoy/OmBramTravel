"use client";

import { useEffect, useState } from "react";
import { type Currency } from "@/i18n/config";
import { CURRENCY_SYMBOLS } from "@/lib/currency";

export function CurrencySelector() {
  const [currency, setCurrency] = useState<Currency>("IDR");

  useEffect(() => {
    // Read from cookie on mount
    const match = document.cookie.match(new RegExp('(^| )currency=([^;]+)'));
    if (match) setCurrency(match[2] as Currency);
  }, []);

  const handleSelect = (c: Currency) => {
    setCurrency(c);
    document.cookie = `currency=${c}; path=/; max-age=31536000`; // 1 year
    window.dispatchEvent(new Event("currencyChange"));
  };

  const currencies: Currency[] = ["IDR", "USD", "EUR", "SGD", "MYR", "CNY", "THB", "JPY", "KRW", "SAR", "GBP"];

  return (
    <div className="relative group">
      <button className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-pine-dark opacity-75 hover:opacity-100 transition-opacity">
        {currency}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div className="absolute right-0 top-full mt-2 w-32 bg-paper border border-line rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="py-2 max-h-64 overflow-y-auto">
          {currencies.map((c) => (
            <button
              key={c}
              onClick={() => handleSelect(c)}
              className={`w-full text-left px-4 py-1.5 text-sm font-mono hover:bg-line transition-colors flex justify-between ${currency === c ? 'font-bold text-beacon' : 'text-pine-dark'}`}
            >
              <span>{c}</span>
              <span className="opacity-50 text-xs">{(CURRENCY_SYMBOLS as any)[c] || ""}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { getExchangeRates, formatDualCurrency } from "@/lib/currency";
import type { Currency } from "@/i18n/config";

interface Props {
  amountIDR: number;
  className?: string;
  targetCurrency?: Currency;
}

export function CurrencyDisplay({ amountIDR, className, targetCurrency }: Props) {
  const locale = useLocale();
  const [display, setDisplay] = useState<string>("...");
  const [rates, setRates] = useState<Record<Currency, number> | null>(null);

  useEffect(() => {
    getExchangeRates().then(setRates);
  }, []);

  useEffect(() => {
    if (!rates) return;
    
    // Auto-select currency based on locale if not explicitly provided
    let currency: Currency = targetCurrency || "IDR";
    if (!targetCurrency) {
      // First try to get from cookie
      const match = document.cookie.match(new RegExp('(^| )currency=([^;]+)'));
      if (match) {
        currency = match[2] as Currency;
      } else {
        // Fallback to locale based
        if (locale === "en") currency = "USD";
        else if (locale === "zh") currency = "CNY";
      }
    }

    setDisplay(formatDualCurrency(amountIDR, currency, rates));
  }, [amountIDR, rates, locale, targetCurrency]);

  return <span className={className}>{display}</span>;
}

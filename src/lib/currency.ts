import type { Currency } from "@/i18n/config";

// Fallback exchange rates (updated periodically via API in production)
const FALLBACK_RATES: Record<Currency, number> = {
  IDR: 1,
  USD: 0.0000615, // 1 IDR = 0.0000615 USD (≈ Rp 16,260 / USD)
  EUR: 0.0000565,
  GBP: 0.0000485,
  MYR: 0.000274,
  SGD: 0.0000825,
  THB: 0.00215,
  CNY: 0.000447,
  JPY: 0.0094,
  KRW: 0.084,
  SAR: 0.00023,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  IDR: "Rp",
  USD: "$",
  EUR: "€",
  GBP: "£",
  MYR: "RM",
  SGD: "S$",
  THB: "฿",
  CNY: "¥",
  JPY: "¥",
  KRW: "₩",
  SAR: "ر.س",
};

let cachedRates: Record<Currency, number> | null = null;
let ratesFetchedAt = 0;
const CACHE_DURATION = 3600000; // 1 hour

export async function getExchangeRates(): Promise<Record<Currency, number>> {
  const now = Date.now();
  if (cachedRates && now - ratesFetchedAt < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    // Use a free exchange rate API
    const res = await fetch(
      "https://api.exchangerate-api.com/v4/latest/IDR",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error("API error");

    const data = await res.json();
    cachedRates = {
      IDR: 1,
      USD: data.rates.USD || FALLBACK_RATES.USD,
      EUR: data.rates.EUR || FALLBACK_RATES.EUR,
      GBP: data.rates.GBP || FALLBACK_RATES.GBP,
      MYR: data.rates.MYR || FALLBACK_RATES.MYR,
      SGD: data.rates.SGD || FALLBACK_RATES.SGD,
      THB: data.rates.THB || FALLBACK_RATES.THB,
      CNY: data.rates.CNY || FALLBACK_RATES.CNY,
      JPY: data.rates.JPY || FALLBACK_RATES.JPY,
      KRW: data.rates.KRW || FALLBACK_RATES.KRW,
      SAR: data.rates.SAR || FALLBACK_RATES.SAR,
    };
    ratesFetchedAt = now;
    return cachedRates;
  } catch {
    return FALLBACK_RATES;
  }
}

export function convertFromIDR(amountIDR: number, rate: number): number {
  return Math.round(amountIDR * rate * 100) / 100;
}

export function formatCurrency(amount: number, currency: Currency): string {
  const localeMap: Record<Currency, string> = {
    IDR: "id-ID",
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
    MYR: "ms-MY",
    SGD: "en-SG",
    THB: "th-TH",
    CNY: "zh-CN",
    JPY: "ja-JP",
    KRW: "ko-KR",
    SAR: "ar-SA",
  };

  return new Intl.NumberFormat(localeMap[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(amount);
}

export function formatDualCurrency(
  amountIDR: number,
  targetCurrency: Currency,
  rates: Record<Currency, number>
): string {
  if (targetCurrency === "IDR") {
    return formatCurrency(amountIDR, "IDR");
  }
  const converted = convertFromIDR(amountIDR, rates[targetCurrency]);
  return `${formatCurrency(converted, targetCurrency)} (${formatCurrency(amountIDR, "IDR")})`;
}

export { CURRENCY_SYMBOLS };

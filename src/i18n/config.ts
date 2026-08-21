export const locales = ["id", "en", "zh", "ms", "th", "ta", "ja", "ko", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

export const localeNames: Record<Locale, string> = {
  id: "Bahasa Indonesia",
  en: "English",
  zh: "中文",
  ms: "Bahasa Melayu",
  th: "ไทย",
  ta: "தமிழ்",
  ja: "日本語",
  ko: "한국어",
  ar: "العربية",
};

export const localeFlags: Record<Locale, string> = {
  id: "🇮🇩",
  en: "🇬🇧",
  zh: "🇨🇳",
  ms: "🇲🇾",
  th: "🇹🇭",
  ta: "🇸🇬",
  ja: "🇯🇵",
  ko: "🇰🇷",
  ar: "🇸🇦",
};

export const currencies = ["IDR", "USD", "EUR", "GBP", "MYR", "SGD", "THB", "CNY", "JPY", "KRW", "SAR"] as const;
export type Currency = (typeof currencies)[number];

export const currencyLocaleMap: Record<string, Currency> = {
  id: "IDR",
  en: "USD",
  zh: "CNY",
  ms: "MYR",
  th: "THB",
  ta: "SGD",
  ja: "JPY",
  ko: "KRW",
  ar: "SAR",
};

export const locales = ["id", "en", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

export const localeNames: Record<Locale, string> = {
  id: "Bahasa Indonesia",
  en: "English",
  zh: "中文",
};

export const localeFlags: Record<Locale, string> = {
  id: "🇮🇩",
  en: "🇬🇧",
  zh: "🇨🇳",
};

export const currencies = ["IDR", "USD", "EUR", "GBP", "MYR", "SGD", "THB", "CNY"] as const;
export type Currency = (typeof currencies)[number];

export const currencyLocaleMap: Record<string, Currency> = {
  id: "IDR",
  en: "USD",
  zh: "CNY",
};

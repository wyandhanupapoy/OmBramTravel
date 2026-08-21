"use client";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { locales, localeNames, localeFlags, type Locale } from "@/i18n/config";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/tours`, label: t("tours") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/contact`, label: t("contact") },
    { href: `/${locale}/faq`, label: t("faq") },
    { href: `/${locale}/track`, label: t("trackOrder") || "Cek Pesanan" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-pine/95 backdrop-blur-sm border-b border-white/10">
      <nav className="max-w-[1180px] mx-auto px-7 flex items-center justify-between h-[74px]">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="font-display text-[22px] font-bold tracking-wider text-paper no-underline flex flex-col leading-none"
        >
          OM BRAM
          <span className="font-mono text-[9px] tracking-[0.22em] font-normal text-beacon uppercase mt-1">
            City Tour Bandung
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-9 list-none m-0 p-0">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`no-underline font-display text-[13px] tracking-wider uppercase opacity-85 hover:opacity-100 transition-opacity ${link.href.includes('track') ? 'text-beacon font-semibold' : 'text-paper'}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-6">
          {/* Language switch */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="bg-transparent border border-white/30 text-paper font-mono text-xs tracking-wide px-3.5 py-1.5 rounded cursor-pointer hover:border-white transition-colors flex items-center gap-2"
            >
              {localeFlags[locale]} {locale.toUpperCase()} 
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-2 bg-pine-dark border border-white/15 rounded-md py-2 min-w-[200px] shadow-xl z-60">
                {locales.map((loc) => (
                  <Link
                    key={loc}
                    href={`/${loc}`}
                    onClick={() => setLangOpen(false)}
                    className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm no-underline hover:bg-white/5 transition-colors ${
                      loc === locale ? "text-beacon font-semibold" : "text-paper"
                    }`}
                  >
                    <span>{localeFlags[loc]}</span>
                    {localeNames[loc]}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <Link
            href={`/${locale}/tours`}
            className="hidden lg:inline-flex items-center gap-2 font-display uppercase tracking-wide text-sm font-semibold px-6 py-3.5 rounded bg-beacon text-pine-dark no-underline hover:-translate-y-0.5 transition-transform"
          >
            {t("bookNow")}
          </Link>

          {/* Burger */}
          <button
            className="lg:hidden bg-transparent border-none cursor-pointer w-8 h-8 p-0 flex flex-col justify-center gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span className="block h-0.5 w-full bg-paper rounded" />
            <span className="block h-0.5 w-full bg-paper rounded" />
            <span className="block h-0.5 w-full bg-paper rounded" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-pine-dark border-t border-white/10 px-7 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`no-underline font-display text-sm tracking-wider uppercase ${link.href.includes('track') ? 'text-beacon' : 'text-paper'}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`/${locale}/tours`}
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center font-display uppercase tracking-wide text-sm font-semibold px-6 py-3.5 rounded bg-beacon text-pine-dark no-underline"
          >
            {t("bookNow")}
          </Link>
        </div>
      )}
    </header>
  );
}

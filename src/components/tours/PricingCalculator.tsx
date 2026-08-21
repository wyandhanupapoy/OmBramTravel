"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import Link from "next/link";

interface Props {
  basePrice: number;
  extraPaxFee: number;
  luggageFee: number;
  childDisc: number;
  maxPax: number;
  locale: string;
  tourSlug: string;
}

export function PricingCalculator({ basePrice, extraPaxFee, luggageFee, childDisc, maxPax, locale, tourSlug }: Props) {
  const t = useTranslations("pricing");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [luggage, setLuggage] = useState(0);

  const totalPax = adults + children;
  const isOverCapacity = totalPax > maxPax;
  const extraPax = Math.max(0, totalPax - maxPax);

  // Kalkulasi
  const adultTotal = adults * basePrice;
  const childTotal = children * (basePrice * ((100 - childDisc) / 100));
  const extraTotal = extraPax * extraPaxFee;
  const luggageTotal = luggage * luggageFee;
  
  const subtotal = adultTotal + childTotal;
  const total = subtotal + extraTotal + luggageTotal;

  return (
    <div className="bg-card border border-line rounded p-7">
      <h3 className="font-display text-xl text-pine-dark mb-6">{t("title")}</h3>
      
      {/* Controls */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-medium">{t("adults")}</span>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setAdults(Math.max(1, adults - 1))}
              className="w-8 h-8 rounded border border-line flex items-center justify-center text-ink hover:bg-line-strong transition"
            >-</button>
            <span className="w-4 text-center">{adults}</span>
            <button 
              onClick={() => setAdults(adults + 1)}
              className="w-8 h-8 rounded border border-line flex items-center justify-center text-ink hover:bg-line-strong transition"
            >+</button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[15px] font-medium block">{t("childrenCount")}</span>
            <span className="text-[13px] text-ink-soft">{t("children", { pct: childDisc })}</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setChildren(Math.max(0, children - 1))}
              className="w-8 h-8 rounded border border-line flex items-center justify-center text-ink hover:bg-line-strong transition"
            >-</button>
            <span className="w-4 text-center">{children}</span>
            <button 
              onClick={() => setChildren(children + 1)}
              className="w-8 h-8 rounded border border-line flex items-center justify-center text-ink hover:bg-line-strong transition"
            >+</button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[15px] font-medium block">{t("luggageCount")}</span>
            <span className="text-[13px] text-ink-soft">{t("extraLuggage")}</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLuggage(Math.max(0, luggage - 1))}
              className="w-8 h-8 rounded border border-line flex items-center justify-center text-ink hover:bg-line-strong transition"
            >-</button>
            <span className="w-4 text-center">{luggage}</span>
            <button 
              onClick={() => setLuggage(luggage + 1)}
              className="w-8 h-8 rounded border border-line flex items-center justify-center text-ink hover:bg-line-strong transition"
            >+</button>
          </div>
        </div>
      </div>

      {isOverCapacity && (
        <div className="bg-rust/10 border border-rust/20 text-rust p-3 rounded text-[13px] mb-6">
          Kapasitas mobil {maxPax} orang. Lebih dari itu dikenakan extra charge per orang.
        </div>
      )}

      {/* Breakdown */}
      <div className="border-t border-line pt-6 flex flex-col gap-3 font-mono text-[13px]">
        <div className="flex justify-between text-ink-soft">
          <span>{t("subtotal")}</span>
          <CurrencyDisplay amountIDR={subtotal} />
        </div>
        {extraTotal > 0 && (
          <div className="flex justify-between text-ink-soft">
            <span>Extra Pax ({extraPax})</span>
            <CurrencyDisplay amountIDR={extraTotal} />
          </div>
        )}
        {luggageTotal > 0 && (
          <div className="flex justify-between text-ink-soft">
            <span>Luggage ({luggage})</span>
            <CurrencyDisplay amountIDR={luggageTotal} />
          </div>
        )}
        
        <div className="flex justify-between text-pine-dark text-lg font-bold pt-3 border-t border-line mt-3">
          <span className="font-display tracking-wide uppercase">{t("total")}</span>
          <CurrencyDisplay amountIDR={total} />
        </div>
      </div>

      <Link
        href={`/${locale}/booking/${tourSlug}?a=${adults}&c=${children}&l=${luggage}`}
        className="mt-8 flex justify-center w-full font-display uppercase tracking-wide text-sm font-semibold px-6 py-4 rounded bg-beacon text-pine-dark no-underline hover:-translate-y-0.5 transition-transform"
      >
        Pesan Sekarang
      </Link>
    </div>
  );
}

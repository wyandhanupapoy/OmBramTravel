import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";

interface TourProps {
  slug: string;
  title: string;
  images: string[];
  duration: string;
  stopsCount: number;
  basePrice: number;
  locale: string;
}

export function TourCard({ slug, title, images, duration, stopsCount, basePrice, locale }: TourProps) {
  const t = useTranslations("tours");
  
  // Use first image or fallback
  const mainImage = images[0] || "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=600&h=400&fit=crop";

  return (
    <Link href={`/${locale}/tours/${slug}`} className="group bg-card border border-line rounded overflow-hidden flex flex-col no-underline transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full bg-line overflow-hidden">
        <Image
          src={mainImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-pine/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-[13px] font-mono text-ink-soft mb-3">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {t(duration === "full-day" ? "fullDay" : "halfDay")}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {stopsCount} {t("stops")}
          </span>
        </div>
        
        <h3 className="font-display text-xl text-pine-dark mb-4 group-hover:text-rust transition-colors leading-snug">
          {title}
        </h3>
        
        <div className="mt-auto pt-5 border-t border-line flex items-end justify-between">
          <div>
            <span className="text-[11px] font-mono tracking-wider uppercase text-ink-soft block mb-1">
              {t("from")}
            </span>
            <CurrencyDisplay amountIDR={basePrice} className="font-bold text-pine-dark" />
            <span className="text-xs text-ink-soft ml-1">{t("perPerson")}</span>
          </div>
          <div className="w-10 h-10 rounded bg-pine-dark flex items-center justify-center text-paper group-hover:bg-beacon transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

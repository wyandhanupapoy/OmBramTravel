import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { TourCard } from "@/components/tours/TourCard";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: `Tours | ${t("title")}`,
  };
}

export default async function ToursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tours" });
  const tZones = await getTranslations({ locale, namespace: "zones" });

  const tours = await db.tour.findMany({
    where: { isActive: true },
    include: { _count: { select: { stops: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="py-24 max-w-[1180px] mx-auto px-7">
      <div className="mb-14">
        <h1 className="font-display uppercase tracking-tight text-[clamp(32px,4vw,48px)] leading-[1.08] text-pine-dark mb-4">
          City Tour Bandung
        </h1>
        <p className="text-ink-soft text-lg max-w-[600px]">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map(tour => {
          // Resolve translation fields based on locale
          let title = tour.titleId;
          if (locale === "en") title = tour.titleEn;
          else if (locale === "zh") title = tour.titleZh || tour.titleEn;

          return (
            <TourCard
              key={tour.id}
              slug={tour.slug}
              title={title}
              images={JSON.parse(tour.images || "[]")}
              duration={tour.duration}
              stopsCount={tour._count.stops}
              basePrice={tour.basePrice}
              locale={locale}
            />
          );
        })}
      </div>

      {tours.length === 0 && (
        <div className="py-20 text-center border border-dashed border-line rounded">
          <p className="text-ink-soft">{t("noResults")} (No tours loaded in database yet)</p>
        </div>
      )}
    </div>
  );
}

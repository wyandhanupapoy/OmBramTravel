import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { TourCard } from "@/components/tours/TourCard";
import { HomeTourSearch } from "@/components/home/HomeTourSearch";
import Link from "next/link";
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

  const [tours, vehicles] = await Promise.all([
    db.tour.findMany({
      where: { isActive: true },
      include: { _count: { select: { stops: true } }, stops: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: 'desc' }
    }),
    db.vehicle.findMany()
  ]);

  return (
    <div className="py-24 max-w-[1180px] mx-auto px-7 min-h-[70vh]">
      <div className="mb-8">
        <h1 className="font-display uppercase tracking-tight text-[clamp(32px,4vw,48px)] leading-[1.08] text-pine-dark mb-4">
          City Tour Bandung
        </h1>
        <p className="text-ink-soft text-lg max-w-[600px]">
          {t("subtitle")}
        </p>
      </div>

      <HomeTourSearch
        locale={locale}
        vehicles={vehicles}
        isCompact={true}
        tours={tours.map((tour) => ({
          slug: tour.slug,
          title: locale === "en" ? tour.titleEn : locale === "zh" ? (tour.titleZh || tour.titleEn) : tour.titleId,
          images: JSON.parse(tour.images || "[]"),
          basePrice: tour.basePrice,
          duration: tour.duration,
          zone: tour.zone,
          maxPax: tour.maxPax,
          ratingAvg: tour.ratingAvg,
          ratingCount: tour.ratingCount,
          stops: tour.stops.map((stop) => stop.nameId)
        }))}
      />

      {tours.length === 0 && (
        <div className="py-20 text-center border border-dashed border-line rounded">
          <p className="text-ink-soft">{t("noResults")} (No tours loaded in database yet)</p>
        </div>
      )}
    </div>
  );
}

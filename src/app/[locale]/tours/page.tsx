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

export default async function ToursPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ page?: string }> }) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(Number(pageParam) || 1, 1);
  const pageSize = 12;
  const t = await getTranslations({ locale, namespace: "tours" });
  const tTourData = await getTranslations({ locale, namespace: "tourData" });

  const [totalTours, tours] = await Promise.all([
    db.tour.count({ where: { isActive: true } }),
    db.tour.findMany({
      where: { isActive: true },
      include: { _count: { select: { stops: true } }, stops: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    })
  ]);
  const totalPages = Math.ceil(totalTours / pageSize);

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

      <HomeTourSearch
        locale={locale}
        tours={tours.map((tour) => ({
          slug: tour.slug,
          title: tour.titleId,
          basePrice: tour.basePrice,
          duration: tour.duration,
          zone: tour.zone,
          stops: tour.stops.map((stop) => stop.nameId)
        }))}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map(tour => {
          let title = tour.titleId;
          try {
            // Fallback to DB titleId if translation key is missing
            if (!tour.slug.startsWith("bandung-")) {
              const translatedTitle = tTourData(`${tour.slug}.title`);
              if (translatedTitle && !translatedTitle.includes("tourData.")) {
                title = translatedTitle;
              }
            }
          } catch(e) {}

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

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination tour">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <Link key={pageNumber} href={`/${locale}/tours?page=${pageNumber}`} aria-current={pageNumber === page ? "page" : undefined} className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${pageNumber === page ? "border-pine bg-pine-dark text-paper" : "border-line-strong text-pine-dark hover:border-pine hover:bg-mist"}`}>
              {pageNumber}
            </Link>
          ))}
        </nav>
      )}

      {tours.length === 0 && (
        <div className="py-20 text-center border border-dashed border-line rounded">
          <p className="text-ink-soft">{t("noResults")} (No tours loaded in database yet)</p>
        </div>
      )}
    </div>
  );
}

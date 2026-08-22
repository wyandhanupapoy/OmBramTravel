import { notFound } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/db";
import { PricingCalculator } from "@/components/tours/PricingCalculator";
import type { TouristTrip, WithContext } from "schema-dts";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const tour = await db.tour.findUnique({ where: { slug } });
  if (!tour) return {};

  const images = JSON.parse(tour.images || "[]");
  const mainImage = images[0] || "/images/og-default.jpg";
  
  let title = tour.titleId;
  let desc = tour.descId;
  try {
    if (!tour.slug.startsWith("bandung-")) {
      const tTourData = await getTranslations({ locale, namespace: "tourData" });
      const translatedTitle = tTourData(`${tour.slug}.title`);
      const translatedDesc = tTourData(`${tour.slug}.desc`);
      if (translatedTitle && !translatedTitle.includes("tourData.")) title = translatedTitle;
      if (translatedDesc && !translatedDesc.includes("tourData.")) desc = translatedDesc;
    }
  } catch (e) {}

  return {
    title: `${title} | OmBram Travel`,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: [mainImage],
      url: `https://ombramtravel.com/${locale}/tours/${slug}`
    },
    alternates: {
      canonical: `/${locale}/tours/${slug}`
    }
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tTourData = await getTranslations({ locale, namespace: "tourData" });
  
  const tour = await db.tour.findUnique({
    where: { slug },
    include: { stops: { orderBy: { order: "asc" } } }
  });

  if (!tour || !tour.isActive) {
    notFound();
  }

  const images = JSON.parse(tour.images || "[]");
  const mainImage = images[0] || "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272";
  
  // Translate based on locale via next-intl
  let title = tour.titleId;
  let desc = tour.descId;
  let highlight = tour.highlightId;

  try {
    if (!tour.slug.startsWith("bandung-")) {
      const translatedTitle = tTourData(`${tour.slug}.title`);
      const translatedDesc = tTourData(`${tour.slug}.desc`);
      const translatedHighlight = tTourData(`${tour.slug}.highlight`);

      if (translatedTitle && !translatedTitle.includes("tourData.")) title = translatedTitle;
      if (translatedDesc && !translatedDesc.includes("tourData.")) desc = translatedDesc;
      if (translatedHighlight && !translatedHighlight.includes("tourData.")) highlight = translatedHighlight;
    }
  } catch (e) {}

  // JSON-LD SEO
  const jsonLd: WithContext<TouristTrip> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: title,
    description: desc,
    image: mainImage,
    touristType: "City Tour",
    offers: {
      "@type": "Offer",
      price: tour.basePrice,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock"
    },
    itinerary: {
      "@type": "ItemList",
      itemListElement: tour.stops.map((stop, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: locale === "en" ? stop.nameEn : (locale === "zh" ? (stop.nameZh || stop.nameEn) : stop.nameId),
        description: `Stop at ${stop.time} for ${stop.duration} minutes.`
      }))
    }
  };

  return (
    <div className="bg-paper pb-24">
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <BreadcrumbSchema items={[
        { name: "Home", item: `https://ombramtravel.com/${locale}` },
        { name: "Tours", item: `https://ombramtravel.com/${locale}/tours` },
        { name: title, item: `https://ombramtravel.com/${locale}/tours/${slug}` }
      ]} />
      
      {/* Hero Image */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        <Image src={mainImage} alt={title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-pine/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent" />
      </div>

      <div className="max-w-[1180px] mx-auto px-7 relative -mt-32 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2">
            <span className="font-mono text-xs tracking-[0.16em] uppercase font-medium text-beacon mb-4 block">
              {tour.zone} BANDUNG
            </span>
            <h1 className="font-display uppercase tracking-tight text-[clamp(32px,4vw,56px)] leading-[1.05] text-pine-dark mb-6">
              {title}
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed mb-10">
              {desc}
            </p>

            <div className="mb-14">
              <h2 className="font-display text-2xl text-pine-dark mb-8">Itinerary</h2>
              <div className="relative border-l-2 border-line-strong ml-4 space-y-10 pb-8">
                {tour.stops.map((stop, i) => {
                  let stopName = stop.nameId;
                  if (locale === "en") stopName = stop.nameEn;
                  else if (locale === "zh") stopName = stop.nameZh || stop.nameEn;

                  return (
                    <div key={stop.id} className="relative pl-8">
                      <div className="absolute w-4 h-4 rounded-full bg-beacon border-[3px] border-paper -left-[9px] top-1" />
                      <div className="font-mono text-sm text-rust font-semibold mb-1">
                        {stop.time} <span className="text-ink-soft font-normal ml-2">({stop.duration} min)</span>
                      </div>
                      <h3 className="font-display text-lg text-pine-dark">{stopName}</h3>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PricingCalculator
                basePrice={tour.basePrice}
                extraPaxFee={tour.extraPaxFee}
                luggageFee={tour.luggageFee}
                childDisc={tour.childDisc}
                maxPax={tour.maxPax}
                locale={locale}
                tourSlug={tour.slug}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

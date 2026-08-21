import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BookingForm } from "@/components/booking/BookingForm";

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; tourSlug: string }>;
  searchParams: Promise<{ a?: string; c?: string; l?: string }>;
}) {
  const { locale, tourSlug } = await params;
  const { a, c, l } = await searchParams;

  const tour = await db.tour.findUnique({
    where: { slug: tourSlug },
  });

  if (!tour || !tour.isActive) {
    notFound();
  }

  const adults = parseInt(a || "1");
  const children = parseInt(c || "0");
  const luggage = parseInt(l || "0");

  const totalPax = adults + children;
  const extraPax = Math.max(0, totalPax - tour.maxPax);

  const adultTotal = adults * tour.basePrice;
  const childTotal = children * (tour.basePrice * ((100 - tour.childDisc) / 100));
  const extraTotal = extraPax * tour.extraPaxFee;
  const luggageTotal = luggage * tour.luggageFee;
  
  const subtotal = adultTotal + childTotal;
  const total = subtotal + extraTotal + luggageTotal;

  let title = tour.titleId;
  if (locale === "en") title = tour.titleEn;
  else if (locale === "zh") title = tour.titleZh || tour.titleEn;

  return (
    <div className="bg-paper min-h-screen py-16">
      <div className="max-w-[1180px] mx-auto px-7">
        <h1 className="font-display uppercase tracking-tight text-[clamp(28px,4vw,40px)] text-pine-dark mb-2">
          Pemesanan Tour
        </h1>
        <p className="text-ink-soft mb-10">Lengkapi data untuk menyelesaikan pemesanan Anda.</p>

        <BookingForm
          tourId={tour.id}
          tourSlug={tour.slug}
          title={title}
          adults={adults}
          childrenCount={children}
          luggage={luggage}
          adultTotal={adultTotal}
          childTotal={childTotal}
          extraTotal={extraTotal}
          luggageTotal={luggageTotal}
          total={total}
          extraPax={extraPax}
          locale={locale}
        />
      </div>
    </div>
  );
}

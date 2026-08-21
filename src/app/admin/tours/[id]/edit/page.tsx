import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateTour } from "@/app/actions/tour";
import { TourForm } from "@/components/admin/TourForm";

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tour = await db.tour.findUnique({
    where: { id },
    include: { stops: { orderBy: { order: "asc" } } }
  });

  if (!tour) notFound();

  return (
    <div>
      <div className="mb-8 flex items-center gap-4 border-b border-line pb-6">
        <Link href="/admin/tours" className="flex h-10 w-10 items-center justify-center rounded border border-line text-ink transition-colors hover:bg-line-strong">←</Link>
        <div>
          <h1 className="font-display text-3xl text-pine-dark">Edit Tour</h1>
          <p className="text-ink-soft">Perbarui informasi, harga, dan itinerary {tour.titleId}.</p>
        </div>
      </div>
      <TourForm initialTour={tour} action={updateTour} />
    </div>
  );
}

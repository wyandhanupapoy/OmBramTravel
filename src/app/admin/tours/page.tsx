export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { formatIDR } from "@/lib/utils";
import Link from "next/link";

export default async function AdminTours() {
  const tours = await db.tour.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { stops: true, bookings: true } } }
  });

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display text-3xl text-pine-dark mb-1">Kelola Tour</h1>
          <p className="text-ink-soft">Atur destinasi dan harga paket tour Anda.</p>
        </div>
        <Link href="/admin/tours/new" className="font-display uppercase tracking-wide text-sm font-semibold px-5 py-3 rounded bg-pine-dark text-paper hover:-translate-y-0.5 transition-transform no-underline">
          + Tambah Tour
        </Link>
      </div>

      <div className="bg-card border border-line rounded overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-line bg-line/30 text-sm font-medium">
              <th className="p-4">Nama Tour</th>
              <th className="p-4">Zona</th>
              <th className="p-4">Durasi / Stop</th>
              <th className="p-4">Harga Dasar</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {tours.map(tour => (
              <tr key={tour.id} className="border-b border-line last:border-0 hover:bg-line/20">
                <td className="p-4">
                  <div className="font-medium text-pine-dark">{tour.titleId}</div>
                  <div className="text-xs text-ink-soft">{tour._count.bookings} Booking Terjual</div>
                </td>
                <td className="p-4 uppercase font-mono text-xs">{tour.zone}</td>
                <td className="p-4">
                  {tour.duration === 'full-day' ? 'Full Day' : 'Half Day'}
                  <div className="text-ink-soft text-xs">{tour._count.stops} Titik Jemput/Stop</div>
                </td>
                <td className="p-4 font-mono">{formatIDR(tour.basePrice)}</td>
                <td className="p-4">
                  {tour.isActive ? (
                    <span className="text-xs font-mono bg-ok/20 text-ok px-2 py-1 rounded">AKTIF</span>
                  ) : (
                    <span className="text-xs font-mono bg-rust/20 text-rust px-2 py-1 rounded">NONAKTIF</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/tours/${tour.id}/edit`} className="rounded-md border border-line-strong px-3 py-1.5 text-xs font-semibold text-pine-dark transition-colors hover:border-pine hover:bg-pine-dark hover:text-paper">Edit Tour</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


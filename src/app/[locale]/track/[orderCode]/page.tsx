import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { LiveMap } from "@/components/track/LiveMap";

export default async function TrackPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string; orderCode: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale, orderCode } = await params;
  const { status } = await searchParams;

  const booking = await db.booking.findUnique({
    where: { orderCode },
    include: { tour: true, driver: { include: { vehicle: true } } }
  });

  if (!booking) notFound();

  const isSuccess = status === "success" || booking.paymentStatus === "paid";
  const isEnRoute = booking.status === "en-route";

  let title = booking.tour.titleId;
  if (locale === "en") title = booking.tour.titleEn;
  else if (locale === "zh") title = booking.tour.titleZh || booking.tour.titleEn;

  return (
    <div className="bg-paper min-h-[80vh] py-16">
      <div className="max-w-[800px] mx-auto px-7 text-center">
        
        {isEnRoute ? (
          <div className="mb-10">
            <h1 className="font-display uppercase tracking-tight text-3xl text-pine-dark mb-2">Driver Sedang Menjemput</h1>
            <p className="text-ink-soft mb-8">Pantau pergerakan kendaraan Anda secara langsung pada peta di bawah ini.</p>
            <LiveMap bookingId={booking.id} tourName={title} />
          </div>
        ) : isSuccess ? (
          <div className="mb-10">
            <div className="w-20 h-20 bg-ok text-white rounded-full flex items-center justify-center mx-auto mb-8">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h1 className="font-display uppercase tracking-tight text-3xl text-pine-dark mb-4">Pembayaran Berhasil!</h1>
            <p className="text-ink-soft mb-8">
              Pemesanan dengan kode <strong className="font-mono text-pine-dark mx-1">{orderCode}</strong> telah dikonfirmasi. 
              Kembali ke halaman ini pada hari-H untuk memantau titik koordinat penjemputan secara Live.
            </p>
          </div>
        ) : (
          <div className="mb-10">
            <div className="w-20 h-20 bg-beacon text-pine-dark rounded-full flex items-center justify-center mx-auto mb-8 live-dot">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h1 className="font-display uppercase tracking-tight text-3xl text-pine-dark mb-4">Menunggu Pembayaran</h1>
            <p className="text-ink-soft mb-8">Selesaikan pembayaran untuk kode pesanan <strong className="font-mono">{orderCode}</strong>.</p>
          </div>
        )}

        <div className="bg-card border border-line rounded-xl p-8 text-left mb-10 shadow-sm">
          <h2 className="font-display text-xl text-pine-dark mb-6 border-b border-line pb-4">Detail Perjalanan</h2>
          
          <div className="space-y-4 text-[15px]">
            <div className="flex justify-between">
              <span className="text-ink-soft">Tour</span>
              <span className="font-medium text-right max-w-[200px]">{title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Tanggal</span>
              <span className="font-medium text-right">{booking.date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Pemesan</span>
              <span className="font-medium text-right">{booking.customerName}</span>
            </div>

            {booking.driver && (
              <div className="flex justify-between border-t border-line pt-4 mt-4 bg-line/20 p-4 rounded-lg">
                <div>
                  <span className="block text-xs font-bold text-pine-dark uppercase mb-1">Driver Anda</span>
                  <span className="font-medium text-lg">{booking.driver.name}</span>
                </div>
                <div className="text-right">
                  <span className="block font-mono font-bold bg-white px-2 py-1 border border-line rounded shadow-sm">
                    {booking.driver.vehicle?.plate || "-"}
                  </span>
                  <span className="text-xs text-ink-soft mt-1 block">{booking.driver.vehicle?.name}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between border-t border-line pt-4 mt-4">
              <span className="text-ink-soft">Total Pembayaran</span>
              <CurrencyDisplay amountIDR={booking.totalIDR} className="font-bold text-pine-dark text-lg" />
            </div>
          </div>
        </div>

        <Link
          href={`/${locale}`}
          className="inline-flex justify-center font-display uppercase tracking-wide text-sm font-semibold px-8 py-4 rounded border border-pine-dark text-pine-dark no-underline hover:bg-pine-dark hover:text-paper transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

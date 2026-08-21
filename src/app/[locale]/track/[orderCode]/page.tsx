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
    <div className="bg-paper min-h-[80vh] py-16 print:py-0 print:min-h-0">
      <div className="max-w-[800px] mx-auto px-7 text-center print:max-w-full print:px-0">
        
        {/* Status Section - Hide on Print */}
        <div className="print:hidden">
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
        </div>

        {/* Print Header (Only visible when printing) */}
        <div className="hidden print:block text-left mb-8 border-b-2 border-pine-dark pb-6">
          <h1 className="font-display text-3xl font-bold text-pine-dark">INVOICE PEMESANAN</h1>
          <p className="font-mono text-sm text-ink mt-2">KODE: {orderCode}</p>
          <p className="text-xs text-ink-soft mt-1">Om Bram City Tour Bandung</p>
        </div>

        {/* Invoice Card */}
        <div className="bg-card border border-line rounded-xl p-8 text-left mb-10 shadow-sm print:border-none print:p-0 print:shadow-none print:mb-4">
          <div className="flex justify-between items-center mb-6 border-b border-line pb-4 print:border-pine-dark">
            <h2 className="font-display text-xl text-pine-dark">Detail Perjalanan</h2>
            {isSuccess && (
              <button 
                onClick={() => window.print()} 
                className="print:hidden text-xs font-semibold uppercase tracking-wide bg-pine-dark text-paper px-4 py-2 rounded hover:bg-pine transition-colors flex items-center gap-2 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Cetak Invoice
              </button>
            )}
          </div>
          
          <div className="space-y-4 text-[15px] print:text-sm">
            <div className="flex justify-between">
              <span className="text-ink-soft print:text-ink">Tour</span>
              <span className="font-medium text-right max-w-[200px] print:max-w-none">{title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft print:text-ink">Tanggal Berangkat</span>
              <span className="font-medium text-right">{booking.date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft print:text-ink">Pemesan</span>
              <span className="font-medium text-right">{booking.customerName} ({booking.customerPhone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft print:text-ink">Titik Jemput</span>
              <span className="font-medium text-right">{booking.pickupPoint}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft print:text-ink">Jumlah Pax</span>
              <span className="font-medium text-right">{booking.pax} Dewasa, {booking.children} Anak, {booking.extraLuggage} Koper Besar</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft print:text-ink">Status Pembayaran</span>
              <span className={`font-mono font-bold ${isSuccess ? 'text-ok' : 'text-rust'} print:text-ink`}>
                {isSuccess ? 'LUNAS (PAID)' : 'PENDING'}
              </span>
            </div>

            {booking.driver && (
              <div className="flex justify-between border-t border-line pt-4 mt-4 bg-line/20 p-4 rounded-lg print:bg-transparent print:border-pine-dark print:px-0">
                <div>
                  <span className="block text-xs font-bold text-pine-dark uppercase mb-1">Driver Anda</span>
                  <span className="font-medium text-lg">{booking.driver.name}</span>
                </div>
                <div className="text-right">
                  <span className="block font-mono font-bold bg-white px-2 py-1 border border-line rounded shadow-sm print:shadow-none print:border-none print:p-0">
                    {booking.driver.vehicle?.plate || "-"}
                  </span>
                  <span className="text-xs text-ink-soft mt-1 block print:text-ink">{booking.driver.vehicle?.name}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between border-t border-line pt-4 mt-4 print:border-pine-dark">
              <span className="text-ink-soft print:text-ink">Total Pembayaran</span>
              <CurrencyDisplay amountIDR={booking.totalIDR} className="font-bold text-pine-dark text-lg print:text-xl" />
            </div>
          </div>
        </div>

        <div className="print:hidden">
          <Link
            href={`/${locale}`}
            className="inline-flex justify-center font-display uppercase tracking-wide text-sm font-semibold px-8 py-4 rounded border border-pine-dark text-pine-dark no-underline hover:bg-pine-dark hover:text-paper transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { LiveMap } from "@/components/track/LiveMap";
import { PrintButton } from "@/components/track/PrintButton";
import { formatIDR } from "@/lib/utils";

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
  const showMap = isSuccess || isEnRoute; // Selalu tunjukkan map jika sudah lunas

  let title = booking.tour.titleId;
  if (locale === "en") title = booking.tour.titleEn;
  else if (locale === "zh") title = booking.tour.titleZh || booking.tour.titleEn;

  return (
    <div className="bg-paper min-h-[80vh] py-16 print:bg-white print:p-0 print:m-0">
      
      {/* 
        ========================================
        WEB VIEW (Sembunyikan saat di Print) 
        ========================================
      */}
      <div className="max-w-[800px] mx-auto px-7 text-center print:hidden">
        
        {/* Status Header */}
        {isEnRoute ? (
          <div className="mb-10">
            <h1 className="font-display uppercase tracking-tight text-3xl text-pine-dark mb-2">Driver Sedang Menjemput</h1>
            <p className="text-ink-soft mb-8">Pantau pergerakan kendaraan Anda secara langsung pada peta di bawah ini.</p>
          </div>
        ) : isSuccess ? (
          <div className="mb-10">
            <div className="w-20 h-20 bg-ok text-white rounded-full flex items-center justify-center mx-auto mb-8">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h1 className="font-display uppercase tracking-tight text-3xl text-pine-dark mb-4">Pembayaran Berhasil!</h1>
            <p className="text-ink-soft mb-8">
              Pemesanan dengan kode <strong className="font-mono text-pine-dark mx-1">{orderCode}</strong> telah dikonfirmasi. 
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

        {/* Invoice Card UI */}
        <div className="bg-card border border-line rounded-xl p-8 text-left mb-10 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-line pb-4">
            <h2 className="font-display text-xl text-pine-dark">Detail Perjalanan</h2>
            {isSuccess && <PrintButton />}
          </div>
          
          <div className="space-y-4 text-[15px]">
            <div className="flex justify-between">
              <span className="text-ink-soft">Tour</span>
              <span className="font-medium text-right max-w-[200px]">{title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Tanggal Berangkat</span>
              <span className="font-medium text-right">{booking.date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Pemesan</span>
              <span className="font-medium text-right">{booking.customerName} ({booking.customerPhone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Titik Jemput</span>
              <span className="font-medium text-right">{booking.pickupPoint}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Jumlah Pax</span>
              <span className="font-medium text-right">{booking.pax} Dewasa, {booking.children} Anak, {booking.extraLuggage} Koper Besar</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Status Pembayaran</span>
              <span className={`font-mono font-bold ${isSuccess ? 'text-ok' : 'text-rust'}`}>
                {isSuccess ? 'LUNAS (PAID)' : 'PENDING'}
              </span>
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

        {/* Live Map - Selalu tampil jika lunas */}
        {showMap && (
          <div className="mb-10 text-left">
            <h2 className="font-display text-xl text-pine-dark mb-4 px-2">Lokasi Penjemputan / Live Tracking</h2>
            <LiveMap 
              bookingId={booking.id} 
              tourName={title} 
              pickupGeoJson={
                booking.notes?.includes('[GEO]:') 
                  ? booking.notes.split('[GEO]:')[1] 
                  : undefined
              }
            />
          </div>
        )}

        <Link
          href={`/${locale}`}
          className="inline-flex justify-center font-display uppercase tracking-wide text-sm font-semibold px-8 py-4 rounded border border-pine-dark text-pine-dark no-underline hover:bg-pine-dark hover:text-paper transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>

      {/* 
        ========================================
        PRINT VIEW (Sembunyikan saat di Web) 
        Hanya muncul di Kertas Cetak
        ========================================
      */}
      <div className="hidden print:block w-full max-w-[800px] mx-auto bg-white text-black p-8 font-sans">
        
        {/* Header Invoice */}
        <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-wider mb-1">OM BRAM</h1>
            <p className="font-mono text-xs tracking-[0.2em] uppercase">City Tour Bandung</p>
            <p className="text-sm mt-4 text-gray-600">Jl. Contoh Alamat Bandung No. 123<br/>Bandung, Jawa Barat, Indonesia<br/>WA: +62 838-7040-5395</p>
          </div>
          <div className="text-right">
            <h2 className="font-display text-3xl text-gray-800 mb-2">INVOICE</h2>
            <p className="font-mono font-bold text-lg">{orderCode}</p>
            <p className="text-sm text-gray-600 mt-2">Tanggal Terbit: {new Date().toLocaleDateString('id-ID')}</p>
            <div className="mt-4 inline-block border-2 border-green-600 text-green-600 font-bold px-4 py-2 uppercase tracking-widest text-sm rounded">
              LUNAS / PAID
            </div>
          </div>
        </div>

        {/* Info Pelanggan & Perjalanan */}
        <div className="flex justify-between mb-8">
          <div className="w-1/2 pr-4">
            <h3 className="font-bold text-gray-500 uppercase text-xs mb-2 tracking-wider">Ditagihkan Kepada:</h3>
            <p className="font-bold text-lg">{booking.customerName}</p>
            <p className="text-sm">{booking.customerPhone}</p>
            <p className="text-sm">{booking.customerEmail}</p>
          </div>
          <div className="w-1/2 pl-4 border-l border-gray-200">
            <h3 className="font-bold text-gray-500 uppercase text-xs mb-2 tracking-wider">Detail Eksekusi:</h3>
            <p className="text-sm"><span className="font-semibold">Tanggal Tur:</span> {booking.date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-sm mt-1"><span className="font-semibold">Titik Jemput:</span> {booking.pickupPoint}</p>
            {booking.driver && (
              <p className="text-sm mt-1">
                <span className="font-semibold">Driver:</span> {booking.driver.name} ({booking.driver.vehicle?.plate})
              </p>
            )}
          </div>
        </div>

        {/* Tabel Layanan */}
        <table className="w-full text-left border-collapse mb-8">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="py-3 px-4 font-bold text-sm text-gray-700">DESKRIPSI LAYANAN</th>
              <th className="py-3 px-4 font-bold text-sm text-gray-700 text-center">QTY</th>
              <th className="py-3 px-4 font-bold text-sm text-gray-700 text-right">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-4">
                <p className="font-bold">{title}</p>
                <p className="text-sm text-gray-600 mt-1">Private City Tour Bandung</p>
              </td>
              <td className="py-4 px-4 text-center align-top">{booking.pax} Pax</td>
              <td className="py-4 px-4 text-right align-top">{formatIDR(booking.totalIDR)}</td>
            </tr>
            {(booking.children > 0 || booking.extraLuggage > 0) && (
              <tr className="border-b border-gray-200">
                <td className="py-4 px-4 text-sm text-gray-600">
                  Tambahan: {booking.children > 0 ? `${booking.children} Anak ` : ''} 
                  {booking.extraLuggage > 0 ? `| ${booking.extraLuggage} Koper Besar` : ''}
                </td>
                <td className="py-4 px-4 text-center">-</td>
                <td className="py-4 px-4 text-right">-</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Ringkasan Biaya */}
        <div className="flex justify-end">
          <div className="w-1/2">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-semibold text-gray-600">Subtotal</span>
              <span>{formatIDR(booking.totalIDR)}</span>
            </div>
            <div className="flex justify-between py-3 border-b-2 border-black">
              <span className="font-bold text-lg">TOTAL DIBAYARKAN</span>
              <span className="font-bold text-lg">{formatIDR(booking.totalIDR)}</span>
            </div>
          </div>
        </div>

        {/* Footer Invoice */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Terima kasih telah mempercayakan perjalanan Anda kepada Om Bram Travel.</p>
          <p>Syarat & Ketentuan berlaku. Harap stand-by 15 menit sebelum waktu penjemputan.</p>
        </div>

      </div>

    </div>
  );
}

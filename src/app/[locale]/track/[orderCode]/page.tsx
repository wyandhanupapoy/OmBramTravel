import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { LiveMap } from "@/components/track/LiveMap";
import { PrintButton } from "@/components/track/PrintButton";
import { ReviewForm } from "@/components/track/ReviewForm";
import { formatIDR } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

function getPickupGeoJson(pickupPoint: string, notes?: string | null) {
  if (pickupPoint.startsWith("{")) return pickupPoint;
  const geoMatch = notes?.match(/\[GEO\]:(\{[^\n]+\})/);
  return geoMatch?.[1];
}

export default async function TrackPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string; orderCode: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale, orderCode } = await params;
  const { status } = await searchParams;
  const t = await getTranslations({ locale, namespace: "track" });

  const booking = await db.booking.findUnique({
    where: { orderCode },
    include: { tour: true, driver: { include: { vehicle: true } } }
  });

  if (!booking) notFound();

  const isSuccess = status === "success" || booking.paymentStatus === "paid";
  const isEnRoute = booking.status === "en-route";
  const isCompleted = booking.status === "completed";
  
  // Tunjukkan map hanya jika lunas dan BELUM selesai
  const showMap = isSuccess && !isCompleted && booking.paymentStatus === "paid";
  const pickupGeoJson = getPickupGeoJson(booking.pickupPoint, booking.notes);
  const luggageCost = booking.extraLuggage * booking.tour.luggageFee;
  const extraPaxCount = Math.max(0, booking.pax + booking.children - booking.tour.maxPax);
  const extraPaxCost = booking.tour.slug === "custom" ? 0 : extraPaxCount * booking.tour.extraPaxFee;
  const routeCost = booking.tour.slug === "custom" ? Math.max(0, booking.extraFees - luggageCost) : 0;

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
        {isCompleted ? (
          <div className="mb-10">
            <div className="w-20 h-20 bg-pine text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h1 className="font-display uppercase tracking-tight text-3xl text-pine-dark mb-4">{t("statusComplete")}</h1>
            <p className="text-ink-soft mb-8">{t("statusCompleteDesc")}</p>
          </div>
        ) : isEnRoute ? (
          <div className="mb-10">
            <h1 className="font-display uppercase tracking-tight text-3xl text-pine-dark mb-2">{t("statusEnRoute")}</h1>
            <p className="text-ink-soft mb-8">{t("statusEnRouteDesc")}</p>
          </div>
        ) : isSuccess ? (
          <div className="mb-10">
            <div className="w-20 h-20 bg-ok text-white rounded-full flex items-center justify-center mx-auto mb-8">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h1 className="font-display uppercase tracking-tight text-3xl text-pine-dark mb-4">{t("statusWait")}</h1>
            <p className="text-ink-soft mb-8">
              {t("statusWaitDesc")} <strong className="font-mono text-pine-dark mx-1">{orderCode}</strong>
            </p>
          </div>
        ) : (
          <div className="mb-10">
            <div className="w-20 h-20 bg-beacon text-pine-dark rounded-full flex items-center justify-center mx-auto mb-8 live-dot">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h1 className="font-display uppercase tracking-tight text-3xl text-pine-dark mb-4">{t("statusPending")}</h1>
            <p className="text-ink-soft mb-8">Selesaikan pembayaran untuk kode pesanan <strong className="font-mono">{orderCode}</strong>.</p>
          </div>
        )}

        {isCompleted && booking.driverId && (
          <ReviewForm 
            orderCode={orderCode} 
            initialRating={booking.rating} 
            initialReview={booking.reviewText} 
          />
        )}

        {/* Invoice Card UI */}
        <div className="bg-card border border-line rounded-xl p-8 text-left mb-10 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-line pb-4">
            <h2 className="font-display text-xl text-pine-dark">{t("title")}</h2>
            {isSuccess && <PrintButton />}
          </div>
          
          <div className="space-y-4 text-[15px]">
            <div className="flex justify-between">
              <span className="text-ink-soft">Tour</span>
              <span className="font-medium text-right max-w-[200px]">{title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">{t("tourDate")}</span>
              <span className="font-medium text-right">{booking.date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Pemesan</span>
              <span className="font-medium text-right">{booking.customerName} ({booking.customerPhone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">{t("pickup")}</span>
              <span className="font-medium text-right max-w-[250px]">{booking.pickupPoint}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Jumlah Pax</span>
              <span className="font-medium text-right">{booking.pax} Dewasa, {booking.children} Anak, {booking.extraLuggage} Koper Besar</span>
            </div>

            {booking.driver && (
              <div className="flex justify-between border-t border-line/50 pt-4 mt-2">
                <span className="text-ink-soft">{t("driver")}</span>
                <span className="font-medium text-right">{booking.driver.name} ({booking.driver.vehicle?.plate})</span>
              </div>
            )}

            <div className="flex justify-between border-t border-line pt-4 mt-2">
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

            <div className="flex justify-between pt-2">
              <span className="text-ink-soft">{t("subtotal")}</span>
              <span className="font-medium text-right">{formatIDR(booking.subtotal)}</span>
            </div>

            {booking.extraFees > 0 && (
              <div className="flex justify-between">
                <span className="text-ink-soft">{t("extraFees")}</span>
                <span className="font-medium text-right">{formatIDR(booking.extraFees)}</span>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-line">
              <span className="font-bold text-pine-dark">{t("total")}</span>
              <span className="font-bold text-lg text-pine-dark">{formatIDR(booking.totalIDR)}</span>
            </div>
          </div>
        </div>

        {showMap && (
          <div className="bg-card border border-line rounded-xl p-8 text-left mb-10 shadow-sm">
            <h2 className="font-display text-xl text-pine-dark mb-4 px-2">{t("liveMap")}</h2>
            <LiveMap 
              bookingId={booking.id}
              tourName={title} 
              pickupGeoJson={pickupGeoJson}
            />
          </div>
        )}

        <Link 
          href={`/${locale}`}
          className="inline-flex justify-center font-display uppercase tracking-wide text-sm font-semibold px-8 py-4 rounded border border-pine-dark text-pine-dark no-underline hover:bg-pine-dark hover:text-paper transition-colors"
        >
          {t("backHome")}
        </Link>
      </div>

      {/* 
        ========================================
        PRINT VIEW (Sembunyikan saat di Web) 
        Hanya muncul di Kertas Cetak
        ========================================
      */}
      <div className="hidden print:block w-full max-w-[800px] mx-auto bg-white text-black p-8 font-mono text-[11px] leading-relaxed">
        
        {/* Header Invoice */}
        <div className="flex justify-between items-start border-b-2 border-dashed border-black pb-5 mb-5">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-wider mb-1">OM BRAM</h1>
            <p className="font-mono text-xs tracking-[0.2em] uppercase">City Tour Bandung</p>
            <p className="text-[10px] mt-3">Jl. Contoh Alamat Bandung No. 123<br/>Bandung, Jawa Barat, Indonesia<br/>WA: +62 838-7040-5395</p>
          </div>
          <div className="text-right">
            <h2 className="font-display text-3xl text-gray-800 mb-2">INVOICE</h2>
            <p className="font-mono font-bold text-lg">{orderCode}</p>
            <p className="text-sm text-gray-600 mt-2">Tanggal Terbit: {new Date().toLocaleDateString('id-ID')}</p>
            <div className="mt-3 inline-block border border-black font-bold px-3 py-1 uppercase tracking-widest">
              {isSuccess ? "LUNAS / PAID" : "PENDING"}
            </div>
          </div>
        </div>

        {/* Info Pelanggan & Perjalanan */}
        <div className="flex justify-between mb-6">
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
              <th className="py-2 px-3 font-bold">DESKRIPSI</th>
              <th className="py-2 px-3 font-bold text-center">QTY</th>
              <th className="py-2 px-3 font-bold text-right">JUMLAH</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-3">
                <p className="font-bold">{title}</p>
                <p className="text-[10px] mt-1">Private City Tour Bandung</p>
              </td>
              <td className="py-3 px-3 text-center align-top">{booking.pax + booking.children}</td>
              <td className="py-3 px-3 text-right align-top">{formatIDR(booking.subtotal)}</td>
            </tr>
            {extraPaxCost > 0 && <tr className="border-b border-gray-400"><td className="py-2 px-3">Tambahan kapasitas ({extraPaxCount} pax)</td><td className="py-2 px-3 text-center">{extraPaxCount}</td><td className="py-2 px-3 text-right">{formatIDR(extraPaxCost)}</td></tr>}
            {routeCost > 0 && <tr className="border-b border-gray-400"><td className="py-2 px-3">Biaya jarak/rute custom</td><td className="py-2 px-3 text-center">1</td><td className="py-2 px-3 text-right">{formatIDR(routeCost)}</td></tr>}
            {luggageCost > 0 && <tr className="border-b border-gray-400"><td className="py-2 px-3">Bagasi besar</td><td className="py-2 px-3 text-center">{booking.extraLuggage}</td><td className="py-2 px-3 text-right">{formatIDR(luggageCost)}</td></tr>}
          </tbody>
        </table>

        {/* Ringkasan Biaya */}
        <div className="flex justify-end">
          <div className="w-1/2">
            <div className="flex justify-between py-2 border-b border-gray-400">
              <span className="font-semibold">SUBTOTAL</span>
              <span>{formatIDR(booking.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-400">
              <span>BIAYA TAMBAHAN</span>
              <span>{formatIDR(booking.extraFees)}</span>
            </div>
            <div className="flex justify-between py-3 border-b-2 border-black text-base font-bold">
              <span>TOTAL DIBAYARKAN</span>
              <span>{formatIDR(booking.totalIDR)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-dashed border-black pt-5 mt-6 mb-8">
          <div><h3 className="font-bold uppercase mb-2">Termasuk</h3><p>Transportasi private sesuai kapasitas</p><p>Driver dan BBM</p><p>Penjemputan di titik tertera</p><p>Itinerary sesuai paket</p></div>
          <div><h3 className="font-bold uppercase mb-2">Tidak Termasuk</h3><p>Tiket masuk objek wisata</p><p>Makan dan minum pribadi</p><p>Parkir, tol, dan biaya di luar paket</p><p>Pengeluaran pribadi dan tip driver</p></div>
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

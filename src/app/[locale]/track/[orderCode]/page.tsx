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
    include: { tour: true, vehicle: true, driver: { include: { vehicle: true } } }
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
              pickupAddress={booking.pickupPoint}
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
      <div className="hidden print:block w-full max-w-[800px] mx-auto bg-white text-black p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
        
        <div className="text-center border-b-2 border-dashed border-black pb-4 mb-4">
          <h1 className="text-3xl font-bold tracking-widest uppercase mb-1">=== OM BRAM ===</h1>
          <p className="text-sm tracking-widest uppercase">CITY TOUR BANDUNG</p>
          <p className="text-xs mt-2">JL. CONTOH ALAMAT BANDUNG NO. 123<br/>BANDUNG, JAWA BARAT, INDONESIA<br/>WA: +62 838-7040-5395</p>
        </div>

        <div className="flex justify-between items-start mb-6 border-b-2 border-dashed border-black pb-4">
          <div>
            <p>NO ORDER : {orderCode}</p>
            <p>TANGGAL  : {new Date().toLocaleDateString('id-ID')}</p>
            <p>STATUS   : {isSuccess ? "LUNAS (PAID)" : "PENDING"}</p>
            <p>MOBIL REQ: {booking.vehicle ? booking.vehicle.name.toUpperCase() : "BEBAS"}</p>
          </div>
          <div className="text-right">
            <p>CUSTOMER : {booking.customerName.toUpperCase()}</p>
            <p>TELP     : {booking.customerPhone}</p>
            <p>JEMPUT   : {booking.pickupPoint.toUpperCase()}</p>
            {booking.driver && <p>DRIVER   : {booking.driver.name.toUpperCase()} ({booking.driver.vehicle?.plate})</p>}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex border-b border-black pb-1 mb-2 font-bold uppercase">
            <div className="w-1/2">DESKRIPSI</div>
            <div className="w-1/4 text-center">QTY</div>
            <div className="w-1/4 text-right">JUMLAH</div>
          </div>
          
          <div className="flex mb-1">
            <div className="w-1/2 pr-2">{title.toUpperCase()} (PRIVATE TOUR)</div>
            <div className="w-1/4 text-center">{booking.pax + booking.children} PAX</div>
            <div className="w-1/4 text-right">{formatIDR(booking.subtotal)}</div>
          </div>
          
          {extraPaxCost > 0 && (
            <div className="flex mb-1 text-xs">
              <div className="w-1/2 pr-2">TAMBAHAN KAPASITAS</div>
              <div className="w-1/4 text-center">{extraPaxCount} PAX</div>
              <div className="w-1/4 text-right">{formatIDR(extraPaxCost)}</div>
            </div>
          )}
          {routeCost > 0 && (
            <div className="flex mb-1 text-xs">
              <div className="w-1/2 pr-2">BIAYA JARAK/RUTE CUSTOM</div>
              <div className="w-1/4 text-center">1</div>
              <div className="w-1/4 text-right">{formatIDR(routeCost)}</div>
            </div>
          )}
          {luggageCost > 0 && (
            <div className="flex mb-1 text-xs">
              <div className="w-1/2 pr-2">BAGASI BESAR</div>
              <div className="w-1/4 text-center">{booking.extraLuggage}</div>
              <div className="w-1/4 text-right">{formatIDR(luggageCost)}</div>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-dashed border-black pt-2 mb-6">
          <div className="w-1/2">
            <div className="flex justify-between mb-1">
              <span>SUBTOTAL</span>
              <span>{formatIDR(booking.subtotal)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>BIAYA TAMBAHAN</span>
              <span>{formatIDR(booking.extraFees)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-black">
              <span>TOTAL</span>
              <span>{formatIDR(booking.totalIDR)}</span>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-black pt-4 mb-4">
          <div className="mb-4">
            <p className="font-bold uppercase mb-1">+++ INCLUDE (TERMASUK) +++</p>
            <p className="text-xs">- TRANSPORTASI PRIVATE SESUAI KAPASITAS</p>
            <p className="text-xs">- DRIVER BERPENGALAMAN & BBM</p>
            <p className="text-xs">- PENJEMPUTAN & PENGANTARAN KE TITIK TERTERA</p>
            <p className="text-xs">- ITINERARY SESUAI PAKET YANG DIPILIH</p>
          </div>
          <div>
            <p className="font-bold uppercase mb-1">--- EXCLUDE (TIDAK TERMASUK) ---</p>
            <p className="text-xs">- TIKET MASUK OBJEK WISATA</p>
            <p className="text-xs">- MAKAN & MINUM PRIBADI</p>
            <p className="text-xs">- PARKIR, TOL, DAN BIAYA DI LUAR PAKET</p>
            <p className="text-xs">- PENGELUARAN PRIBADI & TIPPING DRIVER (SUKARELA)</p>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-black pt-4 text-center text-xs">
          <p>TERIMA KASIH TELAH MEMPERCAYAKAN PERJALANAN ANDA KEPADA OM BRAM TRAVEL.</p>
          <p>HARAP STAND-BY 15 MENIT SEBELUM WAKTU PENJEMPUTAN.</p>
          <p className="mt-2 text-[10px]">Dicetak secara otomatis oleh sistem pada {new Date().toLocaleString('id-ID')}</p>
        </div>

      </div>

    </div>
  );
}

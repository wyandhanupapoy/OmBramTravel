import { CustomTourBuilder } from "@/components/booking/CustomTourBuilder";

export default async function CustomTourPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  return (
    <div className="bg-paper min-h-screen py-16">
      <div className="max-w-[1200px] mx-auto px-7">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-display text-4xl text-pine-dark mb-4">Buat Tur Kustom Anda</h1>
          <p className="text-ink-soft">
            Pilih titik jemput dan tentukan hingga 4 tempat wisata favorit Anda. Sistem kami akan secara otomatis menghitung rute terbaik dan harga berdasarkan jarak yang ditempuh.
          </p>
        </div>
        
        <CustomTourBuilder locale={locale} />
      </div>
    </div>
  );
}

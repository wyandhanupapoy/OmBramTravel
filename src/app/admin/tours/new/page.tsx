import { TourForm } from "@/components/admin/TourForm";
import Link from "next/link";

export default function NewTourPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8 border-b border-line pb-6">
        <Link href="/admin/tours" className="w-10 h-10 rounded border border-line flex items-center justify-center text-ink hover:bg-line-strong transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </Link>
        <div>
          <h1 className="font-display text-3xl text-pine-dark mb-1">Tambah Tour Baru</h1>
          <p className="text-ink-soft">Isi formulir berikut untuk menambahkan paket wisata baru.</p>
        </div>
      </div>

      <TourForm />
    </div>
  );
}

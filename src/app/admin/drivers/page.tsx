import { db } from "@/lib/db";
import Link from "next/link";

export default async function AdminDrivers() {
  const drivers = await db.driver.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { bookings: true } }, vehicle: true }
  });

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display text-3xl text-pine-dark mb-1">Tim Driver</h1>
          <p className="text-ink-soft">Kelola akun driver untuk aplikasi pelacakan.</p>
        </div>
        <Link href="/admin/drivers/new" className="font-display uppercase tracking-wide text-sm font-semibold px-5 py-3 rounded bg-pine-dark text-paper hover:-translate-y-0.5 transition-transform no-underline">
          + Tambah Driver
        </Link>
      </div>

      <div className="bg-card border border-line rounded overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-line bg-line/30 text-sm font-medium">
              <th className="p-4">Nama Driver</th>
              <th className="p-4">Kontak & Email</th>
              <th className="p-4">Plat Nomor / SIM</th>
              <th className="p-4">Total Tugas</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {drivers.map(driver => (
              <tr key={driver.id} className="border-b border-line last:border-0 hover:bg-line/20">
                <td className="p-4">
                  <div className="font-medium text-pine-dark">{driver.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono">Rating: {driver.rating}⭐</span>
                    {driver.isOnline && <span className="w-2 h-2 rounded-full bg-ok"></span>}
                  </div>
                </td>
                <td className="p-4">
                  <div>{driver.phone}</div>
                  <div className="text-xs text-ink-soft">{driver.email}</div>
                </td>
                <td className="p-4">
                  <div className="font-mono">{driver.vehicle?.plate || "-"}</div>
                  <div className="text-xs text-ink-soft">SIM: {driver.licenseNo}</div>
                </td>
                <td className="p-4 font-mono">{driver._count.bookings} trip</td>
                <td className="p-4 text-right">
                  <button className="text-pine-dark underline text-sm hover:text-beacon transition-colors">Edit</button>
                </td>
              </tr>
            ))}
            {drivers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-ink-soft">
                  Belum ada driver terdaftar. Silakan tambah driver untuk ditugaskan ke pesanan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

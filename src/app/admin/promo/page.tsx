import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminPromoPage() {
  const promos = await db.promo.findMany({ orderBy: { createdAt: 'desc' } });

  async function createPromo(formData: FormData) {
    "use server";
    await db.promo.create({
      data: {
        code: (formData.get("code") as string).toUpperCase(),
        discount: Number(formData.get("discount")),
        type: formData.get("type") as string,
        maxUsage: formData.get("maxUsage") ? Number(formData.get("maxUsage")) : null,
      }
    });
    revalidatePath("/admin/promo");
  }

  async function deletePromo(formData: FormData) {
    "use server";
    await db.promo.delete({ where: { id: formData.get("id") as string } });
    revalidatePath("/admin/promo");
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-pine-dark mb-6">Kelola Promo</h1>
      
      <div className="bg-paper p-6 rounded-xl border border-line mb-8">
        <h2 className="font-bold mb-4">Buat Promo Baru</h2>
        <form action={createPromo} className="flex gap-4 items-end">
          <div>
            <label className="block text-xs mb-1">Kode Promo</label>
            <input name="code" className="border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block text-xs mb-1">Diskon</label>
            <input type="number" name="discount" className="border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block text-xs mb-1">Tipe</label>
            <select name="type" className="border px-3 py-2 rounded">
              <option value="percent">Persen (%)</option>
              <option value="flat">Nominal (Rp)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1">Maks Penggunaan</label>
            <input type="number" name="maxUsage" className="border px-3 py-2 rounded" placeholder="Unlimit" />
          </div>
          <button type="submit" className="bg-pine text-paper px-4 py-2 rounded">Simpan</button>
        </form>
      </div>

      <div className="bg-paper rounded-xl border border-line overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-pine-dark/5 border-b border-line">
              <th className="p-4 font-semibold">Kode</th>
              <th className="p-4 font-semibold">Diskon</th>
              <th className="p-4 font-semibold">Tipe</th>
              <th className="p-4 font-semibold">Terpakai</th>
              <th className="p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {promos.map(p => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="p-4 font-mono font-bold text-beacon">{p.code}</td>
                <td className="p-4">{p.discount}</td>
                <td className="p-4">{p.type === 'percent' ? '%' : 'Rp'}</td>
                <td className="p-4">{p.usedCount} / {p.maxUsage || '?'}</td>
                <td className="p-4">
                  <form action={deletePromo}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-rust text-xs hover:underline">Hapus</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

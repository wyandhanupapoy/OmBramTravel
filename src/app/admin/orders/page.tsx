import { db } from "@/lib/db";
import { formatIDR } from "@/lib/utils";
import { AssignDriverDropdown } from "@/components/admin/AssignDriverDropdown";

export default async function AdminOrders() {
  const orders = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { tour: true, driver: true }
  });

  const availableDrivers = await db.driver.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" }
  });

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <h1 className="font-display text-3xl text-pine-dark">Daftar Pesanan</h1>
      </div>

      <div className="bg-card border border-line rounded overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-line bg-line/30 text-sm font-medium">
              <th className="p-4">Tanggal Tour</th>
              <th className="p-4">Kode/Pemesan</th>
              <th className="p-4">Tour (Pax)</th>
              <th className="p-4">Total</th>
              <th className="p-4">Pembayaran</th>
              <th className="p-4">Driver</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.map(order => (
              <tr key={order.id} className="border-b border-line last:border-0 hover:bg-line/20">
                <td className="p-4 font-medium">{order.date.toLocaleDateString('id-ID')}</td>
                <td className="p-4">
                  <div className="font-mono font-bold text-pine-dark">{order.orderCode}</div>
                  <div className="text-ink-soft">{order.customerName}</div>
                </td>
                <td className="p-4">
                  <div>{order.tour.titleId}</div>
                  <div className="text-ink-soft text-xs">{order.pax} Dws, {order.children} Ank</div>
                </td>
                <td className="p-4 font-mono">{formatIDR(order.totalIDR)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                    order.paymentStatus === 'paid' ? 'bg-ok/20 text-ok' : 
                    order.paymentStatus === 'pending' ? 'bg-beacon/20 text-pine-dark' : 
                    'bg-rust/20 text-rust'
                  }`}>
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  {order.driver ? (
                    <span className="text-pine-dark font-medium">{order.driver.name}</span>
                  ) : (
                    <AssignDriverDropdown orderId={order.id} drivers={availableDrivers} />
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-ink-soft">Belum ada pesanan masuk.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

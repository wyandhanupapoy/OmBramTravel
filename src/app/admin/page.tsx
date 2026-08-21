export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { formatIDR } from "@/lib/utils";
import { AutoRefresh } from "@/components/admin/AutoRefresh";

export default async function AdminDashboard() {
  const [totalOrders, paidOrders, totalRevenue] = await Promise.all([
    db.booking.count(),
    db.booking.count({ where: { paymentStatus: "paid" } }),
    db.booking.aggregate({
      where: { paymentStatus: "paid" },
      _sum: { totalIDR: true }
    })
  ]);

  const recentOrders = await db.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { tour: true }
  });

  // Action required: Reported by driver OR paid but no driver assigned
  const actionRequiredOrders = await db.booking.findMany({
    where: {
      OR: [
        { isReported: true },
        { paymentStatus: "paid", driverId: null, status: { not: "completed" } }
      ]
    },
    include: { tour: true }
  });

  return (
    <div>
      <AutoRefresh intervalMs={5000} />
      <h1 className="font-display text-3xl text-pine-dark mb-8">Dashboard</h1>
      
      {actionRequiredOrders.length > 0 && (
        <div className="mb-10 bg-rust/5 border-l-4 border-rust p-6 rounded-r-xl">
          <h2 className="font-display text-xl text-rust mb-4 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Perlu Tindakan ({actionRequiredOrders.length})
          </h2>
          <div className="space-y-3">
            {actionRequiredOrders.map(order => (
              <div key={order.id} className="bg-white border border-rust/20 p-4 rounded-lg flex justify-between items-center shadow-sm">
                <div>
                  <div className="font-bold text-pine-dark font-mono text-sm mb-1">{order.orderCode} - {order.customerName}</div>
                  <div className="text-sm text-ink-soft">
                    {order.isReported ? (
                      <span className="text-rust font-medium">Ada Laporan Driver: {order.reportDetails}</span>
                    ) : (
                      "Pesanan Lunas, Driver Belum Ditugaskan"
                    )}
                  </div>
                </div>
                <a href="/admin/orders" className="text-sm font-medium bg-rust text-white px-4 py-2 rounded shadow-sm hover:bg-rust/90">
                  Tindak Lanjuti
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-card border border-line rounded p-6 shadow-sm">
          <p className="text-ink-soft text-sm font-mono mb-2">TOTAL PESANAN</p>
          <p className="text-4xl font-display text-pine-dark">{totalOrders}</p>
        </div>
        <div className="bg-card border border-line rounded p-6 shadow-sm">
          <p className="text-ink-soft text-sm font-mono mb-2">PESANAN LUNAS</p>
          <p className="text-4xl font-display text-pine-dark">{paidOrders}</p>
        </div>
        <div className="bg-pine-dark border border-line rounded p-6 shadow-sm text-paper">
          <p className="text-white/60 text-sm font-mono mb-2">PENDAPATAN</p>
          <p className="text-4xl font-display text-beacon">
            {formatIDR(totalRevenue._sum.totalIDR || 0)}
          </p>
        </div>
      </div>

      <h2 className="font-display text-2xl text-pine-dark mb-6">Pesanan Terbaru</h2>
      <div className="bg-card border border-line rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-line bg-line/30 text-sm font-medium">
              <th className="p-4">Kode</th>
              <th className="p-4">Pemesan</th>
              <th className="p-4">Tour</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {recentOrders.map(order => (
              <tr key={order.id} className="border-b border-line last:border-0 hover:bg-line/20">
                <td className="p-4 font-mono">{order.orderCode}</td>
                <td className="p-4">{order.customerName}</td>
                <td className="p-4 truncate max-w-[200px]">{order.tour.titleId}</td>
                <td className="p-4">{order.date.toLocaleDateString('id-ID')}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                    order.paymentStatus === 'paid' ? 'bg-ok/20 text-ok' : 
                    order.paymentStatus === 'pending' ? 'bg-beacon/20 text-pine-dark' : 
                    'bg-rust/20 text-rust'
                  }`}>
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-ink-soft">Belum ada pesanan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


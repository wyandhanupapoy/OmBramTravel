import { db } from "@/lib/db";
import { formatIDR } from "@/lib/utils";

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

  return (
    <div>
      <h1 className="font-display text-3xl text-pine-dark mb-8">Dashboard</h1>
      
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

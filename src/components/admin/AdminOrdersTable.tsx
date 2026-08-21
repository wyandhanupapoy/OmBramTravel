"use client";
import { useState } from "react";
import { formatIDR } from "@/lib/utils";
import { AssignDriverDropdown } from "@/components/admin/AssignDriverDropdown";

export function AdminOrdersTable({ orders, drivers }: { orders: any[], drivers: any[] }) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [extraCharge, setExtraCharge] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (order: any) => {
    setSelectedOrder(order);
    setExtraCharge(order.extraCharge || 0);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/admin/orders/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          orderId: selectedOrder.id, 
          extraCharge,
          reportResolved: true 
        })
      });
      window.location.reload();
    } catch (e) {
      alert("Gagal mengupdate pesanan");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-card border border-line rounded overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-line bg-line/30 text-sm font-medium">
              <th className="p-4">Tanggal Tour</th>
              <th className="p-4">Kode/Pemesan</th>
              <th className="p-4">Tour (Pax)</th>
              <th className="p-4">Total & Cas</th>
              <th className="p-4">Pembayaran</th>
              <th className="p-4">Driver</th>
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.map(order => (
              <tr key={order.id} className={`border-b border-line last:border-0 hover:bg-line/20 ${order.isReported ? 'bg-rust/5' : ''}`}>
                <td className="p-4 font-medium">{new Date(order.date).toLocaleDateString('id-ID')}</td>
                <td className="p-4">
                  <div className="font-mono font-bold text-pine-dark flex items-center gap-2">
                    {order.orderCode}
                    {order.isReported && <span className="bg-rust text-white text-[10px] px-1.5 py-0.5 rounded">LAPORAN</span>}
                  </div>
                  <div className="text-ink-soft">{order.customerName}</div>
                </td>
                <td className="p-4">
                  <div>{order.tour.titleId}</div>
                  <div className="text-ink-soft text-xs">{order.pax} Dws, {order.children} Ank</div>
                </td>
                <td className="p-4 font-mono">
                  {formatIDR(order.totalIDR)}
                  {order.extraCharge > 0 && <div className="text-rust text-xs">+ {formatIDR(order.extraCharge)} Cas</div>}
                </td>
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
                    <AssignDriverDropdown orderId={order.id} drivers={drivers} />
                  )}
                </td>
                <td className="p-4">
                  <button onClick={() => handleEdit(order)} className="text-pine underline text-sm hover:text-pine-dark font-medium">Edit</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-ink-soft">Belum ada pesanan masuk.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-pine-dark/80 z-50 flex items-center justify-center p-4">
          <div className="bg-paper max-w-lg w-full rounded-2xl p-6 shadow-2xl">
            <h3 className="font-display text-2xl text-pine-dark mb-1">Edit Pesanan: {selectedOrder.orderCode}</h3>
            <p className="text-ink-soft mb-6">{selectedOrder.customerName} ({selectedOrder.customerPhone})</p>

            {selectedOrder.isReported && (
              <div className="bg-rust/10 border border-rust/20 p-4 rounded-xl mb-6">
                <h4 className="text-rust font-bold mb-1 text-sm uppercase tracking-wider">Laporan Driver</h4>
                <p className="text-sm font-medium">{selectedOrder.reportDetails}</p>
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="bg-line/30 p-3 rounded-lg text-sm">
                <div className="text-ink-soft mb-1">Titik Jemput:</div>
                <div className="font-medium">{selectedOrder.pickupPoint}</div>
              </div>
              <div className="bg-line/30 p-3 rounded-lg text-sm">
                <div className="text-ink-soft mb-1">Catatan Tambahan:</div>
                <div className="font-medium whitespace-pre-wrap">{selectedOrder.notes || "-"}</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-pine-dark">Cas Lebih (Extra Charge) Rp</label>
                <input 
                  type="number" 
                  value={extraCharge} 
                  onChange={(e) => setExtraCharge(parseInt(e.target.value) || 0)}
                  className="w-full border border-line rounded px-4 py-2 focus:outline-none focus:border-pine font-mono"
                  placeholder="0"
                />
                <p className="text-xs text-ink-soft mt-1">Total harga akan otomatis diperbarui dan status laporan akan dihapus.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="px-6 py-2.5 rounded font-medium border border-line hover:bg-line/50 transition-colors"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button 
                onClick={handleSave} 
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded font-medium bg-pine-dark text-paper hover:bg-pine transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan & Selesaikan Laporan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

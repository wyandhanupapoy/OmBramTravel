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
      const response = await fetch("/api/admin/orders/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          orderId: selectedOrder.id, 
          extraCharge,
          reportResolved: true 
        })
      });
      if (!response.ok) throw new Error("Gagal mengupdate pesanan");
      window.location.reload();
    } catch (e) {
      alert("Gagal mengupdate pesanan");
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Order Code", "Date", "Customer Name", "Phone", "Tour", "Pax", "Subtotal", "Extra Charge", "Total IDR", "Payment Status", "Driver", "Vehicle Requested", "Assigned At", "Departed At", "Arrived At", "Started At", "Completed At"];
    const rows = orders.map(o => [
      o.orderCode,
      new Date(o.date).toISOString().split('T')[0],
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.tour.titleId}"`,
      o.pax + (o.children || 0),
      o.subtotal,
      o.extraCharge || 0,
      o.totalIDR,
      o.paymentStatus,
      `"${o.driver?.name || "Unassigned"}"`,
      o.vehicle ? `"${o.vehicle.name} (${o.vehicle.type})"` : "-",
      o.assignedAt ? new Date(o.assignedAt).toLocaleString('id-ID') : "-",
      o.departedAt ? new Date(o.departedAt).toLocaleString('id-ID') : "-",
      o.arrivedAt ? new Date(o.arrivedAt).toLocaleString('id-ID') : "-",
      o.startedAt ? new Date(o.startedAt).toLocaleString('id-ID') : "-",
      o.completedAt ? new Date(o.completedAt).toLocaleString('id-ID') : "-"
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Pesanan_OmBram_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={handleExportCSV} className="bg-beacon text-pine-dark font-display uppercase tracking-wide text-sm px-6 py-2 rounded-lg shadow-sm hover:opacity-90 transition-opacity">
          Export ke CSV
        </button>
      </div>
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
                    <div>
                      <span className="text-pine-dark font-medium">{order.driver.name}</span>
                      <span className={`mt-1 block w-fit rounded px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase ${order.status === "completed" ? "bg-ok/15 text-ok" : order.status === "touring" ? "bg-pine/15 text-pine-dark" : "bg-beacon/20 text-pine-dark"}`}>
                        {order.status === "en-route" ? "Menuju pickup" : order.status === "touring" ? "Tour berjalan" : order.status}
                      </span>
                    </div>
                  ) : (
                    <AssignDriverDropdown orderId={order.id} drivers={drivers} />
                  )}
                </td>
                <td className="p-4">
                  <button onClick={() => handleEdit(order)} className="rounded-md border border-line-strong px-3 py-1.5 text-xs font-semibold text-pine-dark transition-colors hover:border-pine hover:bg-pine-dark hover:text-paper focus:outline-none focus:ring-2 focus:ring-beacon/70">
                    Edit Pesanan
                  </button>
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
                <div className="text-ink-soft mb-1">Mobil Diminta Pelanggan:</div>
                <div className="font-medium text-pine-dark">{selectedOrder.vehicle ? `${selectedOrder.vehicle.name} (${selectedOrder.vehicle.type})` : "Tidak ada permintaan spesifik"}</div>
              </div>
              <div className="bg-line/30 p-3 rounded-lg text-sm">
                <div className="text-ink-soft mb-1">Catatan Tambahan:</div>
                <div className="font-medium whitespace-pre-wrap">{selectedOrder.notes || "-"}</div>
              </div>

              {selectedOrder.driverId && (
                <div className="border border-line rounded-lg p-4 bg-paper shadow-inner mt-4">
                  <h4 className="font-display font-semibold text-pine-dark mb-3">Audit Trail Status</h4>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-line pb-1">
                      <span className="text-ink-soft">1. Ditugaskan:</span>
                      <span className="font-medium">{selectedOrder.assignedAt ? new Date(selectedOrder.assignedAt).toLocaleString('id-ID') : '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-line pb-1">
                      <span className="text-ink-soft">2. Berangkat Jemput:</span>
                      <span className="font-medium">{selectedOrder.departedAt ? new Date(selectedOrder.departedAt).toLocaleString('id-ID') : '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-line pb-1">
                      <span className="text-ink-soft">3. Tiba di Lokasi:</span>
                      <span className="font-medium">{selectedOrder.arrivedAt ? new Date(selectedOrder.arrivedAt).toLocaleString('id-ID') : '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-line pb-1">
                      <span className="text-ink-soft">4. Tour Dimulai:</span>
                      <span className="font-medium">{selectedOrder.startedAt ? new Date(selectedOrder.startedAt).toLocaleString('id-ID') : '-'}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-ink-soft">5. Selesai:</span>
                      <span className="font-medium">{selectedOrder.completedAt ? new Date(selectedOrder.completedAt).toLocaleString('id-ID') : '-'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
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
                className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-line/50 focus:outline-none focus:ring-2 focus:ring-beacon/70"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                onClick={handleSave} 
                disabled={isSubmitting}
                className="rounded-lg bg-pine-dark px-5 py-2.5 text-sm font-semibold text-paper shadow-sm transition-colors hover:bg-pine focus:outline-none focus:ring-2 focus:ring-beacon/70 disabled:cursor-wait disabled:opacity-50"
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

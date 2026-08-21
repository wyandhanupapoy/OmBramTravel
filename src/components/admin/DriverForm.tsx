"use client";
import { useState } from "react";
import { createDriver } from "@/app/actions/driver";

type DriverFormData = {
  id?: string;
  name: string;
  phone: string;
  licenseNo: string;
  email: string;
  vehicle?: { id: string; name: string; plate: string; type: string; capacity: number } | null;
};

export function DriverForm({ initialDriver, action = createDriver }: { initialDriver?: DriverFormData; action?: typeof createDriver }) {
  const [loading, setLoading] = useState(false);

  return (
    <form action={action} onSubmit={() => setLoading(true)} className="space-y-10">
      {initialDriver && <><input type="hidden" name="driverId" value={initialDriver.id} /><input type="hidden" name="vehicleId" value={initialDriver.vehicle?.id || ""} /></>}
      
      {/* Biodata Driver */}
      <div className="bg-card border border-line rounded p-8">
        <h2 className="font-display text-xl text-pine-dark mb-6 border-b border-line pb-3">1. Biodata Driver</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1.5">Nama Lengkap</label>
            <input name="name" required defaultValue={initialDriver?.name} placeholder="Nama sesuai KTP/SIM" className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">No. Telepon / WhatsApp</label>
            <input name="phone" required defaultValue={initialDriver?.phone} placeholder="08..." className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Nomor SIM</label>
            <input name="licenseNo" required defaultValue={initialDriver?.licenseNo} className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine font-mono" />
          </div>
        </div>
      </div>

      {/* Akses Login Aplikasi Driver */}
      <div className="bg-card border border-line rounded p-8">
        <h2 className="font-display text-xl text-pine-dark mb-6 border-b border-line pb-3">2. Akun Login PWA (Aplikasi Supir)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email Login</label>
            <input name="email" type="email" required defaultValue={initialDriver?.email} placeholder="driver@ombram.com" className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input name="password" type="password" required={!initialDriver} placeholder={initialDriver ? "Kosongkan jika tidak diubah" : undefined} className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine" />
          </div>
        </div>
      </div>

      {/* Kendaraan */}
      <div className="bg-card border border-line rounded p-8">
        <h2 className="font-display text-xl text-pine-dark mb-6 border-b border-line pb-3">3. Kendaraan Utama</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1.5">Merek & Tipe</label>
            <input name="vehicleName" required defaultValue={initialDriver?.vehicle?.name} placeholder="Toyota Hiace / Innova" className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Plat Nomor</label>
            <input name="vehiclePlate" required defaultValue={initialDriver?.vehicle?.plate} placeholder="D 1234 ABC" className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine font-mono uppercase" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Jenis Mobil</label>
            <select name="vehicleType" defaultValue={initialDriver?.vehicle?.type || "Minivan"} className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine">
              <option value="Minivan">Minivan</option>
              <option value="MPV">MPV</option>
              <option value="SUV">SUV</option>
              <option value="Minibus">Minibus</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Kapasitas</label>
            <input name="vehicleCapacity" type="number" defaultValue={initialDriver?.vehicle?.capacity || 7} required className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine font-mono" />
          </div>
        </div>
      </div>

      <div className="sticky bottom-4 flex justify-end gap-4">
        <button type="submit" disabled={loading} className="rounded-lg bg-pine-dark px-8 py-4 font-display text-sm font-semibold uppercase tracking-wide text-paper shadow-lg transition-all hover:-translate-y-0.5 hover:bg-pine focus:outline-none focus:ring-2 focus:ring-beacon/70 active:translate-y-0 disabled:cursor-wait disabled:opacity-50 disabled:transform-none">
          {loading ? "Menyimpan..." : initialDriver ? "Simpan Perubahan" : "Simpan Driver"}
        </button>
      </div>

    </form>
  );
}

"use client";
import { useState } from "react";
import { createDriver } from "@/app/actions/driver";

export function DriverForm() {
  const [loading, setLoading] = useState(false);

  return (
    <form action={createDriver} onSubmit={() => setLoading(true)} className="space-y-10">
      
      {/* Biodata Driver */}
      <div className="bg-card border border-line rounded p-8">
        <h2 className="font-display text-xl text-pine-dark mb-6 border-b border-line pb-3">1. Biodata Driver</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1.5">Nama Lengkap</label>
            <input name="name" required placeholder="Nama sesuai KTP/SIM" className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">No. Telepon / WhatsApp</label>
            <input name="phone" required placeholder="08..." className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Nomor SIM</label>
            <input name="licenseNo" required className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine font-mono" />
          </div>
        </div>
      </div>

      {/* Akses Login Aplikasi Driver */}
      <div className="bg-card border border-line rounded p-8">
        <h2 className="font-display text-xl text-pine-dark mb-6 border-b border-line pb-3">2. Akun Login PWA (Aplikasi Supir)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email Login</label>
            <input name="email" type="email" required placeholder="driver@ombram.com" className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input name="password" type="password" required className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine" />
          </div>
        </div>
      </div>

      {/* Kendaraan */}
      <div className="bg-card border border-line rounded p-8">
        <h2 className="font-display text-xl text-pine-dark mb-6 border-b border-line pb-3">3. Kendaraan Utama</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1.5">Merek & Tipe</label>
            <input name="vehicleName" required placeholder="Toyota Hiace / Innova" className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Plat Nomor</label>
            <input name="vehiclePlate" required placeholder="D 1234 ABC" className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine font-mono uppercase" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Jenis Mobil</label>
            <select name="vehicleType" className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine">
              <option value="Minivan">Minivan</option>
              <option value="MPV">MPV</option>
              <option value="SUV">SUV</option>
              <option value="Minibus">Minibus</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Kapasitas</label>
            <input name="vehicleCapacity" type="number" defaultValue="7" required className="w-full border border-line bg-transparent rounded px-4 py-2.5 focus:border-pine font-mono" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 sticky bottom-4">
        <button type="submit" disabled={loading} className="font-display uppercase tracking-wide text-sm font-semibold px-8 py-4 rounded bg-pine-dark text-paper hover:-translate-y-0.5 transition-transform shadow-lg disabled:opacity-50 disabled:transform-none">
          {loading ? "Menyimpan..." : "Simpan Driver"}
        </button>
      </div>

    </form>
  );
}

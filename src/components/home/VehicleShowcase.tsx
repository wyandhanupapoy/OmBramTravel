import Image from "next/image";

const vehicles = [
  { name: "Travel Executive", type: "Toyota Hiace / Minibus", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=1200&h=800&fit=crop" },
  { name: "MPV Family", type: "Toyota Innova / Family", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&h=800&fit=crop" },
  { name: "Sedan Comfort", type: "Private city transfer", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=800&fit=crop" },
  { name: "SUV Adventure", type: "Pegunungan & luar kota", image: "https://images.unsplash.com/photo-1511919884226-fd3cd81c7b3e?w=1200&h=800&fit=crop" }
];

export function VehicleShowcase() {
  return (
    <section className="bg-card border-y border-line py-20">
      <div className="mx-auto max-w-[1180px] px-7">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-rust">Armada Om Bram</span>
            <h2 className="mt-3 max-w-xl font-display text-[clamp(28px,3.4vw,42px)] uppercase leading-tight text-pine-dark">Pilih kendaraan sesuai cara Anda bepergian.</h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft">Dari city transfer yang praktis sampai perjalanan keluarga ke pegunungan Bandung Raya.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {vehicles.map((vehicle) => (
            <div key={vehicle.name} className="group overflow-hidden rounded-xl border border-line bg-white">
              <div className="relative aspect-[4/3] overflow-hidden bg-line">
                <Image src={vehicle.image} alt={`${vehicle.name} - ${vehicle.type}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg text-pine-dark">{vehicle.name}</h3>
                <p className="mt-1 text-xs text-ink-soft">{vehicle.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

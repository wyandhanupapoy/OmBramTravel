"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-full md:w-64 bg-pine-dark text-paper p-6 shrink-0 flex flex-col">
      <div className="mb-10">
        <h2 className="font-display text-2xl text-beacon tracking-wide uppercase">Om Bram</h2>
        <p className="text-sm text-white/50 font-mono mt-1">Admin Portal</p>
      </div>
      <nav className="flex flex-col gap-2 flex-1">
        <Link href="/admin" className="px-4 py-3 rounded bg-white/5 hover:bg-white/10 transition-colors">Dashboard</Link>
        <Link href="/admin/orders" className="px-4 py-3 rounded hover:bg-white/5 transition-colors">Pesanan</Link>
        <Link href="/admin/tours" className="px-4 py-3 rounded hover:bg-white/5 transition-colors">Kelola Tour</Link>
        <Link href="/admin/drivers" className="px-4 py-3 rounded hover:bg-white/5 transition-colors">Tim Driver</Link>
      </nav>
      <div className="mt-auto pt-6 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded hover:bg-rust hover:text-white transition-colors text-white/60"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

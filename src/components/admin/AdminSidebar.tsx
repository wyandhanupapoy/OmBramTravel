"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navigation = [
  { href: "/admin", label: "Dashboard", match: (path: string) => path === "/admin" },
  { href: "/admin/orders", label: "Pesanan", match: (path: string) => path.startsWith("/admin/orders") },
  { href: "/admin/tours", label: "Kelola Tour", match: (path: string) => path.startsWith("/admin/tours") },
  { href: "/admin/drivers", label: "Tim Driver", match: (path: string) => path.startsWith("/admin/drivers") },
  { href: "/admin/promo", label: "Promo & Diskon", match: (path: string) => path.startsWith("/admin/promo") },
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
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
      <nav className="flex flex-col gap-2 flex-1" aria-label="Navigasi admin">
        {navigation.map((item) => {
          const isActive = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`group relative flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive ? "bg-beacon text-pine-dark shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
            >
              <span>{item.label}</span>
              <span className={`h-1.5 w-1.5 rounded-full transition-colors ${isActive ? "bg-pine-dark" : "bg-transparent group-hover:bg-beacon"}`} />
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6 border-t border-white/10">
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-white/60 transition-colors hover:bg-rust hover:text-white disabled:cursor-wait disabled:opacity-50"
        >
          {isLoggingOut ? "Keluar..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}

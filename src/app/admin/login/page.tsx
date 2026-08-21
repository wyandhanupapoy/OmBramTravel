"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        window.location.href = "/admin";
      } else {
        const data = await res.json();
        setError(data.error || "Login gagal");
        setLoading(false);
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6">
      <div className="bg-card border border-line rounded p-10 max-w-[400px] w-full text-center">
        <h1 className="font-display uppercase tracking-tight text-3xl text-pine-dark mb-2">Om Bram</h1>
        <p className="text-ink-soft mb-8">Login Portal Admin</p>

        {error && (
          <div className="bg-rust/10 border border-rust/20 text-rust p-3 rounded text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <input 
            type="password" 
            placeholder="Password Admin" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-line bg-transparent rounded px-4 py-3 focus:outline-none focus:border-pine text-center tracking-widest"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-pine-dark px-6 py-4 font-display text-sm font-semibold uppercase tracking-wide text-paper shadow-lg transition-all hover:-translate-y-0.5 hover:bg-pine focus:outline-none focus:ring-2 focus:ring-beacon/70 active:translate-y-0 disabled:cursor-wait disabled:opacity-50 disabled:transform-none"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}

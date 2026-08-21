"use client";
import { useState } from "react";

export default function DriverLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/driver/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        window.location.href = "/driver";
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
    <div className="min-h-screen bg-pine-dark flex items-center justify-center p-6">
      <div className="bg-card rounded-xl p-8 max-w-[360px] w-full text-center shadow-2xl">
        <div className="w-16 h-16 bg-beacon rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#123024" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </div>
        
        <h1 className="font-display uppercase tracking-tight text-2xl text-pine-dark mb-2">Driver App</h1>
        <p className="text-ink-soft text-sm mb-8">Masuk untuk melihat jadwal penjemputan.</p>

        {error && (
          <div className="bg-rust/10 border border-rust/20 text-rust p-3 rounded text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="email" 
              required
              placeholder="Email Driver" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-line bg-transparent rounded-lg px-4 py-3 focus:outline-none focus:border-pine"
            />
          </div>
          <div>
            <input 
              type="password" 
              required
              placeholder="Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-line bg-transparent rounded-lg px-4 py-3 focus:outline-none focus:border-pine"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 flex justify-center items-center font-display uppercase tracking-wide text-sm font-semibold px-6 py-4 rounded-lg bg-beacon text-pine-dark hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:transform-none"
          >
            {loading ? "Mengecek..." : "Mulai Tugas"}
          </button>
        </form>
      </div>
    </div>
  );
}

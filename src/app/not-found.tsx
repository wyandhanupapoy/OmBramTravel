import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px" }}>
      <h1 style={{ fontSize: "3rem", margin: "0 0 10px", color: "#1F4D3B" }}>404</h1>
      <p style={{ fontSize: "1.2rem", margin: "0 0 30px" }}>Halaman yang Anda cari tidak ditemukan.</p>
      <Link 
        href="/"
        style={{ padding: "12px 24px", backgroundColor: "#F2A93C", color: "#123024", textDecoration: "none", borderRadius: "4px", fontWeight: "bold" }}
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}

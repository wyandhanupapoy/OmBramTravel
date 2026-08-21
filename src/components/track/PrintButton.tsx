"use client";

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="print:hidden text-xs font-semibold uppercase tracking-wide bg-pine-dark text-paper px-4 py-2 rounded hover:bg-pine transition-colors flex items-center gap-2 cursor-pointer"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
      Cetak Invoice
    </button>
  );
}

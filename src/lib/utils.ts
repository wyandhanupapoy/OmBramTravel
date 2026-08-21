import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOrderCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `OB-${num}`;
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getWhatsAppUrl(message?: string): string {
  const phone = process.env.NEXT_PUBLIC_WA_NUMBER || "6283870405395";
  const text = encodeURIComponent(
    message || "Halo Om Bram, saya mau tanya soal layanan tour Bandung"
  );
  return `https://wa.me/${phone}?text=${text}`;
}

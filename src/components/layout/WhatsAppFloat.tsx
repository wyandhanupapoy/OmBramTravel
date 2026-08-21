"use client";
import { getWhatsAppUrl } from "@/lib/utils";

export function WhatsAppFloat() {
  return (
    <a
      href={getWhatsAppUrl()}
      className="wa-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
        <path d="M17.5 14.4l-2.3-1.1a.8.8 0 0 0-.8.1l-.7.7a.8.8 0 0 1-.9.2 8.5 8.5 0 0 1-3.1-3.1.8.8 0 0 1 .2-.9l.7-.7a.8.8 0 0 0 .1-.8L9.6 6.5a.8.8 0 0 0-.7-.5H7.7A1.6 1.6 0 0 0 6 7.7a9.5 9.5 0 0 0 10.3 10.3 1.6 1.6 0 0 0 1.7-1.7v-1.2a.8.8 0 0 0-.5-.7z" />
        <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.3a.5.5 0 0 0 .6.6l4.3-1.3A10 10 0 1 0 12 2z" />
      </svg>
    </a>
  );
}

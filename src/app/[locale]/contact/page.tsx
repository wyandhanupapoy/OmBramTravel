import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getWhatsAppUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  return { title: `${nav("contact")} | ${t("title")}` };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <div className="py-24 max-w-[800px] mx-auto px-7">
      <span className="font-mono text-xs tracking-[0.16em] uppercase font-medium text-beacon mb-4 block text-center">
        {t("eyebrow")}
      </span>
      <h1 className="font-display uppercase tracking-tight text-[clamp(32px,4vw,48px)] leading-[1.08] text-pine-dark mb-4 text-center">
        {t("title")}
      </h1>
      <p className="text-lg text-ink-soft text-center mb-14">{t("subtitle")}</p>

      <div className="bg-card border border-line rounded p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-6 mb-10 pb-10 border-b border-line">
          <a 
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer" 
            className="flex-1 flex justify-center items-center gap-3 font-display uppercase tracking-wide text-sm font-semibold px-8 py-5 rounded bg-[#25D366] text-white no-underline hover:-translate-y-0.5 transition-transform"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4l-2.3-1.1a.8.8 0 0 0-.8.1l-.7.7a.8.8 0 0 1-.9.2 8.5 8.5 0 0 1-3.1-3.1.8.8 0 0 1 .2-.9l.7-.7a.8.8 0 0 0 .1-.8L9.6 6.5a.8.8 0 0 0-.7-.5H7.7A1.6 1.6 0 0 0 6 7.7a9.5 9.5 0 0 0 10.3 10.3 1.6 1.6 0 0 0 1.7-1.7v-1.2a.8.8 0 0 0-.5-.7z"/></svg>
            {t("whatsappBtn")}
          </a>
          <a 
            href="mailto:contact@ombramtravel.com"
            className="flex-1 flex justify-center items-center gap-3 font-display uppercase tracking-wide text-sm font-semibold px-8 py-5 rounded bg-pine-dark text-paper no-underline hover:-translate-y-0.5 transition-transform"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            {t("emailBtn")}
          </a>
        </div>
        
        <div className="text-center font-mono text-sm text-ink-soft">
          <p className="mb-2"><strong>OM BRAM TRAVEL</strong></p>
          <p>{t("address")}</p>
        </div>
      </div>
    </div>
  );
}

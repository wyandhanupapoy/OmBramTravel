import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  return { title: `${nav("faq")} | ${t("title")}` };
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
  ];

  return (
    <div className="py-24 max-w-[800px] mx-auto px-7">
      <span className="font-mono text-xs tracking-[0.16em] uppercase font-medium text-beacon mb-4 block">
        {t("eyebrow")}
      </span>
      <h1 className="font-display uppercase tracking-tight text-[clamp(32px,4vw,48px)] leading-[1.08] text-pine-dark mb-14">
        {t("title")}
      </h1>

      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-card border border-line rounded p-7">
            <h3 className="font-display text-xl text-pine-dark mb-3">{faq.q}</h3>
            <p className="text-ink-soft leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

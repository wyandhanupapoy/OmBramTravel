import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
  };
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}

function HeroSection() {
  const t = useTranslations("hero");
  const nav = useTranslations("nav");
  const locale = "id"; // Will be dynamic from context

  return (
    <section className="relative overflow-hidden bg-pine text-paper py-24 lg:py-32">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            "repeating-linear-gradient(0deg, rgba(236,230,214,0.05) 0px 1px, transparent 1px 64px)",
            "repeating-linear-gradient(90deg, rgba(236,230,214,0.05) 0px 1px, transparent 1px 64px)",
          ].join(","),
        }}
      />
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_85%_-10%,rgba(242,169,60,0.16),transparent_55%)]" />

      <div className="relative max-w-[1180px] mx-auto px-7">
        <span className="font-mono text-xs tracking-[0.16em] uppercase font-medium text-beacon mb-5 block">
          {t("eyebrow")}
        </span>
        <h1 className="font-display uppercase tracking-tight text-[clamp(38px,5.4vw,64px)] leading-[1.08] mb-6 max-w-[680px]">
          {t.rich("title", {
            em: (chunks) => <em className="not-italic text-beacon">{chunks}</em>
          })}
        </h1>
        <p className="text-lg text-white/80 max-w-[520px] mb-9">
          {t("subtitle")}
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 font-display uppercase tracking-wide text-sm font-semibold px-7 py-4 rounded bg-beacon text-pine-dark no-underline hover:-translate-y-0.5 transition-transform"
          >
            {t("cta1")}
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 font-display uppercase tracking-wide text-sm font-semibold px-7 py-4 rounded bg-transparent text-paper border border-white/40 no-underline hover:border-white transition-colors"
          >
            {t("cta2")}
          </a>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const t = useTranslations("trust");
  const stats = [
    { num: "1.240+", label: t("trips") },
    { num: "150+", label: t("drivers") },
    { num: "98%", label: t("onTime") },
    { num: "24/7", label: t("tracking") },
  ];

  return (
    <div className="bg-pine-dark border-t border-white/10">
      <div className="max-w-[1180px] mx-auto px-7 grid grid-cols-2 lg:grid-cols-4 py-7">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`text-center text-paper ${
              i > 0 ? "border-l border-white/15" : ""
            }`}
          >
            <span className="font-mono font-semibold text-[22px] text-beacon block">
              {s.num}
            </span>
            <span className="font-display text-[11px] tracking-wider uppercase text-white/70 mt-1 block">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesSection() {
  const t = useTranslations("services");

  const zones = [
    {
      key: "north" as const,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.3" />
        </svg>
      ),
    },
    {
      key: "south" as const,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 21l4-11 5-5 8 8-5 5-11 4z" />
          <path d="M13 6l5 5" />
        </svg>
      ),
    },
    {
      key: "city" as const,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="17" rx="1.5" />
          <path d="M3 9h18M8 2v4M16 2v4" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-[1180px] mx-auto px-7">
        <div className="flex flex-wrap justify-between items-end mb-13 gap-6">
          <div>
            <span className="font-mono text-xs tracking-[0.16em] uppercase font-medium text-rust mb-3.5 block">
              {t("eyebrow")}
            </span>
            <h2 className="font-display uppercase tracking-tight text-[clamp(28px,3.4vw,40px)] leading-[1.08] text-pine-dark max-w-[560px]">
              {t("title")}
            </h2>
          </div>
          <p className="text-ink-soft max-w-[360px] text-[15px]">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {zones.map((zone) => (
            <div
              key={zone.key}
              className="bg-card border border-line rounded p-8 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-pine mb-5">{zone.icon}</div>
              <h3 className="font-display text-lg text-pine-dark mb-2.5">
                {t(`${zone.key}.name`)}
              </h3>
              <p className="text-ink-soft text-[15px]">
                {t(`${zone.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const t = useTranslations("howItWorks");

  const steps = [
    {
      num: "01",
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="4" width="18" height="17" rx="1.5" />
          <path d="M3 9h18M8 2v4M16 2v4" />
        </svg>
      ),
    },
    {
      num: "02",
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="2" y="10" width="15" height="7" rx="1" />
          <path d="M17 13h3.2l1.8 2.6V17h-5" />
          <circle cx="6.5" cy="19" r="1.8" />
          <circle cx="16.5" cy="19" r="1.8" />
        </svg>
      ),
    },
    {
      num: "03",
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.3" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 bg-card border-y border-line"
    >
      <div className="max-w-[1180px] mx-auto px-7">
        <div className="flex flex-wrap justify-between items-end mb-13 gap-6">
          <div>
            <span className="font-mono text-xs tracking-[0.16em] uppercase font-medium text-rust mb-3.5 block">
              {t("eyebrow")}
            </span>
            <h2 className="font-display uppercase tracking-tight text-[clamp(28px,3.4vw,40px)] leading-[1.08] text-pine-dark max-w-[560px]">
              {t("title")}
            </h2>
          </div>
          <p className="text-ink-soft max-w-[360px] text-[15px]">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line-strong border border-line-strong">
          {steps.map((step, i) => (
            <div key={i} className="bg-card p-9">
              <span className="font-mono text-[13px] text-rust font-semibold block mb-5">
                {step.num}
              </span>
              <div className="text-pine mb-5">{step.icon}</div>
              <h3 className="font-display text-[19px] text-pine-dark mb-3">
                {t(`step${i + 1}.title`)}
              </h3>
              <p className="text-ink-soft text-[15px]">
                {t(`step${i + 1}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const t = useTranslations("testimonials");

  const reviews = [
    {
      text: '"Yang bikin tenang itu bisa lihat mobilnya lagi di mana. Nggak perlu telepon-telepon."',
      name: "Dewi A.",
      loc: "Surabaya",
    },
    {
      text: '"Driver dan armadanya jelas sejak awal, nggak ada acara ganti-ganti mendadak di hari-H."',
      name: "Rangga P.",
      loc: "Jakarta",
    },
    {
      text: '"Great tour! The driver was very knowledgeable and the vehicle was comfortable."',
      name: "Michael T.",
      loc: "Singapore",
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-[1180px] mx-auto px-7">
        <div className="mb-13">
          <span className="font-mono text-xs tracking-[0.16em] uppercase font-medium text-rust mb-3.5 block">
            {t("eyebrow")}
          </span>
          <h2 className="font-display uppercase tracking-tight text-[clamp(28px,3.4vw,40px)] leading-[1.08] text-pine-dark max-w-[560px]">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-card border border-line rounded p-8"
            >
              <p className="text-[17px] italic text-ink mb-5 leading-relaxed">
                {r.text}
              </p>
              <span className="font-display text-[13px] uppercase tracking-wide text-pine-dark">
                {r.name}
              </span>
              <br />
              <span className="font-mono text-xs text-ink-soft">
                {r.loc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const t = useTranslations("cta");

  return (
    <section className="bg-beacon text-pine-dark py-0">
      <div className="max-w-[1180px] mx-auto px-7 py-14 flex flex-wrap justify-between items-center gap-8">
        <div>
          <h2 className="font-display uppercase tracking-tight text-[clamp(24px,3vw,32px)] leading-[1.08] max-w-[420px] mb-2">
            {t("title")}
          </h2>
          <p className="text-pine-dark/80 max-w-[400px]">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 font-display uppercase tracking-wide text-sm font-semibold px-7 py-4 rounded bg-pine text-paper no-underline hover:-translate-y-0.5 transition-transform"
          >
            {t("button")}
          </Link>
        </div>
      </div>
    </section>
  );
}

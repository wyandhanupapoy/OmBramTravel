import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  return { title: `${nav("about")} | ${t("title")}` };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <div className="py-24 max-w-[1180px] mx-auto px-7">
      <span className="font-mono text-xs tracking-[0.16em] uppercase font-medium text-beacon mb-4 block">
        {t("eyebrow")}
      </span>
      <h1 className="font-display uppercase tracking-tight text-[clamp(32px,4vw,48px)] leading-[1.08] text-pine-dark mb-10 max-w-[700px]">
        {t("title")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-20">
        <div className="space-y-6 text-lg text-ink-soft">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
        </div>
        <div className="relative aspect-square md:aspect-auto md:h-full bg-line rounded overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=800&fit=crop" 
            alt="Bandung Tour" 
            fill 
            className="object-cover"
          />
        </div>
      </div>

      <div className="bg-pine-dark text-paper p-10 lg:p-16 rounded text-center">
        <h2 className="font-display uppercase tracking-tight text-[32px] text-beacon mb-6">
          {t("missionTitle")}
        </h2>
        <p className="text-xl lg:text-2xl font-body leading-relaxed max-w-[800px] mx-auto">
          "{t("mission")}"
        </p>
      </div>
    </div>
  );
}

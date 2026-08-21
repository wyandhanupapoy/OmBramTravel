import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { articles } from "@/lib/articles";
import { articleUi, getLocalizedArticle } from "@/lib/articleTranslations";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "en" ? "Bandung Travel Articles | Om Bram" : "Artikel Wisata Bandung | Om Bram", description: "Panduan wisata, itinerary, dan tips perjalanan Bandung dari Om Bram." };
}

export default function ArticlesPage({ params }: { params: Promise<{ locale: string }> }) {
  return <ArticlesContent params={params} />;
}

async function ArticlesContent({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const ui = articleUi[locale as keyof typeof articleUi] || articleUi.id;
  return (
    <main className="bg-paper py-20">
      <div className="mx-auto max-w-[1180px] px-7">
        <header className="mb-12 max-w-2xl">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-rust">{ui.journal}</span>
          <h1 className="mt-4 font-display text-[clamp(34px,4vw,52px)] uppercase leading-tight text-pine-dark">{ui.heading}</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{ui.intro}</p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <Link key={article.slug} href={`/${locale}/articles/${article.slug}`} className="group overflow-hidden rounded-xl border border-line bg-card no-underline transition-all hover:-translate-y-1 hover:shadow-lg">
              {(() => { const localized = getLocalizedArticle(article, locale); return <><div className="relative aspect-[16/9] overflow-hidden bg-line"><Image src={localized.image} alt={localized.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /></div><div className="p-6"><div className="flex justify-between gap-3 font-mono text-[10px] uppercase tracking-wider text-rust"><span>{localized.category}</span><span>{localized.readTime}</span></div><h2 className="mt-3 font-display text-2xl leading-tight text-pine-dark group-hover:text-rust">{localized.title}</h2><p className="mt-3 leading-relaxed text-ink-soft">{localized.excerpt}</p><span className="mt-5 inline-block font-display text-sm font-semibold uppercase tracking-wide text-pine-dark">{ui.read} →</span></div></>; })()}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

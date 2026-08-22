import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { articles } from "@/lib/articles";
import { articleUi, getLocalizedArticle } from "@/lib/articleTranslations";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  const localizedArticle = article && getLocalizedArticle(article, locale);
  return localizedArticle ? { 
    title: `${localizedArticle.title} | Om Bram Travel`, 
    description: localizedArticle.excerpt,
    openGraph: {
      title: localizedArticle.title,
      description: localizedArticle.excerpt,
      images: [localizedArticle.image],
      url: `https://ombramtravel.com/${locale}/articles/${slug}`
    },
    alternates: {
      canonical: `/${locale}/articles/${slug}`
    }
  } : {};
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const ui = articleUi[locale as keyof typeof articleUi] || articleUi.id;
  const localizedArticle = getLocalizedArticle(article, locale);

  const relatedArticles = articles.filter((item) => item.slug !== article.slug).slice(0, 2);
  const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: localizedArticle.title, description: localizedArticle.excerpt, image: localizedArticle.image, datePublished: localizedArticle.publishedAt, author: { "@type": "Organization", name: "Om Bram Travel" } };

  return (
    <main className="bg-paper pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <BreadcrumbSchema items={[
        { name: "Home", item: `https://ombramtravel.com/${locale}` },
        { name: "Blog", item: `https://ombramtravel.com/${locale}/articles` },
        { name: localizedArticle.title, item: `https://ombramtravel.com/${locale}/articles/${slug}` }
      ]} />
      <div className="relative h-[42vh] min-h-[320px] w-full"><Image src={localizedArticle.image} alt={localizedArticle.title} fill priority sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-pine-dark/60" /><div className="relative mx-auto flex h-full max-w-[900px] flex-col justify-end px-7 pb-12 text-paper"><span className="font-mono text-xs uppercase tracking-[0.16em] text-beacon">{localizedArticle.category} · {localizedArticle.readTime}</span><h1 className="mt-4 max-w-3xl font-display text-[clamp(34px,5vw,62px)] uppercase leading-[1.03]">{localizedArticle.title}</h1></div></div>
      <article className="mx-auto max-w-[780px] px-7 pt-12"><p className="border-l-4 border-beacon pl-5 text-xl leading-relaxed text-pine-dark">{localizedArticle.excerpt}</p>{localizedArticle.paragraphs.map((paragraph) => <p key={paragraph} className="mt-7 text-lg leading-[1.8] text-ink">{paragraph}</p>)}<div className="my-10 rounded-xl border border-line bg-card p-6"><h2 className="font-display text-2xl uppercase text-pine-dark">{ui.tips}</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-ink-soft">{localizedArticle.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul></div><div className="rounded-xl bg-pine-dark p-7 text-paper"><h2 className="font-display text-2xl uppercase text-beacon">{ui.cta}</h2><p className="mt-2 text-white/75">{ui.ctaText}</p><Link href={`/${locale}/tours`} className="mt-5 inline-flex rounded-lg bg-beacon px-5 py-3 font-display text-sm font-semibold uppercase tracking-wide text-pine-dark no-underline">{ui.ctaButton}</Link></div></article>
      <section className="mx-auto mt-16 max-w-[780px] px-7"><h2 className="font-display text-2xl uppercase text-pine-dark">{ui.related}</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{relatedArticles.map((related) => { const localizedRelated = getLocalizedArticle(related, locale); return <Link key={related.slug} href={`/${locale}/articles/${related.slug}`} className="rounded-xl border border-line bg-card p-5 no-underline hover:border-pine"><span className="font-mono text-[10px] uppercase text-rust">{localizedRelated.category}</span><h3 className="mt-2 font-display text-xl text-pine-dark">{localizedRelated.title}</h3></Link>; })}</div></section>
    </main>
  );
}

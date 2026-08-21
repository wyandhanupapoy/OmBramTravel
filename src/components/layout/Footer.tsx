import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="bg-pine-dark text-white/75 pt-18 pb-7">
      <div className="max-w-[1180px] mx-auto px-7">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href={`/${locale}`}
              className="font-display text-[22px] font-bold tracking-wider text-paper no-underline flex flex-col leading-none mb-4"
            >
              OM BRAM
              <span className="font-mono text-[9px] tracking-[0.22em] font-normal text-beacon uppercase mt-1">
                City Tour Bandung
              </span>
            </Link>
            <p className="text-sm max-w-[280px] text-white/60">
              {t("tagline")}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs tracking-widest text-beacon mb-4 font-display">
              {t("product")}
            </h4>
            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              <li><Link href={`/${locale}/tours`} className="text-sm text-white/75 no-underline hover:text-white">{t("about")}</Link></li>
              <li><Link href={`/${locale}/faq`} className="text-sm text-white/75 no-underline hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs tracking-widest text-beacon mb-4 font-display">
              {t("company")}
            </h4>
            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              <li><Link href={`/${locale}/about`} className="text-sm text-white/75 no-underline hover:text-white">{t("about")}</Link></li>
              <li><Link href={`/${locale}/contact`} className="text-sm text-white/75 no-underline hover:text-white">{t("partner")}</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs tracking-widest text-beacon mb-4 font-display">
              {t("help")}
            </h4>
            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              <li><Link href={`/${locale}/contact`} className="text-sm text-white/75 no-underline hover:text-white">{t("helpCenter")}</Link></li>
              <li><Link href={`/${locale}/faq`} className="text-sm text-white/75 no-underline hover:text-white">{t("terms")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center pt-6 border-t border-white/10 font-mono text-xs text-white/40 gap-3">
          <span>{t("copyright")}</span>
        </div>
      </div>
    </footer>
  );
}

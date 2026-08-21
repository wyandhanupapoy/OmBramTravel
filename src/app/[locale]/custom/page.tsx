import { CustomTourBuilder } from "@/components/booking/CustomTourBuilder";
import { getTranslations } from "next-intl/server";

export default async function CustomTourPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "customTour" });
  
  return (
    <div className="bg-paper min-h-screen py-16">
      <div className="max-w-[1200px] mx-auto px-7">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-display text-4xl text-pine-dark mb-4">{t("pageTitle")}</h1>
          <p className="text-ink-soft">{t("pageDesc")}</p>
        </div>
        
        <CustomTourBuilder locale={locale} />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// The layout's canonical URL describes the home page. A missing page must not
// claim it, so it is cleared here.
export const metadata: Metadata = {
  alternates: { canonical: null },
};

// Rendered inside the locale layout, so it keeps the navbar, theme and footer.
// Unknown paths reach it through [...rest]/page.tsx.
export default function NotFound() {
  const t = useTranslations("Common.NotFound");

  return (
    <section className="section-shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="section-label">{t("eyebrow")}</p>
      <h1 className="font-display text-gradient-brand mt-4 pb-1 text-4xl font-semibold md:text-6xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md text-base text-muted-foreground md:text-lg">
        {t("description")}
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        <ArrowLeft className="btn-icon h-4 w-4" aria-hidden />
        {t("back")}
      </Link>
    </section>
  );
}

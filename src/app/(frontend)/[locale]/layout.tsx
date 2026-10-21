import { Outfit, Source_Sans_3 } from "next/font/google";

import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import ThemeProvider from "@/components/ThemeProvider";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface MetadataParams {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: MetadataParams) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "Common.Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
    },
  };
}

interface LayoutProps {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}

export default async function LocaleLayout({ params, children }: LayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering for this locale segment and everything below it
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="LgXbQ8fD2jVE3_t2QErjCrFi6SxC8NEYaRC-jGwXLgU"
        />
      </head>
      <body
        className={cn(outfit.variable, sourceSans.variable, "antialiased")}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale}>
            <div className="relative min-h-screen">
              <div
                className="pointer-events-none fixed inset-0 z-0 opacity-[0.25]"
                aria-hidden
              >
                <div className="absolute -left-1/4 top-0 h-[min(70vh,520px)] w-[min(70vw,520px)] rounded-full bg-brand-muted blur-3xl" />
                <div className="absolute bottom-0 right-0 h-[min(50vh,400px)] w-[min(60vw,480px)] rounded-full bg-brand-subtle blur-3xl" />
              </div>
              <Navbar />
              <main className="relative z-10 pt-[4.5rem] md:pt-24">
                {children}
              </main>
              <Footer />
              <BackToTopButton />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { AbstractIntlMessages } from "next-intl";
import { Plus_Jakarta_Sans, Source_Sans_3 } from "next/font/google";

import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import ScrollProgress from "@/components/ScrollProgress";
import ThemeProvider from "@/components/ThemeProvider";
import MotionProvider from "@/components/MotionProvider";
import { alternatesFor, localizedUrl, openGraphBase } from "@/lib/seo";

// Both fonts have Vietnamese glyphs (Outfit, the old display font, had none).
// `subsets` only picks the files to preload: the generated CSS lists every
// subset with its unicode-range, so /vi pages fetch the Vietnamese file on
// demand. Preloading it too would add files to every page.
//
// Both are variable fonts, loaded without a weight list: one file per subset
// covers every weight. A fixed weight list made Google Fonts answer Plus
// Jakarta Sans with /l/font?kit= URLs, which next/font cannot parse.
const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
});

/** Namespaces read by client components; the rest stays on the server */
function pickClientMessages(
  messages: AbstractIntlMessages,
): AbstractIntlMessages {
  const home = messages.HomePage as AbstractIntlMessages | undefined;
  return {
    Common: messages.Common,
    HomePage: { ContactSection: home?.ContactSection ?? {} },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface MetadataParams {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: MetadataParams): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "Common.Metadata" });
  const title = t("title");
  const description = t("description");

  return {
    // Child pages set a plain title; the template appends the site name.
    title: { default: title, template: `%s | ${t("siteName")}` },
    description,
    alternates: alternatesFor(locale),
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      title,
      description,
      url: localizedUrl(locale),
      ...openGraphBase(locale),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    verification: {
      google: "LgXbQ8fD2jVE3_t2QErjCrFi6SxC8NEYaRC-jGwXLgU",
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
  const t = await getTranslations("Common.a11y");
  const clientMessages = pickClientMessages(await getMessages());

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(displayFont.variable, sourceSans.variable, "antialiased")}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={clientMessages}>
            <MotionProvider>
              <a href="#main-content" className="skip-link">
                {t("skipToContent")}
              </a>
              <div className="relative min-h-screen">
                <div
                  className="pointer-events-none fixed inset-0 z-0 opacity-40"
                  aria-hidden
                >
                  <div className="absolute -left-1/4 top-0 h-[min(70vh,520px)] w-[min(70vw,520px)] rounded-full bg-brand/25 blur-3xl" />
                  <div className="absolute bottom-0 right-0 h-[min(50vh,400px)] w-[min(60vw,480px)] rounded-full bg-brand-light/20 blur-3xl" />
                </div>
                <ScrollProgress />
                <Navbar />
                <main
                  id="main-content"
                  tabIndex={-1}
                  className="relative z-10 pt-[4.5rem] outline-none md:pt-24"
                >
                  {children}
                </main>
                <Footer />
                <BackToTopButton />
              </div>
            </MotionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

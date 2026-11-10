import { SITE_URL } from "@/config/site";
import { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

/** Open Graph locale codes for each site locale */
export const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  vi: "vi_VN",
};

/** Absolute URL of `path` in `locale`. The default locale has no prefix (localePrefix: as-needed). */
export function localizedUrl(locale: string, path = ""): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${path}` || SITE_URL;
}

/** hreflang map for `path`: one entry per locale, plus x-default for the default locale */
export function languageAlternates(path = ""): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = localizedUrl(locale, path);
  }
  languages["x-default"] = localizedUrl(routing.defaultLocale, path);
  return languages;
}

/** Canonical URL and hreflang alternates for `path` in `locale` */
export function alternatesFor(locale: string, path = "") {
  return {
    canonical: localizedUrl(locale, path),
    languages: languageAlternates(path),
  };
}

/** Open Graph fields shared by every page in `locale` */
export function openGraphBase(locale: string) {
  const ogLocale = OG_LOCALES[locale as Locale] ?? OG_LOCALES.en;
  return {
    locale: ogLocale,
    alternateLocale: Object.values(OG_LOCALES).filter((l) => l !== ogLocale),
  };
}

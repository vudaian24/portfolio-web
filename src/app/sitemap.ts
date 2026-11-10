import type { MetadataRoute } from "next";
import { PROJECT_IDS } from "@/config/site";
import { routing } from "@/i18n/routing";
import { languageAlternates, localizedUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  // Every URL lists its translations, the sitemap form of hreflang.
  for (const locale of routing.locales) {
    routes.push({
      url: localizedUrl(locale),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: languageAlternates() },
    });

    for (const id of PROJECT_IDS) {
      const path = `/projects/${id}`;
      routes.push({
        url: localizedUrl(locale, path),
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages: languageAlternates(path) },
      });
    }
  }

  return routes;
}

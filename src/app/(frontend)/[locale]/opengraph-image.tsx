import { routing } from "@/i18n/routing";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/ogImage";

// Link preview for the home page (and any page without its own image)
export const alt = "Dai An — DevOps Engineer";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// One image per locale, rendered at build time like the pages
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: "DevOps Engineer · Cloud",
    title: "Dai An",
    subtitle: "Building and running the infrastructure that ships software",
    tags: ["Kubernetes", "Terraform", "AWS", "Argo CD", "GitHub Actions"],
  });
}

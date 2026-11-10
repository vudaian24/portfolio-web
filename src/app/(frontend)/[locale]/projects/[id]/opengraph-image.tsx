import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { isProjectId, PROJECTS } from "@/config/site";
import { routing } from "@/i18n/routing";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/ogImage";

// Link preview for a case study. The page sets its own openGraph, which stops
// it inheriting the home image, so each project gets one with its title.
export const alt = "Dai An — case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PROJECTS.map((p) => ({ locale, id: p.id })),
  );
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OpengraphImage({ params }: Props) {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);
  if (!isProjectId(id) || !project) notFound();
  // English strings for every locale: the image font has no Vietnamese glyphs.
  const t = await getTranslations({
    locale: routing.defaultLocale,
    namespace: "HomePage.Projects",
  });

  return renderOgImage({
    eyebrow: "Case study · Dai An",
    title: t(`items.${project.id}.title`),
    subtitle: t(`items.${project.id}.role`),
    tags: (project.tags ?? []).slice(0, 5),
  });
}

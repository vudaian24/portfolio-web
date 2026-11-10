import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  CaseStudyBlock,
  CaseStudyMotion,
} from "@/components/sections/CaseStudyMotion";
import { TechChip } from "@/components/ui/TechChip";
import { isProjectId, PROJECTS } from "@/config/site";
import { alternatesFor, localizedUrl, openGraphBase } from "@/lib/seo";
import { TAG_ICONS } from "@/lib/techIcons";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PROJECTS.map((p) => ({ locale, id: p.id })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isProjectId(id)) return {};
  const t = await getTranslations({ locale, namespace: "HomePage.Projects" });
  const tMeta = await getTranslations({ locale, namespace: "Common.Metadata" });
  const path = `/projects/${id}`;
  const title = t(`items.${id}.title`);
  const description = t(`items.${id}.summary`);

  return {
    title,
    description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      type: "article",
      siteName: tMeta("siteName"),
      title,
      description,
      url: localizedUrl(locale, path),
      ...openGraphBase(locale),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  if (!isProjectId(id)) notFound();

  const project = PROJECTS.find((p) => p.id === id)!;
  const t = await getTranslations("HomePage.CaseStudy");
  const tp = await getTranslations("HomePage.Projects");
  const bullets = tp.raw(`items.${id}.bullets`) as string[];

  return (
    <article className="section-shell py-12 md:py-16">
      <CaseStudyMotion>
        <CaseStudyBlock>
          <Link
            href={{ pathname: "/", hash: "projects" }}
            className="group inline-flex items-center gap-2 text-sm font-medium text-brand"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden
            />
            <span className="link-underline">{t("back")}</span>
          </Link>
        </CaseStudyBlock>
        <CaseStudyBlock>
          <h1 className="font-display text-gradient-brand mt-6 pb-1 text-3xl font-semibold md:text-5xl">
            {tp(`items.${id}.title`)}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            {tp(`items.${id}.summary`)}
          </p>
        </CaseStudyBlock>
        <CaseStudyBlock>
          <dl className="card-glow mt-8 grid gap-4 p-6 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wider text-text-muted">
                {t("role")}
              </dt>
              <dd className="mt-1 font-medium">{tp(`items.${id}.role`)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-text-muted">
                {t("period")}
              </dt>
              <dd className="mt-1 font-medium">{tp(`items.${id}.period`)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-text-muted">
                {t("team")}
              </dt>
              <dd className="mt-1 font-medium">{tp(`items.${id}.team`)}</dd>
            </div>
          </dl>
        </CaseStudyBlock>
        <CaseStudyBlock>
          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold">
              {t("approach")}
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground marker:text-brand">
              {bullets.map((b) => (
                <li key={b.slice(0, 32)}>{b}</li>
              ))}
            </ul>
          </section>
        </CaseStudyBlock>
        {project.tags?.length ? (
          <CaseStudyBlock>
            <section className="mt-12">
              <h2 className="font-display text-xl font-semibold">
                {t("stack")}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li key={tag}>
                    <TechChip label={tag} icons={TAG_ICONS[tag]} size="md" />
                  </li>
                ))}
              </ul>
            </section>
          </CaseStudyBlock>
        ) : null}
        <CaseStudyBlock>
          <div className="mt-12 flex flex-wrap gap-3">
            {project.href ? (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                {project.id === "portfolio" ? t("repo") : t("live")}
                <ArrowUpRight
                  className="btn-icon btn-icon-up h-4 w-4"
                  aria-hidden
                />
              </a>
            ) : (
              <p className="text-sm text-text-muted">{t("noPublicLink")}</p>
            )}
          </div>
        </CaseStudyBlock>
      </CaseStudyMotion>
    </article>
  );
}

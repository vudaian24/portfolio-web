"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { Variants } from "motion/react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeader } from "@/components/ui/Section";
import { EASE_OUT } from "@/lib/animation";
import { SECTION_IDS, projectAnchorId, type ProjectId } from "@/config/site";

const entryVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: EASE_OUT },
  }),
};

export type ProjectsContent = {
  eyebrow: string;
  title: string;
  description: string;
  approach: string;
  noPublicLink: string;
  viewCaseStudy: string;
  items: {
    id: ProjectId;
    href?: string;
    tags?: readonly string[];
    title: string;
    role: string;
    team: string;
    period: string;
    summary: string;
    bullets: string[];
    linkLabel: string;
  }[];
};

type ProjectsSectionClientProps = {
  content: ProjectsContent;
};

export default function ProjectsSectionClient({
  content,
}: ProjectsSectionClientProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Section id={SECTION_IDS.projects}>
      <SectionHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <div className="mt-14 flex flex-col gap-8">
        {content.items.map((project, index) => (
          <m.article
            key={project.id}
            id={projectAnchorId(project.id)}
            custom={index}
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={reduceMotion ? undefined : entryVariants}
            className="card-glow group scroll-mt-28 overflow-hidden p-6 md:p-10"
          >
            <div
              className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand-strong via-brand to-brand-light transition-transform duration-500 group-hover:scale-x-100"
              aria-hidden
            />
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex max-w-3xl gap-4 md:gap-6">
                <span
                  className="font-display text-gradient-brand hidden text-4xl font-semibold leading-none sm:block md:text-5xl"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-foreground transition-colors duration-300 group-hover:text-brand md:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground md:text-base">
                    {project.role} · {project.team} · {project.period}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {project.summary}
            </p>

            <h4 className="mt-8 text-xs font-semibold uppercase tracking-wider text-text-muted">
              {content.approach}
            </h4>
            <ul className="mt-4 grid max-w-4xl gap-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              {project.bullets.map((bullet) => (
                <li key={bullet.slice(0, 48)} className="flex gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-muted text-brand">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {project.tags?.length ? (
              <ul className="mt-7 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li key={tag}>
                    <span className="inline-flex items-center rounded-full border border-brand/20 bg-brand-subtle px-3 py-1 text-xs font-medium text-brand">
                      {tag}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
              <Link
                href={`/projects/${project.id}`}
                className="btn btn-primary btn-sm"
              >
                {content.viewCaseStudy}
                <ArrowRight className="btn-icon h-4 w-4" aria-hidden />
              </Link>
              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  {project.linkLabel}
                  <ArrowUpRight
                    className="btn-icon btn-icon-up h-4 w-4"
                    aria-hidden
                  />
                </a>
              ) : (
                <p className="text-sm font-medium text-text-muted">
                  {content.noPublicLink}
                </p>
              )}
            </div>
          </m.article>
        ))}
      </div>
    </Section>
  );
}

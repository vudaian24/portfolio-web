"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { Variants } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { EASE_OUT } from "@/lib/animation";
import { SECTION_IDS, projectAnchorId, type ProjectId } from "@/config/site";

const entryVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: EASE_OUT },
  }),
};

export type ProjectsContent = {
  eyebrow: string;
  title: string;
  description: string;
  approach: string;
  noPublicLink: string;
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

      <div className="mt-14 flex flex-col gap-16 md:gap-20">
        {content.items.map((project, index) => {
          const hasPublicLink = Boolean(project.href);

          return (
            <m.article
              key={project.id}
              id={projectAnchorId(project.id)}
              custom={index}
              initial={reduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              variants={reduceMotion ? undefined : entryVariants}
              className="scroll-mt-28 border-t border-border pt-10"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl">
                  <h3 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground md:text-base">
                    {project.role} · {project.team} · {project.period}
                  </p>
                </div>
                {hasPublicLink ? (
                  <m.a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-brand/40 hover:bg-brand-muted/25 hover:text-brand"
                    whileHover={reduceMotion ? undefined : { y: -2 }}
                  >
                    {project.linkLabel}
                    <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
                  </m.a>
                ) : (
                  <p className="text-sm font-medium text-text-muted">
                    {content.noPublicLink}
                  </p>
                )}
              </div>

              <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {project.summary}
              </p>

              <h4 className="mt-8 text-xs font-semibold uppercase tracking-wider text-text-muted">
                {content.approach}
              </h4>
              <ul className="mt-3 max-w-3xl list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                {project.bullets.map((bullet) => (
                  <li key={bullet.slice(0, 48)}>{bullet}</li>
                ))}
              </ul>

              {project.tags?.length ? (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <span className="inline-flex items-center rounded-md border border-border/70 bg-background/60 px-2.5 py-1 text-xs font-medium text-text-secondary">
                        {tag}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </m.article>
          );
        })}
      </div>
    </Section>
  );
}

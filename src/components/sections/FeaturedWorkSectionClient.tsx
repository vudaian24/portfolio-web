"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { Section, SectionHeader } from "@/components/ui/Section";
import { SECTION_IDS, projectAnchorId, type ProjectId } from "@/config/site";
import { staggerContainer, staggerItem } from "@/lib/animation";

export type FeaturedWorkContent = {
  eyebrow: string;
  title: string;
  cta: string;
  live: string;
  projectsLabel: string;
  project: {
    id: ProjectId;
    href?: string;
    title: string;
    role: string;
    period: string;
    summary: string;
  };
};

type FeaturedWorkSectionClientProps = {
  content: FeaturedWorkContent;
};

export default function FeaturedWorkSectionClient({
  content,
}: FeaturedWorkSectionClientProps) {
  const reduceMotion = useReducedMotion();
  const { project } = content;

  return (
    <Section id="featured">
      <SectionHeader eyebrow={content.eyebrow} title={content.title} />
      <m.div
        className="mt-10 border-t border-border pt-10"
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={
          reduceMotion
            ? undefined
            : {
                ...staggerContainer,
                visible: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.05 },
                },
              }
        }
      >
        <m.p
          variants={reduceMotion ? undefined : staggerItem}
          className="font-display text-2xl font-semibold md:text-3xl"
        >
          {project.title}
        </m.p>
        <m.p
          variants={reduceMotion ? undefined : staggerItem}
          className="mt-2 text-sm text-muted-foreground"
        >
          {project.role} · {project.period}
        </m.p>
        <m.p
          variants={reduceMotion ? undefined : staggerItem}
          className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg"
        >
          {project.summary}
        </m.p>
        <m.div
          variants={reduceMotion ? undefined : staggerItem}
          className="mt-8 flex flex-wrap gap-3"
        >
          <m.div
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <a
              href={`#${projectAnchorId(project.id)}`}
              className="font-display inline-flex h-11 items-center rounded-lg bg-brand px-6 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
            >
              {content.cta}
            </a>
          </m.div>
          {project.href ? (
            <m.div
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center rounded-lg border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:border-brand/40 hover:bg-brand-muted/25"
              >
                {content.live}
              </a>
            </m.div>
          ) : null}
          <a
            href={`#${SECTION_IDS.projects}`}
            className="inline-flex h-11 items-center px-2 text-sm font-medium text-brand underline-offset-4 hover:underline"
          >
            {content.projectsLabel} →
          </a>
        </m.div>
      </m.div>
    </Section>
  );
}

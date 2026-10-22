"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { Variants } from "motion/react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { EASE_OUT, timelineLine } from "@/lib/animation";
import { SECTION_IDS } from "@/config/site";

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -16, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: { delay: 0.15 + i * 0.14, duration: 0.5, ease: EASE_OUT },
  }),
};

export type ExperienceContent = {
  eyebrow: string;
  title: string;
  description: string;
  current: string;
  items: {
    id: string;
    current?: boolean;
    tags?: readonly string[];
    role: string;
    company: string;
    period: string;
    bullets: string[];
  }[];
};

type ExperienceSectionClientProps = {
  content: ExperienceContent;
};

export default function ExperienceSectionClient({
  content,
}: ExperienceSectionClientProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Section id={SECTION_IDS.experience}>
      <SectionHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <div className="relative mt-14 pl-8 md:pl-10">
        <div
          className="absolute bottom-1 left-[7px] top-1 w-px overflow-hidden bg-border/40 md:left-[9px]"
          aria-hidden
        >
          {reduceMotion ? (
            <div className="h-full w-px bg-brand/50" />
          ) : (
            <m.div
              className="h-full w-px origin-top bg-brand/50"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={timelineLine}
            />
          )}
        </div>

        <ol className="flex flex-col gap-10">
          {content.items.map((item, index) => (
            <m.li
              key={item.id}
              custom={index}
              initial={reduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={reduceMotion ? undefined : itemVariants}
              className="relative"
            >
              <span
                className="absolute -left-8 top-1.5 flex h-3.5 w-3.5 items-center justify-center md:-left-10"
                aria-hidden
              >
                {item.current ? (
                  <>
                    {!reduceMotion ? (
                      <m.span
                        className="absolute h-full w-full rounded-full bg-brand/40"
                        animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    ) : null}
                    <span className="h-2 w-2 rounded-full bg-brand" />
                  </>
                ) : (
                  <span className="h-2 w-2 rounded-full border-2 border-border bg-background" />
                )}
              </span>

              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="font-display text-lg font-semibold text-foreground md:text-xl">
                    {item.role}
                  </h3>
                  {item.current ? (
                    <span className="inline-flex items-center rounded-md bg-brand-muted/60 px-2.5 py-0.5 text-xs font-medium text-brand">
                      {content.current}
                    </span>
                  ) : null}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                  <span className="font-medium text-text-secondary">
                    {item.company}
                  </span>
                  <span aria-hidden>•</span>
                  <span>{item.period}</span>
                </div>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {item.bullets.map((bullet, bi) => (
                    <m.li
                      key={bullet.slice(0, 48)}
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.25 + index * 0.1 + bi * 0.05,
                        duration: 0.35,
                        ease: EASE_OUT,
                      }}
                    >
                      {bullet}
                    </m.li>
                  ))}
                </ul>
                {item.tags?.length ? (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <li key={tag}>
                        <span className="inline-flex items-center rounded-md border border-border/80 bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground">
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </m.li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

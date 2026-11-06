"use client";

import { useRef } from "react";
import { useReducedMotion, useScroll, useSpring } from "motion/react";
import * as m from "motion/react-m";
import type { Variants } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  Building,
  CalendarDays,
  CodeXml,
  ServerCog,
  TrendingUp,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { TechChip } from "@/components/ui/TechChip";
import { EASE_OUT } from "@/lib/animation";
import { TAG_ICONS, type TechTag } from "@/lib/techIcons";
import { SECTION_IDS, type ExperienceId } from "@/config/site";

const ROLE_ICONS: Record<ExperienceId, LucideIcon> = {
  softwareEngineer: ServerCog,
  softwareIntern: CodeXml,
};

// One grid for every row so the date rail, the line and the cards line up.
// Mobile: [node | card]. md+: [date | node | card]. The line sits on the
// centre of the node column: 1.25rem on mobile, 9.5rem + 1.5rem + 1.5rem on md+.
const ROW_GRID =
  "grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 md:grid-cols-[9.5rem_3rem_minmax(0,1fr)] md:gap-x-6";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
};

const nodeVariants: Variants = {
  hidden: { scale: 0.4, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 18, delay: 0.1 },
  },
};

export type ExperienceContent = {
  eyebrow: string;
  title: string;
  description: string;
  current: string;
  items: {
    id: ExperienceId;
    current?: boolean;
    tags?: readonly TechTag[];
    role: string;
    company: string;
    period: string;
    bullets: string[];
    milestone?: { label: string; date: string };
  }[];
};

type ExperienceSectionClientProps = {
  content: ExperienceContent;
};

export default function ExperienceSectionClient({
  content,
}: ExperienceSectionClientProps) {
  const reduceMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 60%"],
  });
  const lineProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  const reveal = (variants: Variants) =>
    reduceMotion
      ? {}
      : {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true, amount: 0.15 },
          variants,
        };

  return (
    <Section id={SECTION_IDS.experience}>
      <SectionHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <div ref={timelineRef} className="relative mt-14">
        {/* Track, and the fill that follows the scroll */}
        <div
          className="absolute bottom-6 left-[calc(1.25rem-1px)] top-6 w-0.5 overflow-hidden rounded-full bg-border [mask-image:linear-gradient(to_bottom,black_80%,transparent)] md:left-[calc(12.5rem-1px)]"
          aria-hidden
        >
          <m.div
            className="h-full w-full origin-top bg-gradient-to-b from-brand-light via-brand to-brand-strong"
            style={{ scaleY: reduceMotion ? 1 : lineProgress }}
          />
        </div>

        <ol className="relative flex flex-col gap-10 md:gap-12">
          {content.items.map((item) => {
            const RoleIcon = ROLE_ICONS[item.id];
            return (
              <li key={item.id} className="flex flex-col gap-10 md:gap-12">
                <div className={ROW_GRID}>
                  {/* Date rail, md+ only; stays in view while the card scrolls */}
                  <div className="hidden md:block">
                    <div className="sticky top-28 pt-7 text-right">
                      <p className="font-display text-sm font-semibold text-foreground">
                        {item.period}
                      </p>
                      <p className="mt-1 text-xs text-text-muted">
                        {item.company}
                      </p>
                    </div>
                  </div>

                  {/* Node */}
                  <div className="flex justify-center pt-5 md:pt-6">
                    <m.span
                      {...reveal(nodeVariants)}
                      className={
                        item.current
                          ? "relative flex h-10 w-10 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-[0_8px_24px_-8px_var(--brand-glow)] ring-4 ring-background md:h-12 md:w-12"
                          : "relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand/40 bg-surface-elevated text-brand ring-4 ring-background md:h-12 md:w-12"
                      }
                      aria-hidden
                    >
                      {item.current && !reduceMotion ? (
                        <m.span
                          className="absolute inset-0 rounded-full bg-brand/40"
                          animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                        />
                      ) : null}
                      <RoleIcon
                        className="relative h-[18px] w-[18px] md:h-5 md:w-5"
                        strokeWidth={1.9}
                      />
                    </m.span>
                  </div>

                  {/* Card */}
                  <m.article
                    {...reveal(itemVariants)}
                    className="card-glow p-5 sm:p-6 md:p-8"
                  >
                    <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary md:hidden">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                      {item.period}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <h3 className="font-display text-lg font-semibold text-foreground md:text-xl">
                        {item.role}
                      </h3>
                      {item.current ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-muted px-2.5 py-0.5 text-xs font-medium text-brand">
                          <span className="relative flex h-1.5 w-1.5">
                            {!reduceMotion ? (
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
                            ) : null}
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
                          </span>
                          {content.current}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary">
                      <Building className="h-3.5 w-3.5" aria-hidden />
                      {item.company}
                    </p>

                    <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {item.bullets.map((bullet) => (
                        <li key={bullet.slice(0, 48)} className="flex gap-3">
                          <span
                            className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand/70"
                            aria-hidden
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {item.tags?.length ? (
                      <ul className="mt-6 flex flex-wrap gap-2 border-t border-border/70 pt-5">
                        {item.tags.map((tag) => (
                          <li key={tag}>
                            <TechChip label={tag} icons={TAG_ICONS[tag]} />
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </m.article>
                </div>

                {/* Milestone between this role and the previous one */}
                {item.milestone ? (
                  <div className={`${ROW_GRID} items-center`}>
                    <p className="hidden text-right text-xs font-semibold uppercase tracking-wider text-brand md:block">
                      {item.milestone.date}
                    </p>
                    <div className="flex justify-center">
                      <m.span
                        {...reveal(nodeVariants)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-brand/40 bg-[color-mix(in_oklch,var(--brand)_14%,var(--background))] text-brand ring-4 ring-background"
                        aria-hidden
                      >
                        <TrendingUp className="h-4 w-4" strokeWidth={2.2} />
                      </m.span>
                    </div>
                    <m.p
                      {...reveal(itemVariants)}
                      className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/30 bg-brand-subtle px-3.5 py-1.5 text-sm font-medium text-brand"
                    >
                      {item.milestone.label}
                      <span className="text-brand/70 md:hidden">
                        · {item.milestone.date}
                      </span>
                    </m.p>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

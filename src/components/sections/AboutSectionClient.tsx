"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Section } from "@/components/ui/Section";
import { chipCascade } from "@/lib/animation";
import { SECTION_IDS } from "@/config/site";

export type AboutContent = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  skillsTitle: string;
  groups: {
    id: string;
    label: string;
    skills: { key: string; label: string }[];
  }[];
};

type AboutSectionClientProps = {
  content: AboutContent;
};

export default function AboutSectionClient({
  content,
}: AboutSectionClientProps) {
  const reduceMotion = useReducedMotion();
  let chipIndex = 0;

  return (
    <Section id={SECTION_IDS.about}>
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <MotionReveal className="lg:col-span-5">
          <p className="section-label mb-3">{content.eyebrow}</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {content.title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            {content.description}
          </p>
          <m.div
            whileHover={reduceMotion ? undefined : { x: 4 }}
            className="mt-8 inline-block"
          >
            <Link
              href={`#${SECTION_IDS.projects}`}
              className="font-display inline-flex h-11 items-center rounded-lg border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:border-brand/40 hover:bg-brand-muted/25"
            >
              {content.cta}
            </Link>
          </m.div>
        </MotionReveal>

        <MotionReveal delay={0.08} className="lg:col-span-7">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-secondary">
            {content.skillsTitle}
          </h3>
          <div className="mt-2">
            {content.groups.map((group) => (
              <div key={group.id} className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  {group.label}
                </h4>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.skills.map((skill) => {
                    const index = chipIndex++;
                    return (
                      <m.li
                        key={skill.key}
                        custom={index}
                        initial={reduceMotion ? false : "hidden"}
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={reduceMotion ? undefined : chipCascade}
                        whileHover={
                          reduceMotion
                            ? undefined
                            : {
                                y: -3,
                                scale: 1.04,
                                transition: { duration: 0.2 },
                              }
                        }
                      >
                        <span className="inline-flex items-center rounded-md border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground transition-colors duration-300 hover:border-brand/40 hover:text-brand md:text-sm">
                          {skill.label}
                        </span>
                      </m.li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </MotionReveal>
      </div>
    </Section>
  );
}

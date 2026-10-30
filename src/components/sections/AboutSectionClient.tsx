"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  Boxes,
  Cloud,
  Database,
  FileCode2,
  Terminal,
  Workflow,
} from "lucide-react";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { chipCascade, staggerContainer, staggerItem } from "@/lib/animation";
import { SECTION_IDS, type SkillGroupId } from "@/config/site";

const GROUP_ICONS: Record<SkillGroupId, LucideIcon> = {
  containers: Boxes,
  cicd: Workflow,
  iac: FileCode2,
  cloud: Cloud,
  linux: Terminal,
  observability: Activity,
  data: Database,
};

export type AboutContent = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  skillsTitle: string;
  stats: { value: string; label: string }[];
  groups: {
    id: SkillGroupId;
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

  return (
    <Section id={SECTION_IDS.about}>
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionHeader eyebrow={content.eyebrow} title={content.title} />
          <MotionReveal delay={0.1}>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              {content.description}
            </p>
          </MotionReveal>

          <m.dl
            className="mt-8 grid grid-cols-2 gap-3"
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={reduceMotion ? undefined : staggerContainer}
          >
            {content.stats.map((stat) => (
              <m.div
                key={stat.label}
                variants={reduceMotion ? undefined : staggerItem}
                className="card-glow p-4"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-gradient-brand text-3xl font-semibold">
                  {stat.value}
                </dd>
                <dd className="mt-1 text-xs leading-snug text-text-secondary md:text-sm">
                  {stat.label}
                </dd>
              </m.div>
            ))}
          </m.dl>

          <MotionReveal delay={0.15} className="mt-8">
            <Link href={`#${SECTION_IDS.projects}`} className="btn btn-outline">
              {content.cta}
              <ArrowRight className="btn-icon h-4 w-4" aria-hidden />
            </Link>
          </MotionReveal>
        </div>

        <div className="lg:col-span-7">
          <MotionReveal>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-secondary">
              {content.skillsTitle}
            </h3>
          </MotionReveal>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {content.groups.map((group, gi) => {
              const Icon = GROUP_ICONS[group.id];
              return (
                <MotionReveal
                  key={group.id}
                  delay={gi * 0.05}
                  className={group.id === "cloud" ? "sm:col-span-2" : undefined}
                >
                  <div className="card-glow group h-full p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-muted text-brand transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                        <Icon
                          className="h-[18px] w-[18px]"
                          strokeWidth={1.75}
                        />
                      </span>
                      <h4 className="font-display text-sm font-semibold text-foreground">
                        {group.label}
                      </h4>
                    </div>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {group.skills.map((skill, si) => (
                        <m.li
                          key={skill.key}
                          custom={si}
                          initial={reduceMotion ? false : "hidden"}
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.3 }}
                          variants={reduceMotion ? undefined : chipCascade}
                        >
                          <span className="inline-flex items-center rounded-md border border-border/80 bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground transition-colors duration-300 hover:border-brand/50 hover:bg-brand-subtle hover:text-brand md:text-sm">
                            {skill.label}
                          </span>
                        </m.li>
                      ))}
                    </ul>
                  </div>
                </MotionReveal>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}

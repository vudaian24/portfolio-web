"use client";

import Image from "next/image";
import { useReducedMotion, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, Download } from "lucide-react";
import { CV_PATH, SECTION_IDS, SOCIAL_LINKS } from "@/config/site";
import { EASE_OUT, staggerContainer, staggerItem } from "@/lib/animation";
import {
  AnimatedText,
  RotatingWords,
  Typewriter,
} from "@/components/ui/AnimatedText";

/** Commands shown in the hero terminal; they describe how this site runs */
const TERMINAL_LINES = [
  "$ kubectl get pods -n portfolio-web",
  "portfolio-web-6d9f8c   1/1   Running",
  "$ argocd app get portfolio-web",
  "Sync Status:    Synced",
  "Health Status:  Healthy",
  "$ terraform plan",
  "No changes. Infrastructure is up-to-date.",
] as const;

export type HeroContent = {
  brand: string;
  eyebrow: string;
  title: string;
  focusPrefix: string;
  focus: string[];
  description: string;
  availability: string;
  ctaProjects: string;
  ctaContact: string;
  ctaResume: string;
  photoAlt: string;
};

type HeroSectionClientProps = {
  content: HeroContent;
};

export default function HeroSectionClient({ content }: HeroSectionClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : 40],
  );
  const copyY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : 24],
  );
  const copyOpacity = useTransform(
    scrollYProgress,
    [0, 0.7],
    [1, reduceMotion ? 1 : 0.7],
  );
  const item = reduceMotion ? undefined : staggerItem;

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.home}
      className="relative flex items-center py-10 sm:py-14 lg:min-h-[min(100dvh,880px)] lg:py-24"
    >
      {/*
        One grid, three items. Below lg they stack as photo, copy, terminal so
        the headline stays near the top of a phone. From lg the copy fills the
        left column and the photo and terminal share the right one, so the
        terminal can overlap the photo but never the text.
      */}
      <div className="section-shell grid w-full items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-x-12 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-x-16">
        <m.div
          style={{ y: copyY, opacity: copyOpacity }}
          className="order-2 flex w-full max-w-2xl flex-col items-center justify-self-center text-center lg:order-none lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:items-start lg:justify-self-start lg:text-left"
        >
          <m.div
            initial="hidden"
            animate="visible"
            variants={
              reduceMotion
                ? undefined
                : {
                    ...staggerContainer,
                    visible: {
                      transition: {
                        staggerChildren: 0.09,
                        delayChildren: 0.05,
                      },
                    },
                  }
            }
            className="flex w-full flex-col items-center lg:items-start"
          >
            <m.p
              variants={item}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-subtle px-3.5 py-1.5 text-xs font-medium text-brand sm:mb-6"
            >
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-green" />
              </span>
              {content.availability}
            </m.p>
            <m.p variants={item} className="section-label mb-3 sm:mb-4">
              {content.eyebrow}
            </m.p>
            <m.p
              variants={item}
              className="font-display text-gradient-brand pb-1 text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl"
            >
              {content.brand}
            </m.p>
            <AnimatedText
              as="h1"
              onMount
              delay={0.35}
              text={content.title}
              className="mt-3 font-display text-2xl font-semibold text-foreground sm:mt-4 sm:text-3xl md:text-4xl"
            />
            <m.p
              variants={item}
              className="mt-4 font-display text-lg font-medium text-text-secondary sm:text-xl"
            >
              {content.focusPrefix}{" "}
              <RotatingWords
                words={content.focus}
                className="font-semibold text-brand"
              />
            </m.p>
            <m.p
              variants={item}
              className="mt-5 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg"
            >
              {content.description}
            </m.p>

            <m.div
              variants={item}
              className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row"
            >
              <Link
                href={`#${SECTION_IDS.projects}`}
                className="btn btn-primary"
              >
                {content.ctaProjects}
                <ArrowRight className="btn-icon h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={`#${SECTION_IDS.contact}`}
                className="btn btn-outline"
              >
                {content.ctaContact}
              </Link>
              <a
                href={CV_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <Download
                  className="btn-icon btn-icon-down h-4 w-4"
                  aria-hidden
                />
                {content.ctaResume}
              </a>
            </m.div>

            <m.ul
              variants={item}
              className="mt-6 flex items-center gap-2 sm:mt-8"
            >
              {SOCIAL_LINKS.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-xl border border-transparent p-2.5 text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:bg-brand-subtle hover:text-brand"
                    aria-label={social.label}
                  >
                    <social.icon size={20} strokeWidth={1.75} />
                  </a>
                </li>
              ))}
            </m.ul>
          </m.div>
        </m.div>

        <m.div
          style={{ y: photoY }}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT }}
          className="relative order-1 justify-self-center lg:order-none lg:col-start-2 lg:row-start-1 lg:self-end lg:justify-self-end"
        >
          <m.div
            className="absolute -inset-4 rounded-[2.25rem] bg-gradient-to-br from-brand/30 via-brand-light/15 to-transparent blur-2xl"
            aria-hidden
            animate={
              reduceMotion
                ? undefined
                : { opacity: [0.5, 0.85, 0.5], scale: [1, 1.04, 1] }
            }
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative aspect-[779/1280] w-36 overflow-hidden rounded-2xl border border-brand/20 bg-surface shadow-xl sm:w-44 sm:rounded-3xl lg:w-64">
            <Image
              src="/avatar.jpg"
              alt={content.photoAlt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 256px, (min-width: 640px) 176px, 144px"
              priority
            />
          </div>
        </m.div>

        <m.div
          style={{ y: photoY }}
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE_OUT }}
          className="relative z-10 order-3 hidden w-full max-w-sm justify-self-center overflow-hidden rounded-xl border border-border bg-surface-elevated/90 shadow-2xl backdrop-blur-md sm:block lg:order-none lg:col-start-2 lg:row-start-2 lg:-mt-14 lg:max-w-none lg:self-start lg:justify-self-end"
        >
          <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent-orange" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
            <span className="ml-2 font-mono text-[11px] text-text-muted">
              ~/portfolio
            </span>
          </div>
          <pre className="min-h-[10.5rem] px-4 py-3 text-left font-mono text-[11.5px] leading-relaxed text-text-secondary">
            <Typewriter lines={TERMINAL_LINES} />
          </pre>
        </m.div>
      </div>
    </section>
  );
}

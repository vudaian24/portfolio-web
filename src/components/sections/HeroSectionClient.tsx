"use client";

import Image from "next/image";
import { useReducedMotion, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import Link from "next/link";
import { useRef } from "react";
import { CV_PATH, SECTION_IDS, SOCIAL_LINKS } from "@/config/site";
import { EASE_OUT, staggerContainer, staggerItem } from "@/lib/animation";

export type HeroContent = {
  brand: string;
  eyebrow: string;
  title: string;
  description: string;
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
    [0, reduceMotion ? 0 : 48],
  );
  const copyY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : 24],
  );
  const copyOpacity = useTransform(
    scrollYProgress,
    [0, 0.7],
    [1, reduceMotion ? 1 : 0.55],
  );

  return (
    <section
      ref={sectionRef}
      id={SECTION_IDS.home}
      className="relative flex min-h-[min(100dvh,900px)] flex-col items-center justify-center gap-12 py-16 lg:flex-row lg:gap-16 lg:py-24"
    >
      <div className="section-shell flex w-full flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <m.div
          style={{ y: copyY, opacity: copyOpacity }}
          className="order-2 flex w-full max-w-xl flex-1 flex-col items-center text-center lg:order-1 lg:items-start lg:text-left"
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
              variants={reduceMotion ? undefined : staggerItem}
              className="section-label mb-4"
            >
              {content.eyebrow}
            </m.p>
            <m.p
              variants={reduceMotion ? undefined : staggerItem}
              className="font-display text-5xl font-semibold tracking-tight text-foreground sm:text-6xl md:text-7xl"
            >
              {content.brand}
            </m.p>
            <m.h1
              variants={reduceMotion ? undefined : staggerItem}
              className="mt-4 font-display text-2xl font-semibold text-text-secondary sm:text-3xl md:text-4xl"
            >
              {content.title}
            </m.h1>
            <m.p
              variants={reduceMotion ? undefined : staggerItem}
              className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {content.description}
            </m.p>

            <m.div
              variants={reduceMotion ? undefined : staggerItem}
              className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <m.div
                whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`#${SECTION_IDS.projects}`}
                  className="font-display inline-flex h-12 w-full items-center justify-center rounded-lg bg-brand px-8 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 sm:w-auto"
                >
                  {content.ctaProjects}
                </Link>
              </m.div>
              <m.div
                whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`#${SECTION_IDS.contact}`}
                  className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-border bg-transparent px-8 text-sm font-semibold text-foreground transition-colors hover:border-brand/40 hover:bg-brand-muted/30 sm:w-auto"
                >
                  {content.ctaContact}
                </Link>
              </m.div>
              <m.div whileHover={reduceMotion ? undefined : { y: -2 }}>
                <a
                  href={CV_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 w-full items-center justify-center rounded-lg px-6 text-sm font-semibold text-brand underline-offset-4 transition-colors hover:underline sm:w-auto"
                >
                  {content.ctaResume}
                </a>
              </m.div>
            </m.div>

            <m.ul
              variants={reduceMotion ? undefined : staggerItem}
              className="mt-8 flex items-center gap-1"
            >
              {SOCIAL_LINKS.map((social) => (
                <li key={social.href}>
                  <m.a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-lg p-2.5 text-muted-foreground transition-colors hover:bg-surface hover:text-brand"
                    aria-label={social.label}
                    whileHover={
                      reduceMotion ? undefined : { y: -2, scale: 1.08 }
                    }
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon size={20} strokeWidth={1.75} />
                  </m.a>
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
          className="order-1 flex flex-1 justify-center lg:order-2 lg:justify-end"
        >
          <div className="relative">
            <m.div
              className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand-muted via-transparent to-brand-subtle opacity-80 blur-2xl"
              aria-hidden
              animate={
                reduceMotion
                  ? undefined
                  : {
                      opacity: [0.55, 0.85, 0.55],
                      scale: [1, 1.04, 1],
                    }
              }
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative aspect-[779/1280] w-48 overflow-hidden rounded-2xl border border-border bg-surface shadow-xl sm:w-56 md:w-64">
              <Image
                src="/avatar.jpg"
                alt={content.photoAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 256px"
                priority
              />
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

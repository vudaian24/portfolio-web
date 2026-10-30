"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { cn } from "@/lib/utils";
import { AnimatedText } from "./AnimatedText";
import {
  EASE_OUT,
  sectionHeaderContainer,
  sectionHeaderItem,
  viewportOnce,
} from "@/lib/animation";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  const centered = align === "center";
  const reduceMotion = useReducedMotion();
  const item = reduceMotion ? undefined : sectionHeaderItem;

  return (
    <m.div
      className={cn(centered ? "text-center" : "max-w-2xl", className)}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
      variants={reduceMotion ? undefined : sectionHeaderContainer}
    >
      <m.p
        variants={item}
        className={cn(
          "section-label mb-3 flex items-center gap-3",
          centered && "justify-center",
        )}
      >
        <m.span
          aria-hidden
          className="h-px w-8 origin-left bg-brand"
          variants={
            reduceMotion
              ? undefined
              : {
                  hidden: { scaleX: 0 },
                  visible: {
                    scaleX: 1,
                    transition: { duration: 0.6, ease: EASE_OUT },
                  },
                }
          }
        />
        {eyebrow}
      </m.p>
      <AnimatedText
        as="h2"
        text={title}
        delay={0.1}
        className={cn(
          "font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl",
          centered && "mx-auto",
        )}
      />
      {description ? (
        <m.p
          variants={item}
          className={cn(
            "mt-4 text-base text-muted-foreground md:text-lg",
            centered && "mx-auto max-w-xl",
          )}
        >
          {description}
        </m.p>
      ) : null}
    </m.div>
  );
}

"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { cn } from "@/lib/utils";
import {
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

  const body = (
    <>
      <m.p
        variants={reduceMotion ? undefined : sectionHeaderItem}
        className="section-label mb-3"
      >
        {eyebrow}
      </m.p>
      <m.h2
        variants={reduceMotion ? undefined : sectionHeaderItem}
        className={cn(
          "font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl",
          centered && "mx-auto",
        )}
      >
        {title}
      </m.h2>
      {description ? (
        <m.p
          variants={reduceMotion ? undefined : sectionHeaderItem}
          className={cn(
            "mt-4 text-base text-muted-foreground md:text-lg",
            centered && "mx-auto max-w-xl",
          )}
        >
          {description}
        </m.p>
      ) : null}
    </>
  );

  if (reduceMotion) {
    return (
      <div
        className={cn(
          centered && "text-center",
          !centered && "max-w-2xl",
          className,
        )}
      >
        <p className="section-label mb-3">{eyebrow}</p>
        <h2
          className={cn(
            "font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl",
            centered && "mx-auto",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-4 text-base text-muted-foreground md:text-lg",
              centered && "mx-auto max-w-xl",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <m.div
      className={cn(
        centered && "text-center",
        !centered && "max-w-2xl",
        className,
      )}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={sectionHeaderContainer}
    >
      {body}
    </m.div>
  );
}

"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { pageEnter, staggerContainer, staggerItem } from "@/lib/animation";

type CaseStudyMotionProps = {
  children: ReactNode;
};

/** Page entrance wrapper for case study content */
export function CaseStudyMotion({ children }: CaseStudyMotionProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div>{children}</div>;
  }

  return (
    <m.div
      initial="hidden"
      animate="visible"
      variants={{
        ...pageEnter,
        visible: {
          ...pageEnter.visible,
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            when: "beforeChildren",
            staggerChildren: 0.08,
          },
        },
      }}
    >
      {children}
    </m.div>
  );
}

export function CaseStudyBlock({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div variants={staggerItem} className={className}>
      {children}
    </m.div>
  );
}

export { staggerContainer };

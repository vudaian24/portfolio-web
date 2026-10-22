"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { fadeUp, fadeUpTransition, viewportOnce } from "@/lib/animation";
import { cn } from "@/lib/utils";

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  viewportAmount?: number;
};

export function MotionReveal({
  children,
  className,
  delay = 0,
  viewportAmount = viewportOnce.amount,
}: MotionRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount }}
      variants={fadeUp}
      transition={fadeUpTransition(delay)}
      className={cn(className)}
    >
      {children}
    </m.div>
  );
}

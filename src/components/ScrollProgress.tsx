"use client";

import { useReducedMotion, useScroll, useSpring } from "motion/react";
import * as m from "motion/react-m";

/** Thin reading-progress bar pinned to the top of the viewport */
export default function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  if (reduceMotion) return null;

  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-brand-strong via-brand to-brand-light"
      style={{ scaleX }}
    />
  );
}

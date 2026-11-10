"use client";

import { domAnimation, LazyMotion, MotionConfig } from "motion/react";

// Loads only the DOM animation features. Components use the slim `m` element
// from "motion/react-m", so the full motion bundle is not shipped.
//
// reducedMotion="user" keeps opacity fades and drops movement (transforms) for
// visitors who ask for reduced motion, so components can render the same
// animated markup for everyone.
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </MotionConfig>
  );
}

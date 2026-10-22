"use client";

import { domAnimation, LazyMotion } from "motion/react";

// Loads only the DOM animation features. Components use the slim `m` element
// from "motion/react-m", so the full motion bundle is not shipped.
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

import type { Transition, Variants } from "motion/react";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
} as const;

export const fadeUpTransition = (delay = 0): Transition => ({
  duration: 0.5,
  delay,
  ease: EASE_OUT,
});

export const viewportOnce = { once: true, amount: 0.25 } as const;

/** Stagger children on scroll reveal */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

export const sectionHeaderContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.02,
    },
  },
};

export const sectionHeaderItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

export const cardHover = {
  rest: { y: 0 },
  hover: { y: -6, transition: { duration: 0.28, ease: EASE_OUT } },
} as const;

export const chipCascade: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.04 + i * 0.035,
      duration: 0.35,
      ease: EASE_OUT,
    },
  }),
};

export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
};

export const timelineLine: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.9, ease: EASE_OUT },
  },
};

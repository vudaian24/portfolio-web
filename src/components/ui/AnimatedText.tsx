"use client";

import { AnimatePresence, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { EASE_OUT } from "@/lib/animation";
import { cn } from "@/lib/utils";

const wordContainer: Variants = {
  hidden: {},
  visible: (delay: number = 0) => ({
    transition: { staggerChildren: 0.05, delayChildren: delay },
  }),
};

const wordItem: Variants = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE_OUT },
  },
};

type AnimatedTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  /** Animate on mount instead of when scrolled into view */
  onMount?: boolean;
};

/** Reveals text word by word, rising out of a blur */
export function AnimatedText({
  text,
  as = "span",
  className,
  delay = 0,
  onMount = false,
}: AnimatedTextProps) {
  const reduceMotion = useReducedMotion();
  const Tag = m[as];

  if (reduceMotion) {
    const Plain = as;
    return <Plain className={className}>{text}</Plain>;
  }

  const words = text.split(" ");
  const trigger = onMount
    ? { animate: "visible" }
    : { whileInView: "visible", viewport: { once: true, amount: 0.6 } };

  return (
    <Tag
      className={className}
      aria-label={text}
      initial="hidden"
      custom={delay}
      variants={wordContainer}
      {...trigger}
    >
      {words.map((word, i) => (
        <m.span
          key={`${word}-${i}`}
          variants={wordItem}
          className="inline-block whitespace-pre"
          aria-hidden
        >
          {i < words.length - 1 ? `${word} ` : word}
        </m.span>
      ))}
    </Tag>
  );
}

type RotatingWordsProps = {
  words: readonly string[];
  className?: string;
  interval?: number;
};

/** Cycles through words in place, sliding each one up */
export function RotatingWords({
  words,
  className,
  interval = 2200,
}: RotatingWordsProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || words.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => clearInterval(id);
  }, [reduceMotion, words.length, interval]);

  return (
    <span
      className={cn(
        "relative inline-flex overflow-hidden align-bottom",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={words[index]}
          className="inline-block"
          initial={reduceMotion ? false : { y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? undefined : { y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          {words[index]}
        </m.span>
      </AnimatePresence>
    </span>
  );
}

type TypewriterProps = {
  lines: readonly string[];
  className?: string;
  speed?: number;
  startDelay?: number;
};

/** Types lines one after another, like a terminal session */
export function Typewriter({
  lines,
  className,
  speed = 28,
  startDelay = 600,
}: TypewriterProps) {
  const reduceMotion = useReducedMotion();
  const full = lines.join("\n");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    let timer: ReturnType<typeof setTimeout>;
    let i = 0;
    const tick = () => {
      i += 1;
      setCount(i);
      if (i < full.length) {
        timer = setTimeout(tick, full[i - 1] === "\n" ? speed * 8 : speed);
      }
    };
    timer = setTimeout(tick, startDelay);
    return () => clearTimeout(timer);
  }, [reduceMotion, full, speed, startDelay]);

  const shown = reduceMotion ? full : full.slice(0, count);

  return (
    <span className={cn("whitespace-pre-wrap", className)}>
      <span aria-hidden>{shown}</span>
      <span className="caret" aria-hidden />
      <span className="sr-only">{full}</span>
    </span>
  );
}

"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  /** Numeric text such as "151" or "2.5"; decimals are preserved */
  value: string;
  className?: string;
  duration?: number;
};

/**
 * Counts up to a number when it first scrolls into view. The server renders
 * the real value, which screen readers always get, so the page stays correct
 * without JavaScript and with reduced motion.
 */
export function CountUp({ value, className, duration = 1.2 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();

  const target = Number.parseFloat(value);
  const decimals = value.includes(".") ? (value.split(".")[1]?.length ?? 0) : 0;
  const animatable = Number.isFinite(target) && !reduceMotion;
  const [display, setDisplay] = useState(value);

  // Start from zero once hydrated, ahead of the scroll that triggers the count.
  useEffect(() => {
    if (animatable) setDisplay((0).toFixed(decimals));
  }, [animatable, decimals]);

  useEffect(() => {
    if (!animatable || !inView) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - (1 - t) ** 3;
      setDisplay((target * eased).toFixed(decimals));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animatable, inView, target, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden className="tabular-nums">
        {display}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

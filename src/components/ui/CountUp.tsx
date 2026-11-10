"use client";

import { useInView } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  /** Numeric text such as "151", "2.5" or "2+"; decimals and a trailing qualifier are preserved */
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
  // Keep a trailing qualifier such as the "+" in "2+" once the count lands.
  const suffix = value.replace(/^[\d.]+/, "");
  const number = value.slice(0, value.length - suffix.length);
  const decimals = number.includes(".")
    ? (number.split(".")[1]?.length ?? 0)
    : 0;
  const animatable = Number.isFinite(target) && !reduceMotion;
  const [display, setDisplay] = useState(value);

  // Start from zero once hydrated, ahead of the scroll that triggers the count.
  useEffect(() => {
    // Back to the real value when the count is off: the reduced-motion
    // preference is only known after hydration, once the zero is already set.
    setDisplay(animatable ? `${(0).toFixed(decimals)}${suffix}` : value);
  }, [animatable, decimals, suffix, value]);

  useEffect(() => {
    if (!animatable || !inView) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(`${(target * eased).toFixed(decimals)}${suffix}`);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animatable, inView, target, decimals, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden className="tabular-nums">
        {display}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * The visitor's reduced-motion preference, safe to branch markup on.
 *
 * It is false on the server and during hydration, then switches to the real
 * value. motion's own hook reads the preference on the first client render,
 * while the server cannot know it, so markup that depended on it differed
 * from the server HTML and React reported a hydration mismatch.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

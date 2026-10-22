"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import LanguageSelector from "./LanguageSelector";
import ThemeToggle from "./ThemeToggle";
import { NAV_ITEMS, SOCIAL_LINKS } from "@/config/site";
import { EASE_OUT } from "@/lib/animation";

export default function Navbar() {
  const t = useTranslations("Common.nav");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <m.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          scrolled
            ? "border-b border-border/80 bg-background/85 shadow-sm backdrop-blur-md"
            : "border-b border-transparent bg-background/70 backdrop-blur-sm",
        )}
        animate={
          reduceMotion
            ? undefined
            : {
                boxShadow: scrolled
                  ? "0 1px 0 oklch(0.5 0.02 220 / 0.08)"
                  : "0 0 0 transparent",
              }
        }
        transition={{ duration: 0.25, ease: EASE_OUT }}
      >
        <nav
          className="section-shell flex h-16 items-center justify-between md:h-[4.25rem]"
          aria-label="Primary"
        >
          <Link
            href="/"
            className="font-display text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-brand md:text-xl"
          >
            {t("brand")}
          </Link>

          <div className="hidden items-center gap-1 xl:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                <item.icon
                  size={15}
                  className="text-brand opacity-80 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
                {t(item.labelKey)}
                <span
                  className="absolute inset-x-3 -bottom-px h-px scale-x-0 bg-brand transition-transform duration-300 ease-out group-hover:scale-x-100"
                  aria-hidden
                />
              </Link>
            ))}
            <div className="ml-2 h-6 w-px bg-border" aria-hidden />
            <div className="flex items-center gap-0.5 pl-1">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2.5 text-muted-foreground transition-colors hover:bg-surface hover:text-brand"
                  aria-label={social.label}
                >
                  <social.icon size={18} strokeWidth={1.75} />
                </Link>
              ))}
            </div>
            <LanguageSelector />
            <ThemeToggle className="ml-1" />
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <LanguageSelector />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-surface/80 text-foreground transition-colors hover:border-brand/30 hover:bg-brand-muted/30"
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {isOpen ? (
            <m.div
              id="mobile-nav"
              key="mobile-nav"
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
              className="fixed inset-x-0 top-16 z-40 border-b border-border bg-background/95 backdrop-blur-lg xl:hidden"
            >
              <div className="section-shell max-h-[min(70vh,calc(100dvh-4rem))] overflow-y-auto py-6">
                <ul className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item, i) => (
                    <m.li
                      key={item.href}
                      initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: reduceMotion ? 0 : 0.04 + i * 0.04,
                        duration: 0.25,
                        ease: EASE_OUT,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-surface"
                      >
                        <item.icon
                          size={18}
                          className="text-brand"
                          aria-hidden
                        />
                        {t(item.labelKey)}
                      </Link>
                    </m.li>
                  ))}
                </ul>
                <div className="mt-6 flex justify-center gap-4 border-t border-border pt-6">
                  {SOCIAL_LINKS.map((social) => (
                    <Link
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-border bg-surface/50 p-3 text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
                      aria-label={social.label}
                    >
                      <social.icon size={20} strokeWidth={1.75} />
                    </Link>
                  ))}
                </div>
              </div>
            </m.div>
          ) : null}
        </AnimatePresence>
      </m.header>

      <AnimatePresence>
        {isOpen ? (
          <m.button
            key="nav-overlay"
            type="button"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-[2px] xl:hidden"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

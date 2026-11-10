"use client";

import { Link } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import * as m from "motion/react-m";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import LanguageSelector from "./LanguageSelector";
import ThemeToggle from "./ThemeToggle";
import { NAV_ITEMS, SOCIAL_LINKS } from "@/config/site";
import { EASE_OUT } from "@/lib/animation";
import { useActiveSection } from "@/lib/useActiveSection";

export default function Navbar() {
  const t = useTranslations("Common.nav");
  const tA11y = useTranslations("Common.a11y");
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();
  const active = useActiveSection(NAV_ITEMS.map((item) => item.href.slice(1)));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // While the mobile menu is open: lock page scroll, move focus into the menu
  // and keep Tab inside it (the toggle plus the menu), close on Escape with
  // focus back on the toggle, and close when the viewport reaches the desktop
  // layout, where the menu is hidden and would leave the page locked.
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";

    const focusable = () => [
      ...(toggleRef.current ? [toggleRef.current] : []),
      ...(menuRef.current?.querySelectorAll<HTMLElement>("a[href], button") ??
        []),
    ];
    menuRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      const current = document.activeElement;
      if (!items.includes(current as HTMLElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia("(min-width: 80rem)");
    const onDesktop = () => {
      if (desktop.matches) setIsOpen(false);
    };

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
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
          aria-label={tA11y("primaryNav")}
        >
          <Link
            href="/"
            className="font-display text-gradient-brand text-lg font-semibold tracking-tight transition-opacity hover:opacity-80 md:text-xl"
          >
            {t("brand")}
          </Link>

          <div className="hidden items-center gap-1 xl:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <Link
                  key={item.href}
                  href={{ pathname: "/", hash: item.href.slice(1) }}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-surface hover:text-foreground",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <item.icon
                    size={15}
                    className={cn(
                      "text-brand transition-opacity group-hover:opacity-100",
                      isActive ? "opacity-100" : "opacity-80",
                    )}
                    aria-hidden
                  />
                  {t(item.labelKey)}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-px h-px bg-brand transition-transform duration-300 ease-out group-hover:scale-x-100",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                    aria-hidden
                  />
                </Link>
              );
            })}
            <div className="ml-2 h-6 w-px bg-border" aria-hidden />
            <div className="flex items-center gap-0.5 pl-1">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2.5 text-muted-foreground transition-colors hover:bg-surface hover:text-brand"
                  aria-label={social.label}
                >
                  <social.icon size={18} strokeWidth={1.75} />
                </a>
              ))}
            </div>
            <LanguageSelector />
            <ThemeToggle className="ml-1" />
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <LanguageSelector />
            <ThemeToggle />
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-surface/80 text-foreground transition-colors hover:border-brand/30 hover:bg-brand-muted/30"
              aria-expanded={isOpen}
              aria-controls={isOpen ? "mobile-nav" : undefined}
              aria-label={isOpen ? tA11y("closeMenu") : tA11y("openMenu")}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {isOpen ? (
            <m.div
              ref={menuRef}
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
                  {NAV_ITEMS.map((item, i) => {
                    const isActive = active === item.href.slice(1);
                    return (
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
                          href={{ pathname: "/", hash: item.href.slice(1) }}
                          onClick={() => setIsOpen(false)}
                          aria-current={isActive ? "location" : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-surface",
                            isActive && "bg-brand-subtle text-brand",
                          )}
                        >
                          <item.icon
                            size={18}
                            className="text-brand"
                            aria-hidden
                          />
                          {t(item.labelKey)}
                        </Link>
                      </m.li>
                    );
                  })}
                </ul>
                <div className="mt-6 flex justify-center gap-4 border-t border-border pt-6">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-border bg-surface/50 p-3 text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
                      aria-label={social.label}
                    >
                      <social.icon size={20} strokeWidth={1.75} />
                    </a>
                  ))}
                </div>
              </div>
            </m.div>
          ) : null}
        </AnimatePresence>
      </m.header>

      <AnimatePresence>
        {isOpen ? (
          // Pointer-only backdrop: keyboard and screen-reader users close the
          // menu with the toggle or Escape, so it stays out of their way.
          <m.div
            key="nav-overlay"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-[2px] xl:hidden"
            aria-hidden
            onClick={() => setIsOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

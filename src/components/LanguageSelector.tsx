"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import type { AvailableLocale } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Check } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface Language {
  code: AvailableLocale;
  flag: string;
  label: string;
}

export default function LanguageSelector() {
  const t = useTranslations("Common.Languages");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const languages: Language[] = [
    { code: "vi", flag: "🇻🇳", label: t("vi") },
    { code: "en", flag: "🇺🇸", label: t("en") },
  ];

  const currentLanguage = languages.find((lang) => lang.code === locale);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    // Start on the current language, so arrow keys work right away
    listRef.current
      ?.querySelector<HTMLElement>('[aria-current="true"]')
      ?.focus();
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleLanguageChange = (newLocale: AvailableLocale) => {
    router.push(pathname, { locale: newLocale, scroll: false });
    setOpen(false);
    triggerRef.current?.focus();
  };

  // Arrow keys, Home and End move between the languages
  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>("button") ?? [],
    );
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next =
      e.key === "ArrowDown"
        ? (index + 1) % items.length
        : e.key === "ArrowUp"
          ? (index - 1 + items.length) % items.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? items.length - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    items[next]?.focus();
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
          open
            ? "border-brand/40 bg-brand-muted/40 text-foreground"
            : "border-border/80 bg-surface/80 text-muted-foreground hover:border-border hover:bg-surface hover:text-foreground",
        )}
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        // Starts with the visible text so the name matches the label (WCAG 2.5.3)
        aria-label={`${currentLanguage?.label ?? ""} — ${t("label")}`}
      >
        <span className="hidden sm:inline">
          {currentLanguage?.flag} {currentLanguage?.label}
        </span>
        <span className="sm:hidden" aria-hidden>
          {currentLanguage?.flag}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "opacity-70 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {/* A disclosure with a plain list of buttons: the listbox role promised
          keyboard behaviour (active descendant, typeahead) this menu never had */}
      {open && (
        <ul
          ref={listRef}
          id={listId}
          onKeyDown={onListKeyDown}
          className="absolute right-0 top-full z-[60] mt-1.5 min-w-[11rem] rounded-xl border border-border bg-surface-elevated/95 py-1 shadow-lg backdrop-blur-md"
        >
          {languages.map((language) => (
            <li key={language.code}>
              <button
                type="button"
                lang={language.code}
                aria-current={language.code === locale ? "true" : undefined}
                onClick={() => handleLanguageChange(language.code)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors",
                  language.code === locale
                    ? "bg-brand-muted/50 text-foreground"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground",
                )}
              >
                <span className="text-base" aria-hidden>
                  {language.flag}
                </span>
                <span className="flex-1">{language.label}</span>
                {language.code === locale && (
                  <Check
                    size={14}
                    className="shrink-0 text-brand"
                    aria-hidden
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

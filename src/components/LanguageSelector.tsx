"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import type { AvailableLocale } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
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
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
          open
            ? "border-brand/40 bg-brand-muted/40 text-foreground"
            : "border-border/80 bg-surface/80 text-muted-foreground hover:border-border hover:bg-surface hover:text-foreground",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
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

      {open && (
        <ul
          className="absolute right-0 top-full z-[60] mt-1.5 min-w-[11rem] rounded-xl border border-border bg-surface-elevated/95 py-1 shadow-lg backdrop-blur-md"
          role="listbox"
        >
          {languages.map((language) => (
            <li key={language.code} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={language.code === locale}
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
                  <Check size={14} className="shrink-0 text-brand" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

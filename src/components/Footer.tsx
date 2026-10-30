import { useTranslations } from "next-intl";
import Link from "next/link";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { SECTION_IDS, SOCIAL_LINKS } from "@/config/site";

const FOOTER_LINKS = [
  { href: `#${SECTION_IDS.experience}`, labelKey: "experience" as const },
  { href: `#${SECTION_IDS.projects}`, labelKey: "projects" as const },
  { href: `#${SECTION_IDS.about}`, labelKey: "about" as const },
  { href: `#${SECTION_IDS.education}`, labelKey: "education" as const },
  { href: `#${SECTION_IDS.resume}`, labelKey: "resume" as const },
  { href: `#${SECTION_IDS.contact}`, labelKey: "contact" as const },
] as const;

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="relative z-10 mt-24 border-t border-border bg-surface/40">
      <div className="section-shell py-14 md:py-16">
        <MotionReveal
          viewportAmount={0.2}
          className="grid gap-12 md:grid-cols-12 md:gap-8"
        >
          <div className="md:col-span-5">
            <p className="font-display text-xl font-semibold tracking-tight text-foreground">
              {t("brand")}
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary">
              {t("about")}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="section-label mb-4">{t("links.title")}</p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center text-sm text-text-secondary transition-colors hover:text-brand"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      {t(`links.${item.labelKey}`)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="section-label mb-4">{t("socials.title")}</p>
            <div className="flex flex-wrap gap-2">
              {SOCIAL_LINKS.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-elevated/80 px-3 py-2 text-sm text-text-secondary transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:text-brand"
                  aria-label={s.label}
                >
                  <s.icon size={16} strokeWidth={1.75} />
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </MotionReveal>

        <div className="mt-12 border-t border-border/80 pt-8 text-center text-xs text-text-muted sm:text-left">
          <p>
            © {new Date().getFullYear()} {t("brand")} &mdash; {t("builtWith")}
          </p>
        </div>
      </div>
    </footer>
  );
}

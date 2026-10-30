import { GraduationCap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Section, SectionHeader } from "@/components/ui/Section";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { SECTION_IDS } from "@/config/site";

export default async function EducationSection() {
  const t = await getTranslations("HomePage.EducationSection");

  return (
    <Section id={SECTION_IDS.education}>
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <MotionReveal className="mt-10 max-w-2xl">
        <div className="card-glow group flex gap-5 p-6 md:p-8">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-muted text-brand transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
            <GraduationCap className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <h3 className="font-display text-xl font-semibold md:text-2xl">
              {t("school")}
            </h3>
            <p className="mt-2 text-muted-foreground">{t("degree")}</p>
            <p className="mt-1 text-sm text-text-muted">{t("meta")}</p>
          </div>
        </div>
      </MotionReveal>
    </Section>
  );
}

import { getTranslations } from "next-intl/server";
import AboutSectionClient, { type AboutContent } from "./AboutSectionClient";
import { SKILL_GROUPS } from "@/config/site";

export default async function AboutSection() {
  const t = await getTranslations("HomePage.AboutSection");

  const content: AboutContent = {
    eyebrow: t("eyebrow"),
    title: t("title"),
    description: t("description"),
    cta: t("cta"),
    skillsTitle: t("skillsTitle"),
    stats: t.raw("stats") as AboutContent["stats"],
    groups: SKILL_GROUPS.map((group) => ({
      id: group.id,
      label: t(`groups.${group.id}`),
      skills: group.keys.map((key) => ({
        key,
        label: t(`skills.${key}`),
      })),
    })),
  };

  return <AboutSectionClient content={content} />;
}

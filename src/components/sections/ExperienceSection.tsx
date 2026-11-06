import { getTranslations } from "next-intl/server";
import ExperienceSectionClient, {
  type ExperienceContent,
} from "./ExperienceSectionClient";
import { EXPERIENCE_ITEMS } from "@/config/site";

export default async function ExperienceSection() {
  const t = await getTranslations("HomePage.ExperienceSection");

  const content: ExperienceContent = {
    eyebrow: t("eyebrow"),
    title: t("title"),
    description: t("description"),
    current: t("current"),
    items: EXPERIENCE_ITEMS.map((item) => ({
      id: item.id,
      current: item.current,
      tags: item.tags,
      role: t(`items.${item.id}.role`),
      company: t(`items.${item.id}.company`),
      period: t(`items.${item.id}.period`),
      bullets: t.raw(`items.${item.id}.bullets`) as string[],
      milestone: item.milestone
        ? {
            label: t(`items.${item.id}.milestone.label`),
            date: t(`items.${item.id}.milestone.date`),
          }
        : undefined,
    })),
  };

  return <ExperienceSectionClient content={content} />;
}

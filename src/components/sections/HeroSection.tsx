import { getTranslations } from "next-intl/server";
import HeroSectionClient, { type HeroContent } from "./HeroSectionClient";

export default async function HeroSection() {
  const t = await getTranslations("HomePage.HeroSection");

  const content: HeroContent = {
    brand: t("brand"),
    eyebrow: t("eyebrow"),
    title: t("title"),
    focusPrefix: t("focusPrefix"),
    focus: t.raw("focus") as string[],
    description: t("description"),
    availability: t("availability"),
    ctaProjects: t("ctaProjects"),
    ctaContact: t("ctaContact"),
    ctaResume: t("ctaResume"),
    photoAlt: t("photoAlt"),
  };

  return <HeroSectionClient content={content} />;
}

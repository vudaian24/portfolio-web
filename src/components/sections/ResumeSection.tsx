import { getTranslations } from "next-intl/server";
import ResumeSectionClient, { type ResumeContent } from "./ResumeSectionClient";

export default async function ResumeSection() {
  const t = await getTranslations("HomePage.ResumeSection");

  const content: ResumeContent = {
    eyebrow: t("eyebrow"),
    title: t("title"),
    description: t("description"),
    button: t("button"),
  };

  return <ResumeSectionClient content={content} />;
}

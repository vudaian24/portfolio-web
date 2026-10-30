import { getTranslations } from "next-intl/server";
import ProjectsSectionClient, {
  type ProjectsContent,
} from "./ProjectsSectionClient";
import { PROJECTS } from "@/config/site";

export default async function ProjectsSection() {
  const t = await getTranslations("HomePage.Projects");

  const content: ProjectsContent = {
    eyebrow: t("eyebrow"),
    title: t("title"),
    description: t("description"),
    approach: t("approach"),
    noPublicLink: t("noPublicLink"),
    viewCaseStudy: t("viewCaseStudy"),
    items: PROJECTS.map((project) => ({
      id: project.id,
      href: project.href,
      tags: project.tags,
      title: t(`items.${project.id}.title`),
      role: t(`items.${project.id}.role`),
      team: t(`items.${project.id}.team`),
      period: t(`items.${project.id}.period`),
      summary: t(`items.${project.id}.summary`),
      bullets: t.raw(`items.${project.id}.bullets`) as string[],
      linkLabel: project.id === "portfolio" ? t("repo") : t("live"),
    })),
  };

  return <ProjectsSectionClient content={content} />;
}

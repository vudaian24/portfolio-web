import { getTranslations, setRequestLocale } from "next-intl/server";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import EducationSection from "@/components/sections/EducationSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ResumeSection from "@/components/sections/ResumeSection";
import { SITE_URL, SOCIAL_LINKS } from "@/config/site";
import { localizedUrl } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

/** Profile pages only; the Zalo link carries a phone number */
const PROFILE_URLS = SOCIAL_LINKS.filter((link) =>
  ["GitHub", "LinkedIn"].includes(link.label),
).map((link) => link.href);

export default async function Home({ params }: Props) {
  const { locale } = await params;
  // Without this, getTranslations in the sections reads the request headers
  // and the home page renders on every request instead of at build time.
  setRequestLocale(locale);

  const t = await getTranslations("Common.Metadata");
  const tEducation = await getTranslations("HomePage.EducationSection");
  const tExperience = await getTranslations("HomePage.ExperienceSection");

  // schema.org Person, for search engines (Google recommends JSON-LD)
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: t("siteName"),
    jobTitle: t("jobTitle"),
    description: t("description"),
    url: localizedUrl(locale),
    image: `${SITE_URL}/avatar.jpg`,
    sameAs: PROFILE_URLS,
    worksFor: {
      "@type": "Organization",
      name: tExperience("items.softwareEngineer.company"),
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: tEducation("school"),
    },
    knowsAbout: [
      "Kubernetes",
      "Amazon EKS",
      "Terraform",
      "AWS",
      "Argo CD",
      "Helm",
      "GitHub Actions",
      "CI/CD",
      "Prometheus",
      "Grafana",
    ],
  };

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        // Escape "<" so the JSON cannot close the script element
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(person).replace(/</g, "\\u003c"),
        }}
      />
      <HeroSection />
      <ExperienceSection />
      <ProjectsSection />
      <AboutSection />
      <EducationSection />
      <ResumeSection />
      <ContactSection />
    </div>
  );
}

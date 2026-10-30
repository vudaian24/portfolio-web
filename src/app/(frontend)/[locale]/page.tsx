import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import EducationSection from "@/components/sections/EducationSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ResumeSection from "@/components/sections/ResumeSection";

export default function Home() {
  return (
    <div className="relative">
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

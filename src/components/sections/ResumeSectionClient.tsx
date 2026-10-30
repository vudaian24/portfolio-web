"use client";

import { Download, FileText } from "lucide-react";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Section } from "@/components/ui/Section";
import { CV_PATH, SECTION_IDS } from "@/config/site";

export type ResumeContent = {
  eyebrow: string;
  title: string;
  description: string;
  button: string;
};

type ResumeSectionClientProps = {
  content: ResumeContent;
};

export default function ResumeSectionClient({
  content,
}: ResumeSectionClientProps) {
  return (
    <Section id={SECTION_IDS.resume}>
      <MotionReveal viewportAmount={0.3}>
        <div className="relative overflow-hidden rounded-3xl border border-brand/25 bg-gradient-to-br from-brand-muted via-surface-elevated/80 to-brand-subtle px-6 py-12 text-center md:px-12 md:py-16">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/20 blur-3xl"
            aria-hidden
          />
          <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-brand-foreground shadow-lg">
            <FileText className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </span>
          <p className="section-label mb-3">{content.eyebrow}</p>
          <AnimatedText
            as="h2"
            text={content.title}
            className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
          />
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground md:text-base">
            {content.description}
          </p>

          <div className="mt-8 flex justify-center">
            <a
              href={CV_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <Download
                className="btn-icon btn-icon-down h-4 w-4"
                aria-hidden
              />
              {content.button}
            </a>
          </div>
        </div>
      </MotionReveal>
    </Section>
  );
}

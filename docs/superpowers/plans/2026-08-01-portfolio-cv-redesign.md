# Portfolio CV Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio’s visual system and sync all content/IA to `public/cv.pdf`, including grouped skills, education, featured Kotae, and CASE project detail routes (EN/VI).

**Architecture:** Keep the single-page homepage + next-intl App Router. Move structured facts into `src/config/site.ts`; put all user-facing copy in `en.json` / `vi.json`. Add `/[locale]/projects/[id]` case-study pages that read the same project ids. Retune CSS tokens + fonts for an Engineer-studio look (teal/steel accent, no purple).

**Tech Stack:** Next.js 15, React 19, next-intl, Tailwind CSS 4, Framer Motion, TypeScript

## Global Constraints

- Source of truth: `public/cv.pdf` — do not invent metrics not in the CV
- Locales: `en` + `vi` only; every new string key must exist in both JSON files
- LinkedIn must be `https://linkedin.com/in/anvd24`
- Skills must match CV groups; remove `python` and `kubernetes`
- Project order: `kotae`, `starlive`, `ercBooking`, `hrm`, `portfolio`
- Featured work highlights only `kotae`
- No new test runner — verify with `npm run type-check` and `npm run lint`
- Do not change `/web-api/contact` behavior except copy that references it
- Commit message format: `<type>(<scope>): <short description>` (imperative, ≤150 chars, no period)
- Prefer editing existing section components; no unrelated refactors

---

## File map

| File | Responsibility |
|------|----------------|
| `src/config/site.ts` | Section ids, nav, socials, skill groups, project/experience config, `FEATURED_PROJECT_ID`, `isProjectId` helper |
| `src/locales/en.json` | All English copy including CASE fields, education, multi-bullet experience |
| `src/locales/vi.json` | Vietnamese mirror of the same key tree |
| `src/app/(frontend)/globals.css` | Design tokens, atmosphere, type utilities (no purple brand) |
| `src/app/(frontend)/[locale]/layout.tsx` | Fonts (display + body sans), ambient blobs retuned |
| `src/components/sections/HeroSection.tsx` + `HeroSectionClient.tsx` | Brand-first hero, CTAs, socials, no marquee |
| `src/components/sections/FeaturedWorkSection.tsx` | Kotae featured block |
| `src/components/sections/ExperienceSection.tsx` | Timeline with bullet lists |
| `src/components/sections/ProjectsSection.tsx` | Cards → case study routes |
| `src/components/sections/AboutSection.tsx` | About + grouped skills |
| `src/components/sections/EducationSection.tsx` | Education entry |
| `src/components/sections/ResumeSection.tsx` | CV CTA (copy/style pass) |
| `src/components/sections/ContactSection.tsx` | Dual-audience copy |
| `src/components/Navbar.tsx` / `Footer.tsx` | Education nav; LinkedIn via config |
| `src/app/(frontend)/[locale]/page.tsx` | Section order per spec |
| `src/app/(frontend)/[locale]/projects/[id]/page.tsx` | CASE case-study page |
| `src/i18n/navigation.ts` | Locale `Link` — use it on project routes |

---

### Task 1: Config foundation (`site.ts`)

**Files:**
- Modify: `src/config/site.ts`
- Verify: `npm run type-check`

**Interfaces:**
- Produces:
  - `SECTION_IDS.education = "education"`
  - `FEATURED_PROJECT_ID = "kotae"`
  - `SKILL_GROUPS: readonly { id: SkillGroupId; keys: readonly SkillKey[] }[]`
  - `SKILL_KEYS` flattened from groups
  - `PROJECT_IDS` order: kotae, starlive, ercBooking, hrm, portfolio
  - `isProjectId(id: string): id is ProjectId`
  - `SOCIAL_LINKS` LinkedIn → `https://linkedin.com/in/anvd24`
  - `NAV_ITEMS` includes education (home, about, experience, projects, education, resume, contact)

- [ ] **Step 1: Replace skill + project + social + section config**

Replace the skill/project/nav/social portions of `src/config/site.ts` with:

```ts
export const SECTION_IDS = {
  home: "home",
  about: "about",
  experience: "experience",
  projects: "projects",
  education: "education",
  resume: "resume",
  contact: "contact",
} as const;

// NAV_ITEMS: add education entry with GraduationCap from lucide-react
// between projects and resume:
// { href: `#${SECTION_IDS.education}`, labelKey: "education" as const, icon: GraduationCap },

export const SOCIAL_LINKS = [
  {
    href: "https://github.com/vudaian24",
    icon: Github,
    label: "GitHub",
  },
  {
    href: "https://linkedin.com/in/anvd24",
    icon: Linkedin,
    label: "LinkedIn",
  },
  {
    href: "https://zalo.me/0398270233",
    icon: PhoneCall,
    label: "Zalo",
  },
] as const satisfies ReadonlyArray<{
  href: string;
  icon: LucideIcon;
  label: string;
}>;

export const SKILL_GROUPS = [
  {
    id: "languages",
    keys: ["typescript", "javascript", "sql"],
  },
  {
    id: "frontend",
    keys: ["nextjs", "react", "vue", "tailwind", "shadcn", "vite"],
  },
  {
    id: "backend",
    keys: [
      "nestjs",
      "node",
      "express",
      "openapi",
      "socketio",
      "langchain",
    ],
  },
  {
    id: "data",
    keys: ["postgresql", "mongodb", "mysql", "redis"],
  },
  {
    id: "cloud",
    keys: [
      "aws",
      "terraform",
      "docker",
      "nginx",
      "githubActions",
      "linux",
      "grafana",
    ],
  },
  {
    id: "practices",
    keys: [
      "scrum",
      "gitflow",
      "codeReview",
      "jira",
      "postman",
      "figma",
      "turborepo",
    ],
  },
] as const;

export type SkillGroupId = (typeof SKILL_GROUPS)[number]["id"];
export type SkillKey = (typeof SKILL_GROUPS)[number]["keys"][number];

export const SKILL_KEYS = SKILL_GROUPS.flatMap(
  (g) => [...g.keys],
) as unknown as readonly SkillKey[];

export const PROJECT_IDS = [
  "kotae",
  "starlive",
  "ercBooking",
  "hrm",
  "portfolio",
] as const;

export type ProjectId = (typeof PROJECT_IDS)[number];

export const FEATURED_PROJECT_ID: ProjectId = "kotae";

export function isProjectId(id: string): id is ProjectId {
  return (PROJECT_IDS as readonly string[]).includes(id);
}

export type ProjectConfig = {
  id: ProjectId;
  href?: string;
  external?: boolean;
  tags?: readonly string[];
};

export const PROJECTS: readonly ProjectConfig[] = [
  {
    id: "kotae",
    href: "https://kotae.ai/",
    external: true,
    tags: [
      "Next.js",
      "Nest.js",
      "TypeScript",
      "MongoDB",
      "LangChain",
      "OpenAI",
      "AWS",
    ],
  },
  {
    id: "starlive",
    tags: [
      "Next.js",
      "Nest.js",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "Tencent RTC",
      "AWS",
    ],
  },
  {
    id: "ercBooking",
    tags: [
      "React",
      "Nest.js",
      "TypeScript",
      "Terraform",
      "AWS",
      "PostgreSQL",
      "GitHub Actions",
    ],
  },
  {
    id: "hrm",
    tags: ["Vue 3", "TypeScript", "Nest.js", "MySQL"],
  },
  {
    id: "portfolio",
    href: "https://github.com/vudaian24/portfolio-web",
    external: true,
    tags: [
      "Next.js",
      "TypeScript",
      "Docker",
      "Nginx",
      "GitHub Actions",
      "Telegram",
    ],
  },
] as const;

// Keep EXPERIENCE_ITEMS, CV_PATH, CONTACT_API_PATH unchanged in structure
```

Update `NAV_ITEMS` imports to include `GraduationCap`. Add `Common.nav.education` in Task 2.

- [ ] **Step 2: Type-check**

Run: `npm run type-check`  
Expected: `site.ts` itself has no TS errors. Downstream components may break until later tasks — if type-check fails only on AboutSection skill keys, proceed to Task 2 immediately in the same session before committing, or commit Task 1+2 together. Prefer fixing imports so `npm run type-check` passes before the Task 1 commit when practical.

- [ ] **Step 3: Commit**

```bash
git add src/config/site.ts
git commit -m "refactor(config): align site config with CV skills and projects"
```

---

### Task 2: Locale copy (EN + VI)

**Files:**
- Modify: `src/locales/en.json`
- Modify: `src/locales/vi.json`

**Interfaces:**
- Consumes: skill keys and project ids from Task 1
- Produces: key trees listed below (both locales must share identical key paths)

- [ ] **Step 1: Update `Common.nav`**

Add `"education": "Education"` (EN) / `"Học vấn"` (VI).

- [ ] **Step 2: Rewrite `HomePage.HeroSection`**

EN shape:

```json
"HeroSection": {
  "brand": "Dai An",
  "eyebrow": "Full-stack Software Engineer · Web · Cloud & DevOps",
  "title": "Shipping production web products end to end",
  "description": "Full-stack engineer with 3+ years in TypeScript, Next.js, and Nest.js — and primary DevOps on client work (Terraform, Docker, GitHub Actions, AWS). I deliver features across AI/RAG, real-time streaming, and scheduling products with overseas partners in English.",
  "ctaProjects": "View projects",
  "ctaContact": "Get in touch",
  "ctaResume": "Open CV",
  "photoAlt": "Portrait of Dai An"
}
```

VI: brand `"Đại An"`; translate title/description/CTAs equivalently (no invented facts).  
Remove `marqueeText` from both files.

- [ ] **Step 3: Rewrite Experience items to bullets**

Replace `description` string with `bullets` array per role.

EN `softwareEngineer.bullets`:
1. Promoted from intern within six months; now deliver features end-to-end on three concurrent client products in teams of 5–15 engineers, from technical design through code review to AWS release.
2. Serve as primary DevOps engineer across client work, standardizing Terraform IaC and GitHub Actions pipelines into reusable templates shared across projects and environments.
3. Eliminated a recurring class of frontend–backend integration defects by introducing type-safe API contracts generated from OpenAPI as a team-wide standard.
4. Uphold release quality through Gitflow code review, and own architecture documentation that shortened new-joiner ramp-up.
5. Work directly with overseas product owners and designers in English, turning business requirements into sprint-level technical plans.

EN `softwareIntern.bullets`:
1. Built Gitman, an internal Git repository management tool, from scratch with Vue.js, TypeScript, Nest.js, and MongoDB, and released it for company-wide internal use.
2. Shipped Vue 3 and TypeScript workflow features into the production HRM platform as one of 20 engineers, then moved onto client-facing product work at the end of the internship.

VI: faithful translations of the same bullets. Keep `role`, `company`, `period`, `current` keys.

- [ ] **Step 4: Expand Projects items for CASE**

For each of `kotae`, `starlive`, `ercBooking`, `hrm`, `portfolio`, set:

```json
{
  "title": "...",
  "period": "...",
  "role": "...",
  "team": "...",
  "summary": "...",
  "bullets": ["...", "...", "..."]
}
```

Use CV facts only:

| id | period | role | team | summary gist |
|----|--------|------|------|--------------|
| kotae | Aug 2024 – Present | Full-stack Developer / DevOps | Tokyo Tech Lab · team of 14 | AI chatbot SaaS for SME support: RAG + omnichannel |
| starlive | Jul 2026 – Present | Frontend Developer | Tokyo Tech Lab · team of 15 | Paid live-streaming + 1:1 video with per-minute billing |
| ercBooking | Jan 2026 – May 2026 | Full-stack Developer / DevOps | Tokyo Tech Lab · team of 5 | Clinic scheduling with RBAC + multi-env AWS |
| hrm | Apr 2024 – Oct 2024 | Front-end Developer | Tokyo Tech Lab · team of 20 | Internal HR for 50+ employees |
| portfolio | Sep 2025 – Present | Independent Developer | Solo | Multilingual portfolio, self-hosted CI/CD |

Bullets: copy from CV project bullets (3–4 each).  
Keep section-level `eyebrow`, `title`, `description`, `viewDetail`, `noPublicLink`, and add `viewCaseStudy`: `"View case study →"` / `"Xem case study →"`.

- [ ] **Step 5: About skills + groups + Education + Contact + Featured + CaseStudy**

About:
- Shorten `description` to CV professional summary (compressed).
- Replace flat `skills` map with every SkillKey label (typescript … turborepo).
- Add `groups.languages|frontend|backend|data|cloud|practices` titles.

Add:

```json
"FeaturedWork": {
  "eyebrow": "Featured",
  "title": "Selected highlight",
  "cta": "Read case study",
  "live": "Visit live site"
},
"EducationSection": {
  "eyebrow": "Education",
  "title": "Education",
  "description": "Formal training behind the work.",
  "school": "Dai Nam University",
  "degree": "Bachelor of Science in Information Technology",
  "meta": "GPA 3.58 / 4.0 · 2020 – 2024"
},
"CaseStudy": {
  "back": "Back to projects",
  "role": "Role",
  "period": "Period",
  "team": "Team",
  "stack": "Stack",
  "approach": "Approach",
  "outcome": "Outcome",
  "live": "Live site",
  "repo": "Repository",
  "noPublicLink": "Client project — no public link"
}
```

Contact `description`: open to full-time/contract **and** project collaboration.  
Footer `about`: align with summary.  
VI: translate all new keys.

- [ ] **Step 6: Type-check + commit**

Run: `npm run type-check`

```bash
git add src/locales/en.json src/locales/vi.json
git commit -m "docs(i18n): sync EN/VI copy with CV content model"
```

---

### Task 3: Visual system (tokens + fonts)

**Files:**
- Modify: `src/app/(frontend)/globals.css`
- Modify: `src/app/(frontend)/[locale]/layout.tsx`

**Interfaces:**
- Produces: CSS variables `--brand` teal/steel (~hue 210–220), surfaces without purple; `--font-body` on body; keep `--font-outfit` as display

- [ ] **Step 1: Update fonts in layout**

```tsx
import { Outfit, Source_Sans_3 } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

// body className: cn(outfit.variable, sourceSans.variable, "antialiased")
// Soften ambient blobs: opacity-[0.25]
```

Remove IBM Plex Mono import/variable if unused after this change.

- [ ] **Step 2: Retune `globals.css` tokens**

```css
:root {
  --background: oklch(0.985 0.008 220);
  --foreground: oklch(0.2 0.02 240);
  --brand: oklch(0.48 0.09 220);
  --brand-foreground: oklch(0.99 0.01 220);
  --brand-muted: oklch(0.48 0.09 220 / 0.12);
  --brand-subtle: oklch(0.48 0.09 220 / 0.06);
  --ring: oklch(0.55 0.08 220);
  /* retune border/muted/surface to cool neutrals — not purple */
}

/* dark prefers-color-scheme: lighter brand ~ oklch(0.72 0.08 220) */

body {
  font-family: var(--font-body), ui-sans-serif, system-ui, sans-serif;
}

.font-display {
  font-family: var(--font-outfit), ui-sans-serif, system-ui, sans-serif;
  letter-spacing: -0.02em;
}

.text-gradient-brand {
  color: var(--brand);
  background: none;
  -webkit-background-clip: unset;
  background-clip: unset;
}
```

Keep grid dots subtler; keep `section-shell` / `section-label`.

- [ ] **Step 3: Verify**

Run: `npm run type-check`  
Expected: PASS  
Manual: `npm run dev` — no purple cast on buttons/labels.

- [ ] **Step 4: Commit**

```bash
git add src/app/(frontend)/globals.css "src/app/(frontend)/[locale]/layout.tsx"
git commit -m "style(theme): retune portfolio to engineer studio palette"
```

---

### Task 4: Hero (brand-first)

**Files:**
- Modify: `src/components/sections/HeroSection.tsx`
- Modify: `src/components/sections/HeroSectionClient.tsx`

**Interfaces:**
- Consumes: `HomePage.HeroSection` keys; `CV_PATH`, `SOCIAL_LINKS`, `SECTION_IDS`
- Produces: brand name dominant, headline, description, 3 CTAs, socials; no marquee

- [ ] **Step 1: Update server props**

```ts
export type HeroContent = {
  brand: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaProjects: string;
  ctaContact: string;
  ctaResume: string;
  photoAlt: string;
};
```

Map all fields via `getTranslations("HomePage.HeroSection")`.

- [ ] **Step 2: Rewrite client hero layout**

```tsx
<p className="section-label mb-4">{content.eyebrow}</p>
<p className="font-display text-5xl font-semibold tracking-tight text-foreground sm:text-6xl md:text-7xl">
  {content.brand}
</p>
<h1 className="mt-4 font-display text-2xl font-semibold text-text-secondary sm:text-3xl md:text-4xl">
  {content.title}
</h1>
<p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
  {content.description}
</p>
{/* CTAs: #projects (brand), #contact (outline), CV_PATH target=_blank */}
{/* Social row: map SOCIAL_LINKS */}
```

Remove marquee. Keep framer entrance + avatar.

- [ ] **Step 3: Verify + commit**

```bash
npm run type-check
npm run lint
git add src/components/sections/HeroSection.tsx src/components/sections/HeroSectionClient.tsx
git commit -m "feat(hero): brand-first hero with CV and contact CTAs"
```

---

### Task 5: Featured work (Kotae)

**Files:**
- Create: `src/components/sections/FeaturedWorkSection.tsx`

**Interfaces:**
- Consumes: `FEATURED_PROJECT_ID`, `PROJECTS`, `Link` from `@/i18n/navigation`

- [ ] **Step 1: Implement FeaturedWorkSection**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FEATURED_PROJECT_ID, PROJECTS } from "@/config/site";
import { MotionReveal } from "@/components/ui/MotionReveal";

export default function FeaturedWorkSection() {
  const t = useTranslations("HomePage.FeaturedWork");
  const tp = useTranslations("HomePage.Projects");
  const project = PROJECTS.find((p) => p.id === FEATURED_PROJECT_ID)!;

  return (
    <Section>
      <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />
      <MotionReveal className="mt-10 border-t border-border pt-10">
        <p className="font-display text-2xl font-semibold md:text-3xl">
          {tp(`items.${project.id}.title`)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {tp(`items.${project.id}.role`)} · {tp(`items.${project.id}.period`)}
        </p>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
          {tp(`items.${project.id}.summary`)}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/projects/${project.id}`}
            className="font-display inline-flex h-11 items-center rounded-lg bg-brand px-6 text-sm font-semibold text-brand-foreground"
          >
            {t("cta")}
          </Link>
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center rounded-lg border border-border px-6 text-sm font-semibold"
            >
              {t("live")}
            </a>
          ) : null}
        </div>
      </MotionReveal>
    </Section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/FeaturedWorkSection.tsx
git commit -m "feat(projects): add Kotae featured work section"
```

---

### Task 6: Experience bullets UI

**Files:**
- Modify: `src/components/sections/ExperienceSection.tsx`

**Interfaces:**
- Consumes: `items.{id}.bullets` via `t.raw`

- [ ] **Step 1: Render bullets**

```tsx
const bullets = t.raw(`items.${item.id}.bullets`) as string[];

<ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground md:text-base">
  {bullets.map((bullet) => (
    <li key={bullet.slice(0, 24)}>{bullet}</li>
  ))}
</ul>
```

Prefer lighter timeline entries (less card chrome) per “default no cards”.

- [ ] **Step 2: Commit**

```bash
npm run type-check
git add src/components/sections/ExperienceSection.tsx
git commit -m "feat(experience): render CV-aligned bullet timelines"
```

---

### Task 7: Projects grid → case studies

**Files:**
- Modify: `src/components/sections/ProjectsSection.tsx`

**Interfaces:**
- Consumes: `Link` from `@/i18n/navigation`; summary/role/period keys

- [ ] **Step 1: Update cards**

- Wrap interactive card with `<Link href={`/projects/${project.id}`}>`.
- Show title, period, role, summary (not old `description`).
- Tags from config.
- Footer: `viewCaseStudy`; if `!project.href` also show `noPublicLink` note.

- [ ] **Step 2: Commit**

```bash
npm run type-check
git add src/components/sections/ProjectsSection.tsx
git commit -m "feat(projects): link project cards to case study routes"
```

---

### Task 8: Case study page

**Files:**
- Create: `src/app/(frontend)/[locale]/projects/[id]/page.tsx`

**Interfaces:**
- Consumes: `isProjectId`, `PROJECTS`, next-intl, `Link`

- [ ] **Step 1: Create page**

```tsx
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { isProjectId, PROJECTS } from "@/config/site";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PROJECTS.map((p) => ({ locale, id: p.id })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params;
  if (!isProjectId(id)) return {};
  const t = await getTranslations({ locale, namespace: "HomePage.Projects" });
  return { title: t(`items.${id}.title`) };
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  if (!isProjectId(id)) notFound();

  const project = PROJECTS.find((p) => p.id === id)!;
  const t = await getTranslations("HomePage.CaseStudy");
  const tp = await getTranslations("HomePage.Projects");
  const bullets = tp.raw(`items.${id}.bullets`) as string[];

  return (
    <article className="section-shell py-12 md:py-16">
      <Link href={{ pathname: "/", hash: "projects" }} className="text-sm font-medium text-brand">
        {t("back")}
      </Link>
      <h1 className="font-display mt-6 text-3xl font-semibold md:text-5xl">
        {tp(`items.${id}.title`)}
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
        {tp(`items.${id}.summary`)}
      </p>
      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wider text-text-muted">{t("role")}</dt>
          <dd className="mt-1 font-medium">{tp(`items.${id}.role`)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-text-muted">{t("period")}</dt>
          <dd className="mt-1 font-medium">{tp(`items.${id}.period`)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-text-muted">{t("team")}</dt>
          <dd className="mt-1 font-medium">{tp(`items.${id}.team`)}</dd>
        </div>
      </dl>
      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold">{t("approach")}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
          {bullets.map((b) => (
            <li key={b.slice(0, 32)}>{b}</li>
          ))}
        </ul>
      </section>
      {project.tags?.length ? (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold">{t("stack")}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag} className="rounded-md border border-border px-2.5 py-1 text-sm">
                {tag}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <div className="mt-12 flex flex-wrap gap-3">
        {project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-lg bg-brand px-6 text-sm font-semibold text-brand-foreground"
          >
            {project.id === "portfolio" ? t("repo") : t("live")}
          </a>
        ) : (
          <p className="text-sm text-text-muted">{t("noPublicLink")}</p>
        )}
      </div>
    </article>
  );
}
```

If `Link` hash object form fails types, fallback: `<a href="/#projects">` (respect localePrefix as-needed).

- [ ] **Step 2: Verify**

Run: `npm run type-check`  
Manual: `/projects/kotae`, `/vi/projects/starlive`; bad id → 404.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(frontend)/[locale]/projects"
git commit -m "feat(projects): add CASE case study pages per project"
```

---

### Task 9: About + grouped skills

**Files:**
- Modify: `src/components/sections/AboutSection.tsx`

**Interfaces:**
- Consumes: `SKILL_GROUPS`; `groups.*` + `skills.*`

- [ ] **Step 1: Grouped skills UI**

```tsx
import { SKILL_GROUPS } from "@/config/site";

{SKILL_GROUPS.map((group) => (
  <div key={group.id} className="mt-6">
    <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
      {t(`groups.${group.id}`)}
    </h4>
    <ul className="mt-3 flex flex-wrap gap-2">
      {group.keys.map((key) => (
        <li key={key}>
          <span className="inline-flex items-center rounded-lg border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-medium md:text-sm">
            {t(`skills.${key}`)}
          </span>
        </li>
      ))}
    </ul>
  </div>
))}
```

Avoid heavy card wrapper around skills when possible.

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/AboutSection.tsx
git commit -m "feat(about): group skills to match CV categories"
```

---

### Task 10: Education section

**Files:**
- Create: `src/components/sections/EducationSection.tsx`

**Interfaces:**
- Consumes: `SECTION_IDS.education`, `HomePage.EducationSection`

- [ ] **Step 1: Implement**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Section, SectionHeader } from "@/components/ui/Section";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { SECTION_IDS } from "@/config/site";

export default function EducationSection() {
  const t = useTranslations("HomePage.EducationSection");
  return (
    <Section id={SECTION_IDS.education}>
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <MotionReveal className="mt-10 max-w-2xl">
        <h3 className="font-display text-xl font-semibold md:text-2xl">
          {t("school")}
        </h3>
        <p className="mt-2 text-muted-foreground">{t("degree")}</p>
        <p className="mt-1 text-sm text-text-muted">{t("meta")}</p>
      </MotionReveal>
    </Section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/EducationSection.tsx
git commit -m "feat(education): add education section from CV"
```

---

### Task 11: Contact, Resume, Nav, homepage order

**Files:**
- Modify: `src/app/(frontend)/[locale]/page.tsx`
- Modify: `src/components/Navbar.tsx` (if labelKey typing needs education)
- Modify: `src/components/sections/ResumeSection.tsx` (light style pass)
- Modify: `src/components/Footer.tsx` (ensure education link if footer lists sections)

**Interfaces:**
- Homepage order: Hero → Featured → Experience → Projects → About → Education → Resume → Contact

- [ ] **Step 1: Update page.tsx**

```tsx
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import EducationSection from "@/components/sections/EducationSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import FeaturedWorkSection from "@/components/sections/FeaturedWorkSection";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ResumeSection from "@/components/sections/ResumeSection";

export default function Home() {
  return (
    <div className="relative">
      <HeroSection />
      <FeaturedWorkSection />
      <ExperienceSection />
      <ProjectsSection />
      <AboutSection />
      <EducationSection />
      <ResumeSection />
      <ContactSection />
    </div>
  );
}
```

- [ ] **Step 2: Full verify**

```bash
npm run type-check
npm run lint
npm run build
```

Expected: all PASS. Spot-check EN/VI hero, featured, `/projects/kotae`, education, LinkedIn `anvd24`, CV button.

- [ ] **Step 3: Commit**

```bash
git add src/app/(frontend)/[locale]/page.tsx src/components/Navbar.tsx src/components/Footer.tsx src/components/sections/ResumeSection.tsx src/components/sections/ContactSection.tsx
git commit -m "feat(home): reorder sections and polish contact resume nav"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Engineer studio visual / no purple | 3 |
| Brand-first hero + CTAs + CV | 4 |
| Featured Kotae | 5 |
| Experience CV bullets | 2, 6 |
| Projects CASE routes | 7, 8 |
| Grouped skills per CV | 1, 2, 9 |
| Education | 2, 10 |
| LinkedIn anvd24 | 1 |
| Dual-audience contact | 2, 11 |
| Homepage order | 11 |
| EN/VI sync | 2 |
| No contact API behavior change | 11 (copy only) |

## Self-review notes

- No TBD placeholders; do not invent CV metrics.
- `SKILL_KEYS` derived from `SKILL_GROUPS` — remove python/kubernetes from locales.
- Case study back-link: prefer next-intl `Link` hash form; fallback to `<a href="/#projects">`.
- `docker-compose.yml` / binary CV updates are out of this plan unless handled separately.

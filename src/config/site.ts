import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  FileText,
  Github,
  GraduationCap,
  History,
  Home,
  Linkedin,
  Mail,
  PhoneCall,
  User,
} from "lucide-react";

export const SITE_URL = "https://portfolio.anvd.io.vn";

export const SECTION_IDS = {
  home: "home",
  about: "about",
  experience: "experience",
  projects: "projects",
  education: "education",
  resume: "resume",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/** Matches homepage scroll order */
export const NAV_ITEMS = [
  { href: `#${SECTION_IDS.home}`, labelKey: "home" as const, icon: Home },
  {
    href: `#${SECTION_IDS.experience}`,
    labelKey: "experience" as const,
    icon: History,
  },
  {
    href: `#${SECTION_IDS.projects}`,
    labelKey: "projects" as const,
    icon: Briefcase,
  },
  { href: `#${SECTION_IDS.about}`, labelKey: "about" as const, icon: User },
  {
    href: `#${SECTION_IDS.education}`,
    labelKey: "education" as const,
    icon: GraduationCap,
  },
  {
    href: `#${SECTION_IDS.resume}`,
    labelKey: "resume" as const,
    icon: FileText,
  },
  { href: `#${SECTION_IDS.contact}`, labelKey: "contact" as const, icon: Mail },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

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
    id: "containers",
    keys: ["kubernetes", "helm", "argocd", "kubectl", "docker", "compose"],
  },
  {
    id: "cicd",
    keys: ["githubActions", "gitlabCi", "jenkins", "liquibase"],
  },
  {
    id: "iac",
    keys: ["terraform", "bash", "python", "jq"],
  },
  {
    id: "cloud",
    keys: [
      "eks",
      "ecsFargate",
      "vpc",
      "aurora",
      "elasticache",
      "cloudfrontWaf",
      "sqsSes",
      "iam",
      "secretsManager",
      "cloudflare",
    ],
  },
  {
    id: "linux",
    keys: ["linux", "systemd", "nginx", "proxmox"],
  },
  {
    id: "observability",
    keys: ["prometheus", "grafana", "cloudwatch"],
  },
  {
    id: "data",
    keys: ["postgresql", "mysql", "mongodb", "redis"],
  },
] as const;

export type SkillGroupId = (typeof SKILL_GROUPS)[number]["id"];
export type SkillKey = (typeof SKILL_GROUPS)[number]["keys"][number];

export const SKILL_KEYS = SKILL_GROUPS.flatMap((g) => [
  ...g.keys,
]) as unknown as readonly SkillKey[];

export const PROJECT_IDS = ["portfolio", "ercBooking", "kotae"] as const;

export type ProjectId = (typeof PROJECT_IDS)[number];

export function projectAnchorId(id: ProjectId) {
  return `project-${id}`;
}

export function isProjectId(id: string): id is ProjectId {
  return (PROJECT_IDS as readonly string[]).includes(id);
}

export type ProjectConfig = {
  id: ProjectId;
  /** Omit for client/internal work with no public URL */
  href?: string;
  external?: boolean;
  tags?: readonly string[];
};

export const PROJECTS: readonly ProjectConfig[] = [
  {
    id: "portfolio",
    href: "https://github.com/vudaian24/portfolio-web",
    external: true,
    tags: [
      "Amazon EKS",
      "Terraform",
      "Argo CD",
      "Helm",
      "Cloudflare",
      "GitHub Actions",
      "Prometheus",
    ],
  },
  {
    id: "ercBooking",
    tags: [
      "Terraform",
      "ECS Fargate",
      "Aurora PostgreSQL",
      "ElastiCache",
      "CloudFront + WAF",
      "SQS / SES",
      "GitHub Actions",
      "Liquibase",
    ],
  },
  {
    id: "kotae",
    href: "https://kotae.ai/",
    external: true,
    tags: [
      "Kubernetes",
      "Helm",
      "Docker",
      "kubectl",
      "AWS Bedrock",
      "Terraform",
      "GitHub Actions",
    ],
  },
] as const;

/** DevOps CV, the only CV the site offers */
export const CV_PATH = "/cv.pdf";

export const CONTACT_API_PATH = "/web-api/contact";

export const EXPERIENCE_IDS = ["softwareEngineer", "softwareIntern"] as const;

export type ExperienceId = (typeof EXPERIENCE_IDS)[number];

export type ExperienceConfig = {
  id: ExperienceId;
  current?: boolean;
  tags?: readonly string[];
};

/** Reverse-chronological work timeline */
export const EXPERIENCE_ITEMS: readonly ExperienceConfig[] = [
  {
    id: "softwareEngineer",
    current: true,
    tags: [
      "Kubernetes",
      "Helm",
      "Terraform",
      "AWS",
      "Jenkins",
      "GitLab CI",
      "GitHub Actions",
      "Bash",
    ],
  },
  {
    id: "softwareIntern",
  },
] as const;

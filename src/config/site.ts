import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  FileText,
  GraduationCap,
  History,
  Home,
  Mail,
  PhoneCall,
  User,
} from "lucide-react";

import { Github, Linkedin } from "@/lib/brandIcons";
import type { TechIconId, TechTag } from "@/lib/techIcons";

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
    keys: [
      "kubernetes",
      "helm",
      "argocd",
      "externalSecrets",
      "docker",
      "compose",
    ],
  },
  {
    id: "cicd",
    keys: ["githubActions", "jenkins", "liquibase", "sonarqube", "tflintTrivy"],
  },
  {
    id: "iac",
    keys: ["terraform", "bash", "python"],
  },
  {
    id: "linux",
    keys: ["linux", "nginx", "systemd"],
  },
  {
    id: "cloud",
    keys: [
      "ecsFargate",
      "eks",
      "ecr",
      "vpc",
      "aurora",
      "elasticache",
      "cloudfrontWaf",
      "sqsSes",
      "lambda",
      "iam",
      "oidcPodIdentity",
      "secretsManager",
      "ssm",
      "cloudflare",
    ],
  },
  {
    id: "observability",
    keys: ["prometheus", "grafana", "cloudwatch"],
  },
  {
    id: "data",
    keys: ["postgresql", "mysql", "mongodb", "redis"],
  },
  {
    id: "dev",
    keys: ["typescript", "nodejs"],
  },
] as const;

export type SkillGroupId = (typeof SKILL_GROUPS)[number]["id"];
export type SkillKey = (typeof SKILL_GROUPS)[number]["keys"][number];

/** Logos shown before each skill label (see src/lib/techIcons.ts) */
export const SKILL_ICONS: Record<SkillKey, readonly TechIconId[]> = {
  kubernetes: ["kubernetes"],
  helm: ["helm"],
  argocd: ["argo"],
  externalSecrets: ["externalSecrets"],
  docker: ["docker"],
  compose: ["docker"],
  githubActions: ["githubActions"],
  jenkins: ["jenkins"],
  liquibase: ["liquibase"],
  sonarqube: ["sonarqube"],
  tflintTrivy: ["trivy"],
  terraform: ["terraform"],
  bash: ["bash"],
  python: ["python"],
  linux: ["linux"],
  nginx: ["nginx"],
  systemd: ["systemd"],
  ecsFargate: ["awsEcs", "awsFargate"],
  eks: ["awsEks"],
  ecr: ["awsEcr"],
  vpc: ["awsVpc"],
  aurora: ["awsAurora"],
  elasticache: ["awsElasticache"],
  cloudfrontWaf: ["awsCloudfront", "awsWaf"],
  sqsSes: ["awsSqs", "awsSes"],
  lambda: ["awsLambda", "awsEventbridge"],
  iam: ["awsIam"],
  oidcPodIdentity: ["awsIam", "awsEks"],
  secretsManager: ["awsSecretsManager"],
  ssm: ["awsSystemsManager"],
  cloudflare: ["cloudflare"],
  prometheus: ["prometheus"],
  grafana: ["grafana"],
  cloudwatch: ["awsCloudwatch"],
  postgresql: ["postgresql"],
  mysql: ["mysql"],
  mongodb: ["mongodb"],
  redis: ["redis"],
  typescript: ["typescript"],
  nodejs: ["nodejs", "nestjs"],
};

/** Same order as the DevOps CV */
export const PROJECT_IDS = ["ercBooking", "kotae", "portfolio"] as const;

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
  /** Every tag needs an entry in TAG_ICONS */
  tags?: readonly TechTag[];
};

export const PROJECTS: readonly ProjectConfig[] = [
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
      "AWS Bedrock",
      "OpenAI",
      "Gemini",
      "LangChain",
      "Docker",
      "EKS",
      "Argo CD",
      "Helm",
      "GitHub Actions",
    ],
  },
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
      "External Secrets",
      "Lambda",
      "Prometheus",
      "Grafana Cloud",
    ],
  },
] as const;

/** DevOps CV, the only CV the site offers */
export const CV_PATH = "/cv-devops.pdf";

export const CONTACT_API_PATH = "/web-api/contact";

export const EXPERIENCE_IDS = ["softwareEngineer", "softwareIntern"] as const;

export type ExperienceId = (typeof EXPERIENCE_IDS)[number];

export type ExperienceConfig = {
  id: ExperienceId;
  current?: boolean;
  /** Show the `items.<id>.milestone` marker (label, date) after this role on the timeline */
  milestone?: boolean;
  /** Every tag needs an entry in TAG_ICONS */
  tags?: readonly TechTag[];
};

/** Reverse-chronological work timeline */
export const EXPERIENCE_ITEMS: readonly ExperienceConfig[] = [
  {
    id: "softwareEngineer",
    current: true,
    milestone: true,
    tags: [
      "Terraform",
      "AWS",
      "ECS Fargate",
      "GitHub Actions",
      "Jenkins",
      "SonarQube",
      "LocalStack",
      "Bash",
    ],
  },
  {
    id: "softwareIntern",
  },
] as const;

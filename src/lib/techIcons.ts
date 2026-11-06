// Icons for the tech-skill chips (About skills, project tags, case study stack).
//
// Every icon is a static SVG under public/icons:
// - public/icons/aws: AWS Architecture Icons (official asset package, 48 px
//   service icons), used for AWS services.
// - public/icons/brands: brand logos from Simple Icons (CC0, brand colour
//   baked in), plus the official External Secrets (Apache-2.0), jq and systemd
//   (LGPL-2.1) logos, and a neutral sparkle for OpenAI, which has no Simple
//   Icons entry.
//
// `tone` marks logos whose brand colour lacks contrast on one theme: "dark"
// logos are lightened in dark mode, "light" logos darkened in light mode
// (see .tech-icon in globals.css).

export type TechIcon = {
  src: string;
  tone?: "dark" | "light";
};

const aws = (name: string): TechIcon => ({ src: `/icons/aws/${name}.svg` });
const brand = (name: string, tone?: TechIcon["tone"]): TechIcon => ({
  src: `/icons/brands/${name}.svg`,
  ...(tone ? { tone } : {}),
});

export const TECH_ICONS = {
  // AWS services
  awsAurora: aws("aurora"),
  awsBedrock: aws("bedrock"),
  awsCloudfront: aws("cloudfront"),
  awsCloudwatch: aws("cloudwatch"),
  awsEcr: aws("ecr"),
  awsEcs: aws("ecs"),
  awsEks: aws("eks"),
  awsElasticache: aws("elasticache"),
  awsEventbridge: aws("eventbridge"),
  awsFargate: aws("fargate"),
  awsIam: aws("iam"),
  awsLambda: aws("lambda"),
  awsSecretsManager: aws("secrets-manager"),
  awsSes: aws("ses"),
  awsSqs: aws("sqs"),
  awsSystemsManager: aws("systems-manager"),
  awsVpc: aws("vpc"),
  awsWaf: aws("waf"),
  // Tools and brands
  argo: brand("argo"),
  bash: brand("gnubash"),
  cloudflare: brand("cloudflare"),
  docker: brand("docker"),
  externalSecrets: brand("external-secrets"),
  gemini: brand("googlegemini"),
  githubActions: brand("githubactions"),
  grafana: brand("grafana"),
  helm: brand("helm", "dark"),
  jenkins: brand("jenkins"),
  jq: brand("jq", "dark"),
  kubernetes: brand("kubernetes"),
  langchain: brand("langchain", "light"),
  linux: brand("linux", "light"),
  liquibase: brand("liquibase"),
  mongodb: brand("mongodb"),
  mysql: brand("mysql"),
  nginx: brand("nginx"),
  openai: brand("openai"),
  postgresql: brand("postgresql"),
  prometheus: brand("prometheus"),
  proxmox: brand("proxmox"),
  python: brand("python"),
  redis: brand("redis"),
  systemd: brand("systemd"),
  terraform: brand("terraform"),
  trivy: brand("trivy", "dark"),
} as const satisfies Record<string, TechIcon>;

export type TechIconId = keyof typeof TECH_ICONS;

/** Project and case-study tags; each tag shows its icons before the label. */
export const TAG_ICONS = {
  "Amazon EKS": ["awsEks"],
  "Argo CD": ["argo"],
  "Aurora PostgreSQL": ["awsAurora"],
  "AWS Bedrock": ["awsBedrock"],
  "CloudFront + WAF": ["awsCloudfront", "awsWaf"],
  Cloudflare: ["cloudflare"],
  Docker: ["docker"],
  "ECS Fargate": ["awsEcs", "awsFargate"],
  EKS: ["awsEks"],
  ElastiCache: ["awsElasticache"],
  "External Secrets": ["externalSecrets"],
  Gemini: ["gemini"],
  "GitHub Actions": ["githubActions"],
  "Grafana Cloud": ["grafana"],
  Helm: ["helm"],
  Lambda: ["awsLambda"],
  LangChain: ["langchain"],
  Liquibase: ["liquibase"],
  OpenAI: ["openai"],
  Prometheus: ["prometheus"],
  "SQS / SES": ["awsSqs", "awsSes"],
  Terraform: ["terraform"],
} as const satisfies Record<string, readonly TechIconId[]>;

export type TechTag = keyof typeof TAG_ICONS;

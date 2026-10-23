# portfolio-web

Personal portfolio and live CV of Dai An, in English and Vietnamese. Live at [portfolio.anvd.io.vn](https://portfolio.anvd.io.vn).

## Tech stack

Versions are taken from `package.json`.

- Next.js 15.5.28 (App Router, `output: "standalone"`), React 19.1.10, TypeScript 5 (strict)
- Tailwind CSS 4 (`@tailwindcss/postcss`), `tailwind-merge`, `clsx`
- `next-intl` ^4.14.9 for routing and translations
- `motion` ^14.5.0 (animations), `lucide-react` ^0.542.0, `next-themes` ^0.4.6
- `react-hook-form` ^7.62.0 with `zod` ^4.1.8 and `@hookform/resolvers` ^5.2.2
- `sharp` ^0.34.2 (image processing)
- Tooling: ESLint 9, Prettier 3, Husky 9, lint-staged 16
- Package manager: Yarn 1 (`yarn.lock` is the source of truth)

## Getting started

Requirements: Node.js 24 (same as the Dockerfile and CI) and Yarn 1.

```bash
yarn install --frozen-lockfile
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). The `postinstall` hook installs Husky git hooks.

| Command | Purpose |
| ------- | ------- |
| `yarn dev` | Development server (`next dev --turbopack`) |
| `yarn build` | Production build (`next build`, webpack) |
| `yarn start` | Serve the production build |
| `yarn build:turbo` | Turbopack production build (not used in CI or Docker) |
| `yarn lint` | ESLint with zero warnings allowed |
| `yarn type-check` | TypeScript check (`tsc --noEmit`) |
| `yarn lint-staged` | ESLint `--fix` and Prettier on staged files (run by the pre-commit hook) |

Prettier has no config file in this repo, so its defaults apply: `yarn prettier --write <files>`.

## Environment variables

Used by the server-side contact route `POST /web-api/contact`. Set them in your local shell or deploy environment. Never commit them.

| Name | Purpose |
| ---- | ------- |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token used to send contact form messages |
| `TELEGRAM_CHAT_ID` | Telegram chat that receives the messages |

Without both values the endpoint returns a server configuration error.

## Project structure

```text
src/
  app/
    (frontend)/
      [locale]/          localized routes: home, projects/[id]
      layout.tsx         root layout and globals.css
    web-api/contact/     POST route: validates with zod, sends to Telegram
    web-api/health/      GET route: health check for probes, returns the app version
    robots.ts, sitemap.ts
  components/            sections/, ui/, Navbar, Footer, and other shared components
  config/site.ts         site-level configuration
  i18n/                  next-intl routing, request config, navigation
  lib/                   contact schema, utilities, animation helpers, types
  locales/               en.json and vi.json (UI strings)
  middleware.ts          next-intl middleware
public/                  avatar, CV PDFs, static assets
docs/superpowers/        dated plans and specs for the CV redesign
```

## Internationalization

- Locales: `en` (default, no URL prefix) and `vi` (`/vi/...`). Locale detection is off, so the URL decides the locale.
- The middleware skips `/web-api`, `/_next`, and any path containing a dot.
- `src/locales/en.json` and `src/locales/vi.json` must have the same keys. Add every new UI string to both files in the same change.

## Docker

The Dockerfile is multi-stage on `node:24-alpine`. It builds with `next build` and runs the standalone server as a non-root user on port 3000, with a health check on `/web-api/health`. Pass the git SHA as `--build-arg APP_VERSION=<sha>`; every response then carries it in the `x-app-version` header.

```bash
docker build -t portfolio-web .
docker run --rm -p 3000:3000 -e TELEGRAM_BOT_TOKEN -e TELEGRAM_CHAT_ID portfolio-web
```

The `-e NAME` form passes the values from your current shell, so no secret is written to the command line.

## Deployment

- [portfolio.anvd.io.vn](https://portfolio.anvd.io.vn) runs on Amazon EKS behind the Cloudflare proxy. The Vercel project is kept for rollback.
- GitHub Actions (`.github/workflows/main.yml`) runs `ci.yml` (lint, type check, build) on pull requests and pushes to `main`. On push to `main`, the `deploy` job runs only when the repository variable `AWS_DEPLOY_ENABLED` is `true`; the `aws-production` environment then requires reviewer approval. It builds a `linux/arm64` image on a native arm64 runner, pushes it to ECR (`portfolio-prod-web`, tagged with the git SHA), and sets the tag in `portfolio-gitops`. It then waits for `x-app-version`, smoke-tests the site, and reverts the tag on failure. `workflow_dispatch` with `image_tag` redeploys an existing image. The first deploy is `workflow_dispatch` with `bootstrap` set to `true`, run from `main` after the cluster bootstrap in the workspace runbook `docs/runbooks/cluster-operations.md`. It builds the image if needed, writes the first tag to `portfolio-gitops`, and skips the wait and the smoke test. It is refused unless `image.tag` is still empty; a push or an `image_tag` redeploy is refused while it is empty. Each run takes exactly one of `image_tag` and `bootstrap`.
- Hosting on Amazon EKS for about 44 days, behind an ALB and the Cloudflare proxy. Argo CD deploys the app chart from the [portfolio-gitops](https://github.com/vudaian24/portfolio-gitops) repository. CI builds the `linux/arm64` image, pushes it to ECR with OIDC, and commits the new image tag to `portfolio-gitops`. The app supports it with Node 24, no `@vercel/analytics`, the `x-app-version` header and `/web-api/health`. The design records are kept in the private workspace repository.

## AI usage policy (ISMS-AI-01)

This repo follows TTLab's internal **Quy định sử dụng công cụ AI và Chatbot an toàn** (ISMS-AI-01, v1.0) when using AI tools / coding assistants:

- Never input passwords, API keys, tokens, credentials, personal data, or trade secrets into an AI tool without written approval.
- Don't grant AI tools full repo/credential access by default — scope to what's needed.
- AI must not autonomously send external communications, modify production data, or merge/deploy code without human approval.
- Report any accidental data exposure or unexpected AI/agent action to TTLab's information security team immediately.

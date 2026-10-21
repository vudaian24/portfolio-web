# portfolio-web

Personal portfolio and live CV of Dai An, in English and Vietnamese. Live at [portfolio.anvd.io.vn](https://portfolio.anvd.io.vn).

## Tech stack

Versions are taken from `package.json`.

- Next.js 15.5.9 (App Router, `output: "standalone"`), React 19.1.0, TypeScript 5 (strict)
- Tailwind CSS 4 (`@tailwindcss/postcss`), `tailwind-merge`, `clsx`, `tailwindcss-animate`
- `next-intl` ^4.3.5 for routing and translations
- `framer-motion` ^12.23.12, `lucide-react` ^0.542.0, `next-themes` ^0.4.6
- `react-hook-form` ^7.62.0 with `zod` ^4.1.8 and `@hookform/resolvers` ^5.2.2
- `sharp` ^0.34.2 (image processing), `@vercel/analytics` ^2.0.1
- Tooling: ESLint 9, Prettier 3, Husky 9, lint-staged 16
- Package manager: Yarn 1 (`yarn.lock` is the source of truth)

## Getting started

Requirements: Node.js 20 (same as the Dockerfile and CI) and Yarn 1.

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

The Dockerfile is multi-stage on `node:20-alpine`. It builds with `next build` and runs the standalone server as a non-root user on port 3000, with a health check.

```bash
docker build -t portfolio-web .
docker run --rm -p 3000:3000 -e TELEGRAM_BOT_TOKEN -e TELEGRAM_CHAT_ID portfolio-web
```

The `-e NAME` form passes the values from your current shell, so no secret is written to the command line.

## Deployment

- Production is served by Vercel at [portfolio.anvd.io.vn](https://portfolio.anvd.io.vn).
- The GitHub Actions pipeline (`.github/workflows/`) is legacy. `main.yml` runs `ci.yml` (lint and type check) on push and pull request to `main`. On push to `main`, `cd.yml` builds and pushes the image to GHCR, then `deploy.yml` deploys it over SSH to a VPS. The deploy step currently fails because the VPS SSH endpoint is unreachable.
- Planned: move hosting to AWS for a run of 2 to 3 months. One EC2 instance in a VPC runs this image with Docker Compose, behind Caddy and the Cloudflare proxy. Deploys will push the image to ECR and restart it through SSM Run Command, from GitHub Actions with OIDC. Before that, the Dockerfile and CI move to Node 24, `@vercel/analytics` is removed, and the image is built for `linux/arm64`. The design records are kept in the private workspace repository.

## AI usage policy (ISMS-AI-01)

This repo follows TTLab's internal **Quy định sử dụng công cụ AI và Chatbot an toàn** (ISMS-AI-01, v1.0) when using AI tools / coding assistants:

- Never input passwords, API keys, tokens, credentials, personal data, or trade secrets into an AI tool without written approval.
- Don't grant AI tools full repo/credential access by default — scope to what's needed.
- AI must not autonomously send external communications, modify production data, or merge/deploy code without human approval.
- Report any accidental data exposure or unexpected AI/agent action to TTLab's information security team immediately.

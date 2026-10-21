# AGENTS.md — portfolio-web

Personal portfolio site for Dai An. Next.js App Router, bilingual (en, vi). Public repo: github.com/vudaian24/portfolio-web. Workspace context (AWS migration, cross-repo rules) lives in the parent `../docs/`; this file covers this repo only.

## Stack (from package.json, next.config.ts)

- Next.js 15.5.9 (`output: "standalone"`), React 19.1.0, TypeScript 5 (`strict`).
- Tailwind CSS 4 via `@tailwindcss/postcss`; `tailwind-merge`, `clsx`, `tailwindcss-animate`.
- `next-intl` 4 (locales `en` default and `vi`, `localePrefix: as-needed`, `localeDetection: false`).
- `framer-motion`, `lucide-react`, `next-themes`, `react-hook-form` with `zod` 4, `@vercel/analytics`, `sharp`.
- Package manager: Yarn 1 (`yarn.lock` is the source of truth). Do not add `package-lock.json` or `pnpm-lock.yaml`.
- Node 20 in CI and Docker. Local Node 25 was seen; prefer Node 20 to match CI.

## Commands

Run from `portfolio-web/`.

- Install: `yarn install --frozen-lockfile`. The `postinstall` hook runs `husky`.
- Dev server: `yarn dev` (`next dev --turbopack`), http://localhost:3000.
- Build: `yarn build` (webpack). `yarn build:turbo` exists but is not used in CI or Docker.
- Start after build: `yarn start`.
- Lint: `yarn lint` (`eslint . --ext .ts,.tsx,.js,.jsx --max-warnings=0`). Zero warnings allowed. Verified passing.
- Type check: `yarn type-check` (`tsc --noEmit --pretty`).
- Format: `yarn prettier --write <files>`. No `.prettierrc` is present, so Prettier defaults apply.
- Pre-commit: `.husky/pre-commit` runs `yarn lint-staged`, which runs `eslint --fix` then `prettier --write` on staged JS/TS files.
- Docker build (from Dockerfile, not run here): `docker build -t portfolio-web .`

Before reporting a change as done, run `yarn lint` and `yarn type-check`.

## Layout

- `src/app/(frontend)/[locale]/` — localized routes: `page.tsx` (home), `projects/[id]/page.tsx`, `layout.tsx`.
- `src/app/(frontend)/layout.tsx`, `globals.css` — root layout and global styles.
- `src/app/web-api/contact/route.ts` — POST contact endpoint. Validates with zod, then sends to Telegram.
- `src/app/robots.ts`, `sitemap.ts`, `favicon.ico`.
- `src/middleware.ts` — next-intl middleware. Skips `/web-api`, `/_next`, and any path containing a dot.
- `src/i18n/` — `routing.ts`, `request.ts`, `navigation.ts`.
- `src/locales/en.json`, `src/locales/vi.json` — UI strings. Both have 184 leaf keys today.
- `src/components/` — `sections/` (page sections; many come as a server file plus a `*Client.tsx` pair), `ui/` (shared primitives), plus Navbar, Footer, ThemeToggle, LanguageSelector.
- `src/config/site.ts` — site-level config.
- `src/lib/` — `contact.ts` (zod schema, `escapeTelegramHtml`), `utils.ts`, `animation.ts`, `types.ts`.
- `public/` — `avatar.jpg`, `cv.pdf`, `cv-devops.pdf`.
- `docs/superpowers/` — dated plans and specs for the CV redesign.
- `README.md` is create-next-app boilerplate. Its paths (`app/page.tsx`) and Vercel text are outdated. Do not follow them.

## Configuration facts

- Server env vars: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, read by the contact route. Values live in a local, git-ignored `.env` file or in the deploy environment. Never open `.env*`.
- `next.config.ts` sets security headers on all routes: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`. Keep them unless the user asks to change them.
- Image config: `remotePatterns` allows `https://placehold.co` only. `dangerouslyAllowSVG` is on.
- `Dockerfile` (`node:20-alpine`, multi-stage) uses `HUSKY=0`, `CI=true`, `yarn install --frozen-lockfile`, and `yarn next build` (webpack). Its runner copies `src/locales` because next-intl loads locale JSON at runtime.

## CI/CD as it is today

Pipeline lives in `.github/workflows/`. Note: production is on Vercel. The VPS path below is legacy and its host is unreachable.

- `main.yml` ("Pipeline") — triggers on push and PR to `main`, and on `workflow_dispatch` with a `rollback_tag` input. Workflow-level permissions: `contents: read`, `packages: write`. Keep permissions at workflow level, not job level; job-level settings broke the run.
- `ci.yml` — composite action `.github/actions/setup-node` (Node 20, Yarn cache, Next.js cache, `yarn install --frozen-lockfile`), then `yarn lint` and `yarn type-check`.
- `cd.yml` — on push to `main` after CI: buildx build and push to `ghcr.io/<owner>/portfolio-web` tagged `latest` and the commit SHA, then calls `deploy.yml`.
- `deploy.yml` — legacy. SSHes to a VPS as user `ci`, sets `APP_VERSION` in the server's `.env`, runs `docker compose pull` and `up -d --wait`, health-checks `https://portfolio.anvd.io.vn`, and sends a Telegram message. The SSH host key is pinned in the file. Do not edit or run it without the user's explicit instruction.

## Rules

- Branch from `main`. Use conventional commits (`feat`, `fix`, `chore`, `docs`, `perf`).
- Never commit `.env*` files, tokens, or chat IDs. `.gitignore` covers `.env*` except `.env.example`.
- Never commit `.next/`, `node_modules/`, or `*.tsbuildinfo`.
- Keep `en.json` and `vi.json` key-identical. Add every new UI string to both files in the same change.
- Do not log request bodies from the contact route. They contain names, emails and messages.
- Lint rules to respect: no `console.log` (only `warn` and `error`); avoid `any` (warning); prefix intentionally unused variables with `_`.
- Use the `@/` alias for `src/*`.
- Do not switch the build to `--turbopack` in Docker or CI.
- Do not push to `main` directly. Do not deploy, merge, or change deploy secrets without the user's approval.
- This repo is also checked out as a submodule of the `portfolio` workspace repo. Push changes here first; the workspace records the new commit afterwards.

## Parent docs

AWS migration design (CloudFront, Lambda with Lambda Web Adapter, S3, GitHub Actions OIDC) is described in `../docs/` (architecture, `adr/`, `runbooks/`). Read it before changing deployment or hosting.

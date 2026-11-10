# AGENTS.md — portfolio-web

Personal portfolio site for Dai An. Next.js App Router, bilingual (en, vi). Public repo: github.com/vudaian24/portfolio-web. Workspace context (AWS migration, cross-repo rules) lives in the private `portfolio` workspace repository under `docs/`, which is not part of this clone; this file covers this repo only.

## Stack (from package.json, next.config.ts)

- Next.js 15.5.28 (`output: "standalone"`), React 19.1.10, TypeScript 5 (`strict`).
- Stay on Next.js 15 (owner decision). Do not upgrade to Next.js 16 or `eslint-config-next` 16. Keep `next` and `eslint-config-next` pinned to the same exact 15.5.x version, and take new 15.5.x patch releases for security fixes. Next.js 15 is in Maintenance LTS, which by the [support policy](https://nextjs.org/support-policy) ends about two years after its 2024-10-21 release. Before each release, check GitHub advisories for the pinned version (`gh api -X GET /advisories -f ecosystem=npm -f affects=next@<version>`).
- Tailwind CSS 4 via `@tailwindcss/postcss`; `tailwind-merge`, `clsx`.
- `next-intl` 4 (locales `en` default and `vi`, `localePrefix: as-needed`, `localeDetection: false`).
- `motion` 14 (`LazyMotion` with `domAnimation` in `src/components/MotionProvider.tsx`; components use `m.*` from `motion/react-m`), `lucide-react`, `next-themes`, `react-hook-form` with `zod` 4, `sharp`.
- Package manager: Yarn 1 (`yarn.lock` is the source of truth). Do not add `package-lock.json` or `pnpm-lock.yaml`.
- Node 24 in CI and Docker. Use Node 24 locally to match.

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

- `src/app/(frontend)/[locale]/` — localized routes: `page.tsx` (home, with the schema.org `Person` JSON-LD), `projects/[id]/page.tsx`, `layout.tsx` (fonts, site metadata, skip link), `not-found.tsx` (localized 404) and `[...rest]/page.tsx` (sends unknown paths to it), `opengraph-image.tsx` and `projects/[id]/opengraph-image.tsx` (link-preview images, prerendered per locale; English text, since the next/og font has no Vietnamese glyphs).
- Every page and layout under `[locale]` calls `setRequestLocale(locale)`. Without it, `getTranslations` reads the request headers and the route renders on every request instead of at build time; check that `/en` and `/vi` stay in `.next/prerender-manifest.json`.
- `src/app/(frontend)/layout.tsx`, `globals.css` — root layout and global styles.
- `src/app/web-api/contact/route.ts` — POST contact endpoint. Validates with zod, then sends to Telegram.
- `src/app/web-api/health/route.ts` — GET health endpoint for Kubernetes probes and the ALB health check. Returns `{status, version}` and checks no dependencies.
- `src/app/robots.ts`, `sitemap.ts` (lists each URL's translations), `favicon.ico`.
- `src/middleware.ts` — next-intl middleware. Skips `/web-api`, `/_next`, and any path containing a dot.
- `src/i18n/` — `routing.ts`, `request.ts`, `navigation.ts`.
- `src/locales/en.json`, `src/locales/vi.json` — UI strings. Both have 203 leaf keys today, with identical key sets.
- `src/components/` — `sections/` (page sections; many come as a server file plus a `*Client.tsx` pair), `ui/` (shared primitives), plus Navbar (highlights the section in view), Footer, ThemeToggle, LanguageSelector, ScrollProgress, BackToTopButton.
- `src/config/site.ts` — site-level config.
- `src/lib/` — `contact.ts` (zod schema, `escapeTelegramHtml`), `utils.ts`, `animation.ts`, `useActiveSection.ts` (scroll-spy for the navbar), `types.ts`, `brandIcons.ts` (GitHub, LinkedIn glyphs), `techIcons.ts` (logo registry and `TAG_ICONS` for tech chips; skill logos are `SKILL_ICONS` in `src/config/site.ts`), `seo.ts` (canonical, hreflang and Open Graph helpers), `ogImage.tsx` (shared Open Graph image layout).
- `public/` — `avatar.jpg`, `cv.pdf` (the DevOps CV; the deploy smoke test fetches `/cv.pdf`), `icons/aws/` (AWS Architecture Icons, 48 px service icons from the official asset package) and `icons/brands/` (Simple Icons logos with the brand colour baked in, plus the official External Secrets, jq and systemd logos). Add a new tech logo as an SVG there and register it in `src/lib/techIcons.ts`; a new project tag needs a `TAG_ICONS` entry or type-check fails.
- `docs/superpowers/` — dated plans and specs for the CV redesign.
- `README.md` is the project overview: stack, commands, environment variable names, Docker, and deployment status. Keep it in sync when scripts, env vars, or deployment change.

## Configuration facts

- Server env vars: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, read by the contact route. Values live in a local, git-ignored `.env` file or in the deploy environment. Never open `.env*`.
- `next.config.ts` sets security headers on all routes: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy` (every unused feature off), a Content-Security-Policy, `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy` (`same-origin`) and `X-Permitted-Cross-Domain-Policies: none` (from the OWASP Secure Headers Project), plus `x-app-version` from `APP_VERSION` at build time (`dev` when unset). `poweredByHeader` is off. Keep them unless the user asks to change them. The deploy workflow reads `x-app-version` from `/web-api/health` (always rendered per request) to tell when a release is live.
- The CSP allows `'unsafe-inline'` for scripts and styles, because the pages are static (nonces would force dynamic rendering). `'unsafe-eval'` is added only in development. If a new external origin is loaded (script, style, image, font, or fetch), add it to the CSP in `next.config.ts`.
- There is no `images` config: no remote image hosts and no SVG optimization.
- `Dockerfile` (`node:24-alpine`, multi-stage, build arg `APP_VERSION` = git SHA) uses `HUSKY=0`, `CI=true`, `yarn install --frozen-lockfile`, and `yarn next build` (webpack). Its runner copies `src/locales` because next-intl loads locale JSON at runtime.

## CI/CD as it is today

Pipeline lives in `.github/workflows/`. Production runs on EKS. The AWS deploy is gated by the repository variable `AWS_DEPLOY_ENABLED` (job-level `if`; while it is not `true`, no `aws-production` deployment is created).

- `main.yml` ("Pipeline") — pull requests run CI only. A push to `main` runs CI, then the `deploy` job when `AWS_DEPLOY_ENABLED` is `true`. `workflow_dispatch` takes exactly one of two inputs. `image_tag` (a full 40-character SHA already in ECR) redeploys it as a rollback. `bootstrap: true` (refused unless run from `main`) is the first deploy: it builds `main` if needed, writes `image.tag`, and skips the wait, the smoke test and the revert. It is refused unless `image.tag` in `portfolio-gitops` is empty. Both modes go through the `deploy` job, so the environment approval applies. Job `deploy` uses `environment: aws-production` and `ubuntu-24.04-arm`. It builds the `linux/arm64` image, pushes it to ECR repository `portfolio-prod-web` with the full SHA as the tag (immutable, no `latest`), and sets `image.tag` in `portfolio-gitops` through a GitHub App token. It then waits for `x-app-version` on `/web-api/health`, smoke-tests the site, and reverts the gitops tag on failure. The job has `timeout-minutes: 30`, counted from approval. Helper: `.github/scripts/set-image-tag.sh`.
- `notify-workspace.yml` — on push to `main`, sends `repository_dispatch` (`submodule-updated`) to the private workspace repo `portfolio`, which then bumps its submodule pointer. Uses a GitHub App token (repository variable `WORKSPACE_SYNC_APP_CLIENT_ID`, repository secret `WORKSPACE_SYNC_APP_PRIVATE_KEY`); skipped while the variable is unset.
- `ci.yml` — composite action `.github/actions/setup-node` (Node 24, Yarn cache, `.next/cache`, `yarn install --frozen-lockfile`), then `yarn lint`, `yarn type-check` and `yarn build`. `timeout-minutes: 15`, Next.js telemetry off.
- Names used by the deploy job: repository variable `AWS_DEPLOY_ENABLED`. Environment `aws-production` (deployment branches: `main` only; required reviewer; separate from Vercel's `Production`, because environment names are case insensitive) holds secrets `AWS_ROLE_ARN`, `GITOPS_APP_PRIVATE_KEY`, variables `GITOPS_APP_CLIENT_ID` and optional `SITE_URL` (default `https://portfolio.anvd.io.vn`; the deploy waits for `x-app-version` there and smoke-tests it).
- Permissions: top-level `permissions` is `contents: read`. Only the `deploy` job raises `id-token: write`, for OIDC. Keep elevation at job level.
- The first deploy has no previous tag in `portfolio-gitops`, so it runs as `workflow_dispatch` with `bootstrap: true`, not as a push (workspace `docs/runbooks/rollback.md`, "First deploy"). Until that run sets the first tag, a push or an `image_tag` redeploy is refused before any build. A deploy that fails or is cancelled after writing the tag restores the previous tag.
- Actions are pinned to full commit SHAs with a `# vX.Y.Z` comment. Update them the same way.
- The design is in the workspace `docs/architecture/aws-eks.md` (Deploy path); rollback in `docs/runbooks/rollback.md`.

## Rules

- Change `main` through a pull request: the ruleset `protect main` rejects direct pushes and force-pushes (ADR 0019 in the workspace repo). Work on a branch, open the pull request with a conventional-commit title (`feat`, `fix`, `chore`, `docs`, `perf`), read the `Pipeline` CI result, then `gh pr merge --squash --delete-branch`.
- Never commit `.env*` files, tokens, or chat IDs. `.gitignore` covers `.env*` except `.env.example`.
- Never commit `.next/`, `node_modules/`, or `*.tsbuildinfo`.
- Keep `en.json` and `vi.json` key-identical. Add every new UI string to both files in the same change.
- Do not log request bodies from the contact route. They contain names, emails and messages.
- Lint rules to respect: no `console.log` (only `warn` and `error`); avoid `any` (warning); prefix intentionally unused variables with `_`.
- Use the `@/` alias for `src/*`.
- Do not switch the build to `--turbopack` in Docker or CI.
- Do not deploy or change deploy secrets without the user's approval.
- This repo is also checked out as a submodule of the `portfolio` workspace repo. Push changes here first; the workspace records the new commit afterwards.

## Workspace docs

The hosting and deployment design, the ADRs and the runbooks live in the private `portfolio` workspace repository, under `docs/architecture/`, `docs/adr/` and `docs/runbooks/`. They are the source of truth and are deliberately not repeated here, so a path to them resolves only inside that workspace. Read them before changing deployment or hosting; if something about them needs to be true in this repo, encode it in the workflow or the code, not as prose here.

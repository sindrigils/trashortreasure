# Repository Guidelines

## Project Structure & Module Organization
- `app/` hosts routes, layouts, and API handlers; keep server-only logic inside `app/api/*` to protect secrets.
- `components/` contains reusable UI, with shadcn primitives under `components/ui` and admin widgets in `components/admin`.
- `lib/` centralizes shared helpers (`lib/candy.ts` for normalization, `lib/supabase.ts` for data access). Update these first when adjusting data shapes or environment usage.
- Styles live in `app/globals.css`; framework config is in `tailwind.config.ts`, `postcss.config.mjs`, and `next.config.js`.

## Build, Test, and Development Commands
- `npm install` installs dependencies; rerun after package or config changes.
- `npm run dev` starts the hot-reloading dev server on port 3000.
- `npm run build` compiles the production bundle; run before every deploy.
- `npm run start` serves the compiled bundle locally for smoke testing.
- `npm run lint` executes Next.js ESLint and TypeScript checks.

## Coding Style & Naming Conventions
- Use TypeScript React function components with hooks; prefer explicit return types on exported helpers and server utilities.
- Stick to two-space indentation, single quotes, and Tailwind utility classes; rely on `clsx`/`class-variance-authority` for conditional styling.
- Name components in PascalCase, hooks in camelCase prefixed with `use`, and Supabase helpers with clear verbs (`getSupabaseServiceClient`).
- Place admin-only modules under `app/admin` or `components/admin` to keep shared surfaces lightweight.

## Testing Guidelines
- No automated suite exists yet; when adding one, store specs as `*.test.ts(x)` beside the source or under `__tests__/`.
- Favor React Testing Library for components and Playwright for smoke tests that cover `/results` and `/admin`.
- Always run `npm run lint` and verify live refresh plus Supabase writes locally before opening a PR; mock Supabase clients during tests to prevent real writes.

## Commit & Pull Request Guidelines
- Match the current history: imperative, concise subjects (`Fix ingest handler params`), optional scope prefixes if they add clarity.
- PRs should explain intent, call out schema or env changes, include screenshots for UI updates, and list manual verification (`npm run build`, admin CRUD check).
- Link related issues and request review whenever secrets, database migrations, or deployment settings change.

## Environment & Security Tips
- Copy `.env.example` to `.env.local`; keep Supabase keys, `INGEST_SHARED_SECRET`, and `NEXT_PUBLIC_BASE_URL` private and out of version control.
- Use the service-role key only server-side (`lib/supabase.ts`); client components must rely on the anon key.
- Rotate credentials in Vercel before redeploying to avoid downtime.

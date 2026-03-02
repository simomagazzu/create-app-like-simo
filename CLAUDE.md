# Simo's Agentic Coding Boilerplate — AI Assistant Guidelines

## Project Overview

A production-ready Next.js boilerplate for building AI-powered web applications. Designed for use with Claude Code as the primary development tool.

### Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack), React 19, TypeScript 5.9
- **AI**: Vercel AI SDK 5 + OpenRouter (100+ models via single API)
- **Auth**: Better Auth (email/password + Google OAuth)
- **Database**: PostgreSQL + Drizzle ORM
- **UI**: shadcn/ui + Tailwind CSS 4 + dark mode (next-themes)
- **Storage**: Local filesystem (dev) / Vercel Blob (production)
- **Package Manager**: pnpm

## File Map (for context management)

Use this to decide which files to read for a given task. **Don't load everything — load what's relevant.**

### Core Configuration
- `package.json` — dependencies and scripts
- `next.config.ts` — Next.js config + security headers
- `drizzle.config.ts` — database migration config
- `tsconfig.json` — TypeScript config
- `components.json` — shadcn/ui config

### Authentication
- `src/lib/auth.ts` — Better Auth server config
- `src/lib/auth-client.ts` — client-side auth hooks (signIn, signUp, signOut, useSession)
- `src/lib/session.ts` — server-side session helpers (requireAuth, getOptionalSession)

### Database
- `src/lib/db.ts` — database connection
- `src/lib/schema.ts` — Drizzle schema (all tables)
- `drizzle/` — migration files (don't edit directly)

### API Layer
- `src/lib/api-utils.ts` — response helpers, auth/validation/rate-limit wrappers
- `src/lib/rate-limit.ts` — rate limiter (auto-applied, configure limits here)
- `src/lib/logger.ts` — structured logging
- `src/lib/env.ts` — environment variable validation + setup status

### Storage
- `src/lib/storage.ts` — file upload/delete (auto-switches local ↔ Vercel Blob)

### UI
- `src/components/ui/` — shadcn/ui components
- `src/components/` — app-level components
- `src/app/globals.css` — theme + Tailwind setup

### E2E Testing
- `playwright.config.ts` — Playwright config (baseURL, browser, webServer)
- `e2e/` — all E2E test files (one file per feature area)
- Run via `/test-e2e` command or `pnpm test:e2e` directly

## Critical Rules

### 1. Always run checks after changes
```bash
pnpm lint && pnpm typecheck
```

### 2. Never start the dev server
Don't run `pnpm dev`. Ask the user to provide terminal output if needed.

### 3. Use OpenRouter, not OpenAI directly
```typescript
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
const model = openrouter(process.env.OPENROUTER_MODEL || "openai/gpt-4.1-mini");
```

### 4. Use the API utilities — don't reinvent them
```typescript
import { apiResponse, apiError, requireApiAuth, applyRateLimit, parseBody } from "@/lib/api-utils";
import { RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Rate limit
  const limited = await applyRateLimit("my-route", RATE_LIMITS.api);
  if (limited) return limited;

  // Auth
  const { session, error } = await requireApiAuth();
  if (error) return error;

  // Validate body
  const { data, error: parseErr } = await parseBody(req, myZodSchema);
  if (parseErr) return parseErr;

  // Do work...
  return apiResponse({ result: "ok" });
}
```

### 5. Database patterns
```typescript
import { db } from "@/lib/db";
import { myTable } from "@/lib/schema";
import { eq } from "drizzle-orm";

// Query
const rows = await db.select().from(myTable).where(eq(myTable.userId, userId));

// Insert
await db.insert(myTable).values({ ... });

// After schema changes:
// 1. Edit src/lib/schema.ts
// 2. Run: pnpm run db:generate
// 3. Run: pnpm run db:migrate
```

### 6. Authentication in pages
```typescript
// Server Component (protected page)
import { requireAuth } from "@/lib/session";

export default async function MyPage() {
  const session = await requireAuth(); // redirects to / if not logged in
  return <div>Hello {session.user.name}</div>;
}

// Client Component
import { useSession } from "@/lib/auth-client";

function MyComponent() {
  const { data: session, isPending } = useSession();
}
```

### 7. Styling
- Use shadcn/ui components first — install new ones with `pnpm dlx shadcn@latest add <name>`
- Use Tailwind utility classes, not custom CSS
- Use theme tokens: `bg-background`, `text-foreground`, `bg-muted`, etc.
- Support dark mode — shadcn handles this automatically

### 8. File storage
```typescript
import { upload, deleteFile } from "@/lib/storage";

const result = await upload(buffer, "photo.png", "avatars");
// result.url → "/uploads/avatars/photo.png" (dev) or "https://blob.vercel.io/..." (prod)

await deleteFile(result.url);
```

### 9. Every API route must have
- Rate limiting (via `applyRateLimit`)
- Authentication check (via `requireApiAuth`) if the route is protected
- Input validation (via `parseBody` with a Zod schema)
- Proper error responses (via `apiError`)

### 10. Reuse components — don't reinvent them
Before writing any UI, check what already exists:
1. **shadcn/ui first** — if a component exists in `src/components/ui/`, use it. Install missing ones with `pnpm dlx shadcn@latest add <name>` rather than building from scratch.
2. **App components second** — check `src/components/` for existing app-level components before creating new ones.
3. **Extract, don't duplicate** — if the same UI pattern appears more than once, extract it into a reusable component in `src/components/`.
4. **Extend, don't fork** — if an existing component almost fits, add a prop to it. Don't copy-paste and modify.

Writing the same UI twice is always wrong. A new `<div>` where a `<Button>` or `<Card>` would do is always wrong.

## Available Scripts

```bash
pnpm dev          # Start dev server (Turbopack) — DON'T run this yourself
pnpm build        # Build for production (runs db:migrate first)
pnpm lint         # ESLint — ALWAYS run after changes
pnpm typecheck    # TypeScript checking — ALWAYS run after changes
pnpm check        # Run both lint + typecheck

pnpm db:generate  # Generate migrations after schema changes
pnpm db:migrate   # Apply migrations
pnpm db:push      # Push schema directly (dev shortcut)
pnpm db:studio    # Open Drizzle Studio (database GUI)
pnpm db:reset     # Drop and recreate all tables
```

## Context Management for Commands

When implementing a task, follow this loading strategy:

1. **Always load first**: `CLAUDE.md`, `src/lib/schema.ts`, `package.json`
2. **For API work**: add `src/lib/api-utils.ts`, `src/lib/rate-limit.ts`
3. **For auth work**: add `src/lib/auth.ts`, `src/lib/session.ts`
4. **For UI work**: add `src/app/globals.css`, check `src/components/ui/` for existing components
5. **For the specific feature**: load only the files in the relevant route/component directory
6. **Skip**: `node_modules/`, `drizzle/` (migrations), `.next/`, `pnpm-lock.yaml`

This prevents context window waste on large projects.

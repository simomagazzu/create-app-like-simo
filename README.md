# Simo's Agentic Coding Boilerplate

**Create webapps like Simo** — a production-ready Next.js boilerplate built for AI-assisted development with Claude Code.

## What is this?

A starter kit for building real web applications using AI as your coding partner. Instead of writing every line yourself, you describe what you want, and Claude Code builds it — using the patterns, security, and architecture already baked into this boilerplate.

**This is not a demo app.** It's the foundation you build _your_ app on.

### What's included

- **Authentication** — email/password + Google OAuth (via Better Auth)
- **Database** — PostgreSQL with Drizzle ORM, Docker for local dev
- **AI integration** — OpenRouter (100+ models through one API key)
- **File storage** — local in dev, Vercel Blob in production
- **Security** — rate limiting, input validation, security headers, auth guards
- **Setup wizard** — interactive checklist that validates your configuration
- **Claude Code commands** — slash commands for spec creation, GitHub integration, and phased development

### Tech stack

Next.js 16 · React 19 · TypeScript 5.9 · Tailwind CSS 4 · shadcn/ui · Drizzle ORM · PostgreSQL · Better Auth · Vercel AI SDK · OpenRouter

---

## Quick Start

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- [pnpm](https://pnpm.io) (`npm install -g pnpm`)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (for the local database)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (for AI-assisted development)

### Setup

```bash
# 1. Clone and install
git clone <your-repo-url> my-app
cd my-app
pnpm install

# 2. Configure environment
cp env.example .env
# Edit .env — follow the comments in the file

# 3. Start the database
docker compose up -d

# 4. Create database tables
pnpm run db:migrate

# 5. Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the **setup wizard** that walks you through the remaining configuration.

### Start building

Once the setup wizard shows green checkmarks:

```bash
# Open Claude Code
claude

# Describe what you want to build
/create-spec
```

Claude Code will interview you about your app, create a detailed spec, and then you can use `/continue-feature` to build it phase by phase.

---

## Project Structure

```
├── .claude/commands/       # Claude Code slash commands
│   ├── create-spec.md      # Interview → spec creation
│   ├── publish-to-github.md # Spec → GitHub issues + project board
│   ├── continue-feature.md  # Pick up next task and implement
│   ├── checkpoint.md        # Create a detailed commit
│   ├── review-pr.md         # Security + quality PR review
│   └── deploy-check.md      # Pre-deployment validation
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/          # Login, register, password reset
│   │   ├── api/             # API routes (auth, health)
│   │   ├── dashboard/       # Protected dashboard
│   │   └── profile/         # User profile
│   ├── components/          # React components
│   │   ├── auth/            # Authentication forms
│   │   └── ui/              # shadcn/ui components (add as needed)
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Core libraries
│       ├── api-utils.ts     # API response helpers, auth/validation wrappers
│       ├── auth.ts          # Better Auth server config
│       ├── auth-client.ts   # Client-side auth hooks
│       ├── db.ts            # Database connection
│       ├── env.ts           # Environment validation + setup status
│       ├── logger.ts        # Structured logging
│       ├── rate-limit.ts    # Rate limiter (in-memory, per-route)
│       ├── schema.ts        # Database schema (Drizzle)
│       ├── session.ts       # Server-side session helpers
│       ├── storage.ts       # File upload/delete abstraction
│       └── utils.ts         # Utility functions
├── CLAUDE.md                # AI assistant guidelines
├── docker-compose.yml       # Local PostgreSQL
├── env.example              # Environment template with docs
└── package.json
```

---

## Claude Code Workflow

This boilerplate is designed around a specific development workflow:

### 1. Plan: `/create-spec`
Claude interviews you about what you want to build, then generates a structured spec with requirements, implementation plan, and architecture decisions.

### 2. Publish: `/publish-to-github`
Creates GitHub Issues for each phase and task, sets up a Project board, and caches all the IDs for fast subsequent operations.

### 3. Build: `/continue-feature`
Finds the next task, loads only the relevant context (not the whole codebase), implements it, validates with lint/typecheck, commits, and updates GitHub tracking. Run it repeatedly until done.

### 4. Save: `/checkpoint`
Creates a well-structured commit with detailed change descriptions.

### 5. Review: `/review-pr`
Runs a security + quality review on pull requests, checking for missing auth guards, rate limits, input validation, and more.

### 6. Ship: `/deploy-check`
Pre-deployment validation — checks env vars, database connectivity, build success, and security configuration.

---

## Configuration Guide

### Database

**Development** (Docker — runs on your machine):
```bash
docker compose up -d                    # Start PostgreSQL
pnpm run db:migrate                     # Apply migrations
pnpm run db:studio                      # Open database GUI
docker compose down                     # Stop
docker compose down -v                  # Stop + delete all data
```

**Production** (Neon — free tier available):
1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string
3. Set it as `POSTGRES_URL` in your production environment

### Authentication

**Email/password** works out of the box. Verification and password reset emails are logged to your terminal during development. For production, integrate an email provider (Resend, SendGrid, etc.) in `src/lib/auth.ts`.

**Google OAuth** (optional):
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 credentials
3. Set redirect URI to `http://localhost:3000/api/auth/callback/google`
4. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env`

### AI Integration

1. Get an API key from [OpenRouter](https://openrouter.ai/settings/keys)
2. Add it as `OPENROUTER_API_KEY` in `.env`
3. Browse models at [openrouter.ai/models](https://openrouter.ai/models)
4. Set your preferred model as `OPENROUTER_MODEL` (default: `openai/gpt-4.1-mini`)

### File Storage

- **Development**: Files save to `public/uploads/` (gitignored)
- **Production**: Set `BLOB_READ_WRITE_TOKEN` from Vercel Dashboard → Storage → Blob

---

## API Patterns

Every API route in this project follows the same structure. This makes them predictable and secure:

```typescript
import { apiResponse, apiError, requireApiAuth, applyRateLimit, parseBody } from "@/lib/api-utils";
import { RATE_LIMITS } from "@/lib/rate-limit";
import { z } from "zod";

const mySchema = z.object({
  name: z.string().min(1).max(100),
});

export async function POST(req: Request) {
  // 1. Rate limit
  const limited = await applyRateLimit("my-route", RATE_LIMITS.api);
  if (limited) return limited;

  // 2. Auth
  const { session, error } = await requireApiAuth();
  if (error) return error;

  // 3. Validate
  const { data, error: parseErr } = await parseBody(req, mySchema);
  if (parseErr) return parseErr;

  // 4. Do work
  return apiResponse({ result: "ok" });
}
```

---

## Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add card
# etc.
```

Components install to `src/components/ui/`. They're pre-configured for dark mode and the project's theme.

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build (runs migrations first) |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript checking |
| `pnpm check` | Run both lint + typecheck |
| `pnpm db:generate` | Generate migration files |
| `pnpm db:migrate` | Apply migrations |
| `pnpm db:push` | Push schema directly (dev shortcut) |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm db:reset` | Drop and recreate tables |

---

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables (from `.env`, using production values)
4. Deploy

The `pnpm build` script runs `db:migrate` automatically before building.

### Pre-deployment checklist

Run `/deploy-check` in Claude Code, or manually verify:
- [ ] `BETTER_AUTH_SECRET` is a real random string (not the default)
- [ ] `POSTGRES_URL` points to your production database
- [ ] `NEXT_PUBLIC_APP_URL` is your real domain
- [ ] `pnpm build` completes without errors
- [ ] Email provider configured (if using email auth)

---

## Inspired by

This project is inspired by [Leon van Zyl's Agentic Coding Starter Kit](https://github.com/leonvanzyl/agentic-coding-starter-kit). Built with a focus on guided onboarding, security-first architecture, and optimized Claude Code workflows.

---

## License

MIT

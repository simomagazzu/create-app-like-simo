# Il Boilerplate Agentivo di Simo

**Crea webapp come Simo** — un boilerplate Next.js production-ready costruito per lo sviluppo assistito da AI con Claude Code.

## Cos'è questo?

Un kit di partenza per costruire vere applicazioni web usando l'AI come partner di sviluppo. Invece di scrivere ogni riga da solo, descrivi cosa vuoi e Claude Code lo costruisce — usando i pattern, la sicurezza e l'architettura già integrati in questo boilerplate.

**Non è un'app demo.** È la fondamenta su cui costruire _la tua_ app.

### Cosa include

- **Autenticazione** — email/password + Google OAuth (via Better Auth)
- **Database** — PostgreSQL con Drizzle ORM, Docker per lo sviluppo locale
- **Integrazione AI** — OpenRouter (100+ modelli con un'unica API key)
- **Storage file** — locale in sviluppo, Vercel Blob in produzione
- **Sicurezza** — rate limiting, validazione input, security headers, auth guard
- **Setup wizard** — checklist interattiva che valida la configurazione
- **Comandi Claude Code** — slash command per creare spec, integrazione GitHub e sviluppo a fasi

### Stack tecnologico

Next.js 16 · React 19 · TypeScript 5.9 · Tailwind CSS 4 · shadcn/ui · Drizzle ORM · PostgreSQL · Better Auth · Vercel AI SDK · OpenRouter

---

## Avvio Rapido

### Prerequisiti

- **Node.js 20+** — [nodejs.org](https://nodejs.org) o tramite un version manager
- **pnpm** — package manager veloce ed efficiente
- **Docker Desktop** — fa girare il database PostgreSQL in locale
- **Claude Code** — l'assistente AI attorno a cui è costruito questo boilerplate

**macOS (consigliato: usa Homebrew)**
```bash
brew install node                          # Node.js
npm install -g pnpm                        # pnpm
# Docker Desktop: scarica da docker.com/products/docker-desktop
npm install -g @anthropic-ai/claude-code   # Claude Code
```

**Windows**
```powershell
# Node.js: scarica l'installer da nodejs.org
npm install -g pnpm                        # pnpm (esegui in PowerShell)
# Docker Desktop: scarica da docker.com/products/docker-desktop
npm install -g @anthropic-ai/claude-code   # Claude Code
```

**Linux**
```bash
curl -fsSL https://fnm.vercel.app/install | bash   # installa fnm (Node version manager)
fnm install 20                                      # Node.js 20
npm install -g pnpm                                 # pnpm
# Docker Desktop: vedi docs.docker.com/desktop/linux
npm install -g @anthropic-ai/claude-code            # Claude Code
```

> **Verifica l'installazione:**
> ```bash
> node --version   # deve essere v20+
> pnpm --version
> docker --version
> claude --version
> ```

### Setup

**1. Crea una cartella con il nome della tua app**

**Opzione A — Terminale:**
```bash
mkdir nome-della-tua-app   # es. todo-app, my-saas, ecc.
cd nome-della-tua-app
code .
```

**Opzione B — Manuale:**
1. Crea una cartella e chiamala come la tua app (es. `todo-app`, `my-saas`, ecc.)
2. Aprila in VS Code (File → Apri Cartella)

**2. Clona il boilerplate nella cartella aperta**

```bash
# Nel terminale integrato di VS Code
git clone https://github.com/simomagazzu/create-app-like-simo.git .
pnpm install

# 3. Configura l'ambiente
cp env.example .env
# Modifica .env — segui i commenti nel file

# 4. Avvia il database
docker compose up -d

# 5. Crea le tabelle del database
pnpm run db:migrate

# 6. Avvia il server di sviluppo
pnpm dev
```

Apri [http://localhost:3000](http://localhost:3000) — vedrai il **setup wizard** che ti guida attraverso la configurazione rimanente.

### Inizia a costruire

Quando il setup wizard mostra tutti i check verdi:

```bash
# Apri Claude Code
claude

# Descrivi cosa vuoi costruire
/create-spec
```

Claude Code ti intervisterà sulla tua app, creerà una spec dettagliata e poi potrai usare `/continue-feature` per costruirla fase per fase.

---

## Struttura del Progetto

```
├── .claude/commands/       # Slash command di Claude Code
│   ├── create-spec.md      # Intervista → creazione spec
│   ├── publish-to-github.md # Spec → issue GitHub + project board
│   ├── continue-feature.md  # Prende il task successivo e lo implementa
│   ├── checkpoint.md        # Crea un commit dettagliato
│   ├── review-pr.md         # Review sicurezza + qualità su PR
│   └── deploy-check.md      # Validazione pre-deploy
├── src/
│   ├── app/                 # Pagine Next.js App Router
│   │   ├── (auth)/          # Login, register, reset password
│   │   ├── api/             # Route API (auth, health)
│   │   ├── dashboard/       # Dashboard protetta
│   │   └── profile/         # Profilo utente
│   ├── components/          # Componenti React
│   │   ├── auth/            # Form di autenticazione
│   │   └── ui/              # Componenti shadcn/ui (aggiungi secondo necessità)
│   ├── hooks/               # Hook React personalizzati
│   └── lib/                 # Librerie core
│       ├── api-utils.ts     # Helper risposta API, wrapper auth/validazione
│       ├── auth.ts          # Configurazione server Better Auth
│       ├── auth-client.ts   # Hook auth lato client
│       ├── db.ts            # Connessione database
│       ├── env.ts           # Validazione variabili d'ambiente + stato setup
│       ├── logger.ts        # Logging strutturato
│       ├── rate-limit.ts    # Rate limiter (in-memory, per route)
│       ├── schema.ts        # Schema database (Drizzle)
│       ├── session.ts       # Helper sessione lato server
│       ├── storage.ts       # Astrazione upload/delete file
│       └── utils.ts         # Funzioni di utilità
├── CLAUDE.md                # Linee guida per l'assistente AI
├── docker-compose.yml       # PostgreSQL locale
├── env.example              # Template variabili d'ambiente con documentazione
└── package.json
```

---

## Flusso di Lavoro con Claude Code

Questo boilerplate è progettato attorno a un flusso di sviluppo specifico:

### 1. Pianifica: `/create-spec`
Claude ti intervista su cosa vuoi costruire, poi genera una spec strutturata con requisiti, piano di implementazione e decisioni architetturali.

### 2. Pubblica: `/publish-to-github`
Crea Issue GitHub per ogni fase e task, imposta una Project board e salva tutti gli ID per operazioni successive più veloci.

### 3. Costruisci: `/continue-feature`
Trova il prossimo task, carica solo il contesto rilevante (non tutto il codebase), lo implementa, valida con lint/typecheck, fa il commit e aggiorna il tracking su GitHub. Eseguilo ripetutamente fino al completamento.

### 4. Salva: `/checkpoint`
Crea un commit ben strutturato con descrizioni dettagliate delle modifiche.

### 5. Revisiona: `/review-pr`
Esegue una review di sicurezza + qualità sulle pull request, verificando auth guard mancanti, rate limit, validazione input e altro.

### 6. Pubblica: `/deploy-check`
Validazione pre-deploy — controlla variabili d'ambiente, connettività database, successo della build e configurazione sicurezza.

---

## Guida alla Configurazione

### Database

**Sviluppo** (Docker — gira sulla tua macchina):
```bash
docker compose up -d                    # Avvia PostgreSQL
pnpm run db:migrate                     # Applica le migrazioni
pnpm run db:studio                      # Apri la GUI del database
docker compose down                     # Ferma
docker compose down -v                  # Ferma + elimina tutti i dati
```

**Produzione** (Neon — tier gratuito disponibile):
1. Crea un progetto su [neon.tech](https://neon.tech)
2. Copia la stringa di connessione
3. Impostala come `POSTGRES_URL` nel tuo ambiente di produzione

### Autenticazione

**Email/password** funziona subito. Le email di verifica e reset password vengono loggata nel terminale durante lo sviluppo. Per la produzione, integra un provider email (Resend, SendGrid, ecc.) in `src/lib/auth.ts`.

**Google OAuth** (opzionale):
1. Vai su [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Crea credenziali OAuth 2.0
3. Imposta l'URI di redirect su `http://localhost:3000/api/auth/callback/google`
4. Aggiungi `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` al tuo `.env`

### Integrazione AI

1. Ottieni un'API key da [OpenRouter](https://openrouter.ai/settings/keys)
2. Aggiungila come `OPENROUTER_API_KEY` nel `.env`
3. Esplora i modelli disponibili su [openrouter.ai/models](https://openrouter.ai/models)
4. Imposta il tuo modello preferito come `OPENROUTER_MODEL` (default: `openai/gpt-4.1-mini`)

### Storage File

- **Sviluppo**: i file vengono salvati in `public/uploads/` (ignorato da git)
- **Produzione**: imposta `BLOB_READ_WRITE_TOKEN` da Vercel Dashboard → Storage → Blob

---

## Pattern API

Ogni route API in questo progetto segue la stessa struttura. Questo le rende prevedibili e sicure:

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

  // 3. Validazione
  const { data, error: parseErr } = await parseBody(req, mySchema);
  if (parseErr) return parseErr;

  // 4. Logica
  return apiResponse({ result: "ok" });
}
```

---

## Aggiungere Componenti shadcn/ui

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add card
# ecc.
```

I componenti vengono installati in `src/components/ui/`. Sono pre-configurati per la dark mode e il tema del progetto.

---

## Script

| Comando | Descrizione |
|---------|-------------|
| `pnpm dev` | Avvia il server di sviluppo (Turbopack) |
| `pnpm build` | Build di produzione (esegue le migrazioni prima) |
| `pnpm lint` | Esegui ESLint |
| `pnpm typecheck` | Controllo TypeScript |
| `pnpm check` | Esegui lint + typecheck insieme |
| `pnpm db:generate` | Genera i file di migrazione |
| `pnpm db:migrate` | Applica le migrazioni |
| `pnpm db:push` | Push schema diretto (scorciatoia dev) |
| `pnpm db:studio` | Apri Drizzle Studio |
| `pnpm db:reset` | Elimina e ricrea le tabelle |
| `pnpm test:e2e` | Esegui i test E2E in modalità headless |
| `pnpm test:e2e:ui` | Apri l'UI interattiva di Playwright |
| `pnpm test:e2e:headed` | Esegui i test con il browser visibile |

---

## Test E2E (Playwright)

I test sono **su richiesta** — non vengono mai eseguiti automaticamente durante la build. Eseguili quando vuoi verificare che una funzionalità funzioni end-to-end.

### Setup iniziale

```bash
pnpm install
pnpm exec playwright install chromium   # scarica il browser per i test
```

### Eseguire i test

```bash
pnpm test:e2e           # headless (stile CI)
pnpm test:e2e:ui        # UI interattiva — ottima per il debug
pnpm test:e2e:headed    # guarda il browser mentre i test girano
```

I test riutilizzano il server di sviluppo già in esecuzione. Avvialo prima con `pnpm dev`, poi esegui i test in un altro terminale.

### Scrivere test

Aggiungi nuovi file di test in `e2e/`. Un file per area funzionale. Da Claude Code:

```bash
/test-e2e
```

Questo esegue l'intera suite e corregge gli eventuali errori. Per scrivere test per una nuova funzionalità, chiedi: _"Scrivi i test E2E per il flusso di [funzionalità]."_

### Test inclusi

- `e2e/auth.spec.ts` — le pagine login/register si caricano, gli auth guard reindirizzano gli utenti non autenticati, il flusso di registrazione funziona

---

## Deploy

### Vercel (consigliato)

1. Fai push su GitHub
2. Importa su [Vercel](https://vercel.com)
3. Aggiungi le variabili d'ambiente (da `.env`, usando i valori di produzione)
4. Deploy

Lo script `pnpm build` esegue `db:migrate` automaticamente prima della build.

### Checklist pre-deploy

Esegui `/deploy-check` in Claude Code, o verifica manualmente:
- [ ] `BETTER_AUTH_SECRET` è una stringa casuale reale (non quella di default)
- [ ] `POSTGRES_URL` punta al database di produzione
- [ ] `NEXT_PUBLIC_APP_URL` è il tuo dominio reale
- [ ] `pnpm build` si completa senza errori
- [ ] Provider email configurato (se usi l'autenticazione via email)

---

## Ispirato da

Questo progetto è ispirato all'[Agentic Coding Starter Kit di Leon van Zyl](https://github.com/leonvanzyl/agentic-coding-starter-kit). Costruito con un focus su onboarding guidato, architettura security-first e flussi di lavoro ottimizzati per Claude Code.

---

## Licenza

MIT

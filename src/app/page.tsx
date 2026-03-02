"use client";

import { useSetupStatus } from "@/hooks/use-setup-status";
import {
  CheckCircle2,
  Circle,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Rocket,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 font-mono text-sm hover:bg-muted/70 transition-colors border border-border"
      title="Copy to clipboard"
    >
      <span>{text}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      )}
    </button>
  );
}

function LearnMore({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {open ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
        {open ? "Hide explanation" : "What is this? (plain English)"}
      </button>
      {open && (
        <div className="mt-3 rounded-xl bg-muted/50 border border-border p-4 text-sm text-muted-foreground leading-relaxed space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

function Step({
  done,
  optional,
  title,
  subtitle,
  children,
}: {
  done: boolean;
  optional?: boolean;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 transition-colors ${
        done
          ? "border-green-200 dark:border-green-900 bg-green-50/30 dark:bg-green-950/10"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 mt-0.5">
          {done ? (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          ) : (
            <Circle className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold">{title}</h3>
            {optional && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                optional
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
          <div className="space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function CommandBlock({
  label,
  command,
  description,
}: {
  label?: string;
  command: string;
  description?: string;
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <p className="text-xs font-medium text-foreground uppercase tracking-wide">
          {label}
        </p>
      )}
      <div className="flex items-center gap-3">
        <CopyButton text={command} />
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
    </div>
  );
}

export default function SetupPage() {
  const { status, loading, refresh, isComplete } = useSetupStatus();

  const requiredDone = [
    status?.database.connected,
    status?.auth.secretConfigured,
  ].filter(Boolean).length;
  const requiredTotal = 2;

  if (loading && !status) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Simo&apos;s Agentic Coding Boilerplate
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Let&apos;s get you set up
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Before you start building, your project needs a few things
            configured. This page will guide you through each step — and
            explain what everything means along the way.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Required steps</span>
            <span className="font-medium">
              {requiredDone} of {requiredTotal} complete
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${(requiredDone / requiredTotal) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">

          {/* Step 1: Database */}
          <Step
            done={status?.database.connected ?? false}
            title="Start your database"
            subtitle="Your app needs a place to store data permanently — user accounts, messages, anything you save. We use PostgreSQL for this, running locally on your machine via Docker."
          >
            {!status?.database.connected && (
              <>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    Run these two commands in your terminal, in order:
                  </p>
                  <CommandBlock
                    command="docker compose up -d"
                    description="Starts the database in the background"
                  />
                  <CommandBlock
                    command="pnpm run db:migrate"
                    description="Creates the tables your app needs"
                  />
                </div>
                <LearnMore>
                  <p>
                    <strong className="text-foreground">What is a database?</strong> Think of it
                    as a very powerful spreadsheet that your app can read and
                    write in real time. Without it, everything the user does
                    disappears when they close the browser.
                  </p>
                  <p>
                    <strong className="text-foreground">What is Docker?</strong> Docker lets you
                    run software (like a database) in an isolated container on
                    your machine, without installing it directly on your system.
                    It starts clean, it stops clean.
                  </p>
                  <p>
                    <strong className="text-foreground">What is PostgreSQL?</strong> It&apos;s one
                    of the most reliable databases in the world. Used by
                    companies like Instagram and GitHub. You don&apos;t need to
                    know SQL — the boilerplate handles that for you.
                  </p>
                  <p>
                    <strong className="text-foreground">Important:</strong> Docker Desktop must be
                    open and running before you run these commands. Open it from
                    your Applications folder and wait for the whale icon in the
                    menu bar to stop animating.
                  </p>
                </LearnMore>
              </>
            )}
            {status?.database.connected && (
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✓ Database is connected and ready
              </p>
            )}
          </Step>

          {/* Step 2: Auth */}
          <Step
            done={status?.auth.secretConfigured ?? false}
            title="Set your auth secret"
            subtitle="This is a private key that signs and verifies your users' login sessions. Without it, authentication won't work."
          >
            {!status?.auth.secretConfigured && (
              <>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    Generate a secret:
                  </p>
                  <CommandBlock
                    command="openssl rand -base64 32"
                    description="Generates a random secret key"
                  />
                  <p className="text-sm text-muted-foreground">
                    Copy the output, open your{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                      .env
                    </code>{" "}
                    file, and paste it as the value of{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                      BETTER_AUTH_SECRET
                    </code>
                    .
                  </p>
                </div>
                <LearnMore>
                  <p>
                    <strong className="text-foreground">What is a secret key?</strong> When a
                    user logs in, your server creates a token — a small piece of
                    data that says &quot;this person is authenticated.&quot; The
                    secret key is used to sign that token so it can&apos;t be
                    faked. Think of it like a wax seal on a letter.
                  </p>
                  <p>
                    <strong className="text-foreground">What is the .env file?</strong> It&apos;s
                    a file that stores your app&apos;s private settings — API
                    keys, database passwords, secrets. It never gets uploaded to
                    GitHub. It stays only on your machine (and on your hosting
                    platform when you deploy).
                  </p>
                  <p>
                    <strong className="text-foreground">Why random?</strong> The secret needs to
                    be something nobody can guess. The{" "}
                    <code className="text-foreground">openssl</code> command
                    generates 32 truly random bytes. Never use something like
                    &quot;mysecret&quot; or &quot;password&quot; here.
                  </p>
                </LearnMore>
              </>
            )}
            {status?.auth.secretConfigured && (
              <div className="space-y-3">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  ✓ Auth secret configured
                </p>
                {/* Google OAuth optional */}
                <div className="pt-3 border-t border-border">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Optional: Google sign-in
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Let users sign in with their Google account instead of
                    creating a new password.
                  </p>
                  {status?.auth.googleOAuth ? (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      ✓ Google OAuth configured
                    </p>
                  ) : (
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-foreground underline underline-offset-2"
                    >
                      Set up in Google Cloud Console
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}
            {!status?.auth.secretConfigured && status?.auth.googleOAuth === false && null}
          </Step>

          {/* Step 3: AI (optional) */}
          <Step
            done={status?.ai.configured ?? false}
            optional
            title="Connect AI models"
            subtitle="If your app will use AI features — chatbots, summaries, content generation — add an OpenRouter key to unlock 100+ models with a single API key."
          >
            {!status?.ai.configured ? (
              <>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Get a free API key from{" "}
                    <a
                      href="https://openrouter.ai/settings/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline underline-offset-2 inline-flex items-center gap-1"
                    >
                      openrouter.ai
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    , then add it to your{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                      .env
                    </code>{" "}
                    file as{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                      OPENROUTER_API_KEY
                    </code>
                    .
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Browse available models at{" "}
                    <a
                      href="https://openrouter.ai/models"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline underline-offset-2"
                    >
                      openrouter.ai/models
                    </a>
                    .
                  </p>
                </div>
                <LearnMore>
                  <p>
                    <strong className="text-foreground">What is OpenRouter?</strong> It&apos;s a
                    service that gives you access to many different AI models
                    (GPT-4, Claude, Mistral, Gemini, etc.) through one API key
                    instead of signing up for each provider separately.
                  </p>
                  <p>
                    <strong className="text-foreground">What is an API key?</strong> It&apos;s a
                    password for a service. When your app calls OpenRouter to
                    use an AI model, it sends this key to prove it&apos;s
                    authorized. Keep it private — never share it or commit it to
                    GitHub.
                  </p>
                  <p>
                    <strong className="text-foreground">Do I need this?</strong> Only if your app
                    will have AI features. You can skip it now and add it later
                    when you need it.
                  </p>
                </LearnMore>
              </>
            ) : (
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✓ AI configured — using {status.ai.model}
              </p>
            )}
          </Step>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-4">
          <button
            onClick={refresh}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Check status again
          </button>

          {isComplete && (
            <div className="rounded-2xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20 p-6">
              <div className="flex items-start gap-3">
                <Rocket className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                    You&apos;re ready to build!
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200 mb-4">
                    Everything is configured. Open your terminal in VS Code and
                    start Claude Code:
                  </p>
                  <div className="space-y-2">
                    <CopyButton text="claude" />
                    <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                      Then type{" "}
                      <code className="bg-green-100 dark:bg-green-900 px-1.5 py-0.5 rounded">
                        /create-spec
                      </code>{" "}
                      to describe what you want to build. Claude will ask you
                      questions and create a detailed plan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* System status footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
            System Status
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full ${status?.database.connected ? "bg-green-500" : "bg-muted-foreground/40"}`}
              />
              Database:{" "}
              {status?.database.connected ? (
                <span className="text-green-600 dark:text-green-400">
                  Connected
                </span>
              ) : (
                "Not connected"
              )}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full ${status?.auth.secretConfigured ? "bg-green-500" : "bg-muted-foreground/40"}`}
              />
              Auth:{" "}
              {status?.auth.secretConfigured ? (
                <span className="text-green-600 dark:text-green-400">
                  Ready
                </span>
              ) : (
                "Needs setup"
              )}
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full ${status?.ai.configured ? "bg-green-500" : "bg-muted-foreground/40"}`}
              />
              AI:{" "}
              {status?.ai.configured ? (
                <span className="text-green-600 dark:text-green-400">
                  {status.ai.model}
                </span>
              ) : (
                "Not configured"
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Storage:{" "}
              <span className="text-green-600 dark:text-green-400">
                {status?.storage.backend === "vercel-blob"
                  ? "Vercel Blob"
                  : "Local"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useSetupStatus } from "@/hooks/use-setup-status";
import {
  CheckCircle2,
  Circle,
  Database,
  Key,
  Bot,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Rocket,
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
      className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 font-mono text-xs hover:bg-muted/80 transition-colors"
      title="Copy to clipboard"
    >
      {text}
      {copied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3 text-muted-foreground" />
      )}
    </button>
  );
}

function StepItem({
  done,
  title,
  children,
}: {
  done: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 py-6">
      <div className="flex-shrink-0 mt-0.5">
        {done ? (
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        ) : (
          <Circle className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="text-sm text-muted-foreground space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function SetupPage() {
  const { status, loading, refresh, isComplete } = useSetupStatus();

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
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Simo&apos;s Agentic Coding Boilerplate
          </h1>
          <p className="text-muted-foreground">
            Let&apos;s get your project ready. Complete these steps, then use
            Claude Code to build your app.
          </p>
        </div>

        {/* Checklist */}
        <div className="divide-y divide-border">
          {/* Step 1: Database */}
          <StepItem
            done={status?.database.connected ?? false}
            title="1. Start your development database"
          >
            <p>
              Your app needs PostgreSQL. During development, Docker runs it on
              your machine. In production, you&apos;ll use a cloud database like{" "}
              <a
                href="https://neon.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2"
              >
                Neon
              </a>
              .
            </p>
            <div className="space-y-2">
              <p className="font-medium text-foreground">
                Run in your terminal:
              </p>
              <div className="space-y-1">
                <CopyButton text="docker compose up -d" />
                <span className="text-xs ml-2">Start the database</span>
              </div>
              <div className="space-y-1">
                <CopyButton text="pnpm run db:migrate" />
                <span className="text-xs ml-2">Create the tables</span>
              </div>
            </div>
            {status?.database.connected && (
              <p className="text-green-600 dark:text-green-400 font-medium">
                ✓ Database connected and ready
              </p>
            )}
          </StepItem>

          {/* Step 2: Authentication */}
          <StepItem
            done={status?.auth.secretConfigured ?? false}
            title="2. Configure authentication"
          >
            <p>
              Open your <code className="bg-muted px-1 rounded">.env</code> file
              and set your auth secret. This is used to sign login tokens.
            </p>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Generate a secret:</p>
              <CopyButton text="openssl rand -base64 32" />
              <p>
                Paste the output as your{" "}
                <code className="bg-muted px-1 rounded">
                  BETTER_AUTH_SECRET
                </code>{" "}
                in the .env file.
              </p>
            </div>
            {status?.auth.secretConfigured && (
              <p className="text-green-600 dark:text-green-400 font-medium">
                ✓ Auth secret configured
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="font-medium text-foreground mb-2">
                Optional: Google sign-in
              </p>
              <p>
                To enable &quot;Sign in with Google,&quot; create OAuth
                credentials in the{" "}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline underline-offset-2 inline-flex items-center gap-1"
                >
                  Google Cloud Console
                  <ExternalLink className="h-3 w-3" />
                </a>{" "}
                and add the Client ID and Secret to your .env file.
              </p>
              {status?.auth.googleOAuth && (
                <p className="text-green-600 dark:text-green-400 font-medium mt-2">
                  ✓ Google OAuth configured
                </p>
              )}
            </div>
          </StepItem>

          {/* Step 3: AI */}
          <StepItem
            done={status?.ai.configured ?? false}
            title="3. Add AI capabilities (optional)"
          >
            <p>
              If your app uses AI, get an API key from{" "}
              <a
                href="https://openrouter.ai/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2 inline-flex items-center gap-1"
              >
                OpenRouter
                <ExternalLink className="h-3 w-3" />
              </a>
              . This gives you access to 100+ models (GPT, Claude, Mistral,
              etc.) through one API key.
            </p>
            <p>
              Add it as{" "}
              <code className="bg-muted px-1 rounded">OPENROUTER_API_KEY</code>{" "}
              in your .env file. Browse available models at{" "}
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
            {status?.ai.configured && (
              <p className="text-green-600 dark:text-green-400 font-medium">
                ✓ AI configured — using {status.ai.model}
              </p>
            )}
          </StepItem>
        </div>

        {/* Refresh & Next */}
        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={refresh}
            className="flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Re-check status
          </button>

          {isComplete && (
            <div className="rounded-lg border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 p-6">
              <div className="flex items-start gap-3">
                <Rocket className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    You&apos;re ready to build!
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                    Your project is configured. Open Claude Code in your terminal
                    and start building:
                  </p>
                  <div className="space-y-2">
                    <CopyButton text="claude" />
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Then use{" "}
                      <code className="bg-green-100 dark:bg-green-900 px-1 rounded">
                        /create-spec
                      </code>{" "}
                      to describe what you want to build.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status indicators */}
        <div className="mt-12 pt-8 border-t border-border">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
            System Status
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Database className="h-3.5 w-3.5 text-muted-foreground" />
              <span>
                Database:{" "}
                {status?.database.connected ? (
                  <span className="text-green-600 dark:text-green-400">
                    Connected
                  </span>
                ) : (
                  <span className="text-muted-foreground">Not connected</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Key className="h-3.5 w-3.5 text-muted-foreground" />
              <span>
                Auth:{" "}
                {status?.auth.secretConfigured ? (
                  <span className="text-green-600 dark:text-green-400">
                    Ready
                  </span>
                ) : (
                  <span className="text-muted-foreground">Needs setup</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="h-3.5 w-3.5 text-muted-foreground" />
              <span>
                AI:{" "}
                {status?.ai.configured ? (
                  <span className="text-green-600 dark:text-green-400">
                    {status.ai.model}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Not configured</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                Storage: {status?.storage.backend === "vercel-blob" ? "Vercel Blob" : "Local"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

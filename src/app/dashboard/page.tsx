import { requireAuth } from "@/lib/session";
import { Code, Rocket, BookOpen, Wrench } from "lucide-react";

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome, {session.user.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-muted-foreground mt-1">
          This is your dashboard. Replace this page with your app.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Getting Started</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Open Claude Code in your terminal and run{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              /create-spec
            </code>{" "}
            to plan your first feature.
          </p>
        </div>

        <div className="rounded-lg border border-border p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Build with AI</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Use{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              /continue-feature
            </code>{" "}
            to implement tasks one by one. Claude Code follows your spec.
          </p>
        </div>

        <div className="rounded-lg border border-border p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">What&apos;s Included</h2>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Authentication (email + Google OAuth)</li>
            <li>• PostgreSQL + Drizzle ORM</li>
            <li>• Rate limiting &amp; security headers</li>
            <li>• File storage (local + Vercel Blob)</li>
            <li>• OpenRouter AI integration</li>
          </ul>
        </div>

        <div className="rounded-lg border border-border p-6 space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Slash Commands</h2>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <code className="bg-muted px-1 rounded text-xs">/create-spec</code>{" "}
              — Plan a feature
            </li>
            <li>
              <code className="bg-muted px-1 rounded text-xs">/publish-to-github</code>{" "}
              — Create issues
            </li>
            <li>
              <code className="bg-muted px-1 rounded text-xs">/continue-feature</code>{" "}
              — Build next task
            </li>
            <li>
              <code className="bg-muted px-1 rounded text-xs">/checkpoint</code>{" "}
              — Commit progress
            </li>
            <li>
              <code className="bg-muted px-1 rounded text-xs">/deploy-check</code>{" "}
              — Pre-deploy audit
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

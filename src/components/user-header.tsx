"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { LogOut, User, LayoutDashboard } from "lucide-react";

export function UserHeader() {
  const router = useRouter();
  const { data: session } = useSession();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  if (!session?.user) return null;

  return (
    <header className="border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium hover:text-foreground/80 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {session.user.name || session.user.email}
          </span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

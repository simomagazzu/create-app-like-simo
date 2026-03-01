import { requireAuth } from "@/lib/session";
import { User, Mail, Calendar } from "lucide-react";

export default async function ProfilePage() {
  const session = await requireAuth();
  const { user } = session;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Profile</h1>

      <div className="rounded-lg border border-border divide-y divide-border">
        <div className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name || "Profile"}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-medium">{user.name || "No name set"}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Member since</p>
              <p className="text-sm text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Profile editing is a great first feature to build with{" "}
        <code className="bg-muted px-1 rounded">/create-spec</code>.
      </p>
    </div>
  );
}

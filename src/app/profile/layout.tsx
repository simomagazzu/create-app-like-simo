import { UserHeader } from "@/components/user-header";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <UserHeader />
      <main className="max-w-2xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

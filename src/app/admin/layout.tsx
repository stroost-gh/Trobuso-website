import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-lg text-trobuso-900">
              Trobuso
            </Link>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Website beheer</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">{session.user?.email}</span>
            <Link
              href="/"
              target="_blank"
              className="text-trobuso-900 hover:underline"
            >
              Bekijk website →
            </Link>
            <form
              action={async () => {
                "use server";
                const { signOut } = await import("@/lib/auth");
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button className="text-gray-400 hover:text-gray-600">Uitloggen</button>
            </form>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

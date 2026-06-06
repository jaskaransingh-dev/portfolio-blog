import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getCurrentUser();
  const { next } = await searchParams;
  if (user) redirect(next || "/blog");

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link
          href="/blog"
          className="text-xs text-muted-2 transition-colors hover:text-foreground"
        >
          ← Back to the blog
        </Link>
        <h1 className="mt-6 text-xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Log in to keep writing. You&apos;ll stay signed in for 30 days.
        </p>
        <div className="mt-8">
          <AuthForm mode="login" redirectTo={next || "/blog"} />
        </div>
      </div>
    </main>
  );
}

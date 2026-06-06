import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Sign up" };

export default async function SignupPage({
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
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          No email verification, no fuss. Pick a memorable password (or an emoji
          one) and you&apos;re writing in seconds.
        </p>
        <div className="mt-8">
          <AuthForm mode="signup" redirectTo={next || "/blog"} />
        </div>
      </div>
    </main>
  );
}

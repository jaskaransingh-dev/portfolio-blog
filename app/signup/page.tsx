import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Create account" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const user = await getCurrentUser();
  const { next } = await searchParams;
  if (user) redirect(next || "/");

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-xs text-muted-2 hover:text-text transition-colors">Back</Link>
        <h1 className="serif mt-6 text-2xl font-normal">Create your account</h1>
        <p className="mt-1.5 text-sm text-muted">
          No email verification. Takes ten seconds.
        </p>
        <div className="mt-8">
          <AuthForm mode="signup" redirectTo={next || "/"} />
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const user = await getCurrentUser();
  const { next } = await searchParams;
  if (user) redirect(next || "/");

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-xs text-muted-2 hover:text-text transition-colors">Back</Link>
        <h1 className="serif mt-6 text-2xl font-normal">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted">Sign in to write and comment.</p>
        <div className="mt-8">
          <AuthForm mode="login" redirectTo={next || "/"} />
        </div>
      </div>
    </main>
  );
}

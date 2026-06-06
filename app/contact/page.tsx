import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { BlogNav } from "@/components/BlogNav";
import { MessageForm } from "@/components/MessageForm";
import { profile } from "@/lib/profile";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Contact",
  description: "Send Jaskaran Singh a message.",
};

export default async function ContactPage() {
  const user = await getCurrentUser();

  return (
    <>
      <BlogNav user={user} />
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-12">
        <h1 className="text-2xl font-semibold tracking-tight">Get in touch</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Building something, hiring, or just want to talk shop? Drop me a note —
          it lands straight in my inbox. You can also find me on{" "}
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="prose-link"
          >
            LinkedIn
          </a>{" "}
          and{" "}
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="prose-link"
          >
            GitHub
          </a>
          .
        </p>

        <div className="mt-8">
          <MessageForm
            defaultName={user?.displayName ?? ""}
            defaultEmail={user?.email ?? ""}
            loggedIn={!!user}
          />
        </div>

        <p className="mt-8 text-center text-xs text-muted-2">
          <Link href="/" className="hover:text-foreground">
            ← Back to portfolio
          </Link>
        </p>
      </main>
    </>
  );
}

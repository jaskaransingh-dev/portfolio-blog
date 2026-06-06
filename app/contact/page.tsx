import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { SiteNav } from "@/components/SiteNav";
import { MessageForm } from "@/components/MessageForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact", description: "Send Jaskaran Singh a message." };

export default async function ContactPage() {
  const user = await getCurrentUser();
  return (
    <>
      <SiteNav user={user} />
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-12">
        <h1 className="serif text-3xl font-normal">Get in touch</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Building something, want to collaborate, or just want to say hi — drop me a note.
          You can also find me on{" "}
          <a href="https://linkedin.com/in/jsingh06" target="_blank" rel="noreferrer" className="link-underline">LinkedIn</a>.
        </p>
        <div className="mt-8">
          <MessageForm defaultName={user?.displayName ?? ""} defaultEmail={user?.email ?? ""} loggedIn={!!user} />
        </div>
        <p className="mt-10 text-xs text-muted-2">
          <Link href="/" className="hover:text-text transition-colors">Back</Link>
        </p>
      </main>
    </>
  );
}

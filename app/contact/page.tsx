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
      <main className="mx-auto w-full max-w-lg flex-1 px-5 py-12">
        <h1 className="serif text-2xl font-normal text-text">Get in touch</h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          Drop Jaz a note. Goes straight to his inbox.
        </p>
        <div className="mt-8">
          <MessageForm defaultName={user?.displayName ?? ""} defaultEmail={user?.email ?? ""} loggedIn={!!user} />
        </div>
      </main>
    </>
  );
}

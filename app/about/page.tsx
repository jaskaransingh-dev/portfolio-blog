import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { SiteNav } from "@/components/SiteNav";
import { Avatar } from "@/components/Avatar";
import { profile, projects, skills } from "@/lib/profile";

export const metadata = {
  title: "Work",
  description: "Projects, roles, and what Jaskaran Singh has shipped.",
};

const statusLabel: Record<string, string> = {
  building: "In progress",
  live:     "Live",
  shipped:  "Shipped",
};

export default async function AboutPage() {
  const user = await getCurrentUser();

  return (
    <>
      <SiteNav user={user} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12">

        {/* Header */}
        <div className="anim-fade-up flex items-start gap-5 pb-12 border-b border-border">
          <Avatar src={profile.photo} initials={profile.initials} size={72} />
          <div className="pt-1">
            <h1 className="serif text-3xl font-normal text-text">{profile.name}</h1>
            <p className="mt-1 text-sm text-muted">{profile.role}</p>
            <p className="mt-1 text-sm text-muted">{profile.university}</p>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-2">
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-text transition-colors">LinkedIn</a>
              <a href={profile.links.github} target="_blank" rel="noreferrer" className="hover:text-text transition-colors">GitHub</a>
              <Link href="/contact" className="hover:text-text transition-colors">Message me</Link>
            </div>
          </div>
        </div>

        {/* Projects */}
        <section className="mt-12">
          <h2 className="text-xs uppercase tracking-widest text-muted-2 mb-8">Projects</h2>

          <div className="anim-stagger space-y-0">
            {projects.map(p => (
              <div key={p.id} className="group border-b border-border py-8 last:border-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {p.logo ? (
                      <div
                        className="h-9 w-9 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                        style={{ background: p.accentColor + "22", border: `1px solid ${p.accentColor}30` }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.logo}
                          alt={p.name}
                          className={`h-5 w-5 object-contain ${p.logoInvert ? "invert opacity-80" : ""}`}
                        />
                      </div>
                    ) : (
                      <div
                        className="h-9 w-9 rounded-lg flex-shrink-0"
                        style={{ background: p.accentColor + "22", border: `1px solid ${p.accentColor}30` }}
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-text">
                          {p.href ? (
                            <a href={p.href} target="_blank" rel="noreferrer" className="hover:text-amber transition-colors">
                              {p.name}
                            </a>
                          ) : p.name}
                        </h3>
                        <span
                          className="rounded-full px-1.5 py-px text-[10px] border"
                          style={{
                            borderColor: p.accentColor + "50",
                            color: p.accentColor,
                          }}
                        >
                          {statusLabel[p.status]}
                        </span>
                      </div>
                      <p className="text-xs text-muted-2 mt-0.5">{p.role} &middot; {p.year}</p>
                    </div>
                  </div>
                  {p.href && (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-muted-2 hover:text-text transition-colors flex-shrink-0 mt-1"
                    >
                      Visit
                    </a>
                  )}
                </div>

                <p className="mt-4 text-[13px] italic text-muted">{p.tagline}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.stack.map(s => (
                    <span key={s} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-2">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mt-14 pt-10 border-t border-border">
          <h2 className="text-xs uppercase tracking-widest text-muted-2 mb-6">Stack</h2>
          <dl className="space-y-3">
            {skills.map(s => (
              <div key={s.group} className="grid grid-cols-[100px_1fr] gap-4 text-sm">
                <dt className="text-muted-2">{s.group}</dt>
                <dd className="text-muted">{s.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <footer className="mt-16 pt-8 border-t border-border text-xs text-muted-2">
          <Link href="/" className="hover:text-text transition-colors">Back to the blog</Link>
        </footer>
      </main>
    </>
  );
}

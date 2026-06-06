import { profile, projects, skills } from "@/lib/profile";
import { Avatar } from "@/components/Avatar";
import Link from "next/link";

export const metadata = {
  title: "Jaskaran Singh — Portfolio",
  description: "Software engineer building TrueMile.AI. Statistics & Data Science at UCLA.",
};

const statusLabel: Record<string, { label: string; color: string }> = {
  building: { label: "In progress", color: "#ff9500" },
  live:     { label: "Live",        color: "#30d158" },
  shipped:  { label: "Shipped",     color: "rgba(235,235,245,0.4)" },
};

export default function PortfolioPage() {
  return (
    <>
      {/* Minimal isolated nav — no blog link visible */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-12 w-full max-w-3xl items-center justify-between px-6">
          <span className="text-sm font-semibold tracking-tight" style={{ color: "var(--orange)" }}>
            Jaskaran Singh
          </span>
          <div className="flex items-center gap-5 text-xs" style={{ color: "var(--muted-2)" }}>
            <a href="#projects" className="hover:text-orange transition-colors">Projects</a>
            <a href="#stack"    className="hover:text-orange transition-colors">Stack</a>
            <Link href="/contact" className="hover:text-orange transition-colors">Contact</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 pt-14 pb-24">

        {/* Hero */}
        <div className="anim-fade-up flex items-center gap-6 pb-12 border-b border-border">
          <Avatar src={profile.photo} initials={profile.initials} size={80} />
          <div>
            <h1 className="serif text-3xl font-normal text-text">{profile.name}</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{profile.role} &middot; {profile.location}</p>
            <p className="mt-0.5 text-sm" style={{ color: "var(--muted)" }}>{profile.university}</p>
            <div className="mt-3 flex items-center gap-4 text-xs" style={{ color: "var(--muted-2)" }}>
              <a
                href={profile.links.linkedin}
                target="_blank" rel="noreferrer"
                className="hover:text-orange transition-colors"
              >LinkedIn</a>
              <a
                href={profile.links.github}
                target="_blank" rel="noreferrer"
                className="hover:text-orange transition-colors"
              >GitHub</a>
              <Link href="/contact" className="hover:text-orange transition-colors">
                Message me
              </Link>
            </div>
          </div>
        </div>

        {/* Projects */}
        <section id="projects" className="mt-12 scroll-mt-20">
          <p className="text-xs uppercase tracking-widest mb-8" style={{ color: "var(--muted-2)" }}>
            Projects
          </p>

          <div className="anim-stagger space-y-0">
            {projects.map(p => {
              const status = statusLabel[p.status] ?? statusLabel.shipped;
              return (
                <div key={p.id} className="border-b border-border py-8 last:border-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      {/* Logo tile */}
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                        style={{ background: p.accentColor + "22", border: `1px solid ${p.accentColor}40` }}
                      >
                        {p.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.logo}
                            alt={p.name}
                            className={`h-5 w-5 object-contain ${p.logoInvert ? "invert opacity-70" : ""}`}
                          />
                        ) : (
                          <span
                            className="text-xs font-bold"
                            style={{ color: p.accentColor }}
                          >
                            {p.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-text">
                            {p.href ? (
                              <a
                                href={p.href}
                                target="_blank" rel="noreferrer"
                                className="hover:text-orange transition-colors"
                              >{p.name}</a>
                            ) : p.name}
                          </h3>
                          {/* Status badge */}
                          <span
                            className="rounded-full px-2 py-px text-[10px] font-medium border"
                            style={{
                              color: status.color,
                              borderColor: status.color + "50",
                              background: status.color + "15",
                            }}
                          >
                            {status.label}
                          </span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: "var(--muted-2)" }}>
                          {p.role} &middot; {p.year}
                        </p>
                      </div>
                    </div>

                    {p.href && (
                      <a
                        href={p.href}
                        target="_blank" rel="noreferrer"
                        className="text-xs flex-shrink-0 mt-1 transition-colors hover:text-orange"
                        style={{ color: "var(--muted-2)" }}
                      >
                        Visit
                      </a>
                    )}
                  </div>

                  <p className="mt-4 text-[13px] italic" style={{ color: "var(--orange)" }}>
                    {p.tagline}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {p.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.stack.map(s => (
                      <span
                        key={s}
                        className="rounded-full border px-2 py-0.5 text-[11px]"
                        style={{ borderColor: "var(--border)", color: "var(--muted-2)" }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stack */}
        <section id="stack" className="mt-12 pt-10 border-t border-border scroll-mt-20">
          <p className="text-xs uppercase tracking-widest mb-6" style={{ color: "var(--muted-2)" }}>
            Stack
          </p>
          <dl className="space-y-3">
            {skills.map(s => (
              <div key={s.group} className="grid grid-cols-[110px_1fr] gap-4 text-sm">
                <dt style={{ color: "var(--muted-2)" }}>{s.group}</dt>
                <dd style={{ color: "var(--muted)" }}>{s.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </>
  );
}

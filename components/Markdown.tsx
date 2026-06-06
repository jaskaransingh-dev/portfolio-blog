import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="md text-[16px] leading-[1.8] text-text/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (p) => <h2 className="serif text-2xl mt-8 mb-3 text-text" {...p} />,
          h2: (p) => <h2 className="serif text-xl mt-7 mb-2.5 text-text" {...p} />,
          h3: (p) => <h3 className="text-base font-semibold mt-6 mb-2 text-text" {...p} />,
          p:  (p) => <p className="my-3.5" {...p} />,
          a:  (p) => <a className="link-amber" target="_blank" rel="noreferrer" {...p} />,
          ul: (p) => <ul className="my-3.5 ml-5 list-disc space-y-1.5" {...p} />,
          ol: (p) => <ol className="my-3.5 ml-5 list-decimal space-y-1.5" {...p} />,
          li: (p) => <li className="pl-1" {...p} />,
          blockquote: (p) => (
            <blockquote className="my-4 border-l-2 border-amber-dim pl-4 italic text-muted" {...p} />
          ),
          code: ({ className, ...p }) =>
            className?.includes("language-") ? (
              <code className={`${className} block`} {...p} />
            ) : (
              <code className="rounded bg-surface-2 px-1.5 py-0.5 text-[0.85em] font-mono text-amber" {...p} />
            ),
          pre: (p) => (
            <pre className="my-4 overflow-x-auto rounded-lg border border-border bg-surface p-4 text-[13px] font-mono leading-relaxed" {...p} />
          ),
          hr: () => <hr className="my-8 border-border" />,
          img: (p) => (
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
            <img className="my-4 rounded-lg border border-border" {...p} />
          ),
          strong: (p) => <strong className="font-semibold text-text" {...p} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

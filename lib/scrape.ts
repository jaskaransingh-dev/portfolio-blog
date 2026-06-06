import { XMLParser } from "fast-xml-parser";

export type ScrapedItem = { title: string; url?: string };

const UA = "Mozilla/5.0 (compatible; JazBlogBot/1.0; +https://jaz-singh.vercel.app)";

const xml = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

function get(obj: unknown, path: string[]): unknown {
  let cur: unknown = obj;
  for (const key of path) {
    if (cur == null) return undefined;
    cur = (cur as Record<string, unknown>)[key];
  }
  return cur;
}

function asText(v: unknown): string | undefined {
  if (v == null) return undefined;
  if (typeof v === "string") return v.trim();
  if (typeof v === "number") return String(v);
  if (typeof v === "object") {
    const t = (v as Record<string, unknown>)["#text"];
    if (typeof t === "string") return t.trim();
  }
  return undefined;
}

// Pull a plausible URL out of an item object (handles JSON + Atom/RSS shapes).
function findUrl(item: unknown): string | undefined {
  if (item == null || typeof item !== "object") return undefined;
  const o = item as Record<string, unknown>;
  for (const k of ["url", "html_url", "shortUrl", "short_url", "link", "href", "guid", "id"]) {
    const v = o[k];
    if (typeof v === "string" && v.startsWith("http")) return v;
    // Atom <link href="..."> as object or array
    if (v && typeof v === "object") {
      const arr = Array.isArray(v) ? v : [v];
      for (const entry of arr) {
        const href = (entry as Record<string, unknown>)["@_href"];
        if (typeof href === "string" && href.startsWith("http")) return href;
      }
    }
  }
  // CoinGecko-style nested item
  if (o.item && typeof o.item === "object") return findUrl(o.item);
  return undefined;
}

// parseHint examples:
//   "hits[].title"  "[].title"  "results[].title"  "coins[].item.name"
//   "feed.entry[].title"  "items[].full_name"
function resolve(root: unknown, parseHint: string): ScrapedItem[] {
  const segs = parseHint.split(".");
  const arrIdx = segs.findIndex((s) => s.endsWith("[]"));
  if (arrIdx === -1) return [];

  const arrayPath = segs.slice(0, arrIdx + 1).map((s) => s.replace(/\[\]$/, "")).filter(Boolean);
  const titlePath = segs.slice(arrIdx + 1);

  let arr = arrayPath.length ? get(root, arrayPath) : root;
  if (!Array.isArray(arr)) {
    // Some feeds wrap a single entry as an object rather than an array.
    if (arr && typeof arr === "object") arr = [arr];
    else return [];
  }

  const items: ScrapedItem[] = [];
  for (const el of arr as unknown[]) {
    const title = asText(titlePath.length ? get(el, titlePath) : el);
    if (title) items.push({ title, url: findUrl(el) });
  }
  return items;
}

export async function scrapeSource(opts: {
  url: string;
  type: "json" | "rss";
  parseHint: string;
}): Promise<ScrapedItem[]> {
  const res = await fetch(opts.url, {
    headers: { "User-Agent": UA, Accept: opts.type === "json" ? "application/json" : "application/xml, text/xml, */*" },
    // Always fetch fresh — bots should see the latest.
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`source ${opts.url} -> ${res.status}`);

  const text = await res.text();
  let root: unknown;
  if (opts.type === "json") {
    root = JSON.parse(text);
  } else {
    root = xml.parse(text);
  }
  return resolve(root, opts.parseHint).slice(0, 15);
}

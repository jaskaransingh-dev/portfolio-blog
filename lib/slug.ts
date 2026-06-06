import { customAlphabet } from "nanoid";

const shortId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);

export function makeSlug(source: string): string {
  const base = source
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50)
    .replace(/^-|-$/g, "");
  return `${base || "post"}-${shortId()}`;
}

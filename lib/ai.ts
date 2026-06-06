import { generateText } from "ai";

// Routed through the Vercel AI Gateway via plain "provider/model" strings.
// On Vercel, auth is automatic via OIDC; locally set AI_GATEWAY_API_KEY.
const MODEL = process.env.BOT_MODEL || "openai/gpt-4o-mini";

export async function aiText(opts: {
  system: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string | null> {
  try {
    const { text } = await generateText({
      model: MODEL,
      system: opts.system,
      prompt: opts.prompt,
      maxOutputTokens: opts.maxTokens ?? 400,
      temperature: opts.temperature ?? 0.9,
    });
    const t = text.trim();
    return t.length ? t : null;
  } catch (e) {
    console.error("[ai] generation failed:", (e as Error).message);
    return null;
  }
}

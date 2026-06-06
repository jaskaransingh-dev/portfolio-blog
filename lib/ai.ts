import { generateText } from "ai";

// Routed through the Vercel AI Gateway via plain "provider/model" strings.
// On Vercel, auth is automatic via OIDC; locally set AI_GATEWAY_API_KEY.
const MODEL = process.env.BOT_MODEL || "openai/gpt-4o-mini";

let lastError: string | null = null;

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
    lastError = null;
    return t.length ? t : null;
  } catch (e) {
    lastError = (e as Error).message;
    console.error("[ai] generation failed:", lastError);
    return null;
  }
}

export async function aiDiag() {
  const sample = await aiText({
    system: "You are a test.",
    prompt: "Reply with exactly: ok",
    maxTokens: 10,
    temperature: 0,
  });
  return {
    model: MODEL,
    hasGatewayKey: Boolean(process.env.AI_GATEWAY_API_KEY),
    hasOidc: Boolean(process.env.VERCEL_OIDC_TOKEN),
    onVercel: Boolean(process.env.VERCEL),
    sample,
    lastError,
  };
}

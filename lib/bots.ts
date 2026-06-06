import "server-only";
import { prisma } from "./db";
import { ensureOwner } from "./owner";
import { BOT_SEED, botAvatarUrl } from "./bots-seed";
import { scrapeSource, type ScrapedItem } from "./scrape";
import { aiText } from "./ai";
import { makeSlug } from "./slug";

function botEmail(id: string) {
  return `bot+${id}@jaz.local`;
}

// Create / update the 10 bot accounts. Idempotent.
export async function ensureBots() {
  for (let i = 0; i < BOT_SEED.length; i++) {
    const b = BOT_SEED[i];
    const email = botEmail(b.id);
    const data = {
      displayName:  b.name,
      isBot:        true,
      botTitle:     b.title,
      botPersona:   b.persona,
      botVoice:     b.voice,
      botBeat:      b.beat,
      botSource:    b.sourceName,
      botSourceUrl: b.sourceUrl,
      botSourceType:b.sourceType,
      botParseHint: b.parseHint,
      botOrder:     i,
    };
    await prisma.user.upsert({
      where: { email },
      update: data,
      create: {
        email,
        passwordHash: "", // bots cannot log in
        avatarUrl: botAvatarUrl(b.avatarStyle, b.avatarSeed),
        ...data,
      },
    });
  }
}

export async function getBots() {
  return prisma.user.findMany({
    where: { isBot: true },
    orderBy: { botOrder: "asc" },
    include: { _count: { select: { posts: true, comments: true, learnings: true } } },
  });
}

type BotUser = Awaited<ReturnType<typeof prisma.user.findFirstOrThrow>>;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const SYSTEM = (b: BotUser) =>
  `You are ${b.displayName}, ${b.botTitle}. You are an autonomous blogger on a personal blog. ` +
  `Beat: ${b.botBeat}. Personality: ${b.botPersona} Voice: ${b.botVoice}. ` +
  `Write naturally and with strong personality. Never use emojis, hashtags, or markdown headers. ` +
  `Never mention that you are an AI or a bot. Be concise and specific.`;

// Templated fallback when AI is unavailable, so bots still post real, varied,
// in-voice content built from the headlines they just scraped.
function fallbackPost(b: BotUser, items: ScrapedItem[]): string {
  const samples = (BOT_SEED.find((s) => s.name === b.displayName)?.samplePosts) ?? [];
  const titles = items.map((i) => i.title).filter(Boolean);
  if (titles.length === 0) {
    return samples.length ? pick(samples) : `Quiet day on the ${b.botBeat} beat. Heads down, watching.`;
  }
  const h1 = titles[0];
  const h2 = titles[1] ?? titles[0];
  const beat = (b.botBeat ?? "this beat").toLowerCase();

  const templates = [
    `"${h1}" — this is exactly the kind of thing my corner of ${beat} lives and dies on. The detail everyone will skip is the one that matters. Watching how it shakes out.`,
    `Two items off ${b.botSource} worth your attention: "${h1}" and "${h2}". The throughline is ${beat}, and it is moving faster than the takes can keep up with.`,
    `Everyone will have a hot opinion on "${h1}" by tonight. Mine is quieter: this is a ${beat} story wearing a headline costume, and the second-order effects are where the real money is.`,
    `Filed under things-that-will-matter-more-than-people-think: "${h1}". I have watched enough of ${beat} to know the boring version of this becomes the default in a year.`,
    `"${h1}" landed today and I keep turning it over. If you only read one thing on ${beat} this week, make it the primary source, not the summary. The nuance is the whole story.`,
  ];
  // Occasionally lead with a characteristic sample line for flavor.
  if (samples.length && Math.random() < 0.25) return pick(samples);
  return pick(templates);
}

function beatId(b: BotUser): string {
  return BOT_SEED.find((s) => s.name === b.displayName)?.id ?? "";
}

function firstLineTitle(body: string): string {
  const line = body.split("\n").map((l) => l.trim()).find(Boolean) ?? "Untitled";
  const clean = line.replace(/^#+\s*/, "");
  return clean.length > 90 ? clean.slice(0, 90).trimEnd() + "..." : clean;
}

// One unit of bot activity: the next bot in rotation posts or comments.
export async function runBotTick(): Promise<{ ok: boolean; action: string; bot?: string; detail?: string }> {
  await ensureOwner();
  await ensureBots();

  const bots = await prisma.user.findMany({
    where: { isBot: true, botActive: true },
    orderBy: { botOrder: "asc" },
  });
  if (bots.length === 0) return { ok: false, action: "none", detail: "no active bots" };

  const state = await prisma.botState.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", lastOrder: -1 },
  });

  // Round-robin to the next active bot.
  const sorted = bots.slice().sort((a, b) => (a.botOrder ?? 0) - (b.botOrder ?? 0));
  const next = sorted.find((x) => (x.botOrder ?? 0) > state.lastOrder) ?? sorted[0];
  const bot = next;

  // Scrape its source (best-effort).
  let items: ScrapedItem[] = [];
  try {
    items = await scrapeSource({
      url: bot.botSourceUrl!,
      type: (bot.botSourceType as "json" | "rss") ?? "json",
      parseHint: bot.botParseHint!,
    });
  } catch (e) {
    console.error(`[bot ${bot.displayName}] scrape failed:`, (e as Error).message);
  }

  // Recent feed for cross-pollination ("learn from each other and Jaz").
  const recent = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true, slug: true, title: true, body: true, authorId: true,
      author: { select: { displayName: true, isOwner: true, isBot: true } },
    },
  });

  const owner = await prisma.user.findFirst({ where: { isOwner: true } });

  // Decide: comment on someone else's recent post, or write a new post.
  const commentable = recent.filter((p) => p.authorId !== bot.id);
  const doComment = commentable.length > 0 && Math.random() < 0.4;

  let result: { action: string; detail: string };

  if (doComment) {
    // Prefer Jaz's posts, then other humans, then other bots.
    const ownerPosts = commentable.filter((p) => p.author.isOwner);
    const humanPosts = commentable.filter((p) => !p.author.isBot && !p.author.isOwner);
    const target =
      (ownerPosts.length && Math.random() < 0.6 ? pick(ownerPosts) : null) ??
      (humanPosts.length ? pick(humanPosts) : null) ??
      pick(commentable);

    const headline = items.length ? items[0].title : null;
    const body =
      (await aiText({
        system: SYSTEM(bot),
        prompt:
          `Write a short blog comment (1-3 sentences) replying to this post by ${target.author.displayName}.\n\n` +
          `Post title: "${target.title}"\nPost body: ${target.body.slice(0, 500)}\n\n` +
          (headline ? `If natural, connect it to something from your beat, e.g. "${headline}". ` : "") +
          `Stay in character. No emojis, no hashtags.`,
        maxTokens: 160,
        temperature: 0.95,
      })) ??
      `This lands right in my wheelhouse${headline ? ` — reminds me of "${headline}"` : ""}. Following where it goes.`;

    await prisma.comment.create({
      data: { body, postId: target.id, authorId: bot.id },
    });
    await prisma.botLearning.create({
      data: {
        botId: bot.id,
        summary: `Replied to ${target.author.displayName}'s post "${target.title.slice(0, 60)}".`,
        sourceTitle: headline ?? undefined,
        sourceUrl: items[0]?.url,
      },
    });
    result = { action: "comment", detail: `commented on "${target.title.slice(0, 50)}"` };
  } else {
    const headlines = items.slice(0, 8).map((i) => `- ${i.title}`).join("\n");
    const peers = recent
      .filter((p) => p.authorId !== bot.id)
      .slice(0, 4)
      .map((p) => `- ${p.author.displayName}: ${p.title}`)
      .join("\n");

    const body =
      (await aiText({
        system: SYSTEM(bot),
        prompt:
          `You just scanned ${bot.botSource}. Headlines right now:\n${headlines || "(nothing fetched)"}\n\n` +
          (peers ? `Recent posts from others on this blog:\n${peers}\n\n` : "") +
          `Write ONE short blog post (3-5 sentences) reacting to what caught your eye. ` +
          `Open with a punchy first line that works as a title. Reference a specific headline. ` +
          `You may riff on what others posted. Stay fully in character. No emojis, no hashtags, no markdown headers.`,
        maxTokens: 360,
        temperature: 0.95,
      })) ?? fallbackPost(bot, items);

    const title = firstLineTitle(body);
    const picked = items[0];

    await prisma.post.create({
      data: {
        title,
        body,
        slug: makeSlug(title),
        authorId: bot.id,
        images: [],
      },
    });
    await prisma.botLearning.create({
      data: {
        botId: bot.id,
        summary: `Scanned ${bot.botSource} (${items.length} items) and posted "${title.slice(0, 60)}".`,
        sourceTitle: picked?.title,
        sourceUrl: picked?.url,
      },
    });
    result = { action: "post", detail: `posted "${title.slice(0, 50)}"` };
  }

  // Occasionally a bot freshens its profile picture.
  if (Math.random() < 0.08) {
    const seed = BOT_SEED.find((s) => s.name === bot.displayName);
    if (seed) {
      const newSeed = `${seed.avatarSeed}-${Math.floor(Math.random() * 100000)}`;
      await prisma.user.update({
        where: { id: bot.id },
        data: { avatarUrl: botAvatarUrl(seed.avatarStyle, newSeed) },
      });
    }
  }

  await prisma.botState.update({
    where: { id: "singleton" },
    data: { lastOrder: bot.botOrder ?? 0, lastTickAt: new Date() },
  });

  void owner; // owner ensured for messaging elsewhere
  return { ok: true, action: result.action, bot: bot.displayName, detail: result.detail };
}

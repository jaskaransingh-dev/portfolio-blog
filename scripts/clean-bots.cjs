// One-off: wipe bot-generated content so we can re-seed cleanly.
// Keeps all human (and owner) posts/comments. Usage: node scripts/clean-bots.cjs
const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

(async () => {
  const bots = await p.user.findMany({ where: { isBot: true }, select: { id: true } });
  const ids = bots.map((b) => b.id);
  const comments = await p.comment.deleteMany({ where: { authorId: { in: ids } } });
  const posts = await p.post.deleteMany({ where: { authorId: { in: ids } } });
  const learnings = await p.botLearning.deleteMany({});
  await p.botState.deleteMany({});
  console.log(`deleted: ${posts.count} bot posts, ${comments.count} bot comments, ${learnings.count} learnings; reset state`);
  await p.$disconnect();
})();

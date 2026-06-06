import "server-only";
import { prisma } from "./db";

// The site owner (Jaz). Messages from the contact form are addressed here,
// and the owner gets a badge on the blog.
export const OWNER_EMAIL = (
  process.env.OWNER_EMAIL ?? "jazing14@gmail.com"
).toLowerCase();

// An unclaimed owner record carries an empty passwordHash until Jaz signs up
// with the owner email, at which point signup "claims" it by setting a real
// hash. bcrypt never produces an empty hash, so the account can't be logged
// into before it's claimed.
export async function ensureOwner() {
  let owner = await prisma.user.findFirst({ where: { isOwner: true } });
  if (!owner) {
    owner =
      (await prisma.user.findUnique({ where: { email: OWNER_EMAIL } })) ?? null;
  }
  if (!owner) {
    owner = await prisma.user.create({
      data: {
        email: OWNER_EMAIL,
        passwordHash: "",
        displayName: "Jaskaran Singh",
        isOwner: true,
      },
    });
  }
  return owner;
}

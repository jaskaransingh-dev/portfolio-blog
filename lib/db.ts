import { PrismaClient } from "@prisma/client";

// Neon's pooled endpoint runs PgBouncer in transaction mode. Appending
// `pgbouncer=true` tells Prisma not to use prepared statements, which avoids
// "prepared statement already exists" errors on the pooled connection.
function pooledUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  if (!url.includes("pooler") || url.includes("pgbouncer=true")) return url;
  return url + (url.includes("?") ? "&" : "?") + "pgbouncer=true";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: pooledUrl(),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

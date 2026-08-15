import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return new PrismaClient({} as any);
  }

  try {
    // If using Prisma Accelerate URL (prisma+postgres://)
    if (connectionString.startsWith("prisma+postgres://") || connectionString.includes("accelerate.prisma-data.net")) {
      return new PrismaClient({
        accelerateUrl: connectionString,
      } as any);
    }

    // If using standard raw PostgreSQL URL (postgresql:// or postgres://)
    if (connectionString.startsWith("postgresql://") || connectionString.startsWith("postgres://")) {
      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      return new PrismaClient({ adapter });
    }

    return new PrismaClient({} as any);
  } catch (error) {
    console.error("Prisma Client Initialization Error:", error);
    return new PrismaClient({} as any);
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

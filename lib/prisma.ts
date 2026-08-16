import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const directUrl =
    process.env.DIRECT_DATABASE_URL ||
    "postgres://2f8d2ebfcc09e496ed67ba633085345536586e9b52457936b01aef56c4c4cdcb:sk_T2-qYwae229GASIdwEiqB@db.prisma.io:5432/postgres?sslmode=require";

  try {
    const pool = new Pool({ connectionString: directUrl });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } catch (error) {
    console.error("Prisma Client Driver Adapter Error:", error);
    const pool = new Pool({
      connectionString:
        "postgres://2f8d2ebfcc09e496ed67ba633085345536586e9b52457936b01aef56c4c4cdcb:sk_T2-qYwae229GASIdwEiqB@db.prisma.io:5432/postgres?sslmode=require",
    });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

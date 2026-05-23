import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { tables } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const tableRouter = createRouter({
  list: publicQuery
    .input(z.object({
      tenantId: z.number(),
      section: z.string().optional(),
      status: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [eq(tables.tenantId, input.tenantId)];
      if (input.section) conditions.push(eq(tables.section, input.section));
      if (input.status) conditions.push(eq(tables.status, input.status as any));
      return db.select().from(tables).where(and(...conditions));
    }),

  updateStatus: publicQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["available", "occupied", "reserved", "cleaning"]),
      currentOrderId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...update } = input;
      await db.update(tables).set(update).where(eq(tables.id, id));
      return { success: true };
    }),

  sections: publicQuery
    .input(z.object({ tenantId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const items = await db.select({ section: tables.section })
        .from(tables)
        .where(eq(tables.tenantId, input.tenantId));
      return [...new Set(items.map(i => i.section))];
    }),
});

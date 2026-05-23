import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { inventory } from "@db/schema";
import { eq, and, like } from "drizzle-orm";

export const inventoryRouter = createRouter({
  list: publicQuery
    .input(z.object({
      tenantId: z.number(),
      category: z.string().optional(),
      search: z.string().optional(),
      lowStock: z.boolean().optional(),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [eq(inventory.tenantId, input.tenantId), eq(inventory.isActive, true)];
      if (input.category) conditions.push(eq(inventory.category, input.category));
      if (input.search) conditions.push(like(inventory.name, `%${input.search}%`));
      const results = await db.select().from(inventory)
        .where(and(...conditions))
        .orderBy(inventory.name);
      if (input.lowStock) {
        return results.filter(item => parseFloat(item.quantity ?? "0") <= parseFloat(item.reorderPoint ?? "0"));
      }
      return results;
    }),

  update: publicQuery
    .input(z.object({
      id: z.number(),
      quantity: z.string().optional(),
      unitCost: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...update } = input;
      await db.update(inventory).set(update).where(eq(inventory.id, id));
      return { success: true };
    }),

  categories: publicQuery
    .input(z.object({ tenantId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const items = await db.select({ category: inventory.category })
        .from(inventory)
        .where(eq(inventory.tenantId, input.tenantId));
      return [...new Set(items.map(i => i.category))];
    }),
});

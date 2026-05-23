import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { categories, menuItems } from "@db/schema";
import { eq, and, asc } from "drizzle-orm";

export const menuRouter = createRouter({
  categories: publicQuery
    .input(z.object({ tenantId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(categories)
        .where(and(eq(categories.tenantId, input.tenantId), eq(categories.isActive, true)))
        .orderBy(asc(categories.sortOrder));
    }),

  items: publicQuery
    .input(z.object({
      tenantId: z.number(),
      categoryId: z.number().optional(),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [
        eq(menuItems.tenantId, input.tenantId),
        eq(menuItems.isAvailable, true),
      ];
      if (input.categoryId) {
        conditions.push(eq(menuItems.categoryId, input.categoryId));
      }
      return db.select().from(menuItems)
        .where(and(...conditions))
        .orderBy(asc(menuItems.name));
    }),

  itemById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db.select().from(menuItems).where(eq(menuItems.id, input.id));
      return results[0] ?? null;
    }),

  popularItems: publicQuery
    .input(z.object({ tenantId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(menuItems)
        .where(and(
          eq(menuItems.tenantId, input.tenantId),
          eq(menuItems.isAvailable, true),
          eq(menuItems.isPopular, true),
        ));
    }),
});

import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { staff } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const staffRouter = createRouter({
  list: publicQuery
    .input(z.object({
      tenantId: z.number(),
      role: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [eq(staff.tenantId, input.tenantId)];
      if (input.role) conditions.push(eq(staff.role, input.role as any));
      if (input.isActive !== undefined) conditions.push(eq(staff.isActive, input.isActive));
      return db.select().from(staff).where(and(...conditions));
    }),

  create: publicQuery
    .input(z.object({
      tenantId: z.number(),
      name: z.string(),
      email: z.string().optional(),
      phone: z.string().optional(),
      role: z.enum(["manager", "cashier", "chef", "server", "host", "driver"]),
      pin: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(staff).values(input);
      return { id: Number(result.insertId) };
    }),

  update: publicQuery
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      role: z.enum(["manager", "cashier", "chef", "server", "host", "driver"]).optional(),
      pin: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...update } = input;
      await db.update(staff).set(update).where(eq(staff.id, id));
      return { success: true };
    }),
});

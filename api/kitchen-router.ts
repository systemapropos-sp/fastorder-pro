import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orderItems, orders } from "@db/schema";
import { eq, and, inArray, asc } from "drizzle-orm";

export const kitchenRouter = createRouter({
  tickets: publicQuery
    .input(z.object({
      tenantId: z.number(),
      statuses: z.array(z.enum(["pending", "preparing", "ready", "served"])).optional(),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const statusFilter = input.statuses ?? ["pending", "preparing", "ready"];
      const orderResults = await db.select().from(orders)
        .where(and(
          eq(orders.tenantId, input.tenantId),
          inArray(orders.status, ["pending", "confirmed", "preparing", "ready"]),
        ))
        .orderBy(asc(orders.createdAt));

      const tickets = [];
      for (const order of orderResults) {
        const items = await db.select().from(orderItems)
          .where(and(
            eq(orderItems.orderId, order.id),
            inArray(orderItems.status, statusFilter),
          ));
        if (items.length > 0) {
          tickets.push({ ...order, items });
        }
      }
      return tickets;
    }),

  updateItemStatus: publicQuery
    .input(z.object({
      itemId: z.number(),
      status: z.enum(["pending", "preparing", "ready", "served"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(orderItems)
        .set({ status: input.status })
        .where(eq(orderItems.id, input.itemId));
      return { success: true };
    }),

  updateOrderStatus: publicQuery
    .input(z.object({
      orderId: z.number(),
      status: z.enum(["pending", "confirmed", "preparing", "ready", "served", "completed", "cancelled"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(orders)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(orders.id, input.orderId));
      if (input.status === "completed") {
        await db.update(orders)
          .set({ completedAt: new Date() })
          .where(eq(orders.id, input.orderId));
      }
      return { success: true };
    }),

  stats: publicQuery
    .input(z.object({ tenantId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const allOrders = await db.select().from(orders)
        .where(eq(orders.tenantId, input.tenantId));
      const allItems = await db.select().from(orderItems);
      const pendingItems = allItems.filter(i => i.status === "pending");
      const preparingItems = allItems.filter(i => i.status === "preparing");
      const readyItems = allItems.filter(i => i.status === "ready");
      return {
        totalOrders: allOrders.length,
        activeOrders: allOrders.filter(o => ["pending", "confirmed", "preparing", "ready"].includes(o.status)).length,
        pendingItems: pendingItems.length,
        preparingItems: preparingItems.length,
        readyItems: readyItems.length,
      };
    }),
});

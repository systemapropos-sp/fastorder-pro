import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders, orderItems } from "@db/schema";
import { eq, and, desc, gte } from "drizzle-orm";

export const orderRouter = createRouter({
  list: publicQuery
    .input(z.object({
      tenantId: z.number(),
      status: z.string().optional(),
      dateFrom: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [eq(orders.tenantId, input.tenantId)];
      if (input.status) {
        conditions.push(eq(orders.status, input.status as any));
      }
      if (input.dateFrom) {
        conditions.push(gte(orders.createdAt, new Date(input.dateFrom)));
      }
      return db.select().from(orders)
        .where(and(...conditions))
        .orderBy(desc(orders.createdAt));
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const orderResults = await db.select().from(orders).where(eq(orders.id, input.id));
      if (!orderResults[0]) return null;
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, input.id));
      return { ...orderResults[0], items };
    }),

  create: publicQuery
    .input(z.object({
      tenantId: z.number(),
      customerName: z.string().optional(),
      customerPhone: z.string().optional(),
      customerEmail: z.string().optional(),
      orderType: z.enum(["dineIn", "takeout", "delivery", "driveThru"]),
      tableNumber: z.string().optional(),
      notes: z.string().optional(),
      source: z.enum(["web", "kiosk", "pos", "mobile", "phone"]),
      subtotal: z.string(),
      tax: z.string(),
      tip: z.string().optional(),
      discount: z.string().optional(),
      total: z.string(),
      items: z.array(z.object({
        menuItemId: z.number(),
        name: z.string(),
        quantity: z.number(),
        unitPrice: z.string(),
        totalPrice: z.string(),
        selectedOptions: z.any().optional(),
        specialInstructions: z.string().optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const [result] = await db.insert(orders).values({
        tenantId: input.tenantId,
        orderNumber,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail,
        orderType: input.orderType,
        tableNumber: input.tableNumber,
        notes: input.notes,
        source: input.source,
        subtotal: input.subtotal,
        tax: input.tax,
        tip: input.tip ?? "0.00",
        discount: input.discount ?? "0.00",
        total: input.total,
        status: "pending",
        paymentStatus: "pending",
      });
      const orderId = Number(result.insertId);
      for (const item of input.items) {
        await db.insert(orderItems).values({
          orderId,
          menuItemId: item.menuItemId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          selectedOptions: item.selectedOptions,
          specialInstructions: item.specialInstructions,
          status: "pending",
        });
      }
      return { orderId, orderNumber };
    }),

  updateStatus: publicQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "confirmed", "preparing", "ready", "served", "completed", "cancelled"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(orders)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(orders.id, input.id));
      return { success: true };
    }),

  updatePayment: publicQuery
    .input(z.object({
      id: z.number(),
      paymentStatus: z.enum(["pending", "paid", "refunded", "failed"]),
      paymentMethod: z.enum(["cash", "card", "mobile", "online"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const update: any = { paymentStatus: input.paymentStatus, updatedAt: new Date() };
      if (input.paymentMethod) update.paymentMethod = input.paymentMethod;
      await db.update(orders).set(update).where(eq(orders.id, input.id));
      return { success: true };
    }),

  todayOrders: publicQuery
    .input(z.object({ tenantId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return db.select().from(orders)
        .where(and(
          eq(orders.tenantId, input.tenantId),
          gte(orders.createdAt, today),
        ))
        .orderBy(desc(orders.createdAt));
    }),
});

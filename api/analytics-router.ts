import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders, orderItems, menuItems, inventory, staff } from "@db/schema";
import { eq, and, gte } from "drizzle-orm";

export const analyticsRouter = createRouter({
  dashboard: publicQuery
    .input(z.object({ tenantId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const allOrders = await db.select().from(orders).where(eq(orders.tenantId, input.tenantId));
      const todayOrders = allOrders.filter(o => new Date(o.createdAt) >= today);
      const weekOrders = allOrders.filter(o => new Date(o.createdAt) >= weekAgo);

      const todayRevenue = todayOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
      const weekRevenue = weekOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);

      const activeOrders = allOrders.filter(o =>
        ["pending", "confirmed", "preparing", "ready"].includes(o.status)
      ).length;

      const completedToday = todayOrders.filter(o => o.status === "completed").length;

      // Inventory alerts
      const invItems = await db.select().from(inventory).where(eq(inventory.tenantId, input.tenantId));
      const lowStock = invItems.filter(i => parseFloat(i.quantity ?? "0") <= parseFloat(i.reorderPoint ?? "0")).length;

      // Staff count
      const staffMembers = await db.select().from(staff).where(eq(staff.tenantId, input.tenantId));

      return {
        todayRevenue,
        todayOrders: todayOrders.length,
        weekRevenue,
        weekOrders: weekOrders.length,
        activeOrders,
        completedToday,
        lowStock,
        totalStaff: staffMembers.length,
        activeStaff: staffMembers.filter(s => s.isActive).length,
      };
    }),

  salesByDay: publicQuery
    .input(z.object({ tenantId: z.number(), days: z.number().default(7) }))
    .query(async ({ input }) => {
      const db = getDb();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);
      startDate.setHours(0, 0, 0, 0);

      const allOrders = await db.select().from(orders)
        .where(and(
          eq(orders.tenantId, input.tenantId),
          gte(orders.createdAt, startDate),
        ));

      const dayMap: Record<string, { date: string; orders: number; revenue: number }> = {};
      for (const order of allOrders) {
        const date = new Date(order.createdAt).toISOString().split("T")[0];
        if (!dayMap[date]) dayMap[date] = { date, orders: 0, revenue: 0 };
        dayMap[date].orders++;
        dayMap[date].revenue += parseFloat(order.total);
      }
      return Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date));
    }),

  popularItems: publicQuery
    .input(z.object({ tenantId: z.number(), limit: z.number().default(5) }))
    .query(async ({ input }) => {
      const db = getDb();
      const items = await db.select().from(orderItems);
      const menu = await db.select().from(menuItems).where(eq(menuItems.tenantId, input.tenantId));

      const itemCounts: Record<number, { name: string; count: number; revenue: number }> = {};
      for (const item of items) {
        if (!itemCounts[item.menuItemId]) {
          const menuItem = menu.find(m => m.id === item.menuItemId);
          itemCounts[item.menuItemId] = { name: menuItem?.name ?? "Unknown", count: 0, revenue: 0 };
        }
        itemCounts[item.menuItemId].count += item.quantity;
        itemCounts[item.menuItemId].revenue += parseFloat(item.totalPrice);
      }
      return Object.values(itemCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, input.limit);
    }),
});

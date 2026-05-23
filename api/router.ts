import { authRouter } from "./auth-router";
import { menuRouter } from "./menu-router";
import { orderRouter } from "./order-router";
import { kitchenRouter } from "./kitchen-router";
import { inventoryRouter } from "./inventory-router";
import { staffRouter } from "./staff-router";
import { tableRouter } from "./table-router";
import { analyticsRouter } from "./analytics-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  menu: menuRouter,
  order: orderRouter,
  kitchen: kitchenRouter,
  inventory: inventoryRouter,
  staff: staffRouter,
  table: tableRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;

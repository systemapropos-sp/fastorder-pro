import { relations } from "drizzle-orm";
import {
  tenants,
  users,
  categories,
  menuItems,
  orders,
  orderItems,
  inventory,
  staff,
  tables,
  activityLog,
} from "./schema";

export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  categories: many(categories),
  menuItems: many(menuItems),
  orders: many(orders),
  inventory: many(inventory),
  staff: many(staff),
  tables: many(tables),
  activityLog: many(activityLog),
}));

export const usersRelations = relations(users, ({ one }) => ({
  tenant: one(tenants, { fields: [users.tenantId], references: [tenants.id] }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  tenant: one(tenants, { fields: [categories.tenantId], references: [tenants.id] }),
  menuItems: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  tenant: one(tenants, { fields: [menuItems.tenantId], references: [tenants.id] }),
  category: one(categories, { fields: [menuItems.categoryId], references: [categories.id] }),
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  tenant: one(tenants, { fields: [orders.tenantId], references: [tenants.id] }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  menuItem: one(menuItems, { fields: [orderItems.menuItemId], references: [menuItems.id] }),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  tenant: one(tenants, { fields: [inventory.tenantId], references: [tenants.id] }),
}));

export const staffRelations = relations(staff, ({ one }) => ({
  tenant: one(tenants, { fields: [staff.tenantId], references: [tenants.id] }),
}));

export const tablesRelations = relations(tables, ({ one }) => ({
  tenant: one(tenants, { fields: [tables.tenantId], references: [tenants.id] }),
}));

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  tenant: one(tenants, { fields: [activityLog.tenantId], references: [tenants.id] }),
  user: one(users, { fields: [activityLog.userId], references: [users.id] }),
}));

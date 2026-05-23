import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  bigint,
  int,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

// ─── TENANTS ───────────────────────────────────────────────────────────────
export const tenants = mysqlTable("tenants", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logo: text("logo"),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  timezone: varchar("timezone", { length: 100 }).default("America/New_York"),
  currency: varchar("currency", { length: 10 }).default("USD"),
  taxRate: decimal("taxRate", { precision: 5, scale: 2 }).default("8.50"),
  status: mysqlEnum("status", ["active", "suspended", "trial", "cancelled"])
    .default("trial")
    .notNull(),
  plan: mysqlEnum("plan", ["free", "basic", "professional", "enterprise"])
    .default("free")
    .notNull(),
  settings: json("settings").$type<{
    allowOnlineOrders: boolean;
    allowReservations: boolean;
    defaultOrderType: "dineIn" | "takeout" | "delivery";
    prepTimeMinutes: number;
    autoAcceptOrders: boolean;
  }>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = typeof tenants.$inferInsert;

// ─── USERS (extends auth users with tenant + role) ─────────────────────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin", "manager", "cashier", "kitchen", "superadmin"])
    .default("user")
    .notNull(),
  tenantId: bigint("tenantId", { mode: "number", unsigned: true }).references(() => tenants.id),
  phone: varchar("phone", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── CATEGORIES ────────────────────────────────────────────────────────────
export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  tenantId: bigint("tenantId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => tenants.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  image: text("image"),
  sortOrder: int("sortOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Category = typeof categories.$inferSelect;

// ─── MENU ITEMS ────────────────────────────────────────────────────────────
export const menuItems = mysqlTable("menuItems", {
  id: serial("id").primaryKey(),
  tenantId: bigint("tenantId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => tenants.id),
  categoryId: bigint("categoryId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => categories.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  image: text("image"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  costPrice: decimal("costPrice", { precision: 10, scale: 2 }).default("0.00"),
  calories: int("calories"),
  prepTimeMinutes: int("prepTimeMinutes").default(10),
  isAvailable: boolean("isAvailable").default(true),
  isPopular: boolean("isPopular").default(false),
  isVegetarian: boolean("isVegetarian").default(false),
  isVegan: boolean("isVegan").default(false),
  isGlutenFree: boolean("isGlutenFree").default(false),
  allergens: json("allergens").$type<string[]>(),
  tags: json("tags").$type<string[]>(),
  options: json("options").$type<{
    name: string;
    required: boolean;
    multiSelect: boolean;
    choices: { label: string; priceModifier: number }[];
  }[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type MenuItem = typeof menuItems.$inferSelect;

// ─── ORDERS ────────────────────────────────────────────────────────────────
export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  tenantId: bigint("tenantId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => tenants.id),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull(),
  customerName: varchar("customerName", { length: 255 }),
  customerPhone: varchar("customerPhone", { length: 50 }),
  customerEmail: varchar("customerEmail", { length: 320 }),
  orderType: mysqlEnum("orderType", ["dineIn", "takeout", "delivery", "driveThru"])
    .default("takeout")
    .notNull(),
  tableNumber: varchar("tableNumber", { length: 20 }),
  status: mysqlEnum("status", [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "served",
    "completed",
    "cancelled",
  ])
    .default("pending")
    .notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "refunded", "failed"])
    .default("pending")
    .notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["cash", "card", "mobile", "online"]),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
  tip: decimal("tip", { precision: 10, scale: 2 }).default("0.00"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0.00"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  source: mysqlEnum("source", ["web", "kiosk", "pos", "mobile", "phone"])
    .default("web")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  completedAt: timestamp("completedAt"),
});

export type Order = typeof orders.$inferSelect;

// ─── ORDER ITEMS ───────────────────────────────────────────────────────────
export const orderItems = mysqlTable("orderItems", {
  id: serial("id").primaryKey(),
  orderId: bigint("orderId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => orders.id),
  menuItemId: bigint("menuItemId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => menuItems.id),
  name: varchar("name", { length: 255 }).notNull(),
  quantity: int("quantity").notNull(),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
  selectedOptions: json("selectedOptions").$type<{
    optionName: string;
    choices: string[];
    priceModifier: number;
  }[]>(),
  specialInstructions: text("specialInstructions"),
  status: mysqlEnum("status", ["pending", "preparing", "ready", "served"])
    .default("pending")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;

// ─── INVENTORY ─────────────────────────────────────────────────────────────
export const inventory = mysqlTable("inventory", {
  id: serial("id").primaryKey(),
  tenantId: bigint("tenantId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => tenants.id),
  name: varchar("name", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 100 }),
  category: varchar("category", { length: 100 }),
  unit: varchar("unit", { length: 50 }).default("units"),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).default("0"),
  minLevel: decimal("minLevel", { precision: 10, scale: 2 }).default("10"),
  maxLevel: decimal("maxLevel", { precision: 10, scale: 2 }).default("100"),
  reorderPoint: decimal("reorderPoint", { precision: 10, scale: 2 }).default("20"),
  unitCost: decimal("unitCost", { precision: 10, scale: 2 }).default("0.00"),
  supplier: varchar("supplier", { length: 255 }),
  location: varchar("location", { length: 255 }),
  expiryDate: timestamp("expiryDate"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Inventory = typeof inventory.$inferSelect;

// ─── STAFF ─────────────────────────────────────────────────────────────────
export const staff = mysqlTable("staff", {
  id: serial("id").primaryKey(),
  tenantId: bigint("tenantId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => tenants.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  role: mysqlEnum("role", ["manager", "cashier", "chef", "server", "host", "driver"])
    .notNull(),
  pin: varchar("pin", { length: 10 }),
  isActive: boolean("isActive").default(true),
  schedule: json("schedule").$type<{
    day: string;
    start: string;
    end: string;
  }[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Staff = typeof staff.$inferSelect;

// ─── TABLES ────────────────────────────────────────────────────────────────
export const tables = mysqlTable("tables", {
  id: serial("id").primaryKey(),
  tenantId: bigint("tenantId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => tenants.id),
  number: varchar("number", { length: 20 }).notNull(),
  capacity: int("capacity").default(4),
  section: varchar("section", { length: 100 }).default("main"),
  status: mysqlEnum("status", ["available", "occupied", "reserved", "cleaning"])
    .default("available")
    .notNull(),
  currentOrderId: bigint("currentOrderId", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Table = typeof tables.$inferSelect;

// ─── ACTIVITY LOG ──────────────────────────────────────────────────────────
export const activityLog = mysqlTable("activityLog", {
  id: serial("id").primaryKey(),
  tenantId: bigint("tenantId", { mode: "number", unsigned: true })
    .references(() => tenants.id),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  entity: varchar("entity", { length: 100 }),
  entityId: bigint("entityId", { mode: "number", unsigned: true }),
  details: json("details"),
  ipAddress: varchar("ipAddress", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLog.$inferSelect;

import { getDb } from "../api/queries/connection";
import { tenants, categories, menuItems, orders, staff, tables, inventory } from "./schema";

async function check() {
  const db = getDb();
  const t = await db.select().from(tenants);
  console.log("Tenants:", t.map(x => ({id: x.id, name: x.name, slug: x.slug})));
  const c = await db.select().from(categories);
  console.log("Categories:", c.length);
  const m = await db.select().from(menuItems);
  console.log("MenuItems:", m.length);
  const o = await db.select().from(orders);
  console.log("Orders:", o.length);
  const s = await db.select().from(staff);
  console.log("Staff:", s.length);
  const tbl = await db.select().from(tables);
  console.log("Tables:", tbl.length);
  const i = await db.select().from(inventory);
  console.log("Inventory:", i.length);
  process.exit(0);
}

check();

import { getDb } from "../api/queries/connection";
import { orderItems, orders } from "./schema";

async function clear() {
  const db = getDb();
  await db.delete(orderItems);
  await db.delete(orders);
  console.log("Cleared orders and order items");
  process.exit(0);
}

clear();

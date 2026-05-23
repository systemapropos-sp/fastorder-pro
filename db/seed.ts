import { getDb } from "../api/queries/connection";
import { tenants, categories, menuItems, staff, tables, inventory, orders, orderItems } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  const db = getDb();
  console.log("Seeding FastOrder Pro database...");

  // ─── CHECK EXISTING TENANT ───────────────────────────────────────────────
  let tenantId: number;
  const existingTenants = await db.select().from(tenants).where(eq(tenants.slug, "rustic-loaf"));
  if (existingTenants.length > 0) {
    tenantId = existingTenants[0].id;
    console.log("Using existing tenant:", tenantId);
  } else {
    const [tenant] = await db.insert(tenants).values({
      name: "The Rustic Loaf Café",
      slug: "rustic-loaf",
      address: "1245 Market Street, San Francisco, CA 94103",
      phone: "(415) 555-0187",
      email: "hello@rusticloaf.com",
      timezone: "America/Los_Angeles",
      currency: "USD",
      taxRate: "8.75",
      status: "active",
      plan: "professional",
      settings: {
        allowOnlineOrders: true,
        allowReservations: true,
        defaultOrderType: "dineIn",
        prepTimeMinutes: 15,
        autoAcceptOrders: false,
      },
    });
    tenantId = Number(tenant.insertId);
    console.log("Created tenant:", tenantId);
  }

  // ─── CATEGORIES ──────────────────────────────────────────────────────────
  let allCats = await db.select().from(categories).where(eq(categories.tenantId, tenantId));
  if (allCats.length === 0) {
    await db.insert(categories).values([
      { tenantId, name: "Signature Sandwiches", description: "Artisan breads, premium fillings", image: "/food/chicken-sandwich.jpg", sortOrder: 1, isActive: true },
      { tenantId, name: "Fresh Salads", description: "Crisp greens, house-made dressings", image: "/food/mediterranean-salad.jpg", sortOrder: 2, isActive: true },
      { tenantId, name: "Soups & Warm Bowls", description: "Comfort in every spoonful", image: "/food/tomato-soup.jpg", sortOrder: 3, isActive: true },
      { tenantId, name: "Bakery & Pastries", description: "Fresh baked daily", image: "/food/cinnamon-roll.jpg", sortOrder: 4, isActive: true },
      { tenantId, name: "Beverages", description: "Coffee, smoothies & more", image: "/food/caramel-latte.jpg", sortOrder: 5, isActive: true },
    ]);
    allCats = await db.select().from(categories).where(eq(categories.tenantId, tenantId));
    console.log("Created categories");
  } else {
    console.log("Using existing categories:", allCats.length);
  }

  const catMap: Record<string, number> = {};
  for (const c of allCats) {
    catMap[c.name] = c.id;
  }

  // ─── MENU ITEMS ──────────────────────────────────────────────────────────
  const existingItems = await db.select().from(menuItems).where(eq(menuItems.tenantId, tenantId));
  if (existingItems.length > 0) {
    console.log("Menu items already exist, skipping...");
  } else {
    const sandwichesId = catMap["Signature Sandwiches"];
    const saladsId = catMap["Fresh Salads"];
    const soupsId = catMap["Soups & Warm Bowls"];
    const bakeryId = catMap["Bakery & Pastries"];
    const beveragesId = catMap["Beverages"];

    await db.insert(menuItems).values([
      {
        tenantId, categoryId: sandwichesId,
        name: "Grilled Chicken Avocado",
        description: "Grilled chicken breast, fresh avocado, lettuce, tomato, and chipotle mayo on toasted sourdough. Served with kettle chips.",
        image: "/food/chicken-sandwich.jpg",
        price: "14.99", costPrice: "5.50", calories: 620, prepTimeMinutes: 12,
        isAvailable: true, isPopular: true, isVegetarian: false, isVegan: false, isGlutenFree: false,
        allergens: ["gluten", "egg"],
        tags: ["bestseller", "high-protein"],
        options: [
          { name: "Bread", required: true, multiSelect: false, choices: [
            { label: "Sourdough", priceModifier: 0 },
            { label: "Whole Wheat", priceModifier: 0 },
            { label: "Gluten-Free", priceModifier: 1.50 },
            { label: "Ciabatta", priceModifier: 0.50 },
          ]},
          { name: "Extras", required: false, multiSelect: true, choices: [
            { label: "Extra Avocado", priceModifier: 2.00 },
            { label: "Bacon", priceModifier: 2.50 },
            { label: "Provolone Cheese", priceModifier: 1.00 },
          ]},
        ],
      },
      {
        tenantId, categoryId: sandwichesId,
        name: "Turkey Bacon Club",
        description: "Oven-roasted turkey, crispy bacon, avocado, lettuce, tomato, and herb mayo on toasted brioche bun.",
        image: "/food/turkey-club.jpg",
        price: "15.49", costPrice: "5.80", calories: 710, prepTimeMinutes: 10,
        isAvailable: true, isPopular: true, isVegetarian: false, isVegan: false, isGlutenFree: false,
        allergens: ["gluten", "egg", "dairy"],
        tags: ["bestseller", "classic"],
        options: [
          { name: "Bread", required: true, multiSelect: false, choices: [
            { label: "Brioche", priceModifier: 0 },
            { label: "Sourdough", priceModifier: 0 },
            { label: "Gluten-Free", priceModifier: 1.50 },
          ]},
          { name: "Side", required: true, multiSelect: false, choices: [
            { label: "Kettle Chips", priceModifier: 0 },
            { label: "Side Salad", priceModifier: 1.00 },
            { label: "Sweet Potato Fries", priceModifier: 2.00 },
          ]},
        ],
      },
      {
        tenantId, categoryId: sandwichesId,
        name: "Ham & Swiss Baguette",
        description: "Black forest ham, Swiss cheese, Dijon mustard, cornichons, and arugula on a freshly baked baguette.",
        image: "/food/ham-baguette.jpg",
        price: "13.99", costPrice: "4.80", calories: 580, prepTimeMinutes: 8,
        isAvailable: true, isPopular: false, isVegetarian: false, isVegan: false, isGlutenFree: false,
        allergens: ["gluten", "dairy"],
        tags: ["classic"],
        options: [
          { name: "Extras", required: false, multiSelect: true, choices: [
            { label: "Extra Ham", priceModifier: 2.50 },
            { label: "Extra Cheese", priceModifier: 1.00 },
            { label: "Tomato", priceModifier: 0.50 },
          ]},
        ],
      },
      {
        tenantId, categoryId: sandwichesId,
        name: "BBQ Pulled Pork",
        description: "Slow-braised pulled pork tossed in house BBQ sauce, topped with creamy coleslaw on a toasted brioche bun. Served with sweet potato fries.",
        image: "/food/bbq-sandwich.jpg",
        price: "16.49", costPrice: "6.20", calories: 850, prepTimeMinutes: 15,
        isAvailable: true, isPopular: true, isVegetarian: false, isVegan: false, isGlutenFree: false,
        allergens: ["gluten"],
        tags: ["hearty", "bestseller"],
        options: [
          { name: "Heat Level", required: true, multiSelect: false, choices: [
            { label: "Mild", priceModifier: 0 },
            { label: "Medium", priceModifier: 0 },
            { label: "Spicy", priceModifier: 0 },
          ]},
          { name: "Extras", required: false, multiSelect: true, choices: [
            { label: "Extra BBQ Sauce", priceModifier: 0.50 },
            { label: "Pickles", priceModifier: 0.50 },
            { label: "Onion Rings", priceModifier: 2.00 },
          ]},
        ],
      },
      {
        tenantId, categoryId: saladsId,
        name: "Mediterranean Chicken Salad",
        description: "Mixed greens, grilled chicken, feta cheese, kalamata olives, cucumber, cherry tomatoes, red onion, and tzatziki dressing.",
        image: "/food/mediterranean-salad.jpg",
        price: "16.99", costPrice: "6.00", calories: 480, prepTimeMinutes: 10,
        isAvailable: true, isPopular: true, isVegetarian: false, isVegan: false, isGlutenFree: true,
        allergens: ["dairy"],
        tags: ["healthy", "gluten-free", "high-protein"],
        options: [
          { name: "Dressing", required: true, multiSelect: false, choices: [
            { label: "Tzatziki", priceModifier: 0 },
            { label: "Lemon Vinaigrette", priceModifier: 0 },
            { label: "Balsamic", priceModifier: 0 },
          ]},
          { name: "Add-ons", required: false, multiSelect: true, choices: [
            { label: "Grilled Shrimp", priceModifier: 4.50 },
            { label: "Avocado", priceModifier: 2.00 },
            { label: "Quinoa", priceModifier: 1.50 },
          ]},
        ],
      },
      {
        tenantId, categoryId: saladsId,
        name: "Classic Caesar",
        description: "Crisp romaine lettuce, grilled chicken, shaved parmesan, crunchy croutons, and our signature Caesar dressing.",
        image: "/food/caesar-salad.jpg",
        price: "15.49", costPrice: "5.20", calories: 520, prepTimeMinutes: 8,
        isAvailable: true, isPopular: true, isVegetarian: false, isVegan: false, isGlutenFree: false,
        allergens: ["gluten", "dairy", "egg", "fish"],
        tags: ["classic"],
        options: [
          { name: "Protein", required: true, multiSelect: false, choices: [
            { label: "Grilled Chicken", priceModifier: 0 },
            { label: "Salmon", priceModifier: 3.00 },
            { label: "Shrimp", priceModifier: 4.50 },
            { label: "No Protein", priceModifier: -3.00 },
          ]},
          { name: "Extras", required: false, multiSelect: true, choices: [
            { label: "Extra Parmesan", priceModifier: 1.00 },
            { label: "Avocado", priceModifier: 2.00 },
          ]},
        ],
      },
      {
        tenantId, categoryId: saladsId,
        name: "Greek Village Salad",
        description: "Cucumbers, tomatoes, red onions, Kalamata olives, bell peppers, and generous blocks of feta cheese with olive oil and oregano.",
        image: "/food/greek-salad.jpg",
        price: "14.49", costPrice: "4.80", calories: 380, prepTimeMinutes: 8,
        isAvailable: true, isPopular: false, isVegetarian: true, isVegan: false, isGlutenFree: true,
        allergens: ["dairy"],
        tags: ["vegetarian", "gluten-free", "fresh"],
        options: [
          { name: "Add Protein", required: false, multiSelect: false, choices: [
            { label: "Grilled Chicken", priceModifier: 3.50 },
            { label: "Grilled Shrimp", priceModifier: 4.50 },
            { label: "None", priceModifier: 0 },
          ]},
        ],
      },
      {
        tenantId, categoryId: soupsId,
        name: "Tomato Basil Soup",
        description: "Creamy vine-ripened tomato soup with fresh basil, a touch of cream, and parmesan. Served with a grilled cheese sandwich on sourdough.",
        image: "/food/tomato-soup.jpg",
        price: "12.99", costPrice: "3.50", calories: 450, prepTimeMinutes: 8,
        isAvailable: true, isPopular: true, isVegetarian: true, isVegan: false, isGlutenFree: false,
        allergens: ["gluten", "dairy"],
        tags: ["comfort", "vegetarian", "classic"],
        options: [
          { name: "Size", required: true, multiSelect: false, choices: [
            { label: "Cup", priceModifier: -2.00 },
            { label: "Bowl", priceModifier: 0 },
            { label: "Bread Bowl", priceModifier: 2.50 },
          ]},
          { name: "Sandwich", required: true, multiSelect: false, choices: [
            { label: "Grilled Cheese", priceModifier: 0 },
            { label: "Turkey & Swiss", priceModifier: 1.50 },
            { label: "No Sandwich", priceModifier: -3.00 },
          ]},
        ],
      },
      {
        tenantId, categoryId: soupsId,
        name: "Broccoli Cheddar Soup",
        description: "Rich and creamy broccoli cheddar soup served in a sourdough bread bowl. Topped with extra cheddar and fresh chives.",
        image: "/food/broccoli-soup.jpg",
        price: "13.49", costPrice: "3.80", calories: 580, prepTimeMinutes: 8,
        isAvailable: true, isPopular: true, isVegetarian: true, isVegan: false, isGlutenFree: false,
        allergens: ["gluten", "dairy"],
        tags: ["comfort", "vegetarian", "bestseller"],
        options: [
          { name: "Serving", required: true, multiSelect: false, choices: [
            { label: "Regular Bowl", priceModifier: 0 },
            { label: "Bread Bowl", priceModifier: 2.00 },
            { label: "Cup", priceModifier: -2.00 },
          ]},
          { name: "Extras", required: false, multiSelect: true, choices: [
            { label: "Extra Cheese", priceModifier: 1.00 },
            { label: "Bacon Bits", priceModifier: 1.50 },
            { label: "Sourdough Bread", priceModifier: 1.00 },
          ]},
        ],
      },
      {
        tenantId, categoryId: bakeryId,
        name: "Cinnamon Roll",
        description: "Freshly baked cinnamon roll with swirls of cinnamon sugar, topped with our signature cream cheese icing. Warm and gooey.",
        image: "/food/cinnamon-roll.jpg",
        price: "5.99", costPrice: "1.50", calories: 420, prepTimeMinutes: 3,
        isAvailable: true, isPopular: true, isVegetarian: true, isVegan: false, isGlutenFree: false,
        allergens: ["gluten", "dairy", "egg"],
        tags: ["bestseller", "sweet"],
        options: [
          { name: "Heating", required: true, multiSelect: false, choices: [
            { label: "Warm", priceModifier: 0 },
            { label: "Room Temperature", priceModifier: 0 },
          ]},
          { name: "Extras", required: false, multiSelect: true, choices: [
            { label: "Extra Icing", priceModifier: 0.50 },
            { label: "Walnuts", priceModifier: 1.00 },
            { label: "Caramel Drizzle", priceModifier: 0.75 },
          ]},
        ],
      },
      {
        tenantId, categoryId: bakeryId,
        name: "Chocolate Chip Muffin",
        description: "Moist and fluffy muffin loaded with semi-sweet chocolate chips. Fresh baked every morning.",
        image: "/food/chocolate-muffin.jpg",
        price: "4.49", costPrice: "1.20", calories: 380, prepTimeMinutes: 2,
        isAvailable: true, isPopular: true, isVegetarian: true, isVegan: false, isGlutenFree: false,
        allergens: ["gluten", "dairy", "egg"],
        tags: ["classic", "sweet"],
        options: [
          { name: "Heating", required: true, multiSelect: false, choices: [
            { label: "Warm", priceModifier: 0 },
            { label: "Room Temperature", priceModifier: 0 },
          ]},
        ],
      },
      {
        tenantId, categoryId: bakeryId,
        name: "Blueberry Scone",
        description: "Buttery scone bursting with fresh blueberries, dusted with powdered sugar. Served with butter on the side.",
        image: "/food/blueberry-scone.jpg",
        price: "4.99", costPrice: "1.30", calories: 350, prepTimeMinutes: 2,
        isAvailable: true, isPopular: false, isVegetarian: true, isVegan: false, isGlutenFree: false,
        allergens: ["gluten", "dairy"],
        tags: ["classic", "sweet"],
        options: [
          { name: "Spread", required: false, multiSelect: true, choices: [
            { label: "Butter", priceModifier: 0 },
            { label: "Cream Cheese", priceModifier: 0.50 },
            { label: "Lemon Curd", priceModifier: 0.75 },
          ]},
        ],
      },
      {
        tenantId, categoryId: beveragesId,
        name: "Iced Caramel Latte",
        description: "Smooth espresso with steamed milk, poured over ice, and finished with rich caramel drizzle.",
        image: "/food/caramel-latte.jpg",
        price: "6.49", costPrice: "1.80", calories: 280, prepTimeMinutes: 4,
        isAvailable: true, isPopular: true, isVegetarian: true, isVegan: false, isGlutenFree: true,
        allergens: ["dairy"],
        tags: ["bestseller", "caffeinated"],
        options: [
          { name: "Size", required: true, multiSelect: false, choices: [
            { label: "Small (12oz)", priceModifier: -1.00 },
            { label: "Medium (16oz)", priceModifier: 0 },
            { label: "Large (20oz)", priceModifier: 1.00 },
          ]},
          { name: "Milk", required: true, multiSelect: false, choices: [
            { label: "Whole Milk", priceModifier: 0 },
            { label: "Oat Milk", priceModifier: 0.75 },
            { label: "Almond Milk", priceModifier: 0.75 },
            { label: "Skim Milk", priceModifier: 0 },
          ]},
          { name: "Extras", required: false, multiSelect: true, choices: [
            { label: "Extra Shot", priceModifier: 1.00 },
            { label: "Whipped Cream", priceModifier: 0.50 },
          ]},
        ],
      },
      {
        tenantId, categoryId: beveragesId,
        name: "Green Power Smoothie",
        description: "Spinach, banana, mango, and apple juice blended smooth. Topped with granola, chia seeds, and fresh berries.",
        image: "/food/green-smoothie.jpg",
        price: "8.99", costPrice: "2.50", calories: 320, prepTimeMinutes: 5,
        isAvailable: true, isPopular: true, isVegetarian: true, isVegan: true, isGlutenFree: true,
        allergens: [],
        tags: ["healthy", "vegan", "gluten-free", "refreshing"],
        options: [
          { name: "Size", required: true, multiSelect: false, choices: [
            { label: "Regular", priceModifier: 0 },
            { label: "Large", priceModifier: 2.00 },
          ]},
          { name: "Boosts", required: false, multiSelect: true, choices: [
            { label: "Protein Powder", priceModifier: 1.50 },
            { label: "Spirulina", priceModifier: 1.00 },
            { label: "Flax Seeds", priceModifier: 0.50 },
          ]},
        ],
      },
    ]);
    console.log("Created menu items");
  }

  // ─── STAFF ───────────────────────────────────────────────────────────────
  const existingStaff = await db.select().from(staff).where(eq(staff.tenantId, tenantId));
  if (existingStaff.length === 0) {
    await db.insert(staff).values([
      { tenantId, name: "Marcus Chen", email: "marcus@rusticloaf.com", phone: "(415) 555-0101", role: "manager", pin: "1234", isActive: true },
      { tenantId, name: "Sarah Johnson", email: "sarah@rusticloaf.com", phone: "(415) 555-0102", role: "cashier", pin: "2345", isActive: true },
      { tenantId, name: "David Park", email: "david@rusticloaf.com", phone: "(415) 555-0103", role: "chef", pin: "3456", isActive: true },
      { tenantId, name: "Elena Rodriguez", email: "elena@rusticloaf.com", phone: "(415) 555-0104", role: "server", pin: "4567", isActive: true },
      { tenantId, name: "James Wilson", email: "james@rusticloaf.com", phone: "(415) 555-0105", role: "host", pin: "5678", isActive: true },
      { tenantId, name: "Aisha Patel", email: "aisha@rusticloaf.com", phone: "(415) 555-0106", role: "chef", pin: "6789", isActive: true },
    ]);
    console.log("Created staff members");
  }

  // ─── TABLES ──────────────────────────────────────────────────────────────
  const existingTables = await db.select().from(tables).where(eq(tables.tenantId, tenantId));
  if (existingTables.length === 0) {
    await db.insert(tables).values([
      { tenantId, number: "1", capacity: 2, section: "Patio", status: "available" },
      { tenantId, number: "2", capacity: 2, section: "Patio", status: "available" },
      { tenantId, number: "3", capacity: 4, section: "Patio", status: "available" },
      { tenantId, number: "4", capacity: 4, section: "Patio", status: "occupied" },
      { tenantId, number: "5", capacity: 6, section: "Patio", status: "available" },
      { tenantId, number: "6", capacity: 2, section: "Main Floor", status: "available" },
      { tenantId, number: "7", capacity: 2, section: "Main Floor", status: "occupied" },
      { tenantId, number: "8", capacity: 4, section: "Main Floor", status: "available" },
      { tenantId, number: "9", capacity: 4, section: "Main Floor", status: "reserved" },
      { tenantId, number: "10", capacity: 4, section: "Main Floor", status: "available" },
      { tenantId, number: "11", capacity: 6, section: "Main Floor", status: "available" },
      { tenantId, number: "12", capacity: 8, section: "Main Floor", status: "available" },
      { tenantId, number: "13", capacity: 2, section: "Bar Area", status: "available" },
      { tenantId, number: "14", capacity: 2, section: "Bar Area", status: "occupied" },
      { tenantId, number: "15", capacity: 4, section: "Bar Area", status: "available" },
      { tenantId, number: "16", capacity: 4, section: "Private Room", status: "available" },
      { tenantId, number: "17", capacity: 8, section: "Private Room", status: "reserved" },
      { tenantId, number: "18", capacity: 12, section: "Private Room", status: "available" },
    ]);
    console.log("Created tables");
  }

  // ─── INVENTORY ───────────────────────────────────────────────────────────
  const existingInventory = await db.select().from(inventory).where(eq(inventory.tenantId, tenantId));
  if (existingInventory.length === 0) {
    await db.insert(inventory).values([
      { tenantId, name: "Chicken Breast", sku: "CHB-001", category: "Proteins", unit: "lbs", quantity: "45.5", minLevel: "20", reorderPoint: "25", unitCost: "4.50", supplier: "Golden Farms Poultry" },
      { tenantId, name: "Sourdough Bread", sku: "BRD-001", category: "Bakery", unit: "loaves", quantity: "32", minLevel: "15", reorderPoint: "20", unitCost: "2.25", supplier: "Artisan Bakery Co." },
      { tenantId, name: "Avocado", sku: "PRD-001", category: "Produce", unit: "each", quantity: "78", minLevel: "30", reorderPoint: "40", unitCost: "1.20", supplier: "California Fresh Produce" },
      { tenantId, name: "Cheddar Cheese", sku: "DAI-001", category: "Dairy", unit: "lbs", quantity: "22", minLevel: "10", reorderPoint: "15", unitCost: "3.80", supplier: "Wisconsin Dairy Group" },
      { tenantId, name: "Lettuce Mix", sku: "PRD-002", category: "Produce", unit: "lbs", quantity: "18", minLevel: "10", reorderPoint: "15", unitCost: "2.10", supplier: "California Fresh Produce" },
      { tenantId, name: "Tomatoes", sku: "PRD-003", category: "Produce", unit: "lbs", quantity: "25", minLevel: "10", reorderPoint: "15", unitCost: "1.80", supplier: "California Fresh Produce" },
      { tenantId, name: "Coffee Beans", sku: "BEV-001", category: "Beverages", unit: "lbs", quantity: "35", minLevel: "15", reorderPoint: "20", unitCost: "8.50", supplier: "Roasters United" },
      { tenantId, name: "Flour (All Purpose)", sku: "DRY-001", category: "Dry Goods", unit: "lbs", quantity: "120", minLevel: "50", reorderPoint: "75", unitCost: "0.45", supplier: "Midwest Grain Co." },
      { tenantId, name: "Sugar", sku: "DRY-002", category: "Dry Goods", unit: "lbs", quantity: "85", minLevel: "30", reorderPoint: "50", unitCost: "0.55", supplier: "Midwest Grain Co." },
      { tenantId, name: "Bacon", sku: "PRN-001", category: "Proteins", unit: "lbs", quantity: "28", minLevel: "10", reorderPoint: "15", unitCost: "5.20", supplier: "Heritage Meats" },
      { tenantId, name: "Eggs", sku: "DAI-002", category: "Dairy", unit: "dozen", quantity: "24", minLevel: "10", reorderPoint: "15", unitCost: "3.50", supplier: "Wisconsin Dairy Group" },
      { tenantId, name: "Blueberries", sku: "PRD-004", category: "Produce", unit: "lbs", quantity: "15", minLevel: "8", reorderPoint: "12", unitCost: "4.00", supplier: "California Fresh Produce" },
      { tenantId, name: "Chocolate Chips", sku: "DRY-003", category: "Dry Goods", unit: "lbs", quantity: "40", minLevel: "15", reorderPoint: "25", unitCost: "3.20", supplier: "Cocoa Supply Inc." },
      { tenantId, name: "Olive Oil", sku: "DRY-004", category: "Dry Goods", unit: "liters", quantity: "18", minLevel: "8", reorderPoint: "12", unitCost: "6.50", supplier: "Mediterranean Imports" },
      { tenantId, name: "Salmon Fillet", sku: "SEA-001", category: "Proteins", unit: "lbs", quantity: "20", minLevel: "10", reorderPoint: "15", unitCost: "9.80", supplier: "Pacific Seafood Co." },
    ]);
    console.log("Created inventory items");
  }

  // ─── SAMPLE ORDERS ───────────────────────────────────────────────────────
  const existingOrders = await db.select().from(orders).where(eq(orders.tenantId, tenantId));
  if (existingOrders.length === 0) {
    const orderData = [
      { tenantId, orderNumber: "ORD-2026-1001", customerName: "Emily Watson", customerPhone: "(415) 555-0201", orderType: "dineIn" as const, tableNumber: "7", status: "completed" as const, paymentStatus: "paid" as const, paymentMethod: "card" as const, subtotal: "32.47", tax: "2.84", tip: "5.00", discount: "0.00", total: "40.31", source: "web" as const },
      { tenantId, orderNumber: "ORD-2026-1002", customerName: "Michael Torres", customerPhone: "(415) 555-0202", orderType: "takeout" as const, status: "completed" as const, paymentStatus: "paid" as const, paymentMethod: "cash" as const, subtotal: "15.49", tax: "1.36", tip: "2.00", discount: "0.00", total: "18.85", source: "pos" as const },
      { tenantId, orderNumber: "ORD-2026-1003", customerName: "Lisa Chang", customerPhone: "(415) 555-0203", orderType: "dineIn" as const, tableNumber: "4", status: "completed" as const, paymentStatus: "paid" as const, paymentMethod: "mobile" as const, subtotal: "28.47", tax: "2.49", tip: "4.50", discount: "2.00", total: "33.46", source: "kiosk" as const },
      { tenantId, orderNumber: "ORD-2026-1004", customerName: "Robert Kim", customerPhone: "(415) 555-0204", orderType: "delivery" as const, status: "completed" as const, paymentStatus: "paid" as const, paymentMethod: "online" as const, subtotal: "41.96", tax: "3.67", tip: "6.00", discount: "0.00", total: "51.63", source: "web" as const },
      { tenantId, orderNumber: "ORD-2026-1005", customerName: "Amanda Foster", customerPhone: "(415) 555-0205", orderType: "dineIn" as const, tableNumber: "14", status: "preparing" as const, paymentStatus: "paid" as const, paymentMethod: "card" as const, subtotal: "24.97", tax: "2.18", tip: "0.00", discount: "0.00", total: "27.15", source: "web" as const },
      { tenantId, orderNumber: "ORD-2026-1006", customerName: "Daniel Lee", customerPhone: "(415) 555-0206", orderType: "takeout" as const, status: "ready" as const, paymentStatus: "paid" as const, paymentMethod: "card" as const, subtotal: "19.48", tax: "1.70", tip: "3.00", discount: "0.00", total: "24.18", source: "pos" as const },
      { tenantId, orderNumber: "ORD-2026-1007", customerName: "Jessica Brown", customerPhone: "(415) 555-0207", orderType: "dineIn" as const, tableNumber: "2", status: "preparing" as const, paymentStatus: "pending" as const, paymentMethod: "cash" as const, subtotal: "38.95", tax: "3.41", tip: "0.00", discount: "0.00", total: "42.36", source: "kiosk" as const },
      { tenantId, orderNumber: "ORD-2026-1008", customerName: "Ryan Martinez", customerPhone: "(415) 555-0208", orderType: "delivery" as const, status: "confirmed" as const, paymentStatus: "paid" as const, paymentMethod: "online" as const, subtotal: "55.45", tax: "4.85", tip: "8.00", discount: "5.00", total: "63.30", source: "web" as const },
      { tenantId, orderNumber: "ORD-2026-1009", customerName: "Sophie Anderson", customerPhone: "(415) 555-0209", orderType: "dineIn" as const, tableNumber: "8", status: "pending" as const, paymentStatus: "pending" as const, paymentMethod: "card" as const, subtotal: "17.48", tax: "1.53", tip: "0.00", discount: "0.00", total: "19.01", source: "web" as const },
      { tenantId, orderNumber: "ORD-2026-1010", customerName: "Chris Nguyen", customerPhone: "(415) 555-0210", orderType: "takeout" as const, status: "preparing" as const, paymentStatus: "paid" as const, paymentMethod: "mobile" as const, subtotal: "12.99", tax: "1.14", tip: "2.00", discount: "0.00", total: "16.13", source: "web" as const },
    ];

    for (const order of orderData) {
      await db.insert(orders).values(order);
    }
    console.log("Created sample orders");

    // Fetch order IDs
    const allOrders = await db.select().from(orders).where(eq(orders.tenantId, tenantId));
    const orderMap: Record<string, number> = {};
    for (const o of allOrders) {
      orderMap[o.orderNumber] = o.id;
    }

    // Get menu item IDs
    const allMenuItems = await db.select().from(menuItems).where(eq(menuItems.tenantId, tenantId));
    const menuItemMap: Record<string, number> = {};
    for (const m of allMenuItems) {
      menuItemMap[m.name] = m.id;
    }

    const orderItemsData = [
      { orderId: orderMap["ORD-2026-1001"], menuItemId: menuItemMap["Grilled Chicken Avocado"], name: "Grilled Chicken Avocado", quantity: 1, unitPrice: "14.99", totalPrice: "16.99", selectedOptions: [{ optionName: "Bread", choices: ["Sourdough"], priceModifier: 0 }, { optionName: "Extras", choices: ["Extra Avocado"], priceModifier: 2.00 }] as any, status: "served" as const },
      { orderId: orderMap["ORD-2026-1001"], menuItemId: menuItemMap["Mediterranean Chicken Salad"], name: "Mediterranean Chicken Salad", quantity: 1, unitPrice: "16.99", totalPrice: "16.99", selectedOptions: [{ optionName: "Dressing", choices: ["Tzatziki"], priceModifier: 0 }] as any, status: "served" as const },
      { orderId: orderMap["ORD-2026-1002"], menuItemId: menuItemMap["Turkey Bacon Club"], name: "Turkey Bacon Club", quantity: 1, unitPrice: "15.49", totalPrice: "15.49", selectedOptions: [{ optionName: "Bread", choices: ["Brioche"], priceModifier: 0 }, { optionName: "Side", choices: ["Kettle Chips"], priceModifier: 0 }] as any, status: "served" as const },
      { orderId: orderMap["ORD-2026-1003"], menuItemId: menuItemMap["Tomato Basil Soup"], name: "Tomato Basil Soup", quantity: 1, unitPrice: "12.99", totalPrice: "12.99", selectedOptions: [{ optionName: "Size", choices: ["Bowl"], priceModifier: 0 }, { optionName: "Sandwich", choices: ["Grilled Cheese"], priceModifier: 0 }] as any, status: "served" as const },
      { orderId: orderMap["ORD-2026-1003"], menuItemId: menuItemMap["Iced Caramel Latte"], name: "Iced Caramel Latte", quantity: 1, unitPrice: "6.49", totalPrice: "6.49", selectedOptions: [{ optionName: "Size", choices: ["Medium (16oz)"], priceModifier: 0 }, { optionName: "Milk", choices: ["Whole Milk"], priceModifier: 0 }] as any, status: "served" as const },
      { orderId: orderMap["ORD-2026-1003"], menuItemId: menuItemMap["Green Power Smoothie"], name: "Green Power Smoothie", quantity: 1, unitPrice: "8.99", totalPrice: "8.99", selectedOptions: [{ optionName: "Size", choices: ["Regular"], priceModifier: 0 }] as any, status: "served" as const },
      { orderId: orderMap["ORD-2026-1004"], menuItemId: menuItemMap["Grilled Chicken Avocado"], name: "Grilled Chicken Avocado", quantity: 2, unitPrice: "14.99", totalPrice: "32.98", selectedOptions: [{ optionName: "Bread", choices: ["Gluten-Free"], priceModifier: 1.50 }, { optionName: "Extras", choices: ["Bacon", "Provolone Cheese"], priceModifier: 3.50 }] as any, status: "served" as const },
      { orderId: orderMap["ORD-2026-1004"], menuItemId: menuItemMap["Chocolate Chip Muffin"], name: "Chocolate Chip Muffin", quantity: 2, unitPrice: "4.49", totalPrice: "8.98", selectedOptions: [] as any, status: "served" as const },
      { orderId: orderMap["ORD-2026-1005"], menuItemId: menuItemMap["Classic Caesar"], name: "Classic Caesar", quantity: 1, unitPrice: "15.49", totalPrice: "15.49", selectedOptions: [{ optionName: "Protein", choices: ["Grilled Chicken"], priceModifier: 0 }] as any, status: "preparing" as const },
      { orderId: orderMap["ORD-2026-1005"], menuItemId: menuItemMap["Iced Caramel Latte"], name: "Iced Caramel Latte", quantity: 1, unitPrice: "6.49", totalPrice: "7.24", selectedOptions: [{ optionName: "Size", choices: ["Medium (16oz)"], priceModifier: 0 }, { optionName: "Milk", choices: ["Oat Milk"], priceModifier: 0.75 }] as any, status: "preparing" as const },
      { orderId: orderMap["ORD-2026-1005"], menuItemId: menuItemMap["Chocolate Chip Muffin"], name: "Chocolate Chip Muffin", quantity: 1, unitPrice: "4.49", totalPrice: "4.49", selectedOptions: [{ optionName: "Heating", choices: ["Warm"], priceModifier: 0 }] as any, status: "preparing" as const },
      { orderId: orderMap["ORD-2026-1006"], menuItemId: menuItemMap["BBQ Pulled Pork"], name: "BBQ Pulled Pork", quantity: 1, unitPrice: "16.49", totalPrice: "16.99", selectedOptions: [{ optionName: "Heat Level", choices: ["Medium"], priceModifier: 0 }, { optionName: "Extras", choices: ["Extra BBQ Sauce"], priceModifier: 0.50 }] as any, status: "ready" as const },
      { orderId: orderMap["ORD-2026-1006"], menuItemId: menuItemMap["Chocolate Chip Muffin"], name: "Chocolate Chip Muffin", quantity: 1, unitPrice: "4.49", totalPrice: "4.49", selectedOptions: [] as any, status: "ready" as const },
      { orderId: orderMap["ORD-2026-1007"], menuItemId: menuItemMap["Grilled Chicken Avocado"], name: "Grilled Chicken Avocado", quantity: 2, unitPrice: "14.99", totalPrice: "33.98", selectedOptions: [{ optionName: "Bread", choices: ["Sourdough"], priceModifier: 0 }, { optionName: "Extras", choices: ["Extra Avocado"], priceModifier: 2.00 }] as any, status: "preparing" as const },
      { orderId: orderMap["ORD-2026-1007"], menuItemId: menuItemMap["Green Power Smoothie"], name: "Green Power Smoothie", quantity: 1, unitPrice: "8.99", totalPrice: "10.49", selectedOptions: [{ optionName: "Size", choices: ["Regular"], priceModifier: 0 }, { optionName: "Boosts", choices: ["Protein Powder"], priceModifier: 1.50 }] as any, status: "preparing" as const },
      { orderId: orderMap["ORD-2026-1008"], menuItemId: menuItemMap["Turkey Bacon Club"], name: "Turkey Bacon Club", quantity: 2, unitPrice: "15.49", totalPrice: "34.98", selectedOptions: [{ optionName: "Bread", choices: ["Brioche"], priceModifier: 0 }, { optionName: "Side", choices: ["Sweet Potato Fries"], priceModifier: 2.00 }] as any, status: "pending" as const },
      { orderId: orderMap["ORD-2026-1008"], menuItemId: menuItemMap["Classic Caesar"], name: "Classic Caesar", quantity: 1, unitPrice: "15.49", totalPrice: "18.49", selectedOptions: [{ optionName: "Protein", choices: ["Salmon"], priceModifier: 3.00 }] as any, status: "pending" as const },
      { orderId: orderMap["ORD-2026-1008"], menuItemId: menuItemMap["Cinnamon Roll"], name: "Cinnamon Roll", quantity: 2, unitPrice: "5.99", totalPrice: "14.98", selectedOptions: [{ optionName: "Heating", choices: ["Warm"], priceModifier: 0 }, { optionName: "Extras", choices: ["Extra Icing", "Walnuts"], priceModifier: 1.50 }] as any, status: "pending" as const },
      { orderId: orderMap["ORD-2026-1009"], menuItemId: menuItemMap["Broccoli Cheddar Soup"], name: "Broccoli Cheddar Soup", quantity: 1, unitPrice: "13.49", totalPrice: "15.49", selectedOptions: [{ optionName: "Serving", choices: ["Bread Bowl"], priceModifier: 2.00 }] as any, status: "pending" as const },
      { orderId: orderMap["ORD-2026-1009"], menuItemId: menuItemMap["Blueberry Scone"], name: "Blueberry Scone", quantity: 1, unitPrice: "4.99", totalPrice: "5.49", selectedOptions: [{ optionName: "Spread", choices: ["Cream Cheese"], priceModifier: 0.50 }] as any, status: "pending" as const },
      { orderId: orderMap["ORD-2026-1010"], menuItemId: menuItemMap["Tomato Basil Soup"], name: "Tomato Basil Soup", quantity: 1, unitPrice: "12.99", totalPrice: "7.99", selectedOptions: [{ optionName: "Size", choices: ["Cup"], priceModifier: -2.00 }, { optionName: "Sandwich", choices: ["No Sandwich"], priceModifier: -3.00 }] as any, status: "preparing" as const },
    ];

    for (const item of orderItemsData) {
      await db.insert(orderItems).values(item);
    }
    console.log("Created order items");
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed();

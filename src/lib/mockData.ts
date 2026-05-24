// ─── MOCK DATA FOR FASTORDER PRO ──────────────────────────────────────────
// Panera Bread style fast-casual restaurant

export const TENANT = { id: 1, name: "The Bread Bowl", slug: "the-bread-bowl" };

export const CATEGORIES = [
  { id: 1, tenantId: 1, name: "Sandwiches", description: "Artisan sandwiches on fresh-baked bread", image: "/food/frontend-club-sandwich.jpg", sortOrder: 1, isActive: true, createdAt: new Date() },
  { id: 2, tenantId: 1, name: "Soups", description: "Warm, comforting soups made daily", image: "/food/homemade-tomato-soup.jpg", sortOrder: 2, isActive: true, createdAt: new Date() },
  { id: 3, tenantId: 1, name: "Salads", description: "Fresh, crisp salads with premium toppings", image: "/food/mediterranean-salad.jpg", sortOrder: 3, isActive: true, createdAt: new Date() },
  { id: 4, tenantId: 1, name: "Bakery", description: "Fresh-baked pastries, bagels & bread", image: "/food/croissants.jpg", sortOrder: 4, isActive: true, createdAt: new Date() },
  { id: 5, tenantId: 1, name: "Bowls", description: "Grain bowls & warm mac & cheese", image: "/food/mac-cheese.jpg", sortOrder: 5, isActive: true, createdAt: new Date() },
  { id: 6, tenantId: 1, name: "Coffee & Drinks", description: " espresso, smoothies & iced drinks", image: "/food/caramel-latte.jpg", sortOrder: 6, isActive: true, createdAt: new Date() },
];

export const MENU_ITEMS = [
  { id: 1, tenantId: 1, categoryId: 1, name: "Chipotle Chicken Avocado Melt", description: "Smoked, pulled chicken raised without antibiotics, smoked Gouda, fresh avocado, cilantro, pepitas & chipotle mayo on toasted sourdough.", image: "/food/chipotle-chicken-avocado-melt.jpg", price: "12.99", costPrice: "4.20", calories: 760, prepTimeMinutes: 8, isAvailable: true, isPopular: true, isVegetarian: false, isVegan: false, isGlutenFree: false, options: [{ name: "Bread", required: true, multiSelect: false, choices: [{ label: "Sourdough", priceModifier: 0 }, { label: "Whole Grain", priceModifier: 0 }, { label: "Ciabatta", priceModifier: 0.50 }, { label: "Gluten-Free", priceModifier: 1.50 }] }, { name: "Add-ons", required: false, multiSelect: true, choices: [{ label: "Extra Avocado", priceModifier: 1.50 }, { label: "Bacon", priceModifier: 1.50 }, { label: "Extra Cheese", priceModifier: 1.00 }] }], createdAt: new Date(), updatedAt: new Date() },
  { id: 2, tenantId: 1, categoryId: 1, name: "Turkey Bravo Sandwich", description: "Oven-roasted turkey breast, smoked Gouda, bacon, lettuce, tomato & signature sauce on toasted sourdough.", image: "/food/turkey-bravo.jpg", price: "11.99", costPrice: "3.80", calories: 650, prepTimeMinutes: 7, isAvailable: true, isPopular: true, isVegetarian: false, isVegan: false, isGlutenFree: false, options: [{ name: "Bread", required: true, multiSelect: false, choices: [{ label: "Sourdough", priceModifier: 0 }, { label: "Whole Grain", priceModifier: 0 }, { label: "Ciabatta", priceModifier: 0.50 }] }, { name: "Add-ons", required: false, multiSelect: true, choices: [{ label: "Extra Turkey", priceModifier: 2.00 }, { label: "Avocado", priceModifier: 1.50 }] }], createdAt: new Date(), updatedAt: new Date() },
  { id: 3, tenantId: 1, categoryId: 1, name: "Modern Caprese Sandwich", description: "Fresh mozzarella, tomatoes, basil, arugula & balsamic glaze on toasted ciabatta.", image: "/food/frontend-club-sandwich.jpg", price: "10.99", costPrice: "3.50", calories: 580, prepTimeMinutes: 6, isAvailable: true, isPopular: false, isVegetarian: true, isVegan: false, isGlutenFree: false, options: [{ name: "Bread", required: true, multiSelect: false, choices: [{ label: "Ciabatta", priceModifier: 0 }, { label: "Whole Grain", priceModifier: 0 }, { label: "Gluten-Free", priceModifier: 1.50 }] }], createdAt: new Date(), updatedAt: new Date() },
  { id: 4, tenantId: 1, categoryId: 2, name: "Broccoli Cheddar Soup", description: "Chopped broccoli, shredded carrots & select seasonings simmered in a velvety smooth cheese sauce.", image: "/food/homemade-tomato-soup.jpg", price: "7.99", costPrice: "2.00", calories: 360, prepTimeMinutes: 3, isAvailable: true, isPopular: true, isVegetarian: true, isVegan: false, isGlutenFree: false, options: [{ name: "Size", required: true, multiSelect: false, choices: [{ label: "Cup", priceModifier: 0 }, { label: "Bowl", priceModifier: 2.00 }, { label: "Bread Bowl", priceModifier: 3.50 }] }], createdAt: new Date(), updatedAt: new Date() },
  { id: 5, tenantId: 1, categoryId: 2, name: "Chicken Noodle Soup", description: "Tender chicken, egg noodles, carrots, celery & onions in a rich, seasoned broth.", image: "/food/vegetable-soup.jpg", price: "7.99", costPrice: "2.10", calories: 280, prepTimeMinutes: 3, isAvailable: true, isPopular: false, isVegetarian: false, isVegan: false, isGlutenFree: false, options: [{ name: "Size", required: true, multiSelect: false, choices: [{ label: "Cup", priceModifier: 0 }, { label: "Bowl", priceModifier: 2.00 }, { label: "Bread Bowl", priceModifier: 3.50 }] }], createdAt: new Date(), updatedAt: new Date() },
  { id: 6, tenantId: 1, categoryId: 2, name: "Vegetarian Autumn Squash Soup", description: "A sweet and savory blend of pumpkin and butternut squash with a hint of curry.", image: "/food/vegetable-soup.jpg", price: "7.99", costPrice: "1.80", calories: 340, prepTimeMinutes: 3, isAvailable: true, isPopular: true, isVegetarian: true, isVegan: true, isGlutenFree: true, options: [{ name: "Size", required: true, multiSelect: false, choices: [{ label: "Cup", priceModifier: 0 }, { label: "Bowl", priceModifier: 2.00 }] }], createdAt: new Date(), updatedAt: new Date() },
  { id: 7, tenantId: 1, categoryId: 3, name: "Mediterranean Bowl", description: "Greens, ancient grains, hummus, feta, cucumbers, tomatoes, olives & Greek dressing.", image: "/food/mediterranean-salad.jpg", price: "11.99", costPrice: "3.80", calories: 520, prepTimeMinutes: 5, isAvailable: true, isPopular: true, isVegetarian: true, isVegan: false, isGlutenFree: true, options: [{ name: "Protein", required: false, multiSelect: false, choices: [{ label: "None", priceModifier: 0 }, { label: "Chicken", priceModifier: 3.00 }, { label: "Steak", priceModifier: 4.00 }] }], createdAt: new Date(), updatedAt: new Date() },
  { id: 8, tenantId: 1, categoryId: 3, name: "Caesar Salad", description: "Romaine, parmesan, homemade croutons & Caesar dressing.", image: "/food/mediterranean-salad.jpg", price: "9.99", costPrice: "3.00", calories: 340, prepTimeMinutes: 4, isAvailable: true, isPopular: false, isVegetarian: true, isVegan: false, isGlutenFree: false, options: [{ name: "Protein", required: false, multiSelect: false, choices: [{ label: "None", priceModifier: 0 }, { label: "Chicken", priceModifier: 3.00 }, { label: "Shrimp", priceModifier: 4.00 }] }], createdAt: new Date(), updatedAt: new Date() },
  { id: 9, tenantId: 1, categoryId: 4, name: "Chocolate Croissant", description: "Buttery, flaky pastry with a rich chocolate center. Baked fresh every morning.", image: "/food/croissants.jpg", price: "4.99", costPrice: "1.20", calories: 420, prepTimeMinutes: 1, isAvailable: true, isPopular: true, isVegetarian: true, isVegan: false, isGlutenFree: false, options: [], createdAt: new Date(), updatedAt: new Date() },
  { id: 10, tenantId: 1, categoryId: 4, name: "Cinnamon Crunch Bagel", description: "Our famous bagel with a sweet cinnamon crunch topping. Served with cream cheese.", image: "/food/croissants.jpg", price: "3.99", costPrice: "0.80", calories: 430, prepTimeMinutes: 1, isAvailable: true, isPopular: true, isVegetarian: true, isVegan: false, isGlutenFree: false, options: [{ name: "Spread", required: false, multiSelect: false, choices: [{ label: "Plain Cream Cheese", priceModifier: 0 }, { label: "Honey Walnut Cream Cheese", priceModifier: 0.50 }, { label: "Butter", priceModifier: 0 }] }], createdAt: new Date(), updatedAt: new Date() },
  { id: 11, tenantId: 1, categoryId: 5, name: "Mac & Cheese", description: "Tender shell pasta in a blend of rich cheeses including our tangy white cheddar sauce.", image: "/food/mac-cheese.jpg", price: "9.99", costPrice: "2.50", calories: 640, prepTimeMinutes: 5, isAvailable: true, isPopular: true, isVegetarian: true, isVegan: false, isGlutenFree: false, options: [{ name: "Size", required: true, multiSelect: false, choices: [{ label: "Small", priceModifier: 0 }, { label: "Large", priceModifier: 2.50 }] }, { name: "Add-ons", required: false, multiSelect: true, choices: [{ label: "Bacon", priceModifier: 1.50 }, { label: "Broccoli", priceModifier: 1.00 }] }], createdAt: new Date(), updatedAt: new Date() },
  { id: 12, tenantId: 1, categoryId: 5, name: "Baja Grain Bowl", description: "Brown rice, quinoa, black beans, corn, avocado, cheddar & chipotle lime dressing.", image: "/food/mac-cheese.jpg", price: "11.99", costPrice: "3.60", calories: 580, prepTimeMinutes: 6, isAvailable: true, isPopular: false, isVegetarian: true, isVegan: true, isGlutenFree: true, options: [{ name: "Protein", required: false, multiSelect: false, choices: [{ label: "None", priceModifier: 0 }, { label: "Chicken", priceModifier: 3.00 }] }], createdAt: new Date(), updatedAt: new Date() },
  { id: 13, tenantId: 1, categoryId: 6, name: "Caramel Latte", description: "Espresso with steamed milk and rich caramel. Available hot or iced.", image: "/food/caramel-latte.jpg", price: "5.99", costPrice: "1.20", calories: 280, prepTimeMinutes: 2, isAvailable: true, isPopular: true, isVegetarian: true, isVegan: false, isGlutenFree: true, options: [{ name: "Size", required: true, multiSelect: false, choices: [{ label: "Small", priceModifier: 0 }, { label: "Medium", priceModifier: 0.50 }, { label: "Large", priceModifier: 1.00 }] }, { name: "Milk", required: false, multiSelect: false, choices: [{ label: "Whole Milk", priceModifier: 0 }, { label: "Oat Milk", priceModifier: 0.75 }, { label: "Almond Milk", priceModifier: 0.75 }] }], createdAt: new Date(), updatedAt: new Date() },
  { id: 14, tenantId: 1, categoryId: 6, name: "Green Passion Smoothie", description: "Peach, mango, passionfruit, white grape & fresh spinach blended smooth.", image: "/food/strawberry-banana-smoothie.jpg", price: "6.99", costPrice: "1.80", calories: 240, prepTimeMinutes: 2, isAvailable: true, isPopular: true, isVegetarian: true, isVegan: true, isGlutenFree: true, options: [{ name: "Size", required: true, multiSelect: false, choices: [{ label: "Regular", priceModifier: 0 }, { label: "Large", priceModifier: 1.00 }] }], createdAt: new Date(), updatedAt: new Date() },
];

export const ORDERS = [
  { id: 1, tenantId: 1, orderNumber: "FO-2026-1001", customerName: "Emily Johnson", customerPhone: "(312) 555-0201", orderType: "dineIn", tableNumber: "5", status: "completed", paymentStatus: "paid", paymentMethod: "card", subtotal: "25.97", tax: "2.27", tip: "4.00", discount: "0.00", total: "32.24", source: "web", notes: null, createdAt: new Date("2026-05-24T09:00:00Z"), updatedAt: new Date(), completedAt: new Date() },
  { id: 2, tenantId: 1, orderNumber: "FO-2026-1002", customerName: "Michael Chen", customerPhone: "(312) 555-0202", orderType: "takeout", tableNumber: null, status: "completed", paymentStatus: "paid", paymentMethod: "cash", subtotal: "12.99", tax: "1.14", tip: "2.00", discount: "0.00", total: "16.13", source: "pos", notes: null, createdAt: new Date("2026-05-24T10:00:00Z"), updatedAt: new Date(), completedAt: new Date() },
  { id: 3, tenantId: 1, orderNumber: "FO-2026-1003", customerName: "Sarah Williams", customerPhone: "(312) 555-0203", orderType: "delivery", tableNumber: null, status: "preparing", paymentStatus: "paid", paymentMethod: "card", subtotal: "34.97", tax: "3.06", tip: "4.00", discount: "0.00", total: "42.03", source: "web", notes: null, createdAt: new Date("2026-05-24T11:00:00Z"), updatedAt: new Date(), completedAt: null },
  { id: 4, tenantId: 1, orderNumber: "FO-2026-1004", customerName: "James Brown", customerPhone: "(312) 555-0204", orderType: "dineIn", tableNumber: "3", status: "ready", paymentStatus: "pending", paymentMethod: null, subtotal: "19.98", tax: "1.75", tip: "0.00", discount: "0.00", total: "21.73", source: "kiosk", notes: null, createdAt: new Date("2026-05-24T12:00:00Z"), updatedAt: new Date(), completedAt: null },
  { id: 5, tenantId: 1, orderNumber: "FO-2026-1005", customerName: "Lisa Davis", customerPhone: "(312) 555-0205", orderType: "takeout", tableNumber: null, status: "baking", paymentStatus: "paid", paymentMethod: "mobile", subtotal: "15.98", tax: "1.40", tip: "2.50", discount: "0.00", total: "19.88", source: "pos", notes: null, createdAt: new Date("2026-05-24T13:00:00Z"), updatedAt: new Date(), completedAt: null },
];

export const ORDER_ITEMS = [
  { id: 1, orderId: 1, menuItemId: 1, name: "Chipotle Chicken Avocado Melt", quantity: 1, unitPrice: "12.99", totalPrice: "12.99", selectedOptions: [{ optionName: "Bread", choices: ["Sourdough"], priceModifier: 0 }, { optionName: "Add-ons", choices: ["Extra Avocado"], priceModifier: 1.50 }], specialInstructions: null, status: "served", createdAt: new Date() },
  { id: 2, orderId: 1, menuItemId: 4, name: "Broccoli Cheddar Soup", quantity: 1, unitPrice: "7.99", totalPrice: "9.99", selectedOptions: [{ optionName: "Size", choices: ["Bowl"], priceModifier: 2.00 }], specialInstructions: null, status: "served", createdAt: new Date() },
  { id: 3, orderId: 2, menuItemId: 1, name: "Turkey Bravo Sandwich", quantity: 1, unitPrice: "11.99", totalPrice: "11.99", selectedOptions: [{ optionName: "Bread", choices: ["Whole Grain"], priceModifier: 0 }], specialInstructions: null, status: "served", createdAt: new Date() },
  { id: 4, orderId: 3, menuItemId: 7, name: "Mediterranean Bowl", quantity: 1, unitPrice: "11.99", totalPrice: "14.99", selectedOptions: [{ optionName: "Protein", choices: ["Chicken"], priceModifier: 3.00 }], specialInstructions: null, status: "preparing", createdAt: new Date() },
  { id: 5, orderId: 3, menuItemId: 13, name: "Caramel Latte", quantity: 2, unitPrice: "5.99", totalPrice: "12.98", selectedOptions: [{ optionName: "Size", choices: ["Medium"], priceModifier: 0.50 }, { optionName: "Milk", choices: ["Oat Milk"], priceModifier: 0.75 }], specialInstructions: null, status: "preparing", createdAt: new Date() },
  { id: 6, orderId: 4, menuItemId: 11, name: "Mac & Cheese", quantity: 1, unitPrice: "9.99", totalPrice: "12.49", selectedOptions: [{ optionName: "Size", choices: ["Large"], priceModifier: 2.50 }], specialInstructions: null, status: "ready", createdAt: new Date() },
  { id: 7, orderId: 4, menuItemId: 9, name: "Chocolate Croissant", quantity: 1, unitPrice: "4.99", totalPrice: "4.99", selectedOptions: [], specialInstructions: null, status: "ready", createdAt: new Date() },
  { id: 8, orderId: 5, menuItemId: 3, name: "Modern Caprese Sandwich", quantity: 1, unitPrice: "10.99", totalPrice: "10.99", selectedOptions: [{ optionName: "Bread", choices: ["Ciabatta"], priceModifier: 0 }], specialInstructions: null, status: "baking", createdAt: new Date() },
  { id: 9, orderId: 5, menuItemId: 10, name: "Cinnamon Crunch Bagel", quantity: 1, unitPrice: "3.99", totalPrice: "4.49", selectedOptions: [{ optionName: "Spread", choices: ["Honey Walnut Cream Cheese"], priceModifier: 0.50 }], specialInstructions: null, status: "baking", createdAt: new Date() },
];

export const STAFF = [
  { id: 1, tenantId: 1, name: "Robert Miller", email: "r.miller@thebreadbowl.com", phone: "(312) 555-0101", role: "manager", pin: "1234", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, tenantId: 1, name: "Amanda Wilson", email: "a.wilson@thebreadbowl.com", phone: "(312) 555-0102", role: "cashier", pin: "2345", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, tenantId: 1, name: "Carlos Martinez", email: "c.martinez@thebreadbowl.com", phone: "(312) 555-0103", role: "cook", pin: "3456", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, tenantId: 1, name: "Jessica Taylor", email: "j.taylor@thebreadbowl.com", phone: "(312) 555-0104", role: "barista", pin: "4567", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, tenantId: 1, name: "David Anderson", email: "d.anderson@thebreadbowl.com", phone: "(312) 555-0105", role: "server", pin: "5678", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, tenantId: 1, name: "Sophia Garcia", email: "s.garcia@thebreadbowl.com", phone: "(312) 555-0106", role: "cook", pin: "6789", isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

export const TABLES = [
  { id: 1, tenantId: 1, number: "1", capacity: 2, section: "Patio", status: "available", createdAt: new Date() },
  { id: 2, tenantId: 1, number: "2", capacity: 2, section: "Patio", status: "available", createdAt: new Date() },
  { id: 3, tenantId: 1, number: "3", capacity: 4, section: "Patio", status: "occupied", createdAt: new Date() },
  { id: 4, tenantId: 1, number: "4", capacity: 4, section: "Patio", status: "available", createdAt: new Date() },
  { id: 5, tenantId: 1, number: "5", capacity: 2, section: "Main Dining", status: "occupied", createdAt: new Date() },
  { id: 6, tenantId: 1, number: "6", capacity: 4, section: "Main Dining", status: "available", createdAt: new Date() },
  { id: 7, tenantId: 1, number: "7", capacity: 4, section: "Main Dining", status: "reserved", createdAt: new Date() },
  { id: 8, tenantId: 1, number: "8", capacity: 6, section: "Main Dining", status: "available", createdAt: new Date() },
  { id: 9, tenantId: 1, number: "9", capacity: 2, section: "Cafe Area", status: "occupied", createdAt: new Date() },
  { id: 10, tenantId: 1, number: "10", capacity: 2, section: "Cafe Area", status: "available", createdAt: new Date() },
  { id: 11, tenantId: 1, number: "11", capacity: 2, section: "Cafe Area", status: "available", createdAt: new Date() },
  { id: 12, tenantId: 1, number: "12", capacity: 4, section: "Cafe Area", status: "reserved", createdAt: new Date() },
  { id: 13, tenantId: 1, number: "13", capacity: 8, section: "Private Room", status: "available", createdAt: new Date() },
  { id: 14, tenantId: 1, number: "14", capacity: 2, section: "Counter", status: "available", createdAt: new Date() },
];

// API response mock handlers
export function getMockResponse(path: string, input: any): any {
  switch (path) {
    case "menu.categories": return CATEGORIES.filter(c => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
    case "menu.items": {
      let items = MENU_ITEMS.filter(i => i.isAvailable);
      if (input?.categoryId) items = items.filter(i => i.categoryId === input.categoryId);
      return items.sort((a, b) => a.name.localeCompare(b.name));
    }
    case "menu.popular": return MENU_ITEMS.filter(i => i.isAvailable && i.isPopular);
    case "menu.itemById": return MENU_ITEMS.find(i => i.id === input?.id) ?? null;
    case "order.list": {
      let orders = [...ORDERS];
      if (input?.status) orders = orders.filter(o => o.status === input.status);
      return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    case "order.todayOrders": return [...ORDERS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case "order.byId": {
      const o = ORDERS.find(x => x.id === input?.id);
      return o ? { ...o, items: ORDER_ITEMS.filter(i => i.orderId === o.id) } : null;
    }
    case "kitchen.tickets": {
      const activeStatuses = ["pending", "confirmed", "preparing", "baking", "ready"];
      return ORDERS.filter(o => activeStatuses.includes(o.status)).map(o => ({ ...o, items: ORDER_ITEMS.filter(i => i.orderId === o.id) }));
    }
    case "kitchen.stats": return {
      totalOrders: ORDERS.length,
      activeOrders: ORDERS.filter(o => ["pending", "confirmed", "preparing", "baking", "ready"].includes(o.status)).length,
      pendingItems: ORDER_ITEMS.filter(i => i.status === "pending").length,
      preparingItems: ORDER_ITEMS.filter(i => i.status === "preparing").length,
      readyItems: ORDER_ITEMS.filter(i => i.status === "ready").length,
    };
    case "inventory.list": {
      let items = INVENTORY.filter(i => i.isActive);
      if (input?.search) items = items.filter(i => i.name.toLowerCase().includes(input.search.toLowerCase()));
      if (input?.lowStock) items = items.filter(i => parseFloat(i.quantity) <= parseFloat(i.reorderPoint));
      return items;
    }
    case "inventory.categories": return [...new Set(INVENTORY.map(i => i.category))].filter(Boolean);
    case "staff.list": {
      let s = [...STAFF];
      if (input?.role) s = s.filter(x => x.role === input.role);
      return s;
    }
    case "table.list": return [...TABLES];
    case "table.sections": return [...new Set(TABLES.map(t => t.section))];
    case "analytics.dashboard": {
      const todayOrders = ORDERS.filter(o => o.status !== "cancelled");
      return {
        todayRevenue: todayOrders.reduce((s, o) => s + parseFloat(o.total), 0),
        todayOrders: todayOrders.length,
        weekRevenue: ORDERS.reduce((s, o) => s + parseFloat(o.total), 0),
        weekOrders: ORDERS.length,
        activeOrders: ORDERS.filter(o => ["pending", "confirmed", "preparing", "baking", "ready"].includes(o.status)).length,
        lowStock: INVENTORY.filter(i => parseFloat(i.quantity) <= parseFloat(i.reorderPoint)).length,
        totalStaff: STAFF.length,
      };
    }
    case "analytics.salesByDay": {
      const dayMap: Record<string, { date: string; orders: number; revenue: number }> = {};
      for (const o of ORDERS) { const d = new Date(o.createdAt).toISOString().split("T")[0]; if (!dayMap[d]) dayMap[d] = { date: d, orders: 0, revenue: 0 }; dayMap[d].orders++; dayMap[d].revenue += parseFloat(o.total); }
      return Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date));
    }
    case "analytics.popularItems": {
      const counts: Record<number, { name: string; count: number; revenue: number }> = {};
      for (const item of ORDER_ITEMS) { if (!counts[item.menuItemId]) { const m = MENU_ITEMS.find(x => x.id === item.menuItemId); counts[item.menuItemId] = { name: m?.name ?? "Unknown", count: 0, revenue: 0 }; } counts[item.menuItemId].count += item.quantity; counts[item.menuItemId].revenue += parseFloat(item.totalPrice); }
      return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, input?.limit ?? 5);
    }
    default: return undefined;
  }
}

export const INVENTORY = [
  { id: 1, tenantId: 1, name: "Sourdough Bread", sku: "BRD-001", category: "Bakery", unit: "loaves", quantity: "80", minLevel: "20", reorderPoint: "30", unitCost: "1.20", supplier: "Artisan Bread Co.", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, tenantId: 1, name: "Chicken Breast", sku: "MT-001", category: "Proteins", unit: "lbs", quantity: "40", minLevel: "15", reorderPoint: "20", unitCost: "4.50", supplier: "Free Range Farms", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, tenantId: 1, name: "Avocado", sku: "PRD-001", category: "Produce", unit: "units", quantity: "25", minLevel: "10", reorderPoint: "15", unitCost: "1.80", supplier: "California Organics", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 4, tenantId: 1, name: "White Cheddar Cheese", sku: "CHS-001", category: "Dairy", unit: "lbs", quantity: "30", minLevel: "10", reorderPoint: "15", unitCost: "4.00", supplier: "Wisconsin Dairy", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 5, tenantId: 1, name: "Coffee Beans", sku: "BEV-001", category: "Beverages", unit: "lbs", quantity: "20", minLevel: "5", reorderPoint: "8", unitCost: "8.50", supplier: "Roaster's Reserve", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 6, tenantId: 1, name: "Fresh Spinach", sku: "PRD-002", category: "Produce", unit: "lbs", quantity: "15", minLevel: "5", reorderPoint: "8", unitCost: "2.50", supplier: "Local Greens", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 7, tenantId: 1, name: "Chocolate Pastry", sku: "BAK-001", category: "Bakery", unit: "units", quantity: "50", minLevel: "15", reorderPoint: "20", unitCost: "0.60", supplier: "Artisan Bread Co.", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 8, tenantId: 1, name: "Oat Milk", sku: "BEV-002", category: "Beverages", unit: "cartons", quantity: "12", minLevel: "4", reorderPoint: "6", unitCost: "3.20", supplier: "Pacific Foods", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 9, tenantId: 1, name: "Pasta Shells", sku: "DRY-001", category: "Dry Goods", unit: "lbs", quantity: "40", minLevel: "15", reorderPoint: "20", unitCost: "1.50", supplier: "De Cecco", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 10, tenantId: 1, name: "Turkey Breast", sku: "MT-002", category: "Proteins", unit: "lbs", quantity: "30", minLevel: "10", reorderPoint: "15", unitCost: "5.50", supplier: "Heritage Farms", isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

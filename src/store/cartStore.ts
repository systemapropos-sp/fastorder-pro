import { create } from "zustand";

export interface CartItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  selectedOptions: { optionName: string; choices: string[]; priceModifier: number }[];
  specialInstructions?: string;
}

interface CartState {
  items: CartItem[];
  orderType: "dineIn" | "takeout" | "delivery" | "driveThru";
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  notes?: string;

  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  setOrderType: (type: "dineIn" | "takeout" | "delivery" | "driveThru") => void;
  setTableNumber: (num: string) => void;
  setCustomerInfo: (name: string, phone: string) => void;
  setNotes: (notes: string) => void;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  orderType: "takeout",

  addItem: (item) => {
    const existing = get().items.find(
      (i) => i.menuItemId === item.menuItemId && JSON.stringify(i.selectedOptions) === JSON.stringify(item.selectedOptions)
    );
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.menuItemId === item.menuItemId && JSON.stringify(i.selectedOptions) === JSON.stringify(item.selectedOptions)
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      });
    } else {
      set({ items: [...get().items, item] });
    }
  },

  removeItem: (menuItemId) => {
    set({ items: get().items.filter((i) => i.menuItemId !== menuItemId) });
  },

  updateQuantity: (menuItemId, quantity) => {
    if (quantity <= 0) {
      set({ items: get().items.filter((i) => i.menuItemId !== menuItemId) });
    } else {
      set({
        items: get().items.map((i) =>
          i.menuItemId === menuItemId ? { ...i, quantity } : i
        ),
      });
    }
  },

  clearCart: () => set({ items: [], notes: undefined }),

  setOrderType: (type) => set({ orderType: type }),
  setTableNumber: (num) => set({ tableNumber: num }),
  setCustomerInfo: (name, phone) => set({ customerName: name, customerPhone: phone }),
  setNotes: (notes) => set({ notes }),

  getSubtotal: () => {
    return get().items.reduce((sum, item) => {
      const optionsPrice = item.selectedOptions.reduce((s, o) => s + o.priceModifier, 0);
      return sum + (item.price + optionsPrice) * item.quantity;
    }, 0);
  },

  getTax: () => get().getSubtotal() * 0.0875,
  getTotal: () => get().getSubtotal() + get().getTax(),
  getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));

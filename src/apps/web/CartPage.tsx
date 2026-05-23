import { useNavigate } from "react-router";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getSubtotal, getTax, getTotal, setOrderType, orderType, tableNumber, setTableNumber } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Browse our menu and add some delicious items</p>
        <Button className="bg-amber-500 hover:bg-amber-600" onClick={() => navigate("/web")}>
          Browse Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Order</h2>

      {/* Order Type */}
      <div className="bg-white rounded-xl border p-4 mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Order Type</p>
        <div className="flex gap-2">
          {(["dineIn", "takeout", "delivery"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setOrderType(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                orderType === t ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t === "dineIn" ? "Dine In" : t === "takeout" ? "Takeout" : "Delivery"}
            </button>
          ))}
        </div>
        {orderType === "dineIn" && (
          <input
            type="text"
            placeholder="Table number (optional)"
            value={tableNumber ?? ""}
            onChange={(e) => setTableNumber(e.target.value)}
            className="mt-2 w-full px-3 py-2 border rounded-lg text-sm"
          />
        )}
      </div>

      {/* Cart Items */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={`${item.menuItemId}-${idx}`} className="bg-white rounded-xl border p-4">
            <div className="flex items-start gap-3">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                {item.selectedOptions.length > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.selectedOptions.map((o) => `${o.optionName}: ${o.choices.join(", ")}`).join(" · ")}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-600">
                  ${((item.price + item.selectedOptions.reduce((s, o) => s + o.priceModifier, 0)) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-medium w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button onClick={() => removeItem(item.menuItemId)} className="text-red-400 hover:text-red-600 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      {/* Summary */}
      <div className="bg-white rounded-xl border p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${getSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (8.75%)</span>
          <span className="font-medium">${getTax().toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-amber-600">${getTotal().toFixed(2)}</span>
        </div>
      </div>

      <Button
        className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white h-12 text-lg"
        onClick={() => navigate("/web/checkout")}
      >
        Proceed to Checkout
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}

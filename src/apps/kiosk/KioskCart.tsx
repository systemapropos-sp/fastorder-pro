import { useNavigate } from "react-router";
import { useCartStore } from "@/store/cartStore";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export default function KioskCart() {
  const navigate = useNavigate();
  const { items, getSubtotal, getTax, getTotal, updateQuantity, removeItem, setOrderType, orderType } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trash2 className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-6 text-lg">Browse our menu and add items</p>
        <button
          onClick={() => navigate("/kiosk")}
          className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Order</h2>

      {/* Order Type */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <p className="font-medium text-gray-700 mb-3">Dining Option</p>
        <div className="flex gap-3">
          {(["dineIn", "takeout"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setOrderType(t)}
              className={`flex-1 py-4 rounded-xl text-lg font-bold transition-colors ${
                orderType === t ? "bg-amber-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t === "dineIn" ? "Dine In" : "Take Out"}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-6">
        {items.map((item, idx) => (
          <div key={`${item.menuItemId}-${idx}`} className="bg-white rounded-xl border p-4 flex items-center gap-4">
            {item.image && (
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
              {item.selectedOptions.length > 0 && (
                <p className="text-sm text-gray-500">
                  {item.selectedOptions.map((o) => o.choices.join(", ")).join(" · ")}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)} className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200">
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-lg w-6 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)} className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="text-right min-w-[80px]">
              <p className="font-bold text-lg">
                ${((item.price + item.selectedOptions.reduce((s, o) => s + o.priceModifier, 0)) * item.quantity).toFixed(2)}
              </p>
              <button onClick={() => removeItem(item.menuItemId)} className="text-red-400 hover:text-red-600 text-sm mt-1">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex justify-between text-lg mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${getSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg mb-4">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">${getTax().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-2xl font-bold border-t pt-4">
          <span>Total</span>
          <span className="text-amber-600">${getTotal().toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={() => navigate("/kiosk/payment")}
        className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white text-xl font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
      >
        Continue to Payment
        <ArrowRight className="w-6 h-6" />
      </button>
    </div>
  );
}

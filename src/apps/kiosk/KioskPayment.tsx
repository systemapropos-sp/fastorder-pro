import { useState } from "react";
import { useNavigate } from "react-router";
import { useCartStore } from "@/store/cartStore";
import { trpc } from "@/providers/trpc";
import { CreditCard, Banknote, Smartphone, Loader2 } from "lucide-react";

export default function KioskPayment() {
  const navigate = useNavigate();
  const { items, getSubtotal, getTax, getTotal, orderType, clearCart } = useCartStore();
  const [method, setMethod] = useState<"card" | "cash">("card");
  const [processing, setProcessing] = useState(false);

  const createOrder = trpc.order.create.useMutation({
    onSuccess: () => {
      clearCart();
      navigate("/kiosk/confirmation");
    },
  });

  const handlePay = async () => {
    setProcessing(true);
    await createOrder.mutateAsync({
      tenantId: 1,
      orderType,
      source: "kiosk",
      subtotal: getSubtotal().toFixed(2),
      tax: getTax().toFixed(2),
      total: getTotal().toFixed(2),
      items: items.map((item) => ({
        menuItemId: item.menuItemId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price.toFixed(2),
        totalPrice: ((item.price + item.selectedOptions.reduce((s, o) => s + o.priceModifier, 0)) * item.quantity).toFixed(2),
        selectedOptions: item.selectedOptions,
      })),
    });
    setProcessing(false);
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Payment</h2>

      <div className="bg-white rounded-2xl border p-6 mb-6">
        <p className="text-lg font-medium text-gray-700 mb-4">Select Payment Method</p>
        <div className="flex gap-4">
          <button
            onClick={() => setMethod("card")}
            className={`flex-1 flex flex-col items-center gap-3 py-6 rounded-xl border-2 transition-colors ${
              method === "card" ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <CreditCard className={`w-10 h-10 ${method === "card" ? "text-amber-600" : "text-gray-400"}`} />
            <span className={`font-bold text-lg ${method === "card" ? "text-amber-700" : "text-gray-600"}`}>Card</span>
          </button>
          <button
            onClick={() => setMethod("cash")}
            className={`flex-1 flex flex-col items-center gap-3 py-6 rounded-xl border-2 transition-colors ${
              method === "cash" ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Banknote className={`w-10 h-10 ${method === "cash" ? "text-amber-600" : "text-gray-400"}`} />
            <span className={`font-bold text-lg ${method === "cash" ? "text-amber-700" : "text-gray-600"}`}>Cash</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-6 mb-6">
        <p className="text-lg font-medium text-gray-700 mb-4">Order Summary</p>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-base">
              <span className="text-gray-600">{item.quantity}x {item.name}</span>
              <span className="font-medium">${((item.price + item.selectedOptions.reduce((s, o) => s + o.priceModifier, 0)) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-lg">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${getSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">${getTax().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-2xl font-bold border-t pt-3">
            <span>Total</span>
            <span className="text-amber-600">${getTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={processing}
        className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white text-2xl font-bold rounded-xl transition-colors shadow-lg flex items-center justify-center gap-3 disabled:opacity-70"
      >
        {processing ? (
          <>
            <Loader2 className="w-7 h-7 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Smartphone className="w-7 h-7" />
            Pay ${getTotal().toFixed(2)}
          </>
        )}
      </button>
    </div>
  );
}

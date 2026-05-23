import { useState } from "react";
import { useNavigate } from "react-router";
import { useCartStore } from "@/store/cartStore";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Smartphone, Banknote, CheckCircle, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, getTax, getTotal, orderType, tableNumber, clearCart, setCustomerInfo, customerName, customerPhone, notes, setNotes } = useCartStore();
  const [name, setName] = useState(customerName ?? "");
  const [phone, setPhone] = useState(customerPhone ?? "");
  const [orderNotes, setOrderNotes] = useState(notes ?? "");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | "mobile">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const createOrder = trpc.order.create.useMutation({
    onSuccess: (data) => {
      setOrderNumber(data.orderNumber);
      setOrderComplete(true);
      clearCart();
    },
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setCustomerInfo(name, phone);
    if (orderNotes) setNotes(orderNotes);

    const orderItems = items.map((item) => ({
      menuItemId: item.menuItemId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.price.toFixed(2),
      totalPrice: ((item.price + item.selectedOptions.reduce((s, o) => s + o.priceModifier, 0)) * item.quantity).toFixed(2),
      selectedOptions: item.selectedOptions,
      specialInstructions: item.specialInstructions,
    }));

    await createOrder.mutateAsync({
      tenantId: 1,
      customerName: name || undefined,
      customerPhone: phone || undefined,
      orderType,
      tableNumber: tableNumber || undefined,
      notes: orderNotes || undefined,
      source: "web",
      subtotal: getSubtotal().toFixed(2),
      tax: getTax().toFixed(2),
      total: getTotal().toFixed(2),
      items: orderItems,
    });
    setIsSubmitting(false);
  };

  if (orderComplete) {
    return (
      <div className="px-4 py-16 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
        <p className="text-gray-600 mb-2">Your order number is</p>
        <p className="text-3xl font-bold text-amber-600 mb-6">{orderNumber}</p>
        <p className="text-sm text-gray-500 mb-8">
          {orderType === "dineIn" ? "We'll bring your order to your table." : "Your order will be ready for pickup shortly."}
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate("/web")}>Order More</Button>
          <Button className="bg-amber-500 hover:bg-amber-600" onClick={() => navigate("/")}>Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>

      {/* Customer Info */}
      <div className="bg-white rounded-xl border p-4 mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          />
          <input
            type="tel"
            placeholder="Phone number (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          />
          <textarea
            placeholder="Special instructions (optional)"
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            className="w-full px-3 py-2.5 border rounded-lg text-sm h-20 resize-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          />
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl border p-4 mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
        <div className="flex gap-2">
          {([
            { key: "card", label: "Card", icon: CreditCard },
            { key: "cash", label: "Cash", icon: Banknote },
            { key: "mobile", label: "Mobile", icon: Smartphone },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setPaymentMethod(key)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg border text-sm font-medium transition-colors ${
                paymentMethod === key ? "border-amber-500 bg-amber-50 text-amber-700" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.quantity}x {item.name}
              </span>
              <span className="font-medium">
                ${((item.price + item.selectedOptions.reduce((s, o) => s + o.priceModifier, 0)) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${getSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">${getTax().toFixed(2)}</span>
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-amber-600">${getTotal().toFixed(2)}</span>
        </div>
      </div>

      <Button
        className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 text-lg"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Placing Order...
          </>
        ) : (
          `Pay $${getTotal().toFixed(2)}`
        )}
      </Button>
    </div>
  );
}

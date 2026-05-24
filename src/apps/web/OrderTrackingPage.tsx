import { useParams } from "react-router";
import { ORDERS, ORDER_ITEMS } from "@/lib/mockData";
import { Loader2, Clock, ChefHat, Package, CheckCircle } from "lucide-react";

const statusSteps = [
  { key: "pending", label: "Order Received", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "ready", label: "Ready", icon: Package },
  { key: "served", label: "Served", icon: CheckCircle },
  { key: "completed", label: "Completed", icon: CheckCircle },
];

export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = ORDERS.find(o => o.id === Number(orderId));
  const items = order ? ORDER_ITEMS.filter(i => i.orderId === order.id) : [];
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">Order not found</p>
        <p className="text-sm text-gray-400 mt-1">Check your order number and try again.</p>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 font-serif">{order.orderNumber}</h1>
        <p className="text-gray-500">{order.customerName || "Guest"}</p>
        <p className="text-2xl font-bold text-amber-600 mt-2">${parseFloat(order.total).toFixed(2)}</p>
      </div>

      {/* Status Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
        <div className="space-y-6">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.key} className={`relative flex items-start gap-4 ${isActive ? "" : "opacity-40"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${isActive ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-500"} ${isCurrent ? "ring-4 ring-amber-200" : ""}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className={`font-medium ${isCurrent ? "text-amber-600" : "text-gray-900"}`}>{step.label}</p>
                  {isCurrent && <p className="text-sm text-gray-500">In progress</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-8 bg-white rounded-xl border p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Items</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
              <span className="font-medium">{item.quantity}x {item.name}</span>
              <span className="text-gray-600">${parseFloat(item.totalPrice).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";
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
  const { data: order, isLoading } = trpc.order.byId.useQuery(
    { id: Number(orderId) },
    { refetchInterval: 5000 }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-900">Order not found</h2>
        <p className="text-gray-500 mt-2">Please check your order number and try again.</p>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Order {order.orderNumber}</h2>
        <p className="text-gray-500 text-sm">
          {order.orderType === "dineIn" ? `Table ${order.tableNumber}` : order.orderType === "takeout" ? "Takeout" : "Delivery"}
          {" · "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-6">Order Status</h3>
        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            return (
              <div key={step.key} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCurrent ? "bg-amber-500 text-white" : isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isCurrent ? "text-amber-600" : isActive ? "text-gray-900" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-gray-500 mt-0.5">In progress</p>
                  )}
                </div>
                {isActive && index < currentStepIndex && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Items</h3>
        <div className="space-y-3">
          {order.items?.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between">
              <div>
                <span className="font-medium text-gray-900">{item.quantity}x {item.name}</span>
                {item.selectedOptions && item.selectedOptions.length > 0 && (
                  <p className="text-xs text-gray-500">
                    {item.selectedOptions.map((o: any) => `${o.optionName}: ${o.choices.join(", ")}`).join(" · ")}
                  </p>
                )}
              </div>
              <span className="text-gray-600">${parseFloat(item.totalPrice).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>${parseFloat(order.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span>${parseFloat(order.tax).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-amber-600">${parseFloat(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

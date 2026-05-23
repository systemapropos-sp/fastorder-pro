import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Clock, ChefHat, CheckCircle, AlertCircle, ArrowLeft, Flame, Package } from "lucide-react";
import { useNavigate } from "react-router";

const TENANT_ID = 1;

const statusConfig: Record<string, { label: string; color: string; border: string; bg: string; icon: any }> = {
  pending: { label: "New", color: "text-red-600", border: "border-red-400", bg: "bg-red-50", icon: AlertCircle },
  confirmed: { label: "Confirmed", color: "text-purple-600", border: "border-purple-400", bg: "bg-purple-50", icon: CheckCircle },
  preparing: { label: "Preparing", color: "text-orange-600", border: "border-orange-400", bg: "bg-orange-50", icon: Flame },
  ready: { label: "Ready", color: "text-blue-600", border: "border-blue-400", bg: "bg-blue-50", icon: Package },
};

const itemStatusConfig: Record<string, { label: string; class: string }> = {
  pending: { label: "Pending", class: "bg-gray-100 text-gray-600" },
  preparing: { label: "Cooking", class: "bg-orange-100 text-orange-700" },
  ready: { label: "Ready", class: "bg-green-100 text-green-700" },
  served: { label: "Served", class: "bg-blue-100 text-blue-700" },
};

export default function KitchenDisplay() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");

  const { data: tickets, isLoading } = trpc.kitchen.tickets.useQuery(
    { tenantId: TENANT_ID },
    { refetchInterval: 3000 }
  );

  const { data: stats } = trpc.kitchen.stats.useQuery(
    { tenantId: TENANT_ID },
    { refetchInterval: 3000 }
  );

  const utils = trpc.useUtils();
  const updateItem = trpc.kitchen.updateItemStatus.useMutation({
    onSuccess: () => utils.kitchen.tickets.invalidate(),
  });
  const updateOrder = trpc.kitchen.updateOrderStatus.useMutation({
    onSuccess: () => utils.kitchen.tickets.invalidate(),
  });

  const filtered = filter === "all" ? tickets : tickets?.filter((t) => t.status === filter);

  const getElapsedTime = (createdAt: Date) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-orange-400" />
              <h1 className="text-xl font-bold">Kitchen Display</h1>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{stats?.pendingItems ?? 0}</p>
              <p className="text-xs text-gray-400">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">{stats?.preparingItems ?? 0}</p>
              <p className="text-xs text-gray-400">Cooking</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{stats?.readyItems ?? 0}</p>
              <p className="text-xs text-gray-400">Ready</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-3">
          {["all", "pending", "confirmed", "preparing", "ready"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === s ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {s === "all" ? "All Tickets" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {/* Tickets Grid */}
      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading tickets...</div>
        ) : filtered?.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No active tickets</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered?.map((ticket) => {
              const config = statusConfig[ticket.status] ?? statusConfig.pending;
              const Icon = config.icon;
              return (
                <div
                  key={ticket.id}
                  className={`bg-gray-800 rounded-xl border-2 ${config.border} overflow-hidden`}
                >
                  {/* Ticket Header */}
                  <div className={`${config.bg} px-4 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${config.color}`} />
                      <span className={`font-bold ${config.color}`}>{ticket.orderNumber}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-mono">{getElapsedTime(ticket.createdAt)}</span>
                    </div>
                  </div>

                  {/* Ticket Info */}
                  <div className="px-4 py-2 border-b border-gray-700 flex items-center justify-between text-sm">
                    <span className="text-gray-300">
                      {ticket.orderType === "dineIn" ? `Table ${ticket.tableNumber}` : ticket.orderType}
                    </span>
                    <span className="text-gray-400">{ticket.customerName || "Guest"}</span>
                  </div>

                  {/* Items */}
                  <div className="p-4 space-y-2">
                    {ticket.items.map((item: any) => {
                      const itemConfig = itemStatusConfig[item.status] ?? itemStatusConfig.pending;
                      return (
                        <div key={item.id} className="bg-gray-700/50 rounded-lg p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">{item.quantity}x</span>
                                <span className="font-medium text-gray-200">{item.name}</span>
                              </div>
                              {item.selectedOptions && item.selectedOptions.length > 0 && (
                                <p className="text-xs text-gray-400 mt-1">
                                  {item.selectedOptions.map((o: any) => `${o.optionName}: ${o.choices.join(", ")}`).join(" · ")}
                                </p>
                              )}
                              {item.specialInstructions && (
                                <p className="text-xs text-amber-400 mt-1">Note: {item.specialInstructions}</p>
                              )}
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${itemConfig.class}`}>
                              {itemConfig.label}
                            </span>
                          </div>

                          {/* Item Actions */}
                          <div className="flex gap-2 mt-2">
                            {item.status === "pending" && (
                              <button
                                onClick={() => updateItem.mutate({ itemId: item.id, status: "preparing" })}
                                className="flex-1 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                              >
                                <Flame className="w-3 h-3" /> Start Cooking
                              </button>
                            )}
                            {item.status === "preparing" && (
                              <button
                                onClick={() => updateItem.mutate({ itemId: item.id, status: "ready" })}
                                className="flex-1 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                              >
                                <CheckCircle className="w-3 h-3" /> Mark Ready
                              </button>
                            )}
                            {item.status === "ready" && (
                              <button
                                onClick={() => updateItem.mutate({ itemId: item.id, status: "served" })}
                                className="flex-1 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                              >
                                <Package className="w-3 h-3" /> Served
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Actions */}
                  <div className="px-4 pb-4">
                    {ticket.status === "pending" && (
                      <button
                        onClick={() => updateOrder.mutate({ orderId: ticket.id, status: "confirmed" })}
                        className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition-colors"
                      >
                        Confirm Order
                      </button>
                    )}
                    {ticket.status === "confirmed" && (
                      <button
                        onClick={() => updateOrder.mutate({ orderId: ticket.id, status: "preparing" })}
                        className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
                      >
                        Start All
                      </button>
                    )}
                    {ticket.items.every((i: any) => i.status === "served") && (
                      <button
                        onClick={() => updateOrder.mutate({ orderId: ticket.id, status: "completed" })}
                        className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
                      >
                        Complete Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

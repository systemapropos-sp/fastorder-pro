import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";

const TENANT_ID = 1;
const statusFilters = ["all", "pending", "confirmed", "preparing", "ready", "completed", "cancelled"];

export default function OrdersPage() {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const { data: orders, isLoading } = trpc.order.list.useQuery({
    tenantId: TENANT_ID,
    status: status === "all" ? undefined : status,
  });

  const utils = trpc.useUtils();
  const updateStatus = trpc.order.updateStatus.useMutation({
    onSuccess: () => { utils.order.list.invalidate(); utils.analytics.dashboard.invalidate(); },
  });

  const filtered = orders?.filter((o) =>
    search === "" ||
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s: string) => {
    switch (s) {
      case "completed": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      case "ready": return "bg-blue-100 text-blue-700";
      case "preparing": return "bg-orange-100 text-orange-700";
      case "confirmed": return "bg-purple-100 text-purple-700";
      default: return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 lg:ml-0 ml-12 lg:mt-0 mt-4">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500">Manage and track all customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                status === s ? "bg-slate-900 text-white" : "bg-white border text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Order #</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Time</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered?.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                    <td className="px-4 py-3">{order.customerName || "Guest"}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{order.orderType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={statusColor(order.status)}>{order.status}</Badge>
                    </td>
                    <td className="px-4 py-3 font-bold">${parseFloat(order.total).toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {order.status === "pending" && (
                          <button onClick={() => updateStatus.mutate({ id: order.id, status: "confirmed" })} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200">Confirm</button>
                        )}
                        {order.status === "confirmed" && (
                          <button onClick={() => updateStatus.mutate({ id: order.id, status: "preparing" })} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200">Start</button>
                        )}
                        {order.status === "preparing" && (
                          <button onClick={() => updateStatus.mutate({ id: order.id, status: "ready" })} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">Ready</button>
                        )}
                        {order.status === "ready" && (
                          <button onClick={() => updateStatus.mutate({ id: order.id, status: "completed" })} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">Complete</button>
                        )}
                        {order.status !== "cancelled" && order.status !== "completed" && (
                          <button onClick={() => updateStatus.mutate({ id: order.id, status: "cancelled" })} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

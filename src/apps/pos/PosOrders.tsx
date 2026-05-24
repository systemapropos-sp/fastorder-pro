import { useState } from "react";
import { useOrders } from "@/hooks/useStaticQueries";
import { Search, CreditCard, CheckCircle } from "lucide-react";

export default function PosOrders() {
  const [search, setSearch] = useState("");
  const { data: orders, isLoading } = useOrders();

  // Mock mutation
  const updatePayment = { mutate: (_vars: any) => {} };

  const filtered = orders?.filter((o) =>
    search === "" ||
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Order Lookup</h2>
        <p className="text-gray-500">Search and manage customer orders</p>
      </div>

      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by order # or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading orders...</div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Order #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Payment</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Total</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                  <td className="px-4 py-3">{order.customerName || "Guest"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{order.orderType}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.status === "completed" ? "bg-green-100 text-green-700" :
                      order.status === "cancelled" ? "bg-red-100 text-red-700" :
                      order.status === "ready" ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold">${parseFloat(order.total).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {order.paymentStatus === "pending" && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => updatePayment.mutate({ id: order.id, paymentStatus: "paid", paymentMethod: "cash" })}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" /> Cash
                        </button>
                        <button
                          onClick={() => updatePayment.mutate({ id: order.id, paymentStatus: "paid", paymentMethod: "card" })}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"
                        >
                          <CreditCard className="w-3 h-3" /> Card
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

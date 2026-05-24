import { useState } from "react";
import { useInventory } from "@/hooks/useStaticQueries";
import { AlertTriangle, Search } from "lucide-react";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);

  const { data: items, isLoading } = useInventory(search || undefined, showLowStock || undefined);

  return (
    <div className="p-6">
      <div className="mb-6 lg:ml-0 ml-12 lg:mt-0 mt-4">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="text-gray-500">Track stock levels and manage supplies</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
        <button
          onClick={() => setShowLowStock(!showLowStock)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showLowStock ? "bg-red-100 text-red-700" : "bg-white border text-gray-600 hover:bg-gray-50"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Low Stock Only
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading inventory...</div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Item</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">SKU</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Quantity</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Unit</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Reorder</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item) => {
                  const qty = parseFloat(item.quantity ?? "0");
                  const reorder = parseFloat(item.reorderPoint ?? "0");
                  const min = parseFloat(item.minLevel ?? "0");
                  const isLow = qty <= reorder;
                  const isCritical = qty <= min;
                  return (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3 text-gray-500">{item.sku}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{item.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${isCritical ? "text-red-600" : isLow ? "text-amber-600" : "text-gray-900"}`}>
                          {qty}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{item.unit}</td>
                      <td className="px-4 py-3 text-gray-500">{reorder}</td>
                      <td className="px-4 py-3">
                        {isCritical ? (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Critical</span>
                        ) : isLow ? (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Low Stock</span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">OK</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useMenuCategories, useMenuItems } from "@/hooks/useStaticQueries";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Leaf, WheatOff, Star, Search } from "lucide-react";

export default function MenuManagerPage() {
  const [search, setSearch] = useState("");
  const { data: categories } = useMenuCategories();
  const { data: menuItems, isLoading } = useMenuItems();

  const filtered = menuItems?.filter((item) =>
    search === "" || item.name.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryName = (catId: number) => categories?.find((c) => c.id === catId)?.name ?? "Unknown";

  return (
    <div className="p-6">
      <div className="mb-6 lg:ml-0 ml-12 lg:mt-0 mt-4">
        <h1 className="text-2xl font-bold text-gray-900">Menu Manager</h1>
        <p className="text-gray-500">Manage menu items, pricing, and availability</p>
      </div>

      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search menu items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading menu...</div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Item</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Cost</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Tags</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Available</th>
                </tr>
              </thead>
              <tbody>
                {filtered?.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={item.image ?? ""} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.prepTimeMinutes}min · {item.calories}cal</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{getCategoryName(item.categoryId)}</td>
                    <td className="px-4 py-3 font-bold">${item.price}</td>
                    <td className="px-4 py-3 text-gray-500">${item.costPrice}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {item.isPopular && <Badge variant="outline" className="text-orange-600 border-orange-300 text-[10px]"><Star className="w-3 h-3 mr-0.5" />Popular</Badge>}
                        {item.isVegetarian && <Badge variant="outline" className="text-green-600 border-green-300 text-[10px]"><Leaf className="w-3 h-3 mr-0.5" />Veg</Badge>}
                        {item.isGlutenFree && <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px]"><WheatOff className="w-3 h-3 mr-0.5" />GF</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Switch checked={item.isAvailable ?? true} />
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

import { useTables } from "@/hooks/useStaticQueries";
import { Armchair } from "lucide-react";

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-700 border-green-300",
  occupied: "bg-red-100 text-red-700 border-red-300",
  reserved: "bg-blue-100 text-blue-700 border-blue-300",
  cleaning: "bg-amber-100 text-amber-700 border-amber-300",
};

export default function TablesPage() {
  const { data: tables, isLoading } = useTables();

  const sections = [...new Set(tables?.map((t) => t.section) ?? [])];

  return (
    <div className="p-6">
      <div className="mb-6 lg:ml-0 ml-12 lg:mt-0 mt-4">
        <h1 className="text-2xl font-bold text-gray-900">Tables</h1>
        <p className="text-gray-500">Floor plan and table management</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading tables...</div>
      ) : (
        <div className="space-y-6">
          {sections.map((section) => {
            const sectionTables = tables?.filter((t) => t.section === section) ?? [];
            return (
              <div key={section}>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Armchair className="w-5 h-5 text-amber-500" />
                  {section}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {sectionTables.map((table) => (
                    <div
                      key={table.id}
                      className={`rounded-xl border-2 p-4 text-center transition-shadow hover:shadow-md ${statusColors[table.status]}`}
                    >
                      <p className="text-2xl font-bold">{table.number}</p>
                      <p className="text-xs mt-1 capitalize">{table.status}</p>
                      <p className="text-xs mt-0.5 opacity-70">{table.capacity} seats</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Summary */}
          <div className="bg-white rounded-xl border p-4 flex flex-wrap gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{tables?.length ?? 0}</p>
              <p className="text-xs text-gray-500">Total Tables</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{tables?.filter((t) => t.status === "available").length ?? 0}</p>
              <p className="text-xs text-gray-500">Available</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{tables?.filter((t) => t.status === "occupied").length ?? 0}</p>
              <p className="text-xs text-gray-500">Occupied</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{tables?.filter((t) => t.status === "reserved").length ?? 0}</p>
              <p className="text-xs text-gray-500">Reserved</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

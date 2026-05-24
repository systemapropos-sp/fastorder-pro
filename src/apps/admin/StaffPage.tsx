import { useStaff } from "@/hooks/useStaticQueries";
import { Mail, Phone, Shield } from "lucide-react";

const roleColors: Record<string, string> = {
  manager: "bg-purple-100 text-purple-700",
  cashier: "bg-blue-100 text-blue-700",
  chef: "bg-orange-100 text-orange-700",
  server: "bg-green-100 text-green-700",
  host: "bg-pink-100 text-pink-700",
  driver: "bg-gray-100 text-gray-700",
};

export default function StaffPage() {
  const { data: staff, isLoading } = useStaff();

  return (
    <div className="p-6">
      <div className="mb-6 lg:ml-0 ml-12 lg:mt-0 mt-4">
        <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
        <p className="text-gray-500">Manage your team members</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading staff...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff?.map((member) => (
            <div key={member.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-lg font-bold text-slate-600">
                  {member.name.charAt(0)}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[member.role] ?? "bg-gray-100"}`}>
                  {member.role}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">{member.name}</h3>
              <div className="mt-3 space-y-1.5">
                {member.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="w-4 h-4" />
                    {member.phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  PIN: {member.pin}
                </div>
              </div>
              <div className="mt-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${member.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {member.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

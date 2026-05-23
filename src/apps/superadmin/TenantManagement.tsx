import { trpc } from "@/providers/trpc";
import { Building2, Phone, Mail, MapPin, BadgeCheck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TENANT_ID = 1;

export default function TenantManagement() {
  const { data: menuItems } = trpc.menu.items.useQuery({ tenantId: TENANT_ID });
  const { data: staff } = trpc.staff.list.useQuery({ tenantId: TENANT_ID });
  const { data: tables } = trpc.table.list.useQuery({ tenantId: TENANT_ID });

  // Hardcoded tenant info for display since we seeded it
  const tenant = {
    name: "The Rustic Loaf Café",
    slug: "rustic-loaf",
    address: "1245 Market Street, San Francisco, CA 94103",
    phone: "(415) 555-0187",
    email: "hello@rusticloaf.com",
    timezone: "America/Los_Angeles",
    currency: "USD",
    status: "active",
    plan: "professional",
    taxRate: "8.75",
  };

  const planColors: Record<string, string> = {
    free: "bg-gray-100 text-gray-700",
    basic: "bg-blue-100 text-blue-700",
    professional: "bg-amber-100 text-amber-700",
    enterprise: "bg-purple-100 text-purple-700",
  };

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    suspended: "bg-red-100 text-red-700",
    trial: "bg-blue-100 text-blue-700",
    cancelled: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
        <p className="text-gray-500">Manage restaurant tenants on the platform</p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden mb-6">
        {/* Tenant Header */}
        <div className="p-6 border-b bg-gradient-to-r from-amber-50 to-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{tenant.name}</h2>
                <p className="text-sm text-gray-500">{tenant.slug}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={planColors[tenant.plan]}>
                <BadgeCheck className="w-3 h-3 mr-1" />
                {tenant.plan}
              </Badge>
              <Badge className={statusColors[tenant.status]}>{tenant.status}</Badge>
            </div>
          </div>
        </div>

        {/* Tenant Details */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Contact Information</h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              {tenant.address}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" />
              {tenant.phone}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-gray-400" />
              {tenant.email}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              {tenant.timezone}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Configuration</h3>
            <div className="flex items-center justify-between text-sm py-2 border-b">
              <span className="text-gray-600">Currency</span>
              <span className="font-medium">{tenant.currency}</span>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b">
              <span className="text-gray-600">Tax Rate</span>
              <span className="font-medium">{tenant.taxRate}%</span>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b">
              <span className="text-gray-600">Online Orders</span>
              <span className="text-green-600 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b">
              <span className="text-gray-600">Auto-Accept</span>
              <span className="text-gray-500 font-medium">Disabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-5 text-center">
          <p className="text-3xl font-bold text-amber-600">{menuItems?.length ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">Menu Items</p>
        </div>
        <div className="bg-white rounded-xl border p-5 text-center">
          <p className="text-3xl font-bold text-blue-600">{staff?.length ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">Staff Members</p>
        </div>
        <div className="bg-white rounded-xl border p-5 text-center">
          <p className="text-3xl font-bold text-green-600">{tables?.length ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">Tables</p>
        </div>
        <div className="bg-white rounded-xl border p-5 text-center">
          <p className="text-3xl font-bold text-purple-600">5</p>
          <p className="text-sm text-gray-500 mt-1">Categories</p>
        </div>
      </div>
    </div>
  );
}

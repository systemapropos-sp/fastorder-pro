import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, DollarSign, Users, TrendingUp, Globe, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const TENANT_ID = 1;
const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444"];

export default function SuperadminDashboard() {
  const { data: analytics } = trpc.analytics.dashboard.useQuery({ tenantId: TENANT_ID });
  const { data: salesByDay } = trpc.analytics.salesByDay.useQuery({ tenantId: TENANT_ID, days: 7 });
  const { data: popularItems } = trpc.analytics.popularItems.useQuery({ tenantId: TENANT_ID, limit: 5 });
  const { data: orders } = trpc.order.list.useQuery({ tenantId: TENANT_ID });

  const statusData = [
    { name: "Active", value: orders?.filter((o) => ["pending", "confirmed", "preparing", "ready"].includes(o.status)).length ?? 0 },
    { name: "Completed", value: orders?.filter((o) => o.status === "completed").length ?? 0 },
    { name: "Cancelled", value: orders?.filter((o) => o.status === "cancelled").length ?? 0 },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-500">System-wide analytics and tenant performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-gray-500">Active Tenants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">${analytics?.todayRevenue.toFixed(2) ?? "0.00"}</p>
            <p className="text-xs text-gray-500">Today's Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">{analytics?.todayOrders ?? 0}</p>
            <p className="text-xs text-gray-500">Today's Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold">${analytics?.weekRevenue.toFixed(2) ?? "0.00"}</p>
            <p className="text-xs text-gray-500">Week Revenue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Revenue (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {salesByDay && salesByDay.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesByDay}>
                  <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString("en", { weekday: "short" })} fontSize={12} />
                  <YAxis fontSize={12} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v: any) => `$${Number(v).toFixed(2)}`} />
                  <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-400">No data</div>
            )}
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Order Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {statusData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs text-gray-600">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-500" />
            Top Selling Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Rank</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Item</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Units Sold</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {popularItems?.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-amber-600">#{idx + 1}</td>
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3">{item.count}</td>
                    <td className="px-4 py-3 font-bold">${item.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

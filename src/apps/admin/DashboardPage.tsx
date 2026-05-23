import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, ShoppingCart, Users, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const TENANT_ID = 1;

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading } = trpc.analytics.dashboard.useQuery({ tenantId: TENANT_ID });
  const { data: salesByDay } = trpc.analytics.salesByDay.useQuery({ tenantId: TENANT_ID, days: 7 });
  const { data: todayOrders } = trpc.order.todayOrders.useQuery({ tenantId: TENANT_ID });

  const statCards = [
    { label: "Today's Revenue", value: stats ? `$${stats.todayRevenue.toFixed(2)}` : "—", icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { label: "Today's Orders", value: stats?.todayOrders ?? "—", icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Orders", value: stats?.activeOrders ?? "—", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Low Stock Items", value: stats?.lowStock ?? "—", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", onClick: () => navigate("/admin/inventory") },
    { label: "Total Staff", value: stats?.totalStaff ?? "—", icon: Users, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Week Revenue", value: stats ? `$${stats.weekRevenue.toFixed(2)}` : "—", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 lg:ml-0 ml-12 lg:mt-0 mt-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your restaurant's performance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {statCards.map((card) => (
          <Card key={card.label} className={`cursor-pointer transition-shadow hover:shadow-md ${card.onClick ? "hover:border-amber-300" : ""}`} onClick={card.onClick}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              {isLoading ? (
                <Skeleton className="h-7 w-20 mt-2" />
              ) : (
                <p className="text-2xl font-bold mt-2">{card.value}</p>
              )}
              <p className="text-xs text-gray-500">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue (Last 7 Days)</CardTitle>
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
              <div className="h-[250px] flex items-center justify-center text-gray-400">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Today's Orders</CardTitle>
            <button onClick={() => navigate("/admin/orders")} className="text-sm text-amber-600 hover:underline">View All</button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[250px] overflow-y-auto">
              {todayOrders?.length === 0 && <p className="text-gray-400 text-sm">No orders today</p>}
              {todayOrders?.slice(0, 8).map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.customerName || "Guest"} · {order.orderType}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">${parseFloat(order.total).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === "completed" ? "bg-green-100 text-green-700" :
                      order.status === "cancelled" ? "bg-red-100 text-red-700" :
                      order.status === "ready" ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

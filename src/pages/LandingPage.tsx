import { useNavigate } from "react-router";
import { Utensils, Shield, Monitor, ChefHat, CreditCard, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const apps = [
  { id: "web", name: "Customer Ordering", description: "Browse menu, customize orders, and checkout online", icon: Globe, color: "bg-amber-500", path: "/web" },
  { id: "kiosk", name: "Self-Order Kiosk", description: "Touch-friendly in-store ordering experience", icon: Monitor, color: "bg-emerald-500", path: "/kiosk" },
  { id: "pos", name: "Cashier POS", description: "Process payments and manage transactions", icon: CreditCard, color: "bg-blue-500", path: "/pos" },
  { id: "kitchen", name: "Kitchen Display", description: "Real-time order tickets and preparation tracking", icon: ChefHat, color: "bg-orange-500", path: "/kitchen" },
  { id: "admin", name: "Restaurant Admin", description: "Menu management, orders, and analytics", icon: Utensils, color: "bg-violet-500", path: "/admin" },
  { id: "superadmin", name: "SaaS Admin", description: "Tenant management and system-wide settings", icon: Shield, color: "bg-slate-700", path: "/superadmin" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FastOrder Pro</h1>
              <p className="text-xs text-gray-500 -mt-0.5">Multi-Tenant Restaurant SaaS</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
            Staff Login
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          Welcome to <span className="text-amber-600">The Rustic Loaf Café</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A complete restaurant management ecosystem. Choose your application below to get started.
        </p>
      </section>

      {/* App Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => navigate(app.path)}
              className="group relative bg-white rounded-2xl border border-gray-200 p-6 text-left shadow-sm hover:shadow-lg hover:border-amber-300 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${app.color} rounded-xl flex items-center justify-center shadow-md`}>
                  <app.icon className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{app.name}</h3>
              <p className="text-sm text-gray-500">{app.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Platform Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Multi-Tenant", value: "Unlimited Restaurants" },
              { label: "Real-Time", value: "Live Order Sync" },
              { label: "Analytics", value: "Sales & Inventory" },
              { label: "Customization", value: "Menu Options Engine" },
            ].map((feat) => (
              <div key={feat.label} className="p-4 rounded-xl bg-amber-50/50">
                <p className="text-sm font-medium text-amber-700">{feat.label}</p>
                <p className="text-sm text-gray-600 mt-1">{feat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm">
        <p>FastOrder Pro v1.0 — Multi-Tenant Restaurant Management Platform</p>
      </footer>
    </div>
  );
}

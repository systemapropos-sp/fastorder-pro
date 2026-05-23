import { Outlet, useNavigate, useLocation } from "react-router";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, Utensils, ArrowLeft } from "lucide-react";

export default function WebLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const itemCount = useCartStore((s) => s.getItemCount());
  const isMenu = location.pathname === "/web";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isMenu && (
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 leading-tight">The Rustic Loaf Café</h1>
              <p className="text-[11px] text-gray-500 leading-tight">Fresh. Artisan. Delicious.</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/web/cart")}
            className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ShoppingBag className="w-6 h-6 text-gray-700" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>The Rustic Loaf Café — 1245 Market Street, San Francisco, CA</p>
          <p className="mt-1">(415) 555-0187 | hello@rusticloaf.com</p>
          <p className="mt-3 text-xs text-gray-400">Powered by FastOrder Pro</p>
        </div>
      </footer>
    </div>
  );
}

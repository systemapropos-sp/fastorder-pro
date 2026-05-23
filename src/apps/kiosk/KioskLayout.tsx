import { Outlet, useNavigate, useLocation } from "react-router";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, Home, ArrowLeft } from "lucide-react";

export default function KioskLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const itemCount = useCartStore((s) => s.getItemCount());
  const isHome = location.pathname === "/kiosk";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Kiosk Header */}
      <header className="bg-white border-b shadow-sm flex-shrink-0">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isHome && (
              <button
                onClick={() => navigate(-1)}
                className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">Self-Order Kiosk</h1>
              <p className="text-sm text-gray-500">The Rustic Loaf Café</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/kiosk/cart")}
              className="relative w-14 h-14 bg-amber-500 hover:bg-amber-600 rounded-xl flex items-center justify-center transition-colors shadow-md"
            >
              <ShoppingCart className="w-7 h-7 text-white" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
            >
              <Home className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

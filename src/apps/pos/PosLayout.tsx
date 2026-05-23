import { Outlet, useNavigate, useLocation } from "react-router";
import { CreditCard, ClipboardList, Home } from "lucide-react";

export default function PosLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold">Cashier POS</h1>
            <p className="text-xs text-slate-400">The Rustic Loaf Café</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/pos/")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/pos/" ? "bg-amber-500 text-white" : "text-slate-300 hover:bg-slate-700"
            }`}
          >
            Terminal
          </button>
          <button
            onClick={() => navigate("/pos/orders")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              location.pathname === "/pos/orders" ? "bg-amber-500 text-white" : "text-slate-300 hover:bg-slate-700"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

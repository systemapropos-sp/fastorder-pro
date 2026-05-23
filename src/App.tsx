import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import WebApp from "./apps/web/WebApp";
import AdminApp from "./apps/admin/AdminApp";
import KioskApp from "./apps/kiosk/KioskApp";
import KitchenApp from "./apps/kitchen/KitchenApp";
import PosApp from "./apps/pos/PosApp";
import SuperadminApp from "./apps/superadmin/SuperadminApp";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/web/*" element={<WebApp />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/kiosk/*" element={<KioskApp />} />
      <Route path="/kitchen/*" element={<KitchenApp />} />
      <Route path="/pos/*" element={<PosApp />} />
      <Route path="/superadmin/*" element={<SuperadminApp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

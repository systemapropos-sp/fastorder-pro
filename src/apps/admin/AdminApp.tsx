import { Routes, Route } from "react-router";
import AdminLayout from "./AdminLayout";
import DashboardPage from "./DashboardPage";
import OrdersPage from "./OrdersPage";
import MenuManagerPage from "./MenuManagerPage";
import InventoryPage from "./InventoryPage";
import StaffPage from "./StaffPage";
import TablesPage from "./TablesPage";

export default function AdminApp() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/menu" element={<MenuManagerPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/tables" element={<TablesPage />} />
      </Route>
    </Routes>
  );
}

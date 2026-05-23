import { Routes, Route } from "react-router";
import SuperadminLayout from "./SuperadminLayout";
import SuperadminDashboard from "./SuperadminDashboard";
import TenantManagement from "./TenantManagement";
import SystemSettings from "./SystemSettings";

export default function SuperadminApp() {
  return (
    <Routes>
      <Route element={<SuperadminLayout />}>
        <Route path="/" element={<SuperadminDashboard />} />
        <Route path="/tenants" element={<TenantManagement />} />
        <Route path="/settings" element={<SystemSettings />} />
      </Route>
    </Routes>
  );
}

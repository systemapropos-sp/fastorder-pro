import { Routes, Route } from "react-router";
import PosLayout from "./PosLayout";
import PosTerminal from "./PosTerminal";
import PosOrders from "./PosOrders";

export default function PosApp() {
  return (
    <Routes>
      <Route element={<PosLayout />}>
        <Route path="/" element={<PosTerminal />} />
        <Route path="/orders" element={<PosOrders />} />
      </Route>
    </Routes>
  );
}

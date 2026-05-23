import { Routes, Route } from "react-router";
import KitchenDisplay from "./KitchenDisplay";

export default function KitchenApp() {
  return (
    <Routes>
      <Route path="/" element={<KitchenDisplay />} />
    </Routes>
  );
}

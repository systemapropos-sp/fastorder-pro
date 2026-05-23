import { Routes, Route } from "react-router";
import KioskLayout from "./KioskLayout";
import KioskMenu from "./KioskMenu";
import KioskCart from "./KioskCart";
import KioskPayment from "./KioskPayment";
import KioskConfirmation from "./KioskConfirmation";

export default function KioskApp() {
  return (
    <Routes>
      <Route element={<KioskLayout />}>
        <Route path="/" element={<KioskMenu />} />
        <Route path="/cart" element={<KioskCart />} />
        <Route path="/payment" element={<KioskPayment />} />
        <Route path="/confirmation" element={<KioskConfirmation />} />
      </Route>
    </Routes>
  );
}

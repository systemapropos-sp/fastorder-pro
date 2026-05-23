import { Routes, Route } from "react-router";
import WebLayout from "./WebLayout";
import MenuPage from "./MenuPage";
import CartPage from "./CartPage";
import CheckoutPage from "./CheckoutPage";
import OrderTrackingPage from "./OrderTrackingPage";

export default function WebApp() {
  return (
    <Routes>
      <Route element={<WebLayout />}>
        <Route path="/" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/track/:orderId" element={<OrderTrackingPage />} />
      </Route>
    </Routes>
  );
}

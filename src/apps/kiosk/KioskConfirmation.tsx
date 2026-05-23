import { useNavigate } from "react-router";
import { CheckCircle, Clock } from "lucide-react";

export default function KioskConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto px-6 py-16 text-center">
      <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle className="w-14 h-14 text-green-600" />
      </div>

      <h2 className="text-4xl font-bold text-gray-900 mb-3">Thank You!</h2>
      <p className="text-xl text-gray-600 mb-2">Your order has been placed.</p>
      <p className="text-gray-500 mb-8">Please take your receipt and wait for your order number to be called.</p>

      <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-6 mb-8">
        <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
        <p className="text-amber-800 font-medium">Estimated wait time</p>
        <p className="text-3xl font-bold text-amber-600">12-15 minutes</p>
      </div>

      <button
        onClick={() => navigate("/kiosk")}
        className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white text-xl font-bold rounded-xl transition-colors shadow-md"
      >
        Start New Order
      </button>
    </div>
  );
}

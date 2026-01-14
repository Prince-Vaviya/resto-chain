import { useState } from "react";
import { Trash2, Plus, Minus, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import api from "../lib/api";

const CartPage = () => {
  const { items, total, updateQuantity, removeItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { clearCart } = useCartStore();

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsCheckingOut(true);
    try {
      // Calculate order details
      const deliveryFee = 40;
      const taxes = Math.round(total * 0.05);
      const finalTotal = total + deliveryFee + taxes;

      const orderData = {
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: total,
        delivery_fee: deliveryFee,
        taxes: taxes,
        total: finalTotal,
        payment_method: "COD", // Hardcoded for now
        delivery_address: "Default Saved Address", // Hardcoded for now, would come from profile
      };

      await api.post("/orders", orderData);
      clearCart();
      navigate("/orders");
    } catch (error) {
      console.error("Checkout failed", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-6">
          🛒
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-8 text-center max-w-sm">
          Looks like you haven't added anything to your cart yet. Browse our
          delicious menu to get started!
        </p>
        <Link
          to="/"
          className="px-8 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-6 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center text-3xl shrink-0">
                {item.image || "🍽️"}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="ml-auto font-semibold text-gray-900">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>₹40</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes (5%)</span>
                <span>₹{Math.round(total * 0.05)}</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span>₹{total + 40 + Math.round(total * 0.05)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg shadow-gray-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Place Order (COD)"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

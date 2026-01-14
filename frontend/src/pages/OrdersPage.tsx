import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import api from "../lib/api";
import { Loader2, Package, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface OrderItem {
  name: string;
  quantity: number;
  total_price: number;
}

interface Order {
  _id: string;
  order_number: string;
  status: string;
  total: number;
  placed_at: string;
  items: OrderItem[];
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-blue-100 text-blue-700",
  PREPARING: "bg-orange-100 text-orange-700",
  READY_FOR_DELIVERY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REJECTED: "bg-red-100 text-red-700",
};

import { socket } from "../lib/socket";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/myorders");
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();

      // Socket.io
      if (user?._id) {
        socket.connect();
        socket.emit("join_room", `customer_${user._id}`);

        socket.on("order_status_updated", (updatedOrder: Order) => {
          setOrders((prev) =>
            prev.map((order) =>
              order._id === updatedOrder._id ? updatedOrder : order
            )
          );
        });
      }
    } else {
      setIsLoading(false);
    }

    return () => {
      if (socket.connected) {
        socket.off("order_status_updated");
        socket.disconnect();
      }
    };
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">
          Please log in to view orders
        </h2>
        <Link
          to="/login"
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="text-gray-500 mb-6">
            Start ordering delicious food now!
          </p>
          <Link
            to="/"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-gray-100 pb-4">
                <div>
                  <div className="font-mono text-sm text-gray-500 mb-1">
                    #{order.order_number}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.placed_at).toLocaleDateString()} at{" "}
                    {new Date(order.placed_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-4">
                  <span className="font-bold text-lg">₹{order.total}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      statusColors[order.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {item.quantity}x
                      </span>
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-gray-500">₹{item.total_price}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-2 text-sm text-gray-500">
                {order.status === "DELIVERED" ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Delivered
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    Estimated delivery: 30 mins
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

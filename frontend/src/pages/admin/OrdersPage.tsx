import { useEffect, useState } from "react";
import { Loader2, Package, Check, X, Truck, ChefHat } from "lucide-react";
import api from "../../lib/api";
import { socket } from "../../lib/socket";

interface OrderItem {
  name: string;
  quantity: number;
  total_price: number;
}

interface Customer {
  name: string;
  email: string;
}

interface Order {
  _id: string;
  order_number: string;
  customer_id: Customer;
  items: OrderItem[];
  total: number;
  status: string;
  placed_at: string;
}

const statusActions: Record<
  string,
  { label: string; nextStatus: string; icon: any; color: string }[]
> = {
  PENDING: [
    {
      label: "Accept",
      nextStatus: "ACCEPTED",
      icon: Check,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      label: "Reject",
      nextStatus: "REJECTED",
      icon: X,
      color: "bg-red-600 hover:bg-red-700",
    },
  ],
  ACCEPTED: [
    {
      label: "Start Preparing",
      nextStatus: "PREPARING",
      icon: ChefHat,
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ],
  PREPARING: [
    {
      label: "Ready for Delivery",
      nextStatus: "READY_FOR_DELIVERY",
      icon: Package,
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ],
  READY_FOR_DELIVERY: [
    {
      label: "Mark Delivered",
      nextStatus: "DELIVERED",
      icon: Truck,
      color: "bg-green-600 hover:bg-green-700",
    },
  ],
  DELIVERED: [],
  REJECTED: [],
  CANCELLED: [],
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();

    // Socket.io
    socket.connect();
    socket.emit("join_room", "admin");

    socket.on("new_order", (newOrder: Order) => {
      //   api.get(`/orders/${newOrder._id}`) // Fetch full order details if needed, or rely on payload
      // Ideally backend sends full populated object. For now, let's just prepend to be safe or re-fetch
      // Optimistic update:
      setOrders((prev) => [newOrder, ...prev]);

      // Better approach for populated fields: re-fetch or ensure backend sends populated
      // For simplicity/robustness in this demo, let's just re-fetch silently
      fetchOrders();
    });

    return () => {
      socket.off("new_order");
      socket.disconnect();
    };
  }, []);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-500">
          Manage incoming orders and status updates
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex flex-col md:flex-row justify-between mb-6 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono font-bold text-gray-900">
                    #{order.order_number}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                      {
                        PENDING: "bg-yellow-100 text-yellow-800",
                        ACCEPTED: "bg-blue-100 text-blue-800",
                        PREPARING: "bg-orange-100 text-orange-800",
                        READY_FOR_DELIVERY: "bg-purple-100 text-purple-800",
                        DELIVERED: "bg-green-100 text-green-800",
                        REJECTED: "bg-red-100 text-red-800",
                        CANCELLED: "bg-gray-100 text-gray-800",
                      }[order.status] || "bg-gray-100"
                    }`}
                  >
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {order.customer_id?.name || "Unknown Customer"} •{" "}
                  {new Date(order.placed_at).toLocaleString()}
                </div>
              </div>
              <div className="mt-4 md:mt-0 text-xl font-bold text-gray-900">
                ₹{order.total}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Items */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Items
                </h4>
                <ul className="space-y-2">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span>
                        <span className="font-bold">{item.quantity}x</span>{" "}
                        {item.name}
                      </span>
                      <span className="text-gray-500">₹{item.total_price}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col justify-end">
                <div className="flex gap-3 justify-end flex-wrap">
                  {statusActions[order.status]?.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.nextStatus}
                        onClick={() =>
                          handleStatusUpdate(order._id, action.nextStatus)
                        }
                        className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors ${action.color}`}
                      >
                        <Icon className="w-4 h-4" />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;

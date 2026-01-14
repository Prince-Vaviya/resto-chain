import { useEffect, useState } from "react";
import {
  Search,
  Loader2,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  ChevronRight,
  X,
} from "lucide-react";
import api from "../../lib/api";

interface OrderItem {
  name: string;
  quantity: number;
  total_price: number;
}

interface Order {
  _id: string;
  order_number: string;
  total: number;
  status: string;
  placed_at: string;
  items: OrderItem[];
  subtotal: number;
  taxes: number;
  delivery_fee: number;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  totalOrders: number;
  totalRevenue: number;
  joinedAt?: string;
  orders: Order[];
}

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("/auth/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Failed to fetch customers", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-blue-100 text-blue-800",
    PREPARING: "bg-orange-100 text-orange-800",
    READY_FOR_DELIVERY: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Left Side: Customer List */}
      <div
        className={`${
          selectedCustomer ? "hidden md:flex" : "flex"
        } flex-col w-full md:w-1/3 border-r border-gray-200 bg-white`}
      >
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Customers</h1>
          <p className="text-sm text-gray-500 mb-4">
            {customers.length} total customers
          </p>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-black focus:border-black transition-all"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredCustomers.map((customer) => (
            <div
              key={customer._id}
              onClick={() => setSelectedCustomer(customer)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedCustomer?._id === customer._id
                  ? "bg-gray-50 border-l-4 border-l-black"
                  : "border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-gray-900">
                  {customer.name}
                </span>
                <span className="text-xs font-medium text-gray-500">
                  ₹{customer.totalRevenue}
                </span>
              </div>
              <div className="text-sm text-gray-500 truncate">
                {customer.email}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Customer Details & Orders */}
      <div
        className={`${
          !selectedCustomer ? "hidden md:flex" : "flex"
        } flex-col flex-1 bg-gray-50 overflow-y-auto`}
      >
        {selectedCustomer ? (
          <div className="p-8 max-w-4xl mx-auto w-full">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="md:hidden mb-4 flex items-center text-sm text-gray-500 hover:text-black"
            >
              ← Back to list
            </button>

            {/* Customer Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-black/20">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCustomer.name}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Customer since{" "}
                    {new Date(
                      selectedCustomer.joinedAt || Date.now()
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{selectedCustomer.phone || "No phone number"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 md:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>
                    {selectedCustomer.address || "No address provided"}
                  </span>
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order History ({selectedCustomer.orders.length})
            </h3>

            <div className="space-y-4">
              {selectedCustomer.orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-gray-900">
                        #{order.order_number}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          statusColors[order.status] || "bg-gray-100"
                        }`}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.placed_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">₹{order.total}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
              {selectedCustomer.orders.length === 0 && (
                <p className="text-gray-500 italic">No orders yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <User className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">Select a customer to view details</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order #</p>
                  <p className="font-mono font-bold text-xl">
                    {selectedOrder.order_number}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      statusColors[selectedOrder.status] || "bg-gray-100"
                    }`}
                  >
                    {selectedOrder.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold bg-gray-100 w-6 h-6 flex items-center justify-center rounded text-xs">
                        {item.quantity}
                      </span>
                      <span className="text-gray-900">{item.name}</span>
                    </div>
                    <span className="text-gray-600">₹{item.total_price}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Taxes</span>
                  <span>₹{selectedOrder.taxes}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Fee</span>
                  <span>₹{selectedOrder.delivery_fee}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-100 pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;

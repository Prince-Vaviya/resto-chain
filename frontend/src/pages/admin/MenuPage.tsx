import { useEffect, useState } from "react";
import { Plus, Trash2, X, Loader2 } from "lucide-react";
import api from "../../lib/api";
import { useMenuStore } from "../../store/menuStore";

const AdminMenuPage = () => {
  const { items, categories, fetchMenu, fetchCategories } = useMenuStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image: "🍽️", // Default emoji image for now
    prep_time: "15",
  });

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, [fetchMenu, fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/menu/items", {
        ...newItem,
        price: Number(newItem.price),
        prep_time: Number(newItem.prep_time),
      });
      // Refresh menu
      fetchMenu();
      setIsModalOpen(false);
      setNewItem({
        name: "",
        description: "",
        price: "",
        category_id: "",
        image: "🍽️",
        prep_time: "15",
      });
    } catch (error) {
      console.error("Failed to add item", error);
      alert("Failed to add item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-500">Manage your restaurant's food items</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-2xl">
                {item.image}
              </div>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                {item.category_id?.name || "Uncategorized"}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
              {item.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="font-bold">₹{item.price}</span>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Item</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price (₹)
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={newItem.price}
                    onChange={(e) =>
                      setNewItem({ ...newItem, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    value={newItem.category_id}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category_id: e.target.value })
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Add Item"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenuPage;

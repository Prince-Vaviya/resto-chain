import { useEffect, useState } from "react";
import { MapPin, Clock, Star, ChevronRight, Loader2 } from "lucide-react";
import { useMenuStore } from "../store/menuStore";
import { useCartStore } from "../store/cartStore";

const HomePage = () => {
  const { categories, items, fetchCategories, fetchMenu, isLoading } =
    useMenuStore();
  const { addItem } = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchCategories();
    fetchMenu();
  }, [fetchCategories, fetchMenu]);

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category_id._id === selectedCategory);

  const handleAddToCart = (item: any) => {
    addItem({
      id: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full mb-6">
                🔥 Free delivery on first order
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Delicious Food,
                <br />
                <span className="text-gray-400">Delivered Fast.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-md">
                Experience authentic flavors from our kitchen to your doorstep.
                Fresh ingredients, quality meals, lightning-fast delivery.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() =>
                    document
                      .getElementById("menu-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg shadow-gray-900/20"
                >
                  Order Now
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("menu-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  View Menu
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>30 min delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Free delivery nearby</span>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-yellow-50 rounded-full blur-3xl opacity-50" />
              <div className="relative text-center text-9xl">🍽️</div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section
        id="menu-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Menu</h2>
            <p className="text-gray-500">
              Browse our selection of delicious dishes
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mt-4 md:mt-0">
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 ${
              selectedCategory === "all"
                ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat._id
                  ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-3xl">
                  {item.image || "🍽️"}
                </div>
                {/* Rating is hardcoded for now as it's not in the model yet */}
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>4.5</span>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 text-lg mb-1">
                {item.name}
              </h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                  ₹{item.price}
                </span>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

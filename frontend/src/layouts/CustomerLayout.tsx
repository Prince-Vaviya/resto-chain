import { Outlet, Link } from "react-router-dom";
import { ShoppingCart, User, Menu as MenuIcon } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

const CustomerLayout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="text-xl font-semibold text-gray-900 tracking-tight">
                  Resto-Chain
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Menu
              </Link>
              <Link
                to="/orders"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                My Orders
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Link to="/cart">
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors duration-200">
                  <ShoppingCart className="w-5 h-5" />
                  {items.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs font-medium rounded-full flex items-center justify-center">
                      {items.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                </button>
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900 hidden sm:block">
                    {user?.name}
                  </span>
                  <button
                    onClick={() => logout()}
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link to="/login">
                  <button className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200">
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                </Link>
              )}

              <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  Resto-Chain
                </span>
              </div>
              <p className="text-gray-500 text-sm max-w-md">
                Delicious food delivered right to your doorstep. Fresh
                ingredients, quality meals, and fast delivery.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
                  >
                    Menu
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orders"
                    className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
                  >
                    My Orders
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>+91 9876543210</li>
                <li>123 Main Street</li>
                <li>support@restochain.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 Resto-Chain. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;

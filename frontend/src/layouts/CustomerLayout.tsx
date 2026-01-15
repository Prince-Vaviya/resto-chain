import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Menu as MenuIcon,
  X,
  Home,
  Package,
  UserCircle,
  LogOut,
  LogIn,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

const CustomerLayout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Menu", path: "/", icon: Home },
    { name: "My Orders", path: "/orders", icon: Package },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Slide-out Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-lg font-semibold">Resto-Chain</span>
          </Link>
          <button
            onClick={closeMobileMenu}
            className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu User Section */}
        {isAuthenticated && (
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu Navigation */}
        <nav className="p-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
          <Link
            to="/cart"
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              location.pathname === "/cart"
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">Cart</span>
            {items.length > 0 && (
              <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Link>
          {isAuthenticated && (
            <Link
              to="/profile"
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === "/profile"
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Profile</span>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                closeMobileMenu();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <MenuIcon className="w-6 h-6" />
            </button>

            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="hidden sm:block text-xl font-semibold text-gray-900 tracking-tight">
                  Resto-Chain
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-black text-white shadow-md"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
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
                <div className="hidden sm:flex items-center gap-4">
                  <Link to="/profile">
                    <span className="text-sm font-medium text-gray-900 hover:text-gray-700">
                      {user?.name}
                    </span>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:block">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200">
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                </Link>
              )}
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

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "../../lib/api";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/admin/auth/login", { email, password });
      const { token, ...userData } = response.data;

      // Store admin data in localStorage with token (matching Zustand persist structure)
      localStorage.setItem(
        "auth-storage",
        JSON.stringify({
          state: {
            user: userData,
            token: token, // This is critical for the request interceptor
            isAuthenticated: true,
            isLoading: false,
          },
          version: 0,
        })
      );

      // Set token in axios defaults immediately
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      // Redirect to Admin Dashboard
      navigate("/admin");
      window.location.reload(); // Reload to update auth state
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Admin Access
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your restaurant
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm transition-all duration-200"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm transition-all duration-200"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Sign in as Admin"
              )}
            </button>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
          <p className="text-xs font-semibold text-indigo-900 mb-2">
            🔑 Demo Admin Credentials
          </p>
          <div className="space-y-1 text-xs text-indigo-700">
            <p>
              <span className="font-medium">Email:</span> admin@example.com
            </p>
            <p>
              <span className="font-medium">Password:</span> admin123
            </p>
          </div>
        </div>

        <div className="text-center text-sm">
          <div className="pt-4 border-t border-gray-100">
            <span className="text-gray-500">Not an admin? </span>
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Go to Customer Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

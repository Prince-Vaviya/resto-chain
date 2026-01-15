import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
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
                "Sign in"
              )}
            </button>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-xs font-semibold text-blue-900 mb-2">
            🎯 Demo Credentials
          </p>
          <div className="space-y-1 text-xs text-blue-700">
            <p>
              <span className="font-medium">Email:</span> customer@example.com
            </p>
            <p>
              <span className="font-medium">Password:</span> customer123
            </p>
          </div>
        </div>

        <div className="text-center text-sm space-y-2">
          <div>
            <span className="text-gray-500">Don't have an account? </span>
            <Link
              to="/register"
              className="font-medium text-black hover:text-gray-700"
            >
              Sign up
            </Link>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <span className="text-gray-500">Are you an admin? </span>
            <Link
              to="/admin/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

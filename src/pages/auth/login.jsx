import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { initSocket } from "../../utils/socket";
import { Eye, EyeOff } from "lucide-react";
import ForgotPassword from "../password/ForgotPassword";

const Login = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const API_SI = import.meta.env.VITE_SI_URI; 
console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const navigate = useNavigate();

/* ── Login Function ─────────────────────── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });

      if (response.data.token) {
        //  Save user & token with role permissions and profile image
        const loggedInUser = {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          profileImage: response.data.profileImage // Add profile image to user object
        };
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        localStorage.setItem("token", response.data.token);

        // 🔹 Connect socket immediately after login
        initSocket(loggedInUser._id);

        setMessage(response.data.message);
        setIsError(false);

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setMessage("Token missing in response");
        setIsError(true);
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data);
      setMessage(error.response?.data?.message || "Login failed");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

/* ── Toggle Password Visibility ─────────────────────── */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 items-center justify-center p-8">
          <div className="text-center">
            <img
              src="/images/TZI_Logo-04_-_Copy-removebg-preview.png"
              alt="TZI Logo"
              className="w-full max-w-xs mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold text-black-100 mt-6">Welcome Back</h2>
            <p className="text-black-100 mt-2">Sign in to access your account</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 p-8 lg:p-12">
          {/* Mobile Logo */}
          <div className="mb-8 lg:hidden flex justify-center">
            <img
              src="/images/TZI_Logo-04_-_Copy-removebg-preview.png"
              alt="TZI Logo"
              className="w-32 h-auto"
            />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center lg:text-left">Sign In</h2>
          <p className="text-gray-600 mb-8 text-center lg:text-left">
            Enter your credentials to continue
          </p>

          {/* Message Display */}
          {message && (
            <div
              className={`rounded-lg p-3 mb-6 text-center ${
                isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
              >
                Forgot your password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
              style={{ backgroundColor: "#008ECC" }}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-gray-500 text-sm text-center">© 2025 TZI. All rights reserved.</p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPassword isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} />
    </div>
  );
};

export default Login;

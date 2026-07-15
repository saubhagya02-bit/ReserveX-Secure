import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { loginUser } from "../services/auth.service";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await loginUser(email, password);

      console.log(response);

      //Check the vendor role
      if (response?.role?.toUpperCase() !== "VENDOR") {
        throw "Access Denied: This portal is for Vendors only.";
      }
      const { token, type, ...userData } = response;

      login(userData, token);

      // console.log(response.user)
      console.log(response.token)
      toast.success("Login Successful Welcome back!");
      navigate("/home");

    } catch (errorMessage) {
      console.error("Login failed:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Publisher Portal</h1>
        <p className="text-gray-500 mt-2 max-w-md">
          Secure your stall at Sri Lanka’s largest literary event. Log in to
          manage your reservation or register as a new vendor.
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg">
        <div className="flex">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 text-sm font-medium transition ${activeTab === "login"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
              }`}
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("/register")}
            className="flex-1 py-3 text-sm font-medium text-gray-500 hover:text-blue-600 transition"
          >
            Sign Up
          </button>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-semibold text-center">Welcome Back</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your credentials to access your dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="relative">
              <label className="block text-sm mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <EnvelopeIcon className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  placeholder="publisher@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="relative">
              <div className="flex justify-between items-center text-sm mb-2">
                <label>Password</label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <LockClosedIcon className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>

          <div className="text-center text-xs text-gray-400 mt-6 border-t pt-4">
            AUTHORIZED PORTAL
            <br />
            Secure JWT Authentication Enabled
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

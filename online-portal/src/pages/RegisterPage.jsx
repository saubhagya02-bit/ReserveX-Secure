import { useState } from "react";
import { registerUser } from "../services/auth.service";
import { useNavigate, Link } from "react-router-dom";
import { UserIcon, EnvelopeIcon, LockClosedIcon, BuildingStorefrontIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    business_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (formData.password !== formData.confirmPassword) {
      toast.error("Password doesnt match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser(formData);
      toast.success("Account created! Please login.")
      navigate("/login");

    } catch (error) {
      toast.error(error);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">

      <div className="text-center mb-8 lg:mt-8">
        <h1 className="text-3xl font-bold">Join ReserveX</h1>
        <p className="text-gray-500 mt-2 max-w-md">
          Join Sri Lanka’s largest literary event. Fill the form below to become a registered vendor.
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg">

        <div className="flex">
          <button onClick={() => navigate("/login")} className="flex-1 py-3 text-sm font-medium text-gray-500 hover:text-blue-600 transition">
            Sign In
          </button>
          <button className="flex-1 py-3 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
            Sign Up
          </button>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-semibold text-center">Sign Up</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Create your vendor account to start reserving stalls.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="relative">
              <label className="block text-sm mb-2">Buissnes Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <BuildingStorefrontIcon className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  name="BuissnesName"

                  name="business_name"

                  placeholder="Business Name (e.g. Sarasavi Publishers)"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm mb-2">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <UserIcon className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <EnvelopeIcon className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <LockClosedIcon className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="Create Password"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm mb-2">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <LockClosedIcon className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter Your Password"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition
              ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
            `}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>

          </form>


          <p className="text-center text-gray-500 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>

  );
};

export default RegisterPage;

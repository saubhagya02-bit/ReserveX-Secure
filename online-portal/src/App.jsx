import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar";
import StallMap from "./pages/StallMap";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";

import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./routes/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

import { AuthContext } from "./contexts/AuthContext";

function AccessDenied() {
  const { logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Error icon */}
        <div className="mx-auto mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m0 3.75h.007M10.29 3.86l-8.04 14A1.5 1.5 0 003.55 20h16.9a1.5 1.5 0 001.3-2.25l-8.04-14a1.5 1.5 0 00-2.6 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>

        <p className="mt-4 text-gray-600 leading-relaxed">
          You do not have permission to access the Publisher Portal.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          This portal is restricted to registered vendors. If you are an
          organizer, please use the Admin Portal.
        </p>

        <button
          onClick={logout}
          className="mt-7 w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated, isLoading, roleChecked, accessDenied } =
    useContext(AuthContext);

  // WAIT FOR AUTH + ROLE CHECK
  if (isAuthenticated && (isLoading || !roleChecked)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600 font-medium">
            Verifying your account...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && roleChecked && accessDenied) {
    return <AccessDenied />;
  }

  // NORMAL APPLICATION
  return (
    <>
      <ScrollToTop />

      <NavBar />

      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{
          top: 90,
        }}
      />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<AboutPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/contact" element={<ContactPage />} />

        {/* PROTECTED VENDOR ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />

          <Route path="/stallmap" element={<StallMap />} />

          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
}

export default App;

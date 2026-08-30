import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function ProtectedRoute() {
  const { isAuthenticated, isLoading, user, roleChecked, accessDenied } =
    useContext(AuthContext);

  // WAIT
  if (isLoading || !roleChecked) {
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

  // ACCESS DENIED
  if (accessDenied) {
    return null;
  }

  // NOT AUTHENTICATED
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ONLY VENDORS
  if (!user || user.role !== "VENDOR") {
    return null;
  }

  // VALID VENDOR
  return <Outlet />;
}

export default ProtectedRoute;

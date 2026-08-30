import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function ProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);

  // WAIT FOR ASGARDEO + BACKEND ROLE CHECK
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #e2e8f0",
            borderTop: "4px solid #005bb5",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  // NOT AUTHENTICATED
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // AUTHENTICATED BUT NOT ORGANIZER
  if (!user || user.role !== "EMPLOYEE") {
    return <Navigate to="/login?error=organizer-only" replace />;
  }

  // ORGANIZER
  return <Outlet />;
}

export default ProtectedRoute;

import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import AdminProfile from "./pages/AdminProfile";
import ViewStalls from "./pages/ViewStalls.jsx";
import ManageStalls from "./pages/ManageStalls.jsx";
import ViewReservations from "./pages/ViewReservations.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./App.css";

function App() {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);

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
        <p>Loading...</p>
      </div>
    );
  }

  const isVerifiedOrganizer = isAuthenticated && user?.role === "EMPLOYEE";

  return (
    <Routes>
      <Route
        path="/"
        element={
          isVerifiedOrganizer ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/view-stalls" element={<ViewStalls />} />
        <Route path="/manage-stalls" element={<ManageStalls />} />
        <Route path="/view-reservations" element={<ViewReservations />} />
      </Route>
    </Routes>
  );
}

export default App;

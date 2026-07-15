import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Fixed this line
import Login from './pages/login';
import Dashboard from "./pages/Dashboard";
import AdminProfile from "./pages/AdminProfile";
import './App.css'
import ViewStalls from './pages/ViewStalls.jsx'
import ManageStalls from './pages/ManageStalls.jsx'
import ViewReservations from "./pages/ViewReservations.jsx";

function App() {
  return (
    // Wrap the entire app in AuthProvider so components can access the login function
    <AuthProvider>
      
      {/* Wrap in Router to enable navigation (useNavigate) */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-profile" element={<AdminProfile />} />
          <Route path="/view-stalls" element={<ViewStalls />} />
          <Route path="/view-reservations" element={<ViewReservations />} />
          <Route path="/manage-stalls" element={<ManageStalls />} />
        </Routes>
      </Router>

    </AuthProvider>
  );
}

export default App;



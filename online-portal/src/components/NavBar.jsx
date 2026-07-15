import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Menu, X, UserCircle } from "lucide-react";
import logo from "../assets/logo.jpeg";

const NavBar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">

            <img
              src={logo}
              alt="ReserveX Logo"
              className="h-11 w-auto object-contain"
            />


            <h1 className="text-white text-2xl font-bold tracking-wide">
              ReserveX
            </h1>
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-8">
            {!isAuthenticated ? (
              <>
                <Link to="/" className="text-white">
                  About Us
                </Link>
                <Link to="/contact" className="text-white">
                  Contact Us
                </Link>
                <Link
                  to="/login"
                  className="inline-block px-5 py-2 bg-white text-blue-600 rounded-full text-sm font-medium"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                <Link to="/home" className="text-white">
                  Home
                </Link>
                <Link to="/" className="text-white">
                  About Us
                </Link>
                <Link to="/contact" className="text-white">
                  Contact Us
                </Link>
                <Link
                  to="/stallMap"
                  className="px-5 py-2 bg-white text-blue-600 rounded-full text-sm font-semibold shadow hover:shadow-md hover:scale-105 transition"
                >
                  Reserve a stall
                </Link>
                <Link
                  to="/profile"
                  className="text-white hover:text-blue-200 transition p-2 rounded-full hover:bg-white/10"
                  aria-label="User Profile"
                >
                  <UserCircle size={26} strokeWidth={1.5} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white border border-white/30 hover:bg-red-500/80 hover:border-red-500/80 transition-colors px-4 py-2 rounded-full text-sm font-medium ml-2"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="p-2 text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white"
                >
                  Contact Us
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-3 py-2 bg-white text-blue-600 rounded-full"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/home"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white"
                >
                  Home
                </Link>
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white"
                >
                  Contact Us
                </Link>
                <Link
                  to="/stallMap"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-3 py-2 bg-white text-blue-600 font-semibold rounded-full mb-2"
                >
                  Reserve a stall
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <UserCircle size={20} /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 mt-2 text-white font-medium rounded-md border border-white/20 hover:bg-red-500/80 transition-colors"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

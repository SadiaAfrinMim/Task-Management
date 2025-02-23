import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import Swal from "sweetalert2";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  
  // Simulated auth context - replace with your actual auth context
  const {user,logOut} = useContext(AuthContext)

  const handleLogout = () => {
    Swal.fire({
      title: "Log out",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut()
          .then(() => {
            Swal.fire("Logged out", "You have been logged out successfully.", "success");
          })
          .catch((error) => {
            Swal.fire("Error", error.message, "error");
          });
      }
    });
  };
  
  const navLinkClasses = "relative px-3 py-2 transition-all duration-200 hover:text-yellow-300 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-yellow-300 after:left-0 after:bottom-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300";
  
  return (
    <nav className={`w-full sticky top-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="text-white text-2xl font-bold tracking-wider hover:scale-105 transition-transform duration-200"
          >
            Task<span className="text-yellow-300">Manager</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkClasses}>Home</NavLink>
            <NavLink to="/dashboard" className={navLinkClasses}>Dashboard</NavLink>
            <NavLink to="/tasks" className={navLinkClasses}>Tasks</NavLink>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-300" />
              ) : (
                <Moon className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Auth Buttons */}
            {!user ? (
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition-colors duration-200"
                >
                  Register
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <img
                  src={user.photoURL}
                  alt="User"
                  className="w-8 h-8 rounded-full ring-2 ring-white/50 hover:ring-yellow-300 transition-all duration-200"
                />
                <button
                  onClick={handleLogout}
                  className="hidden md:block px-4 py-2 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10">
            <NavLink
              to="/"
              className="block px-4 py-3 text-white hover:bg-white/10 transition-colors duration-200"
            >
              Home
            </NavLink>
            <NavLink
              to="/dashboard"
              className="block px-4 py-3 text-white hover:bg-white/10 transition-colors duration-200"
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/tasks"
              className="block px-4 py-3 text-white hover:bg-white/10 transition-colors duration-200"
            >
              Tasks
            </NavLink>
            {user && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors duration-200"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
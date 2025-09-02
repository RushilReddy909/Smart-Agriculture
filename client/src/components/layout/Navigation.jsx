import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { TbMenuDeep, TbUserSquareRounded } from "react-icons/tb";
import { MdAgriculture } from "react-icons/md";
import useAuthStore from "../../store/useAuthStore";
import { MdLogout } from "react-icons/md";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, verifyToken, logout } = useAuthStore();

  useEffect(() => {
    verifyToken(); // run once on mount
  }, [verifyToken]);

  const isActive = (path) => location.pathname === path;

  const publicLinks = [
    { path: "/", label: "About Us" },
    { path: "/login", label: "Login" },
    { path: "/signup", label: "Sign Up" },
  ];

  const protectedLinks = [{ path: "/features", label: "Explore Features" }];

  const navLinks =
    isAuthenticated === true
      ? protectedLinks
      : isAuthenticated === false
      ? publicLinks
      : [];

  const getLinkClassName = (path) =>
    `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      isActive(path)
        ? "bg-green-100 text-green-700"
        : "text-gray-600 hover:text-green-600 hover:bg-green-50"
    }`;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
              <MdAgriculture className="w-6 h-6 text-green-600" />
            </div>
            <span className="heading-tertiary text-gray-900 group-hover:text-green-600 transition-colors">
              Smart Agriculture
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={getLinkClassName(link.path)}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <button
                onClick={logout}
                className="px-4 py-2 flex justify-center items-center rounded-lg font-medium 
             text-gray-600 border border-gray-300 bg-white
             hover:text-red-600 hover:border-red-400 hover:bg-red-50 
             shadow-sm transition-all duration-200"
              >
                <MdLogout className="me-2 text-lg" />
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <TbMenuDeep className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-up">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={getLinkClassName(link.path)}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

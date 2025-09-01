import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TbMenuDeep } from "react-icons/tb";
import { TbUserSquareRounded } from "react-icons/tb";
import { MdAgriculture } from "react-icons/md";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // TODO: proper token verification instead of token existence 
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;
  const isActive = (path) => location.pathname === path;

  const publicLinks = [
    { path: "/", label: "About Us" },
    { path: "/login", label: "Login" },
    { path: "/signup", label: "Sign Up" },
  ];

  const protectedLinks = [{ path: "/features", label: "Explore Features" }];

  const navLinks = isAuthenticated ? protectedLinks : publicLinks;

  const getLinkClassName = (path) => {
    return `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      isActive(path)
        ? "bg-green-100 text-green-700"
        : "text-gray-600 hover:text-green-600 hover:bg-green-50"
    }`;
  };

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

            {/* User Profile Icon */}
            {/* Here change the icon to a logout button, on click send a post request to
            /auth/logout using custom axios instance (import api from utils)  */}
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">
              <TbUserSquareRounded className="w-5 h-5 text-gray-600" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <TbMenuDeep className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

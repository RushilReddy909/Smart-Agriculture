import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
// Import the chevron down icon
import { TbMenuDeep, TbChevronDown } from "react-icons/tb";
import { MdAgriculture, MdLogout } from "react-icons/md";
import useAuthStore from "../../store/useAuthStore";
import useLanguageStore from "../../store/useLanguageStore";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { currentLang, setLanguage, t } = useLanguageStore();
  const location = useLocation();
  const { isAuthenticated, verifyToken, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const langDropdownRef = useRef(null);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  const publicLinks = [
    { path: "/", label: t("HomePage.navigation.about_us") },
    { path: "/login", label: t("HomePage.navigation.login") },
    { path: "/signup", label: t("HomePage.navigation.signup") },
  ];

  const protectedLinks = [{ path: "/features", label: t("HomePage.navigation.explore_features") }];

  const navLinks = isAuthenticated ? protectedLinks : publicLinks;

  const getLinkClassName = (path) =>
    `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      isActive(path)
        ? "bg-green-100 text-green-700"
        : "text-gray-600 hover:text-green-600 hover:bg-green-50"
    }`;

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setIsLangOpen(false);
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
              {t("HomePage.navigation.title")}
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

            {/* --- LANGUAGE DROPDOWN UPDATED HERE --- */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <span className="font-medium text-sm text-gray-700">
                  {currentLang}
                </span>
                <TbChevronDown className="w-4 h-4 ml-1 text-gray-600" />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-20">
                  <button
                    onClick={() => handleLanguageSelect("EN")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageSelect("HI")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    हिंदी (Hindi)
                  </button>
                  <button
                    onClick={() => handleLanguageSelect("TEL")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    తెలుగు (Telugu)
                  </button>
                  <button
                    onClick={() => handleLanguageSelect("CHA")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    छत्तीसगढ़ी (Chhattisgarhi)
                  </button>
                </div>
              )}
            </div>
            {/* --- END OF LANGUAGE DROPDOWN --- */}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 flex justify-center items-center rounded-lg font-medium text-gray-600 border border-gray-300 bg-white hover:text-red-600 hover:border-red-400 hover:bg-red-50 shadow-sm transition-all duration-200"
              >
                <MdLogout className="me-2 text-lg" />
                {loading ? t("HomePage.navigation.logging") : t("HomePage.navigation.logout")}
              </button>
            )}
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
        {/* ... (mobile navigation remains unchanged) ... */}
      </div>
    </nav>
  );
};

export default Navigation;

import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Zap, Search, Moon, Sun, Heart, ShoppingCart, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/orders", label: "My Orders" },
    { to: "/wishlist", label: "Wishlist" },
  ];

  const goToFooter = () => {
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const searchRoutes = [
    { keywords: ["shop", "شوب", "shopping"], action: () => navigate("/shop") },
    { keywords: ["home", "هوم"], action: () => navigate("/") },
    { keywords: ["cart", "كارت"], action: () => navigate("/cart") },
    { keywords: ["profile", "بروفيل", "بروفايل"], action: () => navigate("/profile") },
    { keywords: ["orders", "اوردرز", "order"], action: () => navigate("/orders") },
    { keywords: ["wishlist", "ويش ليست"], action: () => navigate("/wishlist") },
    { keywords: ["contact", "كونتاكت"], action: () => goToFooter() },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) {
      setSearchOpen(false);
      return;
    }

    const match = searchRoutes.find((r) =>
      r.keywords.some((k) => q.includes(k.toLowerCase()))
    );

    if (match) {
      match.action();
    }

    setQuery("");
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm dark:border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Zap className="text-indigo-600 dark:text-white fill-indigo-600 dark:fill-white" size={24} />
          <span className="font-extrabold text-lg tracking-tight text-gray-900 dark:text-white">
            KODA <span className="block text-[10px] font-medium -mt-1 text-gray-500 dark:text-white">STORE</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  
                  isActive
                    ? "bg-indigo-600 !text-white shadow-sm"
                    : "text-gray-700 dark:text-white hover:bg-white hover:!text-indigo-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => {
                  if (!query) setSearchOpen(false);
                }}
                placeholder="Search..."
                className="w-40 sm:w-56 h-9 px-4 pr-9 rounded-full bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-white outline-none focus:outline-none ring-0 focus:ring-0 border-0 focus:border-0 "
              />
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSearchOpen(false);
                }}
                className="absolute right-2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X size={15} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
             className="group w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Search size={17} className="text-gray-600 dark:text-white group-hover:text-indigo-600" />
            </button>
          )}

          <button
            onClick={toggleDarkMode}
           className="group w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {darkMode ? (
              <Sun size={17} className="text-gray-600 dark:text-white group-hover:text-indigo-600" />
            ) : (
              <Moon size={17} className="text-gray-600 dark:text-white group-hover:text-indigo-600" />
            )}
          </button>

          <Link
            to="/wishlist"
           className="group w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Heart size={17} className="text-gray-600 dark:text-white group-hover:text-indigo-600" />
          </Link>

          <Link
            to="/cart"
           className="group w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ShoppingCart size={17} className="text-gray-600 dark:text-white group-hover:text-indigo-600" />
          </Link>

          {isAuthenticated ? (
            <Link
              to="/profile"
              className="group flex items-center gap-2 px-4 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
                <User
                  size={20}
                  className="text-gray-600 dark:text-gray-200 group-hover:text-indigo-600 transition"
                />

                <span className="text-gray-700 dark:text-gray-200 font-medium group-hover:text-indigo-600 transition">
                  {user?.username || "Admin"}
                </span>
            </Link>

          ) : (
            <Link
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-700 !text-white hover:!text-white text-sm font-semibold px-5 py-2 rounded-full transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
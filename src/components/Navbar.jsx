import { useTheme } from "../context/ThemeContext";
import { Link, NavLink } from "react-router-dom";
import { Zap, Search, Moon, Sun, Heart, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { cart, wishlist } = useStore();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/orders", label: "My Orders" },
    { to: "/wishlist", label: "Wishlist" },
  ];

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

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  isActive
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-white hover:text-gray-800 dark:hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
            <Search size={17} className="text-gray-600 dark:text-white" />
          </button>

          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {darkMode ? (
              <Sun size={17} className="text-gray-600 dark:text-white" />
            ) : (
              <Moon size={17} className="text-gray-600 dark:text-white" />
            )}
          </button>

          <Link
            to="/wishlist"
            className="relative w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Heart size={17} className="text-gray-600 dark:text-white" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white dark:border-gray-900 shadow-sm">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ShoppingCart size={17} className="text-gray-600 dark:text-white" />
            {cart.itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white dark:border-gray-900 shadow-sm">
                {cart.itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <Link to="/profile">
              <img
                src={user?.avatar}
                alt={user?.username}
                className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />
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
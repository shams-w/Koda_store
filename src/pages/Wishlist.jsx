import ProductCard from "../components/ProductCard";
import { useStore } from "../context/StoreContext";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Wishlist() {
  const { wishlist, addToCart } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-6 mb-8">
        <Heart className="text-rose-500 fill-rose-500" size={28} />
        <h1 className="text-3xl font-extrabold text-gray-900">My Wishlist</h1>
        <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-semibold px-3 py-1 rounded-full">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
        </span>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-16 text-center max-w-xl mx-auto shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <Heart size={28} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900">Your wishlist is empty</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Save your favorite items here to track their availability, discount drops, and easily add them to your cart.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full transition shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20"
          >
            Explore Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
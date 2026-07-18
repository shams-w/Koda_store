import { useStore } from "../context/StoreContext";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { formatPrice } from "../api/products.js";

export default function Wishlist() {
  const { wishlist, addToCart, toggleWishlist } = useStore();
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3pb-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-16 text-center max-w-xl mx-auto shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto">
            <Heart size={28} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Your wishlist is empty</h3>
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
          {wishlist.map((product) => {
            const image = product.images?.[0]?.url;
            const hasDiscount = !!product.discountPrice;
            const price = hasDiscount ? product.discountPrice : product.price;

            return (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="h-[300px] flex items-center justify-center bg-white p-6">
                  {image && (
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-contain transition duration-300 hover:scale-110"
                    />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-base text-gray-900 dark:text-gray-100 truncate mb-2">
                    {product.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-5">
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatPrice(price)}
                    </span>
                    {hasDiscount && (
                      <span className="text-base text-gray-400 dark:text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 h-12 rounded-xl font-semibold flex justify-center items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-950/60 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
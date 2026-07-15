import { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../api/products";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, MapPin, Phone, User } from "lucide-react";

export default function Cart() {
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartLoading } = useStore();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Form states with user profile defaults
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Egypt");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Sync profile info when user data is available
  useEffect(() => {
    if (user) {
      setFullName(user.username || "");
      setPhone(user.phone || "");
      if (user.addresses && user.addresses.length > 0) {
        const primaryAddr = user.addresses[0];
        setCountry(primaryAddr.country || "Egypt");
        setCity(primaryAddr.city || "");
        setAddress(
          `${primaryAddr.street || ""}${primaryAddr.building ? `, ${primaryAddr.building}` : ""}`
        );
        setPostalCode(primaryAddr.postalCode || "");
      }
    }
  }, [user]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!cart.items || cart.items.length === 0) return;

    setCheckoutLoading(true);
    try {
      const res = await fetch("https://e-commerce-api-3wara.vercel.app/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress: {
            fullName,
            phone,
            country,
            city,
            address,
            postalCode,
          },
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Order placed successfully!");
        clearCart();
        navigate("/orders");
      } else {
        alert(data.message || "Failed to place order. Check if items are in stock.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while placing the order.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (cartLoading && (!cart.items || cart.items.length === 0)) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500">Loading your shopping cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
        <ShoppingBag className="text-indigo-600" size={28} /> Shopping Cart
      </h1>

      {!cart.items || cart.items.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-16 text-center max-w-xl mx-auto shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 text-gray-400 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag size={28} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900">Your cart is empty</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Looks like you haven't added anything to your cart yet. Head back to the store to explore.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full transition shadow-md shadow-indigo-600/10"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row items-center gap-5 transition hover:shadow-md"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-2xl object-cover border border-gray-100 dark:border-gray-700 shrink-0"
                  />
                )}

                <div className="flex-1 text-center sm:text-left space-y-1">
                  <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{formatPrice(item.price)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-1.5 border border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => updateCartQuantity(item.product, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 text-gray-600 dark:text-white border border-gray-150 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold text-gray-900 text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.product, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 text-gray-600 dark:text-white border border-gray-150 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Subtotal & Delete */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
                  <span className="font-extrabold text-indigo-600 text-base">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.product)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 transition border border-rose-100 dark:border-rose-950/30"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout & Summary Side panel */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
              <h2 className="font-extrabold text-gray-900 border-b border-gray-100 dark:border-gray-700 pb-3">
                Order Summary
              </h2>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-gray-900">EGP 50</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 dark:border-gray-700 pt-3 text-base">
                  <span className="font-bold text-gray-900">Total Price</span>
                  <span className="font-extrabold text-indigo-600 text-lg">
                    {formatPrice(cart.total + 50)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping & Checkout Form */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
              <h2 className="font-extrabold text-gray-900 border-b border-gray-100 dark:border-gray-700 pb-3">
                Shipping Details
              </h2>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                    <User size={12} /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Receiver's name"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                    <Phone size={12} /> Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Receiver's phone"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                      <MapPin size={12} /> Country
                    </label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Country"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                      <MapPin size={12} /> City
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                    <MapPin size={12} /> Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, Building, Apartment"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Postal code"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={checkoutLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-2xl transition shadow-md shadow-indigo-600/10 mt-2"
                >
                  {checkoutLoading ? "Placing Order..." : "Place Cash Order"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
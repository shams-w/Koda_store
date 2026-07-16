import React from "react";

import { Link } from "react-router-dom";

import { FaShoppingCart, FaTrash, FaArrowLeft, FaTag } from "react-icons/fa";

import { useCart } from "../context/CartContext";

import toast from "react-hot-toast";

export default function Cart() {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.14;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-[#faffa] dark:bg-gray-900">
        <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center mb-6">
          <FaShoppingCart className="text-4xl text-gray-600 dark:text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-200 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg leading-8 mb-8">
          Looks like you haven't added anything to your cart yet. <br />
          Start shopping and find something you love!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
        <div className="col-span-8">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8">
            <ul className="space-y-6">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-6 last:border-none">
                
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    
                      
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded"
                          disabled={item.quantity <= 1} >  -
                       
                        </button>
                        <span className="px-3 dark:text-gray-200">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded"> +
                      
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      EGP {(item.price * item.quantity).toLocaleString("en-US")}
                    </span>
                    <button
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.success(`${item.name} removed from cart`, { position: "top-center" });
                      }}
                      className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/60 transition duration-300 flex items-center gap-2">
                    
                      <FaTrash /> 
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => {
                  clearCart();
                  toast.success("Cart cleared successfully", { position: "top-center" });
                }}
                className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition duration-300"
              >
                Clear Cart
              </button>
            </div>
          </div>

          
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-6">
            <h4 className="flex items-center gap-2 font-semibold mb-4 dark:text-gray-100">
              <FaTag className="text-indigo-600 dark:text-indigo-400" /> Coupon Code
            </h4>
            <div className="flex gap-3">
              <input  type="text" placeholder="Enter code" className="flex-1 border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-lg px-4 py-2"/>
               
                
             <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                Apply
              </button>
              
    
            </div>
          </div>
        </div>

        <div className="col-span-4 bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8">
          <h3 className="text-xl font-bold mb-6 dark:text-gray-100">Order Summary</h3>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p className="flex justify-between">
              <span>Subtotal:</span>
              <span>EGP {subtotal.toLocaleString("en-US")}</span>
            </p>
            <p className="flex justify-between">
              <span>Shipping:</span>
              <span>
                EGP {shipping}{" "}
                {shipping === 0 && <span className="text-green-500 dark:text-green-400 text-sm">(Free)</span>}
              </span>
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Free shipping on orders over EGP 1,000</p>
            <p className="flex justify-between">
              <span>Tax (14%):</span>
              <span>EGP {tax.toLocaleString("en-US")}</span>
            </p>
            <p className="flex justify-between font-bold text-indigo-600 dark:text-indigo-400">
              <span>Total:</span>
              <span>EGP {total.toLocaleString("en-US")}</span>
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
              Proceed to Checkout
            </button>
            <Link to="/shop" className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition">
              
              <FaArrowLeft /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
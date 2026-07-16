import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

// const API_BASE = "https://e-commerce-api-3wara.vercel.app";
const API_BASE = "https://e-commerce-api-3wara.vercel.app/orders/my?page=1&limit=1";


export default function Orders() {
  const   token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDNjYmQ0MzMwYTZjN2ZkYWZlOTc1ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4NDAzMjQ4OCwiZXhwIjoxNzg0NDY0NDg4fQ.FpdhzfuTILnl2EAtVCtdrkseHGLo60D_hrRnD6Ep8D0";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders/my`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400";

      case "cancelled":
        return "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400";

      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400";

      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <p className="text-lg font-medium dark:text-gray-200">Loading Orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 text-center shadow">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No Orders Yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Order #{order._id.slice(-8)}
                    </h2>

                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>

                    <span
                      className={`inline-block mt-4 px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-400 dark:text-gray-500 text-sm">Total Price</p>

                    <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      EGP {order.totalPrice}
                    </h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
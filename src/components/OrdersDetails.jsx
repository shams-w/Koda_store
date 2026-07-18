import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiCheckCircle,
} from "react-icons/fi";

import { BsCheckCircleFill, BsCircle } from "react-icons/bs";

const API_BASE = "https://e-commerce-api-3wara.vercel.app";

export default function OrderDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders/my/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setOrder(data.order || data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const progress = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
  ];

  const currentStep = progress.indexOf(order?.status);

  const badgeStyle = {
    Pending: "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Processing: "bg-violet-100 text-violet-700",
    Shipped: "bg-cyan-100 text-cyan-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-600",
    Returned: "bg-orange-100 text-orange-700",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Order not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] py-10">
      <div className="max-w-5xl mx-auto px-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-slate-900">Order Details</h1>

            <p className="mt-2 text-xl text-slate-500">
              Order #{order.orderNumber}
            </p>
          </div>

          <span
            className={`rounded-full px-5 py-2 text-sm font-semibold ${badgeStyle[order.status]}`}
          >
            {order.status}
          </span>
        </div>
        {/* Progress */}
        {order.status !== "Cancelled" && order.status !== "Returned" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-8">
            <h2 className="text-3xl font-bold mb-8">Order Progress</h2>

            <div className="relative flex justify-between">
              {progress.map((step, index) => (
                <div
                  key={step}
                  className="flex flex-col items-center flex-1 relative"
                >
                  {index !== progress.length - 1 && (
                    <div
                      className={`absolute top-5 left-1/2 h-[3px] w-full ${
                        index < currentStep ? "bg-indigo-600" : "bg-slate-200"
                      }`}
                    />
                  )}

                  <div
                    className={`z-10 w-11 h-11 rounded-full border-4 flex items-center justify-center
                      ${
                        index <= currentStep
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "bg-white border-slate-300 text-slate-300"
                      }`}
                  >
                    {index <= currentStep ? (
                      <BsCheckCircleFill size={20} />
                    ) : (
                      <BsCircle size={20} />
                    )}
                  </div>

                  <span
                    className={`mt-3 text-sm font-medium ${
                      index <= currentStep
                        ? "text-indigo-600"
                        : "text-slate-400"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}{" "}
        {/* Order Items */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <FiPackage className="text-indigo-600 text-2xl" />

            <h2 className="text-3xl font-bold">Items</h2>
          </div>

          {order.items?.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between py-5 border-b last:border-b-0"
            >
              <div className="flex items-center gap-5">
                <img
                  src={
                    item.product?.images?.[0] || "https://placehold.co/90x90"
                  }
                  alt={item.product?.name}
                  className="w-20 h-20 rounded-xl bg-slate-100 object-cover"
                />

                <div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    {item.product?.name}
                  </h3>

                  <p className="text-slate-400 mt-1">
                    Qty: {item.quantity} × EGP {item.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-800">
                EGP {(item.quantity * item.price).toLocaleString()}
              </h3>
            </div>
          ))}
        </div>
        {/* Shipping + Payment */}
        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          {/* Shipping */}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <FiMapPin className="text-indigo-600 text-2xl" />

              <h2 className="text-3xl font-bold">Shipping Address</h2>
            </div>

            <div className="space-y-3">
              <p className="text-xl font-semibold text-slate-800">
                {order.shippingAddress?.fullName}
              </p>

              <p className="text-slate-600">{order.shippingAddress?.address}</p>

              <p className="text-slate-600">
                {order.shippingAddress?.city}, {order.shippingAddress?.country}
              </p>

              <p className="text-slate-600">{order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Payment */}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <FiCreditCard className="text-indigo-600 text-2xl" />

              <h2 className="text-3xl font-bold">Payment</h2>
            </div>

            <p className="text-xl text-slate-700">{order.paymentMethod}</p>

            <div className="border-t my-6"></div>

            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">Total</span>

              <span className="text-3xl font-bold text-indigo-600">
                EGP {order.totalPrice?.toLocaleString()}
              </span>
            </div>

            <p className="mt-4 text-slate-400">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>{" "}
        {/* Cancel Button */}
        {(order.status === "Pending" || order.status === "Confirmed") && (
          <div className="flex justify-center mt-8">
            <button
              onClick={async () => {
                try {
                  await fetch(`${API_BASE}/orders/my/${order._id}/cancel`, {
                    method: "PATCH",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });

                  fetchOrder();
                } catch (err) {
                  console.log(err);
                }
              }}
              className="
                flex
                items-center
                gap-2
                bg-red-600
                hover:bg-red-700
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
                transition-all
                duration-200
                shadow-sm
              "
            >
              <FiCheckCircle size={18} />
              Cancel Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import CategoryGrid from "../components/CategoryGrid";
import FeaturedProducts from "../components/FeaturedProducts";
import HowItWorks from "../components/HowItWorks";
import Newsletter from "../components/Newsletter";
import { useStore } from "../context/StoreContext";

export default function Home() {
  const { addToCart } = useStore();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [error, setError] = useState("");

  const loadProducts = async () => {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("https://e-commerce-api-3wara.vercel.app/products");
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setStatus("success");
      } else {
        throw new Error(data.message || "Failed to load products");
      }
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Group by category to build the categories count dynamically
  const categoriesMap = {};
  products.forEach((p) => {
    if (p.category) {
      categoriesMap[p.category] = (categoriesMap[p.category] || 0) + 1;
    }
  });
  const categories = Object.entries(categoriesMap).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <div className="space-y-16 pb-16">
      <Hero />
      <CategoryGrid categories={categories} />
      <FeaturedProducts
        products={products}
        status={status}
        error={error}
        onRetry={loadProducts}
        onAddToCart={addToCart}
      />
      <HowItWorks />
      <Newsletter />
    </div>
  );
}
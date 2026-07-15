import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useStore } from "../context/StoreContext";
import { Search, SlidersHorizontal } from "lucide-react";

export default function Shop() {
  const { addToCart } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState(5000);

  // Sync category state with search parameters changes
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "");
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("https://e-commerce-api-3wara.vercel.app/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products || []);
        } else {
          throw new Error(data.message || "Failed to load products");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Update URL category when selection changes
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  // Get all unique categories dynamically
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  // Filter and Sort
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const price = product.discountPrice ?? product.price;
    const matchesPrice = price <= priceRange;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice ?? a.price;
    const priceB = b.discountPrice ?? b.price;
    if (sortOption === "price-asc") return priceA - priceB;
    if (sortOption === "price-desc") return priceB - priceA;
    return 0; // Default
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-fit space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
            <h2 className="font-extrabold text-gray-900 flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-indigo-600" /> Filters
            </h2>
            {(searchQuery || selectedCategory || sortOption !== "default" || priceRange < 5000) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  handleCategorySelect("");
                  setSortOption("default");
                  setPriceRange(5000);
                }}
                className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Category</label>
            <div className="flex flex-wrap md:flex-col gap-1.5">
              <button
                onClick={() => handleCategorySelect("")}
                className={`px-3 py-1.5 rounded-lg text-left text-sm transition font-medium ${
                  !selectedCategory
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                    : "text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3 py-1.5 rounded-lg text-left text-sm transition capitalize font-medium ${
                    selectedCategory === cat
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                      : "text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
              <span>Max Price</span>
              <span className="text-indigo-600 font-bold">EGP {priceRange}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedCategory ? `${selectedCategory} Products` : "All Products"}
              </h1>
              <p className="text-sm text-gray-500">
                Showing {sortedProducts.length} results
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid / States */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-4 border border-gray-100 space-y-4 animate-pulse">
                  <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/3 rounded" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 w-2/3 rounded" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/2 rounded" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-bold text-red-500">Error Loading Products</h3>
              <p className="text-gray-500 mt-2">{error}</p>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-gray-800">No Products Found</h3>
              <p className="text-gray-500">
                Try widening your search queries or resetting filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  handleCategorySelect("");
                  setPriceRange(5000);
                }}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, Search, RefreshCw, ChevronDown, Filter, Check } from "lucide-react";
import { ProductCard } from "@/components/cards/ProductCard";
//type define category 
interface Category {
  id: string;
  name: string;
  slug: string;
}

//type define product brand 
interface Brand {
  id: string;
  name: string;
  slug: string;
}

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [inStock, setInStock] = useState(searchParams.get("inStock") === "true");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");
  const [ram, setRam] = useState(searchParams.get("ram") || "");
  const [storage, setStorage] = useState(searchParams.get("storage") || "");

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, search, minPrice, maxPrice, inStock, sortBy, ram, storage]);

  const fetchInitialData = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/brands"),
      ]);

      if (catRes.ok) setCategories(await catRes.json());
      if (brandRes.ok) setBrands(await brandRes.json());
    } catch (e) {
      console.error(e);
    }
  };
  // Fetch product data 
  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedBrand) params.set("brand", selectedBrand);
    if (search) params.set("search", search);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (inStock) params.set("inStock", "true");
    if (sortBy) params.set("sortBy", sortBy);
    if (ram) params.set("ram", ram);
    if (storage) params.set("storage", storage);

    // product date fech with useState
    const res = await fetch(`/api/products?${params.toString()}`);
    if (res.ok) {
      setProducts(await res.json());
    }
    setLoading(false);
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setInStock(false);
    setSortBy("newest");
    setRam("");
    setStorage("");
    router.push("/shop");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="mb-8 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white rounded-3xl p-8 border border-zinc-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Explore Electronics Catalog</h1>
          <p className="text-sm text-zinc-300 mt-2 max-w-xl">
            Browse authentic flagship laptops, smartphones, 4K OLED displays, and pro gaming gear with official warranty and instant local delivery.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs font-semibold">
          <span>Total Products: {products.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-500" /> Filter Catalog
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Search Keywords</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. MacBook, RTX 4080..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-400" />
            </div>
          </div>

          {/* Category Facet */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Facet */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Price Range ($)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ($)"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
              <input
                type="number"
                placeholder="Max ($)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
              />
            </div>
          </div>

          {/* Specs: RAM & Storage */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">RAM Spec</label>
            <select
              value={ram}
              onChange={(e) => setRam(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            >
              <option value="">Any RAM</option>
              <option value="16GB">16GB</option>
              <option value="32GB">32GB</option>
              <option value="36GB">36GB</option>
              <option value="48GB">48GB</option>
            </select>
          </div>

          {/* In Stock Only Checkbox */}
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <input
              type="checkbox"
              id="inStockOnly"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="inStockOnly" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              In Stock Only
            </label>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort Selector */}
          <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-xs">
            <span className="text-zinc-500 font-medium">
              Showing <span className="font-bold text-zinc-900 dark:text-white">{products.length}</span> products
            </span>

            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-700 dark:text-zinc-300">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_low_high">Price: Low to High</option>
                <option value="price_high_low">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Loading or Product Cards Skelaton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <Search className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">No products match your filters</h3>
              <p className="text-xs text-zinc-500 mt-1">Try resetting or adjusting your search parameters.</p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, Search, RefreshCw } from "lucide-react";
import { ProductCard } from "@/components/cards/ProductCard";
import ProductSkeleton from "@/components/skelaton/ProductSkelation/ProductSkelation";


interface Category {
  id: string;
  name: string;
  slug: string;
}

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
      <div className="mb-8  text-white rounded-3xl p-8 border border-zinc-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Explore Electronics Catalog</h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-xl">
            Browse authentic flagship laptops, smartphones, 4K OLED displays, and pro gaming gear with official warranty and instant local delivery.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-2xl border border-zinc-800 text-xs font-semibold">
          <span>Total Products: <span className="text-amber-400">{products.length}</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6 bg-zinc-900/90 backdrop-blur-md p-6 rounded-2xl border border-zinc-800/80 shadow-xl h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" /> Filter Catalog
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-zinc-400 hover:text-amber-400 font-semibold transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300">Search Keywords</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. MacBook, RTX 4080..."
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-zinc-800 bg-zinc-950/80 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400/50 transition-colors"
              />
              <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-zinc-500" />
            </div>
          </div>

          {/* Category Facet */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-zinc-800 bg-zinc-950/80 text-zinc-200 focus:outline-none focus:border-amber-400/50 transition-colors cursor-pointer"
            >
              <option value="" className="bg-zinc-900 text-zinc-300">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug} className="bg-zinc-900 text-zinc-300">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Facet */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-zinc-800 bg-zinc-950/80 text-zinc-200 focus:outline-none focus:border-amber-400/50 transition-colors cursor-pointer"
            >
              <option value="" className="bg-zinc-900 text-zinc-300">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.slug} className="bg-zinc-900 text-zinc-300">
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300">Price Range ($)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ($)"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-zinc-800 bg-zinc-950/80 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400/50 transition-colors"
              />
              <input
                type="number"
                placeholder="Max ($)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-zinc-800 bg-zinc-950/80 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400/50 transition-colors"
              />
            </div>
          </div>

          {/* Specs: RAM */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300">RAM Spec</label>
            <select
              value={ram}
              onChange={(e) => setRam(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-zinc-800 bg-zinc-950/80 text-zinc-200 focus:outline-none focus:border-amber-400/50 transition-colors cursor-pointer"
            >
              <option value="" className="bg-zinc-900 text-zinc-300">Any RAM</option>
              <option value="16GB" className="bg-zinc-900 text-zinc-300">16GB</option>
              <option value="32GB" className="bg-zinc-900 text-zinc-300">32GB</option>
              <option value="36GB" className="bg-zinc-900 text-zinc-300">36GB</option>
              <option value="48GB" className="bg-zinc-900 text-zinc-300">48GB</option>
            </select>
          </div>

          {/* In Stock Only Checkbox */}
          <div className="flex items-center gap-3 pt-3 border-t border-zinc-800">
            <input
              type="checkbox"
              id="inStockOnly"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-amber-400 focus:ring-amber-400 focus:ring-offset-zinc-900 cursor-pointer"
            />
            <label htmlFor="inStockOnly" className="text-xs font-semibold text-zinc-300 cursor-pointer select-none">
              In Stock Only
            </label>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort Selector */}
          <div className="flex items-center justify-between bg-zinc-900/90 backdrop-blur-md p-4 rounded-2xl border border-zinc-800/80 shadow-xl text-xs">
            <span className="text-zinc-400 font-medium flex items-center gap-1.5">
              Showing <span className="font-extrabold text-amber-400 text-sm">{products.length}</span> products
            </span>

            <div className="flex items-center gap-2.5">
              <span className="font-bold text-zinc-300">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-950/80 text-zinc-200 font-semibold focus:outline-none focus:border-amber-400/50 transition-colors cursor-pointer"
              >
                <option value="newest" className="bg-zinc-900 text-zinc-300">Newest Arrivals</option>
                <option value="price_low_high" className="bg-zinc-900 text-zinc-300">Price: Low to High</option>
                <option value="price_high_low" className="bg-zinc-900 text-zinc-300">Price: High to Low</option>
                <option value="rating" className="bg-zinc-900 text-zinc-300">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Product Cards Container */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6 ">
              {[...Array(7
              )].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/90 rounded-2xl border border-zinc-800 shadow-xl">
              <Search className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No products match your filters</h3>
              <p className="text-xs text-zinc-400 mt-1">Try resetting or adjusting your search parameters.</p>
              <button
                onClick={handleResetFilters}
                className="mt-5 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-zinc-950 text-xs font-bold rounded-xl shadow-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
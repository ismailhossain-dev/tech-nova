"use client";

import { ProductCard } from "@/components/cards/ProductCard";
import Banner from "@/components/Home/Banner/Banner";
import ProductLoading from "@/components/Loading/ProductLoading";

import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen 
     py-10 px-4 sm:px-6 lg:px-8">

      <div className="md:md:max-w-7xl  lg:max-w-[1420px]  lg:max-w-[1420px] mx-auto">
        <Banner />
        <div className=" py-10">
          <div className="text-center  mb-10">
            <h1 className="text-3xl font-bold ">Featured Products</h1>
            <p className="text-[16px]">Check & Get Your Desired Product!</p>
          </div>
          {/* most improtant condition  */}
          {loading ? (
            <ProductLoading />
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">No products found.</div>
          ) : (
            <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-5 gap-6  ">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
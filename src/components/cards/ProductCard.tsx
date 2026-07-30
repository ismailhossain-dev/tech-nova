"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    images: string;
    avgRating: number;
    reviewCount: number;
    category: { name: string; slug: string };
    brand: { name: string; slug: string };
    variants: Array<{
      id: string;
      sku: string;
      price: number;
      stockQuantity: number;
      attributes: string;
    }>;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const images = JSON.parse(product.images || "[]");
  const mainImage = images[0] || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80";
  const defaultVariant = product.variants[0];

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const isInWishlist = useCartStore((state) => state.isInWishlist(defaultVariant?.id || ""));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!defaultVariant) return;

    const attributes = JSON.parse(defaultVariant.attributes || "{}");
    addItem({
      id: defaultVariant.id,
      variantId: defaultVariant.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      sku: defaultVariant.sku,
      price: defaultVariant.price,
      image: mainImage,
      attributes,
      stockQuantity: defaultVariant.stockQuantity,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (defaultVariant) {
      toggleWishlist(defaultVariant.id);
    }
  };

  return (
    // মূল কার্ড ডিজাইন: কালো ব্যাকগ্রাউন্ড, ধূসর বর্ডার এবং হোভার করলে ব্লু গ্লো ইফেক্ট
    // hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-500/50 
    <Link href={`/product/${product.slug}`}>
      <div className="group relative bg-zinc-950 border-r border-zinc-800 p-4 transition-all duration-300 flex flex-col justify-between">
        {/* ক্যাটাগরি এবং প্রোডাক্টের নাম */}
        <div className="mb-3">
          <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider mb-2">
            {product.category.name}
          </span>
          {/* <Link href={`/product/${product.slug}`}> */}
          {/* প্রোডাক্টের নাম: সাদা কালার, হোভারে ব্লু হবে */}
          <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
            {product.name}
          </h3>

        </div>
        <div>
          {/* ইমেজ কন্টেইনার: সুক্ষ্ম গ্রে ব্যাকগ্রাউন্ড */}
          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 mb-3 border border-zinc-800 h-[130px]">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 "
            />

            {/* ব্র্যান্ড ব্যাজ */}
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white rounded-full">
                {product.brand.name}
              </span>
            </div>

            {/* উইশলিস্ট বাটন */}
            <button
              onClick={handleToggleWishlist}
              aria-label="Wishlist"
              className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/50 backdrop-blur-sm text-zinc-400 hover:text-red-500 transition-colors shadow-sm"
            >
              <Heart
                className={`w-4 h-4 ${isInWishlist ? "fill-red-500 text-red-500" : ""
                  }`}
              />
            </button>
          </div>




          {/* রেটিং */}
          <div className="flex items-center gap-1.5 mt-2.5 text-xs">
            <div className="flex items-center text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold ml-1.5 text-white">
                {product.avgRating.toFixed(1)}
              </span>
            </div>
            <span className="text-zinc-500 text-[11px]">
              ({product.reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* নিচের অংশ: দাম এবং কার্ডে যোগ করুন বাটন */}
        {/* বর্ডার কালার আরও সুক্ষ্ম করা হয়েছে */}
        <div className="pt-2 mt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">From</span>
            {/* দামের কালার: গ্লোয়িং ব্লু */}
            <span className="text-base font-extrabold text-blue-400">
              {formatPrice(defaultVariant?.price || product.basePrice)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
    </Link>
  );
}
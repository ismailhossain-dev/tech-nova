"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Heart, SlidersHorizontal, ShieldCheck } from "lucide-react";
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
    <div className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between">
      {/* Top Badges & Actions */}
      <div>
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-3">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white rounded-full">
              {product.brand.name}
            </span>
          </div>

          <button
            onClick={handleToggleWishlist}
            aria-label="Wishlist"
            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-zinc-600 dark:text-zinc-300 hover:text-red-500 transition-colors shadow-sm"
          >
            <Heart
              className={`w-4 h-4 ${
                isInWishlist ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </button>
        </div>

        {/* Category & Title */}
        <div className="space-y-1">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
            {product.category.name}
          </span>
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mt-2 text-xs">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-bold ml-1 text-zinc-900 dark:text-white">
              {product.avgRating.toFixed(1)}
            </span>
          </div>
          <span className="text-zinc-400 text-[11px]">
            ({product.reviewCount} reviews)
          </span>
        </div>
      </div>

      {/* Bottom Price & Add to Cart */}
      <div className="pt-4 mt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
        <div>
          <span className="text-xs text-zinc-400 block">From</span>
          <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
            {formatPrice(defaultVariant?.price || product.basePrice)}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
        >
          <ShoppingBag className="w-4 h-4" /> Add
        </button>
      </div>
    </div>
  );
}

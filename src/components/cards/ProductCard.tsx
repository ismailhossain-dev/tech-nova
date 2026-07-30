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
    <Link href={`/product/${product.slug}`} className="group flex flex-col h-full w-full">
      <div className="flex flex-col justify-between h-full w-full bg-[#212121] border border-[#282a2b] hover:border-blue-500/50 p-4 transition-all duration-300 rounded-2xl hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">

        {/* Top Content */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider line-clamp-1">
              {product.category.name}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2 h-10 leading-tight">
            {product.name}
          </h3>

          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900/80 my-3 border border-zinc-800">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-600/90 backdrop-blur-md text-white rounded-full">
                {product.brand.name}
              </span>
            </div>

            <button
              onClick={handleToggleWishlist}
              aria-label="Wishlist"
              className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/60 backdrop-blur-sm text-zinc-400 hover:text-red-500 transition-colors shadow-sm"
            >
              <Heart
                className={`w-3.5 h-3.5 ${isInWishlist ? "fill-red-500 text-red-500" : ""
                  }`}
              />
            </button>
          </div>

          <div className="flex items-center gap-1.5 mb-3 text-xs">
            <div className="flex items-center text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="font-bold ml-1 text-white text-[11px]">
                {product.avgRating.toFixed(1)}
              </span>
            </div>
            <span className="text-zinc-500 text-[11px]">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Bottom Actions aligned to absolute bottom across all cards */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2 mt-auto">
          <span className="text-base font-extrabold text-blue-400 tracking-tight">
            {formatPrice(defaultVariant?.price || product.basePrice)}
          </span>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 active:scale-95 transition-all shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

      </div>
    </Link>
  );
}
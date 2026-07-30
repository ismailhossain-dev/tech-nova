"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, ShoppingBag, Heart, Bell, Check, Truck, RotateCcw, Layers, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { ProductCard } from "@/components/cards/ProductCard";

interface Variant {
  id: string;
  sku: string;
  attributes: string;
  price: number;
  stockQuantity: number;
  lowStockThreshold: number;
}

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    images: string;
    specifications: string;
    warrantyMonths: number;
    avgRating: number;
    reviewCount: number;
    category: { name: string; slug: string };
    brand: { name: string; slug: string };
    variants: Variant[];
    reviews: Array<{
      id: string;
      rating: number;
      comment: string;
      createdAt: string;
      verifiedPurchase: boolean;
      user: { name: string; image: string };
    }>;
  };
  similarProducts: any[];
}

export function ProductDetailClient({ product, similarProducts }: ProductDetailClientProps) {
  const images: string[] = JSON.parse(product.images || "[]");
  const specifications: Record<string, string> = JSON.parse(product.specifications || "{}");

  const [selectedImage, setSelectedImage] = useState(images[0] || "");
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const isInWishlist = useCartStore((state) => state.isInWishlist(selectedVariant?.id || ""));

  const attributes: Record<string, string> = JSON.parse(selectedVariant?.attributes || "{}");

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem(
      {
        id: selectedVariant.id,
        variantId: selectedVariant.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        sku: selectedVariant.sku,
        price: selectedVariant.price,
        image: selectedImage || images[0],
        attributes,
        stockQuantity: selectedVariant.stockQuantity,
      },
      quantity
    );
  };

  const handleSetAlert = (type: "price" | "stock") => {
    setAlertSuccess(
      type === "price"
        ? "✓ Price alert registered! You will receive an email when price drops."
        : "✓ Back-in-stock notification enabled!"
    );
    setTimeout(() => setAlertSuccess(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#181818] min-h-screen text-zinc-100">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/80 px-4 py-2.5 rounded-xl border border-zinc-800/80 w-fit backdrop-blur-md">
        <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-zinc-600" />
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-amber-400 transition-colors">
          {product.category.name}
        </Link>
        <ChevronRight className="w-3 h-3 text-zinc-600" />
        <span className="text-amber-400 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-3xl bg-zinc-900 border border-zinc-800/80 overflow-hidden shadow-2xl">
            <Image
              src={selectedImage || images[0]}
              alt={product.name}
              fill
              className="object-cover transition-all duration-300"
              priority
            />
            <span className="absolute top-4 left-4 px-3.5 py-1.5 bg-amber-400 text-zinc-950 text-xs font-black rounded-full uppercase tracking-wider shadow-lg">
              {product.brand.name} Official
            </span>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === img
                      ? "border-amber-400 scale-105 shadow-md shadow-amber-400/10"
                      : "border-zinc-800/80 bg-zinc-900 opacity-60 hover:opacity-100"
                    }`}
                >
                  <Image src={img} alt={`Thumbnail ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Configurator */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
              <span className="bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">SKU: {selectedVariant?.sku}</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {product.warrantyMonths} Months Warranty
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating Summary */}
            <div className="flex items-center gap-2.5 mt-3 text-xs">
              <div className="flex items-center bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-black ml-1 text-sm text-white">
                  {product.avgRating.toFixed(1)}
                </span>
              </div>
              <span className="text-zinc-400 font-medium">({product.reviewCount} customer reviews)</span>
            </div>
          </div>

          {/* Price & Stock Display */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 shadow-xl flex items-center justify-between backdrop-blur-md">
            <div>
              <span className="text-3xl font-black text-amber-400 tracking-tight">
                {formatPrice(selectedVariant?.price || product.basePrice)}
              </span>
              <p className="text-[11px] text-zinc-400 mt-1">Inclusive of flat tax & fast dispatch</p>
            </div>

            <div className="text-right">
              {selectedVariant?.stockQuantity > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
                  <Check className="w-3.5 h-3.5" /> In Stock ({selectedVariant.stockQuantity})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-950/80 border border-red-800/60 text-red-400">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Variant Selector */}
          {product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-wider">
                Select Configuration / Variant:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.variants.map((v) => {
                  const attrs = JSON.parse(v.attributes || "{}");
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3.5 rounded-xl border text-left text-xs transition-all ${isSelected
                          ? "border-amber-400 bg-amber-400/10 ring-1 ring-amber-400/30"
                          : "border-zinc-800/80 bg-zinc-900/80 hover:border-zinc-700 text-zinc-300"
                        }`}
                    >
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>{Object.values(attrs).join(" / ")}</span>
                        <span className="text-amber-400">{formatPrice(v.price)}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 block mt-1">
                        Stock: {v.stockQuantity} units
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions: Add to Cart & Wishlist */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 font-bold text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-extrabold text-xs text-amber-400">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant?.stockQuantity || 10, quantity + 1))}
                  className="w-9 h-9 font-bold text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={selectedVariant?.stockQuantity === 0}
                className="flex-1 py-3.5 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-amber-400/10 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart ({formatPrice((selectedVariant?.price || 0) * quantity)})
              </button>

              <button
                onClick={() => toggleWishlist(selectedVariant.id)}
                className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition text-zinc-300 cursor-pointer"
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>

            {/* Price & Stock Alerts */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleSetAlert("price")}
                className="flex-1 py-2.5 px-3 rounded-xl border border-zinc-800/80 bg-zinc-900/60 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-amber-400 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400" /> Price Drop Alert
              </button>
              <button
                onClick={() => handleSetAlert("stock")}
                className="flex-1 py-2.5 px-3 rounded-xl border border-zinc-800/80 bg-zinc-900/60 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-emerald-400 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-emerald-400" /> Stock Alert
              </button>
            </div>

            {alertSuccess && (
              <div className="p-3 text-xs rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 font-semibold animate-in fade-in">
                {alertSuccess}
              </div>
            )}
          </div>

          {/* Description & Guarantee Bar */}
          <div className="pt-4 border-t border-zinc-800/80 space-y-4">
            <p className="text-xs text-zinc-400 leading-relaxed">
              {product.description}
            </p>
            <div className="grid grid-cols-3 gap-2 text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/40">
              <div className="flex items-center gap-2 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/60">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/60">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{product.warrantyMonths}m Warranty</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/60">
                <RotateCcw className="w-4 h-4 text-purple-400" />
                <span>7-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Technical Specifications */}
      <div className="bg-zinc-900/90 rounded-3xl p-6 sm:p-8 border border-zinc-800/80 shadow-2xl space-y-6 backdrop-blur-md">
        <h3 className="text-base font-black text-white flex items-center gap-2.5 uppercase tracking-wider">
          <Layers className="w-5 h-5 text-amber-400" /> Technical Specifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {Object.entries(specifications).map(([key, val]) => (
            <div
              key={key}
              className="flex justify-between items-center py-3 px-4 rounded-xl bg-zinc-950/80 border border-zinc-800/60 text-xs"
            >
              <span className="font-semibold text-zinc-400 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              <span className="font-bold text-amber-400">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Products Grid */}
      {similarProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <h3 className="text-lg font-black text-white tracking-tight">
              Similar Products in <span className="text-amber-400">{product.category.name}</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, ShoppingBag, Heart, Bell, Check, Truck, RotateCcw, AlertCircle, Share2, Layers } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { ProductCard } from "@/components/catalog/ProductCard";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category.slug}`} className="hover:underline">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <Image
              src={selectedImage || images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            <span className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-md">
              {product.brand.name} Official
            </span>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? "border-blue-600 scale-105"
                      : "border-zinc-200 dark:border-zinc-800 opacity-70 hover:opacity-100"
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
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
              <span>SKU: {selectedVariant?.sku}</span>
              <span>•</span>
              <span className="text-emerald-500 font-semibold">{product.warrantyMonths} Months Warranty</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-2 mt-3 text-xs">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold ml-1 text-zinc-900 dark:text-white text-sm">
                  {product.avgRating.toFixed(1)}
                </span>
              </div>
              <span className="text-zinc-400">({product.reviewCount} customer reviews)</span>
            </div>
          </div>

          {/* Price & Stock Display */}
          <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {formatPrice(selectedVariant?.price || product.basePrice)}
              </span>
              <p className="text-[11px] text-zinc-500 mt-0.5">Inclusive of flat tax & fast dispatch</p>
            </div>

            <div className="text-right">
              {selectedVariant?.stockQuantity > 0 ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <Check className="w-3.5 h-3.5" /> In Stock ({selectedVariant.stockQuantity} available)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Variant Selector (Configurations) */}
          {product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
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
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/20"
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                      }`}
                    >
                      <div className="font-bold text-zinc-900 dark:text-white flex items-center justify-between">
                        <span>{Object.values(attrs).join(" / ")}</span>
                        <span>{formatPrice(v.price)}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 block mt-1">
                        Stock: {v.stockQuantity} units
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions: Add to Cart & Alert triggers */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-xs">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant?.stockQuantity || 10, quantity + 1))}
                  className="w-8 h-8 font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={selectedVariant?.stockQuantity === 0}
                className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart ({formatPrice((selectedVariant?.price || 0) * quantity)})
              </button>

              <button
                onClick={() => toggleWishlist(selectedVariant.id)}
                className="p-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>

            {/* Price Alert & Back in Stock Alert Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleSetAlert("price")}
                className="flex-1 py-2 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-1.5 transition"
              >
                <Bell className="w-3.5 h-3.5 text-blue-500" /> Price Drop Alert
              </button>
              <button
                onClick={() => handleSetAlert("stock")}
                className="flex-1 py-2 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-1.5 transition"
              >
                <Bell className="w-3.5 h-3.5 text-emerald-500" /> Stock Alert
              </button>
            </div>

            {alertSuccess && (
              <div className="p-2 text-xs rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in">
                {alertSuccess}
              </div>
            )}
          </div>

          {/* Description & Guarantee Bar */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {product.description}
            </p>
            <div className="grid grid-cols-3 gap-2 text-[11px] text-zinc-500 pt-2">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-500" /> Fast Delivery
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> {product.warrantyMonths}m Warranty
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-purple-500" /> 7-Day Returns
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-500" /> Full Technical Specifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(specifications).map(([key, val]) => (
            <div
              key={key}
              className="flex justify-between py-3 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 text-xs"
            >
              <span className="font-semibold text-zinc-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              <span className="font-bold text-zinc-900 dark:text-white">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">
            Similar Products in {product.category.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

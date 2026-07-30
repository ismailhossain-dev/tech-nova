"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

/**
 * ============================================================================
 * Component: WidgetProducts
 * Description: 3-Column Featured, Top Selling & On-Sale Product Widgets Section
 * Theme: Dark Mode (#181818) with Fully Responsive Grid Layout
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// Mock Datasets (Categorized into 3 distinct lists for display)
// ----------------------------------------------------------------------------
const featuredProducts = [
    {
        name: "Laptops & Computers",
        slug: "laptops-computers",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
        price: 1300.00,
        originalPrice: null,
    },
    {
        name: "Smartphones & Tablets",
        slug: "smartphones-tablets",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
        price: 1100.00,
        originalPrice: null,
    },
    {
        name: "Audio & Headphones",
        slug: "audio-headphones",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        price: 750.00,
        originalPrice: 780.00,
    },
];

const topSellingProducts = [
    {
        name: "Gaming & Consoles",
        slug: "gaming-consoles",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
        price: 90.00,
        originalPrice: 99.00,
    },
    {
        name: "Audio & Headphones",
        slug: "audio-headphones",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        price: 159.00,
        originalPrice: null,
    },
    {
        name: "Laptops & Computers",
        slug: "laptops-computers",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
        price: 1300.00,
        originalPrice: null,
    },
];

const onSaleProducts = [
    {
        name: "Wearables & Watches",
        slug: "wearables-watches",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
        price: 150.00,
        originalPrice: 180.00,
        rating: 4,
    },
    {
        name: "Laptops & Computers",
        slug: "laptops-computers",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
        price: 1500.00,
        originalPrice: 1800.00,
        rating: 5,
    },
    {
        name: "Smartphones & Tablets",
        slug: "smartphones-tablets",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
        price: 2100.00,
        originalPrice: 2299.00,
        rating: null,
    },
];

// ----------------------------------------------------------------------------
// Type Interfaces
// ----------------------------------------------------------------------------
interface Product {
    name: string;
    slug: string;
    image: string;
    price: number;
    originalPrice?: number | null;
    rating?: number | null;
}

// ----------------------------------------------------------------------------
// Sub-Component: ProductCard
// Renders individual horizontal product row with image, title, ratings & pricing
// ----------------------------------------------------------------------------
function ProductCard({ item }: { item: Product }) {
    return (
        <Link
            href={`/category/${item.slug}`}
            className="flex items-center gap-4 group transition-transform hover:translate-x-1"
        >
            {/* Image Box */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl  border border-zinc-800/80 overflow-hidden p-2 flex items-center justify-center">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    sizes="96px"
                />
            </div>

            {/* Product Meta Info */}
            <div className="flex-1 space-y-1">
                <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {item.name}
                </h4>

                {/* Optional Star Rating */}
                {item.rating && (
                    <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < item.rating!
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-zinc-600 fill-zinc-800"
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Price Display */}
                <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-sm font-bold text-sky-400">
                        ${item.price.toFixed(2)}
                    </span>
                    {item.originalPrice && (
                        <span className="text-xs text-zinc-500 line-through">
                            ${item.originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

// ----------------------------------------------------------------------------
// Sub-Component: ProductColumn
// Renders a single section column with header underline accent
// ----------------------------------------------------------------------------
function ProductColumn({ title, items }: { title: string; items: Product[] }) {
    return (
        <div className="space-y-5">
            {/* Column Header */}
            <div className="border-b border-zinc-800 pb-2">
                <h3 className="text-lg font-bold text-white relative inline-block">
                    {title}
                    <span className="absolute bottom-[-9px] left-0 w-12 h-[3px] bg-amber-400 rounded-full" />
                </h3>
            </div>

            {/* List Container */}
            <div className="space-y-4">
                {items.map((product, idx) => (
                    <ProductCard key={`${product.slug}-${idx}`} item={product} />
                ))}
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------------
// Main Export Component: WidgetProducts
// ----------------------------------------------------------------------------
export default function WidgetProducts() {
    return (
        <section className=" py-10 px-4 sm:px-6 lg:px-8 text-zinc-200">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                <ProductColumn title="Featured Products" items={featuredProducts} />
                <ProductColumn title="Top Selling Products" items={topSellingProducts} />
                <ProductColumn title="On-sale Products" items={onSaleProducts} />
            </div>
        </section>
    );
}
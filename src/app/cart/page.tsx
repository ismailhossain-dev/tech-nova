"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Trash2, ArrowRight, Tag, Sparkles } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const subtotal = getSubtotal();
  const shippingFee = subtotal > 0 ? 15.0 : 0.0;
  const tax = subtotal * 0.05; // 5% flat tax
  const total = Math.max(0, subtotal + shippingFee + tax - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();

    if (cleanCode === "TECHNOVA10") {
      const disc = subtotal * 0.1;
      setDiscount(disc);
      setCouponMsg({ text: "✓ Coupon TECHNOVA10 applied! 10% discount subtracted.", isError: false });
    } else if (cleanCode === "FLAT50") {
      if (subtotal >= 300) {
        setDiscount(50);
        setCouponMsg({ text: "✓ Coupon FLAT50 applied! $50 discount subtracted.", isError: false });
      } else {
        setCouponMsg({ text: "✕ Minimum order value of $300 required for FLAT50.", isError: true });
      }
    } else {
      setCouponMsg({ text: "✕ Invalid coupon code.", isError: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#181818] text-white font-sans selection:bg-blue-600 selection:text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* HEADER SECTION */}
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
              <ShoppingBag className="w-7 h-7 text-blue-400" /> Shopping Cart
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Review your selected electronics before checkout</p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-red-400 hover:text-red-300 hover:underline transition"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* EMPTY CART STATE */}
        {items.length === 0 ? (
          <div className="text-center py-20 bg-[#202020] rounded-3xl border border-zinc-800/80 space-y-5 shadow-xl">
            <div className="w-16 h-16 bg-blue-950/40 border border-blue-800/40 rounded-2xl flex items-center justify-center mx-auto text-blue-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Your cart is empty</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Explore our tech catalog and add flagship products to your cart.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-105"
            >
              Explore Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* CART CONTENT GRID */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT: CART ITEMS LIST */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="p-4 sm:p-5 rounded-2xl bg-[#202020] border border-zinc-800/80 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-zinc-700 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="space-y-1">
                      <Link
                        href={`/product/${item.slug}`}
                        className="text-sm font-bold text-white hover:text-blue-400 transition line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-[11px] text-zinc-500 font-mono">SKU: {item.sku}</p>

                      {/* Attributes */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {Object.entries(item.attributes).map(([k, v]) => (
                          <span
                            key={k}
                            className="px-2 py-0.5 text-[10px] font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-md"
                          >
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                    <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-900 p-1">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="w-7 h-7 font-bold text-xs text-zinc-300 hover:bg-zinc-800 rounded-lg transition"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="w-7 h-7 font-bold text-xs text-zinc-300 hover:bg-zinc-800 rounded-lg transition"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-sm font-black text-blue-400">
                      {formatPrice(item.price * item.quantity)}
                    </span>

                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: ORDER SUMMARY & COUPON */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#202020] border border-zinc-800/80 shadow-xl space-y-5">
                <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-400" /> Order Summary
                </h3>

                {/* Coupon Input */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Promo / Discount Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. TECHNOVA10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-zinc-700 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl border border-zinc-700 transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <p className={`text-[11px] font-semibold mt-1 ${couponMsg.isError ? "text-red-400" : "text-emerald-400"}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </form>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs pt-4 border-t border-zinc-800">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-white">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400">
                    <span>Estimated Shipping</span>
                    <span className="font-bold text-white">{formatPrice(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Tax (5%)</span>
                    <span className="font-bold text-white">{formatPrice(tax)}</span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between text-base font-extrabold text-white pt-4 border-t border-zinc-800">
                    <span>Total</span>
                    <span className="text-blue-400">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout Link */}
                <Link
                  href={`/checkout?discount=${discount}&coupon=${couponCode}`}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.02]"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
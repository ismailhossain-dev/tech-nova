"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const shippingFee = subtotal > 0 ? 15.0 : 0.0;
  const tax = subtotal * 0.05; // 5% flat tax
  const total = Math.max(0, subtotal + shippingFee + tax - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "TECHNOVA10") {
      const disc = subtotal * 0.1;
      setDiscount(disc);
      setCouponMsg("✓ Coupon TECHNOVA10 applied! 10% discount subtracted.");
    } else if (couponCode.toUpperCase() === "FLAT50") {
      if (subtotal >= 300) {
        setDiscount(50);
        setCouponMsg("✓ Coupon FLAT50 applied! $50 discount subtracted.");
      } else {
        setCouponMsg("❌ Minimum order value of $300 required for FLAT50.");
      }
    } else {
      setCouponMsg("❌ Invalid coupon code.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-500" /> Shopping Cart
          </h1>
          <p className="text-xs text-zinc-500">Review your selected electronics before checkout</p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
          >
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <ShoppingBag className="w-12 h-12 text-zinc-400 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Your cart is empty</h3>
          <p className="text-xs text-zinc-500">Explore our tech catalog and add flagship products to your cart.</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm font-bold text-zinc-900 dark:text-white hover:text-blue-600 transition line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[11px] text-zinc-500">SKU: {item.sku}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {Object.entries(item.attributes).map(([k, v]) => (
                        <span
                          key={k}
                          className="px-2 py-0.5 text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded"
                        >
                          {k}: {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                  {/* Quantity adjustment */}
                  <div className="flex items-center rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-0.5">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="w-7 h-7 font-bold text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="w-7 h-7 font-bold text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                    {formatPrice(item.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary & Coupon */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">Order Summary</h3>

              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Promo / Discount Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. TECHNOVA10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl"
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && (
                  <p className="text-[11px] font-semibold text-emerald-500">{couponMsg}</p>
                )}
              </form>

              <div className="space-y-2 text-xs pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Tax (5%)</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-zinc-900 dark:text-white pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <span>Total</span>
                  <span className="text-blue-600 dark:text-blue-400">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href={`/checkout?discount=${discount}&coupon=${couponCode}`}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import { MapPin, CreditCard, ShieldCheck, CheckCircle2, ArrowRight, Truck } from "lucide-react";

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const discountParam = parseFloat(searchParams.get("discount") || "0");
  const { items, getSubtotal, clearCart } = useCartStore();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"STRIPE" | "SSLCOMMERZ" | "COD">("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = getSubtotal();
  const shippingFee = subtotal > 0 ? 15.0 : 0.0;
  const tax = subtotal * 0.05;
  const total = Math.max(0, subtotal + shippingFee + tax - discountParam);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    } else if (session?.user) {
      fetchAddresses();
    }
  }, [status, session]);

  const fetchAddresses = async () => {
    const res = await fetch("/api/addresses");
    if (res.ok) {
      const data: Address[] = await res.json();
      setAddresses(data);
      const defaultAddr = data.find((a) => a.isDefault) || data[0];
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedAddressId) {
      setError("Please select or add a shipping address before placing your order.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create Order in Database
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddressId,
          items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
          paymentMethod,
          discount: discountParam,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        setError(orderData.error || "Failed to create order");
        setLoading(false);
        return;
      }

      clearCart();

      // 2. Route according to Payment Gateway
      if (paymentMethod === "STRIPE") {
        const stripeRes = await fetch("/api/checkout/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: orderData.id }),
        });
        const stripeData = await stripeRes.json();
        router.push(stripeData.url || `/orders/${orderData.id}`);
      } else if (paymentMethod === "SSLCOMMERZ") {
        const sslRes = await fetch("/api/checkout/sslcommerz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: orderData.id }),
        });
        const sslData = await sslRes.json();
        router.push(sslData.url || `/orders/${orderData.id}`);
      } else {
        // COD - Cash on Delivery
        router.push(`/orders/${orderData.id}?placed=true`);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-blue-500" /> Express Checkout
        </h1>
        <p className="text-xs text-zinc-500">Complete your address and payment selection</p>
      </div>

      {error && (
        <div className="p-3 text-xs rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Address & Payment Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Select Shipping Address */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" /> 1. Select Shipping Address
            </h3>

            {addresses.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <p className="text-xs text-zinc-500 font-medium">No saved shipping addresses found.</p>
                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  + Add Address in Your Profile
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-xl border cursor-pointer text-xs space-y-1 transition ${
                      selectedAddressId === addr.id
                        ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/20"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase text-[10px] text-zinc-500">{addr.label}</span>
                      {selectedAddressId === addr.id && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <p className="font-bold text-zinc-900 dark:text-white">{addr.fullName}</p>
                    <p className="text-zinc-500">{addr.phone}</p>
                    <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {addr.addressLine}, {addr.city} {addr.postalCode}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Select Payment Method */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" /> 2. Select Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Stripe option */}
              <div
                onClick={() => setPaymentMethod("STRIPE")}
                className={`p-4 rounded-xl border cursor-pointer text-xs space-y-2 transition ${
                  paymentMethod === "STRIPE"
                    ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/20"
                    : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-white">Stripe</span>
                  {paymentMethod === "STRIPE" && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-zinc-500">Visa, Mastercard, Amex (Global)</p>
              </div>

              {/* SSLCommerz option */}
              <div
                onClick={() => setPaymentMethod("SSLCOMMERZ")}
                className={`p-4 rounded-xl border cursor-pointer text-xs space-y-2 transition ${
                  paymentMethod === "SSLCOMMERZ"
                    ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/20"
                    : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-pink-600 dark:text-pink-400">SSLCommerz</span>
                  {paymentMethod === "SSLCOMMERZ" && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-zinc-500">bKash, Nagad, Rocket, Local BD Cards</p>
              </div>

              {/* COD option */}
              <div
                onClick={() => setPaymentMethod("COD")}
                className={`p-4 rounded-xl border cursor-pointer text-xs space-y-2 transition ${
                  paymentMethod === "COD"
                    ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/20"
                    : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-600 dark:text-amber-400">Cash on Delivery</span>
                  {paymentMethod === "COD" && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-zinc-500">Pay cash upon delivery receipt</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">Order Summary</h3>

            <div className="space-y-2 text-xs divide-y divide-zinc-100 dark:divide-zinc-800">
              {items.map((i) => (
                <div key={i.variantId} className="flex justify-between py-2 text-zinc-600 dark:text-zinc-400">
                  <span className="line-clamp-1 flex-1 pr-2">{i.name} (x{i.quantity})</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{formatPrice(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              {discountParam > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-{formatPrice(discountParam)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Shipping</span>
                <span className="font-bold text-zinc-900 dark:text-white">{formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Tax (5%)</span>
                <span className="font-bold text-zinc-900 dark:text-white">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-zinc-900 dark:text-white pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <span>Grand Total</span>
                <span className="text-blue-600 dark:text-blue-400">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition"
            >
              {loading ? "Processing Order..." : `Confirm & Place Order (${formatPrice(total)})`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

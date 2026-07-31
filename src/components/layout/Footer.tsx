"use client";

import Link from "next/link";
import { Laptop, Mail, Phone, MapPin, ShieldCheck, Truck, RotateCcw, CreditCard } from "lucide-react";
import { useState } from "react";
import WidgetProducts from "../cards/WidgetProducts";
import LogoSlide from "../Home/LogoSlide/LogoSlide";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#181818] text-zinc-300 pt-16 pb-8 border-t border-zinc-800">
      {/* Logo slide */}
      <LogoSlide />
      {/* Top Level product */}
      <div>
        <WidgetProducts />
      </div>
      {/* Features Bar */}
      <div className="md:max-w-7xl  lg:max-w-[1420px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-zinc-800">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <div className="w-12 h-12 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Express Shipping</h4>
            <p className="text-xs text-zinc-400">Fast delivery across Bangladesh & globally</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <div className="w-12 h-12 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Official Warranty</h4>
            <p className="text-xs text-zinc-400">100% authentic products guaranteed</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <div className="w-12 h-12 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">7 Days Easy Return</h4>
            <p className="text-xs text-zinc-400">Hassle-free replacement policy</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <div className="w-12 h-12 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Multi Payment</h4>
            <p className="text-xs text-zinc-400">Stripe, bKash, Nagad, Cards & COD</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="md:max-w-7xl  lg:max-w-[1420px] mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              <Laptop className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">TechNova</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
            TechNova is your premier electronics e-commerce platform delivering high-performance laptops, smartphones, gaming gear, and smart gadgets with official warranty and instant local payments.
          </p>
          <div className="space-y-2 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>TechNova Tower, Level 8, Gulshan Avenue, Dhaka</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>+880 1700-000000 (24/7 Hotline)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>support@technova.com</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="text-sm font-bold text-white mb-4">Categories</h5>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li><Link href="/shop?category=laptops-computers" className="hover:text-white transition">Laptops & PC</Link></li>
            <li><Link href="/shop?category=smartphones-tablets" className="hover:text-white transition">Smartphones</Link></li>
            <li><Link href="/shop?category=audio-headphones" className="hover:text-white transition">Audio & Headphones</Link></li>
            <li><Link href="/shop?category=wearables-watches" className="hover:text-white transition">Smartwatches</Link></li>
            <li><Link href="/shop?category=gaming-consoles" className="hover:text-white transition">Gaming Gear</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-bold text-white mb-4">Customer Care</h5>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li><Link href="/profile" className="hover:text-white transition">Order History & Tracking</Link></li>
            <li><Link href="/wishlist" className="hover:text-white transition">Saved Wishlist</Link></li>
            <li><Link href="/compare" className="hover:text-white transition">Product Comparison</Link></li>
            <li><Link href="/about" className="hover:text-white transition">Warranty & Returns</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact Support</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h5 className="text-sm font-bold text-white mb-4">Stay Connected</h5>
          <p className="text-xs text-zinc-400 mb-3">
            Subscribe for flash deal alerts, back-in-stock updates, and exclusive discount coupons.
          </p>
          <form onSubmit={handleNewsletter} className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Subscribe
            </button>
          </form>
          {subscribed && (
            <p className="text-[11px] text-emerald-400 mt-2">✓ Thank you for subscribing!</p>
          )}
        </div>
      </div>

      {/* Bottom Copyright & Payment Gateways */}
      <div className="md:max-w-7xl  lg:max-w-[1420px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} TechNova Inc. All rights reserved.</p>
        <div className="flex items-center gap-3 font-semibold text-zinc-400">
          <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded">Stripe</span>
          <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-pink-400">SSLCommerz (bKash/Nagad)</span>
          <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-amber-400">Cash on Delivery</span>
        </div>
      </div>
    </footer>
  );
}

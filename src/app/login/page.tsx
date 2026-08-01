"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Laptop, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    // মূল ব্যাকগ্রাউন্ড bg-[#212121]
    <div className="min-h-screen bg-[#212121] flex items-center justify-center p-4 sm:p-6 lg:p-8">

      {/* রেজিস্টার পেজের সাথে মিল রেখে রেসপন্সিভ গ্রিড কন্টেইনার */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-[#181818] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">

        {/* বাম পাশ: Unsplash ইমেজ সেকশন */}
        <div className="relative hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&auto=format&fit=crop"
            alt="Tech setup visual"
            fill
            priority
            className="object-cover"
            sizes="50vw"
          />
          {/* গ্র্যাডিয়েন্ট ওভারলে এবং ব্র্যান্ডিং */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent p-10 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                <Laptop className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-wider">TechNova</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-extrabold text-white leading-tight">
                Welcome Back to Your Tech Hub.
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm">
                Sign in to seamlessly manage your orders, access your wishlist, and enjoy express checkout.
              </p>
            </div>
          </div>
        </div>

        {/* ডান পাশ: লগইন ফর্ম সেকশন */}
        <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6">

          <div className="space-y-2">
            {/* মোবাইল ভিউ লোগো */}
            <div className="lg:hidden inline-flex w-10 h-10 rounded-xl bg-blue-600 items-center justify-center text-white font-bold mb-2 shadow-lg shadow-blue-500/30">
              <Laptop className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sign In to Account
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Enter your credentials to access your account.
            </p>
          </div>

          {/* ডেমো লগইন কুইক ফিল বাটন */}
          <div className="p-3.5 rounded-xl bg-[#212121] border border-zinc-800 space-y-2.5">
            <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
              🚀 Quick Demo Logins:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoFill("admin@technova.com", "admin123")}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-xl font-medium transition active:scale-[0.98]"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Demo Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill("user@technova.com", "user123")}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl font-medium transition active:scale-[0.98]"
              >
                <UserCheck className="w-3.5 h-3.5" /> Demo Customer
              </button>
            </div>
          </div>

          {/* এরর মেসেজ */}
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 text-xs rounded-xl bg-red-950/40 border border-red-800/80 text-red-400 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ইনপুট ফর্ম */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-zinc-800 bg-[#212121] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Password
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-zinc-800 bg-[#212121] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              {loading ? "Signing in..." : "Sign In to Account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* রেজিস্টার লিংক */}
          <div className="text-center pt-4 border-t border-zinc-800/80 text-xs text-zinc-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-400 font-bold hover:underline ml-1">
              Register here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
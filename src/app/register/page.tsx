"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Laptop, Lock, Mail, User, AlertCircle, ArrowRight, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Failed to create account");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError("An unexpected error occurred.");
    }
  };

  return (
    // মূল ব্যাকগ্রাউন্ড color: #212121
    <div className="min-h-screen bg-[#212121] flex items-center justify-center p-4 sm:p-6 lg:p-8">

      {/* রেসপন্সিভ গ্রিড কন্টেইনার (মোবাইলে ১ কলাম, ল্যাপটপ/ডেস্কটপে ২ কলাম) */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-[#181818] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">

        {/* বাম পাশ: Unsplash ইমেজ সেকশন (lg স্ক্রিনের নিচে লুকিয়ে যাবে) */}
        <div className="relative hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1569183091671-696402586b9c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGklMjBwaG9uZSUyMDE4fGVufDB8fDB8fHww"
            alt="Cyberpunk tech visual"
            fill
            priority
            className="object-cover"
            sizes="50vw"
          />
          {/* ইমেজের ওপর গ্র্যাডিয়েন্ট ওভারলে */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent p-10 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                <Laptop className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-wider">TechNova</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-extrabold text-white leading-tight">
                Empowering Your Digital World.
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm">
                Join our platform to access cutting-edge electronics, exclusive pricing, and express delivery.
              </p>
            </div>
          </div>
        </div>

        {/* ডান পাশ: ফর্ম সেকশন */}
        <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6">

          <div className="space-y-2">
            {/* মোবাইল ভিউ লোগো */}
            <div className="lg:hidden inline-flex w-10 h-10 rounded-xl bg-blue-600 items-center justify-center text-white font-bold mb-2 shadow-lg shadow-blue-500/30">
              <Laptop className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Create Account
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Enter your details to register a new account.
            </p>
          </div>

          {/* স্ট্যাটাস মেসেজ */}
          {success && (
            <div className="flex items-center gap-2.5 p-3.5 text-xs rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-400 font-medium">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Account created successfully! Redirecting to login...</span>
            </div>
          )}

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
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-zinc-800 bg-[#212121] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              </div>
            </div>

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
                  type="password"
                  required
                  minLength={6}
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
              disabled={loading || success}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              {loading ? "Creating Account..." : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* লগইন লিংক */}
          <div className="text-center pt-4 border-t border-zinc-800/80 text-xs text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 font-bold hover:underline ml-1">
              Sign in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
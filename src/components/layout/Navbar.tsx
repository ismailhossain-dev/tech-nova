"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Moon,
  Sun,
  Laptop,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useCartStore } from "@/store/useCartStore";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Fix Hydration Issue by delaying cart count display until client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartItemsCount = useCartStore((state) => state.getTotalItems());

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop Catalog" },
    { href: "/categories", label: "Categories" },
    { href: "/brands", label: "Brands" },
    { href: "/compare", label: "Compare" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#081621] text-white bg-[#081621] backdrop-blur-xl transition-all">
      {/* Top Announcement Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white text-xs py-1.5 px-4 text-center font-medium shadow-inner">
        ⚡ Summer Sale! Use code{" "}
        <span className="font-bold underline tracking-wide">TECHNOVA10</span> for 10% OFF on all laptops & smartphones!
      </div>
      {/* height width set navbar  */}
      <div className="md:md:max-w-7xl  lg:max-w-[1420px] lg:max-w-[1420] text-white mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 group-hover:shadow-blue-500/30 transition-all duration-300">
              <Laptop className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white ">
                TechNova
              </span>
              <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-semibold tracking-widest uppercase -mt-1">
                Electronics Platform
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative group"
          >
            <input
              type="text"
              placeholder="Search laptops, smartphones, headphones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2 text-sm rounded-full border   text-zinc-100  focus:outline-none ring-blue-500/50 border-blue-500 dark:focus:ring-blue-400/50 transition-all"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full shadow-sm transition-all"
            >
              Search
            </button>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${isActive
                    ? "text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-white"
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            {/* <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl text-white hover:bg-indigo-500 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button> */}

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="p-2.5 rounded-xl text-white hover:bg-indigo-500  transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart Link with Badge (Fixed Hydration Issue) */}
            <Link
              href="/cart"
              className="p-2.5 rounded-xl text-white hover:bg-indigo-500  transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {isMounted && cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-zinc-950 animate-in zoom-in-50">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Auth Actions & profile */}
            {session?.user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1.5 rounded-xl  transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {session.user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold max-w-[90px] truncate">
                    {session.user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {/* Account Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/80 dark:border-zinc-800/80 py-2 hidden group-hover:block transition-all z-50">
                  <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                      {session.user.name}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                      {session.user.email}
                    </p>
                    {session.user.role && (
                      <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-md border border-blue-200/50 dark:border-blue-800/50 uppercase">
                        {session.user.role}
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <User className="w-4 h-4 text-zinc-400" /> My Profile & Orders
                    </Link>

                    {session.user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-indigo-500" /> Admin Dashboard
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-zinc-700 bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 py-4 space-y-4 animate-in fade-in slide-in-from-top-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/70"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            </form>

            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-3 py-2 text-sm font-medium rounded-xl transition-colors ${isActive
                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
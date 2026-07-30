"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { wishlistVariantIds, toggleWishlist } = useCartStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" /> Saved Wishlist
        </h1>
        <p className="text-xs text-zinc-500">Your favorite tech products saved for quick access</p>
      </div>

      {wishlistVariantIds.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <Heart className="w-12 h-12 text-zinc-400 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Your wishlist is empty</h3>
          <p className="text-xs text-zinc-500">Save products while browsing to keep track of items you love.</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800">
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            You have <span className="font-bold text-blue-600">{wishlistVariantIds.length}</span> saved item(s) in your wishlist.
          </p>
        </div>
      )}
    </div>
  );
}

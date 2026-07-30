import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { SlidersHorizontal, Check, X, ShieldCheck } from "lucide-react";

export default async function ComparePage({ searchParams }: { searchParams: { ids?: string } }) {
  const { ids } = await searchParams;
  const productIds = ids ? ids.split(",") : [];

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds.length > 0 ? productIds : undefined },
      status: "PUBLISHED",
    },
    include: {
      category: true,
      brand: true,
      variants: true,
    },
    take: 4,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 items-center justify-center font-bold mb-2">
          <SlidersHorizontal className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Side-by-Side Product Spec Matrix
        </h1>
        <p className="text-xs text-zinc-500">
          Compare specifications, prices, ratings, and warranty details for up to 4 flagship electronics items
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4">
          <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">No products selected for comparison.</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-blue-700 transition"
          >
            Browse Shop Catalog
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4 w-48 font-bold text-zinc-400">Product</th>
                {products.map((p) => {
                  const images = JSON.parse(p.images || "[]");
                  return (
                    <th key={p.id} className="p-4 min-w-[200px] text-center">
                      <div className="relative aspect-square w-28 h-28 mx-auto rounded-2xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden mb-2">
                        <Image src={images[0]} alt={p.name} fill className="object-cover" />
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                        {p.brand.name}
                      </span>
                      <h4 className="font-extrabold text-zinc-900 dark:text-white mt-1 line-clamp-2">
                        {p.name}
                      </h4>
                      <p className="text-sm font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                        {formatPrice(p.basePrice)}
                      </p>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              <tr>
                <td className="p-4 font-bold text-zinc-500">Category</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center font-semibold">{p.category.name}</td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-zinc-500">Average Rating</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center font-bold text-amber-500">
                    ★ {p.avgRating.toFixed(1)} ({p.reviewCount})
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-zinc-500">Warranty</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center font-semibold text-emerald-500">
                    {p.warrantyMonths} Months
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-zinc-500">Variants Count</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center font-semibold">
                    {p.variants.length} SKU option(s)
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-zinc-500">Action</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center">
                    <Link
                      href={`/product/${p.slug}`}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
                    >
                      View Details
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

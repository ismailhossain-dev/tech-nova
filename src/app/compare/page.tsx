import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { SlidersHorizontal, ArrowRight, ExternalLink } from "lucide-react";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const ids = resolvedSearchParams?.ids;
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

  // Safe JSON Parsing Helper to fix TypeScript/Linter Warnings
  const parseImages = (imagesData: unknown): string[] => {
    if (Array.isArray(imagesData)) return imagesData;
    if (typeof imagesData === "string") {
      try {
        const parsed = JSON.parse(imagesData);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  return (
    <div className="min-h-screen md:max-w-7xl lg:max-w-[1420px] mx-auto bg-[#181818] text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 items-center justify-center font-bold shadow-lg shadow-amber-400/5">
          <SlidersHorizontal className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Side-by-Side Product Spec Matrix
        </h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Compare specifications, prices, ratings, and warranty details for up to 4 flagship electronics items
        </p>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="max-w-xl mx-auto text-center py-16 bg-zinc-900/90 rounded-3xl border border-zinc-800/80 space-y-4 backdrop-blur-md shadow-2xl">
          <p className="text-sm font-bold text-zinc-300">No products selected for comparison.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-amber-400/10 transition cursor-pointer"
          >
            Browse Shop Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Comparison Table Container */
        <div className="overflow-x-auto bg-zinc-900/90 rounded-3xl border border-zinc-800/80 shadow-2xl p-6 backdrop-blur-md scrollbar-thin scrollbar-thumb-zinc-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800/80">
                <th className="p-4 w-48 font-black text-zinc-400 uppercase tracking-wider text-[11px]">
                  Product
                </th>
                {products.map((p) => {
                  const images = parseImages(p.images);
                  return (
                    <th key={p.id} className="p-4 min-w-[220px] text-center align-top">
                      <div className="relative aspect-square w-28 h-28 mx-auto rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden mb-3 shadow-md">
                        <Image
                          src={images[0] || "/placeholder.png"}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                        {p.brand.name}
                      </span>
                      <h4 className="font-extrabold text-white mt-2 line-clamp-2 leading-snug">
                        {p.name}
                      </h4>
                      <p className="text-base font-black text-amber-400 mt-1">
                        {formatPrice(p.basePrice)}
                      </p>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/60">
              {/* Category */}
              <tr className="hover:bg-zinc-950/40 transition-colors">
                <td className="p-4 font-bold text-zinc-400">Category</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center font-semibold text-zinc-200">
                    {p.category.name}
                  </td>
                ))}
              </tr>

              {/* Average Rating */}
              <tr className="hover:bg-zinc-950/40 transition-colors">
                <td className="p-4 font-bold text-zinc-400">Average Rating</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                      ★ {p.avgRating.toFixed(1)} <span className="text-zinc-400 font-normal">({p.reviewCount})</span>
                    </span>
                  </td>
                ))}
              </tr>

              {/* Warranty */}
              <tr className="hover:bg-zinc-950/40 transition-colors">
                <td className="p-4 font-bold text-zinc-400">Warranty</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center font-bold text-emerald-400">
                    {p.warrantyMonths} Months
                  </td>
                ))}
              </tr>

              {/* Variants Count */}
              <tr className="hover:bg-zinc-950/40 transition-colors">
                <td className="p-4 font-bold text-zinc-400">Variants Count</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center font-semibold text-zinc-300">
                    {p.variants.length} SKU option(s)
                  </td>
                ))}
              </tr>

              {/* Action */}
              <tr className="hover:bg-zinc-950/40 transition-colors">
                <td className="p-4 font-bold text-zinc-400">Action</td>
                {products.map((p) => (
                  <td key={p.id} className="p-4 text-center">
                    <Link
                      href={`/product/${p.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-black rounded-xl transition shadow-md shadow-amber-400/10 cursor-pointer"
                    >
                      View Details <ExternalLink className="w-3.5 h-3.5" />
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